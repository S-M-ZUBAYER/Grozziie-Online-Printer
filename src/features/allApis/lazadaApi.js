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
                const params = new URLSearchParams({
                    sortBy,
                    createdBefore,
                    createdAfter,
                    updateBefore,
                    updateAfter,
                    sortDirection,
                    offset: offset.toString(),
                    limit: limit.toString(),
                });

                if (status) {
                    params.append("status", status);
                }

                return {
                    url: `/lazada-open-shop/api/dev/orders?${params.toString()}`,
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
