export interface IRoleRepository {
  getRoleIdByName(roleName: string): Promise<string | null>
  getRoleNameById(roleId: string): Promise<string | null>
}

export const IRoleRepository = Symbol('IRoleRepository')
