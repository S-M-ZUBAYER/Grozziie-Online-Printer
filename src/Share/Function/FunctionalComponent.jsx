import React from "react";
import { useDispatch } from "react-redux";
import * as XLSX from "xlsx";
import { decryptArrayData } from "./OrderListFunctions";
import { orderList } from "../Data/ClientData";
import { orderListData } from "../../features/slice/orderListSlice";

//pindoudou
// export const arrayToExcel = (data, fileName) => {
//   const updateData = data?.map((item, index) => {
//     if (item.item_list) {
//       const newData = {
//         ...item,
//         goods_count: item?.item_list[0]?.goods_count,
//         goods_id: item?.item_list[0]?.goods_id,
//         goods_img: item?.item_list[0]?.goods_img,
//         goods_name: item?.item_list[0]?.goods_name,
//         goods_price: item?.item_list[0]?.goods_price,
//         goods_spec: item?.item_list[0]?.goods_spec,
//         outer_goods_id: item?.item_list[0]?.outer_goods_id,
//         outer_id: item?.item_list[0]?.outer_id,
//         sku_id: item?.item_list[0]?.sku_id,
//       };
//       return newData;
//     }
//     return item;
//   });
//   const ws = XLSX.utils.json_to_sheet(updateData);
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
//   XLSX.writeFile(wb, fileName + ".xlsx");
// };

export const arrayToExcel = (data, fileName) => {
  const updateData = data?.map((item) => {
    const lineItem = item?.lineItems?.[0] || {};

    return {
      // Order-level fields
      orderId: item.id,
      buyerEmail: item.buyerEmail,
      commercePlatform: item.commercePlatform,
      createTime: item.createTime,
      paidTime: item.paidTime,
      paymentMethod: item.paymentMethodName,
      fulfillmentType: item.fulfillmentType,
      deliveryType: item.deliveryType,
      status: item.status,
      trackingNumber: item.trackingNumber,
      shippingProvider: item.shippingProvider,
      shippingFee: item.payment?.shippingFee,
      totalAmount: item.payment?.totalAmount,

      // Address details
      recipientName: item.recipientAddress?.name,
      phoneNumber: item.recipientAddress?.phoneNumber,
      address: item.recipientAddress?.fullAddress,
      postalCode: item.recipientAddress?.postalCode,

      // Line item fields (first item only)
      productId: lineItem.productId,
      productName: lineItem.productName,
      skuName: lineItem.skuName,
      skuId: lineItem.skuId,
      skuImage: lineItem.skuImage,
      salePrice: lineItem.salePrice,
      sellerSku: lineItem.sellerSku,
      currency: lineItem.currency,
      displayStatus: lineItem.displayStatus,
      packageId: lineItem.packageId,
    };
  });

  const ws = XLSX.utils.json_to_sheet(updateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const lazadaArrayToExcel = (data, fileName) => {
  const updateData = data?.map((item) => {
    const shippingAddress = item?.address_shipping || {};
    const billingAddress = item?.address_billing || {};

    return {
      // Order-level fields
      orderId: item.order_id,
      orderNumber: item.order_number,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      paymentMethod: item.payment_method,
      price: item.price,
      status: (item.statuses && item.statuses[0]) || "",

      // Shipping details
      shippingFee: item.shipping_fee,
      shippingFeeOriginal: item.shipping_fee_original,
      shippingFeeDiscountPlatform: item.shipping_fee_discount_platform,
      shippingFeeDiscountSeller: item.shipping_fee_discount_seller,
      warehouseCode: item.warehouse_code,

      // Buyer info
      customerFirstName: item.customer_first_name,
      customerLastName: item.customer_last_name,
      buyerNote: item.buyer_note,
      remarks: item.remarks,

      // Shipping address
      shippingName: `${shippingAddress.first_name || ""} ${
        shippingAddress.last_name || ""
      }`.trim(),
      shippingPhone: shippingAddress.phone,
      shippingAddress1: shippingAddress.address1,
      shippingAddress2: shippingAddress.address2,
      shippingAddress3: shippingAddress.address3,
      shippingAddress4: shippingAddress.address4,
      shippingAddress5: shippingAddress.address5,
      shippingCity: shippingAddress.city,
      shippingPostCode: shippingAddress.post_code,
      shippingCountry: shippingAddress.country,

      // Billing address
      billingName: `${billingAddress.first_name || ""} ${
        billingAddress.last_name || ""
      }`.trim(),
      billingPhone: billingAddress.phone,
      billingAddress1: billingAddress.address1,
      billingAddress2: billingAddress.address2,
      billingAddress3: billingAddress.address3,
      billingAddress4: billingAddress.address4,
      billingAddress5: billingAddress.address5,
      billingCity: billingAddress.city,
      billingPostCode: billingAddress.post_code,
      billingCountry: billingAddress.country,

      // Vouchers & tax
      voucher: item.voucher,
      voucherPlatform: item.voucher_platform,
      voucherSeller: item.voucher_seller,
      taxCode: item.tax_code,

      // Misc
      branchNumber: item.branch_number,
      deliveryInfo: item.delivery_info,
      promisedShippingTimes: item.promised_shipping_times,
      giftOption: item.gift_option,
      giftMessage: item.gift_message,
    };
  });

  const ws = XLSX.utils.json_to_sheet(updateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
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
