import React, { useEffect, useRef, useState } from "react";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import {
  arrayToExcel,
  generateRandomNumberForOrder_sn,
  generateRandomNumberWithTime,
} from "../../Share/Function/FunctionalComponent";
import { useDispatch, useSelector } from "react-redux";
import { checkedItemsChange } from "../../features/slice/userSlice";
import {
  deliveryCompanyNames,
  provinceOptions,
} from "../../Share/Data/ClientData";
import ManualOrderModal from "./ManualOrderModal";
import StoredDeliveryCompanyList from "../../Share/StoredDeliveryCompanyList/StoredDeliveryCompanyList";
import NewSearchComponent from "../../Share/SearchComponent/NewSearchComponent";
import * as XLSX from "xlsx";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { filterDataBySearchFields } from "../../Share/SearchComponent/SearchComponentFunction";
import {
  useGetManualOrderQuery,
  useSetManualOrderMutation,
} from "../../features/allApis/manualOrderApi";
import { useGetSenderInfoQuery } from "../../features/allApis/senderInfoApi";
import toast from "react-hot-toast";
import { useGetAllAddressQuery } from "../../features/allApis/allAddressApi";
import axios from "axios";
import ConfirmationModal from "../../Share/ConfirmationModal";
import { TiInfoOutline } from "react-icons/ti";
import { AiOutlineCheckCircle } from "react-icons/ai";
import FadeLoader from "react-spinners/FadeLoader";
import { useTranslation } from "react-i18next";

