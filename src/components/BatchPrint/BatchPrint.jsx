import React, { useEffect, useState } from "react";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { arrayToExcel } from "../../Share/Function/FunctionalComponent";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  checkedExpressChange,
  checkedItemsChange,
  printedDataFromRedux,
} from "../../features/slice/userSlice";
import * as XLSX from "xlsx";
import {
  useGetBatchPrintQuery,
  useLoadOrderListMutation,
} from "../../features/allApis/batchPrintApi";
import BatchPrintTable from "./BatchPrintTable";
import BatchPrinterModal from "./BatchPrinterModal";
import StoredDeliveryCompanyList from "../../Share/StoredDeliveryCompanyList/StoredDeliveryCompanyList";
import {
  useGetShippedDataUsQuery,
  useSetShippedDataUsMutation,
} from "../../features/allApis/shippedDataGetUsApi";
import NewSearchComponent from "../../Share/SearchComponent/NewSearchComponent";
import { filterDataBySearchFieldsBatchPrint } from "../../Share/SearchComponent/SearchComponentFunction";
import toast from "react-hot-toast";
import { orderListData } from "../../features/slice/orderListSlice";
import ConfirmationModal from "../../Share/ConfirmationModal";
import { TiInfoOutline } from "react-icons/ti";
import { AiOutlineCheckCircle } from "react-icons/ai";
import {
  fetchAvailableWaybills,
  fetchLogisticCompanies,
} from "./BatchPrinterFunctions";
import { shopDeliveryCompanyList } from "../../features/slice/shopDeliveryCompanySlice";

