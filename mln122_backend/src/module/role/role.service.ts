import { ConflictException, Inject, Injectable } from '@nestjs/common'
import { IRoleRepository } from './interfaces/irole.repository'
import { IRoleService } from './interfaces/irole.service'

@Injectable()
export class RoleService implements IRoleService {
  constructor(
    @Inject(IRoleRepository) private readonly roleRepository: IRoleRepository,
  ) {}

  async getRoleIdByName(roleName: string): Promise<string | null> {
    const data = await this.roleRepository.getRoleIdByName(roleName)
    if (!data) {
      throw new ConflictException(`Role with name ${roleName} not found`)
    }
    return data
  }

  async getRoleNameById(roleId: string): Promise<string | null> {
    const data = await this.roleRepository.getRoleNameById(roleId)
    if (!data) {
      throw new ConflictException(`Role with ID ${roleId} not found`)
    }
    return data
  }
}
