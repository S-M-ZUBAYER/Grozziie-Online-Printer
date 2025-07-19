import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import DeliveryCompanyList from "../../Share/DeliveryCompanyList/DeliveryCompanyList";
import { w3cwebsocket as WebSocket } from "websocket";
import CovertImage from "./CovertImage";
import toast from "react-hot-toast";
import FadeLoader from "react-spinners/FadeLoader";
import { useSetStoreDeliveryCompaniesListMutation } from "../../features/allApis/storeDeliveryCompanyListApi";
import { generateRandomNumberWithTime } from "../../Share/Function/FunctionalComponent";
import { useTranslation } from "react-i18next";

const BatchPrinterModal = () => {
  const [loading, setLoading] = useState(false);
  const [previewImg, setPreviewImg] = useState("");
  const [modelListLoading, setModelListLoading] = useState(false);
  const [allDeliveryModel, setAllDeliveryModel] = useState([]);
  const [shopDeliveryCompanyName, setShopDeliveryCompanyName] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  const [selectedDeliveryCompanyName, setSelectedDeliveryCompanyName] =
    useState(shopDeliveryCompanyName[0]);
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );
  const [selectedTemplateUrl, setSelectedTemplateUrl] = useState("");
  const [selectedWp_code, setSelectedWp_code] = useState("");
  const [showImgLoading, setShowImgLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { t } = useTranslation();

  // show the specific model functionalities
  const [selectedModel, setSelectedModel] = useState("");

  const handleToSelectModel = (model) => {
    setSelectedModel(model);
    setSelectedTemplateUrl(model?.standard_template_url);
    setSelectedWp_code(selectedDeliveryCompanyName?.wp_code);
  };

  // modal submit function
  const handleModalSubmit = (e) => {
    e.preventDefault();
    document.getElementById("my_modal_BatchPrint").close();
  };

  console.log(previewImg, "preview image");

  // convert part start in here
  const [capturedImage, setCapturedImage] = useState(null);

  // const handleCapture = async () => {
  //     // const imageUrl = 'http://127.0.0.1:16666/Preview_202442_45fdf0770b895e67046d217c204147a4.bmp';
  //     console.log("start convert bitmap")
  //     const htmlContent = `
  //         <div class="border-2 border-gray-300 p-4">
  //             <img class="w-full h-full object-cover" src="${previewImg}" alt="Dynamic Image" />
  //         </div>
  //     `;

  //     try {
  //         const response = await fetch('http://localhost:8000/capture-screenshot', {
  //             method: 'POST',
  //             headers: {
  //                 'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({ htmlContent }),
  //         });

  //         if (response.ok) {
  //             console.log(response, "check response");
  //             const blob = await response.blob();
  //             const reader = new FileReader();

  //             reader.onloadend = () => {
  //                 const base64String = reader.result;
  //                 // setPreviewImg(base64String);
  //                 setCapturedImage(base64String);
  //             };

  //             reader.readAsDataURL(blob);
  //         } else {
  //             console.error('Failed to capture screenshot:', response.statusText);
  //         }

  //     } catch (error) {
  //         console.error('Error capturing screenshot:', error);
  //     }
  // };
  // useEffect(() => {
  //     if (previewImg) {
  //         handleCapture();
  //     }
  // }, [previewImg]);

  // image generate part

  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [requestID, setRequestId] = useState("");
  const [selectPddAlert, setPddAppAlert] = useState("");

  let ws;

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
                    // city: checkedItemsChecking[0]?.address_mask,
                    city: "Shanghai",
                    detail:
                      "123 Gu Bei Road, Golden Hongqiao International Center",
                    // detail: checkedItemsChecking[0]?.receiver_address_mask,
                    district: "Changning District",
                    province: "Shanghai",
                    // province: checkedItemsChecking[0]?.province,
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
                    detail:
                      "987 Gu Bei Road, Golden Hongqiao International Center",
                    // detail: checkedItemsChecking[0]?.address_mask,
                    district: "Changning District",
                    province: "Shanghai",
                  },
                  mobile: "13012345678",
                  name: "Pinduoduo Electronic Waybill",
                  phone: "0213139418",
                },
                waybillCode: "6610054492006",
                signature: "Electronic Signature",
                // templateUrl: "https://file-link.pinduoduo.com/yto_one",
                templateUrl: selectedTemplateUrl,
                // wpCode: "YTO"
                // wpCode: checkedExpressChecking?.wp_code,
                wpCode: selectedWp_code,
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

  const handleDownload = () => {
    const fileUrl = "https://example.com/path/to/your/software.exe"; // Replace with the actual URL of your software
    const newWindow = window.open(fileUrl, "_blank");
    if (newWindow) {
      newWindow.focus();
    } else {
      alert("Please allow popups for this website");
    }
  };

  const handleToFinalPreview = () => {
    setShowImgLoading(true);
    if (!selectedModel && !selectedDeliveryCompanyName) {
      setShowImgLoading(false);
      return;
    }

    ws = new WebSocket("ws://127.0.0.1:5000");

    ws = new WebSocket("ws://127.0.0.1:5000");
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      // toast.error("Failed to establish WebSocket connection. Please make sure the PDD打印组件 app is set up properly.");
      setPddAppAlert(
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
      setShowImgLoading(false);
      return;
    };

    ws.onopen = () => {
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
      setPreviewImg(data?.previewURL);
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
      setShowImgLoading(false);
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  };

  useEffect(() => {
    if (selectedModel && selectedDeliveryCompanyName) {
      let ws = new WebSocket("ws://127.0.0.1:5000");

      ws.onopen = () => {
        console.log("Connected to the WebSocket server");
        const jsonData = JSON.stringify({
          cmd: "getPrinters",
          requestID: generateRandomNumberWithTime(),
          version: "1.0",
        });

        if (ws.readyState === WebSocket.OPEN) {
          ws.send(jsonData);
        }
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
        if (
          ws &&
          (ws.readyState === WebSocket.CONNECTING ||
            ws.readyState === WebSocket.OPEN)
        ) {
          ws.close();
        }
      };
    }
  }, []);

  useEffect(() => {
    handleToFinalPreview(); // Commenting this out to avoid automatic execution on component mount
  }, [selectedStatus]);

  const handleGetPrinters = (data) => {
    setSelectedStatus(data);
    setRequestId(data?.requestID);
  };

  const handleGetPrinterConfig = (data) => {
    setSelectedStatus(data);
    setRequestId(data?.requestID);
  };

  const handleSetPrinterConfig = (data) => {
    setSelectedStatus(data);
    setRequestId(data?.requestID);
  };

  const handlePrintData = (data) => {
    setRequestId(generateRandomNumberWithTime());
  };

  //store template into our own server
  const handleToStoreTemplate = (e) => {
    e.stopPropagation();
    setLoading(true);
    if (!selectedImage) {
      setLoading(false);
      toast.error("Please upload the image first");
      return;
    }

    const data = {
      wp_code: selectedDeliveryCompanyName?.wp_code,
      standard_templates: [
        {
          standard_template_name:
            selectedDeliveryCompanyName?.wp_code +
            "_" +
            selectedModel?.standard_template_name,
          standard_template_url: selectedTemplateUrl,
          standard_template_image: selectedImage,
          standard_waybill_type: selectedModel?.standard_waybill_type,
        },
      ],
    };

    // storeDeliveryCompany(data);

    // Display loading state while data is being stored

    const url =
      "https://grozziieget.zjweiting.com:3091/GrozziiePrint-WebAPI/stdtemplates-store";

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        setLoading(false);
        toast.success("Template store in database successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
        toast.error("Failed to store");
      });
  };

  // // Display loading state while data is being stored
  // if (isSuccess) {
  //     toast.success("Store Data Successfully");
  // }

  // // Display error message if there's an error during storage
  // if (isError) {
  //     toast.error("Failed To Load Data");
  // }

  const handleModalShow = () => {
    const modal = document.getElementById("my_modal_BatchPrint");
    if (modal) {
      modal.showModal();
    } else {
      console.error("Modal element not found");
    }
  };

  const handleCloseModal = () => {
    const modal = document.getElementById("my_modal_BatchPrint");
    if (modal) {
      modal.close();
    } else {
      console.error("Modal element not found");
    }
  };

  return (
    <div>
      <button
        className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[230px] h-10 px-8 py-2 rounded-md cursor-pointer text-center "
        // onClick={() =>
        //     document.getElementById("my_modal_BatchPrint").showModal()
        // }
        onClick={handleModalShow}
      >
        <button className="text-[15px] font-medium capitalize flex items-center justify-between">
          <FaPlus className="w-[14px] h-[14px]" />
          <span className="pl-4 text-sm font-medium capitalize">
            {t("AddNewTemplate")}
          </span>
        </button>
      </button>

      <dialog id="my_modal_BatchPrint" className="modal">
        <div className="bg-white rounded-2xl w-[1100px] h-[850px] pt-10">
          <h3 className="text-[#004368] font-bold text-lg mx-10">
            {t("SelectCompanyName")}
          </h3>
          <div className="grid grid-cols-5 gap-1">
            <div className="col-span-2">
              {/* Delivery Company Name List */}
              <div className="flex items-center justify-between mt-3 mx-10 overflow-x-auto max-w-full">
                <DeliveryCompanyList
                  setSelectedDeliveryCompanyName={
                    setSelectedDeliveryCompanyName
                  }
                  setShopDeliveryCompanyName={setShopDeliveryCompanyName}
                  shopDeliveryCompanyName={shopDeliveryCompanyName}
                  setAllDeliveryModel={setAllDeliveryModel}
                  setModelListLoading={setModelListLoading}
                  selectedDeliveryCompanyName={selectedDeliveryCompanyName}
                  setSelectedModel={setSelectedModel}
                  setSelectedWp_code={setSelectedWp_code}
                />
              </div>

              <div className=" mx-10">
                <p className="text-[#004368] text-xl font-semibold leading-normal capitalize mb-3 text-start">
                  {t("ModelList")}
                </p>
                <div className="grid grid-cols-12 max-h-[549px]">
                  {/* left side */}
                  <div className="col-span-3 bg-opacity-[0.05] rounded-md cursor-pointer">
                    {!modelListLoading ? (
                      allDeliveryModel &&
                      allDeliveryModel?.map((model) => (
                        <div key={model?.standard_template_id}>
                          <button onClick={() => handleToSelectModel(model)}>
                            <div className="bg-[#004368] bg-opacity-10 w-[251px] mx-auto h-[0.5px] mb-2"></div>
                            <p
                              className={`pl-8 pt-2 mb-2 cursor-pointer text-start ${
                                selectedModel?.standard_template_id ===
                                model?.standard_template_id
                                  ? "font-semibold text-[#004368]"
                                  : ""
                              }`}
                            >
                              {model?.standard_template_name}
                            </p>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="w-full mx-auto">
                        <FadeLoader color="#36d7b7" />
                      </div>
                    )}
                    {/* Preview Image Show */}
                    <button
                      className="w-[182px] mt-8  bg-[#004368] text-white  text-center text-[15px] leading-normal font-semibold rounded-md hover:bg-[#004368] hover:bg-opacity-30 hover:text-black py-2 mr-5"
                      onClick={() => handleToFinalPreview()}
                    >
                      {t("Preview")}
                    </button>
                  </div>
                </div>
              </div>

              <div className=" mt-8 ">
                <div className="text-left ml-8">
                  <p>
                    {t("TemplateName")}
                    {selectedModel?.standard_template_name}
                  </p>
                  <p>
                    {t("WPCode")}
                    {selectedWp_code}
                  </p>
                  <CovertImage
                    setSelectedImage={setSelectedImage}
                  ></CovertImage>
                </div>
              </div>
            </div>

            <div className="col-span-3 pr-5">
              {/* middle side */}
              <div
                id="printId"
                className="h-[700px] bg-[#004368] bg-opacity-[0.05] rounded-md px-16 py-8 flex justify-between"
              >
                <div className=" w-full flex justify-center items-center">
                  {showImgLoading ? (
                    <FadeLoader color="#36d7b7" />
                  ) : selectPddAlert ? (
                    selectPddAlert
                  ) : (
                    <img
                      className=" h-[650px] object-cover"
                      src={previewImg}
                      alt="previewImage"
                    ></img>
                  )}
                </div>
              </div>
              <div className="flex justify-end col-span-1">
                <p
                  className="bg-[#004368] bg-opacity-30 hover:bg-[#004368] text-black hover:text-white w-[100px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mt-5 mr-3"
                  onClick={handleCloseModal}
                >
                  {t("Close")}
                </p>
                <button
                  onClick={handleToStoreTemplate}
                  className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[100px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mt-5"
                  type="submit"
                >
                  {loading ? t("Loading") : t("Store")}
                </button>
              </div>
            </div>
          </div>

          {/* Model List */}
          <div className="modal-action w-full text-center flex justify-end pr-10">
            <div method="dialog" onSubmit={handleModalSubmit}>
              {/* <div className="">
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-[320px] bg-transparent"
                  onChange={(e) => setModalInput(e.target.value)}
                />
              </div> */}
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default BatchPrinterModal;
