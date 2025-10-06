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

function App() {
  const dispatch = useDispatch();
  const [tikTokShopCipher, setTikTokShopCipher] = useState("");
  const [currentUser, setCurrentUser] = useState("");

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

  useEffect(() => {
    const fetchTikTokShops = async () => {
      try {
        // 1️⃣ Call your backend API with dynamic email
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

        // 2️⃣ Loop through all TikTok shops and fetch authorized shops for each appKey
        for (const shop of backendData.data) {
          const appKey = shop.TikTokAPPKey;
          const partnerRes = await fetch(
            `https://grozziie.zjweiting.com:3091/tiktokshop-partner-debug/api/dev/shops/authorizedShops?appKey=${appKey}`
          );
          if (!partnerRes.ok) {
            console.warn(
              `Failed to fetch authorized shops for appKey: ${appKey}`
            );
            continue;
          }
          const partnerData = await partnerRes.json();
          if (partnerData?.data?.shops?.length) {
            // 3️⃣ Attach the appKey from backend to each authorized shop
            const shopsWithAppKey = partnerData.data.shops.map((s) => ({
              ...s,
              appKey, // new field added for this particular shop
            }));

            allAuthorizedShops.push(...shopsWithAppKey);
          }
        }

        if (allAuthorizedShops.length === 0) {
          console.warn("No authorized TikTok shops found for any appKey.");
          return;
        }

        // 4️⃣ Save first cipher (optional)
        setTikTokShopCipher(allAuthorizedShops[0].cipher);
        localStorage.setItem("tiktokAppKey", allAuthorizedShops[0].appKey);
        // 5️⃣ Save all authorized shops with added appKey to localStorage and Redux
        localStorage.setItem(
          "tiktokShopInfo",
          JSON.stringify(allAuthorizedShops)
        );
        dispatch(setAllTikTokShopList(allAuthorizedShops));

        console.log(
          "✅ All TikTok authorized shops with appKey:",
          allAuthorizedShops
        );
      } catch (error) {
        console.error("Error fetching TikTok shops:", error);
      }
    };

    fetchTikTokShops();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return; // ✅ Skip if no user

    const fetchActiveLazadaShops = async () => {
      try {
        const res = await fetch(
          `https://grozziieget.zjweiting.com:8033/tht/grozziiePrinter/lazada/shop/${currentUser}/active`
        );

        if (!res.ok) throw new Error("Network response was not ok");

        const { data } = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
          console.warn("⚠️ No active Lazada shops found for this user.");
          return;
        }

        // ✅ Create lazadaInitData directly from API response
        const lazadaInitData = data.map((shop, index) => {
          const appKey = shop.LazadaAPPKey?.toString() || "";
          const lastTwo = appKey.slice(-2); // ✅ get last 2 digits safely

          return {
            cipher: appKey,
            code: appKey,
            id: appKey,
            name: `${shop.ShopCountry}-(***${lastTwo})`, // ✅ example: MY-1(59)
            region: shop.ShopCountry,
            sellerType: "LOCAL",
          };
        });

        // ✅ Store new data into localStorage
        localStorage.setItem("lazadaShopInfo", JSON.stringify(lazadaInitData));

        // ✅ Dispatch to Redux store
        dispatch(setAllLazadaShopList(lazadaInitData));

        console.log("✅ Lazada shops initialized and stored:", lazadaInitData);
      } catch (error) {
        console.error("❌ Error fetching Lazada shops:", error);
      }
    };

    fetchActiveLazadaShops();
  }, [currentUser, dispatch]);

  useEffect(() => {
    fetch(
      "https://grozziie.zjweiting.com:3091/shopee-open-shop/auth/get_shops_by_partner?pageNo=1&pageSize=1"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const shopeeInItData = [
          {
            cipher: data?.authed_shop_list[0]?.shop_id,
            code: data?.authed_shop_list[0]?.shop_id,
            id: data?.authed_shop_list[0]?.shop_id,
            name: data?.authed_shop_list[0]?.shop_id,
            region: data?.authed_shop_list[0]?.region,
            sellerType: "LOCAL",
          },
        ];

        if (data?.authed_shop_list[0]) {
          localStorage.setItem(
            "shopeeShopInfo",
            JSON.stringify(shopeeInItData)
          );
          dispatch(setAllShopeeShopList(shopeeInItData));
        } else {
          console.warn("No shops found in API response.");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);
  // Fetch order list data
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const urlParams = new URLSearchParams(window.location.search);
  //       const codeParam = urlParams.get("code");
  //       const response = await loadOrderList({
  //         pddAccessToken,
  //         data: orderListParameter,
  //       });

  //       if (response.error) {
  //         console.log("This is response error", response.error);
  //       } else {
  //         if (!codeParam) {
  //           if (
  //             response?.data?.error_response?.error_code === 10019 ||
  //             response?.data?.error_response?.error_code === 10001
  //           ) {
  //             window.location.href =
  //               "https://fuwu.pinduoduo.com/service-market/auth?response_type=code&client_id=93db78c22c8448729db51e435c67e376&redirect_uri=https://grozziie.zjweiting.com:57609&state=1212";
  //           } else {
  //             const orderList =
  //               response?.data?.order_list_get_response?.order_list || [];
  //             const filteredOrderList = orderList.filter(
  //               (item) => item.address !== ""
  //             );
  //             console.log(filteredOrderList, "initial data");
  //             setOrderListDataEncrypt(filteredOrderList.slice(0, 2));
  //             // If you need to dispatch the filtered list, uncomment below
  //             // dispatch(orderListData(filteredOrderList));
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [loadOrderList, pddAccessToken]); // Adding loadOrderList to the dependency array to avoid infinite loops

  // old code
  // const fetchData = async () => {
  //   try {
  //     const response = await loadOrderList({
  //       pddAccessToken,
  //       data: orderListParameter,
  //     });
  //     if ("error" in response) {
  //       console.log("This is response error");
  //     } else {
  //       console.log(response, "check response");
  //       const orderList = response?.data?.order_list_get_response?.order_list;
  //       const filteredOrderList = orderList?.filter((item) => {
  //         return item.address !== "";
  //       });

  //       setOrderListDataEncrypt(filteredOrderList.slice(0, 5));
  //       // setOrderListDataEncrypt(orderList.slice(10, 18));
  //       // dispatch(
  //       //     orderListData(filteredOrderList)
  //       // );
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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

  // Fetch user data with token
  // const fetchUserData = async () => {
  //   try {
  //     const token = localStorage.getItem("GrozziieToken");
  //     if (!token) {
  //       throw new Error("Token not found");
  //     }
  //     const response = await axios.get(
  //       "https://grozziieget.zjweiting.com:3091/GrozziiePrint-LoginRegistration/user/details",
  //       { params: { token } }
  //     );
  //     const userData = response.data;
  //     // Dispatch user data
  //     dispatch(paymentUserChange(userData));
  //     dispatch(accountUserChange(userData?.email));
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //   }
  // };

  // Fetch user data initially and set interval to refresh every 10 minutes
  // useEffect(() => {
  //   fetchUserData(); // Initial fetch

  //   const interval = setInterval(fetchUserData, 10 * 60 * 1000); // Fetch every 10 minutes

  //   return () => clearInterval(interval); // Cleanup on unmount
  // }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="bg-white app">
      <Toaster position="top-right" />
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;
