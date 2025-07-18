import React, { useState, useMemo, useEffect } from 'react'
import {
  LoginOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeFilled,
  BookOutlined, // Icon mới
  EditOutlined, // Icon mới
  QuestionCircleOutlined, // Icon mới
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Menu, Layout, Typography, ConfigProvider } from 'antd'
const { Header } = Layout
const { Title } = Typography
import { useNavigate, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'

const StudentProjectNavbar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // --- Giữ nguyên logic xử lý active key của bạn ---
  const [current, setCurrent] = useState(() => {
    const path = location.pathname.split('/')[1] || 'home'
    return path
  })

  useEffect(() => {
    setCurrent(location.pathname.split('/')[1] || 'home')
  }, [location.pathname])

  // --- Giữ nguyên logic lấy userData của bạn ---
  const userData = useMemo(() => {
    const data = Cookies.get('userData')
    return data ? JSON.parse(data) : null
  }, [Cookies.get('userData')])

  // === THAY ĐỔI: Cập nhật lại menu chính cho phù hợp dự án ===
  const mainItems = useMemo(() => {
    return [
      {
        key: 'home',
        icon: <HomeFilled style={{ fontSize: '16px', color: '#262626' }} />,
        label: 'Trang chủ',
        style: { fontSize: '16px' },
        url: '/',
      },
      {
        key: 'qa',
        icon: (
          <QuestionCircleOutlined
            style={{ fontSize: '16px', color: '#262626' }}
          />
        ),
        label: 'Hỏi Đáp',
        style: { fontSize: '16px' },
        url: '/qa',
      },
    ]
  }, [])

  // === THAY ĐỔI: Tinh gọn menu người dùng, bỏ các dịch vụ ADN ===
  const userItems = useMemo(() => {
    return [
      {
        key: userData ? 'profile' : 'login',
        icon: userData ? (
          <UserOutlined style={{ fontSize: '16px', color: '#262626' }} />
        ) : (
          <LoginOutlined style={{ fontSize: '16px', color: '#262626' }} />
        ),
        label: userData ? 'Hồ sơ cá nhân' : 'Đăng nhập / Đăng ký', // <-- TÍNH NĂNG MỚI
        style: { fontSize: '16px' },
        url: userData ? '/profile' : '/login',
      },
      // Giữ nguyên logic logout thông minh của bạn
      ...(userData
        ? [
            {
              key: 'logout',
              icon: <LogoutOutlined style={{ fontSize: '16px' }} />,
              label: 'Đăng xuất',
              style: { fontSize: '16px', color: 'red' },
              onClick: () => {
                Cookies.remove('userData')
                Cookies.remove('userToken') // Giả sử bạn cũng có userToken
                navigate('/login')
              },
            },
          ]
        : []),
    ]
  }, [userData, navigate])

  // --- Giữ nguyên logic onClick để điều hướng của bạn ---
  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key)
    const findItem = (items: any[], key: string): any | null => {
      for (const item of items) {
        if (item.key === key) return item
      }
      return null
    }

    const allItems = [...mainItems, ...userItems]
    const item = findItem(allItems, e.key)
    if (item?.url) {
      navigate(item.url)
    }
    if (item?.onClick) {
      item.onClick()
    }
  }

  return (
    <Header style={{ background: '#fff', padding: '0 40px' }}>
      {/* Bọc các Menu bằng ConfigProvider */}
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              // Màu chữ của item khi được chọn
              itemSelectedColor: '#262626',
              // Màu nền của item khi được chọn (đổi thành màu xám nhạt để dễ nhìn)
              itemSelectedBg: '#f0f0f0',

              colorPrimary: '#262626',
            },
          },
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
          }}
        >
          {/* Phần Logo/Tên dự án */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <BookOutlined
              style={{
                fontSize: '28px',
                color: '#262626',
                marginRight: '12px',
              }}
            />
            <Title level={4} style={{ margin: 0 }}>
              Góc Học Tập FPT
            </Title>
          </div>

          {/* Phần Menu chính (bên phải logo) */}
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode='horizontal'
            items={mainItems}
            style={{ flex: 1, borderBottom: 'none', justifyContent: 'center' }}
          />

          {/* Phần Menu người dùng (bên phải cùng) */}
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode='horizontal'
            items={userItems}
            style={{
              borderBottom: 'none',
              minWidth: '200px',
              justifyContent: 'flex-end',
            }}
          />
        </div>
      </ConfigProvider>
    </Header>
  )
}

export default StudentProjectNavbar
