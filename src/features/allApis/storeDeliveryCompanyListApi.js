import { baseApi } from "../api/baseApi";

const storeDeliveryCompaniesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    setStoreDeliveryCompaniesList: builder.mutation({
      query: (data) => ({
        url: "/stdtemplates-store",
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }), // invalidatesTags: ["users"],
    }),
    getStoreDeliveryCompaniesList: builder.query({
      query: () => ({
        url: "/stdtemplates-store",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      // providesTags: ["uses"],
    }),
  }),
});

export const {
  useSetStoreDeliveryCompaniesListMutation,
  useGetStoreDeliveryCompaniesListQuery,
} = storeDeliveryCompaniesApi;
