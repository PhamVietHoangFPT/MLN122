/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Layout,
  Menu,
  Input,
  Avatar,
  Button,
  Tooltip,
  Divider,
  ConfigProvider,
} from 'antd' // Thêm Spin
import {
  SearchOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BarChartOutlined,
  ExperimentOutlined,
} from '@ant-design/icons'
import Cookies from 'js-cookie'

const { Sider } = Layout
const { Search } = Input

export const SideBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  // Định nghĩa kiểu cho userData
  interface UserData {
    picture?: string
    fullName?: string
    email?: string
    [key: string]: any
  }

  // Lấy userData từ cookie và decode nó
  const userDataString = Cookies.get('userData')
  let userData: UserData = {}
  if (userDataString) {
    try {
      // Decode URI component trước khi parse JSON
      userData = JSON.parse(decodeURIComponent(userDataString))
    } catch (error) {
      console.error('Lỗi khi parse userData từ cookie:', error)
    }
  }

  // Get the current selected keys based on the pathname
  const getSelectedKeys = () => {
    const pathname = location.pathname

    if (pathname === '685d54822e239adc055c4abf') {
      return ['685d54822e239adc055c4abf']
    }

    const paths = ['exams', 'subjects', 'admin']

    for (const path of paths) {
      if (pathname.includes(path)) {
        const segments = pathname.split('/').filter(Boolean)
        if (segments.length > 1) {
          return [path, pathname.substring(1)]
        }
        return [path]
      }
    }
    return []
  }

  // Define the menu items
  const items = [
    {
      key: '685d54822e239adc055c4abf/admin',
      icon: <BarChartOutlined />,
      label: 'Quản trị',
      onClick: () => navigate('685d54822e239adc055c4abf/admin'),
    },
    {
      key: '685d54822e239adc055c4abf/subjects',
      icon: <BarChartOutlined />,
      label: 'Quản lý môn học',
      onClick: () => navigate('685d54822e239adc055c4abf/subjects'),
    },
    {
      key: '685d54822e239adc055c4abf/exams',
      icon: <BarChartOutlined />,
      label: 'Quản lý đề thi',
      onClick: () => navigate('685d54822e239adc055c4abf/exams'),
    },
  ]

  return (
    <Sider
      width={250}
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      trigger={null}
      theme='light'
      style={{
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
      }}
    >
      {/* Logo and Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ExperimentOutlined style={{ color: '#262626', fontSize: 20 }} />
          {!collapsed && (
            <span style={{ marginLeft: 12, fontWeight: 600 }}>VacciTrack</span>
          )}
        </div>
        {!collapsed && (
          <Button
            type='text'
            icon={<MenuFoldOutlined />}
            onClick={() => setCollapsed(true)}
            size='small'
          />
        )}
        {collapsed && (
          <Button
            type='text'
            icon={<MenuUnfoldOutlined />}
            onClick={() => setCollapsed(false)}
            size='small'
            style={{ marginTop: 16 }}
          />
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div style={{ padding: '12px 16px' }}>
          <Search
            placeholder='Search...'
            allowClear
            size='middle'
            prefix={<SearchOutlined />}
          />
        </div>
      )}

      {/* Navigation Menu */}
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              // Màu nền của item khi được chọn
              itemSelectedBg: '#262626',
              // Màu chữ của item khi được chọn
              itemSelectedColor: '#ffffff',
            },
          },
        }}
      >
        <Menu
          mode='inline'
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={
            getSelectedKeys().length > 0 ? [getSelectedKeys()[0]] : []
          }
          style={{ borderRight: 0 }}
          items={items}
        />
      </ConfigProvider>

      {/* User Profile */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: '16px',
          borderTop: '1px solid #f0f0f0',
          backgroundColor: '#fff',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: collapsed ? 0 : 12,
          }}
        >
          <Avatar>
            <img src={userData?.picture || ''} alt='' />
          </Avatar>
          {!collapsed && (
            <div style={{ marginLeft: 12 }}>
              <div style={{ fontWeight: 500, fontSize: 14, color: 'black' }}>
                {userData?.fullName || 'Admin User'}
              </div>
              <div style={{ fontSize: 12, color: 'black' }}>
                {userData?.email || 'admin@vaccitrack.com'}
              </div>
            </div>
          )}
        </div>
        {!collapsed && <Divider style={{ margin: '12px 0' }} />}
        <Tooltip title={collapsed ? 'Logout' : ''} placement='right'>
          <Button
            type='primary'
            danger
            icon={<LogoutOutlined />}
            onClick={() => {
              Cookies.remove('userData')
              Cookies.remove('userToken')
              navigate('/login')
            }}
            style={{ width: collapsed ? '100%' : '100%' }}
            size={collapsed ? 'middle' : 'middle'}
          >
            {!collapsed && 'Đăng xuất'}
          </Button>
        </Tooltip>
      </div>
    </Sider>
  )
}
