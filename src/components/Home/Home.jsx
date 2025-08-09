import React, { useEffect, useState } from "react";
import { CiCalendarDate, CiDeliveryTruck, CiTimer } from "react-icons/ci";
import { HiOutlineReceiptRefund } from "react-icons/hi2";
import { FiPrinter } from "react-icons/fi";
import { format } from "date-fns";
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

const Home = () => {
  const { t } = useTranslation();
  const [cipher, setCipher] = useState(() => {
    const stored = localStorage.getItem("tiktokShopInfo");
    return stored ? JSON.parse(stored) : [];
  });
  const storedShopPlatform = localStorage.getItem("SelectedPlatform");
  const [selectedPlatform, setSelectedPlatform] = useState(
    storedShopPlatform || "tiktok"
  );
  useEffect(() => {
    localStorage.setItem("SelectedPlatform", selectedPlatform);
  }, [selectedPlatform]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [openShop, setOpenShop] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const start = startOfDay(now);
  const end = endOfDay(now);

  // TikTok Info
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

  // Lazada Info
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

  const [loadOrderList] = useLoadOrderListMutation();
  const [getLazadaOrders, { isLoading, isError }] =
    useLazyGetLazadaOrdersQuery();

  const COLORS = ["#34D399", "#FBBF24", "#F87171", "#60A5FA"];

  const chartData = [
    {
      name: t("Printed"),
      value:
        selectedPlatform === "tiktok"
          ? awaitingCollectionPrinted?.length || 0
          : lazadaPackedPrinted?.length || 0,
    },
    {
      name: t("New Orders"),
      value:
        selectedPlatform === "tiktok"
          ? awaitingShipment?.length || 0
          : lazadaNewOrders?.length || 0,
    },
    {
      name: t("Cancelled"),
      value:
        selectedPlatform === "tiktok"
          ? cancelledOrders?.length || 0
          : lazadacancelledOrders?.length,
    },
    {
      name: t("Processing for Delivery"),
      value:
        selectedPlatform === "tiktok"
          ? awaitingCollection?.length || 0
          : lazadaOnShipping?.length || 0,
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

  // TikTok Call API
  useEffect(() => {
    const fetchPrintedIds = async () => {
      try {
        const res = await fetch(
          // "https://grozziieget.zjweiting.com:3091/tiktokshop-print/api/dev/printedIds"
          "https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/printedIds"
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          setTikTokPrintedIds(data);
          const todayPrinted = data.filter((item) =>
            isSameDay(parseISO(item.createdAt), now)
          );
          setTikTokPrintedToday(todayPrinted);
        }
      } catch (err) {
        console.error("❌ Failed to fetch printed IDs:", err);
      }
    };

    if (cipher.length > 0) {
      fetchPrintedIds();
    }
  }, [cipher, selectedStore]);

  useEffect(() => {
    const fetchStatusOrders = async () => {
      if (!cipher[0]?.cipher) return;

      const statuses = [
        "AWAITING_SHIPMENT",
        "AWAITING_COLLECTION",
        "IN_TRANSIT",
        "DELIVERED",
        "CANCELLED",
      ];
      const nowUnix = Math.floor(Date.now() / 1000);
      const sevenDaysAgoUnix = nowUnix - 10 * 24 * 60 * 60;
      const printedSet = new Set(
        tikTokPrintedIds.map((item) => item.tikTokPrintedId?.toString())
      );

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

  // Lazada Call API
  useEffect(() => {
    const fetchPrintedIds = async () => {
      try {
        const res = await fetch(
          // "https://grozziieget.zjweiting.com:3091/tiktokshop-print/api/dev/printedIds"
          "https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/lazada/printedIds"
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          setLazadaPrintedIds(data);
          const todayPrinted = data.filter((item) =>
            isSameDay(parseISO(item.createdAt), now)
          );
          setLazadaPrintedToday(todayPrinted);
        }
      } catch (err) {
        console.error("❌ Failed to fetch printed IDs:", err);
      }
    };

    if (cipher.length > 0) {
      fetchPrintedIds();
    }
  }, [selectedStore]);

  useEffect(() => {
    const fetchLazadaStatusOrders = async () => {
      const statuses = [
        "pending",
        "Packed",
        "ready_to_ship",
        "shipped",
        "delivered",
        "Canceled",
      ];

      const now = new Date();
      const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
      const toISOString = (date) => date.toISOString().split(".")[0] + "Z";

      // Precompute printed set
      const printedSet = new Set(
        lazadaPrintedIds.map((item) => String(item.lazadaPrintedId))
      );

      for (const status of statuses) {
        try {
          const response = await getLazadaOrders({
            sortBy: "updated_at",
            createdAfter: toISOString(tenDaysAgo),
            createdBefore: toISOString(now),
            updateAfter: toISOString(tenDaysAgo),
            updateBefore: toISOString(now),
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
            setLazadaPackedUnprinted(unprintedOrders);
          } else if (status === "ready_to_ship") {
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const endOfDay = new Date(today.setHours(23, 59, 59, 999));
            const todayShipped = orderList.filter((order) => {
              const updatedAt = new Date(order.updated_at);
              return updatedAt >= startOfDay && updatedAt <= endOfDay;
            });
            setLazadaShippedToday(todayShipped);
          } else if (status === "shipped") {
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

  return (
    <div className="bg-[#0043680D] grid grid-cols-6">
      <div className="col-span-1">
        <HomeSideNavbar />
      </div>
      <div className="pt-11 pl-[62px] mb-[17px] col-span-5">
        <ShopSelector
          openShop={openShop}
          setOpenShop={setOpenShop}
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
        />
        <div className="flex items-center justify-between">
          <h3 className="text-[#004368] text-[25px] font-[500] capitalize">
            {t("Dashboard")}
          </h3>
          <p className="flex items-center gap-[12px] pr-[82px] text-[12px] text-[#00000099]">
            {currentDate}
            <span className="w-[25px] h-[25px] bg-[#0043684D] rounded-[6px] flex justify-center items-center">
              <CiCalendarDate className="text-white w-[13px] h-[13.5px]" />
            </span>
          </p>
        </div>

        <div className="mb-9 grid grid-cols-3 gap-6">
          <DashboardCard
            title={t("Printed Today")}
            count={
              selectedPlatform === "tiktok"
                ? tikTokPrintedToday?.length.toString().padStart(2, "0") || "00"
                : lazadaPrintedToday?.length.toString().padStart(2, "0") || "00"
            }
            image={print}
          />
          <DashboardCard
            title={t("Shipped Today")}
            count={
              selectedPlatform === "tiktok"
                ? tikTokShippedToday?.length.toString().padStart(2, "0") || "00"
                : lazadaShippedToday?.length.toString().padStart(2, "0") || "00"
            }
            image={shipped}
          />
          <DashboardCard
            title={t("Need To Print")}
            count={
              selectedPlatform === "tiktok"
                ? awaitingCollectionUnprinted?.length
                    .toString()
                    .padStart(2, "0") || "00"
                : lazadaNewOrders?.length.toString().padStart(2, "0") || "00"
            }
            image={needPrint}
          />
        </div>

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
                      isAnimationActive
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
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" iconType="circle" />
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
                <ActivityRow
                  icon={FiPrinter}
                  label={t("Printed")}
                  value={
                    selectedPlatform === "tiktok"
                      ? awaitingCollectionPrinted?.length
                          .toString()
                          .padStart(2, "0") || "00"
                      : lazadaPackedPrinted?.length
                          .toString()
                          .padStart(2, "0") || "00"
                  }
                />
                <ActivityRow
                  icon={CiTimer}
                  label={t("New Orders")}
                  value={
                    selectedPlatform === "tiktok"
                      ? awaitingShipment?.length.toString().padStart(2, "0") ||
                        "00"
                      : lazadaNewOrders?.length.toString().padStart(2, "0") ||
                        "00"
                  }
                />
                <ActivityRow
                  icon={HiOutlineReceiptRefund}
                  label={t("Cancelled")}
                  value={
                    selectedPlatform === "tiktok"
                      ? cancelledOrders?.length.toString().padStart(2, "0") ||
                        "00"
                      : lazadacancelledOrders?.length
                          .toString()
                          .padStart(2, "0") || "00"
                  }
                />
                <ActivityRow
                  icon={CiDeliveryTruck}
                  label={t("Processing for Delivery")}
                  value={
                    selectedPlatform === "tiktok"
                      ? awaitingCollection?.length
                          .toString()
                          .padStart(2, "0") || "00"
                      : lazadaOnShipping?.length.toString().padStart(2, "0") ||
                        "00"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
