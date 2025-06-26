// src/common/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject, // Import Inject
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/roles.decorator'
import { IRoleService } from 'src/module/role/interfaces/irole.service' // Import interface của bạn

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(IRoleService) private readonly roleService: IRoleService, // 1. Inject RoleService
  ) {}

  // 2. Chuyển hàm thành async và trả về Promise<boolean>
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    const { user } = context.switchToHttp().getRequest()
    const roleId = user?.role // Lấy ra role ID từ payload

    if (!roleId) {
      throw new ForbiddenException(
        'Không tìm thấy thông tin vai trò trong token của bạn.',
      )
    }

    // 3. Dùng roleId để tra cứu tên vai trò từ database
    // Giả sử bạn có một hàm như thế này trong RoleService
    const roleName = await this.roleService.getRoleNameById(roleId)

    if (!roleName) {
      throw new ForbiddenException(
        'Vai trò được chỉ định trong token không tồn tại.',
      )
    }

    // 4. So sánh tên vai trò đã tra cứu với danh sách yêu cầu
    const hasRequiredRole = requiredRoles.includes(roleName)

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        `Chỉ có vai trò ${requiredRoles.join(', ')} mới có quyền truy cập.`,
      )
    }

    return true
  }
}
