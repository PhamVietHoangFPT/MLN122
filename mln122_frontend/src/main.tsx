import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConfigProvider, Spin } from 'antd'
import store from './services/store.ts'
import './index.css'

// Import cấu hình routes và các component cần thiết
import routes from './routes/routes'
import PermissionCheck from './components/Permission/PermissionCheck'
import NotFound from './components/NotFound/NotFound'

// Định nghĩa một fallback chung cho Suspense khi tải component
const suspenseFallback = (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <Spin size='large' />
  </div>
)

// Chuyển đổi mảng routes của bạn sang định dạng của createBrowserRouter
const router = createBrowserRouter([
  // Lặp qua mỗi nhóm layout trong file routes.ts
  ...routes.map((route) => {
    const Layout = route.layout
    return {
      // Mỗi nhóm layout là một "route không có path" (pathless route)
      // Element của nó là Layout đã được bọc bởi PermissionCheck
      element: (
        <Suspense fallback={suspenseFallback}>
          <PermissionCheck protectedRole={route.role}>
            <Layout />
          </PermissionCheck>
        </Suspense>
      ),
      // Các trang con sẽ được render bên trong <Outlet /> của Layout
      children: route.data.map((item) => {
        const Component = item.component
        return {
          path: item.path,
          element: (
            <Suspense fallback={suspenseFallback}>
              <Component />
            </Suspense>
          ),
          // Chuyển đổi `exact: true` thành `index: true` cho trang chủ
          ...(item.exact && { index: true }),
        }
      }),
    }
  }),
  // Thêm route cho trang 404 Not Found ở cuối
  {
    path: '*',
    element: (
      <Suspense fallback={suspenseFallback}>
        <NotFound />
      </Suspense>
    ),
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider>
        {/* Sử dụng RouterProvider thay cho BrowserRouter */}
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  </StrictMode>
)
