import { baseApi } from "../api/baseApi";

const shippedDataGetUsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    setShippedDataUs: builder.mutation({
      query: (data) => ({
        url: "/order_list_store",
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["printedDataList"],
    }),

    getShippedDataUs: builder.query({
      query: () => ({
        url: "/order_list_store",
        method: "GET",
      }),
      providesTags: ["printedDataList"],
    }),
  }),
});

export const { useSetShippedDataUsMutation, useGetShippedDataUsQuery } = shippedDataGetUsApi;
