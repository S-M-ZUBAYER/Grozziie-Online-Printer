


// import { useState, useEffect, useRef, useCallback } from "react";
// import { useDispatch } from "react-redux";
// import { useLazyGetLazadaOrdersQuery } from "../../../features/allApis/lazadaApi";
// import { orderListData } from "../../../features/slice/orderListSlice";
// import { checkedItemsChange } from "../../../features/slice/userSlice";

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

//     const lazadaAccountId = localStorage.getItem("lazadaAccountId");
//     const previousStatusRef = useRef(null);
//     const isFetchingRef = useRef(false);
//     const isMountedRef = useRef(true);

//     // Store status in ref to avoid stale closures
//     const currentStatusRef = useRef(lazadaOrderStatusCheck);

//     // Keep ref updated with current status
//     useEffect(() => {
//         currentStatusRef.current = lazadaOrderStatusCheck;
//     }, [lazadaOrderStatusCheck]);

//     useEffect(() => {
//         return () => {
//             isMountedRef.current = false;
//         };
//     }, []);

//     // ✅ Route-based status sync - FIXED
//     useEffect(() => {
//         const parts = location.pathname.split("/");

//         if (parts.length === 4) {
//             const routeStatus = parts[2];
//             const statusMap = {
//                 NewOrders: "pending",
//                 printed: "Packed_Printed",
//                 shipped: "shipped",
//                 needPrint: "Packed",
//                 Cancelled: "Canceled",
//             };

//             const mappedStatus = statusMap[routeStatus];
//             const currentStatus = currentStatusRef.current; // Use ref instead of state


//             if (mappedStatus && mappedStatus !== currentStatus) {
//                 console.log("🔄 Route changed status from", currentStatus, "to", mappedStatus);
//                 setLazadaOrderStatusCheck(mappedStatus);
//                 setCardStatus(true);

//                 // Force immediate fetch with new status
//                 fetchLazadaOrdersData(mappedStatus);
//             }
//         }
//     }, [location, setLazadaOrderStatusCheck, lazadaPrintedIds]);

//     // ✅ Fetch printed IDs (once)
//     useEffect(() => {
//         const fetchPrintedIds = async () => {
//             try {
//                 const res = await fetch(
//                     "https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/lazada/printedIds"
//                 );
//                 const data = await res.json();

//                 if (Array.isArray(data)) {
//                     setLazadaPrintedIds(data);
//                 }
//             } catch (error) {
//                 console.error("❌ Error fetching printed IDs:", error);
//             }
//         };
//         fetchPrintedIds();
//     }, []);

//     // ✅ Main Data Fetcher - FIXED
//     const fetchLazadaOrdersData = useCallback(async (statusToFetch = null) => {
//         // ALWAYS use the explicitly passed statusToFetch, never fall back to ref/state
//         const fetchStatus = statusToFetch !== null && statusToFetch !== undefined
//             ? statusToFetch
//             : currentStatusRef.current;

//         if (!fetchStatus || isFetchingRef.current) return;

//         isFetchingRef.current = true;
//         if (initialLoad) setInitialLoad(false);

//         console.log("🚀 Fetch Lazada orders for:", fetchStatus, "| Called with:", statusToFetch);

//         if (cardStatus === false) {
//             setLoading(true);
//         }

//         try {
//             const now = new Date();
//             const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//             const toISOString = (d) => d.toISOString().split(".")[0] + "Z";

//             // ✅ Clear selection with correct status
//             dispatch(checkedItemsChange({ items: [], from: fetchStatus }));
//             clearSelection();

//             const response = await getLazadaOrders({
//                 sortBy: "updated_at",
//                 createdAfter: toISOString(sevenDaysAgo),
//                 createdBefore: toISOString(now),
//                 updateAfter: toISOString(sevenDaysAgo),
//                 updateBefore: toISOString(now),
//                 status: fetchStatus === "Packed_Printed" ? "ready_to_ship" : fetchStatus,
//                 sortDirection: "DESC",
//                 offset: 0,
//                 limit: 100,
//             }).unwrap();

//             const parsedBody = JSON.parse(response?.body || "{}");
//             let filteredOrderList = parsedBody?.data?.orders || [];
//             console.log({
//                 sortBy: "updated_at",
//                 createdAfter: toISOString(sevenDaysAgo),
//                 createdBefore: toISOString(now),
//                 updateAfter: toISOString(sevenDaysAgo),
//                 updateBefore: toISOString(now),
//                 status: fetchStatus === "Packed_Printed" ? "ready_to_ship" : fetchStatus,
//                 sortDirection: "DESC",
//                 offset: 0,
//                 limit: 100,
//             });
//             console.log(filteredOrderList.length);