const BatchPrint = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const orderListDataGet = useSelector((state) => state.orderList.data);
  const [totalOrderData, setTotalOrderData] = useState(orderListDataGet);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [refundStatusCheck, setRefundStatusCheck] = useState(
    "Waiting For Shipment"
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
  const [printedData, setPrintedData] = useState([]);
  const [cipher, setCipher] = useState(() => {
    const stored = localStorage.getItem("tiktokShopInfo");
    return stored ? JSON.parse(stored) : [];
  });
  const { t } = useTranslation();
  const [postShippedDataToApi] = useSetShippedDataUsMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Data post request send and return data get
  const [loadOrderList, { isLoading, isError }] = useLoadOrderListMutation();

  // shipped Data Get from our server (Already Printed)
  const { data: printed, isLoading: isPrintedLoading } =
    useGetShippedDataUsQuery();

  useEffect(() => {
    dispatch(printedDataFromRedux(printed));
    setPrintedData(printed);
  }, [printed]);

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

  // // this is the part to store orderList into local storage temporary
  // function storeDecryptedOrderList(decryptedOrderList) {
  //   try {
  //     // Convert the decryptedOrderList to a JSON string
  //     const serializedDecryptedOrderList = JSON.stringify(decryptedOrderList);

  //     // Store the serialized data in local storage under the key 'decryptedOrderList'
  //     localStorage.setItem("decryptedOrderList", serializedDecryptedOrderList);
  //   } catch (error) {
  //     console.error(
  //       "Error storing decrypted order list in local storage:",
  //       error
  //     );
  //   }
  // }
  // useEffect(() => {
  //   // Usage:
  //   storeDecryptedOrderList(loadOrderList);
  // }, [loadOrderList]);

  // start the functionalities to get all express delivery company list
  // call the function with useEffect to get the the company name list
  // const [deliveryCompanyName, setDeliveryCompanyName] = useState([]);
  // const [shopDeliveryCompanyName, setShopDeliveryCompanyName] = useState([]);
  // useEffect(() => {
  //   if (deliveryCompanyName) {
  //     fetchAvailableWaybills(deliveryCompanyName)
  //       .then((waybills) => {
  //         console.log(waybills);
  //         setShopDeliveryCompanyName(splitArrays(waybills));
  //         const ShopDeliveryCompanyNameList = splitArrays(waybills);
  //         dispatch(shopDeliveryCompanyList(ShopDeliveryCompanyNameList));
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching available waybills:", error);
  //       });
  //   }
  // }, [deliveryCompanyName]);
  // //call the function to get all logistics company list
  // function splitArrays(arrays) {
  //   const individualArrays = [];
  //   arrays.forEach((array) => {
  //     if (Array.isArray(array)) {
  //       array.forEach((eachArray) => {
  //         individualArrays.push(eachArray);
  //       });
  //     }
  //   });
  //   return individualArrays;
  // }

  // const fetchCompanies = async () => {
  //   try {
  //     const companies = await fetchLogisticCompanies();
  //     setDeliveryCompanyName(companies);
  //   } catch (error) {
  //     console.error("Failed to fetch logistic companies:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchCompanies(); // Call the function to fetch companies
  // }, []);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await loadOrderList({
          tikTokShopCipher: cipher[0]?.cipher,
        }).unwrap();
        const orders = response?.data?.orders;
        if (Array.isArray(orders) && orders.length > 0) {
          const filteredOrderList = orders.filter(
            (item) =>
              item?.buyerEmail &&
              item?.lineItems?.[0]?.packageStatus === "CANCELLED"
          );

          dispatch(orderListData(filteredOrderList));
          setTotalOrderData(filteredOrderList);
        } else {
          console.warn(
            "No valid orders received or unexpected format",
            response
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [loadOrderList, cipher]);

  // Function to handle individual checkbox change
  const handleCheckboxChange = (customer) => {
    if (checkedItems.some((item) => item?.order_sn === customer?.order_sn)) {
      // If the customer id is already in the checkedItems, remove it
      const updatedItems = checkedItems.filter(
        (item) => item?.order_sn !== customer?.order_sn
      );
      setCheckedItems(updatedItems);
      setSelectAll(false);
    } else {
      // If the customer id is not in the checkedItems, add it
      const updatedItems = [...checkedItems, customer];
      setCheckedItems(updatedItems);
      if (updatedItems.length === totalOrderData?.length) {
        setSelectAll(true);
      }
    }
  };

  // pagination part
  const data = totalOrderData;
  const [showPage, setShowPage] = useState(1);
  const [currentBar, setCurrentBar] = useState(1);
  const [currentCustomerData, setCurrentCustomerData] = useState([]);
  const calculateTotalPart = () => {
    return Math.ceil(data.length / 5);
  };
  const [totalPart, setTotalPart] = useState(calculateTotalPart());
  const [customersData, setCustomersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [leftPaginationBtn, setLeftPaginationBtn] = useState(false);
  const [rightPaginationBtn, setRightPaginationBtn] = useState(true);

  useEffect(() => {
    const firstPageData = data.slice(0, 5);
    setTotalPart(Math.ceil(data.length / 5));
    setCustomersData(data);
    setFilteredData(firstPageData);
    setCurrentCustomerData(firstPageData);
  }, [refundStatusCheck, totalOrderData, printedData]);

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
    // console.log(customersData, "currentShowBar");
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
    const data =
      refundStatusCheck === "Waiting For Shipment"
        ? totalOrderData
        : refundStatusCheck === "shipped"
        ? printedData
        : [];

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

  const handleDetailsClick = (customerData) => {
    setSelectedCustomer({
      address:
        "~AgAAAAKj5K0HdThr3gFHOLKf52dwPutKrkirs5ILD4dZQFc/tafwm7uUtIMmcBD3SaW/E/3onfp5KEeBtNg+ANmFNzDuUUy618YUbpATRkD83xEHnhObE/ZG+cpbYlFlYaOrROimNGg+xVOYQ2c3br71PFStRR3IWcc706LoXuQ=~aH70ycygYwmz9II8U9DunESCGzPhLqEnDs9gNfM8xbLbDWm6GmrCcrr769u45n7I7h7kBM8BMecpxcb+IgdhyzAgkOTtD56s5Tiwf06W~0~~",
      address_mask: "广东省潮州市潮安区新安大道东北侧彩塘林迈村，王厝宫路*号",
      after_sales_status: 0,
      buyer_memo: "",
      capital_free_discount: 0.0,
      card_info_list: [],
      cat_id_1: 2603,
      cat_id_2: 2616,
      cat_id_3: 4780,
      cat_id_4: 0,
      city: "潮州市",
      city_id: 78,
      confirm_status: 1,
      confirm_time: "2024-03-18 17:13:01",
      country: "中国",
      country_id: 0,
      created_time: "2024-03-18 17:12:59",
      delivery_one_day: 0,
      discount_amount: 10.0,
      duo_duo_pay_reduction: 0.0,
      duoduo_wholesale: 0,
      free_sf: 0,
      gift_list: [],
      goods_amount: 198.0,
      group_status: 1,
      home_delivery_type: 0,
      inner_transaction_id: "",
      invoice_status: 0,
      is_lucky_flag: 1,
      is_pre_sale: 0,
      is_stock_out: 0,
      item_list: [
        {
          goods_count: 1,
          goods_id: "3956183219",
          goods_img:
            "https://img.pddpic.com/mms-material-img/2021-09-29/0ad8763e-a358-40bd-8b71-3f5fa26a143d.jpeg.a.jpeg",
          goods_name:
            "格志M880考勤机纸卡式打卡机打卡钟员工上下班智能签到考勤机机器",
          goods_price: 198.0,
          goods_spec: "M880白色(插电款)+送50张纸卡",
          outer_goods_id: "",
          outer_id: "M880",
          sku_id: "840777314605",
        },
      ],
      last_ship_time: "2024-03-20 17:13:01",
      logistics_id: 0,
      mkt_biz_type: 0,
      only_support_replace: 0,
      order_change_amount: 0.0,
      order_sn: "240318-422796379670125",
      order_status: 1,
      order_tag_list: [
        {
          name: "delivery_one_day",
          value: 0,
        },
        {
          name: "no_trace_delivery",
          value: 0,
        },
        {
          name: "self_contained",
          value: 0,
        },
        {
          name: "return_freight_payer",
          value: 0,
        },
        {
          name: "free_sf",
          value: 0,
        },
        {
          name: "duoduo_wholesale",
          value: 0,
        },
        {
          name: "support_nationwide_warranty",
          value: 0,
        },
        {
          name: "only_support_replace",
          value: 0,
        },
        {
          name: "oversea_tracing",
          value: 0,
        },
        {
          name: "distributional_sale",
          value: 0,
        },
        {
          name: "open_in_festival",
          value: 0,
        },
        {
          name: "same_city_distribution",
          value: 0,
        },
        {
          name: "region_black_delay_shipping",
          value: 0,
        },
        {
          name: "has_subsidy_postage",
          value: 0,
        },
        {
          name: "has_sf_express_service",
          value: 0,
        },
        {
          name: "community_group",
          value: 0,
        },
        {
          name: "has_ship_additional",
          value: 0,
        },
        {
          name: "ship_additional_order",
          value: 0,
        },
        {
          name: "conso_order",
          value: 0,
        },
        {
          name: "professional_appraisal",
          value: 0,
        },
        {
          name: "allergy_refund",
          value: 0,
        },
        {
          name: "ship_hold",
          value: 0,
        },
        {
          name: "home_delivery_door",
          value: 0,
        },
      ],
      pay_amount: 188.0,
      pay_no: "",
      pay_time: "2024-03-18 17:13:00",
      pay_type: "",
      platform_discount: 0.0,
      postage: 0.0,
      pre_sale_time: "",
      promotion_detail_list: [],
      province: "广东省",
      province_id: 6,
      receive_time: "",
      receiver_address:
        "~AgAAAAKj5K0IdThr3gHe+IB/CXj/g/s71hb4h+Lopn37lsI3cyT3+lLvLiyYcQ61F8QObkXFmrPu2ouDIKOm2GEI9J1gvPYK3C63pAb7tc5ubc9GasgT+ssRCqC4kDa1~NfM8xbLbDWm6GmrCcrr769u45n7I7h7kBM8BMecpxcb+IgdhyzAgkOTtD56s5Tiwf06W~0~~",
      receiver_address_mask: "新安大道东北侧彩塘林迈村，王厝宫路*号",
      receiver_name:
        "~AgAAAAKj5K0FdThr3gCXEjX7VukfDJ4VXsxKOdZIGJk=~e3T2WeW7~0~~",
      receiver_name_mask: "林*坤",
      receiver_phone:
        "$Y/YKpKSij9Re$AgAAAAKj5K0GdThr3gD91OwqU75VBWn0HBgJhtknQj0=$0$$",
      receiver_phone_mask: "1*********5",
      refund_status: 1,
      remark: "",
      return_freight_payer: 0,
      risk_control_status: 0,
      self_contained: 0,
      seller_discount: 10.0,
      service_fee_detail: [],
      shipping_time: "",
      shipping_type: 0,
      stock_out_handle_status: -1,
      support_nationwide_warranty: 0,
      town: "潮安区",
      town_id: 712,
      tracking_number: "",
      trade_type: 0,
      updated_at: "2024-03-18 17:43:00",
      urge_shipping_time: "",
      yyps_date: "",
      yyps_time: "",
    });
    setIsModalOpen(true);
    // document.getElementById("my_modal_2").showModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Close modal if clicked outside the modal
  // useEffect(() => {
  //   const handleClickOutsideModal = (e) => {
  //     if (e.target.tagName === "DIALOG" && isModalOpen) {
  //       closeModal();
  //     }
  //   };

  //   window.addEventListener("click", handleClickOutsideModal);

  //   return () => {
  //     window.removeEventListener("click", handleClickOutsideModal);
  //   };
  // }, [isModalOpen]);

  //make array to excel

  const handleBatchPrinterExcelClick = () => {
    arrayToExcel(checkedItems, "BatchPrinterCustomerList");
  };

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
            ? "您确定已经完成此订单的包装了吗？"
            : "Are you sure you have completed packaging this order?"}
        </p>
      );
      setConfirmAction(() => handleConfirm);
      setShowConfirmButton(true);
      setIsConfirmModalOpen(true);
    }
  };

  // const handleConfirm = () => {
  //   // Implement order update API logic here
  //   dispatch(
  //     checkedItemsChange({ items: checkedItems, from: refundStatusCheck })
  //   );
  //   navigate("/batchprintexpressdelivery");
  // };
  console.log(filteredData, "filtered Data from batch");

  const fetchOrderListData = async (id) => {
    try {
      const response = await loadOrderList({
        tikTokShopCipher: cipher[0]?.cipher,
      }).unwrap();

      const orders = response?.data?.orders;

      if (Array.isArray(orders) && orders.length > 0) {
        const filteredOrderList = orders.filter((item) => item?.buyerEmail);

        dispatch(orderListData(filteredOrderList));
      } else {
        console.warn("No valid orders received or unexpected format", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleConfirm = async (id) => {
    const packageId = checkedItems[0]?.lineItems[0]?.packageId;
    const cipherValue = cipher[0]?.cipher;

    if (!packageId || !cipherValue) {
      console.warn("Missing packageId or cipher");
      return;
    }

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
      console.log("📦 Package created:", result);

      const restOfOrders = filteredData.filter(
        (item) => item?.id !== checkedItems[0]?.id
      );

      fetchOrderListData();
      setFilteredData(restOfOrders.slice(0, 5));

      // ✅ Close modal if successful
      setIsConfirmModalOpen(false); // <-- replace with your actual modal state control

      return result;
    } catch (error) {
      console.error("🚨 Error creating package:", error);
    }
  };

  // const handleConfirm = async () => {
  //   try {
  //     await createPackage();
  //     const markShippedResult = await markPackageAsShipped();

  //     if (markShippedResult.code === 0) {
  //       dispatch(
  //         checkedItemsChange({ items: checkedItems, from: refundStatusCheck })
  //       );
  //       navigate("/batchprintexpressdelivery");
  //     } else {
  //       alert("❌ Failed to mark as shipped.");
  //     }
  //   } catch (error) {
  //     alert("Something went wrong during shipment confirmation.");
  //   }
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
      // console.log(refundStatusCheck, "check status")
      if (refundStatusCheck === "Waiting For Shipment") {
        // console.log(
        //   [...updateJsonData, ...customersData],
        //   "waiting for shipment"
        // );
        dispatch(orderListData([...updateJsonData, ...customersData]));
        setCustomersData([...updateJsonData, ...customersData]);
        setTotalPart(Math.ceil((totalOrderData.length + jsonData?.length) / 5));
        toast.success(
          "Import file Store as Awaiting for Shipment Data Successfully"
        );
      }
      if (refundStatusCheck === "shipped") {
        // console.log(updateJsonData, "jsonData");

        const response = await postShippedDataToApi(updateJsonData[0]);
        if (response.error) {
          console.error("Error storing data:", response.error);
          toast.error("Failed To Store Import file Printing Data");
        } else {
          toast.success("Import file Store as Printing Data Successfully");
        }
        setCustomersData([...updateJsonData, ...customersData]);
        setTotalPart(Math.ceil((totalOrderData.length + jsonData?.length) / 5));
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

  const handleToSearch = () => {
    document.getElementById("searchInput").value = "";
    // Usage:
    const filteredMultipleSearchingData = filterDataBySearchFieldsBatchPrint(
      customersData,
      searchFields
    );
    setFilteredData(filteredMultipleSearchingData);
  };

  console.log(setFilteredData, loadOrderList, "filteredData");

  return (
    <div className="bg-[#004368] bg-opacity-5 w-full h-screen">
      <div className="px-[30px] pt-6 pb-4">
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
        <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] p-4 mt-5 grid grid-cols-12 gap-20">
          {/* modal component */}
          <div className="col-span-2">
            <BatchPrinterModal />
          </div>
          <div className="col-span-10 custom-scrollbar">
            <StoredDeliveryCompanyList />
          </div>
        </div>

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
                {t(refundStatusCheck)}
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
              {/* <p className="text-[#004368] text-sm font-normal capitalize cursor-pointer">
                {selectedLanguage === "zh-CN" ? "拆分订单" : "split order"}
              </p>

              <div className="w-[1px] h-8 bg-[#004368] mx-2"></div> */}

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
                <p className="text-[15px] font-medium capitalize cursor-pointer whitespace-nowrap">
                  {t("Export")}
                </p>
              </button>
            </div>
          </div>

          {/* table */}
          {loadOrderList && (
            <BatchPrintTable
              // loadOrderList={refundStatusCheck === "Waiting For Shipment" ? totalOrderData?.slice(0, 5) : refundStatusCheck === "shipped" ? printedData?.slice(0, 5) : null}
              // loadOrderList={currentCustomerData}
              filteredData={filteredData}
              isError={isError}
              isLoading={isLoading}
              isPrintedLoading={isPrintedLoading}
              selectedCustomer={selectedCustomer}
              handleDetailsClick={handleDetailsClick}
              isModalOpen={isModalOpen}
              closeModal={closeModal}
              checkedItems={checkedItems}
              handleCheckboxChange={handleCheckboxChange}
              data={printedData}
              refundStatusCheck={refundStatusCheck}
              startDate={startDate}
              endDate={endDate}
            />
          )}
        </div>
      </div>

      {/* end section button */}
      <div className="mt-4 mr-8 mb-96">
        <div className="flex items-center justify-end">
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
            className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-auto  h-10 px-4 gap-2 py-2 rounded-md cursor-pointer flex items-center justify-center"
          >
            <MdOutlineLocalPrintshop className="w-[18px] h-[18px]" />
            <p className="text-[15px] font-medium leading-normal capitalize pl-1">
              {t("OrderAcceptedAndPrint")}
            </p>
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
        </div>
      </div>
    </div>
  );
};

export default BatchPrint;
