import React, { useEffect, useState, useCallback } from "react";
import { DateTime } from "luxon";
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
import {
  getRegionTimestampsShopeTiktok,
  shopeeArrayToExcel,
} from "../../Share/Function/FunctionalComponent";

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
import { endOfDay, fromUnixTime, startOfDay } from "date-fns";

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
  const [cardStatus, setCardStatus] = useState(false);
  const [cardStatusCategory, setCardStatusCategory] = useState("");
  const now = new Date();
  const start = startOfDay(now);
  const end = endOfDay(now);
  const shopeeAuthCountry = localStorage.getItem("shopeeAuthCountry");
  const shopeeAuthShopId = localStorage.getItem("shopeeAuthShopId");
  const selectedShopInfo = JSON.parse(localStorage.getItem("shopeeShopInfo"));
  const last3 = String(selectedShopInfo[0].name ?? "").slice(-3);
  const selectedStore = `${selectedShopInfo[0].region ?? ""}-(***${last3})`;
  const storedUser = localStorage.getItem("printerUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

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
    (state) => state.user.selectedLanguageRedux,
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
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });

  // State for active buttons - derive from searchFields to keep in sync
  const [isActiveBtnRecipientAddress, setIsActiveBtnRecipientAddress] =
    useState(searchFields.isActiveRecipientAddress);
  const [isActiveBtnOrderId, setIsActiveBtnOrderId] = useState(
    searchFields.isActiveOrderId,
  );
  const [isActiveBtnAccountName, setIsActiveBtnAccountName] = useState(
    searchFields.isActiveAccountName,
  );
  const [isActiveBtnProduct, setIsActiveBtnProduct] = useState(
    searchFields.isActiveProduct,
  );
  const [isActiveBtnAmount, setIsActiveBtnAmount] = useState(
    searchFields.isActiveAmount,
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
    localStorage.setItem(
      "SelectedStore",
      localStorage.getItem("shopeeAuthShopId"),
    );
    console.log("Current path:", location.pathname); // Debug
    console.log("Path parts:", parts); // Debug

    if (parts.length >= 3) {
      setCardStatus(true);
      const statusMap = {
        NewOrders: {
          status: "READY_TO_SHIP",
          display: "Ready To Ship",
        },
        printed: { status: "PROCESSED_PRINTED", display: "Processed_Printed" },
        printedToday: {
          status: "PROCESSED_PRINTED",
          display: "Processed_Printed",
        },
        shipped: { status: "SHIPPED", display: "On The Way" },
        needPrint: { status: "PROCESSED", display: "Processed" },
        Cancelled: { status: "CANCELLED", display: "Cancelled" },
      };

      // The status is usually in parts[1] for routes like /printed/shopee
      const routeStatus = parts[2];
      console.log("Route status:", routeStatus); // Debug
      setCardStatusCategory(routeStatus);
      const mappedStatus = statusMap[routeStatus];
      if (mappedStatus) {
        console.log("Setting route-based status:", mappedStatus.status);
        setShopeeOrderStatusCheck(mappedStatus.status);
      }
    }

    setIsInitialLoad(false);
  }, [location.pathname, setShopeeOrderStatusCheck]);

  // Get initailly Date rang
  const shopeeInitialDateRange = useSelector(
    (state) => state.user.selectedDateRangRedux,
  );

  console.log(shopeeInitialDateRange, " initailly date rang");

  // Only fetch data after initial route processing
  useEffect(() => {
    if (!isInitialLoad && shopeeOrderStatusCheck) {
      dispatch(checkedItemsChange({ items: [], from: shopeeOrderStatusCheck }));
      clearSelection();
      fetchShopeeOrdersWithDetails();
    }
  }, [
    shopeeOrderStatusCheck,
    isInitialLoad,
    dispatch,
    clearSelection,
    shopeeInitialDateRange,
  ]);

  const fetchShopeeOrdersWithDetails = async () => {
    try {
      setShopeeLoading(true);
      const shopInfoRaw = localStorage.getItem("shopeeShopInfo");
      const shopInfo = shopInfoRaw ? JSON.parse(shopInfoRaw) : [];
      const countryCode = shopInfo?.[0]?.region || "MY";
      const shopeeDateRange = getRegionTimestampsShopeTiktok(
        countryCode,
        shopeeInitialDateRange?.startDate?.split("T")[0],
        shopeeInitialDateRange?.endDate?.split("T")[0],
      );
      console.log({
        timeFrom: shopeeDateRange?.startTime,
        timeTo: shopeeDateRange?.endTime,
        orderStatus:
          shopeeOrderStatusCheck === "PROCESSED_PRINTED"
            ? "PROCESSED"
            : shopeeOrderStatusCheck === "SHIPPED_CONFIRM_RECEIVE"
              ? "SHIPPED"
              : shopeeOrderStatusCheck || "READY_TO_SHIP",
        pageSize: 50, // Maximum allowed by Shopee
      });

      // This will now automatically handle pagination
      const orderListResponse = await getShopeeOrders({
        timeFrom: shopeeDateRange?.startTime,
        timeTo: shopeeDateRange?.endTime,
        orderStatus:
          shopeeOrderStatusCheck === "PROCESSED_PRINTED"
            ? "PROCESSED"
            : shopeeOrderStatusCheck === "SHIPPED_CONFIRM_RECEIVE"
              ? "SHIPPED"
              : shopeeOrderStatusCheck || "READY_TO_SHIP",
        pageSize: 50, // Maximum allowed by Shopee
      }).unwrap();

      let orderList = orderListResponse || [];

      // Apply status filtering based on selectedStatus BEFORE fetching details
      if (selectedStatus === "On The Way") {
        orderList = orderList.filter(
          (order) => order.order_status === "SHIPPED",
        );
      } else if (selectedStatus === "Delivered") {
        orderList = orderList.filter(
          (order) => order.order_status === "TO_CONFIRM_RECEIVE",
        );
      }

      if (orderList.length === 0) {
        dispatch(orderListData([]));
        setCustomersData([]);
        return;
      }

      const orderSnList = orderList.map((order) => order.order_sn);

      // This will now process in batches of 30
      const detailsResponse = await getShopeeOrderDetails({
        orderSnList,
        request_order_status_pending: true,
        response_optional_fields:
          "total_amount,recipient_address,item_list,package_list",
      }).unwrap();

      const detailedOrders = detailsResponse || [];

      // Merge orders with their details
      let mergedOrders = orderList.map((order) => {
        const details = detailedOrders.find(
          (d) => d.order_sn === order.order_sn,
        );
        return { ...order, ...details };
      });
      console.log(mergedOrders, "marge Ordes form shopee");

      // Your existing filter logic for printed orders
      let printedIds = [];
      try {
        const res = await fetch(
          `https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/shopee/printedIds/by-email/${user?.email}`,
        );
        printedIds = await res.json();
      } catch (err) {
        console.error("Error fetching printedIds:", err);
      }

      const shopeePrintedIds = printedIds.map((p) => p.shopeePrintedId);

      const today = new Date().toISOString().split("T")[0];
      const shopeeTodayPrintedIdSet = new Set(
        printedIds
          .filter((p) => p.createdAt.split("T")[0] === today)
          .map((p) => p.shopeePrintedId),
      );

      console.log(
        "🔢 Shopee Today Printed:",
        shopeeTodayPrintedIdSet.size,
        shopeeOrderStatusCheck,
        cardStatus,
        cardStatusCategory,
      );

      if (shopeeOrderStatusCheck === "PROCESSED_PRINTED") {
        if (cardStatus == true && cardStatusCategory === "printedToday") {
          mergedOrders = mergedOrders.filter((order) =>
            shopeeTodayPrintedIdSet.has(order.order_sn),
          );
        } else {
          mergedOrders = mergedOrders.filter((order) =>
            shopeePrintedIds.includes(order.order_sn),
          );
        }
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
              JSON.stringify(updatedStorage),
            );
          }

          return !isPrinted;
        });
      } else if (shopeeOrderStatusCheck === "READY_TO_SHIP") {
        const storeOrderId = localStorage.getItem("ShopeePackaging") || "[]";
        mergedOrders = mergedOrders.filter(
          (order) => !storeOrderId.includes(order.order_sn),
        );
      } else if (shopeeOrderStatusCheck === "SHIPPED" && cardStatus === true) {
        mergedOrders = mergedOrders.filter((order) => {
          const updateDate = fromUnixTime(order.update_time);
          return updateDate >= start && updateDate <= end;
        });
      }

      dispatch(orderListData(mergedOrders));
      setCustomersData(mergedOrders);
    } catch (error) {
      console.error("Shopee Order Fetch Error:", error);
      // toast.error("Failed to fetch orders");
    } finally {
      setShopeeLoading(false);
      setCardStatus(false);
    }
  };

  // Get initailly Date rang
  const shopeeDateRange = useSelector(
    (state) => state.user.selectedDateRangRedux,
  );

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
      startDate: shopeeDateRange?.startDate,
      endDate: shopeeDateRange?.endDate,
    });
    // setShopeeOrderStatusCheck("");
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
    [openDetailsModal],
  );

  const handleShopeePrinterExcelClick = useCallback(() => {
    shopeeArrayToExcel(checkedItems, "ShopeeBatchPrinterOrderList", t);
  }, [checkedItems]);

  const handleToCheckItemsPackageUpdate = useCallback(() => {
    if (checkedItems.length === 0) {
      openConfirmModal(
        <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
          <TiInfoOutline className="w-10 h-10 text-red-600" />
        </div>,
        <p>{t("NoItemsSelected")}</p>,
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
        true,
      );
    }
  }, [checkedItems.length, t, openConfirmModal]);

  const handleToCheckItemsShippingUpdate = useCallback(() => {
    if (checkedItems.length === 0) {
      openConfirmModal(
        <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
          <TiInfoOutline className="w-10 h-10 text-red-600" />
        </div>,
        <p>{t("NoItemsSelected")}</p>,
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
        true,
      );
    }
  }, [checkedItems.length, shopeeOrderStatusCheck, t, openConfirmModal]);

  const handleConfirmShipping = useCallback(() => {
    dispatch(
      checkedItemsChange({ items: checkedItems, from: shopeeOrderStatusCheck }),
    );
    navigate("/onlineprint/shopeeAWBPrinting");
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
            `https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/logistics/get-shipping-parameter?shopId=${shopeeAuthShopId}&orderSn=${orderSn}`,
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

          const pickupList =
            shippingParamData?.body?.response?.pickup?.address_list || [];

          // 🟢 Find address with recommended pickup time slot
          let addressId = null;
          let pickupTimeId = null;

          for (const address of pickupList) {
            const recommendedSlot = address?.time_slot_list?.find((slot) =>
              slot?.flags?.includes("recommended"),
            );
            if (recommendedSlot) {
              addressId = address.address_id;
              pickupTimeId = recommendedSlot.pickup_time_id;
              break;
            }
          }

          // If no recommended slot found, fallback to first address/time slot
          if (!addressId && pickupList.length > 0) {
            addressId = pickupList[0]?.address_id || null;
            pickupTimeId =
              pickupList[0]?.time_slot_list?.[0]?.pickup_time_id || null;
          }

          const dropoff = shippingParamData?.body?.response?.dropoff;
          console.log(addressId, pickupTimeId, "✅ Selected pickup info");

          // 2️⃣ Build request body dynamically
          let requestBody = {
            order_sn: orderSn,
            package_number: "",
          };

          if (selectedShopeeDeliveryType === "pickup") {
            if (!addressId || !pickupTimeId) {
              failedOrders.push({
                orderId: orderSn,
                reason: "Missing address_id or pickup_time_id",
              });
              continue;
            }
            requestBody = {
              order_sn: orderSn,
              package_number: "",
              pickup: {
                address_id: addressId,
                pickup_time_id: pickupTimeId,
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
            // Default fallback same as pickup
            if (!addressId || !pickupTimeId) {
              failedOrders.push({
                orderId: orderSn,
                reason: "Missing address_id or pickup_time_id",
              });
              continue;
            }
            requestBody = {
              order_sn: orderSn,
              package_number: "",
              pickup: {
                address_id: addressId,
                pickup_time_id: pickupTimeId,
                tracking_number: "",
              },
            };
          }

          // 3️⃣ Call ship-order API
          const shipRes = await fetch(
            `https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/logistics/ship-order?shopId=${shopeeAuthShopId}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requestBody),
            },
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
                JSON.stringify([...stored, orderSn]),
              );
            }
          } else {
            console.warn(
              `❌ Failed to ship ${orderSn}`,
              shipData?.body?.message || shipData?.body?.error,
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
        (item) => !successfulIds.includes(item?.order_sn || item?.orderId),
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
          </div>,
        );
      } else {
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
      searchFields,
    );
    setFilteredData(filteredMultipleSearchingData); // Use setFilteredData instead of pagination.updateData
  };

  const totalOrderSkus = customersData.reduce((total, customer) => {
    return total + (customer.item_list?.length || 0);
  }, 0);

  const totalOrders = customersData.length;

  const totalItemList = customersData.reduce((total, customer) => {
    const itemTotal =
      customer.item_list?.reduce((sum, item) => {
        return sum + (item.model_quantity_purchased || 0);
      }, 0) || 0;

    return total + itemTotal;
  }, 0);

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
            selectedStore={selectedStore}
            totalItems={totalItemList}
            totalOrders={totalOrders}
            totalOrderSkus={totalOrderSkus}
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
