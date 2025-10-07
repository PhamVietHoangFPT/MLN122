/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from 'react-router-dom'
import { useGetExamsQuery } from '../features/examAPI'
import {
  Layout,
  Card,
  Typography,
  List,
  Button,
  Spin,
  Alert,
  Tag,
  Space,
} from 'antd'
import {
  ClockCircleOutlined,
  FileTextOutlined,
  RightOutlined,
} from '@ant-design/icons'

const { Content } = Layout
const { Title, Text } = Typography

export default function ExamList() {
  const { subjectId } = useParams<{ subjectId?: string }>()
  const navigate = useNavigate()

  const {
    data: examResponse,
    isLoading,
    isError,
    error,
  } = useGetExamsQuery(
    { subjectId: subjectId! },
    { skip: !subjectId } // Chỉ gọi API khi có subjectId
  )

  // Truy cập đúng vào mảng data bên trong response
  const exams = examResponse?.data

  const handleStartExam = (examId: string) => {
    // Điều hướng đến trang làm bài thi
    navigate(`/test/${examId}`)
  }

  // Hàm render nội dung chính
  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size='large' />
        </div>
      )
    }

    if (isError) {
      return (
        <Alert
          message='Lỗi'
          description={
            error && 'data' in error
              ? (error.data as any).message
              : 'Không thể tải kết quả.'
          }
          type='error'
          showIcon
        />
      )
    }

    return (
      <List
        itemLayout='vertical'
        dataSource={exams}
        renderItem={(exam) => (
          <List.Item
            key={exam._id}
            actions={[
              <Button
                type='primary'
                icon={<RightOutlined />}
                onClick={() => handleStartExam(exam._id)}
              >
                Bắt đầu
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={<Text style={{ fontSize: '18px' }}>{exam.title}</Text>}
              description={
                <Space size='middle' style={{ marginTop: '8px' }}>
                  <Tag icon={<ClockCircleOutlined />} color='blue'>
                    {exam.duration} phút
                  </Tag>
                  <Tag icon={<FileTextOutlined />} color='green'>
                    Mã đề: {exam.examCode}
                  </Tag>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    )
  }

  return (
    <Layout
      style={{
        display: 'flex',
        justifyContent: 'center',
        background: '#f0f2f5',
      }}
    >
      <Content
        style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}
      >
        <Card
          style={{
            width: '100%',
            maxWidth: '800px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <Title
            level={2}
            style={{ textAlign: 'center', marginBottom: '24px' }}
          >
            Danh sách đề thi thử
          </Title>
          {renderContent()}
        </Card>
      </Content>
    </Layout>
  )
}
