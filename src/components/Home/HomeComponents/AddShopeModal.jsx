// import { useState } from "react";
// import { useTranslation } from "react-i18next";
// import { PlusIcon, CheckIcon } from "@radix-ui/react-icons";
// import * as Checkbox from "@radix-ui/react-checkbox";
// import { motion, AnimatePresence } from "framer-motion";

// const shope = [
//   { id: 1, name: "Shopee" },
//   { id: 2, name: "Lazada" },
//   { id: 3, name: "TikTok" },
// ];

// function AddShopeModal() {
//   const { t } = useTranslation();
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedShop, setSelectedShop] = useState(null); // ✅ initially none

//   return (
//     <>
//       <button
//         className="bg-[#004368] text-white ml-4 px-4 h-[32px] w-[15vw] flex gap-2 items-center rounded-[8px] whitespace-nowrap"
//         onClick={() => setIsOpen(true)}
//       >
//         <PlusIcon className="w-5 h-5" />
//         {t("Add Shop")}
//       </button>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className="bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-md"
//               initial={{ scale: 0.9, y: 20, opacity: 0 }}
//               animate={{ scale: 1, y: 0, opacity: 1 }}
//               exit={{ scale: 0.9, y: 20, opacity: 0 }}
//               transition={{ duration: 0.2 }}
//             >
//               <h2 className="text-xl font-bold mb-4 text-[#004368] text-center ">
//                 {t("AddNewShop")}
//               </h2>

//               <div className="flex gap-8 pb-[160px] pt-10">
//                 {shope.map((shop) => (
//                   <div
//                     key={shop.id}
//                     className="flex items-center gap-2 cursor-pointer"
//                     onClick={() => setSelectedShop(shop.id)} // ✅ select only one
//                   >
//                     <Checkbox.Root
//                       className="flex size-[20px] appearance-none items-center justify-center rounded border border-[#004368] bg-white shadow-[0_2px_6px] shadow-blackA4 outline-none"
//                       checked={selectedShop === shop.id} // ✅ controlled
//                       onCheckedChange={() => setSelectedShop(shop.id)} // ✅ force single select
//                       id={`shop-${shop.id}`}
//                     >
//                       <Checkbox.Indicator className="text-[#004368]">
//                         <CheckIcon />
//                       </Checkbox.Indicator>
//                     </Checkbox.Root>
//                     <label
//                       className="text-[15px] leading-none text-[#004368]"
//                       htmlFor={`shop-${shop.id}`}
//                     >
//                       {t(shop.name)}
//                     </label>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex justify-end gap-4 mt-6">
//                 <button
//                   className="bg-[#0043681A] text-[#004368] px-4 py-2 rounded"
//                   style={{ width: "250px" }}
//                   onClick={() => setIsOpen(false)}
//                 >
//                   {t("Cancel")}
//                 </button>
//                 <button
//                   className="bg-[#004368] text-white px-4 py-2 rounded"
//                   style={{ width: "250px" }}
//                   disabled={!selectedShop} // ✅ disable until one selected
//                 >
//                   {t("Next")}
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

// export default AddShopeModal;

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import * as Checkbox from "@radix-ui/react-checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

const shope = [
  { id: 1, name: "Shopee" },
  { id: 2, name: "Lazada" },
  { id: 3, name: "TikTok" },
];

const lazadaCountries = [
  { code: "sg", name: "Singapore", baseUrl: "https://api.lazada.sg/rest" },
  { code: "my", name: "Malaysia", baseUrl: "https://api.lazada.com.my/rest" },
  { code: "th", name: "Thailand", baseUrl: "https://api.lazada.co.th/rest" },
  { code: "vn", name: "Vietnam", baseUrl: "https://api.lazada.vn/rest" },
  {
    code: "ph",
    name: "Philippines",
    baseUrl: "https://api.lazada.com.ph/rest",
  },
  { code: "id", name: "Indonesia", baseUrl: "https://api.lazada.co.id/rest" },
];

