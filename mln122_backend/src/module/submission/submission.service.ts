/* eslint-disable @typescript-eslint/no-base-to-string */
import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { ISubmissionService } from './interfaces/isubmission.service'
import { ISubmissionRepository } from './interfaces/isubmission.repository'
import { IExamRepository } from '../exam/interfaces/iexam.repository' // Giả định đường dẫn
import { SubmitExamDto } from './dto/submitExam.dto'
import { ExamForStudentDto } from '../exam/dto/examForStudent.dto'
import { SubmissionResponseDto } from './dto/submissionResponse.dto'
import mongoose, { Model } from 'mongoose'
import { Submission, SubmissionDocument } from './schemas/submission.schema'
import { PaginatedResponseDto } from 'src/common/dto/paginatedResponse.dto'
import { Cron } from '@nestjs/schedule'
import { InjectModel } from '@nestjs/mongoose'

// DTO trả về khi người dùng bắt đầu làm bài.
class StartExamResponseDto {
  submissionId: string
  exam: ExamForStudentDto
}

const GRACE_PERIOD_IN_MS = 5 * 1000 // 5 giây thời gian đệm

@Injectable()
export class SubmissionService implements ISubmissionService {
  private readonly logger = new Logger(SubmissionService.name)

  constructor(
    @InjectModel(Submission.name)
    private readonly submissionModel: Model<SubmissionDocument>,
    @Inject(ISubmissionRepository)
    private readonly submissionRepository: ISubmissionRepository,
    @Inject(IExamRepository)
    private readonly examRepository: IExamRepository,
  ) {}

  @Cron('0 */15 * * * *')
  async handleOverdueSubmissions() {
    this.logger.log('Bắt đầu quét các bài thi quá hạn...')

    const inProgressSubmissions = await this.submissionModel.find({
      status: 'in-progress',
    })

    if (inProgressSubmissions.length === 0) {
      this.logger.log('Không tìm thấy bài thi nào đang thực hiện để quét.')
      return
    }

    let cancelledCount = 0
    for (const submission of inProgressSubmissions) {
      try {
        // Populate exam để lấy duration
        const populatedSubmission = await submission.populate('exam')
        const exam = populatedSubmission.exam as any // Ép kiểu để truy cập duration

        if (!exam || typeof exam.duration !== 'number') {
          this.logger.warn(
            `Bỏ qua submission ${submission._id} do không có thông tin exam hoặc duration.`,
          )
          continue
        }

        const durationInMs = exam.duration * 60 * 1000
        const timeElapsed = Date.now() - submission.startedAt.getTime()

        if (timeElapsed > durationInMs) {
          this.logger.log(
            `Phát hiện bài thi quá hạn: ${submission._id}. Đang hủy...`,
          )
          // SỬA LỖI: Đổi 'cancelled' thành 'canceled' để khớp với schema
          submission.status = 'canceled'
          submission.finishedAt = new Date()
          submission.score = 0
          await submission.save()
          cancelledCount++
        }
      } catch (error) {
        this.logger.error(
          `Lỗi khi xử lý submission ${submission._id}:`,
          error.stack,
        )
      }
    }

    this.logger.log(`Hoàn tất quét. Đã hủy ${cancelledCount} bài thi quá hạn.`)
  }

  async startExam(
    examId: string,
    userId: string,
  ): Promise<StartExamResponseDto> {
    const exam = await this.examRepository.findById(examId)
    if (!exam) {
      throw new NotFoundException('Không tìm thấy bài thi.')
    }

    const initialData = {
      user: userId,
      exam: examId,
      startedAt: new Date(),
      status: 'in-progress' as const,
    }

    const newSubmission = await this.submissionRepository.create(initialData)

    return {
      submissionId: newSubmission._id.toString(),
      exam: new ExamForStudentDto(exam),
    }
  }

