import { IFlashcardService } from './interfaces/iflashcard.service'
import { IFlashcardRepository } from './interfaces/iflashcard.repository'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Flashcard, FlashcardSchema } from './schemas/flashcard.schema'
import { FlashcardService } from './flashcard.service'
import { FlashcardController } from './flashcard.controller'
import { SubjectModule } from '../subject/subject.module'
import { FlashcardRepository } from './flashcard.repository'
import { RoleModule } from '../role/role.module'
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Flashcard.name, schema: FlashcardSchema },
    ]),
    SubjectModule,
    RoleModule,
  ],
  controllers: [FlashcardController],
  providers: [
    {
      provide: IFlashcardService,
      useClass: FlashcardService,
    },
    {
      provide: IFlashcardRepository,
      useClass: FlashcardRepository,
    },
  ],
  exports: [IFlashcardService, IFlashcardRepository],
})
export class FlashcardModule {}
