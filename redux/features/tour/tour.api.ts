import { baseApi } from "@/redux/baseApi";

export const tourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTours: builder.query({
      query: (params) => ({
        url: "/tour",
        method: "GET",
        params: params,
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }: any) => ({ type: 'tour' as const, id: _id })),
              { type: 'tour', id: 'LIST' },
            ]
          : [{ type: 'tour', id: 'LIST' }],
    }),

    getFeaturedTours: builder.query({
      query: ({ cursor }) => ({
        url: "/tour/featured",
        method: "GET",
        params: { cursor },
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (result) =>
        result?.data
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
      transformResponse: (res: any) => res.data,
      providesTags: (result) =>
        result?.tours
          ? [
              ...result.tours.map(({ _id }: any) => ({ type: 'tour' as const, id: _id })),
              { type: 'tour', id: 'LIST' },
            ]
          : [{ type: 'tour', id: 'LIST' }],
    }),
    
    getTourById: builder.query({
      query: (id) => ({
        url: `/tour/${id}`,
        method: "GET",
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (result, error, id) => [{ type: 'tour', id: id }],
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
      transformResponse: (res: any) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }: any) => ({ type: 'tour' as const, id: _id })),
              { type: 'tour', id: 'LIST' },
            ]
          : [{ type: 'tour', id: 'LIST' }],
    }),

    getTouristMyTours: builder.query({
      query: () => ({
        url: "/tour/tourist/my-tours",
        method: "GET",
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }: any) => ({ type: 'tour' as const, id: _id })),
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
      transformResponse: (res: any) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }: any) => ({ type: 'tour' as const, id: _id })),
              { type: 'tour', id: 'LIST' },
            ]
          : [{ type: 'tour', id: 'LIST' }],
    }),
    
  }),
});

export const {
  useGetAllToursQuery,
  useGetFeaturedToursQuery,
  useSearchToursQuery,
  useGetTourByIdQuery,
  useCreateTourMutation,
  useUpdateTourMutation,
  useDeleteTourMutation,
  useGetGuideMyToursQuery,
  useGetTouristMyToursQuery,
  useGetTourEnumsQuery,
  useGetAllToursForAdminQuery,
} = tourApi;