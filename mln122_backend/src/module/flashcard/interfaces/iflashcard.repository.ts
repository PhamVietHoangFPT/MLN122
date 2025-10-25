import { FilterQuery } from 'mongoose'
import { CreateFlashcardDto } from '../dto/flashcard.dto'
import { FlashcardDocument } from '../schemas/flashcard.schema'

export interface IFlashcardRepository {
  create(
    createFlashcardDto: CreateFlashcardDto,
    userId: string,
  ): Promise<FlashcardDocument>

  findAll(query: FilterQuery<FlashcardDocument>): Promise<FlashcardDocument[]>

  findById(id: string): Promise<FlashcardDocument | null>

  findFlashcardsBySubjectId(subjectId: string): Promise<FlashcardDocument[]>

  delete(id: string, userId: string): Promise<boolean>
}

export const IFlashcardRepository = Symbol('IFlashcardRepository')
