// import React, { useEffect, useState } from "react";
// import { MdOutlineLocalPrintshop } from "react-icons/md";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import { checkedItemsChange } from "../../features/slice/userSlice";
// import * as XLSX from "xlsx";
// import NewSearchComponent from "../../Share/SearchComponent/NewSearchComponent";
// import { filterShopeeDataBySearchFields } from "../../Share/SearchComponent/SearchComponentFunction";
// import toast from "react-hot-toast";
// import { orderListData } from "../../features/slice/orderListSlice";
// import ConfirmationModal from "../../Share/ConfirmationModal";
// import { TiInfoOutline } from "react-icons/ti";
// import { AiOutlineCheckCircle } from "react-icons/ai";
// import { useTranslation } from "react-i18next";
// import ShopeeBatchPrintTable from "./ShopeeBatchPrintTable";
// import { useLazyGetLazadaOrdersQuery } from "../../features/allApis/lazadaApi";
// import axios from "axios";
// import {
//   useLazyGetShopeeOrderDetailsQuery,
//   useLazyGetShopeeOrdersQuery,
// } from "../../features/allApis/shopeeApi";
// import { shopeeArrayToExcel } from "../../Share/Function/FunctionalComponent";
// import { ShopeeOrderStatusOptions } from "../../Share/Data/ClientData";

// const ShopeeBatchPrint = () => {
//   const [selectAll, setSelectAll] = useState(false);
//   const [detailsLoading, setDetailsLoading] = useState(false);
//   const [shopeeLoading, setShopeeLoading] = useState(false);
//   const [checkedItems, setCheckedItems] = useState([]);
//   const orderListDataGet = useSelector((state) => state.orderList.data);
//   const [totalOrderData, setTotalOrderData] = useState(orderListDataGet);
//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(new Date());
//   const [packageLoading, setPackageLoading] = useState(false);

//   const selectedShopeeOrderStatus = useSelector(
//     (state) => state.user.shopeeSelectStatus
//   );

//   // Pick the default READY_TO_SHIP option once
//   const defaultOption = ShopeeOrderStatusOptions.find(
//     (opt) => opt.value === "READY_TO_SHIP"
//   );

//   const [shopeeOrderStatusCheck, setShopeeOrderStatusCheck] = useState(
//     selectedShopeeOrderStatus || defaultOption?.value || ""
//   );

//   const [selectedStatus, setSelectedStatus] = useState(() => {
//     const matchedOption = ShopeeOrderStatusOptions.find(
//       (opt) => opt.value === selectedShopeeOrderStatus
//     );
//     return matchedOption?.status || defaultOption?.status || "";
//   });

//   const [searchFields, setSearchFields] = useState({
//     RecipientAddress: "",
//     isActiveRecipientAddress: "",
//     OrderId: "",
//     isActiveOrderId: "",
//     AccountName: "",
//     isActiveAccountName: "",
//     Amount: "",
//     isActiveAmount: "",
//     Product: "",
//     isActiveProduct: "",
//     startDate,
//     endDate,
//   });
//   const [isActiveBtnRecipientAddress, setIsActiveBtnRecipientAddress] =
//     useState(false);
//   const [isActiveBtnOrderId, setIsActiveBtnOrderId] = useState(false);
//   const [isActiveBtnAccountName, setIsActiveBtnAccountName] = useState(false);
//   const [isActiveBtnProduct, setIsActiveBtnProduct] = useState(false);
//   const [isActiveBtnAmount, setIsActiveBtnAmount] = useState(false);
//   const [lazadaPrintedIds, setLazadaPrintedIds] = useState([]);
//   const [cardStatus, setCardStatus] = useState(false);
//   const [cipher, setCipher] = useState(() => {
//     const stored = localStorage.getItem("tiktokShopInfo");
//     return stored ? JSON.parse(stored) : [];
//   });
//   const { t } = useTranslation();

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   //Data post request send and return data get
//   // const [loadOrderList, { isLoading, isError }] = useLazyGetLazadaOrdersQuery();
//   const [getShopeeOrders, { isLoading, isError }] =
//     useLazyGetShopeeOrdersQuery();

//   const selectedLanguage = useSelector(
//     (state) => state.user.selectedLanguageRedux
//   );

//   const handleToReset = () => {
//     setFilteredData(customersData?.slice(0, 5));
//     setSearchFields({
//       RecipientAddress: "",
//       isActiveRecipientAddress: "",
//       OrderId: "",
//       isActiveOrderId: "",
//       AccountName: "",
//       isActiveAccountName: "",
//       Amount: "",
//       isActiveAmount: "",
//       Product: "",
//       isActiveProduct: "",
//       startDate: new Date(),
//       endDate: new Date(),
//     });
//     setStartDate(new Date());
//     setEndDate(new Date());
//     setIsActiveBtnRecipientAddress(false);
//     setIsActiveBtnOrderId(false);
//     setIsActiveBtnAccountName(false);
//     setIsActiveBtnProduct(false);
//     setIsActiveBtnAmount(false);
//   };

//   // Function to handle the master checkbox change

//   const handleMasterCheckboxChange = () => {
//     setSelectAll(!selectAll);
//     if (!selectAll) {
//       // setCheckedItems(totalOrderData);
//       setCheckedItems(currentCustomerData);
//     } else {
//       setCheckedItems([]);
//     }
//   };

//   // Function to handle individual checkbox change
//   const handleCheckboxChange = (order) => {
//     if (checkedItems.some((item) => item?.order_sn === order?.order_sn)) {
//       // If the order id is already in the checkedItems, remove it
//       const updatedItems = checkedItems.filter(
//         (item) => item?.order_sn !== order?.order_sn
//       );
//       setCheckedItems(updatedItems);
//       setSelectAll(false);
//     } else {
//       // If the order id is not in the checkedItems, add it
//       const updatedItems = [...checkedItems, order];
//       setCheckedItems(updatedItems);
//       if (updatedItems.length === totalOrderData?.length) {
//         setSelectAll(true);
//       }
//     }
//   };

//   const data = totalOrderData;
//   const [showPage, setShowPage] = useState(1);
//   const [currentBar, setCurrentBar] = useState(1);
//   const [currentCustomerData, setCurrentCustomerData] = useState([]);
//   const calculateTotalPart = () => {
//     return Math.ceil(data?.length / 5);
//   };
//   const [totalPart, setTotalPart] = useState(calculateTotalPart());
//   const [customersData, setCustomersData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [leftPaginationBtn, setLeftPaginationBtn] = useState(false);
//   const [rightPaginationBtn, setRightPaginationBtn] = useState(true);
//   const [selectedShopeeDeliveryType, setSelectedShopeeDeliveryType] =
//     useState("");

//   useEffect(() => {
//     const savedType = localStorage.getItem("shopeeDeliveryType");
//     if (savedType) {
//       setSelectedShopeeDeliveryType(savedType);
//     }
//   }, []);

//   const location = useLocation();

//   useEffect(() => {
//     // Split path into parts
//     const parts = location.pathname.split("/");
//     // e.g. ["", "printed", "LazadaOrderManagement"]

//     if (parts.length === 3) {
//       console.log("Second part:", parts[1]); // LazadaOrderManagement
//       setCardStatus(true);
//       if (parts[1] === "printed") {
//         setShopeeOrderStatusCheck("PROCESSED_PRINTED");
//         setSelectedStatus("Processed_Printed");
//       } else if (parts[1] === "shipped") {
//         setShopeeOrderStatusCheck("SHIPPED");
//         setSelectedStatus("On The Way");
//       } else if (parts[1] === "needPrint") {
//         setShopeeOrderStatusCheck("PROCESSED");
//         setSelectedStatus("Processed");
//       }
//     }
//   }, [location]);

//   useEffect(() => {
//     let isMounted = true;
//     dispatch(checkedItemsChange({ items: [], from: shopeeOrderStatusCheck }));
//     setCheckedItems([]);
//     setSelectAll(false);

