import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import { useTranslation } from "react-i18next";
import FadeLoader from "react-spinners/FadeLoader";

const BatchPrintTable = ({
  filteredData,
  isLoading,
  isError,
  handleDetailsClick,
  checkedItems,
  handleCheckboxChange,
  tikTokOrderStatusCheck,
  cipher,
}) => {
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );
  const [showModal, setShowModal] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const formatText = (text) => {
    if (!text) return "No Data";
    return text.length > 20 ? `${text.slice(0, 20)}***` : text;
  };

  const handleGetTracking = async (order) => {
    setLoading(true);
    setError("");
    setTrackingInfo(null);
    try {
      const url = `https://grozziie.zjweiting.com:3091/tiktokshop-partner/api/dev/package/tracking?cipher=${encodeURIComponent(
        cipher[0]?.cipher
      )}&orderId=${encodeURIComponent(order?.id)}`;

      const res = await fetch(url);
      const json = await res.json();

      if (json.code === 0 && json.data?.tracking?.length) {
        setTrackingInfo(json.data.tracking);
        setShowModal(true);
      } else {
        setError(t("No tracking data available."));
      }
    } catch (err) {
      setError(t("Failed to fetch tracking data."));
      console.error(err);
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
          {t("NoData")}
        </p>
      ) : filteredData?.length === 0 ? (
        <p className="text-center text-3xl text-red-500 font-medium py-20">
          {t("NoData")}
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
                <span className="mr-[10px]">{t("DeliveryCode")}</span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
              </th>
              <th className="sticky top-0 bg-[#0043681A] bg-opacity-80 ">
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                {t("ProductDetails")}
              </th>
              {(tikTokOrderStatusCheck === "AWAITING_COLLECTION" ||
                tikTokOrderStatusCheck === "AWAITING_COLLECTION_PRINTED") && (
                <th className="sticky top-0 bg-[#0043681A] bg-opacity-80 rounded-r-md">
                  <span className="mr-[10px]">{t("Tracking")}</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData &&
              filteredData.map((order) => {
                const item = order.lineItems?.[0] || {};
                const address = order.recipientAddress || {};

                return (
                  <tr
                    key={order.id}
                    className="capitalize hover:bg-[#0043681A] cursor-pointer"
                  >
                    {/* Account Name / Buyer Email */}
                    <td className="flex items-center justify-start cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded-[2px] text-black text-opacity-60 bg-[#004368] cursor-pointer"
                        name="product"
                        value={order.id}
                        checked={checkedItems.some((i) => i.id === order.id)}
                        onChange={() => handleCheckboxChange(order)}
                      />
                      <p className="ml-[7px] text-black opacity-80 text-sm font-normal leading-4">
                        {formatText(order.buyerEmail) || t("NoData")}
                      </p>
                    </td>
                    {/* Customer Name */}
                    <td className="text-black opacity-80 text-sm font-normal leading-4">
                      {formatText(address.name) || t("NoData")}
                    </td>

                    {/* Address */}
                    <td className="text-black opacity-80 text-sm font-normal leading-4">
                      {formatText(address.fullAddress) || t("NoData")}
                    </td>

                    {/* Delivery Company */}
                    <td className="text-black opacity-80 text-sm font-normal leading-4">
                      {formatText(order.shippingProvider) || t("NoData")}
                    </td>

                    {/* Delivery Code / Tracking Number */}
                    <td className="text-black opacity-80 text-sm font-normal leading-4">
                      {formatText(order.trackingNumber) || t("NoData")}
                    </td>

                    {/* Product Details */}
                    <td className="flex items-center justify-between cursor-pointer">
                      <div className="flex">
                        <img
                          src={
                            item.skuImage || "https://via.placeholder.com/40"
                          }
                          alt="Product"
                          className="w-9 h-8"
                        />
                        <span className="text-black opacity-80 text-xs font-normal capitalize ml-[6px] mr-6">
                          {formatText(item.productName)
                            ? item.productName.slice(0, 15) + "..."
                            : t("NoData")}
                        </span>
                      </div>
                      <p
                        className="text-[#004368] text-xs font-normal leading-[14px] capitalize cursor-pointer whitespace-nowrap"
                        onClick={() => handleDetailsClick(order)}
                      >
                        {t("Details")}
                      </p>
                      {/* You can reuse your modal here like before */}
                    </td>
                    {(tikTokOrderStatusCheck === "AWAITING_COLLECTION" ||
                      tikTokOrderStatusCheck ===
                        "AWAITING_COLLECTION_PRINTED") && (
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
              {t("Tracking Updates")}
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchPrintTable;
