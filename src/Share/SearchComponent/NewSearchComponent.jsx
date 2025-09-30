// import React, { useEffect, useRef, useState } from "react";
// import {
//   ShopeeOrderStatusOptions,
//   tikTokOrderStatusOptions,
// } from "../../Share/Data/ClientData";
// import { lazadaOrderStatusOptions } from "../../Share/Data/ClientData";
// import { useDispatch, useSelector } from "react-redux";
// import { MdDateRange } from "react-icons/md";
// import { format } from "date-fns";
// import { DateRange } from "react-date-range";
// import { CiSearch } from "react-icons/ci";
// import { RxReset } from "react-icons/rx";
// import {
//   filterDataByDateRange,
//   filterLazadaDataByDateRange,
//   filterShopeeDataByDateRange,
// } from "./SearchComponentFunction";
// import { useTranslation } from "react-i18next";
// import {
//   lazadaSelectStatusChange,
//   tikTokSelectStatusChange,
//   shopeeSelectStatusChange,
// } from "../../features/slice/userSlice";

// const NewSearchComponent = ({
//   setTikTokOrderStatusCheck,
//   tikTokOrderStatusCheck,
//   setLazadaOrderStatusCheck,
//   setShopeeOrderStatusCheck,
//   lazadaOrderStatusCheck,
//   shopeeOrderStatusCheck,
//   setStartDate,
//   setEndDate,
//   startDate,
//   endDate,
//   handleToSearch,
//   handleToReset,
//   searchFields,
//   setSearchFields,
//   setFilteredData,
//   customersData,
//   currentRenderingPage,
//   isActiveBtnRecipientAddress,
//   setIsActiveBtnRecipientAddress,
//   isActiveBtnOrderId,
//   setIsActiveBtnOrderId,
//   isActiveBtnAccountName,
//   setIsActiveBtnAccountName,
//   isActiveBtnProduct,
//   setIsActiveBtnProduct,
//   isActiveBtnAmount,
//   setIsActiveBtnAmount,
//   currentShop,
//   // setSelectedStatus,
// }) => {
//   const [orderSource, setOrderSource] = useState("");
//   const [pendingDelivery, setPendingDelivery] = useState("");
//   const [recipientAddress, setRecipientAddress] = useState("");
//   // const [orderType, setOrderType] = useState("");
//   const [orderId, setOrderId] = useState("");
//   const [refundStatus, setRefundStatus] = useState("");
//   const [open, setOpen] = useState(false);
//   const [accountName, setAccountName] = useState("");
//   const [product, setProduct] = useState("");
//   const [amount, setAmount] = useState("");
//   const [activeButton, setActiveButton] = useState("");
//   const [currentActiveButton, setCurrentActiveButton] = useState(false);
//   const { t } = useTranslation();
//   const dispatch = useDispatch();
//   const containerRef = useRef(null);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(event.target)
//       ) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleSelect = (date) => {
//     setStartDate(date.selection.startDate);
//     setEndDate(date.selection.endDate);
//     if (date.selection.startDate && date.selection.endDate) {
//       setFilteredData(
//         currentShop === "Lazada"
//           ? filterLazadaDataByDateRange(
//               customersData,
//               date.selection.startDate,
//               date.selection.endDate
//             )
//           : currentShop === "Shopee"
//           ? filterShopeeDataByDateRange(
//               customersData,
//               date.selection.startDate,
//               date.selection.endDate
//             )
//           : filterDataByDateRange(
//               customersData,
//               date.selection.startDate,
//               date.selection.endDate
//             )
//       );
//     }
//   };

//   const selectedLanguage = useSelector(
//     (state) => state.user.selectedLanguageRedux
//   );

//   // const [range, setRange] = useState([
//   //   {
//   //     startDate: new Date(),
//   //     endDate: addDays(new Date(), 7),
//   //     key: "selection",
//   //   },
//   // ]);
//   // const refOne = useRef([]);
//   const orderListData = useSelector((state) => state.orderList.data);