//     const fetchShopeeOrdersWithDetails = async () => {
//       try {
//         setShopeeLoading(true);
//         const now = Math.floor(Date.now() / 1000);
//         const sevenDaysAgo = now - 7 * 24 * 60 * 60;

//         // ✅ Step 1: Get main order list
//         const orderListResponse = await getShopeeOrders({
//           timeFrom: sevenDaysAgo,
//           timeTo: now,
//           orderStatus:
//             selectedShopeeOrderStatus === "PROCESSED_PRINTED"
//               ? "PROCESSED"
//               : selectedShopeeOrderStatus || "READY_TO_SHIP",
//         }).unwrap();

//         const orderList = orderListResponse?.response?.order_list || [];
//         if (orderList.length === 0) {
//           if (isMounted) {
//             dispatch(orderListData([]));
//             setTotalOrderData([]);
//           }
//           return;
//         }

//         // ✅ Step 2: Extract order_sn list

//         const orderSnList = orderList.map((order) => order.order_sn);
//         console.log(orderSnList, "detailsID");
//         // ✅ Step 3: Get detailed info (already has tracking_number merged in)
//         const detailsResponse = await getShopeeOrderDetails({
//           orderSnList,
//           request_order_status_pending: true,
//           response_optional_fields: "total_amount,recipient_address,item_list",
//         }).unwrap();

//         const detailedOrders = detailsResponse || []; // 👈 already array of objects
//         console.log(detailedOrders, "details");

//         // ✅ Step 4: Merge base order + detailed info
//         let mergedOrders = orderList.map((order) => {
//           const details = detailedOrders.find(
//             (d) => d.order_sn === order.order_sn
//           );
//           return {
//             ...order,
//             ...details, // includes tracking_number
//           };
//         });

//         console.log("orderdetails response", mergedOrders);

//         // ✅ Step 5: Fetch printed IDs from external API
//         let printedIds = [];
//         try {
//           const res = await fetch(
//             "https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/shopee/printedIds"
//           );
//           printedIds = await res.json();
//         } catch (err) {
//           console.error("❌ Error fetching printedIds:", err);
//         }

//         const shopeePrintedIds = printedIds.map((p) => p.shopeePrintedId);

//         // ✅ Step 6: Filter based on status
//         if (selectedShopeeOrderStatus === "PROCESSED_PRINTED") {
//           mergedOrders = mergedOrders.filter((order) =>
//             shopeePrintedIds.includes(order.order_sn)
//           );
//         } else if (selectedShopeeOrderStatus === "PROCESSED") {
//           const stored =
//             JSON.parse(localStorage.getItem("ShopeePackaging")) || [];

//           mergedOrders = mergedOrders.filter((order) => {
//             const isPrinted = shopeePrintedIds.includes(order.order_sn);
//             const inStorage = stored.includes(order.order_sn);

//             // 🔹 If in storage, remove it
//             if (inStorage) {
//               const updatedStorage = stored.filter(
//                 (id) => id !== order.order_sn
//               );
//               localStorage.setItem(
//                 "ShopeePackaging",
//                 JSON.stringify(updatedStorage)
//               );
//             }

//             return !isPrinted; // keep only orders not in printed list
//           });
//         } else if (selectedShopeeOrderStatus === "READY_TO_SHIP") {
//           const storeOrderId = localStorage.getItem("ShopeePackaging");
//           mergedOrders = mergedOrders.filter(
//             (order) => !storeOrderId.includes(order.order_sn)
//           );
//         }

//         // ✅ Step 7: Save final result
//         if (isMounted) {
//           dispatch(orderListData(mergedOrders));
//           setTotalOrderData(mergedOrders);
//         }
//       } catch (error) {
//         console.error("❌ Shopee Order Fetch Error:", error);
//       } finally {
//         if (isMounted) setShopeeLoading(false);
//       }
//     };

//     if (shopeeOrderStatusCheck) {
//       fetchShopeeOrdersWithDetails();
//     }

//     return () => {
//       isMounted = false;
//     };
//   }, [shopeeOrderStatusCheck, selectedShopeeOrderStatus, dispatch]);

//   // ✅ Use correct hooks
//   const [getShopeeOrderDetails] = useLazyGetShopeeOrderDetailsQuery();

//   // const fetchShopeeOrdersWithDetails = async () => {
//   //   try {
//   //     // ✅ Step 1: Get order list
//   //     const orderListResponse = await getShopeeOrders({
//   //       timeFrom: 1755885600,
//   //       timeTo: 1756663199,
//   //       orderStatus: "READY_TO_SHIP",
//   //     }).unwrap();

//   //     const orderList = orderListResponse?.response?.order_list || [];

//   //     if (orderList.length === 0) {
//   //       console.log("No orders found");
//   //       return [];
//   //     }

//   //     // ✅ Step 2: Extract order_sn list
//   //     const orderSnList = orderList.map((order) => order.order_sn);

//   //     // ✅ Step 3: Get detailed info
//   //     const detailsResponse = await getShopeeOrderDetails({
//   //       orderSnList,
//   //       request_order_status_pending: true,
//   //       response_optional_fields: "total_amount",
//   //     }).unwrap();
//   //     const detailedOrders = detailsResponse?.response?.order_list || [];
//   //     return detailedOrders;
//   //   } catch (err) {
//   //     console.error("Error fetching Shopee orders:", err);
//   //     return [];
//   //   }
//   // };

//   useEffect(() => {
//     const firstPageData = data?.slice(0, 5);
//     setTotalPart(Math.ceil(data?.length / 5));
//     setCustomersData(data);
//     setFilteredData(firstPageData);
//     setCurrentCustomerData(firstPageData);
//     setCurrentBar(1);
//     // fetchShopeeOrdersWithDetails();
//   }, [shopeeOrderStatusCheck, totalOrderData, shopeeOrderStatusCheck]);

//   useEffect(() => {
//     if (totalPart <= 1) {
//       setLeftPaginationBtn(false);
//       setRightPaginationBtn(false);
//     } else {
//       setLeftPaginationBtn(false);
//       setRightPaginationBtn(true);
//     }
//     setCurrentCustomerData(customersData?.slice(0, 5));
//     setTotalPart(Math.ceil(customersData?.length / 5));
//   }, [customersData]);

//   useEffect(() => {
//     setFilteredData(customersData?.slice(0, 5));
//   }, [customersData]);

//   // 5 data show in table function
//   const handleToShowCurrentBarData = (count) => {
//     if (count <= totalPart) {
//       const data = totalOrderData;
//       const currentData = count * 5;
//       setFilteredData(data?.slice(currentData - 5, currentData));
//       setCurrentBar(count);
//     }
//   };

//   const handleToNext = (count) => {
//     if (count <= totalPart) {
//       const currentDataIndex = count * 5;
//       const nextPageData = data.slice(currentDataIndex - 5, currentDataIndex);
//       setFilteredData(nextPageData);
//       setCurrentBar(count);
//       setLeftPaginationBtn(count > 1);
//       setRightPaginationBtn(count < totalPart);
//     }
//   };
//   // pagination prev option
//   const handleToPrevious = (count) => {
//     if (count > 0) {
//       if (count === 1) {
//         setLeftPaginationBtn(false);
//       } else {
//         setLeftPaginationBtn(true);
//       }

//       if (count < totalPart) {
//         setRightPaginationBtn(true);
//       } else {
//         setRightPaginationBtn(false);
//       }

//       const currentDataIndex = count * 5;
//       setFilteredData(data.slice(currentDataIndex - 5, currentDataIndex));
//       setCurrentBar(count);
//     } else {
//       setLeftPaginationBtn(false);
//     }
//   };

