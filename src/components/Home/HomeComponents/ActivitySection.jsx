import React from "react";
import { format } from "date-fns";
import { CiCalendarDate, CiTimer, CiDeliveryTruck } from "react-icons/ci";
import { FiPrinter } from "react-icons/fi";
import { HiOutlineReceiptRefund } from "react-icons/hi2";
import ActivityRow from "./ActivityRow";

const ActivitySection = ({ selectedPlatform }) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  // Example data (replace with actual states)
  const data = {
    printed: 5,
    newOrders: 10,
    cancelled: 2,
    processing: 3,
  };

  return (
    <div className="col-span-3">
      <p className="text-[#004368] text-[25px] font-[500] capitalize">
        Activities of last 7 days
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
          <ActivityRow icon={FiPrinter} label="Printed" value={data.printed} />
          <ActivityRow
            icon={CiTimer}
            label="New Orders"
            value={data.newOrders}
          />
          <ActivityRow
            icon={HiOutlineReceiptRefund}
            label="Cancelled"
            value={data.cancelled}
          />
          <ActivityRow
            icon={CiDeliveryTruck}
            label="Processing for Delivery"
            value={data.processing}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivitySection;
