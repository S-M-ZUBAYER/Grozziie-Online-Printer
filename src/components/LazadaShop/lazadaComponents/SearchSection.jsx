import React, { useState } from "react";
import NewSearchComponent from "../../../Share/SearchComponent/NewSearchComponent";

const SearchSection = ({
  lazadaOrderStatusCheck,
  setLazadaOrderStatusCheck,
  customersData,
  setFilteredData,
}) => {
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

  const [isActiveBtnRecipientAddress, setIsActiveBtnRecipientAddress] =
    useState(false);
  const [isActiveBtnOrderId, setIsActiveBtnOrderId] = useState(false);
  const [isActiveBtnAccountName, setIsActiveBtnAccountName] = useState(false);
  const [isActiveBtnProduct, setIsActiveBtnProduct] = useState(false);
  const [isActiveBtnAmount, setIsActiveBtnAmount] = useState(false);

  // Handler for date changes
  const handleStartDateChange = (date) => {
    setSearchFields((prev) => ({ ...prev, startDate: date }));
  };

  const handleEndDateChange = (date) => {
    setSearchFields((prev) => ({ ...prev, endDate: date }));
  };

  const handleToSearch = () => {
    // Clear the search input
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.value = "";
    }

    // Use the search function to filter data
    const filteredMultipleSearchingData = filterLazadaDataBySearchFields(
      customersData,
      searchFields
    );
    setFilteredData(filteredMultipleSearchingData);
  };

  const handleToReset = () => {
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

    setIsActiveBtnRecipientAddress(false);
    setIsActiveBtnOrderId(false);
    setIsActiveBtnAccountName(false);
    setIsActiveBtnProduct(false);
    setIsActiveBtnAmount(false);

    // Reset to show all data
    setFilteredData(customersData);
  };

  return (
    <NewSearchComponent
      // Date props
      startDate={searchFields.startDate}
      endDate={searchFields.endDate}
      setStartDate={handleStartDateChange}
      setEndDate={handleEndDateChange}
      // Status props
      lazadaOrderStatusCheck={lazadaOrderStatusCheck}
      setLazadaOrderStatusCheck={setLazadaOrderStatusCheck}
      // For other platforms (can be empty functions if not used)
      tikTokOrderStatusCheck=""
      setTikTokOrderStatusCheck={() => {}}
      shopeeOrderStatusCheck=""
      setShopeeOrderStatusCheck={() => {}}
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
      currentShop="Lazada"
      currentRenderingPage="OrderPage"
      // Additional props
      setSelectedStatus={() => {}}
    />
  );
};

export default SearchSection;