//   // details modal functionality
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleDetailsClick = async (orderData) => {
//     try {
//       setSelectedCustomer(orderData);
//       setIsModalOpen(true);
//       setDetailsLoading(false);
//     } catch (error) {
//       setDetailsLoading(false);
//       console.error("Error fetching order item details:", error.message);
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   //make array to excel

//   const handleShopeePrinterExcelClick = () => {
//     shopeeArrayToExcel(checkedItems, "ShopeePrinterOrderList");
//   };

//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//   const [modalTitle, setModalTitle] = useState("");
//   const [modalMessage, setModalMessage] = useState("");
//   const [confirmAction, setConfirmAction] = useState(null);
//   const [showConfirmButton, setShowConfirmButton] = useState(false);

//   // modal show function
//   const handleToCheckItemsPackageUpdate = () => {
//     if (checkedItems.length === 0) {
//       setModalTitle(
//         <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
//           <TiInfoOutline className="w-10 h-10 text-red-600" />
//         </div>
//       );
//       setModalMessage(<p>{t("NoItemsSelected")}</p>);
//       setConfirmAction(null);
//       setShowConfirmButton(false);
//       setIsConfirmModalOpen(true);
//     } else {
//       setModalTitle(
//         <div className="bg-green-200 w-16 h-16 rounded-full flex items-center justify-center">
//           <AiOutlineCheckCircle className="w-10 h-10 text-green-600" />
//         </div>
//       );
//       setModalMessage(
//         <p className="text-xl font-semibold">
//           {t("AreYouSureYouHaveCompletedPackagingThisOrder")}
//         </p>
//       );
//       setConfirmAction(() => handleConfirmPackage);
//       setShowConfirmButton(true);
//       setIsConfirmModalOpen(true);
//     }
//   };

//   const handleToCheckItemsShippingUpdate = () => {
//     if (checkedItems.length === 0) {
//       setModalTitle(
//         <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
//           <TiInfoOutline className="w-10 h-10 text-red-600" />
//         </div>
//       );
//       setModalMessage(<p>{t("NoItemsSelected")}</p>);
//       setConfirmAction(null);
//       setShowConfirmButton(false);
//       setIsConfirmModalOpen(true);
//     } else {
//       setModalTitle(
//         <div className="bg-green-200 w-16 h-16 rounded-full flex items-center justify-center">
//           <AiOutlineCheckCircle className="w-10 h-10 text-green-600" />
//         </div>
//       );
//       setModalMessage(
//         <p className="text-xl font-semibold">
//           {shopeeOrderStatusCheck === "PROCESSED"
//             ? t("AreYouSureToPrintForReadyToShip")
//             : t("DoYouWantPrintAWBAgain")}
//         </p>
//       );
//       setConfirmAction(() => handleConfirmShipping);
//       setShowConfirmButton(true);
//       setIsConfirmModalOpen(true);
//     }
//   };

//   const createPackage = async () => {
//     const packageId = checkedItems[0]?.lineItems[0]?.packageId;
//     const cipherValue = cipher[0]?.cipher;

//     try {
//       const url = `https://grozziie.zjweiting.com:3091/tiktokshop-partner/api/dev/package/ship-package?cipher=${encodeURIComponent(
//         cipherValue
//       )}&packageId=${encodeURIComponent(packageId)}`;

//       const res = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await res.json();
//       console.log("📦 Single Package creation result:", result);
//       return result;
//     } catch (error) {
//       console.error("🚨 Error creating package:", error);
//       throw error;
//     }
//   };

//   const handleConfirmShipping = async () => {
//     dispatch(
//       checkedItemsChange({ items: checkedItems, from: shopeeOrderStatusCheck })
//     );

//     navigate("/shopeeAWBPrinting");
//   };

//   const handleConfirmPackage = async () => {
//     const successfulIds = [];
//     const failedOrders = [];
//     setPackageLoading(true);
//     try {
//       // ✅ Step 2: Loop through orders
//       for (const item of checkedItems) {
//         const orderSn = item?.order_sn || item?.orderId;
//         if (!orderSn) continue;

//         try {
//           // 1️⃣ Get shipping parameters
//           const shippingParamRes = await fetch(
//             `https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/logistics/get-shipping-parameter?orderSn=${orderSn}`
//           );
//           const shippingParamData = await shippingParamRes.json();

//           if (shippingParamData?.body?.error) {
//             failedOrders.push({
//               orderId: orderSn,
//               reason:
//                 shippingParamData?.body?.message ||
//                 shippingParamData?.body?.error,
//             });
//             continue;
//           }

//           const addressId =
//             shippingParamData?.body?.response?.pickup?.address_list?.[0]
//               ?.address_id || null;
//           const dropoff = shippingParamData?.body?.response?.dropoff;
//           console.log(dropoff, "dropoff");

//           // 2️⃣ Build request body dynamically
//           let requestBody = {
//             order_sn: orderSn,
//             package_number: "",
//           };

//           if (selectedShopeeDeliveryType === "pickup") {
//             if (!addressId) {
//               failedOrders.push({
//                 orderId: orderSn,
//                 reason: "Missing address_id",
//               });
//               continue;
//             }
//             requestBody = {
//               order_sn: orderSn,
//               package_number: "",
//               pickup: {
//                 address_id: addressId, // 👈 dynamically set from API
//                 pickup_time_id: "",
//                 tracking_number: "",
//               },
//             };
//           } else if (selectedShopeeDeliveryType === "dropoff") {
//             requestBody = {
//               order_sn: orderSn,
//               package_number: "",
//               dropoff: dropoff,
//             }; // add branch_id / slug if API returns them
//           } else {
//             if (!addressId) {
//               failedOrders.push({
//                 orderId: orderSn,
//                 reason: "Missing address_id",
//               });
//               continue;
//             }
//             requestBody = {
//               order_sn: orderSn,
//               package_number: "",
//               pickup: {
//                 address_id: addressId, // 👈 dynamically set from API
//                 pickup_time_id: "",
//                 tracking_number: "",
//               },
//             };
//           }

//           // 3️⃣ Call ship-order API
//           const shipRes = await fetch(
//             "https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/logistics/ship-order",
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(requestBody),
//             }
//           );

//           const shipData = await shipRes.json();
//           console.log(requestBody, shipData, "shipData");

//           if (!shipData?.body?.error) {
//             console.log(`✅ Shipped order ${orderSn}`, shipData);
//             successfulIds.push(orderSn);

//             // 🔹 Save into localStorage (ShopeePackaging)
//             const stored =
//               JSON.parse(localStorage.getItem("ShopeePackaging")) || [];
//             if (!stored.includes(orderSn)) {
//               localStorage.setItem(
//                 "ShopeePackaging",
//                 JSON.stringify([...stored, orderSn])
//               );
//             }
//           } else {
//             console.warn(
//               `❌ Failed to ship ${orderSn}`,
//               shipData?.body?.message || shipData?.body?.error
//             );
//             failedOrders.push({
//               orderId: orderSn,
//               reason:
//                 shipData?.body?.message ||
//                 shipData?.body?.error ||
//                 "Unknown error",
//             });
//           }
//         } catch (err) {
//           console.error(`🚨 Error shipping order ${orderSn}`, err);
//           failedOrders.push({
//             orderId: orderSn,
//             reason: "API request failed",
//           });
//         }
//       }

//       // ✅ Step 3: Update list (remove successful orders)
//       const restOfOrders = filteredData.filter(
//         (item) => !successfulIds.includes(item?.order_sn || item?.orderId)
//       );
//       setFilteredData(restOfOrders.slice(0, 5));

//       dispatch(checkedItemsChange({ items: [], from: shopeeOrderStatusCheck }));
//       setCheckedItems([]);
//       setSelectAll(false);
//       setIsConfirmModalOpen(false);

//       // ✅ Show result modal if failures
//       if (failedOrders.length > 0) {
//         setPackageLoading(false);
//         setModalTitle(
//           <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
//             <TiInfoOutline className="w-10 h-10 text-red-600" />
//           </div>
//         );
//         setModalMessage(
//           <div>
//             <p className="text-red-600 flex justify-center font-semibold mb-2">
//               ⚠️ {failedOrders.length} orders failed to ship
//             </p>
//             <ul className="list-disc pl-5 text-sm text-gray-700 max-h-60 overflow-y-auto">
//               {failedOrders.map((f, index) => (
//                 <li key={index}>
//                   <strong>{f.orderId}:</strong> {f.reason}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         );
//         setConfirmAction(null);
//         setShowConfirmButton(false);
//         setIsConfirmModalOpen(true);
//       } else {
//         console.log("✅ All selected orders shipped successfully!");
//         toast.success("✅ All selected orders shipped successfully!");
//       }
//     } catch (error) {
//       console.error("🚨 Error in handleConfirmPackage:", error);
//       toast.error("Unexpected error occurred. Please try again.", {
//         autoClose: false,
//         position: "top-right",
//       });
//     } finally {
//       setPackageLoading(false); // always stop loader
//     }
//   };

//   const handleFileChange = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();

//     reader.onload = async (event) => {
//       try {
//         const data = new Uint8Array(event.target.result);
//         const workbook = XLSX.read(data, { type: "array" });

//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];
//         const rawJson = XLSX.utils.sheet_to_json(sheet);

//         const importedData = rawJson.map((row) => {
//           return {
//             // Core order fields
//             order_sn: row.orderSn || row.order_sn,
//             order_status: row.orderStatus || row.order_status,
//             create_time: row.createTime
//               ? Math.floor(new Date(row.createTime).getTime() / 1000)
//               : row.create_time,
//             update_time: row.updateTime
//               ? Math.floor(new Date(row.updateTime).getTime() / 1000)
//               : row.update_time,
//             ship_by_date: row.shipByDate
//               ? Math.floor(new Date(row.shipByDate).getTime() / 1000)
//               : row.ship_by_date,
//             total_amount: row.totalAmount || row.total_amount,

//             // Buyer info
//             buyer_username: row.buyerUsername || row.buyer_username,
//             note: row.note || "",

//             // Recipient / Shipping Address
//             recipient_address: {
//               name: row.recipientName || "",
//               phone: row.recipientPhone || "",
//               full_address: row.recipientFullAddress || "",
//               city: row.recipientCity || "",
//               state: row.recipientState || "",
//               district: row.recipientDistrict || "",
//               zipcode: row.recipientZipcode || "",
//               country: row.recipientCountry || "",
//             },

//             // Items (basic — can be expanded if multiple items exist per row)
//             item_list: [
//               {
//                 item_id: row.firstItemId,
//                 item_name: row.firstItemName,
//                 model_name: row.firstItemModel,
//                 model_quantity_purchased: row.firstItemQty,
//                 model_original_price: row.firstItemOriginalPrice,
//                 model_discounted_price: row.firstItemDiscountedPrice,
//               },
//             ],
//           };
//         });

//         // Merge with existing Shopee data depending on status
//         if (shopeeOrderStatusCheck === "READY_TO_SHIP") {
//           const merged = [...importedData, ...customersData];
//           setCustomersData(merged);
//           dispatch(orderListData(merged));
//           setTotalPart(Math.ceil(merged.length / 5));
//           toast.success(
//             "Import file stored as Shopee Ready To Ship data successfully"
//           );
//         } else if (shopeeOrderStatusCheck === "SHIPPED") {
//           const merged = [...importedData, ...customersData];
//           setCustomersData(merged);
//           dispatch(orderListData(merged));
//           setTotalPart(Math.ceil(merged.length / 5));
//           toast.success(
//             "Import file stored as Shopee Shipped data successfully"
//           );
//         } else if (shopeeOrderStatusCheck === "CANCELLED") {
//           const merged = [...importedData, ...customersData];
//           setCustomersData(merged);
//           dispatch(orderListData(merged));
//           setTotalPart(Math.ceil(merged.length / 5));
//           toast.success(
//             "Import file stored as Shopee Cancelled data successfully"
//           );
//         } else {
//           // fallback
//           const merged = [...importedData, ...customersData];
//           setCustomersData(merged);
//           dispatch(orderListData(merged));
//           setTotalPart(Math.ceil(merged.length / 5));
//           toast.success("Shopee Import file stored successfully");
//         }
//       } catch (err) {
//         console.error("❌ Failed to import Shopee Excel file:", err);
//         toast.error("Failed to process Shopee Excel file");
//       }
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   const handleImportOrderClick = () => {
//     // Trigger the hidden file input
//     const fileInput = document.getElementById("fileInput");
//     fileInput.click();
//   };

//   const handleToSearch = () => {
//     document.getElementById("searchInput").value = "";
//     // Usage:
//     const filteredMultipleSearchingData = filterShopeeDataBySearchFields(
//       customersData,
//       searchFields
//     );
//     setFilteredData(filteredMultipleSearchingData);
//   };

//   return (
//     <div className="bg-[#004368] bg-opacity-5 w-full h-screen">
//       <div className="px-[30px] pt-6 pb-4">
//         {/* top section */}
//         <NewSearchComponent
//           setStartDate={setStartDate}
//           startDate={startDate}
//           endDate={endDate}
//           setEndDate={setEndDate}
//           setShopeeOrderStatusCheck={setShopeeOrderStatusCheck}
//           shopeeOrderStatusCheck={shopeeOrderStatusCheck}
//           handleToSearch={handleToSearch}
//           handleToReset={handleToReset}
//           searchFields={searchFields}
//           setSearchFields={setSearchFields}
//           customersData={customersData}
//           setFilteredData={setFilteredData}
//           isActiveBtnRecipientAddress={isActiveBtnRecipientAddress}
//           setIsActiveBtnRecipientAddress={setIsActiveBtnRecipientAddress}
//           isActiveBtnOrderId={isActiveBtnOrderId}
//           setIsActiveBtnOrderId={setIsActiveBtnOrderId}
//           isActiveBtnAccountName={isActiveBtnAccountName}
//           setIsActiveBtnAccountName={setIsActiveBtnAccountName}
//           isActiveBtnProduct={isActiveBtnProduct}
//           setIsActiveBtnProduct={setIsActiveBtnProduct}
//           isActiveBtnAmount={isActiveBtnAmount}
//           setIsActiveBtnAmount={setIsActiveBtnAmount}
//           currentShop="Shopee"
//           setSelectedStatus={setSelectedStatus}
//         />

//         {/* bottom section table */}
//         <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] p-4 mt-5">
//           {/* top */}

//           {/* <div className="grid grid-cols-6 items-center justify-center px-7 pl-3 pt-2"> */}
//           <div className="flex  items-center justify-between pl-3 pt-2">
//             <div className="col-span-1 flex items-center justify-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 id="selectAll"
//                 name="selectAll"
//                 value="selectAll"
//                 checked={selectAll}
//                 onChange={handleMasterCheckboxChange}
//                 className="w-4 h-4 rounded-[2px] text-black text-opacity-60 bg-[#004368] cursor-pointer"
//               />
//               <label
//                 for="selectAll"
//                 className="text-black opacity-80 text-sm font-normal capitalize pl-2 pr-1"
//               >
//                 {t("SelectAll")}
//               </label>
//               {/* this data coming from dynamic when items selected */}

//               <span className="text-black opacity-80 text-xs font-light capitalize">
//                 ({checkedItems?.length} {t("Selected")})
//               </span>
//             </div>

//             {/* dynamic show is it shipped or waiting for shipment */}
//             <div className="col-span-1">
//               <p className="text-[#004368] text-sm font-medium capitalize text-center">
//                 {/* {selectedLanguage === "zh-CN"
//                   ? "等待发货"
//                   : "waiting for shipment"} */}
//                 {t(selectedStatus)}
//               </p>
//             </div>

//             <div className="col-span-1 flex items-center justify-center">
//               <p className="text-black opacity-40 text-sm font-medium capitalize">
//                 500 {t("Buyers")}
//               </p>
//               <div className="w-[1px] h-8 bg-black opacity-40 mx-2"></div>
//               <p className="text-black opacity-40 text-sm font-medium capitalize">
//                 {totalOrderData?.length} {t("Orders")}
//               </p>
//             </div>

//             <div className="col-span-1 flex items-center justify-center">
//               <input
//                 type="file"
//                 id="fileInput"
//                 accept=".xls, .xlsx"
//                 style={{ display: "none" }}
//                 onChange={handleFileChange}
//               />
//               {/* <p
//                 onClick={handleImportOrderClick}
//                 className="text-[#004368] text-sm font-normal capitalize cursor-pointer"
//               >
//                 {t("ImportOrder")}
//               </p> */}
//             </div>

//             <div className="col-span-2 flex items-center justify-end">
//               <div className=" mr-5">
//                 <div className="flex justify-center space-x-1 dark:text-gray-100">
//                   <button
//                     onClick={() => handleToPrevious(currentBar - 1)}
//                     title="previous"
//                     type="button"
//                     className={`inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow-md bg-white dark:border-gray-800 ${
//                       leftPaginationBtn ? "border-black" : ""
//                     } `}
//                   >
//                     <svg
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       fill="[#0043681A]"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="w-4"
//                     >
//                       <polyline points="15 18 9 12 15 6"></polyline>
//                     </svg>
//                   </button>
//                   <button
//                     onClick={() => handleToShowCurrentBarData(currentBar)}
//                     type="button"
//                     title="Page 1"
//                     className={` inline-flex items-center justify-center w-8 h-8 text-sm font-semibold border rounded shadow-md bg-white ${
//                       currentBar === showPage ? "text-[#004368]" : ""
//                     }`}
//                   >
//                     {currentBar}
//                   </button>
//                   <button
//                     onClick={() => handleToShowCurrentBarData(currentBar + 1)}
//                     type="button"
//                     className={`text-[#004368] text-opacity-20 inline-flex items-center justify-center w-8 h-8 text-sm border rounded shadow-md bg-white dark:border-gray-800  ${
//                       currentBar === showPage ? "text-[#004368]" : ""
//                     } `}
//                     title="Page 2"
//                   >
//                     {currentBar + 1 > totalPart ? ".." : currentBar + 1}
//                   </button>
//                   <button
//                     onClick={() => handleToShowCurrentBarData(currentBar + 2)}
//                     type="button"
//                     className={`text-[#004368] text-opacity-20 inline-flex items-center justify-center w-8 h-8 text-sm border rounded shadow-md bg-white dark:border-gray-800 ${
//                       currentBar === showPage ? "text-[#004368]" : ""
//                     }`}
//                     title="Page 3"
//                   >
//                     {currentBar + 2 > totalPart ? ".." : currentBar + 2}
//                   </button>
//                   <button
//                     onClick={() => handleToNext(currentBar + 1)}
//                     title="next"
//                     type="button"
//                     className={`inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow-md bg-white dark:border-gray-200 ${
//                       rightPaginationBtn ? "border-black" : ""
//                     }`}
//                   >
//                     <svg
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       fill="[#0043681A]"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="w-4"
//                     >
//                       <polyline points="9 18 15 12 9 6"></polyline>
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               <button
//                 onClick={handleShopeePrinterExcelClick}
//                 className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[115px] h-10 px-8 py-2 rounded-md cursor-pointer"
//               >
//                 <p className="text-[15px] font-medium capitalize cursor-pointer whitespace-nowrap">
//                   {t("Export")}
//                 </p>
//               </button>
//             </div>
//           </div>

//           {/* table */}
//           {getShopeeOrders && (
//             <ShopeeBatchPrintTable
//               filteredData={filteredData}
//               isError={isError}
//               isLoading={shopeeLoading}
//               selectedCustomer={selectedCustomer}
//               handleDetailsClick={handleDetailsClick}
//               isModalOpen={isModalOpen}
//               closeModal={closeModal}
//               checkedItems={checkedItems}
//               handleCheckboxChange={handleCheckboxChange}
//               shopeeOrderStatusCheck={shopeeOrderStatusCheck}
//               startDate={startDate}
//               endDate={endDate}
//               cipher={cipher}
//               detailsLoading={detailsLoading}
//             />
//           )}
//         </div>
//       </div>

//       {/* end section button */}
//       <div className="mt-4 mr-8">
//         <div className="flex items-center justify-end">
//           {(shopeeOrderStatusCheck === "SHIPPED" ||
//             shopeeOrderStatusCheck === "PROCESSED" ||
//             shopeeOrderStatusCheck === "PROCESSED_PRINTED") && (
//             <button
//               onClick={handleToCheckItemsShippingUpdate}
//               className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-auto h-10 px-4 gap-2 py-2 rounded-md cursor-pointer flex items-center justify-center"
//             >
//               <MdOutlineLocalPrintshop className="w-[18px] h-[18px]" />
//               <p className="text-[15px] font-medium leading-normal capitalize pl-1">
//                 {shopeeOrderStatusCheck === "PROCESSED"
//                   ? t("OrderShippingAndPrint")
//                   : t("PrintAWBAgain")}
//               </p>
//             </button>
//           )}

//           {shopeeOrderStatusCheck?.toUpperCase() === "READY_TO_SHIP" && (
//             <button
//               onClick={handleToCheckItemsPackageUpdate}
//               className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-auto  h-10 px-4 gap-2 py-2 rounded-md cursor-pointer flex items-center justify-center"
//             >
//               <MdOutlineLocalPrintshop className="w-[18px] h-[18px]" />
//               <p className="text-[15px] font-medium leading-normal capitalize pl-1">
//                 {packageLoading ? "Loading" : t("OrderAcceptedAndPackages")}
//               </p>
//             </button>
//           )}
//           <ConfirmationModal
//             isOpen={isConfirmModalOpen}
//             title={modalTitle}
//             message={modalMessage}
//             onClose={() => setIsConfirmModalOpen(false)}
//             onConfirm={confirmAction}
//             showConfirmButton={showConfirmButton}
//             selectedLanguage={selectedLanguage}
//             packageLoading={packageLoading}
//           />
//           {/* </Link> */}
//           {selectedCustomer && isModalOpen && (
//             <dialog
//               id="shopee_modal"
//               className="modal backdrop-blur-sm bg-black/10 fixed inset-0 z-50 flex items-center justify-center"
//               open={isModalOpen}
//             >
//               <div className="modal-box w-[900px] max-w-full bg-white shadow-xl rounded-2xl p-8 overflow-y-auto max-h-[90vh]">
//                 {/* Header */}
//                 <div className="flex items-center justify-center mb-6">
//                   <h2 className="text-3xl font-semibold text-[#004368]">
//                     {t("ShopeeOrderDetails")}
//                   </h2>
//                 </div>

//                 {/* Main Order Info Grid */}
//                 <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
//                   <div>
//                     <strong>{t("OrderID")}:</strong>{" "}
//                     {selectedCustomer?.order_sn || t("NoData")}
//                   </div>
//                   <div>
//                     <strong>{t("Status")}:</strong>{" "}
//                     <span className="text-blue-700 font-semibold">
//                       {selectedCustomer?.order_status || t("NoData")}
//                     </span>
//                   </div>
//                   <div>
//                     <strong>{t("PaymentMethod")}:</strong>{" "}
//                     {selectedCustomer?.payment_method || t("NoData")}
//                   </div>
//                   <div>
//                     <strong>{t("Currency")}:</strong>{" "}
//                     {selectedCustomer?.currency || t("NoData")}
//                   </div>
//                   <div>
//                     <strong>{t("TotalAmount")}:</strong>{" "}
//                     {selectedCustomer?.total_amount ?? 0}
//                   </div>
//                   <div>
//                     <strong>{t("COD")}:</strong>{" "}
//                     {selectedCustomer?.cod ? t("Yes") : t("No")}
//                   </div>
//                   <div>
//                     <strong>{t("CreatedAt")}:</strong>{" "}
//                     {selectedCustomer?.create_time
//                       ? new Date(
//                           selectedCustomer.create_time * 1000
//                         ).toLocaleString()
//                       : t("NoData")}
//                   </div>
//                   <div>
//                     <strong>{t("UpdatedAt")}:</strong>{" "}
//                     {selectedCustomer?.update_time
//                       ? new Date(
//                           selectedCustomer.update_time * 1000
//                         ).toLocaleString()
//                       : t("NoData")}
//                   </div>
//                 </div>

//                 {/* Divider */}
//                 <hr className="my-6" />

//                 {/* Recipient Info */}
//                 <div className="mb-6">
//                   <h3 className="text-xl font-semibold mb-3">
//                     {t("RecipientInformation")}
//                   </h3>
//                   <p>
//                     <strong>{t("Name")}:</strong>{" "}
//                     {selectedCustomer?.recipient_address?.name || t("NoData")}
//                   </p>
//                   <p>
//                     <strong>{t("Phone")}:</strong>{" "}
//                     {selectedCustomer?.recipient_address?.phone || t("NoData")}
//                   </p>
//                   <p>
//                     <strong>{t("FullAddress")}:</strong>{" "}
//                     {selectedCustomer?.recipient_address?.full_address ||
//                       t("NoData")}
//                   </p>
//                   <p>
//                     <strong>{t("City")}:</strong>{" "}
//                     {selectedCustomer?.recipient_address?.city || t("NoData")}
//                   </p>
//                   <p>
//                     <strong>{t("State")}:</strong>{" "}
//                     {selectedCustomer?.recipient_address?.state || t("NoData")}
//                   </p>
//                   <p>
//                     <strong>{t("District")}:</strong>{" "}
//                     {selectedCustomer?.recipient_address?.district ||
//                       t("NoData")}
//                   </p>
//                   <p>
//                     <strong>{t("Region")}:</strong>{" "}
//                     {selectedCustomer?.recipient_address?.region || t("NoData")}
//                   </p>
//                 </div>

//                 {/* Divider */}
//                 <hr className="my-6" />

//                 {/* Order Items */}
//                 <div>
//                   <h3 className="text-xl font-semibold mb-4">
//                     {t("OrderItems")}
//                   </h3>
//                   {selectedCustomer?.item_list?.length > 0 ? (
//                     <div className="space-y-4 max-h-[40vh] overflow-y-auto">
//                       {selectedCustomer.item_list.map((item, idx) => (
//                         <div
//                           key={item.order_item_id || idx}
//                           className="flex gap-4 items-center border p-4 rounded-lg shadow-sm"
//                         >
//                           <img
//                             src={
//                               item?.image_info?.image_url ||
//                               "https://via.placeholder.com/80"
//                             }
//                             alt={item?.item_name || t("NoData")}
//                             className="w-20 h-20 object-cover rounded-md border"
//                           />
//                           <div className="flex-1">
//                             <p>
//                               <strong>{t("Product")}:</strong>{" "}
//                               {item?.item_name || t("NoData")}
//                             </p>
//                             <p>
//                               <strong>{t("ModelName")}:</strong>{" "}
//                               {item?.model_name || t("NoData")}
//                             </p>
//                             <p>
//                               <strong>{t("SKU")}:</strong>{" "}
//                               {item?.model_sku || t("NoData")}
//                             </p>
//                             <p>
//                               <strong>{t("Quantity")}:</strong>{" "}
//                               {item?.model_quantity_purchased ?? 0}
//                             </p>
//                             <p>
//                               <strong>{t("Price")}:</strong>{" "}
//                               {item?.model_discounted_price ?? 0}
//                             </p>
//                             <p>
//                               <strong>{t("OriginalPrice")}:</strong>{" "}
//                               {item?.model_original_price ?? 0}
//                             </p>
//                             <p>
//                               <strong>{t("PromotionType")}:</strong>{" "}
//                               {item?.promotion_type || t("NoData")}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p>{t("NoOrderItems")}</p>
//                   )}
//                 </div>

//                 {/* Footer */}
//                 <div className="mt-8 text-center">
//                   <button
//                     onClick={closeModal}
//                     className="bg-[#004368] hover:bg-[#00324d] text-white font-semibold px-8 py-2 rounded-lg transition"
//                   >
//                     {t("Close")}
//                   </button>
//                 </div>
//               </div>
//             </dialog>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShopeeBatchPrint;

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { checkedItemsChange } from "../../features/slice/userSlice";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ShopeeBatchPrintTable from "./ShopeeBatchPrintTable";
import ConfirmationModal from "../../Share/ConfirmationModal";
import { TiInfoOutline } from "react-icons/ti";
import { AiOutlineCheckCircle } from "react-icons/ai";
import {
  useLazyGetShopeeOrderDetailsQuery,
  useLazyGetShopeeOrdersQuery,
} from "../../features/allApis/shopeeApi";
import { shopeeArrayToExcel } from "../../Share/Function/FunctionalComponent";

// Custom hooks
import { useShopeeOrderStatus } from "./shopeeHooks/useShopeeOrderStatus";

// Components
import SearchSection from "./shopeeComponents/SearchSection";
import TableHeader from "./shopeeComponents/TableHeader";
import ActionButtons from "./shopeeComponents/ActionButtons";
import OrderDetailsModal from "./shopeeComponents/OrderDetailsModal";
import { useCheckboxSelection } from "./shopeeHooks/useCheckboxSelection";
import { usePagination } from "./shopeeHooks/usePagination";
import { useOrderData } from "./shopeeHooks/useOrderData";
import { useModalStates } from "./shopeeHooks/useModalStates";
import { orderListData } from "../../features/slice/orderListSlice";
import { filterShopeeDataBySearchFields } from "../../Share/SearchComponent/SearchComponentFunction";

const ShopeeBatchPrint = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Custom hooks
  const { shopeeOrderStatusCheck, setShopeeOrderStatusCheck, selectedStatus } =
    useShopeeOrderStatus();
  const {
    selectAll,
    checkedItems,
    setSelectAll,
    setCheckedItems,
    handleMasterCheckboxChange,
    handleCheckboxChange,
    clearSelection,
  } = useCheckboxSelection();
  const { customersData, setCustomersData } = useOrderData();
  const [filteredData, setFilteredData] = useState(customersData);
  const [shopeeLoading, setShopeeLoading] = useState(false);
  const [packageLoading, setPackageLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const {
    selectedCustomer,
    isDetailsModalOpen,
    isConfirmModalOpen,
    modalTitle,
    modalMessage,
    confirmAction,
    showConfirmButton,
    openDetailsModal,
    closeDetailsModal,
    openConfirmModal,
    closeConfirmModal,
  } = useModalStates();

  const pagination = usePagination(filteredData);
  const [getShopeeOrders] = useLazyGetShopeeOrdersQuery();
  const [getShopeeOrderDetails] = useLazyGetShopeeOrderDetailsQuery();
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );

  const [searchFields, setSearchFields] = useState({
    RecipientAddress: "",
    isActiveRecipientAddress: "",
    OrderId: "",
    isActiveOrderId: "",
    AccountName: "",
    isActiveAccountName: "",
    Amount: "",
    isActiveAmount: "",
    Product: "",
    isActiveProduct: "",
    startDate: new Date(),
    endDate: new Date(),
  });

  // State for active buttons - derive from searchFields to keep in sync
  const [isActiveBtnRecipientAddress, setIsActiveBtnRecipientAddress] =
    useState(searchFields.isActiveRecipientAddress);
  const [isActiveBtnOrderId, setIsActiveBtnOrderId] = useState(
    searchFields.isActiveOrderId
  );
  const [isActiveBtnAccountName, setIsActiveBtnAccountName] = useState(
    searchFields.isActiveAccountName
  );
  const [isActiveBtnProduct, setIsActiveBtnProduct] = useState(
    searchFields.isActiveProduct
  );
  const [isActiveBtnAmount, setIsActiveBtnAmount] = useState(
    searchFields.isActiveAmount
  );

  const [cipher] = useState(() => {
    const stored = localStorage.getItem("tiktokShopInfo");
    return stored ? JSON.parse(stored) : [];
  });

  // Add these state variables if not already present
  const [selectedShopeeDeliveryType, setSelectedShopeeDeliveryType] =
    useState("");

  useEffect(() => {
    setFilteredData(customersData);
  }, [customersData]);
  // Add this effect to load delivery type from localStorage
  useEffect(() => {
    const savedType = localStorage.getItem("shopeeDeliveryType");
    if (savedType) {
      setSelectedShopeeDeliveryType(savedType);
    }
  }, []);

  // Route-based status updates
  useEffect(() => {
    const parts = location.pathname.split("/");
    console.log("Current path:", location.pathname); // Debug
    console.log("Path parts:", parts); // Debug

    if (parts.length >= 2) {
      const statusMap = {
        printed: { status: "PROCESSED_PRINTED", display: "Processed_Printed" },
        shipped: { status: "SHIPPED", display: "On The Way" },
        needPrint: { status: "PROCESSED", display: "Processed" },
      };

      // The status is usually in parts[1] for routes like /printed/shopee
      const routeStatus = parts[1];
      console.log("Route status:", routeStatus); // Debug

      const mappedStatus = statusMap[routeStatus];
      if (mappedStatus) {
        console.log("Setting route-based status:", mappedStatus.status);
        setShopeeOrderStatusCheck(mappedStatus.status);
      }
    }

    setIsInitialLoad(false);
  }, [location.pathname, setShopeeOrderStatusCheck]);

  // Only fetch data after initial route processing
  useEffect(() => {
    if (!isInitialLoad && shopeeOrderStatusCheck) {
      dispatch(checkedItemsChange({ items: [], from: shopeeOrderStatusCheck }));
      clearSelection();
      fetchShopeeOrdersWithDetails();
    }
  }, [shopeeOrderStatusCheck, isInitialLoad, dispatch, clearSelection]);

  const fetchShopeeOrdersWithDetails = async () => {
    try {
      setShopeeLoading(true);
      const now = Math.floor(Date.now() / 1000);
      const sevenDaysAgo = now - 7 * 24 * 60 * 60;

      const orderListResponse = await getShopeeOrders({
        timeFrom: sevenDaysAgo,
        timeTo: now,
        orderStatus:
          shopeeOrderStatusCheck === "PROCESSED_PRINTED"
            ? "PROCESSED"
            : shopeeOrderStatusCheck || "READY_TO_SHIP",
      }).unwrap();

      const orderList = orderListResponse?.response?.order_list || [];
      if (orderList.length === 0) {
        dispatch(orderListData([]));
        setCustomersData([]);
        return;
      }

      const orderSnList = orderList.map((order) => order.order_sn);
      const detailsResponse = await getShopeeOrderDetails({
        orderSnList,
        request_order_status_pending: true,
        response_optional_fields: "total_amount,recipient_address,item_list",
      }).unwrap();

      const detailedOrders = detailsResponse || [];
      let mergedOrders = orderList.map((order) => {
        const details = detailedOrders.find(
          (d) => d.order_sn === order.order_sn
        );
        return { ...order, ...details };
      });

      // Filter logic
      let printedIds = [];
      try {
        const res = await fetch(
          "https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/shopee/printedIds"
        );
        printedIds = await res.json();
      } catch (err) {
        console.error("Error fetching printedIds:", err);
      }

      const shopeePrintedIds = printedIds.map((p) => p.shopeePrintedId);

      if (shopeeOrderStatusCheck === "PROCESSED_PRINTED") {
        mergedOrders = mergedOrders.filter((order) =>
          shopeePrintedIds.includes(order.order_sn)
        );
      } else if (shopeeOrderStatusCheck === "PROCESSED") {
        const stored =
          JSON.parse(localStorage.getItem("ShopeePackaging")) || [];
        mergedOrders = mergedOrders.filter((order) => {
          const isPrinted = shopeePrintedIds.includes(order.order_sn);
          const inStorage = stored.includes(order.order_sn);

          if (inStorage) {
            const updatedStorage = stored.filter((id) => id !== order.order_sn);
            localStorage.setItem(
              "ShopeePackaging",
              JSON.stringify(updatedStorage)
            );
          }

          return !isPrinted;
        });
      } else if (shopeeOrderStatusCheck === "READY_TO_SHIP") {
        const storeOrderId = localStorage.getItem("ShopeePackaging") || "[]";
        mergedOrders = mergedOrders.filter(
          (order) => !storeOrderId.includes(order.order_sn)
        );
      }

      dispatch(orderListData(mergedOrders));
      setCustomersData(mergedOrders);
    } catch (error) {
      console.error("Shopee Order Fetch Error:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setShopeeLoading(false);
    }
  };

  // Handlers
  const handleToReset = useCallback(() => {
    // Clear the search input
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.value = "";
    }

    setSearchFields({
      RecipientAddress: "",
      isActiveRecipientAddress: "",
      OrderId: "",
      isActiveOrderId: "",
      AccountName: "",
      isActiveAccountName: "",
      Amount: "",
      isActiveAmount: "",
      Product: "",
      isActiveProduct: "",
      startDate: new Date(),
      endDate: new Date(),
    });
    setShopeeOrderStatusCheck("");
    setIsActiveBtnRecipientAddress(false);
    setIsActiveBtnOrderId(false);
    setIsActiveBtnAccountName(false);
    setIsActiveBtnProduct(false);
    setIsActiveBtnAmount(false);
    setFilteredData(customersData); // Reset to original data
    pagination.goToPage(1);
  }, [pagination, customersData, setShopeeOrderStatusCheck]);

  const handleDetailsClick = useCallback(
    (orderData) => {
      openDetailsModal(orderData);
    },
    [openDetailsModal]
  );

  const handleShopeePrinterExcelClick = useCallback(() => {
    shopeeArrayToExcel(checkedItems, "ShopeePrinterOrderList");
  }, [checkedItems]);

  const handleToCheckItemsPackageUpdate = useCallback(() => {
    if (checkedItems.length === 0) {
      openConfirmModal(
        <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
          <TiInfoOutline className="w-10 h-10 text-red-600" />
        </div>,
        <p>{t("NoItemsSelected")}</p>
      );
    } else {
      openConfirmModal(
        <div className="bg-green-200 w-16 h-16 rounded-full flex items-center justify-center">
          <AiOutlineCheckCircle className="w-10 h-10 text-green-600" />
        </div>,
        <p className="text-xl font-semibold">
          {t("AreYouSureYouHaveCompletedPackagingThisOrder")}
        </p>,
        handleConfirmPackage,
        true
      );
    }
  }, [checkedItems.length, t, openConfirmModal]);

  const handleToCheckItemsShippingUpdate = useCallback(() => {
    if (checkedItems.length === 0) {
      openConfirmModal(
        <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
          <TiInfoOutline className="w-10 h-10 text-red-600" />
        </div>,
        <p>{t("NoItemsSelected")}</p>
      );
    } else {
      openConfirmModal(
        <div className="bg-green-200 w-16 h-16 rounded-full flex items-center justify-center">
          <AiOutlineCheckCircle className="w-10 h-10 text-green-600" />
        </div>,
        <p className="text-xl font-semibold">
          {shopeeOrderStatusCheck === "PROCESSED"
            ? t("AreYouSureToPrintForReadyToShip")
            : t("DoYouWantPrintAWBAgain")}
        </p>,
        handleConfirmShipping,
        true
      );
    }
  }, [checkedItems.length, shopeeOrderStatusCheck, t, openConfirmModal]);

  const handleConfirmShipping = useCallback(() => {
    dispatch(
      checkedItemsChange({ items: checkedItems, from: shopeeOrderStatusCheck })
    );
    navigate("/shopeeAWBPrinting");
    closeConfirmModal();
  }, [
    dispatch,
    checkedItems,
    shopeeOrderStatusCheck,
    navigate,
    closeConfirmModal,
  ]);

  const handleConfirmPackage = useCallback(async () => {
    const successfulIds = [];
    const failedOrders = [];
    setPackageLoading(true);

    try {
      // Loop through orders
      for (const item of checkedItems) {
        const orderSn = item?.order_sn || item?.orderId;
        if (!orderSn) continue;

        try {
          // 1️⃣ Get shipping parameters
          const shippingParamRes = await fetch(
            `https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/logistics/get-shipping-parameter?orderSn=${orderSn}`
          );
          const shippingParamData = await shippingParamRes.json();

          if (shippingParamData?.body?.error) {
            failedOrders.push({
              orderId: orderSn,
              reason:
                shippingParamData?.body?.message ||
                shippingParamData?.body?.error,
            });
            continue;
          }

          const addressId =
            shippingParamData?.body?.response?.pickup?.address_list?.[0]
              ?.address_id || null;
          const dropoff = shippingParamData?.body?.response?.dropoff;

          // 2️⃣ Build request body dynamically
          let requestBody = {
            order_sn: orderSn,
            package_number: "",
          };

          if (selectedShopeeDeliveryType === "pickup") {
            if (!addressId) {
              failedOrders.push({
                orderId: orderSn,
                reason: "Missing address_id",
              });
              continue;
            }
            requestBody = {
              order_sn: orderSn,
              package_number: "",
              pickup: {
                address_id: addressId,
                pickup_time_id: "",
                tracking_number: "",
              },
            };
          } else if (selectedShopeeDeliveryType === "dropoff") {
            requestBody = {
              order_sn: orderSn,
              package_number: "",
              dropoff: dropoff,
            };
          } else {
            if (!addressId) {
              failedOrders.push({
                orderId: orderSn,
                reason: "Missing address_id",
              });
              continue;
            }
            requestBody = {
              order_sn: orderSn,
              package_number: "",
              pickup: {
                address_id: addressId,
                pickup_time_id: "",
                tracking_number: "",
              },
            };
          }

          // 3️⃣ Call ship-order API
          const shipRes = await fetch(
            "https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/logistics/ship-order",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requestBody),
            }
          );

          const shipData = await shipRes.json();

          if (!shipData?.body?.error) {
            console.log(`✅ Shipped order ${orderSn}`, shipData);
            successfulIds.push(orderSn);

            // Save into localStorage (ShopeePackaging)
            const stored =
              JSON.parse(localStorage.getItem("ShopeePackaging")) || [];
            if (!stored.includes(orderSn)) {
              localStorage.setItem(
                "ShopeePackaging",
                JSON.stringify([...stored, orderSn])
              );
            }
          } else {
            console.warn(
              `❌ Failed to ship ${orderSn}`,
              shipData?.body?.message || shipData?.body?.error
            );
            failedOrders.push({
              orderId: orderSn,
              reason:
                shipData?.body?.message ||
                shipData?.body?.error ||
                "Unknown error",
            });
          }
        } catch (err) {
          console.error(`🚨 Error shipping order ${orderSn}`, err);
          failedOrders.push({
            orderId: orderSn,
            reason: "API request failed",
          });
        }
      }

      // Update list (remove successful orders)
      const restOfOrders = customersData.filter(
        (item) => !successfulIds.includes(item?.order_sn || item?.orderId)
      );
      setCustomersData(restOfOrders);

      dispatch(checkedItemsChange({ items: [], from: shopeeOrderStatusCheck }));
      setCheckedItems([]);
      setSelectAll(false);
      closeConfirmModal();

      // Show result modal if failures
      if (failedOrders.length > 0) {
        setPackageLoading(false);
        openConfirmModal(
          <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
            <TiInfoOutline className="w-10 h-10 text-red-600" />
          </div>,
          <div>
            <p className="text-red-600 flex justify-center font-semibold mb-2">
              ⚠️ {failedOrders.length} orders failed to ship
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-700 max-h-60 overflow-y-auto">
              {failedOrders.map((f, index) => (
                <li key={index}>
                  <strong>{f.orderId}:</strong> {f.reason}
                </li>
              ))}
            </ul>
          </div>
        );
      } else {
        console.log("✅ All selected orders shipped successfully!");
        toast.success("✅ All selected orders shipped successfully!");
      }
    } catch (error) {
      console.error("🚨 Error in handleConfirmPackage:", error);
      toast.error("Unexpected error occurred. Please try again.", {
        autoClose: false,
        position: "top-right",
      });
    } finally {
      setPackageLoading(false);
    }
  }, [
    checkedItems,
    selectedShopeeDeliveryType,
    customersData,
    setCustomersData,
    dispatch,
    shopeeOrderStatusCheck,
    closeConfirmModal,
    openConfirmModal,
    setCheckedItems,
    setSelectAll,
    setPackageLoading,
  ]);

  const handleToSearch = () => {
    document.getElementById("searchInput").value = "";

    const filteredMultipleSearchingData = filterShopeeDataBySearchFields(
      customersData,
      searchFields
    );
    setFilteredData(filteredMultipleSearchingData); // Use setFilteredData instead of pagination.updateData
  };

  return (
    <div className="bg-[#004368] bg-opacity-5 w-full h-screen">
      <div className="px-[30px] pt-6 pb-4">
        {/* Search Component */}
        <SearchSection
          searchFields={searchFields}
          setSearchFields={setSearchFields}
          shopeeOrderStatusCheck={shopeeOrderStatusCheck}
          setShopeeOrderStatusCheck={setShopeeOrderStatusCheck}
          handleToSearch={handleToSearch}
          handleToReset={handleToReset}
          customersData={customersData}
          setFilteredData={setFilteredData}
          isActiveBtnRecipientAddress={isActiveBtnRecipientAddress}
          setIsActiveBtnRecipientAddress={setIsActiveBtnRecipientAddress}
          isActiveBtnOrderId={isActiveBtnOrderId}
          setIsActiveBtnOrderId={setIsActiveBtnOrderId}
          isActiveBtnAccountName={isActiveBtnAccountName}
          setIsActiveBtnAccountName={setIsActiveBtnAccountName}
          isActiveBtnProduct={isActiveBtnProduct}
          setIsActiveBtnProduct={setIsActiveBtnProduct}
          isActiveBtnAmount={isActiveBtnAmount}
          setIsActiveBtnAmount={setIsActiveBtnAmount}
        />
        {/* Table Section */}
        <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] p-4 mt-5">
          {/* Table Header */}
          <TableHeader
            selectAll={selectAll}
            onSelectAllChange={() => handleMasterCheckboxChange(customersData)}
            checkedItemsCount={checkedItems.length}
            selectedStatus={selectedStatus}
            totalOrders={customersData.length}
            pagination={pagination}
            onExport={handleShopeePrinterExcelClick}
            t={t}
          />

          {/* Table */}
          <ShopeeBatchPrintTable
            filteredData={pagination.currentData}
            isError={false}
            isLoading={shopeeLoading}
            selectedCustomer={selectedCustomer}
            handleDetailsClick={handleDetailsClick}
            isModalOpen={isDetailsModalOpen}
            closeModal={closeDetailsModal}
            checkedItems={checkedItems}
            handleCheckboxChange={(order) =>
              handleCheckboxChange(order, pagination.currentData)
            }
            shopeeOrderStatusCheck={shopeeOrderStatusCheck}
            cipher={cipher}
            detailsLoading={false}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 mr-8">
        <ActionButtons
          shopeeOrderStatusCheck={shopeeOrderStatusCheck}
          packageLoading={packageLoading}
          onPackageUpdate={handleToCheckItemsPackageUpdate}
          onShippingUpdate={handleToCheckItemsShippingUpdate}
          t={t}
        />
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        title={modalTitle}
        message={modalMessage}
        onClose={closeConfirmModal}
        onConfirm={confirmAction}
        showConfirmButton={showConfirmButton}
        selectedLanguage={selectedLanguage}
        packageLoading={packageLoading}
      />

      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        selectedCustomer={selectedCustomer}
        onClose={closeDetailsModal}
        t={t}
      />
    </div>
  );
};

export default ShopeeBatchPrint;
