// import React, { useEffect, useState } from "react";
// import { MdOutlineLocalPrintshop } from "react-icons/md";
// import { lazadaArrayToExcel } from "../../Share/Function/FunctionalComponent";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import { checkedItemsChange } from "../../features/slice/userSlice";
// import * as XLSX from "xlsx";
// import NewSearchComponent from "../../Share/SearchComponent/NewSearchComponent";
// import { filterLazadaDataBySearchFields } from "../../Share/SearchComponent/SearchComponentFunction";
// import toast from "react-hot-toast";
// import { orderListData } from "../../features/slice/orderListSlice";
// import ConfirmationModal from "../../Share/ConfirmationModal";
// import { TiInfoOutline } from "react-icons/ti";
// import { AiOutlineCheckCircle } from "react-icons/ai";
// import { useTranslation } from "react-i18next";
// import LazadaBatchPrintTable from "./LazadaBatchPrintTable";
// import StoredDeliveryCompanyList from "../../Share/StoredDeliveryCompanyList/StoredDeliveryCompanyList";
// import BatchPrinterModal from "../BatchPrint/BatchPrinterModal";
// import { useLazyGetLazadaOrdersQuery } from "../../features/allApis/lazadaApi";
// import axios from "axios";
// import { lazadaOrderStatusOptions } from "../../Share/Data/ClientData";
// import { isSameDay, parseISO } from "date-fns";

// const LazadaBatchPrint = () => {
//   const [selectAll, setSelectAll] = useState(false);
//   const [detailsLoading, setDetailsLoading] = useState(false);
//   const [lazadaLoading, setLazadaLoading] = useState(false);
//   const [checkedItems, setCheckedItems] = useState([]);
//   const orderListDataGet = useSelector((state) => state.orderList.data);
//   const [totalOrderData, setTotalOrderData] = useState(orderListDataGet);
//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(new Date());
//   const [cardStatus, setCardStatus] = useState(false);
//   const selectedLazadaOrderStatus = useSelector(
//     (state) => state.user.lazadaSelectStatus
//   );
//   // pick pending option once
//   const pendingOption = lazadaOrderStatusOptions.find(
//     (opt) => opt.value === "pending"
//   );

//   const [lazadaOrderStatusCheck, setLazadaOrderStatusCheck] = useState(
//     selectedLazadaOrderStatus || pendingOption?.value || ""
//   );

//   const [selectedStatus, setSelectedStatus] = useState(
//     selectedLazadaOrderStatus || pendingOption?.status || ""
//   );

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
//   const [cipher, setCipher] = useState(() => {
//     const stored = localStorage.getItem("tiktokShopInfo");
//     return stored ? JSON.parse(stored) : [];
//   });
//   const { t } = useTranslation();

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   //Data post request send and return data get
//   // const [loadOrderList, { isLoading, isError }] = useLazyGetLazadaOrdersQuery();
//   const [getLazadaOrders, { isLoading, isError }] =
//     useLazyGetLazadaOrdersQuery();

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
//   console.log(selectedStatus, "status");
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
//     if (checkedItems.some((item) => item?.order_id === order?.order_id)) {
//       // If the order id is already in the checkedItems, remove it
//       const updatedItems = checkedItems.filter(
//         (item) => item?.order_id !== order?.order_id
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

//   const location = useLocation();

//   useEffect(() => {
//     // Split path into parts
//     const parts = location.pathname.split("/");
//     // e.g. ["", "printed", "LazadaOrderManagement"]

//     if (parts.length === 3) {
//       console.log("Second part:", parts[1]); // LazadaOrderManagement
//       setCardStatus(true);
//       if (parts[1] === "printed") {
//         setLazadaOrderStatusCheck("Packed_Printed");
//         setSelectedStatus("Printed");
//       } else if (parts[1] === "shipped") {
//         setLazadaOrderStatusCheck("shipped");
//         setSelectedStatus("On The Way");
//       } else if (parts[1] === "needPrint") {
//         setLazadaOrderStatusCheck("Packed");
//         setSelectedStatus("Packed");
//       }
//     }
//   }, [location]);

//   useEffect(() => {
//     let isMounted = true;

//     const fetchData = async () => {
//       try {
//         setLazadaLoading(true);

//         // ✅ 1. Ensure printed IDs are loaded first
//         let printedIds = lazadaPrintedIds;
//         if (printedIds.length === 0) {
//           const res = await fetch(
//             "https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/lazada/printedIds"
//           );
//           const data = await res.json();
//           if (Array.isArray(data)) {
//             printedIds = data;
//             if (isMounted) setLazadaPrintedIds(data);
//           }
//         }

//         // ✅ 2. Only fetch orders if we have a status
//         if (!lazadaOrderStatusCheck) return;

//         const now = new Date();
//         const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//         const toISOString = (date) => date.toISOString().split(".")[0] + "Z";

