import React, { useEffect, useState } from "react";
import { CiCalendarDate, CiDeliveryTruck, CiTimer } from "react-icons/ci";
import { FaStore } from "react-icons/fa";
import { CgNotes } from "react-icons/cg";
import { HiOutlineReceiptRefund } from "react-icons/hi2";
import { FiPrinter } from "react-icons/fi";

import print from "../../assets/printer01.png";
import shipped from "../../assets/shipped01.png";
import needPrint from "../../assets/needtoprint01.png";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

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

const Home = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const { data: printedData } = useGetShippedDataUsQuery();
  const printedToday = findPrintedToday(printedData);
  const last7DaysShippedList = findShippedLast7Days(printedData);

  const [currentDate, setCurrentDate] = useState("");

  const [deliveryCompanyName, setDeliveryCompanyName] = useState([]);

  useEffect(() => {
    const userEmail = localStorage.getItem("printerUser");
    if (userEmail) {
      dispatch(accountUserChange(userEmail));
    }

    const storedCompanyString = localStorage.getItem("DefaultExpressCompany");
    if (storedCompanyString) {
      const storedCompany = JSON.parse(storedCompanyString);
      dispatch(checkedDefaultExpressChange(storedCompany));
    }

    fetchLogisticCompanies().then(setDeliveryCompanyName);

    const now = new Date();
    const options = { day: "2-digit", month: "long", year: "numeric" };
    setCurrentDate(now.toLocaleDateString("en-US", options));
  }, []);

  // useEffect(() => {
  //   if (deliveryCompanyName.length > 0) {
  //     fetchAvailableWaybills(deliveryCompanyName)
  //       .then((waybills) => {
  //         const flatList = waybills.flat();
  //         dispatch(shopDeliveryCompanyList(flatList));
  //       })
  //       .catch(console.error);
  //   }
  // }, [deliveryCompanyName]);

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
            count={printedToday?.length.toString().padStart(2, "0") || "00"}
            image={print}
          />
          <DashboardCard
            title={t("Shipped Today")}
            count="100"
            image={shipped}
          />
          <DashboardCard
            title={t("Need To Print")}
            count="100"
            image={needPrint}
          />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-5 mt-[73px] pb-[174px]">
          {/* Tutorials */}
          <div className="col-span-2 pr-14">
            <p className="text-[#004368] text-[25px] font-[500] capitalize">
              {t("Tutorial")}
            </p>
            <div className="w-[370px] h-[413px] rounded-[17px] bg-white mt-4 py-9 grid grid-rows-3 gap-5 shadow-md">
              <TutorialCard icon={FaStore} label={t("Related store")} />
              <TutorialCard icon={CgNotes} label={t("Manual Order")} />
              <TutorialCard
                icon={CiDeliveryTruck}
                label={t("Delivery process")}
              />
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
                  01 January 2023 to 31 Dec 2023
                </span>
              </div>
              <div className="pt-[30px]">
                <ActivityRow
                  icon={FiPrinter}
                  label={t("Printed")}
                  value={
                    last7DaysShippedList?.length.toString().padStart(2, "0") ||
                    "00"
                  }
                />
                <ActivityRow icon={CiTimer} label={t("Awaiting")} value="15" />
                <ActivityRow
                  icon={HiOutlineReceiptRefund}
                  label={t("Refund")}
                  value="1"
                />
                <ActivityRow
                  icon={CiDeliveryTruck}
                  label={t("Delivery")}
                  value="850"
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