  async submitExam(
    submissionId: string,
    userId: string,
    submissionDto: SubmitExamDto,
  ): Promise<SubmissionResponseDto> {
    const submission = await this.submissionRepository.findById(submissionId)

    if (!submission) {
      throw new NotFoundException('Không tìm thấy lượt làm bài này.')
    }
    if (submission.user.toString() !== userId) {
      throw new ForbiddenException(
        'Bạn không có quyền nộp bài cho lượt thi này.',
      )
    }
    if (submission.status !== 'in-progress') {
      throw new BadRequestException('Bài thi đã được nộp hoặc đã bị hủy.')
    }

    const examId =
      await this.submissionRepository.getExamIdBySubmissionId(submissionId)

    const exam = await this.examRepository.findById(examId)
    if (!exam) {
      throw new NotFoundException('Không tìm thấy dữ liệu gốc của bài thi.')
    }

    const timeElapsed = Date.now() - submission.startedAt.getTime()
    const durationInMs = exam.duration * 60 * 1000

    if (timeElapsed > durationInMs + GRACE_PERIOD_IN_MS) {
      // Cập nhật trạng thái thành 'abandoned' (bị bỏ dở do hết giờ)
      submission.status = 'abandoned'
      submission.finishedAt = new Date()
      await submission.save()
      throw new BadRequestException('Đã hết thời gian làm bài.')
    }

    // Chấm điểm
    let correctCount = 0
    const userAnswersHistory = []
    const questionMap = new Map(exam.questions.map((q) => [q.questionNo, q]))

    for (const userAnswer of submissionDto.answers) {
      const originalQuestion = questionMap.get(userAnswer.questionNo)
      const isCorrect =
        originalQuestion?.correctAnswerCode === userAnswer.chosenAnswerCode

      if (isCorrect) {
        correctCount++
      }

      userAnswersHistory.push({
        questionNo: userAnswer.questionNo,
        chosenAnswerCode: userAnswer.chosenAnswerCode,
        isCorrect,
      })
    }

    const score =
      exam.questions.length > 0
        ? (correctCount / exam.questions.length) * 10
        : 0

    const finalData = {
      score: parseFloat(score.toFixed(2)),
      finishedAt: new Date(),
      answers: userAnswersHistory,
      status: 'completed' as const,
    }

    const updatedSubmission = await this.submissionRepository.update(
      submissionId,
      finalData,
    )

    // Cần populate lại sau khi update để DTO có đủ dữ liệu
    const populatedSubmission = await this.submissionRepository.findById(
      updatedSubmission._id.toString(),
    )

    return new SubmissionResponseDto(populatedSubmission)
  }

  async getSubmissionResult(
    submissionId: string,
    userId: string,
  ): Promise<SubmissionResponseDto | null> {
    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      throw new BadRequestException('ID không hợp lệ.')
    }
    const submission = await this.submissionRepository.findById(submissionId)
    if (!submission) {
      throw new NotFoundException('Không tìm thấy kết quả làm bài.')
    }
    if (submission.user.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem kết quả này.')
    }
    return new SubmissionResponseDto(submission)
  }

  async cancelSubmission(
    submissionId: string,
    userId: string,
  ): Promise<{ message: string }> {
    const submission = await this.submissionRepository.findById(submissionId)

    if (!submission) {
      throw new NotFoundException('Không tìm thấy lượt làm bài.')
    }
    if (submission.user.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền hủy lượt làm bài này.')
    }
    if (submission.status !== 'in-progress') {
      throw new BadRequestException('Không thể hủy một bài thi đã hoàn thành.')
    }

    const data = {
      status: 'canceled',
      finishedAt: new Date(),
      score: 0,
    }

    const updatedSubmission = await this.submissionRepository.cancelSubmission(
      submissionId,
      data,
    )

    if (!updatedSubmission) {
      throw new NotFoundException('Hủy bài thi không thành công.')
    }

    return { message: 'Đã hủy bài thi thành công.' }
  }

  async getAllSubmissions(
    userId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginatedResponseDto<SubmissionResponseDto>> {
    const skip = (pageNumber - 1) * pageSize
    const filter = {}
    const [submissions, totalItems] = await Promise.all([
      this.submissionRepository
        .findWithQuery(filter)
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 }),
      this.submissionRepository.countDocuments(filter),
    ])
    if (submissions.length === 0 || !submissions) {
      throw new ConflictException('Không tìm thấy lượt làm bài nào.')
    } else {
      try {
        const totalPages = Math.ceil(totalItems / pageSize)
        const data = submissions.map(
          (submission: SubmissionDocument) =>
            new SubmissionResponseDto(submission),
        )
        return {
          success: true,
          message: 'Danh sách lượt làm bài đã được lấy thành công.',
          statusCode: 200,
          data,
          pagination: {
            totalItems,
            totalPages,
            currentPage: pageNumber,
            pageSize,
          },
        }
      } catch (error) {
        throw new InternalServerErrorException(
          'Lỗi khi lấy danh sách kit shipment.',
        )
      }
    }
  }
}
