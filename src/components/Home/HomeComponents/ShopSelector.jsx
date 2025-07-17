// import * as NavigationMenu from "@radix-ui/react-navigation-menu";
// import * as Checkbox from "@radix-ui/react-checkbox";
// import { CheckIcon, CaretDownIcon, PlusIcon } from "@radix-ui/react-icons";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useTranslation } from "react-i18next";
// import AddShopeModal from "./AddShopeModal";
// import { useSelector } from "react-redux";

// const shops = [
//   {
//     id: "shopee",
//     label: "Shopee",
//     stores: ["Shopee Store A", "Shopee Store B", "Shopee Express"],
//   },
//   {
//     id: "lazada",
//     label: "Lazada",
//     stores: ["Lazada Supermart", "Lazada Xpress", "Lazada Deals"],
//   },
//   {
//     id: "tiktok",
//     label: "TikTok",
//     stores: ["Tiktok Store 1", "Tiktok Pro", "Tiktok Mall"],
//   },
// ];

// const ShopSelector = () => {
//   const { t } = useTranslation();
//   const [checkedShops, setCheckedShops] = useState(
//     shops.reduce((acc, shop) => ({ ...acc, [shop.id]: true }), {})
//   );
//   const [allShops, setAllShops] = useState(false);
//   const toggleShop = (shopId) => {
//     setCheckedShops((prev) => ({
//       ...prev,
//       [shopId]: !prev[shopId],
//     }));
//   };

//   const [openShop, setOpenShop] = useState(null);
//   const TikTokShopList = useSelector((state) => state.allShopList.data);
//   console.log(TikTokShopList, "TikTokShopList");

//   const renderShopItem = ({ id, label, stores }) => (
//     <NavigationMenu.Item className="relative" key={id}>
//       <NavigationMenu.Trigger
//         className="group flex items-center justify-between gap-2 px-3 py-2 rounded text-[15px] font-medium hover:bg-violet3 outline-none"
//         onMouseEnter={() => setOpenShop(id)}
//         onMouseLeave={() => setOpenShop(null)}
//       >
//         <Checkbox.Root
//           className="flex size-[25px] appearance-none items-center justify-center rounded bg-white  outline-none hover:bg-violet3 focus:outline-none focus:shadow-none"
//           checked={checkedShops[id]}
//           onCheckedChange={() => toggleShop(id)}
//           id={id}
//         >
//           <Checkbox.Indicator className="text-violet11">
//             <CheckIcon />
//           </Checkbox.Indicator>
//         </Checkbox.Root>

//         <label
//           className={`pl-[15px] text-[15px] leading-none ${
//             checkedShops[id] ? "text-[#004368]" : "text-[#00436866]"
//           }`}
//           htmlFor={id}
//         >
//           {t(`${label}`)}
//         </label>

//         <CaretDownIcon
//           className="text-violet10 transition-transform duration-[250ms] ease-in group-data-[state=open]:-rotate-180"
//           aria-hidden
//         />
//       </NavigationMenu.Trigger>

//       {/* Dropdown content with framer motion */}
//       <AnimatePresence>
//         {openShop === id && (
//           <motion.div
//             className="absolute top-full mt-2 left-0 w-[200px] bg-white rounded-md shadow-lg z-50 p-4"
//             onMouseEnter={() => setOpenShop(id)}
//             onMouseLeave={() => setOpenShop(null)}
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.2 }}
//           >
//             <ul className="flex flex-col gap-2">
//               {stores.map((store, idx) => (
//                 <li key={idx} className="flex items-center gap-2">
//                   <Checkbox.Root
//                     className="flex size-[20px] appearance-none items-center justify-center rounded bg-white shadow-[0_2px_6px] shadow-blackA4 outline-none hover:bg-violet3 focus:outline-none focus:shadow-none"
//                     defaultChecked
//                     id={`${id}-${idx}`}
//                   >
//                     <Checkbox.Indicator className="text-violet11">
//                       <CheckIcon />
//                     </Checkbox.Indicator>
//                   </Checkbox.Root>
//                   <label
//                     className="text-[14px] text-[#004368] leading-none"
//                     htmlFor={`${id}-${idx}`}
//                   >
//                     {store}
//                   </label>
//                 </li>
//               ))}
//             </ul>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </NavigationMenu.Item>
//   );

//   return (
//     <div>
//       <p className="text-[#004368] text-[25px] font-[500] capitalize mb-4">
//         {t("Select Shop")}
//       </p>

//       <div className="flex justify-between items-center mr-[3.5vw]">
//         <NavigationMenu.Root className="flex w-screen relative z-50">
//           <NavigationMenu.List className="flex list-none rounded-md bg-transparent gap-4">
//             <div className="flex items-center">
//               <Checkbox.Root
//                 className="flex size-[25px] appearance-none items-center justify-center rounded bg-white outline-none hover:bg-violet3 focus:outline-none focus:shadow-none"
//                 checked={allShops}
//                 onCheckedChange={(value) => setAllShops(value)}
//               >
//                 <Checkbox.Indicator className="text-violet11">
//                   <CheckIcon />
//                 </Checkbox.Indicator>
//               </Checkbox.Root>

