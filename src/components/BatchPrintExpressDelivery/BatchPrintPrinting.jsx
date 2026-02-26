// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import FadeLoader from "react-spinners/FadeLoader";
// import { HiOutlinePrinter } from "react-icons/hi2";
// import { checkedItemsChange } from "../../features/slice/userSlice";
// import { useTranslation } from "react-i18next";
// import ConfirmationModal from "../../Share/ConfirmationModal";

// const BatchPrintPrinting = () => {
//   const checkedItems = useSelector((state) => state.user.checkedItemsFromRedux);
//   const selectedLanguage = useSelector(
//     (state) => state.user.selectedLanguageRedux,
//   );
//   const currentUser = useSelector((state) => state.user.accountUser);
//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//   const [modalTitle, setModalTitle] = useState("");
//   const [modalMessage, setModalMessage] = useState("");
//   const [confirmAction, setConfirmAction] = useState(null);
//   const [showConfirmButton, setShowConfirmButton] = useState(false);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [tikTokPdf, setTikTokPdf] = useState(null);
//   const [warehouses, setWarehouses] = useState([]);
//   const [shipmentProviders, setShipmentProviders] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const tiktokAppKey = localStorage.getItem("tiktokAppKey");
//   const tiktokAuthCountry = localStorage.getItem("tiktokAuthCountry");
//   const tiktokOpenId = localStorage.getItem("tiktokOpenId");
//   const { t } = useTranslation();

//   const cipher = localStorage.getItem("tiktokAuthCipher");

//   const currentItem = checkedItems?.items?.[0]; // Show first item for warehouse/delivery
//   const tiktokPrintingLebelList = [
//     { id: 1, lebel: "SHIPPING_LABEL" },
//     { id: 2, lebel: "SHIPPING_LABEL_AND_PACKING_SLIP" },
//   ];

//   const [checkedLebelItems, setCheckedLebelItems] = useState([1]); // default

//   // Load from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem("tiktokPrintingLebel");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       setCheckedLebelItems(parsed === 2 ? [1, 2] : [1]);
//     }
//   }, []);

//   // Update localStorage + selected value

//   const documentType = checkedLebelItems.includes(2)
//     ? "SHIPPING_LABEL_AND_PACKING_SLIP"
//     : "SHIPPING_LABEL";
//   useEffect(() => {
//     const selectedTiktokPrintLebel = checkedLebelItems.includes(2) ? 2 : 1;

//     localStorage.setItem(
//       "tiktokPrintingLebel",
//       JSON.stringify(selectedTiktokPrintLebel),
//     );
//   }, [checkedLebelItems]);

//   const handleCheck = (id) => {
//     setCheckedLebelItems((prev) => {
//       // toggle
//       let next = prev.includes(id)
//         ? prev.filter((x) => x !== id)
//         : [...prev, id];

//       // ❌ disallow empty → fallback to 1
//       if (next.length === 0) return [1];

//       // ✅ if 2 selected, 1 must be included
//       if (next.includes(2) && !next.includes(1)) {
//         next = [1, 2];
//       }
//       return next;
//     });
//   };

//   const fetchWarehouses = async () => {
//     try {
//       // const res = await fetch(
//       //   `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/logistics/warehouse-list?cipher=${cipher[0].cipher}`
//       // );
//       const res = await fetch(
//         `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/logistics/warehouse-list?cipher=${encodeURIComponent(
//           cipher,
//         )}&openId=${encodeURIComponent(tiktokOpenId)}`,
//       );
//       const json = await res.json();
//       if (json.code === 0) setWarehouses(json.data.warehouses || []);
//     } catch (err) {
//       console.error("Failed to fetch warehouses:", err);
//     }
//   };

//   const fetchShipmentProviders = async () => {
//     try {
//       // const res = await fetch(
//       //   `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/logistics/warehouse/delivery-option?warehouseId=${currentItem?.warehouseId}&cipher=${cipher[0].cipher}`
//       // );
//       const res = await fetch(
//         `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/logistics/warehouse/delivery-option?warehouseId=${encodeURIComponent(
//           currentItem?.warehouseId,
//         )}&cipher=${encodeURIComponent(cipher)}&openId=${encodeURIComponent(
//           tiktokOpenId,
//         )}`,
//       );
//       const json = await res.json();
//       if (json.code === 0)
//         setShipmentProviders(json.data.deliveryOptions || []);
//     } catch (err) {
//       console.error("Failed to fetch shipment providers:", err);
//     }
//   };

