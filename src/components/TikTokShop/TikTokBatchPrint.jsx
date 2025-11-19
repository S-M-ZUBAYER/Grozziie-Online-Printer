import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { checkedItemsChange } from "../../features/slice/userSlice";
import { arrayToExcel } from "../../Share/Function/FunctionalComponent";
import ConfirmationModal from "../../Share/ConfirmationModal";
import { TiInfoOutline } from "react-icons/ti";
import { AiOutlineCheckCircle } from "react-icons/ai";

// Custom hooks
import { useTikTokOrderStatus } from "./tiktokHooks/useTikTokOrderStatus";
import { useCheckboxSelection } from "./tiktokHooks/useCheckboxSelection";
import { usePagination } from "./tiktokHooks/usePagination";
import { useOrderData } from "./tiktokHooks/useOrderData";
import { useModalStates } from "./tiktokHooks/useModalStates";
import { useTikTokOrders } from "./tiktokHooks/useTikTokOrders";

// Components
import SearchSection from "./tiktokComponents/SearchSection";
import TableHeader from "./tiktokComponents/TableHeader";
import ActionButtons from "./tiktokComponents/ActionButtons";
import OrderDetailsModal from "./tiktokComponents/OrderDetailsModal";
import BatchPrintTable from "../BatchPrint/BatchPrintTable";

const TikTokBatchPrint = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Custom hooks
  const {
    tikTokOrderStatusCheck,
    setTikTokOrderStatusCheck,
    selectedStatus,
    setSelectedStatus,
  } = useTikTokOrderStatus();

  const {
    selectAll,
    checkedItems,
    setSelectAll,
    setCheckedItems,
    handleMasterCheckboxChange,
    handleCheckboxChange,
    clearSelection,
  } = useCheckboxSelection();

  const tiktokAuthCountry = localStorage.getItem("tiktokAuthCountry");
  const tiktokOpenId = localStorage.getItem("tiktokOpenId");
  const cipher = localStorage.getItem("tiktokAuthCipher");
  const { customersData, setCustomersData } = useOrderData();
  const { filteredData, setFilteredData, tiktokLoading } = useTikTokOrders({
    tikTokOrderStatusCheck,
    setTikTokOrderStatusCheck,
    setSelectedStatus, // ✅ Pass setSelectedStatus to the hook
    setCustomersData,
    clearSelection,
    location,
  });
  const [selectedTikTokDeliveryType, setSelectedTikTokDeliveryType] =
    useState("");

  useEffect(() => {
    const savedType = localStorage.getItem("tikTokDeliveryType");
    if (savedType) {
      setSelectedTikTokDeliveryType(savedType);
    }
  }, []);

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

  // ✅ Add debug logging to see status changes
  React.useEffect(() => {
    console.log("🔍 TikTok Status Debug:", {
      tikTokOrderStatusCheck,
      selectedStatus,
      pathname: location.pathname,
    });
  }, [tikTokOrderStatusCheck, selectedStatus, location.pathname]);

  // Handlers (keep your existing handlers)
  const handleBatchPrinterExcelClick = () => {
    arrayToExcel(checkedItems, "BatchPrinterOrderList");
  };

  const handleToCheckItemsPackageUpdate = () => {
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
  };

  const handleToCheckItemsShippingUpdate = () => {
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
          {tikTokOrderStatusCheck === "AWAITING_COLLECTION"
            ? t("AreYouSureToAcceptThisOrder")
            : t("DoYouWantPrintAWBAgain")}
        </p>,
        handleConfirmShipping,
        true
      );
    }
  };

  const handleConfirmShipping = () => {
    dispatch(
      checkedItemsChange({ items: checkedItems, from: tikTokOrderStatusCheck })
    );
    navigate("/onlineprint/tikTokPrintPrinting");
    closeConfirmModal();
  };

  const handleConfirmPackage = async () => {
    if (!cipher || checkedItems.length === 0) {
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

          let url = "";
          let body = null;

          // Use new API
          // url = `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/package/ship-package-new?cipher=${encodeURIComponent(
          //   cipherValue
          // )}`;
          url = `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/package/ship-package-new?cipher=${encodeURIComponent(
            cipher
          )}&openId=${encodeURIComponent(tiktokOpenId)}`;

          body = {
            packageId,
            trackingNumber: `TEST-${Date.now()}`, // 🔹 replace with real tracking number
            shippingProviderId: item?.shippingProviderId, // 🔹 you must pass this from item/provider
            pickupStartTime: 0, // 🔹 set valid pickup slot if pickup
            pickupEndTime: 0, // 🔹 set valid pickup slot if pickup
            handoverMethod:
              selectedTikTokDeliveryType === "dropoff" ? "DROP_OFF" : "PICKUP",
          };

          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : undefined,
          });

          const result = await res.json();
          console.log(`📦 Package created for order ${item?.id}:`, result);

          dispatch(
            checkedItemsChange({ items: [], from: tikTokOrderStatusCheck })
          );
          setCheckedItems([]);
          setSelectAll(false);

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
    closeConfirmModal();
  };

  return (
    <div className="bg-[#004368] bg-opacity-5 w-full h-screen">
      <div className="px-[30px] pt-6 pb-4">
        <SearchSection
          tikTokOrderStatusCheck={tikTokOrderStatusCheck}
          setTikTokOrderStatusCheck={setTikTokOrderStatusCheck}
          setSelectedStatus={setSelectedStatus} // ✅ Pass setSelectedStatus
          customersData={customersData}
          setFilteredData={setFilteredData}
        />

        {/* <SearchSection
          searchFields={searchFields}
          setSearchFields={setSearchFields}
          shopeeOrderStatusCheck={shopeeOrderStatusCheck}
          setShopeeOrderStatusCheck={setShopeeOrderStatusCheck}
          handleToSearch={handleToSearch}
          handleToReset={handleToReset}
          customersData={customersData}
          setFilteredData={setFilteredData}
        /> */}

        <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] p-4 mt-5">
          <TableHeader
            selectAll={selectAll}
            onSelectAllChange={() => handleMasterCheckboxChange(customersData)}
            checkedItemsCount={checkedItems.length}
            selectedStatus={selectedStatus}
            totalOrders={customersData.length}
            pagination={pagination}
            onExport={handleBatchPrinterExcelClick}
            t={t}
          />

          <BatchPrintTable
            filteredData={pagination.currentData}
            isLoading={tiktokLoading}
            selectedCustomer={selectedCustomer}
            handleDetailsClick={openDetailsModal}
            isModalOpen={isDetailsModalOpen}
            closeModal={closeDetailsModal}
            checkedItems={checkedItems}
            handleCheckboxChange={(order) =>
              handleCheckboxChange(order, pagination.currentData)
            }
            tikTokOrderStatusCheck={tikTokOrderStatusCheck}
            cipher={cipher}
          />
        </div>
      </div>

      <div className="mt-4 mr-8 mb-96">
        <ActionButtons
          tikTokOrderStatusCheck={tikTokOrderStatusCheck}
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

export default TikTokBatchPrint;
