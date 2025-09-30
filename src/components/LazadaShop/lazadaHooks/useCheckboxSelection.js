import { useState, useCallback } from "react";

export const useCheckboxSelection = () => {
    const [selectAll, setSelectAll] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);

    const handleMasterCheckboxChange = useCallback((currentData) => {
        setSelectAll(prev => !prev);
        setCheckedItems(prev => prev.length === currentData.length ? [] : currentData);
    }, []);

    const handleCheckboxChange = useCallback((order, currentData) => {
        setCheckedItems(prev => {
            const isAlreadyChecked = prev.some(item => item?.order_id === order?.order_id);

            if (isAlreadyChecked) {
                const updatedItems = prev.filter(item => item?.order_id !== order?.order_id);
                setSelectAll(false);
                return updatedItems;
            } else {
                const updatedItems = [...prev, order];
                setSelectAll(updatedItems.length === currentData.length);
                return updatedItems;
            }
        });
    }, []);

    const clearSelection = useCallback(() => {
        setSelectAll(false);
        setCheckedItems([]);
    }, []);

    return {
        selectAll,
        checkedItems,
        setSelectAll,
        setCheckedItems,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        clearSelection,
    };
};