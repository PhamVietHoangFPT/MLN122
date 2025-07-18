import { lazy } from 'react'
import type { LayoutRoute } from '../types/routes'

// Các layout này được export dưới dạng named export { LayoutName }
const AdminLayout = lazy(() =>
  import('../components/layout/AdminLayout').then((module) => ({
    default: module.AdminLayout,
  }))
)

// Các layout này được export dưới dạng export default
const LoginRegisterLayout = lazy(
  () => import('../components/layout/LoginRegisterLayout')
)
const MainLayout = lazy(() => import('../components/layout/MainLayout'))

const Login = lazy(() => import('../pages/Login/Login'))

const LoginSuccess = lazy(() => import('../pages/Login/LoginSuccess'))

const HomePage = lazy(() => import('../pages/HomePage'))

const routes: LayoutRoute[] = [
  {
    layout: LoginRegisterLayout,
    data: [
      {
        path: '/login',
        component: Login,
      },
      {
        path: '/login-success',
        component: LoginSuccess,
      },
    ],
  },
  {
    layout: MainLayout,
    data: [
      {
        path: '/',
        component: HomePage,
        exact: true,
      },
    ],
  },
  {
    layout: AdminLayout,
    role: ['685d54822e239adc055c4abf'],
    data: [
      {
        path: '/dashboard',
        component: Login,
      },
    ],
  },
]

export default routes