//               <label
//                 className={`pl-[15px] text-[15px] leading-none ${
//                   allShops
//                     ? "text-[#004368] font-[500]"
//                     : "text-[#00436866] font-[500]"
//                 }`}
//                 htmlFor={"All Shops"}
//               >
//                 {t("All Shops")}
//               </label>
//             </div>
//             {shops.map(renderShopItem)}
//           </NavigationMenu.List>
//         </NavigationMenu.Root>

//         <AddShopeModal />
//       </div>
//     </div>
//   );
// };

// export default ShopSelector;

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon, CaretDownIcon, PlusIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import AddShopeModal from "./AddShopeModal";
import { useSelector } from "react-redux";

const ShopSelector = () => {
  const { t } = useTranslation();
  const TikTokShopList = useSelector((state) => state.allShopList.data);

  // Base shops (hardcoded)
  const baseShops = [
    {
      id: "shopee",
      label: "Shopee",
      stores: ["Shopee Store A", "Shopee Store B", "Shopee Express"],
    },
    {
      id: "lazada",
      label: "Lazada",
      stores: ["Lazada Supermart", "Lazada Xpress", "Lazada Deals"],
    },
  ];

  // Final shops with dynamic TikTok added
  const shops = [
    ...baseShops,
    {
      id: "tiktok",
      label: "TikTok",
      stores: TikTokShopList?.map((shop) => shop.name) || [],
    },
  ];

  const [checkedShops, setCheckedShops] = useState(
    shops.reduce((acc, shop) => ({ ...acc, [shop.id]: true }), {})
  );

  // Sync checked state if TikTokShopList updates
  useEffect(() => {
    setCheckedShops((prev) =>
      shops.reduce((acc, shop) => {
        if (prev.hasOwnProperty(shop.id)) return acc;
        return { ...acc, [shop.id]: true };
      }, prev)
    );
  }, [TikTokShopList]);

  const [allShops, setAllShops] = useState(false);
  const [openShop, setOpenShop] = useState(null);

  const toggleShop = (shopId) => {
    setCheckedShops((prev) => ({
      ...prev,
      [shopId]: !prev[shopId],
    }));
  };

  const renderShopItem = ({ id, label, stores }) => (
    <NavigationMenu.Item className="relative" key={id}>
      <NavigationMenu.Trigger
        className="group flex items-center justify-between gap-2 px-3 py-2 rounded text-[15px] font-medium hover:bg-violet3 outline-none"
        onMouseEnter={() => setOpenShop(id)}
        onMouseLeave={() => setOpenShop(null)}
      >
        <Checkbox.Root
          className="flex size-[25px] appearance-none items-center justify-center rounded bg-white  outline-none hover:bg-violet3 focus:outline-none focus:shadow-none"
          checked={checkedShops[id]}
          onCheckedChange={() => toggleShop(id)}
          id={id}
        >
          <Checkbox.Indicator className="text-violet11">
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Root>

        <label
          className={`pl-[15px] text-[15px] leading-none ${
            checkedShops[id] ? "text-[#004368]" : "text-[#00436866]"
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

      {/* Dropdown content with framer motion */}
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
            <ul className="flex flex-col gap-2">
              {stores.map((store, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Checkbox.Root
                    className="flex size-[20px] appearance-none items-center justify-center rounded bg-white shadow-[0_2px_6px] shadow-blackA4 outline-none hover:bg-violet3 focus:outline-none focus:shadow-none"
                    defaultChecked
                    id={`${id}-${idx}`}
                  >
                    <Checkbox.Indicator className="text-violet11">
                      <CheckIcon />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label
                    className="text-[14px] text-[#004368] leading-none"
                    htmlFor={`${id}-${idx}`}
                  >
                    {store}
                  </label>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </NavigationMenu.Item>
  );

  return (
    <div>
      <p className="text-[#004368] text-[25px] font-[500] capitalize mb-4">
        {t("Select Shop")}
      </p>

      <div className="flex justify-between items-center mr-[3.5vw]">
        <NavigationMenu.Root className="flex w-screen relative z-50">
          <NavigationMenu.List className="flex list-none rounded-md bg-transparent gap-4">
            <div className="flex items-center">
              <Checkbox.Root
                className="flex size-[25px] appearance-none items-center justify-center rounded bg-white outline-none hover:bg-violet3 focus:outline-none focus:shadow-none"
                checked={allShops}
                onCheckedChange={(value) => setAllShops(value)}
              >
                <Checkbox.Indicator className="text-violet11">
                  <CheckIcon />
                </Checkbox.Indicator>
              </Checkbox.Root>

              <label
                className={`pl-[15px] text-[15px] leading-none ${
                  allShops
                    ? "text-[#004368] font-[500]"
                    : "text-[#00436866] font-[500]"
                }`}
                htmlFor={"All Shops"}
              >
                {t("All Shops")}
              </label>
            </div>
            {shops.map(renderShopItem)}
          </NavigationMenu.List>
        </NavigationMenu.Root>

        <AddShopeModal />
      </div>
    </div>
  );
};

export default ShopSelector;
