import React, { useEffect, useState } from "react";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { arrayToExcel } from "../../Share/Function/FunctionalComponent";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  checkedExpressChange,
  checkedItemsChange,
  printedDataFromRedux,
} from "../../features/slice/userSlice";
import * as XLSX from "xlsx";
import {
  useGetBatchPrintQuery,
  useLoadOrderListMutation,
} from "../../features/allApis/batchPrintApi";
import BatchPrintTable from "./BatchPrintTable";
import BatchPrinterModal from "./BatchPrinterModal";
import StoredDeliveryCompanyList from "../../Share/StoredDeliveryCompanyList/StoredDeliveryCompanyList";
import {
  useGetShippedDataUsQuery,
  useSetShippedDataUsMutation,
} from "../../features/allApis/shippedDataGetUsApi";
import NewSearchComponent from "../../Share/SearchComponent/NewSearchComponent";
import { filterDataBySearchFieldsBatchPrint } from "../../Share/SearchComponent/SearchComponentFunction";
import toast from "react-hot-toast";
import { orderListData } from "../../features/slice/orderListSlice";
import ConfirmationModal from "../../Share/ConfirmationModal";
import { TiInfoOutline } from "react-icons/ti";
import { AiOutlineCheckCircle } from "react-icons/ai";
import {
  fetchAvailableWaybills,
  fetchLogisticCompanies,
} from "./BatchPrinterFunctions";
import { shopDeliveryCompanyList } from "../../features/slice/shopDeliveryCompanySlice";

