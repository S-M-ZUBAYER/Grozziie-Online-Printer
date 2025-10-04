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
  { code: "MY", name: "Malaysia" },
  { code: "TH", name: "Thailand" },
  { code: "VN", name: "Vietnam" },
  { code: "ID", name: "Indonesia" },
  { code: "PH", name: "Philippines" },
  { code: "CN", name: "China" },
];

function AddShopeModal() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [lazadaCountry, setLazadaCountry] = useState("");
  const [appKey, setAppKey] = useState("");
  const userEmail = useSelector((state) => state.user.accountUser);

  const handleLazadaSubmit = async () => {
    if (selectedShop === 2) {
      if (!lazadaCountry || !appKey) {
        alert("Please select a country and enter an APP key.");
        return;
      }

      try {
        // Store Lazada shop in DB before redirect
        const response = await fetch(
          "http://localhost:2000/tht/grozziiePrinter/lazada/shop/add", // adjust to your backend API base
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              LazadaUserEmail: userEmail, // from redux
              ShopCountry: lazadaCountry,
              LazadaAPPKey: appKey,
              active: false, // default inactive until OAuth success
            }),
          }
        );

        const result = await response.json();
        if (result.code !== 201) {
          alert("Failed to save Lazada shop. Please try again.");
          return;
        }

        // ✅ Only redirect if save success
        const redirectUrl = `https://auth.lazada.com/oauth/authorize?response_type=code&force_auth=true&redirect_uri=https://grozziie.zjweiting.com:3091/lazada-open-shop-debug/dynamic&client_id=${encodeURIComponent(
          appKey
        )}&state=${encodeURIComponent(appKey)}`;

        localStorage.setItem("SelectedPlatform", "lazada");
        window.location.href = redirectUrl;
      } catch (err) {
        console.error("Error saving Lazada shop:", err);
        alert("Something went wrong while saving Lazada shop.");
      }
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
              {selectedShop === 2 && (
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

              {/* Shop selection */}
              <div className="flex gap-8 pb-6 pt-4">
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
              </div>

              {/* Lazada extra inputs */}
              {selectedShop === 2 && (
                <div className="space-y-4 my-6">
                  <div>
                    <label className="block text-sm font-medium text-[#004368] mb-1">
                      {t("Select Country")}
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={lazadaCountry}
                      onChange={(e) => setLazadaCountry(e.target.value)}
                    >
                      <option value="">{t("Choose a country")}</option>
                      {lazadaCountries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#004368] mb-1">
                      {t("APP Key")}
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={appKey}
                      onChange={(e) => setAppKey(e.target.value)}
                      placeholder="Enter APP Key"
                    />
                  </div>

                  <button
                    className="bg-[#004368] text-white px-4 py-2 rounded w-full"
                    onClick={handleLazadaSubmit}
                  >
                    {t("Submit")}
                  </button>
                </div>
              )}

              {/* Footer buttons: show only when NOT Lazada */}
              {selectedShop !== 2 && (
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
