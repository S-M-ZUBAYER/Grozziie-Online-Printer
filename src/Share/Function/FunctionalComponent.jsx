import React from "react";
import { useDispatch } from "react-redux";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { decryptArrayData } from "./OrderListFunctions";
import { orderList } from "../Data/ClientData";
import { orderListData } from "../../features/slice/orderListSlice";

export const arrayToExcel = async (data, fileName) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("TikTok Orders");

  // =========================
  // 1️⃣ Define columns
  // =========================
  worksheet.columns = [
    { header: "Order ID", key: "orderId", width: 24 },
    { header: "Order Status", key: "orderStatus", width: 18 },
    { header: "Created Time", key: "createTime", width: 22 },
    { header: "Updated Time", key: "updateTime", width: 22 },

    { header: "Buyer Email", key: "buyerEmail", width: 35 },
    { header: "Payment Method", key: "paymentMethod", width: 22 },
    { header: "COD", key: "isCod", width: 12 },

    { header: "Recipient Name", key: "recipientName", width: 22 },
    { header: "Recipient Phone", key: "recipientPhone", width: 22 },
    { header: "Full Address", key: "fullAddress", width: 50 },
    { header: "Country", key: "country", width: 16 },
    { header: "State", key: "state", width: 18 },
    { header: "District", key: "district", width: 18 },
    { header: "Post Code", key: "postCode", width: 14 },

    { header: "Item ID", key: "itemId", width: 24 },
    { header: "Product Name", key: "productName", width: 45 },
    { header: "SKU Name", key: "skuName", width: 28 },
    { header: "Seller SKU", key: "sellerSku", width: 22 },
    { header: "SKU ID", key: "skuId", width: 26 },
    { header: "SKU Items Count", key: "skuItemsCount", width: 20 },

    { header: "Original Price", key: "originalPrice", width: 18 },
    { header: "Sale Price", key: "salePrice", width: 18 },
    { header: "Platform Discount", key: "platformDiscount", width: 18 },
    { header: "Seller Discount", key: "sellerDiscount", width: 18 },

    { header: "Shipping Provider", key: "shippingProvider", width: 22 },
    { header: "Tracking Number", key: "trackingNumber", width: 26 },
  ];

  // =========================
  // 2️⃣ Header Style (GREEN)
  // =========================
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, size: 13 };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4CAF50" }, // ✅ Green
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // =========================
  // 3️⃣ Fill data (GROUP BY SKU)
  // =========================
  data?.forEach((order) => {
    const address = order?.recipientAddress || {};
    const districts = address?.districtInfo || [];

    const country = districts.find((d) => d.addressLevel === "L0")?.addressName;
    const state = districts.find((d) => d.addressLevel === "L1")?.addressName;
    const district = districts.find(
      (d) => d.addressLevel === "L2"
    )?.addressName;

    // 🔥 GROUP lineItems by skuId
    const skuMap = {};

    order?.lineItems?.forEach((item) => {
      const skuKey = item.skuId;

      if (!skuMap[skuKey]) {
        skuMap[skuKey] = {
          count: 0,
          item, // store first item as reference
        };
      }
      skuMap[skuKey].count += 1;
    });

    // 🔥 Add ONE row per SKU
    Object.values(skuMap).forEach(({ item, count }) => {
      worksheet.addRow({
        orderId: order.id,
        orderStatus: order.status,
        createTime: new Date(order.createTime * 1000).toLocaleString(),
        updateTime: new Date(order.updateTime * 1000).toLocaleString(),

        buyerEmail: order.buyerEmail,
        paymentMethod: order.paymentMethodName,
        isCod: order.isCod ? "YES" : "NO",

        recipientName: address.name,
        recipientPhone: address.phoneNumber,
        fullAddress: address.fullAddress,
        country,
        state,
        district,
        postCode: address.postalCode,

        // ✅ SKU LEVEL
        skuId: item.skuId,
        itemId: item.id,
        productName: item.productName,
        skuName: item.skuName,
        sellerSku: item.sellerSku,

        // ✅ COUNT
        skuItemsCount: count,

        originalPrice: item.originalPrice,
        salePrice: item.salePrice,
        platformDiscount: item.platformDiscount,
        sellerDiscount: item.sellerDiscount,

        shippingProvider: item.shippingProviderName,
        trackingNumber: item.trackingNumber,
      });
    });
  });

  // =========================
  // 4️⃣ Export Excel file
  // =========================
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `${fileName}.xlsx`
  );
};

