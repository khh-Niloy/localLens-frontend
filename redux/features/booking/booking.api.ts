import { baseApi } from "@/redux/baseApi";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
    
    initiatePayment: builder.mutation({
      query: (bookingId) => ({
        url: `/booking/${bookingId}/payment`,
        method: "POST",
      }),
      invalidatesTags: ["booking"],
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
        url: "/booking/admin/all-bookings",
        method: "GET",
      }),
      providesTags: ["booking"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useInitiatePaymentMutation,
  useGetPendingBookingsQuery,
  useUpdateBookingStatusMutation,
  useGetAllBookingsQuery,
} = bookingApi;