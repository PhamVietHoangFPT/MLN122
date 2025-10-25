import { IFlashcardRepository } from './interfaces/iflashcard.repository'
import { InjectModel } from '@nestjs/mongoose'
import { Model, FilterQuery } from 'mongoose'
import { Flashcard, FlashcardDocument } from './schemas/flashcard.schema'
import { CreateFlashcardDto } from './dto/flashcard.dto'
import mongoose from 'mongoose'

export class FlashcardRepository implements IFlashcardRepository {
  constructor(
    @InjectModel(Flashcard.name)
    private readonly flashcardModel: Model<FlashcardDocument>,
  ) {}

  findFlashcardsBySubjectId(subjectId: string): Promise<FlashcardDocument[]> {
    return this.flashcardModel
      .find({ subject: subjectId })
      .select('_id subject description')
      .populate('subject')
      .lean()
      .exec()
  }

  create(
    createFlashcardDto: CreateFlashcardDto,
    userId: string,
  ): Promise<FlashcardDocument> {
    const flashcard = new this.flashcardModel({
      ...createFlashcardDto,
      user: userId,
    })
    return flashcard.save()
  }

  findAll(query: FilterQuery<FlashcardDocument>): Promise<FlashcardDocument[]> {
    return this.flashcardModel.find(query).populate('subject').lean().exec()
  }

  findById(id: string): Promise<FlashcardDocument | null> {
    return this.flashcardModel.findById(id).populate('subject').lean().exec()
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const data = await this.flashcardModel
      .updateOne(
        { _id: id },
        {
          $set: {
            deleted_at: new Date(),
            deleted_by: new mongoose.Types.ObjectId(userId),
          },
        },
      )
      .exec()
    return data.modifiedCount > 0
  }
}
