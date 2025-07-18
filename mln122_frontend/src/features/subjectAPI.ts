import { apiSlice } from '../apis/apiSlice' // Giả sử bạn có file apiSlice gốc
import type { Subject } from '../types/subject' // Giả sử bạn có định nghĩa kiểu Subject trong types/subject.ts
import type { SubjectInput } from '../types/subject' // Định nghĩa kiểu cho input khi tạo hoặc cập nhật môn học

export const subjectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // === QUERIES (Lấy dữ liệu) ===

    // 1. GET /api/subjects -> Lấy tất cả môn học (không phân trang)
    getSubjects: builder.query<Subject, void>({
      query: () => '/subjects',
      // Cung cấp tag cho caching, giúp tự động cập nhật khi có thay đổi
      providesTags: ['subjects'],
    }),

    // 2. GET /api/subjects/{id} -> Lấy một môn học theo ID
    getSubjectById: builder.query<Subject, string>({
      query: (id) => `/subjects/${id}`,
      providesTags: ['subjects'],
    }),

    // === MUTATIONS (Thay đổi dữ liệu) ===

    // 3. POST /api/subjects -> Tạo môn học mới
    createSubject: builder.mutation<Subject, SubjectInput>({
      query: (newSubject) => ({
        url: '/subjects',
        method: 'POST',
        body: newSubject,
      }),
      // Sau khi tạo thành công, làm mới lại danh sách môn học
      invalidatesTags: ['subjects'],
    }),

    // 4. PUT /api/subjects/{id} -> Cập nhật môn học
    updateSubject: builder.mutation<
      Subject,
      { id: string; data: Partial<SubjectInput> }
    >({
      query: ({ id, data }) => ({
        url: `/subjects/${id}`,
        method: 'PUT',
        body: data,
      }),
      // Sau khi cập nhật, làm mới lại danh sách và cả chi tiết môn học đó
      invalidatesTags: ['subjects'],
    }),

    // 5. DELETE /api/subjects/{id} -> Xóa môn học
    deleteSubject: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/subjects/${id}`,
        method: 'DELETE',
      }),
      // Sau khi xóa, làm mới lại danh sách
      invalidatesTags: ['subjects'],
    }),
  }),
})

// Tự động tạo ra các hooks tương ứng để sử dụng trong components
export const {
  useGetSubjectsQuery,
  useGetSubjectByIdQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectApi
