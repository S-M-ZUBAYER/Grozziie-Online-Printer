import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { w3cwebsocket as WebSocket } from "websocket";
import toast from "react-hot-toast";
import {
  useGetShippedDataUsQuery,
  useSetShippedDataUsMutation,
} from "../../features/allApis/shippedDataGetUsApi";
import {
  generateRandomNumberForOrder_sn,
  generateRandomNumberWithTime,
} from "../../Share/Function/FunctionalComponent";
import { orderListData } from "../../features/slice/orderListSlice";
import { useDeleteManualOrderMutation } from "../../features/allApis/manualOrderApi";
import { TiInfoOutline } from "react-icons/ti";
import ConfirmationModal from "../../Share/ConfirmationModal";

const PrintComponent = ({
  checkedItemsChecking,
  checkedExpressChecking,
  selectedModel,
  printDataWithWaybillCode,
  WaybillRequestData,
  userInformation,
}) => {
  const [status, setStatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [requestID, setRequestId] = useState("");
  const [availablePrinters, setAvailablePrinters] = useState([]);
  const [expressModel, setExpressModel] = useState([]);
  const [activePrinter, setActivePrinter] = useState(null);
  const [printedData, setPrintedData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectPrinterAlert, setSelectPrinterAlert] = useState("");
  const [itemNo, setItemNo] = useState(0);
  const [deleteManualOrderAfterPrinting] = useDeleteManualOrderMutation();
  const dispatch = useDispatch();
  const batchPrintOrderListData = useSelector((state) => state.orderList.data);

  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );
  // Function to generate a 6-digit random number
  const generateRandomNumber = () => {
    return Math.floor(100000000 + Math.random() * 900000000);
  };

  const formattedTime = currentTime.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  // const [setShippedDataUs, { data: shippedDataSave, isSuccess, isLoading, isError }] = useSetShippedDataUsMutation();
  const [postShippedDataToApi] = useSetShippedDataUsMutation();

  const { data } = useGetShippedDataUsQuery();

  useEffect(() => {
    setSelectPrinterAlert(
      <div className="text-sm font-normal text-red-500">
        {selectedPrinter
          ? ""
          : selectedLanguage === "zh-CN"
          ? "请先选择任意打印机！"
          : "Please choose any printer first!"}
      </div>
    );
    setPrintedData(data);
  }, [data]);

  const postDataToApi = async () => {
    const alreadyStoredData = printedData?.find(
      (data) => data.order_sn === checkedItemsChecking.items[0]?.order_sn
    );

    if (alreadyStoredData) {
      // toast.success("This data is already stored in our server");
      console.log("This data is already stored in our server");
      return; // Terminate the function if data is already stored
    }
    const apiUrl =
      "https://grozziieget.zjweiting.com:3091/GrozziiePrint-WebAPI/order_list_store";

    const requestData = {
      address: checkedItemsChecking.items[0]?.address,
      address_mask: checkedItemsChecking.items[0]?.address_mask,
      city: checkedItemsChecking.items[0]?.city,
      city_id: checkedItemsChecking.items[0]?.city_id,
      confirm_time: checkedItemsChecking.items[0]?.confirm_time,
      country: checkedItemsChecking.items[0]?.country,
      country_id: checkedItemsChecking.items[0]?.country_id,
      created_time: checkedItemsChecking.items[0]?.created_time,
      homeDeliveryType: checkedItemsChecking.items[0]?.homeDeliveryType,
      last_ship_time: checkedItemsChecking.items[0]?.last_ship_time,
      logistics_id: checkedItemsChecking.items[0]?.logistics_id,
      order_sn: checkedItemsChecking.items[0]?.order_sn,
      order_status: checkedItemsChecking.items[0]?.order_status,
      province: checkedItemsChecking.items[0]?.province,
      province_id: checkedItemsChecking.items[0]?.province_id,
      receiver_address: checkedItemsChecking.items[0]?.receiver_address,
      receiver_address_mask:
        checkedItemsChecking.items[0]?.receiver_address_mask,
      receiver_name: checkedItemsChecking.items[0]?.receiver_name,
      receiver_name_mask: checkedItemsChecking.items[0]?.receiver_name_mask,
      receiver_phone: checkedItemsChecking.items[0]?.receiver_phone,
      receiver_phone_mask: checkedItemsChecking.items[0]?.receiver_phone_mask,
      refund_status: checkedItemsChecking.items[0]?.refund_status,
      remark: checkedItemsChecking.items[0]?.remark,
      shipping_time: checkedItemsChecking.items[0]?.shipping_time,
      shipping_type: checkedItemsChecking.items[0]?.shipping_type,
      town: checkedItemsChecking.items[0]?.town,
      town_id: checkedItemsChecking.items[0]?.town_id,
      tracking_number: printDataWithWaybillCode?.waybill_code,
      // item_list: checkedItemsChecking.items[0]?.item_list,
      item_list: [
        {
          goods_count: checkedItemsChecking.items[0].item_list[0]?.goods_count
            ? parseInt(checkedItemsChecking.items[0].item_list[0]?.goods_count)
            : 1,
          goods_id: parseInt(
            checkedItemsChecking.items[0].item_list[0]?.goods_id
          ),
          goods_img: checkedItemsChecking.items[0].item_list[0]?.goods_img,
          goods_name: checkedItemsChecking.items[0].item_list[0]?.goods_name,
          goods_price: parseInt(
            checkedItemsChecking.items[0].item_list[0]?.goods_price
          ),
          goods_spec: checkedItemsChecking.items[0].item_list[0]?.goods_spec,
          sku_id: checkedItemsChecking.items[0].item_list[0]?.sku_id,
        },
      ],
      object_id: WaybillRequestData?.objectId,
      print_data: {
        encryptedData: printDataWithWaybillCode?.print_data?.encryptedData,
        signature: printDataWithWaybillCode?.print_data?.signature,
        templateUrl: printDataWithWaybillCode?.print_data?.templateUrl,
        waybill_code: printDataWithWaybillCode?.waybill_code,
        wp_code: WaybillRequestData?.wpCode,
        standard_waybill_type: selectedModel?.standard_waybill_type,
        standard_template_name: selectedModel?.standard_template_name,
        time: formattedTime,
      },
    };

    // try {
    //   const updatePrintedData = checkedItemsChecking.from === "ManualOrder" ? { ...requestData, order_sn: generateRandomNumberForOrder_sn() } : requestData
    //   const response = await axios.post(apiUrl, updatePrintedData);
    //   setPrintedData([...printedData, requestData])
    //   toast.success("Store Printing Data Successfully");
    //   setPrintedData([...printedData, { ...requestData, id: 243 }]);
    //   if (checkedItemsChecking.from === "ManualOrder") {
    //     await deleteManualOrderAfterPrinting(checkedItemsChecking.items[0].id);
    //   }
    //   else if (checkedItemsChecking.from === "Waiting For Shipment") {
    //     const updateOrderListData = batchPrintOrderListData.filter(order => order?.order_sn !== requestData?.order_sn);

    //     dispatch(orderListData(updateOrderListData));
    //   }

    // } catch (error) {
    //   // console.error("Error storing data:", error);
    //   toast.error("Failed To Store Printing Data");
    // }
    const fetchData = async () => {
      try {
        const updatePrintedData =
          checkedItemsChecking.from === "ManualOrder"
            ? { ...requestData, order_sn: generateRandomNumberForOrder_sn() }
            : requestData;

        const response = await postShippedDataToApi(updatePrintedData);

        if (response.error) {
          console.error("Error storing data:", response.error);
          // toast.error("Failed To Store Printing Data");
        } else {
          setPrintedData([...printedData, requestData]);
          // toast.success("Store Printing Data Successfully");
          setPrintedData([...printedData, { ...requestData, id: 243 }]);

          if (checkedItemsChecking.from === "ManualOrder") {
            await deleteManualOrderAfterPrinting(
              checkedItemsChecking.items[0].id
            );
          } else if (checkedItemsChecking.from === "Waiting For Shipment") {
            const updateOrderListData = batchPrintOrderListData.filter(
              (order) => order?.order_sn !== requestData?.order_sn
            );

            dispatch(orderListData(updateOrderListData));
          }
        }
      } catch (error) {
        console.error("Error storing data:", error);
        // toast.error("Failed To Store Printing Data");
      }
    };

    fetchData();
  };

  let ws;
  //     let ws;
  const jsonDataGetPrinterConfigure = JSON.stringify({
    cmd: "getPrinterConfig",
    printer: selectedPrinter,
    requestID,
    version: "1.0",
  });

  const jsonDataSetPrinterConfigure = JSON.stringify({
    cmd: "setPrinterConfig",
    requestID: requestID,
    version: "1.0",
    printer: {
      name: selectedPrinter,
      PrintTopLogo: false,
      PrintBottomLogo: false,
      horizontalOffset: 0,
      verticalOffset: 0,
      // paperSize: {
      //     width: 99,
      //     height: 150
      // }
      paperSize: {
        width: 100,
        height: 150,
      },
    },
  });

  // const jsonDataToPrint = JSON.stringify({
  //   cmd: "print",
  //   requestID: requestID,
  //   version: "1.0",
  //   task: {
  //     // taskID: '7295994',
  //     taskID: requestID,
  //     firstDocumentNumber: 20,
  //     totalDocumentCount: 100,
  //     preview: false,
  //     printer: "",
  //     documents: [
  //       {
  //         documentID: "9876543210",
  //         contents: [
  //           {
  //             data: {
  //               recipient: {
  //                 address: {
  //                   city: checkedItemsChecking.items[0]?.city
  //                     ? checkedItemsChecking.items[0]?.city
  //                     : "",
  //                   // city: 'Shanghai',
  //                   // detail: '123 Gu Bei Road, Golden Hongqiao International Center',
  //                   detail: checkedItemsChecking.items[0]?.receiver_address_mask,
  //                   district: checkedItemsChecking.items[0]?.town,
  //                   // province: 'Shanghai'
  //                   province: checkedItemsChecking.items[0]?.province,
  //                 },
  //                 mobile: checkedItemsChecking.items[0]?.receiver_phone,
  //                 name: checkedItemsChecking.items[0]?.receiver_name_mask,
  //                 phone: checkedItemsChecking.items[0]?.receiver_phone,
  //               },
  //               routingInfo: {
  //                 bigShotName: "Shanghaihd",
  //                 originBranchCode: "shanghai",
  //                 originBranchName: "Shanghai",
  //                 endBranchCode: "shanghai",
  //                 endBranchName: "Shanghai",
  //                 threeSegmentCode: "987 654 321",
  //               },
  //               sender: {
  //                 address: {
  //                   city: checkedItemsChecking.items[0]?.city,
  //                   // detail: '987 Gu Bei Road, Golden Hongqiao International Center',
  //                   detail: checkedItemsChecking.items[0]?.address_mask,
  //                   district: checkedItemsChecking.items[0]?.town,
  //                   province: checkedItemsChecking.items[0]?.province,
  //                 },
  //                 mobile: checkedItemsChecking.items[0]?.sender_phone
  //                   ? checkedItemsChecking.items[0]?.sender_phone
  //                   : "",
  //                 name: "Pinduoduo Electronic Waybill",
  //                 phone: "0213139418",
  //               },
  //               waybillCode: checkedItemsChecking.items[0]?.tracking_number
  //                 ? checkedItemsChecking.items[0]?.tracking_number
  //                 : generateRandomNumberWithTime(),
  //               signature: "Electronic Signature",
  //               // templateUrl: "https://file-link.pinduoduo.com/yto_one",
  //               templateUrl: selectedModel?.standard_template_url,
  //               // wpCode: "YTO"
  //               wpCode: checkedExpressChecking?.wp_code,
  //             },
  //             userid: "9853",
  //           },
  //           {
  //             data: {
  //               userdata: "Merchant Custom Content",
  //             },
  //             templateUrl:
  //               "http://pinduoduoimg.yangkeduo.com/msfe/2019-01-17/680b0dc8686b41e8c61d9fc6c2d93c78.xml",
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // });

  const jsonDataToPrint = JSON.stringify({
    cmd: "print",
    requestID: requestID,
    version: "1.0",
    task: {
      // taskID: '7295994',
      taskID: requestID,
      firstDocumentNumber: 20,
      totalDocumentCount: 100,
      preview: false,
      printer: "",
      documents: [
        {
          documentID: generateRandomNumber().toString(),
          contents: [
            {
              encryptedData:
                checkedItemsChecking?.from === "shipped"
                  ? checkedItemsChecking?.items[itemNo]?.print_data
                      ?.encryptedData
                  : printDataWithWaybillCode?.print_data?.encryptedData,
              userid:
                checkedItemsChecking?.from === "shipped"
                  ? userInformation?.id
                  : WaybillRequestData?.userId,
            },
            {
              data: {
                userdata: "商家自定义内容",
              },
              templateUrl:
                "http://pinduoduoimg.yangkeduo.com/msfe/2019-01-17/680b0dc8686b41e8c61d9fc6c2d93c78.xml",
            },
          ],
        },
      ],
    },
  });

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const handleToFinalPrint = () => {
    console.log(
      console.log(itemNo, checkedItemsChecking, "itemNO"),
      userInformation,
      {
        cmd: "print",
        requestID: requestID,
        version: "1.0",
        task: {
          // taskID: '7295994',
          taskID: requestID,
          firstDocumentNumber: 20,
          totalDocumentCount: 100,
          preview: false,
          printer: "",
          documents: [
            {
              documentID: generateRandomNumber().toString(),
              contents: [
                {
                  encryptedData:
                    checkedItemsChecking?.from === "shipped"
                      ? checkedItemsChecking?.items[itemNo]?.print_data
                          ?.encryptedData
                      : printDataWithWaybillCode?.print_data?.encryptedData,
                  userid:
                    checkedItemsChecking?.from === "shipped"
                      ? userInformation?.id
                      : WaybillRequestData?.userId,
                },
                {
                  data: {
                    userdata: "商家自定义内容",
                  },
                  templateUrl:
                    "http://pinduoduoimg.yangkeduo.com/msfe/2019-01-17/680b0dc8686b41e8c61d9fc6c2d93c78.xml",
                },
              ],
            },
          ],
        },
      },
      "json data"
    );
    if (!checkedItemsChecking.items[0]) {
      // toast.error("Please select any order first");
      console.log("Please select any order first");
      return;
    }

    if (!selectedPrinter) {
      setSelectPrinterAlert(
        <div className="text-sm font-normal text-red-500">
          {selectedLanguage === "zh-CN"
            ? "请先选择任何打印机！"
            : "Please choose any printer first!"}
        </div>
      );
      // toast.error("Please select a printer.");
      return;
    }
    if (
      checkedItemsChecking?.from !== "shipped" &&
      Object.keys(printDataWithWaybillCode).length === 0
    ) {
      setModalTitle(
        <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
          <TiInfoOutline className="w-10 h-10 text-red-600" />
        </div>
      );
      setModalMessage(
        <p>
          {selectedLanguage === "zh-CN"
            ? "快递服务未正确选择和预订，请重试。"
            : "Delivery Express Not Choose And Book Properly Please Try Again"}
        </p>
      );
      setConfirmAction(null);
      setShowConfirmButton(false);
      setIsConfirmModalOpen(true);

      return;
    }
    ws = new WebSocket("ws://127.0.0.1:5000");

    ws.onopen = () => {
      console.log("Connected to the WebSocket server");

      let jsonData;
      if (selectedStatus?.cmd === "getPrinters") {
        jsonData = jsonDataGetPrinterConfigure;
      } else if (selectedStatus?.cmd === "getPrinterConfig") {
        jsonData = jsonDataSetPrinterConfigure;
      } else if (selectedStatus?.cmd === "setPrinterConfig") {
        jsonData = jsonDataToPrint;
      } else {
        jsonData = JSON.stringify({
          cmd: "getPrinters",
          requestID: generateRandomNumber(),
          version: "1.0",
        });
      }

      ws.send(jsonData);
    };

    ws.onmessage = (message) => {
      console.log("onmessage start");

      const data = JSON.parse(message.data);

      switch (data.cmd) {
        case "getPrinters":
          handleGetPrinters(data);
          break;
        case "getPrinterConfig":
          handleGetPrinterConfig(data);
          break;
        case "setPrinterConfig":
          handleSetPrinterConfig(data);
          break;
        case "print":
          handlePrintData(data);
          postDataToApi();
          break;
        default:
          break;
      }
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  };

  const handleDownload = () => {
    const fileUrl = "https://example.com/path/to/your/software.exe"; // Replace with the actual URL of your software
    const newWindow = window.open(fileUrl, "_blank");
    if (newWindow) {
      newWindow.focus();
    } else {
      alert("Please allow popups for this website");
    }
  };

  useEffect(() => {
    ws = new WebSocket("ws://127.0.0.1:5000");
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      // toast.error("Failed to establish WebSocket connection. Please make sure the PDD打印组件 app is set up properly.");
      setSelectPrinterAlert(
        <div className=" font-bold text-red-500">
          {selectedLanguage === "zh-CN" ? (
            <>
              未能建立WebSocket连接。
              <br /> 请确保PDD打印组件应用程序设置正确！{" "}
              <p
                onClick={handleDownload}
                className="text-blue-500 ml-2 cursor-pointer"
              >
                下载PDD
              </p>
            </>
          ) : (
            <>
              Failed to establish WebSocket connection. <br /> Please make sure
              the PDD打印组件 <br /> app is set up properly.!{" "}
              <p
                onClick={handleDownload}
                className="text-blue-500 ml-2 cursor-pointer"
              >
                Download PDD
              </p>
            </>
          )}
        </div>
      );
    };
    ws.onopen = () => {
      console.log("Connected to the WebSocket server");
      const jsonData = JSON.stringify({
        cmd: "getPrinters",
        requestID: generateRandomNumber(),
        version: "1.0",
      });
      ws.send(jsonData);
    };

    ws.onmessage = (message) => {
      console.log("onmessage start");

      const data = JSON.parse(message.data);

      switch (data.cmd) {
        case "getPrinters":
          handleGetPrinters(data);
          break;
        default:
          break;
      }
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // useEffect(() => {
  //   handleToFinalPrint();  // Commenting this out to avoid automatic execution on component mount
  // }, [selectedStatus]);

  useEffect(() => {
    if (selectedStatus) {
      handleToFinalPrint();
    }
  }, [selectedStatus, itemNo]);

  const handleGetPrinters = (data) => {
    setSelectedStatus(data);
    setRequestId(data?.requestID);
    setAvailablePrinters(data?.printers);
  };

  const handleGetPrinterConfig = (data) => {
    setSelectedStatus(data);
    setRequestId(data?.requestID);
    setStatus("Received printer config");
  };

  const handleSetPrinterConfig = (data) => {
    setSelectedStatus(data);
    setRequestId(data?.requestID);
    setStatus(`Set printer config status: ${data.status}`);
  };

  const handlePrintData = (data) => {
    setStatus(`Printing status: ${data.status}`);
    if (checkedItemsChecking?.items?.length - 1 > itemNo) {
      setItemNo(itemNo + 1);
      console.log(checkedItemsChecking?.items?.length, itemNo, "into");
    }
    setRequestId(generateRandomNumber());
  };

  const handleToSetPrinter = (printer, index) => {
    setActivePrinter(index);
    setSelectedPrinter(printer);
    setSelectPrinterAlert("");
  };

  return (
    <div className="mb-6">
      {/* <div>
                {
                    expressModel &&
                    <h3 className="text-xl font-semibold text-yellow-500">{selectedLanguage === "zh-CN" ? "可用模型" : "Available Model"}</h3>
                }
                {expressModel?.map((model, index) => <p key={index} onClick={setSelectedModel(model?.standard_template_name)}>{model?.standard_template_name}</p>)}
            </div> */}
      <div className="text-[#004368] text-xl font-semibold leading-normal capitalize">
        {selectedLanguage === "zh-CN" ? "可用打印机" : "Available Printers"}:{" "}
      </div>
      <div className="w-[367px] h-[206px] rounded-md bg-[#004368] bg-opacity-5 my-3 overflow-y-scroll cursor-pointer">
        {availablePrinters?.length === 0 ? (
          <div className=" font-bold text-red-500 pl-2">
            {selectedLanguage === "zh-CN"
              ? "没有可用的打印机"
              : "No Printer Available"}
          </div>
        ) : (
          availablePrinters?.map((printer, index) => (
            <div key={index}>
              <p
                className={`pl-8 py-2 mb-1 mt-3 cursor-pointer text-black text-[15px] font-medium leading-normal capitalize rounded-lg ${
                  activePrinter === index
                    ? "bg-[#004368] bg-opacity-40 text-[#004368]"
                    : ""
                }`}
                onClick={() => handleToSetPrinter(printer?.name, index)}
              >
                {printer?.name}
              </p>
              <div
                className={`bg-[#004368] bg-opacity-40 w-[325px] mx-3 h-[0.5px] mb-1 ${
                  activePrinter === index ? "bg-[#004368]" : ""
                }`}
              ></div>
            </div>
          ))
        )}
      </div>
      <div>{selectPrinterAlert}</div>
      <p className="font-bold my-4">
        {selectedLanguage === "zh-CN" ? "状态" : "Status"}:{" "}
        <span className="text-green-900">{status}</span>{" "}
      </p>
      <button
        className="mb-10 w-[182px] h-10 bg-[#004368] text-white  text-center text-[15px] leading-normal font-semibold rounded-md hover:bg-[#004368] hover:bg-opacity-30 hover:text-black py-2 mr-5"
        onClick={() => handleToFinalPrint()}
      >
        {selectedLanguage === "zh-CN" ? "打印" : "Print"}
      </button>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmAction}
        showConfirmButton={showConfirmButton}
      />
    </div>
  );
};

export default PrintComponent;
