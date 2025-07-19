import { apiSlice } from '../apis/apiSlice'
import type { Submission, SubmissionInput } from '../types/submission' // Giả sử bạn có định nghĩa kiểu Submission trong types/submission.ts

export const submissionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // === QUERIES (Lấy dữ liệu) ===

    // 1. GET /api/submissions?pageSize={pageSize}&pageNumber={pageNumber} -> Lấy lịch sử các bài đã làm với phân trang
    getSubmissions: builder.query<
      Submission[],
      { pageSize: number; pageNumber: number }
    >({
      query: ({ pageSize, pageNumber }) =>
        `/submissions?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      providesTags: ['submissions'],
    }),

    // 2. GET /api/submissions/{submissionId} -> Lấy kết quả một lượt làm bài
    getSubmissionById: builder.query<Submission, string>({
      query: (submissionId) => `/submissions/${submissionId}`,
      providesTags: ['submissions'],
    }),

    // === MUTATIONS (Thay đổi dữ liệu) ===

    // 3. POST /api/exams/{examId}/start -> Bắt đầu một lượt làm bài thi
    startExam: builder.mutation<Submission, string>({
      query: (examId) => ({
        url: `/exams/${examId}/start`,
        method: 'POST',
      }),
      // Khi bắt đầu bài thi mới, danh sách lịch sử sẽ được làm mới
      invalidatesTags: ['submissions'],
    }),

    // 4. POST /api/submissions/{submissionId}/submit -> Nộp bài và chấm điểm
    submitSubmission: builder.mutation<Submission, SubmissionInput>({
      query: ({ submissionId, answers }) => ({
        url: `/submissions/${submissionId}/submit`,
        method: 'POST',
        body: { answers },
      }),
      // Khi nộp bài, làm mới lại danh sách và chi tiết của lượt làm bài đó
      invalidatesTags: ['submissions'],
    }),

    // 5. POST /api/submissions/{submissionId}/cancel -> Hủy một lượt làm bài
    cancelSubmission: builder.mutation<Submission, string>({
      query: (submissionId) => ({
        url: `/submissions/${submissionId}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['submissions'],
    }),
  }),
})

// Tự động tạo ra các hooks để sử dụng trong components
export const {
  useGetSubmissionsQuery,
  useGetSubmissionByIdQuery,
  useStartExamMutation,
  useSubmitSubmissionMutation,
  useCancelSubmissionMutation,
} = submissionApi
