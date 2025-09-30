import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { orderListData } from "../../../features/slice/orderListSlice";

export const useOrderData = () => {
    const dispatch = useDispatch();
    const orderListDataGet = useSelector((state) => state.orderList.data);
    const [totalOrderData, setTotalOrderData] = useState(orderListDataGet);
    const [customersData, setCustomersData] = useState([]);

    useEffect(() => {
        setTotalOrderData(orderListDataGet);
        setCustomersData(orderListDataGet);
    }, [orderListDataGet]);

    // If you need to update the Redux store from this hook
    const updateOrderListData = (newData) => {
        dispatch(orderListData(newData));
    };

    return {
        totalOrderData,
        setTotalOrderData,
        customersData,
        setCustomersData,
        updateOrderListData, // Useful function instead of raw dispatch
    };
};