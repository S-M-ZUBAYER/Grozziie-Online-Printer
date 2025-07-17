import { baseApi } from "../api/baseApi";

const allAddressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAddress: builder.query({
      query: () => ({
        url: "/order/address",
        method: "GET",
      }),
      providesTags: ["uses"],
    }),
  }),
});

export const { useGetAllAddressQuery } = allAddressApi;
