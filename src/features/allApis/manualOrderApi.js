import { baseApi } from "../api/baseApi";

const manualOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    setManualOrder: builder.mutation({
      query: (data) => ({
        url: "/manual_order",
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["manualOrder"],
    }),

    getManualOrder: builder.query({
      query: () => ({
        url: "/manual_order",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["manualOrder"],
    }),
    deleteManualOrder: builder.mutation({
      query: (id) => ({
        url: `/manual_order/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["manualOrder"],
    }),
  }),
});

export const { useSetManualOrderMutation, useGetManualOrderQuery, useDeleteManualOrderMutation } =
  manualOrderApi;
