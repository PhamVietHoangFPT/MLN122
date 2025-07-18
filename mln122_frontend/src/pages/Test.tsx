import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate, useBlocker } from 'react-router-dom'
import {
  useStartExamMutation,
  useSubmitSubmissionMutation,
  useCancelSubmissionMutation,
} from '../features/submissionAPI' // Đường dẫn tới file API của bạn
import {
  Layout,
  Card,
  Typography,
  Radio,
  Space,
  Button,
  Row,
  Col,
  Divider,
  Spin,
  Alert,
  Statistic,
  Modal,
  notification,
  ConfigProvider,
} from 'antd'
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'
import type { RadioChangeEvent } from 'antd'
import type { UserProfile } from '../types/userProfile'
import DoesnotLoginYet from '../components/Permission/DoesnotLoginYet'
import Cookies from 'js-cookie'
const { confirm } = Modal
const { Sider, Content } = Layout
const { Title, Text } = Typography

// --- Các Interface định nghĩa kiểu dữ liệu ---
interface Answer {
  answerCode: string
  answerText: string
}
interface Question {
  questionNo: number
  title: string
  answers: Answer[]
}
interface Exam {
  _id: string
  title: string
  duration: number
  questions: Question[]
}

// === Component con để hiển thị giao diện làm bài thi ===
const ExamUI = ({
  exam,
  submissionId,
}: {
  exam: Exam
  submissionId: string
}) => {
  const [deadline] = useState(() => Date.now() + exam.duration * 60 * 1000)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const navigate = useNavigate()

  const [submitSubmission, { isLoading: isSubmitting }] =
    useSubmitSubmissionMutation()

  const [cancelSubmission] = useCancelSubmissionMutation()
  const [isExamInProgress, setIsExamInProgress] = useState(true)
  const blocker = useBlocker(isExamInProgress)

  useEffect(() => {
    if (blocker.state === 'blocked') {
      confirm({
        title: 'Bạn chắc chắn muốn rời khỏi bài thi?',
        content: 'Mọi dữ liệu trước khi nộp sẽ không được lưu lại.',
        okText: 'Xác nhận rời đi',
        cancelText: 'Tiếp tục làm bài',
        centered: true,
        onOk: async () => {
          await cancelSubmission(submissionId) // Hủy bài thi
          blocker.proceed() // Tiếp tục điều hướng
        },
        onCancel: () => {
          blocker.reset() // Ở lại trang
        },
      })
    }
  }, [blocker, submissionId, cancelSubmission])

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Dòng này cần thiết để một số trình duyệt hiển thị thông báo xác nhận
      event.preventDefault()
      event.returnValue =
        'Bạn có chắc chắn muốn rời khỏi trang này? Bài làm của bạn sẽ không được lưu lại.'
      cancelSubmission(submissionId)
    }

    // Thêm event listener khi component được mount
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Gỡ bỏ event listener khi component bị unmount (rất quan trọng)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [submissionId, cancelSubmission])

  const currentQuestion = exam.questions[currentQuestionIndex]

  const shuffledAnswers = useMemo(() => {
    if (!currentQuestion) return []
    return [...currentQuestion.answers].sort(() => Math.random() - 0.5)
  }, [currentQuestion])

  const handleAnswerChange = (e: RadioChangeEvent) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.questionNo]: e.target.value,
    })
  }

  const handleSubmitTimer = async () => {
    // Thêm kiểm tra để tránh gọi hàm này nhiều lần
    if (isSubmitting) return

    try {
      const payload = {
        submissionId,
        answers: Object.entries(userAnswers).map(([qNo, ansCode]) => ({
          questionNo: Number(qNo),
          chosenAnswerCode: ansCode,
        })),
      }
      await submitSubmission(payload).unwrap()
      setIsExamInProgress(false)
      alert('Hết giờ! Bài làm của bạn đã được nộp tự động.')
      navigate(`/result/${submissionId}`)
    } catch (err) {
      alert('Có lỗi xảy ra khi nộp bài.')
      console.error('Submit error:', err)
    }
  }

  const handleSubmit = async () => {
    // Thêm kiểm tra để tránh gọi hàm này nhiều lần
    if (isSubmitting) return

    try {
      const payload = {
        submissionId,
        answers: Object.entries(userAnswers).map(([qNo, ansCode]) => ({
          questionNo: Number(qNo),
          chosenAnswerCode: ansCode,
        })),
      }
      await submitSubmission(payload).unwrap()
      setIsExamInProgress(false)
      alert('Bài làm của bạn đã được nộp thành công.')
      navigate(`/result/${submissionId}`)
    } catch (err) {
      alert('Có lỗi xảy ra khi nộp bài.')
      console.error('Submit error:', err)
    }
  }

  if (!exam.questions[currentQuestionIndex]) return null

  if (!currentQuestion) return null

  const shuffledNavQuestions = useMemo(() => {
    const questionsWithOriginalIndex = exam.questions.map((q, index) => ({
      questionData: q,
      originalIndex: index,
    }))
    // Xáo trộn mảng
    return questionsWithOriginalIndex.sort(() => Math.random() - 0.5)
  }, [exam.questions])

  return (
    <Layout style={{ height: '100%', background: '#f0f2f5' }}>
      <ConfigProvider
        theme={{
          token: {
            // Đặt màu chủ đạo thành màu bạn muốn
            colorPrimary: '#262626',
          },
        }}
      >
        <Sider
          width={280}
          style={{
            background: '#fff',
            padding: '16px',
            borderRight: '1px solid #e8e8e8',
          }}
        >
          {/* === THÊM MỚI: Đồng hồ đếm ngược === */}
          <Card
            variant={'borderless'}
            style={{ textAlign: 'center', marginBottom: '16px' }}
          >
            <Statistic.Timer
              type='countdown'
              title='Thời gian còn lại'
              value={deadline}
              onFinish={handleSubmitTimer}
              format='mm:ss'
            />
          </Card>
          {/* ==================================== */}

          <Title level={4}>Danh sách câu hỏi</Title>
          <Divider />
          <Row gutter={[8, 8]}>
            {shuffledNavQuestions.map((item) => (
              <Col span={6} key={item.questionData.questionNo}>
                <Button
                  shape='circle'
                  // Kiểm tra câu trả lời dựa trên questionNo
                  type={
                    userAnswers[item.questionData.questionNo]
                      ? 'primary'
                      : 'default'
                  }
                  // Dùng chỉ số gốc để điều hướng đến đúng câu hỏi
                  onClick={() => setCurrentQuestionIndex(item.originalIndex)}
                  style={{
                    // So sánh với chỉ số gốc để xác định câu hỏi đang được chọn
                    borderColor:
                      currentQuestionIndex === item.originalIndex
                        ? '#262626'
                        : undefined,
                    fontWeight:
                      currentQuestionIndex === item.originalIndex
                        ? 'bold'
                        : 'normal',
                    backgroundColor:
                      currentQuestionIndex === item.originalIndex
                        ? '#262626'
                        : undefined,
                    color:
                      currentQuestionIndex === item.originalIndex
                        ? '#fff'
                        : undefined,
                  }}
                >
                  {item.questionData.questionNo}
                </Button>
              </Col>
            ))}
          </Row>
          <Button
            type='primary'
            danger
            block
            onClick={handleSubmit}
            loading={isSubmitting}
            style={{ marginTop: '24px' }}
          >
            Nộp bài
          </Button>
        </Sider>

        <Content style={{ padding: '24px 48px' }}>
          <Card>
            <Title level={4}>{currentQuestion.title}</Title>
            <Radio.Group
              onChange={handleAnswerChange}
              value={userAnswers[currentQuestion.questionNo]}
              style={{ marginTop: '16px' }}
            >
              <Space direction='vertical' size='large'>
                {shuffledAnswers.map((answer) => (
                  <Radio
                    key={answer.answerCode}
                    value={answer.answerCode}
                    style={{ fontSize: '16px' }}
                  >
                    {answer.answerText}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Card>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '24px',
            }}
          >
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
            >
              Câu trước
            </Button>
            <Button
              icon={<ArrowRightOutlined />}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              disabled={currentQuestionIndex === exam.questions.length - 1}
            >
              Câu tiếp
            </Button>
          </div>
        </Content>
      </ConfigProvider>
    </Layout>
  )
}

