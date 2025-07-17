import { baseApi } from "../api/baseApi";

const recipientInfoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    setRecipientInfo: builder.mutation({
      query: (data) => ({
        url: "/receipt_info",
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["recipientInfo"],
    }),

    getRecipientInfo: builder.query({
      query: (email) => ({
        url: `/receipt_info/${email}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["recipientInfo"],
    }),

    deleteRecipientInfo: builder.mutation({
      query: (recipientId) => ({
        url: `/receipt_info/${recipientId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["recipientInfo"],
    }),
  }),
});

export const {
  useSetRecipientInfoMutation,
  useGetRecipientInfoQuery,
  useDeleteRecipientInfoMutation,
} = recipientInfoApi;
