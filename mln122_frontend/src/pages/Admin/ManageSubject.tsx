/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import {
  useGetSubjectsQuery,
  useDeleteSubjectMutation,
  useCreateSubjectMutation, // <-- Thêm hook tạo mới
} from '../../features/subjectAPI' // Cập nhật đường dẫn cho đúng
import {
  Layout,
  Typography,
  Table,
  Button,
  Alert,
  Space,
  Modal,
  notification,
  Tooltip,
  ConfigProvider,
  Form, // <-- Thêm Form
  Input, // <-- Thêm Input
} from 'antd'
import {
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'

const { Content } = Layout
const { Title } = Typography
const { confirm } = Modal

// Định nghĩa kiểu dữ liệu cho một môn học
interface Subject {
  _id: string
  subjectName: string
}

export default function ManageSubject() {
  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const {
    data: subjectResponse,
    isLoading,
    isError,
    error,
    refetch, // <-- Thêm refetch để làm mới dữ liệu
  } = useGetSubjectsQuery()

  const [deleteSubject, { isLoading: isDeleting }] = useDeleteSubjectMutation()
  const [createSubject, { isLoading: isCreating }] = useCreateSubjectMutation()

  const handleViewDetails = (id: string) => {
    navigate(`/685d54822e239adc055c4abf/subjects/${id}`)
  }

  const handleDelete = (id: string, name: string) => {
    confirm({
      title: `Bạn có chắc chắn muốn xóa môn học "${name}"?`,
      icon: <ExclamationCircleFilled />,
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xác nhận xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      centered: true,
      onOk: async () => {
        try {
          await deleteSubject(id).unwrap()
          notification.success({
            message: 'Xóa thành công',
            description: `Môn học "${name}" đã được xóa.`,
          })
        } catch (err) {
          notification.error({
            message: 'Xóa thất bại',
            description: (err as any)?.data?.message || 'Có lỗi xảy ra.',
          })
        }
      },
    })
  }

  const handleCreate = async (values: { subjectName: string }) => {
    try {
      await createSubject(values).unwrap()
      notification.success({
        message: 'Tạo thành công',
        description: `Môn học "${values.subjectName}" đã được tạo.`,
      })
      setIsModalVisible(false)
      form.resetFields()
      refetch() // Làm mới lại danh sách môn học
    } catch (err) {
      notification.error({
        message: 'Tạo thất bại',
        description: (err as any)?.data?.message || 'Có lỗi xảy ra.',
      })
    }
  }

  const columns: ColumnsType<Subject> = [
    {
      title: 'STT',
      dataIndex: 'key',
      render: (text, record, index) => index + 1,
      width: '10%',
    },
    {
      title: 'Tên môn học',
      dataIndex: 'subjectName',
      key: 'subjectName',
    },
    {
      title: 'Mã môn học (ID)',
      dataIndex: '_id',
      key: '_id',
      width: '30%',
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      width: '15%',
      render: (_, record) => (
        <Space size='middle'>
          <Tooltip title='Xem chi tiết'>
            <Button
              shape='circle'
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record._id)}
            />
          </Tooltip>
          <Tooltip title='Xóa môn học'>
            <Button
              shape='circle'
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id, record.subjectName)}
              loading={isDeleting}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <Title level={2} style={{ margin: 0 }}>
              Quản lý Môn học
            </Title>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)} // <-- Mở Modal
            >
              Thêm môn học mới
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={subjectResponse?.data}
            loading={isLoading}
            rowKey='_id'
            bordered
          />
        </Content>
      </Layout>

      {/* === MODAL TẠO MÔN HỌC MỚI === */}
      <Modal
        title='Thêm môn học mới'
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
        }}
        onOk={() => form.submit()}
        confirmLoading={isCreating}
        okText='Tạo mới'
        cancelText='Hủy'
      >
        <Form form={form} layout='vertical' onFinish={handleCreate}>
          <Form.Item
            name='subjectName'
            label='Tên môn học'
            rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
          >
            <Input placeholder='Ví dụ: MLN122' />
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  )
}
