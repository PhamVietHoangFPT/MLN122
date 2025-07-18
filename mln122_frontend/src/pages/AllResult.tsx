import { useGetSubmissionsQuery } from '../features/submissionAPI'
import ProfileNavbar from '../components/layout/Navbar/ProfileNavbar'
import { Layout, Typography, Table, Tag, Button, Spin, Alert } from 'antd'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import type { ColumnsType } from 'antd/es/table'

const { Content } = Layout
const { Title } = Typography

// Định nghĩa kiểu dữ liệu cho một dòng trong bảng
interface SubmissionHistory {
  _id: string
  score: number
  finishedAt: string
  exam: {
    title: string
    examCode: string
  }
  status: string
}

export default function AllResult() {
  const {
    data: submissionResponse,
    isLoading,
    isError,
    error,
  } = useGetSubmissionsQuery()
  const navigate = useNavigate()

  // Hàm chuyển đổi trạng thái sang tiếng Việt và gán màu
  const translateStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return <Tag color='green'>Đã hoàn thành</Tag>
      case 'in-progress':
        return <Tag color='blue'>Đang thực hiện</Tag>
      case 'canceled':
        return <Tag color='orange'>Đã hủy</Tag>
      default:
        return <Tag>{status}</Tag>
    }
  }

  // Định nghĩa các cột cho bảng
  const columns: ColumnsType<SubmissionHistory> = [
    {
      title: 'STT',
      dataIndex: 'key',
      render: (text, record, index) => index + 1,
      width: '5%',
    },
    {
      title: 'Tên bài thi',
      dataIndex: ['exam', 'title'], // Truy cập lồng vào exam.title
      key: 'title',
    },
    {
      title: 'Mã đề',
      dataIndex: ['exam', 'examCode'],
      key: 'examCode',
      width: '15%',
    },
    {
      title: 'Điểm số',
      dataIndex: 'score',
      key: 'score',
      render: (score) => <strong>{score} / 10</strong>,
      width: '10%',
    },
    {
      title: 'Ngày làm bài',
      dataIndex: 'finishedAt',
      key: 'finishedAt',
      render: (date) => dayjs(date).format('HH:mm DD/MM/YYYY'), // Định dạng ngày
      width: '20%',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => translateStatus(status),
      width: '15%',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button type='link' onClick={() => navigate(`/result/${record._id}`)}>
          Xem chi tiết
        </Button>
      ),
      width: '10%',
    },
  ]

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

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <Spin size='large' tip='Đang tải lịch sử làm bài...' />
      </div>
    )
  }

  return (
    <div>
      <ProfileNavbar />
      <Content style={{ padding: '24px 50px' }}>
        <Title level={2} style={{ marginBottom: '24px' }}>
          Lịch sử làm bài
        </Title>
        <Table
          columns={columns}
          dataSource={submissionResponse?.data}
          loading={isLoading}
          rowKey='_id' // Sử dụng _id làm key cho mỗi dòng
          bordered
        />
      </Content>
    </div>
  )
}