//   // individual function component change value
//   const handleOrderSourceChange = (event) => {
//     setOrderSource(event.target.value);
//   };

//   const handlePendingOrderChange = (event) => {
//     setPendingDelivery(event.target.value);
//   };

//   const handleRecipientAddressChange = (event) => {
//     setActiveButton(event.target.name);
//     setCurrentActiveButton(!isActiveBtnRecipientAddress);
//     setIsActiveBtnRecipientAddress(!isActiveBtnRecipientAddress);
//     setRecipientAddress(event.target.name);
//     if (!isActiveBtnRecipientAddress === true) {
//       setSearchFields({
//         ...searchFields,
//         isActiveRecipientAddress: true,
//       });
//     } else {
//       setSearchFields({
//         ...searchFields,
//         isActiveRecipientAddress: false,
//       });
//     }

//     // setSearchFields({ ...searchFields, recipientAddress: event.target.name })
//   };

//   const handleOrderIdChangeBySearch = (event) => {
//     setActiveButton(event.target.name);
//     setOrderId(event.target.name);
//     setIsActiveBtnOrderId(!isActiveBtnOrderId);
//     setCurrentActiveButton(!isActiveBtnOrderId);
//     if (!isActiveBtnOrderId === true) {
//       setSearchFields({
//         ...searchFields,
//         isActiveOrderId: true,
//       });
//     } else {
//       setSearchFields({
//         ...searchFields,
//         isActiveOrderId: false,
//       });
//     }
//   };

//   const handleAccountNameBySearch = (event) => {
//     setActiveButton(event.target.name);
//     setAccountName(event.target.name);
//     setIsActiveBtnAccountName(!isActiveBtnAccountName);
//     setCurrentActiveButton(!isActiveBtnAccountName);
//     if (!isActiveBtnAccountName === true) {
//       setSearchFields({
//         ...searchFields,
//         isActiveAccountName: true,
//       });
//     } else {
//       setSearchFields({
//         ...searchFields,
//         isActiveAccountName: false,
//       });
//     }
//   };

//   const handleProductBySearch = (event) => {
//     setActiveButton(event.target.name);
//     setProduct(event.target.name);
//     setIsActiveBtnProduct(!isActiveBtnProduct);
//     setCurrentActiveButton(!isActiveBtnProduct);
//     if (!isActiveBtnProduct === true) {
//       setSearchFields({
//         ...searchFields,
//         isActiveProduct: true,
//       });
//     } else {
//       setSearchFields({
//         ...searchFields,
//         isActiveProduct: false,
//       });
//     }
//   };

//   const handleAmountBySearch = (event) => {
//     setActiveButton(event.target.name);
//     setAmount(event.target.name);
//     setIsActiveBtnAmount(!isActiveBtnAmount);
//     setCurrentActiveButton(!isActiveBtnAmount);
//     if (!isActiveBtnAmount === true) {
//       setSearchFields({
//         ...searchFields,
//         isActiveAmount: true,
//       });
//     } else {
//       setSearchFields({
//         ...searchFields,
//         isActiveAmount: false,
//       });
//     }
//   };

//   const handleRefundStatusChange = (event) => {
//     const selectedValue = event.target.value;
//     const status = orderStatusOptions.find(
//       (status) => status.value === selectedValue
//     );
//     // setSelectedStatus(status?.status);
//     setRefundStatus(selectedValue);
//     if (currentShop === "TikTok") {
//       setTikTokOrderStatusCheck(selectedValue);
//       dispatch(tikTokSelectStatusChange(selectedValue));
//     } else if (currentShop === "Lazada") {
//       setLazadaOrderStatusCheck(selectedValue);
//       dispatch(lazadaSelectStatusChange(selectedValue));
//     } else if (currentShop === "Shopee") {
//       setShopeeOrderStatusCheck(selectedValue);
//       dispatch(shopeeSelectStatusChange(selectedValue));
//     }
//   };

