import { Layout, Card, Typography, Avatar, Descriptions, Row, Col } from 'antd'
import { UserOutlined } from '@ant-design/icons'

import ProfileNavbar from '../components/layout/Navbar/ProfileNavbar'
import type { UserProfile } from '../types/userProfile'
import { useMemo } from 'react'
import Cookies from 'js-cookie'
const { Content } = Layout
const { Title } = Typography
export default function Profile() {
  const userData: UserProfile | null = useMemo(() => {
    const data = Cookies.get('userData')
    return data ? JSON.parse(data) : null
  }, [])

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
                src={userData?.picture}
                icon={<UserOutlined />}
              />
              <Title level={3} style={{ marginTop: '16px' }}>
                {userData?.fullName || 'Chưa có tên'}
              </Title>
            </Col>

            {/* === CỘT BÊN PHẢI: THÔNG TIN CHI TIẾT === */}
            <Col xs={24} md={16}>
              <Descriptions title='Thông tin cá nhân' bordered column={1}>
                <Descriptions.Item label='Họ và Tên'>
                  {userData?.fullName || 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item label='Email'>
                  {userData?.email}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>
      </Content>
    </Layout>
  )
}
