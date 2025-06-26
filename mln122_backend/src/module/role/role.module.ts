// src/role/role.module.ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Role, RoleSchema } from './schemas/role.schema'
import { IRoleRepository } from './interfaces/irole.repository'
import { RoleRepository } from './role.repository'
import { RoleController } from './role.controller'
import { IRoleService } from './interfaces/irole.service'
import { RoleService } from './role.service'
// import { RoleService } from './role.service'; // Nếu có
// import { RoleController } from './role.controller'; // Nếu có

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [RoleController],
  providers: [
    {
      provide: IRoleRepository,
      useClass: RoleRepository,
    },
    {
      provide: IRoleService,
      useClass: RoleService,
    },
  ],
  exports: [IRoleRepository, IRoleService],
})
export class RoleModule {}
