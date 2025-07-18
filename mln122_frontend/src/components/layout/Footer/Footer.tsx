import React from 'react'
import { Layout, Typography, Col, Row, Space } from 'antd'
import {
  HeartOutlined, // Thay icon mạng xã hội bằng icon mang tính cá nhân hơn
} from '@ant-design/icons'

const { Footer } = Layout
const { Title, Text, Link } = Typography

const StudentProjectFooter: React.FC = () => {
  return (
    <Footer
      style={{
        background: '#262626', // Có thể dùng màu xám đậm để khác với màu xanh của FPT
        padding: '40px 50px',
        color: 'rgba(255, 255, 255, 0.65)',
      }}
    >
      <Row gutter={[48, 48]} justify='center'>
        {/* === Cột 1: Giới thiệu dự án === */}
        <Col xs={24} sm={12} md={8} style={{ textAlign: 'left' }}>
          <Title level={3} style={{ color: 'white', marginBottom: '20px' }}>
            Góc Học Tập FPT
          </Title>
          <Text style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
            Một dự án cá nhân nhỏ,
            <br />
            với mong muốn hỗ trợ sinh viên FPT.
          </Text>
          <div style={{ marginTop: '20px' }}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              Liên hệ góp ý:{' '}
            </Text>
          </div>
        </Col>

        {/* === Cột 2: Tài nguyên hữu ích === */}
        <Col xs={24} sm={12} md={8} style={{ textAlign: 'left' }}>
          <Title level={4} style={{ color: 'white', marginBottom: '20px' }}>
            Tài Nguyên Nhanh
          </Title>
          <Space direction='vertical' size='small'>
            <Link
              href='https://fap.fpt.edu.vn/'
              target='_blank'
              style={{ color: 'rgba(255, 255, 255, 0.65)' }}
            >
              Cổng thông tin FAP
            </Link>
            <Link
              href='https://lms-hcm.fpt.edu.vn/'
              target='_blank'
              style={{ color: 'rgba(255, 255, 255, 0.65)' }}
            >
              Hệ thống LMS
            </Link>
            <Link
              href='https://library.fpt.edu.vn/'
              target='_blank'
              style={{ color: 'rgba(255, 255, 255, 0.65)' }}
            >
              Thư viện số
            </Link>
          </Space>
        </Col>

        {/* === Cột 3: Lưu ý === */}
        <Col xs={24} sm={12} md={8} style={{ textAlign: 'left' }}>
          <Title level={4} style={{ color: 'white', marginBottom: '20px' }}>
            Lưu ý
          </Title>
          <Text style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
            Đây là một dự án độc lập, không phải trang web chính thức của Đại
            học FPT. Mọi thông tin chỉ mang tính chất tham khảo.
          </Text>
        </Col>
      </Row>

      {/* === Dòng bản quyền ở dưới cùng === */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '40px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <Text style={{ color: 'rgba(255, 255, 255, 0.45)' }}>
          Made with <HeartOutlined /> by FPTU-ers | ©{' '}
          {new Date().getFullYear()} Góc Học Tập FPT
        </Text>
      </div>
    </Footer>
  )
}

export default StudentProjectFooter
