import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import HomeSideNavbar from "./HomeSideNavbar";
import ShopSelector from "./HomeComponents/ShopSelector";
import DashboardSection from "./HomeComponents/DashboardSection";
import ActivitySection from "./HomeComponents/ActivitySection";

const HomeContainer = () => {
  const { t } = useTranslation();

  const storedShopPlatform = localStorage.getItem("SelectedPlatform");
  const [selectedPlatform, setSelectedPlatform] = useState(
    storedShopPlatform || "tiktok"
  );
  const [selectedStore, setSelectedStore] = useState(null);
  const [openShop, setOpenShop] = useState(null);

  useEffect(() => {
    localStorage.setItem("SelectedPlatform", selectedPlatform);
  }, [selectedPlatform]);

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
        <DashboardSection
          selectedPlatform={selectedPlatform}
          selectedStore={selectedStore}
        />
        <ActivitySection selectedPlatform={selectedPlatform} />
      </div>
    </div>
  );
};

export default HomeContainer;
