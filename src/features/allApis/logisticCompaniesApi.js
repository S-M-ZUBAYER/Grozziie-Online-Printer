import { baseApi } from "../api/baseApi";

const logisticCompaniesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLogisticCompanies: builder.query({
      query: () => ({
        url: "/logistics/companies",
        method: "GET",
      }),
      providesTags: ["uses"],
    }),
  }),
});

export const { useGetLogisticCompaniesQuery } = logisticCompaniesApi;
