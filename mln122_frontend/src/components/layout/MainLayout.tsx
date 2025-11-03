import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
const { Content } = Layout
import AppFooter from './Footer/Footer'
import Navbar from './Navbar/Navbar'

function MainLayout() {
  return (
    <Layout
      style={{
        minHeight: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Navbar />
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