//   const selectionRange = {
//     startDate: startDate,
//     endDate: endDate,
//     key: "selection",
//   };

//   // search all data
//   // pin dou dou
//   const handleSearchAllChange = (event) => {
//     if (currentActiveButton === true) {
//       setSearchFields({
//         ...searchFields,
//         [activeButton]: event.target.value,
//         [`isActive${activeButton}`]: true,
//       });
//     }
//   };

//   const statusOptionsMap = {
//     TikTok: tikTokOrderStatusOptions,
//     Lazada: lazadaOrderStatusOptions,
//     Shopee: ShopeeOrderStatusOptions,
//   };
//   const orderStatusOptions = statusOptionsMap[currentShop] || [];

//   // const handleSearchAllChange = (event) => {
//   //   const searchTerm = event.target.value.toLowerCase();

//   //   // Decide whether to search in full data or already filtered data
//   //   const baseData = customersData.length > 0 ? customersData : customersData;

//   //   const filtered = baseData.filter((item) => {
//   //     switch (activeButton) {
//   //       case "RecipientAddress":
//   //         return item.recipientAddress?.fullAddress
//   //           ?.toLowerCase()
//   //           .includes(searchTerm);
//   //       case "OrderId":
//   //         return item.id?.toString().toLowerCase().includes(searchTerm);
//   //       case "AccountName":
//   //         return item.buyerEmail?.toLowerCase().includes(searchTerm);
//   //       case "Product":
//   //         return (
//   //           item.lineItems?.[0]?.productName
//   //             ?.toLowerCase()
//   //             .includes(searchTerm) ||
//   //           item.lineItems?.[0]?.skuName?.toLowerCase().includes(searchTerm)
//   //         );
//   //       case "Amount":
//   //         return item.payment?.totalAmount
//   //           ?.toString()
//   //           .toLowerCase()
//   //           .includes(searchTerm);
//   //       default:
//   //         return false;
//   //     }
//   //   });

//   //   setFilteredData(filtered);
//   // };

//   return (
//     <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] py-4 pl-3 pr-2">
//       <p className="text-[#004368] text-sm font-semibold mb-[6px]">
//         {t("SelectCategoryForSearch")}
//       </p>
//       <div className="flex items-center space-x-2">
//         {/* disable button */}
//         {/* <div className=" ">
//           <select
//                 onClick={handleOrderSourceChange}
//                 disabled
//                 className=" select w-[175px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[15px] py-2 text-center bg-[#0043681A] pr-1">
//                 {selectionArray.map((option, index) => (
//                   <option
//                     key={index}
//                     value={option}
//                     disabled={index === 0}
//                     selected={index === 0}
//                     className="text-base font-light">
//                     {option}
//                   </option>
//                 ))}
//               </select>
//         </div> */}

//         {/* disable button */}
//         {/* <div className="">
//           <select
//                 onClick={handlePendingOrderChange}
//                 disabled
//                 className=" select w-[190px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[15px] py-2 text-center inline-flex items-center bg-[#0043681A]">
//                 {statusArray.map((status, index) => (
//                   <option
//                     key={index}
//                     value={status}
//                     disabled={index === 0}
//                     selected={index === 0}
//                     className="text-base font-light">
//                     {status}
//                   </option>
//                 ))}
//               </select>
//         </div> */}

//         {/* <div className="">
//           <button
//             onClick={handleCreateOrderChange}
//             className="w-[150px] h-10 rounded-md outline-none font-normal text-[15px] capitalize px-3 py-2 text-center items-center bg-[#0043681A] hover:bg-[#004368] text-black hover:text-white cursor-pointer"
//           >
//             Create Order
//           </button>
//         </div> */}

//         {/* <div className="">
//           <button
//             onClick={handleOrderTypeChangeBySearch}
//             className="w-[140px] h-10 rounded-md outline-none font-normal text-[15px] capitalize px-3 py-2 text-center items-center bg-[#0043681A] hover:bg-[#004368] text-black hover:text-white cursor-pointer"
//           >
//             Order Type
//           </button>
//         </div> */}

