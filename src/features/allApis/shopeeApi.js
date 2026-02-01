// import { baseApi } from "../api/baseApi";

// const shopeeApi = baseApi.injectEndpoints({
//     endpoints: (builder) => ({

//         // 1️⃣ First API: order list
//         getShopeeOrders: builder.query({


//             query: ({
//                 timeFrom,
//                 timeTo,
//                 orderStatus,
//                 pageSize = 100,
//                 response_optional_fields = "order_status",
//             }) => {

//                 const shopeeAuthShopId = localStorage.getItem("shopeeAuthShopId");

//                 const params = new URLSearchParams({
//                     shopId: shopeeAuthShopId?.toString() || "",
//                     timeFrom: timeFrom.toString(),
//                     timeTo: timeTo.toString(),
//                     pageSize: pageSize.toString(),
//                     response_optional_fields,
//                 });

//                 if (orderStatus) {
//                     params.append("orderStatus", orderStatus);
//                 }
//                 // Inside getShopeeOrders
//                 console.log(params.toString(), "➡️ getOrderList Query Params");
//                 console.log(`/shopee-open-shop/api/dev/order/get-order-list?${params.toString()}`, "➡️ Full URL");


//                 const url = `/shopee-open-shop/api/dev/order/get-order-list?${params}`;

//                 return {
//                     url,
//                     method: "GET",
//                 };
//             },
//             providesTags: ["shopeeOrders"],
//         }),


//         getShopeeOrderDetails: builder.query({
//             async queryFn(
//                 {
//                     orderSnList,
//                     request_order_status_pending = true,
//                     response_optional_fields = "total_amount",
//                 },
//                 _queryApi,
//                 _extraOptions,
//                 fetchWithBQ
//             ) {

//                 if (!orderSnList || orderSnList.length === 0) {
//                     console.warn("Skipping order-details request: orderSnList empty");
//                     return { data: [] }; // ✅ skip gracefully
//                 }

//                 // 1️⃣ Call Shopee order details API
//                 const shopeeAuthCountry = localStorage.getItem("shopeeAuthCountry");
//                 const shopeeAuthShopId = localStorage.getItem("shopeeAuthShopId");
//                 const params = new URLSearchParams({
//                     shopId: shopeeAuthShopId?.toString() || "",
//                     orderSnList: orderSnList.join(","),
//                     request_order_status_pending: request_order_status_pending.toString(),
//                     response_optional_fields,
//                 });

//                 const orderDetailsRes = await fetchWithBQ(
//                     `/shopee-open-shop/api/dev/order/get-order-details?${params.toString()}`
//                 );

//                 if (orderDetailsRes.error) return { error: orderDetailsRes.error };

//                 let details = orderDetailsRes.data?.response?.order_list || [];

//                 // 2️⃣ For each order, fetch tracking number
//                 const updatedDetails = await Promise.all(
//                     details.map(async (order) => {
//                         try {
//                             const trackingRes = await fetchWithBQ(
//                                 `/shopee-open-shop/api/dev/logistics/get-tracking-number?shopId=${shopeeAuthShopId}&orderSn=${order?.order_sn}&packageNumber=-&responseOptionalFields=first_mile_tracking_number`
//                             );

//                             let trackingNumber = "";
//                             if (
//                                 trackingRes?.data?.body?.response?.tracking_number &&
//                                 !trackingRes.error
//                             ) {
//                                 trackingNumber = trackingRes.data.body.response.tracking_number;
//                             }
//                             return {
//                                 ...order,
//                                 tracking_number: trackingNumber || "", // 👈 always return a string
//                             };
//                         } catch (err) {
//                             console.error("Tracking API failed for", order.order_sn, err);
//                             return {
//                                 ...order,
//                                 tracking_number: "", // fallback if API fails
//                             };
//                         }
//                     })
//                 );

//                 return { data: updatedDetails };
//             },
//             providesTags: ["shopeeOrderDetails"],
//         }),


//     }),
// });

// export const {
//     useGetShopeeOrdersQuery,
//     useLazyGetShopeeOrdersQuery,
//     useGetShopeeOrderDetailsQuery,
//     useLazyGetShopeeOrderDetailsQuery,
// } = shopeeApi;


