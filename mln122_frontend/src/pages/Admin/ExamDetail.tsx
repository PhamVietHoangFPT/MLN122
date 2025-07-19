/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from 'react-router-dom'
import {
  useGetExamByIdQuery,
  useUpdateExamMutation, // Giả sử bạn đã có hook này
} from '../../features/examAPI' // Cập nhật đường dẫn cho đúng
import {
  Layout,
  Typography,
  Spin,
  Alert,
  Card,
  Button,
  Form,
  Input,
  InputNumber,
  notification,
  Descriptions,
  Space,
  Collapse,
  Modal,
  Select,
  List,
  ConfigProvider,
} from 'antd'
import {
  ArrowLeftOutlined,
  EditOutlined,
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'

const { Content } = Layout
const { Text } = Typography
const { confirm } = Modal

export default function ExamDetail() {
  const { examId } = useParams<{ examId: string }>()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [form] = Form.useForm()

  const {
    data: examResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetExamByIdQuery(examId!, { skip: !examId })

  const [updateExam, { isLoading: isUpdating }] = useUpdateExamMutation()

  const exam = examResponse?.data[0]

  // Cập nhật form khi dữ liệu thay đổi hoặc khi chuyển chế độ edit
  useEffect(() => {
    if (exam) {
      form.setFieldsValue({
        ...exam,
        subject: exam.subject._id, // Chỉ lấy ID cho Select
      })
    }
  }, [exam, isEditing, form])

  const handleUpdate = async (values: any) => {
    // Lấy danh sách câu hỏi từ form
    const questions = form.getFieldValue('questions') || []

    const payload = {
      ...values,
      questions,
    }

    try {
      await updateExam({ id: examId!, data: payload }).unwrap()
      notification.success({ message: 'Cập nhật đề thi thành công!' })
      setIsEditing(false)
      refetch()
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
      <div>
        <Alert
          message='Lỗi'
          description={
            (error as any)?.data?.message || 'Không thể tải dữ liệu.'
          }
          type='error'
          showIcon
        />
        <Button onClick={() => navigate(-1)}>Quay lại trang trước</Button>
      </div>
    )
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#262626',
          colorError: '#262626',
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
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/685d54822e239adc055c4abf/exams')}
            style={{ marginBottom: '24px' }}
          >
            Quay lại danh sách
          </Button>

          <Form form={form} onFinish={handleUpdate} initialValues={exam}>
            <Card
              title='Thông tin chung của đề thi'
              style={{ marginBottom: '24px' }}
              extra={
                <Space>
                  {!isEditing ? (
                    <Button
                      type='primary'
                      icon={<EditOutlined />}
                      onClick={() => setIsEditing(true)}
                    >
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <>
                      <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                      <Button
                        type='primary'
                        htmlType='submit'
                        loading={isUpdating}
                        icon={<SaveOutlined />}
                      >
                        Lưu thay đổi
                      </Button>
                    </>
                  )}
                </Space>
              }
            >
              <Descriptions bordered column={1}>
                <Descriptions.Item label='Mã đề thi'>
                  {isEditing ? (
                    <Form.Item
                      name='examCode'
                      noStyle
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                  ) : (
                    exam?.examCode
                  )}
                </Descriptions.Item>
                <Descriptions.Item label='Tiêu đề'>
                  {isEditing ? (
                    <Form.Item
                      name='title'
                      noStyle
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                  ) : (
                    exam?.title
                  )}
                </Descriptions.Item>
                <Descriptions.Item label='Thời lượng (phút)'>
                  {isEditing ? (
                    <Form.Item
                      name='duration'
                      noStyle
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                  ) : (
                    exam?.duration
                  )}
                </Descriptions.Item>
                <Descriptions.Item label='Môn học'>
                  {/* Giả sử bạn có API lấy danh sách môn học */}
                  {isEditing ? (
                    <Form.Item
                      name='subject'
                      noStyle
                      rules={[{ required: true }]}
                    >
                      <Select placeholder='Chọn môn học'>
                        <Select.Option value={exam?.subject?._id}>
                          {exam?.subject?.subjectName}
                        </Select.Option>
                        {/* Thêm các môn học khác ở đây */}
                      </Select>
                    </Form.Item>
                  ) : (
                    exam?.subject?.subjectName
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {isEditing && (
              <Card title='Quản lý câu hỏi'>
                <Form.List name='questions'>
                  {(fields, { add, remove }) => (
                    <Space direction='vertical' style={{ width: '100%' }}>
                      {fields.map(({ key, name, ...restField }) => (
                        <Card
                          key={key}
                          size='small'
                          title={`Câu hỏi ${form.getFieldValue(['questions', name, 'questionNo'])}`}
                          extra={
                            <Button
                              type='text'
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => {
                                confirm({
                                  title: 'Xác nhận xóa câu hỏi?',
                                  onOk: () => remove(name),
                                })
                              }}
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
                                <Space
                                  direction='vertical'
                                  style={{ width: '100%' }}
                                >
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

                          <Form.Item
                            {...restField}
                            name={[name, 'correctAnswerCode']}
                            label='Mã đáp án đúng'
                            rules={[{ required: true }]}
                          >
                            <Select placeholder='Chọn đáp án đúng'>
                              {(
                                form.getFieldValue([
                                  'questions',
                                  name,
                                  'answers',
                                ]) || []
                              ).map((ans: any) => (
                                <Select.Option
                                  key={ans.answerCode}
                                  value={ans.answerCode}
                                >
                                  {ans.answerCode}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Card>
                      ))}
                      <Button
                        type='dashed'
                        onClick={() =>
                          add({
                            questionNo: fields.length + 1,
                            answers: [{ answerCode: 'A', answerText: '' }],
                          })
                        }
                        block
                        icon={<PlusOutlined />}
                      >
                        Thêm câu hỏi
                      </Button>
                    </Space>
                  )}
                </Form.List>
              </Card>
            )}

            {!isEditing && (
              <Collapse accordion>
                {exam?.questions.map((q) => (
                  <Collapse.Panel
                    header={`Câu ${q.questionNo}: ${q.title}`}
                    key={q.questionNo}
                  >
                    <List
                      dataSource={q.answers}
                      renderItem={(item) => (
                        <List.Item
                          style={{
                            background:
                              item.answerCode === q.correctAnswerCode
                                ? '#b5fb70ff'
                                : 'transparent',
                            borderRadius: '4px',
                            padding: '8px',
                            marginBottom: '8px',
                          }}
                        >
                          <Text strong>{item.answerCode}:</Text>{' '}
                          {item.answerText}
                        </List.Item>
                      )}
                    />
                  </Collapse.Panel>
                ))}
              </Collapse>
            )}
          </Form>
        </Content>
      </Layout>
    </ConfigProvider>
  )
}
