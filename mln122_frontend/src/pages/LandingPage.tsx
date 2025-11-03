import React, { useState, useEffect, useRef } from 'react'
import { Card, Typography, Button, Tag, Divider, Timeline } from 'antd'
import {
  BookOutlined,
  CalendarOutlined,
  StarOutlined,
  FlagOutlined,
  TrophyOutlined,
  RiseOutlined,
  HistoryOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  BankOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  BulbOutlined,
} from '@ant-design/icons'
import './css/LandingPage.css'

const { Title, Paragraph, Text } = Typography

// Vietnam Flag Icon Component - Badge Style
const VietnamFlagIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 24,
  className,
}) => {
  const flagWidth = size * 1.5
  const flagHeight = size

  return (
    <svg
      width={flagWidth}
      height={flagHeight + size * 0.3}
      viewBox={`0 0 ${flagWidth} ${flagHeight + size * 0.3}`}
      className={`vietnam-flag-icon ${className || ''}`}
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        {/* Gradient for glossy effect */}
        <linearGradient id='redGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
          <stop offset='0%' stopColor='#ff1a1a' />
          <stop offset='100%' stopColor='#cc0000' />
        </linearGradient>
        <linearGradient id='starGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
          <stop offset='0%' stopColor='#ffeb3b' />
          <stop offset='100%' stopColor='#fbc02d' />
        </linearGradient>
        {/* Shadow filter */}
        <filter id='shadow'>
          <feDropShadow dx='1' dy='1' stdDeviation='1' floodOpacity='0.3' />
        </filter>
      </defs>

      {/* Flag Pole */}
      <rect
        x='0'
        y={size * 0.1}
        width={size * 0.15}
        height={flagHeight * 0.9}
        fill='#ffffff'
        stroke='#000000'
        strokeWidth='1'
        filter='url(#shadow)'
      />

      {/* Flag Background (Red with gradient) */}
      <rect
        x={size * 0.15}
        y='0'
        width={flagWidth * 0.85}
        height={flagHeight}
        fill='url(#redGradient)'
        stroke='#000000'
        strokeWidth='1.2'
        rx='2'
        filter='url(#shadow)'
      />

      {/* Wavy right edge */}
      <path
        d={`M ${flagWidth * 0.85 + size * 0.15} 0 Q ${flagWidth * 0.85 + size * 0.13} ${flagHeight * 0.2} ${flagWidth * 0.85 + size * 0.15} ${flagHeight * 0.4} Q ${flagWidth * 0.85 + size * 0.13} ${flagHeight * 0.6} ${flagWidth * 0.85 + size * 0.15} ${flagHeight * 0.8} Q ${flagWidth * 0.85 + size * 0.13} ${flagHeight} ${flagWidth * 0.85 + size * 0.15} ${flagHeight}`}
        fill='none'
        stroke='#000000'
        strokeWidth='1.2'
      />

      {/* Yellow Star in center */}
      <path
        d={`M ${flagWidth * 0.5} ${flagHeight * 0.3} L ${flagWidth * 0.55} ${flagHeight * 0.45} L ${flagWidth * 0.65} ${flagHeight * 0.5} L ${flagWidth * 0.575} ${flagHeight * 0.6} L ${flagWidth * 0.585} ${flagHeight * 0.7} L ${flagWidth * 0.5} ${flagHeight * 0.65} L ${flagWidth * 0.415} ${flagHeight * 0.7} L ${flagWidth * 0.425} ${flagHeight * 0.6} L ${flagWidth * 0.35} ${flagHeight * 0.5} L ${flagWidth * 0.45} ${flagHeight * 0.45} Z`}
        fill='url(#starGradient)'
        stroke='#000000'
        strokeWidth='1'
        filter='url(#shadow)'
      />

      {/* Glossy highlight effect */}
      <ellipse
        cx={flagWidth * 0.4}
        cy={flagHeight * 0.3}
        rx={flagWidth * 0.15}
        ry={flagHeight * 0.1}
        fill='rgba(255, 255, 255, 0.2)'
      />
    </svg>
  )
}

// Floating Flags Component
const FloatingFlags: React.FC = () => {
  const flags = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 20,
    duration: 5 + Math.random() * 10,
  }))

  return (
    <div className='floating-flags-container'>
      {flags.map((flag) => (
        <div
          key={flag.id}
          className='floating-flag'
          style={
            {
              '--flag-left': `${flag.left}%`,
              '--flag-delay': `${flag.delay}s`,
              '--flag-duration': `${flag.duration}s`,
            } as React.CSSProperties
          }
        >
          <VietnamFlagIcon size={24} />
        </div>
      ))}
    </div>
  )
}

