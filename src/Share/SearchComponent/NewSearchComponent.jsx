import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import { MdDateRange } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { RxReset } from "react-icons/rx";
import {
  ShopeeOrderStatusOptions,
  tikTokOrderStatusOptions,
  lazadaOrderStatusOptions,
} from "../../Share/Data/ClientData";
import {
  filterDataByDateRange,
  filterLazadaDataByDateRange,
  filterShopeeDataByDateRange,
} from "./SearchComponentFunction";
import {
  lazadaSelectStatusChange,
  tikTokSelectStatusChange,
  shopeeSelectStatusChange,
  selectedDateRangChange,
} from "../../features/slice/userSlice";

// Constants
const STATUS_OPTIONS_MAP = {
  TikTok: tikTokOrderStatusOptions,
  Lazada: lazadaOrderStatusOptions,
  Shopee: ShopeeOrderStatusOptions,
};

const SearchButton = ({
  isActive,
  onClick,
  name,
  children,
  className = "",
}) => (
  <button
    onClick={onClick}
    name={name}
    className={`
       h-10 rounded-md outline-none font-normal text-[15px] 
      capitalize px-8 py-2 text-center items-center whitespace-nowrap
      ${isActive ? "bg-[#004368] text-white" : "bg-[#0043681A] text-black"}
      hover:${isActive ? "bg-[#004368]" : "bg-[#0043681A]"}
      cursor-pointer ${className}
    `}
  >
    {children}
  </button>
);

