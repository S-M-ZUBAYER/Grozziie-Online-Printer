import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DeliveryCompanyList from "../../Share/DeliveryCompanyList/DeliveryCompanyList";
import { orderList } from "../../Share/Data/ClientData";
import axios from "axios";
import { w3cwebsocket as WebSocket } from "websocket";
import { decryptArrayData } from "../../Share/Function/OrderListFunctions";
import { orderListData } from "../../features/slice/orderListSlice";
import { orderListParameter } from "../BatchPrint/OrderListParameter";
import { useLoadOrderListMutation } from "../../features/allApis/batchPrintApi";
import world from "../../assets/world.png";
import toast from "react-hot-toast";

const CallTheOrder = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    country: "",
    message: "",
  });
  const [orderListDataEncrypt, setOrderListDataEncrypt] = useState([]);
  const [loadOrderList, { isLoading, isError }] = useLoadOrderListMutation();
  const dispatch = useDispatch();
  // const orderList = useSelector((state) => state.orderList.data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await loadOrderList(orderListParameter);
        if ("error" in response) {
          console.log("This is response error");
        } else {
          console.log(response, "check response");
          const orderList = response?.data?.order_list_get_response?.order_list;
          console.log(
            response?.data?.order_list_get_response?.order_list,
            "Check"
          );
          const filteredOrderList = orderList?.filter((item) => {
            return item.address !== "";
          });

          setOrderListDataEncrypt(filteredOrderList.slice(0, 2));
          // setOrderListDataEncrypt(orderList.slice(10, 18));
          // dispatch(
          //     orderListData(filteredOrderList)
          // );
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  console.log(orderList, "orderList");
  const decryptAndDispatchOrderList = async () => {
    try {
      // Decrypt the orderList
      const decryptedOrderList = await decryptArrayData(orderListDataEncrypt);
      console.log(decryptedOrderList);
      // Dispatch the decrypted orderList
      dispatch(orderListData(decryptedOrderList));

      console.log(decryptedOrderList, "check response"); // Log the decrypted orderList
    } catch (error) {
      console.error("Error decrypting orderList:", error);
    }
  };

  useEffect(() => {
    decryptAndDispatchOrderList();
  }, [orderListDataEncrypt]);

  // useEffect(() => {
  //     const decryptAndDispatchOrderList = async () => {
  //         console.log("decript")
  //         try {
  //             // Decrypt the orderList
  //             if (orderList) {
  //                 const decryptedOrderList = await decryptArrayData(orderList);

  //                 // Dispatch the decrypted orderList
  //                 // dispatch(orderListData(decryptedOrderList));

  //                 console.log(decryptedOrderList, "check response"); // Log the decrypted orderList
  //             }

  //         } catch (error) {
  //             console.error('Error decrypting orderList:', error);
  //         }
  //     };

  //     // Call decryptAndDispatchOrderList when component mounts
  //     decryptAndDispatchOrderList();

  //     // Optionally, you can return a cleanup function here if needed
  //     // return () => {
  //     //     // Cleanup code
  //     // };

  // }, [orderList]); // Empty dependency array to run once when component mounts

  console.log(
    "orderListDataEncrypt",
    orderListDataEncrypt,
    "orderListDataEncrypt"
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success("Thank you for your message");
    console.log(formData);
    setFormData({
      userName: "",
      email: "",
      country: "",
      message: "",
    });
  };

  return <div className=""></div>;
};

export default CallTheOrder;
