import React from "react";
import { useDispatch } from "react-redux";
import * as XLSX from "xlsx";
import { decryptArrayData } from "./OrderListFunctions";
import { orderList } from "../Data/ClientData";
import { orderListData } from "../../features/slice/orderListSlice";

export const arrayToExcel = (data, fileName) => {
  const updateData = data?.map((item, index) => {
    if (item.item_list) {
      const newData = {
        ...item,
        goods_count: item?.item_list[0]?.goods_count,
        goods_id: item?.item_list[0]?.goods_id,
        goods_img: item?.item_list[0]?.goods_img,
        goods_name: item?.item_list[0]?.goods_name,
        goods_price: item?.item_list[0]?.goods_price,
        goods_spec: item?.item_list[0]?.goods_spec,
        outer_goods_id: item?.item_list[0]?.outer_goods_id,
        outer_id: item?.item_list[0]?.outer_id,
        sku_id: item?.item_list[0]?.sku_id,
      };
      return newData;
    }
    return item;
  });
  const ws = XLSX.utils.json_to_sheet(updateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
  XLSX.writeFile(wb, fileName + ".xlsx");
};

export const generateRandomNumberWithTime = () => {
  // Get the current date and time
  const currentDate = new Date();
  const currentHour = currentDate.getHours().toString().padStart(2, "0");
  const currentMinute = currentDate.getMinutes().toString().padStart(2, "0");
  const currentSecond = currentDate.getSeconds().toString().padStart(2, "0");

  // Generate two random numbers
  const randomNum1 = Math.floor(Math.random() * 100);
  const randomNum2 = Math.floor(Math.random() * 100);

  // Concatenate the random numbers with date, hour, minute, and second
  const randomNumberWithTime = `${currentDate.getFullYear()}${
    currentDate.getMonth() + 1
  }${currentDate.getDate()}${currentHour}${currentMinute}${currentSecond}${randomNum1}${randomNum2}`;

  return randomNumberWithTime;
};

export const generateRandomNumberForOrder_sn = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  // Generate a 9-digit random number
  const randomPart = Math.floor(Math.random() * 1000000000);

  // Calculate the final random number
  const randomNumber = `${year}${month}-${hour}${minute}${second}${randomPart}`;

  return randomNumber;
};

const FunctionalComponent = () => {
  const dispatch = useDispatch();

  const decryptAndDispatchOrderList = async () => {
    try {
      // Decrypt the orderList
      const decryptedOrderList = await decryptArrayData(orderList);

      // Dispatch the decrypted orderList
      dispatch(orderListData(decryptedOrderList));
    } catch (error) {
      console.error("Error decrypting orderList:", error);
    }
  };

  return <div></div>;
};

export default FunctionalComponent;
