import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLazyGetLazadaOrdersQuery } from "../../../features/allApis/lazadaApi";
import { orderListData } from "../../../features/slice/orderListSlice";
import { isSameDay, parseISO } from "date-fns";
import { checkedItemsChange } from "../../../features/slice/userSlice";

export const useLazadaOrders = ({ lazadaOrderStatusCheck, setLazadaOrderStatusCheck, setCustomersData, clearSelection, location }) => {
    const dispatch = useDispatch();
    const [getLazadaOrders] = useLazyGetLazadaOrdersQuery();
    const [allData, setAllData] = useState([]);
    const [lazadaPrintedIds, setLazadaPrintedIds] = useState([]);
    const [cardStatus, setCardStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const lazadaAppKey = localStorage.getItem("lazadaAppKey");

    const previousStatusRef = useRef(null);

    // Route-based status updates
    useEffect(() => {
        const parts = location.pathname.split("/");
        if (parts.length === 4) {
            const routeStatus = parts[2];
            const statusMap = {
                'printed': "Packed_Printed",
                'shipped': "shipped",
                'needPrint': "Packed"
            };
            const mappedStatus = statusMap[routeStatus];
            if (mappedStatus && setLazadaOrderStatusCheck) {
                setLazadaOrderStatusCheck(mappedStatus);
                setCardStatus(true);
            }
        }
    }, [location, setLazadaOrderStatusCheck]);

    // Fetch printed IDs
    useEffect(() => {
        const fetchPrintedIds = async () => {
            try {
                const res = await fetch(
                    "https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/lazada/printedIds"
                );
                const data = await res.json();
                if (Array.isArray(data)) {
                    setLazadaPrintedIds(data);
                }
            } catch (error) {
                console.error("❌ Error fetching printed IDs:", error);
            }
        };
        fetchPrintedIds();
    }, []);

    // ✅ SIMPLE & BULLETPROOF: Main data fetching
    useEffect(() => {
        if (!lazadaOrderStatusCheck || lazadaOrderStatusCheck === previousStatusRef.current) {
            return;
        }

        previousStatusRef.current = lazadaOrderStatusCheck;

        console.log("🚀 Starting data fetch for:", lazadaOrderStatusCheck);

        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("⏳ Loading ON");

                const now = new Date();
                const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                const toISOString = (date) => date.toISOString().split(".")[0] + "Z";

                dispatch(checkedItemsChange({ items: [], from: lazadaOrderStatusCheck }));
                clearSelection();

                // Get main orders
                const response = await getLazadaOrders({
                    sortBy: "updated_at",
                    createdAfter: toISOString(sevenDaysAgo),
                    createdBefore: toISOString(now),
                    updateAfter: toISOString(sevenDaysAgo),
                    updateBefore: toISOString(now),
                    status: lazadaOrderStatusCheck === "Packed_Printed" ? "Packed" : lazadaOrderStatusCheck,
                    sortDirection: "DESC",
                    offset: 0,
                    limit: 100,
                }).unwrap();

                const parsedBody = JSON.parse(response?.body || "{}");
                let filteredOrderList = parsedBody?.data?.orders || [];

                // Apply filters
                const printedIdSet = new Set(lazadaPrintedIds.map((item) => item.lazadaPrintedId));

                if (lazadaOrderStatusCheck === "Packed") {
                    filteredOrderList = filteredOrderList.filter(item => !printedIdSet.has(String(item.order_id)));
                } else if (lazadaOrderStatusCheck === "Packed_Printed") {
                    filteredOrderList = filteredOrderList.filter(item => printedIdSet.has(String(item.order_id)));
                    if (cardStatus) setCardStatus(false);
                }

                // Fetch item details
                const orderWithItems = await Promise.allSettled(
                    filteredOrderList.map(async (order) => {
                        try {
                            const itemRes = await fetch(
                                // `https://grozziie.zjweiting.com:3091/lazada-open-shop/api/dev/orders/items?orderId=${order.order_id}`,
                                `https://grozziie.zjweiting.com:3091/lazada-open-shop-debug/api/dev/orders/items?orderId=${order.order_id}&appKey=${lazadaAppKey}`,
                                { method: "GET", headers: { accept: "*/*" } }
                            );

                            const itemData = await itemRes.json();
                            let parsedBody = typeof itemData?.body === "string" ? JSON.parse(itemData.body) : itemData?.body || {};

                            return {
                                ...order,
                                orderItemInfo: parsedBody?.data?.order_items || parsedBody?.data || [],
                            };
                        } catch (error) {
                            return {
                                ...order,
                                orderItemInfo: [],
                            };
                        }
                    })
                ).then(results =>
                    results.map(result => result.status === 'fulfilled' ? result.value : result.reason)
                );

                // Update state
                if (isMounted) {
                    dispatch(orderListData(orderWithItems));
                    setCustomersData(orderWithItems);
                    setAllData(orderWithItems);
                    console.log("✅ Data fetch COMPLETE");
                }

            } catch (error) {
                console.error("❌ Fetch error:", error);
            } finally {
                // ✅ GUARANTEED: Always turn off loading
                if (isMounted) {
                    setLoading(false);
                    setCardStatus(false);
                    console.log("🏁 Loading OFF - guaranteed");
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
            // ✅ EXTRA SAFETY: Always reset loading on cleanup
            setLoading(false);
            console.log("🧹 Cleanup: loading reset");
        };
    }, [lazadaOrderStatusCheck]);

    return {
        filteredData: allData,
        setFilteredData: setAllData,
        lazadaLoading: loading,
        lazadaPrintedIds,
        cardStatus,
        setCardStatus,
    };
};