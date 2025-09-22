import { useState, useEffect } from "react";
// import { useLazyGetShopeeOrdersQuery, useLazyGetShopeeOrderDetailsQuery } from "../../features/allApis/shopeeApi";
import { useLazyGetShopeeOrdersQuery, useLazyGetShopeeOrderDetailsQuery } from "../../../features/allApis/shopeeApi";

export const useShopeeOrders = (selectedStore) => {
    const [getShopeeOrders] = useLazyGetShopeeOrdersQuery();
    const [getShopeeOrderDetails] = useLazyGetShopeeOrderDetailsQuery();

    const [printedIds, setPrintedIds] = useState([]);
    const [todayPrinted, setTodayPrinted] = useState([]);
    const [readyToShip, setReadyToShip] = useState([]);
    const [processed, setProcessed] = useState([]);
    const [processedPrinted, setProcessedPrinted] = useState([]);
    const [processedUnprinted, setProcessedUnprinted] = useState([]);
    const [shippedOrders, setShippedOrders] = useState([]);
    const [shippedToday, setShippedToday] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [cancelled, setCancelled] = useState([]);

    useEffect(() => {
        const fetchPrintedIds = async () => {
            try {
                const res = await fetch("https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/shopee/printedIds");
                const data = await res.json();
                if (Array.isArray(data)) setPrintedIds(data);
            } catch (err) {
                console.error("Shopee printed IDs fetch failed:", err);
            }
        };
        fetchPrintedIds();
    }, [selectedStore]);

    useEffect(() => {
        const fetchOrders = async () => {
            const statuses = ["READY_TO_SHIP", "PROCESSED", "SHIPPED", "COMPLETED", "CANCELLED"];
            const nowUnix = Math.floor(Date.now() / 1000);
            const tenDaysAgoUnix = nowUnix - 10 * 24 * 60 * 60;
            const printedSet = new Set(printedIds.map(i => i.shopeePrintedId));

            for (const status of statuses) {
                try {
                    const res = await getShopeeOrders({ status, limit: 100, offset: 0 }).unwrap();
                    const orderList = res?.orders || [];
                    const printedOrders = orderList.filter(item => printedSet.has(item.order_sn));
                    const unprintedOrders = orderList.filter(item => !printedSet.has(item.order_sn));

                    switch (status) {
                        case "READY_TO_SHIP": setReadyToShip(orderList); break;
                        case "PROCESSED":
                            setProcessed(orderList);
                            setProcessedPrinted(printedOrders);
                            setProcessedUnprinted(unprintedOrders);
                            break;
                        case "SHIPPED":
                            setShippedOrders(orderList);
                            setShippedToday(orderList.filter(o => {
                                const date = new Date(o.update_time * 1000);
                                const start = new Date(); start.setHours(0, 0, 0, 0);
                                const end = new Date(); end.setHours(23, 59, 59, 999);
                                return date >= start && date <= end;
                            })); break;
                        case "COMPLETED": setCompleted(orderList); break;
                        case "CANCELLED": setCancelled(orderList); break;
                    }
                } catch (err) {
                    console.error(`Shopee ${status} fetch failed:`, err);
                }
            }
        };
        fetchOrders();
    }, [printedIds, selectedStore, getShopeeOrders]);

    return {
        printedIds,
        todayPrinted,
        readyToShip,
        processed,
        processedPrinted,
        processedUnprinted,
        shippedOrders,
        shippedToday,
        completed,
        cancelled,
    };
};
