import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { lazadaOrderStatusOptions } from "../../../Share/Data/ClientData";

export const useLazadaOrderStatus = (initialStatus = "") => {
    const selectedLazadaOrderStatus = useSelector(
        (state) => state.user.lazadaSelectStatus
    );

    const pendingOption = useMemo(
        () => lazadaOrderStatusOptions.find((opt) => opt.value === "pending"),
        []
    );

    const [lazadaOrderStatusCheck, setLazadaOrderStatusCheck] = useState(
        initialStatus || selectedLazadaOrderStatus || pendingOption?.value || ""
    );

    useEffect(() => {
        if (selectedLazadaOrderStatus && !initialStatus) {
            setLazadaOrderStatusCheck(selectedLazadaOrderStatus);
        }
    }, [selectedLazadaOrderStatus, initialStatus]);

    const selectedStatus = useMemo(() => {
        const matchedOption = lazadaOrderStatusOptions.find(
            (opt) => opt.value === lazadaOrderStatusCheck
        );
        return matchedOption?.status || pendingOption?.status || "";
    }, [lazadaOrderStatusCheck, pendingOption]);

    return {
        lazadaOrderStatusCheck,
        setLazadaOrderStatusCheck,
        selectedStatus,
    };
};