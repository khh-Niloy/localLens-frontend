import { baseApi } from "@/redux/baseApi";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyConnection: builder.query({
      query: (userId) => ({
        url: `/conversation/connections/${userId}`,
        method: "GET",
      }),
      providesTags: ["chat"],
    }),
    getMessages: builder.query({
      query: ({ conversationId, userId }) => ({
        url: `/conversation/messages/${conversationId}`,
        method: "GET",
        params: userId ? { viewerId: userId } : {},
      }),
      transformResponse: (response: any) => response,
      providesTags: ["chat"],
    }),
  }),
});

export const { useGetMyConnectionQuery, useGetMessagesQuery } = chatApi;
