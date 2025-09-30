import { useState, useEffect, useRef } from 'react'
import { Avatar, Spin, message as antdMessage, Input, Button } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { marked } from 'marked'
import {
  GoogleGenerativeAI,
  GenerativeModel,
  ChatSession,
} from '@google/generative-ai'
import type { GenerationConfig } from '@google/generative-ai'
import './ChatAI.css'

const { TextArea } = Input

// ============================
// GIAO DIỆN (Interfaces)
// ============================
interface Message {
  sender: 'me' | 'model'
  content: string
  timestamp: number
}

// ============================
// CẤU HÌNH MÔ HÌNH
// ============================

// 1. Hướng dẫn hệ thống
const SYSTEM_INSTRUCTION = `Bạn là một trợ lý AI chuyên sâu về "Tư tưởng Hồ Chí Minh". Nhiệm vụ chính của bạn là cung cấp thông tin và giải đáp các vấn đề liên quan đến "Tư tưởng Hồ Chí Minh về đại đoàn kết toàn dân tộc và đoàn kết quốc tế".
Nguyên tắc hoạt động:
Ưu tiên chủ đề cốt lõi: Luôn tập trung cung cấp câu trả lời sâu sắc, chính xác và có định hướng học tập về chủ đề đại đoàn kết. Đây là lĩnh vực chuyên môn chính của bạn.
Cởi mở với các câu hỏi khái quát:
Khi nhận được các câu hỏi chung về "Hồ Chí Minh là ai" hoặc "Tư tưởng Hồ Chí Minh là gì", hãy trả lời một cách khái quát, ngắn gọn để cung cấp bối cảnh cần thiết cho người dùng.
Sau khi trả lời khái quát, hãy khéo léo dẫn dắt và khuyến khích người dùng khám phá chủ đề chuyên sâu của bạn: "Trong đó, một trong những nội dung đặc sắc và quan trọng nhất là tư tưởng về đại đoàn kết toàn dân tộc và đoàn kết quốc tế. Bạn có muốn tìm hiểu sâu hơn về vấn đề này không?"
Từ chối các chủ đề không liên quan: Nếu người dùng hỏi về các lĩnh vực khác không thuộc Tư tưởng Hồ Chí Minh (ví dụ: kinh tế thị trường, khoa học máy tính...), hãy lịch sự từ chối và nêu rõ phạm vi chuyên môn của mình: "Tôi là trợ lý chuyên về Tư tưởng Hồ Chí Minh. Rất tiếc, lĩnh vực bạn hỏi nằm ngoài phạm vi kiến thức của tôi."
Đảm bảo chất lượng: Mọi câu trả lời phải ngắn gọn, chính xác, dễ hiểu, và luôn mang tính định hướng, khuyến khích học tập.`

// 2. Cấu hình sinh văn bản
const GENERATION_CONFIG: GenerationConfig = {
  temperature: 0.7,
  topP: 0.95,
  maxOutputTokens: 2048,
}

