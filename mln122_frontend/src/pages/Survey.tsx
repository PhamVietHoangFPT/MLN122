import { Result, Button, Space } from 'antd'
import { SmileOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
// CSS dạng object để style cho component
const pageStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '45vh',
}

const resultStyle = {
  // Ghi đè màu chữ mặc định của AntD để nổi bật trên nền tối
  title: {
    color: '#000000',
  },
  subTitle: {
    color: 'rgba(0, 0, 0, 0.65)',
  },
}

export default function ThankYouPage() {
  const navigate = useNavigate()
  return (
    <div style={pageStyle}>
      <Result
        icon={<SmileOutlined style={{ color: '#52c41a' }} />} // Bạn có thể dùng icon mặc định hoặc tùy chỉnh
        title={
          <span style={resultStyle.title}>Cảm ơn bạn đã làm khảo sát!</span>
        }
        subTitle={
          <span style={resultStyle.subTitle}>
            Những đóng góp của bạn là thông tin vô cùng quý giá giúp chúng tôi
            cải thiện dự án tốt hơn.
          </span>
        }
        extra={
          <Space>
            <Button type='primary' onClick={() => navigate('/')}>
              Quay về trang chủ
            </Button>
          </Space>
        }
      />
    </div>
  )
}
