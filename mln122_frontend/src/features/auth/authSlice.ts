/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import type { AuthState, UserData } from '../../types/auth'

// Lấy userData từ Cookies
const userData: UserData | null = Cookies.get('userData')
  ? JSON.parse(Cookies.get('userData') as string)
  : null

const userToken = Cookies.get('userToken')

const initialState: AuthState = {
  userData,
  userToken: userToken ? { accessToken: userToken } : null,
  isAuthenticated: !!userData,
  isLoading: false,
}

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    login: (state, action: PayloadAction<{ token: string }>) => {
      const { token } = action.payload

      const decodedToken: any = jwtDecode(token)

      state.userData = {
        email: decodedToken.email,
        id: decodedToken.id,
        role: decodedToken.role,
        fullName: decodedToken.fullName,
        picture: decodedToken.picture || '',
        exp: decodedToken.exp,
        iat: decodedToken.iat,
      }

      state.userToken = { accessToken: token }
      state.isAuthenticated = true

      const expirationDate = new Date(Number(state.userData.exp) * 1000)
      Cookies.set('userData', JSON.stringify(state.userData), {
        expires: expirationDate,
      })
      Cookies.set('userToken', token, { expires: expirationDate })
      if (state.userData.role !== '685d54822e239adc055c4abf') {
        window.location.href = '/'
      } else {
        window.location.href = `/${state.userData.role.toLowerCase().replace(/ /g, '-')}/admin`
      }
    },
    logout: (state) => {
      state.userData = null
      state.userToken = null
      state.isAuthenticated = false

      Cookies.remove('userData')
      Cookies.remove('userToken')
    },
  },
})

export const { login, logout, setLoading } = authSlice.actions
export default authSlice.reducer
export const selectAuthUser = (state: { authSlice: AuthState }) =>
  state.authSlice