//   const showErrorModal = (message) => {
//     setModalTitle(
//       <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
//         <TiInfoOutline className="w-10 h-10 text-red-600" />
//       </div>,
//     );
//     setModalMessage(<p>{message}</p>);
//     setConfirmAction(null);
//     setShowConfirmButton(false);
//     setIsConfirmModalOpen(true);
//   };

//   const handleMergeAndPrint = async () => {
//     try {
//       setIsLoading(true);

//       if (!cipher || !checkedItems?.items?.length) {
//         showErrorModal(t("NoItemsSelected"));
//         setIsLoading(false);
//         return;
//       }

//       const docUrls = await Promise.all(
//         checkedItems.items.map(async (item) => {
//           const packageId = item.lineItems?.[0]?.packageId;
//           const itemId = item.id;

//           try {
//             // const res = await fetch(
//             //   `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/package/ship-doc?cipher=${encodeURIComponent(
//             //     cipher,
//             //   )}&packageId=${encodeURIComponent(
//             //     packageId,
//             //   )}&openId=${encodeURIComponent(tiktokOpenId)}`,
//             // );
//             // const data = await res.json();
//             // const docUrl = data?.data?.docUrl;
//             const res = await fetch(
//               `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/package/ship-doc/new?openId=${encodeURIComponent(
//                 tiktokOpenId,
//               )}&cipher=${encodeURIComponent(
//                 cipher,
//               )}&packageId=${encodeURIComponent(
//                 packageId,
//               )}&documentType=${documentType}&documentSize=A6&documentFormat=PDF`,
//               {
//                 method: "GET",
//                 headers: {
//                   accept: "*/*",
//                 },
//               },
//             );

//             const data = await res.json();
//             const docUrl = data?.data?.docUrl;
//             console.log(data);

//             // ✅ Save printedId if docUrl exists
//             if (
//               docUrl &&
//               itemId &&
//               checkedItems?.from !== "AWAITING_COLLECTION_PRINTED"
//             ) {
//               const url = new URL(
//                 "https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/printedIds/add",
//               );
//               url.searchParams.append("tikTokPrintedId", itemId);
//               url.searchParams.append("email", currentUser); // this can be encodeURIComponent(currentUser) if not already encoded

//               await fetch(url, {
//                 method: "POST",
//               });
//             }

//             return docUrl || null;
//           } catch (err) {
//             console.error(`❌ Failed for packageId: ${packageId}`, err);
//             return null;
//           }
//         }),
//       );

//       const validUrls = docUrls.filter(Boolean);
//       if (validUrls.length === 0) {
//         showErrorModal(t("no_valid_labels"));
//         setIsLoading(false);
//         return;
//       }

//       const mergeRes = await fetch(
//         "https://grozziieget.zjweiting.com:8033/tht/merge-pdfs",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ urls: validUrls }),
//         },
//       );

//       if (!mergeRes.ok) throw new Error("Failed to merge PDFs");

//       const blob = await mergeRes.blob();
//       const pdfUrl = URL.createObjectURL(blob);
//       setTikTokPdf(pdfUrl);
//     } catch (err) {
//       console.error("❌ Merge print failed:", err);
//       showErrorModal(t("pdf_error"));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePrintAll = () => {
//     const iframe = document.querySelector("iframe");
//     if (iframe?.contentWindow) {
//       iframe.contentWindow.focus();
//       iframe.contentWindow.print();
//     }
//   };

//   useEffect(() => {
//     if (!cipher || !checkedItems?.items?.length) return;
//     fetchWarehouses();
//     fetchShipmentProviders();
//     handleMergeAndPrint();
//   }, [cipher]);

//   return (
//     <div className="w-full h-screen pb-16 mb-10">
//       <div className="my-8 ">
//         <div className="grid grid-cols-12 min-h-[50px]">
//           {/* Left - PrintLebel */}
//           <div className="col-span-4 mr-12">
//             <div className="bg-[#004368] bg-opacity-[0.05] rounded-md px-6 pt-6 mb-8 h-[200px]">
//               <p className="text-lg font-semibold mb-2">
//                 {t("TiktokLebelList")}
//               </p>
//               {tiktokPrintingLebelList.map((item) => {
//                 const checked = checkedLebelItems.includes(item.id);

