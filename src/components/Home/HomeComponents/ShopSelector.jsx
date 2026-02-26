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

  console.log(selectedStore, selectedPlatform);

  // Initialize with first TikTok shop if available
  // useEffect(() => {
  //   if (TikTokShopList?.length > 0) {
  //     setSelectedPlatform(selectedPlatform);
  //     setSelectedStore(TikTokShopList[0].name);
  //     saveShopToLocalStorage("tiktok", [TikTokShopList[0]]);
  //   }
  // }, [TikTokShopList]);

  useEffect(() => {
    const listsReady =
      TikTokShopList?.length > 0 ||
      ShopeeShopList?.length > 0 ||
      LazadaShopList?.length > 0;

    if (!listsReady) return; // 🛑 Wait until shop lists are ready

    const storedPlatform = localStorage.getItem("SelectedPlatform");
    const storedShopName = localStorage.getItem("SelectedStore");
    const shopeeAuthShopId = localStorage.getItem("shopeeAuthShopId");

    if (storedPlatform && storedShopName) {
      setSelectedPlatform(storedPlatform);
      setSelectedStore(storedShopName);
      console.log("🔁 Restored selection:", storedPlatform, storedShopName);
      return;
    }

    // 🔹 Step 2: Define disable/enable logic
    const isTikTokDisabled = TikTokShopList?.length === 0; // true if no TikTok shops
    const hasTikTokShops = TikTokShopList?.length > 0;

    // 🔹 Step 3: Prefer TikTok if available and not disabled
    if (hasTikTokShops && !isTikTokDisabled) {
      setSelectedPlatform("tiktok");
      setSelectedStore(TikTokShopList[0].name);
      saveShopToLocalStorage("tiktok", [TikTokShopList[0]]);
      localStorage.setItem("SelectedPlatform", "tiktok");
      localStorage.setItem("SelectedStore", TikTokShopList[0].name);
      localStorage.setItem("SelectedTikTokStore", TikTokShopList[0].name);
      localStorage.setItem("tiktokAuthCountry", TikTokShopList[0].region);
      console.log("✅ Defaulted to TikTok");
    } else {
      // 🔹 Step 4: Fallback to Shopee → Lazada
      const fallbackPlatform = ["shopee", "lazada"].find((p) => {
        if (p === "lazada" && LazadaShopList?.length > 0) return true;
        if (p === "shopee" && ShopeeShopList?.length > 0) return true;
        return false;
      });

      if (fallbackPlatform) {
        const platformList =
          fallbackPlatform === "shopee" ? ShopeeShopList : LazadaShopList;
        const firstShop = platformList[0];

        if (firstShop) {
          setSelectedPlatform(fallbackPlatform);
          setSelectedStore(firstShop.name);
          saveShopToLocalStorage(fallbackPlatform, [firstShop]);
          localStorage.setItem("SelectedPlatform", fallbackPlatform);
          localStorage.setItem("SelectedStore", firstShop.name);

          if (fallbackPlatform === "shopee") {
            localStorage.setItem("shopeeAuthCountry", "MY");
          } else if (fallbackPlatform === "lazada") {
            localStorage.setItem("lazadaAuthCountry", "my");
          }

          console.log("🟡 Defaulted to fallback:", fallbackPlatform);
        }
      }
    }
  }, [TikTokShopList, ShopeeShopList, LazadaShopList, selectedPlatform]);

  // Save full shop array with only one selected shop object for each platform
  const saveShopToLocalStorage = (platformId, shopArray) => {
    const key = `${platformId}ShopInfo`;
    localStorage.setItem(key, JSON.stringify(shopArray));
  };

  // const handlePlatformSelect = (platformId) => {
  //   setSelectedPlatform(platformId);
  //   localStorage.setItem("SelectedPlatform", platformId);

  //   const platformObj = shops.find((shop) => shop.id === platformId);
  //   if (!platformObj) return;

  //   // 🟦 Lazada special handling
  //   if (platformId === "lazada") {
  //     const savedLazada = JSON.parse(localStorage.getItem("lazadaShopInfo"));
  //     console.log(savedLazada, "saveLazada");

  //     if (savedLazada && savedLazada.length > 0) {
  //       setSelectedStore(savedLazada[0].name);
  //       localStorage.setItem("SelectedStore", savedLazada[0].name);
  //       saveShopToLocalStorage("lazada", savedLazada);
  //       console.log(savedLazada[0].cipher, "testinnnnn");

  //       localStorage.setItem("lazadaAppKey", savedLazada[0].cipher);
  //       localStorage.setItem("lazadaAccountId", savedLazada[0].cipher);
  //       localStorage.setItem("lazadaAppKeyShopInfo", savedLazada[0].cipher);
  //       localStorage.setItem("lazadaAuthCountry", savedLazada[0].region);
  //       return;
  //     }
  //   }

  //   // 🟦 Lazada special handling
  //   // 🟦 Shopee special handling
  //   else if (platformId === "shopee") {
  //     const savedShopee = JSON.parse(localStorage.getItem("shopeeShopInfo"));
  //     const shopeeAuthShopId = localStorage.getItem("shopeeAuthShopId");

  //     console.log(savedShopee, "savedShopee shopeeShopInfo");

  //     if (savedShopee && savedShopee.length > 0) {
  //       localStorage.setItem("shopeeAuthCountry", "MY");

  //       let selectedShop = savedShopee[0]; // default to first shop

  //       if (shopeeAuthShopId) {
  //         const matchedShop = savedShopee.find(
  //           (shop) => String(shop.cipher) === String(shopeeAuthShopId)
  //         );
  //         if (matchedShop) selectedShop = matchedShop;
  //       }

  //       // Save selected shop info
  //       setSelectedStore(selectedShop.name);
  //       localStorage.setItem("SelectedStore", selectedShop.name);
  //       saveShopToLocalStorage("shopee", savedShopee);
  //       saveShopToLocalStorage("shopeeAppKey", Number(selectedShop.cipher));
  //       saveShopToLocalStorage("shopeeAuthShopId", Number(selectedShop.cipher));

  //       return;
  //     }
  //   }

  //   // 🟪 TikTok special handling
  //   else if (platformId === "tiktok") {
  //     const savedTikTok =
  //       JSON.parse(localStorage.getItem("tiktokShopInfo")) || [];
  //     const prevSelected = JSON.parse(
  //       localStorage.getItem("SelectedTikTokStore")
  //     );

  //     let selectedStoreObj;

  //     if (prevSelected) {
  //       // ✅ If previously selected store exists, restore it
  //       selectedStoreObj = savedTikTok.find((s) => s.name === prevSelected);
  //     }

  //     if (!selectedStoreObj && platformObj.stores.length > 0) {
  //       // ✅ Otherwise, use the first one
  //       selectedStoreObj = platformObj.stores[0];
  //     }

  //     if (selectedStoreObj) {
  //       setSelectedStore(selectedStoreObj.name);
  //       localStorage.setItem(
  //         "SelectedTikTokStore",
  //         JSON.stringify(selectedStoreObj.name)
  //       );
  //       localStorage.setItem(
  //         "SelectedStore",
  //         JSON.stringify(selectedStoreObj.name)
  //       );
  //       saveShopToLocalStorage("tiktok", [selectedStoreObj]);
  //       const appKeyValue = selectedStoreObj.tiktokOpenId;
  //       const appCipherValue = selectedStoreObj.cipher;

  //       // Remove accidental quotes if any
  //       const cleanedAppKey =
  //         typeof appKeyValue === "string"
  //           ? appKeyValue.replace(/^"|"$/g, "")
  //           : String(appKeyValue);

  //       localStorage.setItem("tiktokOpenId", cleanedAppKey);
  //       localStorage.setItem("tiktokAuthCipher", appCipherValue);
  //       localStorage.setItem("tiktokAuthCountry", "MY");
  //     }
  //     return;
  //   }

  //   // 🟩 Default handling for other platforms
  //   if (platformObj.stores.length > 0) {
  //     const firstStore = platformObj.stores[0];
  //     setSelectedStore(firstStore.name);
  //     localStorage.setItem("SelectedStore", firstStore.name);
  //     saveShopToLocalStorage(platformId, [firstStore]);
  //     localStorage.setItem("lazadaAppKey", firstStore.cipher);
  //     localStorage.setItem("lazadaAccountId", firstStore.cipher);
  //     localStorage.setItem("lazadaAppKeyShopInfo", firstStore.cipher);
  //     localStorage.setItem("lazadaAuthCountry", firstStore.region);
  //   } else {
  //     setSelectedStore(null);
  //   }
  // };

  // Select a store under platform — save full object array with 1 selected object

  // 1. UPDATE: handlePlatformSelect function
  // FIND the existing handlePlatformSelect function and REPLACE with this:

  const handlePlatformSelect = (platformId) => {
    setSelectedPlatform(platformId);
    localStorage.setItem("SelectedPlatform", platformId);

    const platformObj = shops.find((shop) => shop.id === platformId);
    if (!platformObj) return;

    // 🟦 Lazada special handling
    if (platformId === "lazada") {
      const savedLazada = JSON.parse(localStorage.getItem("lazadaShopInfo"));
      const savedStoreName = localStorage.getItem("SelectedStore");
      console.log(savedLazada, "saveLazada");

      if (savedLazada && savedLazada.length > 0) {
        // ✅ Check if saved store name matches platform
        const currentStore = savedLazada.find((s) => s.name === savedStoreName);
        const storeToUse = currentStore || savedLazada[0];

        setSelectedStore(storeToUse.name);
        localStorage.setItem("SelectedStore", storeToUse.name);
        saveShopToLocalStorage("lazada", savedLazada);

        localStorage.setItem("lazadaAppKey", storeToUse.cipher);
        localStorage.setItem("lazadaAccountId", storeToUse.cipher);
        localStorage.setItem("lazadaAppKeyShopInfo", storeToUse.cipher);
        localStorage.setItem("lazadaAuthCountry", storeToUse.region);
        return;
      }
    }

    // 🟦 Shopee special handling
    else if (platformId === "shopee") {
      const savedShopee = JSON.parse(localStorage.getItem("shopeeShopInfo"));
      const shopeeAuthShopId = localStorage.getItem("shopeeAuthShopId");
      const savedStoreName = localStorage.getItem("SelectedStore");

      console.log(savedShopee, "savedShopee shopeeShopInfo");

      if (savedShopee && savedShopee.length > 0) {
        let selectedShop = savedShopee[0]; // default to first shop

        // ✅ Priority 1: Match by saved store name
        if (savedStoreName) {
          const matchedByName = savedShopee.find(
            (shop) => String(shop.name) === String(savedStoreName),
          );
          console.log(matchedByName, "matchedByName");
          if (matchedByName) selectedShop = matchedByName;
        }
        // ✅ Priority 2: Match by shopeeAuthShopId (only if no name match)
        else if (shopeeAuthShopId) {
          const matchedShop = savedShopee.find(
            (shop) => String(shop.cipher) === String(shopeeAuthShopId),
          );
          console.log(matchedShop, "matchedShop");
          if (matchedShop) selectedShop = matchedShop;
        }

        console.log(selectedShop, "selectedShop", savedShopee);

        // ✅ CRITICAL FIX: Use store.name (not cipher) for selectedStore
        setSelectedStore(selectedShop.name); // ✅ This was correct
        localStorage.setItem("SelectedStore", selectedShop.name); // ✅ This was correct
        saveShopToLocalStorage("shopee", [selectedShop]);
        localStorage.setItem("shopeeAppKey", String(selectedShop.cipher));
        localStorage.setItem("shopeeAuthShopId", String(selectedShop.cipher));
        localStorage.setItem("shopeeAuthCountry", selectedShop.region);

        return;
      }
    }

    // 🟪 TikTok special handling
    else if (platformId === "tiktok") {
      const savedTikTok =
        JSON.parse(localStorage.getItem("tiktokShopInfo")) || [];
      const savedStoreName = localStorage.getItem("SelectedStore");

      let selectedStoreObj = null;

      // ✅ Priority 1: Match by saved store name
      if (savedStoreName && savedTikTok.length > 0) {
        selectedStoreObj = savedTikTok.find((s) => s.name === savedStoreName);
      }

      // ✅ Priority 2: If nothing matched, use FIRST store
      if (!selectedStoreObj && savedTikTok.length > 0) {
        selectedStoreObj = savedTikTok[0];
      }

      // ✅ Priority 3: Absolute fallback (platform data)
      if (!selectedStoreObj && platformObj?.stores?.length > 0) {
        selectedStoreObj = platformObj.stores[0];
      }

      if (selectedStoreObj) {
        // UI state
        setSelectedStore(selectedStoreObj.name);

        // helper: set only if not exists
        const setIfNotExists = (key, value) => {
          if (value === undefined || value === null) return;
          const existing = localStorage.getItem(key);
          if (!existing) {
            localStorage.setItem(
              key,
              typeof value === "string" ? value : JSON.stringify(value),
            );
          }
        };

        // ✅ Store selection
        localStorage.setItem("SelectedStore", selectedStoreObj.name);
        localStorage.setItem("SelectedTikTokStore", selectedStoreObj.name);

        // ✅ Ensure shop info exists
        setIfNotExists(
          "tiktokShopInfo",
          savedTikTok.length ? savedTikTok : [selectedStoreObj],
        );

        // ✅ Ensure auth values exist
        const cleanedOpenId =
          typeof selectedStoreObj.tiktokOpenId === "string"
            ? selectedStoreObj.tiktokOpenId.replace(/^"|"$/g, "")
            : String(selectedStoreObj.tiktokOpenId);

        setIfNotExists("tiktokOpenId", cleanedOpenId);
        setIfNotExists("tiktokAuthCipher", selectedStoreObj.cipher);
        setIfNotExists("tiktokAuthCountry", "MY");
      }

      return;
    }

    // 🟩 Default handling for other platforms
    if (platformObj.stores.length > 0) {
      const firstStore = platformObj.stores[0];
      setSelectedStore(firstStore.name);
      localStorage.setItem("SelectedStore", firstStore.name);
      saveShopToLocalStorage(platformId, [firstStore]);
      localStorage.setItem("lazadaAppKey", firstStore.cipher);
      localStorage.setItem("lazadaAccountId", firstStore.cipher);
      localStorage.setItem("lazadaAppKeyShopInfo", firstStore.cipher);
      localStorage.setItem("lazadaAuthCountry", firstStore.region);
    } else {
      setSelectedStore(null);
    }
  };

  const handleStoreSelect = (platformId, storeName) => {
    setSelectedPlatform(platformId);
    localStorage.setItem("SelectedPlatform", platformId);
    setSelectedStore(storeName);
    localStorage.setItem("SelectedStore", storeName);

    const platformObj = shops.find((shop) => shop.id === platformId);
    if (!platformObj) return;

    const fullShopObj = platformObj.stores.find(
      (shop) => shop.name === storeName,
    );

    if (fullShopObj) {
      saveShopToLocalStorage(platformId, [fullShopObj]);

      // 🟦 Lazada: also save the APP key as number
      if (platformId === "lazada") {
        localStorage.setItem(
          "lazadaAppKey",
          JSON.stringify(fullShopObj.cipher),
        );
        localStorage.setItem("lazadaAuthCountry", fullShopObj.region);
        localStorage.setItem("lazadaAccountId", fullShopObj.cipher);
        localStorage.setItem("lazadaAppKeyShopInfo", fullShopObj.cipher);
      }
      // ✅ Fix typo: tiktok
      else if (platformId === "tiktok") {
        const appKeyValue = fullShopObj?.tiktokOpenId;
        const appCipherValue = fullShopObj?.cipher;

        // Remove accidental quotes if any
        const cleanedAppKey =
          typeof appKeyValue === "string"
            ? appKeyValue.replace(/^"|"$/g, "")
            : String(appKeyValue);

        localStorage.setItem("SelectedTikTokStore", storeName);
        localStorage.setItem("tiktokOpenId", cleanedAppKey);
        localStorage.setItem("tiktokAuthCipher", appCipherValue);
        localStorage.setItem("tiktokAuthCountry", "MY");
      }
      // ✅ Fix typo: Shopee
      else if (platformId === "shopee") {
        console.log("Shopee store selected:", fullShopObj);

        const appKeyValue = fullShopObj?.cipher;

        const cleanedAppKey =
          typeof appKeyValue === "string"
            ? appKeyValue.replace(/^"|"$/g, "")
            : String(appKeyValue);

        localStorage.setItem("shopeeAppKey", cleanedAppKey);
        localStorage.setItem("shopeeAuthCountry", fullShopObj?.region || "MY");
        localStorage.setItem("shopeeAuthShopId", cleanedAppKey);
      }
    }
  };
  const getStoreLabel = (store, platform) => {
    if (!store) return "";

    if (platform === "tiktok") {
      return `${store.region ?? ""}-${store.name ?? ""}`;
    }

    if (platform === "shopee") {
      // const last3 = String(store.name ?? "").slice(-3);
      return `${store.region ?? ""}-${store.name}`;
    }

    return store.name ?? "";
  };

  // With Disable the shop button this renderShopItem code need to use ............................
  const renderShopItem = ({ id, label, stores }) => {
    // const isDisabled = id === "tiktok" || id === "lazada";
    const isDisabled = id === "None";

    return (
      <NavigationMenu.Item className="relative" key={id}>
        <NavigationMenu.Trigger
          className={`group flex items-center justify-between gap-2 px-3 py-2 rounded text-[15px] font-medium outline-none
          ${
            isDisabled
              ? "opacity-40 cursor-not-allowed pointer-events-none"
              : "hover:bg-violet3"
          }
        `}
          onClick={() => !isDisabled && handlePlatformSelect(id)}
          onMouseEnter={() => !isDisabled && setOpenShop(id)}
        >
          {/* <Checkbox.Root
            className="flex size-[25px] appearance-none items-center justify-center rounded bg-white outline-none hover:bg-violet3"
            checked={selectedPlatform === id}
            onCheckedChange={() => !isDisabled && handlePlatformSelect(id)}
            id={id}
            disabled={isDisabled}
          >
            <Checkbox.Indicator className="text-violet11">
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox.Root> */}

          <Checkbox.Root
            className="flex size-[25px] appearance-none items-center justify-center rounded bg-white outline-none hover:bg-violet3 data-[state=checked]:bg-[#004368]"
            checked={selectedPlatform === id}
            onCheckedChange={() => !isDisabled && handlePlatformSelect(id)}
            id={id}
            disabled={isDisabled}
          >
            <Checkbox.Indicator className="text-white">
              <CheckIcon className="w-5 h-5 font-bold" />
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

          {!isDisabled && (
            <CaretDownIcon
              className="text-violet10 transition-transform duration-[250ms] ease-in group-data-[state=open]:-rotate-180"
              aria-hidden
            />
          )}
        </NavigationMenu.Trigger>

        {!isDisabled && (
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
                        {/* <Checkbox.Root
                          className="flex size-[20px] appearance-none items-center justify-center rounded border border-[#004368] hover:bg-violet3"
                          checked={
                            selectedPlatform === id &&
                            selectedStore === store.name
                          }
                          onCheckedChange={() =>
                            handleStoreSelect(id, store.name)
                          }
                          id={`${id}-${idx}`}
                        >
                          <Checkbox.Indicator className="text-violet11">
                            <CheckIcon />
                          </Checkbox.Indicator>
                        </Checkbox.Root> */}

                        <Checkbox.Root
                          className="flex size-[20px] appearance-none items-center justify-center rounded border border-[#004368] hover:bg-violet3 data-[state=checked]:bg-[#004368]"
                          checked={
                            selectedPlatform === id &&
                            String(selectedStore) === String(store.name)
                          }
                          onCheckedChange={() =>
                            handleStoreSelect(id, store.name)
                          }
                          id={`${id}-${idx}`}
                        >
                          <Checkbox.Indicator className="text-white">
                            <CheckIcon className="w-4 h-4 font-bold" />
                          </Checkbox.Indicator>
                        </Checkbox.Root>

                        <label
                          className="text-[14px] text-[#004368] leading-none"
                          htmlFor={`${id}-${idx}`}
                        >
                          {getStoreLabel(store, id)}
                        </label>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </NavigationMenu.Content>
        )}
      </NavigationMenu.Item>
    );
  };

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
