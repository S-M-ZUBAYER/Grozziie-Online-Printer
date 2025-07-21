// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import FadeLoader from "react-spinners/FadeLoader";
// import { electronicForms, modelNames } from "../../Share/Data/ClientData";
// import toast from "react-hot-toast";

// const BatchPrintPrinting = () => {
//   const checkedItemsChecking = useSelector(
//     (state) => state.user.checkedItemsFromRedux
//   );

//   const selectedLanguage = useSelector(
//     (state) => state.user.selectedLanguageRedux
//   );

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);

//   const [packageId, setPackageId] = useState(
//     checkedItemsChecking?.items[0]?.packages[0]?.id
//   );
//   const [cipher, setCipher] = useState(() => {
//     const stored = localStorage.getItem("tiktokShopInfo");
//     return stored ? JSON.parse(stored) : [];
//   });

//   // ****************************New*********************
//   const [warehouses, setWarehouses] = useState([]);
//   const [shipmentProviders, setShipmentProviders] = useState([]);
//   const [shipDoc, setShipDoc] = useState({});

//   // Fetch package ship doc
//   const fetchShipDoc = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await fetch(
//         `https://grozziie.zjweiting.com:3091/tiktokshop-partner/api/dev/package/ship-doc?cipher=${cipher[0].cipher}&packageId=${checkedItemsChecking?.items[0]?.lineItems[0]?.packageId}`
//       );
//       const json = await res.json();
//       console.log(json, "json");

//       if (json.code === 0) {
//         setShipDoc(json.data || {});
//       } else {
//         setError("Failed to load warehouses");
//       }
//     } catch (err) {
//       setError(err.message || "Error fetching warehouses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch warehouses
//   const fetchWarehouses = async () => {
//     console.log("json start");

//     try {
//       setLoading(true);
//       setError(null);
//       const res = await fetch(
//         `https://grozziie.zjweiting.com:3091/tiktokshop-partner/api/dev/logistics/warehouse-list?cipher=${cipher[0].cipher}`
//       );
//       const json = await res.json();
//       console.log(json, "json");

//       if (json.code === 0) {
//         setWarehouses(json.data.warehouses || []);
//       } else {
//         setError("Failed to load warehouses");
//       }
//     } catch (err) {
//       setError(err.message || "Error fetching warehouses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch shipment providers (delivery options) based on selected warehouseId
//   const fetchShipmentProviders = async (warehouseId) => {
//     if (!warehouseId) {
//       setShipmentProviders([]);
//       return;
//     }
//     try {
//       console.log(warehouseId, "warehouseId");

//       setLoading(true);
//       setError(null);
//       const res = await fetch(
//         `https://grozziie.zjweiting.com:3091/tiktokshop-partner/api/dev/logistics/warehouse/delivery-option?warehouseId=${warehouseId}&cipher=${cipher[0].cipher}`
//       );
//       const json = await res.json();
//       if (json.code === 0) {
//         setShipmentProviders(json.data.deliveryOptions || []);
//       } else {
//         setError("Failed to load shipment providers");
//       }
//     } catch (err) {
//       setError(err.message || "Error fetching shipment providers");
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchShipDoc();
//   }, [cipher, checkedItemsChecking]);

//   useEffect(() => {
//     fetchWarehouses();
//   }, [cipher, checkedItemsChecking]);

//   useEffect(() => {
//     // Fetch shipment providers for selected warehouse in checkedItemsChecking[0]
//     if (checkedItemsChecking?.items[0]?.warehouseId) {
//       fetchShipmentProviders(checkedItemsChecking?.items[0].warehouseId);
//     }
//   }, [cipher, checkedItemsChecking]);

//   useEffect(() => {
//     if (!cipher || !packageId) return;

//     const fetchPackageDetails = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(
//           `https://grozziie.zjweiting.com:3091/tiktokshop-partner/api/dev/package/details?cipher=${cipher[0].cipher}&packageId=${checkedItemsChecking?.items[0]?.packageId}`
//         );

//         const json = await res.json();