export const lazadaArrayToExcel = async (data, fileName) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Lazada Orders");

  // ======================
  // 1️⃣ Columns definition
  // ======================
  worksheet.columns = [
    { header: "Order ID", key: "orderId", width: 22 },
    { header: "Order Status", key: "orderStatus", width: 18 },
    { header: "Created At", key: "createdAt", width: 22 },
    { header: "Updated At", key: "updatedAt", width: 22 },

    { header: "Buyer First Name", key: "buyerFirstName", width: 22 },
    { header: "Buyer Last Name", key: "buyerLastName", width: 22 },
    { header: "Buyer Phone", key: "buyerPhone", width: 22 },

    { header: "Shipping Address", key: "shippingAddress", width: 45 },
    { header: "Shipping City", key: "shippingCity", width: 20 },
    { header: "Shipping Country", key: "shippingCountry", width: 20 },
    { header: "Shipping Post Code", key: "shippingPostCode", width: 22 },

    { header: "Item ID", key: "itemId", width: 22 },
    { header: "Item Name", key: "itemName", width: 45 },
    { header: "Variation", key: "variation", width: 30 },
    { header: "SKU Name", key: "sku", width: 18 },
    { header: "SKU ID", key: "skuId", width: 26 },
    { header: "SKU Items Count", key: "skuItemsCount", width: 20 },

    { header: "Original Price", key: "originalPrice", width: 18 },
    { header: "Paid Price", key: "paidPrice", width: 18 },
    { header: "Voucher Amount", key: "voucherAmount", width: 20 },

    { header: "Shipping Provider", key: "shippingProvider", width: 28 },
    { header: "Tracking Code", key: "trackingCode", width: 28 },
  ];

  // ======================
  // 2️⃣ Header Styling (GREEN)
  // ======================
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, size: 13 };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF9C27B0" }, // ✅ Purple
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // ======================
  // 3️⃣ Data rows (GROUP BY SKU)
  // ======================
  data?.forEach((order) => {
    const shipping = order?.address_shipping || {};

    // 🔥 Group order items by sku_id
    const skuMap = {};

    order?.orderItemInfo?.forEach((item) => {
      const skuKey = item.sku_id;

      if (!skuMap[skuKey]) {
        skuMap[skuKey] = {
          count: 0,
          item, // store first item as reference
        };
      }

      skuMap[skuKey].count += 1;
    });

    // 🔥 One row per unique SKU
    Object.values(skuMap).forEach(({ item, count }) => {
      worksheet.addRow({
        orderId: order.order_id,
        orderStatus: item.status,
        createdAt: order.created_at,
        updatedAt: order.updated_at,

        buyerFirstName: order.customer_first_name,
        buyerLastName: order.customer_last_name,
        buyerPhone: shipping.phone,

        shippingAddress: [
          shipping.address1,
          shipping.address2,
          shipping.address3,
          shipping.address4,
          shipping.address5,
        ]
          .filter(Boolean)
          .join(", "),
        shippingCity: shipping.city,
        shippingCountry: shipping.country,
        shippingPostCode: shipping.post_code,

        // ✅ SKU LEVEL
        skuId: item.sku_id,
        itemId: item.order_item_id,
        itemName: item.name,
        variation: item.variation,
        sku: item.sku,

        // ✅ COUNT
        skuItemsCount: count,

        originalPrice: item.item_price,
        paidPrice: item.paid_price,
        voucherAmount: item.voucher_amount,

        shippingProvider: item.shipment_provider,
        trackingCode: item.tracking_code,
      });
    });
  });

  // ======================
  // 4️⃣ Export file
  // ======================
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `${fileName}.xlsx`
  );
};

