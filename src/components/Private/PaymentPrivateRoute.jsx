// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { useTranslation } from "react-i18next";

// const PaymentPrivateRoute = ({ children }) => {
//   const currentUser = useSelector((state) => state.user.accountUser);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { t } = useTranslation();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isUserValid, setIsUserValid] = useState(false);

//   // Load shop info from localStorage
//   const [tiktokShopId] = useState(() => {
//     const stored = localStorage.getItem("tiktokShopInfo");
//     return stored ? JSON.parse(stored) : [];
//   });
//   const [lazadaShopId] = useState(() => {
//     const stored = localStorage.getItem("lazadaShopInfo");
//     return stored ? JSON.parse(stored) : [];
//   });
//   const [shopeeShopId] = useState(() => {
//     const stored = localStorage.getItem("shopeeShopInfo");
//     return stored ? JSON.parse(stored) : [];
//   });

//   useEffect(() => {
//     if (!currentUser) return;

//     const checkPaymentValidity = async () => {
//       try {
//         const res = await axios.get(
//           `https://grozziieget.zjweiting.com:8033/tht/printerUserPaymentInfo/${currentUser}`
//         );

//         // Determine platform from URL
//         const lowerPath = location.pathname.toLowerCase();
//         let platform = "";
//         if (lowerPath.includes("tiktok")) platform = "tiktok";
//         else if (lowerPath.includes("lazada")) platform = "lazada";
//         else if (lowerPath.includes("shopee")) platform = "shopee";

//         // Map platform to shopId
//         const shopIdMap = {
//           tiktok: tiktokShopId[0]?.id,
//           lazada: lazadaShopId[0]?.id,
//           shopee: shopeeShopId[0]?.id,
//         };
//         const currentShopName = shopIdMap[platform];

//         if (!currentShopName) {
//           console.warn("No shop info found for platform:", platform);
//           setIsUserValid(false); // ensure state updates
//           setIsModalOpen(true);
//           return;
//         }

//         // Get API result for this platform
//         const result = res.data?.result?.[platform];
//         if (!result) {
//           console.warn("No payment info found for platform:", platform);
//           setIsUserValid(false); // ensure state updates
//           setIsModalOpen(true);
//           return;
//         }

//         // Find matching shop
//         const matched = result.find(
//           (entry) => entry.shopName.toString() === currentShopName.toString()
//         );

//         if (matched) {
//           const expire = new Date(matched.paymentExpireTime);

//           if (expire > new Date()) {
//             setIsUserValid(true);
//           } else {
//             setIsModalOpen(true);
//             setIsUserValid(false);
//           }
//         } else {
//           setIsModalOpen(true);
//         }
//       } catch (err) {
//         console.error("Payment check error:", err);
//         setIsModalOpen(true);
//       }
//     };

//     checkPaymentValidity();
//   }, [
//     currentUser,
//     tiktokShopId,
//     lazadaShopId,
//     shopeeShopId,
//     location.pathname,
//   ]);

//   const closeModal = () => {
//     setIsModalOpen(false);
//     navigate("/pricing");
//   };

//   // Render modal if user is invalid
//   if (!isUserValid) {
//     return (
//       <>
//         {children}
//         {isModalOpen && (
//           <>
//             <div className="fixed inset-0 bg-black bg-opacity-50 z-50"></div>
//             <div className="fixed inset-0 flex items-center justify-center z-50">
//               <div className="bg-white p-8 rounded-lg shadow-lg max-[400px] h-52 mx-auto text-center space-y-6">
//                 <h2 className="text-2xl font-bold mb-4 text-[#004368]">
//                   {t("CompletePayment")}
//                 </h2>
//                 <p className="mb-4 text-[#004368]">
//                   {t("CompletePaymentMessage")}
//                 </p>
//                 <button
//                   className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[205px] h-10 px-8 py-2 rounded-md cursor-pointer"
//                   onClick={closeModal}
//                 >
//                   {t("GoToPayment")}
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </>
//     );
//   }

//   return <>{children}</>;
// };

// export default PaymentPrivateRoute;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

// 🔹 Utility: Get platform name from URL path
const getPlatformFromPath = (pathname) => {
  const lower = pathname.toLowerCase();
  if (lower.includes("tiktok")) return "tiktok";
  if (lower.includes("lazada")) return "lazada";
  if (lower.includes("shopee")) return "shopee";
  return "";
};

// 🔹 Utility: Load shop info from localStorage
const getShopIdFromLocalStorage = (key) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored)[0]?.id : null;
};

// 🔹 Utility: Validate payment expiration
const isPaymentValid = (paymentExpireTime) => {
  if (!paymentExpireTime) return false;
  return new Date(paymentExpireTime) > new Date();
};

const PaymentPrivateRoute = ({ children }) => {
  const currentUser = useSelector((state) => state.user.accountUser);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserValid, setIsUserValid] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const checkPaymentValidity = async () => {
      try {
        const res = await axios.get(
          `https://grozziieget.zjweiting.com:8033/tht/printerUserPaymentInfo/${currentUser}`
        );

        const platform = getPlatformFromPath(location.pathname);
        if (!platform) return;

        const shopIdMap = {
          tiktok: getShopIdFromLocalStorage("tiktokShopInfo"),
          lazada: getShopIdFromLocalStorage("lazadaShopInfo"),
          shopee: getShopIdFromLocalStorage("shopeeShopInfo"),
        };

        const currentShopId = shopIdMap[platform];
        if (!currentShopId) {
          setIsUserValid(false);
          setIsModalOpen(true);
          return;
        }

        const platformResult = res.data?.result?.[platform] || [];
        const matched = platformResult.find(
          (entry) => entry.shopName.toString() === currentShopId.toString()
        );

        if (matched && isPaymentValid(matched.paymentExpireTime)) {
          setIsUserValid(true);
        } else {
          setIsUserValid(false);
          setIsModalOpen(true);
        }
      } catch (err) {
        console.error("Payment check error:", err);
        setIsUserValid(false);
        setIsModalOpen(true);
      }
    };

    checkPaymentValidity();
  }, [currentUser, location.pathname]);

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/onlineprint/pricing");
  };

  return (
    <>
      {children}
      {isModalOpen && (
        <>
          {" "}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50"></div>{" "}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {" "}
            <div className="bg-white p-8 rounded-lg shadow-lg max-[400px] h-64 mx-auto text-center ">
              {" "}
              <h2 className="text-2xl font-bold mb-4 text-[#004368]">
                {t("CompletePayment")}{" "}
              </h2>{" "}
              <p className="mb-4 text-gray-500">
                {t("CompletePaymentMessage")}
              </p>{" "}
              <button
                className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[205px] h-10 px-8 py-2 mt-8 rounded-md cursor-pointer"
                onClick={closeModal}
              >
                {t("GoToPayment")}{" "}
              </button>{" "}
              <p
                className="text-[#004368] underline cursor-pointer bg-transparent border-0 p-0 mt-5"
                onClick={() => navigate("/onlineprint/home")}
              >
                {t("BackToHomePage")}
              </p>
            </div>{" "}
          </div>
        </>
      )}
    </>
  );
};

export default PaymentPrivateRoute;
