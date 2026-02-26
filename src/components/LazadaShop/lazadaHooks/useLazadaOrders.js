// import { useState, useEffect, useRef, useCallback } from "react";
// import { DateTime } from 'luxon';
// import { useDispatch, useSelector } from "react-redux";
// import { useLazyGetLazadaOrdersQuery } from "../../../features/allApis/lazadaApi";
// import { orderListData } from "../../../features/slice/orderListSlice";
// import { checkedItemsChange } from "../../../features/slice/userSlice";
// import { getRegionTimestampsLazada } from "../../../Share/Function/FunctionalComponent";


// export const useLazadaOrders = ({
//     lazadaOrderStatusCheck,
//     setLazadaOrderStatusCheck,
//     setCustomersData,
//     clearSelection,
//     location,
// }) => {
//     const dispatch = useDispatch();
//     const [getLazadaOrders] = useLazyGetLazadaOrdersQuery();

//     const [allData, setAllData] = useState([]);
//     const [lazadaPrintedIds, setLazadaPrintedIds] = useState([]);
//     const [cardStatus, setCardStatus] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [initialLoad, setInitialLoad] = useState(true);
//     const [printedIdsLoaded, setPrintedIdsLoaded] = useState(false); // ✅ Track printed IDs loading

//     const lazadaAccountId = localStorage.getItem("lazadaAccountId");
//     const previousStatusRef = useRef(null);
//     const isFetchingRef = useRef(false);
//     const isMountedRef = useRef(true);
//     const now = new Date();
//     const hasInitialRouteHandledRef = useRef(false); // ✅ Track if initial route handled

//     // Store status in ref to avoid stale closures
//     const currentStatusRef = useRef(lazadaOrderStatusCheck);

//     // Get initailly Date rang
//     const lazadaInitialDateRange = useSelector(
//         (state) => state.user.selectedDateRangRedux
//     );

//     console.log(lazadaInitialDateRange, "from lazada orders");


//     // Keep ref updated with current status
//     useEffect(() => {
//         currentStatusRef.current = lazadaOrderStatusCheck;
//     }, [lazadaOrderStatusCheck]);

//     useEffect(() => {
//         return () => {
//             isMountedRef.current = false;
//         };
//     }, []);

//     // ✅ Fetch printed IDs (once) - MUST load first
//     useEffect(() => {
//         const fetchPrintedIds = async () => {
//             try {
//                 console.log("🔄 Fetching printed IDs...");
//                 const res = await fetch(
//                     "https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/lazada/printedIds"
//                 );
//                 const data = await res.json();

//                 if (Array.isArray(data)) {
//                     console.log("✅ Printed IDs loaded:", data.length);
//                     setLazadaPrintedIds(data);
//                     setPrintedIdsLoaded(true);
//                 }
//             } catch (error) {
//                 console.error("❌ Error fetching printed IDs:", error);
//                 setPrintedIdsLoaded(true); // Still set to true even on error
//             }
//         };
//         fetchPrintedIds();
//     }, []);

//     // ✅ Route-based status sync - FIXED
//     useEffect(() => {
//         if (!printedIdsLoaded) return;

//         const parts = location.pathname.split("/");
//         const lazadaShopInfoRaw = localStorage.getItem("lazadaShopInfo");
//         if (!lazadaShopInfoRaw) return;

//         const lazadaShopInfo = JSON.parse(lazadaShopInfoRaw);
//         if (!Array.isArray(lazadaShopInfo) || lazadaShopInfo.length === 0) return;
//         localStorage.setItem("SelectedStore", lazadaShopInfo[0].name);

//         if (parts.length === 4) {
//             const routeStatus = parts[2];
//             setCardStatus(true);
//             const statusMap = {
//                 NewOrders: "pending",
//                 printed: "Packed_Printed",
//                 shipped: "shipped",
//                 needPrint: "Packed",
//                 Cancelled: "Canceled",
//             };

//             const mappedStatus = statusMap[routeStatus];
//             const currentStatus = currentStatusRef.current;

