import React, { useState } from "react";
import NewSearchComponent from "../../../Share/SearchComponent/NewSearchComponent";
import { filterDataBySearchFieldsBatchPrint } from "../../../Share/SearchComponent/SearchComponentFunction";
import { useSelector } from "react-redux";

const SearchSection = ({
  tikTokOrderStatusCheck,
  setTikTokOrderStatusCheck,
  setSelectedStatus,
  customersData,
  setFilteredData,
}) => {
  // 🔹 Active button states (missing earlier)
  const [isActiveBtnRecipientAddress, setIsActiveBtnRecipientAddress] =
    useState(false);
  const [isActiveBtnOrderId, setIsActiveBtnOrderId] = useState(false);
  const [isActiveBtnAccountName, setIsActiveBtnAccountName] = useState(false);
  const [isActiveBtnProduct, setIsActiveBtnProduct] = useState(false);
  const [isActiveBtnAmount, setIsActiveBtnAmount] = useState(false);

  // 🔹 Search fields
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

  // 🔹 Handle Search
  const handleToSearch = () => {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = "";

    const filteredMultipleSearchingData = filterDataBySearchFieldsBatchPrint(
      customersData,
      searchFields
    );
    setFilteredData(filteredMultipleSearchingData);
  };

  // Get initailly Date rang
  const tiktokDateRange = useSelector(
    (state) => state.user.selectedDateRangRedux
  );

  // 🔹 Handle Reset
  const handleToReset = () => {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = "";

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
      startDate: tiktokDateRange?.startDate,
      endDate: tiktokDateRange?.endDate,
    });

    setIsActiveBtnRecipientAddress(false);
    setIsActiveBtnOrderId(false);
    setIsActiveBtnAccountName(false);
    setIsActiveBtnProduct(false);
    setIsActiveBtnAmount(false);

    setFilteredData(customersData);
  };

  return (
    <NewSearchComponent
      startDate={searchFields.startDate}
      endDate={searchFields.endDate}
      setStartDate={(date) =>
        setSearchFields((prev) => ({ ...prev, startDate: date }))
      }
      setEndDate={(date) =>
        setSearchFields((prev) => ({ ...prev, endDate: date }))
      }
      tikTokOrderStatusCheck={tikTokOrderStatusCheck}
      setTikTokOrderStatusCheck={setTikTokOrderStatusCheck}
      setSelectedStatus={setSelectedStatus}
      handleToSearch={handleToSearch}
      handleToReset={handleToReset}
      searchFields={searchFields}
      setSearchFields={setSearchFields}
      customersData={customersData}
      setFilteredData={setFilteredData}
      // ✅ Active button states now defined and passed
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
      currentShop="TikTok"
    />
  );
};

export default SearchSection;
