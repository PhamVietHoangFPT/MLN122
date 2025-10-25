/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from 'react-router-dom'
import { useGetflashcardsBySubjectQuery } from '../features/flashcardAPI' // Đã đổi hook
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
import { TagOutlined, RightOutlined } from '@ant-design/icons' // Đổi Icon

const { Content } = Layout
const { Title, Text } = Typography

// Định nghĩa kiểu dữ liệu cho một flashcard item (tùy chọn nhưng nên có)

export default function FlashcardList() {
  // Đổi tên component
  const { subjectId } = useParams<{ subjectId?: string }>()
  const navigate = useNavigate()

  const {
    data: flashcardResponse, // Đổi tên biến data
    isLoading,
    isError,
    error,
  } = useGetflashcardsBySubjectQuery(
    { subjectId: subjectId! },
    { skip: !subjectId } // Chỉ gọi API khi có subjectId
  )

  // Truy cập đúng vào mảng data bên trong response
  const flashcards = flashcardResponse?.data // Đổi tên biến

  const handleViewFlashcard = (flashcardId: string) => {
    // Đổi tên hàm xử lý
    // Điều hướng đến trang xem flashcard chi tiết hoặc trang học
    navigate(`/flashcard/flashcard-detail/${flashcardId}`) // Hoặc `/study/${flashcardId}` tùy vào route của bạn
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
              : 'Không thể tải danh sách flashcard.' // Sửa thông báo lỗi
          }
          type='error'
          showIcon
        />
      )
    }

    // Kiểm tra nếu không có dữ liệu hoặc mảng rỗng
    if (!flashcards) {
      return <Text>Không có flashcard nào cho môn học này.</Text>
    }

    return (
      <List
        itemLayout='vertical'
        dataSource={flashcards} // Sử dụng dataSource flashcards
        renderItem={(
          flashcard // Đổi tên biến item
        ) => (
          <List.Item
            key={flashcard._id} // Sử dụng flashcard._id
            actions={[
              <Button
                type='primary'
                icon={<RightOutlined />}
                onClick={() => handleViewFlashcard(flashcard._id)} // Gọi hàm xử lý mới
              >
                Xem Flashcard {/* Đổi text nút */}
              </Button>,
            ]}
          >
            <List.Item.Meta
              // Sử dụng description làm title
              title={
                <Text style={{ fontSize: '16px' }}>
                  {flashcard.description}
                </Text>
              }
              description={
                <Space size='middle' style={{ marginTop: '8px' }}>
                  {/* Hiển thị tên môn học */}
                  <Tag icon={<TagOutlined />} color='purple'>
                    Môn học: {flashcard.subject.subjectName}
                  </Tag>
                  {/* Bạn có thể thêm các Tag khác nếu có dữ liệu */}
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
            Danh sách Flashcard {/* Đổi Title */}
          </Title>
          {renderContent()}
        </Card>
      </Content>
    </Layout>
  )
}
