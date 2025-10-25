/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useMemo } from 'react'
import { useGetflashcardByIdQuery } from '../features/flashcardAPI'
import { useParams } from 'react-router-dom'
import {
  Card,
  Button,
  Space,
  Typography,
  Progress,
  Spin,
  Row,
  Col,
  Alert,
  InputNumber,
} from 'antd'
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  RetweetOutlined,
} from '@ant-design/icons'
import Cookies from 'js-cookie'
import './css/FlashcardPage.css' // Import file CSS cho hiệu ứng lật thẻ

// Kiểu dữ liệu cho API response
interface ApiResponse {
  success: boolean
  message: string
  statusCode: number
  data: FlashcardData[] // Dữ liệu là một mảng
}

// Kiểu dữ liệu cho object Flashcard
interface Answer {
  answerCode: string
  answerText: string
}
interface Question {
  questionNo: number
  title: string
  correctAnswerCode: string
  answers: Answer[]
}
interface FlashcardData {
  _id: string
  subject: {
    _id: string
    subjectName: string
  }
  questions: Question[]
}
// ---------------------------------------------------

export default function FlashcardPage() {
  const { flashcardId } = useParams<{ flashcardId: string }>()
  if (!flashcardId) {
    return (
      <Alert
        message='Lỗi'
        description='Không tìm thấy ID của flashcard.'
        type='error'
      />
    )
  }

  // Key để lưu trữ vào storage
  const storageKey = `flashcardData_${flashcardId}`
  const progressKey = `flashcardProgress_${flashcardId}`

  // --- State Quản lý Dữ liệu ---

  // SỬA LỖI 1: State flashcardData giờ sẽ lưu FlashcardData | null
  const [flashcardData, setFlashcardData] = useState<FlashcardData | null>(
    () => {
      try {
        const cachedData = localStorage.getItem(storageKey)
        if (!cachedData) return null

        const parsedData = JSON.parse(cachedData)

        // Kiểm tra xem cache có phải là object FlashcardData (chuẩn) không
        if (parsedData.questions && parsedData.subject) {
          return parsedData as FlashcardData
        }

        // Kiểm tra xem cache có phải là ApiResponse (cấu trúc cũ) không
        if (parsedData.data && Array.isArray(parsedData.data)) {
          return (parsedData as ApiResponse).data[0] // Trả về object bên trong
        }

        // Cache không hợp lệ
        localStorage.removeItem(storageKey)
        return null
      } catch (e) {
        console.error('Lỗi khi đọc cache localStorage:', e)
        localStorage.removeItem(storageKey)
        return null
      }
    }
  )

  // State 2: Đang tải dữ liệu (chỉ true khi không có cache)
  const [isInitialLoading, setIsInitialLoading] = useState(!flashcardData)

  // --- State Quản lý Giao diện (UI) ---
  const [currentIndex, setCurrentIndex] = useState(() => {
    const savedIndex = Cookies.get(progressKey)
    const index = savedIndex ? parseInt(savedIndex, 10) : 0
    return isNaN(index) ? 0 : index
  })

  // State: Trạng thái lật thẻ
  const [isFlipped, setIsFlipped] = useState(false)

  // State: State để quản lý hướng trượt của thẻ
  const [slideDirection, setSlideDirection] = useState<
    'right' | 'left' | 'initial'
  >('initial')

  // State: Nhảy đến câu hỏi cụ thể
  const [jumpValue, setJumpValue] = useState<number | null>(currentIndex + 1)

  // --- RTK Query: Lấy dữ liệu từ API ---
  // SỬA LỖI 2: Ta phải định nghĩa kiểu trả về của hook là ApiResponse
  const {
    data: apiData,
    isLoading: isApiLoading,
    isError,
    error,
  } = useGetflashcardByIdQuery(flashcardId)

  // --- Effects: Xử lý logic ---

  // SỬA LỖI 3: Đồng bộ API vào state
  useEffect(() => {
    // Khi có dữ liệu mới từ API
    if (apiData && apiData.success && apiData.data && apiData.data.length > 0) {
      // Chỉ lấy object flashcard thật sự
      const actualFlashcardData = apiData.data[0]

      // Cập nhật state với object thật
      setFlashcardData(actualFlashcardData)
      setIsInitialLoading(false)

      // Chỉ lưu object thật vào localStorage
      try {
        localStorage.setItem(storageKey, JSON.stringify(actualFlashcardData))
      } catch (e) {
        console.error('Lỗi khi lưu vào localStorage (có thể bị đầy):', e)
      }
    } else if (isError) {
      // Nếu API lỗi và không có cache, tắt loading
      if (!flashcardData) {
        setIsInitialLoading(false)
      }
    }
    // Bỏ flashcardData khỏi dependency array để tránh vòng lặp
  }, [apiData, isError, storageKey, flashcardData])

  // SỬA LỖI 4: Logic lưu cookie giờ đã ĐÚNG vì flashcardData là FlashcardData
  useEffect(() => {
    if (flashcardData) {
      const validIndex = Math.max(
        0,
        Math.min(currentIndex, flashcardData.questions.length - 1)
      )
      Cookies.set(progressKey, validIndex.toString(), { expires: 7 })
    }
  }, [currentIndex, progressKey, flashcardData])

  // SỬA LỖI 5: Logic useMemo giờ đã ĐÚNG
  const { currentQuestion, correctAnswer, totalQuestions, progressPercent } =
    useMemo(() => {
      if (
        !flashcardData ||
        !flashcardData.questions ||
        flashcardData.questions.length === 0
      ) {
        return {
          currentQuestion: null,
          correctAnswer: null,
          totalQuestions: 0,
          progressPercent: 0,
        }
      }

      const total = flashcardData.questions.length
      const validIndex = Math.max(0, Math.min(currentIndex, total - 1))

      if (currentIndex !== validIndex) {
        setCurrentIndex(validIndex)
      }

      const question = flashcardData.questions[validIndex]
      const answer =
        question?.answers.find(
          (a) => a.answerCode === question.correctAnswerCode
        ) || null
      const percent = Math.round(((validIndex + 1) / total) * 100)

      return {
        currentQuestion: question,
        correctAnswer: answer,
        totalQuestions: total,
        progressPercent: percent,
      }
    }, [flashcardData, currentIndex, setCurrentIndex]) // Thêm setCurrentIndex
  useEffect(() => {
    setJumpValue(currentIndex + 1)
  }, [currentIndex])

  const handleJumpChange = (value: number | null) => {
    setJumpValue(value)
  }

  // Xử lý khi người dùng nhấn Enter hoặc click ra ngoài ô input
  const handleJumpSubmit = () => {
    if (jumpValue !== null && jumpValue >= 1 && jumpValue <= totalQuestions) {
      const newIndex = jumpValue - 1 // Chuyển về index (0-based)
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex)
        setIsFlipped(false)
        setSlideDirection('initial') // Không dùng hiệu ứng trượt khi nhảy câu
      }
    } else {
      // Nếu input không hợp lệ (rỗng hoặc ngoài Tầm),
      // reset ô input về giá trị của câu hiện tại
      setJumpValue(currentIndex + 1)
    }
  }
  // --- Các hàm xử lý sự kiện ---
  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setSlideDirection('right') // <-- THÊM DÒNG NÀY
      setCurrentIndex((prev) => prev + 1)
      setIsFlipped(false) // Tự động lật về mặt câu hỏi khi chuyển
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSlideDirection('left') // <-- THÊM DÒNG NÀY
      setCurrentIndex((prev) => prev - 1)
      setIsFlipped(false) // Tự động lật về mặt câu hỏi khi chuyển
    }
  }

  const handleFlip = () => {
    setIsFlipped((prev) => !prev)
  }

  // --- Xử lý trạng thái Loading và Lỗi ---
  if (isInitialLoading && isApiLoading) {
    return (
      <Row justify='center' align='middle' style={{ minHeight: '100vh' }}>
        <Spin size='large' />
      </Row>
    )
  }

  if (isError && !flashcardData) {
    return (
      <Row justify='center' style={{ padding: '24px' }}>
        <Col xs={24} md={12}>
          <Alert
            message='Lỗi tải dữ liệu'
            description={
              (error as any)?.data?.message ||
              'Không thể tải dữ liệu flashcard. Vui lòng thử lại sau.'
            }
            type='error'
            showIcon
          />
        </Col>
      </Row>
    )
  }

  // Không có câu hỏi nào (hoặc flashcardData chưa kịp load)
  if (!currentQuestion || !flashcardData) {
    return (
      <Row justify='center' style={{ padding: '24px' }}>
        <Col xs={24} md={12}>
          <Alert
            message='Không có dữ liệu'
            description='Không tìm thấy câu hỏi nào trong bộ flashcard này.'
            type='info'
            showIcon
          />
        </Col>
      </Row>
    )
  }

  // --- Giao diện chính ---
  // SỬA LỖI 6: Giao diện UI giờ đã ĐÚNG
  return (
    <Row justify='center' style={{ padding: '24px' }}>
      <Col xs={24} sm={20} md={16} lg={12}>
        <Space direction='vertical' style={{ width: '100%' }} size='large'>
          <Typography.Title level={2} style={{ textAlign: 'center' }}>
            {flashcardData.subject.subjectName}
          </Typography.Title>

          {/* Thanh tiến độ */}
          <Progress percent={progressPercent} strokeColor='#da020e' />
          <Space.Compact
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography.Text style={{ paddingRight: '8px' }}>
              Câu
            </Typography.Text>
            <InputNumber
              value={jumpValue}
              onChange={handleJumpChange}
              onPressEnter={handleJumpSubmit}
              onBlur={handleJumpSubmit} // Tự động nhảy khi click ra ngoài
              min={1}
              max={totalQuestions}
              step={1}
              controls={false} // Ẩn nút mũi tên tăng/giảm cho gọn
              style={{ width: '5  0px ', textAlign: 'center' }}
            />
            <Typography.Text style={{ paddingLeft: '8px' }}>
              / {totalQuestions}
            </Typography.Text>
          </Space.Compact>

          {/* --- PHẦN THẺ FLASHCARD ĐÃ SỬA --- */}
          <Card
            style={{ minHeight: 400, overflow: 'hidden' }} // Thêm overflow: 'hidden'
            onClick={handleFlip} // Bạn vẫn có thể click vào thẻ để lật
            hoverable
            bodyStyle={{
              padding: 0, // Bỏ padding mặc định của Card
              minHeight: 350,
            }}
          >
            {/* SỬA ĐỔI: Thêm key và className động */}
            <div
              key={currentIndex} // <-- THÊM KEY ĐỂ KÍCH HOẠT ANIMATION
              className={`flip-card ${
                slideDirection === 'right'
                  ? 'slide-in-from-right'
                  : slideDirection === 'left'
                    ? 'slide-in-from-left'
                    : '' // 'initial' (lần tải đầu tiên) sẽ không có animation
              }`}
            >
              <div
                className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}
              >
                {/* Mặt TRƯỚC (Câu hỏi VÀ các đáp án) */}
                <div className='flip-card-front'>
                  <Space
                    direction='vertical'
                    size='middle'
                    style={{ width: '100%' }}
                  >
                    {/* Tiêu đề câu hỏi */}
                    <Typography.Title level={4} style={{ textAlign: 'left' }}>
                      {currentQuestion.title}
                    </Typography.Title>

                    {/* Các đáp án A, B, C, D */}
                    <Space
                      direction='vertical'
                      style={{
                        width: '100%',
                        alignItems: 'flex-start',
                        textAlign: 'left', // <-- THÊM DÒNG NÀY ĐỂ SỬA LỖI
                      }}
                    >
                      {currentQuestion.answers.map((ans) => (
                        <Typography.Text
                          key={ans.answerCode}
                          style={{
                            fontSize: '16px',
                            lineHeight: '1.5',
                            padding: '4px 0',
                          }}
                        >
                          <strong>{ans.answerCode}:</strong> {ans.answerText}
                        </Typography.Text>
                      ))}
                    </Space>
                  </Space>
                </div>

                {/* Mặt SAU (Chỉ đáp án) */}
                <div className='flip-card-back'>
                  <Space direction='vertical'>
                    <Typography.Title level={1}>
                      {correctAnswer?.answerCode}
                    </Typography.Title>
                  </Space>
                </div>
              </div>
            </div>
          </Card>
          {/* --- KẾT THÚC PHẦN SỬA --- */}

          {/* Nút lật thẻ (vẫn hoạt động) */}
          <Button
            type='primary'
            icon={<RetweetOutlined />}
            onClick={handleFlip}
            block
            size='large'
            style={{
              background: '#da020e',
            }}
          >
            {isFlipped ? 'Xem lại câu hỏi' : 'Xem đáp án'}
          </Button>

          {/* Nút điều hướng */}
          <Row justify='space-between'>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              Câu trước
            </Button>
            <Button
              icon={<ArrowRightOutlined />}
              onClick={handleNext}
              disabled={currentIndex === totalQuestions - 1}
            >
              Câu sau
            </Button>
          </Row>
        </Space>
      </Col>
    </Row>
  )
}
