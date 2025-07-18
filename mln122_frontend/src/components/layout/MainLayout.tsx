import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
const { Content } = Layout
import AppFooter from './Footer/Footer'
import AppHeader from './Header/Header'
import Navbar from './Navbar/Navbar'

function MainLayout() {
  return (
    <Layout
      style={{
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <Navbar />
      <AppHeader />
      <Content
        style={{
          padding: '50px',
          paddingTop: '30px',
        }}
      >
        <Outlet />
      </Content>
      <AppFooter />
    </Layout>
  )
}

export default MainLayout
