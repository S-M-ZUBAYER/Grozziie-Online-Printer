import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FadeLoader from "react-spinners/FadeLoader";
import { HiOutlinePrinter } from "react-icons/hi2";
import { checkedItemsChange } from "../../features/slice/userSlice";
import { useTranslation } from "react-i18next";
import ConfirmationModal from "../../Share/ConfirmationModal";

const BatchPrintPrinting = () => {
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
  const [tikTokPdf, setTikTokPdf] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [shipmentProviders, setShipmentProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const tiktokAppKey = localStorage.getItem("tiktokAppKey");
  const tiktokAuthCountry = localStorage.getItem("tiktokAuthCountry");
  const tiktokOpenId = localStorage.getItem("tiktokOpenId");
  const { t } = useTranslation();

  const cipher = localStorage.getItem("tiktokAuthCipher");

  const currentItem = checkedItems?.items?.[0]; // Show first item for warehouse/delivery

  const fetchWarehouses = async () => {
    try {
      // const res = await fetch(
      //   `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/logistics/warehouse-list?cipher=${cipher[0].cipher}`
      // );
      const res = await fetch(
        `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/logistics/warehouse-list?cipher=${encodeURIComponent(
          cipher
        )}&openId=${encodeURIComponent(tiktokOpenId)}`
      );
      const json = await res.json();
      if (json.code === 0) setWarehouses(json.data.warehouses || []);
    } catch (err) {
      console.error("Failed to fetch warehouses:", err);
    }
  };

  const fetchShipmentProviders = async () => {
    try {
      // const res = await fetch(
      //   `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/logistics/warehouse/delivery-option?warehouseId=${currentItem?.warehouseId}&cipher=${cipher[0].cipher}`
      // );
      const res = await fetch(
        `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/logistics/warehouse/delivery-option?warehouseId=${encodeURIComponent(
          currentItem?.warehouseId
        )}&cipher=${encodeURIComponent(cipher)}&openId=${encodeURIComponent(
          tiktokOpenId
        )}`
      );
      const json = await res.json();
      if (json.code === 0)
        setShipmentProviders(json.data.deliveryOptions || []);
    } catch (err) {
      console.error("Failed to fetch shipment providers:", err);
    }
  };

  // const handleMergeAndPrint = async () => {
  //   try {
  //     setIsLoading(true);

  //     if (!cipher?.[0]?.cipher || !checkedItems?.items?.length) {
  //       alert("Missing cipher or no items selected.");
  //       setIsLoading(false);
  //       return;
  //     }

  //     const docUrls = await Promise.all(
  //       checkedItems.items.map(async (item) => {
  //         const packageId = item.lineItems?.[0]?.packageId;
  //         const res = await fetch(
  //           `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/package/ship-doc?cipher=${encodeURIComponent(
  //             cipher[0].cipher
  //           )}&packageId=${encodeURIComponent(packageId)}`
  //         );
  //         const data = await res.json();
  //         return data?.data?.docUrl;
  //       })
  //     );

  //     const validUrls = docUrls.filter(Boolean);
  //     if (validUrls.length === 0) {
  //       alert("No valid shipping labels found.");
  //       setIsLoading(false);
  //       return;
  //     }

  //     const mergeRes = await fetch(
  //       "https://grozziieget.zjweiting.com:8033/tht/merge-pdfs",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ urls: validUrls }),
  //       }
  //     );

  //     if (!mergeRes.ok) throw new Error("Failed to merge PDFs");

  //     const blob = await mergeRes.blob();
  //     const pdfUrl = URL.createObjectURL(blob);
  //     setTikTokPdf(pdfUrl);
  //   } catch (err) {
  //     console.error("❌ Merge print failed:", err);
  //     alert("Something went wrong while generating the merged PDF.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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

      if (!cipher || !checkedItems?.items?.length) {
        showErrorModal(t("NoItemsSelected"));
        setIsLoading(false);
        return;
      }

      const docUrls = await Promise.all(
        checkedItems.items.map(async (item) => {
          const packageId = item.lineItems?.[0]?.packageId;
          const itemId = item.id;

          try {
            // const res = await fetch(
            //   `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/package/ship-doc?cipher=${encodeURIComponent(
            //     cipher[0].cipher
            //   )}&packageId=${encodeURIComponent(packageId)}`
            // );
            const res = await fetch(
              `https://grozziie.zjweiting.com:3091/tiktokshop-partner-country/api/dev/package/ship-doc?cipher=${encodeURIComponent(
                cipher
              )}&packageId=${encodeURIComponent(
                packageId
              )}&openId=${encodeURIComponent(tiktokOpenId)}`
            );
            const data = await res.json();
            const docUrl = data?.data?.docUrl;

            // ✅ Save printedId if docUrl exists
            if (
              docUrl &&
              itemId &&
              checkedItems?.from !== "AWAITING_COLLECTION_PRINTED"
            ) {
              const url = new URL(
                "https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/printedIds/add"
              );
              url.searchParams.append("tikTokPrintedId", itemId);
              url.searchParams.append("email", currentUser); // this can be encodeURIComponent(currentUser) if not already encoded

              await fetch(url, {
                method: "POST",
              });
            }

            return docUrl || null;
          } catch (err) {
            console.error(`❌ Failed for packageId: ${packageId}`, err);
            return null;
          }
        })
      );

      const validUrls = docUrls.filter(Boolean);
      if (validUrls.length === 0) {
        showErrorModal(t("no_valid_labels"));
        setIsLoading(false);
        return;
      }

      const mergeRes = await fetch(
        "https://grozziieget.zjweiting.com:8033/tht/merge-pdfs",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: validUrls }),
        }
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

  const handlePrintAll = () => {
    const iframe = document.querySelector("iframe");
    if (iframe?.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }
  };

  useEffect(() => {
    if (!cipher || !checkedItems?.items?.length) return;
    fetchWarehouses();
    fetchShipmentProviders();
    handleMergeAndPrint();
  }, [cipher]);

  return (
    <div className="w-full h-screen pb-16 mb-10">
      <div className="mt-8 mx-12">
        <div className="grid grid-cols-11 max-h-[549px]">
          {/* Left - Warehouses */}
          <div className="col-span-4 mr-12">
            <div className="bg-[#004368] bg-opacity-[0.05] rounded-md px-6 pt-6">
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
            </div>
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
                  {tikTokPdf ? (
                    <iframe
                      src={tikTokPdf}
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
                    disabled={!tikTokPdf}
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