//         dispatch(
//           checkedItemsChange({ items: [], from: lazadaOrderStatusCheck })
//         );
//         setCheckedItems([]);
//         setSelectAll(false);

//         // ✅ 3. Get main order list
//         const response = await getLazadaOrders({
//           sortBy: "updated_at",
//           createdAfter: toISOString(sevenDaysAgo),
//           createdBefore: toISOString(now),
//           updateAfter: toISOString(sevenDaysAgo),
//           updateBefore: toISOString(now),
//           status:
//             lazadaOrderStatusCheck === "Packed_Printed"
//               ? "Packed"
//               : lazadaOrderStatusCheck,
//           sortDirection: "DESC",
//           offset: 0,
//           limit: 100,
//         }).unwrap();

//         const parsedBody = JSON.parse(response?.body || "{}");
//         let filteredOrderList = parsedBody?.data?.orders || [];

//         const printedIdSet = new Set(
//           printedIds.map((item) => item.lazadaPrintedId)
//         );

//         if (lazadaOrderStatusCheck === "Packed") {
//           filteredOrderList = filteredOrderList.filter(
//             (item) => !printedIdSet.has(String(item.order_id))
//           );
//         } else if (lazadaOrderStatusCheck === "Packed_Printed") {
//           if (cardStatus === true) {
//             filteredOrderList = filteredOrderList.filter((item) =>
//               printedIdSet.has(String(item.order_id))
//             );
//             const todayPrinted = lazadaPrintedIds.filter((item) =>
//               isSameDay(parseISO(item.createdAt), now)
//             );

//             filteredOrderList = todayPrinted;
//             setCardStatus(false);
//           } else {
//             filteredOrderList = filteredOrderList.filter((item) =>
//               printedIdSet.has(String(item.order_id))
//             );
//           }
//         } else if (
//           lazadaOrderStatusCheck === "shipped" &&
//           cardStatus === true
//         ) {
//           const today = new Date().toISOString().split("T")[0]; // format: YYYY-MM-DD
//           filteredOrderList = filteredOrderList.filter((item) => {
//             const itemDate = new Date(item.updated_at)
//               .toISOString()
//               .split("T")[0];
//             return (
//               !printedIdSet.has(String(item.order_id)) && itemDate === today
//             );
//           });
//           setCardStatus(false);
//         }

//         // ✅ 4. Fetch item details for each order_id (No Auth Needed)
//         const orderWithItems = [];

//         for (const order of filteredOrderList) {
//           try {
//             const itemRes = await fetch(
//               `https://grozziie.zjweiting.com:3091/lazada-open-shop/api/dev/orders/items?orderId=${order.order_id}`,
//               { method: "GET", headers: { accept: "*/*" } }
//             );
//             const itemData = await itemRes.json();

//             // ✅ Parse the string body into JSON if needed
//             let parsedBody = {};
//             if (typeof itemData?.body === "string") {
//               try {
//                 parsedBody = JSON.parse(itemData.body);
//               } catch (parseErr) {
//                 console.error(
//                   `❌ Failed to parse body for order ${order.order_id}`,
//                   parseErr
//                 );
//                 parsedBody = {};
//               }
//             } else if (typeof itemData?.body === "object") {
//               parsedBody = itemData.body;
//             }

//             const parsedItemData =
//               parsedBody?.data?.order_items || // Standard Lazada API format
//               parsedBody?.data || // Fallback for direct array
//               [];

//             orderWithItems.push({
//               ...order,
//               orderItemInfo: parsedItemData, // attach correctly parsed items
//             });
//           } catch (itemErr) {
//             console.error(
//               `❌ Failed to fetch items for order ${order.order_id}`,
//               itemErr
//             );
//           }
//         }

//         // ✅ 5. Save final merged list
//         if (isMounted) {
//           dispatch(orderListData(orderWithItems));
//           setTotalOrderData(orderWithItems);
//         }
//       } catch (error) {
//         console.error("❌ Lazada Order Fetch Error:", error);
//       } finally {
//         if (isMounted) setLazadaLoading(false);
//         setCardStatus(false);
//       }
//     };

//     fetchData();
//     return () => {
//       isMounted = false;
//     };
//   }, [lazadaOrderStatusCheck]);

//   useEffect(() => {
//     const firstPageData = data?.slice(0, 5);
//     setTotalPart(Math.ceil(data?.length / 5));
//     setCustomersData(data);
//     setFilteredData(firstPageData);
//     setCurrentCustomerData(firstPageData);
//     setCurrentBar(1);
//   }, [lazadaOrderStatusCheck, totalOrderData, lazadaOrderStatusCheck]);

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

//   const handleLazadaPrinterExcelClick = () => {
//     lazadaArrayToExcel(checkedItems, "lazadaPrinterOrderList");
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
//           {lazadaOrderStatusCheck === "Packed"
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
//     const allOrderItems = [];

//     for (const item of checkedItems) {
//       const { order_id } = item;

