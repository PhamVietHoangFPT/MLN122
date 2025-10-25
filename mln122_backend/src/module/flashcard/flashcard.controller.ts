import {
  Get,
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

import { IFlashcardService } from './interfaces/iflashcard.service'
import {
  CreateFlashcardDto,
  FindFlashcardsQueryDto,
  FlashcardResponseDto,
  MinimalFlashcardResponseDto,
} from './dto/flashcard.dto'

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

@ApiTags('flashcards')
@Controller('flashcards')
export class FlashcardController {
  constructor(
    @Inject(IFlashcardService)
    private readonly flashcardService: IFlashcardService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách flashcard' })
  @ApiQuery({ name: 'subjectId', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Danh sách flashcard',
    type: [ApiResponseDto<MinimalFlashcardResponseDto>],
  })
  async findAll(
    @Query() queryDto: FindFlashcardsQueryDto,
  ): Promise<ApiResponseDto<MinimalFlashcardResponseDto>> {
    const data = await this.flashcardService.findFlashcardByQuery(queryDto)
    return {
      data: data,
      success: true,
      message: 'Danh sách flashcard',
      statusCode: 200,
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy flashcard theo ID' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Flashcard theo ID',
    type: ApiResponseDto<FlashcardResponseDto>,
  })
  async findById(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<FlashcardResponseDto | null>> {
    const data = await this.flashcardService.findById(id)
    return {
      data: [data],
      success: true,
      message: 'Flashcard theo ID',
      statusCode: 200,
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo flashcard mới' })
  @ApiBody({ type: CreateFlashcardDto })
  @ApiResponse({
    status: 201,
    description: 'Tạo flashcard thành công',
    type: ApiResponseDto<boolean>,
  })
  async create(
    @Body() createFlashcardDto: CreateFlashcardDto,
    @Req() req: any,
  ): Promise<ApiResponseDto<boolean>> {
    const userId = req.user._id
    const data = await this.flashcardService.create(createFlashcardDto, userId)
    return {
      data: [data],
      success: data,
      message: 'Tạo flashcard thành công',
      statusCode: 201,
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xoá flashcard theo ID' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Xoá flashcard thành công',
    type: ApiResponseDto<FlashcardResponseDto>,
  })
  async delete(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<ApiResponseDto<boolean>> {
    const userId = req.user._id
    const data = await this.flashcardService.delete(id, userId)
    return {
      data: [data],
      success: data ? true : false,
      message: data ? 'Xoá flashcard thành công' : 'Xoá flashcard thất bại',
      statusCode: 200,
    }
  }
}
