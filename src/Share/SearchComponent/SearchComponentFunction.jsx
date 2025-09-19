// pin dou dou

// export function filterDataByDateRange(data, startDate, endDate) {
//   // Convert start and end date strings to Date objects
//   console.log("start the function", data, startDate, endDate);
//   const startDateTime = new Date(startDate);
//   const endDateTime = new Date(endDate);
//   console.log(startDateTime, endDateTime, "intofunction");

//   // Filter the data array based on the date range
//   const filteredData = data.filter((item) => {
//     // Convert the created_time string to a Date object
//     const createdDateTime = new Date(item.created_time);

//     // Check if the created time is within the date range
//     return createdDateTime >= startDateTime && createdDateTime <= endDateTime;
//   });
//   return filteredData;
// }

export function filterDataByDateRange(data, startDate, endDate) {
  const startDateTime = new Date(startDate);
  startDateTime.setHours(0, 0, 0, 0); // start of the day

  const endDateTime = new Date(endDate);
  endDateTime.setHours(23, 59, 59, 999); // end of the day

  return data.filter((item) => {
    const itemDate = new Date(item.cancelOrderSlaTime * 1000);
    return itemDate >= startDateTime && itemDate <= endDateTime;
  });
}

export function filterLazadaDataByDateRange(data, startDate, endDate) {
  const startDateTime = new Date(startDate);
  startDateTime.setHours(0, 0, 0, 0);

  const endDateTime = new Date(endDate);
  endDateTime.setHours(23, 59, 59, 999);

  return data.filter((item) => {
    if (!item.created_at) return false;

    const dateStr = item.created_at.replace(" +", " GMT+");
    const itemDate = new Date(dateStr);

    return itemDate >= startDateTime && itemDate <= endDateTime;
  });
}

export function filterShopeeDataByDateRange(data, startDate, endDate) {
  const startDateTime = new Date(startDate);
  startDateTime.setHours(0, 0, 0, 0);

  const endDateTime = new Date(endDate);
  endDateTime.setHours(23, 59, 59, 999);

  return data.filter((item) => {
    const timestamp = item.create_time || item.update_time || item.ship_by_date;
    if (!timestamp) return false;

    const itemDate = new Date(timestamp * 1000);
    return itemDate >= startDateTime && itemDate <= endDateTime;
  });
}

export function filterDataBySearchFields(customersData, searchFields) {
  console.log(customersData);
  return customersData.filter((customer) => {
    let isMatch = true;

    // Check if isActiveRecipientAddress is true and RecipientAddress matches
    if (
      searchFields.isActiveRecipientAddress &&
      searchFields.RecipientAddress
    ) {
      isMatch =
        isMatch &&
        customer?.receiver_address
          ?.toLowerCase()
          ?.includes(searchFields.RecipientAddress.toLowerCase());
    }

    // Check if isActiveAccountName is true and AccountName matches
    if (searchFields.isActiveAccountName && searchFields.AccountName) {
      isMatch =
        isMatch &&
        customer?.account_name
          ?.toLowerCase()
          ?.includes(searchFields.AccountName.toLowerCase());
    }

    // Check if isActiveOrderId is true and OrderId matches
    if (searchFields.isActiveOrderId && searchFields.OrderId) {
      isMatch =
        isMatch &&
        customer?.id
          ?.toString()
          ?.toLowerCase()
          ?.includes(searchFields.OrderId.toLowerCase());
    }

    // Check if isActiveAmount is true and Amount matches
    if (searchFields.isActiveAmount && searchFields.Amount) {
      isMatch =
        isMatch &&
        customer?.item_list[0]?.goods_count
          ?.toString()
          ?.toLowerCase()
          ?.includes(searchFields.Amount.toLowerCase());
    }

    // Check if isActiveProduct is true and Product matches
    if (searchFields.isActiveProduct && searchFields.Product) {
      isMatch =
        isMatch &&
        customer?.item_list[0]?.goods_name
          ?.toLowerCase()
          ?.includes(searchFields.Product.toLowerCase());
    }

    return isMatch;
  });
}

