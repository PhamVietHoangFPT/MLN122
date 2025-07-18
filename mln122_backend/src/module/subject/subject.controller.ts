import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Controller,
  UseGuards,
  Inject,
  Req,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger'

import { ISubjectService } from './interfaces/isubject.service'
import { SubjectResponseDto } from './dto/subjectResponse.dto'
import { JwtAuthGuard } from 'src/common/guard/auth.guard'
import { Roles } from 'src/common/decorators/roles.decorator'
import { RoleEnum } from 'src/common/enums/role.enum'
import { CreateSubjectDto } from './dto/createSubject.dto'
import { ApiResponseDto } from 'src/common/dto/apiResponse.dto'
import { RolesGuard } from 'src/common/guard/roles.guard'

@ApiTags('subjects')
@Controller('subjects')
export class SubjectController {
  constructor(
    @Inject(ISubjectService)
    private readonly subjectService: ISubjectService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Tạo môn học mới' })
  @ApiBody({ type: CreateSubjectDto })
  @ApiResponse({
    status: 201,
    description: 'Tạo môn học thành công',
    type: ApiResponseDto<SubjectResponseDto>,
  })
  async createSubject(
    @Body() subject: CreateSubjectDto,
    @Req() req: any,
  ): Promise<ApiResponseDto<SubjectResponseDto>> {
    const userId = req.user._id
    const data = await this.subjectService.createSubject(subject, userId)
    return {
      data: [data],
      message: 'Tạo môn học thành công',
      statusCode: 201,
      success: true,
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả môn học' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách môn học',
    type: ApiResponseDto<SubjectResponseDto>,
  })
  async getAllSubjects(): Promise<ApiResponseDto<SubjectResponseDto>> {
    const data = await this.subjectService.getAllSubjects()
    return {
      data: data,
      message: 'Danh sách môn học',
      statusCode: 200,
      success: true,
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy môn học theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Tìm thấy môn học',
    type: ApiResponseDto<SubjectResponseDto>,
  })
  async getSubjectById(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<SubjectResponseDto>> {
    const data = await this.subjectService.getSubjectById(id)
    return {
      data: [data],
      message: 'Tìm thấy môn học',
      statusCode: 200,
      success: true,
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Cập nhật môn học theo ID' })
  @ApiBody({ type: CreateSubjectDto })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật môn học thành công',
    type: ApiResponseDto<SubjectResponseDto>,
  })
  async updateSubject(
    @Param('id') id: string,
    @Body() subject: CreateSubjectDto,
    @Req() req: any,
  ): Promise<ApiResponseDto<SubjectResponseDto>> {
    const userId = req.user._id
    const data = await this.subjectService.updateSubject(id, subject, userId)
    return {
      data: [data],
      message: 'Cập nhật môn học thành công',
      statusCode: 200,
      success: true,
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Xóa môn học theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Xóa môn học thành công',
    type: ApiResponseDto<boolean>,
  })
  async deleteSubject(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<ApiResponseDto<boolean>> {
    const userId = req.user._id
    const data = await this.subjectService.deleteSubject(id, userId)
    return {
      data: [data],
      message: 'Xóa môn học thành công',
      statusCode: 200,
      success: true,
    }
  }
}