//             if (mappedStatus && mappedStatus !== currentStatus) {
//                 console.log("🔄 Route changed status from", currentStatus, "to", mappedStatus);
//                 console.log("📦 Printed IDs available:", lazadaPrintedIds.length);

//                 setLazadaOrderStatusCheck(mappedStatus);
//                 // Force immediate fetch with new status
//                 fetchLazadaOrdersData(mappedStatus);
//                 hasInitialRouteHandledRef.current = true;
//             }
//         }
//     }, [location, printedIdsLoaded, lazadaPrintedIds, setLazadaOrderStatusCheck]);

//     // ✅ Main Data Fetcher - FIXED
//     const fetchLazadaOrdersData = useCallback(async (statusToFetch = null) => {
//         // ALWAYS use the explicitly passed statusToFetch, never fall back to ref/state
//         const fetchStatus = statusToFetch !== null && statusToFetch !== undefined
//             ? statusToFetch
//             : currentStatusRef.current;

//         if (!fetchStatus || isFetchingRef.current) return;

//         // If we're trying to fetch Packed_Printed but printed IDs aren't loaded yet, wait
//         if ((fetchStatus === "Packed_Printed" || fetchStatus === "Packed") && !printedIdsLoaded) {
//             console.log("⏳ Waiting for printed IDs to load before fetching", fetchStatus);
//             return;
//         }

//         isFetchingRef.current = true;
//         if (initialLoad) setInitialLoad(false);

//         console.log("🚀 Fetch Lazada orders for:", fetchStatus, "| Printed IDs:", lazadaPrintedIds.length);

//         if (cardStatus === false) {
//             setLoading(true);
//         }

//         try {
//             const shopInfoRaw = localStorage.getItem("lazadaShopInfo");
//             const shopInfo = shopInfoRaw ? JSON.parse(shopInfoRaw) : [];
//             const countryCode = shopInfo?.[0]?.region || "MY";

//             // ✅ Clear selection after loading ON (so no blank flash)
//             dispatch(checkedItemsChange({ items: [], from: lazadaOrderStatusCheck }));
//             clearSelection();

//             const lazadaDateFormate = getRegionTimestampsLazada(countryCode, lazadaInitialDateRange?.startDate?.split("T")[0], lazadaInitialDateRange?.endDate?.split("T")[0])
//             console.log({
//                 sortBy: "updated_at",
//                 // createdAfter: toISOString(sevenDaysAgo),
//                 // createdBefore: toISOString(now),
//                 // updateAfter: toISOString(sevenDaysAgo),
//                 // updateBefore: toISOString(now),
//                 createdAfter: lazadaDateFormate.startTime,
//                 createdBefore: lazadaDateFormate.endTime,
//                 updateAfter: lazadaDateFormate.startTime,
//                 updateBefore: lazadaDateFormate.endTime,

//                 status: fetchStatus === "Packed_Printed" ? "ready_to_ship" : fetchStatus,
//                 sortDirection: "DESC",
//                 offset: 0,
//                 limit: 100,
//             });

//             // 🔁 PAGINATION LOOP
//             let allOrders = [];
//             let offset = 0;
//             const limit = 50;
//             let countTotal = 0;

//             while (true) {
//                 const response = await getLazadaOrders({
//                     sortBy: "updated_at",
//                     // createdAfter: lazadaDateFormate.sevenDaysAgo,
//                     // createdBefore: lazadaDateFormate.currentTime,
//                     // updateAfter: lazadaDateFormate.sevenDaysAgo,
//                     // updateBefore: lazadaDateFormate.currentTime,
//                     createdAfter: lazadaDateFormate.startTime,
//                     createdBefore: lazadaDateFormate.endTime,
//                     updateAfter: lazadaDateFormate.startTime,
//                     updateBefore: lazadaDateFormate.endTime,
//                     status: fetchStatus === "Packed_Printed" ? "ready_to_ship" : fetchStatus,
//                     sortDirection: "DESC",
//                     offset,
//                     limit,
//                 }).unwrap();

