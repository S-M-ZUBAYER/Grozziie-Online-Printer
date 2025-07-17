import React, { useState } from "react";
import FrontPage from "./ShopNavbar/FrontPage";
import ShopBatchPrint from "./ShopNavbar/ShopBatchPrint";
import ShopSinglePrint from "./ShopNavbar/ShopSinglePrint";
import ShopManualOrder from "./ShopNavbar/ShopManualOrder";
import PreShipment from "./ShopNavbar/PreShipment";
import BasicSettings from "./ShopNavbar/BasicSettings";
import ProductAbbreviation from "./ShopNavbar/ProductAbbreviation";
import Quantity from "./ShopNavbar/Quantity";
import SmsService from "./ShopNavbar/SmsService";
import PurchaseSaleInventory from "./ShopNavbar/PurchaseSaleInventory";
import StockList from "./ShopNavbar/StockList";

const Shop = () => {
  const [activeItem, setActiveItem] = useState(0);

  const handleItemClick = (index) => {
    setActiveItem(index);
  };

  const showPages = () => {
    switch (activeItem) {
      case 0:
        return <FrontPage />;
      case 1:
        return <ShopBatchPrint />;
      case 2:
        return <ShopSinglePrint />;
      case 3:
        return <ShopManualOrder />;
      case 4:
        return <PreShipment />;
      case 5:
        return <BasicSettings />;
      case 6:
        return <ProductAbbreviation />;
      case 7:
        return <Quantity />;
      case 8:
        return <SmsService />;
      case 9:
        return <PurchaseSaleInventory />;
      case 10:
        return <StockList />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] h-[855px] w-full">
      <ul className="flex items-center pt-8 pl-10 pr-4 cursor-pointer text-black text-xs leading-normal capitalize font-normal">
        {[
          "Front Page",
          "Batch Print",
          "Single Print",
          "Manual Order",
          "Pre-Shipment",
          "Basic Settings",
          "Product Abbreviation",
          "Quantity",
          "SMS Service",
          "Purchase, Sale & Inventory",
          "Stock List",
        ].map((item, index) => (
          <li
            key={index}
            className={`mr-3 ${
              activeItem === index
                ? "text-[#004368] font-semibold border-b-2 border-[#004368] border-opacity-20 "
                : ""
            }`}
            onClick={() => handleItemClick(index)}
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-4">{showPages()}</div>
    </div>
  );
};

export default Shop;