const NewSearchComponent = ({
  setTikTokOrderStatusCheck,
  tikTokOrderStatusCheck,
  setLazadaOrderStatusCheck,
  setShopeeOrderStatusCheck,
  lazadaOrderStatusCheck,
  shopeeOrderStatusCheck,
  setStartDate,
  setEndDate,
  startDate,
  endDate,
  handleToSearch,
  handleToReset,
  searchFields,
  setSearchFields,
  setFilteredData,
  customersData,
  currentRenderingPage,
  isActiveBtnRecipientAddress,
  setIsActiveBtnRecipientAddress,
  isActiveBtnOrderId,
  setIsActiveBtnOrderId,
  isActiveBtnAccountName,
  setIsActiveBtnAccountName,
  isActiveBtnProduct,
  setIsActiveBtnProduct,
  isActiveBtnAmount,
  setIsActiveBtnAmount,
  currentShop,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  // State
  const [activeButton, setActiveButton] = useState("");
  const [currentActiveButton, setCurrentActiveButton] = useState(false);
  const [open, setOpen] = useState(false);

  // Derived values
  const orderStatusOptions = STATUS_OPTIONS_MAP[currentShop] || [];

  const toLocalISOString = (date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, -1);
  };

  // Effects
  useEffect(() => {
    dispatch(
      selectedDateRangChange({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        searchStatus: true,
      })
    );

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  // const handleDateSelect = (date) => {
  //   console.log(date, "date...");

  //   setStartDate(date.selection.startDate);
  //   setEndDate(date.selection.endDate);

  //   if (date.selection.startDate && date.selection.endDate) {
  //     const filterFunction = getDateFilterFunction(currentShop);
  //     setFilteredData(
  //       filterFunction(
  //         customersData,
  //         date.selection.startDate,
  //         date.selection.endDate
  //       )
  //     );
  //   }
  // };

  const getDateFilterFunction = (shop) => {
    const filterMap = {
      Lazada: filterLazadaDataByDateRange,
      Shopee: filterShopeeDataByDateRange,
    };
    return filterMap[shop] || filterDataByDateRange;
  };

  const createSearchFieldHandler =
    (fieldName, setActiveState, isActiveState) => (event) => {
      const buttonName = event.target.name;
      setActiveButton(buttonName);
      setCurrentActiveButton(!isActiveState);
      setActiveState(!isActiveState);

      setSearchFields({
        ...searchFields,
        [`isActive${fieldName}`]: !isActiveState,
      });
    };

  const handleRefundStatusChange = (event) => {
    const selectedValue = event.target.value;

    const statusChangeMap = {
      TikTok: {
        setter: setTikTokOrderStatusCheck,
        action: tikTokSelectStatusChange,
      },
      Lazada: {
        setter: setLazadaOrderStatusCheck,
        action: lazadaSelectStatusChange,
      },
      Shopee: {
        setter: setShopeeOrderStatusCheck,
        action: shopeeSelectStatusChange,
      },
    };

    const shopConfig = statusChangeMap[currentShop];
    if (shopConfig) {
      shopConfig.setter(selectedValue);
      dispatch(shopConfig.action(selectedValue));
    }
  };

  const handleSearchAllChange = (event) => {
    if (currentActiveButton) {
      setSearchFields({
        ...searchFields,
        [activeButton]: event.target.value,
        [`isActive${activeButton}`]: true,
      });
    }
  };

  // Render helpers
  const renderStatusDropdown = () => {
    if (currentRenderingPage === "ManualOrderPage") {
      return (
        <button className="text-base font-light bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[220px] h-12 px-8 py-3 rounded-md cursor-pointer">
          {t("manualOrder")}
        </button>
      );
    }

    const currentStatus =
      currentShop === "TikTok"
        ? tikTokOrderStatusCheck
        : currentShop === "Lazada"
        ? lazadaOrderStatusCheck
        : currentShop === "Shopee"
        ? shopeeOrderStatusCheck
        : "";

    return (
      <select
        value={currentStatus}
        onChange={handleRefundStatusChange}
        className="select w-[220px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[15px] py-2 text-center inline-flex items-center bg-[#0043681A]"
      >
        {orderStatusOptions.map((status, index) => (
          <option
            key={index}
            value={status?.value}
            className="text-base font-light"
          >
            {t(status?.status)}
          </option>
        ))}
      </select>
    );
  };

  // const renderDatePicker = () => (
  //   <div ref={containerRef} className="w-[240px] h-12 relative">
  //     <button
  //       className="inputBox w-full h-full bg-[#0043681A] rounded-md px-1 flex items-center"
  //       onClick={() => setOpen((open) => !open)}
  //     >
  //       <MdDateRange className="w-6 h-6 mr-[3px] text-[#004368]" />
  //       <input
  //         value={`${format(startDate, "MM/dd/yyyy")} to ${format(
  //           endDate,
  //           "MM/dd/yyyy"
  //         )}`}
  //         className="h-full w-full border-none outline-none text-black text-opacity-60 font-normal text-[15px] text-center bg-transparent"
  //         readOnly
  //       />
  //     </button>
  //     {open && (
  //       <DateRange
  //         editableDateInputs={true}
  //         onChange={handleDateSelect}
  //         moveRangeOnFirstSelection={false}
  //         ranges={[{ startDate, endDate, key: "selection" }]}
  //         className="bg-white bg-opacity-80 z-50 absolute mt-1 rounded-md"
  //       />
  //     )}
  //   </div>
  // );

  const handleDateSelect = (date) => {
    console.log("Original selected dates:", date.selection);

    const getStartOfDay = (date) => {
      // Get the local date components (this accounts for timezone)
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();

      // Create a new date at start of day in LOCAL time
      return new Date(year, month, day, 0, 0, 0, 0);
    };

    const getEndOfDay = (date) => {
      // Get the local date components (this accounts for timezone)
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();

      // Create a new date at end of day in LOCAL time
      return new Date(year, month, day, 23, 59, 59, 999);
    };

    const adjustedStartDate = getStartOfDay(date.selection.startDate);
    const adjustedEndDate = getEndOfDay(date.selection.endDate);

    console.log("Adjusted dates:", { adjustedStartDate, adjustedEndDate });

    setStartDate(adjustedStartDate);
    setEndDate(adjustedEndDate);

    dispatch(
      selectedDateRangChange({
        startDate: toLocalISOString(getStartOfDay(date.selection.startDate)),
        endDate: toLocalISOString(getEndOfDay(date.selection.endDate)),
        searchStatus: true,
      })
    );

    if (date.selection.startDate && date.selection.endDate) {
      const filterFunction = getDateFilterFunction(currentShop);
      setFilteredData(
        filterFunction(customersData, adjustedStartDate, adjustedEndDate)
      );
    }
  };

  const renderDatePicker = () => {
    const [localRange, setLocalRange] = useState({
      startDate: startDate,
      endDate: endDate,
      key: "selection",
    });
    console.log({
      startDate: startDate,
      endDate: endDate,
      key: "selection",
    });

    // Use a ref to track if selection is in progress
    const isSelectingRef = useRef(false);
    // Use a ref to track the latest range
    const latestRangeRef = useRef(localRange);

    const handleChange = (ranges) => {
      const newRange = ranges.selection;
      console.log("DateRange picker selection:", newRange);
      latestRangeRef.current = newRange;
      setLocalRange(newRange);
      isSelectingRef.current = true;
    };

    const handleRangeFocusChange = (rangeFocus) => {
      // rangeFocus: [0,1] means selecting start date, [1,1] means selecting end date
      const wasSelecting = isSelectingRef.current;
      const isNowComplete = rangeFocus[0] === 0 && rangeFocus[1] === 0;

      // If we were selecting and now it's complete
      if (wasSelecting && isNowComplete) {
        // Add a small delay to ensure all state updates are processed
        setTimeout(() => {
          handleDateSelect({ selection: latestRangeRef.current });
        }, 50);
      }

      // Update selection state
      isSelectingRef.current = !isNowComplete;
    };

    // Update localRange when startDate or endDate change from outside
    useEffect(() => {
      const newRange = {
        startDate: startDate,
        endDate: endDate,
        key: "selection",
      };
      latestRangeRef.current = newRange;
      setLocalRange(newRange);
    }, [startDate, endDate]);

    return (
      <div ref={containerRef} className="w-[240px] h-12 relative">
        <button
          className="inputBox w-full h-full bg-[#0043681A] rounded-md px-1 flex items-center"
          onClick={() => setOpen((open) => !open)}
        >
          <MdDateRange className="w-6 h-6 mr-[3px] text-[#004368]" />
          <input
            value={`${format(localRange.startDate, "MM/dd/yyyy")} to ${format(
              localRange.endDate,
              "MM/dd/yyyy"
            )}`}
            className="h-full w-full border-none outline-none text-black text-opacity-60 font-normal text-[15px] text-center bg-transparent"
            readOnly
          />
        </button>
        {open && (
          <DateRange
            editableDateInputs={true}
            onChange={handleChange}
            onRangeFocusChange={handleRangeFocusChange}
            moveRangeOnFirstSelection={false}
            ranges={[localRange]}
            className="bg-white bg-opacity-80 z-50 absolute mt-1 rounded-md"
            showDateDisplay={false}
            minDate={new Date(2000, 0, 1)} // Optional: Set min date
          />
        )}
      </div>
    );
  };

  const renderSearchInput = () => (
    <div className="w-[470px] h-12 outline-none rounded-md text-[#00000099] font-normal text-[15px] text-center flex justify-between items-center cursor-pointer">
      <div className="w-full h-full bg-[#0043681A] flex items-center rounded-md">
        <CiSearch className="w-[22px] h-[22px] ml-3" />
        <input
          id="searchInput"
          type="text"
          placeholder={t("Search")}
          onChange={handleSearchAllChange}
          className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-transparent outline-none"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] py-4 pl-3 pr-2">
      <p className="text-[#004368] text-sm font-semibold mb-[6px]">
        {t("SelectCategoryForSearch")}
      </p>

      {/* Search Category Buttons */}
      <div className="flex items-center space-x-2">
        <SearchButton
          isActive={isActiveBtnRecipientAddress}
          onClick={createSearchFieldHandler(
            "RecipientAddress",
            setIsActiveBtnRecipientAddress,
            isActiveBtnRecipientAddress
          )}
          name="RecipientAddress"
        >
          {t("RecipientAddress")}
        </SearchButton>

        <SearchButton
          isActive={isActiveBtnOrderId}
          onClick={createSearchFieldHandler(
            "OrderId",
            setIsActiveBtnOrderId,
            isActiveBtnOrderId
          )}
          name="OrderId"
          className="w-[180px] px-3"
        >
          {currentRenderingPage === "ManualOrderPage"
            ? "Order ID"
            : t("OrderSn")}
        </SearchButton>

        <SearchButton
          isActive={isActiveBtnAccountName}
          onClick={createSearchFieldHandler(
            "AccountName",
            setIsActiveBtnAccountName,
            isActiveBtnAccountName
          )}
          name="AccountName"
        >
          {t("AccountName")}
        </SearchButton>

        <SearchButton
          isActive={isActiveBtnProduct}
          onClick={createSearchFieldHandler(
            "Product",
            setIsActiveBtnProduct,
            isActiveBtnProduct
          )}
          name="Product"
          className="w-[180px] px-3"
        >
          {t("Product")}
        </SearchButton>

        <SearchButton
          isActive={isActiveBtnAmount}
          onClick={createSearchFieldHandler(
            "Amount",
            setIsActiveBtnAmount,
            isActiveBtnAmount
          )}
          name="Amount"
          className="w-[180px] px-3"
        >
          {t("Amount")}
        </SearchButton>
      </div>

      {/* Search Controls */}
      <div className="flex items-center mt-5 space-x-2">
        {renderStatusDropdown()}
        {renderDatePicker()}
        {renderSearchInput()}

        <button
          onClick={handleToSearch}
          className="bg-[#004368] w-auto hover:bg-opacity-30 text-white hover:text-black h-12 px-8 py-3 rounded-md cursor-pointer text-[15px] font-medium capitalize"
        >
          {t("Search")}
        </button>

        <button
          onClick={handleToReset}
          className="bg-[#0043681A] h-12 flex items-center justify-center whitespace-nowrap px-4 w-auto py-2 rounded-md cursor-pointer hover:bg-[#004368] hover:text-white"
        >
          <RxReset className="w-5 h-5" />
          <span className="text-[15px] font-medium rounded-md capitalize pl-1">
            {t("Reset")}
          </span>
        </button>
      </div>
    </div>
  );
};

export default NewSearchComponent;
