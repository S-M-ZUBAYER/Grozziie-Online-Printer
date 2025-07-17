import React, { useEffect, useRef, useState } from "react";
import Settings from "../../assets/Settings.png";
import { TbTruckDelivery } from "react-icons/tb";
import { FaEdit, FaPlus } from "react-icons/fa";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { RiContactsLine } from "react-icons/ri";
import { arrayToExcel } from "../../Share/Function/FunctionalComponent";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import DeliveryCompanyList from "../../Share/DeliveryCompanyList/DeliveryCompanyList";
import SearchComponent from "../../Share/SearchComponent/SearchComponent";
import StoredDeliveryCompanyList from "../../Share/StoredDeliveryCompanyList/StoredDeliveryCompanyList";
import {
  useGetShippedDataUsQuery,
  useSetShippedDataUsMutation,
} from "../../features/allApis/shippedDataGetUsApi";
import { checkedItemsChange } from "../../features/slice/userSlice";
import { Link } from "react-router-dom";
import BatchPrinterModal from "../BatchPrint/BatchPrinterModal";
import NewSearchComponent from "../../Share/SearchComponent/NewSearchComponent";
import { filterDataBySearchFieldsBatchPrint } from "../../Share/SearchComponent/SearchComponentFunction";
import toast from "react-hot-toast";
import { orderListData } from "../../features/slice/orderListSlice";
import PropagateLoader from "react-spinners/PropagateLoader";
import FadeLoader from "react-spinners/FadeLoader";

const logoOptions = ["Homer", "Marge", "Bart", "Lisa", "Maggie"];
const bannerOptions = ["Homer", "Marge", "Bart", "Lisa", "Maggie"];
const billOptions = ["Homer", "Marge", "Bart", "Lisa", "Maggie"];

