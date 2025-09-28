import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

const PaymentPrivateRoute = ({ children }) => {
  const currentUser = useSelector((state) => state.user.accountUser);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserValid, setIsUserValid] = useState(false);

  // Load shop info from localStorage
  const [tiktokShopId] = useState(() => {
    const stored = localStorage.getItem("tiktokShopInfo");
    return stored ? JSON.parse(stored) : [];
  });
  const [lazadaShopId] = useState(() => {
    const stored = localStorage.getItem("lazadaShopInfo");
    return stored ? JSON.parse(stored) : [];
  });
  const [shopeeShopId] = useState(() => {
    const stored = localStorage.getItem("shopeeShopInfo");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (!currentUser) return;

    const checkPaymentValidity = async () => {
      try {
        const res = await axios.get(
          `https://grozziieget.zjweiting.com:8033/tht/printerUserPaymentInfo/${currentUser}`
        );

        // Determine platform from URL
        const lowerPath = location.pathname.toLowerCase();
        let platform = "";
        if (lowerPath.includes("tiktok")) platform = "tiktok";
        else if (lowerPath.includes("lazada")) platform = "lazada";
        else if (lowerPath.includes("shopee")) platform = "shopee";
        console.log(
          platform,
          "ksljdflkadsjflkajsd klj askljdfj lkadsj lflakj dflakjldsfkjalsdjfl"
        );

        // Map platform to shopId
        const shopIdMap = {
          tiktok: tiktokShopId[0]?.id,
          lazada: lazadaShopId[0]?.id,
          shopee: shopeeShopId[0]?.id,
        };
        const currentShopName = shopIdMap[platform];

        if (!currentShopName) {
          console.warn("No shop info found for platform:", platform);
          setIsUserValid(false); // ensure state updates
          setIsModalOpen(true);
          return;
        }

        // Get API result for this platform
        const result = res.data?.result?.[platform];
        if (!result) {
          console.warn("No payment info found for platform:", platform);
          setIsUserValid(false); // ensure state updates
          setIsModalOpen(true);
          return;
        }

        // Find matching shop
        const matched = result.find(
          (entry) => entry.shopName.toString() === currentShopName.toString()
        );

        if (matched) {
          const expire = new Date(matched.paymentExpireTime);
          console.log(expire, "expire");

          if (expire > new Date()) {
            setIsUserValid(true);
          } else {
            setIsModalOpen(true);
            setIsUserValid(false);
          }
        } else {
          setIsModalOpen(true);
        }
      } catch (err) {
        console.error("Payment check error:", err);
        setIsModalOpen(true);
      }
    };

    checkPaymentValidity();
  }, [
    currentUser,
    tiktokShopId,
    lazadaShopId,
    shopeeShopId,
    location.pathname,
  ]);

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/pricing");
  };

  // Render modal if user is invalid
  if (!isUserValid) {
    return (
      <>
        {children}
        {isModalOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg max-[400px] h-52 mx-auto text-center space-y-6">
                <h2 className="text-2xl font-bold mb-4 text-[#004368]">
                  {t("CompletePayment")}
                </h2>
                <p className="mb-4 text-[#004368]">
                  {t("CompletePaymentMessage")}
                </p>
                <button
                  className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[205px] h-10 px-8 py-2 rounded-md cursor-pointer"
                  onClick={closeModal}
                >
                  {t("GoToPayment")}
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
