export interface UserToken {
  accessToken: string
}

export interface UserData {
  id: string
  email: string
  role: string
  fullName: string
  picture?: string
  iat: string
  exp: string
}

export interface AuthState {
  userData: UserData | null
  userToken: UserToken | null
  isAuthenticated: boolean
  isLoading: boolean
}
