//*********************All function are related to get all order list according to timeStamp******************

import axios from "axios";

//Make the function to get the local current TimeStamp
export const getCurrentLocalTimeTimestamp = () => {
  // Get the current date in local time
  const currentDate = new Date();

  // Convert to Epoch timestamp (Unix timestamp) in seconds
  const epochTimestamp = Math.floor(currentDate.getTime() / 1000);

  return epochTimestamp;
};

//Make the function to get the 23:55 hours before of local current TimeStamp
export const getRangeWithCurrentLocalTimeTimestamp = () => {
  // Get the current date in local time
  const currentDate = new Date();

  // Subtract 11 hours and 55 minutes (in milliseconds) from the current timestamp
  const elevenFiftyFiveHoursAgo =
    currentDate.getTime() - (23 * 60 * 60 * 1000 + 55 * 60 * 1000);
  // const elevenFiftyFiveHoursAgo = currentDate.getTime() - (10 * 60 * 60 * 1000 + 55 * 60 * 1000);

  // Convert to Epoch timestamp (Unix timestamp)
  const epochTimestamp = Math.floor(elevenFiftyFiveHoursAgo / 1000);

  return epochTimestamp;
};

// const dispatch = useDispatch();

// const decryptAndDispatchOrderList = async () => {
//     try {
//         // Decrypt the orderList
//         const decryptedOrderList = await decryptArrayData(orderList);

//         // Dispatch the decrypted orderList
//         dispatch(orderListData(decryptedOrderList));

//         console.log(decryptedOrderList, "check response"); // Log the decrypted orderList
//     } catch (error) {
//         console.error('Error decrypting orderList:', error);
//     }
// };

// // Call the function to decrypt and dispatch the orderList
// decryptAndDispatchOrderList();

//*********************All function are related to  Express Delivery Company******************

//Get all the Logistic company list
export const fetchLogisticCompanies = async () => {
  const url =
    "https://grozziieget.zjweiting.com:3091/GrozziiePrint-WebAPI/logistics/companies";
  // const url = 'http://localhost:8000/logistics';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch logistic companies");
    }
    const data = await response.json();
    const companyNameList =
      data?.logistics_companies_get_response?.logistics_companies;
    return companyNameList;
  } catch (error) {
    console.error("Error fetching logistic companies:", error);
    throw error;
  }
};

export const searchWaybill = async (code) => {
  const pddAccessToken = localStorage.getItem("pddAccessToken");

  const url = `https://grozziieget.zjweiting.com:3091/GrozziiePrint-WebAPI/cloudprint/waybill/search/${code}?accessToken=${pddAccessToken}`;
  try {
    const response = await axios.get(url);
    const responseData = response.data;
    if (
      responseData &&
      responseData.pdd_waybill_search_response &&
      responseData.pdd_waybill_search_response
        .waybill_apply_subscription_cols &&
      responseData.pdd_waybill_search_response.waybill_apply_subscription_cols
        .length > 0 &&
      responseData.pdd_waybill_search_response
        .waybill_apply_subscription_cols[0].branch_account_cols
      // responseData.branch_account_cols
    ) {
      const finalData =
        responseData.pdd_waybill_search_response.waybill_apply_subscription_cols[0].branch_account_cols
          .map((data, index) => {
            // const finalData = responseData.branch_account_cols.map((data, index) => {
            if (data?.quantity !== 0) {
              data = {
                branch_account_cols: data,
                wp_code:
                  responseData?.pdd_waybill_search_response
                    ?.waybill_apply_subscription_cols[0]?.wp_code,
              };
              return data;
            } else {
              return null; // or return an empty object, or any other default value you prefer
            }
          })
          .filter(Boolean); // Filter out any `null` or `undefined` values

      return finalData;
    }
    return null;
  } catch (error) {
    console.error("Error searching waybill:", error);
    throw error;
  }
};

export const fetchAvailableWaybills = async (companyNames) => {
  let responses;
  if (companyNames) {
    const availableCompanies = companyNames?.filter(
      (company) => company.available === 1
    );
    const promises = availableCompanies.map((company) =>
      searchWaybill(company.code)
    );
    responses = await Promise.all(promises);
  }

  return responses.filter((response) => response !== null);
};