//         <div className="">
//           <button
//             onClick={handleRecipientAddressChange}
//             className={`w-auto h-10 rounded-md outline-none font-normal text-[15px] capitalize px-8 py-2 text-center items-center whitespace-nowrap ${
//               isActiveBtnRecipientAddress ? "bg-[#004368]" : "bg-[#0043681A]"
//             } text-${
//               isActiveBtnRecipientAddress ? "white" : "black"
//             } cursor-pointer ${
//               isActiveBtnRecipientAddress
//                 ? "hover:bg-[#004368]"
//                 : "hover:bg-[#0043681A]"
//             }`}
//             name="RecipientAddress"
//           >
//             {t("RecipientAddress")}
//           </button>
//         </div>

//         <div className="">
//           <button
//             onClick={handleOrderIdChangeBySearch}
//             className={`w-[180px] h-10 rounded-md outline-none font-normal text-[15px] capitalize px-3 py-2 text-center items-center ${
//               isActiveBtnOrderId ? "bg-[#004368]" : "bg-[#0043681A]"
//             } text-${isActiveBtnOrderId ? "white" : "black"} cursor-pointer ${
//               isActiveBtnOrderId ? "hover:bg-[#004368]" : "hover:bg-[#0043681A]"
//             }`}
//             name="OrderId"
//           >
//             {currentRenderingPage === "ManualOrderPage"
//               ? "Order ID"
//               : t("OrderSn")}
//           </button>
//         </div>

//         <div className="">
//           <button
//             onClick={handleAccountNameBySearch}
//             className={`w-auto h-10 rounded-md outline-none font-normal text-[15px] capitalize px-8 whitespace-nowrap py-2 text-center items-center ${
//               isActiveBtnAccountName ? "bg-[#004368]" : "bg-[#0043681A]"
//             } text-${
//               isActiveBtnAccountName ? "white" : "black"
//             } cursor-pointer ${
//               isActiveBtnAccountName
//                 ? "hover:bg-[#004368]"
//                 : "hover:bg-[#0043681A]"
//             }`}
//             name="AccountName"
//           >
//             {t("AccountName")}
//           </button>
//         </div>

//         <div className="">
//           <button
//             onClick={handleProductBySearch}
//             className={`w-[180px] h-10 rounded-md outline-none font-normal text-[15px] capitalize px-3 py-2 text-center items-center ${
//               isActiveBtnProduct ? "bg-[#004368]" : "bg-[#0043681A]"
//             } text-${isActiveBtnProduct ? "white" : "black"} cursor-pointer ${
//               isActiveBtnProduct ? "hover:bg-[#004368]" : "hover:bg-[#0043681A]"
//             }`}
//             name="Product"
//           >
//             {t("Product")}
//           </button>
//         </div>

//         <div className="">
//           <button
//             onClick={handleAmountBySearch}
//             className={`w-[180px] h-10 rounded-md outline-none font-normal text-[15px] capitalize px-3 py-2 text-center items-center ${
//               isActiveBtnAmount ? "bg-[#004368]" : "bg-[#0043681A]"
//             } text-${isActiveBtnAmount ? "white" : "black"} cursor-pointer ${
//               isActiveBtnAmount ? "hover:bg-[#004368]" : "hover:bg-[#0043681A]"
//             }`}
//             name="Amount"
//           >
//             {t("Amount")}
//           </button>
//         </div>
//       </div>

