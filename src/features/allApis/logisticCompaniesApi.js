// import { baseApi } from "../api/baseApi";

// const logisticCompaniesApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getLogisticCompanies: builder.query({
//       query: () => ({
//         url: "/logistics/companies",
//         method: "GET",
//       }),
//       providesTags: ["uses"],
//     }),
//   }),
// });

// export const { useGetLogisticCompaniesQuery } = logisticCompaniesApi;


import { baseApi } from "../api/baseApi";

const logisticCompaniesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShippingProviders: builder.query({
      query: ({ deliveryOptionId, cipher }) => ({
        url: `/tiktokshop-partner/api/dev/logistics/shipping-provider`,
        method: "GET",
        params: { deliveryOptionId, cipher },
      }),
      providesTags: ["ShippingProviders"],
    }),
  }),
});

export const { useGetShippingProvidersQuery } = logisticCompaniesApi;

