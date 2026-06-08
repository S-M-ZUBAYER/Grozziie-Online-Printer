import React, { useEffect, useMemo, useState } from "react";
import { CiCalendarDate, CiDeliveryTruck, CiTimer } from "react-icons/ci";
import { HiOutlineReceiptRefund } from "react-icons/hi2";
import { FiPrinter } from "react-icons/fi";
import { format } from "date-fns";
import { DateTime } from "luxon";
import {
  isSameDay,
  parseISO,
  startOfDay,
  endOfDay,
  fromUnixTime,
} from "date-fns";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import print from "../../assets/printer01.png";
import shipped from "../../assets/shipped01.png";
import needPrint from "../../assets/needtoprint01.png";
import HomeSideNavbar from "./HomeSideNavbar";
import DashboardCard from "./HomeComponents/DashboardCard";
import ActivityRow from "./HomeComponents/ActivityRow";
import ShopSelector from "./HomeComponents/ShopSelector";
import { useLoadOrderListMutation } from "../../features/allApis/batchPrintApi";
import { useLazyGetLazadaOrdersQuery } from "../../features/allApis/lazadaApi";
import {
  useLazyGetShopeeOrderDetailsQuery,
  useLazyGetShopeeOrdersQuery,
} from "../../features/allApis/shopeeApi";
import { useNavigate } from "react-router-dom";
import ShopeeAuthModal from "./ShopeeAuthModal";
import { useSelector } from "react-redux";
import calculatePaymentExpireTime from "../../lib/calculatePaymentExpireTime";
import {
  getRegionTimestampsLazada,
  getRegionTimestampsLazadaPreCorrect,
  getRegionTimestampsShopeTiktok,
  getRegionTimestampsShopeTiktokPreCorrect,
} from "../../Share/Function/FunctionalComponent";