//                 const parsedBody = JSON.parse(response?.body || "{}");
//                 const orders = parsedBody?.data?.orders || [];
//                 countTotal = parsedBody?.data?.countTotal || 0;
//                 allOrders.push(...orders);

//                 // 🛑 Stop conditions
//                 if (allOrders.length >= countTotal || orders.length === 0) break;

//                 offset += 1;
//             }

//             let filteredOrderList = allOrders;
//             console.log("📦 Total Lazada orders fetched:", filteredOrderList.length);


//             // ✅ Filter printed/unprinted using fetchStatus
//             const printedIdSet = new Set(
//                 lazadaPrintedIds.map((item) => item.lazadaPrintedId)
//             );

//             console.log("🔢 Printed IDs in Set:", printedIdSet.size);
//             console.log(fetchStatus, cardStatus);
//             if (fetchStatus === "Packed") {
//                 const beforeFilter = filteredOrderList.length;
//                 filteredOrderList = filteredOrderList.filter(
//                     (order) => !printedIdSet.has(String(order.order_id))
//                 );
//                 console.log(`📦 Packed: Filtered ${beforeFilter - filteredOrderList.length} printed orders`);
//             } else if (fetchStatus === "Packed_Printed") {
//                 const beforeFilter = filteredOrderList.length;
//                 filteredOrderList = filteredOrderList.filter((order) =>
//                     printedIdSet.has(String(order?.order_id))
//                 );
//                 console.log(`🖨️ Packed_Printed: Found ${filteredOrderList.length} printed orders out of ${beforeFilter}`);
//             } else if (fetchStatus === "shipped") {
//                 const todayStr = now.toISOString().split('T')[0]; // Get YYYY-MM-DD

//                 filteredOrderList = filteredOrderList.filter((order) => {
//                     // Extract date part from "2026-01-07 15:15:09 +0800"
//                     console.log(order);

//                     const orderDateStr = order.updated_at.split(' ')[0];
//                     return orderDateStr === todayStr;
//                 });
//                 console.log(order);

//             }


//             // Only fetch item details if we have orders
//             if (filteredOrderList.length === 0) {
//                 dispatch(orderListData([]));
//                 setCustomersData([]);
//                 setAllData([]);
//                 return;
//             }

//             // ✅ Fetch order item details
//             const orderWithItems = await Promise.allSettled(
//                 filteredOrderList.map(async (order) => {
//                     try {
//                         const itemRes = await fetch(
//                             `https://grozziie.zjweiting.com:3091/lazada-open-shop/api/dev/orders/items?orderId=${order.order_id}&account=${lazadaAccountId}`
//                         );
//                         const itemData = await itemRes.json();
//                         const parsedItemBody =
//                             typeof itemData?.body === "string"
//                                 ? JSON.parse(itemData.body)
//                                 : itemData?.body || {};
//                         return {
//                             ...order,
//                             orderItemInfo:
//                                 parsedItemBody?.data?.order_items ||
//                                 parsedItemBody?.data ||
//                                 [],
//                         };
//                     } catch {
//                         return { ...order, orderItemInfo: [] };
//                     }
//                 })
//             ).then((results) =>
//                 results.map((r) => (r.status === "fulfilled" ? r.value : r.reason))
//             );

//             if (!isMountedRef.current) return;

//             // ✅ Only update data once
//             dispatch(orderListData(orderWithItems));
//             setCustomersData(orderWithItems);
//             setAllData(orderWithItems);
//             console.log("✅ Final data set with:", orderWithItems.length, "orders");
//         } catch (error) {
//             console.error("❌ Lazada fetch error:", error);
//         } finally {
//             if (isMountedRef.current) {
//                 setLoading(false);
//                 setCardStatus(false);
//             }
//             isFetchingRef.current = false;
//         }
//     }, [
//         lazadaPrintedIds,
//         lazadaAccountId,
//         getLazadaOrders,
//         dispatch,
//         clearSelection,
//         setCustomersData,
//         initialLoad,
//         cardStatus,
//         printedIdsLoaded, // ✅ Add to dependencies
//         lazadaInitialDateRange
//     ]);

