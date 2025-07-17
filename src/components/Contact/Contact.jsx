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
              {selectedLanguage === "zh-CN" ? "让我们谈谈" : "Let’s Talk"}
            </h1>
            {selectedLanguage === "zh-CN" ? (
              <p className="mt-3 mb-6 text-xl">
                有大想法或品牌要开发并需要帮助吗？
                <br /> 那么请联系我们，我们很愿意听取您的
                <br /> 项目并提供帮助。
              </p>
            ) : (
              <p className="mt-3 mb-6 text-xl">
                Have some big idea or brand to develop and need <br /> help?
                Then reach out we'd love to hear about your <br /> project and
                provide help
              </p>
            )}

            <h3 className="text-xl mb-2 font-bold">
              {selectedLanguage === "zh-CN" ? "客户服务" : "Support Email"}
            </h3>
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
                  {selectedLanguage === "zh-CN" ? "名字" : "Name"}
                </span>
                <input
                  type="test"
                  name="userName"
                  required
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder={
                    selectedLanguage === "zh-CN"
                      ? "输入用户名"
                      : "enter user name"
                  }
                  className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded"
                />
              </label>
            </div>

            {/* Email */}
            <div className="mb-10">
              <label className="form-control w-full">
                <span className="text-[#004368] text-sm font-medium mb-3">
                  {selectedLanguage === "zh-CN" ? "电子邮件" : "Email"}
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={
                    selectedLanguage === "zh-CN"
                      ? "输入你的电子邮箱"
                      : "enter your email"
                  }
                  className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded"
                />
              </label>
            </div>

            {/* country */}
            <div className="mb-10">
              <label className="form-control w-full">
                <span className="text-[#004368] text-sm font-medium mb-3">
                  {selectedLanguage === "zh-CN" ? "国家" : "Country"}
                </span>
                <select
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="select select-bordered focus:outline-none text-black text-opacity-55 text-[15px] font-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-1 rounded"
                >
                  <option disabled selected>
                    {selectedLanguage === "zh-CN"
                      ? "选择国家"
                      : "Select Country"}
                  </option>
                  <option>中国</option>
                </select>
              </label>
            </div>

            {/* Message */}
            <div className="mb-8">
              <label className="form-control w-full">
                <span className="text-[#004368] text-sm font-medium mb-3">
                  {selectedLanguage === "zh-CN" ? "信息" : "Message"}
                </span>
                <textarea
                  name="message"
                  value={formData.message}
                  required
                  onChange={handleChange}
                  className="bg-white textarea textarea-bordered focus:outline-none h-32"
                  placeholder="请提供您的反馈"
                ></textarea>
              </label>
            </div>

            <div className="flex items-center justify-center">
              <button
                className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-full h-10 px-2 py-2 rounded-md cursor-pointer text-center"
                type="submit"
              >
                {selectedLanguage === "zh-CN" ? "提交" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
