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
          const appKey = shop.TikTokAPPKey;
          const tiktokAuthCountry = shop.ShopCountry;

          const partnerRes = await fetch(
            `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/shops/authorizedShops?countryCode=${tiktokAuthCountry}`
          );

          if (!partnerRes.ok) {
            console.warn(
              `Failed to fetch authorized shops for appKey: ${appKey}`
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
          const shops = partnerData?.shops || partnerData?.data?.shops || [];
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
              paymentExpireTime: calculatePaymentExpireTime("01 Month"),
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
            appKey,
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
        localStorage.setItem("tiktokAppKey", allAuthorizedShops[0].appKey);
        localStorage.setItem(
          "tiktokAuthCountry",
          allAuthorizedShops[0].tiktokAuthCountry
        );
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

  // Lazada Previouse.................

  // useEffect(() => {
  //   if (!currentUser) return; // ✅ Skip if no user

  //   const fetchActiveLazadaShops = async () => {
  //     try {
  //       const res = await fetch(
  //         `https://grozziieget.zjweiting.com:8033/tht/grozziiePrinter/lazada/shop/${currentUser}/active`
  //       );

  //       if (!res.ok) throw new Error("Network response was not ok");

  //       const { data } = await res.json();

  //       if (!Array.isArray(data) || data.length === 0) {
  //         console.warn("⚠️ No active Lazada shops found for this user.");
  //         return;
  //       }

  //       // ✅ Create lazadaInitData directly from API response
  //       const lazadaInitData = data.map((shop, index) => {
  //         const appKey = shop.LazadaAPPKey?.toString() || "";
  //         const lastTwo = appKey.slice(-2); // ✅ get last 2 digits safely

  //         return {
  //           cipher: appKey,
  //           code: appKey,
  //           id: appKey,
  //           name: `${shop.ShopCountry}-(***${lastTwo})`, // ✅ example: MY-1(59)
  //           region: shop.ShopCountry,
  //           sellerType: "LOCAL",
  //         };
  //       });

  //       // ✅ Store new data into localStorage
  //       localStorage.setItem("lazadaShopInfo", JSON.stringify(lazadaInitData));

  //       // ✅ Dispatch to Redux store
  //       dispatch(setAllLazadaShopList(lazadaInitData));
  //     } catch (error) {
  //       console.error("❌ Error fetching Lazada shops:", error);
  //     }
  //   };

  //   fetchActiveLazadaShops();
  // }, [currentUser, dispatch]);

  // Lazadaaaaaaaaaaaaaaaaaaaaaa .............

  useEffect(() => {
    if (!currentUser) return; // ✅ Skip if not logged in

    const fetchActiveLazadaShops = async () => {
      try {
        // 1️⃣ Fetch Lazada shop data (new API)
        const res = await fetch(
          "https://grozziie.zjweiting.com:3091/lazada-open-shop-country/api/dev/dynamic/all"
        );
        if (!res.ok) throw new Error("Failed to fetch Lazada dynamic data");

        const allCountryData = await res.json();
        const myData = allCountryData?.my;

        if (!myData) {
          console.warn("⚠️ No MY (Malaysia) Lazada data found.");
          return;
        }

        // 2️⃣ Build lazadaInitData only for MY
        const userInfo = myData.country_user_info?.[0] || {};
        const accessToken = myData.access_token || "";
        const shopCode = userInfo.short_code || "MY";

        const lazadaInitData = [
          {
            cipher: accessToken,
            code: accessToken,
            id: userInfo.seller_id || "unknown",
            name: `MY-(***${shopCode.slice(-2)})`, // Example: MY-(**T7)
            region: "MY",
            sellerType: "LOCAL",
          },
        ];

        // 3️⃣ Store in localStorage
        localStorage.setItem("lazadaShopInfo", JSON.stringify(lazadaInitData));
        localStorage.setItem("lazadaAuthCountry", "my");
        localStorage.setItem("lazadaAccessToken", accessToken);

        // 4️⃣ Dispatch to Redux
        dispatch(setAllLazadaShopList(lazadaInitData));

        // 5️⃣ Lazada Payment Info Check / Add Free Trial
        try {
          const paymentRes = await fetch(
            `https://grozziieget.zjweiting.com:8033/tht/printerUserPaymentInfo/${currentUser}`
          );
          const paymentData = await paymentRes.json();
          const paidShopNames =
            paymentData?.result?.["lazada"]?.map((p) => p.shopName) || [];

          const shopId = userInfo.seller_id?.toString() || "unknown";

          // Create default Lazada free trial if not exists
          if (!paidShopNames.includes(shopId)) {
            const paymentInfo = {
              email: currentUser,
              shopPlatform: "lazada",
              shopName: shopId,
              paymentTime: new Date().toISOString().split(".")[0] + "Z",
              paymentExpireTime: calculatePaymentExpireTime("01 Month"),
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
            console.log("✅ Lazada free trial added successfully");
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

  // Shopeeee.........Previous......................

  // useEffect(() => {
  //   if (!currentUser) return; // ✅ Skip if no user
  //   fetch(
  //     "https://grozziie.zjweiting.com:3091/shopee-open-shop-country/auth/get_shops_by_partner?pageNo=1&pageSize=1"
  //   )
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       const shopeeInItData = [
  //         {
  //           cipher: data?.authed_shop_list[0]?.shop_id,
  //           code: data?.authed_shop_list[0]?.shop_id,
  //           id: data?.authed_shop_list[0]?.shop_id,
  //           name: data?.authed_shop_list[0]?.shop_id,
  //           region: data?.authed_shop_list[0]?.region,
  //           sellerType: "LOCAL",
  //         },
  //       ];

  //       if (data?.authed_shop_list[0]) {
  //         localStorage.setItem(
  //           "shopeeShopInfo",
  //           JSON.stringify(shopeeInItData)
  //         );
  //         dispatch(setAllShopeeShopList(shopeeInItData));
  //       } else {
  //         console.warn("No shops found in API response.");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("There was a problem with the fetch operation:", error);
  //     });
  // }, []);

  useEffect(() => {
    if (!currentUser) return; // ✅ Skip if no user

    fetch(
      "https://grozziie.zjweiting.com:3091/shopee-open-shop-country/auth/get_shops_by_partner?pageNo=1&pageSize=1"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(async (data) => {
        const shop = data?.authed_shop_list?.[0];

        if (!shop) {
          console.warn("⚠️ No shops found in API response.");
          return;
        }

        // ✅ Your existing shop structure
        const shopeeInItData = [
          {
            cipher: shop.shop_id,
            code: shop.shop_id,
            id: shop.shop_id,
            name: shop.shop_id,
            region: shop.region,
            sellerType: "LOCAL",
          },
        ];

        // ✅ Store shop info
        localStorage.setItem("shopeeShopInfo", JSON.stringify(shopeeInItData));
        dispatch(setAllShopeeShopList(shopeeInItData));

        // ✅ Payment check + add free trial if missing
        try {
          const paymentRes = await fetch(
            `https://grozziieget.zjweiting.com:8033/tht/printerUserPaymentInfo/${currentUser}`
          );
          const paymentData = await paymentRes.json();
          const paidShopNames =
            paymentData?.result?.["shopee"]?.map((p) => p.shopName) || [];

          const shopId = shop.shop_id?.toString();

          if (!paidShopNames.includes(shopId)) {
            const paymentInfo = {
              email: currentUser,
              shopPlatform: "shopee",
              shopName: shopId,
              paymentTime: new Date().toISOString().split(".")[0] + "Z",
              paymentExpireTime: calculatePaymentExpireTime("01 Month"),
              amount: 0,
              currency: "USD",
            };

            try {
              const { data } = await axios.post(
                "https://grozziieget.zjweiting.com:8033/tht/printerUserPaymentInfo/add",
                paymentInfo
              );

              localStorage.setItem("paymentInfo", JSON.stringify(data));
              console.log("✅ Shopee free trial added successfully");
            } catch (err) {
              console.error("❌ Failed to add Shopee payment info:", err);
            }
          }
        } catch (err) {
          console.error("❌ Failed to check Shopee payment info:", err);
        }
      })
      .catch((error) => {
        console.error("❌ Fetch operation failed:", error);
      });
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
              <strong>1-Month Free Trial</strong>. Enjoy access to all{" "}
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
