import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../../features/auth/authSlice'
import { Spin } from 'antd'

const LoginSuccess = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      dispatch(login({ token: token }))
      navigate('/dashboard', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }, [searchParams, dispatch, navigate])

  // Trong lúc xử lý, hiển thị một spinner
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Spin size='large' />
      <p style={{ marginTop: '20px' }}>Đang xử lý đăng nhập...</p>
    </div>
  )
}

export default LoginSuccess
