import React, { useState } from "react";
import {
  orderIDs,
  orderList,
  orderTypes,
  recipientAddresses,
  tikTokOrderStatusOptions,
  sortOptions,
} from "../../Share/Data/ClientData";
import { useSelector } from "react-redux";
import { MdDateRange, MdOutlineLocalPrintshop } from "react-icons/md";
import { addDays, format } from "date-fns";
import { DateRange, DateRangePicker } from "react-date-range";
import { CiSearch } from "react-icons/ci";
import { RxReset } from "react-icons/rx";

const SearchComponent = ({ setTikTokOrderStatusCheck }) => {
  const [orderSource, setOrderSource] = useState("");
  const [pendingDelivery, setPendingDelivery] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [orderType, setOrderType] = useState("");
  const [orderId, setOrderId] = useState("");
  const [refundStatus, setRefundStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [searchAllQuery, setSearchAllQuery] = useState("");

  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );

  // const [range, setRange] = useState([
  //   {
  //     startDate: new Date(),
  //     endDate: addDays(new Date(), 7),
  //     key: "selection",
  //   },
  // ]);
  // const refOne = useRef([]);
  const orderListData = useSelector((state) => state.orderList.data);

  // individual function component change value
  const handleOrderSourceChange = (event) => {
    setOrderSource(event.target.value);
  };

  const handlePendingOrderChange = (event) => {
    setPendingDelivery(event.target.value);
  };

  const handleRecipientAddressChange = (event) => {
    setRecipientAddress(event.target.value);
  };

  const handleOrderTypeChange = (event) => {
    setOrderType(event.target.value);
  };

  const handleOrderIdChange = (event) => {
    setOrderId(event.target.value);
  };

  //   refund status function working
  const handleRefundStatusChange = (event) => {
    setRefundStatus(event.target.value);
    setTikTokOrderStatusCheck(event.target.value);
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };

  const handleCreateOrderChange = (event) => {
    setRecipientAddress(event.target.value);
  };

  const handleSelect = (date) => {
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
  };

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };
  const handleSearchAllChange = (event) => {
    setSearchAllQuery(event.target.value);
  };

  const handleToReset = () => {
    console.log("reset in her");
  };

  return (
    <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] py-4 pl-3 pr-2">
      <div className="flex items-center gap-2">
        <div className=" ">
          {/* <select
                onClick={handleOrderSourceChange}
                disabled
                className=" select w-[175px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[15px] py-2 text-center bg-[#0043681A] pr-1">
                {selectionArray.map((option, index) => (
                  <option
                    key={index}
                    value={option}
                    disabled={index === 0}
                    selected={index === 0}
                    className="text-base font-light">
                    {option}
                  </option>
                ))}
              </select> */}
        </div>

        <div className="">
          {/* <select
                onClick={handlePendingOrderChange}
                disabled
                className=" select w-[190px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[15px] py-2 text-center inline-flex items-center bg-[#0043681A]">
                {statusArray.map((status, index) => (
                  <option
                    key={index}
                    value={status}
                    disabled={index === 0}
                    selected={index === 0}
                    className="text-base font-light">
                    {status}
                  </option>
                ))}
              </select> */}
        </div>

        <div className="">
          <select
            onClick={handleRecipientAddressChange}
            className="select w-[198px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[15px] py-2 text-center inline-flex items-center bg-[#0043681A]"
          >
            <option disabled selected>
              Recipient Address
            </option>
            {recipientAddresses.map((address, index) => (
              <option
                key={index}
                value={address}
                className="text-base font-light"
              >
                {address}
              </option>
            ))}
          </select>
        </div>

        <div className="">
          <select
            onChange={handleCreateOrderChange}
            className="select w-[198px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[15px] py-2 text-center inline-flex items-center bg-[#0043681A]"
          >
            <option disabled selected>
              Create Order
            </option>
            {recipientAddresses.map((address, index) => (
              <option
                key={index}
                value={address}
                className="text-base font-light"
              >
                {address}
              </option>
            ))}
          </select>
        </div>

        <div className="">
          <select
            onChange={handleOrderTypeChange}
            className="select w-[197px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[15px] py-2 text-center inline-flex items-center bg-[#0043681A]"
          >
            <option disabled selected>
              Order Type
            </option>
            {orderTypes.map((type, index) => (
              <option key={index} value={type} className="text-base font-light">
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="">
          <select
            onChange={handleOrderIdChange}
            className="select w-[161px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[15px] py-2 text-center inline-flex items-center bg-[#0043681A]"
          >
            <option disabled selected>
              Order ID
            </option>
            {orderIDs.map((id, index) => (
              <option key={index} value={id} className="text-base font-light">
                {id}
              </option>
            ))}
          </select>
        </div>

        <div className="">
          <select
            onChange={handleRefundStatusChange}
            className="select w-[168px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[15px] py-2 text-center inline-flex items-center bg-[#0043681A]"
          >
            <option disabled selected>
              Refund Status
            </option>
            {tikTokOrderStatusOptions.map((status, index) => (
              <option
                key={index}
                value={status?.value}
                className="text-base font-light"
              >
                {status?.status}
              </option>
            ))}
          </select>
        </div>

        {/* <div className="">
              <input
                type="date"
                id=""
                name=""
                value=""
                placeholder="Select delivery time"
                className="w-[355px] h-12 bg-[#0043681A] outline-none text-[#00000099] font-normal text-[15px] uppercase text-center rounded-md px-[15px] py-2"
              />
            </div> */}
      </div>

      <div className="flex items-center gap-2 mt-6">
        <div className="">
          <select
            onChange={handleSortByChange}
            className="select w-[396px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[15px] py-2 text-center inline-flex items-center bg-[#0043681A]"
          >
            <option disabled selected>
              Sort by: {sortOptions.join(", ")}
            </option>
            {sortOptions.map((option, index) => (
              <option
                key={index}
                value={option}
                className="text-base font-light"
              >
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="w-[225px] h-12">
          <button
            className="inputBox w-full h-full bg-[#0043681A] rounded-md px-1 flex items-center"
            onClick={() => setOpen((open) => !open)}
          >
            <MdDateRange className="w-6 h-6 mr-[3px] text-[#004368]" />
            <input
              value={`${format(startDate, "MM/dd/yyyy")} to ${format(
                endDate,
                "MM/dd/yyyy"
              )}`}
              className="h-full w-full border-none outline-none text-black text-opacity-60 font-normal text-[15px] text-center bg-transparent"
            />
          </button>
          <div className="">
            {/* <div ref={refOne} className=""> */}
            {open && (
              // <DateRangePicker
              //   className="flex justify-center calendarElement"
              //   onChange={handleSelect}
              //   editableDateInputs={true}
              //   ranges={[selectionRange]}
              //   months={1}
              //   direction="horizontal"
              //   moveRangeOnFirstSelection={false}
              //   staticRanges={[]}
              //   inputRanges={[]}
              // />

              <DateRange
                editableDateInputs={true}
                onChange={handleSelect}
                moveRangeOnFirstSelection={false}
                ranges={[selectionRange]}
                className="bg-white bg-opacity-80 z-50 absolute mt-1 rounded-md"
              />
            )}
          </div>
        </div>

        {/* w-[285px] */}
        <div className="w-[455px] h-12 outline-none rounded-md text-[#00000099] font-normal text-[15px] text-center flex justify-between items-center cursor-pointer">
          <div className="w-full h-full bg-[#0043681A] flex items-center rounded-md">
            <CiSearch className="w-[22px] h-[22px] ml-3" />
            <input
              type="text"
              placeholder="Search"
              onChange={handleSearchAllChange}
              className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-transparent outline-none"
            />
          </div>
        </div>

        <div className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[115px] h-12 px-8 py-3 rounded-md cursor-pointer">
          <button className="text-[15px] font-medium capitalize">
            {selectedLanguage === "zh-CN" ? "搜索" : "Search"}
          </button>
        </div>

        <button
          onClick={handleToReset}
          className="bg-[#0043681A] w-[115px] h-12 flex items-center justify-center px-3 py-2 rounded-md cursor-pointer hover:bg-[#004368] hover:text-white "
        >
          <RxReset className="w-5 h-5" />
          <span className="text-[15px] font-medium rounded-md capitalize pl-1">
            {selectedLanguage === "zh-CN" ? "重置" : "Reset"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default SearchComponent;