//         if (json.code === 0 && json.data) {
//           setPackageDetails(json.data);
//         } else {
//           console.error("API Error:", json.message);
//         }
//       } catch (error) {
//         console.error("Fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPackageDetails();
//   }, [cipher, packageId]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const handleCreateModalOpen = () => {
//     setIsModalOpen(true);
//   };
//   const closeModal = () => {
//     setIsModalOpen(false);
//     document.getElementById("my_modal_create").close();
//   };
//   const handleEditModalOpen = () => {
//     setIsEditModalOpen(true);
//   };
//   const closeEditModal = () => {
//     setIsEditModalOpen(false);
//     document.getElementById("my_modal_edit").close();
//   };

//   //   console.log(checkedItemsChecking, "item");
//   const labelUrl =
//     "https://open-fs-sg.tiktokshop.com/wsos_v2/oec_fulfillment_doc_tts/object/wsos687c7e881fc28b11?expire=1753075720&skipCookie=true&timeStamp=1752989320&sign=aa380eb75d5ba211fb77cb91446c451ee9d7a8dd9d1f779b3ab3cc0a071ec45b";

//   const handlePrintLabel = (labelUrl) => {
//     const printWindow = window.open(labelUrl, "_blank");

//     if (printWindow) {
//       printWindow.focus();

//       // Wait until the content is loaded, then trigger print
//       printWindow.onload = () => {
//         printWindow.print();
//       };
//     } else {
//       alert("Popup blocked! Please allow popups for this site.");
//     }
//   };

//   console.log(checkedItemsChecking, "checking items ");

//   return (
//     <div className="w-full h-screen pb-16 mb-10">
//       {/* top section */}
//       {/* <div className="flex gap-4">
//         <a
//           href={labelUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-600 underline"
//         >
//           View Label
//         </a>

//         <button
//           onClick={() => handlePrintLabel(labelUrl)}
//           className="text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700"
//         >
//           Print Label
//         </button>
//       </div> */}

//       {/* bottom section */}
//       <div className="mt-8 mx-12">
//         <p className="text-[#004368] text-xl font-semibold leading-normal capitalize mb-3">
//           {selectedLanguage === "zh-CN" ? "仓库列表" : "Warehouse List"}
//         </p>

//         <div className="grid grid-cols-10 max-h-[549px]">
//           <div className="col-span-2 bg-[#004368] bg-opacity-[0.05] rounded-md cursor-pointer">
//             {loading ? (
//               <div className="flex flex-col items-center justify-center pt-10 text-center w-full mx-auto pb-60">
//                 <FadeLoader color="#004368" size={25} />
//                 <p className="text-2xl font-medium pt-10 text-[#004368]">
//                   {selectedLanguage === "zh-CN"
//                     ? "数据正在加载，请稍候..."
//                     : "Data is Loading. Please Wait..."}
//                 </p>
//               </div>
//             ) : error ? (
//               <div className="text-red-500 text-center mt-20 text-lg font-semibold">
//                 {selectedLanguage === "zh-CN"
//                   ? "未找到数据。请稍后再试..."
//                   : "Data Not Found. Please try again later...."}
//               </div>
//             ) : (
//               <>
//                 <div className="px-6 pt-4">
//                   <p className="text-lg font-semibold">
//                     {selectedLanguage === "zh-CN"
//                       ? "仓库列表"
//                       : "Warehouse List"}
//                   </p>
//                   {warehouses?.map((warehouse) => (
//                     <div
//                       key={warehouse.id}
//                       className={`pl-4 py-2 cursor-pointer text-start ${
//                         checkedItemsChecking?.items[0]?.warehouseId ===
//                         warehouse.id
//                           ? "font-semibold text-[#004368]"
//                           : ""
//                       }`}
//                     >
//                       {warehouse.name}
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>

