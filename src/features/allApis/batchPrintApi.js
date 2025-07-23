import { baseApi } from "../api/baseApi";

const batchPrintApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loadOrderList: builder.mutation({
      query: ({ tikTokShopCipher }) => ({
        url: `/order/list?pageSize=20&cipher=${tikTokShopCipher}`,
        method: "POST", // ✅ Use GET since you’re not sending any body data
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["users"], // 📝 Use appropriate tags for cache invalidation
    }),

    getBatchPrint: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["uses"],
    }),

    getBatchPrintById: builder.query({
      query: (batchPrintId) => ({
        url: `/users/${batchPrintId}`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),

    updateBatchPrint: builder.mutation({
      query: ({ batchPrintId, data }) => ({
        url: `/users/${batchPrintId}`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["users"],
    }),

    deleteBatchPrintById: builder.mutation({
      query: (batchPrintId) => ({
        url: `/users/${batchPrintId}`,
        method: "DELETE",
        body: batchPrintId,
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useLoadOrderListMutation,
  useGetBatchPrintQuery,
  useGetBatchPrintByIdQuery,
  useUpdateBatchPrintMutation,
  useDeleteBatchPrintByIdMutation,
} = batchPrintApi;
