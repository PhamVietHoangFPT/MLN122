import { Controller, Get, Inject, Param } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { IRoleService } from './interfaces/irole.service'
import { ApiResponseDto } from 'src/common/dto/apiResponse.dto'
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
    type: ApiResponseDto<string>,
  })
  async getRoleIdByName(
    @Param('roleName') roleName: string,
  ): Promise<ApiResponseDto<string>> {
    const roleExists = await this.roleService.getRoleIdByName(roleName)
    return {
      data: [roleExists],
      message: 'Role ID retrieved successfully',
      statusCode: 200,
      success: true,
    }
  }

  @Get('role-id/:roleId')
  @ApiOperation({ summary: 'Get role name by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the name of the role.',
    type: ApiResponseDto<string>,
  })
  async getRoleNameById(
    @Param('roleId') roleId: string,
  ): Promise<ApiResponseDto<string>> {
    const roleExists = await this.roleService.getRoleNameById(roleId)
    return {
      data: [roleExists],
      message: 'Role name retrieved successfully',
      statusCode: 200,
      success: true,
    }
  }
}
