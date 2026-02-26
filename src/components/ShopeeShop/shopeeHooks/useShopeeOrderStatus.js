
import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { ShopeeOrderStatusOptions } from "../../../Share/Data/ClientData";

export const useShopeeOrderStatus = (initialStatus = "") => {
    const selectedShopeeOrderStatus = useSelector(
        (state) => state.user.shopeeSelectStatus
    );

    const defaultOption = useMemo(
        () => ShopeeOrderStatusOptions.find((opt) => opt.value === "READY_TO_SHIP"),
        []
    );

    const [shopeeOrderStatusCheck, setShopeeOrderStatusCheck] = useState(
        initialStatus || selectedShopeeOrderStatus || defaultOption?.value || ""
    );

    // Sync with Redux when it changes
    useEffect(() => {
        if (selectedShopeeOrderStatus && !initialStatus) {
            setShopeeOrderStatusCheck(selectedShopeeOrderStatus);
        }
    }, [selectedShopeeOrderStatus, initialStatus]);

    const selectedStatus = useMemo(() => {
        const matchedOption = ShopeeOrderStatusOptions.find(
            (opt) => opt.value === shopeeOrderStatusCheck // Use local state instead of Redux
        );
        return matchedOption?.status || defaultOption?.status || "";
    }, [shopeeOrderStatusCheck, defaultOption]);

    return {
        shopeeOrderStatusCheck,
        setShopeeOrderStatusCheck,
        selectedStatus,
    };
};