//             // ✅ Filter printed/unprinted using fetchStatus
//             const printedIdSet = new Set(
//                 lazadaPrintedIds.map((item) => item.lazadaPrintedId)
//             );


//             if (fetchStatus === "Packed") {
//                 filteredOrderList = filteredOrderList.filter(
//                     (order) => !printedIdSet.has(String(order.order_id))
//                 );
//             } else if (fetchStatus === "Packed_Printed") {
//                 filteredOrderList = filteredOrderList.filter((order) =>
//                     printedIdSet.has(String(order?.order_id))
//                 );
//                 if (cardStatus) setCardStatus(false);
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
//         // Remove lazadaOrderStatusCheck from dependencies
//         lazadaPrintedIds,
//         lazadaAccountId,
//         getLazadaOrders,
//         dispatch,
//         clearSelection,
//         setCustomersData,
//         initialLoad,
//         cardStatus,
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

//     // ✅ Effect: printed ID updates (auto refresh)
//     useEffect(() => {
//         if (
//             lazadaOrderStatusCheck === "Packed" ||
//             lazadaOrderStatusCheck === "Packed_Printed"
//         ) {
//             fetchLazadaOrdersData();
//         }
//     }, [lazadaPrintedIds, lazadaOrderStatusCheck, fetchLazadaOrdersData]);

//     // ✅ Return consistent data
//     return {
//         filteredData: allData,
//         setFilteredData: setAllData,
//         lazadaLoading: loading && !initialLoad,
//         lazadaPrintedIds,
//         cardStatus,
//         setCardStatus,
//         refetch: () => fetchLazadaOrdersData(), // Optional: add refetch function
//     };
// };