// Click Effect Component
interface ClickEffect {
  id: number
  x: number
  y: number
}

const LandingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('intro')
  const [isScrolled, setIsScrolled] = useState(false)
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([])
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const clickEffectIdRef = useRef(0)

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      root: null,
      rootMargin: '-100px',
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-view')
          const sectionId = entry.target.getAttribute('data-section')
          if (sectionId) {
            setActiveSection(sectionId)
          }
        }
      })
    }, observerOptions)

    // Observe all content sections
    const sections = document.querySelectorAll('[data-section]')
    sections.forEach((section) => observer.observe(section))

    // Scroll listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      const scrollPosition = window.scrollY + 200
      sections.forEach((section) => {
        const element = section as HTMLElement
        const { offsetTop, offsetHeight } = element
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          const id = element.getAttribute('data-section')
          if (id) setActiveSection(id)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)

    // Click effect handler
    const handleClick = (e: MouseEvent) => {
      const newEffect: ClickEffect = {
        id: clickEffectIdRef.current++,
        x: e.clientX,
        y: e.clientY,
      }
      setClickEffects((prev) => [...prev, newEffect])

      // Remove effect after animation
      setTimeout(() => {
        setClickEffects((prev) =>
          prev.filter((effect) => effect.id !== newEffect.id)
        )
      }, 2000)
    }

    document.addEventListener('click', handleClick)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId]
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  const navItems = [
    { id: 'intro', label: 'Giới thiệu', icon: <BulbOutlined /> },
    { id: 'section-1', label: '1975-1981', icon: <HistoryOutlined /> },
    { id: 'section-2', label: 'Đại hội V', icon: <RocketOutlined /> },
    { id: 'summary', label: 'Tóm tắt', icon: <StarOutlined /> },
  ]

  return (
    <div className='modern-landing'>
      {/* Floating Flags */}
      <FloatingFlags />

      {/* Click Effects */}
      {clickEffects.map((effect) => (
        <div
          key={effect.id}
          className='click-effect'
          style={
            {
              '--click-x': `${effect.x}px`,
              '--click-y': `${effect.y}px`,
            } as React.CSSProperties
          }
        >
          <div className='click-ripple'></div>
          <div className='click-ripple delay-1'></div>
          <div className='click-ripple delay-2'></div>
          <VietnamFlagIcon size={32} className='click-flag' />
          <StarOutlined className='click-star star-1' />
          <StarOutlined className='click-star star-2' />
          <StarOutlined className='click-star star-3' />
        </div>
      ))}

      {/* Internal Navigation - Only for scrolling within page */}
      <nav
        className={`modern-nav internal-nav ${isScrolled ? 'scrolled' : ''}`}
      >
        <div className='nav-container'>
          <div className='nav-brand'>
            <FlagOutlined />
            <span>Nội dung trang</span>
          </div>
          <div className='nav-links'>
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => scrollToSection(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className='modern-hero'
        data-section='intro'
        ref={(el) => (sectionRefs.current['intro'] = el as HTMLDivElement)}
      >
        <div className='hero-background'>
          <div className='gradient-orb orb-1'></div>
          <div className='gradient-orb orb-2'></div>
          <div className='gradient-orb orb-3'></div>
        </div>
        <div className='hero-content-wrapper'>
          <div className='hero-badge'>
            <CalendarOutlined /> Giai đoạn 1975 - 1986
          </div>
          <h1 className='hero-title'>
            Lịch Sử Đảng Lãnh Đạo Việt Nam
            <span className='title-accent'>1975 - 1986</span>
          </h1>
          <p className='hero-subtitle'>
            Xây dựng Chủ nghĩa Xã hội và Bảo vệ Tổ quốc trong thời kỳ bản lề
          </p>
          <div className='hero-actions'>
            <Button
              type='primary'
              size='large'
              onClick={() => scrollToSection('section-1')}
              className='hero-btn-primary'
            >
              <BookOutlined /> Khám phá ngay
            </Button>
            <Button
              size='large'
              onClick={() => scrollToSection('summary')}
              className='hero-btn-secondary'
            >
              Xem tóm tắt
            </Button>
          </div>
          <div className='hero-stats'>
            <div className='stat-item'>
              <div className='stat-number'>1975</div>
              <div className='stat-label'>Thống nhất đất nước</div>
            </div>
            <div className='stat-item'>
              <div className='stat-number'>1982</div>
              <div className='stat-label'>Đại hội V</div>
            </div>
            <div className='stat-item'>
              <div className='stat-number'>1986</div>
              <div className='stat-label'>Tiền đề Đổi mới</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className='main-content'>
        {/* Introduction Card */}
        <section className='intro-card-wrapper' data-section='intro'>
          <div className='glass-card intro-card'>
            <div className='card-header'>
              <BulbOutlined className='header-icon' />
              <Title level={2} className='card-title'>
                Giới thiệu
              </Title>
            </div>
            <Paragraph className='intro-description'>
              Giai đoạn <strong>1975 – 1986</strong> đánh dấu những năm đầu tiên
              sau khi đất nước thống nhất. Đảng Cộng sản Việt Nam lãnh đạo toàn
              dân thực hiện hai nhiệm vụ song song:{' '}
              <strong>
                Xây dựng Chủ nghĩa Xã hội (CNXH) và Bảo vệ Tổ quốc
              </strong>
              . Đây là thời kỳ đầy thử thách, đặt nền móng cho công cuộc Đổi mới
              sau này.
            </Paragraph>
          </div>
        </section>

        {/* Section 1: 1975-1981 */}
        <section
          className='timeline-section'
          data-section='section-1'
          ref={(el) =>
            (sectionRefs.current['section-1'] = el as HTMLDivElement)
          }
        >
          <div className='section-header-modern'>
            <div className='section-badge'>PHẦN I</div>
            <Title level={1} className='section-title-modern'>
              Thời Kỳ 1975 – 1981
            </Title>
            <Text className='section-subtitle-modern'>
              Thống nhất và những khó khăn ban đầu
            </Text>
          </div>

          {/* Bối cảnh */}
          <div className='feature-grid'>
            <Card className='feature-card glass-card' bordered={false}>
              <div className='card-icon-wrapper'>
                <FlagOutlined className='card-icon' />
              </div>
              <Title level={4} className='feature-title'>
                Bối cảnh
              </Title>
              <Divider />
              <div className='context-items'>
                <div className='context-item-modern'>
                  <Tag color='blue' className='context-tag'>
                    Trong nước
                  </Tag>
                  <Paragraph>
                    Thống nhất về mặt lãnh thổ nhưng{' '}
                    <strong>khác biệt về trình độ phát triển</strong> giữa hai
                    miền. Kinh tế kiệt quệ, cơ sở vật chất bị tàn phá, sản xuất
                    nông nghiệp lạc hậu, công nghiệp nhỏ bé.
                  </Paragraph>
                </div>
                <div className='context-item-modern'>
                  <Tag color='orange' className='context-tag'>
                    Quốc tế
                  </Tag>
                  <Paragraph>
                    Hệ thống XHCN suy yếu, căng thẳng với Trung Quốc, xung đột ở
                    Campuchia. Việt Nam thực hiện{' '}
                    <strong>nghĩa vụ quốc tế</strong>, bị bao vây, cấm vận kinh
                    tế.
                  </Paragraph>
                </div>
              </div>
            </Card>
          </div>

          {/* Chủ trương */}
          <Card className='policy-card glass-card' bordered={false}>
            <div className='card-icon-wrapper'>
              <ThunderboltOutlined className='card-icon' />
            </div>
            <Title level={3} className='policy-card-title'>
              Chủ trương
            </Title>
            <Timeline
              items={[
                {
                  dot: <StarOutlined style={{ fontSize: '16px' }} />,
                  children: (
                    <div className='timeline-item-content'>
                      <Text strong>Thống nhất đất nước:</Text>
                      <Paragraph>
                        Hoàn thiện bộ máy nhà nước, ra đời Nhà nước Cộng hòa
                        XHCN Việt Nam (1976).
                      </Paragraph>
                    </div>
                  ),
                },
                {
                  dot: <RiseOutlined style={{ fontSize: '16px' }} />,
                  children: (
                    <div className='timeline-item-content'>
                      <Text strong>Cải tạo quan hệ sản xuất ở miền Nam:</Text>
                      <Paragraph>
                        Cải tạo công thương nghiệp tư bản tư doanh, hợp tác hóa
                        nông nghiệp.
                      </Paragraph>
                    </div>
                  ),
                },
                {
                  dot: <BankOutlined style={{ fontSize: '16px' }} />,
                  children: (
                    <div className='timeline-item-content'>
                      <Text strong>Kế hoạch 5 năm (1976–1980):</Text>
                      <Paragraph>
                        Mục tiêu khôi phục kinh tế, bước đầu phát triển CNXH, ưu
                        tiên công–nông nghiệp, triển khai các công trình trọng
                        điểm (Thủy điện Hòa Bình).
                      </Paragraph>
                    </div>
                  ),
                },
                {
                  dot: <SafetyOutlined style={{ fontSize: '16px' }} />,
                  children: (
                    <div className='timeline-item-content'>
                      <Text strong>Quốc phòng – An ninh:</Text>
                      <Paragraph>
                        Bảo vệ biên giới Tây Nam (giúp Campuchia thoát chế độ
                        Pol Pot) và biên giới phía Bắc (Chiến tranh 1979).
                      </Paragraph>
                    </div>
                  ),
                },
              ]}
            />
          </Card>

          {/* Kết quả */}
          <div className='results-grid'>
            <Card className='result-card success-card' bordered={false}>
              <TrophyOutlined className='result-icon success-icon' />
              <Title level={4}>Thành tựu</Title>
              <Paragraph>
                Hệ thống chính trị thống nhất được củng cố, giữ vững độc lập chủ
                quyền.
              </Paragraph>
            </Card>
            <Card className='result-card warning-card' bordered={false}>
              <RiseOutlined className='result-icon warning-icon' />
              <Title level={4}>Hạn chế</Title>
              <Paragraph>
                Kinh tế chậm phát triển, mất cân đối nghiêm trọng, lạm phát cao.
                Cơ chế quản lý tập trung quan liêu bao cấp bộc lộ sự không phù
                hợp.
              </Paragraph>
            </Card>
          </div>
        </section>

        {/* Section 2: Đại hội V */}
        <section
          className='timeline-section section-2'
          data-section='section-2'
          ref={(el) =>
            (sectionRefs.current['section-2'] = el as HTMLDivElement)
          }
        >
          <div className='section-header-modern'>
            <div className='section-badge badge-green'>PHẦN II</div>
            <Title level={1} className='section-title-modern'>
              Đại hội V và Những Bước Đột Phá
            </Title>
            <Text className='section-subtitle-modern'>1982 – 1986</Text>
          </div>

          {/* Bối cảnh */}
          <Card className='context-card glass-card' bordered={false}>
            <HistoryOutlined className='card-icon-large' />
            <Title level={3}>Bối cảnh trước Đại hội V</Title>
            <Paragraph>
              Nền kinh tế lâm vào <strong>khủng hoảng kéo dài</strong>, sản xuất
              trì trệ, lạm phát phi mã, đòi hỏi cấp thiết phải đổi mới tư duy
              quản lý.
            </Paragraph>
          </Card>

          {/* Đại hội V */}
          <Card className='congress-card glass-card' bordered={false}>
            <div className='congress-header'>
              <div className='congress-badge'>
                <RocketOutlined /> Đại hội V
              </div>
              <Text type='secondary'>Tháng 3/1982</Text>
            </div>
            <Title level={2}>Nhiệm vụ và mục tiêu</Title>
            <div className='congress-grid'>
              <div className='congress-item-modern'>
                <StarOutlined className='congress-item-icon' />
                <Title level={4}>Nhiệm vụ trung tâm</Title>
                <Text>Ổn định kinh tế – xã hội trong 5–10 năm.</Text>
              </div>
              <div className='congress-item-modern'>
                <ThunderboltOutlined className='congress-item-icon' />
                <Title level={4}>Khâu đột phá</Title>
                <Text>
                  Tập trung vào <strong>ba chương trình lớn</strong>: Lương thực
                  – thực phẩm, Hàng tiêu dùng, Hàng xuất khẩu.
                </Text>
              </div>
              <div className='congress-item-modern'>
                <RiseOutlined className='congress-item-icon' />
                <Title level={4}>Yêu cầu</Title>
                <Text>Cải tiến quản lý, từng bước hạn chế bao cấp.</Text>
              </div>
            </div>
          </Card>

          {/* Đột phá */}
          <Card className='breakthrough-card glass-card' bordered={false}>
            <RocketOutlined className='card-icon-large' />
            <Title level={2}>Các Bước Đột Phá (1982 – 1986)</Title>
            <div className='breakthrough-modern-grid'>
              <div className='breakthrough-modern-item'>
                <div className='breakthrough-icon'>🌾</div>
                <Title level={4}>Nông nghiệp</Title>
                <Paragraph>
                  Ban hành <strong>Chỉ thị 100-CT/TW (1981)</strong> – giao
                  khoán sản phẩm tới người lao động, đánh dấu thay đổi tư duy về
                  hạch toán kinh tế.
                </Paragraph>
              </div>
              <div className='breakthrough-modern-item'>
                <div className='breakthrough-icon'>🏭</div>
                <Title level={4}>Công nghiệp</Title>
                <Paragraph>
                  Thí điểm giao quyền tự chủ cho xí nghiệp quốc doanh.
                </Paragraph>
              </div>
              <div className='breakthrough-modern-item'>
                <div className='breakthrough-icon'>💰</div>
                <Title level={4}>Thương nghiệp</Title>
                <Paragraph>
                  Điều chỉnh giá, giảm dần bao cấp, bước đầu chấp nhận cơ chế
                  thị trường.
                </Paragraph>
              </div>
            </div>
          </Card>

          {/* Ý nghĩa */}
          <Card className='meaning-card glass-card' bordered={false}>
            <TrophyOutlined className='card-icon-large' />
            <Title level={2}>Ý nghĩa</Title>
            <div className='meaning-list-modern'>
              <div className='meaning-item-modern'>
                <CheckCircleOutlined className='check-icon' />
                <div>
                  <Text strong>
                    Tạo ra chuyển biến rõ rệt trong nông nghiệp, tăng sản lượng
                    lương thực.
                  </Text>
                </div>
              </div>
              <div className='meaning-item-modern'>
                <CheckCircleOutlined className='check-icon' />
                <div>
                  <Text strong>
                    Hình thành tư duy đổi mới bước đầu về cơ chế quản lý kinh
                    tế.
                  </Text>
                </div>
              </div>
              <div className='meaning-item-modern'>
                <CheckCircleOutlined className='check-icon' />
                <div>
                  <Text strong>
                    Là tiền đề lý luận và thực tiễn cho đường lối Đổi mới tại
                    Đại hội VI (1986).
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Summary Section */}
        <section
          className='summary-section-modern'
          data-section='summary'
          ref={(el) => (sectionRefs.current['summary'] = el as HTMLDivElement)}
        >
          <div className='summary-header'>
            <StarOutlined className='summary-header-icon' />
            <Title level={1}>Những điểm nhấn quan trọng</Title>
          </div>
          <div className='summary-cards-grid'>
            <Card className='summary-card-modern card-1' bordered={false}>
              <div className='summary-card-icon'>🕰️</div>
              <Title level={3}>1975–1981</Title>
              <Paragraph>
                Thống nhất đất nước, khôi phục kinh tế, đối mặt với nhiều khó
                khăn ban đầu
              </Paragraph>
            </Card>
            <Card className='summary-card-modern card-2' bordered={false}>
              <div className='summary-card-icon'>🏛️</div>
              <Title level={3}>Đại hội V (1982)</Title>
              <Paragraph>
                Ba chương trình lớn: Lương thực – thực phẩm, Hàng tiêu dùng,
                Hàng xuất khẩu
              </Paragraph>
            </Card>
            <Card className='summary-card-modern card-3' bordered={false}>
              <div className='summary-card-icon'>🚀</div>
              <Title level={3}>Đột phá 1982–1986</Title>
              <Paragraph>
                Chỉ thị 100, cải cách quản lý kinh tế, tiền đề cho Đổi mới 1986
              </Paragraph>
            </Card>
          </div>
        </section>

        {/* Conclusion */}
        <section className='conclusion-section-modern'>
          <Card className='conclusion-card glass-card' bordered={false}>
            <Title level={2}>Kết luận</Title>
            <Paragraph className='conclusion-text-modern'>
              Giai đoạn <strong>1975 – 1986</strong> là thời kỳ bản lề. Dù mô
              hình kinh tế bao cấp đã bộc lộ hạn chế, những bước đột phá đầu
              tiên đã tạo tiền đề không thể thiếu cho sự ra đời của{' '}
              <strong>Đường lối Đổi mới toàn diện năm 1986</strong>.
            </Paragraph>
            <Divider />
            <div className='next-section-modern'>
              <RocketOutlined className='next-icon' />
              <div>
                <Text strong>Tiếp theo:</Text>
                <Paragraph>
                  Khám phá bước ngoặt lịch sử tại Đại hội VI (1986) và sự chuyển
                  đổi sang nền kinh tế thị trường định hướng xã hội chủ nghĩa.
                </Paragraph>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default LandingPage
