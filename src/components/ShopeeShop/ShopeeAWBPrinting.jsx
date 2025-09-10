import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FadeLoader from "react-spinners/FadeLoader";
import { HiOutlinePrinter } from "react-icons/hi2";
import { checkedItemsChange } from "../../features/slice/userSlice";
import { useTranslation } from "react-i18next";

const ShopeeAWBPrinting = () => {
  const checkedItems = useSelector((state) => state.user.checkedItemsFromRedux);
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );
  const currentUser = useSelector((state) => state.user.accountUser);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [lazadaPdf, setLazadaPdf] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [shipmentProviders, setShipmentProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const [cipher] = useState(() => {
    const stored = localStorage.getItem("tiktokShopInfo");
    return stored ? JSON.parse(stored) : [];
  });
  console.log(checkedItems, "checkedItems");

  const currentItem = checkedItems?.items?.[0]; // Show first item for warehouse/delivery

  const fetchWarehouses = async () => {
    try {
      const res = await fetch(
        `https://grozziie.zjweiting.com:3091/tiktokshop-partner/api/dev/logistics/warehouse-list?cipher=${cipher[0].cipher}`
      );
      const json = await res.json();
      if (json.code === 0) setWarehouses(json.data.warehouses || []);
    } catch (err) {
      console.error("Failed to fetch warehouses:", err);
    }
  };

  const fetchShipmentProviders = async () => {
    try {
      const res = await fetch(
        "https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/logistics/get-channel-list"
      );
      const json = await res.json();

      // ✅ Shopee's response wraps data under body.response.logistics_channel_list
      if (
        json?.statusCode === "OK" &&
        json?.body?.response?.logistics_channel_list
      ) {
        setShipmentProviders(json.body.response.logistics_channel_list || []);
      } else {
        console.warn("No logistics channels found in response:", json);
        setShipmentProviders([]);
      }
    } catch (err) {
      console.error("Failed to fetch shipment providers:", err);
      setShipmentProviders([]);
    }
  };

  const handleMergeAndPrint = async () => {
    try {
      setIsLoading(true);
      const skipStatuses = [
        "PROCESSED_PRINTED",
        "SHIPPED",
        "READY_TO_SHIP",
        "COMPLETED",
      ];

      if (!checkedItems?.items?.length) {
        alert("No orders selected.");
        setIsLoading(false);
        return;
      }

      const pdfBase64Array = [];
      const printedOrderIds = [];

      for (const order of checkedItems.items) {
        try {
          const orderSn = order?.order_sn || order?.orderId;
          if (!orderSn) continue;
          // 1️⃣ Get suggested shipping document type
          const docTypeRes = await fetch(
            "https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/logistics/get-shipping-document-parameter",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ order_list: [{ order_sn: orderSn }] }),
            }
          );
          const docTypeData = await docTypeRes.json();
          const shippingDocType =
            docTypeData?.body?.response?.result_list?.[0]
              ?.suggest_shipping_document_type || "THERMAL_AIR_WAYBILL";

          // if (!skipStatuses.includes(checkedItems?.from)) {
          console.log("callllllllllll........2222222");

          // 2️⃣ Create shipping document (safe call even if already exists)
          await fetch(
            "https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/logistics/create-shipping-document",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_list: [
                  {
                    order_sn: orderSn,
                    shipping_document_type: shippingDocType,
                  },
                ],
              }),
            }
          );
          // }
          // 3️⃣ Download shipping document
          const pdfRes = await fetch(
            "https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/logistics/download-shipping-document",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                shipping_document_type: shippingDocType,
                order_list: [{ order_sn: orderSn }],
              }),
            }
          );

          if (!pdfRes.ok) throw new Error("Download failed");
          const pdfBlob = await pdfRes.blob();

          // Convert blob → base64 (for backend merging)
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(pdfBlob);
          });

          pdfBase64Array.push(base64);
          printedOrderIds.push(orderSn);

          console.log(`✅ Processed order ${orderSn}`);
        } catch (err) {
          console.error(`❌ Failed to process order ${order?.order_sn}`, err);
        }
      }

      // 4️⃣ Decide single vs multiple
      if (pdfBase64Array.length === 1) {
        // Decode Base64 → binary
        const byteChars = atob(pdfBase64Array[0]);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
          byteNumbers[i] = byteChars.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Make PDF Blob
        const pdfBlob = new Blob([byteArray], { type: "application/pdf" });
        const pdfUrl = window.URL.createObjectURL(pdfBlob);

        // ✅ Show in iframe preview only
        setLazadaPdf(pdfUrl);
      } else if (pdfBase64Array.length > 1) {
        // Merge on backend
        const mergeRes = await fetch(
          "http://localhost:2000/tht/merge-pdfs-base64",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pdfs: pdfBase64Array }),
          }
        );

        if (!mergeRes.ok) throw new Error("Failed to merge PDFs");

        const { pdfBase64 } = await mergeRes.json();

        // Convert Base64 → Blob
        const byteChars = atob(pdfBase64);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
          byteNumbers[i] = byteChars.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const pdfBlob = new Blob([byteArray], { type: "application/pdf" });

        // ✅ Show in iframe preview only
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setLazadaPdf(pdfUrl);
      } else {
        alert("No PDFs generated for the selected orders.");
      }

      if (!skipStatuses.includes(checkedItems?.from)) {
        console.log("Calllllll------1");

        // 5️⃣ Save printed order ids
        for (const shopeeId of printedOrderIds) {
          try {
            await fetch(
              `https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/shopee/printedIds/add?shopeePrintedId=${shopeeId}&email=${encodeURIComponent(
                currentUser
              )}`,
              { method: "POST" }
            );
            console.log(`✅ Stored ShopeePrintedId ${shopeeId}`);
          } catch (err) {
            console.error(
              `❌ Failed to store ShopeePrintedId ${shopeeId}`,
              err
            );
          }
        }
      }
    } catch (err) {
      console.error("❌ Merge print failed:", err);
      alert("Something went wrong while generating the PDF(s).");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleMergeAndPrint = async () => {
  //   try {
  //     setIsLoading(true);

  //     if (!checkedItems?.items?.length) {
  //       alert("No orders selected.");
  //       return;
  //     }

  //     const skipStatuses = [
  //       "PROCESSED_PRINTED",
  //       "SHIPPED",
  //       "READY_TO_SHIP",
  //       "COMPLETED",
  //     ];
  //     const pdfBase64Array = [];
  //     const printedOrderIds = [];

  //     // Utility: Blob → Base64
  //     const blobToBase64 = (blob) =>
  //       new Promise((resolve, reject) => {
  //         const reader = new FileReader();
  //         reader.onloadend = () => resolve(reader.result.split(",")[1]);
  //         reader.onerror = reject;
  //         reader.readAsDataURL(blob);
  //       });

  //     // Sequential process for each order
  //     for (const order of checkedItems.items) {
  //       const orderSn = order?.order_sn || order?.orderId;
  //       if (!orderSn) continue;

  //       try {
  //         // 1️⃣ Get suggested shipping doc type
  //         const docTypeRes = await fetch(
  //           "https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/logistics/get-shipping-document-parameter",
  //           {
  //             method: "POST",
  //             headers: { "Content-Type": "application/json" },
  //             body: JSON.stringify({ order_list: [{ order_sn: orderSn }] }),
  //           }
  //         );
  //         const docTypeData = await docTypeRes.json();
  //         const shippingDocType =
  //           docTypeData?.body?.response?.result_list?.[0]
  //             ?.suggest_shipping_document_type || "THERMAL_AIR_WAYBILL";

  //         // 2️⃣ Create shipping doc (always wait until complete)
  //         if (!skipStatuses.includes(checkedItems?.from)) {
  //           const createRes = await fetch(
  //             "https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/logistics/create-shipping-document",
  //             {
  //               method: "POST",
  //               headers: { "Content-Type": "application/json" },
  //               body: JSON.stringify({
  //                 order_list: [
  //                   {
  //                     order_sn: orderSn,
  //                     shipping_document_type: shippingDocType,
  //                   },
  //                 ],
  //               }),
  //             }
  //           );

  //           if (!createRes.ok) {
  //             console.error(`❌ Failed to create shipping doc for ${orderSn}`);
  //             continue;
  //           }

  //           // 🔹 Wait a short delay to let Shopee process before downloading
  //           await new Promise((res) => setTimeout(res, 800));
  //         }

  //         // 3️⃣ Download shipping doc
  //         const pdfRes = await fetch(
  //           "https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/logistics/download-shipping-document",
  //           {
  //             method: "POST",
  //             headers: { "Content-Type": "application/json" },
  //             body: JSON.stringify({
  //               shipping_document_type: shippingDocType,
  //               order_list: [{ order_sn: orderSn }],
  //             }),
  //           }
  //         );
  //         if (!pdfRes.ok) {
  //           console.error(`❌ Download failed for ${orderSn}`);
  //           continue;
  //         }

  //         const pdfBlob = await pdfRes.blob();
  //         const base64 = await blobToBase64(pdfBlob);

  //         pdfBase64Array.push(base64);
  //         printedOrderIds.push(orderSn);
  //       } catch (err) {
  //         console.error(`❌ Error processing ${orderSn}`, err);
  //       }
  //     }

  //     // 4️⃣ Merge or show PDFs
  //     if (pdfBase64Array.length === 1) {
  //       const byteChars = atob(pdfBase64Array[0]);
  //       const byteNumbers = Array.from(byteChars, (c) => c.charCodeAt(0));
  //       const pdfBlob = new Blob([new Uint8Array(byteNumbers)], {
  //         type: "application/pdf",
  //       });
  //       setLazadaPdf(URL.createObjectURL(pdfBlob));
  //     } else if (pdfBase64Array.length > 1) {
  //       const mergeRes = await fetch(
  //         "http://localhost:2000/tht/merge-pdfs-base64",
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ pdfs: pdfBase64Array }),
  //         }
  //       );

  //       if (!mergeRes.ok) throw new Error("Failed to merge PDFs");
  //       const { pdfBase64 } = await mergeRes.json();

  //       const byteChars = atob(pdfBase64);
  //       const byteNumbers = Array.from(byteChars, (c) => c.charCodeAt(0));
  //       const pdfBlob = new Blob([new Uint8Array(byteNumbers)], {
  //         type: "application/pdf",
  //       });
  //       setLazadaPdf(URL.createObjectURL(pdfBlob));
  //     } else {
  //       alert("No PDFs generated for the selected orders.");
  //     }

  //     // 5️⃣ Save printed IDs
  //     if (!skipStatuses.includes(checkedItems?.from)) {
  //       for (const shopeeId of printedOrderIds) {
  //         try {
  //           await fetch(
  //             `https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/shopee/printedIds/add?shopeePrintedId=${shopeeId}&email=${encodeURIComponent(
  //               currentUser
  //             )}`,
  //             { method: "POST" }
  //           );
  //         } catch (err) {
  //           console.error(
  //             `❌ Failed to store ShopeePrintedId ${shopeeId}`,
  //             err
  //           );
  //         }
  //       }
  //     }

  //     console.log("✅ All done");
  //   } catch (err) {
  //     console.error("❌ Merge print failed:", err);
  //     alert("Something went wrong while generating the PDF(s).");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handlePrintAll = () => {
    const iframe = document.querySelector("iframe");
    if (iframe?.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }
  };
  console.log(checkedItems);

  useEffect(() => {
    if (!checkedItems?.items?.length) return;
    fetchWarehouses();
    fetchShipmentProviders();
    handleMergeAndPrint();
  }, [checkedItems]);

  return (
    <div className="w-full h-screen pb-16 mb-10">
      <div className="mt-8 mx-12">
        <div className="grid grid-cols-11 max-h-[549px]">
          {/* Left - Warehouses */}
          <div className="col-span-4 mr-12">
            {/* <div className="bg-[#004368] bg-opacity-[0.05] rounded-md px-6 pt-6">
              <p className="text-lg font-semibold mb-2">{t("WarehouseList")}</p>
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
            </div> */}
          </div>

          {/* Middle - Label Preview */}
          <div className="col-span-4 bg-[#004368] bg-opacity-[0.05] ml-9 rounded-md px-10 py-10">
            {loading || isLoading ? (
              <FadeLoader color="#004368" size={25} className="mx-auto mt-10" />
            ) : error ? (
              <div className="text-red-500 text-center mt-20 text-xl font-semibold">
                {error}
              </div>
            ) : (
              <>
                <div className="w-[375px] h-[570px] border rounded shadow overflow-hidden mx-auto">
                  {lazadaPdf ? (
                    <iframe
                      src={lazadaPdf}
                      title="Label Preview"
                      className="w-full h-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      No PDF Loaded
                    </div>
                  )}
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={handlePrintAll}
                    disabled={!lazadaPdf}
                    className="bg-[#004368] text-white px-4 py-2 rounded hover:bg-[#0d2735]"
                  >
                    <div className=" flex">
                      <HiOutlinePrinter className=" text-xl mr-2" />
                      {t("PrintAllPages")}
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right - Shipment Providers */}
          <div className="col-span-3 ml-12">
            <div className="bg-[#004368] bg-opacity-[0.05] rounded-md px-6 pt-6">
              <p className="text-lg font-semibold mb-2">
                {t("ShipmentProviderList")}
              </p>
              {shipmentProviders.map((provider) => (
                <div
                  key={provider.logistics_channel_id}
                  className={`pl-4 py-2 cursor-pointer ${
                    currentItem?.deliveryOptionId ===
                    provider?.logistics_channel_id
                      ? "font-semibold text-[#004368]"
                      : ""
                  }`}
                >
                  {provider.logistics_channel_name?.split("(Don't modify)")[0]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopeeAWBPrinting;
