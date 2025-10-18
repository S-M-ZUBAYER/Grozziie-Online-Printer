import React, { useState } from "react";
import NewSearchComponent from "../../../Share/SearchComponent/NewSearchComponent";
import { filterDataBySearchFieldsBatchPrint } from "../../../Share/SearchComponent/SearchComponentFunction";

const SearchSection = ({
  tikTokOrderStatusCheck,
  setTikTokOrderStatusCheck,
  setSelectedStatus, // ✅ Receive setSelectedStatus
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

  const handleToSearch = () => {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = "";

    const filteredMultipleSearchingData = filterDataBySearchFieldsBatchPrint(
      customersData,
      searchFields
    );
    setFilteredData(filteredMultipleSearchingData);
  };

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
      startDate: new Date(),
      endDate: new Date(),
    });

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
      setSelectedStatus={setSelectedStatus} // ✅ Pass to NewSearchComponent
      handleToSearch={handleToSearch}
      handleToReset={handleToReset}
      searchFields={searchFields}
      setSearchFields={setSearchFields}
      customersData={customersData}
      setFilteredData={setFilteredData}
      currentShop="TikTok"
    />
  );
};

export default SearchSection;
