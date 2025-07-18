import { useMemo } from 'react'
import { Layout, Card, Typography, Avatar, Descriptions, Row, Col } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import Cookies from 'js-cookie'

import ProfileNavbar from '../components/layout/Navbar/ProfileNavbar'

const { Content } = Layout
const { Title, Text } = Typography

// Định nghĩa kiểu dữ liệu User đã được đơn giản hóa
interface UserProfile {
  fullName: string
  email: string
  picture: string
}

export default function Profile() {
  // Dùng useMemo để chỉ parse cookie một lần
  const userData: UserProfile | null = useMemo(() => {
    const data = Cookies.get('userData')
    return data ? JSON.parse(data) : null
  }, [])

  if (!userData) {
    return (
      <Layout
        style={{
          minHeight: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Vui lòng đăng nhập để xem thông tin cá nhân.</Text>
      </Layout>
    )
  }

  return (
    <Layout
      style={{ minHeight: '80vh', background: '#f0f2f5', padding: '24px' }}
    >
      <Content style={{ maxWidth: '900px', margin: '0 auto' }}>
        <ProfileNavbar />
        <Card variant={'borderless'} style={{ borderRadius: '12px' }}>
          <Row gutter={[32, 32]}>
            {/* === CỘT BÊN TRÁI: AVATAR & TÊN === */}
            <Col xs={24} md={8} style={{ textAlign: 'center' }}>
              <Avatar
                size={150}
                src={userData.picture}
                icon={<UserOutlined />}
              />
              <Title level={3} style={{ marginTop: '16px' }}>
                {userData.fullName || 'Chưa có tên'}
              </Title>
            </Col>

            {/* === CỘT BÊN PHẢI: THÔNG TIN CHI TIẾT === */}
            <Col xs={24} md={16}>
              <Descriptions title='Thông tin cá nhân' bordered column={1}>
                <Descriptions.Item label='Họ và Tên'>
                  {userData.fullName || 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item label='Email'>
                  {userData.email}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>
      </Content>
    </Layout>
  )
}