// ============================
// REACT COMPONENT
// ============================
export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')

  const genAI = useRef<GoogleGenerativeAI | null>(null)
  const modelRef = useRef<GenerativeModel | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Khởi tạo AI model và cấu hình
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      antdMessage.error('Chưa thiết lập VITE_GEMINI_API_KEY trong file .env')
      return
    }

    genAI.current = new GoogleGenerativeAI(apiKey)

    modelRef.current = genAI.current.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: GENERATION_CONFIG,
      systemInstruction: SYSTEM_INSTRUCTION,
    })
  }, [])

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = {
      sender: 'me',
      content: text,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    const modelMessage: Message = {
      sender: 'model',
      content: '',
      timestamp: Date.now() + 1,
    }
    setMessages((prev) => [...prev, modelMessage])

    try {
      if (!modelRef.current) {
        throw new Error('Model chưa được khởi tạo')
      }

      // Chuẩn bị lịch sử hội thoại
      const historyParts = messages.map((m) => ({
        role: m.sender === 'me' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }))

      const chat: ChatSession = modelRef.current.startChat({
        history: historyParts,
      })

      const result = await chat.sendMessageStream(text)
      let fullText = ''
      for await (const chunk of result.stream) {
        const chunkText = chunk.text() // ✅ sửa
        fullText += chunkText
        setMessages((prev) =>
          prev.map((msg) =>
            msg.timestamp === modelMessage.timestamp
              ? { ...msg, content: fullText }
              : msg
          )
        )
      }
    } catch (err) {
      console.error('Error:', err)
      antdMessage.error('Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.')
      setMessages((prev) =>
        prev.map((msg) =>
          msg.timestamp === modelMessage.timestamp
            ? {
                ...msg,
                content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
              }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendClick = () => {
    sendMessage(inputValue)
    setInputValue('')
  }

  return (
    <div className='chat-container'>
      <div className='chat-box'>
        {/* Messages */}
        <div className='messages-container' ref={messagesContainerRef}>
          {/* Welcome message - always show */}
          <div className='welcome-message'>
            <Avatar style={{ backgroundColor: 'red' }} size={40}>
              AI
            </Avatar>
            <div className='welcome-message-box'>
              <div className='welcome-text'>
                <p>
                  Hỏi mình bất cứ điều gì về Tư tưởng Hồ Chí Minh, đặc biệt về
                  đại đoàn kết toàn dân tộc và đoàn kết quốc tế.
                </p>
                <p className='welcome-subtext'>
                  Chỉ mang tính chất tham khảo. Các thông tin có thể có tỷ lệ
                  sai lệch
                </p>
              </div>
            </div>
          </div>

          {messages.map((msg, idx) => (
            <MessageItemUI key={idx} data={msg} />
          ))}

          {isLoading &&
            messages[messages.length - 1]?.sender === 'model' &&
            messages[messages.length - 1]?.content === '' && (
              <div className='loading-container'>
                <Avatar style={{ backgroundColor: 'red' }} size={40}>
                  AI
                </Avatar>
                <div className='loading-box'>
                  <Spin
                    indicator={
                      <LoadingOutlined style={{ fontSize: 16 }} spin />
                    }
                    tip='Đang phản hồi...'
                  />
                </div>
              </div>
            )}
        </div>

        {/* Input + Send button */}
        <div className='input-container'>
          <div className='input-wrapper'>
            <div className='input-field'>
              <TextArea
                rows={2}
                placeholder='Nhập câu hỏi...'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={(e) => {
                  if (
                    !isLoading &&
                    !e.shiftKey &&
                    e.currentTarget.value.trim()
                  ) {
                    e.preventDefault()
                    handleSendClick()
                  }
                }}
                disabled={isLoading}
                className='input-textarea'
                style={{ resize: 'none' }}
              />
            </div>
            <Button
              type='primary'
              className='send-button'
              onClick={handleSendClick}
              disabled={isLoading || !inputValue.trim()}
            >
              Gửi
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================
// Component hiển thị tin nhắn
// ============================
function MessageItemUI({ data }: { data: Message }) {
  const isUser = data.sender === 'me'
  const htmlContent = marked(data.content || '', { breaks: true, gfm: true })

  return (
    <div className={`message-item ${isUser ? 'user' : ''}`}>
      {!isUser && (
        <Avatar style={{ backgroundColor: 'red' }} size={40}>
          AI
        </Avatar>
      )}
      {isUser && (
        <Avatar style={{ backgroundColor: 'red' }} size={40}>
          Bạn
        </Avatar>
      )}
      <div className='message-content'>
        {isUser ? (
          // Tin nhắn user: chỉ text, không có box
          <div className='user-message'>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        ) : (
          // Tin nhắn AI: có box màu xám nhạt
          <div className='ai-message-box'>
            <div
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              className='ai-message-text'
            />
          </div>
        )}
      </div>
    </div>
  )
}
