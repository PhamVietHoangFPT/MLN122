import React, { useEffect } from 'react'
import {
  Layout,
  Card,
  Typography,
  Row,
  Col,
  Button,
  Space,
  Divider,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { FcGoogle } from 'react-icons/fc' // Icon Google từ react-icons
import { BookOutlined, CheckCircleOutlined } from '@ant-design/icons'
const { Title, Text } = Typography

export default function Login() {
  const navigate = useNavigate()
  const url = import.meta.env.VITE_API_ENDPOINT
  // Logic kiểm tra đăng nhập của bạn (giữ nguyên)
  useEffect(() => {
    const userData = Cookies.get('userData')
      ? JSON.parse(Cookies.get('userData') as string)
      : null
    if (userData) {
      navigate('/')
    }
  }, [navigate])

  // Logic xử lý đăng nhập Google của bạn (giữ nguyên)
  const handleGoogleLogin = () => {
    window.location.href = `${url}/auth/google`
  }

  return (
    <Layout
      style={{
        minHeight: 'calc(100vh - 128px)', // Giả sử header+footer cao 128px
        background: '#f0f2f5', // Màu nền xám nhẹ của AntD
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <Row
        gutter={[64, 32]}
        align='middle'
        justify='center'
        style={{ maxWidth: '1000px' }}
      >
        {/* Cột trái: Hình ảnh và mô tả */}
        <Col xs={24} lg={12} style={{ textAlign: 'center' }}>
          <BookOutlined
            style={{
              fontSize: '128px',
              color: '#262626',
              marginBottom: '16px',
            }}
          />
          <Title level={3} style={{ marginTop: '24px' }}>
            Góc Học Tập FPT
          </Title>
          <Text type='secondary'>
            Nền tảng cá nhân hỗ trợ ôn tập và thi thử dành cho sinh viên FPT.
          </Text>
        </Col>

        {/* Cột phải: Khung đăng nhập */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              borderRadius: '16px',
              padding: '16px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <Title level={2}>Đăng Nhập</Title>
              <Text type='secondary'>
                Sử dụng tài khoản Google (email FPT) của bạn để tiếp tục.
              </Text>
            </div>

            <Divider />

            <Button
              type='primary'
              size='large'
              block
              icon={<FcGoogle style={{ fontSize: '22px' }} />}
              onClick={handleGoogleLogin}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                background: 'white',
                color: '#444',
                borderColor: '#d9d9d9',
                fontWeight: 500,
              }}
            >
              Đăng nhập với Google
            </Button>

            <Space
              direction='vertical'
              style={{ marginTop: '24px', width: '100%' }}
            >
              <Text>
                <CheckCircleOutlined
                  style={{ color: '#52c41a', marginRight: '8px' }}
                />
                Truy cập kho tài liệu học tập.
              </Text>
              <Text>
                <CheckCircleOutlined
                  style={{ color: '#52c41a', marginRight: '8px' }}
                />
                Tham gia các kỳ thi thử không giới hạn.
              </Text>
              <Text>
                <CheckCircleOutlined
                  style={{ color: '#52c41a', marginRight: '8px' }}
                />
                Theo dõi tiến độ và kết quả cá nhân.
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}