export function filterLazadaDataBySearchFields(customersData, searchFields) {
  return customersData.filter((customer) => {
    let isMatch = true;

    // ✅ Recipient Address
    if (
      searchFields.isActiveRecipientAddress &&
      searchFields.RecipientAddress
    ) {
      // Split the search string by commas, trim spaces, and lowercase each part
      const searchValues = searchFields.RecipientAddress.split(",")
        .map((v) => v.trim().toLowerCase())
        .filter(Boolean);

      const { country, city, post_code, address1 } =
        customer?.address_shipping || {};
      const addressFields = [country, city, post_code, address1]
        .filter(Boolean)
        .map((f) => f.toLowerCase());

      // Check if all search values are included in any of the address fields
      isMatch =
        isMatch &&
        searchValues.every((searchVal) =>
          addressFields.some((field) => field.includes(searchVal))
        );
    }

    // ✅ Order ID
    if (searchFields.isActiveOrderId && searchFields.OrderId) {
      isMatch =
        isMatch &&
        customer?.order_id
          ?.toString()
          ?.toLowerCase()
          ?.includes(searchFields.OrderId.toLowerCase());
    }

    // ✅ Amount (items_count)
    if (searchFields.isActiveAmount && searchFields.Amount) {
      isMatch =
        isMatch &&
        customer?.items_count
          ?.toString()
          ?.toLowerCase()
          ?.includes(searchFields.Amount.toLowerCase());
    }

    // ✅ Product Name (first in item_list)
    if (searchFields.isActiveProduct && searchFields.Product) {
      const productMatch = customer?.orderItemInfo?.some((item) =>
        item?.name?.toLowerCase().includes(searchFields.Product.toLowerCase())
      );

      isMatch = isMatch && productMatch;
    }

    // ✅ Warehouse Code
    if (searchFields.isActiveWarehouse && searchFields.Warehouse) {
      isMatch =
        isMatch &&
        customer?.warehouse_code
          ?.toLowerCase()
          .includes(searchFields.Warehouse.toLowerCase());
    }

    // ✅ Payment Method
    if (searchFields.isActivePaymentMethod && searchFields.PaymentMethod) {
      isMatch =
        isMatch &&
        customer?.payment_method
          ?.toLowerCase()
          .includes(searchFields.PaymentMethod.toLowerCase());
    }

    // ✅ Price
    if (searchFields.isActivePrice && searchFields.Price) {
      isMatch =
        isMatch &&
        customer?.price
          ?.toString()
          ?.toLowerCase()
          ?.includes(searchFields.Price.toLowerCase());
    }

    // ✅ Status
    if (searchFields.isActiveStatus && searchFields.Status) {
      const statusesStr = (customer?.statuses || []).join(" ").toLowerCase();
      isMatch =
        isMatch && statusesStr.includes(searchFields.Status.toLowerCase());
    }

    return isMatch;
  });
}

export function filterShopeeDataBySearchFields(customersData, searchFields) {
  return customersData.filter((order) => {
    let isMatch = true;

    // ✅ Recipient Address
    if (
      searchFields.isActiveRecipientAddress &&
      searchFields.RecipientAddress
    ) {
      const shippingAddress = [order?.recipient_address?.full_address]
        .filter(Boolean)
        .join(",")
        .toLowerCase();

      isMatch =
        isMatch &&
        shippingAddress.includes(searchFields.RecipientAddress.toLowerCase());
    }

    // ✅ Recipient Name
    if (searchFields.isActiveAccountName && searchFields.AccountName) {
      const name = order?.recipient_address?.name?.toLowerCase() || "";
      isMatch =
        isMatch && name.includes(searchFields.AccountName.toLowerCase());
    }

    // ✅ Order ID
    if (searchFields.isActiveOrderId && searchFields.OrderId) {
      isMatch =
        isMatch &&
        order?.order_sn
          ?.toLowerCase()
          ?.includes(searchFields.OrderId.toLowerCase());
    }

    // ✅ Amount
    if (searchFields.isActiveAmount && searchFields.Amount) {
      if (order?.item_list?.length > 0) {
        isMatch =
          isMatch &&
          Number(order?.item_list?.length) === Number(searchFields.Amount);
      } else {
        isMatch = false;
      }
    }

    // ✅ Product Name (any item in item_list)
    if (searchFields.isActiveProduct && searchFields.Product) {
      const productMatch = order?.item_list?.some((item) =>
        item?.item_name
          ?.toLowerCase()
          .includes(searchFields.Product.toLowerCase())
      );
      isMatch = isMatch && productMatch;
    }

    // ✅ Warehouse Code (first product location)
    if (searchFields.isActiveWarehouse && searchFields.Warehouse) {
      const warehouseCode =
        order?.item_list?.[0]?.product_location_id?.[0] || "";
      isMatch =
        isMatch &&
        warehouseCode
          .toLowerCase()
          .includes(searchFields.Warehouse.toLowerCase());
    }

    // ✅ Payment Method (COD or not)
    if (searchFields.isActivePaymentMethod && searchFields.PaymentMethod) {
      const paymentMethod = order?.cod ? "cod" : "non-cod";
      isMatch =
        isMatch &&
        paymentMethod.includes(searchFields.PaymentMethod.toLowerCase());
    }

    // ✅ Status
    if (searchFields.isActiveStatus && searchFields.Status) {
      const status = order?.order_status?.toLowerCase() || "";
      isMatch = isMatch && status.includes(searchFields.Status.toLowerCase());
    }

    return isMatch;
  });
}

