import { baseApi } from "@/redux/baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Tourist routes - create and manage reviews
    createReview: builder.mutation({
      query: (data) => ({
        url: "/review",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["review"],
    }),
    
    updateReview: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/review/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: ["review"],
    }),
    
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/review/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["review"],
    }),
    
    // Public routes - view reviews
    getTourReviews: builder.query({
      query: ({ tourId, page = 1, limit = 10 }) => ({
        url: `/review/tour/${tourId}`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["review"],
    }),
    
    getGuideReviews: builder.query({
      query: ({ guideId, page = 1, limit = 10 }) => ({
        url: `/review/guide/${guideId}`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["review"],
    }),
    
    getUserReviews: builder.query({
      query: ({ userId, page = 1, limit = 10 }) => ({
        url: `/review/user/${userId}`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["review"],
    }),
    
    // Admin routes
    getAllReviews: builder.query({
      query: ({ page = 1, limit = 20 }) => ({
        url: "/review/admin/all",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["review"],
    }),
    
    adminDeleteReview: builder.mutation({
      query: (id) => ({
        url: `/review/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["review"],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetTourReviewsQuery,
  useGetGuideReviewsQuery,
  useGetUserReviewsQuery,
  useGetAllReviewsQuery,
  useAdminDeleteReviewMutation,
} = reviewApi;