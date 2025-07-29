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
export function filterDataBySearchFieldsBatchPrint(
  customersData,
  searchFields
) {
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
          .includes(searchFields.RecipientAddress.toLowerCase());
    }

    // Check if isActiveAccountName is true and AccountName matches
    if (searchFields.isActiveAccountName && searchFields.AccountName) {
      isMatch =
        isMatch &&
        customer?.receiver_name_mask
          ?.toLowerCase()
          .includes(searchFields.AccountName.toLowerCase());
    }

    // Check if isActiveOrderId is true and OrderId matches
    if (searchFields.isActiveOrderId && searchFields.OrderId) {
      isMatch = isMatch && customer?.order_sn?.includes(searchFields.OrderId);
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
        customer?.item_list[0]?.goods_spec
          .toLowerCase()
          .includes(searchFields.Product.toLowerCase());
    }

    return isMatch;
  });
}
