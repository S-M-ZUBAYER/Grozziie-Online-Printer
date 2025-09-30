import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FadeLoader from "react-spinners/FadeLoader";
import { HiOutlinePrinter } from "react-icons/hi2";
import { checkedItemsChange } from "../../features/slice/userSlice";
import { useTranslation } from "react-i18next";
import ConfirmationModal from "../../Share/ConfirmationModal";

const ShopeeAWBPrinting = () => {
  const checkedItems = useSelector((state) => state.user.checkedItemsFromRedux);
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );
  const currentUser = useSelector((state) => state.user.accountUser);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [showConfirmButton, setShowConfirmButton] = useState(false);

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

  const showErrorModal = (message) => {
    setModalTitle(
      <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
        <TiInfoOutline className="w-10 h-10 text-red-600" />
      </div>
    );
    setModalMessage(<p>{message}</p>);
    setConfirmAction(null);
    setShowConfirmButton(false);
    setIsConfirmModalOpen(true);
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
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      if (!checkedItems?.items?.length) {
        showErrorModal(t("NoItemsSelected"));
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
          const docTypePayload = { order_list: [{ order_sn: orderSn }] };
          console.log(
            "📤 Calling get-shipping-document-parameter with:",
            docTypePayload
          );

          const docTypeRes = await fetch(
            "https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/logistics/get-shipping-document-parameter",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(docTypePayload),
            }
          );
          const docTypeData = await docTypeRes.json();
          console.log(
            "📥 Response get-shipping-document-parameter:",
            docTypeData
          );

          const shippingDocType =
            docTypeData?.body?.response?.result_list?.[0]
              ?.suggest_shipping_document_type || "THERMAL_AIR_WAYBILL";

          if (!skipStatuses.includes(checkedItems?.from)) {
            // 2️⃣ Get tracking number
            const trackingUrl = `https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/logistics/get-tracking-number?orderSn=${orderSn}&packageNumber=-&responseOptionalFields=first_mile_tracking_number`;
            console.log("📤 Calling get-tracking-number:", trackingUrl);

            const trackingRes = await fetch(trackingUrl);
            const trackingData = await trackingRes.json();
            console.log("📥 Response get-tracking-number:", trackingData);

            const trackingNumber =
              trackingData?.body?.response?.tracking_number || "";

            // 3️⃣ Create shipping document
            const createPayload = {
              order_list: [
                {
                  order_sn: orderSn,
                  shipping_document_type: shippingDocType,
                  tracking_number: trackingNumber,
                },
              ],
            };
            console.log(
              "📤 Calling create-shipping-document with:",
              createPayload
            );

            const createRes = await fetch(
              "https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/logistics/create-shipping-document",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(createPayload),
              }
            );
            const createData = await createRes.json();
            console.log("📥 Response create-shipping-document:", createData);
            await delay(1000);
          }
          const pdfRes = await fetch(
            "https://grozziie.zjweiting.com:3091/shopee-open-shop/api/dev/logistics/download-shipping-document",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "*/*", // ✅ force same as curl
              },
              body: JSON.stringify({
                shipping_document_type: shippingDocType,
                order_list: [{ order_sn: orderSn }],
              }),
            }
          );

          console.log(
            "📥 download-shipping-document status:",
            pdfRes.status,
            pdfRes.statusText
          );

          if (!pdfRes.ok) throw new Error("Download failed");
          const pdfBlob = await pdfRes.blob();

          // Convert blob → base64
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(pdfBlob);
          });

          pdfBase64Array.push(base64);
          printedOrderIds.push(orderSn);

          console.log(`✅ Finished processing order ${orderSn}`);
        } catch (err) {
          console.error(`❌ Failed to process order ${order?.order_sn}`, err);
        }
      }

      // 5️⃣ Single vs multiple
      if (pdfBase64Array.length === 1) {
        const byteChars = atob(pdfBase64Array[0]);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
          byteNumbers[i] = byteChars.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const pdfBlob = new Blob([byteArray], { type: "application/pdf" });
        const pdfUrl = window.URL.createObjectURL(pdfBlob);

        setLazadaPdf(pdfUrl);
      } else if (pdfBase64Array.length > 1) {
        console.log(
          "📤 Calling backend merge-pdfs-base64 with array length:",
          pdfBase64Array.length
        );

        const mergeRes = await fetch(
          "https://grozziieget.zjweiting.com:8033/tht/merge-pdfs-base64",
          // "http://localhost:2000/tht/merge-pdfs-base64",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pdfs: pdfBase64Array }),
          }
        );

        const mergeData = await mergeRes.json();
        console.log("📥 Response merge-pdfs-base64:", mergeData);

        if (!mergeRes.ok) throw new Error("Failed to merge PDFs");

        const { pdfBase64 } = mergeData;
        const byteChars = atob(pdfBase64);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
          byteNumbers[i] = byteChars.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const pdfBlob = new Blob([byteArray], { type: "application/pdf" });

        const pdfUrl = URL.createObjectURL(pdfBlob);
        setLazadaPdf(pdfUrl);
      } else {
        showErrorModal(t("no_valid_labels"));
      }

      // 6️⃣ Save printed order ids
      if (!skipStatuses.includes(checkedItems?.from)) {
        for (const shopeeId of printedOrderIds) {
          try {
            const url = `https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/shopee/printedIds/add?shopeePrintedId=${shopeeId}&email=${encodeURIComponent(
              currentUser
            )}`;
            console.log("📤 Calling save printedId:", url);

            const saveRes = await fetch(url, { method: "POST" });
            console.log("📥 Response save printedId:", saveRes.status);

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
      showErrorModal(t("pdf_error"));
    } finally {
      setIsLoading(false);
    }
  };

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

export default ShopeeAWBPrinting;
