import { baseApi } from "@/redux/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Public routes
    getUserEnums: builder.query({
      query: () => ({
        url: "/user/enums",
        method: "GET",
      }),
    }),
    
    // Protected routes
    getProfile: builder.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    
    updateProfile: builder.mutation({
      query: (data) => {
        // If data is FormData, don't set Content-Type header (let browser set it with boundary)
        const isFormData = data instanceof FormData;
        return {
          url: "/user/profile",
          method: "PATCH",
          data: data,
          headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        };
      },
      invalidatesTags: ["user"], // This will invalidate both user and auth queries
    }),
    
    // Admin routes
    getAllUsers: builder.query({
      query: () => ({
        url: "/user/admin/all-users",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
  }),
});

export const {
  useGetUserEnumsQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
} = userApi;