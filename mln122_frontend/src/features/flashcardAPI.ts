import { apiSlice } from '../apis/apiSlice'

import type { Flashcard } from '../types/flashcard'

export const flashcardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // === QUERIES (Lấy dữ liệu) ===

    // 1. GET /api/flashcards -> Lấy danh sách đề thi
    getflashcardsBySubject: builder.query<Flashcard, { subjectId: string }>({
      // Chỉ lấy subjectId làm tham số
      query: ({ subjectId }) => ({
        url: '/flashcards',
        params: { subjectId }, // Chỉ truyền subjectId vào params
      }),
      providesTags: ['flashcards'],
    }),

    // 2. GET /api/flashcards/{id} -> Lấy thông tin một đề thi theo ID
    getflashcardById: builder.query<Flashcard, string>({
      query: (id) => `/flashcards/${id}`,
      providesTags: ['flashcards'],
    }),

    // 6. DELETE /api/flashcards/{id} -> Xóa đề thi
    deleteflashcard: builder.mutation<{ success: boolean; id: string }, string>(
      {
        query: (id) => ({
          url: `/flashcards/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['flashcards'],
      }
    ),
  }),
})

// Tự động tạo ra các hooks để sử dụng trong components
export const {
  useGetflashcardsBySubjectQuery,
  useGetflashcardByIdQuery,
  useDeleteflashcardMutation,
} = flashcardApi