import { baseApi } from "../api/baseApi";

const shopeeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 1️⃣ First API: order list with pagination
        getShopeeOrders: builder.query({
            async queryFn(
                {
                    timeFrom,
                    timeTo,
                    orderStatus,
                    pageSize = 50,
                    response_optional_fields = "order_status",
                    cursor = "" // Add cursor parameter
                },
                _queryApi,
                _extraOptions,
                fetchWithBQ
            ) {
                try {
                    const shopeeAuthShopId = localStorage.getItem("shopeeAuthShopId");
                    console.log(shopeeAuthShopId, typeof (shopeeAuthShopId));

                    let allOrders = [];
                    let currentCursor = cursor;
                    let hasMore = true;

                    // Loop until all pages are fetched
                    while (hasMore) {
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

                        if (currentCursor) {
                            params.append("cursor", currentCursor);
                        }

                        console.log(params.toString(), "➡️ getOrderList Query Params");

                        const url = `/shopee-open-shop/api/dev/order/get-order-list?${params}`;

                        const response = await fetchWithBQ({
                            url,
                            method: "GET",
                        });

                        if (response.error) {
                            return { error: response.error };
                        }

                        const responseData = response.data;
                        if (responseData?.error === "invalid_acceess_token") {
                            return { data: responseData }
                        }

                        const orderList = responseData?.response?.order_list || [];

                        // Add current page orders to the collection
                        allOrders = [...allOrders, ...orderList];

                        // Check if there are more pages
                        hasMore = responseData?.response?.more === true;
                        currentCursor = responseData?.response?.next_cursor || "";

                        console.log(`Fetched ${orderList.length} orders, hasMore: ${hasMore}, next_cursor: ${currentCursor}`);
                    }

                    return { data: allOrders };
                } catch (error) {
                    return { error };
                }
            },
            providesTags: ["shopeeOrders"],
        }),

        // 2️⃣ Order details with batch processing (30 orders per request)
        getShopeeOrderDetails: builder.query({
            async queryFn(
                {
                    orderSnList,
                    request_order_status_pending = true,
                    response_optional_fields = "total_amount,recipient_address,item_list",
                },
                _queryApi,
                _extraOptions,
                fetchWithBQ
            ) {
                if (!orderSnList || orderSnList.length === 0) {
                    console.warn("Skipping order-details request: orderSnList empty");
                    return { data: [] };
                }

                const shopeeAuthShopId = localStorage.getItem("shopeeAuthShopId");
                const shopeeAuthCountry = localStorage.getItem("shopeeAuthCountry");
                const batchSize = 30; // Process 30 orders per batch
                let allDetails = [];

                // Process orders in batches of 30
                for (let i = 0; i < orderSnList.length; i += batchSize) {
                    const batch = orderSnList.slice(i, i + batchSize);

                    console.log(`Processing batch ${Math.floor(i / batchSize) + 1} with ${batch.length} orders`);

                    const params = new URLSearchParams({
                        shopId: shopeeAuthShopId?.toString() || "",
                        orderSnList: batch.join(","),
                        request_order_status_pending: request_order_status_pending.toString(),
                        response_optional_fields,
                    });

                    try {
                        const orderDetailsRes = await fetchWithBQ(
                            `/shopee-open-shop/api/dev/order/get-order-details?${params.toString()}`
                        );

                        if (orderDetailsRes.error) {
                            console.error(`Batch ${Math.floor(i / batchSize) + 1} failed:`, orderDetailsRes.error);
                            continue; // Continue with next batch even if one fails
                        }

                        let details = orderDetailsRes.data?.response?.order_list || [];

                        // Process tracking numbers for this batch
                        const batchWithTracking = await Promise.all(
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
                                        tracking_number: trackingNumber || "",
                                    };
                                } catch (err) {
                                    console.error("Tracking API failed for", order.order_sn, err);
                                    return {
                                        ...order,
                                        tracking_number: "",
                                    };
                                }
                            })
                        );

                        allDetails = [...allDetails, ...batchWithTracking];

                    } catch (error) {
                        console.error(`Error processing batch ${Math.floor(i / batchSize) + 1}:`, error);
                    }
                }

                return { data: allDetails };
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