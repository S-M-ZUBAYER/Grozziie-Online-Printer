// import React, { useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import { RxCross1 } from "react-icons/rx";
// import FadeLoader from "react-spinners/FadeLoader";
// import { useTranslation } from "react-i18next";

// const ShopeeBatchPrintTable = ({
//   filteredData,
//   isLoading,
//   isError,
//   handleDetailsClick,
//   checkedItems,
//   handleCheckboxChange,
//   lazadaOrderStatusCheck,
//   cipher,
//   detailsLoading,
// }) => {
//   const { t } = useTranslation();

//   const [showModal, setShowModal] = useState(false);
//   const [trackingInfo, setTrackingInfo] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const formatText = (text) => {
//     if (!text) return t("No Data");
//     return text.length > 20 ? `${text.slice(0, 20)}***` : text;
//   };

//   const handleGetTracking = async (order) => {
//     setLoading(true);
//     setError("");
//     setTrackingInfo(null);

//     try {
//       const orderId = order?.order_id;
//       if (!orderId) {
//         setError("Missing order ID.");
//         return;
//       }

//       // Step 1: Get item data to extract package_id(s)
//       const itemRes = await fetch(
//         `https://grozziie.zjweiting.com:3091/lazada-open-shop/api/dev/orders/items?orderId=${orderId}`
//       );
//       const itemJson = await itemRes.json();
//       const parsedItemData = JSON.parse(itemJson?.body || "{}");
//       const items = parsedItemData?.data || [];
//       console.log("item", items, order);
//       // Step 2: Collect all valid package_ids
//       const ofcPackageIdList = items
//         .map((item) => item?.package_id)
//         .filter(Boolean); // remove undefined/null

//       if (!ofcPackageIdList.length) {
//         setError(t("No package IDs found for tracking."));
//         return;
//       }

//       // Step 3: Build query string with multiple ofcPackageIdList
//       const queryParams = new URLSearchParams({ orderId });
//       ofcPackageIdList.forEach((id) => {
//         const cleanId = id.startsWith("FP") ? id.slice(2) : id;
//         queryParams.append("ofcPackageIdList", cleanId);
//       });

//       const trackingUrl = `https://grozziie.zjweiting.com:3091/lazada-open-shop/api/dev/logistic/order/trace?${queryParams.toString()}`;

//       // Step 4: Call tracking API
//       const traceRes = await fetch(trackingUrl);
//       const traceJson = await traceRes.json();
//       console.log(
//         "tracking end",
//         `https://grozziie.zjweiting.com:3091/lazada-open-shop/api/dev/logistic/order/trace?${queryParams.toString()}`,
//         traceJson
//       );
//       if (traceJson.code === 0 && traceJson.data) {
//         setTrackingInfo(traceJson.data);
//         setShowModal(true);
//       } else {
//         setError(t("No tracking data available."));
//       }
//     } catch (err) {
//       console.error("Failed to fetch tracking data:", err);
//       setError(t("Failed to fetch tracking data."));
//     } finally {
//       setLoading(false);
//     }
//   };
//   console.log(filteredData, "Shopee");

