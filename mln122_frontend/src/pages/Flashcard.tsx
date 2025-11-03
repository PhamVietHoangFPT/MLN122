import { Layout, Typography, List, Card, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useGetSubjectsQuery } from '../features/subjectAPI'

const { Content } = Layout
const { Title } = Typography

export default function Flashcard() {
  const navigate = useNavigate()
  const { data: subjectResponse } = useGetSubjectsQuery()

  // ... (Phần logic xử lý loading và error giữ nguyên)

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/flashcard/${subjectId}`)
  }

  return (
    <Layout style={{ minHeight: 'auto', marginTop: 0 }}>
      <Content
        style={{
          padding: '34px 50px',
          paddingTop: '48px', // Account for Navbar (64px) + spacing (16px)
          paddingBottom: '24px', // Reduced bottom padding
          minHeight: 'auto',
        }}
      >
        <Title
          level={2}
          style={{
            marginBottom: '24px',
            textAlign: 'center',
            marginTop: '0', // Remove margin-top since we have padding-top
          }}
        >
          Chọn môn học để bắt đầu
        </Title>
        <List
          grid={{
            gutter: 24,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 5,
            xxl: 6,
          }}
          dataSource={subjectResponse?.data}
          renderItem={(subject) => (
            <List.Item>
              <Card
                hoverable
                className='subject-card'
                onClick={() => handleSubjectClick(subject._id)}
                style={{
                  textAlign: 'center',
                  borderRadius: '12px',
                  minHeight: '150px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* === CẢI TIẾN BÊN TRONG CARD === */}
                <Space direction='vertical' size='middle'>
                  <Title level={4} style={{ color: '#262626', margin: 0 }}>
                    {subject.subjectName}
                  </Title>
                </Space>
                {/* ================================ */}
              </Card>
            </List.Item>
          )}
        />
      </Content>
    </Layout>
  )
}
