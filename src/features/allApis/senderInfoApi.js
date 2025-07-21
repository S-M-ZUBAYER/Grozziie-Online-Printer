import { baseApi } from "../api/baseApi";

const senderInfoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    setSenderInfo: builder.mutation({
      query: (data) => ({
        url: "/sender_info",
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["senderInfo"],
    }),

    getSenderInfo: builder.query({
      query: (email) => ({
        url: `/sender_info/${email}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["senderInfo"],
    }),

    deleteSenderInfo: builder.mutation({
      query: (senderId) => ({
        url: `/sender_info/${senderId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["senderInfo"],
    }),
  }),
});

export const {
  useSetSenderInfoMutation,
  useGetSenderInfoQuery,
  useDeleteSenderInfoMutation,
} = senderInfoApi;
