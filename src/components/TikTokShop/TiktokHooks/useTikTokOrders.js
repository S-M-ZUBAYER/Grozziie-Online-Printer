import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLoadOrderListMutation } from "../../../features/allApis/batchPrintApi";
import { orderListData } from "../../../features/slice/orderListSlice";
import { checkedItemsChange } from "../../../features/slice/userSlice";
import { fromUnixTime, isSameDay, parseISO } from "date-fns";
import { tikTokOrderStatusOptions } from "../../../Share/Data/ClientData";

export const useTikTokOrders = ({
    tikTokOrderStatusCheck,
    setTikTokOrderStatusCheck,
    setSelectedStatus,
    setCustomersData,
    clearSelection,
    location
}) => {
    const dispatch = useDispatch();
    const [loadOrderList] = useLoadOrderListMutation();
    const [allData, setAllData] = useState([]);
    const [tikTokPrintedIds, setTikTokPrintedIds] = useState([]);
    const [loading, setLoading] = useState(false);

    const previousPathRef = useRef(location.pathname);
    const [cipher] = useState(() => {
        const stored = localStorage.getItem("tiktokShopInfo");
        return stored ? JSON.parse(stored) : [];
    });
    console.log("status.........................dsfkjmgalsjdflj");

    // ✅ FIXED: Route-based status updates with BOTH status updates
    useEffect(() => {
        const parts = location.pathname.split("/");
        console.log("📍 TikTok Route changed:", location.pathname);

        if (parts.length === 4) {
            const routeStatus = parts[2];
            console.log("🔄 TikTok Route status detected:", routeStatus);

            const statusMap = {
                'printed': {
                    value: "AWAITING_COLLECTION_PRINTED",
                    status: "Printed"
                },
                'shipped': {
                    value: "IN_TRANSIT",
                    status: "On The Way"
                },
                'needPrint': {
                    value: "AWAITING_COLLECTION",
                    status: "shipping"
                },
                'NewOrders': {
                    value: "AWAITING_SHIPMENT",
                    status: "Waiting For Shipment"
                },
                'Cancelled': {
                    value: "CANCELLED",
                    status: "Cancel"
                }
            };

            const mappedStatus = statusMap[routeStatus];
            if (mappedStatus && setTikTokOrderStatusCheck && setSelectedStatus) {
                console.log("🎯 Setting TikTok status from route:", mappedStatus);

                // ✅ Update BOTH status values
                setTikTokOrderStatusCheck(mappedStatus.value);
                setSelectedStatus(mappedStatus.status);

                // Reset loading to ensure clean state
                setLoading(false);
            }
        }
    }, [location, setTikTokOrderStatusCheck, setSelectedStatus]);

    // Fetch printed IDs
    useEffect(() => {
        const fetchPrintedIds = async () => {
            try {
                const res = await fetch(
                    "https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/printedIds"
                );
                const data = await res.json();
                if (Array.isArray(data)) {
                    setTikTokPrintedIds(data);
                }
            } catch (error) {
                console.error("❌ Error fetching TikTok printed IDs:", error);
            }
        };
        fetchPrintedIds();
    }, []);

    // Main data fetching
    useEffect(() => {
        if (!tikTokOrderStatusCheck) return;

        console.log("🚀 Starting TikTok data fetch for:", tikTokOrderStatusCheck);

        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("⏳ TikTok Loading ON");

                if (!cipher?.[0]?.cipher) return;

                const now = Math.floor(Date.now() / 1000);
                const sevenDaysAgo = now - 7 * 24 * 60 * 60;

                dispatch(checkedItemsChange({ items: [], from: tikTokOrderStatusCheck }));
                clearSelection();

                const response = await loadOrderList({
                    cipher: cipher[0]?.cipher,
                    shippingType: "TIKTOK",
                    createTimeGe: sevenDaysAgo,
                    createTimeLt: now,
                    updateTimeGe: sevenDaysAgo,
                    updateTimeLt: now,
                    orderStatus: tikTokOrderStatusCheck === "AWAITING_COLLECTION_PRINTED" ? "AWAITING_COLLECTION" : tikTokOrderStatusCheck,
                    pageSize: 100,
                    sortOrder: "DESC",
                }).unwrap();

                const orders = response?.data?.orders ?? [];
                let filteredOrderList = orders.filter((item) => item?.buyerEmail);

                // Apply filters
                const printedIdSet = new Set(tikTokPrintedIds.map((item) => item.tikTokPrintedId));

                if (tikTokOrderStatusCheck === "AWAITING_COLLECTION") {
                    filteredOrderList = filteredOrderList.filter(item => !printedIdSet.has(item.id));
                } else if (tikTokOrderStatusCheck === "AWAITING_COLLECTION_PRINTED") {
                    filteredOrderList = filteredOrderList.filter(item => printedIdSet.has(item.id));
                }

                // Update state
                if (isMounted) {
                    dispatch(orderListData(filteredOrderList));
                    setCustomersData(filteredOrderList);
                    setAllData(filteredOrderList);
                    console.log("✅ TikTok data fetch COMPLETE");
                }

            } catch (error) {
                console.error("❌ TikTok fetch error:", error);
            } finally {
                // ✅ GUARANTEED: Always turn off loading
                if (isMounted) {
                    setLoading(false);
                    console.log("🏁 TikTok Loading OFF");
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [tikTokOrderStatusCheck]);

    return {
        filteredData: allData,
        setFilteredData: setAllData,
        tiktokLoading: loading,
        tikTokPrintedIds,
    };
};