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
      query: ({ tourId, page = 1, limit = 10 }) => ({
        url: `/review/tour/${tourId}`,
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["review"],
    }),
    
    getGuideReviews: builder.query({
      query: ({ guideId, page = 1, limit = 10 }) => ({
        url: `/review/guide/${guideId}`,
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["review"],
    }),
    
    getUserReviews: builder.query({
      query: ({ userId, page = 1, limit = 10 }) => ({
        url: `/review/user/${userId}`,
        method: "GET",
        params: { page, limit },
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
} = reviewApi;