//     // ✅ Effect: status change - FIXED
//     useEffect(() => {
//         if (!lazadaOrderStatusCheck) return;

//         // Compare with ref instead of previous state
//         if (lazadaOrderStatusCheck === previousStatusRef.current) return;

//         console.log("📊 Status changed from:", previousStatusRef.current, "to:", lazadaOrderStatusCheck);
//         previousStatusRef.current = lazadaOrderStatusCheck;

//         // Always pass the new status explicitly
//         fetchLazadaOrdersData(lazadaOrderStatusCheck);
//     }, [lazadaOrderStatusCheck, fetchLazadaOrdersData]);

//     // ✅ Effect: printed ID updates (auto refresh) - ONLY when loaded
//     useEffect(() => {
//         if (!printedIdsLoaded) return;

//         if (
//             lazadaOrderStatusCheck === "Packed" ||
//             lazadaOrderStatusCheck === "Packed_Printed"
//         ) {
//             console.log("🔄 Refetching due to printed IDs update");
//             fetchLazadaOrdersData();
//         }
//     }, [lazadaPrintedIds, lazadaOrderStatusCheck, fetchLazadaOrdersData, printedIdsLoaded]);

//     // ✅ Initial fetch when printed IDs are loaded
//     useEffect(() => {
//         if (printedIdsLoaded && !hasInitialRouteHandledRef.current) {
//             console.log("🏁 Initial fetch with printed IDs loaded");
//             fetchLazadaOrdersData();
//         }
//     }, [printedIdsLoaded, fetchLazadaOrdersData]);

//     // ✅ Return consistent data
//     return {
//         filteredData: allData,
//         setFilteredData: setAllData,
//         lazadaLoading: loading && !initialLoad,
//         lazadaPrintedIds,
//         refetch: () => fetchLazadaOrdersData(),
//         printedIdsLoaded, // ✅ Expose for debugging
//     };
// };


import { useState, useEffect, useRef } from "react";
import { DateTime } from 'luxon';
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetLazadaOrdersQuery } from "../../../features/allApis/lazadaApi";
import { orderListData } from "../../../features/slice/orderListSlice";
import { checkedItemsChange } from "../../../features/slice/userSlice";
import { getRegionTimestampsLazada } from "../../../Share/Function/FunctionalComponent";

