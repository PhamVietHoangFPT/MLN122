import { Layout, Card, Typography, Row, Col, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useEffect } from 'react'

const { Content } = Layout
const { Title } = Typography

export default function Login() {
  const navigate = useNavigate()

  useEffect(() => {
    const userData = Cookies.get('userData')
      ? JSON.parse(Cookies.get('userData') as string)
      : null
    if (userData) {
      navigate('/')
    }
  }, [navigate])

  const handleGoogleLogin = () => {
    // Chuyển hướng đến endpoint backend để bắt đầu quá trình OAuth
    // Hãy chắc chắn rằng URL này đúng với địa chỉ backend của bạn
    window.location.href = 'http://localhost:5000/api/auth/google'
  }

  return (
    <Layout
      style={{
        minHeight: 'calc(100vh - 124px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Content
        style={{
          width: '80%',
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <Row gutter={[32, 32]} align='middle'>
          {/* Hình ảnh minh họa */}
          <Col xs={24} md={12} style={{ textAlign: 'center' }}>
            <Title
              level={2}
              style={{ textAlign: 'center', marginBottom: '24px' }}
            >
              Đăng nhập vào hệ thống ôn thi MLN122
            </Title>
          </Col>

          {/* Form đăng nhập */}
          <Col xs={24} md={12}>
            <Card
              bordered={false}
              style={{
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                padding: '24px',
                maxWidth: '100%',
                height: 'auto',
              }}
            >
              <Button onClick={handleGoogleLogin}>
                Đăng nhập bằng tài khoản google
              </Button>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}
