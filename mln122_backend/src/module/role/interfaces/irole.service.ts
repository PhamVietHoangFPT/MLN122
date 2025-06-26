export interface IRoleService {
  getRoleIdByName(roleName: string): Promise<string | null>
  getRoleNameById(roleId: string): Promise<string | null>
}

export const IRoleService = Symbol('IRoleService')
