import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Avatar } from 'antd';
import {
    BookOutlined,
    HeartOutlined,
    StarOutlined,
    TeamOutlined,
    GlobalOutlined,
    TrophyOutlined,
    FireOutlined
} from '@ant-design/icons';
import hcmImage from '../assets/hcm.png';
import './css/LandingPage.css';

const { Title, Paragraph, Text } = Typography;

const LandingPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string>('section-1');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const scrollToSection = (sectionId: string) => {
        setActiveSection(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const sections = [
        {
            id: 'section-1',
            title: 'Vai trò của đại đoàn kết dân tộc',
            icon: <TeamOutlined />,
            color: '#DA020E'
        },
        {
            id: 'section-2',
            title: 'Lực lượng và điều kiện thực hiện',
            icon: <GlobalOutlined />,
            color: '#B8151C'
        },
        {
            id: 'section-3',
            title: 'Ý nghĩa lịch sử và thực tiễn',
            icon: <TrophyOutlined />,
            color: '#8B0000'
        }
    ];

    return (
        <div className="landing-page">
            <div className="landing-container">

                {/* Hero Section */}
                <div className={`hero-section ${isVisible ? 'fade-in' : ''}`}>
                    <div className="hero-content">
                        <Avatar
                            size={120}
                            src={hcmImage}
                            className="hero-avatar animate-float"
                        />
                        <div className="hero-text">
                            <Title level={1} className="hero-title">
                                CHƯƠNG V
                            </Title>
                            <Title level={2} className="hero-subtitle">
                                TƯ TƯỞNG HỒ CHÍ MINH VỀ ĐẠI ĐOÀN KẾT DÂN TỘC
                            </Title>
                            <Text className="hero-description">
                                "Đoàn kết, đoàn kết, đại đoàn kết - Thành công, thành công, đại thành công"
                            </Text>
                        </div>
                    </div>
                    <div className="hero-decoration"></div>
                </div>

                {/* Navigation Menu */}
                <Card className="navigation-card slide-up">
                    <Title level={3} className="nav-title">
                        <BookOutlined /> Nội dung chương
                    </Title>
                    <div className="nav-buttons">
                        {sections.map((section, index) => (
                            <Button
                                key={section.id}
                                className={`nav-button ${activeSection === section.id ? 'active' : ''} animate-bounce-in`}
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
                <div className="content-sections">

                    {/* Section 1 */}
                    <Card
                        id="section-1"
                        className="content-section section-red slide-in-left"
                        title={
                            <div className="section-header">
                                <TeamOutlined className="section-icon" />
                                <span>1. Vai trò của đại đoàn kết dân tộc</span>
                            </div>
                        }
                    >
                        <div className="section-content">
                            <div className="highlight-box strategic-box">
                                <Title level={4} className="highlight-title">
                                    <StarOutlined /> Ý nghĩa chiến lược
                                </Title>
                                <Paragraph className="highlight-text">
                                    Hồ Chí Minh khẳng định: <em>"Cách mạng muốn thành công phải tập hợp được tất cả mọi lực
                                        lượng có thể tập hợp, xây dựng được khối đại đoàn kết dân tộc bền vững"</em>. Đại đoàn kết
                                    dân tộc là vấn đề <strong>sống còn, quyết định thành bại</strong> của cách mạng.
                                </Paragraph>
                            </div>

                            <div className="highlight-box success-box">
                                <Title level={4} className="highlight-title">
                                    <TrophyOutlined /> Thành tựu lịch sử
                                </Title>
                                <Paragraph className="highlight-text">
                                    Nhờ chính sách đoàn kết đúng đắn, nhân dân ta đã:
                                    <strong> Cách Mạng Tháng Tám thành công</strong>,
                                    <strong> kháng chiến thắng lợi</strong>, và
                                    <strong> xây dựng chủ nghĩa xã hội</strong> ở Miền Bắc.
                                </Paragraph>
                            </div>

                            <div className="quote-box animate-pulse-slow">
                                <Title level={3} className="quote-title">
                                    Triết lý cốt lõi
                                </Title>
                                <blockquote className="main-quote">
                                    "Đoàn kết, đoàn kết, đại đoàn kết<br />
                                    Thành công, thành công, đại thành công"
                                </blockquote>
                                <Text className="quote-description">
                                    <HeartOutlined /> Đoàn kết là sức mạnh •
                                    <StarOutlined /> Đoàn kết là thắng lợi •
                                    <FireOutlined /> Đoàn kết là then chốt thành công
                                </Text>
                            </div>

                            <div className="highlight-box mission-box">
                                <Title level={4} className="highlight-title">
                                    <GlobalOutlined /> Nhiệm vụ hàng đầu
                                </Title>
                                <Paragraph className="highlight-text">
                                    Mục đích Đảng Lao động Việt Nam: <strong>"Đoàn kết toàn dân, phụng sự tổ quốc"</strong> (3-3-1951).
                                    Đại đoàn kết là nhiệm vụ hàng đầu của Đảng và toàn dân tộc trong mọi giai đoạn cách mạng.
                                </Paragraph>
                            </div>
                        </div>
                    </Card>

                    {/* Section 2 */}
                    <Card
                        id="section-2"
                        className="content-section section-green slide-in-right"
                        title={
                            <div className="section-header">
                                <GlobalOutlined className="section-icon" />
                                <span>2. Lực lượng và điều kiện thực hiện</span>
                            </div>
                        }
                    >
                        <div className="section-grid">
                            <div className="grid-column">
                                <Title level={4} className="column-title">
                                    👥 Lực lượng đoàn kết
                                </Title>

                                <div className="info-box unity-box">
                                    <Title level={5} className="info-title">Đại đoàn kết toàn dân</Title>
                                    <Paragraph className="info-text">
                                        <strong>"Mọi con dân nước Việt"</strong> - không phân biệt dân tộc, tín ngưỡng,
                                        "già trẻ, gái trai, giàu nghèo, quý tiện".
                                    </Paragraph>
                                    <div className="quote-highlight">
                                        <em>"Ai có tài, có đức, có sức, có lòng phụng sự tổ quốc và phục vụ nhân dân
                                            thì ta đoàn kết với họ"</em>
                                    </div>
                                </div>

                                <div className="info-box foundation-box">
                                    <Title level={5} className="info-title">Nền tảng đoàn kết</Title>
                                    <Paragraph className="info-text">
                                        <strong>Công nhân - nông dân</strong> và các tầng lớp lao động là
                                        <em>"nền, gốc của đại đoàn kết"</em> như nền nhà, gốc cây.
                                    </Paragraph>
                                </div>
                            </div>

                            <div className="grid-column">
                                <Title level={4} className="column-title">
                                    ⭐ Điều kiện thực hiện
                                </Title>

                                <div className="condition-list">
                                    <div className="condition-item tradition-item">
                                        <Title level={5} className="condition-title">1. Kế thừa truyền thống</Title>
                                        <Text className="condition-text">
                                            Yêu nước - nhân nghĩa - đoàn kết từ các Vua Hùng, Bà Trưng,
                                            Trần Hưng Đạo, Lê Lợi...
                                        </Text>
                                    </div>

                                    <div className="condition-item tolerance-item">
                                        <Title level={5} className="condition-title">2. Lòng khoan dung</Title>
                                        <Text className="condition-text">
                                            <em>"Sông to, biển rộng thì bao nhiêu nước cũng chứa được"</em>
                                        </Text>
                                        <Text className="condition-sub">
                                            Đoàn kết với mọi người có lòng yêu nước, kể cả những người từng lầm lạc
                                        </Text>
                                    </div>

                                    <div className="condition-item trust-item">
                                        <Title level={5} className="condition-title">3. Niềm tin vào dân</Title>
                                        <Text className="condition-text">
                                            <strong>"Nước lấy dân làm gốc"</strong> - Dân là nguồn sức mạnh vô tận,
                                            quyết định thắng lợi cách mạng
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="philosophy-box animate-glow">
                            <Title level={4} className="philosophy-title">
                                🌟 Triết lý đoàn kết sâu sắc
                            </Title>
                            <blockquote className="philosophy-quote">
                                "Trong mấy triệu người, cũng có người thế này, thế khác, nhưng thế này hay thế khác
                                đều giòng dõi của tổ tiên ta. Vậy nên ta phải khoan hồng, đại độ."
                            </blockquote>
                            <div className="philosophy-points">
                                <span>🤝 Ai cũng có lòng yêu nước</span>
                                <span>🌟 Cảm hóa bằng tình thân ái</span>
                                <span>🎯 Hướng tới tương lai vẻ vang</span>
                            </div>
                        </div>
                    </Card>

                    {/* Summary Section */}
                    <Card className="summary-section slide-up">
                        <Title level={3} className="summary-title">
                            🌟 Những điểm nhấn quan trọng
                        </Title>
                        <div className="summary-grid">
                            <div className="summary-item strategic-item animate-bounce-in">
                                <div className="summary-icon">🏛️</div>
                                <Title level={4} className="summary-item-title">Ý nghĩa chiến lược</Title>
                                <Text className="summary-text">
                                    Vấn đề sống còn, quyết định thành bại cách mạng
                                </Text>
                            </div>
                            <div className="summary-item unity-item animate-bounce-in" style={{ animationDelay: '0.2s' }}>
                                <div className="summary-icon">👥</div>
                                <Title level={4} className="summary-item-title">Đoàn kết toàn dân</Title>
                                <Text className="summary-text">
                                    Mọi con dân Việt Nam, không phân biệt xuất thân
                                </Text>
                            </div>
                            <div className="summary-item trust-item animate-bounce-in" style={{ animationDelay: '0.4s' }}>
                                <div className="summary-icon">❤️</div>
                                <Title level={4} className="summary-item-title">Khoan dung - Tin dân</Title>
                                <Text className="summary-text">
                                    Cảm hóa bằng tình thương, dựa vào sức mạnh nhân dân
                                </Text>
                            </div>
                        </div>
                    </Card>

                    {/* Study Notes */}
                    <Card className="study-notes slide-in-left">
                        <Title level={3} className="notes-title">
                            📚 Ghi chú học tập
                        </Title>
                        <div className="notes-grid">
                            <div className="notes-column">
                                <Title level={4} className="notes-subtitle">Câu nói nổi tiếng:</Title>
                                <ul className="notes-list">
                                    <li>"Đoàn kết, đoàn kết, đại đoàn kết"</li>
                                    <li>"Đoàn kết toàn dân, phụng sự tổ quốc"</li>
                                    <li>"Dễ trăm lần không dân cũng chịu"</li>
                                </ul>
                            </div>
                            <div className="notes-column">
                                <Title level={4} className="notes-subtitle">Ý tưởng cốt lõi:</Title>
                                <ul className="notes-list">
                                    <li>Đoàn kết = sức mạnh vô địch</li>
                                    <li>Nhân dân = gốc, nền của mọi thắng lợi</li>
                                    <li>Khoan dung = điều kiện đoàn kết</li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
