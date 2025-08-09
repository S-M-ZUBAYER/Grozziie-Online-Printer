import React, { useEffect, useState } from "react";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { arrayToExcel } from "../../Share/Function/FunctionalComponent";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkedItemsChange } from "../../features/slice/userSlice";
import * as XLSX from "xlsx";
import NewSearchComponent from "../../Share/SearchComponent/NewSearchComponent";
import { filterDataBySearchFieldsBatchPrint } from "../../Share/SearchComponent/SearchComponentFunction";
import toast from "react-hot-toast";
import { orderListData } from "../../features/slice/orderListSlice";
import ConfirmationModal from "../../Share/ConfirmationModal";
import { TiInfoOutline } from "react-icons/ti";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import LazadaBatchPrintTable from "./LazadaBatchPrintTable";
import StoredDeliveryCompanyList from "../../Share/StoredDeliveryCompanyList/StoredDeliveryCompanyList";
import BatchPrinterModal from "../BatchPrint/BatchPrinterModal";
import { useLazyGetLazadaOrdersQuery } from "../../features/allApis/lazadaApi";
import axios from "axios";

const LazadaBatchPrint = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [lazadaLoading, setLazadaLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const orderListDataGet = useSelector((state) => state.orderList.data);
  const [totalOrderData, setTotalOrderData] = useState(orderListDataGet);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const selectedLazadaOrderStatus = useSelector(
    (state) => state.user.lazadaSelectStatus
  );
  const [lazadaOrderStatusCheck, setLazadaOrderStatusCheck] = useState(
    selectedLazadaOrderStatus ? selectedLazadaOrderStatus : "pending"
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
    startDate,
    endDate,
  });
  const [isActiveBtnRecipientAddress, setIsActiveBtnRecipientAddress] =
    useState(false);
  const [isActiveBtnOrderId, setIsActiveBtnOrderId] = useState(false);
  const [isActiveBtnAccountName, setIsActiveBtnAccountName] = useState(false);
  const [isActiveBtnProduct, setIsActiveBtnProduct] = useState(false);
  const [isActiveBtnAmount, setIsActiveBtnAmount] = useState(false);
  const [lazadaPrintedIds, setLazadaPrintedIds] = useState([]);
  const [cipher, setCipher] = useState(() => {
    const stored = localStorage.getItem("tiktokShopInfo");
    return stored ? JSON.parse(stored) : [];
  });
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Data post request send and return data get
  // const [loadOrderList, { isLoading, isError }] = useLazyGetLazadaOrdersQuery();
  const [getLazadaOrders, { isLoading, isError }] =
    useLazyGetLazadaOrdersQuery();

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

  // Function to handle individual checkbox change
  const handleCheckboxChange = (order) => {
    if (checkedItems.some((item) => item?.order_id === order?.order_id)) {
      // If the order id is already in the checkedItems, remove it
      const updatedItems = checkedItems.filter(
        (item) => item?.order_id !== order?.order_id
      );
      setCheckedItems(updatedItems);
      setSelectAll(false);
    } else {
      // If the order id is not in the checkedItems, add it
      const updatedItems = [...checkedItems, order];
      setCheckedItems(updatedItems);
      if (updatedItems.length === totalOrderData?.length) {
        setSelectAll(true);
      }
    }
  };

  const data = totalOrderData;
  const [showPage, setShowPage] = useState(1);
  const [currentBar, setCurrentBar] = useState(1);
  const [currentCustomerData, setCurrentCustomerData] = useState([]);
  const calculateTotalPart = () => {
    return Math.ceil(data?.length / 5);
  };
  const [totalPart, setTotalPart] = useState(calculateTotalPart());
  const [customersData, setCustomersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [leftPaginationBtn, setLeftPaginationBtn] = useState(false);
  const [rightPaginationBtn, setRightPaginationBtn] = useState(true);

  useEffect(() => {
    const fetchPrintedIds = async () => {
      try {
        const res = await fetch(
          "https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/lazada/printedIds"
        );
        const data = await res.json();
        console.log(data, "✅ Fetched printed IDs");

        if (Array.isArray(data)) {
          setLazadaPrintedIds(data);
        } else {
          throw new Error("Expected array but got invalid response");
        }
      } catch (err) {
        console.error("❌ Failed to fetch printed IDs:", err);
      }
    };

    fetchPrintedIds();
  }, [lazadaOrderStatusCheck]);

  useEffect(() => {
    const fetchLazadaOrders = async () => {
      try {
        const now = new Date();
        const fiveDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const toISOString = (date) => date.toISOString().split(".")[0] + "Z";
        dispatch(
          checkedItemsChange({ items: [], from: lazadaOrderStatusCheck })
        );
        setCheckedItems([]);
        setSelectAll(false);
        setLazadaLoading(true); // ✅ set before trigger

        const response = await getLazadaOrders({
          sortBy: "updated_at",
          createdAfter: toISOString(fiveDaysAgo),
          createdBefore: toISOString(now),
          updateAfter: toISOString(fiveDaysAgo),
          updateBefore: toISOString(now),
          status:
            lazadaOrderStatusCheck === "Packed_Printed"
              ? "Packed"
              : lazadaOrderStatusCheck,
          sortDirection: "DESC",
          offset: 0,
          limit: 100,
        }).unwrap();

        const parsedBody = JSON.parse(response?.body || "{}");
        let filteredOrderList = parsedBody?.data?.orders;
        // Filter based on printed ID status
        const printedIdSet = new Set(
          lazadaPrintedIds.map((item) => item.lazadaPrintedId)
        );
        console.log(
          lazadaPrintedIds,
          printedIdSet,
          "printedIdSet",
          filteredOrderList,
          "filterd data"
        );

        if (lazadaOrderStatusCheck === "Packed") {
          filteredOrderList = filteredOrderList.filter(
            (item) => !printedIdSet.has(String(item.order_id))
          );
        } else if (lazadaOrderStatusCheck === "Packed_Printed") {
          filteredOrderList = filteredOrderList.filter((item) =>
            printedIdSet.has(String(item.order_id))
          );
        }

        dispatch(orderListData(filteredOrderList));
        setTotalOrderData(filteredOrderList);
      } catch (error) {
        console.error("❌ Lazada Order Fetch Error:", error);
      } finally {
        setLazadaLoading(false); // ✅ reset on finish
      }
    };

    if (lazadaOrderStatusCheck) {
      fetchLazadaOrders();
    }
  }, [getLazadaOrders, lazadaOrderStatusCheck, lazadaPrintedIds]);

  useEffect(() => {
    const firstPageData = data?.slice(0, 5);
    setTotalPart(Math.ceil(data?.length / 5));
    setCustomersData(data);
    setFilteredData(firstPageData);
    setCurrentCustomerData(firstPageData);
    setCurrentBar(1);
  }, [lazadaOrderStatusCheck, totalOrderData, lazadaOrderStatusCheck]);

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

  // details modal functionality
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDetailsClick = async (orderData) => {
    try {
      const orderId = orderData.order_id || orderData.order_number;
      if (!orderId) {
        console.warn("No order ID provided.");
        return;
      }
      setDetailsLoading(true);
      const response = await fetch(
        `https://grozziie.zjweiting.com:3091/lazada-open-shop/api/dev/orders/items?orderId=${orderId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch order item details.");
      }

      const result = await response.json();
      const parsedBody = JSON.parse(result.body);
      const itemDetails = parsedBody.data?.[0]; // Assuming you want the first item
      console.log(itemDetails, "details");

      setSelectedCustomer(itemDetails);
      setIsModalOpen(true);
      setDetailsLoading(false);
    } catch (error) {
      setDetailsLoading(false);
      console.error("Error fetching order item details:", error.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
      setModalMessage(<p>{t("NoItemsSelected")}</p>);
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
          {t("AreYouSureYouHaveCompletedPackagingThisOrder")}
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
      setModalMessage(<p>{t("NoItemsSelected")}</p>);
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
          {lazadaOrderStatusCheck === "Packed"
            ? t("AreYouSureToPrintForReadyToShip")
            : t("DoYouWantPrintAWBAgain")}
        </p>
      );
      setConfirmAction(() => handleConfirmShipping);
      setShowConfirmButton(true);
      setIsConfirmModalOpen(true);
    }
  };

  const createPackage = async () => {
    const packageId = checkedItems[0]?.lineItems[0]?.packageId;
    const cipherValue = cipher[0]?.cipher;

    try {
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
      console.log("📦 Single Package creation result:", result);
      return result;
    } catch (error) {
      console.error("🚨 Error creating package:", error);
      throw error;
    }
  };

  const handleConfirmShipping = async () => {
    const allOrderItems = [];

    for (const item of checkedItems) {
      const { order_id } = item;

      try {
        const response = await axios.get(
          `https://grozziie.zjweiting.com:3091/lazada-open-shop/api/dev/orders/items`,
          {
            params: { orderId: order_id },
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

    navigate("/lazadaAWBPrinting");
  };

  const handleConfirmPackage = async () => {
    const successfulIds = [];
    const failedOrders = [];

    try {
      for (const item of checkedItems) {
        const orderId = item?.order_id;

        if (!orderId) {
          console.warn("Missing orderId");
          failedOrders.push({ orderId: "Unknown", reason: "Missing order ID" });
          continue;
        }

        // Step 1: Get order item ID
        const itemRes = await fetch(
          `https://grozziie.zjweiting.com:3091/lazada-open-shop/api/dev/orders/items?orderId=${orderId}`
        );
        const itemData = await itemRes.json();
        const parsedBody = JSON.parse(itemData?.body ?? "{}");
        const orderItemId = parsedBody?.data?.[0]?.order_item_id;

        if (!orderItemId) {
          console.warn("No order_item_id found for order", orderId);
          failedOrders.push({ orderId, reason: "No order_item_id found" });
          continue;
        }

        // Step 2: Get shipment provider
        const shipmentRes = await fetch(
          `https://grozziie.zjweiting.com:3091/lazada-open-shop/fulfillment/order/shipment-provider`,
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
                  order_item_ids: [orderItemId],
                },
              ],
            }),
          }
        );
        const shipmentData = await shipmentRes.json();
        const providerInfo = shipmentData?.result?.data;

        if (!providerInfo?.shipment_providers?.length) {
          console.warn("No shipment providers found for order", orderId);
          failedOrders.push({ orderId, reason: "No shipment providers found" });
          continue;
        }

        const shipmentProviderCode =
          providerInfo.shipment_providers[0].provider_code;
        const shippingAllocateType = providerInfo.shipping_allocate_type;

        // Step 3: Pack the order
        const packRes = await fetch(
          `https://grozziie.zjweiting.com:3091/lazada-open-shop/fulfillment/pack2`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
            },
            body: JSON.stringify({
              pack_order_list: [
                {
                  order_item_list: [orderItemId],
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

      // ✅ Remove only successful
      const restOfOrders = filteredData.filter(
        (item) => !successfulIds.includes(item?.id)
      );
      setFilteredData(restOfOrders.slice(0, 5));
      dispatch(checkedItemsChange({ items: [], from: lazadaOrderStatusCheck }));
      setCheckedItems([]);
      setSelectAll(false);
      setIsConfirmModalOpen(false);

      if (failedOrders.length > 0) {
        setModalTitle(
          <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
            <TiInfoOutline className="w-10 h-10 text-red-600" />
          </div>
        );
        setModalMessage(
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
          </div>
        );
        setConfirmAction(null);
        setShowConfirmButton(false);
        setIsConfirmModalOpen(true);
      } else {
        console.log("✅ All selected orders packed successfully!");
      }
    } catch (error) {
      console.error("🚨 Error packing orders:", error);
      toast.error("Unexpected error occurred. Please try again.", {
        autoClose: false,
        position: "top-right",
      });
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      // Make the callback async
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Assuming the first sheet is the one you want to convert
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet to an array of objects
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const updateJsonData = jsonData?.map((item, index) => {
        if (item) {
          item.item_list = [
            {
              goods_id: item?.goods_id,
              goods_count: item?.goods_count,
              goods_img: item?.goods_img,
              goods_name: item?.goods_name,
              goods_price: item?.goods_price,
              goods_spec: item?.goods_spec,
              outer_goods_id: item?.outer_goods_id,
              outer_id: item?.outer_id,
              sku_id: item?.sku_id,
            },
          ];
        }
        const {
          goods_id,
          goods_count,
          goods_img,
          goods_name,
          goods_price,
          goods_spec,
          outer_goods_id,
          sku_id,
          ...updateDataWithoutGoodsId
        } = item; // Destructure 'goods_id' from 'item'
        const updateData = { ...updateDataWithoutGoodsId };
        return updateData;
      });

      if (lazadaOrderStatusCheck === "Waiting For Shipment") {
        dispatch(orderListData([...updateJsonData, ...customersData]));
        setCustomersData([...updateJsonData, ...customersData]);
        setTotalPart(Math.ceil((totalOrderData.length + jsonData?.length) / 5));
        toast.success(
          "Import file Store as Awaiting for Shipment Data Successfully"
        );
      }
      if (lazadaOrderStatusCheck === "shipped") {
        if (response.error) {
          console.error("Error storing data:", response.error);
          toast.error("Failed To Store Import file Printing Data");
        } else {
          toast.success("Import file Store as Printing Data Successfully");
        }
        setCustomersData([...updateJsonData, ...customersData]);
        setTotalPart(Math.ceil((totalOrderData.length + jsonData?.length) / 5));
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleImportOrderClick = () => {
    // Trigger the hidden file input
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
          setLazadaOrderStatusCheck={setLazadaOrderStatusCheck}
          lazadaOrderStatusCheck={lazadaOrderStatusCheck}
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
          currentShop="Lazada"
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
                {t(lazadaOrderStatusCheck)}
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
          {getLazadaOrders && (
            <LazadaBatchPrintTable
              filteredData={filteredData}
              isError={isError}
              isLoading={lazadaLoading}
              selectedCustomer={selectedCustomer}
              handleDetailsClick={handleDetailsClick}
              isModalOpen={isModalOpen}
              closeModal={closeModal}
              checkedItems={checkedItems}
              handleCheckboxChange={handleCheckboxChange}
              lazadaOrderStatusCheck={lazadaOrderStatusCheck}
              startDate={startDate}
              endDate={endDate}
              cipher={cipher}
              detailsLoading={detailsLoading}
            />
          )}
        </div>
      </div>

      {/* end section button */}
      <div className="mt-4 mr-8">
        <div className="flex items-center justify-end">
          {(lazadaOrderStatusCheck === "Packed" ||
            lazadaOrderStatusCheck === "ready_to_ship" ||
            lazadaOrderStatusCheck === "Packed_Printed") && (
            <button
              onClick={handleToCheckItemsShippingUpdate}
              className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-auto h-10 px-4 gap-2 py-2 rounded-md cursor-pointer flex items-center justify-center"
            >
              <MdOutlineLocalPrintshop className="w-[18px] h-[18px]" />
              <p className="text-[15px] font-medium leading-normal capitalize pl-1">
                {lazadaOrderStatusCheck === "Packed"
                  ? t("OrderShippingAndPrint")
                  : t("PrintAWBAgain")}
              </p>
            </button>
          )}

          {lazadaOrderStatusCheck === "pending" && (
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
              id="lazada_modal"
              className="modal backdrop-blur-sm bg-black/10 fixed inset-0 z-50 flex items-center justify-center"
              open={isModalOpen}
            >
              <div className="modal-box w-[900px] max-w-full bg-white shadow-xl rounded-2xl p-8 overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                  <h2 className="text-3xl font-semibold text-[#004368]">
                    {t("LazadaOrderDetails")}
                  </h2>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <strong>{t("BuyerName")}:</strong>{" "}
                    {selectedCustomer?.name || t("NoData")}
                  </div>
                  <div>
                    <strong>{t("BuyerID")}:</strong>{" "}
                    {selectedCustomer?.buyer_id || t("NoData")}
                  </div>
                  <div>
                    <strong>{t("OrderID")}:</strong>{" "}
                    {selectedCustomer?.order_id || t("NoData")}
                  </div>
                  <div>
                    <strong>{t("OrderItemID")}:</strong>{" "}
                    {selectedCustomer?.order_item_id || t("NoData")}
                  </div>
                  <div>
                    <strong>{t("InvoiceNumber")}:</strong>{" "}
                    {selectedCustomer?.invoice_number || t("NoData")}
                  </div>
                  <div>
                    <strong>{t("Status")}:</strong>{" "}
                    <span className="text-blue-700 font-semibold">
                      {selectedCustomer?.status || t("NoData")}
                    </span>
                  </div>
                  <div>
                    <strong>{t("ItemPrice")}:</strong>{" "}
                    {selectedCustomer?.item_price ?? "0.00"}
                  </div>
                  <div>
                    <strong>{t("PaidPrice")}:</strong>{" "}
                    {selectedCustomer?.paid_price ?? "0.00"}
                  </div>
                  <div>
                    <strong>{t("ShippingFee")}:</strong>{" "}
                    {selectedCustomer?.shipping_amount ?? "0.00"}
                  </div>
                  <div>
                    <strong>{t("Warehouse")}:</strong>{" "}
                    {selectedCustomer?.warehouse_code || t("NoData")}
                  </div>
                  <div>
                    <strong>{t("CreatedAt")}:</strong>{" "}
                    {new Date(selectedCustomer?.created_at).toLocaleString()}
                  </div>
                  <div>
                    <strong>{t("UpdatedAt")}:</strong>{" "}
                    {new Date(selectedCustomer?.updated_at).toLocaleString()}
                  </div>
                  <div>
                    <strong>{t("ShippingType")}:</strong>{" "}
                    {selectedCustomer?.shipping_type || t("NoData")}
                  </div>
                  <div>
                    <strong>{t("ShippingProviderType")}:</strong>{" "}
                    {selectedCustomer?.shipping_provider_type || t("NoData")}
                  </div>
                  <div>
                    <strong>{t("DeliveryOption")}:</strong>{" "}
                    {selectedCustomer?.delivery_option_sof ? "SOF" : "Standard"}
                  </div>
                  <div>
                    <strong>{t("IsDigital")}:</strong>{" "}
                    {selectedCustomer?.is_digital ? t("Yes") : t("No")}
                  </div>
                  <div>
                    <strong>{t("DigitalDeliveryEmail")}:</strong>{" "}
                    {selectedCustomer?.digital_delivery_info || t("NoData")}
                  </div>
                  <div>
                    <strong>{t("Reason")}:</strong>{" "}
                    {selectedCustomer?.reason || t("NoData")}
                  </div>
                  <div>
                    <strong>{t("OrderType")}:</strong>{" "}
                    {selectedCustomer?.order_type || t("NoData")}
                  </div>
                  <div>
                    <strong>{t("ShopSKU")}:</strong>{" "}
                    {selectedCustomer?.shop_sku || t("NoData")}
                  </div>
                  <div>
                    <strong>{t("SKU")}:</strong>{" "}
                    {selectedCustomer?.sku || t("NoData")}
                  </div>
                  <div>
                    <strong>{t("Variation")}:</strong>{" "}
                    {selectedCustomer?.variation || t("NoData")}
                  </div>
                  <div>
                    <strong>{t("VoucherAmount")}:</strong>{" "}
                    {selectedCustomer?.voucher_amount ?? 0}
                  </div>
                  <div>
                    <strong>{t("VoucherSeller")}:</strong>{" "}
                    {selectedCustomer?.voucher_seller ?? 0}
                  </div>
                  <div>
                    <strong>{t("VoucherPlatform")}:</strong>{" "}
                    {selectedCustomer?.voucher_platform ?? 0}
                  </div>
                  <div>
                    <strong>{t("WalletCredits")}:</strong>{" "}
                    {selectedCustomer?.wallet_credits ?? 0}
                  </div>
                  <div>
                    <strong>{t("SupplyPrice")}:</strong>{" "}
                    {selectedCustomer?.supply_price ?? 0}
                  </div>
                  <div>
                    <strong>{t("TaxAmount")}:</strong>{" "}
                    {selectedCustomer?.tax_amount ?? 0}
                  </div>
                </div>

                {/* Product & Image */}
                <div className="mt-6 flex items-start gap-4">
                  <img
                    src={
                      selectedCustomer?.product_main_image ||
                      "https://via.placeholder.com/100"
                    }
                    alt="SKU"
                    className="w-28 h-28 object-cover rounded-lg border"
                  />
                  <div className="flex-1">
                    <p>
                      <strong>{t("ProductDetailURL")}:</strong>{" "}
                      <a
                        href={selectedCustomer?.product_detail_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {t("ViewProduct")}
                      </a>
                    </p>
                    <p>
                      <strong>{t("ShippingFeeOriginal")}:</strong>{" "}
                      {selectedCustomer?.shipping_fee_original}
                    </p>
                    <p>
                      <strong>{t("DiscountPlatform")}:</strong>{" "}
                      {selectedCustomer?.shipping_fee_discount_platform}
                    </p>
                    <p>
                      <strong>{t("DiscountSeller")}:</strong>{" "}
                      {selectedCustomer?.shipping_fee_discount_seller}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                  <button
                    onClick={closeModal}
                    className="bg-[#004368] hover:bg-[#00324d] text-white font-semibold px-8 py-2 rounded-lg transition"
                  >
                    {t("Close")}
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

export default LazadaBatchPrint;
