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
  console.log("start the function", data, startDate, endDate);

  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);

  console.log(startDateTime, endDateTime, "intofunction");

  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.cancelOrderSlaTime * 1000); // convert seconds to ms
    return itemDate >= startDateTime && itemDate <= endDateTime;
  });

  return filteredData;
}

export function filterLazadaDataByDateRange(data, startDate, endDate) {
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);

  return data.filter((item) => {
    if (!item.created_at) return false; // skip if no date

    // Parse your string date (e.g. "2025-08-11 18:02:15 +0800") into JS Date
    // Replace space before timezone with 'GMT' to be more parseable by JS Date
    const dateStr = item.created_at.replace(" +", " GMT+");
    const itemDate = new Date(dateStr);

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
      const shippingAddress = [
        customer?.address_shipping?.country,
        customer?.address_shipping?.city,
        customer?.address_shipping?.post_code,
      ]
        .filter(Boolean)
        .join(",")
        .toLowerCase();

      isMatch =
        isMatch &&
        shippingAddress.includes(searchFields.RecipientAddress.toLowerCase());
    }

    // ✅ Account Name
    if (searchFields.isActiveAccountName && searchFields.AccountName) {
      const accountName = `${customer?.customer_first_name || ""} ${
        customer?.customer_last_name || ""
      }`
        .trim()
        .toLowerCase();

      isMatch =
        isMatch && accountName.includes(searchFields.AccountName.toLowerCase());
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
