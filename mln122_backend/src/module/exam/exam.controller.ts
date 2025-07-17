import {
  Get,
  Put,
  Post,
  Delete,
  Controller,
  Body,
  Param,
  UseGuards,
  Inject,
  Query,
  Req,
} from '@nestjs/common'
import { IExamService } from './interfaces/iexam.service'
import { CreateExamDto } from './dto/createExam.dto'
import { UpdateExamDto } from './dto/updateExam.dto'
import { ExamResponseDto } from './dto/examResponse.dto'
import { ExamForStudentDto } from './dto/examForStudent.dto'
import { FindExamsQueryDto } from './dto/findExamQuery.dto'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/guard/auth.guard'
import { Roles } from 'src/common/decorators/roles.decorator'
import { RoleEnum } from 'src/common/enums/role.enum'
import { RolesGuard } from 'src/common/guard/roles.guard'

@ApiTags('Exam')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('exam')
export class ExamController {
  constructor(
    @Inject(IExamService)
    private readonly examService: IExamService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách đề thi' })
  @ApiQuery({ name: 'subjectId', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Danh sách đề thi',
    type: [ExamResponseDto],
  })
  async findAll(
    @Query() queryDto: FindExamsQueryDto,
  ): Promise<ExamResponseDto[]> {
    return this.examService.findAll(queryDto)
  }

  @Get('student/:id')
  @ApiOperation({ summary: 'Lấy thông tin đề thi cho sinh viên theo ID' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Thông tin đề thi cho sinh viên',
    type: ExamForStudentDto,
  })
  async findByIdForStudent(
    @Param('id') id: string,
  ): Promise<ExamForStudentDto | null> {
    return this.examService.findByIdForStudent(id)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin đề thi theo ID' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Thông tin đề thi',
    type: ExamResponseDto,
  })
  async findById(@Param('id') id: string): Promise<ExamResponseDto> {
    return this.examService.findById(id)
  }

  @Post()
  @ApiOperation({ summary: 'Tạo đề thi mới' })
  @ApiBody({ type: CreateExamDto })
  @ApiResponse({
    status: 201,
    description: 'Tạo đề thi thành công',
    type: ExamResponseDto,
  })
  @Roles(RoleEnum.ADMIN)
  async createExam(
    @Body() createExamDto: CreateExamDto,
    @Req() req: any,
  ): Promise<ExamResponseDto> {
    const userId = req.user._id
    return this.examService.create(createExamDto, userId)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật đề thi theo ID' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: UpdateExamDto })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật đề thi thành công',
    type: ExamResponseDto,
  })
  @Roles(RoleEnum.ADMIN)
  async updateExam(
    @Param('id') id: string,
    @Body() updateExamDto: UpdateExamDto,
    @Req() req: any,
  ): Promise<ExamResponseDto | null> {
    const userId = req.user._id
    return this.examService.update(id, updateExamDto, userId)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa đề thi theo ID' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Xóa đề thi thành công',
    type: ExamResponseDto,
  })
  @Roles(RoleEnum.ADMIN)
  async deleteExam(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<ExamResponseDto | null> {
    const userId = req.user._id
    return this.examService.delete(id, userId)
  }
}
