import { baseApi } from "@/redux/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    userRegister: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["user"],
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["user"],
    }),
    getMe: builder.query({
      query: () => ({
        url: "/auth/getMe",
        method: "GET",
      }),
      transformResponse: (response: { data: { user: any } }) => response.data,
      providesTags: ["user"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "GET",
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useUserRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useLogoutMutation,
} = authApi;
