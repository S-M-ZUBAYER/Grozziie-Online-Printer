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

  useEffect(() => {
    const storedUser = localStorage.getItem("printerUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch(accountUserChange(user?.email));
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    fetch(
      "https://grozziie.zjweiting.com:3091/tiktokshop-partner/api/dev/shops/authorizedShops"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTikTokShopCipher(data.data.shops[0].cipher);
        if (data?.data?.shops) {
          localStorage.setItem(
            "tiktokShopInfo",
            JSON.stringify(data.data.shops)
          );
          dispatch(setAllTikTokShopList(data.data.shops));
        } else {
          console.warn("No shops found in API response.");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  useEffect(() => {
    fetch(
      // "https://grozziie.zjweiting.com:3091/lazada-open-shop/country_user_info"
      "https://grozziie.zjweiting.com:3091/lazada-open-shop-debug/country_user_info"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const lazadaInItData = [
          {
            cipher: data[0]?.seller_id,
            code: data[0]?.short_code,
            id: data[0]?.user_id,
            name: data[0]?.short_code,
            region: data[0]?.country,
            sellerType: "LOCAL",
          },
        ];
        console.log(lazadaInItData);

        if (data[0]?.seller_id) {
          localStorage.setItem(
            "lazadaShopInfo",
            JSON.stringify(lazadaInItData)
          );
          dispatch(setAllLazadaShopList(lazadaInItData));
        } else {
          console.warn("No shops found in API response.");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

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