//                 return (
//                   <label
//                     key={item.id}
//                     className={`flex items-center gap-3 px-4 py-2 rounded cursor-pointer
//             `}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={checked}
//                       onChange={() => handleCheck(item.id)}
//                       className="w-4 h-4 accent-white cursor-pointer"
//                     />
//                     <span className="text-sm font-medium">{item.lebel}</span>
//                   </label>
//                 );
//               })}
//             </div>
//             <div className="bg-[#004368] bg-opacity-[0.05] rounded-md px-6 pt-6  h-[473px] overflow-scroll">
//               <p className="text-lg font-semibold mb-2">{t("WarehouseList")}</p>
//               {warehouses.map((warehouse) => (
//                 <div
//                   key={warehouse.id}
//                   className={`pl-4 py-2 cursor-pointer ${
//                     currentItem?.warehouseId === warehouse.id
//                       ? "font-semibold text-[#004368]"
//                       : ""
//                   }`}
//                 >
//                   {warehouse.name}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Middle - Label Preview */}
//           <div className="col-span-4 bg-[#004368] bg-opacity-[0.05] ml-9 rounded-md px-10 py-10">
//             {loading || isLoading ? (
//               <FadeLoader color="#004368" size={25} className="mx-auto mt-10" />
//             ) : error ? (
//               <div className="text-red-500 text-center mt-20 text-xl font-semibold">
//                 {error}
//               </div>
//             ) : (
//               <>
//                 <div className="w-[375px] h-[570px] border rounded shadow overflow-hidden mx-auto">
//                   {tikTokPdf ? (
//                     <iframe
//                       src={tikTokPdf}
//                       title="Label Preview"
//                       className="w-full h-full"
//                       referrerPolicy="no-referrer"
//                     />
//                   ) : (
//                     <div className="h-full flex items-center justify-center text-gray-400">
//                       No PDF Loaded
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex justify-center mt-6">
//                   <button
//                     onClick={handlePrintAll}
//                     disabled={!tikTokPdf}
//                     className="bg-[#004368] text-white px-4 py-2 rounded hover:bg-[#0d2735]"
//                   >
//                     <div className=" flex">
//                       <HiOutlinePrinter className=" text-xl mr-2" />
//                       {t("PrintAllPages")}
//                     </div>
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>

//           {/* Right - Shipment Providers */}
//           <div className="col-span-4 ml-12">
//             <div className="bg-[#004368] bg-opacity-[0.05] rounded-md px-6 pt-6  h-[705px] overflow-scroll">
//               <p className="text-lg font-semibold mb-2">
//                 {t("ShipmentProviderList")}
//               </p>
//               {shipmentProviders.map((provider) => (
//                 <div
//                   key={provider.id}
//                   className={`pl-4 py-2 cursor-pointer ${
//                     currentItem?.deliveryOptionId === provider.id
//                       ? "font-semibold text-[#004368]"
//                       : ""
//                   }`}
//                 >
//                   {provider.name}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//       <ConfirmationModal
//         isOpen={isConfirmModalOpen}
//         title={modalTitle}
//         message={modalMessage}
//         onClose={() => setIsConfirmModalOpen(false)}
//         onConfirm={confirmAction}
//         showConfirmButton={showConfirmButton}
//         selectedLanguage={selectedLanguage}
//       />
//     </div>
//   );
// };

// export default BatchPrintPrinting;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FadeLoader from "react-spinners/FadeLoader";
import { HiOutlinePrinter } from "react-icons/hi2";
import { TiInfoOutline } from "react-icons/ti";
import { useTranslation } from "react-i18next";
import ConfirmationModal from "../../Share/ConfirmationModal";

