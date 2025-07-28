import { RouterProvider, useLocation } from "react-router-dom";
import "./App.css";
import { routes } from "./routes/Routes";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  accountUserChange,
  paymentUserChange,
} from "./features/slice/userSlice";
import { useDispatch } from "react-redux";
import CallTheOrder from "./components/Private/callTheOrder";
import { useLoadOrderListMutation } from "./features/allApis/batchPrintApi";
import { orderListParameter } from "./components/BatchPrint/OrderListParameter";
import { decryptArrayData } from "./Share/Function/OrderListFunctions";
import { orderListData } from "./features/slice/orderListSlice";
import {
  fetchAvailableWaybills,
  fetchLogisticCompanies,
} from "./components/BatchPrint/BatchPrinterFunctions";
import { shopDeliveryCompanyList } from "./features/slice/shopDeliveryCompanySlice";
import { setAllShopList } from "./features/slice/allShopSlice";

function App() {
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [orderListDataEncrypt, setOrderListDataEncrypt] = useState([]);
  const [loadOrderList, { isLoading, isError }] = useLoadOrderListMutation();
  const [pddAccessToken, setPddAccessToken] = useState(
    localStorage.getItem("pddAccessToken")
  );
  const [tikTokShopCipher, setTikTokShopCipher] = useState("");

  const [pddMallId, setPddMallId] = useState(localStorage.getItem("pddMallId"));
  const [mallId, setMallId] = useState(null);
  const [mallError, setMallError] = useState(null);
  useEffect(() => {
    if (!pddAccessToken) {
      setPddAccessToken("7ddfbed58c504537b51cf5c859a58121198a58f5");
    }
  }, []);

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
        console.log(response, "this is tiktok response");

        if (!response.ok) {
          throw new Error("Network response was not ok");
          console.log("Fetching TikTok Shop authorized shops...");
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        console.log("Fetching TikTok Shop authorized shops...");
        setTikTokShopCipher(data.data.shops[0].cipher);
        if (data?.data?.shops) {
          localStorage.setItem(
            "tiktokShopInfo",
            JSON.stringify(data.data.shops)
          );
          dispatch(setAllShopList(data.data.shops));

          console.log("Shops saved to localStorage.");
        } else {
          console.warn("No shops found in API response.");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);
  // Temporary add the feature to get all available express company
  const [deliveryCompanyName, setDeliveryCompanyName] = useState([]);
  const [shopDeliveryCompanyName, setShopDeliveryCompanyName] = useState([]);
  console.log(tikTokShopCipher, "Cipher");

  useEffect(() => {
    if (deliveryCompanyName) {
      fetchAvailableWaybills(deliveryCompanyName)
        .then((waybills) => {
          console.log(waybills);
          setShopDeliveryCompanyName(splitArrays(waybills));
          const ShopDeliveryCompanyNameList = splitArrays(waybills);
          dispatch(shopDeliveryCompanyList(ShopDeliveryCompanyNameList));
        })
        .catch((error) => {
          console.error("Error fetching available waybills:", error);
        });
    }
  }, [deliveryCompanyName]);
  //call the function to get all logistics company list
  function splitArrays(arrays) {
    const individualArrays = [];
    arrays.forEach((array) => {
      if (Array.isArray(array)) {
        array.forEach((eachArray) => {
          individualArrays.push(eachArray);
        });
      }
    });
    return individualArrays;
  }

  const fetchCompanies = async () => {
    try {
      const companies = await fetchLogisticCompanies();
      setDeliveryCompanyName(companies);
      console.log(companies, "companies");
    } catch (error) {
      console.error("Failed to fetch logistic companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies(); // Call the function to fetch companies
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await loadOrderList({ tikTokShopCipher }).unwrap();
        console.log("Raw Response:", response);

        const orders = response?.data?.orders;

        if (Array.isArray(orders) && orders.length > 0) {
          const filteredOrderList = orders.filter((item) => item?.buyerEmail);
          console.log("Filtered Orders:", filteredOrderList);
          dispatch(orderListData(filteredOrderList));
          // Optional: Dispatch
          // dispatch(orderListData(filteredOrderList));
        } else {
          console.warn(
            "No valid orders received or unexpected format",
            response
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [loadOrderList, tikTokShopCipher]);

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

  const fetchMallIdData = async (PddToken) => {
    try {
      const response = await fetch(
        `https://grozziieget.zjweiting.com:3091/GrozziiePrint-WebAPI/mall/info?accessToken=${PddToken}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const mallId = result.mall_info_get_response?.mall_id; // Safely access mall_id
      setPddMallId(mallId);
      localStorage.setItem("pddMallId", mallId);
      console.log(mallId, "mall_id");
    } catch (error) {
      setMallError(error.message);
    }
  };

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
      <CallTheOrder />
      <Toaster position="top-right" />
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;
