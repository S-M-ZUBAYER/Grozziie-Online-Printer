import { baseApi } from "../api/baseApi";

const shopeeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // 1️⃣ First API: order list
        getShopeeOrders: builder.query({
            query: ({
                timeFrom,
                timeTo,
                orderStatus,
                pageSize = 20,
                response_optional_fields = "order_status",
            }) => {
                const params = new URLSearchParams({
                    timeFrom: timeFrom.toString(),
                    timeTo: timeTo.toString(),
                    pageSize: pageSize.toString(),
                    response_optional_fields,
                });

                if (orderStatus) {
                    params.append("orderStatus", orderStatus);
                }

                const url = `/shopee-open-shop/api/dev/order/get-order-list?${params}`;
                console.log("Shopee get-order-list URL:", url);

                return {
                    url,
                    method: "GET",
                };
            },
            providesTags: ["shopeeOrders"],
        }),


        // 2️⃣ Second API: order details
        getShopeeOrderDetails: builder.query({
            query: ({
                orderSnList,
                request_order_status_pending = true,
                response_optional_fields = "total_amount",
            }) => {
                if (!orderSnList || (Array.isArray(orderSnList) && orderSnList.length === 0)) {
                    console.warn("Skipping order-details request: orderSnList empty");
                    return null; // ✅ RTKQ will skip
                }

                const params = new URLSearchParams({
                    orderSnList: Array.isArray(orderSnList)
                        ? orderSnList.join(",")
                        : orderSnList,
                    request_order_status_pending: request_order_status_pending.toString(),
                    response_optional_fields,
                });

                const url = `/shopee-open-shop/api/dev/order/get-order-details?${params.toString()}`;
                console.log("Shopee get-order-details URL:", url);

                return {
                    url,
                    method: "GET",
                };
            },
            providesTags: ["shopeeOrderDetails"],
        }),
    }),
});

export const {
    useGetShopeeOrdersQuery,
    useLazyGetShopeeOrdersQuery,
    useGetShopeeOrderDetailsQuery,
    useLazyGetShopeeOrderDetailsQuery,
} = shopeeApi;
