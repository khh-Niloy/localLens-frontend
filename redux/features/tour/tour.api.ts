import { baseApi } from "@/redux/baseApi";

export const tourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Public routes
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
    
    // Protected routes for guides
    createTour: builder.mutation({
      query: (data) => ({
        url: "/tour",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["tour"],
    }),
    
    getTourById: builder.query({
      query: (id) => ({
        url: `/tour/details/${id}`,
        method: "GET",
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
    
    updateTour: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/tour/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: ["tour"],
    }),
    
    deleteTour: builder.mutation({
      query: (id) => ({
        url: `/tour/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tour"],
    }),
    
    // Universal my-tours endpoint (works for all roles)
    getMyTours: builder.query({
      query: () => ({
        url: "/tour/my-tours",
        method: "GET",
      }),
      providesTags: ["tour"],
    }),
    
    // Helper endpoints
    getTourEnums: builder.query({
      query: () => ({
        url: "/tour/enums",
        method: "GET",
      }),
    }),
    
    // Admin routes
    getAllToursForAdmin: builder.query({
      query: () => ({
        url: "/tour/admin/all",
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
  useGetTourByIdQuery,
  useCreateTourMutation,
  useUpdateTourMutation,
  useDeleteTourMutation,
  useGetMyToursQuery,
  useGetAllToursForAdminQuery,
  useGetTourEnumsQuery,
} = tourApi;