const BatchPrint = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const orderListDataGet = useSelector((state) => state.orderList.data);
  const [totalOrderData, setTotalOrderData] = useState(orderListDataGet);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [tikTokOrderStatusCheck, setTikTokOrderStatusCheck] =
    useState("AWAITING_SHIPMENT");
  const [tikTokPrintedIds, setTikTokPrintedIds] = useState([]);

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
    startDate,
    endDate,
  });
  const [isActiveBtnRecipientAddress, setIsActiveBtnRecipientAddress] =
    useState(false);
  const [isActiveBtnOrderId, setIsActiveBtnOrderId] = useState(false);
  const [isActiveBtnAccountName, setIsActiveBtnAccountName] = useState(false);
  const [isActiveBtnProduct, setIsActiveBtnProduct] = useState(false);
  const [isActiveBtnAmount, setIsActiveBtnAmount] = useState(false);
  const [printedData, setPrintedData] = useState([]);
  const [cipher, setCipher] = useState(() => {
    const stored = localStorage.getItem("tiktokShopInfo");
    return stored ? JSON.parse(stored) : [];
  });
  const { t } = useTranslation();
  const [postShippedDataToApi] = useSetShippedDataUsMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Data post request send and return data get
  const [loadOrderList, { isLoading, isError }] = useLoadOrderListMutation();

  // shipped Data Get from our server (Already Printed)
  const { data: printed, isLoading: isPrintedLoading } =
    useGetShippedDataUsQuery();

  useEffect(() => {
    dispatch(printedDataFromRedux(printed));
    setPrintedData(printed);
  }, [printed]);

  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );

  const handleToReset = () => {
    setFilteredData(customersData?.slice(0, 5));
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
    setStartDate(new Date());
    setEndDate(new Date());
    setIsActiveBtnRecipientAddress(false);
    setIsActiveBtnOrderId(false);
    setIsActiveBtnAccountName(false);
    setIsActiveBtnProduct(false);
    setIsActiveBtnAmount(false);
  };

  // // this is the part to store orderList into local storage temporary
  // function storeDecryptedOrderList(decryptedOrderList) {
  //   try {
  //     // Convert the decryptedOrderList to a JSON string
  //     const serializedDecryptedOrderList = JSON.stringify(decryptedOrderList);

  //     // Store the serialized data in local storage under the key 'decryptedOrderList'
  //     localStorage.setItem("decryptedOrderList", serializedDecryptedOrderList);
  //   } catch (error) {
  //     console.error(
  //       "Error storing decrypted order list in local storage:",
  //       error
  //     );
  //   }
  // }
  // useEffect(() => {
  //   // Usage:
  //   storeDecryptedOrderList(loadOrderList);
  // }, [loadOrderList]);

  // start the functionalities to get all express delivery company list
  // call the function with useEffect to get the the company name list
  // const [deliveryCompanyName, setDeliveryCompanyName] = useState([]);
  // const [shopDeliveryCompanyName, setShopDeliveryCompanyName] = useState([]);
  // useEffect(() => {
  //   if (deliveryCompanyName) {
  //     fetchAvailableWaybills(deliveryCompanyName)
  //       .then((waybills) => {
  //         console.log(waybills);
  //         setShopDeliveryCompanyName(splitArrays(waybills));
  //         const ShopDeliveryCompanyNameList = splitArrays(waybills);
  //         dispatch(shopDeliveryCompanyList(ShopDeliveryCompanyNameList));
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching available waybills:", error);
  //       });
  //   }
  // }, [deliveryCompanyName]);
  // //call the function to get all logistics company list
  // function splitArrays(arrays) {
  //   const individualArrays = [];
  //   arrays.forEach((array) => {
  //     if (Array.isArray(array)) {
  //       array.forEach((eachArray) => {
  //         individualArrays.push(eachArray);
  //       });
  //     }
  //   });
  //   return individualArrays;
  // }

  // const fetchCompanies = async () => {
  //   try {
  //     const companies = await fetchLogisticCompanies();
  //     setDeliveryCompanyName(companies);
  //   } catch (error) {
  //     console.error("Failed to fetch logistic companies:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchCompanies(); // Call the function to fetch companies
  // }, []);

  // Function to handle the master checkbox change

  const handleMasterCheckboxChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // setCheckedItems(totalOrderData);
      setCheckedItems(currentCustomerData);
    } else {
      setCheckedItems([]);
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await loadOrderList({
  //         tikTokShopCipher: cipher[0]?.cipher,
  //       }).unwrap();
  //       const orders = response?.data?.orders;
  //       if (Array.isArray(orders) && orders.length > 0) {
  //         console.log(orders, "orders from the batch printer");

  //         const filteredOrderList = orders.filter(
  //           (item) => item?.buyerEmail && item?.status === "AWAITING_SHIPMENT"
  //         );

  //         dispatch(orderListData(filteredOrderList));
  //         setTotalOrderData(filteredOrderList);
  //       } else {
  //         console.warn(
  //           "No valid orders received or unexpected format",
  //           response
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [loadOrderList, cipher]);

  // Function to handle individual checkbox change

  useEffect(() => {
    const fetchPrintedIds = async () => {
      try {
        const res = await fetch("http://192.168.1.16:8888/api/dev/printedIds");
        const data = await res.json();
        console.log(data, "✅ Fetched printed IDs");

        if (Array.isArray(data)) {
          setTikTokPrintedIds(data);
        } else {
          throw new Error("Expected array but got invalid response");
        }
      } catch (err) {
        console.error("❌ Failed to fetch printed IDs:", err);
      }
    };

    fetchPrintedIds();
  }, [tikTokOrderStatusCheck]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const now = Math.floor(Date.now() / 1000);
  //       const fiveDaysAgo = now - 5 * 24 * 60 * 60;
  //       console.log(
  //         tikTokOrderStatusCheck,
  //         "status////////////////////////////////////"
  //       );
  //       console.log("response Start..................");
  //       const response = await loadOrderList({
  //         cipher: cipher[0]?.cipher,
  //         createTimeGe: fiveDaysAgo,
  //         createTimeLt: now,
  //         updateTimeGe: fiveDaysAgo,
  //         updateTimeLt: now,
  //         orderStatus: tikTokOrderStatusCheck, // You can parameterize this too
  //         pageSize: 100,
  //       }).unwrap();
  //       console.log("response..................", response);

  //       const orders = response?.data?.orders ?? [];

  //       if(tikTokOrderStatusCheck==="AWAITING_COLLECTION"){
  //         const filteredOrderList = orders.filter((item) => item?.buyerEmail);
  //       }

  //       const filteredOrderList = orders.filter((item) => item?.buyerEmail);

  //       dispatch(orderListData(filteredOrderList));
  //       setTotalOrderData(filteredOrderList);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   if (cipher?.[0]?.cipher) {
  //     fetchData();
  //   }
  // }, [cipher, dispatch, loadOrderList, tikTokOrderStatusCheck]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = Math.floor(Date.now() / 1000);
        const fiveDaysAgo = now - 10 * 24 * 60 * 60;

        const response = await loadOrderList({
          cipher: cipher[0]?.cipher,
          createTimeGe: fiveDaysAgo,
          createTimeLt: now,
          updateTimeGe: fiveDaysAgo,
          updateTimeLt: now,
          orderStatus:
            tikTokOrderStatusCheck === "AWAITING_COLLECTION_PRINTED"
              ? "AWAITING_COLLECTION"
              : tikTokOrderStatusCheck,
          pageSize: 100,
          sortOrder: "DESC",
        }).unwrap();

        const orders = response?.data?.orders ?? [];

        // Extract only the IDs that have already been printed
        const printedIdSet = new Set(
          tikTokPrintedIds.map((item) => item.tikTokPrintedId)
        );
        console.log(printedIdSet, "seet.................................");

        let filteredOrderList = orders.filter((item) => item?.buyerEmail);

        // If status is AWAITING_COLLECTION, filter out printed IDs
        if (tikTokOrderStatusCheck === "AWAITING_COLLECTION") {
          filteredOrderList = filteredOrderList.filter(
            (item) => !printedIdSet.has(item.id)
          );
        }
        // If status is AWAITING_COLLECTION, filter out printed IDs
        if (tikTokOrderStatusCheck === "AWAITING_COLLECTION_PRINTED") {
          filteredOrderList = filteredOrderList.filter((item) =>
            printedIdSet.has(item.id)
          );
        }

        dispatch(orderListData(filteredOrderList));
        setTotalOrderData(filteredOrderList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (cipher?.[0]?.cipher && tikTokPrintedIds) {
      fetchData();
    }
  }, [
    cipher,
    dispatch,
    loadOrderList,
    tikTokOrderStatusCheck,
    tikTokPrintedIds,
  ]);

  const handleCheckboxChange = (order) => {
    if (checkedItems.some((item) => item?.id === order?.id)) {
      // If the order id is already in the checkedItems, remove it
      const updatedItems = checkedItems.filter(
        (item) => item?.id !== order?.id
      );
      setCheckedItems(updatedItems);
      setSelectAll(false);
    } else {
      // If the customer id is not in the checkedItems, add it
      const updatedItems = [...checkedItems, order];
      setCheckedItems(updatedItems);
      if (updatedItems.length === totalOrderData?.length) {
        setSelectAll(true);
      }
    }
  };

  // pagination part
  const data = totalOrderData;
  const [showPage, setShowPage] = useState(1);
  const [currentBar, setCurrentBar] = useState(1);
  const [currentCustomerData, setCurrentCustomerData] = useState([]);
  const calculateTotalPart = () => {
    return Math.ceil(data.length / 5);
  };
  const [totalPart, setTotalPart] = useState(calculateTotalPart());
  const [customersData, setCustomersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [leftPaginationBtn, setLeftPaginationBtn] = useState(false);
  const [rightPaginationBtn, setRightPaginationBtn] = useState(true);

  useEffect(() => {
    const firstPageData = data.slice(0, 5);
    setTotalPart(Math.ceil(data.length / 5));
    setCustomersData(data);
    setFilteredData(firstPageData);
    setCurrentCustomerData(firstPageData);
  }, [tikTokOrderStatusCheck, totalOrderData, printedData]);

  useEffect(() => {
    if (totalPart <= 1) {
      setLeftPaginationBtn(false);
      setRightPaginationBtn(false);
    } else {
      setLeftPaginationBtn(false);
      setRightPaginationBtn(true);
    }
    setCurrentCustomerData(customersData?.slice(0, 5));
    setTotalPart(Math.ceil(customersData?.length / 5));
  }, [customersData]);

  useEffect(() => {
    setFilteredData(customersData?.slice(0, 5));
  }, [customersData]);

  // 5 data show in table function
  const handleToShowCurrentBarData = (count) => {
    // console.log(customersData, "currentShowBar");
    if (count <= totalPart) {
      const data = totalOrderData;
      const currentData = count * 5;
      setFilteredData(data?.slice(currentData - 5, currentData));
      setCurrentBar(count);
    }
  };

  const handleToNext = (count) => {
    if (count <= totalPart) {
      const currentDataIndex = count * 5;
      const nextPageData = data.slice(currentDataIndex - 5, currentDataIndex);
      setFilteredData(nextPageData);
      setCurrentBar(count);
      setLeftPaginationBtn(count > 1);
      setRightPaginationBtn(count < totalPart);
    }
  };

  // pagination prev option
  const handleToPrevious = (count) => {
    // const data =
    //   tikTokOrderStatusCheck === "Waiting For Shipment"
    //     ? totalOrderData
    //     : tikTokOrderStatusCheck === "shipped"
    //     ? printedData
    //     : [];

    if (count > 0) {
      if (count === 1) {
        setLeftPaginationBtn(false);
      } else {
        setLeftPaginationBtn(true);
      }

      if (count < totalPart) {
        setRightPaginationBtn(true);
      } else {
        setRightPaginationBtn(false);
      }

      const currentDataIndex = count * 5;
      setFilteredData(data.slice(currentDataIndex - 5, currentDataIndex));
      setCurrentBar(count);
    } else {
      setLeftPaginationBtn(false);
    }
  };

  console.log(fetchLogisticCompanies, "logistic company");

  // details modal functionality
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDetailsClick = (orderData) => {
    setSelectedCustomer(orderData);
    setIsModalOpen(true);
    // document.getElementById("my_modal_2").showModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Close modal if clicked outside the modal
  useEffect(() => {
    const handleClickOutsideModal = (e) => {
      if (e.target.tagName === "DIALOG" && isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener("click", handleClickOutsideModal);

    return () => {
      window.removeEventListener("click", handleClickOutsideModal);
    };
  }, [isModalOpen]);

  //make array to excel

  const handleBatchPrinterExcelClick = () => {
    arrayToExcel(checkedItems, "BatchPrinterOrderList");
  };

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [showConfirmButton, setShowConfirmButton] = useState(false);

  // modal show function
  const handleToCheckItemsPackageUpdate = () => {
    if (checkedItems.length === 0) {
      setModalTitle(
        <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
          <TiInfoOutline className="w-10 h-10 text-red-600" />
        </div>
      );
      setModalMessage(
        <p>
          {selectedLanguage === "zh-CN"
            ? "沒有選擇任何項目。"
            : "No items selected."}
        </p>
      );
      setConfirmAction(null);
      setShowConfirmButton(false);
      setIsConfirmModalOpen(true);
    } else {
      setModalTitle(
        <div className="bg-green-200 w-16 h-16 rounded-full flex items-center justify-center">
          <AiOutlineCheckCircle className="w-10 h-10 text-green-600" />
        </div>
      );
      setModalMessage(
        <p className="text-xl font-semibold">
          {selectedLanguage === "zh-CN"
            ? "您确定已经完成此订单的包装了吗？"
            : "Are you sure you have completed packaging this order?"}
        </p>
      );
      setConfirmAction(() => handleConfirmPackage);
      setShowConfirmButton(true);
      setIsConfirmModalOpen(true);
    }
  };

  const handleToCheckItemsShippingUpdate = () => {
    if (checkedItems.length === 0) {
      setModalTitle(
        <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
          <TiInfoOutline className="w-10 h-10 text-red-600" />
        </div>
      );
      setModalMessage(
        <p>
          {selectedLanguage === "zh-CN"
            ? "沒有選擇任何項目。"
            : "No items selected."}
        </p>
      );
      setConfirmAction(null);
      setShowConfirmButton(false);
      setIsConfirmModalOpen(true);
    } else {
      setModalTitle(
        <div className="bg-green-200 w-16 h-16 rounded-full flex items-center justify-center">
          <AiOutlineCheckCircle className="w-10 h-10 text-green-600" />
        </div>
      );
      setModalMessage(
        <p className="text-xl font-semibold">
          {selectedLanguage === "zh-CN"
            ? "您确定接受这个订单吗？"
            : "Are you sure to accept this order?"}
        </p>
      );
      setConfirmAction(() => handleConfirmShipping);
      setShowConfirmButton(true);
      setIsConfirmModalOpen(true);
    }
  };

  // const handleConfirm = () => {
  //   // Implement order update API logic here
  //   dispatch(
  //     checkedItemsChange({ items: checkedItems, from: tikTokOrderStatusCheck })
  //   );
  //   navigate("/batchprintexpressdelivery");
  // };
  console.log(filteredData, "filtered Data from batch");

  const fetchOrderListData = async (id) => {
    try {
      const response = await loadOrderList({
        tikTokShopCipher: cipher[0]?.cipher,
      }).unwrap();

      const orders = response?.data?.orders;

      if (Array.isArray(orders) && orders.length > 0) {
        const filteredOrderList = orders.filter((item) => item?.buyerEmail);

        dispatch(orderListData(filteredOrderList));
      } else {
        console.warn("No valid orders received or unexpected format", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const handleConfirm = async (id) => {
  //   const packageId = checkedItems[0]?.lineItems[0]?.packageId;
  //   const cipherValue = cipher[0]?.cipher;

  //   if (!packageId || !cipherValue) {
  //     console.warn("Missing packageId or cipher");
  //     return;
  //   }

  //   try {
  //     const url = `https://grozziie.zjweiting.com:3091/tiktokshop-partner/api/dev/package/ship-package?cipher=${encodeURIComponent(
  //       cipherValue
  //     )}&packageId=${encodeURIComponent(packageId)}`;

  //     const res = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     const result = await res.json();
  //     console.log("📦 Package created:", result);

  //     const restOfOrders = filteredData.filter(
  //       (item) => item?.id !== checkedItems[0]?.id
  //     );

  //     fetchOrderListData();
  //     setFilteredData(restOfOrders.slice(0, 5));

  //     // ✅ Close modal if successful
  //     setIsConfirmModalOpen(false); // <-- replace with your actual modal state control

  //     return result;
  //   } catch (error) {
  //     console.error("🚨 Error creating package:", error);
  //   }
  // };

  const handleConfirmPackage = async () => {
    const cipherValue = cipher[0]?.cipher;

    if (!cipherValue || checkedItems.length === 0) {
      console.warn("Missing cipher or no checked items");
      return;
    }

    try {
      const responses = await Promise.all(
        checkedItems.map(async (item) => {
          const packageId = item?.lineItems?.[0]?.packageId;

          if (!packageId) {
            console.warn(`Missing packageId for item with id ${item?.id}`);
            return null;
          }

          const url = `https://grozziie.zjweiting.com:3091/tiktokshop-partner/api/dev/package/ship-package?cipher=${encodeURIComponent(
            cipherValue
          )}&packageId=${encodeURIComponent(packageId)}`;

          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const result = await res.json();
          console.log(`📦 Package created for order ${item?.id}:`, result);
          return result;
        })
      );

      // Optional: Filter out successfully processed items
      const successfulIds = checkedItems.map((item) => item.id);
      const restOfOrders = filteredData.filter(
        (item) => !successfulIds.includes(item?.id)
      );
      setFilteredData(restOfOrders.slice(0, 5));
      setIsConfirmModalOpen(false); // close the modal
      dispatch(checkedItemsChange({ items: [], from: tikTokOrderStatusCheck }));
    } catch (error) {
      console.error("🚨 Error creating packages:", error);
    }
  };

  const handleConfirmShipping = async () => {
    dispatch(
      checkedItemsChange({ items: checkedItems, from: tikTokOrderStatusCheck })
    );
    navigate("/batchPrintPrinting");
    return;
    try {
      const item = checkedItems[0];
      const lineItemIds = item.lineItems.map((li) => li.id);
      const trackingNumber = item.lineItems[0].trackingNumber || "";
      const shippingProviderId = item.lineItems[0].shippingProviderId;

      const params = new URLSearchParams({
        cipher: cipher[0].cipher,
        orderNumber: item.id,
        setTrackingNumber: trackingNumber,
        shippingProviderId: shippingProviderId,
      });

      // Append array values manually
      lineItemIds.forEach((id) => {
        params.append("order_line_item_ids", id);
      });

      const url = `https://grozziie.zjweiting.com:3091/tiktokshop-partner/api/dev/package/mark/shipped?${params.toString()}`;

      console.log("📦 Shipping URL:", url);

      const res = await fetch(url, {
        method: "POST",
      });

      const result = await res.json();
      console.log("✅ Marked as shipped result:", result);
      return result;
    } catch (error) {
      console.error("🚨 Error marking package as shipped:", error);
      throw error;
    }
  };

  // const handleFileChange = async (e) => {
  //   const file = e.target.files[0];

  //   if (!file) {
  //     return;
  //   }
  //   const reader = new FileReader();
  //   reader.onload = async (e) => {
  //     // Make the callback async
  //     const data = new Uint8Array(e.target.result);
  //     const workbook = XLSX.read(data, { type: "array" });

  //     // Assuming the first sheet is the one you want to convert
  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];

  //     // Convert the sheet to an array of objects
  //     const jsonData = XLSX.utils.sheet_to_json(sheet);

  //     const updateJsonData = jsonData?.map((item, index) => {
  //       if (item) {
  //         item.item_list = [
  //           {
  //             goods_id: item?.goods_id,
  //             goods_count: item?.goods_count,
  //             goods_img: item?.goods_img,
  //             goods_name: item?.goods_name,
  //             goods_price: item?.goods_price,
  //             goods_spec: item?.goods_spec,
  //             outer_goods_id: item?.outer_goods_id,
  //             outer_id: item?.outer_id,
  //             sku_id: item?.sku_id,
  //           },
  //         ];
  //       }
  //       const {
  //         goods_id,
  //         goods_count,
  //         goods_img,
  //         goods_name,
  //         goods_price,
  //         goods_spec,
  //         outer_goods_id,
  //         sku_id,
  //         ...updateDataWithoutGoodsId
  //       } = item; // Destructure 'goods_id' from 'item'
  //       const updateData = { ...updateDataWithoutGoodsId };
  //       return updateData;
  //     });

  //     // setTotalOrderData([...totalOrderData, ...jsonData]);
  //     // console.log(tikTokOrderStatusCheck, "check status")
  //     if (tikTokOrderStatusCheck === "Waiting For Shipment") {
  //       // console.log(
  //       //   [...updateJsonData, ...customersData],
  //       //   "waiting for shipment"
  //       // );
  //       dispatch(orderListData([...updateJsonData, ...customersData]));
  //       setCustomersData([...updateJsonData, ...customersData]);
  //       setTotalPart(Math.ceil((totalOrderData.length + jsonData?.length) / 5));
  //       toast.success(
  //         "Import file Store as Awaiting for Shipment Data Successfully"
  //       );
  //     }
  //     if (tikTokOrderStatusCheck === "shipped") {
  //       // console.log(updateJsonData, "jsonData");

  //       const response = await postShippedDataToApi(updateJsonData[0]);
  //       if (response.error) {
  //         console.error("Error storing data:", response.error);
  //         toast.error("Failed To Store Import file Printing Data");
  //       } else {
  //         toast.success("Import file Store as Printing Data Successfully");
  //       }
  //       setCustomersData([...updateJsonData, ...customersData]);
  //       setTotalPart(Math.ceil((totalOrderData.length + jsonData?.length) / 5));
  //     }
  //     // setCustomersData([...updateJsonData, ...customersData]);
  //     // setTotalPart(Math.ceil((totalOrderData.length + jsonData?.length) / 5));
  //   };

  //   reader.readAsArrayBuffer(file);
  // };

  // const handleImportOrderClick = () => {
  //   // Trigger the hidden file input
  //   const fileInput = document.getElementById("fileInput");
  //   fileInput.click();
  // };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const updateJsonData = jsonData.map((item) => {
        return {
          id: item.orderId,
          buyerEmail: item.buyerEmail,
          commercePlatform: item.commercePlatform,
          createTime: item.createTime,
          paidTime: item.paidTime,
          paymentMethodName: item.paymentMethod,
          fulfillmentType: item.fulfillmentType,
          deliveryType: item.deliveryType,
          status: item.status,
          trackingNumber: item.trackingNumber,
          shippingProvider: item.shippingProvider,
          shippingProviderId: item.shippingProviderId || "",

          payment: {
            shippingFee: item.shippingFee,
            totalAmount: item.totalAmount,
          },

          recipientAddress: {
            name: item.recipientName,
            phoneNumber: item.phoneNumber,
            fullAddress: item.address,
            postalCode: item.postalCode,
          },

          lineItems: [
            {
              productId: item.productId,
              productName: item.productName,
              skuName: item.skuName,
              skuId: item.skuId,
              skuImage: item.skuImage,
              salePrice: item.salePrice,
              sellerSku: item.sellerSku,
              currency: item.currency,
              displayStatus: item.displayStatus,
              packageId: item.packageId,
            },
          ],
        };
      });

      // Conditional logic based on order status
      if (tikTokOrderStatusCheck === "AWAITING_SHIPMENT") {
        dispatch(orderListData([...updateJsonData, ...customersData]));
        setCustomersData([...updateJsonData, ...customersData]);
        setTotalPart(Math.ceil((totalOrderData.length + jsonData?.length) / 5));
        toast.success(
          "Import file stored as Awaiting Shipment data successfully"
        );
      }

      if (tikTokOrderStatusCheck === "AWAITING_COLLECTION") {
        const response = await postShippedDataToApi(updateJsonData[0]);
        if (response.error) {
          console.error("Error storing data:", response.error);
          toast.error("Failed to store import file as Printing data");
        } else {
          toast.success("Import file stored as Printing data successfully");
        }

        setCustomersData([...updateJsonData, ...customersData]);
        setTotalPart(Math.ceil((totalOrderData.length + jsonData?.length) / 5));
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleImportOrderClick = () => {
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
  };

  const handleToSearch = () => {
    document.getElementById("searchInput").value = "";
    // Usage:
    const filteredMultipleSearchingData = filterDataBySearchFieldsBatchPrint(
      customersData,
      searchFields
    );
    setFilteredData(filteredMultipleSearchingData);
  };

  return (
    <div className="bg-[#004368] bg-opacity-5 w-full h-screen">
      <div className="px-[30px] pt-6 pb-4">
        {/* top section */}
        <NewSearchComponent
          setStartDate={setStartDate}
          startDate={startDate}
          endDate={endDate}
          setEndDate={setEndDate}
          setTikTokOrderStatusCheck={setTikTokOrderStatusCheck}
          handleToSearch={handleToSearch}
          handleToReset={handleToReset}
          searchFields={searchFields}
          setSearchFields={setSearchFields}
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

        {/* middle section */}
        <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] p-4 mt-5 grid grid-cols-12 gap-20">
          {/* modal component */}
          <div className="col-span-2">
            <BatchPrinterModal />
          </div>
          <div className="col-span-10 custom-scrollbar">
            <StoredDeliveryCompanyList />
          </div>
        </div>

        {/* bottom section table */}
        <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] p-4 mt-5">
          {/* top */}

          {/* <div className="grid grid-cols-6 items-center justify-center px-7 pl-3 pt-2"> */}
          <div className="flex  items-center justify-between pl-3 pt-2">
            <div className="col-span-1 flex items-center justify-center cursor-pointer">
              <input
                type="checkbox"
                id="selectAll"
                name="selectAll"
                value="selectAll"
                checked={selectAll}
                onChange={handleMasterCheckboxChange}
                className="w-4 h-4 rounded-[2px] text-black text-opacity-60 bg-[#004368] cursor-pointer"
              />
              <label
                for="selectAll"
                className="text-black opacity-80 text-sm font-normal capitalize pl-2 pr-1"
              >
                {t("SelectAll")}
              </label>
              {/* this data coming from dynamic when items selected */}

              <span className="text-black opacity-80 text-xs font-light capitalize">
                ({checkedItems?.length} {t("Selected")})
              </span>
            </div>

            {/* dynamic show is it shipped or waiting for shipment */}
            <div className="col-span-1">
              <p className="text-[#004368] text-sm font-medium capitalize text-center">
                {/* {selectedLanguage === "zh-CN"
                  ? "等待发货"
                  : "waiting for shipment"} */}
                {t(tikTokOrderStatusCheck)}
              </p>
            </div>

            <div className="col-span-1 flex items-center justify-center">
              <p className="text-black opacity-40 text-sm font-medium capitalize">
                500 {t("Buyers")}
              </p>
              <div className="w-[1px] h-8 bg-black opacity-40 mx-2"></div>
              <p className="text-black opacity-40 text-sm font-medium capitalize">
                700 {t("Orders")}
              </p>
            </div>

            <div className="col-span-1 flex items-center justify-center">
              {/* <p className="text-[#004368] text-sm font-normal capitalize cursor-pointer">
                {selectedLanguage === "zh-CN" ? "拆分订单" : "split order"}
              </p>

              <div className="w-[1px] h-8 bg-[#004368] mx-2"></div> */}

              <input
                type="file"
                id="fileInput"
                accept=".xls, .xlsx"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <p
                onClick={handleImportOrderClick}
                className="text-[#004368] text-sm font-normal capitalize cursor-pointer"
              >
                {t("ImportOrder")}
              </p>
            </div>

            <div className="col-span-2 flex items-center justify-end">
              <div className=" mr-5">
                <div className="flex justify-center space-x-1 dark:text-gray-100">
                  <button
                    onClick={() => handleToPrevious(currentBar - 1)}
                    title="previous"
                    type="button"
                    className={`inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow-md bg-white dark:border-gray-800 ${
                      leftPaginationBtn ? "border-black" : ""
                    } `}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="[#0043681A]"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4"
                    >
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleToShowCurrentBarData(currentBar)}
                    type="button"
                    title="Page 1"
                    className={` inline-flex items-center justify-center w-8 h-8 text-sm font-semibold border rounded shadow-md bg-white ${
                      currentBar === showPage ? "text-[#004368]" : ""
                    }`}
                  >
                    {currentBar}
                  </button>
                  <button
                    onClick={() => handleToShowCurrentBarData(currentBar + 1)}
                    type="button"
                    className={`text-[#004368] text-opacity-20 inline-flex items-center justify-center w-8 h-8 text-sm border rounded shadow-md bg-white dark:border-gray-800  ${
                      currentBar === showPage ? "text-[#004368]" : ""
                    } `}
                    title="Page 2"
                  >
                    {currentBar + 1 > totalPart ? ".." : currentBar + 1}
                  </button>
                  <button
                    onClick={() => handleToShowCurrentBarData(currentBar + 2)}
                    type="button"
                    className={`text-[#004368] text-opacity-20 inline-flex items-center justify-center w-8 h-8 text-sm border rounded shadow-md bg-white dark:border-gray-800 ${
                      currentBar === showPage ? "text-[#004368]" : ""
                    }`}
                    title="Page 3"
                  >
                    {currentBar + 2 > totalPart ? ".." : currentBar + 2}
                  </button>
                  <button
                    onClick={() => handleToNext(currentBar + 1)}
                    title="next"
                    type="button"
                    className={`inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow-md bg-white dark:border-gray-200 ${
                      rightPaginationBtn ? "border-black" : ""
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="[#0043681A]"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
              {/* <div className="flex items-center justify-center px-7 cursor-pointer">
                <img src={Settings} alt="settings" className="w-4 h-4" />
                <p className="ml-2 text-[#004368] text-sm font-medium capitalize">
                  settings
                </p>
              </div> */}
              <button
                onClick={handleBatchPrinterExcelClick}
                className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[115px] h-10 px-8 py-2 rounded-md cursor-pointer"
              >
                <p className="text-[15px] font-medium capitalize cursor-pointer whitespace-nowrap">
                  {t("Export")}
                </p>
              </button>
            </div>
          </div>

          {/* table */}
          {loadOrderList && (
            <BatchPrintTable
              // loadOrderList={tikTokOrderStatusCheck === "Waiting For Shipment" ? totalOrderData?.slice(0, 5) : tikTokOrderStatusCheck === "shipped" ? printedData?.slice(0, 5) : null}
              // loadOrderList={currentCustomerData}
              filteredData={filteredData}
              isError={isError}
              isLoading={isLoading}
              isPrintedLoading={isPrintedLoading}
              selectedCustomer={selectedCustomer}
              handleDetailsClick={handleDetailsClick}
              isModalOpen={isModalOpen}
              closeModal={closeModal}
              checkedItems={checkedItems}
              handleCheckboxChange={handleCheckboxChange}
              data={printedData}
              tikTokOrderStatusCheck={tikTokOrderStatusCheck}
              startDate={startDate}
              endDate={endDate}
              cipher={cipher}
            />
          )}
        </div>
      </div>

      {/* end section button */}
      <div className="mt-4 mr-8 mb-96">
        <div className="flex items-center justify-end">
          {/* <button className="w-52 h-10 bg-white text-[#004368] rounded-md border flex items-center hover:bg-[#004368] hover:text-white p-2">
            <FaEdit className="w-4 h-4" />
            <span className="text-[15px] font-medium leading-normal capitalize pl-2">
              Create manual order
            </span>
          </button>
          <button
            className="w-52 h-10 bg-white text-[#004368]  hover:bg-[#004368] hover:text-white rounded-md border flex items-center p-2 ml-3">
            <MdOutlineLocalPrintshop className="w-[18px] h-[18px]" />
            <span className="text-[15px] font-medium leading-normal capitalize pl-1 hover:text-white">
              print express delivery
            </span>
          </button>

          <button className="w-52 h-10 bg-white text-[#004368]  hover:bg-[#004368] hover:text-white rounded-md border flex items-center p-2 ml-3">
            <TbTruckDelivery className="w-[18px] h-[18px]" />
            <span className="text-[15px] font-medium leading-normal capitalize pl-2">
              shipping same date
            </span>
          </button> */}

          {/* <Link to="/batchprintexpressdelivery"> */}
          {(tikTokOrderStatusCheck === "AWAITING_COLLECTION" ||
            tikTokOrderStatusCheck === "AWAITING_COLLECTION_PRINTED") && (
            <button
              onClick={handleToCheckItemsShippingUpdate}
              className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-auto  h-10 px-4 gap-2 py-2 rounded-md cursor-pointer flex items-center justify-center"
            >
              <MdOutlineLocalPrintshop className="w-[18px] h-[18px]" />
              <p className="text-[15px] font-medium leading-normal capitalize pl-1">
                {t("OrderShippingAndPrint")}
              </p>
            </button>
          )}

          {tikTokOrderStatusCheck === "AWAITING_SHIPMENT" && (
            <button
              onClick={handleToCheckItemsPackageUpdate}
              className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-auto  h-10 px-4 gap-2 py-2 rounded-md cursor-pointer flex items-center justify-center"
            >
              <MdOutlineLocalPrintshop className="w-[18px] h-[18px]" />
              <p className="text-[15px] font-medium leading-normal capitalize pl-1">
                {t("OrderAcceptedAndPackages")}
              </p>
            </button>
          )}

          <ConfirmationModal
            isOpen={isConfirmModalOpen}
            title={modalTitle}
            message={modalMessage}
            onClose={() => setIsConfirmModalOpen(false)}
            onConfirm={confirmAction}
            showConfirmButton={showConfirmButton}
            selectedLanguage={selectedLanguage}
          />
          {/* </Link> */}
          {selectedCustomer && isModalOpen && (
            <dialog
              id="my_modal_2"
              className="modal backdrop-blur-sm bg-black/10 fixed inset-0 z-50 flex items-center justify-center"
              open={isModalOpen}
            >
              <div className="modal-box w-[800px] max-w-full bg-white shadow-xl rounded-2xl p-8 overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-center items-center mb-6">
                  <h2 className="text-3xl font-semibold text-[#004368]">
                    TikTok Order Details
                  </h2>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <strong>Order Source:</strong>{" "}
                    {selectedCustomer?.commercePlatform}
                  </div>
                  <div>
                    <strong>Buyer Nickname:</strong>{" "}
                    {selectedCustomer?.recipientAddress?.name}
                  </div>

                  <div>
                    <strong>Buyer Email:</strong> {selectedCustomer?.buyerEmail}
                  </div>
                  <div>
                    <strong>Order ID:</strong> {selectedCustomer?.id}
                  </div>

                  <div>
                    <strong>Status:</strong>{" "}
                    <span className="text-blue-700 font-semibold">
                      {selectedCustomer?.status}
                    </span>
                  </div>
                  <div>
                    <strong>Package ID:</strong>{" "}
                    {selectedCustomer?.lineItems?.[0]?.packageId}
                  </div>

                  <div>
                    <strong>Tracking Number:</strong>{" "}
                    {selectedCustomer?.trackingNumber}
                  </div>
                  <div>
                    <strong>Shipping Provider:</strong>{" "}
                    {selectedCustomer?.shippingProvider}
                  </div>

                  <div>
                    <strong>Delivery Type:</strong>{" "}
                    {selectedCustomer?.deliveryType}
                  </div>
                  <div>
                    <strong>Delivery Option:</strong>{" "}
                    {selectedCustomer?.deliveryOptionName}
                  </div>

                  <div>
                    <strong>SKU:</strong>{" "}
                    {selectedCustomer?.lineItems?.[0]?.skuName}
                  </div>
                  <div>
                    <strong>SKU Price:</strong>{" "}
                    {selectedCustomer?.lineItems?.[0]?.salePrice}{" "}
                    {selectedCustomer?.payment?.currency}
                  </div>

                  <div>
                    <strong>Quantity:</strong>{" "}
                    {selectedCustomer?.lineItems?.length}
                  </div>
                  <div>
                    <strong>Shipping Fee:</strong>{" "}
                    {selectedCustomer?.payment?.shippingFee}
                  </div>

                  <div>
                    <strong>Total Amount:</strong>{" "}
                    {selectedCustomer?.payment?.totalAmount}{" "}
                    {selectedCustomer?.payment?.currency}
                  </div>
                  <div>
                    <strong>Payment Method:</strong>{" "}
                    {selectedCustomer?.paymentMethodName}
                  </div>

                  <div>
                    <strong>Paid Time:</strong>{" "}
                    {new Date(
                      selectedCustomer?.paidTime * 1000
                    ).toLocaleString()}
                  </div>
                  <div>
                    <strong>Region:</strong>{" "}
                    {selectedCustomer?.recipientAddress?.regionCode}
                  </div>
                </div>

                {/* Product & Image */}
                <div className="mt-6 flex items-start gap-4">
                  <img
                    src={selectedCustomer?.lineItems?.[0]?.skuImage}
                    alt="SKU"
                    className="w-28 h-28 object-cover rounded-lg border"
                  />
                  <div>
                    <p>
                      <strong>Product:</strong>{" "}
                      {selectedCustomer?.lineItems?.[0]?.productName}
                    </p>
                    <p>
                      <strong>Seller SKU:</strong>{" "}
                      {selectedCustomer?.lineItems?.[0]?.sellerSku}
                    </p>
                    <p>
                      <strong>Currency:</strong>{" "}
                      {selectedCustomer?.lineItems?.[0]?.currency}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="mt-6">
                  <strong>Shipping Address:</strong>
                  <p className="text-gray-600 mt-1">
                    {selectedCustomer?.recipientAddress?.fullAddress}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                  <button
                    onClick={closeModal}
                    className="bg-[#004368] hover:bg-[#00324d] text-white font-semibold px-8 py-2 rounded-lg transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchPrint;
