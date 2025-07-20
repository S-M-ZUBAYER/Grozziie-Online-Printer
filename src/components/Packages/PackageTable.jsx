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
}) => {
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );
  const { t } = useTranslation();

  const formatText = (text) => {
    if (!text) return "No Data";
    return text.length > 25 ? `${text.slice(0, 25)}*****` : text;
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
                <span className="mr-[10px]">{t("CustomerMark")}</span>
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
                        {formatText(order.buyerEmail) ||
                          (selectedLanguage === "zh-CN"
                            ? "没有数据"
                            : "No Data")}
                      </p>
                    </td>

                    {/* Customer Name */}
                    <td className="text-black opacity-80 text-sm font-normal leading-4">
                      {formatText(address.name) ||
                        (selectedLanguage === "zh-CN" ? "没有数据" : "No Data")}
                    </td>

                    {/* Address */}
                    <td className="text-black opacity-80 text-sm font-normal leading-4">
                      {formatText(address.fullAddress) ||
                        (selectedLanguage === "zh-CN" ? "没有数据" : "No Data")}
                    </td>

                    {/* Customer Mark */}
                    <td className="text-black opacity-80 text-sm font-normal leading-4">
                      {formatText(order.sellerNote) ||
                        (selectedLanguage === "zh-CN" ? "没有数据" : "No Data")}
                    </td>

                    {/* Delivery Company */}
                    <td className="text-black opacity-80 text-sm font-normal leading-4">
                      {formatText(order.shippingProvider) ||
                        (selectedLanguage === "zh-CN" ? "没有数据" : "No Data")}
                    </td>

                    {/* Delivery Code / Tracking Number */}
                    <td className="text-black opacity-80 text-sm font-normal leading-4">
                      {formatText(order.trackingNumber) ||
                        (selectedLanguage === "zh-CN" ? "没有数据" : "No Data")}
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
                      {/* You can reuse your modal here like before */}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PackageTable;