//           {/* middle side */}
//           <div
//             id="printId"
//             className="col-span-4 bg-[#004368] bg-opacity-[0.05] ml-9 rounded-md px-16 py-12"
//           >
//             {loading ? (
//               <div className="flex flex-col items-center justify-center pt-10 text-center w-full mx-auto pb-60">
//                 <FadeLoader color="#004368" size={25} />
//                 <p className="text-2xl font-medium pt-10 text-[#004368]">
//                   {selectedLanguage === "zh-CN"
//                     ? "数据正在加载，请稍候..."
//                     : "Data is Loading. Please Wait..."}
//                 </p>
//               </div>
//             ) : error ? (
//               <div className="text-red-500 text-center mt-20 text-xl font-semibold">
//                 {selectedLanguage === "zh-CN"
//                   ? "未找到数据。请稍后再试..."
//                   : "Data Not Found. Please try again later...."}
//               </div>
//             ) : (
//               <div className="w-[375px] h-[570px] border rounded shadow overflow-hidden mt-4">
//                 <iframe
//                   src={shipDoc?.docUrl}
//                   title="Label Preview"
//                   className="w-full h-full"
//                   referrerPolicy="no-referrer"
//                 />
//               </div>
//             )}
//           </div>

//           {/* right side */}
//           <div className="col-span-4 ml-12">
//             <div className="col-span-2 bg-[#004368] bg-opacity-[0.05] rounded-md cursor-pointer">
//               {loading ? (
//                 <div className="flex flex-col items-center justify-center pt-10 text-center w-full mx-auto pb-60">
//                   <FadeLoader color="#004368" size={25} />
//                   <p className="text-2xl font-medium pt-10 text-[#004368]">
//                     {selectedLanguage === "zh-CN"
//                       ? "数据正在加载，请稍候..."
//                       : "Data is Loading. Please Wait..."}
//                   </p>
//                 </div>
//               ) : error ? (
//                 <div className="text-red-500 text-center mt-20 text-lg font-semibold">
//                   {selectedLanguage === "zh-CN"
//                     ? "未找到数据。请稍后再试..."
//                     : "Data Not Found. Please try again later...."}
//                 </div>
//               ) : (
//                 <>
//                   <div className="px-6 pt-6">
//                     <p className="text-lg font-semibold">
//                       {selectedLanguage === "zh-CN"
//                         ? "运输服务商列表"
//                         : "Shipment Provider List"}
//                     </p>
//                     {shipmentProviders?.map((provider) => (
//                       <div
//                         key={provider.id}
//                         className={`pl-4 py-2 cursor-pointer text-start ${
//                           checkedItemsChecking?.items[0]?.deliveryOptionId ===
//                           provider.id
//                             ? "font-semibold text-[#004368]"
//                             : ""
//                         }`}
//                       >
//                         {provider.name}
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BatchPrintPrinting;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FadeLoader from "react-spinners/FadeLoader";
import PrintAllLabels from "../TikTokPrint/PrintAllLabels";

