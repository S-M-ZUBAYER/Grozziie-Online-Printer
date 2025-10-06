import { baseApi } from "../api/baseApi";

const lazadaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getLazadaOrders: builder.query({
            query: ({
                sortBy = "updated_at",
                createdBefore,
                createdAfter,
                updateBefore,
                updateAfter,
                status,
                sortDirection = "DESC",
                offset = 0,
                limit = 100,
            }) => {
                const lazadaAppKey = localStorage.getItem("lazadaAppKey");

                const params = new URLSearchParams({
                    sortBy,
                    createdBefore,
                    createdAfter,
                    updateBefore,
                    updateAfter,
                    sortDirection,
                    offset: offset.toString(),
                    limit: limit.toString(),
                    appKey: lazadaAppKey || "", // add appKey to query
                });

                if (status) {
                    params.append("status", status);
                }

                return {
                    // url: `/lazada-open-shop/api/dev/orders?${params.toString()}`,
                    url: `/lazada-open-shop-debug/api/dev/orders?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["lazadaOrders"],
        }),
    }),
});

export const {
    useGetLazadaOrdersQuery,
    useLazyGetLazadaOrdersQuery,
} = lazadaApi;