export const useLazadaOrders = ({
    lazadaOrderStatusCheck,
    setLazadaOrderStatusCheck,
    setCustomersData,
    clearSelection,
    location,
}) => {
    const dispatch = useDispatch();
    const [getLazadaOrders] = useLazyGetLazadaOrdersQuery();
    const [allData, setAllData] = useState([]);
    const [lazadaPrintedIds, setLazadaPrintedIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cardStatus, setCardStatus] = useState(false);
    const [cardStatusCategory, setCardStatusCategory] = useState("");
    const now = new Date();

    const storedUser = localStorage.getItem("printerUser");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const lazadaAccountId = localStorage.getItem("lazadaAccountId");
    const previousPathRef = useRef(location.pathname);

    // Get initailly Date range
    const lazadaInitialDateRange = useSelector(
        (state) => state.user.selectedDateRangRedux
    );

    console.log(lazadaInitialDateRange, "from lazada orders");

    // ✅ Route-based status sync
    useEffect(() => {
        const parts = location.pathname.split("/");
        console.log("📍 Lazada Route changed:", location.pathname);

        if (parts.length === 4) {
            const routeStatus = parts[2];
            setCardStatus(true);
            setCardStatusCategory(routeStatus);
            console.log("🔄 Lazada Route status detected:", routeStatus);

            const statusMap = {
                'printed': "Packed_Printed",
                'printedToday': "Packed_Printed",
                'shipped': "shipped",
                'needPrint': "Packed",
                'NewOrders': "pending",
                'Cancelled': "Canceled"
            };

            const mappedStatus = statusMap[routeStatus];
            if (mappedStatus && setLazadaOrderStatusCheck) {
                console.log("🎯 Setting Lazada status from route:", mappedStatus);
                setLazadaOrderStatusCheck(mappedStatus);
                setLoading(false); // Reset loading
            }
        }
    }, [location, setLazadaOrderStatusCheck]);

    // ✅ Fetch printed IDs
    useEffect(() => {
        const fetchPrintedIds = async () => {
            try {
                const res = await fetch(
                    `https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/lazada/printedIds/by-email/${user?.email}`
                );
                const data = await res.json();
                if (Array.isArray(data)) {
                    setLazadaPrintedIds(data);
                }
            } catch (error) {
                console.error("❌ Error fetching Lazada printed IDs:", error);
            }
        };
        fetchPrintedIds();
    }, [lazadaOrderStatusCheck]);

    // ✅ Main data fetching effect
    useEffect(() => {
        if (!lazadaOrderStatusCheck) return;
        console.log("🚀 Starting Lazada data fetch for:", lazadaOrderStatusCheck);

        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("⏳ Lazada Loading ON");

                const shopInfoRaw = localStorage.getItem("lazadaShopInfo");
                const shopInfo = shopInfoRaw ? JSON.parse(shopInfoRaw) : [];
                const countryCode = shopInfo?.[0]?.region || "MY";

                // ✅ Clear selection
                dispatch(checkedItemsChange({ items: [], from: lazadaOrderStatusCheck }));
                clearSelection();

                const lazadaDateFormate = getRegionTimestampsLazada(
                    countryCode,
                    lazadaInitialDateRange?.startDate?.split("T")[0],
                    lazadaInitialDateRange?.endDate?.split("T")[0]
                );

                console.log("Fetch parameters:", {
                    createdAfter: lazadaDateFormate.startTime,
                    createdBefore: lazadaDateFormate.endTime,
                    updateAfter: lazadaDateFormate.startTime,
                    updateBefore: lazadaDateFormate.endTime,
                    status: lazadaOrderStatusCheck === "Packed_Printed" ? "ready_to_ship" : lazadaOrderStatusCheck,
                });

                // 🔁 PAGINATION LOOP
                let allOrders = [];
                let offset = 0;
                const limit = 50;
                let countTotal = 0;

                while (true) {
                    const response = await getLazadaOrders({
                        sortBy: "updated_at",
                        createdAfter: lazadaDateFormate.startTime,
                        createdBefore: lazadaDateFormate.endTime,
                        updateAfter: lazadaDateFormate.startTime,
                        updateBefore: lazadaDateFormate.endTime,
                        status: lazadaOrderStatusCheck === "Packed_Printed" ? "ready_to_ship" : lazadaOrderStatusCheck,
                        sortDirection: "DESC",
                        offset,
                        limit,
                    }).unwrap();

                    const parsedBody = JSON.parse(response?.body || "{}");
                    const orders = parsedBody?.data?.orders || [];
                    countTotal = parsedBody?.data?.countTotal || 0;
                    allOrders.push(...orders);

                    // 🛑 Stop conditions
                    if (allOrders.length >= countTotal || orders.length === 0) break;
                    offset += 1;
                }

                let filteredOrderList = allOrders;
                console.log("📦 Total Lazada orders fetched:", filteredOrderList.length);

                // ✅ Filter printed/unprinted orders
                const printedIdSet = new Set(
                    lazadaPrintedIds.map((item) => item.lazadaPrintedId)
                );

                const today = new Date().toISOString().split("T")[0];

                const lazadaTodayPrintedIdSet = new Set(
                    lazadaPrintedIds
                        .filter((p) => p.createdAt.split("T")[0] === today)
                        .map((p) => p.lazadaPrintedId)
                );


                console.log("🔢 Printed IDs in Set:", printedIdSet.size);
                console.log("🔢 Printed IDs in Set:", lazadaTodayPrintedIdSet.size);
                console.log("📋 Status:", lazadaOrderStatusCheck, "| Card Status:", cardStatus);

                if (lazadaOrderStatusCheck === "Packed") {
                    const beforeFilter = filteredOrderList.length;
                    filteredOrderList = filteredOrderList.filter(
                        (order) => !printedIdSet.has(String(order.order_id))
                    );
                    console.log(`📦 Packed: Filtered ${beforeFilter - filteredOrderList.length} printed orders`);
                }
                else if (lazadaOrderStatusCheck === "Packed_Printed") {
                    const beforeFilter = filteredOrderList.length;
                    if (cardStatus === true && cardStatusCategory === "printedToday") {
                        console.log(lazadaTodayPrintedIdSet);

                        filteredOrderList = filteredOrderList.filter((order) =>
                            lazadaTodayPrintedIdSet.has(String(order?.order_id))
                        );
                    } else {
                        console.log(lazadaTodayPrintedIdSet);
                        filteredOrderList = filteredOrderList.filter((order) =>
                            printedIdSet.has(String(order?.order_id))
                        );
                    }

                    console.log(`🖨️ Packed_Printed: Found ${filteredOrderList.length} printed orders out of ${beforeFilter}`);
                }
                else if (lazadaOrderStatusCheck === "shipped" && cardStatus === true) {
                    console.log("🎯 Processing shipped orders filter");

                    // Get today's date in YYYY-MM-DD format
                    const todayStr = now.toISOString().split('T')[0];
                    console.log("Today's date string:", todayStr);

                    const beforeFilter = filteredOrderList.length;
                    console.log("Orders before date filter:", beforeFilter);

                    filteredOrderList = filteredOrderList.filter((order) => {
                        if (!order.updated_at) {
                            console.log("❌ Order missing updated_at:", order.order_id);
                            return false;
                        }

                        // Extract date part from "2026-01-07 15:15:09 +0800"
                        const orderDateStr = order.updated_at.split(' ')[0];
                        const isToday = orderDateStr === todayStr;

                        return isToday;
                    });

                    console.log(`📅 Shipped: Filtered ${beforeFilter - filteredOrderList.length} orders, ${filteredOrderList.length} from today`);
                }

                // Only fetch item details if we have orders
                if (filteredOrderList.length === 0) {
                    console.log("📭 No orders after filtering");
                    if (isMounted) {
                        dispatch(orderListData([]));
                        setCustomersData([]);
                        setAllData([]);
                    }
                    return;
                }

                console.log("📋 Final filtered orders count:", filteredOrderList.length);

                // ✅ Fetch order item details
                const orderWithItems = await Promise.allSettled(
                    filteredOrderList.map(async (order) => {
                        try {
                            const itemRes = await fetch(
                                `https://grozziie.zjweiting.com:3091/lazada-open-shop/api/dev/orders/items?orderId=${order.order_id}&account=${lazadaAccountId}`
                            );
                            const itemData = await itemRes.json();
                            const parsedItemBody =
                                typeof itemData?.body === "string"
                                    ? JSON.parse(itemData.body)
                                    : itemData?.body || {};
                            return {
                                ...order,
                                orderItemInfo:
                                    parsedItemBody?.data?.order_items ||
                                    parsedItemBody?.data ||
                                    [],
                            };
                        } catch {
                            return { ...order, orderItemInfo: [] };
                        }
                    })
                ).then((results) =>
                    results.map((r) => (r.status === "fulfilled" ? r.value : r.reason))
                );

                // ✅ UPDATE STATE
                if (isMounted) {
                    dispatch(orderListData(orderWithItems));
                    setCustomersData(orderWithItems);
                    setAllData(orderWithItems);
                    console.log("✅ Lazada data fetch COMPLETE");
                }
            } catch (error) {
                console.error("❌ Lazada fetch error:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                    setCardStatus(false);
                    console.log("🏁 Lazada Loading OFF");
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [lazadaOrderStatusCheck, lazadaPrintedIds, lazadaInitialDateRange]);

    return {
        filteredData: allData,
        setFilteredData: setAllData,
        lazadaLoading: loading,
        lazadaPrintedIds,
    };
};