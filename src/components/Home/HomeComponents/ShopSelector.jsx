import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon, CaretDownIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import AddShopeModal from "./AddShopeModal";
import { useSelector } from "react-redux";

const ShopSelector = ({
  openShop,
  setOpenShop,
  selectedStore,
  setSelectedStore,
  selectedPlatform,
  setSelectedPlatform,
}) => {
  const { t } = useTranslation();
  const TikTokShopList = useSelector((state) => state.allTikTokShopList.data);
  const ShopeeShopList = useSelector((state) => state.allShopeeShopList.data);
  const LazadaShopList = useSelector((state) => state.allLazadaShopList.data);

  const shops = [
    { id: "shopee", label: "Shopee", stores: ShopeeShopList || [] },
    { id: "lazada", label: "Lazada", stores: LazadaShopList || [] },
    {
      id: "tiktok",
      label: "TikTok",
      stores: TikTokShopList || [],
    },
  ];

  // Initialize with first TikTok shop if available
  useEffect(() => {
    if (TikTokShopList?.length > 0) {
      setSelectedPlatform(selectedPlatform);
      setSelectedStore(TikTokShopList[0].name);
      saveShopToLocalStorage("tiktok", [TikTokShopList[0]]);
    }
  }, [TikTokShopList]);

  // Save full shop array with only one selected shop object for each platform
  const saveShopToLocalStorage = (platformId, shopArray) => {
    const key = `${platformId}ShopInfo`;
    localStorage.setItem(key, JSON.stringify(shopArray));
  };

  // When selecting platform, automatically select the first store of that platform
  const handlePlatformSelect = (platformId) => {
    setSelectedPlatform(platformId);
    localStorage.setItem("SelectedPlatform", platformId);
    // Find the platform and get its first store
    const platformObj = shops.find((shop) => shop.id === platformId);
    if (platformObj && platformObj.stores.length > 0) {
      const firstStore = platformObj.stores[0];
      setSelectedStore(firstStore.name);
      saveShopToLocalStorage(platformId, [firstStore]);
    } else {
      setSelectedStore(null);
    }
  };

  // Select a store under platform — save full object array with 1 selected object
  const handleStoreSelect = (platformId, storeName) => {
    setSelectedPlatform(platformId);
    localStorage.setItem("SelectedPlatform", platformId);
    setSelectedStore(storeName);

    // Find the full shop object for that store name
    const platformObj = shops.find((shop) => shop.id === platformId);
    if (!platformObj) return;

    const fullShopObj = platformObj.stores.find(
      (shop) => shop.name === storeName
    );

    if (fullShopObj) {
      saveShopToLocalStorage(platformId, [fullShopObj]);
    }
  };

  const renderShopItem = ({ id, label, stores }) => (
    <NavigationMenu.Item className="relative" key={id}>
      <NavigationMenu.Trigger
        className="group flex items-center justify-between gap-2 px-3 py-2 rounded text-[15px] font-medium hover:bg-violet3 outline-none"
        onClick={() => handlePlatformSelect(id)}
        onMouseEnter={() => setOpenShop(id)}
      >
        <Checkbox.Root
          className="flex size-[25px] appearance-none items-center justify-center rounded bg-white outline-none hover:bg-violet3"
          checked={selectedPlatform === id}
          onCheckedChange={() => handlePlatformSelect(id)}
          id={id}
        >
          <Checkbox.Indicator className="text-violet11">
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Root>

        <label
          className={`pl-[15px] text-[15px] leading-none ${
            selectedPlatform === id ? "text-[#004368]" : "text-[#00436866]"
          }`}
          htmlFor={id}
        >
          {t(`${label}`)}
        </label>

        <CaretDownIcon
          className="text-violet10 transition-transform duration-[250ms] ease-in group-data-[state=open]:-rotate-180"
          aria-hidden
        />
      </NavigationMenu.Trigger>

      <NavigationMenu.Content>
        <AnimatePresence>
          {openShop === id && (
            <motion.div
              className="absolute top-full mt-2 left-0 w-[300px] bg-white rounded-md shadow-lg z-50 p-4"
              onMouseEnter={() => setOpenShop(id)}
              onMouseLeave={() => setOpenShop(null)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ul className="flex flex-col gap-2 max-h-[300px] overflow-auto">
                {stores.map((store, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Checkbox.Root
                      className="flex size-[20px] appearance-none items-center justify-center rounded border border-[#004368] hover:bg-violet3"
                      checked={
                        selectedPlatform === id && selectedStore === store.name
                      }
                      onCheckedChange={() => handleStoreSelect(id, store.name)}
                      id={`${id}-${idx}`}
                    >
                      <Checkbox.Indicator className="text-violet11">
                        <CheckIcon />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <label
                      className="text-[14px] text-[#004368] leading-none"
                      htmlFor={`${id}-${idx}`}
                      title={JSON.stringify(store)}
                    >
                      {store.name}
                    </label>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  );

  return (
    <div className="mb-16">
      <p className="text-[#004368] text-[25px] font-[500] capitalize mb-4">
        {t("Select Shop")}
      </p>

      <div className="flex justify-between items-center mr-[3.5vw]">
        <NavigationMenu.Root className="flex w-screen relative z-50">
          <NavigationMenu.List className="flex list-none rounded-md bg-transparent gap-4">
            {shops.map(renderShopItem)}
          </NavigationMenu.List>
        </NavigationMenu.Root>

        <AddShopeModal />
      </div>
    </div>
  );
};

export default ShopSelector;
