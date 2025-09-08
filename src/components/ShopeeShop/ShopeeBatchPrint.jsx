import React, { useEffect, useState } from "react";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { lazadaArrayToExcel } from "../../Share/Function/FunctionalComponent";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkedItemsChange } from "../../features/slice/userSlice";
import * as XLSX from "xlsx";
import NewSearchComponent from "../../Share/SearchComponent/NewSearchComponent";
import { filterLazadaDataBySearchFields } from "../../Share/SearchComponent/SearchComponentFunction";
import toast from "react-hot-toast";
import { orderListData } from "../../features/slice/orderListSlice";
import ConfirmationModal from "../../Share/ConfirmationModal";
import { TiInfoOutline } from "react-icons/ti";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import ShopeeBatchPrintTable from "./ShopeeBatchPrintTable";
import { useLazyGetLazadaOrdersQuery } from "../../features/allApis/lazadaApi";
import axios from "axios";
import {
  useLazyGetShopeeOrderDetailsQuery,
  useLazyGetShopeeOrdersQuery,
} from "../../features/allApis/shopeeApi";

const ShopeeBatchPrint = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [shopeeLoading, setShopeeLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const orderListDataGet = useSelector((state) => state.orderList.data);
  const [totalOrderData, setTotalOrderData] = useState(orderListDataGet);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [packageLoading, setPackageLoading] = useState(false);
  console.log(totalOrderData, "orderlist...");

  const selectedShopeeOrderStatus = useSelector(
    (state) => state.user.shopeeSelectStatus
  );

  const [shopeeOrderStatusCheck, setShopeeOrderStatusCheck] = useState(
    selectedShopeeOrderStatus ? selectedShopeeOrderStatus : "Ready_To_Ship"
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
  const [getShopeeOrders, { isLoading, isError }] =
    useLazyGetShopeeOrdersQuery();

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
    if (checkedItems.some((item) => item?.order_sn === order?.order_sn)) {
      // If the order id is already in the checkedItems, remove it
      const updatedItems = checkedItems.filter(
        (item) => item?.order_sn !== order?.order_sn
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

  console.log(selectedShopeeOrderStatus, "orderStatuscheck");

  useEffect(() => {
    let isMounted = true;
    dispatch(checkedItemsChange({ items: [], from: shopeeOrderStatusCheck }));
    setCheckedItems([]);
    setSelectAll(false);
    const fetchShopeeOrdersWithDetails = async () => {
      try {
        setShopeeLoading(true);
        const now = Math.floor(Date.now() / 1000); // current time in seconds
        const sevenDaysAgo = now - 7 * 24 * 60 * 60; // 7 days before
        // ✅ Step 1: Get main order list

        const orderListResponse = await getShopeeOrders({
          timeFrom: sevenDaysAgo,
          timeTo: now,
          orderStatus: selectedShopeeOrderStatus || "READY_TO_SHIP",
        }).unwrap();
        console.log(orderListResponse);

        const orderList = orderListResponse?.response?.order_list || [];
        if (orderList.length === 0) {
          console.log("No Shopee orders found");
          if (isMounted) {
            dispatch(orderListData([]));
            setTotalOrderData([]);
          }
          return;
        }

        // ✅ Step 2: Extract order_sn list
        const orderSnList = orderList.map((order) => order.order_sn);

        // ✅ Step 3: Get detailed info
        const detailsResponse = await getShopeeOrderDetails({
          orderSnList,
          request_order_status_pending: true,
          response_optional_fields: "total_amount,recipient_address,item_list",
        }).unwrap();

        const detailedOrders = detailsResponse?.response?.order_list || [];

        // ✅ Step 4: Merge base order + detailed info
        const mergedOrders = orderList.map((order) => {
          const details = detailedOrders.find(
            (d) => d.order_sn === order.order_sn
          );
          return {
            ...order,
            ...details,
          };
        });

        // ✅ Step 5: Save final result
        if (isMounted) {
          dispatch(orderListData(mergedOrders));
          setTotalOrderData(mergedOrders);
        }
      } catch (error) {
        console.error("❌ Shopee Order Fetch Error:", error);
      } finally {
        if (isMounted) setShopeeLoading(false);
      }
    };

    if (shopeeOrderStatusCheck) {
      fetchShopeeOrdersWithDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [shopeeOrderStatusCheck]);

  // ✅ Use correct hooks
  const [getShopeeOrderDetails] = useLazyGetShopeeOrderDetailsQuery();

  const fetchShopeeOrdersWithDetails = async () => {
    try {
      // ✅ Step 1: Get order list
      const orderListResponse = await getShopeeOrders({
        timeFrom: 1755885600,
        timeTo: 1756663199,
        orderStatus: "READY_TO_SHIP",
      }).unwrap();

      const orderList = orderListResponse?.response?.order_list || [];

      if (orderList.length === 0) {
        console.log("No orders found");
        return [];
      }

      // ✅ Step 2: Extract order_sn list
      const orderSnList = orderList.map((order) => order.order_sn);

      // ✅ Step 3: Get detailed info
      const detailsResponse = await getShopeeOrderDetails({
        orderSnList,
        request_order_status_pending: true,
        response_optional_fields: "total_amount",
      }).unwrap();
      const detailedOrders = detailsResponse?.response?.order_list || [];
      return detailedOrders;
    } catch (err) {
      console.error("Error fetching Shopee orders:", err);
      return [];
    }
  };

  useEffect(() => {
    console.log(data, "data");
    const firstPageData = data?.slice(0, 5);
    setTotalPart(Math.ceil(data?.length / 5));
    setCustomersData(data);
    setFilteredData(firstPageData);
    setCurrentCustomerData(firstPageData);
    setCurrentBar(1);
    fetchShopeeOrdersWithDetails();
  }, [shopeeOrderStatusCheck, totalOrderData, shopeeOrderStatusCheck]);

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
      // const orderId = orderData.order_id || orderData.order_number;
      // if (!orderId) {
      //   console.warn("No order ID provided.");
      //   return;
      // }
      // setDetailsLoading(true);
      // const response = await fetch(
      //   `https://grozziie.zjweiting.com:3091/lazada-open-shop/api/dev/orders/items?orderId=${orderId}`
      // );

      // if (!response.ok) {
      //   throw new Error("Failed to fetch order item details.");
      // }

      // const result = await response.json();
      // const parsedBody = JSON.parse(result.body);
      // const itemDetails = parsedBody.data?.[0]; // Assuming you want the first item
      // console.log(itemDetails, "details");

      setSelectedCustomer(orderData);
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

  const handleLazadaPrinterExcelClick = () => {
    lazadaArrayToExcel(checkedItems, "lazadaPrinterOrderList");
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
          {shopeeOrderStatusCheck === "Packed"
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
    dispatch(
      checkedItemsChange({ items: checkedItems, from: shopeeOrderStatusCheck })
    );

    navigate("/shopeeAWBPrinting");
  };

  const handleConfirmPackage = async () => {
    const successfulIds = [];
    const failedOrders = [];
    setPackageLoading(true);
    try {
      // ✅ Step 1: Get address_id (call once)
      const addressRes = await fetch(
        "https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/logistics/get-address-list"
      );
      const addressData = await addressRes.json();
      const parsedAddress = addressData?.body?.response?.address_list?.[0];

      if (!parsedAddress?.address_id) {
        toast.error("❌ No pickup address found!");
        return;
      }

      const addressId = parsedAddress.address_id;
      console.log("✅ Using address_id:", addressId);

      // ✅ Step 2: Loop through orders
      for (const item of checkedItems) {
        const orderSn = item?.order_sn || item?.orderId; // ensure correct field

        if (!orderSn) {
          console.warn("Missing order_sn");
          failedOrders.push({ orderId: "Unknown", reason: "Missing order_sn" });
          continue;
        }

        try {
          const shipRes = await fetch(
            "https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/logistics/ship-order",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
              },
              body: JSON.stringify({
                order_sn: orderSn,
                package_number: "",
                pickup: {
                  address_id: addressId,
                  pickup_time_id: "", // optional, leave blank if not needed
                  tracking_number: "",
                },
              }),
            }
          );

          const shipData = await shipRes.json();

          if (!shipData?.body?.error) {
            console.log(`✅ Shipped order ${orderSn}`, shipData);
            successfulIds.push(orderSn);
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

      // ✅ Step 3: Update list (remove successful orders)
      const restOfOrders = filteredData.filter(
        (item) => !successfulIds.includes(item?.order_sn || item?.orderId)
      );
      setFilteredData(restOfOrders.slice(0, 5));

      dispatch(checkedItemsChange({ items: [], from: shopeeOrderStatusCheck }));
      setCheckedItems([]);
      setSelectAll(false);
      setIsConfirmModalOpen(false);

      // ✅ Show result modal if failures
      if (failedOrders.length > 0) {
        setPackageLoadingg(false);
        setModalTitle(
          <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
            <TiInfoOutline className="w-10 h-10 text-red-600" />
          </div>
        );
        setModalMessage(
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
        setConfirmAction(null);
        setShowConfirmButton(false);
        setIsConfirmModalOpen(true);
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
      setPackageLoading(false); // always stop loader
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawJson = XLSX.utils.sheet_to_json(sheet);

        const importedData = rawJson.map((row) => {
          // Construct nested structure from flat row fields
          return {
            order_id: row.order_id,
            order_number: row.order_number,
            customer_first_name: row.customer_first_name,
            customer_last_name: row.customer_last_name,
            payment_method: row.payment_method,
            price: row.price,
            items_count: row.items_count,
            shipping_fee: row.shipping_fee,
            warehouse_code: row.warehouse_code,
            voucher: row.voucher,
            voucher_code: row.voucher_code,
            statuses:
              typeof row.statuses === "string"
                ? row.statuses.split(",").map((s) => s.trim())
                : Array.isArray(row.statuses)
                ? row.statuses
                : [],
            updated_at: row.updated_at,
            created_at: row.created_at,
            address_billing: {
              address1: row.address_billing_address1,
              address2: row.address_billing_address2,
              address3: row.address_billing_address3,
              address4: row.address_billing_address4,
              address5: row.address_billing_address5,
              city: row.address_billing_city,
              country: row.address_billing_country,
              first_name: row.address_billing_first_name,
              last_name: row.address_billing_last_name,
              phone: row.address_billing_phone,
              phone2: row.address_billing_phone2,
              post_code: row.address_billing_post_code,
            },
            address_shipping: {
              address1: row.address_shipping_address1,
              address2: row.address_shipping_address2,
              address3: row.address_shipping_address3,
              address4: row.address_shipping_address4,
              address5: row.address_shipping_address5,
              city: row.address_shipping_city,
              country: row.address_shipping_country,
              first_name: row.address_shipping_first_name,
              last_name: row.address_shipping_last_name,
              phone: row.address_shipping_phone,
              phone2: row.address_shipping_phone2,
              post_code: row.address_shipping_post_code,
            },
            // Add any other fields you want from row here...
            // For example:
            buyer_note: row.buyer_note || "",
            delivery_info: row.delivery_info || "",
            extra_attributes: row.extra_attributes || "",
            gift_message: row.gift_message || "",
            gift_option: row.gift_option === "true" || row.gift_option === true,
            national_registration_number:
              row.national_registration_number || "",
            remarks: row.remarks || "",
            shipping_fee_discount_platform: row.shipping_fee_discount_platform,
            shipping_fee_discount_seller: row.shipping_fee_discount_seller,
            shipping_fee_original: row.shipping_fee_original,
            tax_code: row.tax_code || "",
            voucher_platform: row.voucher_platform,
            voucher_seller: row.voucher_seller,
            branch_number: row.branch_number || "",
            recipient_info: row.recipient_info || {},
            // etc.
          };
        });

        // Now merge with existing data according to your status
        if (shopeeOrderStatusCheck === "Waiting For Shipment") {
          const merged = [...importedData, ...customersData];
          setCustomersData(merged);
          dispatch(orderListData(merged));
          setTotalPart(Math.ceil(merged.length / 5));
          toast.success(
            "Import file stored as Awaiting for Shipment Data successfully"
          );
        } else if (shopeeOrderStatusCheck === "shipped") {
          const merged = [...importedData, ...customersData];
          setCustomersData(merged);
          dispatch(orderListData(merged));
          setTotalPart(Math.ceil(merged.length / 5));
          toast.success("Import file stored as Printing Data successfully");
        }
      } catch (err) {
        console.error("Failed to import Excel file:", err);
        toast.error("Failed to process Excel file");
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
    const filteredMultipleSearchingData = filterLazadaDataBySearchFields(
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
          setShopeeOrderStatusCheck={setShopeeOrderStatusCheck}
          shopeeOrderStatusCheck={shopeeOrderStatusCheck}
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
          currentShop="Shopee"
        />

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
                {t(shopeeOrderStatusCheck)}
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
                onClick={handleLazadaPrinterExcelClick}
                className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[115px] h-10 px-8 py-2 rounded-md cursor-pointer"
              >
                <p className="text-[15px] font-medium capitalize cursor-pointer whitespace-nowrap">
                  {t("Export")}
                </p>
              </button>
            </div>
          </div>

          {/* table */}
          {getShopeeOrders && (
            <ShopeeBatchPrintTable
              filteredData={filteredData}
              isError={isError}
              isLoading={shopeeLoading}
              selectedCustomer={selectedCustomer}
              handleDetailsClick={handleDetailsClick}
              isModalOpen={isModalOpen}
              closeModal={closeModal}
              checkedItems={checkedItems}
              handleCheckboxChange={handleCheckboxChange}
              shopeeOrderStatusCheck={shopeeOrderStatusCheck}
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
          {(shopeeOrderStatusCheck === "SHIPPED" ||
            shopeeOrderStatusCheck === "PROCESSED" ||
            shopeeOrderStatusCheck === "Packed_Printed") && (
            <button
              onClick={handleToCheckItemsShippingUpdate}
              className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-auto h-10 px-4 gap-2 py-2 rounded-md cursor-pointer flex items-center justify-center"
            >
              <MdOutlineLocalPrintshop className="w-[18px] h-[18px]" />
              <p className="text-[15px] font-medium leading-normal capitalize pl-1">
                {shopeeOrderStatusCheck === "PROCESSED"
                  ? t("OrderShippingAndPrint")
                  : t("PrintAWBAgain")}
              </p>
            </button>
          )}

          {shopeeOrderStatusCheck === "READY_TO_SHIP" && (
            <button
              onClick={handleToCheckItemsPackageUpdate}
              className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-auto  h-10 px-4 gap-2 py-2 rounded-md cursor-pointer flex items-center justify-center"
            >
              <MdOutlineLocalPrintshop className="w-[18px] h-[18px]" />
              <p className="text-[15px] font-medium leading-normal capitalize pl-1">
                {packageLoading ? "Loading" : t("OrderAcceptedAndPackages")}
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
            packageLoading={packageLoading}
          />
          {/* </Link> */}
          {selectedCustomer && isModalOpen && (
            <dialog
              id="shopee_modal"
              className="modal backdrop-blur-sm bg-black/10 fixed inset-0 z-50 flex items-center justify-center"
              open={isModalOpen}
            >
              <div className="modal-box w-[900px] max-w-full bg-white shadow-xl rounded-2xl p-8 overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                  <h2 className="text-3xl font-semibold text-[#004368]">
                    {t("ShopeeOrderDetails")}
                  </h2>
                </div>

                {/* Main Order Info Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <strong>{t("OrderSN")}:</strong>{" "}
                    {selectedCustomer?.order_sn || t("NoData")}
                  </div>
                  <div>
                    <strong>{t("OrderStatus")}:</strong>{" "}
                    {selectedCustomer?.order_status || t("NoData")}
                  </div>
                  <div>
                    <strong>{t("PaymentMethod")}:</strong>{" "}
                    {selectedCustomer?.payment_method || t("NoData")}
                  </div>
                  <div>
                    <strong>{t("Currency")}:</strong>{" "}
                    {selectedCustomer?.currency || t("NoData")}
                  </div>
                  <div>
                    <strong>{t("TotalAmount")}:</strong>{" "}
                    {selectedCustomer?.total_amount ?? 0}
                  </div>
                  <div>
                    <strong>{t("ShippingCarrier")}:</strong>{" "}
                    {selectedCustomer?.shipping_carrier || t("NoData")}
                  </div>
                  <div>
                    <strong>{t("COD")}:</strong>{" "}
                    {selectedCustomer?.cod ? t("Yes") : t("No")}
                  </div>
                  <div>
                    <strong>{t("CreatedAt")}:</strong>{" "}
                    {selectedCustomer?.create_time
                      ? new Date(
                          selectedCustomer.create_time * 1000
                        ).toLocaleString()
                      : t("NoData")}
                  </div>
                  <div>
                    <strong>{t("PaidAt")}:</strong>{" "}
                    {selectedCustomer?.pay_time
                      ? new Date(
                          selectedCustomer.pay_time * 1000
                        ).toLocaleString()
                      : t("NoData")}
                  </div>
                  <div>
                    <strong>{t("UpdatedAt")}:</strong>{" "}
                    {selectedCustomer?.update_time
                      ? new Date(
                          selectedCustomer.update_time * 1000
                        ).toLocaleString()
                      : t("NoData")}
                  </div>
                </div>

                {/* Divider */}
                <hr className="my-6" />

                {/* Recipient Info */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">
                    {t("RecipientInfo")}
                  </h3>
                  <p>
                    <strong>{t("Name")}:</strong>{" "}
                    {selectedCustomer?.recipient_address?.name || t("NoData")}
                  </p>
                  <p>
                    <strong>{t("Phone")}:</strong>{" "}
                    {selectedCustomer?.recipient_address?.phone || t("NoData")}
                  </p>
                  <p>
                    <strong>{t("FullAddress")}:</strong>{" "}
                    {selectedCustomer?.recipient_address?.full_address ||
                      t("NoData")}
                  </p>
                  <p>
                    <strong>{t("City")}:</strong>{" "}
                    {selectedCustomer?.recipient_address?.city || t("NoData")}
                  </p>
                  <p>
                    <strong>{t("State")}:</strong>{" "}
                    {selectedCustomer?.recipient_address?.state || t("NoData")}
                  </p>
                  <p>
                    <strong>{t("District")}:</strong>{" "}
                    {selectedCustomer?.recipient_address?.district ||
                      t("NoData")}
                  </p>
                  <p>
                    <strong>{t("Region")}:</strong>{" "}
                    {selectedCustomer?.recipient_address?.region || t("NoData")}
                  </p>
                </div>

                {/* Divider */}
                <hr className="my-6" />

                {/* Order Items */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    {t("OrderItems")}
                  </h3>
                  {selectedCustomer?.item_list?.length > 0 ? (
                    <div className="space-y-4 max-h-[40vh] overflow-y-auto">
                      {selectedCustomer.item_list.map((item, idx) => (
                        <div
                          key={item.order_item_id || idx}
                          className="flex gap-4 items-center border p-4 rounded-lg shadow-sm"
                        >
                          <img
                            src={
                              item?.image_info?.image_url ||
                              "https://via.placeholder.com/80"
                            }
                            alt={item?.item_name || t("NoData")}
                            className="w-20 h-20 object-cover rounded-md border"
                          />
                          <div className="flex-1">
                            <p>
                              <strong>{t("Product")}:</strong>{" "}
                              {item?.item_name || t("NoData")}
                            </p>
                            <p>
                              <strong>{t("ModelName")}:</strong>{" "}
                              {item?.model_name || t("NoData")}
                            </p>
                            <p>
                              <strong>{t("SKU")}:</strong>{" "}
                              {item?.model_sku || t("NoData")}
                            </p>
                            <p>
                              <strong>{t("Quantity")}:</strong>{" "}
                              {item?.model_quantity_purchased ?? 0}
                            </p>
                            <p>
                              <strong>{t("Price")}:</strong>{" "}
                              {item?.model_discounted_price ?? 0}
                            </p>
                            <p>
                              <strong>{t("OriginalPrice")}:</strong>{" "}
                              {item?.model_original_price ?? 0}
                            </p>
                            <p>
                              <strong>{t("PromotionType")}:</strong>{" "}
                              {item?.promotion_type || t("NoData")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>{t("NoOrderItems")}</p>
                  )}
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

export default ShopeeBatchPrint;