// export function filterDataBySearchFieldsBatchPrint(
//   customersData,
//   searchFields
// ) {
//   return customersData.filter((customer) => {
//     let isMatch = true;
//     // Check if isActiveRecipientAddress is true and RecipientAddress matches
//     if (
//       searchFields.isActiveRecipientAddress &&
//       searchFields.RecipientAddress
//     ) {
//       isMatch =
//         isMatch &&
//         customer?.receiver_address
//           ?.toLowerCase()
//           .includes(searchFields.RecipientAddress.toLowerCase());
//     }

//     // Check if isActiveAccountName is true and AccountName matches
//     if (searchFields.isActiveAccountName && searchFields.AccountName) {
//       isMatch =
//         isMatch &&
//         customer?.receiver_name_mask
//           ?.toLowerCase()
//           .includes(searchFields.AccountName.toLowerCase());
//     }

//     // Check if isActiveOrderId is true and OrderId matches
//     if (searchFields.isActiveOrderId && searchFields.OrderId) {
//       isMatch = isMatch && customer?.order_sn?.includes(searchFields.OrderId);
//     }

//     // Check if isActiveAmount is true and Amount matches
//     if (searchFields.isActiveAmount && searchFields.Amount) {
//       isMatch =
//         isMatch &&
//         customer?.item_list[0]?.goods_count
//           ?.toString()
//           ?.toLowerCase()
//           ?.includes(searchFields.Amount.toLowerCase());
//     }

//     // Check if isActiveProduct is true and Product matches
//     if (searchFields.isActiveProduct && searchFields.Product) {
//       isMatch =
//         isMatch &&
//         customer?.item_list[0]?.goods_spec
//           .toLowerCase()
//           .includes(searchFields.Product.toLowerCase());
//     }

//     return isMatch;
//   });
// }

export function filterDataBySearchFieldsBatchPrint(
  customersData,
  searchFields
) {
  return customersData.filter((customer) => {
    let isMatch = true;

    // Check Recipient Address
    if (
      searchFields.isActiveRecipientAddress &&
      searchFields.RecipientAddress
    ) {
      isMatch =
        isMatch &&
        customer?.recipientAddress?.fullAddress
          ?.toLowerCase()
          .includes(searchFields.RecipientAddress.toLowerCase());
    }

    // Check Account Name
    if (searchFields.isActiveAccountName && searchFields.AccountName) {
      isMatch =
        isMatch &&
        customer?.buyerEmail
          ?.toLowerCase()
          .includes(searchFields.AccountName.toLowerCase());
    }

    // Check Order ID
    if (searchFields.isActiveOrderId && searchFields.OrderId) {
      isMatch =
        isMatch && customer?.id?.toString().includes(searchFields.OrderId);
    }

    // Check Amount (product quantity)
    if (searchFields.isActiveAmount && searchFields.Amount) {
      isMatch =
        isMatch &&
        customer?.lineItems?.length
          ?.toString()
          ?.toLowerCase()
          ?.includes(searchFields.Amount.toLowerCase());
    }

    // Check Product
    if (searchFields.isActiveProduct && searchFields.Product) {
      isMatch =
        isMatch &&
        customer?.lineItems?.[0]?.productName
          ?.toLowerCase()
          .includes(searchFields.Product.toLowerCase());
    }

    return isMatch;
  });
}