const BatchPrintPrinting = () => {
  const checkedItems = useSelector((state) => state.user.checkedItemsFromRedux);
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux,
  );
  const currentUser = useSelector((state) => state.user.accountUser);

  const { t } = useTranslation();

  // Modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [showConfirmButton, setShowConfirmButton] = useState(false);

  // Loading and data states
  const [isLoading, setIsLoading] = useState(false);
  const [tikTokPdf, setTikTokPdf] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [shipmentProviders, setShipmentProviders] = useState([]);

  // TikTok credentials from localStorage
  const tiktokOpenId = localStorage.getItem("tiktokOpenId");
  const cipher = localStorage.getItem("tiktokAuthCipher");

  // Printing label options
  const tiktokPrintingLebelList = [
    { id: 1, lebel: "SHIPPING_LABEL", name: "Shipping Label" },
    { id: 2, lebel: "PACKING_SLIP", name: "Packing Label" },
  ];

  // Initialize state from localStorage to avoid mismatch
  const getInitialCheckedItems = () => {
    const saved = localStorage.getItem("tiktokPrintingLebel");
    if (saved) {
      const parsed = JSON.parse(saved);
      // parsed can be 1, 2, or 3 (where 3 means both)
      if (parsed === 3) return [1, 2];
      if (parsed === 2) return [2];
      return [1];
    }
    return [1];
  };

  const [checkedLebelItems, setCheckedLebelItems] = useState(
    getInitialCheckedItems,
  );

  const currentItem = checkedItems?.items?.[0]; // Show first item for warehouse/delivery

  // Calculate document type based on checked items
  const getDocumentType = () => {
    const hasShipping = checkedLebelItems.includes(1);
    const hasPacking = checkedLebelItems.includes(2);

    if (hasShipping && hasPacking) {
      return "SHIPPING_LABEL_AND_PACKING_SLIP";
    } else if (hasPacking) {
      return "PACKING_SLIP";
    } else {
      return "SHIPPING_LABEL";
    }
  };

  const documentType = getDocumentType();

  // Save printing label preference to localStorage
  useEffect(() => {
    let selectedTiktokPrintLebel;

    if (checkedLebelItems.includes(1) && checkedLebelItems.includes(2)) {
      selectedTiktokPrintLebel = 3; // Both
    } else if (checkedLebelItems.includes(2)) {
      selectedTiktokPrintLebel = 2; // Only packing
    } else {
      selectedTiktokPrintLebel = 1; // Only shipping
    }

    localStorage.setItem(
      "tiktokPrintingLebel",
      JSON.stringify(selectedTiktokPrintLebel),
    );
  }, [checkedLebelItems]);

  // Handle checkbox selection with validation
  const handleCheck = (id) => {
    setCheckedLebelItems((prev) => {
      // Toggle selection
      let next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];

      // Prevent empty selection - fallback to option 1
      if (next.length === 0) return [1];

      return next;
    });
  };

  // Fetch warehouses list
  const fetchWarehouses = async () => {
    try {
      const res = await fetch(
        `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/logistics/warehouse-list?cipher=${encodeURIComponent(
          cipher,
        )}&openId=${encodeURIComponent(tiktokOpenId)}`,
      );
      const json = await res.json();
      if (json.code === 0) setWarehouses(json.data.warehouses || []);
    } catch (err) {
      console.error("Failed to fetch warehouses:", err);
    }
  };

  // Fetch shipment providers for current warehouse
  const fetchShipmentProviders = async () => {
    if (!currentItem?.warehouseId) return;

    try {
      const res = await fetch(
        `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/logistics/warehouse/delivery-option?warehouseId=${encodeURIComponent(
          currentItem.warehouseId,
        )}&cipher=${encodeURIComponent(cipher)}&openId=${encodeURIComponent(tiktokOpenId)}`,
      );
      const json = await res.json();
      if (json.code === 0)
        setShipmentProviders(json.data.deliveryOptions || []);
    } catch (err) {
      console.error("Failed to fetch shipment providers:", err);
    }
  };

  // Show error modal
  const showErrorModal = (message) => {
    setModalTitle(
      <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
        <TiInfoOutline className="w-10 h-10 text-red-600" />
      </div>,
    );
    setModalMessage(<p>{message}</p>);
    setConfirmAction(null);
    setShowConfirmButton(false);
    setIsConfirmModalOpen(true);
  };

  // Main function to fetch, merge, and display PDFs
  const handleMergeAndPrint = async () => {
    try {
      setIsLoading(true);
      setTikTokPdf(null); // Clear previous PDF

      if (!cipher || !checkedItems?.items?.length) {
        showErrorModal(t("NoItemsSelected"));
        return;
      }

      // Fetch document URLs for all checked items
      const docUrls = await Promise.all(
        checkedItems.items.map(async (item) => {
          const packageId = item.lineItems?.[0]?.packageId;
          const itemId = item.id;

          if (!packageId) return null;

          try {
            const res = await fetch(
              `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/package/ship-doc/new?openId=${encodeURIComponent(
                tiktokOpenId,
              )}&cipher=${encodeURIComponent(
                cipher,
              )}&packageId=${encodeURIComponent(
                packageId,
              )}&documentType=${documentType}&documentSize=A6&documentFormat=PDF`,
              {
                method: "GET",
                headers: { accept: "*/*" },
              },
            );

            const data = await res.json();
            const docUrl = data?.data?.docUrl;

            // Save printedId if docUrl exists and not already printed
            if (
              docUrl &&
              itemId &&
              checkedItems?.from !== "AWAITING_COLLECTION_PRINTED"
            ) {
              const url = new URL(
                "https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/printedIds/add",
              );
              url.searchParams.append("tikTokPrintedId", itemId);
              url.searchParams.append("email", currentUser);

              await fetch(url, { method: "POST" });
            }

            return docUrl || null;
          } catch (err) {
            console.error(`❌ Failed for packageId: ${packageId}`, err);
            return null;
          }
        }),
      );

      const validUrls = docUrls.filter(Boolean);

      if (validUrls.length === 0) {
        showErrorModal(t("no_valid_labels"));
        return;
      }

      // Merge all PDFs into one
      const mergeRes = await fetch(
        "https://grozziieget.zjweiting.com:8033/tht/merge-pdfs",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: validUrls }),
        },
      );

      if (!mergeRes.ok) throw new Error("Failed to merge PDFs");

      const blob = await mergeRes.blob();
      const pdfUrl = URL.createObjectURL(blob);
      setTikTokPdf(pdfUrl);
    } catch (err) {
      console.error("❌ Merge print failed:", err);
      showErrorModal(t("pdf_error"));
    } finally {
      setIsLoading(false);
    }
  };

  // Print the PDF
  const handlePrintAll = () => {
    const iframe = document.querySelector("iframe");
    if (iframe?.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (!cipher || !checkedItems?.items?.length) return;

    fetchWarehouses();
    fetchShipmentProviders();
    handleMergeAndPrint();
  }, [cipher, checkedItems?.items?.length, documentType]);

  // Re-fetch when document type changes
  // useEffect(() => {
  //   if (!cipher || !checkedItems?.items?.length) return;

  //   handleMergeAndPrint();
  // }, [documentType]);

  return (
    <div className="w-full h-screen pb-16 mb-10">
      <div className="my-8">
        <div className="grid grid-cols-12 min-h-[50px]">
          {/* Left - Print Label Options */}
          <div className="col-span-4 mr-12">
            <div className="bg-[#004368] bg-opacity-[0.05] rounded-md px-6 pt-6 mb-8 h-[200px]">
              <p className="text-lg font-semibold mb-2">
                {t("LabelWaybillList")}
              </p>
              {tiktokPrintingLebelList.map((item) => {
                const checked = checkedLebelItems.includes(item.id);

                return (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-2 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheck(item.id)}
                      className="w-4 h-4 accent-white cursor-pointer"
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </label>
                );
              })}
            </div>

            {/* Warehouse List */}
            <div className="bg-[#004368] bg-opacity-[0.05] rounded-md px-6 pt-6 h-[473px] overflow-y-auto">
              <p className="text-lg font-semibold mb-2">{t("WarehouseList")}</p>
              {warehouses.length > 0 ? (
                warehouses.map((warehouse) => (
                  <div
                    key={warehouse.id}
                    className={`pl-4 py-2 cursor-pointer ${
                      currentItem?.warehouseId === warehouse.id
                        ? "font-semibold text-[#004368]"
                        : ""
                    }`}
                  >
                    {warehouse.name}
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center py-4">
                  {t("NoWarehouses")}
                </div>
              )}
            </div>
          </div>

          {/* Middle - Label Preview */}
          <div className="col-span-4 bg-[#004368] bg-opacity-[0.05] ml-9 rounded-md px-10 py-10">
            {isLoading ? (
              <div className="flex items-center justify-center h-[570px]">
                <FadeLoader color="#004368" size={25} />
              </div>
            ) : (
              <>
                <div className="w-[375px] h-[570px] border rounded shadow overflow-hidden mx-auto">
                  {tikTokPdf ? (
                    <iframe
                      src={tikTokPdf}
                      title="Label Preview"
                      className="w-full h-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      {t("NoPDFLoaded") || "No PDF Loaded"}
                    </div>
                  )}
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={handlePrintAll}
                    disabled={!tikTokPdf}
                    className={`px-4 py-2 rounded flex items-center ${
                      tikTokPdf
                        ? "bg-[#004368] text-white hover:bg-[#0d2735]"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <HiOutlinePrinter className="text-xl mr-2" />
                    {t("PrintAllPages")}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right - Shipment Providers */}
          <div className="col-span-4 ml-12">
            <div className="bg-[#004368] bg-opacity-[0.05] rounded-md px-6 pt-6 h-[705px] overflow-y-auto">
              <p className="text-lg font-semibold mb-2">
                {t("ShipmentProviderList")}
              </p>
              {shipmentProviders.length > 0 ? (
                shipmentProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className={`pl-4 py-2 cursor-pointer ${
                      currentItem?.deliveryOptionId === provider.id
                        ? "font-semibold text-[#004368]"
                        : ""
                    }`}
                  >
                    {provider.name}
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center py-4">
                  {t("NoShipmentProviders")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmAction}
        showConfirmButton={showConfirmButton}
        selectedLanguage={selectedLanguage}
      />
    </div>
  );
};

export default BatchPrintPrinting;
