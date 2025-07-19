import {
  useGetExamsQuery,
  useDeleteExamMutation,
  useCreateExamMutation,
} from '../../features/examAPI'
import { useGetSubjectsQuery } from '../../features/subjectAPI'
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
  Select,
  ConfigProvider,
  Form,
  Input,
  Row,
  Col,
  InputNumber,
  Divider,
  Card,
} from 'antd'
import {
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'

const { Content } = Layout
const { Title } = Typography
const { confirm } = Modal

// Định nghĩa kiểu dữ liệu
interface Subject {
  _id: string
  subjectName: string
}
interface Exam {
  _id: string
  examCode: string
  title: string
  duration: number
  subject: Subject
}

export default function ManageExam() {
  const navigate = useNavigate()
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  )
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  // Lấy danh sách môn học để điền vào dropdown
  const { data: subjectResponse, isLoading: isLoadingSubjects } =
    useGetSubjectsQuery()

  // Lấy danh sách đề thi dựa vào môn học đã chọn
  const {
    data: examResponse,
    isLoading: isLoadingExams,
    isError,
    error,
  } = useGetExamsQuery(
    { subjectId: selectedSubjectId! },
    { skip: !selectedSubjectId } // Chỉ gọi API khi đã chọn môn học
  )

  const [deleteExam, { isLoading: isDeleting }] = useDeleteExamMutation()
  const [createExam, { isLoading: isCreating }] = useCreateExamMutation()

  useEffect(() => {
    if (isModalVisible && selectedSubjectId) {
      const selectedSubject = subjectResponse?.data.find(
        (s: Subject) => s._id === selectedSubjectId
      )
      form.setFieldsValue({
        subjectName: selectedSubject?.subjectName,
        questions: [], // Khởi tạo mảng câu hỏi rỗng
      })
    }
  }, [isModalVisible, selectedSubjectId, subjectResponse, form])

  const handleDelete = (id: string, title: string) => {
    confirm({
      title: `Bạn chắc chắn muốn xóa đề thi "${title}"?`,
      icon: <ExclamationCircleFilled />,
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xác nhận xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      centered: true,
      onOk: async () => {
        try {
          await deleteExam(id).unwrap()
          notification.success({ message: 'Xóa thành công' })
        } catch (err) {
          notification.error({
            message: 'Xóa thất bại',
            description: (err as any)?.data?.message || 'Có lỗi xảy ra.',
          })
        }
      },
    })
  }

  const handleCreate = async (values: any) => {
    const payload = {
      ...values,
      subject: selectedSubjectId,
    }
    try {
      await createExam(payload).unwrap()
      notification.success({ message: 'Tạo đề thi thành công!' })
      setIsModalVisible(false)
      form.resetFields()
    } catch (err) {
      notification.error({
        message: 'Tạo thất bại',
        description: (err as any)?.data?.message || 'Có lỗi xảy ra.',
      })
    }
  }

  const columns: ColumnsType<Exam> = [
    {
      title: 'STT',
      render: (text, record, index) => index + 1,
      width: '5%',
    },
    {
      title: 'Mã đề thi',
      dataIndex: 'examCode',
      key: 'examCode',
      width: '20%',
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'duration',
      key: 'duration',
      align: 'center',
      width: '15%',
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
              onClick={() =>
                navigate(`/685d54822e239adc055c4abf/exams/${record._id}`)
              }
            />
          </Tooltip>
          <Tooltip title='Xóa'>
            <Button
              shape='circle'
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id, record.title)}
              loading={isDeleting}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  // === COMPONENT MỚI ĐỂ XỬ LÝ DROPDOWN ĐÁP ÁN ĐÚNG ===
  const CorrectAnswerSelector = ({
    questionName,
    form,
  }: {
    questionName: number
    form: any
  }) => {
    // Sử dụng useWatch để theo dõi sự thay đổi của mảng answers
    const answers = Form.useWatch(['questions', questionName, 'answers'], form)

    return (
      <Form.Item
        name={[questionName, 'correctAnswerCode']}
        label='Mã đáp án đúng'
        rules={[{ required: true, message: 'Vui lòng chọn đáp án đúng!' }]}
      >
        <Select placeholder='Chọn đáp án đúng'>
          {(answers || []).map(
            (ans: Answer) =>
              ans &&
              ans.answerCode && (
                <Select.Option key={ans.answerCode} value={ans.answerCode}>
                  {ans.answerCode}
                </Select.Option>
              )
          )}
        </Select>
      </Form.Item>
    )
  }

  const CreateModal = () => (
    <Modal
      title='Thêm đề thi mới'
      open={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false)
        form.resetFields()
      }}
      onOk={() => form.submit()}
      confirmLoading={isCreating}
      okText='Tạo mới'
      cancelText='Hủy'
      width={800} // Tăng chiều rộng modal
    >
      <Form form={form} layout='vertical' onFinish={handleCreate}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name='subjectName' label='Môn học'>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='examCode'
              label='Mã đề thi'
              rules={[{ required: true, message: 'Vui lòng nhập mã đề thi!' }]}
            >
              <Input placeholder='Ví dụ: DE_KT_MLN122_01' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='title'
              label='Tiêu đề'
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
            >
              <Input placeholder='Ví dụ: Đề kiểm tra giữa kỳ' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='duration'
              label='Thời lượng (phút)'
              rules={[{ required: true, message: 'Vui lòng nhập thời lượng!' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Quản lý câu hỏi</Divider>

        <Form.List name='questions'>
          {(fields, { add, remove }) => (
            <Space direction='vertical' style={{ width: '100%' }}>
              {fields.map(({ key, name, ...restField }, index) => (
                <Card
                  key={key}
                  size='small'
                  title={`Câu hỏi ${index + 1}`}
                  extra={
                    <Button
                      type='text'
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    />
                  }
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'title']}
                    label='Nội dung câu hỏi'
                    rules={[{ required: true }]}
                  >
                    <Input.TextArea rows={2} />
                  </Form.Item>
                  <Form.Item label='Các đáp án'>
                    <Form.List name={[name, 'answers']}>
                      {(
                        answerFields,
                        { add: addAnswer, remove: removeAnswer }
                      ) => (
                        <Space direction='vertical' style={{ width: '100%' }}>
                          {answerFields.map(
                            ({
                              key: ansKey,
                              name: ansName,
                              ...ansRestField
                            }) => (
                              <Space key={ansKey} align='baseline'>
                                <Form.Item
                                  {...ansRestField}
                                  name={[ansName, 'answerCode']}
                                  rules={[{ required: true }]}
                                >
                                  <Input
                                    placeholder='Mã (A, B..)'
                                    style={{ width: '80px' }}
                                  />
                                </Form.Item>
                                <Form.Item
                                  {...ansRestField}
                                  name={[ansName, 'answerText']}
                                  rules={[{ required: true }]}
                                  style={{ width: '400px' }}
                                >
                                  <Input placeholder='Nội dung đáp án' />
                                </Form.Item>
                                <DeleteOutlined
                                  onClick={() => removeAnswer(ansName)}
                                />
                              </Space>
                            )
                          )}
                          <Button
                            type='dashed'
                            onClick={() => addAnswer()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Thêm đáp án
                          </Button>
                        </Space>
                      )}
                    </Form.List>
                  </Form.Item>
                  <CorrectAnswerSelector questionName={index} form={form} />
                </Card>
              ))}
              <Button
                type='dashed'
                onClick={() =>
                  add({ questionNo: fields.length + 1, answers: [] })
                }
                block
                icon={<PlusOutlined />}
              >
                Thêm câu hỏi
              </Button>
            </Space>
          )}
        </Form.List>
      </Form>
    </Modal>
  )

  if (isError) {
    return (
      <div>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#262626',
              colorError: '#262626',
              colorBorder: '#bfbfbf',
            },
            components: {
              Select: {
                // Màu nền của option khi được chọn
                optionSelectedBg: '#262626',
                // Màu chữ của option khi được chọn
                optionSelectedColor: '#ffffff',
              },
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
                  Quản lý Đề thi
                </Title>
                <Space>
                  <Select
                    placeholder='Chọn môn học để xem đề thi'
                    style={{ width: 250 }}
                    loading={isLoadingSubjects}
                    onChange={(value) => setSelectedSubjectId(value)}
                    options={subjectResponse?.data.map((subject: Subject) => ({
                      label: subject.subjectName,
                      value: subject._id,
                    }))}
                  />
                  <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisible(true)}
                    disabled={!selectedSubjectId}
                  >
                    Thêm đề thi mới
                  </Button>
                </Space>
              </div>
              <CreateModal />
            </Content>
          </Layout>
        </ConfigProvider>
        <Alert
          message='Lỗi'
          description={
            (error as any)?.data?.message || 'Không thể tải dữ liệu đề thi.'
          }
          type='error'
          showIcon
          style={{ margin: '24px' }}
        />
      </div>
    )
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#262626',
          colorError: '#262626',
          colorBorder: '#bfbfbf',
        },
        components: {
          Select: {
            // Màu nền của option khi được chọn
            optionSelectedBg: '#262626',
            // Màu chữ của option khi được chọn
            optionSelectedColor: '#ffffff',
          },
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
              Quản lý Đề thi
            </Title>
            <Space>
              <Select
                placeholder='Chọn môn học để xem đề thi'
                style={{ width: 250 }}
                loading={isLoadingSubjects}
                onChange={(value) => setSelectedSubjectId(value)}
                options={subjectResponse?.data.map((subject: Subject) => ({
                  label: subject.subjectName,
                  value: subject._id,
                }))}
              />
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
                disabled={!selectedSubjectId}
              >
                Thêm đề thi mới
              </Button>
            </Space>
          </div>

          <Table
            columns={columns}
            dataSource={examResponse?.data}
            loading={isLoadingExams || isLoadingSubjects}
            rowKey='_id'
            bordered
            title={() =>
              selectedSubjectId && (
                <Title level={4}>
                  Danh sách đề thi môn:{' '}
                  {
                    subjectResponse?.data.find(
                      (s: Subject) => s._id === selectedSubjectId
                    )?.subjectName
                  }
                </Title>
              )
            }
          />
        </Content>
      </Layout>
      {/* === MODAL TẠO ĐỀ THI MỚI (ĐÃ CẬP NHẬT) === */}
      <CreateModal />
    </ConfigProvider>
  )
}
