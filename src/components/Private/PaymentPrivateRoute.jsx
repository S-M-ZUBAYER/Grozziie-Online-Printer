import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  accountUserChange,
  paymentUserChange,
} from "../../features/slice/userSlice";

const PaymentPrivateRoute = ({ children }) => {
  //   language change
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );
  const isPaymentUser = useSelector((state) => state.user.accountUser);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserValid, setIsUserValid] = useState(false);
  const [token, setToken] = useState("");
  const currentUser = useSelector((state) => state.user.accountUser);
  const dispatch = useDispatch();

  const [cipher, setCipher] = useState(() => {
    const stored = localStorage.getItem("tiktokShopInfo");
    return stored ? JSON.parse(stored) : [];
  });
  console.log(cipher, currentUser);

  //pin dou dou
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const token = localStorage.getItem("GrozziieToken");
  //       setToken(token);
  //       console.log(token, "token")
  //       const response = await axios.get(
  //         "https://grozziieget.zjweiting.com:3091/GrozziiePrint-LoginRegistration/user/details",
  //         {
  //           params: { token: token },
  //         }
  //       );
  //       const userData = response.data;
  //       console.log(userData, "userData")
  //       dispatch(paymentUserChange(userData));
  //       dispatch(accountUserChange(userData?.email));
  //       console.log(userData, "userData");

  //       const transactionLen = userData?.transactions?.length;
  //       if (
  //         userData?.transactions[transactionLen - 1]?.transactionStatus ===
  //         "SUCCESS" &&
  //         userData?.transactions[transactionLen - 1].validFor
  //       ) {
  //         setIsUserValid(true);
  //       } else {
  //         setIsUserValid(false);
  //         setIsModalOpen(true);
  //       }
  //     } catch (error) {
  //       setIsUserValid(false);
  //       setIsModalOpen(true);
  //       if (error?.response?.data?.title === "TOKEN_ERROR") {
  //         navigate("/login");
  //       }

  //     }
  //   };

  //   if (Object.keys(currentUser)?.length === 0) {
  //     fetchUserData();
  //   } else {
  //     console.log(currentUser, "check transaction")
  //     const transactionLen = currentUser?.transactions?.length;
  //     if (
  //       currentUser?.transactions[transactionLen - 1]?.transactionStatus ===
  //       "SUCCESS" &&
  //       currentUser?.transactions[transactionLen - 1]?.validFor
  //     )
  //     // if (
  //     //   currentUser?.subscription &&
  //     //   new Date(currentUser?.subscription.activatedTime) >= new Date()
  //     // )
  //     {
  //       console.log(new Date(currentUser?.subscription.activatedTime) >= new Date(), "Check time");
  //       setIsUserValid(true);
  //     } else {
  //       setIsUserValid(false);
  //       setIsModalOpen(true);
  //     }
  //   }
  // }, [currentUser, dispatch]);

  useEffect(() => {
    const checkPaymentValidity = async () => {
      try {
        const res = await axios.get(
          `https://grozziieget.zjweiting.com:8033/tht/printerUserPaymentInfo/${currentUser}`
        );

        const result = res.data?.result?.TikTok;
        const currentShopName = cipher[0]?.name;
        console.log(currentShopName, ",,,,,,,,,,,,,,,,,,,,,,,,,,shop", result);

        const matched = result?.find(
          (entry) => entry.shopName === currentShopName
        );

        if (matched) {
          const expire = new Date(matched.paymentExpireTime);
          const now = new Date();

          if (expire > now) {
            setIsUserValid(true);
          } else {
            setIsModalOpen(true);
          }
        } else {
          setIsModalOpen(true);
        }
      } catch (err) {
        console.error("Payment check error", err);
        setIsModalOpen(true);
      }
    };

    if (currentUser && cipher?.length > 0) {
      checkPaymentValidity();
    }
  }, [currentUser, cipher]);

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/pricing"); // Redirect to the payment page
  };

  if (!isUserValid) {
    return (
      <>
        {children}
        {isModalOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg max-[400px] h-52 mx-auto text-center  space-y-6">
                <h2 className="text-2xl font-bold mb-4 text-[#004368]">
                  {selectedLanguage === "zh-CN"
                    ? "完成支付"
                    : "Complete Payment"}
                </h2>
                <p className="mb-4 text-[#004368]">
                  {selectedLanguage === "zh-CN"
                    ? "您需要完成付款才能访问此页面。"
                    : "You need to complete your payment to access this page."}
                </p>
                <button
                  className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[205px] h-10 px-8 py-2 rounded-md cursor-pointer"
                  onClick={closeModal}
                >
                  {selectedLanguage === "zh-CN" ? "前往付款" : " Go to Payment"}
                </button>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default PaymentPrivateRoute;