//   return (
//     <div className="mt-6">
//       {isLoading ? (
//         <div className="flex flex-col items-center justify-center pt-10 text-center w-full mx-auto pb-60">
//           <FadeLoader color="#004368" size={25} />
//           <p className="text-2xl font-medium pt-10 text-[#004368]">
//             {t("DataLoading")}
//           </p>
//         </div>
//       ) : isError ? (
//         <p className="text-center text-3xl text-red-500 font-medium py-20">
//           {t("DataNotFound")}
//         </p>
//       ) : filteredData?.length === 0 || !filteredData?.length ? (
//         <p className="text-center text-3xl text-red-500 font-medium py-20">
//           {t("NoAvailableOrder")}
//         </p>
//       ) : (
//         <table className="table">
//           <thead className="">
//             <tr className="h-11 text-black text-opacity-80 capitalize text-center text-sm font-normal leading-4">
//               <th className="sticky top-0 bg-[#0043681A] bg-opacity-80 rounded-l-md">
//                 <span className="mr-[10px]">{t("AccountName")}</span>
//                 <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
//               </th>
//               <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
//                 <span className="mr-[10px]">{t("ReceiverName")}</span>
//                 <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
//               </th>
//               <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
//                 <span className="mr-[10px]">{t("Address")}</span>
//                 <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
//               </th>
//               <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
//                 <span className="mr-[10px]">{t("DeliveryCompany")}</span>
//                 <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
//               </th>
//               <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
//                 <span className="mr-[10px]">{t("orderId")}</span>
//                 <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
//               </th>
//               <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
//                 <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
//                 {t("ProductDetails")}
//               </th>
//               {(lazadaOrderStatusCheck === "delivered" ||
//                 lazadaOrderStatusCheck === "shipped") && (
//                 <th className="sticky top-0 bg-[#0043681A] bg-opacity-80 rounded-r-md">
//                   <span className="mr-[10px]">{t("Tracking")}</span>
//                 </th>
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData?.map((order) => {
//               const address = order.address_billing || {};
//               const fullAddress = [
//                 address.country,
//                 address.city,
//                 address.post_code,
//               ]
//                 .filter(Boolean)
//                 .join(", ");

//               return (
//                 <tr
//                   key={order.order_id}
//                   className="capitalize hover:bg-[#0043681A] cursor-pointer"
//                 >
//                   {/* Checkbox & Buyer Name */}
//                   <td className="flex items-center justify-start cursor-pointer">
//                     <input
//                       type="checkbox"
//                       className="w-4 h-4 rounded-[2px] text-black text-opacity-60 bg-[#004368] cursor-pointer"
//                       value={order.order_id}
//                       checked={checkedItems.some(
//                         (i) => i.order_id === order.order_id
//                       )}
//                       onChange={() => handleCheckboxChange(order)}
//                     />
//                     <p className="ml-[7px] text-black opacity-80 text-sm font-normal leading-4">
//                       {formatText(order.customer_first_name) || t("NoData")}
//                     </p>
//                   </td>

//                   {/* Receiver Name */}
//                   <td className="text-black opacity-80 text-sm font-normal leading-4">
//                     {formatText(order?.orderItemInfo[0]?.name) || t("NoData")}
//                   </td>

//                   {/* Full Address */}
//                   <td className="text-black opacity-80 text-sm font-normal leading-4">
//                     {formatText(fullAddress) || t("NoData")}
//                   </td>

//                   {/* Warehouse Code */}
//                   <td className="text-black opacity-80 text-sm font-normal leading-4">
//                     {formatText(order.warehouse_code) || t("NoData")}
//                   </td>

//                   {/* Order Number */}
//                   <td className="text-black opacity-80 text-sm font-normal leading-4">
//                     {formatText(order.order_number?.toString()) || t("NoData")}
//                   </td>

//                   {/* Product Details */}
//                   <td className="flex items-center justify-between cursor-pointer">
//                     <span className="text-black opacity-80 text-xs font-normal capitalize ml-[6px] mr-6">
//                       {order.items_count
//                         ? `Items: ${order.items_count}`
//                         : t("NoData")}
//                     </span>

//                     <p
//                       className="text-[#004368] text-xs font-normal leading-[14px] capitalize cursor-pointer"
//                       onClick={() => handleDetailsClick(order)}
//                     >
//                       {detailsLoading ? "Loading..." : t("Details")}
//                     </p>
//                   </td>

//                   {/* Optional Tracking Button */}
//                   {(lazadaOrderStatusCheck === "delivered" ||
//                     lazadaOrderStatusCheck === "shipped") && (
//                     <td className="text-black opacity-80 text-sm font-normal leading-4">
//                       <p
//                         className="text-[#004368] text-xs font-normal leading-[14px] capitalize cursor-pointer"
//                         onClick={() => handleGetTracking(order)}
//                       >
//                         {t("Tracking")}
//                       </p>
//                     </td>
//                   )}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       )}
//       {/* MODAL */}
//       {showModal && trackingInfo && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
//           <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
//             {/* Close Button */}
//             <button
//               className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
//               onClick={() => setShowModal(false)}
//               aria-label="Close"
//             >
//               <RxCross1 />
//             </button>

//             {/* Header */}
//             <h2 className="text-2xl font-semibold mb-6 text-[#004368] text-center">
//               {t("TrackingUpdates")}
//             </h2>

//             {/* Timeline List */}
//             <ul className="space-y-4 max-h-72 overflow-y-auto pr-1">
//               {trackingInfo.map((item, index) => (
//                 <li key={index} className="border-l-4 border-[#004368] pl-4">
//                   <p className="text-sm font-semibold text-gray-800">
//                     {item.description}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {new Date(item.updateTimeMillis).toLocaleString()}
//                   </p>
//                 </li>
//               ))}
//             </ul>

//             {/* Footer */}
//             <div className="mt-6 text-center">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="bg-[#004368] hover:bg-[#00324d] text-white font-medium py-2 px-6 rounded-lg transition"
//               >
//                 {t("Close")}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShopeeBatchPrintTable;

import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import FadeLoader from "react-spinners/FadeLoader";
import { useTranslation } from "react-i18next";

const ShopeeBatchPrintTable = ({
  filteredData,
  isLoading,
  isError,
  handleDetailsClick,
  checkedItems,
  handleCheckboxChange,
  shopeeOrderStatusCheck, // 👈 changed from lazada
  detailsLoading,
}) => {
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatText = (text) => {
    if (!text) return t("NoData");
    return text?.toString().length > 25
      ? `${text.toString().slice(0, 25)}...`
      : text.toString();
  };

  // (Optional) Tracking function - adjust for Shopee API later
  const handleGetTracking = async (order) => {
    setLoading(true);
    setError("");
    setTrackingInfo(null);
    console.log("click the tracking");

    try {
      const orderSn = order?.order_sn;
      if (!orderSn) {
        setError("Missing order SN.");
        return;
      }

      // 🔹 Call your backend Shopee API
      const res = await fetch(
        `https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/logistics/get-tracking-info?orderSn=${orderSn}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      const trackingResponse = data?.body?.response;

      if (trackingResponse?.tracking_info?.length > 0) {
        setTrackingInfo(trackingResponse);
        setShowModal(true);
      } else {
        setError("No tracking data available.");
      }
    } catch (err) {
      console.error("❌ Failed to fetch tracking data:", err);
      setError("Failed to fetch tracking data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center pt-10 text-center w-full mx-auto pb-60">
          <FadeLoader color="#004368" size={25} />
          <p className="text-2xl font-medium pt-10 text-[#004368]">
            {t("DataLoading")}
          </p>
        </div>
      ) : isError ? (
        <p className="text-center text-3xl text-red-500 font-medium py-20">
          {t("DataNotFound")}
        </p>
      ) : !filteredData || filteredData.length === 0 ? (
        <p className="text-center text-3xl text-red-500 font-medium py-20">
          {t("NoAvailableOrder")}
        </p>
      ) : (
        <table className="table">
          <thead>
            <tr className="h-11 text-black text-opacity-80 capitalize text-center text-sm font-normal leading-4">
              <th className="sticky top-0 bg-[#0043681A] rounded-l-md">
                {t("AccountName")}
              </th>
              <th className="sticky top-0 bg-[#0043681A]">
                {t("ReceiverName")}
              </th>
              <th className="sticky top-0 bg-[#0043681A]">{t("Address")}</th>
              <th className="sticky top-0 bg-[#0043681A]">
                {t("DeliveryCompany")}
              </th>
              <th className="sticky top-0 bg-[#0043681A]">{t("orderId")}</th>
              <th className="sticky top-0 bg-[#0043681A] rounded-r-md">
                {t("ProductDetails")}
              </th>
              {(shopeeOrderStatusCheck === "PROCESSED" ||
                shopeeOrderStatusCheck === "SHIPPED" ||
                shopeeOrderStatusCheck === "COMPLETED") && (
                <th className="sticky top-0 bg-[#0043681A]">{t("Tracking")}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((order, idx) => {
              const recipient = order?.recipient_address || {};
              const fullAddress = [
                recipient.full_address,
                recipient.city,
                recipient.state,
                recipient.district,
                recipient.region,
                recipient.zipcode,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <tr
                  key={order.order_sn || idx}
                  className="capitalize hover:bg-[#0043681A]"
                >
                  {/* Buyer username */}
                  <td className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer"
                      value={order.order_sn}
                      checked={checkedItems.some(
                        (i) => i.order_sn === order.order_sn
                      )}
                      onChange={() => handleCheckboxChange(order)}
                    />
                    <p className="ml-2">{formatText(order?.buyer_username)}</p>
                  </td>

                  {/* Recipient name */}
                  <td>{formatText(recipient?.name)}</td>

                  {/* Address */}
                  <td>{formatText(fullAddress)}</td>

                  {/* Shipping Carrier */}
                  <td>{formatText(order?.shipping_carrier)}</td>

                  {/* Order SN */}
                  <td>{formatText(order?.order_sn)}</td>

                  {/* Product details */}
                  <td>
                    <span>
                      {order?.item_list?.length
                        ? `Items: ${order.item_list.length}`
                        : t("NoData")}
                    </span>
                    <button
                      className="ml-3 text-[#004368] text-xs"
                      onClick={() => handleDetailsClick(order)}
                    >
                      {detailsLoading ? "Loading..." : t("Details")}
                    </button>
                  </td>

                  {/* Tracking */}
                  {(shopeeOrderStatusCheck === "PROCESSED" ||
                    shopeeOrderStatusCheck === "SHIPPED" ||
                    shopeeOrderStatusCheck === "COMPLETED") && (
                    <td>
                      <button
                        className="text-[#004368] text-xs"
                        onClick={() => handleGetTracking(order)}
                      >
                        {t("Tracking")}
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* MODAL */}
      {showModal && trackingInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
              onClick={() => setShowModal(false)}
            >
              <RxCross1 />
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-[#004368] text-center">
              {t("TrackingUpdates")}
            </h2>

            <ul className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {trackingInfo?.tracking_info?.length > 0 ? (
                trackingInfo.tracking_info.map((item, index) => (
                  <li key={index} className="border-l-4 border-[#004368] pl-4">
                    <p className="text-sm font-semibold text-gray-800">
                      {item.description || t("NoData")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.update_time
                        ? new Date(item.update_time * 1000).toLocaleString()
                        : ""}
                    </p>
                  </li>
                ))
              ) : (
                <li className="text-center text-gray-500">{t("NoData")}</li>
              )}
            </ul>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowModal(false)}
                className="bg-[#004368] hover:bg-[#00324d] text-white py-2 px-6 rounded-lg"
              >
                {t("Close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-center text-red-500 font-medium mt-4">{error}</p>
      )}
    </div>
  );
};

export default ShopeeBatchPrintTable;
