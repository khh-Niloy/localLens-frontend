import { baseApi } from "@/redux/baseApi";

export const tourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTours: builder.query({
      query: (params) => ({
        url: "/tour",
        method: "GET",
        params: params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }: any) => ({ type: 'tour' as const, id: _id })),
              { type: 'tour', id: 'LIST' },
            ]
          : [{ type: 'tour', id: 'LIST' }],
    }),
    
    searchTours: builder.query({
      query: (params) => ({
        url: "/tour/search",
        method: "GET",
        params: params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }: any) => ({ type: 'tour' as const, id: _id })),
              { type: 'tour', id: 'LIST' },
            ]
          : [{ type: 'tour', id: 'LIST' }],
    }),
    
    getTourBySlug: builder.query({
      query: (slug) => ({
        url: `/tour/${slug}`,
        method: "GET",
      }),
      providesTags: (result, error, slug) => [{ type: 'tour', id: slug }],
    }),
    
    createTour: builder.mutation({
      query: (data) => ({
        url: "/tour",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: 'tour', id: 'LIST' }],
    }),
    
    updateTour: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/tour/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tour', id: 'LIST' },
        { type: 'tour', id }
      ],
    }),
    
    deleteTour: builder.mutation({
      query: (id) => ({
        url: `/tour/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'tour', id: 'LIST' },
        { type: 'tour', id }
      ],
    }),
    
    getTourEnums: builder.query({
      query: () => ({
        url: "/tour/enums",
        method: "GET",
      }),
    }),

    getGuideMyTours: builder.query({
      query: () => ({
        url: "/tour/guide/my-tours",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }: any) => ({ type: 'tour' as const, id: _id })),
              { type: 'tour', id: 'LIST' },
            ]
          : [{ type: 'tour', id: 'LIST' }],
    }),

    getTouristMyTours: builder.query({
      query: () => ({
        url: "/tour/tourist/my-tours",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }: any) => ({ type: 'tour' as const, id: _id })),
              { type: 'tour', id: 'LIST' },
            ]
          : [{ type: 'tour', id: 'LIST' }],
    }),

    // Admin routes
    getAllToursForAdmin: builder.query({
      query: () => ({
        url: "/tour/admin/all-tours",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }: any) => ({ type: 'tour' as const, id: _id })),
              { type: 'tour', id: 'LIST' },
            ]
          : [{ type: 'tour', id: 'LIST' }],
    }),
    
  }),
});

export const {
  useGetAllToursQuery,
  useSearchToursQuery,
  useGetTourBySlugQuery,
  useCreateTourMutation,
  useUpdateTourMutation,
  useDeleteTourMutation,
  useGetGuideMyToursQuery,
  useGetTouristMyToursQuery,
  useGetTourEnumsQuery,
  useGetAllToursForAdminQuery,
} = tourApi;