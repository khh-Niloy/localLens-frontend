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
    
    getPublicProfile: builder.query({
      query: (id) => ({
        url: `/user/profile/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
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
        url: "/user/admin/all",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    
    getUsersByRole: builder.query({
      query: (role) => ({
        url: `/user/admin/role/${role}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/user/admin/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: ["user"],
    }),
    
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetUserEnumsQuery,
  useGetPublicProfileQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useGetUsersByRoleQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;