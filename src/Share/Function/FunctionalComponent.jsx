import React from "react";
import { useDispatch } from "react-redux";
import ExcelJS from "exceljs";
import { DateTime } from "luxon";
import { saveAs } from "file-saver";
import { decryptArrayData } from "./OrderListFunctions";
import { orderList } from "../Data/ClientData";
import { orderListData } from "../../features/slice/orderListSlice";

export const tiktokArrayToExcel = async (data, fileName, t) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("TikTok Orders");

  // =========================
  // 1️⃣ Define columns
  // =========================
  worksheet.columns = [
    { header: t("orderId"), key: "orderId", width: 24 },
    { header: t("OrderStatus"), key: "orderStatus", width: 18 },
    { header: t("CreatedAt"), key: "createTime", width: 22 },
    { header: t("UpdatedAt"), key: "updateTime", width: 22 },

    { header: t("BuyerEmail"), key: "buyerEmail", width: 35 },
    { header: t("PaymentMethod"), key: "paymentMethod", width: 22 },
    { header: t("COD"), key: "isCod", width: 12 },

    { header: t("RecipientName"), key: "recipientName", width: 22 },
    { header: t("RecipientPhone"), key: "recipientPhone", width: 22 },
    { header: t("FullAddress"), key: "fullAddress", width: 50 },
    { header: t("Country"), key: "country", width: 16 },
    { header: t("State"), key: "state", width: 18 },
    { header: t("District"), key: "district", width: 18 },
    { header: t("PostCode"), key: "postCode", width: 14 },

    { header: t("ItemNumber"), key: "itemId", width: 24 },
    { header: t("ProductName"), key: "productName", width: 45 },
    { header: t("SKU"), key: "skuName", width: 28 },
    { header: t("SellerSKU"), key: "sellerSku", width: 22 },
    { header: t("SkuId"), key: "skuId", width: 26 },
    { header: t("SkuItemsCount"), key: "skuItemsCount", width: 20 },

    { header: t("OriginalPrice"), key: "originalPrice", width: 18 },
    { header: t("SalePrice"), key: "salePrice", width: 18 },
    { header: t("PlatformDiscount"), key: "platformDiscount", width: 18 },
    { header: t("SellerDiscount"), key: "sellerDiscount", width: 18 },

    { header: t("ShippingProvider"), key: "shippingProvider", width: 22 },
    { header: t("TrackingNumber"), key: "trackingNumber", width: 26 },
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

export const lazadaArrayToExcel = async (data, fileName, t) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Lazada Orders");

  // ======================
  // 1️⃣ Columns definition
  // ======================

  worksheet.columns = [
    { header: t("orderId"), key: "orderId", width: 22 },
    { header: t("OrderStatus"), key: "orderStatus", width: 18 },
    { header: t("CreatedAt"), key: "createdAt", width: 22 },
    { header: t("UpdatedAt"), key: "updatedAt", width: 22 },

    { header: t("BuyerFirstName"), key: "buyerFirstName", width: 22 },
    { header: t("BuyerLastName"), key: "buyerLastName", width: 22 },
    { header: t("BuyerPhone"), key: "buyerPhone", width: 22 },

    { header: t("ShippingAddress"), key: "shippingAddress", width: 45 },
    { header: t("ShippingCity"), key: "shippingCity", width: 20 },
    { header: t("ShippingCountry"), key: "shippingCountry", width: 20 },
    { header: t("ShippingPostCode"), key: "shippingPostCode", width: 22 },

    { header: t("ItemNumber"), key: "itemId", width: 22 },
    { header: t("ProductName"), key: "itemName", width: 45 },
    { header: t("Variation"), key: "variation", width: 30 },
    { header: t("SKU"), key: "sku", width: 18 },
    { header: t("SkuId"), key: "skuId", width: 26 },
    { header: t("SkuItemsCount"), key: "skuItemsCount", width: 20 },

    { header: t("OriginalPrice"), key: "originalPrice", width: 18 },
    { header: t("PaidPrice"), key: "paidPrice", width: 18 },
    { header: t("VoucherAmount"), key: "voucherAmount", width: 20 },

    { header: t("ShippingProvider"), key: "shippingProvider", width: 28 },
    { header: t("TrackingNumber"), key: "trackingCode", width: 28 },
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

export const shopeeArrayToExcel = async (data, fileName, t) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Shopee Orders");

  /* ===================== DEFINE COLUMNS ===================== */

  worksheet.columns = [
    { header: t("orderId"), key: "orderSn", width: 25 },
    { header: t("OrderStatus"), key: "orderStatus", width: 20 },
    { header: t("CreatedAt"), key: "createTime", width: 22 },
    { header: t("UpdatedAt"), key: "updateTime", width: 22 },
    { header: t("ShipByDate"), key: "shipByDate", width: 22 },
    { header: t("Currency"), key: "currency", width: 12 },
    { header: t("TotalAmount"), key: "totalAmount", width: 18 },

    { header: t("RecipientName"), key: "recipientName", width: 22 },
    { header: t("RecipientPhone"), key: "recipientPhone", width: 20 },
    { header: t("FullAddress"), key: "recipientFullAddress", width: 40 },
    { header: t("ShippingCity"), key: "recipientCity", width: 18 },
    { header: t("State"), key: "recipientState", width: 18 },
    { header: t("PostCode"), key: "recipientZipcode", width: 15 },

    // SKU LEVEL
    { header: t("SKU"), key: "itemSku", width: 18 },
    { header: t("SkuItemsCount"), key: "skuItemsCount", width: 18 },

    { header: t("ItemNumber"), key: "itemId", width: 22 },
    { header: t("ProductName"), key: "itemName", width: 35 },
    { header: t("ModelId"), key: "modelId", width: 22 },
    { header: t("ModelName"), key: "modelName", width: 25 },

    { header: t("OriginalPrice"), key: "originalPrice", width: 18 },
    { header: t("DiscountedPrice"), key: "discountedPrice", width: 18 },
    { header: t("ItemTotal"), key: "itemTotal", width: 18 },

    { header: t("TrackingNumber"), key: "trackingNumber", width: 25 },
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

export const getRegionTimestampsShopeTiktokPreCorrect = (regionCode) => {
  // Map region codes to Luxon timezone strings
  const regionTimezones = {
    // Southeast Asia
    MY: "Asia/Kuala_Lumpur", // Malaysia
    SG: "Asia/Singapore", // Singapore
    PH: "Asia/Manila", // Philippines
    TH: "Asia/Bangkok", // Thailand
    VN: "Asia/Ho_Chi_Minh", // Vietnam
    ID: "Asia/Jakarta", // Indonesia (Western)
    "ID-B": "Asia/Makassar", // Indonesia (Central)
    "ID-P": "Asia/Jayapura", // Indonesia (Eastern)

    // East Asia
    CN: "Asia/Shanghai", // China
    HK: "Asia/Hong_Kong", // Hong Kong
    TW: "Asia/Taipei", // Taiwan
    JP: "Asia/Tokyo", // Japan
    KR: "Asia/Seoul", // South Korea

    // South Asia
    IN: "Asia/Kolkata", // India
    BD: "Asia/Dhaka", // Bangladesh
    PK: "Asia/Karachi", // Pakistan
    LK: "Asia/Colombo", // Sri Lanka

    // Middle East
    AE: "Asia/Dubai", // UAE
    SA: "Asia/Riyadh", // Saudi Arabia
    QA: "Asia/Qatar", // Qatar

    // Europe
    GB: "Europe/London", // UK
    DE: "Europe/Berlin", // Germany
    FR: "Europe/Paris", // France
    IT: "Europe/Rome", // Italy
    ES: "Europe/Madrid", // Spain
    RU: "Europe/Moscow", // Russia

    // Americas
    US: "America/New_York", // USA (Eastern)
    "US-C": "America/Chicago", // USA (Central)
    "US-M": "America/Denver", // USA (Mountain)
    "US-P": "America/Los_Angeles", // USA (Pacific)
    CA: "America/Toronto", // Canada (Eastern)
    "CA-P": "America/Vancouver", // Canada (Pacific)
    BR: "America/Sao_Paulo", // Brazil
    MX: "America/Mexico_City", // Mexico

    // Oceania
    AU: "Australia/Sydney", // Australia (Eastern)
    "AU-C": "Australia/Adelaide", // Australia (Central)
    "AU-W": "Australia/Perth", // Australia (Western)
    NZ: "Pacific/Auckland", // New Zealand
  };

  try {
    if (!regionCode || typeof regionCode !== "string") {
      throw new Error("Please provide a region code");
    }

    const regionUpper = regionCode.toUpperCase();
    const timezone = regionTimezones[regionUpper];

    if (!timezone) {
      const validRegions = Object.keys(regionTimezones)
        .filter(
          (k) => !k.includes("-") || k.startsWith(regionUpper.split("-")[0])
        )
        .slice(0, 20) // Show first 20 for readability
        .join(", ");
      throw new Error(
        `Invalid region code. Some valid codes are: ${validRegions}...`
      );
    }

    // Get current time in the region
    const nowInRegion = DateTime.now().setZone(timezone);

    // Get 7 days ago at midnight in the region
    const sevenDaysAgo = nowInRegion.minus({ days: 7 }).startOf("day");

    // Convert to timestamps (seconds since epoch)
    const currentTimestamp = Math.floor(nowInRegion.toSeconds());
    const sevenDaysAgoTimestamp = Math.floor(sevenDaysAgo.toSeconds());

    // Also get ISO strings for verification
    const currentISO = nowInRegion.toISO();
    const sevenDaysAgoISO = sevenDaysAgo.toISO();

    return {
      currentTime: currentTimestamp, // Unix timestamp in seconds
      sevenDaysAgo: sevenDaysAgoTimestamp, // Unix timestamp in seconds
      currentTimeISO: currentISO, // ISO string for debugging
      sevenDaysAgoISO: sevenDaysAgoISO, // ISO string for debugging
      region: regionUpper,
      timezone: timezone,
      regionCurrentTime: nowInRegion.toFormat("yyyy-MM-dd HH:mm:ss"),
      regionSevenDaysAgo: sevenDaysAgo.toFormat("yyyy-MM-dd HH:mm:ss"),
    };
  } catch (error) {
    console.error("Error:", error.message);
    return {
      error: error.message,
      regionCode: regionCode,
    };
  }
};

export const getRegionTimestampsShopeTiktok = (
  regionCode,
  startDate = null,
  endDate = null
) => {
  // Map region codes to Luxon timezone strings

  const regionTimezones = {
    // Southeast Asia
    MY: "Asia/Kuala_Lumpur", // Malaysia
    SG: "Asia/Singapore", // Singapore
    PH: "Asia/Manila", // Philippines
    TH: "Asia/Bangkok", // Thailand
    VN: "Asia/Ho_Chi_Minh", // Vietnam
    ID: "Asia/Jakarta", // Indonesia (Western)
    "ID-B": "Asia/Makassar", // Indonesia (Central)
    "ID-P": "Asia/Jayapura", // Indonesia (Eastern)

    // East Asia
    CN: "Asia/Shanghai", // China
    HK: "Asia/Hong_Kong", // Hong Kong
    TW: "Asia/Taipei", // Taiwan
    JP: "Asia/Tokyo", // Japan
    KR: "Asia/Seoul", // South Korea

    // South Asia
    IN: "Asia/Kolkata", // India
    BD: "Asia/Dhaka", // Bangladesh
    PK: "Asia/Karachi", // Pakistan
    LK: "Asia/Colombo", // Sri Lanka

    // Middle East
    AE: "Asia/Dubai", // UAE
    SA: "Asia/Riyadh", // Saudi Arabia
    QA: "Asia/Qatar", // Qatar

    // Europe
    GB: "Europe/London", // UK
    DE: "Europe/Berlin", // Germany
    FR: "Europe/Paris", // France
    IT: "Europe/Rome", // Italy
    ES: "Europe/Madrid", // Spain
    RU: "Europe/Moscow", // Russia

    // Americas
    US: "America/New_York", // USA (Eastern)
    "US-C": "America/Chicago", // USA (Central)
    "US-M": "America/Denver", // USA (Mountain)
    "US-P": "America/Los_Angeles", // USA (Pacific)
    CA: "America/Toronto", // Canada (Eastern)
    "CA-P": "America/Vancouver", // Canada (Pacific)
    BR: "America/Sao_Paulo", // Brazil
    MX: "America/Mexico_City", // Mexico

    // Oceania
    AU: "Australia/Sydney", // Australia (Eastern)
    "AU-C": "Australia/Adelaide", // Australia (Central)
    "AU-W": "Australia/Perth", // Australia (Western)
    NZ: "Pacific/Auckland", // New Zealand
  };

  try {
    if (!regionCode || typeof regionCode !== "string") {
      throw new Error("Please provide a region code");
    }

    const regionUpper = regionCode.toUpperCase();
    const timezone = regionTimezones[regionUpper];

    if (!timezone) {
      const validRegions = Object.keys(regionTimezones)
        .filter(
          (k) => !k.includes("-") || k.startsWith(regionUpper.split("-")[0])
        )
        .slice(0, 20) // Show first 20 for readability
        .join(", ");
      throw new Error(
        `Invalid region code. Some valid codes are: ${validRegions}...`
      );
    }

    // Get current time in the region's timezone
    const nowInRegion = DateTime.now().setZone(timezone);

    let startDateTime, endDateTime;

    if (startDate && endDate) {
      // Parse provided start and end dates in the region's timezone
      // Start date: beginning of the day (00:00:00)
      startDateTime = DateTime.fromISO(startDate, { zone: timezone }).startOf(
        "day"
      );

      // End date: end of the day (23:59:59.999)
      endDateTime = DateTime.fromISO(endDate, { zone: timezone }).endOf("day");

      // Validate dates
      if (!startDateTime.isValid) {
        throw new Error(
          `Invalid start date: ${startDateTime.invalidExplanation}`
        );
      }
      if (!endDateTime.isValid) {
        throw new Error(`Invalid end date: ${endDateTime.invalidExplanation}`);
      }
      if (endDateTime < startDateTime) {
        throw new Error("End date cannot be before start date");
      }
    } else {
      // If no dates provided, use default behavior (last 7 days)
      // End date: current time
      endDateTime = nowInRegion;
      // Start date: 7 days ago at beginning of day
      startDateTime = nowInRegion.minus({ days: 7 }).startOf("day");
    }

    // Convert to timestamps (seconds since epoch)
    const startTimestamp = Math.floor(startDateTime.toSeconds());
    const endTimestamp = Math.floor(endDateTime.toSeconds());

    return {
      startTime: startTimestamp, // Unix timestamp in seconds
      endTime: endTimestamp, // Unix timestamp in seconds
      startTimeISO: startDateTime.toISO(), // ISO string for debugging
      endTimeISO: endDateTime.toISO(), // ISO string for debugging
      startTimeLocal: startDateTime.toFormat("yyyy-MM-dd HH:mm:ss"),
      endTimeLocal: endDateTime.toFormat("yyyy-MM-dd HH:mm:ss"),
      region: regionUpper,
      timezone: timezone,
      usingCustomDates: !!(startDate && endDate),
    };
  } catch (error) {
    console.error("Error:", error.message);
    return {
      error: error.message,
      regionCode: regionCode,
      startDate: startDate,
      endDate: endDate,
    };
  }
};

export const getRegionTimestampsLazadaPreCorrect = (regionCode) => {
  // Map region codes to Luxon timezone strings
  const regionTimezones = {
    // Southeast Asia
    MY: "Asia/Kuala_Lumpur", // Malaysia
    SG: "Asia/Singapore", // Singapore
    PH: "Asia/Manila", // Philippines
    TH: "Asia/Bangkok", // Thailand
    VN: "Asia/Ho_Chi_Minh", // Vietnam
    ID: "Asia/Jakarta", // Indonesia (Western)
    "ID-B": "Asia/Makassar", // Indonesia (Central)
    "ID-P": "Asia/Jayapura", // Indonesia (Eastern)

    // East Asia
    CN: "Asia/Shanghai", // China
    HK: "Asia/Hong_Kong", // Hong Kong
    TW: "Asia/Taipei", // Taiwan
    JP: "Asia/Tokyo", // Japan
    KR: "Asia/Seoul", // South Korea

    // South Asia
    IN: "Asia/Kolkata", // India
    BD: "Asia/Dhaka", // Bangladesh
    PK: "Asia/Karachi", // Pakistan
    LK: "Asia/Colombo", // Sri Lanka

    // Middle East
    AE: "Asia/Dubai", // UAE
    SA: "Asia/Riyadh", // Saudi Arabia
    QA: "Asia/Qatar", // Qatar

    // Europe
    GB: "Europe/London", // UK
    DE: "Europe/Berlin", // Germany
    FR: "Europe/Paris", // France
    IT: "Europe/Rome", // Italy
    ES: "Europe/Madrid", // Spain
    RU: "Europe/Moscow", // Russia

    // Americas
    US: "America/New_York", // USA (Eastern)
    "US-C": "America/Chicago", // USA (Central)
    "US-M": "America/Denver", // USA (Mountain)
    "US-P": "America/Los_Angeles", // USA (Pacific)
    CA: "America/Toronto", // Canada (Eastern)
    "CA-P": "America/Vancouver", // Canada (Pacific)
    BR: "America/Sao_Paulo", // Brazil
    MX: "America/Mexico_City", // Mexico

    // Oceania
    AU: "Australia/Sydney", // Australia (Eastern)
    "AU-C": "Australia/Adelaide", // Australia (Central)
    "AU-W": "Australia/Perth", // Australia (Western)
    NZ: "Pacific/Auckland", // New Zealand
  };

  try {
    if (!regionCode || typeof regionCode !== "string") {
      throw new Error("Please provide a region code");
    }

    const regionUpper = regionCode.toUpperCase();
    const timezone = regionTimezones[regionUpper];

    if (!timezone) {
      const validRegions = Object.keys(regionTimezones)
        .filter(
          (k) => !k.includes("-") || k.startsWith(regionUpper.split("-")[0])
        )
        .slice(0, 20) // Show first 20 for readability
        .join(", ");
      throw new Error(
        `Invalid region code. Some valid codes are: ${validRegions}...`
      );
    }

    // Get current time in the region
    const nowInRegion = DateTime.now().setZone(timezone);

    // Get 7 days ago at midnight in the region
    const sevenDaysAgo = nowInRegion.minus({ days: 7 }).startOf("day");

    // Convert to format: 2025-12-22T08:06:56Z
    const currentTimeUTC = nowInRegion
      .toUTC()
      .toISO()
      .replace(/\.\d+/, "")
      .replace(/\+00:00$/, "Z");
    const sevenDaysAgoUTC = sevenDaysAgo
      .toUTC()
      .toISO()
      .replace(/\.\d+/, "")
      .replace(/\+00:00$/, "Z");

    // Also keep local timezone versions for debugging
    const currentTimeLocal = nowInRegion
      .toISO()
      .replace(/\.\d+/, "")
      .replace(/\+00:00$/, "Z");
    const sevenDaysAgoLocal = sevenDaysAgo
      .toISO()
      .replace(/\.\d+/, "")
      .replace(/\+00:00$/, "Z");

    return {
      // Main return values in the format you need: 2025-12-22T08:06:56Z
      currentTime: currentTimeUTC,
      sevenDaysAgo: sevenDaysAgoUTC,

      // Local timezone versions (also in Z format)
      currentTimeLocal: currentTimeLocal,
      sevenDaysAgoLocal: sevenDaysAgoLocal,

      // Unix timestamps (seconds since epoch) - kept for compatibility
      currentTimestamp: Math.floor(nowInRegion.toSeconds()),
      sevenDaysAgoTimestamp: Math.floor(sevenDaysAgo.toSeconds()),

      // Debug info
      region: regionUpper,
      timezone: timezone,
      regionCurrentTime: nowInRegion.toFormat("yyyy-MM-dd HH:mm:ss"),
      regionSevenDaysAgo: sevenDaysAgo.toFormat("yyyy-MM-dd HH:mm:ss"),
    };
  } catch (error) {
    console.error("Error:", error.message);

    // Fallback to current UTC time in the required format
    const nowUTC = new Date()
      .toISOString()
      .replace(/\.\d+/, "")
      .replace(/\+00:00$/, "Z");
    const sevenDaysAgoUTC = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .replace(/\.\d+/, "")
      .replace(/\+00:00$/, "Z");

    return {
      currentTime: nowUTC,
      sevenDaysAgo: sevenDaysAgoUTC,
      region: "UTC",
      timezone: "UTC",
      error: error.message,
    };
  }
};

export const getRegionTimestampsLazada = (
  regionCode,
  startDate = null,
  endDate = null
) => {
  // Map region codes to Luxon timezone strings
  const regionTimezones = {
    // Southeast Asia
    MY: "Asia/Kuala_Lumpur", // Malaysia
    SG: "Asia/Singapore", // Singapore
    PH: "Asia/Manila", // Philippines
    TH: "Asia/Bangkok", // Thailand
    VN: "Asia/Ho_Chi_Minh", // Vietnam
    ID: "Asia/Jakarta", // Indonesia (Western)
    "ID-B": "Asia/Makassar", // Indonesia (Central)
    "ID-P": "Asia/Jayapura", // Indonesia (Eastern)

    // East Asia
    CN: "Asia/Shanghai", // China
    HK: "Asia/Hong_Kong", // Hong Kong
    TW: "Asia/Taipei", // Taiwan
    JP: "Asia/Tokyo", // Japan
    KR: "Asia/Seoul", // South Korea

    // South Asia
    IN: "Asia/Kolkata", // India
    BD: "Asia/Dhaka", // Bangladesh
    PK: "Asia/Karachi", // Pakistan
    LK: "Asia/Colombo", // Sri Lanka

    // Middle East
    AE: "Asia/Dubai", // UAE
    SA: "Asia/Riyadh", // Saudi Arabia
    QA: "Asia/Qatar", // Qatar

    // Europe
    GB: "Europe/London", // UK
    DE: "Europe/Berlin", // Germany
    FR: "Europe/Paris", // France
    IT: "Europe/Rome", // Italy
    ES: "Europe/Madrid", // Spain
    RU: "Europe/Moscow", // Russia

    // Americas
    US: "America/New_York", // USA (Eastern)
    "US-C": "America/Chicago", // USA (Central)
    "US-M": "America/Denver", // USA (Mountain)
    "US-P": "America/Los_Angeles", // USA (Pacific)
    CA: "America/Toronto", // Canada (Eastern)
    "CA-P": "America/Vancouver", // Canada (Pacific)
    BR: "America/Sao_Paulo", // Brazil
    MX: "America/Mexico_City", // Mexico

    // Oceania
    AU: "Australia/Sydney", // Australia (Eastern)
    "AU-C": "Australia/Adelaide", // Australia (Central)
    "AU-W": "Australia/Perth", // Australia (Western)
    NZ: "Pacific/Auckland", // New Zealand
  };

  try {
    if (!regionCode || typeof regionCode !== "string") {
      throw new Error("Please provide a region code");
    }

    const regionUpper = regionCode.toUpperCase();
    const timezone = regionTimezones[regionUpper];

    if (!timezone) {
      const validRegions = Object.keys(regionTimezones)
        .filter(
          (k) => !k.includes("-") || k.startsWith(regionUpper.split("-")[0])
        )
        .slice(0, 20) // Show first 20 for readability
        .join(", ");
      throw new Error(
        `Invalid region code. Some valid codes are: ${validRegions}...`
      );
    }

    // Get current time in the region
    const nowInRegion = DateTime.now().setZone(timezone);

    let startDateTime, endDateTime;

    if (startDate && endDate) {
      // Parse provided start and end dates in the region's timezone
      // Start date: beginning of the day (00:00:00)
      startDateTime = DateTime.fromISO(startDate, { zone: timezone }).startOf(
        "day"
      );

      // End date: end of the day (23:59:59.999)
      endDateTime = DateTime.fromISO(endDate, { zone: timezone }).endOf("day");

      // Validate dates
      if (!startDateTime.isValid) {
        throw new Error(
          `Invalid start date: ${startDateTime.invalidExplanation}`
        );
      }
      if (!endDateTime.isValid) {
        throw new Error(`Invalid end date: ${endDateTime.invalidExplanation}`);
      }
      if (endDateTime < startDateTime) {
        throw new Error("End date cannot be before start date");
      }
    } else {
      // If no dates provided, use default behavior (last 7 days)
      // End date: current time
      endDateTime = nowInRegion;
      // Start date: 7 days ago at beginning of day
      startDateTime = nowInRegion.minus({ days: 7 }).startOf("day");
    }

    // Convert to format: 2025-12-22T08:06:56Z
    const startTimeUTC = startDateTime
      .toUTC()
      .toISO()
      .replace(/\.\d+/, "")
      .replace(/\+00:00$/, "Z");
    const endTimeUTC = endDateTime
      .toUTC()
      .toISO()
      .replace(/\.\d+/, "")
      .replace(/\+00:00$/, "Z");

    // Also keep local timezone versions for debugging
    const startTimeLocal = startDateTime
      .toISO()
      .replace(/\.\d+/, "")
      .replace(/\+00:00$/, "Z");
    const endTimeLocal = endDateTime
      .toISO()
      .replace(/\.\d+/, "")
      .replace(/\+00:00$/, "Z");

    return {
      // Main return values in the format you need: 2025-12-22T08:06:56Z
      startTime: startTimeUTC,
      endTime: endTimeUTC,

      // Local timezone versions (also in Z format)
      startTimeLocal: startTimeLocal,
      endTimeLocal: endTimeLocal,

      // Unix timestamps (seconds since epoch) - kept for compatibility
      startTimestamp: Math.floor(startDateTime.toSeconds()),
      endTimestamp: Math.floor(endDateTime.toSeconds()),

      // Debug info
      region: regionUpper,
      timezone: timezone,
      regionStartTime: startDateTime.toFormat("yyyy-MM-dd HH:mm:ss"),
      regionEndTime: endDateTime.toFormat("yyyy-MM-dd HH:mm:ss"),
      usingCustomDates: !!(startDate && endDate),
    };
  } catch (error) {
    console.error("Error:", error.message);

    // Fallback to current UTC time in the required format
    const nowUTC = new Date()
      .toISOString()
      .replace(/\.\d+/, "")
      .replace(/\+00:00$/, "Z");

    // Use provided dates or fallback to 7 days ago
    let fallbackStart, fallbackEnd;

    if (startDate && endDate) {
      try {
        // Try to use provided dates in UTC
        const start = new Date(startDate + "T00:00:00Z");
        const end = new Date(endDate + "T23:59:59Z");

        fallbackStart = start
          .toISOString()
          .replace(/\.\d+/, "")
          .replace(/\+00:00$/, "Z");
        fallbackEnd = end
          .toISOString()
          .replace(/\.\d+/, "")
          .replace(/\+00:00$/, "Z");
      } catch {
        // Fallback to 7 days ago if date parsing fails
        const sevenDaysAgoUTC = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .replace(/\.\d+/, "")
          .replace(/\+00:00$/, "Z");
        fallbackStart = sevenDaysAgoUTC;
        fallbackEnd = nowUTC;
      }
    } else {
      // Default to last 7 days
      const sevenDaysAgoUTC = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .replace(/\.\d+/, "")
        .replace(/\+00:00$/, "Z");
      fallbackStart = sevenDaysAgoUTC;
      fallbackEnd = nowUTC;
    }

    return {
      startTime: fallbackStart,
      endTime: fallbackEnd,
      region: regionCode ? regionCode.toUpperCase() : "UTC",
      timezone: "UTC",
      error: error.message,
      usingCustomDates: !!(startDate && endDate),
    };
  }
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
