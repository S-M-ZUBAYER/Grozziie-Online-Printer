import React, { useState } from "react";
import OrderNumberSharing from "./SingleNumShare/OrderNumberSharing";
import RechargeDetails from "./SingleNumShare/RechargeDetails";
import UsageDetails from "./SingleNumShare/UsageDetails";
import RecycleDetails from "./SingleNumShare/RecycleDetails";
import AttributionQuery from "./SingleNumShare/AttributionQuery";
import OddNumberSharing from "./SingleNumShare/OddNumberSharing";
import OrderNumberSharingExpressReconciliation from "./SingleNumShare/OrderNumberSharingExpressReconciliation";
import ShareOnMobile from "./SingleNumShare/ShareOnMobile";

const SingleNumberSharing = () => {
  const [activeItem, setActiveItem] = useState(0);

  const handleItemClick = (index) => {
    setActiveItem(index);
  };

  const showPages = () => {
    switch (activeItem) {
      case 0:
        return <OrderNumberSharing />;
      case 1:
        return <RechargeDetails />;
      case 2:
        return <UsageDetails />;
      case 3:
        return <RecycleDetails />;
      case 4:
        return <AttributionQuery />;
      case 5:
        return <OddNumberSharing />;
      case 6:
        return <OrderNumberSharingExpressReconciliation />;
      case 7:
        return <ShareOnMobile />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] h-[843px] w-full">
      <ul className="flex items-center pt-8 pl-10 pr-4 cursor-pointer text-black text-xs leading-normal capitalize font-normal">
        {[
          "order number sharing",
          "recharge details",
          "usage details",
          "recycle details",
          "attribution query",
          "odd number sharing",
          "express reconciliation",
          "share on mobile",
        ].map((item, index) => (
          <li
            key={index}
            className={`mr-4 ${
              activeItem === index ? "text-[#004368] font-bold" : ""
            }`}
            onClick={() => handleItemClick(index)}>
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-4">{showPages()}</div>
    </div>
  );
};

export default SingleNumberSharing;
