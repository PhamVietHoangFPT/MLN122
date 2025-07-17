import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  Inject,
  UseGuards,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger'
import { ISubmissionService } from './interfaces/isubmission.service'
import { JwtAuthGuard } from 'src/common/guard/auth.guard'
import { RolesGuard } from 'src/common/guard/roles.guard'
import { Roles } from 'src/common/decorators/roles.decorator'
import { RoleEnum } from 'src/common/enums/role.enum'
import { ApiResponseDto } from 'src/common/dto/apiResponse.dto'
import { SubmissionResponseDto } from './dto/submissionResponse.dto'
import { SubmitExamDto } from './dto/submitExam.dto' // Điều chỉnh đường dẫn nếu cần
import { ExamForStudentDto } from '../exam/dto/examForStudent.dto' // Điều chỉnh đường dẫn nếu cần

// DTO này nên được đặt trong một file riêng (ví dụ: ./dto/start-exam.response.dto.ts)
// để tuân thủ cấu trúc, nhưng để ở đây cho tiện theo dõi.
class StartExamResponseDto {
  @ApiProperty({ example: '6698b6a3e4b5c6d7e8f9a0b1' })
  submissionId: string

  @ApiProperty({ type: ExamForStudentDto })
  exam: ExamForStudentDto
}

@ApiTags('submissions')
@Controller() // Để trống để có thể định nghĩa các route với tiền tố khác nhau
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SubmissionController {
  constructor(
    @Inject(ISubmissionService)
    private readonly submissionService: ISubmissionService,
  ) {}

  @Post('exams/:examId/start')
  //  @Roles(RoleEnum.STUDENT)
  @ApiOperation({ summary: 'Bắt đầu một lượt làm bài thi' })
  @ApiResponse({
    status: 201,
    description: 'Bắt đầu thành công, trả về submissionId và đề thi',
    type: ApiResponseDto<StartExamResponseDto>,
  })
  async startExam(
    @Param('examId') examId: string,
    @Req() req: any,
  ): Promise<ApiResponseDto<StartExamResponseDto>> {
    const userId = req.user._id
    const data = await this.submissionService.startExam(examId, userId)
    return {
      data: [data],
      message: 'Bắt đầu làm bài thành công',
      statusCode: 201,
      success: true,
    }
  }

  @Post('submissions/:submissionId/submit')
  //  @Roles(RoleEnum.STUDENT)
  @ApiOperation({ summary: 'Nộp bài và chấm điểm' })
  @ApiBody({ type: SubmitExamDto })
  @ApiResponse({
    status: 200,
    description: 'Nộp bài thành công, trả về kết quả chi tiết',
    type: ApiResponseDto<SubmissionResponseDto>,
  })
  async submitExam(
    @Param('submissionId') submissionId: string,
    @Body() submissionDto: SubmitExamDto,
    @Req() req: any,
  ): Promise<ApiResponseDto<SubmissionResponseDto>> {
    const userId = req.user._id
    const data = await this.submissionService.submitExam(
      submissionId,
      userId,
      submissionDto,
    )
    return {
      data: [data],
      message: 'Nộp bài thành công',
      statusCode: 200,
      success: true,
    }
  }

  @Post('submissions/:submissionId/cancel')
  //  @Roles(RoleEnum.STUDENT)
  @ApiOperation({ summary: 'Hủy một lượt làm bài đang diễn ra' })
  @ApiResponse({
    status: 200,
    description: 'Hủy bài thành công',
    type: ApiResponseDto<{ message: string }>,
  })
  async cancelSubmission(
    @Param('submissionId') submissionId: string,
    @Req() req: any,
  ): Promise<ApiResponseDto<{ message: string }>> {
    const userId = req.user._id
    const data = await this.submissionService.cancelSubmission(
      submissionId,
      userId,
    )
    return {
      data: [data],
      message: data.message,
      statusCode: 200,
      success: true,
    }
  }

  @Get('submissions')
  //  @Roles(RoleEnum.STUDENT)
  @ApiOperation({ summary: 'Lấy lịch sử các bài đã làm của bản thân' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách các lượt làm bài',
    type: ApiResponseDto<SubmissionResponseDto>,
  })
  async getAllSubmissions(
    @Req() req: any,
  ): Promise<ApiResponseDto<SubmissionResponseDto>> {
    const userId = req.user._id
    const data = await this.submissionService.getAllSubmissions(userId)
    return {
      data: data,
      message: 'Lấy lịch sử làm bài thành công',
      statusCode: 200,
      success: true,
    }
  }

  @Get('submissions/:submissionId')
  //  @Roles(RoleEnum.STUDENT)
  @ApiOperation({ summary: 'Lấy kết quả của một lượt làm bài cụ thể' })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết kết quả làm bài',
    type: ApiResponseDto<SubmissionResponseDto>,
  })
  async getSubmissionResult(
    @Param('submissionId') submissionId: string,
    @Req() req: any,
  ): Promise<ApiResponseDto<SubmissionResponseDto>> {
    const userId = req.user._id
    const data = await this.submissionService.getSubmissionResult(
      submissionId,
      userId,
    )
    return {
      data: [data],
      message: 'Lấy kết quả thành công',
      statusCode: 200,
      success: true,
    }
  }
}
