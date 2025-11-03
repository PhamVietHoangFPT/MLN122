import { Outlet, useLocation } from 'react-router-dom'
import { Layout } from 'antd'
const { Content } = Layout
import AppFooter from './Footer/Footer'
import AppHeader from './Header/Header'
import Navbar from './Navbar/Navbar'

function MainLayout() {
  const location = useLocation()
  const isLandingPage = location.pathname === '/' || location.pathname === ''
  const isChatPage =
    location.pathname === '/chat' || location.pathname.startsWith('/chat/')
  const shouldShowHeader = !isLandingPage && !isChatPage

  return (
    <Layout
      style={{
        minHeight: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Navbar />
      {shouldShowHeader && <AppHeader />}
      <Content
        style={{
          padding: '50px',
          paddingTop: '30px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Outlet />
      </Content>
      <AppFooter />
    </Layout>
  )
}

export default MainLayout
