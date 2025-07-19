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

const ExamList = lazy(() => import('../pages/ExamList'))

const Test = lazy(() => import('../pages/Test'))

const Result = lazy(() => import('../pages/Result'))

const Profile = lazy(() => import('../pages/Profile'))

const AllResult = lazy(() => import('../pages/AllResult'))

const AdminPage = lazy(() => import('../pages/Admin/AdminPage'))

const ManageExam = lazy(() => import('../pages/Admin/ManageExam'))

const ManageSubject = lazy(() => import('../pages/Admin/ManageSubject'))

const SubjectDetail = lazy(() => import('../pages/Admin/SubjectDetail'))
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
    layout: MainLayout,
    role: ['685d54822e239adc055c4abf', '685d54822e239adc055c4ac0'],
    data: [
      {
        path: '/exam/:subjectId',
        component: ExamList,
      },
      {
        path: '/test/:examId',
        component: Test,
      },
      {
        path: '/result/:submissionId',
        component: Result,
      },
      {
        path: '/profile',
        component: Profile,
      },
      {
        path: '/all-results',
        component: AllResult,
      },
    ],
  },
  {
    layout: AdminLayout,
    role: ['685d54822e239adc055c4abf'],
    data: [
      {
        path: '/685d54822e239adc055c4abf/admin',
        component: AdminPage,
      },
      {
        path: '/685d54822e239adc055c4abf/exams',
        component: ManageExam,
      },
      {
        path: '/685d54822e239adc055c4abf/subjects',
        component: ManageSubject,
      },
      {
        path: '/685d54822e239adc055c4abf/subjects/:subjectId',
        component: SubjectDetail,
      },
    ],
  },
]

export default routes
