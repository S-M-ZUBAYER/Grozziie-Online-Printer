import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { RiSettingsLine } from "react-icons/ri";
import { FiFileText } from "react-icons/fi";
import Express from "../../assets/expressBatchPrinterPage.png";
import { TfiReload } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import { CiSearch } from "react-icons/ci";
import PrintComponent from "./PrintComponent";
import FadeLoader from "react-spinners/FadeLoader";
import {
  BoundOrders,
  electronicForms,
  modelList,
  modelNames,
} from "../../Share/Data/ClientData";
import PreviewComponent from "./PreviewComponent";
import axios from "axios";
import { generateRandomNumberWithTime } from "../../Share/Function/FunctionalComponent";
import ConfirmationModal from "../../Share/ConfirmationModal";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { TiInfoOutline } from "react-icons/ti";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { RxCross1 } from "react-icons/rx";

const BatchPrintExpressDelivery = () => {
  const checkedItemsChecking = useSelector(
    (state) => state.user.checkedItemsFromRedux
  );
  const checkedExpressChecking = useSelector(
    (state) => state.user.checkedExpressFromRedux
  );

  const dispatch = useDispatch();

  const handleToSelectModel = (model) => {
    setSelectedModel(model);
  };
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );

  const [selectedOption, setSelectedOption] = useState(0);
  const [deliveryCompanyName, setDeliveryCompanyName] = useState(modelNames[0]);
  const [quantityNotice, setQuantityNotice] = useState("");
  const [printDataWithWaybillCode, setPrintDataWithWaybillCode] = useState({});
  const [deliveryBook, setDeliveryBook] = useState(false);
  const [bookingLoad, setBookingLoad] = useState(false);
  const [userInformation, setUserInformation] = useState({});
  const [showOkButton, setShowOkButton] = useState(false);

  const handleOptionChange = (company, index) => {
    setSelectedOption(index);
    setDeliveryCompanyName(company);
  };

  const [senderInformation, setSenderInformation] = useState({});

  const [selectedElectronicOption, setSelectedElectronicOption] = useState(0);
  const [electronicForm, setElectronicForm] = useState(electronicForms[0]);

  const handleElectronicOptionChange = (shopName, index) => {
    setSelectedElectronicOption(index);
    setElectronicForm(shopName);
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [stdTemplate, setStdTemplate] = useState([]);
  const [selectedModel, setSelectedModel] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("GrozziieToken");
    fetchUser(token);
    setLoading(true);
    setError(false);
    const selectedWpCode =
      checkedItemsChecking?.from === "shipped"
        ? checkedItemsChecking?.items[0].print_data.wp_code
        : checkedExpressChecking?.wp_code;
    const url = `https://grozziieget.zjweiting.com:3091/GrozziiePrint-WebAPI/stdtemplates-store/wp_code/${selectedWpCode}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (checkedItemsChecking?.from === "shipped") {
          const foundTemplate = data?.standard_templates?.find((template) => {
            if (
              template.standard_template_url ===
              checkedItemsChecking?.items[0]?.print_data?.templateUrl
            ) {
              return template;
            }
          });

          setStdTemplate([foundTemplate]);
          setSelectedModel(foundTemplate);
          setLoading(false);
          return;
        }
        setStdTemplate(data?.standard_templates);
        setSelectedModel(data?.standard_templates[0]);
        setLoading(false);
        setQuantityNotice(
          <div className=" font-bold text-red-500">
            {selectedLanguage === "zh-CN"
              ? "请先选择任意模板！"
              : "Please choose any template first!"}
          </div>
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
        setError(true);
      });
  }, []);
  const [WaybillRequestData, setWaybillRequestData] = useState({});

  const pddAccessToken = localStorage.getItem("pddAccessToken");

  const fetchWaybill = async (requestData) => {
    console.log(requestData, "waybill Click parameter");
    console.log(WaybillRequestData, "WaybillRequestData parameter");
    try {
      if (!WaybillRequestData) {
        toast.error("WaybillRequestData Not get");
      }
      const response = await axios.post(
        `https://grozziieget.zjweiting.com:3091/GrozziiePrint-WebAPI/cloudprint/waybill/get?accessToken=${pddAccessToken}
`,
        requestData
        // WaybillRequestData
      );
      const waybillData =
        response?.data?.pdd_waybill_get_response?.modules?.[0];
      console.log(response, "response");
      if (response?.data?.error_response?.error_code) {
        setModalTitle(
          <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
            <TiInfoOutline className="w-10 h-10 text-red-600" />
          </div>
        );
        setModalMessage(
          <p>
            {response?.data.error_response?.sub_msg.lenth < 25
              ? response?.data.error_response?.sub_msg
              : response?.data.error_response?.sub_msg.slice(0, 25) + "..."}
          </p>
        );
        setConfirmAction(null);
        setShowOkButton(false);
        setShowConfirmButton(false);
        setIsConfirmModalOpen(true);
      } else {
        setModalTitle(
          <div className="bg-green-200 w-16 h-16 rounded-full flex items-center justify-center">
            <AiOutlineCheckCircle className="w-10 h-10 text-green-600" />
          </div>
        );
        setModalMessage(
          <p>
            {selectedLanguage === "zh-CN"
              ? "您的订单已经在配送公司预约，现在可以打印了"
              : "Your selected order has been booked with the delivery company and is now ready for printing"}
          </p>
        );
        setConfirmAction(null);
        setShowOkButton(true);
        setShowConfirmButton(false);
        setIsConfirmModalOpen(true);
        const printData = JSON.parse(waybillData?.print_data);
        const { encryptedData, signature, templateUrl, ver } = printData;
        setPrintDataWithWaybillCode({
          object_id: waybillData?.object_id,
          print_data: {
            encryptedData: encryptedData,
            signature: signature,
            templateUrl: templateUrl,
            ver: ver,
          },
          waybill_code: waybillData?.waybill_code,
        });
        // Handle the response as needed
      }
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error);
        setModalTitle(
          <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
            <TiInfoOutline className="w-10 h-10 text-red-600" />
          </div>
        );
        setModalMessage(
          <p>
            {selectedLanguage === "zh-CN"
              ? `${error?.response?.data?.error}, 有一些参数缺失` ||
                "获取运单数据时发生错误。"
              : `${error?.response?.data?.error}, Here some parameter missing` ||
                "An error occurred while fetching waybill data."}
          </p>
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error Request:", error);
        setModalTitle(
          <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
            <TiInfoOutline className="w-10 h-10 text-red-600" />
          </div>
        );
        setModalMessage(
          <p>
            {selectedLanguage === "zh-CN"
              ? error.message || "未收到服务器响应。"
              : error.message || "No response received from server."}
          </p>
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error Message:", error.message);
        setModalTitle(
          <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
            <TiInfoOutline className="w-10 h-10 text-red-600" />
          </div>
        );
        setModalMessage(
          <p>
            {selectedLanguage === "zh-CN"
              ? error.message || "发生了意外错误。"
              : error.message || "An unexpected error occurred."}
          </p>
        );
      }
      setConfirmAction(null);
      setShowOkButton(false);
      setShowConfirmButton(false);
      setIsConfirmModalOpen(true);
    }
  };

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [expressQuantity, setExpressQuantity] = useState(0);

  const handleToChooseDeliverCompany = async () => {
    //need to implement order update api in here
    setBookingLoad(true);
    setQuantityNotice("");
    const wp_code = selectedModel?.standard_template_name.split("_")[0];
    const url = `https://grozziieget.zjweiting.com:3091/GrozziiePrint-WebAPI/cloudprint/waybill/search/${wp_code}?accessToken=${pddAccessToken}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok" + response.statusText);
      }

      const data = await response.json();
      // Check if quantity is more than 0
      const quantity =
        data?.pdd_waybill_search_response?.waybill_apply_subscription_cols?.[0]
          ?.branch_account_cols?.[0]?.quantity;
      if (quantity > 0) {
        setSenderInformation(
          data?.pdd_waybill_search_response
            ?.waybill_apply_subscription_cols?.[0]?.branch_account_cols?.[0]
            ?.shipp_address_cols[0]
        );
        const sender =
          data?.pdd_waybill_search_response
            ?.waybill_apply_subscription_cols?.[0]?.branch_account_cols?.[0]
            ?.shipp_address_cols[0];
        // toast.success(`The delivery company ${wp_code} has been selected as express delivery which have ${quantity} quantity.`);
        const requestData = {
          // senderCity: senderInformation.city ? senderInformation.city : "没有数据",
          // senderCountry: "中国",
          // senderDetail: senderInformation.detail ? senderInformation.detail : "没有数据",
          // senderDistrict: senderInformation.district ? senderInformation.district : "没有数据",
          // senderProvince: senderInformation.province ? senderInformation.province : "没有数据",
          // senderTown: senderInformation.district ? senderInformation.district : "没有数据",
          senderCity: data?.pdd_waybill_search_response
            ?.waybill_apply_subscription_cols?.[0]?.branch_account_cols?.[0]
            ?.shipp_address_cols[0].city
            ? data?.pdd_waybill_search_response
                ?.waybill_apply_subscription_cols?.[0]?.branch_account_cols?.[0]
                ?.shipp_address_cols[0].city
            : "没有数据",
          senderCountry: "中国",
          senderDetail: data?.pdd_waybill_search_response
            ?.waybill_apply_subscription_cols?.[0]?.branch_account_cols?.[0]
            ?.shipp_address_cols[0].detail
            ? data?.pdd_waybill_search_response
                ?.waybill_apply_subscription_cols?.[0]?.branch_account_cols?.[0]
                ?.shipp_address_cols[0].detail
            : "没有数据",
          senderDistrict: data?.pdd_waybill_search_response
            ?.waybill_apply_subscription_cols?.[0]?.branch_account_cols?.[0]
            ?.shipp_address_cols[0].district
            ? data?.pdd_waybill_search_response
                ?.waybill_apply_subscription_cols?.[0]?.branch_account_cols?.[0]
                ?.shipp_address_cols[0].district
            : "没有数据",
          senderProvince: data?.pdd_waybill_search_response
            ?.waybill_apply_subscription_cols?.[0]?.branch_account_cols?.[0]
            ?.shipp_address_cols[0].province
            ? data?.pdd_waybill_search_response
                ?.waybill_apply_subscription_cols?.[0]?.branch_account_cols?.[0]
                ?.shipp_address_cols[0].province
            : "没有数据",
          senderTown: data?.pdd_waybill_search_response
            ?.waybill_apply_subscription_cols?.[0]?.branch_account_cols?.[0]
            ?.shipp_address_cols[0].district
            ? data?.pdd_waybill_search_response
                ?.waybill_apply_subscription_cols?.[0]?.branch_account_cols?.[0]
                ?.shipp_address_cols[0].district
            : "没有数据",
          // senderCity: sender.city ? sender.city : "没有数据",
          // senderCountry: "中国",
          // senderDetail: sender.detail ? sender.detail : "没有数据",
          // senderDistrict: sender.district ? sender.district : "没有数据",
          // senderProvince: sender.province ? sender.province : "没有数据",
          // senderTown: sender.district ? sender.district : "没有数据",
          senderMobile: userInformation.phoneNumber
            ? userInformation.phoneNumber
            : "86",
          senderName: userInformation.fullName
            ? userInformation.fullName
            : "没有数据",
          senderPhone: userInformation.phoneNumber
            ? userInformation.phoneNumber
            : "86",
          orderChannelsType: "PDD",
          tradeOrderList: checkedItemsChecking.items[0].item_list[0].goods_id
            ? checkedItemsChecking.items[0].item_list[0].goods_id
            : "没有数据",
          recipientCity: checkedItemsChecking.items[0].city
            ? checkedItemsChecking.items[0].city
            : "没有数据",
          recipientCountry: checkedItemsChecking.items[0].country
            ? checkedItemsChecking.items[0].country
            : "没有数据",
          recipientDetail: checkedItemsChecking.items[0].receiver_address
            ? checkedItemsChecking.items[0].receiver_address
            : "没有数据",
          recipientDistrict: checkedItemsChecking.items[0].town
            ? checkedItemsChecking.items[0].town
            : "没有数据",
          recipientProvince: checkedItemsChecking.items[0].province
            ? checkedItemsChecking.items[0].province
            : "没有数据",
          recipientTown: checkedItemsChecking.items[0].town
            ? checkedItemsChecking.items[0].town
            : "没有数据",
          recipientMobile: checkedItemsChecking.items[0].receiver_phone
            ? checkedItemsChecking.items[0].receiver_phone
            : "86",
          recipientName: checkedItemsChecking.items[0].receiver_name
            ? checkedItemsChecking.items[0].receiver_name
            : "没有数据",
          recipientPhone: checkedItemsChecking.items[0].receiver_phone
            ? checkedItemsChecking.items[0].receiver_phone
            : "86",
          objectId: generateRandomNumberWithTime().toString(),
          userId: userInformation.id
            ? userInformation.id
            : Math.floor(100000 + Math.random() * 900000),
          wpCode: selectedModel?.standard_template_name?.split("_")[0],
          templateUrl: selectedModel?.standard_template_url,
          count: checkedItemsChecking.items[0].item_list[0].goods_count
            ? checkedItemsChecking.items[0].item_list[0].goods_count
            : 1,
          name: checkedItemsChecking.items[0].item_list[0].goods_name
            ? checkedItemsChecking.items[0].item_list[0].goods_name
            : "没有数据",
        };
        setWaybillRequestData(requestData);

        setQuantityNotice(
          <div className="text-sm font-normal text-green-500">
            {selectedLanguage === "zh-CN"
              ? `快递公司 ${wp_code} 已被选为快递公司，拥有 ${quantity} 数量。`
              : `The delivery company ${wp_code} has been selected as express delivery which has ${quantity} quantity.`}
          </div>
        );
        setBookingLoad(false);
        setModalTitle(
          <div className="bg-green-200 w-16 h-16 rounded-full flex items-center justify-center">
            <AiOutlineCheckCircle className="w-10 h-10 text-green-600" />
          </div>
        );
        setModalMessage(
          <p className="text-xl font-semibold">
            {selectedLanguage === "zh-CN"
              ? "您想选择并预订配送吗？"
              : "Do you want to Choose & Book for Delivery?"}
          </p>
        );
        setConfirmAction(() => handleConfirm);
        setShowOkButton(false);
        setShowConfirmButton(true);
        setIsConfirmModalOpen(true);

        const handleConfirm = () => {
          fetchWaybill(requestData);
          setIsConfirmModalOpen(false);
        };
      } else {
        setQuantityNotice(
          <div className="text-sm font-normal text-red-500">
            {selectedLanguage === "zh-CN"
              ? `快递公司 ${wp_code} 已被选为快递公司，但没有可用的数量。`
              : `The delivery company ${wp_code} has been selected as express delivery which doesn't have quantity to use.`}
          </div>
        );
        setBookingLoad(false);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setBookingLoad(false);
    }
  };

  const fetchUser = async (token) => {
    if (token) {
      try {
        const response = await axios.get(
          "https://grozziieget.zjweiting.com:3091/GrozziiePrint-LoginRegistration/user/details",
          {
            params: { token: token },
          }
        );
        setUserInformation(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      setModalTitle(
        <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
          <TiInfoOutline className="w-10 h-10 text-red-600" />
        </div>
      );
      setModalMessage(
        <p>
          {selectedLanguage === "zh-CN"
            ? "您的令牌已自动过期，请重新登录。"
            : "Your Token Expired Automatically, Please Login Again."}
        </p>
      );
      setConfirmAction(null);
      setShowOkButton(false);
      setShowConfirmButton(false);
      setIsConfirmModalOpen(true);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCreateModalOpen = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.getElementById("my_modal_create").close();
  };

  const handleEditModalOpen = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    document.getElementById("my_modal_edit").close();
  };

  return (
    <div className="w-full h-screen pb-16 mb-10">
      {/* top section */}
      <div className="mt-8 mx-12">
        <div className="flex items-center">
          <div className="flex items-center">
            {/* create new model */}
            <button
              className="w-52 h-10 bg-[#004368] bg-opacity-10 text-black text-opacity-80 rounded-md border flex items-center justify-center hover:bg-[#004368] hover:text-white py-2 pl-2 mr-4"
              onClick={() => handleCreateModalOpen()}
            >
              <FiFileText className="w-4 h-4" />
              <span className="text-[15px] font-normal leading-normal capitalize pl-2">
                {selectedLanguage === "zh-CN"
                  ? "创建新模型"
                  : "Create new model"}
              </span>
            </button>
            {/* modal */}
            {isModalOpen && (
              <dialog id="my_modal_create" className="modal" open={isModalOpen}>
                <div className="bg-white w-[1250px] h-[850px] rounded-md py-4 pl-11 px-8 my-5 relative">
                  <div
                    className="absolute top-4 right-8 cursor-pointer tooltip"
                    data-tip="close"
                  >
                    <RxCross1
                      onClick={closeModal}
                      className="w-5 h-5 text-[#004368] text-opacity-35 hover:text-[#004368]"
                    />
                  </div>
                  <div className="flex mt-8">
                    {/* left side */}
                    <div className="w-[650px] text-start">
                      <h3 className="text-[#004368] text-xl font-semibold leading-normal mb-3">
                        Template Name
                      </h3>
                      <input
                        type="text"
                        placeholder="Template Name"
                        className="w-[634px] outline-none border-b-2 border-b-[#00436833] border-b-opacity-10 cursor-pointer ml-4 text-black text-opacity-60 text-[15px] font-normal leading-normal"
                      />

                      <div className="mt-10 flex items-center">
                        <input
                          type="checkbox"
                          id="companyLogo"
                          name="companyLogo"
                          value="companyLogo"
                          className="w-6 h-6 mr-4 rounded border-[1.5px]"
                        />
                        <label
                          htmlFor="companyLogo"
                          className="text-black text-opacity-60 text-lg font-medium leading-normal capitalize"
                        >
                          Print logistic company logo on express delivery list
                        </label>
                      </div>

                      <div className="flex items-center mt-10">
                        <div className="flex items-center">
                          <label
                            htmlFor="width"
                            className="text-black text-opacity-60 text-[15px] font-normal leading-normal"
                          >
                            Width(mm)
                          </label>
                          <input
                            type="text"
                            id="width"
                            name="width"
                            className="w-[197px] outline-none border-b-2 border-b-[#00436833] border-b-opacity-10 cursor-pointer ml-2 text-black text-opacity-60 text-[15px] font-normal leading-normal"
                          />
                        </div>
                        <div className="flex items-center ml-14">
                          <label
                            htmlFor="height"
                            className="text-black text-opacity-60 text-[15px] font-normal leading-normal"
                          >
                            Height(mm)
                          </label>
                          <input
                            type="text"
                            id="height"
                            name="height"
                            className="w-[197px] outline-none border-b-2 border-b-[#00436833] border-b-opacity-10 cursor-pointer ml-2 text-black text-opacity-60 text-[15px] font-normal leading-normal"
                          />
                        </div>
                      </div>

                      <div className="flex mt-14">
                        <img
                          src={Express}
                          alt="Express"
                          className="w-[266px] h-[371px] mx-auto"
                        />
                        <div className="ml-8">
                          <div className="flex">
                            <div>
                              <svg
                                width="135"
                                height="135"
                                viewBox="0 0 142 142"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g filter="url(#filter0_d_423_533)">
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M128.161 99.8155C126.916 102.28 123.822 103.023 121.462 101.589L104.18 91.0887C101.82 89.6548 101.109 86.5892 102.176 84.0425C103.85 80.05 104.778 75.6573 104.778 71C104.778 66.3427 103.85 61.95 102.176 57.9575C101.109 55.4108 101.82 52.3452 104.18 50.9113L121.462 40.4106C123.822 38.9767 126.916 39.7196 128.161 42.1845C132.536 50.8449 135 60.6347 135 71C135 81.3653 132.536 91.1551 128.161 99.8155ZM99.8155 13.8385C102.28 15.0835 103.023 18.1782 101.589 20.5382L91.0887 37.8204C89.6548 40.1803 86.5892 40.8913 84.0425 39.8235C80.05 38.1495 75.6573 37.2222 71 37.2222C66.3427 37.2222 61.95 38.1495 57.9575 39.8235C55.4108 40.8913 52.3452 40.1803 50.9113 37.8204L40.4106 20.5382C38.9767 18.1782 39.7196 15.0835 42.1845 13.8385C50.8449 9.46412 60.6347 7 71 7C81.3653 7 91.1551 9.46411 99.8155 13.8385ZM20.5382 40.4106C18.1782 38.9767 15.0835 39.7196 13.8385 42.1845C9.46411 50.8449 7 60.6347 7 71C7 81.3653 9.46412 91.1551 13.8385 99.8155C15.0835 102.28 18.1782 103.023 20.5382 101.589L37.8204 91.0887C40.1803 89.6548 40.8913 86.5892 39.8235 84.0425C38.1495 80.05 37.2222 75.6573 37.2222 71C37.2222 66.3427 38.1495 61.95 39.8235 57.9575C40.8913 55.4108 40.1803 52.3452 37.8204 50.9113L20.5382 40.4106ZM42.1845 128.161C39.7196 126.916 38.9767 123.822 40.4106 121.462L50.9113 104.18C52.3452 101.82 55.4108 101.109 57.9575 102.176C61.95 103.85 66.3427 104.778 71 104.778C75.6573 104.778 80.05 103.85 84.0425 102.176C86.5892 101.109 89.6548 101.82 91.0887 104.18L101.589 121.462C103.023 123.822 102.28 126.916 99.8155 128.161C91.1551 132.536 81.3653 135 71 135C60.6347 135 50.8449 132.536 42.1845 128.161Z"
                                    fill="#004368"
                                    fill-opacity="0.62"
                                    shape-rendering="crispEdges"
                                  />
                                </g>
                                <path
                                  d="M124.741 70.4941C124.821 70.439 124.886 70.3653 124.931 70.2794C124.976 70.1935 125 70.0979 125 70.0008C125 69.9037 124.976 69.8081 124.931 69.7222C124.886 69.6363 124.821 69.5626 124.741 69.5076L116.941 64.1072C116.851 64.0446 116.746 64.008 116.637 64.0012C116.527 63.9943 116.418 64.0176 116.321 64.0685C116.224 64.1193 116.143 64.1958 116.086 64.2895C116.03 64.3833 116 64.4908 116 64.6004L116 75.4012C116 75.5105 116.031 75.6177 116.087 75.7111C116.144 75.8045 116.225 75.8806 116.322 75.9313C116.419 75.9821 116.528 76.0054 116.637 75.9989C116.746 75.9924 116.851 75.9563 116.941 75.8945L124.741 70.4941Z"
                                  fill="white"
                                />
                                <path
                                  d="M18.2592 69.5059C18.1793 69.561 18.1139 69.6347 18.0687 69.7206C18.0236 69.8065 18 69.9021 18 69.9992C18 70.0963 18.0236 70.1919 18.0687 70.2778C18.1139 70.3637 18.1793 70.4374 18.2592 70.4924L26.0587 75.8928C26.1486 75.9554 26.254 75.992 26.3633 75.9988C26.4726 76.0057 26.5818 75.9824 26.6788 75.9315C26.7758 75.8807 26.8571 75.8042 26.9137 75.7105C26.9703 75.6167 27.0002 75.5092 27 75.3996L27 64.5988C26.9995 64.4895 26.9693 64.3823 26.9125 64.2889C26.8558 64.1955 26.7746 64.1194 26.6778 64.0687C26.581 64.0179 26.4722 63.9946 26.3631 64.0011C26.254 64.0076 26.1488 64.0437 26.0587 64.1055L18.2592 69.5059Z"
                                  fill="white"
                                />
                                <path
                                  d="M71.0059 123.241C71.061 123.321 71.1347 123.386 71.2206 123.431C71.3065 123.476 71.4021 123.5 71.4992 123.5C71.5963 123.5 71.6919 123.476 71.7778 123.431C71.8637 123.386 71.9374 123.321 71.9924 123.241L77.3928 115.441C77.4554 115.351 77.492 115.246 77.4988 115.137C77.5057 115.027 77.4824 114.918 77.4315 114.821C77.3807 114.724 77.3042 114.643 77.2105 114.586C77.1167 114.53 77.0092 114.5 76.8996 114.5L66.0988 114.5C65.9895 114.5 65.8823 114.531 65.7889 114.587C65.6955 114.644 65.6194 114.725 65.5687 114.822C65.5179 114.919 65.4946 115.028 65.5011 115.137C65.5076 115.246 65.5437 115.351 65.6055 115.441L71.0059 123.241Z"
                                  fill="white"
                                />
                                <path
                                  d="M71.9941 16.7592C71.939 16.6793 71.8653 16.6139 71.7794 16.5687C71.6935 16.5236 71.5979 16.5 71.5008 16.5C71.4037 16.5 71.3081 16.5236 71.2222 16.5687C71.1363 16.6139 71.0626 16.6793 71.0076 16.7592L65.6072 24.5587C65.5446 24.6486 65.508 24.754 65.5012 24.8633C65.4943 24.9726 65.5176 25.0818 65.5685 25.1788C65.6193 25.2758 65.6958 25.3571 65.7895 25.4137C65.8833 25.4703 65.9908 25.5002 66.1004 25.5L76.9012 25.5C77.0105 25.4995 77.1177 25.4693 77.2111 25.4125C77.3045 25.3558 77.3806 25.2746 77.4313 25.1778C77.4821 25.081 77.5054 24.9722 77.4989 24.8631C77.4924 24.754 77.4563 24.6488 77.3945 24.5587L71.9941 16.7592Z"
                                  fill="white"
                                />
                                <defs>
                                  <filter
                                    id="filter0_d_423_533"
                                    x="0.5"
                                    y="0.5"
                                    width="141"
                                    height="141"
                                    filterUnits="userSpaceOnUse"
                                    color-interpolation-filters="sRGB"
                                  >
                                    <feFlood
                                      flood-opacity="0"
                                      result="BackgroundImageFix"
                                    />
                                    <feColorMatrix
                                      in="SourceAlpha"
                                      type="matrix"
                                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                      result="hardAlpha"
                                    />
                                    <feOffset />
                                    <feGaussianBlur stdDeviation="3.25" />
                                    <feComposite
                                      in2="hardAlpha"
                                      operator="out"
                                    />
                                    <feColorMatrix
                                      type="matrix"
                                      values="0 0 0 0 0 0 0 0 0 0.262745 0 0 0 0 0.407843 0 0 0 0.14 0"
                                    />
                                    <feBlend
                                      mode="normal"
                                      in2="BackgroundImageFix"
                                      result="effect1_dropShadow_423_533"
                                    />
                                    <feBlend
                                      mode="normal"
                                      in="SourceGraphic"
                                      in2="effect1_dropShadow_423_533"
                                      result="shape"
                                    />
                                  </filter>
                                </defs>
                              </svg>
                            </div>
                            <div className="ml-10">
                              <div>
                                <h3 className="text-black text-opacity-60 text-[15px] font-normal leading-normal mb-2">
                                  Up
                                </h3>
                                <input
                                  type="text"
                                  id="up"
                                  name="up"
                                  className="w-[180px] outline-none border-b-2 border-b-[#00436833] border-b-opacity-10 cursor-pointer ml-2 text-black text-opacity-60 text-[15px] font-normal leading-normal"
                                />
                              </div>
                              <div>
                                <h3 className="text-black text-opacity-60 text-[15px] font-normal leading-normal mt-5 mb-2">
                                  Down
                                </h3>
                                <input
                                  type="text"
                                  id="down"
                                  name="down"
                                  className="w-[180px] outline-none border-b-2 border-b-[#00436833] border-b-opacity-10 cursor-pointer ml-2 text-black text-opacity-60 text-[15px] font-normal leading-normal"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="mt-14">
                            <div className="flex">
                              <button className="w-[183px] h-10 bg-[#004368] bg-opacity-5 hover:bg-opacity-100 text-[#004368] hover:text-white px-2 py-2 rounded-md cursor-pointer text-[15px] font-medium leading-normal capitalize mr-[14px]">
                                Add new data frame
                              </button>
                              <button className="w-[155px] h-10 bg-[#004368] bg-opacity-5 hover:bg-opacity-100 text-[#004368] hover:text-white px-2 py-2 rounded-md cursor-pointer text-[15px] font-medium leading-normal capitalize">
                                Add text box
                              </button>
                            </div>
                            <div className="flex mt-5 mb-7">
                              <button className="w-[183px] h-10 bg-[#004368] bg-opacity-5 hover:bg-opacity-100 text-[#004368] hover:text-white px-2 py-2 rounded-md cursor-pointer mr-[14px] text-[15px] font-medium leading-normal capitalize">
                                Add new line
                              </button>
                              <button className="w-[155px] h-10 bg-[#004368] bg-opacity-5 hover:bg-opacity-100 text-[#004368] hover:text-white px-2 py-2 rounded-md cursor-pointer text-[15px] font-medium leading-normal capitalize">
                                Add picture
                              </button>
                            </div>
                          </div>
                          <button className="w-[226px] h-10 bg-[#004368] hover:bg-opacity-30 text-white hover:text-black px-2 py-2 rounded-md cursor-pointer mr-4 text-[15px] font-medium leading-normal capitalize">
                            Restore Default Layout
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* right side */}
                    <div className="ml-10 w-[556px] h-[767px] bg-[#004368] bg-opacity-5 rounded-md">
                      <img
                        src={Express}
                        alt="Express"
                        className="w-[447px] h-[629px] mx-auto my-[69px]"
                      />
                    </div>
                  </div>
                </div>
              </dialog>
            )}

            {/* edit old model */}
            <button
              className="w-44 h-10 bg-[#004368] bg-opacity-10 text-black text-opacity-80 rounded-md border flex items-center justify-center hover:bg-[#004368] hover:text-white py-2 pl-2 mr-4"
              onClick={() => handleEditModalOpen()}
            >
              <FaEdit className="w-4 h-4" />
              <span className="text-[15px] font-normal leading-normal capitalize pl-2">
                {selectedLanguage === "zh-CN" ? "编辑旧模型" : "Edit old model"}
              </span>
            </button>
            {/* modal */}
            {isEditModalOpen && (
              <dialog
                id="my_modal_edit"
                className="modal"
                open={isEditModalOpen}
              >
                <div className="bg-white w-[1300px] h-[980px] rounded-md py-8 px-10 my-9 relative">
                  <div
                    className="absolute top-4 right-6 cursor-pointer tooltip"
                    data-tip="close"
                  >
                    <RxCross1
                      onClick={closeEditModal}
                      className="w-5 h-5 text-[#004368] text-opacity-35 hover:text-[#004368]"
                    />
                  </div>
                  <div className="flex mt-4">
                    {/* left side */}
                    <div className="w-[650px] text-start">
                      <div>
                        <p className="text-[#004368] text-xl font-semibold leading-normal capitalize mb-5">
                          1
                          <span className="ml-5 capitalize">
                            Add courier company
                          </span>
                        </p>

                        <div className="mt-4 flex items-center ml-[26px] mb-5">
                          <div className="w-[445px] h-12 outline-none rounded-md text-[#00000099] font-normal text-[15px] text-center flex justify-between items-center cursor-pointer mr-3">
                            <div className="w-full h-full bg-[#004368] bg-opacity-10 flex items-center rounded-md">
                              <CiSearch className="w-[22px] h-[22px] ml-3" />
                              <input
                                // onChange={handleSearchAllChange}
                                type="text"
                                placeholder="Search"
                                className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-transparent outline-none"
                              />
                            </div>
                          </div>

                          <button className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[115px] h-12 px-8 py-3 rounded-md cursor-pointer">
                            <p className="text-[15px] font-medium leading-normal capitalize">
                              Search
                            </p>
                          </button>
                        </div>

                        <div className="w-[623px] h-[207px] rounded-md  bg-[#AEAEAE0D] bg-opacity-5 mt-5 overflow-y-scroll cursor-pointer ml-[26px]">
                          <p className="pl-6 pt-1 mb-2 mt-2 text-[#004368] text-[15px] font-medium leading-normal capitalize">
                            Company Name
                          </p>
                          <div className="bg-[#004368] bg-opacity-10 w-[325px] mx-3 h-[0.5px] mb-2"></div>
                          <p className="pl-6 pt-1 mb-2 mt-2 text-black text-opacity-60 text-[15px] font-normal leading-normal capitalize">
                            Company Name
                          </p>
                          <div className="bg-[#004368] bg-opacity-10 w-[325px] mx-3 h-[0.5px] mb-2"></div>
                          <p className="pl-6 pt-1 mb-2 mt-2 text-black text-opacity-60 text-[15px] font-normal leading-normal capitalize">
                            Company Name
                          </p>
                          <div className="bg-[#004368] bg-opacity-10 w-[325px] mx-3 h-[0.5px] mb-2"></div>
                          <p className="pl-6 pt-1 mb-2 mt-2 text-black text-opacity-60 text-[15px] font-normal leading-normal capitalize">
                            Company Name
                          </p>
                          <div className="bg-[#004368] bg-opacity-10 w-[325px] mx-3 h-[0.5px] mb-2"></div>
                          <p className="pl-6 pt-1 mb-2 mt-2 text-black text-opacity-60 text-[15px] font-normal leading-normal capitalize">
                            Company Name
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-[#004368] text-xl font-semibold leading-normal capitalize">
                          2
                          <span className="ml-5 capitalize">
                            Select template by types
                          </span>
                        </p>
                        <div className="grid grid-cols-2 mt-7 ml-[26px] w-[623px] h-[207px] overflow-y-scroll cursor-pointer bg-[#AEAEAE0D] bg-opacity-5 p-4 rounded-md">
                          {modelNames?.map((modelName, index) => (
                            <div key={index} className="">
                              <label className="cursor-pointer my-2 mr-2 flex items-center">
                                <input
                                  type="radio"
                                  name="radio-1"
                                  // className="radio checked:bg-[#004368] w-5 h-5 mr-3"
                                  className="radio w-5 h-5 mr-3"
                                  checked={selectedOption === index}
                                  onChange={() =>
                                    handleOptionChange(modelName, index)
                                  }
                                />
                                <span
                                  className={`text-[15px] font-normal text-start ${
                                    selectedOption === index
                                      ? "text-[#004368]"
                                      : "text-black opacity-40"
                                  } capitalize`}
                                >
                                  {modelName}
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 w-full">
                        <p className="text-[#004368] text-xl font-semibold leading-normal capitalize">
                          3<span className="ml-5">Select electronic form</span>
                        </p>
                        <div className="grid grid-cols-3 mt-5 ml-10 w-full">
                          {electronicForms?.map((shopName, index) => (
                            <div key={index} className="mr-5">
                              <label className="cursor-pointer my-1 mr-1 flex items-center">
                                <input
                                  type="radio"
                                  name="radio-2"
                                  // className="radio checked:bg-[#004368] w-5 h-5 mr-3"
                                  className="radio w-5 h-5 mr-3"
                                  checked={selectedElectronicOption === index}
                                  onChange={() =>
                                    handleElectronicOptionChange(
                                      shopName,
                                      index
                                    )
                                  }
                                />
                                <span
                                  className={`text-[15px] ${
                                    selectedElectronicOption === index
                                      ? "text-[#004368] font-medium"
                                      : "text-black text-opacity-80 font-normal"
                                  } capitalize`}
                                >
                                  {shopName}
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex mt-10">
                        <button className="w-[115px] h-10 bg-[#004368] hover:bg-opacity-30 text-white hover:text-black px-2 py-2 rounded-md cursor-pointer mr-4 text-[15px] font-medium leading-normal capitalize">
                          Authorized
                        </button>
                        <button className="w-[204px] h-10 bg-white hover:bg-[#004368] hover:text-white text-[#004368] px-2 py-2 rounded-md cursor-pointer text-[15px] font-medium leading-normal capitalize border border-[#004368]">
                          <p className="">refresh after authorize</p>
                        </button>
                      </div>
                    </div>
                    {/* right side */}
                    <div className="ml-10 w-[556px] h-[767px] bg-[#004368] bg-opacity-5 rounded-md">
                      <img
                        src={Express}
                        alt="Express"
                        className="w-[447px] h-[629px] mx-auto my-[69px]"
                      />
                    </div>
                  </div>
                </div>
              </dialog>
            )}

            {/* settings button */}
            {/* <button className="w-32 h-10 bg-[#004368] bg-opacity-10 text-black text-opacity-80 rounded-md border flex items-center hover:bg-[#004368] hover:text-white py-2 pl-2">
              <RiSettingsLine className="w-4 h-4" />
              <span className="text-[15px] font-normal leading-normal capitalize pl-2">
                {selectedLanguage === "zh-CN" ? "设置" : "settings"}
              </span>
            </button> */}
          </div>
        </div>
      </div>

      {/* bottom section */}
      <div className="mt-8 mx-12">
        <p className="text-[#004368] text-xl font-semibold leading-normal capitalize mb-3">
          {selectedLanguage === "zh-CN" ? "模型列表" : "Model List"}
        </p>

        <div className="grid grid-cols-10 max-h-[549px]">
          {/* left side */}
          {
            <div className="col-span-2 bg-[#004368] bg-opacity-[0.05] rounded-md cursor-pointer">
              {loading ? (
                <div className="flex flex-col items-center justify-center pt-10 text-center w-full mx-auto pb-60">
                  <FadeLoader color="#004368" size={25} />
                  <p className="text-2xl font-medium pt-10 text-[#004368]">
                    {selectedLanguage === "zh-CN"
                      ? "数据正在加载，请稍候..."
                      : "Data is Loading. Please Wait..."}
                  </p>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center mt-20 text-lg font-semibold">
                  {selectedLanguage === "zh-CN"
                    ? "未找到数据。请稍后再试..."
                    : "Data Not Found. Please try again later...."}
                </div>
              ) : (
                stdTemplate &&
                stdTemplate?.map((model, index) => (
                  <div key={index}>
                    <button onClick={() => handleToSelectModel(model)}>
                      <div className="bg-[#004368] bg-opacity-10 w-[251px] mx-auto h-[0.5px] mb-2"></div>
                      <p
                        className={`pl-8 pt-2 mb-2 cursor-pointer  text-start ${
                          selectedModel?.standard_template_name ===
                          model?.standard_template_name
                            ? "font-semibold text-[#004368]"
                            : ""
                        }`}
                      >
                        {model?.standard_template_name}
                      </p>
                    </button>
                  </div>
                ))
              )}
            </div>
          }

          {/* middle side */}
          <div
            id="printId"
            className="col-span-4 bg-[#004368] bg-opacity-[0.05] ml-9 rounded-md px-16 py-12"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center pt-10 text-center w-full mx-auto pb-60">
                <FadeLoader color="#004368" size={25} />
                <p className="text-2xl font-medium pt-10 text-[#004368]">
                  {selectedLanguage === "zh-CN"
                    ? "数据正在加载，请稍候..."
                    : "Data is Loading. Please Wait..."}
                </p>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center mt-20 text-xl font-semibold">
                {selectedLanguage === "zh-CN"
                  ? "未找到数据。请稍后再试..."
                  : "Data Not Found. Please try again later...."}
              </div>
            ) : (
              selectedModel && (
                <img
                  src={selectedModel?.standard_template_image}
                  alt="express"
                  className="w-[297px] h-[418px] mx-auto"
                />
              )
            )}
            <div className=" text-center">{quantityNotice}</div>
            {checkedItemsChecking?.from === "shipped" ? (
              ""
            ) : (
              <div className=" text-center">
                {!loading && !error && (
                  <button
                    onClick={handleToChooseDeliverCompany}
                    className="bg-[#004368] bg-opacity-30 hover:bg-opacity-100 text-black hover:text-white w-[250px] h-10 px-1 py-2 rounded-md cursor-pointer text-center mt-5"
                    type="submit"
                  >
                    {bookingLoad
                      ? "loading..."
                      : selectedLanguage === "zh-CN"
                      ? "选择并预订交付"
                      : "Choose & Book for Delivery"}
                  </button>
                )}
                <ConfirmationModal
                  isOpen={isConfirmModalOpen}
                  title={modalTitle}
                  message={modalMessage}
                  onClose={() => setIsConfirmModalOpen(false)}
                  onConfirm={confirmAction}
                  showConfirmButton={showConfirmButton}
                  showOkButton={showOkButton}
                />
              </div>
            )}
          </div>

          {/* right side */}
          <div className="col-span-4 ml-12">
            {/* 1st section */}
            <PrintComponent
              checkedExpressChecking={checkedExpressChecking}
              checkedItemsChecking={checkedItemsChecking}
              selectedModel={selectedModel}
              senderInformation={senderInformation}
              printDataWithWaybillCode={printDataWithWaybillCode}
              WaybillRequestData={WaybillRequestData}
              userInformation={userInformation}
            />

            {/* <div className="flex items-center mb-4">
              <p className="mr-[60px] text-black text-opacity-80 text-[15px] font-semibold leading-normal capitalize">
                Bound print
              </p>
              <select className="select w-[245px] h-10 rounded-md outline-none text-black text-opacity-80 font-normal leading-normal text-[15px] capitalize py-2 px-4 text-center inline-flex items-center bg-[#0043681A] cursor-pointer">
                {BoundOrders.map((option, index) => (
                  <option
                    key={index}
                    value={option}
                    disabled={index === 0}
                    selected={index === 0}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div> */}

            {/* 2nd section */}
            {/* <div>
              <p className="text-[#004368] text-xl font-semibold leading-normal capitalize">
                Choose shop account
              </p>
              <div>
                <div className="flex items-center ml-8 mt-[10px]">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-[2px] text-black text-opacity-60 bg-[#004368] cursor-pointer mr-5"
                    name="product"
                    // value={customerData.id}
                    // checked={checkedItems.includes(customerData.id)}
                    // checked={checkedItems.some(
                    //   (item) => item?.id === customerData?.id
                    // )}
                    // onChange={() => handleCheckboxChange(customerData)}
                    // checked={selectedItems.includes(product.id)}
                    // onChange={() => handleCheckboxChange(product.id)}
                    // onClick={() => handleProductCheck(product)}
                  />
                  <p className="text-black text-opacity-80 text-[15px] font-normal leading-tight capitalize">
                    shop account name with delivery express name
                  </p>
                </div>
                <div className="flex items-center ml-8 mt-[10px]">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-[2px] text-black text-opacity-60 bg-[#004368] cursor-pointer mr-5"
                    name="product"
                    // value={customerData.id}
                    // checked={checkedItems.includes(customerData.id)}
                    // checked={checkedItems.some(
                    //   (item) => item?.id === customerData?.id
                    // )}
                    // onChange={() => handleCheckboxChange(customerData)}
                    // checked={selectedItems.includes(product.id)}
                    // onChange={() => handleCheckboxChange(product.id)}
                    // onClick={() => handleProductCheck(product)}
                  />
                  <p className="text-black text-opacity-80 text-[15px] font-normal leading-tight capitalize">
                    shop account name with delivery express name
                  </p>
                </div>
                <div className="flex items-center ml-8 mt-[10px]">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-[2px] text-black text-opacity-60 bg-[#004368] cursor-pointer mr-5"
                    name="product"
                    // value={customerData.id}
                    // checked={checkedItems.includes(customerData.id)}
                    // checked={checkedItems.some(
                    //   (item) => item?.id === customerData?.id
                    // )}
                    // onChange={() => handleCheckboxChange(customerData)}
                    // checked={selectedItems.includes(product.id)}
                    // onChange={() => handleCheckboxChange(product.id)}
                    // onClick={() => handleProductCheck(product)}
                  />
                  <p className="text-black text-opacity-80 text-[15px] font-normal leading-tight capitalize">
                    shop account name with delivery express name
                  </p>
                </div>
              </div>
            </div> */}

            {/* 3rd section */}
            {/* <div className="mt-3">
              <p className="text-[#004368] text-xl font-semibold leading-normal capitalize mb-1">
                token
              </p>
              <div className="flex items-center">
                <input
                  type="text"
                  className="bg-[#004368] bg-opacity-10 w-[379px] h-10 rounded-md outline-none pl-[3px] mr-5"
                />
                <TfiReload className="w-[22px] h-[22px] text-[#004368] text-opacity-60 cursor-pointer" />
              </div>
            </div> */}

            {/* 4th section */}
            {/* <div className="w-[367px] h-[206px] rounded-md bg-[#004368] bg-opacity-[0.05] mt-6 overflow-y-scroll cursor-pointer">
              <p className="pl-8 pt-2 mb-2 mt-4 text-[#004368] text-[15px] font-medium leading-normal capitalize">
                Delivery address
              </p>
              <div className="bg-[#004368] bg-opacity-10 w-[325px] mx-3 h-[0.5px] mb-2"></div>
              <p className="pl-8 pt-2 mb-2 mt-4 text-black text-opacity-60 text-[15px] font-normal leading-normal capitalize">
                Delivery address
              </p>
              <div className="bg-[#004368] bg-opacity-10 w-[325px] mx-3 h-[0.5px] mb-2"></div>
              <p className="pl-8 pt-2 mb-2 mt-4 text-black text-opacity-60 text-[15px] font-normal leading-normal capitalize">
                Delivery address
              </p>
              <div className="bg-[#004368] bg-opacity-10 w-[325px] mx-3 h-[0.5px] mb-2"></div>
              <p className="pl-8 pt-2 mb-2 mt-4 text-black text-opacity-60 text-[15px] font-normal leading-normal capitalize">
                Delivery address
              </p>
              <div className="bg-[#004368] bg-opacity-10 w-[325px] mx-3 h-[0.5px] mb-2"></div>
              <p className="pl-8 pt-2 mb-2 mt-4 text-black text-opacity-60 text-[15px] font-normal leading-normal capitalize">
                Delivery address
              </p>
            </div> */}

            {/* 5th section */}
            <div className="mt-4 capitalize">
              {/* <div className="flex items-center">
                <p className="text-black text-opacity-60 text-[15px] font-normal leading-normal capitalize mr-[10px]">
                  express paper charge
                </p>
                <p className="text-[#004368] text-[15px] font-semibold leading-normal capitalize">
                  authorize
                </p>
              </div> */}
              {/* <div className="flex items-center mt-3 mb-10">
                <button
                  // onClick={handlePrint}
                  className="w-[182px] h-10 bg-[#004368] text-white  text-center text-[15px] leading-normal font-semibold rounded-md hover:bg-[#004368] hover:bg-opacity-30 hover:text-black py-2 mr-5"
                >
                  Save
                </button>
                <Link
                  to="/batchprint"
                  className="w-32 h-10 bg-[#004368] bg-opacity-10 text-black text-opacity-80  hover:bg-[#004368] hover:text-white rounded-md border flex items-center py-2 px-6"
                >
                  <IoIosArrowBack className="w-[18px] h-[18px]" />
                  <span className="text-[15px] font-medium leading-normal capitalize pl-1 hover:text-white">
                    Back
                  </span>
                </Link>
              </div> */}

              {/* Preview component */}
              {/* <PreviewComponent
                checkedExpressChecking={checkedExpressChecking}
                checkedItemsChecking={checkedItemsChecking}
              ></PreviewComponent> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchPrintExpressDelivery;
