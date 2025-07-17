import { baseApi } from "../api/baseApi";

const waybillSearchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWaybillSearch: builder.query({
      query: (store) => ({
        url: `/cloudprint/waybill/search/${store}`,
        method: "GET",
      }),
      providesTags: ["uses"],
    }),
  }),
});

export const { useGetWaybillSearchQuery } = waybillSearchApi;
