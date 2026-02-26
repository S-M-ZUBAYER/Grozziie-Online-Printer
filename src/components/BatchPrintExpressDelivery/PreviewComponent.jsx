import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { w3cwebsocket as WebSocket } from "websocket";
import { generateRandomNumberWithTime } from "../../Share/Function/FunctionalComponent";

const PreviewComponent = ({ checkedItemsChecking, checkedExpressChecking }) => {
  const [status, setStatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [requestID, setRequestId] = useState("");
  const [availablePrinters, setAvailablePrinters] = useState([]);
  const [expressModel, setExpressModel] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [previewImg, setPreviewImg] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState("");
  const [bitmapString, setBitmapString] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [started, setStarted] = useState(false);

  const screenshotRef = useRef(null);
  console.log(previewLoading, "loading");

  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );


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

  const jsonDataToPrint = JSON.stringify({
    cmd: "print",
    requestID: requestID,
    version: "1.0",
    task: {
      // taskID: '7295994',
      taskID: requestID,
      firstDocumentNumber: 20,
      totalDocumentCount: 100,
      preview: true,
      printer: "",
      documents: [
        {
          documentID: "9876543210",
          contents: [
            {
              data: {
                recipient: {
                  address: {
                    city: checkedItemsChecking[0]?.address_mask,
                    // city: 'Shanghai',
                    // detail: '123 Gu Bei Road, Golden Hongqiao International Center',
                    detail: checkedItemsChecking[0]?.receiver_address_mask,
                    district: "Changning District",
                    // province: 'Shanghai'
                    province: checkedItemsChecking[0]?.province,
                  },
                  mobile: "13012345678",
                  name: "Pinduoduo",
                  phone: "0213139418",
                },
                routingInfo: {
                  bigShotName: "Shanghaihd",
                  originBranchCode: "shanghai",
                  originBranchName: "Shanghai",
                  endBranchCode: "shanghai",
                  endBranchName: "Shanghai",
                  threeSegmentCode: "987 654 321",
                },
                sender: {
                  address: {
                    city: "Shanghai",
                    // detail: '987 Gu Bei Road, Golden Hongqiao International Center',
                    detail: checkedItemsChecking[0]?.address_mask,
                    district: "Changning District",
                    province: "Shanghai",
                  },
                  mobile: "13012345678",
                  name: "Pinduoduo Electronic Waybill",
                  phone: "0213139418",
                },
                waybillCode: "6610054492006",
                signature: "Electronic Signature",
                templateUrl: "https://file-link.pinduoduo.com/yto_one",
                // wpCode: "YTO"
                wpCode: checkedExpressChecking?.wp_code,
              },
              userid: "9853",
            },
            {
              data: {
                userdata: "Merchant Custom Content",
              },
              templateUrl:
                "http://pinduoduoimg.yangkeduo.com/msfe/2019-01-17/680b0dc8686b41e8c61d9fc6c2d93c78.xml",
            },
          ],
        },
      ],
    },
  });


  const handleToFinalPreview = () => {
    setPreviewLoading(true);
    if (!selectedPrinter) {
      console.log("Please select a printer.");
      return;
    }
    setShowPopup(true);

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
          requestID: generateRandomNumberWithTime(),
          version: "1.0",
        });
      }

      ws.send(jsonData);
    };

    ws.onmessage = (message) => {
      console.log("onmessage start");

      const data = JSON.parse(message.data);
      console.log("Received:", data);
      setPreviewImg(data?.previewURL);
      setPreviewLoading(false);


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

  useEffect(() => {
    ws = new WebSocket("ws://127.0.0.1:5000");
    console.log("infinity loop");
    ws.onopen = () => {
      console.log("Connected to the WebSocket server");
      const jsonData = JSON.stringify({
        cmd: "getPrinters",
        requestID: generateRandomNumberWithTime(),
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

  useEffect(() => {
    handleToFinalPreview(); // Commenting this out to avoid automatic execution on component mount
  }, [selectedStatus]);

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
    setRequestId(generateRandomNumberWithTime());
  };

  const handleToSetPrinter = (printer) => {
    setSelectedPrinter(printer);
  };

  return (
    <div className="mt-12">
      {/* <div>
                {
                    expressModel &&
                    <h3 className="text-xl font-semibold text-yellow-500">{selectedLanguage === "zh-CN" ? "可用模型" : "Available Model"}</h3>
                }
                {expressModel?.map((model, index) => <p key={index} onClick={setSelectedModel(model?.standard_template_name)}>{model?.standard_template_name}</p>)}
            </div> */}

      <p className=" my-2 font-bold text-xl text-teal-500">
        {selectedLanguage === "zh-CN" ? "可用打印机" : "Available Printers"}:{" "}
        {availablePrinters?.map((printer, index) => (
          <button
            className=" bg-yellow-300 text-black font-semibold px-2 py-1 rounded-xl mt-2 block"
            onClick={() => handleToSetPrinter(printer?.name)}
            key={index}
          >
            {printer?.name}
          </button>
        ))}
      </p>
      <p className=" font-bold">
        {selectedLanguage === "zh-CN" ? "状态" : "Status"}:{" "}
        <span className="text-green-900">{status}</span>{" "}
      </p>

      {/* Preview Image Show */}
      <button
        className="mb-10 w-[182px] h-10 bg-[#004368] text-white  text-center text-[15px] leading-normal font-semibold rounded-md hover:bg-[#004368] hover:bg-opacity-30 hover:text-black py-2 mr-5"
        onClick={() => handleToFinalPreview()}
      >
        {selectedLanguage === "zh-CN" ? "预览" : "Preview"}
      </button>

      {/* Popup */}
      {showPopup && (
        <div
          id="popup-content"
          className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
        >
          <div className="bg-white p-8 rounded-md shadow-lg">
            <div className="">
              <div className="card">
                {/* <img
                                    id="previewImg"
                                    src="https://pixlr.com/images/index/ai-image-generator-three.webp"
                                    alt="Popup Preview"
                                /> */}
                {/* {base64Image && <img src={`data:image/webp;base64,${base64Image}`} alt="Downloaded" />} */}
                {started && (
                  <div
                    ref={screenshotRef}
                    className="border-2 border-gray-300 p-4"
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={previewImg}
                      alt="Placeholder"
                    />
                  </div>
                )}

                <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                  Capture Screenshot
                </button>
              </div>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-[#004368] text-white font-semibold rounded-md hover:bg-opacity-70"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewComponent;
