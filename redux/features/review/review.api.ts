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
    

    
    // Public routes - view reviews
    getTourReviews: builder.query({
      query: ({ tourId, cursor, limit = 10 }) => ({
        url: `/review/tour/${tourId}`,
        method: "GET",
        params: { cursor, limit },
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["review"],
    }),
    
    getGuideReviews: builder.query({
      query: ({ guideId, cursor, limit = 10 }) => ({
        url: `/review/guide/${guideId}`,
        method: "GET",
        params: { cursor, limit },
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["review"],
    }),
    
    getUserReviews: builder.query({
      query: ({ userId, cursor, limit = 10 }) => ({
        url: `/review/user/${userId}`,
        method: "GET",
        params: { cursor, limit },
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["review"],
    }),
    

    getLatestReviews: builder.query({
      query: (params: { limit?: number } | void) => ({
        url: "/review/latest",
        method: "GET",
        params: params || { limit: 6 },
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["review"],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useGetTourReviewsQuery,
  useGetGuideReviewsQuery,
  useGetUserReviewsQuery,
  useGetLatestReviewsQuery,
} = reviewApi;