export const shopeeArrayToExcel = async (data, fileName) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Shopee Orders");

  /* ===================== DEFINE COLUMNS ===================== */
  worksheet.columns = [
    { header: "Order SN", key: "orderSn", width: 25 },
    { header: "Order Status", key: "orderStatus", width: 20 },
    { header: "Create Time", key: "createTime", width: 22 },
    { header: "Update Time", key: "updateTime", width: 22 },
    { header: "Ship By Date", key: "shipByDate", width: 22 },
    { header: "Currency", key: "currency", width: 12 },
    { header: "Total Amount", key: "totalAmount", width: 18 },

    { header: "Recipient Name", key: "recipientName", width: 22 },
    { header: "Recipient Phone", key: "recipientPhone", width: 20 },
    { header: "Full Address", key: "recipientFullAddress", width: 40 },
    { header: "City", key: "recipientCity", width: 18 },
    { header: "State", key: "recipientState", width: 18 },
    { header: "Zip Code", key: "recipientZipcode", width: 15 },

    // ✅ SKU LEVEL
    { header: "SKU Name", key: "itemSku", width: 18 },
    { header: "SKU Items Count", key: "skuItemsCount", width: 18 },

    { header: "Item ID", key: "itemId", width: 22 },
    { header: "Item Name", key: "itemName", width: 35 },
    { header: "Model ID", key: "modelId", width: 22 },
    { header: "Model Name", key: "modelName", width: 25 },

    { header: "Original Price", key: "originalPrice", width: 18 },
    { header: "Discounted Price", key: "discountedPrice", width: 18 },
    { header: "Item Total", key: "itemTotal", width: 18 },

    { header: "Tracking Number", key: "trackingNumber", width: 25 },
  ];

  /* ===================== HEADER STYLE (ORANGE) ===================== */
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF9800" }, // 🟠 Shopee Orange
    };
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  });

  /* ===================== ADD ROWS (GROUP BY item_sku) ===================== */
  data?.forEach((order) => {
    const address = order?.recipient_address || {};

    // 🔥 Group items by item_sku
    const skuMap = {};

    order?.item_list?.forEach((item) => {
      const skuKey = item.item_sku;

      if (!skuMap[skuKey]) {
        skuMap[skuKey] = {
          count: 0,
          item,
        };
      }

      skuMap[skuKey].count += item.model_quantity_purchased || 0;
    });

    // 🔥 One row per SKU
    Object.values(skuMap).forEach(({ item, count }) => {
      worksheet.addRow({
        orderSn: order.order_sn,
        orderStatus: order.order_status,
        createTime: order.create_time
          ? new Date(order.create_time * 1000).toLocaleString()
          : "",
        updateTime: order.update_time
          ? new Date(order.update_time * 1000).toLocaleString()
          : "",
        shipByDate: order.ship_by_date
          ? new Date(order.ship_by_date * 1000).toLocaleString()
          : "",
        currency: order.currency || "",
        totalAmount: order.total_amount || "",

        recipientName: address.name || "",
        recipientPhone: address.phone || "",
        recipientFullAddress: address.full_address || "",
        recipientCity: address.city || "",
        recipientState: address.state || "",
        recipientZipcode: address.zipcode || "",

        // ✅ SKU DATA
        itemSku: item.item_sku,
        skuItemsCount: count,

        itemId: item.item_id,
        itemName: item.item_name,
        modelId: item.model_id,
        modelName: item.model_name || "",

        originalPrice: item.model_original_price || 0,
        discountedPrice: item.model_discounted_price || 0,
        itemTotal: (item.model_discounted_price || 0) * count,

        trackingNumber: order.tracking_number || "",
      });
    });
  });

  /* ===================== DATA ROW STYLE ===================== */
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      row.height = 22;
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
    }
  });

  /* ===================== FREEZE HEADER ===================== */
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  /* ===================== EXPORT FILE ===================== */
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${fileName}.xlsx`);
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