//       try {
//         const response = await axios.get(
//           `https://grozziie.zjweiting.com:3091/lazada-open-shop/api/dev/orders/items`,
//           {
//             params: { orderId: order_id },
//             headers: {
//               Accept: "*/*",
//             },
//           }
//         );

//         const rawBody = response?.data?.body;
//         const parsedBody = JSON.parse(rawBody);
//         const data = parsedBody?.data;

//         if (!Array.isArray(data)) {
//           throw new Error("Invalid data format for order_id: " + order_id);
//         }

//         // Push as grouped data under each order_id
//         allOrderItems.push({ order_id, data });
//       } catch (error) {
//         console.error("❌ Error fetching order:", order_id, error);
//         toast.error(`Failed to fetch order ${order_id}`);
//         return; // Stop on first error
//       }
//     }

//     // All requests succeeded, now dispatch and navigate
//     dispatch(
//       checkedItemsChange({
//         items: allOrderItems, // Now an array of { order_id, data }
//         from: lazadaOrderStatusCheck,
//       })
//     );

//     navigate("/lazadaAWBPrinting");
//   };

//   const handleConfirmPackage = async () => {
//     const successfulIds = [];
//     const failedOrders = [];

//     try {
//       for (const item of checkedItems) {
//         const orderId = item?.order_id;

//         if (!orderId) {
//           console.warn("Missing orderId");
//           failedOrders.push({ orderId: "Unknown", reason: "Missing order ID" });
//           continue;
//         }

//         // Step 1: Get order item ID
//         const itemRes = await fetch(
//           `https://grozziie.zjweiting.com:3091/lazada-open-shop/api/dev/orders/items?orderId=${orderId}`
//         );
//         const itemData = await itemRes.json();

//         // Lazada already returns object → don’t double parse
//         const parsedBody = JSON.parse(itemData?.body);

//         console.log(parsedBody.data, "parsed");

//         const orderItemIds =
//           parsedBody?.data?.map((it) => it.order_item_id.toString()) || [];

//         if (!orderItemIds.length) {
//           console.warn("No order_item_id found for order", orderId);
//           failedOrders.push({ orderId, reason: "No order_item_id found" });
//           continue;
//         }

//         console.log(
//           { order_id: orderId, order_item_ids: orderItemIds },
//           "shipment provider payload"
//         );

//         // Step 2: Get shipment provider
//         // Step 2: Get shipment provider
//         const shipmentRes = await fetch(
//           `https://grozziie.zjweiting.com:3091/lazada-open-shop/fulfillment/order/shipment-provider`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Accept: "*/*",
//             },
//             body: JSON.stringify({
//               orders: [
//                 {
//                   order_id: orderId,
//                   order_item_ids: orderItemIds, // ✅ correct
//                 },
//               ],
//             }),
//           }
//         );

//         const shipmentData = await shipmentRes.json();
//         const providerInfo = shipmentData?.result?.data;

//         if (!providerInfo?.shipment_providers?.length) {
//           console.warn(
//             "No shipment providers found for order",
//             providerInfo,
//             orderId
//           );
//           failedOrders.push({ orderId, reason: "No shipment providers found" });
//           continue;
//         }

//         const shipmentProviderCode =
//           providerInfo?.shipment_providers[0]?.provider_code;
//         const shippingAllocateType = providerInfo?.shipping_allocate_type;
//         console.log(
//           shipmentProviderCode,
//           shippingAllocateType,
//           "log shipment provider"
//         );

//         // Step 3: Pack the order
//         const packRes = await fetch(
//           `https://grozziie.zjweiting.com:3091/lazada-open-shop/fulfillment/pack2`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Accept: "*/*",
//             },
//             body: JSON.stringify({
//               pack_order_list: [
//                 {
//                   order_item_list: orderItemIds, // ✅ no nested array
//                   order_id: orderId,
//                 },
//               ],
//               delivery_type: "dropship",
//               shipment_provider_code: shipmentProviderCode,
//               shipping_allocate_type: shippingAllocateType,
//             }),
//           }
//         );

//         const packResult = await packRes.json();

//         if (packResult?.result?.success) {
//           console.log(`✅ Packed order ${orderId}`, packResult);
//           successfulIds.push(orderId);
//         } else {
//           console.warn(
//             `❌ Failed to pack order ${orderId}`,
//             packResult?.result?.error_msg
//           );
//           failedOrders.push({
//             orderId,
//             reason: packResult?.result?.error_msg || "Packing failed",
//           });
//         }
//       }

//       // ✅ Remove only successful
//       const restOfOrders = filteredData.filter(
//         (item) => !successfulIds.includes(item?.id)
//       );
//       setFilteredData(restOfOrders.slice(0, 5));
//       dispatch(checkedItemsChange({ items: [], from: lazadaOrderStatusCheck }));
//       setCheckedItems([]);
//       setSelectAll(false);
//       setIsConfirmModalOpen(false);