const SinglePrint = () => {
  const orderListDataGet = useSelector((state) => state.orderList.data);
  const dispatch = useDispatch();

  const [refundStatusCheck, setRefundStatusCheck] = useState(
    "Waiting For Shipment"
  );

  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );
  // date range functionality start

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  // function for show all clients
  const { data: printedData, isLoading } = useGetShippedDataUsQuery();
  let currentClient;
  const handleToShowClients = () => {
    const data =
      refundStatusCheck === "Waiting For Shipment"
        ? orderListDataGet
        : refundStatusCheck === "shipped"
          ? printedData
          : [];
    currentClient = data && data[0]?.order_sn;
    dispatch(
      checkedItemsChange({ items: data && [data[0]], from: refundStatusCheck })
    );
    return data;
  };
  const [clients, setClients] = useState(handleToShowClients());
  const [selectedClient, setSelectedClient] = useState(clients && clients[0]);
  const [active, setActive] = useState(clients && clients[0]?.order_sn);
  const [postShippedDataToApi] = useSetShippedDataUsMutation();
  useEffect(() => {
    const currentOrder = handleToShowClients();
    setClients(currentOrder);
    setSelectedClient(currentOrder && currentOrder[0]);
    setActive(currentClient);
  }, [refundStatusCheck, printedData]);

  useEffect(() => {
    dispatch(
      checkedItemsChange({
        items: clients && [clients[0]],
        from: refundStatusCheck,
      })
    );
  }, [refundStatusCheck]);

  // const [range, setRange] = useState([
  //   {
  //     startDate: new Date(),
  //     endDate: addDays(new Date(), 7),
  //     key: "selection",
  //   },
  // ]);
  const refOne = useRef([]);

  // useEffect(() => {
  //   console.log("infinity loop");
  //   document.addEventListener("keydown", hideOnEscape, true);
  //   document.addEventListener("click", hideOnClickOutside, true);
  // }, []);

  // for date wise search functions start here
  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  // date range functionality end
  const handleToSelectCustomer = (client) => {
    dispatch(checkedItemsChange({ items: [client], from: refundStatusCheck }));
    setSelectedClient(client);
    setActive(client?.order_sn);
  };

  const [modalInput, setModalInput] = useState("");

  // const filteredAllProduct = mallProduct.filter(
  //   (request) =>
  //     request?.productName
  //       .toLowerCase()
  //       .includes(searchAllQuery.toLowerCase()) ||
  //     request?.productCountryName
  //       .toLowerCase()
  //       .includes(searchAllQuery.toLowerCase()) ||
  //     request?.productPrice
  //       .toLowerCase()
  //       .includes(searchAllQuery.toLowerCase()) ||
  //     // request?.id.includes(searchAllQuery.toLowerCase()) ||
  //     request?.modelNumber.toLowerCase().includes(searchAllQuery.toLowerCase())
  //   // request?.printerColo.toLowerCase().includes(searchAllQuery.toLowerCase())
  // );

  //Excel functionalities
  const handleBatchPrinterExcelClick = () => {
    arrayToExcel([selectedClient], "singlePrinterCustomerList");
  };

  // modal submit function
  const handleModalSubmit = (e) => {
    e.preventDefault();
    setModalInput("");
    document.getElementById("my_modal_1").close();
  };

  //make function for import data
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];

  //   if (!file) {
  //     return;
  //   }
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const data = new Uint8Array(e.target.result);
  //     const workbook = XLSX.read(data, { type: "array" });

  //     // Assuming the first sheet is the one you want to convert
  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];

  //     // Convert the sheet to an array of objects
  //     const jsonData = XLSX.utils.sheet_to_json(sheet);
  //     console.log(jsonData, "check main value");

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
  //     console.log(updateJsonData, "check for updateJsonData");
  //     setClients([...clients, ...jsonData]);
  //   };

  //   reader.readAsArrayBuffer(file);
  // };

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

      // setTotalOrderData([...totalOrderData, ...jsonData]);
      console.log(refundStatusCheck, "check status");
      setClients([...clients, ...jsonData]);
      if (refundStatusCheck === "Waiting For Shipment") {
        console.log(
          [...updateJsonData, ...customersData],
          "waiting for shipment"
        );
        dispatch(orderListData([...updateJsonData, ...customersData]));
        setCustomersData([...updateJsonData, ...customersData]);
        toast.success(
          "Import file Store as Awaiting for Shipment Data Successfully"
        );
      }
      if (refundStatusCheck === "shipped") {
        console.log(updateJsonData, "jsonData");

        const response = await postShippedDataToApi(updateJsonData[0]);
        if (response.error) {
          console.error("Error storing data:", response.error);
          toast.error("Failed To Store Import file Printing Data");
        } else {
          toast.success("Import file Store as Printing Data Successfully");
        }
        setCustomersData([...updateJsonData, ...customersData]);
      }
      // setCustomersData([...updateJsonData, ...customersData]);
      // setTotalPart(Math.ceil((totalOrderData.length + jsonData?.length) / 5));
    };

    reader.readAsArrayBuffer(file);
  };

  const handleImportOrderClick = () => {
    // Trigger the hidden file input
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
  };
  // search functionalities
  const [isActiveBtnRecipientAddress, setIsActiveBtnRecipientAddress] =
    useState(false);
  const [isActiveBtnOrderId, setIsActiveBtnOrderId] = useState(false);
  const [isActiveBtnAccountName, setIsActiveBtnAccountName] = useState(false);
  const [isActiveBtnProduct, setIsActiveBtnProduct] = useState(false);
  const [isActiveBtnAmount, setIsActiveBtnAmount] = useState(false);
  const [customersData, setCustomersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
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

  useEffect(() => {
    setFilteredData(customersData);
  }, [customersData]);

  useEffect(() => {
    setCustomersData(handleToShowClients());
    setFilteredData(handleToShowClients());
  }, [refundStatusCheck, printedData]);

  const handleToSearch = () => {
    document.getElementById("searchInput").value = "";
    // Usage:
    const filteredMultipleSearchingData = filterDataBySearchFieldsBatchPrint(
      customersData,
      searchFields
    );
    setFilteredData(filteredMultipleSearchingData);
  };

  const handleToReset = () => {
    setFilteredData(customersData);
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

  return (
    <div className="bg-[#004368] bg-opacity-5 w-full pb-7">
      <div className="px-[30px] pt-6">
        {/* top section */}
        <NewSearchComponent
          setStartDate={setStartDate}
          startDate={startDate}
          endDate={endDate}
          setEndDate={setEndDate}
          setRefundStatusCheck={setRefundStatusCheck}
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
        <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] p-4 mt-5 grid grid-cols-12">
          <div className="col-span-2">
            <BatchPrinterModal />
          </div>
          <div className="col-span-10  custom-scrollbar">
            <StoredDeliveryCompanyList />
          </div>
        </div>

        {/* bottom section */}
        <div className="mt-5 mb-[7px] grid grid-cols-10">
          {/* left side */}
          <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] col-span-2 mr-6">
            <div className="mt-6">
              <div className="ml-4 flex items-center">
                <RiContactsLine className="mr-[9px] w-6 h-4 text-[#004368]" />
                <p className="text-[#004368] text-base font-bold capitalize">
                  {selectedLanguage === "zh-CN" ? "客户名单" : "Customer list"}
                </p>
              </div>
              <ul className="ml-8 mt-3 max-h-[590px] overflow-y-auto">
                {/* {clients?.map((client, index) => ( */}

                {refundStatusCheck === "shipped" && isLoading ? (
                  <div className="flex flex-col items-center justify-center py-28">
                    <FadeLoader color="#004368" size={25} />
                    <p className="text-xs font-medium pt-10 text-[#004368]">
                      {selectedLanguage === "zh-CN"
                        ? "数据正在加载，请稍候..."
                        : "Data is Loading. Please Wait..."}
                    </p>
                  </div>
                ) : (
                  filteredData?.map((client, index) => (
                    <li
                      key={index}
                      onClick={() => handleToSelectCustomer(client)}
                      className={`text-black opacity-80 text-sm font-light capitalize pb-2 cursor-pointer ${active === client?.order_sn &&
                        "text-[#004368] font-medium text-[15px]"
                        }`}
                    >
                      {client?.receiver_name
                        ? client?.receiver_name
                        : "No Name"}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* right side */}
          <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] px-6 pt-5 col-span-8 pb-6">
            {/* top */}
            <div className="grid grid-cols-5 items-center justify-center pt-2">
              <div className="col-span-1">
                <p className="text-[#004368] text-sm font-medium capitalize">
                  {/* waiting for shipment */}
                  {refundStatusCheck}
                </p>
              </div>
              {/* this data coming from server and data dynamic */}
              <div className="col-span-1 flex items-center justify-center">
                <p className="text-black opacity-40 text-sm font-medium capitalize">
                  500 {selectedLanguage === "zh-CN" ? "买家" : "buyers"}
                </p>
                <div className="w-[1px] h-8 bg-black opacity-40 mx-2"></div>
                <p className="text-black opacity-40 text-sm font-medium capitalize">
                  700 {selectedLanguage === "zh-CN" ? "订单" : "orders"}
                </p>
              </div>
              {/* here need to add button onclik for cheage page and dynamic data add from excel */}
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
                  {selectedLanguage === "zh-CN" ? "导入订单" : "Import Order"}
                </p>
              </div>

              <div className="col-span-2 flex items-center justify-end">
                {/* <Link
                  to="/settings/recipient information"
                  className="flex items-center justify-center px-7 cursor-pointer"
                >
                  <img src={Settings} alt="settings" className="w-4 h-4" />
                  <p className="ml-2 text-[#004368] text-sm font-medium capitalize cursor-pointer">
                    settings
                  </p>
                </Link> */}
                <button
                  onClick={handleBatchPrinterExcelClick}
                  className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[115px] h-10 px-8 py-2 rounded-md cursor-pointer"
                >
                  <p className="text-[15px] font-medium capitalize cursor-pointer">
                    {selectedLanguage === "zh-CN" ? "导出" : "Export"}
                  </p>
                </button>
              </div>
            </div>

            {/* middle table */}
            <div className="mt-6">
              <table className="table">
                <thead className="">
                  <tr className="h-11 text-black text-opacity-80 capitalize text-center text-sm font-light">
                    <th className="sticky top-0 flex justify-between bg-[#0043681A] bg-opacity-80 rounded-l-md">
                      <span className="mr-[10px]">
                        {selectedLanguage === "zh-CN" ? "姓名" : "Name"}
                      </span>
                      <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                    </th>
                    <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
                      <span className="mr-[10px]">
                        {selectedLanguage === "zh-CN" ? "数量" : "Quantity"}
                      </span>
                      <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                    </th>
                    <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
                      <span className="mr-[10px]">
                        {selectedLanguage === "zh-CN"
                          ? "收件人姓名"
                          : "Recipient Name"}
                      </span>
                      <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                    </th>
                    <th
                      className="sticky top-0 bg-[#0043681A] bg-opac
                    ity-80"
                    >
                      <span className="mr-[10px]">
                        {selectedLanguage === "zh-CN" ? "地址" : "Address"}
                      </span>
                      <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                    </th>
                    <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
                      <span className="mr-[10px]">
                        {selectedLanguage === "zh-CN" ? "信息" : "Message"}
                      </span>
                      <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                    </th>
                    <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
                      <span className="mr-[10px]">
                        {selectedLanguage === "zh-CN"
                          ? "交付模板"
                          : "Delivery Template"}
                      </span>
                      <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                    </th>
                    <th className="sticky top-0 bg-[#0043681A] bg-opacity-80 rounded-r-lg">
                      {selectedLanguage === "zh-CN" ? "追踪" : "Tracking"}
                    </th>
                  </tr>
                </thead>

                <tbody className="max-h-[590px] overflow-y-auto">
                  {selectedClient && (
                    <tr
                      className={`hover:bg-[#0043681A] capitalize text-center cursor-pointer`}
                      key={selectedClient?.order_sn}
                    >
                      <td className="text-black text-sm font-light capitalize">
                        {selectedClient?.receiver_name_mask
                          ? selectedClient?.receiver_name_mask
                          : "No Data"}
                      </td>
                      <td className="text-black text-sm font-light capitalize">
                        {selectedClient?.item_list?.[0]?.goods_count
                          ? selectedClient?.item_list?.[0]?.goods_count
                          : "No Data"}
                      </td>
                      <td className="text-black text-sm font-light capitalize">
                        {selectedClient?.receiver_name
                          ? selectedClient?.receiver_name
                          : "No Data"}
                      </td>
                      <td className="text-black text-sm font-light capitalize">
                        {selectedClient?.receiver_address
                          ? selectedClient?.receiver_address
                          : "No Data"}
                      </td>
                      <td className="text-black text-sm font-light capitalize">
                        {selectedClient?.remark
                          ? selectedClient?.remark
                          : "No Data"}
                      </td>
                      <td className="text-black text-sm font-light capitalize">
                        {selectedClient?.delivery_one_day
                          ? "Express"
                          : "Regular"}
                      </td>
                      <td className="text-black text-sm font-light capitalize">
                        {selectedClient?.tracking_number
                          ? selectedClient?.tracking_number
                          : "No Data"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* client details */}
              <div className="mt-6 bg-[#004368] bg-opacity-5 pt-5 pb-9 px-6 rounded-[6px]">
                {/* body top */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center mb-[10px]">
                      <p className="text-black text-[15px] font-medium capitalize">
                        {selectedLanguage === "zh-CN"
                          ? "收件人姓名："
                          : "Recipient Name:"}
                      </p>
                      <p className="text-black text-[15px] font-light capitalize ml-3">
                        {selectedClient?.receiver_name
                          ? selectedClient?.receiver_name
                          : selectedLanguage === "zh-CN"
                            ? "没有数据"
                            : "No Data"}
                      </p>
                    </div>
                    <div className="flex items-center mb-[10px]">
                      <p className="text-black text-[15px] font-medium capitalize">
                        {selectedLanguage === "zh-CN"
                          ? "联系电话："
                          : "Contact Number:"}
                      </p>
                      <p className="text-black text-[15px] font-light capitalize ml-3">
                        {selectedClient?.receiver_phone
                          ? selectedClient?.receiver_phone
                          : selectedLanguage === "zh-CN"
                            ? "没有数据"
                            : "No Data"}
                      </p>
                    </div>
                    <div className="flex items-center mb-[10px]">
                      <p className="text-black text-[15px] font-medium capitalize">
                        {selectedLanguage === "zh-CN" ? "地址:" : "Address:"}
                      </p>
                      <p className="text-black text-[15px] font-light capitalize ml-3">
                        {selectedClient?.receiver_address
                          ? selectedClient?.receiver_address
                          : selectedLanguage === "zh-CN"
                            ? "没有数据"
                            : "No Data"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-black text-[15px] font-medium capitalize">
                        {selectedLanguage === "zh-CN"
                          ? "订货时间:"
                          : "Order Time:"}
                      </p>
                      <p className="text-black text-[15px] font-light capitalize ml-3">
                        {selectedClient?.confirm_time
                          ? selectedClient?.confirm_time
                          : selectedLanguage === "zh-CN"
                            ? "没有数据"
                            : "No Data"}
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <div className="flex items-center mb-[10px]">
                      <p className="text-black text-[15px] font-medium capitalize">
                        {selectedLanguage === "zh-CN"
                          ? "固定电话:"
                          : "Fixed Telephone:"}
                      </p>
                      <p className="text-black text-[15px] font-light capitalize ml-3">
                        {selectedClient?.receiver_phone
                          ? selectedClient?.receiver_phone
                          : selectedLanguage === "zh-CN"
                            ? "没有数据"
                            : "No Data"}
                      </p>
                    </div>
                    <div className="flex items-center mb-[10px]">
                      <p className="text-black text-[15px] font-medium capitalize">
                        {selectedLanguage === "zh-CN"
                          ? "运货时间："
                          : "Shipping Time:"}
                      </p>
                      <p className="text-black text-[15px] font-light capitalize ml-3">
                        {selectedClient?.last_ship_time
                          ? selectedClient?.last_ship_time
                          : selectedLanguage === "zh-CN"
                            ? "没有数据"
                            : "No Data"}
                      </p>
                    </div>
                    <div className="flex items-center mb-[10px]">
                      <p className="text-black text-[15px] font-medium capitalize">
                        {selectedLanguage === "zh-CN"
                          ? "总金额："
                          : "Total Amount:"}
                      </p>
                      <p className="text-black text-[15px] font-light capitalize ml-3">
                        <span>
                          {selectedClient?.item_list?.[0]?.goods_price
                            ? selectedClient?.item_list?.[0]?.goods_price
                            : 0}{" "}
                          ¥
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-black text-[15px] font-medium capitalize">
                        {selectedLanguage === "zh-CN"
                          ? "收到付款："
                          : "Received Payment:"}
                      </p>
                      <p className="text-black text-[15px] font-light capitalize ml-3">
                        <span>
                          {selectedClient?.pay_amount
                            ? selectedClient?.pay_amount
                            : 0}
                          ¥
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                {/* body middle */}
                <div className="my-5 flex items-center gap-2">
                  <input
                    placeholder={
                      selectedLanguage === "zh-CN" ? "信息" : "Message"
                    }
                    className="w-[330px] h-10 rounded-md p-2 bg-[#0043681A] focus:outline-none"
                  />
                  <input
                    placeholder={
                      selectedLanguage === "zh-CN" ? "评论" : "Remark"
                    }
                    className="w-[250px] h-10 rounded-md p-2 bg-[#0043681A] focus:outline-none"
                  />
                  <select className="h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[15px] py-2 text-center inline-flex items-center bg-[#0043681A] ">
                    <option disabled selected>
                      {selectedLanguage === "zh-CN" ? "标识" : "Logo"}
                    </option>
                    {logoOptions.map((status, index) => (
                      <option key={index} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <select className="w-[180px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[15px] py-2 text-center inline-flex items-center bg-[#0043681A] ">
                    <option disabled selected>
                      {selectedLanguage === "zh-CN" ? "横幅" : "Banner"}
                    </option>
                    {bannerOptions.map((status, index) => (
                      <option key={index} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <select className="w-[180px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[15px] py-2 text-center inline-flex items-center bg-[#0043681A] ">
                    <option disabled selected>
                      {selectedLanguage === "zh-CN" ? "账单" : "Bill"}
                    </option>
                    {billOptions.map((status, index) => (
                      <option key={index} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                {/* body bottom */}
                <div className="flex items-center">
                  <div className="flex items-center justify-center">
                    <div className="">
                      <img
                        src={
                          selectedClient?.item_list?.[0]?.goods_img
                            ? selectedClient?.item_list?.[0]?.goods_img
                            : "No Data"
                        }
                        alt="productImage"
                        className="w-40 h-32 rounded-md"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-[#004368] text-[15px] font-bold leading-normal capitalize mb-4">
                        {selectedLanguage === "zh-CN"
                          ? "产品详情"
                          : "Product Details"}
                      </p>
                      <div className="flex items-center mb-[10px]">
                        <p className="text-black text-[15px] font-medium capitalize">
                          {selectedLanguage === "zh-CN" ? "价格：" : "Price:"}
                        </p>
                        <p className="text-black text-[15px] font-light capitalize ml-3">
                          {selectedClient?.item_list?.[0]?.goods_price
                            ? selectedClient?.item_list?.[0]?.goods_price
                            : 0}{" "}
                          ¥
                        </p>
                      </div>
                      <div className="flex items-center mb-[10px]">
                        <p className="text-black text-[15px] font-medium capitalize">
                          {selectedLanguage === "zh-CN"
                            ? "项目编号："
                            : "Item Number:"}
                        </p>
                        <p className="text-black text-[15px] font-light capitalize ml-3">
                          {selectedClient?.item_list?.[0]?.goods_spec}
                        </p>
                      </div>
                      <div className="flex items-center mb-[10px]">
                        <p className="text-black text-[15px] font-medium capitalize">
                          {selectedLanguage === "zh-CN"
                            ? "销售属性："
                            : "Sales Attributes:"}
                        </p>
                        <p className="text-black text-[15px] font-light capitalize ml-3">
                          {selectedLanguage === "zh-CN"
                            ? "一年保修"
                            : "One Year Warranty"}
                        </p>
                        <div className="flex items-center ml-[135px]">
                          <p className="text-black text-[15px] font-medium capitalize">
                            {selectedLanguage === "zh-CN" ? "颜色：" : "Color:"}
                          </p>
                          <p className="text-black text-[15px] font-light capitalize ml-3">
                            {selectedLanguage === "zh-CN"
                              ? "蓝白色"
                              : "Blue, White"}
                          </p>
                        </div>
                        <div className="flex items-center ml-[60px] mb-[10px]">
                          <p className="text-black text-[15px] font-medium capitalize">
                            {selectedLanguage === "zh-CN"
                              ? "数量："
                              : "Quantity:"}
                          </p>
                          <p className="text-black text-[15px] font-light capitalize ml-3">
                            {selectedClient?.item_list?.[0]?.goods_count}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* end section button */}
      <div className="py-7 pr-7">
        <div className="flex items-center justify-end">
          <Link
            to="/manualorder"
            className="w-52 h-10 bg-white text-[#004368] rounded-md border flex items-center justify-center hover:bg-[#004368] hover:text-white p-2"
          >
            <FaEdit className="w-4 h-4" />
            <span className="text-[15px] font-medium leading-normal capitalize pl-2">
              {selectedLanguage === "zh-CN"
                ? "创建手动订单"
                : "Create manual order"}
            </span>
          </Link>
          <Link
            to="/batchprintexpressdelivery"
            className="w-52 h-10 bg-white text-[#004368]  hover:bg-[#004368] hover:text-white rounded-md border flex items-center justify-center p-2 ml-3"
          >
            <MdOutlineLocalPrintshop className="w-[18px] h-[18px]" />
            <span className="text-[15px] font-medium leading-normal capitalize pl-1 hover:text-white">
              {selectedLanguage === "zh-CN"
                ? "打印快递"
                : "print express delivery"}
            </span>
          </Link>
          {/* <button className="w-52 h-10 bg-white text-[#004368]  hover:bg-[#004368] hover:text-white rounded-md border flex items-center p-2 ml-3">
            <MdOutlineLocalPrintshop className="w-[18px] h-[18px]" />
            <span className="text-[15px] font-medium leading-normal capitalize pl-1">
              print delivery note
            </span>
          </button> */}
          {/* <button className="w-52 h-10 bg-white text-[#004368]  hover:bg-[#004368] hover:text-white rounded-md border flex items-center p-2 ml-3">
            <TbTruckDelivery className="w-[18px] h-[18px]" />
            <span className="text-[15px] font-medium leading-normal capitalize pl-2">
              shipping same date
            </span>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default SinglePrint;
