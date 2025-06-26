import { Controller, Get, Inject, Param } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { IRoleService } from './interfaces/irole.service'

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(
    @Inject(IRoleService)
    private readonly roleService: IRoleService,
  ) {}

  @Get('role-name/:roleName')
  @ApiOperation({ summary: 'Get role ID by name' })
  @ApiResponse({
    status: 200,
    description: 'Returns the ID of the role.',
  })
  async getRoleIdByName(@Param('roleName') roleName: string): Promise<string> {
    return await this.roleService.getRoleIdByName(roleName)
  }

  @Get('role-id/:roleId')
  @ApiOperation({ summary: 'Get role name by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the name of the role.',
  })
  async getRoleNameById(@Param('roleId') roleId: string): Promise<string> {
    return await this.roleService.getRoleNameById(roleId)
  }
}
