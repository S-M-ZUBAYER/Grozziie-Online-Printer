import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import FadeLoader from "react-spinners/FadeLoader";
import { useTranslation } from "react-i18next";

const LazadaBatchPrintTable = ({
  filteredData,
  isLoading,
  isError,
  handleDetailsClick,
  checkedItems,
  handleCheckboxChange,
  lazadaOrderStatusCheck,
  cipher,
  detailsLoading,
}) => {
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatText = (text) => {
    if (!text) return t("No Data");
    return text.length > 20 ? `${text.slice(0, 20)}***` : text;
  };

  const handleGetTracking = async (order) => {
    setLoading(true);
    setError("");
    setTrackingInfo(null);

    try {
      const orderId = order?.order_id;
      if (!orderId) {
        setError("Missing order ID.");
        return;
      }

      // Step 1: Get item data to extract package_id(s)
      const itemRes = await fetch(
        `https://grozziie.zjweiting.com:3091/lazada-open-shop/api/dev/orders/items?orderId=${orderId}`
      );
      const itemJson = await itemRes.json();
      const parsedItemData = JSON.parse(itemJson?.body || "{}");
      const items = parsedItemData?.data || [];
      console.log("item", items);
      // Step 2: Collect all valid package_ids
      const ofcPackageIdList = items
        .map((item) => item?.package_id)
        .filter(Boolean); // remove undefined/null

      if (!ofcPackageIdList.length) {
        setError(t("No package IDs found for tracking."));
        return;
      }

      // Step 3: Build query string with multiple ofcPackageIdList
      const queryParams = new URLSearchParams({ orderId });
      ofcPackageIdList.forEach((id) =>
        queryParams.append("ofcPackageIdList", id)
      );

      const trackingUrl = `https://grozziie.zjweiting.com:3091/lazada-open-shop/api/dev/logistic/order/trace?${queryParams.toString()}`;

      // Step 4: Call tracking API
      const traceRes = await fetch(trackingUrl);
      const traceJson = await traceRes.json();
      console.log(
        "tracking end",
        `https://grozziie.zjweiting.com:3091/lazada-open-shop/api/dev/logistic/order/trace?${queryParams.toString()}`,
        traceJson
      );
      if (traceJson.code === 0 && traceJson.data) {
        setTrackingInfo(traceJson.data);
        setShowModal(true);
      } else {
        setError(t("No tracking data available."));
      }
    } catch (err) {
      console.error("Failed to fetch tracking data:", err);
      setError(t("Failed to fetch tracking data."));
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
      ) : filteredData?.length === 0 || !filteredData?.length ? (
        <p className="text-center text-3xl text-red-500 font-medium py-20">
          {t("NoAvailableOrder")}
        </p>
      ) : (
        <table className="table">
          <thead className="">
            <tr className="h-11 text-black text-opacity-80 capitalize text-center text-sm font-normal leading-4">
              <th className="sticky top-0 bg-[#0043681A] bg-opacity-80 rounded-l-md">
                <span className="mr-[10px]">{t("AccountName")}</span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
              </th>
              <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
                <span className="mr-[10px]">{t("ReceiverName")}</span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
              </th>
              <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
                <span className="mr-[10px]">{t("Address")}</span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
              </th>
              <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
                <span className="mr-[10px]">{t("DeliveryCompany")}</span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
              </th>
              <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
                <span className="mr-[10px]">{t("orderId")}</span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
              </th>
              <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                {t("ProductDetails")}
              </th>
              {(lazadaOrderStatusCheck === "Packed" ||
                lazadaOrderStatusCheck === "ready_to_ship" ||
                lazadaOrderStatusCheck === "shipped" ||
                lazadaOrderStatusCheck === "Packed_Printed") && (
                <th className="sticky top-0 bg-[#0043681A] bg-opacity-80 rounded-r-md">
                  <span className="mr-[10px]">{t("Tracking")}</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((order) => {
              const address = order.address_billing || {};
              const receiverName =
                [address.first_name, address.last_name]
                  .filter(Boolean)
                  .join(" ") || t("NoData");

              const fullAddress = [
                address.address1,
                address.address2,
                address.address3,
                address.address4,
                address.address5,
                address.city,
                address.post_code,
                address.country,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <tr
                  key={order.order_id}
                  className="capitalize hover:bg-[#0043681A] cursor-pointer"
                >
                  {/* Checkbox & Buyer Name */}
                  <td className="flex items-center justify-start cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded-[2px] text-black text-opacity-60 bg-[#004368] cursor-pointer"
                      value={order.order_id}
                      checked={checkedItems.some(
                        (i) => i.order_id === order.order_id
                      )}
                      onChange={() => handleCheckboxChange(order)}
                    />
                    <p className="ml-[7px] text-black opacity-80 text-sm font-normal leading-4">
                      {formatText(order.customer_first_name) || t("NoData")}
                    </p>
                  </td>

                  {/* Receiver Name */}
                  <td className="text-black opacity-80 text-sm font-normal leading-4">
                    {receiverName}
                  </td>

                  {/* Full Address */}
                  <td className="text-black opacity-80 text-sm font-normal leading-4">
                    {formatText(fullAddress) || t("NoData")}
                  </td>

                  {/* Warehouse Code */}
                  <td className="text-black opacity-80 text-sm font-normal leading-4">
                    {formatText(order.warehouse_code) || t("NoData")}
                  </td>

                  {/* Order Number */}
                  <td className="text-black opacity-80 text-sm font-normal leading-4">
                    {formatText(order.order_number?.toString()) || t("NoData")}
                  </td>

                  {/* Product Details */}
                  <td className="flex items-center justify-between cursor-pointer">
                    <span className="text-black opacity-80 text-xs font-normal capitalize ml-[6px] mr-6">
                      {order.items_count
                        ? `Items: ${order.items_count}`
                        : t("NoData")}
                    </span>

                    <p
                      className="text-[#004368] text-xs font-normal leading-[14px] capitalize cursor-pointer"
                      onClick={() => handleDetailsClick(order)}
                    >
                      {detailsLoading ? "Loading..." : t("Details")}
                    </p>
                  </td>

                  {/* Optional Tracking Button */}
                  {(lazadaOrderStatusCheck === "Packed" ||
                    lazadaOrderStatusCheck === "ready_to_ship" ||
                    lazadaOrderStatusCheck === "shipped" ||
                    lazadaOrderStatusCheck === "Packed_Printed") && (
                    <td className="text-black opacity-80 text-sm font-normal leading-4">
                      <p
                        className="text-[#004368] text-xs font-normal leading-[14px] capitalize cursor-pointer"
                        onClick={() => handleGetTracking(order)}
                      >
                        {t("Tracking")}
                      </p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              <RxCross1 />
            </button>

            {/* Header */}
            <h2 className="text-2xl font-semibold mb-6 text-[#004368] text-center">
              {t("TrackingUpdates")}
            </h2>

            {/* Timeline List */}
            <ul className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {trackingInfo.map((item, index) => (
                <li key={index} className="border-l-4 border-[#004368] pl-4">
                  <p className="text-sm font-semibold text-gray-800">
                    {item.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.updateTimeMillis).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowModal(false)}
                className="bg-[#004368] hover:bg-[#00324d] text-white font-medium py-2 px-6 rounded-lg transition"
              >
                {t("Close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazadaBatchPrintTable;
