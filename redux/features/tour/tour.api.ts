import { baseApi } from "@/redux/baseApi";

export const tourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTours: builder.query({
      query: (params) => ({
        url: "/tour",
        method: "GET",
        params: params,
      }),
      providesTags: ["tour"],
    }),
    
    searchTours: builder.query({
      query: (params) => ({
        url: "/tour/search",
        method: "GET",
        params: params,
      }),
      providesTags: ["tour"],
    }),
    
    getTourBySlug: builder.query({
      query: (slug) => ({
        url: `/tour/${slug}`,
        method: "GET",
      }),
      providesTags: ["tour"],
    }),
    
    createTour: builder.mutation({
      query: (data) => ({
        url: "/tour",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["tour"],
    }),
    
    updateTour: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/tour/update/${id}`, // Note: Mismatch noted earlier, keep for now as frontend logic depends on it, but backend is /:id
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: ["tour"],
    }),
    
    deleteTour: builder.mutation({
      query: (id) => ({
        url: `/tour/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tour"],
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
      providesTags: ["tour"],
    }),

    getTouristMyTours: builder.query({
      query: () => ({
        url: "/tour/tourist/my-tours",
        method: "GET",
      }),
      providesTags: ["tour"],
    }),

    // Admin routes
    getAllToursForAdmin: builder.query({
      query: () => ({
        url: "/tour/admin/all-tours",
        method: "GET",
      }),
      providesTags: ["tour"],
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