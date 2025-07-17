import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import PacmanLoader from "react-spinners/PacmanLoader";
import FadeLoader from "react-spinners/FadeLoader";
import { useTranslation } from "react-i18next";

const BatchPrintTable = ({
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
                <span className="mr-[10px]">
                  {selectedLanguage === "zh-CN" ? "地址" : "address"}
                </span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
              </th>
              <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
                <span className="mr-[10px]">
                  {selectedLanguage === "zh-CN" ? "客户标记" : "customer mark"}
                </span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
              </th>
              <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
                <span className="mr-[10px]">
                  {selectedLanguage === "zh-CN"
                    ? "送货公司"
                    : "delivery company"}
                </span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
              </th>
              <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
                <span className="mr-[10px]">
                  {selectedLanguage === "zh-CN" ? "送货代码" : "delivery code"}
                </span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
              </th>
              <th className="sticky top-0 bg-[#0043681A] bg-opacity-80 rounded-r-md">
                {selectedLanguage === "zh-CN" ? "产品详情" : "product details"}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData &&
              filteredData?.map((customerData) => (
                <tr
                  className={`capitalize hover:bg-[#0043681A] cursor-pointer`}
                  key={customerData?.order_sn}
                >
                  <td className="flex items-center justify-start cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded-[2px] text-black text-opacity-60 bg-[#004368] cursor-pointer"
                      name="product"
                      value={customerData?.order_sn}
                      checked={checkedItems.some(
                        (item) => item?.order_sn === customerData?.order_sn
                      )}
                      onChange={() => handleCheckboxChange(customerData)}
                    />
                    <p className="ml-[7px] text-black opacity-80 text-sm font-normal leading-4 capitalize">
                      {customerData?.receiver_name_mask
                        ? customerData?.receiver_name_mask
                        : selectedLanguage === "zh-CN"
                        ? "没有数据"
                        : "No Data"}
                    </p>
                  </td>
                  <td className="text-black opacity-80 text-sm font-normal leading-4 capitalize">
                    {customerData?.receiver_name
                      ? customerData?.receiver_name
                      : selectedLanguage === "zh-CN"
                      ? "没有数据"
                      : "No Data"}
                  </td>
                  <td className="text-black opacity-80 text-sm font-normal leading-4 capitalize">
                    {customerData?.receiver_address
                      ? customerData?.receiver_address
                      : selectedLanguage === "zh-CN"
                      ? "没有数据"
                      : "No Data"}
                  </td>
                  <td className="text-black opacity-80 text-sm font-normal leading-4 capitalize">
                    {customerData?.remark
                      ? customerData?.remark
                      : selectedLanguage === "zh-CN"
                      ? "没有数据"
                      : "No Data"}
                  </td>
                  <td className="text-black opacity-80 text-sm font-normal leading-4 capitalize">
                    {customerData?.deliveryCompany
                      ? customerData?.deliveryCompany
                      : selectedLanguage === "zh-CN"
                      ? "没有数据"
                      : "No Data"}
                  </td>
                  <td className="text-black opacity-80 text-sm font-normal leading-4 capitalize">
                    {customerData?.deliveryCode
                      ? customerData?.deliveryCode
                      : selectedLanguage === "zh-CN"
                      ? "没有数据"
                      : "No Data"}
                  </td>
                  <td className="flex items-center justify-between cursor-pointer">
                    <div className="flex">
                      <img
                        src={
                          customerData?.item_list?.[0]?.goods_img
                            ? customerData?.item_list?.[0]?.goods_img
                            : selectedLanguage === "zh-CN"
                            ? "没有图像"
                            : "No Image"
                        }
                        alt="ProductImage"
                        className="w-9 h-8"
                      />
                      <span className="text-black opacity-80 text-xs font-normal capitalize ml-[6px] mr-6">
                        {customerData?.item_list?.[0]?.goods_name
                          ? customerData?.item_list?.[0]?.goods_name.slice(
                              0,
                              15
                            ) + "..."
                          : selectedLanguage === "zh-CN"
                          ? "没有数据"
                          : "No Data"}
                      </span>
                    </div>
                    {/* details button */}
                    <p
                      className="text-[#004368] text-xs font-normal leading-[14px] capitalize cursor-pointer"
                      onClick={() => handleDetailsClick(customerData)}
                    >
                      {selectedLanguage === "zh-CN" ? "细节" : "Details"}
                    </p>
                    {/* Modal For product Details show */}
                    {selectedCustomer && isModalOpen && (
                      <dialog
                        id="my_modal_2"
                        className="modal"
                        open={isModalOpen}
                      >
                        <div className="">
                          <div className="modal-action w-full text-start flex justify-end pr-10">
                            <div className="card w-[950px] h-[500px] bg-white shadow-md rounded-xl relative">
                              <div className="absolute top-4 right-8">
                                <RxCross1
                                  onClick={closeModal}
                                  className="w-5 h-5 text-[#004368] text-opacity-35 hover:text-[#004368]"
                                />
                              </div>
                              <div className="grid grid-cols-9 w-full mx-auto my-auto">
                                <figure className="mx-4 my-auto col-span-4 w-[390px] h-[390px]">
                                  <img
                                    src={
                                      selectedCustomer?.item_list?.[0]
                                        ?.goods_img
                                        ? selectedCustomer?.item_list?.[0]
                                            ?.goods_img
                                        : selectedLanguage === "zh-CN"
                                        ? "没有图像"
                                        : "No Image"
                                    }
                                    alt="ProductImage"
                                    className="rounded-lg"
                                  />
                                </figure>
                                <div className="card-body text-start col-span-5">
                                  <h2 className="text-xl font-semibold text-black">
                                    {selectedLanguage === "zh-CN"
                                      ? "产品名称："
                                      : "Product Name:"}
                                    <span className="font-light text-black text-opacity-90 text-sm ml-2">
                                      {selectedCustomer?.item_list?.[0]
                                        ?.goods_name
                                        ? selectedCustomer?.item_list?.[0]
                                            ?.goods_name
                                        : selectedLanguage === "zh-CN"
                                        ? "没有数据"
                                        : "No Data"}
                                    </span>
                                  </h2>
                                  <p className="text-xl font-semibold text-black">
                                    {selectedLanguage === "zh-CN"
                                      ? "顾客姓名："
                                      : "Customer Name:"}
                                    <span className="font-light text-black text-opacity-90 text-sm ml-2">
                                      {selectedCustomer.receiver_name
                                        ? selectedCustomer.receiver_name
                                        : selectedLanguage === "zh-CN"
                                        ? "没有数据"
                                        : "No Data"}
                                    </span>
                                  </p>
                                  <p className="text-xl font-semibold text-black">
                                    {selectedLanguage === "zh-CN"
                                      ? "接收方电话："
                                      : "Receiver Phone:"}

                                    <span className="font-light text-black text-opacity-90 text-sm ml-2">
                                      {selectedCustomer.receiver_phone
                                        ? selectedCustomer.receiver_phone
                                        : selectedLanguage === "zh-CN"
                                        ? "没有数据"
                                        : "No Data"}
                                    </span>
                                  </p>
                                  <p className="text-xl font-semibold text-black">
                                    {selectedLanguage === "zh-CN"
                                      ? "客户地址："
                                      : "Customer Address:"}
                                    <span className="font-light text-black text-opacity-90 text-sm ml-2">
                                      {selectedCustomer.receiver_address
                                        ? selectedCustomer.receiver_address
                                        : selectedLanguage === "zh-CN"
                                        ? "没有数据"
                                        : "No Data"}
                                    </span>
                                  </p>
                                  <p className="text-xl font-semibold text-black">
                                    {selectedLanguage === "zh-CN"
                                      ? "城市："
                                      : "City:"}
                                    <span className="font-light text-black text-opacity-90 text-sm ml-2">
                                      {selectedCustomer.city
                                        ? selectedCustomer.city
                                        : selectedLanguage === "zh-CN"
                                        ? "没有数据"
                                        : "No Data"}
                                    </span>
                                  </p>
                                  <p className="text-xl font-semibold text-black">
                                    {selectedLanguage === "zh-CN"
                                      ? "省："
                                      : "Province:"}

                                    <span className="font-light text-black text-opacity-90 text-sm ml-2">
                                      {selectedCustomer.province
                                        ? selectedCustomer.province
                                        : selectedLanguage === "zh-CN"
                                        ? "没有数据"
                                        : "No Data"}
                                    </span>
                                  </p>
                                  <p className="text-xl font-semibold text-black">
                                    {selectedLanguage === "zh-CN"
                                      ? "客户标记："
                                      : "Customer Mark:"}

                                    <span className="font-light text-black text-opacity-90 text-sm ml-2">
                                      {selectedCustomer.remark
                                        ? selectedCustomer.remark
                                        : selectedLanguage === "zh-CN"
                                        ? "没有数据"
                                        : "No Data"}
                                    </span>
                                  </p>
                                  {/* <p className="text-xl font-semibold text-black">
                                  Delivery Company:
                                  <span className="font-light text-black text-opacity-90 text-sm ml-2">
                                    {selectedCustomer.address
                                      ? selectedCustomer.address
                                      : "No Data"}
                                  </span>
                                </p> */}
                                  <p className="text-xl font-semibold text-black">
                                    {selectedLanguage === "zh-CN"
                                      ? "订单号："
                                      : "Order Number:"}

                                    <span className="font-light text-black text-opacity-90 text-sm ml-2">
                                      {selectedCustomer.order_sn
                                        ? selectedCustomer.order_sn
                                        : selectedLanguage === "zh-CN"
                                        ? "没有数据"
                                        : "No Data"}
                                    </span>
                                  </p>
                                  {/* close button */}
                                  <div className="absolute bottom-8 right-8">
                                    <p
                                      className="bg-[#004368] bg-opacity-30 hover:bg-[#004368] text-black hover:text-white w-[100px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mt-5"
                                      onClick={closeModal}
                                    >
                                      {selectedLanguage === "zh-CN"
                                        ? "关闭"
                                        : "Close"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </dialog>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BatchPrintTable;
