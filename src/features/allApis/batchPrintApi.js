import { baseApi } from "../api/baseApi";

const batchPrintApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loadOrderList: builder.mutation({
      query: ({ pddAccessToken, data }) => ({
        url: `/order/list?accessToken=${pddAccessToken}`,
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["users"],
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
