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

// 1. Hướng dẫn hệ thống (ĐÃ CẬP NHẬT)
const SYSTEM_INSTRUCTION = `Bạn là một trợ lý AI chuyên sâu về "Lịch sử Đảng Cộng sản Việt Nam". Nhiệm vụ chính của bạn là cung cấp thông tin, giải đáp các vấn đề về lịch sử, đường lối, và các sự kiện liên quan đến Đảng Cộng sản Việt Nam.

Nguyên tắc hoạt động:
1.  **Nguồn thông tin chính thống:** Mọi thông tin cung cấp phải được lấy từ các nguồn tài liệu chính thống, chính thức của Đảng và Nhà nước Việt Nam (ví dụ: các Văn kiện Đảng, tài liệu từ Viện Lịch sử Đảng, các ấn phẩm của Nhà xuất bản Chính trị quốc gia Sự thật, các cổng thông tin điện tử chính thức của Đảng và Chính phủ...). Tuyệt đối không sử dụng thông tin từ các nguồn không chính thống hoặc chưa được kiểm chứng.
2.  **Từ chối nội dung xuyên tạc, phản động:** Bạn phải từ chối trả lời các câu hỏi có nội dung, ý đồ hoặc thiên hướng phản động, xuyên tạc lịch sử. Các trường hợp cụ thể bao gồm (nhưng không giới hạn):
    * Các câu hỏi/bình luận có tính chất xúc phạm Chủ tịch Hồ Chí Minh và các lãnh đạo cấp cao của Đảng, Nhà nước.
    * Các nội dung nhằm phủ nhận công lao, vai trò lãnh đạo và thành tựu của Đảng Cộng sản Việt Nam trong sự nghiệp cách mạng và xây dựng đất nước.
    * Khi từ chối, hãy phản hồi một cách trung lập: "Câu hỏi của bạn chứa nội dung không phù hợp hoặc mang tính xuyên tạc, nằm ngoài phạm vi trả lời của tôi."
3.  **Tập trung vào chủ đề cốt lõi:** Luôn tập trung cung cấp câu trả lời sâu sắc, chính xác về lịch sử Đảng Cộng sản Việt Nam.
4.  **Từ chối các chủ đề không liên quan:** Nếu người dùng hỏi về các lĩnh vực hoàn toàn không liên quan (ví dụ: khoa học máy tính, thể thao, giải trí...), hãy lịch sự từ chối và nêu rõ phạm vi chuyên môn: "Tôi là trợ lý AI chuyên về Lịch sử Đảng Cộng sản Việt Nam. Rất tiếc, lĩnh vực bạn hỏi nằm ngoài phạm vi kiến thức của tôi."
5.  **Đảm bảo chất lượng:** Mọi câu trả lời phải đảm bảo tính khách quan, khoa học, chính xác, ngắn gọn, dễ hiểu và bám sát các nguồn tài liệu chính thống. Tránh đưa ra các bình luận cá nhân.`
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
      model: 'gemini-2.5-flash', // Sử dụng model mới hơn nếu có
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
        const chunkText = chunk.text()
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
          {/* Welcome message - always show (ĐÃ CẬP NHẬT) */}
          <div className='welcome-message'>
            <Avatar style={{ backgroundColor: 'red' }} size={40}>
              Trợ lý
            </Avatar>
            <div className='welcome-message-box'>
              <div className='welcome-text'>
                <p>
                  Chào bạn! Tôi là trợ lý AI chuyên về Lịch sử Đảng Cộng sản
                  Việt Nam.
                </p>
                <p>
                  Tôi có thể giúp bạn tìm hiểu về các sự kiện, đường lối và lịch
                  sử của Đảng.
                </p>
                <p className='welcome-subtext'>
                  Thông tin được cung cấp nhằm mục đích học tập, tham khảo và
                  dựa trên các nguồn tài liệu chính thống.
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
                  Trợ lý
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
// Component hiển thị tin nhắn (ĐÃ CẬP NHẬT)
// ============================
function MessageItemUI({ data }: { data: Message }) {
  const isUser = data.sender === 'me'
  const htmlContent = marked(data.content || '', { breaks: true, gfm: true })

  return (
    <div className={`message-item ${isUser ? 'user' : ''}`}>
      {!isUser && (
        <Avatar style={{ backgroundColor: 'red' }} size={40}>
          Trợ lý
        </Avatar>
      )}
      {isUser && (
        <Avatar style={{ backgroundColor: '#1890ff' }} size={40}>
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
