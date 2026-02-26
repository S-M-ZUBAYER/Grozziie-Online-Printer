import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DateTime } from "luxon";
import { useLoadOrderListMutation } from "../../../features/allApis/batchPrintApi";
import { orderListData } from "../../../features/slice/orderListSlice";
import { checkedItemsChange } from "../../../features/slice/userSlice";
import { endOfDay, fromUnixTime, isSameDay, parseISO, startOfDay } from "date-fns";
import { tikTokOrderStatusOptions } from "../../../Share/Data/ClientData";
import { getRegionTimestampsShopeTiktok } from "../../../Share/Function/FunctionalComponent";

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
    const [cardStatus, setCardStatus] = useState(false);
    const [cardStatusCategory, setCardStatusCategory] = useState("");
    const now = new Date();
    const start = startOfDay(now);
    const end = endOfDay(now);

    const previousPathRef = useRef(location.pathname);
    const [cipher] = useState(() => {
        const stored = localStorage.getItem("tiktokShopInfo");
        return stored ? JSON.parse(stored) : [];
    });
    // Get initailly Date rang
    const tiktokInitialDateRange = useSelector(
        (state) => state.user.selectedDateRangRedux
    );




    // ✅ FIXED: Route-based status updates with BOTH status updates
    useEffect(() => {
        const parts = location.pathname.split("/");
        console.log("📍 TikTok Route changed:", location.pathname);

        if (parts.length === 4) {
            const routeStatus = parts[2];
            setCardStatus(true);
            setCardStatusCategory(routeStatus);
            console.log("🔄 TikTok Route status detected:", routeStatus);

            const statusMap = {
                'printed': {
                    value: "AWAITING_COLLECTION_PRINTED",
                    status: "Printed"
                },
                'printedToday': {
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
        if (tikTokOrderStatusCheck === "AWAITING_COLLECTION" || tikTokOrderStatusCheck === "AWAITING_COLLECTION_PRINTED") {
            fetchPrintedIds();
        }

    }, [tikTokOrderStatusCheck]);

    const effectCallCountRef = useRef(0);

    // Main data fetching
    useEffect(() => {
        if (!tikTokOrderStatusCheck) return;
        effectCallCountRef.current += 1;

        console.log(
            `🔁 TikTok useEffect called: ${effectCallCountRef.current} times`
        );
        console.log("🚀 Starting TikTok data fetch for:", tikTokOrderStatusCheck);
        let isMounted = true;
        let nothing;

        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("⏳ TikTok Loading ON");
                if (!cipher?.[0]?.cipher) return;

                const shopInfoRaw = localStorage.getItem("tiktokShopInfo");
                const shopInfo = shopInfoRaw ? JSON.parse(shopInfoRaw) : [];
                const countryCode = shopInfo?.[0]?.region || "MY";
                const dateRange = getRegionTimestampsShopeTiktok(countryCode, tiktokInitialDateRange?.startDate?.split("T")[0], tiktokInitialDateRange?.endDate?.split("T")[0]);
                console.log(dateRange);


                dispatch(checkedItemsChange({ items: [], from: tikTokOrderStatusCheck }));
                clearSelection();
                console.log({
                    cipher: cipher[0]?.cipher,
                    shippingType: "TIKTOK",

                    // createTimeGe: dateRange?.sevenDaysAgo,
                    // createTimeLt: dateRange?.currentTime,
                    // updateTimeGe: dateRange?.sevenDaysAgo,
                    // updateTimeLt: dateRange?.currentTime,
                    createTimeGe: dateRange?.startTime,
                    createTimeLt: dateRange?.endTime,
                    updateTimeGe: dateRange?.startTime,
                    updateTimeLt: dateRange?.endTime,

                    orderStatus:
                        tikTokOrderStatusCheck === "AWAITING_COLLECTION_PRINTED"
                            ? "AWAITING_COLLECTION"
                            : tikTokOrderStatusCheck,

                    pageSize: 50,
                    sortOrder: "DESC",
                });

                // 🔁 PAGINATION LOOP
                let allOrders = [];
                let nextPageToken = undefined;

                while (true) {
                    const response = await loadOrderList({
                        cipher: cipher[0]?.cipher,
                        shippingType: "TIKTOK",

                        // createTimeGe: dateRange?.sevenDaysAgo,
                        // createTimeLt: dateRange?.currentTime,
                        // updateTimeGe: dateRange?.sevenDaysAgo,
                        // updateTimeLt: dateRange?.currentTime,
                        createTimeGe: dateRange?.startTime,
                        createTimeLt: dateRange?.endTime,
                        updateTimeGe: dateRange?.startTime,
                        updateTimeLt: dateRange?.endTime,

                        orderStatus:
                            tikTokOrderStatusCheck === "AWAITING_COLLECTION_PRINTED"
                                ? "AWAITING_COLLECTION"
                                : tikTokOrderStatusCheck,

                        pageSize: 50,
                        sortOrder: "DESC",

                        ...(nextPageToken && { pageToken: nextPageToken }),
                    }).unwrap();

                    const orders = response?.data?.orders ?? [];
                    allOrders = [...allOrders, ...orders];

                    nextPageToken = response?.data?.nextPageToken;

                    // 🛑 Stop when no more pages
                    if (!nextPageToken) break;
                }

                // 🔍 EXISTING FILTER LOGIC
                let filteredOrderList = allOrders.filter(item => item?.buyerEmail);

                // Filter printed IDs to only include today's records
                const todayPrintedIds = tikTokPrintedIds.filter(item => {
                    if (!item.createdAt) return false;
                    return isSameDay(new Date(item.createdAt), new Date());
                });

                const todayPrintedIdSet = new Set(
                    todayPrintedIds.map(item => item.tikTokPrintedId)
                );

                const printedIdSet = new Set(
                    tikTokPrintedIds.map(item => item.tikTokPrintedId)
                );

                if (tikTokOrderStatusCheck === "AWAITING_COLLECTION") {
                    filteredOrderList = filteredOrderList.filter(
                        item => !printedIdSet.has(item.id)
                    );
                } else if (tikTokOrderStatusCheck === "AWAITING_COLLECTION_PRINTED") {
                    if (cardStatus === true && cardStatusCategory === "printedToday") {
                        console.log("today Printed");

                        filteredOrderList = filteredOrderList.filter(
                            item => todayPrintedIdSet.has(item.id)
                        );
                    } else {
                        console.log("Printed");
                        filteredOrderList = filteredOrderList.filter(
                            item => printedIdSet.has(item.id)
                        );
                    }

                } else if (tikTokOrderStatusCheck === "IN_TRANSIT" && cardStatus === true) {
                    filteredOrderList = filteredOrderList.filter((order) => {
                        const updateDate = fromUnixTime(order.updateTime);
                        return updateDate >= start && updateDate <= end;
                    });

                }

                // ✅ UPDATE STATE
                if (isMounted) {
                    console.log(filteredOrderList);

                    dispatch(orderListData(filteredOrderList));
                    setCustomersData(filteredOrderList);
                    setAllData(filteredOrderList);
                    console.log("✅ TikTok data fetch COMPLETE");
                }
            } catch (error) {
                console.error("❌ TikTok fetch error:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                    setCardStatus(false);
                    console.log("🏁 TikTok Loading OFF");
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [tikTokOrderStatusCheck, tikTokPrintedIds, tiktokInitialDateRange]);

    return {
        filteredData: allData,
        setFilteredData: setAllData,
        tiktokLoading: loading,
        tikTokPrintedIds,
    };
};