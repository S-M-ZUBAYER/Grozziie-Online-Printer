import React, { useState } from "react";
import NewSearchComponent from "../../../Share/SearchComponent/NewSearchComponent";

const SearchSection = ({
  searchFields,
  setSearchFields,
  shopeeOrderStatusCheck,
  setShopeeOrderStatusCheck,
  handleToSearch,
  handleToReset,
  customersData,
  setFilteredData,
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
}) => {
  // Handler for date changes
  const handleStartDateChange = (date) => {
    setSearchFields((prev) => ({ ...prev, startDate: date }));
  };

  const handleEndDateChange = (date) => {
    setSearchFields((prev) => ({ ...prev, endDate: date }));
  };

  return (
    <NewSearchComponent
      // Date props
      startDate={searchFields.startDate}
      endDate={searchFields.endDate}
      setStartDate={handleStartDateChange}
      setEndDate={handleEndDateChange}
      // Status props
      shopeeOrderStatusCheck={shopeeOrderStatusCheck}
      setShopeeOrderStatusCheck={setShopeeOrderStatusCheck}
      // For other platforms (can be empty functions if not used)
      tikTokOrderStatusCheck=""
      setTikTokOrderStatusCheck={() => {}}
      lazadaOrderStatusCheck=""
      setLazadaOrderStatusCheck={() => {}}
      // Action handlers
      handleToSearch={handleToSearch}
      handleToReset={handleToReset}
      // Search fields
      searchFields={searchFields}
      setSearchFields={setSearchFields}
      // Data props
      customersData={customersData}
      setFilteredData={setFilteredData}
      // Active button states
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
      // Shop identifier
      currentShop="Shopee"
      currentRenderingPage="OrderPage" // or "ManualOrderPage" if needed
      // Additional props that NewSearchComponent expects
      setSelectedStatus={() => {}} // Add if needed
    />
  );
};

export default SearchSection;
