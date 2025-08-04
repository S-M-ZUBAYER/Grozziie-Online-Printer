import { baseApi } from "../api/baseApi";

const batchPrintApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // loadOrderList: builder.mutation({
    //   query: ({ tikTokShopCipher }) => ({
    //     url: `/order/list?pageSize=100&cipher=${tikTokShopCipher}`,
    //     method: "POST", // ✅ Use GET since you’re not sending any body data
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }),
    //   invalidatesTags: ["users"], // 📝 Use appropriate tags for cache invalidation
    // }),
    // ✅ Proper POST with query parameters and no body
    loadOrderList: builder.mutation({
      query: ({
        pageSize = 100,
        cipher,
        createTimeGe,
        createTimeLt,
        updateTimeGe,
        updateTimeLt,
        orderStatus,
        isBuyerRequestCancel = false,
        shippingType = "TIKTOK",
        sortField = "create_time",
        sortOrder = "ASC",
      }) => {
        const queryParams = new URLSearchParams({
          pageSize: pageSize.toString(),
          cipher,
          createTimeGe: createTimeGe?.toString(),
          createTimeLt: createTimeLt?.toString(),
          updateTimeGe: updateTimeGe?.toString(),
          updateTimeLt: updateTimeLt?.toString(),
          orderStatus,
          isBuyerRequestCancel: isBuyerRequestCancel?.toString(),
          shippingType,
          sortField,
          sortOrder,
        });

        return {
          url: `/tiktokshop-partner/api/dev/order/list/filter?${queryParams.toString()}`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["orders"],
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
  useGetLazadaOrdersQuery,
  useLazyGetLazadaOrdersQuery,
  useGetBatchPrintQuery,
  useGetBatchPrintByIdQuery,
  useUpdateBatchPrintMutation,
  useDeleteBatchPrintByIdMutation,
} = batchPrintApi;