//       <div className="flex items-center mt-5 space-x-2">
//         {/* Refund status check */}
//         <div className="">
//           {currentRenderingPage === "ManualOrderPage" ? (
//             <button
//               value={"manualOrder"}
//               className="text-base font-light bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[220px] h-12 px-8 py-3 rounded-md cursor-pointer"
//             >
//               {t("manualOrder")}
//             </button>
//           ) : (
//             <select
//               value={
//                 currentShop === "TikTok"
//                   ? tikTokOrderStatusCheck
//                   : currentShop === "Lazada"
//                   ? lazadaOrderStatusCheck
//                   : currentShop === "Shopee"
//                   ? shopeeOrderStatusCheck
//                   : ""
//               }
//               // <-- This ensures correct default
//               onChange={handleRefundStatusChange}
//               className="select w-[220px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[15px] py-2 text-center inline-flex items-center bg-[#0043681A]"
//             >
//               {orderStatusOptions.map((status, index) => (
//                 <option
//                   key={index}
//                   value={status?.value}
//                   className="text-base font-light"
//                 >
//                   {t(status?.status)}
//                 </option>
//               ))}
//             </select>
//           )}
//         </div>

//         {/* Date Range */}
//         <div ref={containerRef} className="w-[240px] h-12 relative">
//           <button
//             className="inputBox w-full h-full bg-[#0043681A] rounded-md px-1 flex items-center"
//             onClick={() => setOpen((open) => !open)}
//           >
//             <MdDateRange className="w-6 h-6 mr-[3px] text-[#004368]" />
//             <input
//               value={`${format(startDate, "MM/dd/yyyy")} to ${format(
//                 endDate,
//                 "MM/dd/yyyy"
//               )}`}
//               className="h-full w-full border-none outline-none text-black text-opacity-60 font-normal text-[15px] text-center bg-transparent"
//               readOnly
//             />
//           </button>
//           {open && (
//             <DateRange
//               editableDateInputs={true}
//               onChange={handleSelect}
//               moveRangeOnFirstSelection={false}
//               ranges={[selectionRange]}
//               className="bg-white bg-opacity-80 z-50 absolute mt-1 rounded-md"
//             />
//           )}
//         </div>

//         <div className="w-[470px] h-12 outline-none rounded-md text-[#00000099] font-normal text-[15px] text-center flex justify-between items-center cursor-pointer">
//           <div className="w-full h-full bg-[#0043681A] flex items-center rounded-md">
//             <CiSearch className="w-[22px] h-[22px] ml-3" />
//             <input
//               id="searchInput"
//               type="text"
//               placeholder={t("Search")}
//               onChange={handleSearchAllChange}
//               className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-transparent outline-none"
//             />
//           </div>
//         </div>

//         <button
//           onClick={handleToSearch}
//           className="bg-[#004368] w-auto hover:bg-opacity-30 text-white hover:text-black  h-12 px-8 py-3 rounded-md cursor-pointer text-[15px] font-medium capitalize"
//         >
//           {t("Search")}
//         </button>

//         <button
//           onClick={handleToReset}
//           className="bg-[#0043681A]  h-12 flex items-center justify-center whitespace-nowrap px-4 w-auto  py-2 rounded-md cursor-pointer hover:bg-[#004368] hover:text-white "
//         >
//           <RxReset className="w-5 h-5" />
//           <span className="text-[15px] font-medium rounded-md capitalize pl-1 ">
//             {t("Reset")}
//           </span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default NewSearchComponent;

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

  // Effects
  useEffect(() => {
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
  const handleDateSelect = (date) => {
    console.log(date, "date...");

    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);

    if (date.selection.startDate && date.selection.endDate) {
      const filterFunction = getDateFilterFunction(currentShop);
      setFilteredData(
        filterFunction(
          customersData,
          date.selection.startDate,
          date.selection.endDate
        )
      );
    }
  };

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

  const renderDatePicker = () => (
    <div ref={containerRef} className="w-[240px] h-12 relative">
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
          readOnly
        />
      </button>
      {open && (
        <DateRange
          editableDateInputs={true}
          onChange={handleDateSelect}
          moveRangeOnFirstSelection={false}
          ranges={[{ startDate, endDate, key: "selection" }]}
          className="bg-white bg-opacity-80 z-50 absolute mt-1 rounded-md"
        />
      )}
    </div>
  );

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