//       if (failedOrders.length > 0) {
//         setModalTitle(
//           <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
//             <TiInfoOutline className="w-10 h-10 text-red-600" />
//           </div>
//         );
//         setModalMessage(
//           <div>
//             <p className="text-red-600 flex justify-center font-semibold mb-2">
//               ⚠️ {failedOrders.length} {t("ordersFailedToPack")}
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
//         console.log("✅ All selected orders packed successfully!");
//       }
//     } catch (error) {
//       console.error("🚨 Error packing orders:", error);
//       toast.error("Unexpected error occurred. Please try again.", {
//         autoClose: false,
//         position: "top-right",
//       });
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
//           // Construct nested structure from flat row fields
//           return {
//             order_id: row.order_id,
//             order_number: row.order_number,
//             customer_first_name: row.customer_first_name,
//             customer_last_name: row.customer_last_name,
//             payment_method: row.payment_method,
//             price: row.price,
//             items_count: row.items_count,
//             shipping_fee: row.shipping_fee,
//             warehouse_code: row.warehouse_code,
//             voucher: row.voucher,
//             voucher_code: row.voucher_code,
//             statuses:
//               typeof row.statuses === "string"
//                 ? row.statuses.split(",").map((s) => s.trim())
//                 : Array.isArray(row.statuses)
//                 ? row.statuses
//                 : [],
//             updated_at: row.updated_at,
//             created_at: row.created_at,
//             address_billing: {
//               address1: row.address_billing_address1,
//               address2: row.address_billing_address2,
//               address3: row.address_billing_address3,
//               address4: row.address_billing_address4,
//               address5: row.address_billing_address5,
//               city: row.address_billing_city,
//               country: row.address_billing_country,
//               first_name: row.address_billing_first_name,
//               last_name: row.address_billing_last_name,
//               phone: row.address_billing_phone,
//               phone2: row.address_billing_phone2,
//               post_code: row.address_billing_post_code,
//             },
//             address_shipping: {
//               address1: row.address_shipping_address1,
//               address2: row.address_shipping_address2,
//               address3: row.address_shipping_address3,
//               address4: row.address_shipping_address4,
//               address5: row.address_shipping_address5,
//               city: row.address_shipping_city,
//               country: row.address_shipping_country,
//               first_name: row.address_shipping_first_name,
//               last_name: row.address_shipping_last_name,
//               phone: row.address_shipping_phone,
//               phone2: row.address_shipping_phone2,
//               post_code: row.address_shipping_post_code,
//             },
//             // Add any other fields you want from row here...
//             // For example:
//             buyer_note: row.buyer_note || "",
//             delivery_info: row.delivery_info || "",
//             extra_attributes: row.extra_attributes || "",
//             gift_message: row.gift_message || "",
//             gift_option: row.gift_option === "true" || row.gift_option === true,
//             national_registration_number:
//               row.national_registration_number || "",
//             remarks: row.remarks || "",
//             shipping_fee_discount_platform: row.shipping_fee_discount_platform,
//             shipping_fee_discount_seller: row.shipping_fee_discount_seller,
//             shipping_fee_original: row.shipping_fee_original,
//             tax_code: row.tax_code || "",
//             voucher_platform: row.voucher_platform,
//             voucher_seller: row.voucher_seller,
//             branch_number: row.branch_number || "",
//             recipient_info: row.recipient_info || {},
//             // etc.
//           };
//         });

//         // Now merge with existing data according to your status
//         if (lazadaOrderStatusCheck === "Waiting For Shipment") {
//           const merged = [...importedData, ...customersData];
//           setCustomersData(merged);
//           dispatch(orderListData(merged));
//           setTotalPart(Math.ceil(merged.length / 5));
//           toast.success(
//             "Import file stored as Awaiting for Shipment Data successfully"
//           );
//         } else if (lazadaOrderStatusCheck === "shipped") {
//           const merged = [...importedData, ...customersData];
//           setCustomersData(merged);
//           dispatch(orderListData(merged));
//           setTotalPart(Math.ceil(merged.length / 5));
//           toast.success("Import file stored as Printing Data successfully");
//         }
//       } catch (err) {
//         console.error("Failed to import Excel file:", err);
//         toast.error("Failed to process Excel file");
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
//     const filteredMultipleSearchingData = filterLazadaDataBySearchFields(
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
//           setLazadaOrderStatusCheck={setLazadaOrderStatusCheck}
//           lazadaOrderStatusCheck={lazadaOrderStatusCheck}
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
//           currentShop="Lazada"
//           setSelectedStatus={setSelectedStatus}
//         />