// === Component chính để bắt đầu bài thi ===
export default function Test() {
  const { examId } = useParams<{ examId: string }>()
  const [startExam, { data: submissionResponse, isLoading, isSuccess, error }] =
    useStartExamMutation()

  const handleStartExam = () => {
    confirm({
      title: 'Bạn chắc chắn muốn bắt đầu bài thi?',
      icon: <ExclamationCircleFilled />,
      content:
        'Lưu ý: Sau khi bắt đầu, vui lòng không tắt hoặc tải lại trang để tránh mất dữ liệu bài làm.',
      okText: 'Bắt đầu',
      cancelText: 'Hủy',
      centered: true,
      onOk() {
        if (examId) {
          notification.info({
            message: 'Đã bắt đầu bài thi.',
            description: 'Chúc bạn làm bài tốt!',
            placement: 'topRight',
          })
          startExam(examId)
        }
      },
      // Hàm sẽ được gọi khi người dùng nhấn "Hủy"
      onCancel() {
        notification.info({
          message: 'Đã hủy bắt đầu bài thi.',
          description: 'Bạn có thể quay lại và bắt đầu sau.',
          placement: 'topRight',
        })
      },
    })
  }

  // Nếu đang gọi API để bắt đầu -> hiển thị loading
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
        <Spin size='large' tip='Đang chuẩn bị đề thi...' />
      </div>
    )
  }

  // Nếu gọi API có lỗi
  if (error) {
    return (
      <Alert
        message='Lỗi'
        description='Không thể bắt đầu bài thi. Vui lòng thử lại.'
        type='error'
        showIcon
      />
    )
  }

  // Nếu đã gọi API thành công -> hiển thị giao diện làm bài
  if (isSuccess && submissionResponse) {
    // API trả về mảng, ta lấy phần tử đầu tiên
    const submissionData = submissionResponse.data[0]
    return (
      <ExamUI
        exam={submissionData.exam}
        submissionId={submissionData.submissionId}
      />
    )
  }

  const userData: UserProfile | null = useMemo(() => {
    const data = Cookies.get('userData')
    return data ? JSON.parse(data) : null
  }, [])

  if (!userData) {
    return <DoesnotLoginYet />
  }

  // Giao diện ban đầu -> nút bắt đầu
  return (
    <div style={{ textAlign: 'center', padding: '100px' }}>
      <Title level={2}>Bạn sắp bắt đầu bài thi</Title>
      <Text type='secondary'>
        Nhấn nút bên dưới để xác nhận và bắt đầu làm bài.
      </Text>
      <div style={{ marginTop: '24px' }}>
        <Button
          type='primary'
          size='large'
          onClick={handleStartExam}
          style={{
            backgroundColor: '#262626',
            borderColor: '#262626',
            color: '#fff',
          }}
        >
          Bắt đầu làm bài
        </Button>
      </div>
    </div>
  )
}
