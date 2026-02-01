import React, { useCallback, useEffect, useState } from "react";
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
import { getSubscriptionRemainingDays } from "../../lib/calculateSubscriptionRemainingDays";

const LazadaBatchPrint = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const lazadaAppKey = localStorage.getItem("lazadaAppKey");
  const lazadaAuthCountry = localStorage.getItem("lazadaAuthCountry");
  const lazadaAccountId = localStorage.getItem("lazadaAccountId");
  const selectedShop = JSON.parse(localStorage.getItem("lazadaShopInfo"));
  const currentLazadaShop = localStorage.getItem("lazadaAppKeyShopInfo");
  const currentUser = useSelector((state) => state.user.accountUser);
  const selectedStore = selectedShop ? selectedShop[0]?.name : "";
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    (state) => state.user.selectedLanguageRedux,
  );

  useEffect(() => {
    const savedLazada = JSON.parse(localStorage.getItem("lazadaShopInfo"));
    const savedStoreName = localStorage.getItem("SelectedStore");
    console.log(savedLazada, "saveLazada");

    if (savedLazada && savedLazada.length > 0) {
      // ✅ Check if saved store name matches platform
      const currentStore = savedLazada.find((s) => s.name === savedStoreName);
      const storeToUse = currentStore || savedLazada[0];
      localStorage.setItem("SelectedStore", storeToUse.name);
    }
  }, []);

  useEffect(() => {
    const fetchSubscriptionRemainingData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(currentUser, "lazada", currentLazadaShop);

        const result = await getSubscriptionRemainingDays(
          currentUser,
          "lazada",
          currentLazadaShop,
        );

        if (result.success) {
          setSubscriptionInfo(result);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && currentLazadaShop) {
      fetchSubscriptionRemainingData();
    }
  }, [currentLazadaShop, currentUser]);

  // Handlers - same as before
  const handleLazadaPrinterExcelClick = useCallback(() => {
    lazadaArrayToExcel(checkedItems, "lazadaBatchPrinterOrderList", t);
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
          {lazadaOrderStatusCheck === "Packed"
            ? t("AreYouSureToPrintForReadyToShip")
            : t("DoYouWantPrintAWBAgain")}
        </p>,
        handleConfirmShipping,
        true,
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
            `https://grozziie.zjweiting.com:3091/lazada-open-shop/api/dev/orders/items`,
            {
              params: {
                orderId: order_id,
                account: lazadaAccountId, // add appKey here
              },
              headers: {
                Accept: "*/*",
              },
            },
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
        }),
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
          `https://grozziie.zjweiting.com:3091/lazada-open-shop/api/dev/orders/items?orderId=${orderId}&account=${lazadaAccountId}`,
        );
        const itemData = await itemRes.json();

        const parsedBody = JSON.parse(itemData?.body);
        console.log(parsedBody.data, "parsed");

        // Extract order item IDs
        const orderItemIds =
          parsedBody?.data?.map((it) => it.order_item_id.toString()) || [];

        // Extract shipment provider for THIS specific order
        const orderShipmentProvider =
          parsedBody?.data?.find(
            (it) => it.order_id?.toString() === orderId?.toString(),
          )?.shipment_provider || parsedBody?.data[0]?.shipment_provider;

        if (!orderItemIds.length) {
          console.warn("No order_item_id found for order", orderId);
          failedOrders.push({ orderId, reason: "No order_item_id found" });
          continue;
        }

        console.log(
          { order_id: orderId, order_item_ids: orderItemIds },
          "shipment provider payload",
        );

        // Step 2: Get shipment provider
        const shipmentRes = await fetch(
          // `https://grozziie.zjweiting.com:3091/lazada-open-shop/fulfillment/order/shipment-provider`,
          `https://grozziie.zjweiting.com:3091/lazada-open-shop/fulfillment/order/shipment-provider?account=${encodeURIComponent(
            lazadaAccountId,
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
          },
        );

        const shipmentData = await shipmentRes.json();
        console.log(shipmentData?.result?.data, "provider info");

        const providerInfo = shipmentData?.result?.data;

        // if (!providerInfo?.shipment_providers?.length) {
        //   console.warn(
        //     "No shipment providers found for order",
        //     providerInfo,
        //     orderId
        //   );
        //   failedOrders.push({ orderId, reason: "No shipment providers found" });
        //   continue;
        // }

        const shipmentProviderCode = orderShipmentProvider
          ? orderShipmentProvider
          : providerInfo?.shipment_providers[0]?.provider_code;
        const shippingAllocateType = providerInfo?.shipping_allocate_type;
        console.log(
          shipmentProviderCode,
          shippingAllocateType,
          "log shipment provider",
        );
        // Step 3: Pack the order
        const packRes = await fetch(
          `https://grozziie.zjweiting.com:3091/lazada-open-shop/fulfillment/pack2?account=${encodeURIComponent(
            lazadaAccountId,
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
          },
        );

        const packResult = await packRes.json();

        if (packResult?.result?.success) {
          console.log(`✅ Packed order ${orderId}`, packResult);
          successfulIds.push(orderId);
        } else {
          console.warn(
            `❌ Failed to pack order ${orderId}`,
            packResult?.result?.error_msg,
          );
          failedOrders.push({
            orderId,
            reason: packResult?.result?.error_msg || "Packing failed",
          });
        }
      }

      // ✅ Remove only successful orders from current view
      const restOfOrders = customersData.filter(
        (item) => !successfulIds.includes(item?.order_id),
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
          false,
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

  const totalOrderItemInfo = customersData.reduce((total, customer) => {
    return total + (customer.orderItemInfo?.length || 0);
  }, 0);

  const totalOrderSkus = customersData.reduce((total, customer) => {
    const items = customer.orderItemInfo || [];

    // ✅ collect unique sku_id for THIS order only
    const uniqueSkuSet = new Set(
      items.map((item) => item.sku_id).filter(Boolean),
    );

    return total + uniqueSkuSet.size;
  }, 0);

  const totalOrders = customersData?.length;

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
            selectedStore={selectedStore}
            totalItems={totalOrderItemInfo}
            totalOrders={totalOrders}
            totalOrderSkus={totalOrderSkus}
            pagination={pagination}
            durationInfo={subscriptionInfo}
            loading={loading}
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
