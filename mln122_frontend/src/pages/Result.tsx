/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from 'react-router-dom'
import { useGetSubmissionByIdQuery } from '../features/submissionAPI'
import {
  Layout,
  Card,
  Typography,
  Spin,
  Alert,
  Empty,
  Button,
  Statistic,
  Row,
  Col,
  Divider,
  Space,
} from 'antd'
import {
  CheckCircleFilled,
  CloseCircleFilled,
  HistoryOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration) // Extend dayjs với plugin duration

const { Sider, Content } = Layout
const { Title, Text } = Typography

export default function Result() {
  const { submissionId } = useParams<{ submissionId: string }>()
  const navigate = useNavigate()
  const {
    data: submissionResponse,
    isLoading,
    isError,
    error,
  } = useGetSubmissionByIdQuery(submissionId!, { skip: !submissionId })

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
        <Spin size='large' tip='Đang tải kết quả...' />
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

  // Lấy dữ liệu bài làm từ response
  const submission = submissionResponse?.data[0]

  if (!submission) {
    return <Empty description='Không tìm thấy dữ liệu bài làm.' />
  }

  // --- Tính toán các thông số ---
  const correctAnswersCount = (submission.answers ?? []).filter(
    (a) => a.isCorrect
  ).length
  const totalQuestions = submission.exam.questions.length
  const timeTaken = dayjs.duration(
    dayjs(submission.finishedAt).diff(dayjs(submission.startedAt))
  )

  // --- Hàm xác định style cho từng câu trả lời ---
  const getAnswerStyle = (question: any, answerCode: any) => {
    const userAnswer = submission.answers?.find(
      (a) => a.questionNo === question.questionNo
    )

    // Trường hợp trả lời đúng
    if (question.correctAnswerCode === answerCode) {
      return {
        background: '#f6ffed',
        border: '1px solid #b7eb8f',
        icon: <CheckCircleFilled style={{ color: 'green' }} />,
      }
    }

    // Trường hợp trả lời sai
    if (userAnswer?.chosenAnswerCode === answerCode) {
      return {
        background: '#fff1f0',
        border: '1px solid #ffa39e',
        icon: <CloseCircleFilled style={{ color: 'red' }} />,
      }
    }

    // Các trường hợp khác
    return { background: '#fafafa', border: '1px solid #d9d9d9', icon: null }
  }

  return (
    <Layout style={{ minHeight: 'calc(100vh - 128px)', background: '#f0f2f5' }}>
      {/* === THANH TÓM TẮT BÊN TRÁI === */}
      <Sider
        width={300}
        style={{
          background: '#fff',
          padding: '16px',
          borderRight: '1px solid #e8e8e8',
        }}
      >
        <Title level={4}>Kết quả bài thi</Title>
        <Text type='secondary'>{submission.exam.title}</Text>
        <Divider />
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Statistic title='Điểm số' value={submission.score} suffix='/ 10' />
          </Col>
          <Col span={12}>
            <Statistic
              title='Số câu đúng'
              value={`${correctAnswersCount} / ${totalQuestions}`}
            />
          </Col>
          <Col span={24}>
            <Statistic
              title='Thời gian hoàn thành'
              value={timeTaken.format('mm:ss')}
              suffix=' (phút:giây)'
            />
          </Col>
        </Row>
        <Divider />
        <Button
          type='primary'
          icon={<HistoryOutlined />}
          block
          onClick={() => navigate('/all-results')}
        >
          Quay về Trang lịch sử làm bài
        </Button>
      </Sider>

      {/* === PHẦN XEM LẠI CHI TIẾT BÊN PHẢI === */}
      <Content style={{ padding: '24px 48px', overflowY: 'auto' }}>
        <Title level={3} style={{ marginBottom: '24px' }}>
          Xem lại chi tiết bài làm
        </Title>

        {submission.exam.questions.map((question: any) => {
          const userAnswer = submission.answers?.find(
            (a) => a.questionNo === question.questionNo
          )

          return (
            <Card key={question.questionNo} style={{ marginBottom: '16px' }}>
              <Title level={5}>
                Câu {question.questionNo}: {question.title}
              </Title>
              <Text type='secondary'>
                Bạn đã chọn:{' '}
                {userAnswer
                  ? `Đáp án ${userAnswer.chosenAnswerCode}`
                  : 'Chưa trả lời'}
              </Text>
              <Divider style={{ margin: '12px 0' }} />
              <Space direction='vertical' style={{ width: '100%' }}>
                {question.answers.map((answer: any) => {
                  const style = getAnswerStyle(question, answer.answerCode)
                  return (
                    <div
                      key={answer.answerCode}
                      style={{
                        padding: '10px 15px',
                        borderRadius: '8px',
                        border: style.border,
                        background: style.background,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Text>
                        Đáp án {answer.answerCode}: {answer.answerText}
                      </Text>
                      {style.icon}
                    </div>
                  )
                })}
              </Space>
            </Card>
          )
        })}
      </Content>
    </Layout>
  )
}
