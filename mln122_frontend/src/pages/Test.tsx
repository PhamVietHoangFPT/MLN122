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
  FlagFilled,
  FlagOutlined,
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

  const [flaggedQuestions, setFlaggedQuestions] = useState<
    Record<number, boolean>
  >({})

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
      event.preventDefault()
      event.returnValue = '' // Một số trình duyệt yêu cầu gán giá trị này
      // Sử dụng sendBeacon để đảm bảo request được gửi đi
      navigator.sendBeacon(
        `http://localhost:5000/api/submissions/${submissionId}/cancel`,
        new Blob()
      )
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [submissionId])

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

  const handleManualSubmit = () => {
    confirm({
      title: 'Bạn chắc chắn muốn nộp bài?',
      icon: <ExclamationCircleFilled />,
      content: 'Sau khi nộp, bạn sẽ không thể thay đổi câu trả lời.',
      okText: 'Nộp bài',
      cancelText: 'Hủy',
      centered: true,
      onOk: () => handleSubmit(),
    })
  }

  const handleSubmit = async (isTimeUp = false) => {
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
      setIsExamInProgress(false) // Tắt blocker trước khi điều hướng

      if (isTimeUp) {
        notification.success({
          message: 'Hết giờ!',
          description: 'Bài làm của bạn đã được nộp tự động.',
          placement: 'topRight',
        })
      } else {
        notification.success({
          message: 'Nộp bài thành công!',
          description: 'Đang chuyển đến trang kết quả.',
          placement: 'topRight',
        })
      }

      navigate(`/result/${submissionId}`)
    } catch (err) {
      notification.error({
        message: 'Nộp bài thất bại',
        description: 'Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.',
        placement: 'topRight',
      })
      console.error('Submit error:', err)
    }
  }

  const shuffledNavQuestions = useMemo(() => {
    const questionsWithOriginalIndex = exam.questions.map((q, index) => ({
      questionData: q,
      originalIndex: index,
    }))
    return questionsWithOriginalIndex.sort(() => Math.random() - 0.5)
  }, [exam.questions])

  const handleToggleFlag = () => {
    const questionNo = currentQuestion.questionNo
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionNo]: !prev[questionNo],
    }))
  }

  if (!currentQuestion) return null

  return (
    <Layout style={{ height: '100%', background: '#f0f2f5' }}>
      <ConfigProvider
        theme={{
          token: {
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
          <Card
            bordered={false}
            style={{ textAlign: 'center', marginBottom: '16px' }}
          >
            <Statistic.Countdown
              title='Thời gian còn lại'
              value={deadline}
              onFinish={() => handleSubmit(true)}
              format='mm:ss'
            />
          </Card>

          <Title level={4}>Danh sách câu hỏi</Title>
          <Divider />
          <Row gutter={[8, 8]}>
            {shuffledNavQuestions.map((item) => {
              const isCurrent = currentQuestionIndex === item.originalIndex
              const isAnswered = !!userAnswers[item.questionData.questionNo]
              const isFlagged = !!flaggedQuestions[item.questionData.questionNo]

              const buttonStyle: React.CSSProperties = {
                fontWeight: isCurrent ? 'bold' : 'normal',
              }

              if (isFlagged) {
                buttonStyle.backgroundColor = '#d3af37'
                buttonStyle.borderColor = '#d3af37'
                buttonStyle.color = '#fff'
              }

              if (isCurrent) {
                buttonStyle.backgroundColor = '#262626'
                buttonStyle.borderColor = '#262626'
                buttonStyle.color = '#fff'
              }

              return (
                <Col span={6} key={item.questionData.questionNo}>
                  <Button
                    shape='circle'
                    type={
                      isAnswered && !isFlagged && !isCurrent
                        ? 'primary'
                        : 'default'
                    }
                    onClick={() => setCurrentQuestionIndex(item.originalIndex)}
                    style={buttonStyle}
                  >
                    {item.questionData.questionNo}
                  </Button>
                </Col>
              )
            })}
          </Row>
          <Button
            type='primary'
            danger
            block
            onClick={handleManualSubmit}
            loading={isSubmitting}
            style={{ marginTop: '24px' }}
          >
            Nộp bài
          </Button>
        </Sider>

        <Content style={{ padding: '24px 48px' }}>
          <Card>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                Câu {currentQuestion.questionNo}: {currentQuestion.title}
              </Title>
              <Button
                type='text'
                shape='circle'
                icon={
                  flaggedQuestions[currentQuestion.questionNo] ? (
                    <FlagFilled
                      style={{ color: '#d3af37', fontSize: '32px' }}
                    />
                  ) : (
                    <FlagOutlined style={{ fontSize: '32px' }} />
                  )
                }
                onClick={handleToggleFlag}
              />
            </div>
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

  // === SỬA LỖI: Di chuyển tất cả các hook lên đầu ===
  const [startExam, { data: submissionResponse, isLoading, isSuccess, error }] =
    useStartExamMutation()

  const userData: UserProfile | null = useMemo(() => {
    const data = Cookies.get('userData')
    return data ? JSON.parse(data) : null
  }, [])
  // ===============================================

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
      onCancel() {
        notification.info({
          message: 'Đã hủy bắt đầu bài thi.',
          description: 'Bạn có thể quay lại và bắt đầu sau.',
          placement: 'topRight',
        })
      },
    })
  }

  // Kiểm tra đăng nhập trước
  if (!userData) {
    return <DoesnotLoginYet />
  }

  // Các câu lệnh return có điều kiện cho API
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

  if (isSuccess && submissionResponse) {
    const submissionData = submissionResponse.data[0]
    return (
      <ExamUI
        exam={submissionData.exam}
        submissionId={submissionData.submissionId}
      />
    )
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
