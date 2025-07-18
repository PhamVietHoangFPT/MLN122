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
import { ApiResponseDto } from 'src/common/dto/apiResponse.dto'
@ApiTags('exams')
@Controller('exams')
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
    type: [ApiResponseDto<ExamResponseDto>],
  })
  async findAll(
    @Query() queryDto: FindExamsQueryDto,
  ): Promise<ApiResponseDto<ExamResponseDto>> {
    const data = await this.examService.findAll(queryDto)
    return {
      data,
      success: true,
      message: 'Danh sách đề thi',
      statusCode: 200,
    }
  }

  @Get('student/:id')
  @ApiOperation({ summary: 'Lấy thông tin đề thi cho sinh viên theo ID' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Thông tin đề thi cho sinh viên',
    type: ApiResponseDto<ExamForStudentDto>,
  })
  async findByIdForStudent(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<ExamForStudentDto | null>> {
    const data = await this.examService.findByIdForStudent(id)
    return {
      data: [data],
      success: true,
      message: 'Thông tin đề thi cho sinh viên',
      statusCode: 200,
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin đề thi theo ID' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Thông tin đề thi',
    type: ApiResponseDto<ExamResponseDto>,
  })
  async findById(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<ExamResponseDto>> {
    const data = await this.examService.findById(id)
    return {
      data: [data],
      success: true,
      message: 'Thông tin đề thi',
      statusCode: 200,
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
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
  ): Promise<ApiResponseDto<boolean>> {
    const userId = req.user._id
    const success = await this.examService.create(createExamDto, userId)
    return {
      data: [success],
      success,
      message: success ? 'Tạo đề thi thành công' : 'Tạo đề thi thất bại',
      statusCode: success ? 201 : 400,
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật đề thi theo ID' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: UpdateExamDto })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật đề thi thành công',
    type: ApiResponseDto<ExamResponseDto>,
  })
  @Roles(RoleEnum.ADMIN)
  async updateExam(
    @Param('id') id: string,
    @Body() updateExamDto: UpdateExamDto,
    @Req() req: any,
  ): Promise<ApiResponseDto<ExamResponseDto> | null> {
    const userId = req.user._id
    const updatedExam = await this.examService.update(id, updateExamDto, userId)
    return {
      data: [updatedExam],
      success: true,
      message: 'Cập nhật đề thi thành công',
      statusCode: 200,
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa đề thi theo ID' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Xóa đề thi thành công',
    type: ApiResponseDto<ExamResponseDto>,
  })
  @Roles(RoleEnum.ADMIN)
  async deleteExam(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<ApiResponseDto<ExamResponseDto> | null> {
    const userId = req.user._id
    const deletedExam = await this.examService.delete(id, userId)
    return {
      data: [deletedExam],
      success: true,
      message: 'Xóa đề thi thành công',
      statusCode: 200,
    }
  }
}
