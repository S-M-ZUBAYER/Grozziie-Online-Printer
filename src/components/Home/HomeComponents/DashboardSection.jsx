import React from "react";
import DashboardCard from "./DashboardCard";
import { CiCalendarDate } from "react-icons/ci";
import { format } from "date-fns";
import print from "../../assets/printer01.png";
import shipped from "../../assets/shipped01.png";
import needPrint from "../../assets/needtoprint01.png";
import { useNavigate } from "react-router-dom";
import PieChartSection from "./PieChartSection";

const DashboardSection = ({ selectedPlatform, selectedStore }) => {
  const navigate = useNavigate();
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const handleCardClick = (type) => {
    const platformPaths = {
      tiktok: "TikTokOrderManagemnt",
      lazada: "LazadaOrderManagement",
      shopee: "ShopeeOrderManagement",
    };
    const platformPath = platformPaths[selectedPlatform];
    if (platformPath) {
      navigate(`/${type}/${platformPath}`);
    }
  };

  // Example counts (replace with actual state/data fetching logic)
  const counts = {
    printedToday: 5,
    shippedToday: 3,
    needPrint: 7,
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-[#004368] text-[25px] font-[500] capitalize">
          Dashboard
        </h3>
        <p className="flex items-center gap-[12px] pr-[82px] text-[12px] text-[#00000099]">
          {format(now, "dd MMM yyyy")}
          <span className="w-[25px] h-[25px] bg-[#0043684D] rounded-[6px] flex justify-center items-center">
            <CiCalendarDate className="text-white w-[13px] h-[13.5px]" />
          </span>
        </p>
      </div>
      <div className="mb-9 grid grid-cols-3 gap-6">
        <button onClick={() => handleCardClick("printed")}>
          <DashboardCard
            title="Printed Today"
            count={counts.printedToday}
            image={print}
          />
        </button>
        <button onClick={() => handleCardClick("shipped")}>
          <DashboardCard
            title="Shipped Today"
            count={counts.shippedToday}
            image={shipped}
          />
        </button>
        <button onClick={() => handleCardClick("needPrint")}>
          <DashboardCard
            title="Need To Print"
            count={counts.needPrint}
            image={needPrint}
          />
        </button>
      </div>
      <PieChartSection selectedPlatform={selectedPlatform} />
    </div>
  );
};

export default DashboardSection;
