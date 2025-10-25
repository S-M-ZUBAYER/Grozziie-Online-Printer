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
                const shopeeAuthCountry = localStorage.getItem("shopeeAuthCountry");
                const shopeeAuthShopId = localStorage.getItem("shopeeAuthShopId");

                const params = new URLSearchParams({
                    shopId: shopeeAuthShopId?.toString() || "",
                    timeFrom: timeFrom.toString(),
                    timeTo: timeTo.toString(),
                    pageSize: pageSize.toString(),
                    response_optional_fields,
                });

                if (orderStatus) {
                    params.append("orderStatus", orderStatus);
                }
                console.log(params, "getOrderList");

                const url = `/shopee-open-shop/api/dev/order/get-order-list?${params}`;

                return {
                    url,
                    method: "GET",
                };
            },
            providesTags: ["shopeeOrders"],
        }),


        // 2️⃣ Second API: order details
        // getShopeeOrderDetails: builder.query({
        //     query: ({
        //         orderList,
        //         request_order_status_pending = true,
        //         response_optional_fields = "total_amount",
        //     }) => {
        //         const orderSnList = orderList.map((order) => order.order_sn);
        //         if (!orderSnList || (Array.isArray(orderSnList) && orderSnList.length === 0)) {
        //             console.warn("Skipping order-details request: orderSnList empty");
        //             return null; // ✅ RTKQ will skip
        //         }
        //         console.log(orderSnList, "from api function");

        //         const params = new URLSearchParams({
        //             orderSnList: Array.isArray(orderSnList)
        //                 ? orderSnList.join(",")
        //                 : orderSnList,
        //             request_order_status_pending: request_order_status_pending.toString(),
        //             response_optional_fields,
        //         });

        //         const url = `/shopee-open-shop/api/dev/order/get-order-details?${params.toString()}`;
        //         console.log("Shopee get-order-details URL:", url);

        //         return {
        //             url,
        //             method: "GET",
        //         };
        //     },
        //     providesTags: ["shopeeOrderDetails"],
        // }),
        getShopeeOrderDetails: builder.query({
            async queryFn(
                {
                    orderSnList,
                    request_order_status_pending = true,
                    response_optional_fields = "total_amount",
                },
                _queryApi,
                _extraOptions,
                fetchWithBQ
            ) {

                if (!orderSnList || orderSnList.length === 0) {
                    console.warn("Skipping order-details request: orderSnList empty");
                    return { data: [] }; // ✅ skip gracefully
                }

                // 1️⃣ Call Shopee order details API
                const shopeeAuthCountry = localStorage.getItem("shopeeAuthCountry");
                const shopeeAuthShopId = localStorage.getItem("shopeeAuthShopId");
                const params = new URLSearchParams({
                    shopId: shopeeAuthShopId?.toString() || "",
                    orderSnList: orderSnList.join(","),
                    request_order_status_pending: request_order_status_pending.toString(),
                    response_optional_fields,
                });
                console.log(params, "getOrderDetails");
                const orderDetailsRes = await fetchWithBQ(
                    `/shopee-open-shop/api/dev/order/get-order-details?${params.toString()}`
                );

                if (orderDetailsRes.error) return { error: orderDetailsRes.error };

                let details = orderDetailsRes.data?.response?.order_list || [];

                // 2️⃣ For each order, fetch tracking number
                const updatedDetails = await Promise.all(
                    details.map(async (order) => {
                        try {
                            const trackingRes = await fetchWithBQ(
                                `/shopee-open-shop/api/dev/logistics/get-tracking-number?shopId=${shopeeAuthShopId}&orderSn=${order?.order_sn}&packageNumber=-&responseOptionalFields=first_mile_tracking_number`
                            );

                            let trackingNumber = "";
                            if (
                                trackingRes?.data?.body?.response?.tracking_number &&
                                !trackingRes.error
                            ) {
                                trackingNumber = trackingRes.data.body.response.tracking_number;
                            }
                            return {
                                ...order,
                                tracking_number: trackingNumber || "", // 👈 always return a string
                            };
                        } catch (err) {
                            console.error("Tracking API failed for", order.order_sn, err);
                            return {
                                ...order,
                                tracking_number: "", // fallback if API fails
                            };
                        }
                    })
                );

                return { data: updatedDetails };
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
