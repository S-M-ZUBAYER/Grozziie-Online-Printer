import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { tikTokOrderStatusOptions } from "../../../Share/Data/ClientData";

export const useTikTokOrderStatus = (initialStatus = "") => {
    const selectedTitTokOrderStatus = useSelector(
        (state) => state.user.tikTokSelectStatus
    );

    const defaultOption = useMemo(
        () => tikTokOrderStatusOptions.find((opt) => opt.value === "AWAITING_SHIPMENT"),
        []
    );

    const [tikTokOrderStatusCheck, setTikTokOrderStatusCheck] = useState(
        initialStatus || selectedTitTokOrderStatus || defaultOption?.value || ""
    );

    const [selectedStatus, setSelectedStatus] = useState(() => {
        const matchedOption = tikTokOrderStatusOptions.find(
            (opt) => opt.value === (initialStatus || selectedTitTokOrderStatus)
        );
        return matchedOption?.status || defaultOption?.status || "";
    });

    // Update both status and selectedStatus when tikTokOrderStatusCheck changes
    useEffect(() => {
        const matchedOption = tikTokOrderStatusOptions.find(
            (opt) => opt.value === tikTokOrderStatusCheck
        );
        setSelectedStatus(matchedOption?.status || defaultOption?.status || "");
    }, [tikTokOrderStatusCheck, defaultOption]);

    // Update when Redux status changes
    useEffect(() => {
        if (selectedTitTokOrderStatus && !initialStatus) {
            setTikTokOrderStatusCheck(selectedTitTokOrderStatus);
        }
    }, [selectedTitTokOrderStatus, initialStatus]);

    return {
        tikTokOrderStatusCheck,
        setTikTokOrderStatusCheck,
        selectedStatus,
        setSelectedStatus,
    };
};