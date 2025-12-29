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

const Home = () => {
  const { t } = useTranslation();
  const [cipher, setCipher] = useState("");
  const tiktokAppKey = localStorage.getItem("tiktokAppKey");
  const tiktokAuthCountry = localStorage.getItem("tiktokAuthCountry");
  const shopeeAuthCountry = localStorage.getItem("shopeeAuthCountry");
  const storedShopPlatform = localStorage.getItem("SelectedPlatform");
  const [selectedPlatform, setSelectedPlatform] = useState(
    storedShopPlatform || "tiktok"
  );
  const [selectedStore, setSelectedStore] = useState(null);
  const [openShop, setOpenShop] = useState(null);
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const start = startOfDay(now);
  const end = endOfDay(now);
  const navigate = useNavigate();

  // TikTok States
  const [tiktokHomeLoading, setTikTokHomeLoading] = useState(false);
  const [tikTokPrintedIds, setTikTokPrintedIds] = useState([]);
  const [tikTokShippedToday, setTikTokShippedToday] = useState([]);
  const [tikTokPrintedToday, setTikTokPrintedToday] = useState([]);
  const [awaitingShipment, setAwaitingShipment] = useState([]);
  const [awaitingCollection, setAwaitingCollection] = useState([]);
  const [awaitingCollectionPrinted, setAwaitingCollectionPrinted] = useState(
    []
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

  // ✅ Parse the user from localStorage properly
  const storedUser = localStorage.getItem("printerUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  //TikTok Orders Call
  const [loadOrderList] = useLoadOrderListMutation();
  const [getLazadaOrders, { isLoading, isError }] =
    useLazyGetLazadaOrdersQuery();

  // Shoppe Orders call
  const [getShopeeOrderDetails] = useLazyGetShopeeOrderDetailsQuery();
  const [getShopeeOrders] = useLazyGetShopeeOrdersQuery();

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
          ? awaitingCollection?.length || 0
          : selectedPlatform === "lazada"
          ? lazadaOnShipping?.length || 0
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

  function getRegionTimestampsShopeTiktok(regionCode) {
    // Map region codes to Luxon timezone strings
    const regionTimezones = {
      // Southeast Asia
      MY: "Asia/Kuala_Lumpur", // Malaysia
      SG: "Asia/Singapore", // Singapore
      PH: "Asia/Manila", // Philippines
      TH: "Asia/Bangkok", // Thailand
      VN: "Asia/Ho_Chi_Minh", // Vietnam
      ID: "Asia/Jakarta", // Indonesia (Western)
      "ID-B": "Asia/Makassar", // Indonesia (Central)
      "ID-P": "Asia/Jayapura", // Indonesia (Eastern)

      // East Asia
      CN: "Asia/Shanghai", // China
      HK: "Asia/Hong_Kong", // Hong Kong
      TW: "Asia/Taipei", // Taiwan
      JP: "Asia/Tokyo", // Japan
      KR: "Asia/Seoul", // South Korea

      // South Asia
      IN: "Asia/Kolkata", // India
      BD: "Asia/Dhaka", // Bangladesh
      PK: "Asia/Karachi", // Pakistan
      LK: "Asia/Colombo", // Sri Lanka

      // Middle East
      AE: "Asia/Dubai", // UAE
      SA: "Asia/Riyadh", // Saudi Arabia
      QA: "Asia/Qatar", // Qatar

      // Europe
      GB: "Europe/London", // UK
      DE: "Europe/Berlin", // Germany
      FR: "Europe/Paris", // France
      IT: "Europe/Rome", // Italy
      ES: "Europe/Madrid", // Spain
      RU: "Europe/Moscow", // Russia

      // Americas
      US: "America/New_York", // USA (Eastern)
      "US-C": "America/Chicago", // USA (Central)
      "US-M": "America/Denver", // USA (Mountain)
      "US-P": "America/Los_Angeles", // USA (Pacific)
      CA: "America/Toronto", // Canada (Eastern)
      "CA-P": "America/Vancouver", // Canada (Pacific)
      BR: "America/Sao_Paulo", // Brazil
      MX: "America/Mexico_City", // Mexico

      // Oceania
      AU: "Australia/Sydney", // Australia (Eastern)
      "AU-C": "Australia/Adelaide", // Australia (Central)
      "AU-W": "Australia/Perth", // Australia (Western)
      NZ: "Pacific/Auckland", // New Zealand
    };

    try {
      if (!regionCode || typeof regionCode !== "string") {
        throw new Error("Please provide a region code");
      }

      const regionUpper = regionCode.toUpperCase();
      const timezone = regionTimezones[regionUpper];

      if (!timezone) {
        const validRegions = Object.keys(regionTimezones)
          .filter(
            (k) => !k.includes("-") || k.startsWith(regionUpper.split("-")[0])
          )
          .slice(0, 20) // Show first 20 for readability
          .join(", ");
        throw new Error(
          `Invalid region code. Some valid codes are: ${validRegions}...`
        );
      }

      // Get current time in the region
      const nowInRegion = DateTime.now().setZone(timezone);

      // Get 7 days ago at midnight in the region
      const sevenDaysAgo = nowInRegion.minus({ days: 7 }).startOf("day");

      // Convert to timestamps (seconds since epoch)
      const currentTimestamp = Math.floor(nowInRegion.toSeconds());
      const sevenDaysAgoTimestamp = Math.floor(sevenDaysAgo.toSeconds());

      // Also get ISO strings for verification
      const currentISO = nowInRegion.toISO();
      const sevenDaysAgoISO = sevenDaysAgo.toISO();

      return {
        currentTime: currentTimestamp, // Unix timestamp in seconds
        sevenDaysAgo: sevenDaysAgoTimestamp, // Unix timestamp in seconds
        currentTimeISO: currentISO, // ISO string for debugging
        sevenDaysAgoISO: sevenDaysAgoISO, // ISO string for debugging
        region: regionUpper,
        timezone: timezone,
        regionCurrentTime: nowInRegion.toFormat("yyyy-MM-dd HH:mm:ss"),
        regionSevenDaysAgo: sevenDaysAgo.toFormat("yyyy-MM-dd HH:mm:ss"),
      };
    } catch (error) {
      console.error("Error:", error.message);
      return {
        error: error.message,
        regionCode: regionCode,
      };
    }
  }

  function getRegionTimestampsLazada(regionCode) {
    // Map region codes to Luxon timezone strings
    const regionTimezones = {
      // Southeast Asia
      MY: "Asia/Kuala_Lumpur", // Malaysia
      SG: "Asia/Singapore", // Singapore
      PH: "Asia/Manila", // Philippines
      TH: "Asia/Bangkok", // Thailand
      VN: "Asia/Ho_Chi_Minh", // Vietnam
      ID: "Asia/Jakarta", // Indonesia (Western)
      "ID-B": "Asia/Makassar", // Indonesia (Central)
      "ID-P": "Asia/Jayapura", // Indonesia (Eastern)

      // East Asia
      CN: "Asia/Shanghai", // China
      HK: "Asia/Hong_Kong", // Hong Kong
      TW: "Asia/Taipei", // Taiwan
      JP: "Asia/Tokyo", // Japan
      KR: "Asia/Seoul", // South Korea

      // South Asia
      IN: "Asia/Kolkata", // India
      BD: "Asia/Dhaka", // Bangladesh
      PK: "Asia/Karachi", // Pakistan
      LK: "Asia/Colombo", // Sri Lanka

      // Middle East
      AE: "Asia/Dubai", // UAE
      SA: "Asia/Riyadh", // Saudi Arabia
      QA: "Asia/Qatar", // Qatar

      // Europe
      GB: "Europe/London", // UK
      DE: "Europe/Berlin", // Germany
      FR: "Europe/Paris", // France
      IT: "Europe/Rome", // Italy
      ES: "Europe/Madrid", // Spain
      RU: "Europe/Moscow", // Russia

      // Americas
      US: "America/New_York", // USA (Eastern)
      "US-C": "America/Chicago", // USA (Central)
      "US-M": "America/Denver", // USA (Mountain)
      "US-P": "America/Los_Angeles", // USA (Pacific)
      CA: "America/Toronto", // Canada (Eastern)
      "CA-P": "America/Vancouver", // Canada (Pacific)
      BR: "America/Sao_Paulo", // Brazil
      MX: "America/Mexico_City", // Mexico

      // Oceania
      AU: "Australia/Sydney", // Australia (Eastern)
      "AU-C": "Australia/Adelaide", // Australia (Central)
      "AU-W": "Australia/Perth", // Australia (Western)
      NZ: "Pacific/Auckland", // New Zealand
    };

    try {
      if (!regionCode || typeof regionCode !== "string") {
        throw new Error("Please provide a region code");
      }

      const regionUpper = regionCode.toUpperCase();
      const timezone = regionTimezones[regionUpper];

      if (!timezone) {
        const validRegions = Object.keys(regionTimezones)
          .filter(
            (k) => !k.includes("-") || k.startsWith(regionUpper.split("-")[0])
          )
          .slice(0, 20) // Show first 20 for readability
          .join(", ");
        throw new Error(
          `Invalid region code. Some valid codes are: ${validRegions}...`
        );
      }

      // Get current time in the region
      const nowInRegion = DateTime.now().setZone(timezone);

      // Get 7 days ago at midnight in the region
      const sevenDaysAgo = nowInRegion.minus({ days: 7 }).startOf("day");

      // Convert to format: 2025-12-22T08:06:56Z
      const currentTimeUTC = nowInRegion
        .toUTC()
        .toISO()
        .replace(/\.\d+/, "")
        .replace(/\+00:00$/, "Z");
      const sevenDaysAgoUTC = sevenDaysAgo
        .toUTC()
        .toISO()
        .replace(/\.\d+/, "")
        .replace(/\+00:00$/, "Z");

      // Also keep local timezone versions for debugging
      const currentTimeLocal = nowInRegion
        .toISO()
        .replace(/\.\d+/, "")
        .replace(/\+00:00$/, "Z");
      const sevenDaysAgoLocal = sevenDaysAgo
        .toISO()
        .replace(/\.\d+/, "")
        .replace(/\+00:00$/, "Z");

      return {
        // Main return values in the format you need: 2025-12-22T08:06:56Z
        currentTime: currentTimeUTC,
        sevenDaysAgo: sevenDaysAgoUTC,

        // Local timezone versions (also in Z format)
        currentTimeLocal: currentTimeLocal,
        sevenDaysAgoLocal: sevenDaysAgoLocal,

        // Unix timestamps (seconds since epoch) - kept for compatibility
        currentTimestamp: Math.floor(nowInRegion.toSeconds()),
        sevenDaysAgoTimestamp: Math.floor(sevenDaysAgo.toSeconds()),

        // Debug info
        region: regionUpper,
        timezone: timezone,
        regionCurrentTime: nowInRegion.toFormat("yyyy-MM-dd HH:mm:ss"),
        regionSevenDaysAgo: sevenDaysAgo.toFormat("yyyy-MM-dd HH:mm:ss"),
      };
    } catch (error) {
      console.error("Error:", error.message);

      // Fallback to current UTC time in the required format
      const nowUTC = new Date()
        .toISOString()
        .replace(/\.\d+/, "")
        .replace(/\+00:00$/, "Z");
      const sevenDaysAgoUTC = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .replace(/\.\d+/, "")
        .replace(/\+00:00$/, "Z");

      return {
        currentTime: nowUTC,
        sevenDaysAgo: sevenDaysAgoUTC,
        region: "UTC",
        timezone: "UTC",
        error: error.message,
      };
    }
  }

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
          }
        );

        const saveResult = await saveResponse.json();

        if (saveResult.code !== 201) {
          alert(
            "Failed to save Lazada shop. Please try again or contact support."
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
        }
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
            err
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

  // TikTok Fetch Printed IDs
  useEffect(() => {
    const fetchPrintedIds = async () => {
      try {
        const res = await fetch(
          // "https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/printedIds"
          `https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/printedIds/by-email/${user?.email}`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          setTikTokPrintedIds(data);
          const todayPrinted = data.filter((item) =>
            isSameDay(parseISO(item.createdAt), now)
          );
        }
      } catch (err) {
        console.error("❌ Failed to fetch printed IDs:", err);
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
      const statuses = [
        "AWAITING_SHIPMENT",
        "AWAITING_COLLECTION",
        "IN_TRANSIT",
        "DELIVERED",
        "CANCELLED",
      ];

      // Previouse correct one
      // const nowUnix = Math.floor(Date.now() / 1000);
      // const sevenDaysAgoUnix = nowUnix - 7 * 24 * 60 * 60;

      // Try new accrding to the time zone

      const tiktokDateRange = getRegionTimestampsShopeTiktok(tiktokCountryCode);
      const nowUnix = tiktokDateRange?.currentTime;
      const sevenDaysAgoUnix = tiktokDateRange?.sevenDaysAgo;

      const printedSet = new Set(
        tikTokPrintedIds.map((item) => item.tikTokPrintedId?.toString())
      );

      for (const status of statuses) {
        try {
          const response = await loadOrderList({
            cipher: cipher[0]?.cipher,
            // appKey: tiktokAppKey,
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
            printedSet.has(item.id?.toString())
          );
          const unprintedOrders = orderList.filter(
            (item) => !printedSet.has(item.id?.toString())
          );

          if (status === "AWAITING_SHIPMENT") {
            setAwaitingShipment(orderList);
          } else if (status === "AWAITING_COLLECTION") {
            setAwaitingCollection(orderList);
            setAwaitingCollectionPrinted(printedOrders);
            const todayPrintedObjects = () => {
              const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

              return tikTokPrintedIds.filter((item) =>
                item.createdAt?.startsWith(today)
              );
            };

            const todayPrintedData = todayPrintedObjects();

            // ✅ Today printed IDs from DB (already filtered by createdAt)
            const todayPrintedIdSet = new Set(
              todayPrintedData.map((item) => item.tikTokPrintedId)
            );
            // ✅ Match by order_sn only
            const todayTiktokPrinted = printedOrders.filter(
              // (order) => console.log(order?.id)

              (order) => todayPrintedIdSet.has(order?.id)
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
            error
          );
        }
      }
    };

    fetchStatusOrders();
  }, [cipher, tikTokPrintedIds, selectedStore]);

  // Lazada Fetch Printed IDs
  useEffect(() => {
    const fetchPrintedIds = async () => {
      try {
        const res = await fetch(
          // "https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/lazada/printedIds"
          `https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/lazada/printedIds/by-email/${user?.email}`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          setLazadaPrintedIds(data);
          const todayPrinted = data.filter((item) =>
            isSameDay(parseISO(item.createdAt), now)
          );
          // setLazadaPrintedToday(todayPrinted);
        }
      } catch (err) {
        console.error("❌ Failed to fetch printed IDs:", err);
      }
    };

    if (cipher.length > 0) {
      fetchPrintedIds();
    }
  }, [selectedStore]);

  // Lazada Fetch Orders according to the Status
  useEffect(() => {
    if (selectedPlatform?.toLowerCase().trim() !== "lazada") return;
    const fetchLazadaStatusOrders = async () => {
      setLazadaOnShipping(true);
      const statuses = [
        "pending",
        "Packed",
        "ready_to_ship",
        "shipped",
        "delivered",
        "Canceled",
      ];

      // Previouse date work properly
      // const now = new Date();
      // const tenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      // const toISOString = (date) => date.toISOString().split(".")[0] + "Z";

      // Now try new to according to the different country zone
      const lazadaDateRange = getRegionTimestampsLazada(lazadaCountryCode);
      const now = lazadaDateRange.currentTime;
      const tenDaysAgo = lazadaDateRange.sevenDaysAgo;

      // Precompute printed set
      const printedSet = new Set(
        lazadaPrintedIds.map((item) => String(item.lazadaPrintedId))
      );

      for (const status of statuses) {
        try {
          const response = await getLazadaOrders({
            sortBy: "updated_at",
            // createdAfter: toISOString(tenDaysAgo),
            // createdBefore: toISOString(now),
            // updateAfter: toISOString(tenDaysAgo),
            // updateBefore: toISOString(now),
            createdAfter: tenDaysAgo,
            createdBefore: now,
            updateAfter: tenDaysAgo,
            updateBefore: now,
            status,
            status,
            sortDirection: "DESC",
            offset: 0,
            limit: 100,
          }).unwrap();

          const parsedBody = JSON.parse(response?.body || "{}");
          const orderList = parsedBody?.data?.orders || [];
          const printedOrders = orderList.filter((item) =>
            printedSet.has(String(item.order_id))
          );
          const unprintedOrders = orderList.filter(
            (item) => !printedSet.has(String(item.order_id))
          );

          // Assign to relevant state
          if (status === "pending") {
            setLazadaNewOrders(orderList);
          } else if (status === "Packed") {
            setLazadaPacked(orderList);
            setLazadaPackedPrinted(printedOrders);
          } else if (status === "ready_to_ship") {
            const todayLazadaPrintedObjects = () => {
              const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

              return lazadaPrintedIds.filter((item) =>
                item.createdAt?.startsWith(today)
              );
            };
            const todayLazadaPrintedData = todayLazadaPrintedObjects();

            // ✅ Today printed IDs from DB (already filtered by createdAt)
            const todayLazadaPrintedIdSet = new Set(
              todayLazadaPrintedData.map((item) => item.lazadaPrintedId)
            );

            // ✅ Match by order_sn only
            const todayLazadaPrinted = printedOrders.filter((order) =>
              todayLazadaPrintedIdSet.has(String(order?.order_number))
            );

            setLazadaPrintedToday(todayLazadaPrinted);

            setLazadaPackedUnprinted(unprintedOrders);
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
            // Optional: Could also capture "shipped" separately
          } else if (status === "delivered") {
            setLazadaDeliveredOrders(orderList);
          } else if (status === "Canceled") {
            setLazadacancelledOrders(orderList);
          }
        } catch (error) {
          console.error(
            `❌ Failed to load Lazada orders for status: ${status}`,
            error
          );
        }
      }
    };

    fetchLazadaStatusOrders();
  }, [lazadaPrintedIds, selectedStore]);

  // Shopee Fetch Printed IDs
  useEffect(() => {
    const fetchShopeePrintedIds = async () => {
      try {
        const res = await fetch(
          // "https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/shopee/printedIds"
          `https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/shopee/printedIds/by-email/${user.email}`
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setShopeePrintedIds(data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch Shopee printed IDs:", err);
      }
    };

    // if (selectedStore === "Shopee") {
    fetchShopeePrintedIds();
    // }
  }, [selectedStore]);

  // Shopee Fetch Orders according to the Status
  useEffect(() => {
    if (selectedPlatform?.toLowerCase().trim() !== "shopee") return;
    const fetchShopeeStatusOrders = async () => {
      const statuses = [
        "READY_TO_SHIP",
        "PROCESSED",
        "SHIPPED",
        "COMPLETED",
        "CANCELLED",
      ];

      // previouse Correct one
      // const now = Math.floor(Date.now() / 1000); // seconds
      // const sevenDaysAgo = now - 7 * 24 * 60 * 60;

      // try new one also work according to the time zone
      const shopeeDateRange = getRegionTimestampsShopeTiktok(shopeeCountryCode);
      const now = shopeeDateRange?.currentTime;
      const sevenDaysAgo = shopeeDateRange?.sevenDaysAgo;

      const printedSet = new Set(
        shopeePrintedIds.map((item) => String(item.shopeePrintedId))
      );

      const todayPrintedObjects = () => {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        return shopeePrintedIds.filter((item) =>
          item.createdAt?.startsWith(today)
        );
      };

      const todayPrintedData = todayPrintedObjects();

      // ✅ Today printed IDs from DB (already filtered by createdAt)
      const todayPrintedIdSet = new Set(
        todayPrintedData.map((item) => item.shopeePrintedId)
      );

      for (const status of statuses) {
        try {
          // 1️⃣ Get base orders (now returns direct array instead of nested response)
          const orderListResponse = await getShopeeOrders({
            timeFrom: sevenDaysAgo,
            timeTo: now,
            orderStatus: status,
          }).unwrap();

          // Check for invalid access token error (structure might be different now)
          if (
            orderListResponse?.error === "invalid_acceess_token" &&
            selectedPlatform === "shopee"
          ) {
            // Save shop info for modal
            setExpiredShopInfo({
              platform: "Shopee",
              shopId: localStorage.getItem("shopeeAuthShopId"),
            });

            // Wait 1 second before showing modal
            setTimeout(() => {
              const currentPlatform = localStorage.getItem("SelectedPlatform");
              if (currentPlatform === "shopee") {
                setShowAccessTokenModal(true);
                console.log("🟡 Showing Shopee authorization expired modal...");
              } else {
                console.log("⚪ Skipped modal — platform changed.");
              }
            }, 1000);

            return;
          }

          // Now orderListResponse is the direct array (no more nested .response.order_list)
          const orderList = Array.isArray(orderListResponse)
            ? orderListResponse
            : [];

          if (!orderList.length) continue;

          // 2️⃣ Extract order_sn
          const orderSnList = orderList.map((o) => o.order_sn);

          // 3️⃣ Get order details (now returns direct array)
          const detailsResponse = await getShopeeOrderDetails({
            orderSnList,
            request_order_status_pending: true,
            response_optional_fields:
              "total_amount,recipient_address,item_list",
          }).unwrap();

          // Now detailsResponse is the direct array (no more nested .response.order_list)
          const detailedOrders = Array.isArray(detailsResponse)
            ? detailsResponse
            : [];

          // 4️⃣ Merge orders with details
          const mergedOrders = orderList.map((order) => {
            const details = detailedOrders.find(
              (d) => d.order_sn === order.order_sn
            );
            return { ...order, ...details };
          });

          // 5️⃣ Split printed/unprinted
          const printedOrders = mergedOrders.filter((item) =>
            printedSet.has(String(item.order_sn))
          );
          const unprintedOrders = mergedOrders.filter(
            (item) => !printedSet.has(String(item.order_sn))
          );

          // 6️⃣ Assign to relevant state
          if (status === "READY_TO_SHIP") {
            setShopeeReadyToShip(mergedOrders);
          } else if (status === "PROCESSED") {
            setShopeeProcessed(mergedOrders);
            setShopeeProcessedPrinted(printedOrders);
            setShopeeProcessedUnprinted(unprintedOrders);

            // Convert UNIX timestamp (seconds) → Date
            const fromUnix = (ts) => new Date(ts * 1000);
            const now = new Date();

            // ✅ Match by order_sn only
            const todayPrinted = printedOrders.filter((order) =>
              todayPrintedIdSet.has(order.order_sn)
            );

            setShopeeTodayPrinted(todayPrinted);
          } else if (status === "SHIPPED") {
            // Filter to ensure only SHIPPED orders are included

            const shippedOrders = mergedOrders.filter(
              (order) => order.order_status === "SHIPPED"
            );

            setShopeeShippedOrders(shippedOrders);

            const shippedToday = shippedOrders.filter((order) => {
              // Use update_time (fallback to ship_by_date or created_time if missing)
              const updateTime = new Date(
                (order.update_time ||
                  order.ship_by_date ||
                  order.created_time ||
                  Date.now() / 1000) * 1000
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
          console.error(`❌ Failed to load Shopee orders for ${status}`, error);
        }
      }
    };

    // if (selectedStore === "Shopee" && shopeePrintedIds.length > 0) {
    fetchShopeeStatusOrders();
    // }
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
          <button onClick={() => handleCardClick("printed")}>
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
                  ? shopeeTodayPrinted?.length?.toString().padStart(2, "0") ||
                    "00"
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
                onClick={handleReauthorize}
                className="px-5 py-2 bg-[#004368] text-white rounded-md hover:bg-[#00324d]"
              >
                {t("Ok")}
              </button>

              <button
                onClick={() => setShowAccessTokenModal(false)}
                className="px-5 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                {t("Cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
