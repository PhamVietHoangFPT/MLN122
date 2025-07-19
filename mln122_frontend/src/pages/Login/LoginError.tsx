// src/pages/LoginErrorPage.jsx
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Layout, Result, Button } from 'antd'

export default function LoginErrorPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const errorFromUrl = searchParams.get('error')
    if (errorFromUrl) {
      setErrorMessage(decodeURIComponent(errorFromUrl))
    } else {
      setErrorMessage(
        'Đã có lỗi không xác định xảy ra trong quá trình đăng nhập.'
      )
    }
  }, [searchParams])

  // Hàm để điều hướng người dùng quay lại trang đăng nhập
  const handleGoBack = () => {
    navigate('/login')
  }

  return (
    <Layout
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Result
        status='error'
        title='Đăng nhập thất bại'
        subTitle={errorMessage}
        extra={[
          <Button type='primary' key='back' onClick={handleGoBack}>
            Quay lại trang đăng nhập
          </Button>,
        ]}
      />
    </Layout>
  )
}
