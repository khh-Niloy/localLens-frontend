import { baseApi } from "@/redux/baseApi";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Tourist routes
    createBooking: builder.mutation({
      query: (data) => ({
        url: "/booking",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["booking"],
    }),
    
    getMyBookings: builder.query({
      query: () => ({
        url: "/booking/my-bookings",
        method: "GET",
      }),
      providesTags: ["booking"],
    }),
    
    // Guide routes
    getUpcomingBookings: builder.query({
      query: () => ({
        url: "/booking/guide/upcoming",
        method: "GET",
      }),
      providesTags: ["booking"],
    }),
    
    getPendingBookings: builder.query({
      query: () => ({
        url: "/booking/guide/pending",
        method: "GET",
      }),
      providesTags: ["booking"],
    }),
    
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/booking/${id}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["booking"],
    }),
    
    // Admin routes
    getAllBookings: builder.query({
      query: () => ({
        url: "/booking/admin/all",
        method: "GET",
      }),
      providesTags: ["booking"],
    }),
    
    // Common routes
    getBookingById: builder.query({
      query: (id) => ({
        url: `/booking/${id}`,
        method: "GET",
      }),
      providesTags: ["booking"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetUpcomingBookingsQuery,
  useGetPendingBookingsQuery,
  useUpdateBookingStatusMutation,
  useGetAllBookingsQuery,
  useGetBookingByIdQuery,
} = bookingApi;