//         {/* middle section */}
//         {/* <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] p-4 mt-5 grid grid-cols-12 gap-20">
//           <div className="col-span-2">
//             <BatchPrinterModal />
//           </div>
//           <div className="col-span-10 custom-scrollbar">
//             <StoredDeliveryCompanyList />
//           </div>
//         </div> */}

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
//                 onClick={handleLazadaPrinterExcelClick}
//                 className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[115px] h-10 px-8 py-2 rounded-md cursor-pointer"
//               >
//                 <p className="text-[15px] font-medium capitalize cursor-pointer whitespace-nowrap">
//                   {t("Export")}
//                 </p>
//               </button>
//             </div>
//           </div>

//           {/* table */}
//           {getLazadaOrders && (
//             <LazadaBatchPrintTable
//               filteredData={filteredData}
//               isError={isError}
//               isLoading={lazadaLoading}
//               selectedCustomer={selectedCustomer}
//               handleDetailsClick={handleDetailsClick}
//               isModalOpen={isModalOpen}
//               closeModal={closeModal}
//               checkedItems={checkedItems}
//               handleCheckboxChange={handleCheckboxChange}
//               lazadaOrderStatusCheck={lazadaOrderStatusCheck}
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
//           {(lazadaOrderStatusCheck === "Packed" ||
//             lazadaOrderStatusCheck === "ready_to_ship" ||
//             lazadaOrderStatusCheck === "Packed_Printed") && (
//             <button
//               onClick={handleToCheckItemsShippingUpdate}
//               className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-auto h-10 px-4 gap-2 py-2 rounded-md cursor-pointer flex items-center justify-center"
//             >
//               <MdOutlineLocalPrintshop className="w-[18px] h-[18px]" />
//               <p className="text-[15px] font-medium leading-normal capitalize pl-1">
//                 {lazadaOrderStatusCheck === "Packed"
//                   ? t("OrderShippingAndPrint")
//                   : t("PrintAWBAgain")}
//               </p>
//             </button>
//           )}

//           {lazadaOrderStatusCheck === "pending" && (
//             <button
//               onClick={handleToCheckItemsPackageUpdate}
//               className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-auto  h-10 px-4 gap-2 py-2 rounded-md cursor-pointer flex items-center justify-center"
//             >
//               <MdOutlineLocalPrintshop className="w-[18px] h-[18px]" />
//               <p className="text-[15px] font-medium leading-normal capitalize pl-1">
//                 {t("OrderAcceptedAndPackages")}
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
//           />
//           {/* </Link> */}
//           {selectedCustomer && isModalOpen && (
//             <dialog
//               id="lazada_modal"
//               className="modal backdrop-blur-sm bg-black/10 fixed inset-0 z-50 flex items-center justify-center"
//               open={isModalOpen}
//             >
//               <div className="modal-box w-[900px] max-w-full bg-white shadow-xl rounded-2xl p-8 overflow-y-auto max-h-[90vh]">
//                 {/* Header */}
//                 <div className="flex items-center justify-center mb-6">
//                   <h2 className="text-3xl font-semibold text-[#004368]">
//                     {t("LazadaOrderDetails")}
//                   </h2>
//                 </div>

//                 {/* Main Order Info Grid */}
//                 <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
//                   <div>
//                     <strong>{t("OrderID")}:</strong>{" "}
//                     {selectedCustomer?.order_number || t("NoData")}
//                   </div>
//                   <div>
//                     <strong>{t("Status")}:</strong>{" "}
//                     <span className="text-blue-700 font-semibold">
//                       {selectedCustomer?.statuses[0] || t("NoData")}
//                     </span>
//                   </div>
//                   <div>
//                     <strong>{t("Warehouse")}:</strong>{" "}
//                     {selectedCustomer?.warehouse_code || t("NoData")}
//                   </div>
//                   <div>
//                     <strong>{t("TrackingCode")}:</strong>{" "}
//                     {selectedCustomer?.orderItemInfo[0]?.tracking_code ||
//                       t("NoData")}
//                   </div>
//                   <div>
//                     <strong>{t("ShippingProvider")}:</strong>{" "}
//                     {selectedCustomer?.orderItemInfo?.[0]?.shipment_provider ||
//                       t("NoData")}
//                   </div>
//                   <div>
//                     <strong>{t("ShippingType")}:</strong>{" "}
//                     {selectedCustomer?.orderItemInfo?.[0]?.shipping_type ||
//                       t("NoData")}
//                   </div>
//                   <div>
//                     <strong>{t("DeliveryOption")}:</strong>{" "}
//                     {selectedCustomer?.orderItemInfo?.[0]
//                       ?.shipping_provider_type || t("NoData")}
//                   </div>
//                   <div>
//                     <strong>{t("PaymentMethod")}:</strong>{" "}
//                     {selectedCustomer?.payment_method || t("NoData")}
//                   </div>
//                   <div>
//                     <strong>{t("Price")}:</strong>{" "}
//                     {selectedCustomer?.price ?? 0}{" "}
//                     {selectedCustomer?.orderItemInfo?.[0]?.currency}
//                   </div>
//                   <div>
//                     <strong>{t("ShippingFee")}:</strong>{" "}
//                     {selectedCustomer?.shipping_fee ?? 0}
//                   </div>
//                   <div>
//                     <strong>{t("CreatedAt")}:</strong>{" "}
//                     {new Date(selectedCustomer?.created_at).toLocaleString()}
//                   </div>
//                   <div>
//                     <strong>{t("UpdatedAt")}:</strong>{" "}
//                     {new Date(selectedCustomer?.updated_at).toLocaleString()}
//                   </div>
//                 </div>

