/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetSubmissionsQuery } from '../features/submissionAPI'
import ProfileNavbar from '../components/layout/Navbar/ProfileNavbar'
import {
  Layout,
  Typography,
  Table,
  Tag,
  Button,
  Spin,
  Alert,
  Pagination,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import type { ColumnsType } from 'antd/es/table'
import { useSearchParams } from 'react-router-dom'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
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
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const pageNumber = Number(searchParams.get('pageNumber')) || 1
  let pageSize = Number(searchParams.get('pageSize')) || 10
  if (![10, 15, 20].includes(pageSize)) {
    pageSize = 10 // Mặc định nếu không hợp lệ
  }
  interface SubmissionResponse {
    data: SubmissionHistory[]
    pagination?: {
      totalItems: number
      [key: string]: any
    }
    [key: string]: any
  }

  const {
    data: submissionResponse,
    isLoading,
    isError,
    error,
  } = useGetSubmissionsQuery({ pageSize, pageNumber }) as {
    data?: SubmissionResponse
    isLoading: boolean
    isError: boolean
    error?: any
  }
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
  const formatVietnamTime = (dateString: string) => {
    return dayjs
      .utc(dateString)
      .tz('Asia/Ho_Chi_Minh')
      .format('HH:mm DD/MM/YYYY')
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
      align: 'center',
      render: (score) => (
        <Tag color={score >= 5 ? 'green' : 'red'} style={{ fontSize: '14px' }}>
          {score} / 10
        </Tag>
      ),
      width: '15%',
    },
    // --- CỘT THỜI GIAN ĐÃ ĐƯỢC THAY ĐỔI ---
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startedAt',
      key: 'startedAt',
      render: (date) => formatVietnamTime(date),
      width: '25%',
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
          dataSource={
            Array.isArray(submissionResponse?.data)
              ? submissionResponse.data
              : []
          }
          loading={isLoading}
          rowKey='_id' // Sử dụng _id làm key cho mỗi dòng
          bordered
          pagination={false}
        />
        <Pagination
          current={pageNumber}
          pageSize={pageSize}
          total={
            typeof submissionResponse === 'object' &&
            submissionResponse !== null &&
            'pagination' in submissionResponse &&
            submissionResponse.pagination &&
            typeof submissionResponse.pagination.totalItems === 'number'
              ? submissionResponse.pagination.totalItems
              : 0
          }
          showTotal={(total) => `Tổng ${total} lượt làm bài`}
          onChange={(page, pageSize) => {
            navigate(`/all-results?pageNumber=${page}&pageSize=${pageSize}`)
          }}
          showSizeChanger
          pageSizeOptions={['10', '15', '20']}
          locale={{
            items_per_page: ' mục mỗi trang',
            jump_to: 'Đến',
            jump_to_confirm: 'Xác nhận',
            page: 'Trang',
            prev_page: 'Trước',
            next_page: 'Sau',
            prev_5: 'Trước 5',
            next_5: 'Sau 5',
            prev_3: 'Trước 3',
            next_3: 'Sau 3',
          }}
          style={{
            marginTop: '20px',
            textAlign: 'right',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        />
      </Content>
    </div>
  )
}
