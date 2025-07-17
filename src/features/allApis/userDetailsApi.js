import { baseApi } from "../api/baseApi";

const userDetailsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserDetails: builder.query({
            query: (store) => ({
                url: `/cloudprint/waybill/search/${store}`,
                method: "GET",
            }),
            providesTags: ["uses"],
        }),
    }),
});

export const { useGetUserDetailsQuery } = userDetailsApi;