//                 {/* Divider */}
//                 <hr className="my-6" />

//                 {/* Customer Info */}
//                 <h3 className="text-xl font-semibold mb-4">
//                   {t("CustomerInfo")}
//                 </h3>
//                 <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
//                   <div>
//                     <strong>{t("CustomerName")}:</strong>{" "}
//                     {selectedCustomer?.customer_first_name || t("NoData")}
//                   </div>
//                   <div>
//                     <strong>{t("Phone")}:</strong>{" "}
//                     {selectedCustomer?.address_shipping?.phone || t("NoData")}
//                   </div>
//                   <div>
//                     <strong>{t("Address")}:</strong>{" "}
//                     {[
//                       selectedCustomer?.address_shipping?.country,
//                       selectedCustomer?.address_shipping?.city,
//                       selectedCustomer?.address_shipping?.post_code,
//                       selectedCustomer?.address_shipping?.address1,
//                     ]
//                       .filter(Boolean)
//                       .join(", ")}
//                   </div>
//                 </div>

//                 {/* Divider */}
//                 <hr className="my-6" />

//                 {/* Order Items List */}
//                 <div>
//                   <h3 className="text-xl font-semibold mb-4">
//                     {t("OrderItems")}
//                   </h3>
//                   {selectedCustomer?.orderItemInfo?.length > 0 ? (
//                     <div className="space-y-4 max-h-[40vh] overflow-y-auto">
//                       {selectedCustomer.orderItemInfo.map((item, idx) => (
//                         <div
//                           key={item.order_item_id || idx}
//                           className="flex gap-4 items-center border p-4 rounded-lg shadow-sm"
//                         >
//                           <img
//                             src={
//                               item.product_main_image ||
//                               "https://via.placeholder.com/80"
//                             }
//                             alt={item.name || t("NoData")}
//                             className="w-20 h-20 object-cover rounded-md border"
//                           />
//                           <div className="flex-1">
//                             <p>
//                               <strong>{t("Product")}:</strong>{" "}
//                               {item.name || t("NoData")}
//                             </p>
//                             <p>
//                               <strong>{t("SKU")}:</strong>{" "}
//                               {item.sku || t("NoData")}
//                             </p>
//                             <p>
//                               <strong>{t("Variation")}:</strong>{" "}
//                               {item.variation || t("NoData")}
//                             </p>
//                             <p>
//                               <strong>{t("ItemPrice")}:</strong>{" "}
//                               {item.item_price ?? 0}
//                             </p>
//                             <p>
//                               <strong>{t("PaidPrice")}:</strong>{" "}
//                               {item.paid_price ?? 0}
//                             </p>
//                             <p>
//                               <strong>{t("Status")}:</strong>{" "}
//                               {item.status || t("NoData")}
//                             </p>
//                             <p>
//                               <strong>{t("ProductDetailURL")}:</strong>{" "}
//                               <a
//                                 href={item.product_detail_url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-blue-600 underline"
//                               >
//                                 {t("ViewProduct")}
//                               </a>
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

// export default LazadaBatchPrint;

import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { checkedItemsChange } from "../../features/slice/userSlice";
import { useTranslation } from "react-i18next";
import { lazadaArrayToExcel } from "../../Share/Function/FunctionalComponent";
import ConfirmationModal from "../../Share/ConfirmationModal";
import { TiInfoOutline } from "react-icons/ti";
import { AiOutlineCheckCircle } from "react-icons/ai";

// Custom hooks
import { useLazadaOrderStatus } from "./lazadaHooks/useLazadaOrderStatus";
import { useCheckboxSelection } from "./lazadaHooks/useCheckboxSelection";
import { usePagination } from "./lazadaHooks/usePagination";
import { useOrderData } from "./lazadaHooks/useOrderData";
import { useModalStates } from "./lazadaHooks/useModalStates";
import { useLazadaOrders } from "./lazadaHooks/useLazadaOrders";

// Components
import SearchSection from "./lazadaComponents/SearchSection";
import TableHeader from "./lazadaComponents/TableHeader";
import ActionButtons from "./lazadaComponents/ActionButtons";
import OrderDetailsModal from "./lazadaComponents/OrderDetailsModal";
import LazadaBatchPrintTable from "./LazadaBatchPrintTable";
import axios from "axios";
import toast from "react-hot-toast";

