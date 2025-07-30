import React, { useEffect, useState } from "react";
import { CiCalendarDate, CiDeliveryTruck, CiTimer } from "react-icons/ci";
import { HiOutlineReceiptRefund } from "react-icons/hi2";
import { FiPrinter } from "react-icons/fi";
import { format } from "date-fns";
import { isSameDay, parseISO } from "date-fns";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import print from "../../assets/printer01.png";
import shipped from "../../assets/shipped01.png";
import needPrint from "../../assets/needtoprint01.png";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { useGetShippedDataUsQuery } from "../../features/allApis/shippedDataGetUsApi";
import { findPrintedToday, findShippedLast7Days } from "./HomeFunction";
import {
  fetchAvailableWaybills,
  fetchLogisticCompanies,
} from "../BatchPrint/BatchPrinterFunctions";
import { shopDeliveryCompanyList } from "../../features/slice/shopDeliveryCompanySlice";

import {
  accountUserChange,
  checkedDefaultExpressChange,
} from "../../features/slice/userSlice";

import HomeSideNavbar from "./HomeSideNavbar";
import DashboardCard from "./HomeComponents/DashboardCard";
import TutorialCard from "./HomeComponents/TutorialCard";
import ActivityRow from "./HomeComponents/ActivityRow";
import ShopSelector from "./HomeComponents/ShopSelector";
import { useLoadOrderListMutation } from "../../features/allApis/batchPrintApi";
import { startOfDay, endOfDay, fromUnixTime } from "date-fns";

const Home = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [cipher, setCipher] = useState(() => {
    const stored = localStorage.getItem("tiktokShopInfo");
    return stored ? JSON.parse(stored) : [];
  });
  const { data: printedData } = useGetShippedDataUsQuery();
  const printedToday = findPrintedToday(printedData);
  const last7DaysShippedList = findShippedLast7Days(printedData);
  const [currentDate, setCurrentDate] = useState("");
  const [deliveryCompanyName, setDeliveryCompanyName] = useState([]);
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);
  const start = startOfDay(new Date());
  const end = endOfDay(new Date());

  // real data
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
  const [loadOrderList] = useLoadOrderListMutation(); // from RTK Query

  const chartData = [
    {
      name: t("Printed"),
      value: awaitingCollectionPrinted?.length || 0,
    },
    {
      name: t("New Orders"),
      value: awaitingShipment?.length || 0,
    },
    {
      name: t("Cancelled"),
      value: cancelledOrders?.length || 0,
    },
    {
      name: t("Processing for Delivery"),
      value: awaitingCollection?.length || 0,
    },
  ];

  const COLORS = ["#34D399", "#FBBF24", "#F87171", "#60A5FA"];

  // Total count
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
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

  useEffect(() => {
    const fetchPrintedIds = async () => {
      try {
        const res = await fetch(
          "https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/printedIds"
        );
        const data = await res.json();
        console.log(data, "✅ Fetched printed IDs");

        if (Array.isArray(data)) {
          setTikTokPrintedIds(data);
          const todayPrinted =
            data?.filter((item) => isSameDay(parseISO(item.createdAt), now)) ||
            [];
          setTikTokPrintedToday(todayPrinted);
        } else {
          throw new Error("Expected array but got invalid response");
        }
      } catch (err) {
        console.error("❌ Failed to fetch printed IDs:", err);
      }
    };

    if (cipher.length > 0) {
      fetchPrintedIds();
    }
  }, [cipher]);

  useEffect(() => {
    const fetchStatusOrders = async () => {
      if (!cipher[0]?.cipher || tikTokPrintedIds.length === 0) return;
      const statuses = [
        "AWAITING_SHIPMENT",
        "AWAITING_COLLECTION",
        "IN_TRANSIT",
        "DELIVERED",
        "CANCELLED",
      ];
      const now = Math.floor(Date.now() / 1000);
      const sevenDaysAgo = now - 10 * 24 * 60 * 60;

      const printedSet = new Set(
        tikTokPrintedIds.map((item) => item.tikTokPrintedId.toString())
      );

      for (let status of statuses) {
        try {
          const response = await loadOrderList({
            cipher: cipher[0]?.cipher,
            createTimeGe: sevenDaysAgo,
            createTimeLt: now,
            updateTimeGe: sevenDaysAgo,
            updateTimeLt: now,
            orderStatus: status,
            pageSize: 100,
            sortOrder: "DESC",
          }).unwrap();

          const orderList = response?.data?.orders || [];

          // Split printed/unprinted
          const printedOrders = orderList.filter((item) =>
            printedSet.has(item.id?.toString())
          );
          const unprintedOrders = orderList.filter(
            (item) => !printedSet.has(item.id?.toString())
          );
          if (status === "AWAITING_COLLECTION")
            console.log(
              orderList,
              "AWAITING_COLLECTION........................",
              printedOrders,
              "printed collection",
              unprintedOrders,
              "unPrinted Collection",
              status
            );
          // Store in state
          if (status === "AWAITING_SHIPMENT") {
            setAwaitingShipment(orderList);
          } else if (status === "AWAITING_COLLECTION") {
            setAwaitingCollection(orderList);
            setAwaitingCollectionPrinted(printedOrders);
            setAwaitingCollectionUnprinted(unprintedOrders);
          } else if (status === "DELIVERED") {
            setDeliveredOrders(orderList);
          } else if (status === "IN_TRANSIT") {
            const todayShippedOrders =
              orderList?.filter((order) => {
                const updateDate = fromUnixTime(order.updateTime); // Convert seconds to Date
                return updateDate >= start && updateDate <= end;
              }) || [];
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
  }, [cipher, tikTokPrintedIds]);

  return (
    <div className="bg-[#0043680D] grid grid-cols-6">
      <div className="col-span-1">
        <HomeSideNavbar />
      </div>

      <div className="pt-11 pl-[62px] mb-[17px] col-span-5">
        <ShopSelector />
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

        {/* Top 3 Cards */}
        <div className="mb-9 grid grid-cols-3 gap-6">
          <DashboardCard
            title={t("Printed Today")}
            count={
              tikTokPrintedToday?.length.toString().padStart(2, "0") || "00"
            }
            image={print}
          />
          <DashboardCard
            title={t("Shipped Today")}
            count={
              tikTokShippedToday?.length.toString().padStart(2, "0") || "00"
            }
            image={shipped}
          />
          <DashboardCard
            title={t("Need To Print")}
            count={
              awaitingCollectionUnprinted?.length.toString().padStart(2, "0") ||
              "00"
            }
            image={needPrint}
          />
        </div>

        {/* Bottom Section */}
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
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                      isAnimationActive
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center label */}
                <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-center">
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
          {/* Activity */}
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
                    awaitingCollectionPrinted?.length
                      .toString()
                      .padStart(2, "0") || "00"
                  }
                />
                <ActivityRow
                  icon={CiTimer}
                  label={t("New Orders")}
                  value={
                    awaitingShipment?.length.toString().padStart(2, "0") || "00"
                  }
                />
                <ActivityRow
                  icon={HiOutlineReceiptRefund}
                  label={t("Cancelled")}
                  value={
                    cancelledOrders?.length.toString().padStart(2, "0") || "00"
                  }
                />
                <ActivityRow
                  icon={CiDeliveryTruck}
                  label={t("Processing for Delivery")}
                  value={
                    awaitingCollection?.length.toString().padStart(2, "0") ||
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
