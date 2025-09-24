// import { useState, useEffect } from "react";
// import { useLazyGetLazadaOrdersQuery } from "../../../features/allApis/lazadaApi";

// export const useLazadaOrders = (selectedStore) => {
//     const [getLazadaOrders] = useLazyGetLazadaOrdersQuery();

//     const [printedIds, setPrintedIds] = useState([]);
//     const [printedToday, setPrintedToday] = useState([]);
//     const [newOrders, setNewOrders] = useState([]);
//     const [packed, setPacked] = useState([]);
//     const [packedPrinted, setPackedPrinted] = useState([]);
//     const [packedUnprinted, setPackedUnprinted] = useState([]);
//     const [shippedToday, setShippedToday] = useState([]);
//     const [delivered, setDelivered] = useState([]);
//     const [cancelled, setCancelled] = useState([]);

//     useEffect(() => {
//         const fetchPrintedIds = async () => {
//             try {
//                 const res = await fetch("https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/lazada/printedIds");
//                 const data = await res.json();
//                 if (Array.isArray(data)) {
//                     setPrintedIds(data);
//                     setPrintedToday(data.filter(item => new Date(item.createdAt).toDateString() === new Date().toDateString()));
//                 }
//             } catch (err) {
//                 console.error("Lazada printed IDs fetch failed:", err);
//             }
//         };
//         fetchPrintedIds();
//     }, [selectedStore]);

//     useEffect(() => {
//         const fetchOrders = async () => {
//             const statuses = ["pending", "Packed", "ready_to_ship", "shipped", "delivered", "Canceled"];
//             const now = new Date();
//             const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
//             const toISOString = date => date.toISOString().split(".")[0] + "Z";
//             const printedSet = new Set(printedIds.map(i => String(i.lazadaPrintedId)));

//             for (const status of statuses) {
//                 try {
//                     const response = await getLazadaOrders({
//                         sortBy: "updated_at",
//                         createdAfter: toISOString(tenDaysAgo),
//                         createdBefore: toISOString(now),
//                         updateAfter: toISOString(tenDaysAgo),
//                         updateBefore: toISOString(now),
//                         status,
//                         sortDirection: "DESC",
//                         offset: 0,
//                         limit: 100,
//                     }).unwrap();

//                     const orderList = JSON.parse(response?.body || "{}")?.data?.orders || [];
//                     const printedOrders = orderList.filter(item => printedSet.has(String(item.order_id)));
//                     const unprintedOrders = orderList.filter(item => !printedSet.has(String(item.order_id)));

//                     switch (status) {
//                         case "pending": setNewOrders(orderList); break;
//                         case "Packed":
//                             setPacked(orderList);
//                             setPackedPrinted(printedOrders);
//                             setPackedUnprinted(unprintedOrders);
//                             break;
//                         case "shipped":
//                             setShippedToday(orderList.filter(o => {
//                                 const date = new Date(o.updated_at);
//                                 const start = new Date(); start.setHours(0, 0, 0, 0);
//                                 const end = new Date(); end.setHours(23, 59, 59, 999);
//                                 return date >= start && date <= end;
//                             })); break;
//                         case "delivered": setDelivered(orderList); break;
//                         case "Canceled": setCancelled(orderList); break;
//                     }
//                 } catch (err) {
//                     console.error(`Lazada ${status} fetch failed:`, err);
//                 }
//             }
//         };
//         fetchOrders();
//     }, [printedIds, selectedStore, getLazadaOrders]);

//     return {
//         printedIds,
//         printedToday,
//         newOrders,
//         packed,
//         packedPrinted,
//         packedUnprinted,
//         shippedToday,
//         delivered,
//         cancelled,
//     };
// };


import { useEffect, useState } from "react";
import { fromUnixTime, isSameDay } from "date-fns";
import { lazadaOrderStatusOptions } from "../constants/orderStatusOptions";
import { useLazyGetLazadaOrdersQuery } from "../../../features/allApis/lazadaApi";

export const useLazadaOrders = (printedIds, selectedStore) => {
    const [getLazadaOrders] = useLazyGetLazadaOrdersQuery();
    const [orders, setOrders] = useState({});
    const [todayPrinted, setTodayPrinted] = useState([]);

    useEffect(() => {
        if (!selectedStore) return;

        const fetchOrders = async () => {
            try {
                const printedSet = new Set(printedIds.map((i) => i.lazadaPrintedId));
                const now = new Date();
                const results = {};

                for (const { value } of lazadaOrderStatusOptions) {
                    const res = await getLazadaOrders({ status: value, limit: 100 }).unwrap();
                    const orderList = res?.orders || [];

                    if (value === "Packed") {
                        results.packedUnprinted = orderList.filter((o) => !printedSet.has(o.order_id));
                        results.packedPrinted = orderList.filter((o) => printedSet.has(o.order_id));
                    } else if (value === "shipped") {
                        results.shippedToday = orderList.filter((o) =>
                            isSameDay(fromUnixTime(o.update_time), now)
                        );
                    }
                    results[value] = orderList;
                }

                const todayPrintedOrders = printedIds.filter((item) =>
                    isSameDay(new Date(item.createdAt), now)
                );
                setTodayPrinted(todayPrintedOrders);

                setOrders(results);
            } catch (err) {
                console.error("Lazada fetch failed:", err);
            }
        };

        fetchOrders();
    }, [printedIds, selectedStore, getLazadaOrders]);

    return { ...orders, todayPrinted };
};