const LazadaBatchPrint = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const lazadaAppKey = localStorage.getItem("lazadaAppKey");
  const lazadaAuthCountry = localStorage.getItem("lazadaAuthCountry");

  // Custom hooks
  const { lazadaOrderStatusCheck, setLazadaOrderStatusCheck, selectedStatus } =
    useLazadaOrderStatus();
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

  // Use the complete Lazada orders hook
  const { filteredData, setFilteredData, lazadaLoading } = useLazadaOrders({
    lazadaOrderStatusCheck,
    setLazadaOrderStatusCheck,
    setCustomersData,
    clearSelection,
    location,
  });

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
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );

  // Handlers - same as before
  const handleLazadaPrinterExcelClick = useCallback(() => {
    lazadaArrayToExcel(checkedItems, "lazadaPrinterOrderList");
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
          {lazadaOrderStatusCheck === "Packed"
            ? t("AreYouSureToPrintForReadyToShip")
            : t("DoYouWantPrintAWBAgain")}
        </p>,
        handleConfirmShipping,
        true
      );
    }
  }, [checkedItems.length, lazadaOrderStatusCheck, t, openConfirmModal]);

  const handleConfirmShipping = useCallback(async () => {
    try {
      const allOrderItems = [];

      for (const item of checkedItems) {
        const { order_id } = item;

        try {
          const response = await axios.get(
            `https://grozziie.zjweiting.com:3091/lazada-open-shop-country/api/dev/orders/items`,
            {
              params: {
                orderId: order_id,
                countryCode: lazadaAuthCountry, // add appKey here
              },
              headers: {
                Accept: "*/*",
              },
            }
          );

          const rawBody = response?.data?.body;
          const parsedBody = JSON.parse(rawBody);
          const data = parsedBody?.data;

          if (!Array.isArray(data)) {
            throw new Error("Invalid data format for order_id: " + order_id);
          }

          // Push as grouped data under each order_id
          allOrderItems.push({ order_id, data });
        } catch (error) {
          console.error("❌ Error fetching order:", order_id, error);
          toast.error(`Failed to fetch order ${order_id}`);
          return; // Stop on first error
        }
      }

      // All requests succeeded, now dispatch and navigate
      dispatch(
        checkedItemsChange({
          items: allOrderItems, // Now an array of { order_id, data }
          from: lazadaOrderStatusCheck,
        })
      );

      navigate("/onlineprint/lazadaAWBPrinting");
      closeConfirmModal();
    } catch (error) {
      console.error("🚨 Error in handleConfirmShipping:", error);
      toast.error("Failed to process shipping request");
    }
  }, [
    dispatch,
    checkedItems,
    lazadaOrderStatusCheck,
    navigate,
    closeConfirmModal,
  ]);

  const handleConfirmPackage = useCallback(async () => {
    try {
      const successfulIds = [];
      const failedOrders = [];

      for (const item of checkedItems) {
        const orderId = item?.order_id;

        if (!orderId) {
          console.warn("Missing orderId");
          failedOrders.push({ orderId: "Unknown", reason: "Missing order ID" });
          continue;
        }

        // Step 1: Get order item ID
        const itemRes = await fetch(
          // `https://grozziie.zjweiting.com:3091/lazada-open-shop/api/dev/orders/items?orderId=${orderId}`
          // `https://grozziie.zjweiting.com:3091/lazada-open-shop-debug/api/dev/orders/items?orderId=${orderId}&appKey=${lazadaAppKey}`
          `https://grozziie.zjweiting.com:3091/lazada-open-shop-country/api/dev/orders/items?orderId=${orderId}&countryCode=${lazadaAuthCountry}`
        );
        const itemData = await itemRes.json();

        // Lazada already returns object → don't double parse
        const parsedBody = JSON.parse(itemData?.body);

        console.log(parsedBody.data, "parsed");

        const orderItemIds =
          parsedBody?.data?.map((it) => it.order_item_id.toString()) || [];

        if (!orderItemIds.length) {
          console.warn("No order_item_id found for order", orderId);
          failedOrders.push({ orderId, reason: "No order_item_id found" });
          continue;
        }

        console.log(
          { order_id: orderId, order_item_ids: orderItemIds },
          "shipment provider payload"
        );

        // Step 2: Get shipment provider
        const shipmentRes = await fetch(
          // `https://grozziie.zjweiting.com:3091/lazada-open-shop/fulfillment/order/shipment-provider`,
          `https://grozziie.zjweiting.com:3091/lazada-open-shop-country/fulfillment/order/shipment-provider?countryCode=${encodeURIComponent(
            lazadaAuthCountry
          )}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
            },
            body: JSON.stringify({
              orders: [
                {
                  order_id: orderId,
                  order_item_ids: orderItemIds, // ✅ correct
                },
              ],
            }),
          }
        );

        const shipmentData = await shipmentRes.json();
        const providerInfo = shipmentData?.result?.data;

        if (!providerInfo?.shipment_providers?.length) {
          console.warn(
            "No shipment providers found for order",
            providerInfo,
            orderId
          );
          failedOrders.push({ orderId, reason: "No shipment providers found" });
          continue;
        }

        const shipmentProviderCode =
          providerInfo?.shipment_providers[0]?.provider_code;
        const shippingAllocateType = providerInfo?.shipping_allocate_type;
        console.log(
          shipmentProviderCode,
          shippingAllocateType,
          "log shipment provider"
        );

        // Step 3: Pack the order
        const packRes = await fetch(
          `https://grozziie.zjweiting.com:3091/lazada-open-shop/fulfillment/pack2?countryCode=${encodeURIComponent(
            lazadaAuthCountry
          )}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
            },
            body: JSON.stringify({
              pack_order_list: [
                {
                  order_item_list: orderItemIds, // ✅ no nested array
                  order_id: orderId,
                },
              ],
              delivery_type: "dropship",
              shipment_provider_code: shipmentProviderCode,
              shipping_allocate_type: shippingAllocateType,
            }),
          }
        );

        const packResult = await packRes.json();

        if (packResult?.result?.success) {
          console.log(`✅ Packed order ${orderId}`, packResult);
          successfulIds.push(orderId);
        } else {
          console.warn(
            `❌ Failed to pack order ${orderId}`,
            packResult?.result?.error_msg
          );
          failedOrders.push({
            orderId,
            reason: packResult?.result?.error_msg || "Packing failed",
          });
        }
      }

      // ✅ Remove only successful orders from current view
      const restOfOrders = customersData.filter(
        (item) => !successfulIds.includes(item?.order_id)
      );
      setCustomersData(restOfOrders);
      dispatch(checkedItemsChange({ items: [], from: lazadaOrderStatusCheck }));
      setCheckedItems([]);
      setSelectAll(false);
      closeConfirmModal();

      if (failedOrders.length > 0) {
        openConfirmModal(
          <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
            <TiInfoOutline className="w-10 h-10 text-red-600" />
          </div>,
          <div>
            <p className="text-red-600 flex justify-center font-semibold mb-2">
              ⚠️ {failedOrders.length} {t("ordersFailedToPack")}
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-700 max-h-60 overflow-y-auto">
              {failedOrders.map((f, index) => (
                <li key={index}>
                  <strong>{f.orderId}:</strong> {f.reason}
                </li>
              ))}
            </ul>
          </div>,
          null,
          false
        );
      } else {
        console.log("✅ All selected orders packed successfully!");
        toast.success("All orders packed successfully!");
      }
    } catch (error) {
      console.error("🚨 Error packing orders:", error);
      toast.error("Unexpected error occurred. Please try again.", {
        autoClose: false,
        position: "top-right",
      });
    }
  }, [
    checkedItems,
    customersData,
    setCustomersData,
    dispatch,
    lazadaOrderStatusCheck,
    setCheckedItems,
    setSelectAll,
    closeConfirmModal,
    openConfirmModal,
    t,
  ]);

  console.log(selectedStatus, "lazada Setected");

  return (
    <div className="bg-[#004368] bg-opacity-5 w-full h-screen">
      <div className="px-[30px] pt-6 pb-4">
        <SearchSection
          lazadaOrderStatusCheck={lazadaOrderStatusCheck}
          setLazadaOrderStatusCheck={setLazadaOrderStatusCheck}
          customersData={customersData}
          setFilteredData={setFilteredData}
        />

        <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] p-4 mt-5">
          <TableHeader
            selectAll={selectAll}
            onSelectAllChange={() => handleMasterCheckboxChange(customersData)}
            checkedItemsCount={checkedItems.length}
            selectedStatus={selectedStatus}
            totalOrders={customersData.length}
            pagination={pagination}
            onExport={handleLazadaPrinterExcelClick}
            t={t}
          />

          <LazadaBatchPrintTable
            filteredData={pagination.currentData}
            isLoading={lazadaLoading}
            selectedCustomer={selectedCustomer}
            handleDetailsClick={openDetailsModal}
            isModalOpen={isDetailsModalOpen}
            closeModal={closeDetailsModal}
            checkedItems={checkedItems}
            handleCheckboxChange={(order) =>
              handleCheckboxChange(order, pagination.currentData)
            }
            lazadaOrderStatusCheck={lazadaOrderStatusCheck}
          />
        </div>
      </div>

      {/* Action buttons and modals remain the same */}
      <div className="mt-4 mr-8">
        <ActionButtons
          lazadaOrderStatusCheck={lazadaOrderStatusCheck}
          onPackageUpdate={handleToCheckItemsPackageUpdate}
          onShippingUpdate={handleToCheckItemsShippingUpdate}
          t={t}
        />
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        title={modalTitle}
        message={modalMessage}
        onClose={closeConfirmModal}
        onConfirm={confirmAction}
        showConfirmButton={showConfirmButton}
        selectedLanguage={selectedLanguage}
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

export default LazadaBatchPrint;
