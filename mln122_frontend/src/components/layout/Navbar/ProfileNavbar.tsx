import { useState, useEffect } from 'react'
import { ConfigProvider, Layout, Menu } from 'antd'
import { UserOutlined, HistoryOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'

const { Header } = Layout

export default function ProfileNavbar() {
  const navigate = useNavigate()
  const location = useLocation()

  // Xác định key mặc định dựa trên URL hiện tại
  const [current, setCurrent] = useState(location.pathname)

  // Cập nhật key khi URL thay đổi
  useEffect(() => {
    setCurrent(location.pathname)
  }, [location.pathname])

  const items: MenuProps['items'] = [
    {
      key: '/profile',
      label: 'Hồ sơ cá nhân',
      icon: <UserOutlined />,
    },
    {
      key: '/all-results?pageNumber=1&pageSize=10',
      label: 'Lịch sử làm bài',
      icon: <HistoryOutlined />,
    },
  ]

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key)
  }

  return (
    <Header
      style={{
        background: '#DA020E',
        borderBottom: '1px solid #B8151C',
        padding: '0 50px',
        display: 'flex',
        justifyContent: 'center', // Căn giữa Menu
      }}
    >
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              // Màu chữ của item khi được chọn
              itemSelectedColor: '#ffffff',
              // Màu nền của item khi được chọn
              itemSelectedBg: 'rgba(255, 255, 255, 0.1)',
              // Màu chữ của item bình thường
              itemColor: 'rgba(255, 255, 255, 0.85)',
              // Màu chữ khi hover
              itemHoverColor: '#ffffff',
              // Màu nền khi hover
              itemHoverBg: 'rgba(255, 255, 255, 0.1)',

              colorPrimary: '#ffffff',
            },
          },
        }}
      >
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode='horizontal'
          items={items}
          style={{ lineHeight: '62px', borderBottom: 'none' }} // Chỉnh lại line-height và bỏ viền
        />
      </ConfigProvider>
    </Header>
  )
}
