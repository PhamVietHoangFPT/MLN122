import {
  CreateFlashcardDto,
  FlashcardResponseDto,
  FindFlashcardsQueryDto,
  MinimalFlashcardResponseDto,
} from '../dto/flashcard.dto'
import { FlashcardDocument } from '../schemas/Flashcard.schema'
import { FilterQuery } from 'mongoose'

export interface IFlashcardService {
  create(
    createFlashcardDto: CreateFlashcardDto,
    userId: string,
  ): Promise<boolean>

  findFlashcardByQuery(
    queryDto: FindFlashcardsQueryDto,
  ): Promise<MinimalFlashcardResponseDto[]>

  findAll(
    query: FilterQuery<FlashcardDocument>,
  ): Promise<FlashcardResponseDto[]>

  findById(id: string): Promise<FlashcardResponseDto | null>

  delete(id: string, userId: string): Promise<boolean>
}

export const IFlashcardService = Symbol('IFlashcardService')
