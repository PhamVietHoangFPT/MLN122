import { apiSlice } from '../apis/apiSlice'

import type { Exam, ExamInput } from '../types/exam' // Giả sử bạn có định nghĩa kiểu Exam trong types/exam.ts

export const examApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // === QUERIES (Lấy dữ liệu) ===

    // 1. GET /api/exams -> Lấy danh sách đề thi
    getExams: builder.query<Exam, { subjectId: string }>({
      // Chỉ lấy subjectId làm tham số
      query: ({ subjectId }) => ({
        url: '/exams',
        params: { subjectId }, // Chỉ truyền subjectId vào params
      }),
      providesTags: ['exams'],
    }),

    // 2. GET /api/exams/{id} -> Lấy thông tin một đề thi theo ID
    getExamById: builder.query<Exam, string>({
      query: (id) => `/exams/${id}`,
      providesTags: ['exams'],
    }),

    // 3. GET /api/exams/student/{id} -> Lấy thông tin đề thi cho sinh viên
    getExamsForStudent: builder.query<Exam, string>({
      query: (studentId) => `/exams/student/${studentId}`,
      // Có thể cung cấp một tag riêng nếu cần, ví dụ: 'StudentExams'
      providesTags: ['exams'],
    }),

    // === MUTATIONS (Thay đổi dữ liệu) ===

    // 4. POST /api/exams -> Tạo đề thi mới
    createExam: builder.mutation<Exam, Partial<ExamInput>>({
      query: (newExam) => ({
        url: '/exams',
        method: 'POST',
        body: newExam,
      }),
      invalidatesTags: ['exams'],
    }),

    // 5. PUT /api/exams/{id} -> Cập nhật đề thi
    updateExam: builder.mutation<
      Exam,
      { id: string; data: Partial<ExamInput> }
    >({
      query: ({ id, data }) => ({
        url: `/exams/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['exams'],
    }),

    // 6. DELETE /api/exams/{id} -> Xóa đề thi
    deleteExam: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/exams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['exams'],
    }),
  }),
})

// Tự động tạo ra các hooks để sử dụng trong components
export const {
  useGetExamsQuery,
  useGetExamByIdQuery,
  useGetExamsForStudentQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation,
} = examApi
