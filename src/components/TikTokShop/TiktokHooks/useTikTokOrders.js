import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { DateTime } from "luxon";
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
    }, [tikTokOrderStatusCheck]);

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



                // ============================================================

                const shopInfoRaw = localStorage.getItem("tiktokShopInfo");
                const shopInfo = shopInfoRaw ? JSON.parse(shopInfoRaw) : [];

                const countryCode = shopInfo?.[0]?.region || "MY";
                console.log("Shopee country:", countryCode);


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

                        // Convert to timestamps (seconds since epoch)
                        const currentTimestamp = Math.floor(nowInRegion.toSeconds());
                        const sevenDaysAgoTimestamp = Math.floor(sevenDaysAgo.toSeconds());

                        // Also get ISO strings for verification
                        const currentISO = nowInRegion.toISO();
                        const sevenDaysAgoISO = sevenDaysAgo.toISO();

                        return {
                            currentTime: currentTimestamp, // Unix timestamp in seconds
                            sevenDaysAgo: sevenDaysAgoTimestamp, // Unix timestamp in seconds
                            currentTimeISO: currentISO, // ISO string for debugging
                            sevenDaysAgoISO: sevenDaysAgoISO, // ISO string for debugging
                            region: regionUpper,
                            timezone: timezone,
                            regionCurrentTime: nowInRegion.toFormat("yyyy-MM-dd HH:mm:ss"),
                            regionSevenDaysAgo: sevenDaysAgo.toFormat("yyyy-MM-dd HH:mm:ss"),
                        };
                    } catch (error) {
                        console.error("Error:", error.message);
                        return {
                            error: error.message,
                            regionCode: regionCode,
                        };
                    }
                }

                const dateRange = getRegionTimestamps(countryCode);
                console.log({
                    cipher: cipher[0]?.cipher,
                    shippingType: "TIKTOK",
                    createTimeGe: dateRange?.sevenDaysAgo,
                    createTimeLt: dateRange?.currentTime,
                    updateTimeGe: dateRange?.sevenDaysAgo,
                    updateTimeLt: dateRange?.currentTime,
                    // createTimeGe: sevenDaysAgo,
                    // createTimeLt: now,
                    // updateTimeGe: sevenDaysAgo,
                    // updateTimeLt: now,
                    orderStatus: tikTokOrderStatusCheck === "AWAITING_COLLECTION_PRINTED" ? "AWAITING_COLLECTION" : tikTokOrderStatusCheck,
                    pageSize: 70,
                    sortOrder: "DESC",
                })


                // ============================================================



                dispatch(checkedItemsChange({ items: [], from: tikTokOrderStatusCheck }));
                clearSelection();

                const response = await loadOrderList({
                    cipher: cipher[0]?.cipher,
                    shippingType: "TIKTOK",
                    createTimeGe: dateRange?.sevenDaysAgo,
                    createTimeLt: dateRange?.currentTime,
                    updateTimeGe: dateRange?.sevenDaysAgo,
                    updateTimeLt: dateRange?.currentTime,
                    // createTimeGe: sevenDaysAgo,
                    // createTimeLt: now,
                    // updateTimeGe: sevenDaysAgo,
                    // updateTimeLt: now,
                    orderStatus: tikTokOrderStatusCheck === "AWAITING_COLLECTION_PRINTED" ? "AWAITING_COLLECTION" : tikTokOrderStatusCheck,
                    pageSize: 70,
                    sortOrder: "DESC",
                }).unwrap();

                const orders = response?.data?.orders ?? [];
                let filteredOrderList = orders.filter((item) => item?.buyerEmail);

                // Apply filters
                const printedIdSet = new Set(tikTokPrintedIds.map((item) => item.tikTokPrintedId));

                console.log(tikTokOrderStatusCheck);


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
    }, [tikTokOrderStatusCheck, tikTokPrintedIds]);

    return {
        filteredData: allData,
        setFilteredData: setAllData,
        tiktokLoading: loading,
        tikTokPrintedIds,
    };
};