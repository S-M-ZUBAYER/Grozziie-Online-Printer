import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DeliveryCompanyList from "../../Share/DeliveryCompanyList/DeliveryCompanyList";
import { orderList } from "../../Share/Data/ClientData";
import axios from "axios";
import { w3cwebsocket as WebSocket } from "websocket";
import { decryptArrayData } from "../../Share/Function/OrderListFunctions";
import { orderListData } from "../../features/slice/orderListSlice";
import { orderListParameter } from "../BatchPrint/OrderListParameter";
import { useLoadOrderListMutation } from "../../features/allApis/batchPrintApi";
import world from "../../assets/world.png";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const [pddAccessToken, setPddAccessToken] = useState(
    localStorage.getItem("pddAccessToken")
  );
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    country: "",
    message: "",
  });
  const { t } = useTranslation();
  const [orderListDataEncrypt, setOrderListDataEncrypt] = useState([]);
  const [loadOrderList, { isLoading, isError }] = useLoadOrderListMutation();
  const dispatch = useDispatch();
  // const orderList = useSelector((state) => state.orderList.data);

  // old code
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await loadOrderList({
  //         pddAccessToken,
  //         data: orderListParameter,
  //       });
  //       if ("error" in response) {
  //         console.log("This is response error");
  //       } else {
  //         console.log(response, "check response");
  //         const orderList = response?.data?.order_list_get_response?.order_list;
  //         console.log(
  //           response?.data?.order_list_get_response?.order_list,
  //           "Check"
  //         );
  //         const filteredOrderList = orderList?.filter((item) => {
  //           return item.address !== "";
  //         });

  //         setOrderListDataEncrypt(filteredOrderList.slice(0, 2));
  //         // setOrderListDataEncrypt(orderList.slice(10, 18));
  //         // dispatch(
  //         //     orderListData(filteredOrderList)
  //         // );
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // console.log(orderList, "orderList");
  // const decryptAndDispatchOrderList = async () => {
  //   try {
  //     // Decrypt the orderList
  //     const decryptedOrderList = await decryptArrayData(orderListDataEncrypt);
  //     console.log(decryptedOrderList);
  //     // Dispatch the decrypted orderList
  //     dispatch(orderListData(decryptedOrderList));

  //     console.log(decryptedOrderList, "check response"); // Log the decrypted orderList
  //   } catch (error) {
  //     console.error("Error decrypting orderList:", error);
  //   }
  // };

  // useEffect(() => {
  //   decryptAndDispatchOrderList();
  // }, [orderListDataEncrypt]);

  // useEffect(() => {
  //     const decryptAndDispatchOrderList = async () => {
  //         console.log("decript")
  //         try {
  //             // Decrypt the orderList
  //             if (orderList) {
  //                 const decryptedOrderList = await decryptArrayData(orderList);

  //                 // Dispatch the decrypted orderList
  //                 // dispatch(orderListData(decryptedOrderList));

  //                 console.log(decryptedOrderList, "check response"); // Log the decrypted orderList
  //             }

  //         } catch (error) {
  //             console.error('Error decrypting orderList:', error);
  //         }
  //     };

  //     // Call decryptAndDispatchOrderList when component mounts
  //     decryptAndDispatchOrderList();

  //     // Optionally, you can return a cleanup function here if needed
  //     // return () => {
  //     //     // Cleanup code
  //     // };

  // }, [orderList]); // Empty dependency array to run once when component mounts

  // console.log(
  //   "orderListDataEncrypt",
  //   orderListDataEncrypt,
  //   "orderListDataEncrypt"
  // );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success("Thank you for your message");
    console.log(formData);
    setFormData({
      userName: "",
      email: "",
      country: "",
      message: "",
    });
  };

  return (
    <div className="mx-auto mt-10 min-h-screen">
      <div className="grid grid-cols-5 gap-x-1">
        {/* right side */}
        <div className="col-span-3 flex flex-col">
          <div className="flex flex-col px-20 mb-3">
            <h1 className="text-[#004368] text-5xl font-bold leading-tight">
              {t("LetsTalk")}
            </h1>
            <p className="mt-3 mb-6 text-xl">
              {t("HaveIdea")}
              {t("ReachOut")}
            </p>

            <h3 className="text-xl mb-2 font-bold">{t("SupportEmail")}</h3>
            <p className="text-[#004368]">support.grozziie@gmail.com</p>
          </div>
          <div className="mt-6">
            <img src={world} alt="World" className="" />
          </div>
        </div>
        {/* Left side */}
        <div className="col-span-2 mt-8">
          <form className="w-full" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-10">
              <label className="form-control w-full">
                <span className="text-[#004368] text-sm font-medium mb-3">
                  {t("Name")}
                </span>
                <input
                  type="test"
                  name="userName"
                  required
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder={t("EnterUserName")}
                  className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded"
                />
              </label>
            </div>

            {/* Email */}
            <div className="mb-10">
              <label className="form-control w-full">
                <span className="text-[#004368] text-sm font-medium mb-3">
                  {t("Email")}
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("EnterEmail")}
                  className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded"
                />
              </label>
            </div>

            {/* country */}
            <div className="mb-10">
              <label className="form-control w-full">
                <span className="text-[#004368] text-sm font-medium mb-3">
                  {t("Country")}
                </span>
                <select
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="select select-bordered focus:outline-none text-black text-opacity-55 text-[15px] font-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-1 rounded"
                >
                  <option disabled selected>
                    {t("SelectCountry")}
                  </option>
                  <option>中国</option>
                </select>
              </label>
            </div>

            {/* Message */}
            <div className="mb-8">
              <label className="form-control w-full">
                <span className="text-[#004368] text-sm font-medium mb-3">
                  {t("Message")}
                </span>
                <textarea
                  name="message"
                  value={formData.message}
                  required
                  onChange={handleChange}
                  className="bg-white textarea textarea-bordered focus:outline-none h-32"
                  placeholder={t("YourMessage")}
                ></textarea>
              </label>
            </div>

            <div className="flex items-center justify-center">
              <button
                className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-full h-10 px-2 py-2 rounded-md cursor-pointer text-center"
                type="submit"
              >
                {t("Submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