const BatchPrintPrinting = () => {
  const checkedItemsChecking = useSelector(
    (state) => state.user.checkedItemsFromRedux
  );
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [shipDoc, setShipDoc] = useState({});
  const [warehouses, setWarehouses] = useState([]);
  const [shipmentProviders, setShipmentProviders] = useState([]);
  const [cipher] = useState(() => {
    const stored = localStorage.getItem("tiktokShopInfo");
    return stored ? JSON.parse(stored) : [];
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = checkedItemsChecking?.items[currentIndex];

  const fetchShipDoc = async () => {
    if (!cipher?.[0]?.cipher || !currentItem?.lineItems?.[0]?.packageId) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `https://grozziie.zjweiting.com:3091/tiktokshop-partner/api/dev/package/ship-doc?cipher=${cipher[0].cipher}&packageId=${currentItem.lineItems[0].packageId}`
      );
      const json = await res.json();
      if (json.code === 0) {
        setShipDoc(json.data || {});
      } else {
        setError("Failed to load ship document");
      }
    } catch (err) {
      setError(err.message || "Error fetching ship document");
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    if (!cipher?.[0]?.cipher) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `https://grozziie.zjweiting.com:3091/tiktokshop-partner/api/dev/logistics/warehouse-list?cipher=${cipher[0].cipher}`
      );
      const json = await res.json();
      if (json.code === 0) {
        setWarehouses(json.data.warehouses || []);
      } else {
        setError("Failed to load warehouses");
      }
    } catch (err) {
      setError(err.message || "Error fetching warehouses");
    } finally {
      setLoading(false);
    }
  };

  const fetchShipmentProviders = async () => {
    if (!cipher?.[0]?.cipher || !currentItem?.warehouseId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `https://grozziie.zjweiting.com:3091/tiktokshop-partner/api/dev/logistics/warehouse/delivery-option?warehouseId=${currentItem.warehouseId}&cipher=${cipher[0].cipher}`
      );
      const json = await res.json();
      if (json.code === 0) {
        setShipmentProviders(json.data.deliveryOptions || []);
      } else {
        setError("Failed to load shipment providers");
      }
    } catch (err) {
      setError(err.message || "Error fetching shipment providers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipDoc();
    fetchWarehouses();
    fetchShipmentProviders();
  }, [currentIndex, cipher]);

  const handlePrintAllLabels = () => {
    const cipherValue = cipher[0]?.cipher;
    const packageIds = checkedItemsChecking.items.map(
      (item) => item.lineItems?.[0]?.packageId
    );

    // Open all print windows immediately from user interaction
    const windows = packageIds.map((packageId) => {
      const url = `https://grozziie.zjweiting.com:3091/tiktokshop-partner/api/dev/package/ship-doc?cipher=${cipherValue}&packageId=${packageId}`;
      return window.open(url, "_blank");
    });

    // Check if popups were blocked
    if (windows.some((w) => w === null)) {
      alert("❌ Popup blocked. Please allow popups for this site.");
    }
  };

  const handleNext = () => {
    if (currentIndex < checkedItemsChecking.items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="w-full h-screen pb-16 mb-10">
      <div className="mt-8 mx-12">
        <p className="text-[#004368] text-xl font-semibold mb-3">
          {selectedLanguage === "zh-CN" ? "仓库列表" : "Warehouse List"}
        </p>

        <div className="grid grid-cols-10 max-h-[549px]">
          {/* Left - Warehouses */}
          <div className="col-span-2 bg-[#004368] bg-opacity-[0.05] rounded-md">
            {loading ? (
              <FadeLoader color="#004368" size={25} className="mx-auto mt-10" />
            ) : error ? (
              <div className="text-red-500 text-center mt-20 text-lg font-semibold">
                {selectedLanguage === "zh-CN" ? "未找到数据" : "Data Not Found"}
              </div>
            ) : (
              <div className="px-6 pt-4">
                {warehouses.map((warehouse) => (
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
                ))}
              </div>
            )}
          </div>

          {/* Middle - Label Preview */}
          <div className="col-span-4 bg-[#004368] bg-opacity-[0.05] ml-9 rounded-md px-10 py-10">
            {loading ? (
              <FadeLoader color="#004368" size={25} className="mx-auto mt-10" />
            ) : error ? (
              <div className="text-red-500 text-center mt-20 text-xl font-semibold">
                {selectedLanguage === "zh-CN" ? "未找到数据" : "Data Not Found"}
              </div>
            ) : (
              <>
                <div className="w-[375px] h-[570px] border rounded shadow overflow-hidden mx-auto">
                  <iframe
                    src={shipDoc?.docUrl}
                    title="Label Preview"
                    className="w-full h-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {/* <button
                    onClick={handlePrintAllLabels}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Print All
                  </button> */}
                  <PrintAllLabels
                    checkedItems={checkedItemsChecking.items}
                    cipher={cipher}
                  />

                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="bg-gray-400 px-4 py-1 rounded text-white disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={
                      currentIndex === checkedItemsChecking.items.length - 1
                    }
                    className="bg-blue-600 px-4 py-1 rounded text-white disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right - Shipment Providers */}
          <div className="col-span-4 ml-12">
            <div className="bg-[#004368] bg-opacity-[0.05] rounded-md px-6 pt-6">
              <p className="text-lg font-semibold mb-2">
                {selectedLanguage === "zh-CN"
                  ? "运输服务商列表"
                  : "Shipment Provider List"}
              </p>
              {shipmentProviders.map((provider) => (
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchPrintPrinting;
