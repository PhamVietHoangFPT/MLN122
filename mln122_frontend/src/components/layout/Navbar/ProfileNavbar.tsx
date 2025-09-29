import { useState, useEffect } from 'react'
import { ConfigProvider, Layout, Menu } from 'antd'
import { UserOutlined, HistoryOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'

const { Header } = Layout

export default function ProfileNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [current, setCurrent] = useState(location.pathname)

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
        padding: '0 50px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {/* SỬA LẠI THEME TRONG ĐÂY */}
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              colorBgContainer: '#DA020E',
              itemColor: '#FFFFFF',
              itemSelectedColor: '#FFFFFF',
              horizontalItemSelectedColor: '#FFFFFF',
              itemHoverColor: '#FFFFFF', // Giữ màu chữ trắng khi hover

              // ✨ SỬA Ở ĐÂY: Đổi màu nền cho trạng thái hover và selected
              itemHoverBg: '#B8151C', // Nền khi di chuột qua -> ĐỎ ĐẬM
              itemSelectedBg: '#B8151C', // Nền khi được chọn -> ĐỎ ĐẬM
            },
          },
        }}
      >
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode='horizontal'
          items={items}
          style={{
            lineHeight: '62px',
            borderBottom: 'none',
            // Thêm minWidth để Menu không bị co lại quá nhỏ
            minWidth: '300px',
            justifyContent: 'center', // Căn giữa các item trong Menu
          }}
        />
      </ConfigProvider>
    </Header>
  )
}
