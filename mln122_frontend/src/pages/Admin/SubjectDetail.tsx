/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useGetSubjectByIdQuery,
  useUpdateSubjectMutation, // Giả sử bạn đã có hook này
} from '../../features/subjectAPI' // Cập nhật đường dẫn cho đúng
import {
  Layout,
  Typography,
  Spin,
  Alert,
  Card,
  Button,
  Form,
  Input,
  notification,
  Descriptions,
  Space,
  ConfigProvider,
} from 'antd'
import {
  ArrowLeftOutlined,
  EditOutlined,
  SaveOutlined,
} from '@ant-design/icons'

const { Content } = Layout
const { Title } = Typography

export default function SubjectDetail() {
  const { subjectId } = useParams<{ subjectId: string }>()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [form] = Form.useForm()

  const {
    data: subjectResponse,
    isLoading,
    isError,
    error,
  } = useGetSubjectByIdQuery(subjectId!, { skip: !subjectId })

  const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation()

  const subject = subjectResponse?.data[0]

  // Cập nhật giá trị cho form khi dữ liệu được tải
  useEffect(() => {
    if (subject) {
      form.setFieldsValue({ subjectName: subject.subjectName })
    }
  }, [subject, form])

  const handleUpdate = async (values: { subjectName: string }) => {
    try {
      await updateSubject({ id: subjectId!, data: values }).unwrap()
      notification.success({
        message: 'Cập nhật thành công',
        description: `Tên môn học đã được đổi thành "${values.subjectName}".`,
      })
      setIsEditing(false)
    } catch (err) {
      notification.error({
        message: 'Cập nhật thất bại',
        description: (err as any)?.data?.message || 'Có lỗi xảy ra.',
      })
    }
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <Spin size='large' />
      </div>
    )
  }

  if (isError) {
    return (
      <Alert
        message='Lỗi'
        description={
          (error as any)?.data?.message || 'Không thể tải dữ liệu môn học.'
        }
        type='error'
        showIcon
      />
    )
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#262626',
          colorError: '#262626',
        },
      }}
    >
      <Layout>
        <Content style={{ padding: '24px 50px' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/685d54822e239adc055c4abf/subjects')}
            style={{ marginBottom: '24px' }}
          >
            Quay lại danh sách
          </Button>
          <Card>
            {!isEditing ? (
              // --- Chế độ xem ---
              <Descriptions
                title='Chi tiết môn học'
                bordered
                column={1}
                extra={
                  <Button
                    type='primary'
                    icon={<EditOutlined />}
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa
                  </Button>
                }
              >
                <Descriptions.Item label='Mã môn học (ID)'>
                  {subject?._id}
                </Descriptions.Item>
                <Descriptions.Item label='Tên môn học'>
                  {subject?.subjectName}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              // --- Chế độ chỉnh sửa ---
              <div>
                <Title level={4}>Chỉnh sửa môn học</Title>
                <Form
                  form={form}
                  layout='vertical'
                  onFinish={handleUpdate}
                  initialValues={{ subjectName: subject?.subjectName }}
                >
                  <Form.Item
                    name='subjectName'
                    label='Tên môn học'
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên môn học!' },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button
                        type='primary'
                        htmlType='submit'
                        loading={isUpdating}
                        icon={<SaveOutlined />}
                      >
                        Lưu thay đổi
                      </Button>
                      <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                    </Space>
                  </Form.Item>
                </Form>
              </div>
            )}
          </Card>
        </Content>
      </Layout>
    </ConfigProvider>
  )
}