const tiktokCountries = [
  {
    code: "MY",
    name: "Malaysia",
    baseUrl: "https://open-api.tiktokglobalshop.com",
  },
];

const shopeeCountries = [
  {
    code: "SG",
    name: "Singapore",
    baseUrl: "https://partner.shopeemobile.com/api/v2",
  },
  {
    code: "MY",
    name: "Malaysia",
    baseUrl: "https://partner.shopeemobile.com/api/v2",
  },
  {
    code: "TH",
    name: "Thailand",
    baseUrl: "https://partner.shopeemobile.com/api/v2",
  },
  {
    code: "VN",
    name: "Vietnam",
    baseUrl: "https://partner.shopeemobile.com/api/v2",
  },
  {
    code: "PH",
    name: "Philippines",
    baseUrl: "https://partner.shopeemobile.com/api/v2",
  },
  {
    code: "ID",
    name: "Indonesia",
    baseUrl: "https://partner.shopeemobile.com/api/v2",
  },
];

function AddShopeModal() {
  const { t } = useTranslation();
  const userEmail = useSelector((state) => state.user.accountUser);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);

  const [lazadaCountry, setLazadaCountry] = useState("");
  const [appKey, setAppKey] = useState("");
  const [appSecret, setAppSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [tiktokCountry, setTiktokCountry] = useState("");
  const [tiktokAppKey, setTiktokAppKey] = useState("");
  const [tiktokAppSecret, setTiktokAppSecret] = useState("");
  const [isTikTokLoading, setIsTikTokLoading] = useState(false);

  const [shopeeCountry, setShopeeCountry] = useState("");
  const [shopeeAppKey, setShopeeAppKey] = useState("");
  const [shopeeAppSecret, setShopeeAppSecret] = useState("");
  const [isShopeeLoading, setIsShopeeLoading] = useState(false);
  const currentUser = useSelector((state) => state.user.accountUser);

  const handleLazadaSubmit = async () => {
    if (selectedShop === 2) {
      if (!lazadaCountry) {
        alert("Please select a country.");
        return;
      }

      try {
        // ✅ Only redirect if save success
        const redirectUrl = `https://auth.lazada.com/oauth/authorize?response_type=code&force_auth=true&redirect_uri=https://grozziie.zjweiting.com:3091/lazada-open-shop/dynamic&client_id=134155&state=${currentUser}`;

        localStorage.setItem("SelectedPlatform", "lazada");
        localStorage.setItem("lazadaAuthCountry", lazadaCountry);
        window.location.href = redirectUrl;
      } catch (err) {
        console.error("Error saving Lazada shop:", err);
        alert("Something went wrong while saving Lazada shop.");
      }
    }
  };

  // const handleLazadaSubmit = async () => {
  //   if (selectedShop === 2) {
  //     if (!lazadaCountry || !appKey || !appSecret) {
  //       alert("Please select a country and enter both APP Key and APP Secret.");
  //       return;
  //     }

  //     setIsLoading(true); // 🟩 Start loading

  //     const selectedCountry = lazadaCountries.find(
  //       (c) => c.code === lazadaCountry
  //     );
  //     const baseUrl = selectedCountry?.baseUrl || "https://api.lazada.com/rest";

  //     try {
  //       // 🟦 Step 1: Call dynamic/add-new API
  //       const dynamicResponse = await fetch(
  //         "https://grozziie.zjweiting.com:3091/lazada-open-shop-debug/api/dev/dynamic/add-new",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             accept: "*/*",
  //           },
  //           body: JSON.stringify({
  //             appKey: appKey,
  //             appSecret: appSecret,
  //             baseUrl: baseUrl,
  //           }),
  //         }
  //       );

  //       const dynamicResult = await dynamicResponse.json();
  //       console.log("Dynamic API result:", dynamicResult);

  //       if (dynamicResponse.status !== 200 || dynamicResult !== true) {
  //         alert("Failed to register app with dynamic config API.");
  //         setIsLoading(false);
  //         return;
  //       }

  //       // 🟩 Step 2: Save Lazada shop
  // const saveResponse = await fetch(
  //   "https://grozziieget.zjweiting.com:8033/tht/grozziiePrinter/lazada/shop/add",
  //   {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       LazadaUserEmail: userEmail,
  //       ShopCountry: lazadaCountry,
  //       LazadaAPPKey: appKey,
  //       active: false,
  //     }),
  //   }
  // );

  // const saveResult = await saveResponse.json();
  // if (saveResult.code !== 201) {
  //   alert("Failed to save Lazada shop. Please try again.");
  //   setIsLoading(false);
  //   return;
  // }

  //       // 🟦 Step 3: Redirect to Lazada OAuth
  //       const redirectUrl = `https://auth.lazada.com/oauth/authorize?response_type=code&force_auth=true&redirect_uri=https://grozziie.zjweiting.com:3091/lazada-open-shop-debug/dynamic&client_id=${encodeURIComponent(
  //         appKey
  //       )}&state=${encodeURIComponent(appKey)}`;

  //       localStorage.setItem("SelectedPlatform", "lazada");
  //       window.location.href = redirectUrl;
  //     } catch (err) {
  //       console.error("Error during Lazada shop setup:", err);
  //       alert("Something went wrong while setting up Lazada shop.");
  //     } finally {
  //       setIsLoading(false); // 🟥 Stop loading after all operations
  //     }
  //   }
  // };

  const handleTikTokSubmit = async () => {
    // if (!tiktokCountry || !tiktokAppKey || !tiktokAppSecret) {
    if (!tiktokCountry) {
      alert("Please fill in all required fields (Country).");
      return;
    }

    setIsTikTokLoading(true);

    try {
      // // 🟣 Step 1: Define base URL for TikTok (can be updated as needed)
      // const baseUrl = "https://open-api.tiktokglobalshop.com";

      // // 🟣 Step 2: Call TikTok dynamic API
      // const response = await fetch(
      //   "https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/dynamic/add-new",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       accept: "*/*",
      //     },
      //     body: JSON.stringify({
      //       appKey: tiktokAppKey,
      //       appSecret: tiktokAppSecret,
      //       baseUrl: baseUrl,
      //       shop_REGION: tiktokCountry,
      //     }),
      //   }
      // );

      // const result = await response.json();
      // console.log("TikTok Dynamic API result:", result);

      // if (response.status !== 200 || result !== true) {
      //   alert("Failed to register TikTok app with dynamic config API.");
      //   setIsTikTokLoading(false);
      //   return;
      // }

      // // 🟢 Step 3: Save selected country and app info
      // localStorage.setItem("tiktokAuthCountry", tiktokCountry);
      // localStorage.setItem("tiktokAppKey", JSON.stringify(tiktokAppKey));

      // 🟢 Step 4: Redirect to TikTok Partner Config
      window.location.href = `https://services.tiktokshop.com/open/authorize?service_id=7525737223036126981&state=${currentUser}`;
    } catch (error) {
      console.error("Error during TikTok setup:", error);
      alert("Something went wrong while setting up TikTok app.");
    } finally {
      setIsTikTokLoading(false);
    }
  };

  const handleShopeeSubmit = async () => {
    if (!shopeeCountry) {
      alert("Please fill in all required fields (Country).");
      return;
    }
    localStorage.setItem("shopeeAuthCountry", shopeeCountry);
    setIsShopeeLoading(true);

    try {
      // 🟢 Step 4: Redirect to Shopee Partner Config
      window.location.href = `https://grozziie.zjweiting.com:3091/shopee-open-shop/auth/url-generate/by-state?state=${currentUser}`;
    } catch (error) {
      console.error("Error during Shopee setup:", error);
      alert("Something went wrong while setting up Shopee app.");
    } finally {
      setIsShopeeLoading(false);
    }
  };

  return (
    <>
      <button
        className="bg-[#004368] text-white ml-4 px-4 h-[32px] w-[15vw] flex gap-2 items-center rounded-[8px] whitespace-nowrap"
        onClick={() => setIsOpen(true)}
      >
        <PlusIcon className="w-5 h-5" />
        {t("Add Shop")}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-md"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* ❌ Close button only for Lazada */}
              {(selectedShop === 1 ||
                selectedShop === 2 ||
                selectedShop === 3) && (
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <Cross2Icon className="w-5 h-5" />
                </button>
              )}
              <h2 className="text-xl font-bold mb-4 text-[#004368] text-center ">
                {t("AddNewShop")}
              </h2>
              {/* Shop selection without disable shopee and lazada */}
              {/* <div className="flex gap-8 pb-6 pt-4">
                {shope.map((shop) => (
                  <div
                    key={shop.id}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setSelectedShop(shop.id)}
                  >
                    <Checkbox.Root
                      className="flex size-[20px] appearance-none items-center justify-center rounded border border-[#004368] bg-white outline-none"
                      checked={selectedShop === shop.id}
                      onCheckedChange={() => setSelectedShop(shop.id)}
                      id={`shop-${shop.id}`}
                    >
                      <Checkbox.Indicator className="text-[#004368]">
                        <CheckIcon />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <label
                      className="text-[15px] leading-none text-[#004368]"
                      htmlFor={`shop-${shop.id}`}
                    >
                      {t(shop.name)}
                    </label>
                  </div>
                ))}
              </div> */}
              {/* Shop selection with disable shopee and lazada */}
              <div className="flex gap-8 pb-6 pt-4">
                {shope.map((shop) => {
                  const isDisabled = shop.name === "None";

                  return (
                    <div
                      key={shop.id}
                      className={`flex items-center gap-2 ${
                        isDisabled
                          ? "opacity-40 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      onClick={() => {
                        if (!isDisabled) setSelectedShop(shop.id);
                      }}
                    >
                      <Checkbox.Root
                        className="flex size-[20px] appearance-none items-center justify-center rounded border border-[#004368] bg-white outline-none"
                        checked={selectedShop === shop.id}
                        onCheckedChange={() => {
                          if (!isDisabled) setSelectedShop(shop.id);
                        }}
                        id={`shop-${shop.id}`}
                        disabled={isDisabled}
                      >
                        <Checkbox.Indicator className="text-[#004368]">
                          <CheckIcon />
                        </Checkbox.Indicator>
                      </Checkbox.Root>

                      <label
                        className={`text-[15px] leading-none ${
                          isDisabled ? "text-gray-400" : "text-[#004368]"
                        }`}
                        htmlFor={`shop-${shop.id}`}
                      >
                        {t(shop.name)}
                      </label>
                    </div>
                  );
                })}
              </div>
              {/* Lazada extra inputs */}
              {selectedShop === 2 && (
                <div className="space-y-4 my-6">
                  {/* Select Country */}
                  <div>
                    <label className="block text-sm font-medium text-[#004368] mb-1">
                      {t("Select Country")}
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={lazadaCountry}
                      onChange={(e) => setLazadaCountry(e.target.value)}
                      required
                    >
                      <option value="">{t("Choose a country")}</option>
                      {lazadaCountries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* APP Key */}
                  {/* <div>
                    <label className="block text-sm font-medium text-[#004368] mb-1">
                      {t("APP Key")}
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={appKey}
                      onChange={(e) => setAppKey(e.target.value)}
                      placeholder="Enter APP Key"
                      required
                    />
                  </div> */}

                  {/* APP Secret */}
                  {/* <div>
                    <label className="block text-sm font-medium text-[#004368] mb-1">
                      {t("APP Secret")}
                    </label>
                    <input
                      type="password"
                      className="w-full border rounded px-3 py-2"
                      value={appSecret}
                      onChange={(e) => setAppSecret(e.target.value)}
                      placeholder="Enter APP Secret"
                      required
                    />
                  </div> */}

                  {/* Submit button */}
                  <button
                    className={`${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#004368]"
                    } text-white px-4 py-2 rounded w-full flex items-center justify-center`}
                    onClick={handleLazadaSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          ></path>
                        </svg>
                        {t("Loading...")}
                      </>
                    ) : (
                      t("Submit")
                    )}
                  </button>
                </div>
              )}

              {/* 🟣 TikTok extra inputs */}
              {selectedShop === 1 && (
                <div className="space-y-4 my-6">
                  {/* Select Country */}
                  <div>
                    <label className="block text-sm font-medium text-[#004368] mb-1">
                      {t("Select Country")}
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={shopeeCountry}
                      onChange={(e) => setShopeeCountry(e.target.value)}
                      required
                    >
                      <option value="">{t("Choose a country")}</option>
                      {shopeeCountries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submit button */}
                  <button
                    className={`${
                      isShopeeLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#004368]"
                    } text-white px-4 py-2 rounded w-full flex items-center justify-center`}
                    onClick={handleShopeeSubmit}
                    disabled={isShopeeLoading}
                  >
                    {isShopeeLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          ></path>
                        </svg>
                        {t("Loading...")}
                      </>
                    ) : (
                      t("Submit")
                    )}
                  </button>
                </div>
              )}

              {/* 🟣 TikTok extra inputs */}
              {selectedShop === 3 && (
                <div className="space-y-4 my-6">
                  {/* Select Country */}
                  <div>
                    <label className="block text-sm font-medium text-[#004368] mb-1">
                      {t("Select Country")}
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={tiktokCountry}
                      onChange={(e) => setTiktokCountry(e.target.value)}
                      required
                    >
                      <option value="">{t("Choose a country")}</option>
                      {tiktokCountries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* App Key */}
                  {/* <div>
                    <label className="block text-sm font-medium text-[#004368] mb-1">
                      {t("APP Key")}
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={tiktokAppKey}
                      onChange={(e) => setTiktokAppKey(e.target.value)}
                      placeholder="Enter APP Key"
                      required
                    />
                  </div> */}

                  {/* App Secret */}
                  {/* <div>
                    <label className="block text-sm font-medium text-[#004368] mb-1">
                      {t("APP Secret")}
                    </label>
                    <input
                      type="password"
                      className="w-full border rounded px-3 py-2"
                      value={tiktokAppSecret}
                      onChange={(e) => setTiktokAppSecret(e.target.value)}
                      placeholder="Enter APP Secret"
                      required
                    />
                  </div> */}

                  {/* Submit button */}
                  <button
                    className={`${
                      isTikTokLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#004368]"
                    } text-white px-4 py-2 rounded w-full flex items-center justify-center`}
                    onClick={handleTikTokSubmit}
                    disabled={isTikTokLoading}
                  >
                    {isTikTokLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          ></path>
                        </svg>
                        {t("Loading...")}
                      </>
                    ) : (
                      t("Submit")
                    )}
                  </button>
                </div>
              )}
              {/* Footer buttons: show only when NOT Lazada */}
              {selectedShop !== 1 &&
                selectedShop !== 2 &&
                selectedShop !== 3 && (
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      className="bg-[#0043681A] text-[#004368] px-4 py-2 rounded"
                      style={{ width: "250px" }}
                      onClick={() => setIsOpen(false)}
                    >
                      {t("Cancel")}
                    </button>
                    <button
                      className="bg-[#004368] text-white px-4 py-2 rounded"
                      style={{ width: "250px" }}
                      disabled={!selectedShop}
                    >
                      {t("Next")}
                    </button>
                  </div>
                )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AddShopeModal;