import { useState, useEffect, useRef, useCallback } from "react";
import { DateTime } from 'luxon';
import { useDispatch } from "react-redux";
import { useLazyGetLazadaOrdersQuery } from "../../../features/allApis/lazadaApi";
import { orderListData } from "../../../features/slice/orderListSlice";
import { checkedItemsChange } from "../../../features/slice/userSlice";

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
    const [cardStatus, setCardStatus] = useState(false);
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);
    const [printedIdsLoaded, setPrintedIdsLoaded] = useState(false); // ✅ Track printed IDs loading

    const lazadaAccountId = localStorage.getItem("lazadaAccountId");
    const previousStatusRef = useRef(null);
    const isFetchingRef = useRef(false);
    const isMountedRef = useRef(true);
    const hasInitialRouteHandledRef = useRef(false); // ✅ Track if initial route handled

    // Store status in ref to avoid stale closures
    const currentStatusRef = useRef(lazadaOrderStatusCheck);

    // Keep ref updated with current status
    useEffect(() => {
        currentStatusRef.current = lazadaOrderStatusCheck;
    }, [lazadaOrderStatusCheck]);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // ✅ Fetch printed IDs (once) - MUST load first
    useEffect(() => {
        const fetchPrintedIds = async () => {
            try {
                console.log("🔄 Fetching printed IDs...");
                const res = await fetch(
                    "https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/lazada/printedIds"
                );
                const data = await res.json();

                if (Array.isArray(data)) {
                    console.log("✅ Printed IDs loaded:", data.length);
                    setLazadaPrintedIds(data);
                    setPrintedIdsLoaded(true);
                }
            } catch (error) {
                console.error("❌ Error fetching printed IDs:", error);
                setPrintedIdsLoaded(true); // Still set to true even on error
            }
        };
        fetchPrintedIds();
    }, []);

    // ✅ Route-based status sync - FIXED
    useEffect(() => {
        // Don't handle route changes until printed IDs are loaded
        if (!printedIdsLoaded) return;

        const parts = location.pathname.split("/");

        if (parts.length === 4) {
            const routeStatus = parts[2];
            const statusMap = {
                NewOrders: "pending",
                printed: "Packed_Printed",
                shipped: "shipped",
                needPrint: "Packed",
                Cancelled: "Canceled",
            };

            const mappedStatus = statusMap[routeStatus];
            const currentStatus = currentStatusRef.current;

            if (mappedStatus && mappedStatus !== currentStatus) {
                console.log("🔄 Route changed status from", currentStatus, "to", mappedStatus);
                console.log("📦 Printed IDs available:", lazadaPrintedIds.length);

                setLazadaOrderStatusCheck(mappedStatus);
                setCardStatus(true);

                // Force immediate fetch with new status
                fetchLazadaOrdersData(mappedStatus);
                hasInitialRouteHandledRef.current = true;
            }
        }
    }, [location, printedIdsLoaded, lazadaPrintedIds, setLazadaOrderStatusCheck]);

    // ✅ Main Data Fetcher - FIXED
    const fetchLazadaOrdersData = useCallback(async (statusToFetch = null) => {
        // ALWAYS use the explicitly passed statusToFetch, never fall back to ref/state
        const fetchStatus = statusToFetch !== null && statusToFetch !== undefined
            ? statusToFetch
            : currentStatusRef.current;

        if (!fetchStatus || isFetchingRef.current) return;

        // If we're trying to fetch Packed_Printed but printed IDs aren't loaded yet, wait
        if ((fetchStatus === "Packed_Printed" || fetchStatus === "Packed") && !printedIdsLoaded) {
            console.log("⏳ Waiting for printed IDs to load before fetching", fetchStatus);
            return;
        }

        isFetchingRef.current = true;
        if (initialLoad) setInitialLoad(false);

        console.log("🚀 Fetch Lazada orders for:", fetchStatus, "| Printed IDs:", lazadaPrintedIds.length);

        if (cardStatus === false) {
            setLoading(true);
        }

        try {
            const shopInfoRaw = localStorage.getItem("lazadaShopInfo");

            const shopInfo = shopInfoRaw ? JSON.parse(shopInfoRaw) : [];

            const countryCode = shopInfo?.[0]?.region || "MY";

            console.log(countryCode); // "MY"

            const now = new Date();
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const toISOString = (d) => d.toISOString().split(".")[0] + "Z";

            // ✅ Clear selection after loading ON (so no blank flash)
            dispatch(checkedItemsChange({ items: [], from: lazadaOrderStatusCheck }));
            clearSelection();




            // ==============================================================

            function getRegionTimestamps(regionCode) {
                // Map region codes to Luxon timezone strings
                const regionTimezones = {
                    // Southeast Asia
                    MY: "Asia/Kuala_Lumpur", // Malaysia
                    SG: "Asia/Singapore", // Singapore
                    PH: "Asia/Manila", // Philippines
                    TH: "Asia/Bangkok", // Thailand
                    VN: "Asia/Ho_Chi_Minh", // Vietnam
                    ID: "Asia/Jakarta", // Indonesia (Western)
                    "ID-B": "Asia/Makassar", // Indonesia (Central)
                    "ID-P": "Asia/Jayapura", // Indonesia (Eastern)

                    // East Asia
                    CN: "Asia/Shanghai", // China
                    HK: "Asia/Hong_Kong", // Hong Kong
                    TW: "Asia/Taipei", // Taiwan
                    JP: "Asia/Tokyo", // Japan
                    KR: "Asia/Seoul", // South Korea

                    // South Asia
                    IN: "Asia/Kolkata", // India
                    BD: "Asia/Dhaka", // Bangladesh
                    PK: "Asia/Karachi", // Pakistan
                    LK: "Asia/Colombo", // Sri Lanka

                    // Middle East
                    AE: "Asia/Dubai", // UAE
                    SA: "Asia/Riyadh", // Saudi Arabia
                    QA: "Asia/Qatar", // Qatar

                    // Europe
                    GB: "Europe/London", // UK
                    DE: "Europe/Berlin", // Germany
                    FR: "Europe/Paris", // France
                    IT: "Europe/Rome", // Italy
                    ES: "Europe/Madrid", // Spain
                    RU: "Europe/Moscow", // Russia

                    // Americas
                    US: "America/New_York", // USA (Eastern)
                    "US-C": "America/Chicago", // USA (Central)
                    "US-M": "America/Denver", // USA (Mountain)
                    "US-P": "America/Los_Angeles", // USA (Pacific)
                    CA: "America/Toronto", // Canada (Eastern)
                    "CA-P": "America/Vancouver", // Canada (Pacific)
                    BR: "America/Sao_Paulo", // Brazil
                    MX: "America/Mexico_City", // Mexico

                    // Oceania
                    AU: "Australia/Sydney", // Australia (Eastern)
                    "AU-C": "Australia/Adelaide", // Australia (Central)
                    "AU-W": "Australia/Perth", // Australia (Western)
                    NZ: "Pacific/Auckland", // New Zealand
                };

                try {
                    if (!regionCode || typeof regionCode !== "string") {
                        throw new Error("Please provide a region code");
                    }

                    const regionUpper = regionCode.toUpperCase();
                    const timezone = regionTimezones[regionUpper];

                    if (!timezone) {
                        const validRegions = Object.keys(regionTimezones)
                            .filter(
                                (k) =>
                                    !k.includes("-") || k.startsWith(regionUpper.split("-")[0])
                            )
                            .slice(0, 20) // Show first 20 for readability
                            .join(", ");
                        throw new Error(
                            `Invalid region code. Some valid codes are: ${validRegions}...`
                        );
                    }

                    // Get current time in the region
                    const nowInRegion = DateTime.now().setZone(timezone);

                    // Get 7 days ago at midnight in the region
                    const sevenDaysAgo = nowInRegion.minus({ days: 7 }).startOf("day");

                    // Convert to format: 2025-12-22T08:06:56Z
                    const currentTimeUTC = nowInRegion.toUTC().toISO().replace(/\.\d+/, "").replace(/\+00:00$/, "Z");
                    const sevenDaysAgoUTC = sevenDaysAgo.toUTC().toISO().replace(/\.\d+/, "").replace(/\+00:00$/, "Z");

                    // Also keep local timezone versions for debugging
                    const currentTimeLocal = nowInRegion.toISO().replace(/\.\d+/, "").replace(/\+00:00$/, "Z");
                    const sevenDaysAgoLocal = sevenDaysAgo.toISO().replace(/\.\d+/, "").replace(/\+00:00$/, "Z");

                    return {
                        // Main return values in the format you need: 2025-12-22T08:06:56Z
                        currentTime: currentTimeUTC,
                        sevenDaysAgo: sevenDaysAgoUTC,

                        // Local timezone versions (also in Z format)
                        currentTimeLocal: currentTimeLocal,
                        sevenDaysAgoLocal: sevenDaysAgoLocal,

                        // Unix timestamps (seconds since epoch) - kept for compatibility
                        currentTimestamp: Math.floor(nowInRegion.toSeconds()),
                        sevenDaysAgoTimestamp: Math.floor(sevenDaysAgo.toSeconds()),

                        // Debug info
                        region: regionUpper,
                        timezone: timezone,
                        regionCurrentTime: nowInRegion.toFormat("yyyy-MM-dd HH:mm:ss"),
                        regionSevenDaysAgo: sevenDaysAgo.toFormat("yyyy-MM-dd HH:mm:ss"),
                    };
                } catch (error) {
                    console.error("Error:", error.message);

                    // Fallback to current UTC time in the required format
                    const nowUTC = new Date().toISOString().replace(/\.\d+/, "").replace(/\+00:00$/, "Z");
                    const sevenDaysAgoUTC = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().replace(/\.\d+/, "").replace(/\+00:00$/, "Z");

                    return {
                        currentTime: nowUTC,
                        sevenDaysAgo: sevenDaysAgoUTC,
                        region: "UTC",
                        timezone: "UTC",
                        error: error.message,
                    };
                }
            }

            const lazadaDateFormate = getRegionTimestamps("SG")
            console.log(lazadaDateFormate);



            // ==============================================================





            console.log({
                sortBy: "updated_at",
                // createdAfter: toISOString(sevenDaysAgo),
                // createdBefore: toISOString(now),
                // updateAfter: toISOString(sevenDaysAgo),
                // updateBefore: toISOString(now),
                createdAfter: lazadaDateFormate.sevenDaysAgo,
                createdBefore: lazadaDateFormate.currentTime,
                updateAfter: lazadaDateFormate.sevenDaysAgo,
                updateBefore: lazadaDateFormate.currentTime,

                status: fetchStatus === "Packed_Printed" ? "ready_to_ship" : fetchStatus,
                sortDirection: "DESC",
                offset: 0,
                limit: 100,
            });



            // const response = await getLazadaOrders({
            //     sortBy: "updated_at",

            //     // createdAfter: toISOString(sevenDaysAgo, offset),
            //     // createdBefore: toISOString(now, offset),
            //     // updateAfter: toISOString(sevenDaysAgo, offset),
            //     // updateBefore: toISOString(now, offset),

            //     createdAfter: lazadaDateFormate.sevenDaysAgo,
            //     createdBefore: lazadaDateFormate.currentTime,
            //     updateAfter: lazadaDateFormate.sevenDaysAgo,
            //     updateBefore: lazadaDateFormate.currentTime,

            //     status: fetchStatus === "Packed_Printed" ? "ready_to_ship" : fetchStatus,
            //     sortDirection: "DESC",
            //     offset: 0,
            //     limit: 1,
            // }).unwrap();

            // const parsedBody = JSON.parse(response?.body || "{}");
            // let filteredOrderList = parsedBody?.data?.orders || [];


            // console.log("📊 Raw orders from API:", parsedBody);


            let allOrders = [];
            let offset = 0;
            const limit = 50;
            let countTotal = 0;

            while (true) {
                const response = await getLazadaOrders({
                    sortBy: "updated_at",
                    createdAfter: lazadaDateFormate.sevenDaysAgo,
                    createdBefore: lazadaDateFormate.currentTime,
                    updateAfter: lazadaDateFormate.sevenDaysAgo,
                    updateBefore: lazadaDateFormate.currentTime,
                    status: fetchStatus === "Packed_Printed" ? "ready_to_ship" : fetchStatus,
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





            // ✅ Filter printed/unprinted using fetchStatus
            const printedIdSet = new Set(
                lazadaPrintedIds.map((item) => item.lazadaPrintedId)
            );

            console.log("🔢 Printed IDs in Set:", printedIdSet.size);

            if (fetchStatus === "Packed") {
                const beforeFilter = filteredOrderList.length;
                filteredOrderList = filteredOrderList.filter(
                    (order) => !printedIdSet.has(String(order.order_id))
                );
                console.log(`📦 Packed: Filtered ${beforeFilter - filteredOrderList.length} printed orders`);
            } else if (fetchStatus === "Packed_Printed") {
                const beforeFilter = filteredOrderList.length;
                filteredOrderList = filteredOrderList.filter((order) =>
                    printedIdSet.has(String(order?.order_id))
                );
                console.log(`🖨️ Packed_Printed: Found ${filteredOrderList.length} printed orders out of ${beforeFilter}`);
                if (cardStatus) setCardStatus(false);
            }



            // Only fetch item details if we have orders
            if (filteredOrderList.length === 0) {
                dispatch(orderListData([]));
                setCustomersData([]);
                setAllData([]);
                return;
            }

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

            if (!isMountedRef.current) return;

            // ✅ Only update data once
            dispatch(orderListData(orderWithItems));
            setCustomersData(orderWithItems);
            setAllData(orderWithItems);
            console.log("✅ Final data set with:", orderWithItems.length, "orders");
        } catch (error) {
            console.error("❌ Lazada fetch error:", error);
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
                setCardStatus(false);
            }
            isFetchingRef.current = false;
        }
    }, [
        lazadaPrintedIds,
        lazadaAccountId,
        getLazadaOrders,
        dispatch,
        clearSelection,
        setCustomersData,
        initialLoad,
        cardStatus,
        printedIdsLoaded, // ✅ Add to dependencies
    ]);

    // ✅ Effect: status change - FIXED
    useEffect(() => {
        if (!lazadaOrderStatusCheck) return;

        // Compare with ref instead of previous state
        if (lazadaOrderStatusCheck === previousStatusRef.current) return;

        console.log("📊 Status changed from:", previousStatusRef.current, "to:", lazadaOrderStatusCheck);
        previousStatusRef.current = lazadaOrderStatusCheck;

        // Always pass the new status explicitly
        fetchLazadaOrdersData(lazadaOrderStatusCheck);
    }, [lazadaOrderStatusCheck, fetchLazadaOrdersData]);

    // ✅ Effect: printed ID updates (auto refresh) - ONLY when loaded
    useEffect(() => {
        if (!printedIdsLoaded) return;

        if (
            lazadaOrderStatusCheck === "Packed" ||
            lazadaOrderStatusCheck === "Packed_Printed"
        ) {
            console.log("🔄 Refetching due to printed IDs update");
            fetchLazadaOrdersData();
        }
    }, [lazadaPrintedIds, lazadaOrderStatusCheck, fetchLazadaOrdersData, printedIdsLoaded]);

    // ✅ Initial fetch when printed IDs are loaded
    useEffect(() => {
        if (printedIdsLoaded && !hasInitialRouteHandledRef.current) {
            console.log("🏁 Initial fetch with printed IDs loaded");
            fetchLazadaOrdersData();
        }
    }, [printedIdsLoaded, fetchLazadaOrdersData]);

    // ✅ Return consistent data
    return {
        filteredData: allData,
        setFilteredData: setAllData,
        lazadaLoading: loading && !initialLoad,
        lazadaPrintedIds,
        cardStatus,
        setCardStatus,
        refetch: () => fetchLazadaOrdersData(),
        printedIdsLoaded, // ✅ Expose for debugging
    };
};