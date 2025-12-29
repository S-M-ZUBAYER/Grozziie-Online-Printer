import { RouterProvider, useLocation } from "react-router-dom";
import "./App.css";
import { routes } from "./routes/Routes";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  accountUserChange,
  paymentUserChange,
} from "./features/slice/userSlice";
import { useDispatch } from "react-redux";
import {
  setAllLazadaShopList,
  setAllShopeeShopList,
  setAllTikTokShopList,
} from "./features/slice/allShopSlice";
import calculatePaymentExpireTime from "./lib/calculatePaymentExpireTime";
import axios from "axios";

function App() {
  const dispatch = useDispatch();
  const [tikTokShopCipher, setTikTokShopCipher] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [freeTrailPlatform, setFreeTrailPlatform] = useState("");
  const [freeTrailDays, setFreeTrailDays] = useState("3 Months");

  // Get the Free Trail package duration information
  const fetchFreeTrialDuration = async () => {
    try {
      const res = await fetch(
        `https://grozziieget.zjweiting.com:8033/tht/grozziiePrinter/pricing/country/MY/platform/tiktok`
      );

      if (!res.ok) throw new Error("Failed to fetch pricing");

      const json = await res.json();

      const freeTrial = json?.data?.find(
        (pkg) => pkg.packageName === "Free Trial"
      );
      setFreeTrailDays(freeTrial?.duration || "03 Month");
      return freeTrial?.duration || "03 Month"; // fallback
    } catch (err) {
      console.error("❌ Pricing fetch failed:", err);
      return "03 Months"; // safe fallback
    }
  };

  const freeTrailsTime = fetchFreeTrialDuration();

  useEffect(() => {
    const storedUser = localStorage.getItem("printerUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user?.email);
        dispatch(accountUserChange(user?.email));
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
      }
    }
  }, [dispatch]);

  // TikTokkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk...............

  useEffect(() => {
    if (!currentUser) return; // ✅ Skip if no user

    const fetchTikTokShops = async () => {
      try {
        // 1️⃣ Fetch TikTok shop data from backend
        const backendRes = await fetch(
          `https://grozziieget.zjweiting.com:8033/tht/grozziiePrinter/tiktok/shop/${currentUser}`
        );
        if (!backendRes.ok)
          throw new Error("Failed to fetch TikTok shops from backend");

        const backendData = await backendRes.json();
        if (!backendData?.data?.length) {
          console.warn("No TikTok shops found in backend response.");
          return;
        }

        const allAuthorizedShops = [];

        // 2️⃣ Loop through all TikTok shops and fetch authorized shops
        for (const shop of backendData.data) {
          const tiktokOpenId = shop.TikTokAPPKey;
          const tiktokAuthCountry = shop.ShopCountry;
          const freeTrialDuration = await fetchFreeTrialDuration();

          const partnerRes = await fetch(
            `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/shops/authorizedShops?openId=${tiktokOpenId}`
          );

          if (!partnerRes.ok) {
            console.warn(
              `Failed to fetch authorized shops for appKey: ${tiktokOpenId}`
            );
            continue;
          }

          const partnerData = await partnerRes.json();

          // ✅ Fetch payment info only once per loop
          let paidShopNames = [];
          try {
            const paymentRes = await fetch(
              `https://grozziieget.zjweiting.com:8033/tht/printerUserPaymentInfo/${currentUser}`
            );
            const paymentData = await paymentRes.json();
            paidShopNames =
              paymentData?.result?.["tiktok"]?.map((p) => p.shopName) || [];
          } catch (err) {
            console.error("❌ Failed to fetch payment info:", err);
          }

          // ✅ partnerData.shops (not partnerData.data.shops)
          const shops = partnerData?.data?.shops || [];
          if (shops.length === 0) continue;

          const firstShop = shops[0];
          const shopId = firstShop?.id?.toString();

          // 3️⃣ Create default payment record if not exists
          if (!paidShopNames.includes(shopId)) {
            const paymentInfo = {
              email: currentUser,
              shopPlatform: "tiktok",
              shopName: shopId,
              paymentTime: new Date().toISOString().split(".")[0] + "Z",
              paymentExpireTime: calculatePaymentExpireTime(freeTrialDuration),
              amount: 0,
              currency: "USD",
            };

            try {
              const { data } = await axios.post(
                "https://grozziieget.zjweiting.com:8033/tht/printerUserPaymentInfo/add",
                paymentInfo
              );
              localStorage.setItem("paymentInfo", JSON.stringify(data));
              // ✅ Show success modal
              setFreeTrailPlatform("TikTok");
              setShowSuccessModal(true);
            } catch (err) {
              console.error("❌ Failed to create payment info:", err);
            }
          }

          // 4️⃣ Attach appKey and push shops
          const shopsWithAppKey = shops.map((s) => ({
            ...s,
            tiktokOpenId,
            tiktokAuthCountry,
          }));

          allAuthorizedShops.push(...shopsWithAppKey);
        }

        // 5️⃣ Validate and store result
        if (allAuthorizedShops.length === 0) {
          console.warn("No authorized TikTok shops found for any appKey.");
          return;
        }

        setTikTokShopCipher(allAuthorizedShops[0].cipher);
        localStorage.setItem(
          "tiktokOpenId",
          allAuthorizedShops[0].tiktokOpenId
        );
        localStorage.setItem(
          "tiktokAuthCountry",
          allAuthorizedShops[0].tiktokAuthCountry
        );
        localStorage.setItem("tiktokAuthCipher", allAuthorizedShops[0].cipher);
        localStorage.setItem(
          "tiktokShopInfo",
          JSON.stringify(allAuthorizedShops)
        );
        dispatch(setAllTikTokShopList(allAuthorizedShops));
      } catch (error) {
        console.error("Error fetching TikTok shops:", error);
      }
    };

    if (currentUser) {
      fetchTikTokShops();
    }
  }, [currentUser]);

  // Lazadaaaaaaaaaaaaaaaaaaaaaa .............

  useEffect(() => {
    if (!currentUser) return; // ✅ Skip if not logged in

    const fetchActiveLazadaShops = async () => {
      try {
        if (!currentUser) {
          console.warn("⚠️ No current user found.");
          return;
        }

        // 1️⃣ Fetch active Lazada shops from backend
        const shopRes = await fetch(
          `https://grozziieget.zjweiting.com:8033/tht/grozziiePrinter/lazada/shop/${currentUser}/active`
        );
        if (!shopRes.ok) throw new Error("Failed to fetch active Lazada shops");

        const shopData = await shopRes.json();
        const activeShops = shopData?.data || [];
        if (!activeShops.length) {
          console.warn("⚠️ No active Lazada shops found for this user.");
          return;
        }

        // 2️⃣ Fetch dynamic Lazada data (tokens, country, etc.)
        const dynamicRes = await fetch(
          "https://grozziie.zjweiting.com:3091/lazada-open-shop/api/dev/dynamic/all"
        );
        if (!dynamicRes.ok)
          throw new Error("Failed to fetch Lazada dynamic data");

        const dynamicData = await dynamicRes.json();

        // 3️⃣ Match shops with dynamic token data
        const matchedShops = activeShops
          .map((shop) => {
            const appKey = shop.LazadaAPPKey;
            const dynamic = dynamicData?.[appKey];
            if (!dynamic) return null;

            const userInfo = dynamic.country_user_info?.[0] || {};
            const accessToken = dynamic.account || "";
            const region = (dynamic.country || "my").toUpperCase();
            const shopCode = userInfo.short_code || "NA";
            const sellerId = userInfo.seller_id?.toString() || "unknown";

            return {
              cipher: accessToken,
              code: accessToken,
              id: sellerId,
              name: `${region}-(***${shopCode.slice(-2)})`,
              region,
              sellerType: "LOCAL",
            };
          })
          .filter(Boolean);

        if (!matchedShops.length) {
          console.warn(
            "⚠️ No Lazada shops matched between DB and dynamic data."
          );
          return;
        }

        // 4️⃣ Store in localStorage
        localStorage.setItem("lazadaShopInfo", JSON.stringify(matchedShops));
        localStorage.setItem("lazadaAuthCountry", matchedShops[0]?.region);
        localStorage.setItem("lazadaAccountId", matchedShops[0]?.cipher);
        localStorage.setItem(
          "lazadaAccessToken",
          matchedShops[0]?.cipher || ""
        );

        // 5️⃣ Dispatch to Redux
        dispatch(setAllLazadaShopList(matchedShops));

        // 6️⃣ Lazada Payment Info Check / Add Free Trial if missing
        try {
          const paymentRes = await fetch(
            `https://grozziieget.zjweiting.com:8033/tht/printerUserPaymentInfo/${currentUser}`
          );
          const paymentData = await paymentRes.json();

          const paidShopNames =
            paymentData?.result?.["lazada"]?.map((p) => p.shopName) || [];

          for (const shop of matchedShops) {
            const freeTrialDuration = await fetchFreeTrialDuration();

            if (!paidShopNames.includes(shop.id)) {
              const paymentInfo = {
                email: currentUser,
                shopPlatform: "lazada",
                shopName: shop.id,
                paymentTime: new Date().toISOString().split(".")[0] + "Z",
                paymentExpireTime:
                  calculatePaymentExpireTime(freeTrialDuration),
                amount: 0,
                currency: "USD",
              };

              const { data } = await axios.post(
                "https://grozziieget.zjweiting.com:8033/tht/printerUserPaymentInfo/add",
                paymentInfo
              );

              localStorage.setItem("paymentInfo", JSON.stringify(data));
              setFreeTrailPlatform("Lazada");
              setShowSuccessModal(true);
              console.log(`✅ Free trial added for Lazada shop: ${shop.name}`);
            }
          }
        } catch (err) {
          console.error("❌ Lazada payment info check failed:", err);
        }
      } catch (error) {
        console.error("❌ Error fetching Lazada shops:", error);
      }
    };

    fetchActiveLazadaShops();
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (!currentUser) return; // ✅ Skip if no user

    const fetchShopeeShops = async () => {
      try {
        // 1️⃣ Fetch user’s saved shops from local backend
        const localShopRes = await fetch(
          `https://grozziieget.zjweiting.com:8033/tht/grozziiePrinter/shopee/shop/${currentUser}`
        );
        if (!localShopRes.ok)
          throw new Error("Failed to fetch local Shopee shops");
        const localShopData = await localShopRes.json();
        const savedShops = localShopData?.data || [];

        if (savedShops.length === 0) {
          console.warn("⚠️ No saved Shopee shops found for this user.");
        }

        // 2️⃣ Fetch all authorized Shopee shops from main Shopee API
        const partnerRes = await fetch(
          "https://grozziie.zjweiting.com:3091/shopee-open-shop/auth/get_shops_by_partner?pageNo=1&pageSize=100"
        );
        if (!partnerRes.ok)
          throw new Error("Shopee partner API response was not ok");

        const partnerData = await partnerRes.json();
        const apiShops = partnerData?.authed_shop_list || [];

        if (apiShops.length === 0) {
          console.warn("⚠️ No authorized shops returned from Shopee API.");
          return;
        }

        // 3️⃣ Match shops: local ShopeeAPPKey === shop_id from Shopee API
        const matchedShops = apiShops.filter((apiShop) =>
          savedShops.some(
            (local) =>
              local.ShopeeAPPKey?.toString() === apiShop.shop_id?.toString()
          )
        );

        if (matchedShops.length === 0) {
          console.warn(
            "⚠️ No matching Shopee shops found between local DB and Shopee API."
          );
          return;
        }

        // 4️⃣ Prepare the data structure for Redux/localStorage
        const shopeeInItData = matchedShops.map((shop) => ({
          cipher: shop.shop_id,
          code: shop.shop_id,
          id: shop.shop_id,
          name: shop.shop_name || shop.shop_id,
          region: shop.region,
          sellerType: "LOCAL",
        }));

        // ✅ Store shop info locally & in Redux
        localStorage.setItem("shopeeShopInfo", JSON.stringify(shopeeInItData));
        localStorage.setItem(
          "shopeeAuthShopId",
          JSON.stringify(shopeeInItData[0]?.cipher)
        );
        dispatch(setAllShopeeShopList(shopeeInItData));

        console.log("✅ Shopee matched shops initialized:", shopeeInItData);

        // 5️⃣ Payment check + free trial add logic (same as before)
        try {
          const paymentRes = await fetch(
            `https://grozziieget.zjweiting.com:8033/tht/printerUserPaymentInfo/${currentUser}`
          );
          const paymentData = await paymentRes.json();
          const paidShopNames =
            paymentData?.result?.["shopee"]?.map((p) => p.shopName) || [];

          for (const shop of matchedShops) {
            const shopId = shop.shop_id?.toString();
            const freeTrialDuration = await fetchFreeTrialDuration();

            if (!paidShopNames.includes(shopId)) {
              const paymentInfo = {
                email: currentUser,
                shopPlatform: "shopee",
                shopName: shopId,
                paymentTime: new Date().toISOString().split(".")[0] + "Z",
                paymentExpireTime:
                  calculatePaymentExpireTime(freeTrialDuration),
                amount: 0,
                currency: "USD",
              };

              try {
                const { data } = await axios.post(
                  "https://grozziieget.zjweiting.com:8033/tht/printerUserPaymentInfo/add",
                  paymentInfo
                );
                setFreeTrailPlatform("Shopee");
                setShowSuccessModal(true);
                console.log(`✅ Free trial added for Shopee shop ${shopId}`);
                localStorage.setItem("paymentInfo", JSON.stringify(data));
              } catch (err) {
                console.error(
                  `❌ Failed to add payment for shop ${shopId}:`,
                  err
                );
              }
            }
          }
        } catch (err) {
          console.error("❌ Failed to check Shopee payment info:", err);
        }
      } catch (error) {
        console.error("❌ Shopee shop initialization failed:", error);
      }
    };

    fetchShopeeShops();
  }, [currentUser, dispatch]);

  return (
    <div className="bg-white app">
      <Toaster position="top-right" />
      <RouterProvider router={routes} />
      {/* ✅ Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white w-[90%] max-w-md p-8 rounded-2xl shadow-2xl text-center animate-fadeIn">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#004368] mb-2">
              Congratulations! 🎉
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              You’ve successfully activated your{" "}
              <strong>{freeTrailDays} Free Trial</strong>. Enjoy access to all{" "}
              <strong>{freeTrailPlatform} </strong>
              order printing, packaging, and shipping features.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-[#004368] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#006fa3] transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
