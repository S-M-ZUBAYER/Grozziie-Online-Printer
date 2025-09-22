import { useState, useEffect } from "react";
import { useLoadOrderListMutation } from "../../../features/allApis/batchPrintApi";
import { isSameDay, parseISO, startOfDay, endOfDay, fromUnixTime } from "date-fns";

export const useTikTokOrders = (cipher, selectedStore) => {
    const [loadOrderList] = useLoadOrderListMutation();

    const [printedIds, setPrintedIds] = useState([]);
    const [printedToday, setPrintedToday] = useState([]);
    const [awaitingShipment, setAwaitingShipment] = useState([]);
    const [awaitingCollection, setAwaitingCollection] = useState([]);
    const [awaitingCollectionPrinted, setAwaitingCollectionPrinted] = useState([]);
    const [awaitingCollectionUnprinted, setAwaitingCollectionUnprinted] = useState([]);
    const [deliveredOrders, setDeliveredOrders] = useState([]);
    const [cancelledOrders, setCancelledOrders] = useState([]);
    const [shippedToday, setShippedToday] = useState([]);

    const now = new Date();
    const start = startOfDay(now);
    const end = endOfDay(now);

    useEffect(() => {
        const fetchPrintedIds = async () => {
            if (!cipher.length) return;
            try {
                const res = await fetch("https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/printedIds");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setPrintedIds(data);
                    setPrintedToday(data.filter(item => isSameDay(parseISO(item.createdAt), now)));
                }
            } catch (err) {
                console.error("TikTok Printed IDs fetch failed:", err);
            }
        };
        fetchPrintedIds();
    }, [cipher, selectedStore]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!cipher[0]?.cipher) return;
            const statuses = ["AWAITING_SHIPMENT", "AWAITING_COLLECTION", "IN_TRANSIT", "DELIVERED", "CANCELLED"];
            const nowUnix = Math.floor(Date.now() / 1000);
            const sevenDaysAgoUnix = nowUnix - 10 * 24 * 60 * 60;
            const printedSet = new Set(printedIds.map(i => i.tikTokPrintedId?.toString()));

            for (const status of statuses) {
                try {
                    const res = await loadOrderList({
                        cipher: cipher[0]?.cipher,
                        createTimeGe: sevenDaysAgoUnix,
                        createTimeLt: nowUnix,
                        updateTimeGe: sevenDaysAgoUnix,
                        updateTimeLt: nowUnix,
                        orderStatus: status,
                        pageSize: 100,
                        sortOrder: "DESC",
                    }).unwrap();

                    const orderList = res?.data?.orders || [];
                    const printedOrders = orderList.filter(item => printedSet.has(item.id?.toString()));
                    const unprintedOrders = orderList.filter(item => !printedSet.has(item.id?.toString()));

                    switch (status) {
                        case "AWAITING_SHIPMENT": setAwaitingShipment(orderList); break;
                        case "AWAITING_COLLECTION":
                            setAwaitingCollection(orderList);
                            setAwaitingCollectionPrinted(printedOrders);
                            setAwaitingCollectionUnprinted(unprintedOrders);
                            break;
                        case "IN_TRANSIT":
                            setShippedToday(orderList.filter(order => {
                                const updateDate = fromUnixTime(order.updateTime);
                                return updateDate >= start && updateDate <= end;
                            }));
                            break;
                        case "DELIVERED": setDeliveredOrders(orderList); break;
                        case "CANCELLED": setCancelledOrders(orderList); break;
                    }
                } catch (err) {
                    console.error(`TikTok ${status} fetch failed:`, err);
                }
            }
        };
        fetchOrders();
    }, [cipher, printedIds, selectedStore, loadOrderList]);

    return {
        printedIds,
        printedToday,
        awaitingShipment,
        awaitingCollection,
        awaitingCollectionPrinted,
        awaitingCollectionUnprinted,
        deliveredOrders,
        cancelledOrders,
        shippedToday,
    };
};
