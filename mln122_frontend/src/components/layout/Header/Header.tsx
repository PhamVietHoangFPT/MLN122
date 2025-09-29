import React from 'react'
import { Layout } from 'antd'

const { Header } = Layout

const CustomHeader: React.FC = () => {
  return (
    <Header
      style={{
        // Áp dụng style nền tối từ footer
        background: '#c81821', // Màu nền đỏ đậm
        padding: '40px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)', // Tăng nhẹ shadow trên nền tối
        height: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          alignContent: 'center',
          gap: '10px',
          color: 'white', // Màu chữ đã phù hợp với nền tối
          fontSize: '20px',
          fontWeight: 'bold',
          height: '90px',
          margin: 20,
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>GÓC HỌC TẬP SINH VIÊN FPT</div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: 'normal',
              // Dùng màu chữ phụ của footer để tạo sự tương phản nhẹ
              color: 'rgba(255, 255, 255, 0.65)',
            }}
          >
            Một dự án cá nhân từ nhóm sinh viên FPT, vì sinh viên FPT
          </div>
        </div>
      </div>
    </Header>
  )
}

export default CustomHeader
