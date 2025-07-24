import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import PacmanLoader from "react-spinners/PacmanLoader";
import FadeLoader from "react-spinners/FadeLoader";
import { useTranslation } from "react-i18next";

const PackageTable = ({
  filteredData,
  isLoading,
  isPrintedLoading,
  isError,
  selectedCustomer,
  handleDetailsClick,
  isModalOpen,
  closeModal,
  checkedItems,
  handleCheckboxChange,
  data,
  refundStatusCheck,
  startDate,
  endDate,
  cipher,
}) => {
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatText = (text) => {
    if (!text) return t("No Data");
    return text.length > 25 ? `${text.slice(0, 25)}*****` : text;
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
      {refundStatusCheck === "shipped" && isPrintedLoading ? (
        <div className="flex flex-col items-center justify-center pt-10 text-center w-full mx-auto pb-60">
          <FadeLoader color="#004368" size={25} />
          <p className="text-2xl font-medium pt-10 text-[#004368]">
            {selectedLanguage === "zh-CN"
              ? "数据正在加载，请稍候..."
              : "Data is Loading. Please Wait..."}
          </p>
        </div>
      ) : refundStatusCheck === "shipped" && isError ? (
        <p className="text-center text-3xl text-red-500 font-medium py-20">
          {selectedLanguage === "zh-CN"
            ? "未找到数据。请稍后再试..."
            : "Data Not Found. Please try again later...."}
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
              <th className="sticky top-0 bg-[#0043681A] bg-opacity-80 rounded-r-md">
                {t("ProductDetails")}
              </th>
              <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
                <span className="mr-[10px]">{t("Tracking")}</span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData &&
              filteredData
                .filter(
                  (order) => order?.lineItems[0]?.packageStatus === "PROCESSING"
                ) // 🔍 Only PROCESSING orders
                .map((order) => {
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
                          {formatText(order.buyerEmail) ||
                            (selectedLanguage === "zh-CN"
                              ? "没有数据"
                              : "No Data")}
                        </p>
                      </td>

                      {/* Customer Name */}
                      <td className="text-black opacity-80 text-sm font-normal leading-4">
                        {formatText(address.name) ||
                          (selectedLanguage === "zh-CN"
                            ? "没有数据"
                            : "No Data")}
                      </td>

                      {/* Address */}
                      <td className="text-black opacity-80 text-sm font-normal leading-4">
                        {formatText(address.fullAddress) ||
                          (selectedLanguage === "zh-CN"
                            ? "没有数据"
                            : "No Data")}
                      </td>

                      {/* Delivery Company */}
                      <td className="text-black opacity-80 text-sm font-normal leading-4">
                        {formatText(order.shippingProvider) ||
                          (selectedLanguage === "zh-CN"
                            ? "没有数据"
                            : "No Data")}
                      </td>

                      {/* Delivery Code / Tracking Number */}
                      <td className="text-black opacity-80 text-sm font-normal leading-4">
                        {formatText(order.trackingNumber) ||
                          (selectedLanguage === "zh-CN"
                            ? "没有数据"
                            : "No Data")}
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
                              : selectedLanguage === "zh-CN"
                              ? "没有数据"
                              : "No Data"}
                          </span>
                        </div>
                        <p
                          className="text-[#004368] text-xs font-normal leading-[14px] capitalize cursor-pointer"
                          onClick={() => handleDetailsClick(order)}
                        >
                          {selectedLanguage === "zh-CN" ? "细节" : "Details"}
                        </p>
                      </td>

                      <td className="text-black opacity-80 text-sm font-normal leading-4">
                        <p
                          className="text-[#004368] text-xs font-normal leading-[14px] capitalize cursor-pointer"
                          onClick={() => handleGetTracking(order)}
                        >
                          {selectedLanguage === "zh-CN" ? "细节" : "Tracking"}
                        </p>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      )}
      {/* MODAL */}
      {showModal && trackingInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {t("Tracking Updates")}
            </h2>
            <ul className="space-y-3 max-h-60 overflow-y-auto">
              {trackingInfo.map((item, index) => (
                <li key={index} className="text-gray-700">
                  <span className="block font-medium">{item.description}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(item.updateTimeMillis).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              onClick={() => setShowModal(false)}
            >
              <RxCross1 />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageTable;