const ManualOrder = () => {
  //   language change
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [senderInfo, setSenderInfo] = useState({});
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [deliveryCompanyName, setDeliveryCompanyName] = useState(
    deliveryCompanyNames[0]
  );
  const [tikTokOrderStatusCheck, setTikTokOrderStatusCheck] =
    useState("AWAITING_SHIPMENT");

  const { t } = useTranslation();

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
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const [leftPaginationBtn, setLeftPaginationBtn] = useState(false);
  const [rightPaginationBtn, setRightPaginationBtn] = useState(true);

  // user get from local storage
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("GrozziieToken");
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/GrozziiePrint-LoginRegistration/user/details",
        {
          params: { token: token },
        }
      );
      setUserEmail(response?.data?.email);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // sender data get from server
  const { data: senderInfoServer, isError: senderError } =
    useGetSenderInfoQuery(userEmail);

  // Function to handle the master checkbox change
  const handleMasterCheckboxChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setCheckedItems(customersData);
    } else {
      setCheckedItems([]);
    }
  };

  // Function to handle individual checkbox change
  const handleCheckboxChange = (customer) => {
    if (checkedItems.some((item) => item?.id === customer?.id)) {
      // If the customer id is already in the checkedItems, remove it
      const updatedItems = checkedItems.filter(
        (item) => item?.id !== customer?.id
      );
      setCheckedItems(updatedItems);
      setSelectAll(false);
    } else {
      // If the customer id is not in the checkedItems, add it
      const updatedItems = [...checkedItems, customer];
      setCheckedItems(updatedItems);
      if (updatedItems.length === customersData.length) {
        setSelectAll(true);
      }
    }
  };

  const handleOptionChange = (company, index) => {
    setSelectedOption(index);
    setDeliveryCompanyName(company);
  };

  const handleToReset = () => {
    // console.log("set as initially");
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

  // searing functionalities in here

  const [searchAllQuery, setSearchAllQuery] = useState("");

  const handleSearchAllChange = (event) => {
    setSearchAllQuery(event.target.value);
  };

  // const filteredAllProduct = mallProduct.filter((request) =>
  //   request?.productName.toLowerCase().includes(searchAllQuery.toLowerCase()) ||
  //   request?.productCountryName.toLowerCase().includes(searchAllQuery.toLowerCase()) ||
  //   request?.productPrice.toLowerCase().includes(searchAllQuery.toLowerCase()) ||
  //   // request?.id.includes(searchAllQuery.toLowerCase()) ||
  //   request?.modelNumber.toLowerCase().includes(searchAllQuery.toLowerCase())
  //   // request?.printerColo.toLowerCase().includes(searchAllQuery.toLowerCase())
  // );

  // pagination part
  const [showPage, setShowPage] = useState(1);
  const [currentBar, setCurrentBar] = useState(1);
  const [customersData, setCustomersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [senderData, setSenderData] = useState([]);
  const [goodsData, setGoodsData] = useState({});
  const [totalPart, setTotalPart] = useState(
    Math.ceil(customersData?.length / 5)
  );

  const [currentCustomerData, setCurrentCustomerData] = useState(
    customersData?.slice(0, 5)
  );

  const handleToShowCurrentBarData = (count) => {
    if (count <= totalPart) {
      const currentData = count * 5;
      // setCurrentCustomerData(customersData.slice(currentData - 5, currentData));
      // setCurrentBar(count);
      setFilteredData(customersData.slice(currentData - 5, currentData));
      setCurrentBar(count);
    }
  };
  // pagination next option
  const handleToNext = (count) => {
    if (count <= totalPart) {
      if (count > 1) {
        setLeftPaginationBtn(true);
      } else {
        setLeftPaginationBtn(false);
      }

      if (count === totalPart) {
        setRightPaginationBtn(false);
      } else {
        setRightPaginationBtn(true);
      }

      const currentData = count * 5;
      // setCurrentCustomerData(customersData.slice(currentData - 5, currentData));
      // setCurrentBar(count);
      setFilteredData(customersData.slice(currentData - 5, currentData));
      setCurrentBar(count);
    } else {
      setRightPaginationBtn(false);
    }
  };

  // const handleToNext = (count) => {
  //   if (count <= totalPart) {
  //     const currentData = count * 5;
  //     // setCurrentCustomerData(customersData.slice(currentData - 5, currentData));
  //     // setCurrentBar(count);
  //     setFilteredData(customersData.slice(currentData - 5, currentData));
  //     setCurrentBar(count);
  //   }
  // };

  // const handleToPrevious = (count) => {
  //   if (count > 0) {
  //     const currentData = count * 5;
  //     // setCurrentCustomerData(customersData.slice(currentData - 5, currentData));
  //     // setCurrentBar(count);
  //     setFilteredData(customersData.slice(currentData - 5, currentData));
  //     setCurrentBar(count);
  //   }
  // };

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

      const currentData = count * 5;
      // setCurrentCustomerData(customersData.slice(currentData - 5, currentData));
      // setCurrentBar(count);
      setFilteredData(customersData.slice(currentData - 5, currentData));
      setCurrentBar(count);
    } else {
      setLeftPaginationBtn(false);
    }
  };

  // details modal functionality
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Province, city, district data get
  const { data: getAllAddressData } = useGetAllAddressQuery();
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState("");
  const [formData, setFormData] = useState({
    sender_name: "",
    sender_userName: "",
    sender_name_mask: "",
    sender_address: "",
    sender_district: "",
    sender_city: "",
    sender_province: "",
    sender_country: "中国",
    sender_town: "",
    sender_company_name: "",
    sender_phone: "",
    created_time: "",
    receiver_name: "",
    receiver_userName: "",
    receiver_name_mask: "",
    receiver_company_name: "",
    city: "",
    receiver_district: "",
    province: "",
    country: "中国",
    receiver_address: "",
    town: "",
    receiver_phone: "",
    order_sn: "",
    store_info: {
      store_id: 0,
      store_name: "",
      store_number: "",
    },
    pay_amount: 0,
    refund_status: "",
    remark: "",
    shipping_time: "",
    shipping_type: 0,
  });

  useEffect(() => {
    if (
      getAllAddressData?.logistics_address_get_response?.logistics_address_list
    ) {
      // Extract provinces from data
      const provincesData =
        getAllAddressData.logistics_address_get_response.logistics_address_list.filter(
          (item) => item.region_type === 1
        );
      // Store the provinces data in state
      setProvinces(provincesData);
    }
  }, [getAllAddressData]);

  const filterCityUnderProvince = (parentId) => {
    // console.log("Call");
    // console.log(parentId);
    const cityData =
      getAllAddressData?.logistics_address_get_response?.logistics_address_list?.filter(
        (item) => item.parent_id === parentId
      );
    setCities(cityData);
  };

  const filterDistrictUnderCity = (parentId) => {
    const districtData =
      getAllAddressData?.logistics_address_get_response?.logistics_address_list?.filter(
        (item) => item.parent_id === parentId
      );
    setDistricts(districtData);
  };

  const handleDetailsClick = (customerData) => {
    setSelectedCustomer(customerData);
    setIsModalOpen(true);
    // document.getElementById("my_modal_2").showModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.getElementById("my_modal_1").close();
  };

  // Close modal if clicked outside the modal
  useEffect(() => {
    const handleClickOutsideModal = (e) => {
      if (e.target.tagName === "DIALOG" && isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener("click", handleClickOutsideModal);

    return () => {
      window.removeEventListener("click", handleClickOutsideModal);
    };
  }, [isModalOpen]);

  //make array to excel
  const handleBatchPrinterExcelClick = () => {
    arrayToExcel(checkedItems, "BatchPrinterCustomerList");
  };

  // Dell the value of checked items
  const checkedItemsChecking = useSelector(
    (state) => state.user.checkedItemsFromRedux
  );
  const dispatch = useDispatch();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [showConfirmButton, setShowConfirmButton] = useState(false);

  // modal show function
  const handleToCheckItemsUpdate = () => {
    if (checkedItems.length === 0) {
      setModalTitle(
        <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
          <TiInfoOutline className="w-10 h-10 text-red-600" />
        </div>
      );
      setModalMessage(
        <p>
          {selectedLanguage === "zh-CN"
            ? "沒有選擇任何項目。"
            : "No items selected."}
        </p>
      );
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
          {selectedLanguage === "zh-CN"
            ? "您确定接受这个订单吗？"
            : "Are you sure to accept this order?"}
        </p>
      );
      setConfirmAction(() => handleConfirm);
      setShowConfirmButton(true);
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirm = () => {
    // Implement order update API logic here
    dispatch(checkedItemsChange({ items: checkedItems, from: "ManualOrder" }));
    navigate("/batchprintexpressdelivery");
  };

  // const handleToCheckItemsUpdate = () => {
  //   dispatch(checkedItemsChange({ items: checkedItems, from: "ManualOrder" }));
  // };

  const handleSenderInformation = (event) => {
    if (event.target.value === "") {
      // Handle default case here
      return;
    }
    const selectedSender = JSON.parse(event.target.value);
    setSenderInfo(selectedSender);
    setFormData({
      ...formData,
      company_name: senderInfo?.company_name,
      sender_name: senderInfo?.sender_name,
      sender_userName: senderInfo?.userName,
      sender_name_mask: "",
      sender_address: senderInfo?.address,
      sender_district: senderInfo?.district,
      sender_city: senderInfo?.city,
      sender_province: senderInfo?.province,
      sender_country: senderInfo?.country,
      sender_town: "",
      sender_company_name: senderInfo?.company_name,
      sender_phone: senderInfo?.sender_phone,
    });
  };

  const handleProvince = (event) => {
    setProvince(event.target.value);
    setFormData({
      ...formData,
      province,
    });
  };

  const handleCity = (event) => {
    setCity(event.target.value);
    setFormData({
      ...formData,
      city,
    });
  };

  //make function for import data
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      // Assuming the first sheet is the one you want to convert
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      // Convert the sheet to an array of objects
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      // Process each row to extract and convert image data to base64
      const jsonDataWithImagesConverted = jsonData.map((row) => {
        const newRow = { ...row };
        // Check if the row contains an image column (modify 'imageColumn' with your actual image column name)
        if (newRow.goods_img) {
          const imageCell = sheet[newRow.goods_img];
          if (
            imageCell &&
            imageCell.t === "d" &&
            imageCell.l &&
            imageCell.l.target
          ) {
            const imageId = imageCell.l.target.split("#")[1]; // Extract image relationship ID
            const imageData = workbook.Sheets["xl/media"][`image${imageId}`]; // Get the image data from 'xl/media' sheet
            if (imageData) {
              const base64ImageData = `data:${
                imageData.ContentType
              };base64,${btoa(imageData._data)}`; // Convert image data to base64
              newRow.imageBase64 = base64ImageData; // Store base64 image data in a new property (modify 'imageBase64' with your desired property name)
            }
          }
        }
        return newRow;
      });
      setGoodsData(jsonDataWithImagesConverted);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImportOrderClick = () => {
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
  };

  // Function to update form data based on input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getCurrentDateTime = () => {
    const now = new Date();

    // Get date components
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(now.getDate()).padStart(2, "0");

    // Get time components
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    // Construct formatted date and time string
    const dateTimeStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return dateTimeStr;
  };

  // data mutation form server
  const [setManualOrder] = useSetManualOrderMutation();

  // manual order data fetch via redux
  const {
    data: manualOrderData,
    isLoading,
    isError,
  } = useGetManualOrderQuery();

  // modal submit function
  const handleModalSubmit = (e) => {
    e.preventDefault();

    setManualOrder({
      ...formData,
      order_sn: generateRandomNumberForOrder_sn(),
      receiver_name: formData.receiver_name,
      receiver_userName: formData.receiver_userName,
      receiver_company_name: formData.receiver_company_name,
      country: "中国",
      province: selectedProvince,
      city: selectedCity,
      receiver_district: selectedDistricts,
      town: selectedDistricts,
      address: formData.receiver_address,
      receiver_phone: formData.receiver_phone,
      sender_name: senderInfo?.sender_name,
      company_name: senderInfo?.company_name,
      sender_phone: senderInfo?.sender_phone,
      created_time: getCurrentDateTime(),
      item_list: [
        {
          goods_count: parseInt(goodsData[0]?.number),
          goods_id: parseInt(goodsData[0]?.goods_id),
          // goods_img: goodsData[0]?.Image64,
          goods_img: `https://grozziieget.zjweiting.com:3091/GrozziiePrint-WebAPI/fileUpload/${goodsData[0]?.Image}`,
          goods_name: goodsData[0]?.goods_name,
          goods_price: parseInt(goodsData[0]?.goods_price),
          goods_spec: goodsData[0]?.goods_spec,
          sku_id: "",
        },
      ],
    });

    setFormData({
      senderInfo: "",
      account_name: "",
      receiver_name: "",
      receiver_name_mask: "",
      receiver_phone: "",
      receiver_home_phone: "",
      receiver_address: "",
      province: "",
      city: "",
      company: "",
      pay_amount: "",
      remark: "",
    });
    document.getElementById("my_modal_1").close();
  };

  const handleModalToCheckAndSave = (e) => {
    e.preventDefault();
    setManualOrder({
      ...formData,
      order_sn: generateRandomNumberForOrder_sn(),
      province,
      city,
      sender_name: senderInfo?.sender_name,
      address: senderInfo?.address,
      company_name: senderInfo?.company_name,
      sender_phone: senderInfo?.sender_phone,
      created_time: getCurrentDateTime(),
      item_list: [
        {
          goods_count: parseInt(goodsData[0]?.number),
          goods_id: parseInt(goodsData[0]?.goods_id),
          goods_img: goodsData[0]?.Image64,
          goods_name: goodsData[0]?.goods_name,
          goods_price: parseInt(goodsData[0]?.goods_price),
          goods_spec: goodsData[0]?.goods_spec,
          sku_id: "",
        },
      ],
    });

    dispatch(
      checkedItemsChange({
        items: [
          {
            ...formData,
            order_sn: generateRandomNumberForOrder_sn(),
            province,
            city,
            sender_name: senderInfo?.sender_name,
            address: senderInfo?.address,
            company_name: senderInfo?.company_name,
            sender_phone: senderInfo?.sender_phone,
            created_time: getCurrentDateTime(),
            item_list: [
              {
                goods_count: parseInt(goodsData[0]?.number),
                goods_id: parseInt(goodsData[0]?.goods_id),
                goods_img: goodsData[0]?.Image64,
                goods_name: goodsData[0]?.goods_name,
                goods_price: parseInt(goodsData[0]?.goods_price),
                goods_spec: goodsData[0]?.goods_spec,
                sku_id: "",
              },
            ],
          },
        ],
        from: "ManualOrder",
      })
    );

    setFormData({
      senderInfo: "",
      account_name: "",
      receiver_name: "",
      receiver_name_mask: "",
      receiver_phone: "",
      receiver_home_phone: "",
      receiver_address: "",
      province: "",
      city: "",
      company: "",
      pay_amount: "",
      remark: "",
    });
    document.getElementById("my_modal_1").close();
    toast.success("Data successfully added to server.");
    navigate("/batchprintexpressdelivery");
  };

  useEffect(() => {
    if (totalPart <= 1) {
      setLeftPaginationBtn(false);
      setRightPaginationBtn(false);
    } else {
      setLeftPaginationBtn(false);
      setRightPaginationBtn(true);
    }
    setCustomersData(manualOrderData);
    setFilteredData(manualOrderData);
  }, [manualOrderData]);

  useEffect(() => {
    setCurrentCustomerData(customersData?.slice(0, 5));
    setTotalPart(Math.ceil(customersData?.length / 5));
  }, [customersData]);

  useEffect(() => {
    setFilteredData(customersData?.slice(0, 5));
  }, [customersData]);

  // make excel file
  const [data, setData] = useState({
    goods_id: "",
    goods_name: "",
    goods_price: "",
    number: "",
    image: "",
    imageURL: "",
  });

  const handleExcelInputChange = (event, key) => {
    const { value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", event.target.files[0]);

    const response = await fetch(
      `https://grozziieget.zjweiting.com:3091/GrozziiePrint-WebAPI/fileUpload/multiple`,
      {
        method: "POST",
        body: formData,
      }
    );
    const res = await response.json();
    console.log(res);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setData((prevData) => ({
          ...prevData,
          image: e.target.result,
          imageURL: res[0],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Add headers
    worksheet.addRow([
      "goods_id",
      "goods_name",
      "goods_spec",
      "goods_price",
      "number",
      "Image64",
      "Image",
      "ImageURL",
    ]);

    // Add data row
    worksheet.addRow([
      data.goods_id,
      data.goods_name,
      data.goods_spec,
      data.goods_price,
      data.number,
      data.image,
      data.imageURL,
    ]);

    // Add image
    const imgData = data.image.split(",")[1];
    const imageId = workbook.addImage({
      base64: imgData,
      extension: ".png",
    });

    worksheet.addImage(imageId, {
      tl: { col: 5, row: 1 }, // Adjust the row number accordingly
      br: { col: 6, row: 2 }, // Adjust the row number accordingly
      editAs: "oneCell",
    });

    // Remove base64 data column
    worksheet.getColumn(5).hidden = true;

    // Save the workbook
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${data.goods_name}.xlsx`);
  };

  const handleToSearch = () => {
    document.getElementById("searchInput").value = "";
    // Usage:
    const filteredMultipleSearchingData = filterDataBySearchFields(
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
          setTikTokOrderStatusCheck={setTikTokOrderStatusCheck}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
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
          currentRenderingPage={"ManualOrderPage"}
        />

        {/* middle section */}
        <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] p-4 mt-5 grid grid-cols-12">
          {/* add new template with modal (I hope problem in here)*/}
          <div className="col-span-2">
            <ManualOrderModal
              handleModalSubmit={handleModalSubmit}
              handleModalToCheckAndSave={handleModalToCheckAndSave}
              handleSenderInformation={handleSenderInformation}
              senderData={senderData}
              formData={formData}
              handleInputChange={handleInputChange}
              closeModal={closeModal}
              provinceOptions={provinceOptions}
              handleProvince={handleProvince}
              handleCity={handleCity}
              handleFileChange={handleFileChange}
              handleImportOrderClick={handleImportOrderClick}
              senderInfoServer={senderInfoServer}
              senderError={senderError}
              setSelectedProvince={setSelectedProvince}
              setSelectedCity={setSelectedCity}
              setSelectedDistricts={setSelectedDistricts}
              filterCityUnderProvince={filterCityUnderProvince}
              filterDistrictUnderCity={filterDistrictUnderCity}
              provinces={provinces}
              cities={cities}
              districts={districts}
              selectedLanguage={selectedLanguage}
            />
          </div>
          <div className="col-span-10 custom-scrollbar">
            <StoredDeliveryCompanyList />
          </div>
        </div>

        {/* bottom section table */}
        <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] p-4 mt-5">
          {/* top */}

          {/* <div className="grid grid-cols-6 items-center justify-center px-7 pl-3 pt-2"> */}
          <div className="flex items-center justify-between pl-3 pt-2">
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
            {/* <div className="col-span-1">
              <p className="text-[#004368] text-sm font-medium capitalize text-center">
                waiting for shipment
              </p>
            </div>
         
            <div className="col-span-1 flex items-center justify-center">
              <p className="text-black opacity-40 text-sm font-medium capitalize">
                500 buyers
              </p>
              <div className="w-[1px] h-8 bg-black opacity-40 mx-2"></div>
              <p className="text-black opacity-40 text-sm font-medium capitalize">
                700 orders
              </p>
            </div>
           
            <div className="col-span-1 flex items-center justify-center">
              <p className="text-[#004368] text-sm font-normal capitalize cursor-pointer">
                split order
              </p>
              <div className="w-[1px] h-8 bg-[#004368] mx-2"></div>
              <p className="text-[#004368] text-sm font-normal capitalize cursor-pointer">
                import order
              </p>
            </div> */}

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
                    className={`text-[#004368] text-opacity-20 inline-flex items-center justify-center w-8 h-8 text-sm border rounded shadow-md bg-white dark:border-gray-800 ${
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
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
              {/* <div className="flex items-center justify-center px-7 cursor-pointer">
                <img src={Settings} alt="settings" className="w-4 h-4" />
                <p className="ml-2 text-[#004368] text-sm font-medium capitalize">
                  settings
                </p>
              </div> */}
              <button
                onClick={handleBatchPrinterExcelClick}
                className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[115px] h-10 px-8 py-2 rounded-md cursor-pointer"
              >
                <p className="text-[15px] font-medium capitalize cursor-pointer">
                  {t("Export")}
                </p>
              </button>
            </div>
          </div>

          {/* table */}
          <div className="mt-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center pt-10 text-center w-full mx-auto pb-60">
                <FadeLoader color="#004368" size={25} />
                <p className="text-2xl font-medium pt-10 text-[#004368]">
                  {t("DataLoading")}
                </p>
              </div>
            ) : isError ? (
              <p className="text-center text-3xl text-red-500 font-medium py-20">
                {t("DataNotFound")}
              </p>
            ) : (
              <table className="table">
                <thead className="">
                  <tr className="h-11 text-black text-opacity-80 capitalize text-center text-sm font-normal leading-4">
                    <th className="sticky top-0 bg-[#0043681A] bg-opacity-80 rounded-l-md">
                      <span className="mr-[10px]">{t("AccountName")}</span>
                      <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                    </th>
                    <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
                      <span className="mr-[10px]">{t("CustomerName")}</span>
                      <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                    </th>
                    <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
                      <span className="mr-[10px]">{t("Address")}</span>
                      <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                    </th>
                    <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
                      <span className="mr-[10px]">{t("CustomerMark")}</span>
                      <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                    </th>
                    <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
                      <span className="mr-[10px]">
                        {selectedLanguage === "zh-CN"
                          ? "快递公司"
                          : "Delivery Company"}
                      </span>
                      <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                    </th>
                    <th className="sticky top-0 bg-[#0043681A] bg-opacity-80">
                      <span className="mr-[10px]">
                        {selectedLanguage === "zh-CN" ? "总薪酬" : "Total Pay"}
                      </span>
                      <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                    </th>
                    <th className="sticky top-0 bg-[#0043681A] bg-opacity-80 rounded-r-md">
                      {selectedLanguage === "zh-CN"
                        ? "产品详情"
                        : "Product Details"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {currentCustomerData?.map((customerData) => ( */}
                  {filteredData?.map((customerData) => (
                    <tr
                      className={`capitalize hover:bg-[#0043681A] cursor-pointer`}
                      key={customerData?.id}
                    >
                      <td className="flex items-center justify-start cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded-[2px] text-black text-opacity-60 bg-[#004368] cursor-pointer"
                          name="product"
                          value={customerData?.id}
                          // checked={checkedItems.includes(customerData.id)}
                          checked={checkedItems.some(
                            (item) => item?.id === customerData?.id
                          )}
                          onChange={() => handleCheckboxChange(customerData)}
                          // checked={selectedItems.includes(product.id)}
                          // onChange={() => handleCheckboxChange(product.id)}
                          // onClick={() => handleProductCheck(product)}
                        />
                        <p className="ml-2 text-black text-opacity-80 text-sm font-normal leading-4 capitalize">
                          {customerData?.account_name.length > 10
                            ? customerData?.account_name.slice(0, 10) + " ..."
                            : customerData?.account_name}
                        </p>
                      </td>
                      <td className="text-black text-opacity-80 text-sm font-normal leading-4 capitalize">
                        {customerData?.receiver_name.length > 15
                          ? customerData?.receiver_name.slice(0, 15) + " ..."
                          : customerData?.receiver_name}
                      </td>
                      <td className="text-black text-opacity-80 text-sm font-normal leading-4 capitalize">
                        {customerData?.receiver_address.length > 7
                          ? customerData?.receiver_address.slice(0, 7) + " ..."
                          : customerData?.receiver_address}
                      </td>
                      <td className="text-black text-opacity-80 text-sm font-normal leading-4 capitalize">
                        {customerData?.remark.length > 15
                          ? customerData?.remark.slice(0, 15) + " ..."
                          : customerData?.remark}
                      </td>
                      <td className="text-black text-opacity-80 text-sm font-normal leading-4 capitalize">
                        {customerData?.company_name?.length > 15
                          ? customerData?.company_name.slice(0, 15) + " ..."
                          : customerData?.company_name}
                      </td>
                      <td className="text-black text-opacity-80 text-sm font-normal leading-4 capitalize">
                        {customerData?.pay_amount} ¥
                      </td>
                      <td className="flex items-center justify-between cursor-pointer">
                        <img
                          src={customerData?.item_list[0]?.goods_img}
                          alt="TP874"
                          className="w-9 h-8"
                        />
                        <span className="text-black text-opacity-80 text-sm font-normal leading-4 capitalize ml-[6px] mr-11">
                          {customerData?.item_list[0]?.goods_name?.slice(0, 10)}
                        </span>
                        <p
                          className="text-[#004368] text-xs font-normal leading-[14px] capitalize cursor-pointer"
                          onClick={() => handleDetailsClick(customerData)}
                        >
                          {t("Details")}
                        </p>
                        {selectedCustomer && isModalOpen && (
                          <dialog
                            id="my_modal_1"
                            className="modal"
                            open={isModalOpen}
                          >
                            <div className="">
                              <div className="modal-action w-full text-center flex justify-end pr-10">
                                <div className="card w-[900px] h-[450px] bg-white shadow-md rounded-xl relative">
                                  <div className="absolute top-4 right-8">
                                    <RxCross1
                                      onClick={closeModal}
                                      className="w-5 h-5 text-[#004368] text-opacity-35 hover:text-[#004368]"
                                    />
                                  </div>
                                  <div className="grid grid-cols-9 w-full mx-auto my-auto">
                                    <figure className="mx-4 my-auto col-span-4 w-[390px] h-[390px]">
                                      <img
                                        src={
                                          selectedCustomer?.item_list[0]
                                            ?.goods_img
                                        }
                                        // src="https://img.pddpic.com/mms-material-img/2021-09-29/0ad8763e-a358-40bd-8b71-3f5fa26a143d.jpeg.a.jpeg"
                                        alt="ProductImage"
                                        className="rounded-xl"
                                      />
                                    </figure>
                                    <div className="card-body text-start col-span-5 flex flex-col justify-center">
                                      <h2 className="text-xl font-semibold text-black">
                                        {selectedLanguage === "zh-CN"
                                          ? "中文名称："
                                          : "Product Name:"}
                                        <span className="font-light text-black text-opacity-90 text-sm ml-2">
                                          {selectedCustomer?.item_list[0]
                                            ?.goods_name
                                            ? selectedCustomer?.item_list[0]
                                                ?.goods_name
                                            : t("NoData")}
                                        </span>
                                      </h2>
                                      <h5 className="text-xl font-semibold text-black">
                                        {selectedLanguage === "zh-CN"
                                          ? "客户名称："
                                          : "Customer Name:"}
                                        <span className="font-light text-black text-opacity-90 text-sm ml-2">
                                          {selectedCustomer?.account_name
                                            ? selectedCustomer?.account_name
                                            : t("NoData")}
                                        </span>
                                      </h5>
                                      <h5 className="text-xl font-semibold text-black">
                                        {t("CustomerMark")}
                                        <span className="font-light text-black text-opacity-90 text-sm ml-2">
                                          {selectedCustomer?.remark
                                            ? selectedCustomer?.remark
                                            : t("NoData")}
                                        </span>
                                      </h5>
                                      <h5 className="text-xl font-semibold text-black">
                                        {selectedLanguage === "zh-CN"
                                          ? "快递公司："
                                          : "Delivery Company:"}

                                        <span className="font-light text-black text-opacity-90 text-sm ml-2">
                                          {selectedCustomer.company_name
                                            ? selectedCustomer.company_name
                                            : t("NoData")}
                                        </span>
                                      </h5>
                                      <h5 className="text-xl font-semibold text-black">
                                        {selectedLanguage === "zh-CN"
                                          ? "支付金额："
                                          : "Pay Amount:"}

                                        <span className="font-light text-black text-opacity-90 text-sm ml-2">
                                          {selectedCustomer.pay_amount
                                            ? `${selectedCustomer.pay_amount} `
                                            : t("NoData")}{" "}
                                          ¥
                                        </span>
                                      </h5>
                                      <div className="absolute bottom-8 right-8">
                                        <p
                                          className="bg-[#004368] bg-opacity-30 hover:bg-[#004368] text-black hover:text-white w-[100px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mt-5"
                                          onClick={closeModal}
                                        >
                                          {t("Close")}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </dialog>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* end section button */}
      <div className="mt-7 mr-8">
        <div className="flex items-center justify-end gap-x-14">
          {/* <button className="w-52 h-10 bg-white text-[#004368] rounded-md border flex items-center hover:bg-[#004368] hover:text-white p-2">
            <FaEdit className="w-4 h-4" />
            <span className="text-[15px] font-medium leading-normal capitalize pl-2">
              Create manual order
            </span>
          </button>
          <button
            className="w-52 h-10 bg-white text-[#004368]  hover:bg-[#004368] hover:text-white rounded-md border flex items-center p-2 ml-3">
            <MdOutlineLocalPrintshop className="w-[18px] h-[18px]" />
            <span className="text-[15px] font-medium leading-normal capitalize pl-1 hover:text-white">
              print express delivery
            </span>
          </button>

          <button className="w-52 h-10 bg-white text-[#004368]  hover:bg-[#004368] hover:text-white rounded-md border flex items-center p-2 ml-3">
            <TbTruckDelivery className="w-[18px] h-[18px]" />
            <span className="text-[15px] font-medium leading-normal capitalize pl-2">
              shipping same date
            </span>
          </button> */}

          {/* <Link to="/batchprintexpressdelivery"> */}
          <button
            onClick={handleToCheckItemsUpdate}
            className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[180px] h-10 px-8 py-2 rounded-md cursor-pointer flex items-center justify-center"
          >
            <span className=" h-10  flex items-center justify-center p-2 ">
              <MdOutlineLocalPrintshop className="w-[18px] h-[18px]" />
              <span className="text-[15px] font-medium leading-normal capitalize pl-1">
                {selectedLanguage === "zh-CN" ? "打印" : "Print"}
              </span>
            </span>
          </button>

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

          {/* Excel Making modal */}

          <div className="flex items-center justify-end">
            <div>
              <div
                className="bg-[#004368] bg-opacity-[0.10] rounded-md cursor-pointer text-[#004368] mr-5 hover:bg-[#004368] hover:text-white"
                onClick={() =>
                  document.getElementById("my_modal_settings").showModal()
                }
              >
                <button className="w-40 h-10 py-2 text-[15px] font-medium capitalize leading-normal">
                  {selectedLanguage === "zh-CN"
                    ? "添加新产品"
                    : "Add New Product"}
                </button>
              </div>

              <dialog id="my_modal_settings" className="modal">
                <div className="bg-white w-[700px] h-[500px] rounded-md pt-7">
                  <h3 className="font-bold text-xl pl-5">
                    {selectedLanguage === "zh-CN"
                      ? "添加商品数据"
                      : "Add Product Data"}
                  </h3>
                  <div className="modal-action w-full text-center flex justify-end px-5 py-7">
                    <form method="dialog">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700">
                            {selectedLanguage === "zh-CN"
                              ? "商品编号"
                              : "Goods Id"}
                          </label>
                          <input
                            type="text"
                            required
                            aria-required
                            placeholder={
                              selectedLanguage === "zh-CN"
                                ? "请输入商品编号"
                                : "Please enter goods id"
                            }
                            value={data.goods_id}
                            onChange={(e) =>
                              handleExcelInputChange(e, "goods_id")
                            }
                            className="border border-gray-300 outline-none rounded-md px-3 py-2 mt-1 w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700">
                            {selectedLanguage === "zh-CN"
                              ? "商品名称"
                              : "Goods Name"}
                          </label>
                          <input
                            type="text"
                            required
                            aria-required
                            placeholder={
                              selectedLanguage === "zh-CN"
                                ? "请输入商品名称"
                                : "please enter goods name"
                            }
                            value={data.goods_name}
                            onChange={(e) =>
                              handleExcelInputChange(e, "goods_name")
                            }
                            className="border border-gray-300 outline-none rounded-md px-3 py-2 mt-1 w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700">
                            {selectedLanguage === "zh-CN"
                              ? "商品规格"
                              : "Goods Specification"}
                          </label>
                          <input
                            type="text"
                            required
                            aria-required
                            placeholder={
                              selectedLanguage === "zh-CN"
                                ? "请输入商品规格"
                                : "please enter goods specification"
                            }
                            value={data.goods_spec}
                            onChange={(e) =>
                              handleExcelInputChange(e, "goods_spec")
                            }
                            className="border border-gray-300 outline-none rounded-md px-3 py-2 mt-1 w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700">
                            {selectedLanguage === "zh-CN"
                              ? "商品价格"
                              : "Goods Price"}
                          </label>
                          <input
                            type="number"
                            required
                            aria-required
                            placeholder={
                              selectedLanguage === "zh-CN"
                                ? "请输入商品价格"
                                : "please enter goods price"
                            }
                            value={data.goods_price}
                            onChange={(e) =>
                              handleExcelInputChange(e, "goods_price")
                            }
                            className="border border-gray-300 outline-none rounded-md px-3 py-2 mt-1 w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700">
                            {selectedLanguage === "zh-CN"
                              ? "货号"
                              : "Goods Number"}
                          </label>
                          <input
                            type="number"
                            required
                            aria-required
                            placeholder={
                              selectedLanguage === "zh-CN"
                                ? "请输入货号"
                                : "please enter goods number"
                            }
                            value={data.number}
                            onChange={(e) =>
                              handleExcelInputChange(e, "number")
                            }
                            className="border border-gray-300 outline-none rounded-md px-3 py-2 mt-1 w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">
                            {selectedLanguage === "zh-CN"
                              ? "添加图片"
                              : "Add Image"}
                          </label>
                          <input
                            type="file"
                            required
                            aria-required
                            accept="image/*"
                            onChange={handleImageChange}
                            className="bg-white file-input file-input-bordered outline-none file-input-sm w-full max-w-xs mb-2"
                          />
                          {data.image && (
                            <img
                              src={data.image}
                              alt={`Image_for ${data.goods_name}`}
                              className="h-10 w-10 rounded-full mt-1"
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <p
                          className="bg-[#004368] bg-opacity-30 hover:bg-[#004368] text-black hover:text-white w-[100px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mt-5 mr-3"
                          onClick={() =>
                            document.getElementById("my_modal_settings").close()
                          }
                        >
                          {selectedLanguage === "zh-CN" ? "关闭" : "Close"}
                        </p>
                        <button
                          onClick={exportToExcel}
                          className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[135px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mt-5"
                        >
                          {selectedLanguage === "zh-CN"
                            ? "导出到 Excel"
                            : "Export to Excel"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ManualOrder;