const Home = () => {
  const { t } = useTranslation();
  const [cipher, setCipher] = useState("");
  const tiktokAppKey = localStorage.getItem("tiktokAppKey");
  const tiktokAuthCountry = localStorage.getItem("tiktokAuthCountry");
  const shopeeAuthCountry = localStorage.getItem("shopeeAuthCountry");
  const storedShopPlatform = localStorage.getItem("SelectedPlatform");
  const storedShopStore = localStorage.getItem("SelectedStore");
  const [selectedPlatform, setSelectedPlatform] = useState(
    storedShopPlatform || "tiktok",
  );
  const [selectedStore, setSelectedStore] = useState(storedShopStore || null);
  const [openShop, setOpenShop] = useState(null);
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const start = startOfDay(now);
  const end = endOfDay(now);
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("printerUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const isWmsTikTokCallback = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return (
      Boolean(urlParams.get("openId")) &&
      Boolean(urlParams.get("tiktok-state")?.startsWith("WMS")) &&
      Boolean(user)
    );
  };

  // TikTok States
  const [tikTokPrintedIds, setTikTokPrintedIds] = useState([]);
  const [tikTokShippedToday, setTikTokShippedToday] = useState([]);
  const [tikTokPrintedToday, setTikTokPrintedToday] = useState([]);
  const [awaitingShipment, setAwaitingShipment] = useState([]);
  const [awaitingCollection, setAwaitingCollection] = useState([]);
  const [awaitingCollectionPrinted, setAwaitingCollectionPrinted] = useState(
    [],
  );
  const [awaitingCollectionUnprinted, setAwaitingCollectionUnprinted] =
    useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);

  // Lazada States
  const [lazadaPrintedIds, setLazadaPrintedIds] = useState([]);
  const [lazadaShippedToday, setLazadaShippedToday] = useState([]);
  const [lazadaOnShipping, setLazadaOnShipping] = useState([]);
  const [lazadaPrintedToday, setLazadaPrintedToday] = useState([]);
  const [lazadaNewOrders, setLazadaNewOrders] = useState([]);
  const [lazadaPacked, setLazadaPacked] = useState([]);
  const [lazadaPackedPrinted, setLazadaPackedPrinted] = useState([]);
  const [lazadaPackedUnprinted, setLazadaPackedUnprinted] = useState([]);
  const [lazadaDeliveredOrders, setLazadaDeliveredOrders] = useState([]);
  const [lazadacancelledOrders, setLazadacancelledOrders] = useState([]);

  // 🔹 Shopee States
  const [shopeePrintedIds, setShopeePrintedIds] = useState([]);
  const [shopeeReadyToShip, setShopeeReadyToShip] = useState([]);
  const [shopeeProcessed, setShopeeProcessed] = useState([]);
  const [shopeeProcessedPrinted, setShopeeProcessedPrinted] = useState([]);
  const [shopeeTodayPrinted, setShopeeTodayPrinted] = useState([]);
  const [shopeeProcessedUnprinted, setShopeeProcessedUnprinted] = useState([]);
  const [shopeeShippedTodayOrders, setShopeeShippedTodayOrders] = useState([]);
  const [shopeeShippedOrders, setShopeeShippedOrders] = useState([]);
  const [shopeeCompletedOrders, setShopeeCompletedOrders] = useState([]);
  const [shopeeCancelledOrders, setShopeeCancelledOrders] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccessTokenModal, setShowAccessTokenModal] = useState(false);
  const [expiredShopInfo, setExpiredShopInfo] = useState(null); // holds shop info

  // // ============================================
  // // 1. ADD THESE STATE VARIABLES (after line with tiktokHomeLoading)
  // // ============================================
  const [tiktokHomeLoading, setTikTokHomeLoading] = useState(false);
  const [lazadaHomeLoading, setLazadaHomeLoading] = useState(false);
  const [shopeeHomeLoading, setShopeeHomeLoading] = useState(false);
  const [wmsStoreLoading, setWmsStoreLoading] = useState(isWmsTikTokCallback);

  // ✅ Parse the user from localStorage properly
  //TikTok Orders Call
  const [loadOrderList] = useLoadOrderListMutation();
  const [getLazadaOrders, { isLoading, isError }] =
    useLazyGetLazadaOrdersQuery();

  // Shoppe Orders call
  const [getShopeeOrderDetails] = useLazyGetShopeeOrderDetailsQuery();
  const [getShopeeOrders] = useLazyGetShopeeOrdersQuery();

  console.log(shopeeReadyToShip,"loadOrderLIst,,,,,,,,,,,,,,");
  

  //Pie Chart intial part \
  const COLORS = ["#34D399", "#FBBF24", "#F87171", "#60A5FA"];
  const chartData = [
    {
      name: t("Printed"),
      value:
        selectedPlatform === "tiktok"
          ? awaitingCollectionPrinted?.length || 0
          : selectedPlatform === "lazada"
            ? lazadaPackedPrinted?.length || 0
            : selectedPlatform === "shopee"
              ? shopeeProcessedPrinted?.length || 0
              : 0,
    },
    {
      name: t("New Orders"),
      value:
        selectedPlatform === "tiktok"
          ? awaitingShipment?.length || 0
          : selectedPlatform === "lazada"
            ? lazadaNewOrders?.length || 0
            : selectedPlatform === "shopee"
              ? shopeeReadyToShip?.length || 0
              : 0,
    },
    {
      name: t("Cancelled"),
      value:
        selectedPlatform === "tiktok"
          ? cancelledOrders?.length || 0
          : selectedPlatform === "lazada"
            ? lazadacancelledOrders?.length || 0
            : selectedPlatform === "shopee"
              ? shopeeCancelledOrders?.length || 0
              : 0,
    },
    {
      name: t("Processing for Delivery"),
      value:
        selectedPlatform === "tiktok"
          ? awaitingCollectionUnprinted?.length || 0
          : selectedPlatform === "lazada"
            ? lazadaPackedUnprinted?.length || 0
            : selectedPlatform === "shopee"
              ? shopeeProcessedUnprinted?.length || 0
              : 0,
    },
  ];
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (total === 0) {
      return (
        <div className="bg-white shadow-lg rounded-md px-3 py-2 text-sm text-gray-700">
          {t("No Data")}
        </div>
      );
    }
    if (active && payload?.length) {
      const { name, value } = payload[0];
      return (
        <div className="bg-white shadow-lg rounded-md px-3 py-2 text-sm text-gray-700">
          <strong>{name}</strong>: {value}
        </div>
      );
    }
    return null;
  };

  // ====================================================
  const shopeeShopInfoRaw = localStorage.getItem("shopeeShopInfo");
  const shopeeShopInfo = shopeeShopInfoRaw ? JSON.parse(shopeeShopInfoRaw) : [];
  const shopeeCountryCode = shopeeShopInfo?.[0]?.region || "MY";
  const lazadaShopInfoRaw = localStorage.getItem("shopeeShopInfo");
  const lazadaShopInfo = lazadaShopInfoRaw ? JSON.parse(lazadaShopInfoRaw) : [];
  const lazadaCountryCode = lazadaShopInfo?.[0]?.region || "MY";
  const titkokShopInfoRaw = localStorage.getItem("tiktokShopInfo");
  const titkokShopInfo = titkokShopInfoRaw ? JSON.parse(titkokShopInfoRaw) : [];
  const tiktokCountryCode = titkokShopInfo?.[0]?.region || "MY";
  // =====================================================

  // Cipher Manage for Tiktok
  useEffect(() => {
    if (!tiktokAuthCountry) return; // wait until key is ready

    const storedCipher = localStorage.getItem("tiktokShopInfo");
    if (storedCipher) {
      try {
        setCipher(JSON.parse(storedCipher));
      } catch (err) {
        console.error("Failed to parse tiktokShopInfo:", err);
      }
    } else {
      setCipher([]);
    }
  }, [tiktokAuthCountry, selectedPlatform]);

  //Lazada Shope Confirmation

  useEffect(() => {
    const handleLazadaAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const stateEmail = urlParams.get("lgd-state"); // e.g., 135059
        const accountId = urlParams.get("account"); // e.g., account

        if (!stateEmail || !accountId) return;

        // 1️⃣ Store in localStorage
        localStorage.setItem("lazadaAppKey", accountId);
        localStorage.setItem("lazadaAccountId", accountId);
        localStorage.setItem("lazadaAppKeyShopInfo", accountId);

        // 2️⃣ Send to backend to add / activate Lazada shop
        const saveResponse = await fetch(
          "https://grozziieget.zjweiting.com:8033/tht/grozziiePrinter/lazada/shop/add",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              LazadaUserEmail: stateEmail || user?.email,
              ShopCountry: "MY",
              LazadaAPPKey: accountId,
              active: true,
            }),
          },
        );

        const saveResult = await saveResponse.json();
        if (saveResult.code !== 201) {
          alert(
            "Failed to save Lazada shop. Please try again or contact support.",
          );
          return;
        }

        // 3️⃣ Remove query params → redirect to homepage
        navigate("/onlineprint/", { replace: true });
      } catch (error) {
        console.error("Error saving Lazada shop:", error);
        alert("An error occurred while saving Lazada shop. Please try again.");
      }
    };

    handleLazadaAuth();
  }, [navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tiktokEmail = urlParams.get("tiktok-state"); // e.g. 6grr1iku02uoh
    const tiktokOpenId = urlParams.get("openId"); // e.g. 6grr1iku02uoh

    if (tiktokOpenId && user) {
      if (tiktokEmail?.startsWith("WMS")) {
        const handleWmsTikTokStoreAdd = async () => {
          setWmsStoreLoading(true);

          try {
            const wmsPayload = tiktokEmail.slice(3);
            const separatorIndex = wmsPayload.indexOf("/");

            if (separatorIndex === -1) {
              throw new Error("Invalid WMS state format.");
            }

            const companyId = Number(wmsPayload.slice(0, separatorIndex));
            const email = wmsPayload.slice(separatorIndex + 1);

            if (!companyId || !email) {
              throw new Error("Invalid WMS company id or email.");
            }

            localStorage.setItem("tiktokOpenId", tiktokOpenId);
            localStorage.setItem("tiktokAuthCountry", "MY");

            const authorizedResponse = await fetch(
              `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/shops/authorizedShops?openId=${tiktokOpenId}`,
            );

            if (!authorizedResponse.ok) {
              throw new Error(
                `TikTok authorized shops failed. Status: ${authorizedResponse.status}`,
              );
            }

            const authorizedData = await authorizedResponse.json();
            const shops = authorizedData?.data?.shops || [];

            if (!shops.length) {
              throw new Error("No authorized TikTok shops found.");
            }

            const storeSaveResults = await Promise.allSettled(
              shops.map((shop) =>
                fetch(
                  "https://grozziieget.zjweiting.com:8035/api/v1/platform-stores/public",
                  {
                    method: "POST",
                    headers: {
                      accept: "application/json",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      companyId,
                      platform: "tiktok",
                      storeName: shop.name,
                      externalStoreId: String(shop.id),
                      externalStoreName: shop.name,
                      storeShopId: String(shop.id),
                      storeOpenId: tiktokOpenId,
                      storeCipher: shop.cipher,
                      region: shop.region,
                      webhookSecret: "",
                    }),
                  },
                ).then(async (res) => {
                  if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(
                      `WMS store save failed. Status: ${res.status}. ${errorText}`,
                    );
                  }
                  return res.json();
                }),
              ),
            );

            const failedStoreSaves = storeSaveResults.filter(
              (result) => result.status === "rejected",
            );

            if (failedStoreSaves.length) {
              console.error("Some WMS store saves failed:", failedStoreSaves);
            }

          } catch (err) {
            console.error("TikTok WMS store connection failed:", err);
          } finally {
            window.location.href = "https://printernoble.com/warehouse_management";
          }
        };

        handleWmsTikTokStoreAdd();
        return;
      }

      // 1️⃣ Save TikTok APP key (state) locally
      localStorage.setItem("tiktokOpenId", tiktokOpenId);
      localStorage.setItem("tiktokAuthCountry", "MY");
      // 2️⃣ Prepare data
      const ShopCountry = localStorage.getItem("tiktokAuthCountry") || "MY"; // default if missing
      const payload = {
        TikTokUserEmail: tiktokEmail || user.email,
        ShopCountry,
        TikTokAPPKey: tiktokOpenId,
        active: true,
      };

      // 3️⃣ Send to backend
      fetch(
        "https://grozziieget.zjweiting.com:8033/tht/grozziiePrinter/tiktok/shop/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      )
        .then(async (res) => {
          // Handle cases where backend sends no JSON
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

          const text = await res.text(); // Read as text first
          return text ? JSON.parse(text) : {}; // Parse only if not empty
        })
        .then((data) => {
          window.location.reload();
        })
        .catch((err) => {
          console.error(
            "❌ There was a problem with the fetch operation:",
            err,
          );
        });

      // 4️⃣ Clean URL → redirect home
      navigate("/onlineprint/", { replace: true });
    }
  }, [navigate, user]);

  // Get current Selected Platform
  useEffect(() => {
    localStorage.setItem("SelectedPlatform", selectedPlatform);
  }, [selectedPlatform]);

  // ============================================
  // BETTER SOLUTION: Fix TikTok Loading Logic
  // ============================================

  // TikTok Fetch Printed IDs
  useEffect(() => {
    const fetchPrintedIds = async () => {
      if (selectedPlatform?.toLowerCase().trim() !== "tiktok") return;

      setTikTokHomeLoading(true); // ✅ Enable this
      try {
        const res = await fetch(
          `https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/printedIds/by-email/${user?.email}`,
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          setTikTokPrintedIds(data);
          const todayPrinted = data.filter((item) =>
            isSameDay(parseISO(item.createdAt), now),
          );
        }
      } catch (err) {
        console.error("❌ Failed to fetch printed IDs:", err);
      } finally {
        // setTikTokHomeLoading(false); // ✅ Enable this
      }
    };

    if (cipher.length > 0) {
      fetchPrintedIds();
    }
  }, [cipher, selectedStore]);

  // TikTok Fetch Orders according to the Status
  useEffect(() => {
    const fetchStatusOrders = async () => {
      if (selectedPlatform?.toLowerCase().trim() !== "tiktok") return;

      setAwaitingCollectionUnprinted([]);
      setCancelledOrders([]);
      setAwaitingShipment([]);
      setAwaitingCollectionPrinted([]);
      setAwaitingCollectionUnprinted([]);
      setTikTokShippedToday([]);
      setTikTokPrintedToday([]);

      // setTikTokHomeLoading(true);
      const statuses = [
        "AWAITING_SHIPMENT",
        "AWAITING_COLLECTION",
        "IN_TRANSIT",
        "DELIVERED",
        "CANCELLED",
      ];

      const tiktokDateRange =
        getRegionTimestampsShopeTiktokPreCorrect(tiktokCountryCode);
      const nowUnix = tiktokDateRange?.currentTime;
      const sevenDaysAgoUnix = tiktokDateRange?.sevenDaysAgo;

      const printedSet = new Set(
        tikTokPrintedIds.map((item) => item.tikTokPrintedId?.toString()),
      );

      try {
        // ✅ MOVE try-finally OUTSIDE the loop
        for (const status of statuses) {
          try {
            const response = await loadOrderList({
              cipher: cipher[0]?.cipher,
              createTimeGe: sevenDaysAgoUnix,
              createTimeLt: nowUnix,
              updateTimeGe: sevenDaysAgoUnix,
              updateTimeLt: nowUnix,
              orderStatus: status,
              pageSize: 100,
              sortOrder: "DESC",
            }).unwrap();

            const orderList = response?.data?.orders || [];
            const printedOrders = orderList?.filter((item) =>
              printedSet.has(item.id?.toString()),
            );
            const unprintedOrders = orderList.filter(
              (item) => !printedSet.has(item.id?.toString()),
            );

            if (status === "AWAITING_SHIPMENT") {
              setAwaitingShipment(orderList);
            } else if (status === "AWAITING_COLLECTION") {
              setAwaitingCollection(orderList);
              setAwaitingCollectionPrinted(printedOrders);
              const todayPrintedObjects = () => {
                const today = new Date().toISOString().split("T")[0];
                return tikTokPrintedIds.filter((item) =>
                  item.createdAt?.startsWith(today),
                );
              };

              const todayPrintedData = todayPrintedObjects();
              const todayPrintedIdSet = new Set(
                todayPrintedData.map((item) => item.tikTokPrintedId),
              );
              const todayTiktokPrinted = printedOrders.filter((order) =>
                todayPrintedIdSet.has(order?.id),
              );
              setTikTokPrintedToday(todayTiktokPrinted);
              setAwaitingCollectionUnprinted(unprintedOrders);
            } else if (status === "DELIVERED") {
              setDeliveredOrders(orderList);
            } else if (status === "IN_TRANSIT") {
              const todayShippedOrders = orderList.filter((order) => {
                const updateDate = fromUnixTime(order.updateTime);
                return updateDate >= start && updateDate <= end;
              });
              setTikTokShippedToday(todayShippedOrders);
            } else if (status === "CANCELLED") {
              setCancelledOrders(orderList);
            }
          } catch (error) {
            console.error(
              `❌ Failed to load orders for status: ${status}`,
              error,
            );
            // ✅ REMOVED finally block from here - continue to next status
          }
        }
      } finally {
        // ✅ Set loading false only AFTER all statuses complete
        setTikTokHomeLoading(false);
      }
    };

    fetchStatusOrders();
  }, [cipher, tikTokPrintedIds, selectedStore]);

  // ============================================
  // APPLY SAME PATTERN TO LAZADA
  // ============================================

  // Lazada Fetch Printed IDs
  useEffect(() => {
    const fetchPrintedIds = async () => {
      if (selectedPlatform?.toLowerCase().trim() !== "lazada") return;

      setLazadaHomeLoading(true);
      try {
        const res = await fetch(
          `https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/lazada/printedIds/by-email/${user?.email}`,
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          setLazadaPrintedIds(data);
          const todayPrinted = data.filter((item) =>
            isSameDay(parseISO(item.createdAt), now),
          );
        }
      } catch (err) {
        console.error("❌ Failed to fetch printed IDs:", err);
      } finally {
        // setLazadaHomeLoading(false);
      }
    };

    if (cipher.length > 0) {
      fetchPrintedIds();
    }
  }, [selectedStore]);

  // Lazada Fetch Orders according to the Status
  useEffect(() => {
    if (selectedPlatform?.toLowerCase().trim() !== "lazada") return;
    setLazadaPacked([]);
    setLazadacancelledOrders([]);
    setLazadaNewOrders([]);
    setLazadaPackedPrinted([]);
    setLazadaPackedUnprinted([]);
    setLazadaShippedToday([]);
    setLazadaPrintedToday([]);

    const fetchLazadaStatusOrders = async () => {
      // setLazadaHomeLoading(true);
      const statuses = [
        "pending",
        "Packed",
        "ready_to_ship",
        "shipped",
        "delivered",
        "Canceled",
      ];

      const lazadaDateRange =
        getRegionTimestampsLazadaPreCorrect(lazadaCountryCode);
      const now = lazadaDateRange.currentTime;
      const tenDaysAgo = lazadaDateRange.sevenDaysAgo;

      const printedSet = new Set(
        lazadaPrintedIds.map((item) => String(item.lazadaPrintedId)),
      );

      try {
        // ✅ try-finally OUTSIDE the loop
        for (const status of statuses) {
          try {
            const response = await getLazadaOrders({
              sortBy: "updated_at",
              createdAfter: tenDaysAgo,
              createdBefore: now,
              updateAfter: tenDaysAgo,
              updateBefore: now,
              status,
              sortDirection: "DESC",
              offset: 0,
              limit: 100,
            }).unwrap();

            const parsedBody = JSON.parse(response?.body || "{}");
            const orderList = parsedBody?.data?.orders || [];
            const printedOrders = orderList.filter((item) =>
              printedSet.has(String(item.order_id)),
            );

            if (status === "pending") {
              setLazadaNewOrders(orderList);
            } else if (status === "Packed") {
              setLazadaPacked(orderList);
              setLazadaPackedPrinted(printedOrders);
              const unprintedOrders = orderList.filter(
                (item) => !printedSet.has(String(item.order_id)),
              );

              setLazadaPackedUnprinted(unprintedOrders);
            } else if (status === "ready_to_ship") {
              const todayLazadaPrintedObjects = () => {
                const today = new Date().toISOString().split("T")[0];
                return lazadaPrintedIds.filter((item) =>
                  item.createdAt?.startsWith(today),
                );
              };
              const todayLazadaPrintedData = todayLazadaPrintedObjects();
              const todayLazadaPrintedIdSet = new Set(
                todayLazadaPrintedData.map((item) => item.lazadaPrintedId),
              );
              const todayLazadaPrinted = printedOrders.filter((order) =>
                todayLazadaPrintedIdSet.has(String(order?.order_number)),
              );

              setLazadaPrintedToday(todayLazadaPrinted);
              setLazadaPackedPrinted(printedOrders);
            } else if (status === "shipped") {
              const today = new Date();
              const startOfDay = new Date(today.setHours(0, 0, 0, 0));
              const endOfDay = new Date(today.setHours(23, 59, 59, 999));
              const todayShipped = orderList.filter((order) => {
                const updatedAt = new Date(order.updated_at);
                return updatedAt >= startOfDay && updatedAt <= endOfDay;
              });
              setLazadaShippedToday(todayShipped);
              setLazadaOnShipping(orderList);
            } else if (status === "delivered") {
              setLazadaDeliveredOrders(orderList);
            } else if (status === "Canceled") {
              setLazadacancelledOrders(orderList);
            }
          } catch (error) {
            console.error(
              `❌ Failed to load Lazada orders for status: ${status}`,
              error,
            );
          }
        }
      } finally {
        // ✅ Set loading false only AFTER all statuses complete
        setLazadaHomeLoading(false);
      }
    };

    fetchLazadaStatusOrders();
  }, [lazadaPrintedIds, selectedStore]);

  // ============================================
  // APPLY SAME PATTERN TO SHOPEE
  // ============================================

  // Shopee Fetch Printed IDs
  useEffect(() => {
    const fetchShopeePrintedIds = async () => {
      if (selectedPlatform?.toLowerCase().trim() !== "shopee") return;

      setShopeeHomeLoading(true);
      try {
        const res = await fetch(
          `https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/shopee/printedIds/by-email/${user.email}`,
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setShopeePrintedIds(data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch Shopee printed IDs:", err);
      } finally {
        // setShopeeHomeLoading(false);
      }
    };

    fetchShopeePrintedIds();
  }, [selectedStore]);

  // Shopee Fetch Orders according to the Status
  useEffect(() => {
    if (selectedPlatform?.toLowerCase().trim() !== "shopee") return;
    setShopeeProcessedUnprinted([]);
    setShopeeCancelledOrders([]);
    setShopeeReadyToShip([]);
    setShopeeProcessedPrinted([]);
    setShopeeShippedTodayOrders([]);
    setShopeeTodayPrinted([]);
    const fetchShopeeStatusOrders = async () => {
      // setShopeeHomeLoading(true);
      const statuses = [
        "READY_TO_SHIP",
        "PROCESSED",
        "SHIPPED",
        "COMPLETED",
        "CANCELLED",
      ];

      const shopeeDateRange =
        getRegionTimestampsShopeTiktokPreCorrect(shopeeCountryCode);
      const now = shopeeDateRange?.currentTime;
      const sevenDaysAgo = shopeeDateRange?.sevenDaysAgo;

      const printedSet = new Set(
        shopeePrintedIds.map((item) => String(item.shopeePrintedId)),
      );

      const todayPrintedObjects = () => {
        const today = new Date().toISOString().split("T")[0];
        return shopeePrintedIds.filter((item) =>
          item.createdAt?.startsWith(today),
        );
      };

      const todayPrintedData = todayPrintedObjects();
      const todayPrintedIdSet = new Set(
        todayPrintedData.map((item) => item.shopeePrintedId),
      );

      try {
        // ✅ try-finally OUTSIDE the loop
        for (const status of statuses) {
          try {
            const orderListResponse = await getShopeeOrders({
              timeFrom: sevenDaysAgo,
              timeTo: now,
              orderStatus: status,
            }).unwrap();

            if (
              orderListResponse?.error === "invalid_acceess_token" &&
              selectedPlatform === "shopee"
            ) {
              setExpiredShopInfo({
                platform: "Shopee",
                shopId: localStorage.getItem("shopeeAuthShopId"),
              });

              setTimeout(() => {
                const currentPlatform =
                  localStorage.getItem("SelectedPlatform");
                if (currentPlatform === "shopee") {
                  setShowAccessTokenModal(true);
                  console.log(
                    "🟡 Showing Shopee authorization expired modal...",
                  );
                } else {
                  console.log("⚪ Skipped modal — platform changed.");
                }
              }, 1000);

              return;
            }

            const orderList = Array.isArray(orderListResponse)
              ? orderListResponse
              : [];

            if (!orderList.length) continue;

            const orderSnList = orderList.map((o) => o.order_sn);

            const detailsResponse = await getShopeeOrderDetails({
              orderSnList,
              request_order_status_pending: true,
              response_optional_fields:
                "total_amount,recipient_address,item_list",
            }).unwrap();

            const detailedOrders = Array.isArray(detailsResponse)
              ? detailsResponse
              : [];

            const mergedOrders = orderList.map((order) => {
              const details = detailedOrders.find(
                (d) => d.order_sn === order.order_sn,
              );
              return { ...order, ...details };
            });

            const printedOrders = mergedOrders.filter((item) =>
              printedSet.has(String(item.order_sn)),
            );
            const unprintedOrders = mergedOrders.filter(
              (item) => !printedSet.has(String(item.order_sn)),
            );

            if (status === "READY_TO_SHIP") {
              setShopeeReadyToShip(mergedOrders);
            } else if (status === "PROCESSED") {
              setShopeeProcessed(mergedOrders);
              setShopeeProcessedPrinted(printedOrders);
              setShopeeProcessedUnprinted(unprintedOrders);

              const todayPrinted = printedOrders.filter((order) =>
                todayPrintedIdSet.has(order.order_sn),
              );

              setShopeeTodayPrinted(todayPrinted);
            } else if (status === "SHIPPED") {
              const shippedOrders = mergedOrders.filter(
                (order) => order.order_status === "SHIPPED",
              );

              setShopeeShippedOrders(shippedOrders);

              const shippedToday = shippedOrders.filter((order) => {
                const updateTime = new Date(
                  (order.update_time ||
                    order.ship_by_date ||
                    order.created_time ||
                    Date.now() / 1000) * 1000,
                );

                const today = new Date();
                return (
                  updateTime.getFullYear() === today.getFullYear() &&
                  updateTime.getMonth() === today.getMonth() &&
                  updateTime.getDate() === today.getDate()
                );
              });

              setShopeeShippedTodayOrders(shippedToday);
            } else if (status === "COMPLETED") {
              setShopeeCompletedOrders(mergedOrders);
            } else if (status === "CANCELLED") {
              setShopeeCancelledOrders(mergedOrders);
            }
          } catch (error) {
            console.error(
              `❌ Failed to load Shopee orders for ${status}`,
              error,
            );
          }
        }
      } finally {
        // ✅ Set loading false only AFTER all statuses complete
        setShopeeHomeLoading(false);
      }
    };

    fetchShopeeStatusOrders();
  }, [shopeePrintedIds, selectedStore]);

  // Here complete the Onclick Card dynamic routing
  const platformPaths = {
    tiktok: "TikTokOrderManagemnt",
    lazada: "LazadaOrderManagement",
    shopee: "ShopeeOrderManagement",
  };

  const handleCardClick = (type) => {
    const platformPath = platformPaths[selectedPlatform];
    if (platformPath) {
      navigate(`/onlineprint/${type}/${platformPath}`);
    }
  };

  // Reauthorize for expire excess token
  const handleReauthorize = () => {
    const currentPlatform = localStorage.getItem("SelectedPlatform");
    if (currentPlatform === "shopee") {
      window.location.href = `https://grozziie.zjweiting.com:3091/shopee-open-shop/auth/url-generate/by-state?state=${user?.email}`;
      console.log("🔁 Redirecting to Shopee reauthorization page...");
    }
  };

  return (
    <div className="bg-[#0043680D] grid grid-cols-6">
      <div className="col-span-1">
        <HomeSideNavbar />
      </div>

      <div className="pt-11 pl-[62px] mb-[17px] col-span-5">
        {/* Multiple Shope Platform managing */}
        <ShopSelector
          openShop={openShop}
          setOpenShop={setOpenShop}
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
        />

        {/* Today Data Showing Card */}
        <div className="flex items-center justify-between">
          <h3 className="text-[#004368] text-[25px] font-[500] capitalize">
            {t("Dashboard")}
          </h3>
        </div>
        <div className="mb-9 grid grid-cols-3 gap-6">
          <button onClick={() => handleCardClick("printedToday")}>
            <DashboardCard
              title={t("Printed Today")}
              count={
                selectedPlatform === "tiktok"
                  ? tikTokPrintedToday?.length?.toString().padStart(2, "0") ||
                    "00"
                  : selectedPlatform === "lazada"
                    ? lazadaPrintedToday?.length?.toString().padStart(2, "0") ||
                      "00"
                    : selectedPlatform === "shopee"
                      ? shopeeTodayPrinted?.length
                          ?.toString()
                          .padStart(2, "0") || "00"
                      : "00"
              }
              image={print}
            />
          </button>
          <button onClick={() => handleCardClick("shipped")}>
            <DashboardCard
              title={t("Shipped Today")}
              count={
                selectedPlatform === "tiktok"
                  ? tikTokShippedToday?.length?.toString().padStart(2, "0") ||
                    "00"
                  : selectedPlatform === "lazada"
                    ? lazadaShippedToday?.length?.toString().padStart(2, "0") ||
                      "00"
                    : selectedPlatform === "shopee"
                      ? shopeeShippedTodayOrders?.length
                          ?.toString()
                          .padStart(2, "0") || "00"
                      : "00"
              }
              image={shipped}
            />
          </button>
          <button onClick={() => handleCardClick("needPrint")}>
            <DashboardCard
              title={t("Need To Print")}
              count={
                selectedPlatform === "tiktok"
                  ? awaitingCollectionUnprinted?.length
                      ?.toString()
                      .padStart(2, "0") || "00"
                  : selectedPlatform === "lazada"
                    ? lazadaPackedUnprinted?.length
                        ?.toString()
                        .padStart(2, "0") || "00"
                    : selectedPlatform === "shopee"
                      ? shopeeProcessedUnprinted?.length
                          ?.toString()
                          .padStart(2, "0") || "00"
                      : "00"
              }
              image={needPrint}
            />
          </button>
        </div>

        {/* Pie Chart Part with last 7 days data*/}
        <div className="grid grid-cols-5 mt-[73px] pb-[174px]">
          <div className="col-span-2 pr-14">
            <p className="text-[#004368] text-[25px] font-[500] capitalize mb-4">
              {t("Statistic Of Last 7 Days")}
            </p>
            <div className="pt-[30px] flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 transition-shadow hover:shadow-xl duration-300">
              <p className="text-[#004368] text-[22px] font-semibold mb-4 capitalize">
                {t("Order Overview")}
              </p>
              <div className="relative w-full h-[310px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={
                        total === 0
                          ? [{ name: t("No Data"), value: 1 }]
                          : chartData
                      }
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                      isAnimationActive={false} // disable flicker animation
                      activeIndex={-1} // prevents active highlight
                      onClick={() => {}} // disables click behavior
                    >
                      {(total === 0
                        ? [{ fill: "#d1d5db" }] // grey for no data
                        : chartData.map((_, index) => ({
                            fill: COLORS[index % COLORS.length],
                          }))
                      ).map((style, index) => (
                        <Cell
                          key={`cell-${index}`}
                          {...style}
                          stroke="#fff"
                          strokeWidth={2}
                          cursor="default" // disables pointer cursor
                        />
                      ))}
                    </Pie>

                    {/* ✅ Tooltip only on hover */}
                    <Tooltip
                      content={<CustomTooltip />}
                      trigger="hover" // explicitly set to hover only
                    />

                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      onClick={() => {}} // disable legend click
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute top-[43%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-[18px] text-gray-700 font-medium">
                    {t("Total")}
                  </p>
                  <p className="text-[24px] font-bold text-[#004368]">
                    {total}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Table Showing Part with last 7 days data*/}
          <div className="col-span-3">
            <p className="text-[#004368] text-[25px] font-[500] capitalize">
              {t("Activities of last 7 days")}
            </p>
            <div className="w-[600px] h-[413px] rounded-[17px] bg-white mt-4 pt-7 shadow-md">
              <div className="flex items-center mt-[14px] ml-7">
                <span className="w-[25px] h-[25px] bg-[#00436838] rounded-[6px] flex justify-center items-center">
                  <CiCalendarDate className="w-[13px] h-[13.5px] text-[#004368]" />
                </span>
                <span className="text-[#00000099] text-[12px] font-[400] capitalize ml-2">
                  {format(sevenDaysAgo, "dd MMMM yyyy")} to{" "}
                  {format(now, "dd MMMM yyyy")}
                </span>
              </div>

              <div className="pt-[30px]">
                <div onClick={() => handleCardClick("printed")}>
                  <ActivityRow
                    icon={FiPrinter}
                    label={t("Printed")}
                    value={
                      selectedPlatform === "tiktok"
                        ? awaitingCollectionPrinted?.length
                            ?.toString()
                            .padStart(2, "0") || "00"
                        : selectedPlatform === "lazada"
                          ? lazadaPackedPrinted?.length
                              ?.toString()
                              .padStart(2, "0") || "00"
                          : selectedPlatform === "shopee"
                            ? shopeeProcessedPrinted?.length
                                ?.toString()
                                .padStart(2, "0") || "00"
                            : "00"
                    }
                  />
                </div>

                <div onClick={() => handleCardClick("NewOrders")}>
                  <ActivityRow
                    icon={CiTimer}
                    label={t("New Orders")}
                    value={
                      selectedPlatform === "tiktok"
                        ? awaitingShipment?.length
                            ?.toString()
                            .padStart(2, "0") || "00"
                        : selectedPlatform === "lazada"
                          ? lazadaNewOrders?.length
                              ?.toString()
                              .padStart(2, "0") || "00"
                          : selectedPlatform === "shopee"
                            ? shopeeReadyToShip?.length
                                ?.toString()
                                .padStart(2, "0") || "00"
                            : "00"
                    }
                  />
                </div>

                <div onClick={() => handleCardClick("Cancelled")}>
                  <ActivityRow
                    icon={HiOutlineReceiptRefund}
                    label={t("Cancelled")}
                    value={
                      selectedPlatform === "tiktok"
                        ? cancelledOrders?.length
                            ?.toString()
                            .padStart(2, "0") || "00"
                        : selectedPlatform === "lazada"
                          ? lazadacancelledOrders?.length
                              ?.toString()
                              .padStart(2, "0") || "00"
                          : selectedPlatform === "shopee"
                            ? shopeeCancelledOrders?.length
                                ?.toString()
                                .padStart(2, "0") || "00"
                            : "00"
                    }
                  />
                </div>

                <div onClick={() => handleCardClick("needPrint")}>
                  <ActivityRow
                    icon={CiDeliveryTruck}
                    label={t("Processing for Delivery")}
                    value={
                      selectedPlatform === "tiktok"
                        ? awaitingCollectionUnprinted?.length
                            ?.toString()
                            .padStart(2, "0") || "00"
                        : selectedPlatform === "lazada"
                          ? lazadaPacked?.length?.toString().padStart(2, "0") ||
                            "00"
                          : selectedPlatform === "shopee"
                            ? shopeeProcessedUnprinted?.length
                                ?.toString()
                                .padStart(2, "0") || "00"
                            : "00"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Loading Overlay */}
      {(tiktokHomeLoading ||
        lazadaHomeLoading ||
        shopeeHomeLoading ||
        wmsStoreLoading) && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-2xl p-8 flex flex-col items-center min-w-80">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#004368]"></div>
            <p className="mt-4 text-[#004368] text-lg font-semibold">
              {t("Loading")}...
            </p>
            <p className="mt-2 text-gray-600 text-sm">
              {t("Loading")}{" "}
              {wmsStoreLoading
                ? t("TikTok")
                : selectedPlatform === "tiktok"
                  ? t("TikTok")
                  : selectedPlatform === "lazada"
                    ? t("Lazada")
                    : t("Shopee")}{" "}
              {wmsStoreLoading ? t("Shop") : t("Orders")}
            </p>
          </div>
        </div>
      )}
      <ShopeeAuthModal
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      {showAccessTokenModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[400px] text-center">
            <h2 className="text-lg font-semibold text-[#004368] mb-3">
              {t("AuthorizationExpiredTitle", {
                platform: expiredShopInfo?.platform,
              })}
            </h2>

            <p className="text-gray-700 mb-6">
              {t("AccessTokenExpiredMessage", {
                shopId: expiredShopInfo?.shopId,
              })}
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowAccessTokenModal(false)}
                className="px-5 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                {t("Cancel")}
              </button>
              <button
                onClick={handleReauthorize}
                className="px-5 py-2 w-28 bg-[#004368] text-white rounded-md hover:bg-[#00324d]"
              >
                {t("Ok")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
