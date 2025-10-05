import React, { useState, useEffect } from 'react'
import { Card, Typography, Button, Avatar } from 'antd'
import {
  BookOutlined,
  HeartOutlined,
  StarOutlined,
  TeamOutlined,
  GlobalOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import hcmImage from '../assets/hcm.png' // Giữ lại hoặc thay đổi ảnh nếu bạn muốn
import './css/LandingPage.css'

const { Title, Paragraph, Text } = Typography

const LandingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('section-1')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const sections = [
    {
      id: 'section-1',
      title: 'CN Mác-Lênin và Tôn giáo ở VN',
      icon: <BookOutlined />,
      color: '#DA020E',
    },
    {
      id: 'section-2',
      title: 'Quan hệ Dân tộc và Tôn giáo',
      icon: <TeamOutlined />,
      color: '#B8151C',
    },
    {
      id: 'section-3',
      title: 'Chính sách và Giải pháp',
      icon: <GlobalOutlined />,
      color: '#8B0000',
    },
  ]

  return (
    <div className='landing-page'>
      <div className='landing-container'>
        {/* Hero Section */}
        <div className={`hero-section ${isVisible ? 'fade-in' : ''}`}>
          <div className='hero-content'>
            <Avatar
              size={120}
              src={hcmImage}
              className='hero-avatar animate-float'
            />
            <div className='hero-text'>
              <Title level={1} className='hero-title'>
                VẤN ĐỀ TÔN GIÁO VÀ DÂN TỘC
              </Title>
              <Title level={2} className='hero-subtitle'>
                TRONG THỜI KỲ QUÁ ĐỘ LÊN CHỦ NGHĨA XÃ HỘI Ở VIỆT NAM
              </Title>
              <Text className='hero-description'>
                "Bất kỳ ai cũng được hoàn toàn tự do theo tôn giáo mình thích,
                hoặc không thừa nhận một tôn giáo nào." - V.I. Lênin
              </Text>
            </div>
          </div>
          <div className='hero-decoration'></div>
        </div>

        {/* Navigation Menu */}
        <Card className='navigation-card slide-up'>
          <Title level={3} className='nav-title'>
            <BookOutlined /> Nội dung chính
          </Title>
          <div className='nav-buttons'>
            {sections.map((section, index) => (
              <Button
                key={section.id}
                className={`nav-button ${
                  activeSection === section.id ? 'active' : ''
                } animate-bounce-in`}
                style={{ animationDelay: `${index * 0.2}s` }}
                onClick={() => scrollToSection(section.id)}
                icon={section.icon}
              >
                {section.title}
              </Button>
            ))}
          </div>
        </Card>

        {/* Content Sections */}
        <div className='content-sections'>
          {/* Section 1 */}
          <Card
            id='section-1'
            className='content-section section-red slide-in-left'
            title={
              <div className='section-header'>
                <BookOutlined className='section-icon' />
                <span>I. Tôn giáo trong thời kỳ quá độ lên CNXH</span>
              </div>
            }
          >
            <div className='section-content'>
              <div className='highlight-box strategic-box'>
                <Title level={4} className='highlight-title'>
                  <StarOutlined /> Bản chất của Tôn giáo
                </Title>
                <Paragraph className='highlight-text'>
                  Theo Chủ nghĩa Mác-Lênin, tôn giáo là sự{' '}
                  <strong>phản ánh hư ảo hiện thực khách quan</strong>, phản ánh
                  sự bất lực của con người trước thế lực tự nhiên và áp bức xã
                  hội.
                </Paragraph>
              </div>

              <div className='highlight-box success-box'>
                <Title level={4} className='highlight-title'>
                  <TrophyOutlined /> Đặc điểm Tôn giáo ở Việt Nam
                </Title>
                <Paragraph className='highlight-text'>
                  Việt Nam là quốc gia <strong>đa tôn giáo</strong>, có truyền
                  thống <strong>"đồng hành cùng dân tộc"</strong>. Tín ngưỡng và
                  tôn giáo có sự giao thoa, hòa quyện, tạo nên bản sắc riêng.
                </Paragraph>
              </div>

              <div className='quote-box animate-pulse-slow'>
                <Title level={3} className='quote-title'>
                  Luận điểm nổi tiếng của C. Mác
                </Title>
                <blockquote className='main-quote'>
                  "Tôn giáo là tiếng thở dài của chúng sinh bị áp bức... Tôn
                  giáo là <strong>thuốc phiện</strong> của nhân dân."
                </blockquote>
                <Text className='quote-description'>
                  <HeartOutlined /> Mang ý nghĩa an ủi, làm dịu nỗi đau •
                  <StarOutlined /> Không chỉ mang ý nghĩa tiêu cực
                </Text>
              </div>

              <div className='highlight-box mission-box'>
                <Title level={4} className='highlight-title'>
                  <GlobalOutlined /> Vấn đề nhạy cảm
                </Title>
                <Paragraph className='highlight-text'>
                  Vấn đề tôn giáo dễ bị các thế lực thù địch lợi dụng để{' '}
                  <strong>chia rẽ khối đại đoàn kết</strong>, chống phá chế độ,
                  đặc biệt ở vùng dân tộc thiểu số.
                </Paragraph>
              </div>
            </div>
          </Card>

          {/* Section 2 */}
          <Card
            id='section-2'
            className='content-section section-green slide-in-right'
            title={
              <div className='section-header'>
                <TeamOutlined className='section-icon' />
                <span>II. Quan hệ Dân tộc và Tôn giáo ở Việt Nam</span>
              </div>
            }
          >
            <div className='section-grid'>
              <div className='grid-column'>
                <Title level={4} className='column-title'>
                  🤝 Đặc điểm quan hệ
                </Title>

                <div className='info-box unity-box'>
                  <Title level={5} className='info-title'>
                    Cơ sở thống nhất
                  </Title>
                  <Paragraph className='info-text'>
                    Thiết lập trên cơ sở <strong>cộng đồng quốc gia</strong> với
                    mục tiêu chung là độc lập, tự do, hạnh phúc.
                  </Paragraph>
                </div>

                <div className='info-box foundation-box'>
                  <Title level={5} className='info-title'>
                    Gắn bó hữu cơ
                  </Title>
                  <Paragraph className='info-text'>
                    Nhiều tôn giáo (như Phật giáo) đã đồng hành, trở thành{' '}
                    <strong>một phần của văn hóa dân tộc</strong>.
                  </Paragraph>
                </div>
              </div>

              <div className='grid-column'>
                <Title level={4} className='column-title'>
                  ⭐ Yếu tố chi phối
                </Title>

                <div className='condition-list'>
                  <div className='condition-item tradition-item'>
                    <Title level={5} className='condition-title'>
                      1. Tín ngưỡng truyền thống
                    </Title>
                    <Text className='condition-text'>
                      Thờ cúng tổ tiên, anh hùng dân tộc là nền tảng tinh thần
                      chung, dung hòa các tôn giáo.
                    </Text>
                  </div>

                  <div className='condition-item tolerance-item'>
                    <Title level={5} className='condition-title'>
                      2. Tính phức tạp
                    </Title>
                    <Text className='condition-text'>
                      Ở vùng dân tộc thiểu số, mâu thuẫn tôn giáo và dân tộc dễ
                      đan xen, bị lợi dụng gây mất ổn định.
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3 */}
          <Card
            id='section-3'
            className='content-section section-red slide-in-left'
            title={
              <div className='section-header'>
                <GlobalOutlined className='section-icon' />
                <span>III. Chính sách và Giải pháp</span>
              </div>
            }
          >
            <div className='section-content'>
              <div className='highlight-box strategic-box'>
                <Title level={4} className='highlight-title'>
                  <StarOutlined /> Chính sách của Đảng và Nhà nước
                </Title>
                <Paragraph className='highlight-text'>
                  <strong>Tôn trọng và bảo đảm</strong> quyền tự do tín ngưỡng,
                  tôn giáo. Đoàn kết đồng bào có đạo và không có đạo. Nghiêm cấm
                  lợi dụng tôn giáo để phá hoại.
                </Paragraph>
              </div>

              <div className='highlight-box mission-box'>
                <Title level={4} className='highlight-title'>
                  <GlobalOutlined /> Giải pháp căn bản
                </Title>
                <Paragraph className='highlight-text'>
                  <strong>Chăm lo phát triển kinh tế - xã hội</strong> ở vùng
                  dân tộc thiểu số, vùng đồng bào có đạo để nâng cao đời sống,
                  giải quyết tận gốc vấn đề.
                </Paragraph>
              </div>

              <div className='highlight-box success-box'>
                <Title level={4} className='highlight-title'>
                  <TrophyOutlined /> Giải pháp then chốt
                </Title>
                <Paragraph className='highlight-text'>
                  <strong>Kiên quyết đấu tranh</strong> chống các hành vi lợi
                  dụng vấn đề dân tộc, tôn giáo. Phát huy vai trò của các chức
                  sắc, nhà tu hành để vận động đồng bào sống "phụng đạo, yêu
                  nước".
                </Paragraph>
              </div>
            </div>
          </Card>

          {/* Summary Section */}
          <Card className='summary-section slide-up'>
            <Title level={3} className='summary-title'>
              🌟 Những điểm nhấn quan trọng
            </Title>
            <div className='summary-grid'>
              <div className='summary-item strategic-item animate-bounce-in'>
                <div className='summary-icon'>🏛️</div>
                <Title level={4} className='summary-item-title'>
                  Bản chất Tôn giáo
                </Title>
                <Text className='summary-text'>
                  Là hiện tượng xã hội, phản ánh hư ảo thực tại, tồn tại lâu dài
                </Text>
              </div>
              <div
                className='summary-item unity-item animate-bounce-in'
                style={{ animationDelay: '0.2s' }}
              >
                <div className='summary-icon'>🤝</div>
                <Title level={4} className='summary-item-title'>
                  Chính sách nhất quán
                </Title>
                <Text className='summary-text'>
                  Tôn trọng tự do tín ngưỡng, đoàn kết dân tộc, "tốt đời, đẹp
                  đạo"
                </Text>
              </div>
              <div
                className='summary-item trust-item animate-bounce-in'
                style={{ animationDelay: '0.4s' }}
              >
                <div className='summary-icon'>📈</div>
                <Title level={4} className='summary-item-title'>
                  Giải pháp gốc rễ
                </Title>
                <Text className='summary-text'>
                  Nâng cao đời sống vật chất & tinh thần của nhân dân
                </Text>
              </div>
            </div>
          </Card>

          {/* Study Notes */}
          <Card className='study-notes slide-in-left'>
            <Title level={3} className='notes-title'>
              📚 Ghi chú học tập
            </Title>
            <div className='notes-grid'>
              <div className='notes-column'>
                <Title level={4} className='notes-subtitle'>
                  Luận điểm chính:
                </Title>
                <ul className='notes-list'>
                  <li>"Tôn giáo là thuốc phiện của nhân dân" (C. Mác)</li>
                  <li>"Tôn trọng quyền tự do tín ngưỡng" (V.I. Lênin)</li>
                  <li>Tách Giáo hội ra khỏi Nhà nước</li>
                </ul>
              </div>
              <div className='notes-column'>
                <Title level={4} className='notes-subtitle'>
                  Ý tưởng cốt lõi:
                </Title>
                <ul className='notes-list'>
                  <li>Tôn giáo tồn tại lâu dài</li>
                  <li>Đoàn kết, gắn bó là chủ đạo</li>
                  <li>Chống lợi dụng tôn giáo để chia rẽ</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
