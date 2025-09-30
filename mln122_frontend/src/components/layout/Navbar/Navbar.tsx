import React, { useState, useMemo, useEffect } from 'react'
import {
  LoginOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeFilled,
  QuestionCircleOutlined,
  MessageOutlined,
  BookOutlined,
} from '@ant-design/icons'
import hcmImage from '../../../assets/hcm.png'
import type { MenuProps } from 'antd'
import {
  Menu,
  Layout,
  Typography,
  ConfigProvider,
  Dropdown,
  Avatar,
  Space,
} from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'

const { Header } = Layout
const { Title, Text } = Typography

const StudentProjectNavbar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [current, setCurrent] = useState(() => {
    const path = location.pathname.split('/')[1] || 'home'
    return path
  })

  useEffect(() => {
    setCurrent(location.pathname.split('/')[1] || 'home')
  }, [location.pathname])

  const userData = useMemo(() => {
    const data = Cookies.get('userData')
    return data ? JSON.parse(data) : null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Cookies.get('userData')])

  // === Menu 1: Các mục điều hướng chính ===
  const mainItems: Required<MenuProps>['items'] = [
    {
      key: '',
      icon: <HomeFilled />,
      label: 'Trang chủ',
    },
    {
      key: 'chat',
      icon: <MessageOutlined />,
      label: 'Chat cùng AI',
    },
    {
      key: 'exam',
      icon: <BookOutlined />,
      label: 'Danh sách đề thi',
    },
    // {
    //   key: 'survey',
    //   icon: <QuestionCircleOutlined />,
    //   label: (
    //     <a
    //       href='https://docs.google.com/forms/d/e/1FAIpQLSe2SnyWiza1McOEzfMpTXIDHdYVTLE2zIOE5TFelCfLqnblmA/viewform'
    //       target='_blank'
    //       rel='noopener noreferrer'
    //     >
    //       Khảo sát
    //     </a>
    //   ),
    // },
    // Thêm các mục chính khác ở đây nếu cần
  ]

  // === Menu 2: Các mục dành cho người dùng (trong Dropdown) ===
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ cá nhân',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
    },
  ]

  const onMenuClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key)
    if (e.key === 'logout') {
      Cookies.remove('userData')
      Cookies.remove('userToken')
      navigate('/login')
    } else {
      navigate(`/${e.key}`)
    }
  }

  return (
    <Header
      style={{
        background: '#DA020E',
        padding: '0 40px',
      }}
    >
      <ConfigProvider
        theme={{
          token: { colorPrimary: '#ffffff' },
          components: {
            Menu: {
              itemColor: '#ffffff',
              itemHoverColor: '#ffffff',
              itemSelectedColor: '#ffffff',
              itemActiveBg: 'rgba(255, 255, 255, 0.1)',
              itemHoverBg: 'rgba(255, 255, 255, 0.1)',
              itemSelectedBg: 'rgba(255, 255, 255, 0.15)',
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
          <div
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <img
              src={hcmImage}
              alt='Hồ Chí Minh'
              style={{
                width: '40px',
                height: '38px',
                marginRight: '12px',
                borderRadius: '50%',
              }}
            />
            <Title level={4} style={{ margin: 0, color: '#ffffff' }}>
              Góc Học Tập FPT
            </Title>
          </div>

          {/* Menu chính ở giữa */}
          <Menu
            onClick={onMenuClick}
            selectedKeys={[current]}
            mode='horizontal'
            items={mainItems}
            style={{
              flex: 1,
              borderBottom: 'none',
              justifyContent: 'center',
              backgroundColor: '#DA020E',
            }}
          />

          {/* Khu vực người dùng bên phải */}
          <div
            style={{
              minWidth: '150px',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            {userData ? (
              <Dropdown
                menu={{ items: userMenuItems, onClick: onMenuClick }}
                placement='bottomRight'
                arrow
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space style={{ cursor: 'pointer' }}>
                    <Avatar>
                      {userData.picture ? (
                        <img src={userData.picture} alt='User Avatar' />
                      ) : (
                        <UserOutlined />
                      )}
                    </Avatar>
                    <Text strong style={{ color: '#ffffff' }}>
                      {userData.fullName || 'User'}
                    </Text>
                  </Space>
                </a>
              </Dropdown>
            ) : (
              <Menu
                mode='horizontal'
                onClick={() => navigate('/login')}
                items={[
                  { key: 'login', label: 'Đăng nhập', icon: <LoginOutlined /> },
                ]}
                style={{ borderBottom: 'none', backgroundColor: '#DA020E' }}
              />
            )}
          </div>
        </div>
      </ConfigProvider>
    </Header>
  )
}

export default StudentProjectNavbar
