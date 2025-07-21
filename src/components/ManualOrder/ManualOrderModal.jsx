import React from "react";
import { Link } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { FaRegCopy } from "react-icons/fa";
import { MdOutlineLocalPrintshop } from "react-icons/md";

const ManualOrderModal = ({
  selectedLanguage,
  handleModalSubmit,
  handleModalToCheckAndSave,
  handleSenderInformation,
  senderData,
  formData,
  handleInputChange,
  provinceOptions,
  closeModal,
  handleProvince,
  handleCity,
  handleFileChange,
  handleImportOrderClick,
  senderInfoServer,
  senderError,
  setSelectedProvince,
  setSelectedCity,
  setSelectedDistricts,
  filterCityUnderProvince,
  filterDistrictUnderCity,
  provinces,
  cities,
  districts,
}) => {
  return (
    <div>
      <div
        className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[229px] h-10 px-8 py-2 rounded-md cursor-pointer text-center col-span-2"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        <button className="text-[15px] font-medium capitalize flex items-center justify-evenly">
          <FaPlus className="w-[14px] h-[14px]" />
          <span className="pl-4 text-sm font-medium capitalize">
            {selectedLanguage === "zh-CN" ? "添加新订单" : "Add New Order"}
          </span>
        </button>
      </div>
      <dialog id="my_modal_1" className="modal">
        <div className="bg-white rounded-2xl w-[1084px] h-[850px]">
          <div className="text-[#004368] bg-[#0043681A] bg-opacity-10 font-bold text-lg px-10 capitalize h-11 py-2 flex items-center justify-between">
            <h3 className="">
              {selectedLanguage === "zh-CN"
                ? "手动创建订单"
                : "Manually Create Order"}
            </h3>
            <IoCloseOutline
              className="w-7 h-7 cursor-pointer"
              onClick={closeModal}
            />
          </div>
          <div className="modal-action w-full text-center flex justify-end pt-5">
            <form method="dialog" onSubmit={handleModalSubmit}>
              <div className="pl-14 pr-10">
                {/* top section */}
                <div className="flex items-center">
                  <div className="">
                    <span className="capitalize text-black text-[15px] font-medium leading-normal">
                      {selectedLanguage === "zh-CN"
                        ? "发件人信息"
                        : "Sender Information"}
                    </span>
                  </div>
                  {/* sender Information */}
                  {/* {senderError ? (
                    <p className="text-xl font-medium text-red-500">
                      Something went wrong. Data can't load...
                    </p>
                  ) : ( */}
                  <select
                    onClick={handleSenderInformation}
                    className="select w-[700px] h-10 rounded-md border-[#0043681A] border-opacity-10 focus:outline-none text-[#00000099] font-normal text-[15px] capitalize px-[15px] py-2  inline-flex items-center bg-white mx-3"
                  >
                    <option
                      disabled
                      selected
                      value=""
                      className="text-black text-[15px] font-light leading-normal"
                    >
                      {selectedLanguage === "zh-CN"
                        ? "请选择发件人姓名"
                        : "Please Select Sender Name"}
                    </option>
                    {senderInfoServer?.map((data, index) => (
                      <option
                        key={index}
                        value={JSON.stringify(data)}
                        className="text-black text-[15px] font-light leading-normal"
                      >
                        {data?.sender_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* middle section */}
                <div className="mt-14 flex items-start justify-center">
                  {/* <div className="w-28 ml-0">
                    <span className="capitalize text-black text-[15px] font-medium leading-normal">
                      smart entry
                    </span>
                  </div>
                  <textarea
                    placeholder="Enter the recipient information"
                    className="textarea textarea-bordered textarea-lg w-[556px] h-[135px] bg-white bg-transparent ml-[63px] mr-4"
                  ></textarea>
                  <div className="grid grid-cols-2 gap-3 mr-4">
                    <div className="bg-[#004368] bg-opacity-10 hover:bg-opacity-100 text-black text-opacity-80 hover:text-white w-[160px] h-10 px-4 py-2 rounded-md cursor-pointer flex items-center">
                      <FaRegCopy className="w-5 h-5 mr-3" />
                      <button className="text-[15px] font-normal capitalize">
                        copy order
                      </button>
                    </div>
                    <div className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[101px] h-10 px-8 py-2 rounded-md cursor-pointer ml-4">
                      <button className="text-[15px] font-medium capitalize">
                        Entry
                      </button>
                    </div>
                    <div className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[124px] h-10 px-8 py-2 rounded-md cursor-pointer text-center">
                      <button className="text-[15px] font-medium capitalize">
                        Save
                      </button>
                    </div>
                  </div> */}

                  <input
                    type="file"
                    id="fileInput"
                    accept=".xls, .xlsx"
                    onChange={handleFileChange}
                    className="bg-white focus:outline-none file-input file-input-bordered file-input-md w-full max-w-xs"
                  />
                </div>

                {/* bottom section Form*/}
                <div className="mt-[53px] grid grid-cols-2 gap-6">
                  {/* Receiver Name */}
                  <div className="flex items-center justify-between space-x-[6px]">
                    <span className="capitalize text-black text-[15px] font-medium leading-normal">
                      {selectedLanguage === "zh-CN"
                        ? "收件人姓名"
                        : "Recipient Name"}
                    </span>
                    <input
                      type="text"
                      name="receiver_name"
                      required
                      placeholder={
                        selectedLanguage === "zh-CN"
                          ? "请输入收件人姓名"
                          : "Please Enter Recipient Name"
                      }
                      className="input border-[#0043681A] border-opacity-10 focus:outline-none w-[352px] h-10 bg-white"
                      value={formData.receiver_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Receiver User Name */}
                  <div className="flex items-center justify-between space-x-[6px]">
                    <span className="capitalize text-black text-[15px] font-medium leading-normal">
                      {selectedLanguage === "zh-CN" ? "用户名" : "User Name"}
                    </span>
                    <input
                      type="text"
                      name="account_name"
                      required
                      placeholder={
                        selectedLanguage === "zh-CN"
                          ? "请输入用户名"
                          : "please enter user name"
                      }
                      className="input border-[#0043681A] border-opacity-10 focus:outline-none w-[352px] h-10 bg-white"
                      value={formData.account_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Country */}
                  <div className="flex items-center justify-between space-x-[6px]">
                    <span className="capitalize text-black text-[15px] font-medium leading-normal">
                      {selectedLanguage === "zh-CN" ? "国家" : "Country"}
                    </span>
                    <input
                      type="text"
                      name="country"
                      readOnly
                      value="中国"
                      className="input border-[#0043681A] border-opacity-10 focus:outline-none w-[352px] h-10 bg-white"
                    />
                  </div>

                  {/* province */}
                  <div className="flex items-center justify-between space-x-[6px]">
                    <span className="capitalize text-black text-sm font-medium leading-normal">
                      {selectedLanguage === "zh-CN" ? "省" : "Province"}
                    </span>
                    <select
                      className="select w-[352px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[10px] py-1 inline-flex items-center bg-white border-[#0043681A] border-opacity-10 focus:outline-none"
                      required
                      onChange={(e) => {
                        const selectedId = provinces?.find(
                          (province) => province.region_name === e.target.value
                        ).id;
                        filterCityUnderProvince(selectedId);
                      }}
                      onClick={(e) => setSelectedProvince(e.target.value)}
                    >
                      <option value="">
                        {selectedLanguage === "zh-CN"
                          ? "选择省份"
                          : "Select Province"}
                      </option>
                      {provinces?.map((province) => (
                        <option key={province.id} value={province.region_name}>
                          {province.region_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* city */}
                  <div className="flex items-center justify-between space-x-[6px]">
                    <span className="capitalize text-black text-sm font-medium leading-normal">
                      {selectedLanguage === "zh-CN" ? "城市" : "City"}
                    </span>
                    <select
                      className="select w-[352px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[10px] py-1  inline-flex items-center bg-white border-[#0043681A] border-opacity-10 focus:outline-none"
                      required
                      onChange={(e) => {
                        const selectedId = cities?.find(
                          (city) => city.region_name === e.target.value
                        ).id;
                        filterDistrictUnderCity(selectedId);
                      }}
                      onClick={(e) => setSelectedCity(e.target.value)}
                    >
                      <option value="">
                        {selectedLanguage === "zh-CN"
                          ? "选择城市"
                          : "Select City"}
                      </option>
                      {cities?.map((city) => (
                        <option key={city.id} value={city.region_name}>
                          {city.region_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* district */}
                  <div className="flex items-center justify-between space-x-[6px]">
                    <span className="capitalize text-black text-sm font-medium leading-normal">
                      {selectedLanguage === "zh-CN" ? "区" : "District"}
                    </span>
                    <select
                      className="select w-[352px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[10px] py-1  inline-flex items-center bg-white border-[#0043681A] border-opacity-10 focus:outline-none"
                      required
                      onClick={(e) => setSelectedDistricts(e.target.value)}
                    >
                      <option value="">
                        {selectedLanguage === "zh-CN"
                          ? "选择地区"
                          : "Select District"}
                      </option>
                      {districts?.map((district) => (
                        <option key={district.id} value={district.region_name}>
                          {district.region_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Address */}
                  <div className="flex items-center justify-between space-x-[6px]">
                    <span className="capitalize text-black text-[15px] font-medium leading-normal">
                      {selectedLanguage === "zh-CN" ? "地址" : "Address"}
                    </span>
                    <input
                      type="text"
                      name="receiver_address"
                      required
                      placeholder={
                        selectedLanguage === "zh-CN"
                          ? "输入客户地址"
                          : "Enter customer address"
                      }
                      className="input border-[#0043681A] border-opacity-10 focus:outline-none w-[352px] h-10 bg-white"
                      value={formData.receiver_address}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* phone */}
                  <div className="flex items-center justify-between space-x-[6px]">
                    <span className="capitalize text-black text-[15px] font-medium leading-normal">
                      {selectedLanguage === "zh-CN"
                        ? "电话号码"
                        : "Phone Number"}
                    </span>
                    <input
                      type="text"
                      name="receiver_phone"
                      required
                      placeholder={
                        selectedLanguage === "zh-CN"
                          ? "接收者电话号码"
                          : "Receiver phone number"
                      }
                      className="input border-[#0043681A] border-opacity-10 focus:outline-none w-[352px] h-10 bg-white"
                      value={formData.receiver_phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/*received Money  */}
                  <div className="flex items-center justify-between space-x-[6px]">
                    <span className="capitalize text-black text-[15px] font-medium leading-normal">
                      {selectedLanguage === "zh-CN" ? "支付金额" : "Pay Amount"}
                    </span>
                    <input
                      type="text"
                      name="pay_amount"
                      required
                      placeholder="Y125.00"
                      className="input border-[#0043681A] border-opacity-10 focus:outline-none w-[352px] h-10 bg-white"
                      // value={formData.pay_amount}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* remark */}
                  <div className="flex items-center justify-between space-x-[6px]">
                    <span className="capitalize text-black text-[15px] font-medium leading-normal">
                      {selectedLanguage === "zh-CN" ? "备注" : "Remark"}
                    </span>
                    <input
                      type="text"
                      name="remark"
                      required
                      placeholder={
                        selectedLanguage === "zh-CN"
                          ? "输入备注"
                          : "enter remark"
                      }
                      className="input border-[#0043681A] border-opacity-10 focus:outline-none w-[352px] h-10 bg-white"
                      value={formData.remark}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* bottom button */}
                <div className="mt-20 flex items-center justify-end">
                  <p
                    className="w-32 h-10 bg-[#0043681A] bg-opacity-60 text-[#004368]  hover:bg-[#004368] hover:text-white rounded-md border flex items-center justify-center p-2 text-[15px] font-medium leading-normal capitalize cursor-pointer"
                    onClick={closeModal}
                  >
                    {selectedLanguage === "zh-CN" ? "取消" : "Cancel"}
                  </p>

                  <button
                    className="w-32 h-10 bg-white text-[#004368] rounded-md border flex items-center justify-center hover:bg-[#004368] hover:text-white p-2 text-[15px] font-medium leading-normal capitalize mx-5"
                    type="submit"
                  >
                    {selectedLanguage === "zh-CN" ? "救" : "Save"}
                  </button>

                  <button
                    onClick={handleModalToCheckAndSave}
                    className="bg-[#004368] hover:bg-opacity-25 text-white hover:text-black w-[195px] h-10 px-8 py-2 rounded-md cursor-pointer flex items-center justify-center"
                  >
                    <span className=" h-10  flex items-center justify-center p-2 ">
                      <MdOutlineLocalPrintshop className="w-5 h-5" />
                      <span className="text-[15px] font-medium leading-normal capitalize pl-1">
                        {selectedLanguage === "zh-CN"
                          ? "保存并打印"
                          : "Save & Print"}
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ManualOrderModal;
