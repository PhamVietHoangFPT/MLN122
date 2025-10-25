import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { IFlashcardService } from './interfaces/iflashcard.service'
import { IFlashcardRepository } from './interfaces/iflashcard.repository'
import {
  CreateFlashcardDto,
  FindFlashcardsQueryDto,
  FlashcardResponseDto,
  MinimalFlashcardResponseDto,
} from './dto/flashcard.dto'
import { FlashcardDocument } from './schemas/flashcard.schema'
import { FilterQuery } from 'mongoose'
import { ISubjectRepository } from '../subject/interfaces/isubject.repository'

@Injectable()
export class FlashcardService implements IFlashcardService {
  constructor(
    @Inject(IFlashcardRepository)
    private readonly flashcardRepository: IFlashcardRepository,
    @Inject(ISubjectRepository)
    private readonly subjectRepository: ISubjectRepository,
  ) {}
  async findFlashcardByQuery(
    queryDto: FindFlashcardsQueryDto,
  ): Promise<MinimalFlashcardResponseDto[]> {
    const subject = await this.subjectRepository.getSubjectById(
      queryDto.subjectId,
    )
    if (!subject) {
      throw new NotFoundException('Môn học không tồn tại')
    }
    const flashcards = await this.flashcardRepository.findFlashcardsBySubjectId(
      queryDto.subjectId,
    )
    if (!flashcards || flashcards.length === 0) {
      throw new NotFoundException('Không tìm thấy flashcard nào')
    }
    return flashcards.map(
      (flashcard) => new MinimalFlashcardResponseDto(flashcard),
    )
  }

  async create(
    createFlashcardDto: CreateFlashcardDto,
    userId: string,
  ): Promise<boolean> {
    const data = await this.flashcardRepository.create(
      createFlashcardDto,
      userId,
    )
    if (!data) {
      throw new NotFoundException('Không thể tạo flashcard')
    }
    return Promise.resolve(true)
  }

  async findAll(
    query: FilterQuery<FlashcardDocument>,
  ): Promise<FlashcardResponseDto[]> {
    const flashcards = await this.flashcardRepository.findAll(query)
    if (!flashcards) {
      throw new NotFoundException('Không tìm thấy flashcard nào')
    }
    return flashcards.map((flashcard) => new FlashcardResponseDto(flashcard))
  }

  async findById(id: string): Promise<FlashcardResponseDto | null> {
    const flashcard = await this.flashcardRepository.findById(id)
    if (!flashcard) {
      throw new NotFoundException('Không tìm thấy flashcard')
    }
    return new FlashcardResponseDto(flashcard)
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const data = await this.flashcardRepository.delete(id, userId)
    if (!data) {
      throw new NotFoundException('Xoá flashcard không thành công')
    }
    return data
  }
}
