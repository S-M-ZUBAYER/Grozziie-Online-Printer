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
  console.log(filteredData);

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
              {/* <th className="sticky top-0 bg-[#0043681A] rounded-l-md">
                {t("AccountName")}
              </th> */}
              <th className="sticky top-0 bg-[#0043681A]">{t("orderId")}</th>{" "}
              <th className="sticky top-0 bg-[#0043681A]">
                {t("ReceiverName")}
              </th>
              <th className="sticky top-0 bg-[#0043681A]">{t("Address")}</th>
              {/* <th className="sticky top-0 bg-[#0043681A]">
                {t("DeliveryCompany")}
              </th> */}
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
                    {/* <p className="ml-2">{formatText(order?.buyer_username)}</p> */}
                    {/* Order SN */}
                    <p className="ml-2"> {formatText(order?.order_sn)}</p>
                  </td>

                  {/* Recipient name */}
                  <td>{formatText(recipient?.name)}</td>

                  {/* Address */}
                  <td>{formatText(fullAddress)}</td>

                  {/* Shipping Carrier */}
                  {/* <td>{formatText(order?.shipping_carrier)}</td> */}

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
