import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FadeLoader from "react-spinners/FadeLoader";
import { HiOutlinePrinter } from "react-icons/hi2";
import { checkedItemsChange } from "../../features/slice/userSlice";

const BatchPrintPrinting = () => {
  const checkedItems = useSelector((state) => state.user.checkedItemsFromRedux);
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [tikTokPdf, setTikTokPdf] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [shipmentProviders, setShipmentProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [cipher] = useState(() => {
    const stored = localStorage.getItem("tiktokShopInfo");
    return stored ? JSON.parse(stored) : [];
  });

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
        `https://grozziie.zjweiting.com:3091/tiktokshop-partner/api/dev/logistics/warehouse/delivery-option?warehouseId=${currentItem?.warehouseId}&cipher=${cipher[0].cipher}`
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
  //           `https://grozziie.zjweiting.com:3091/tiktokshop-partner/api/dev/package/ship-doc?cipher=${encodeURIComponent(
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

  const handleMergeAndPrint = async () => {
    try {
      setIsLoading(true);

      if (!cipher?.[0]?.cipher || !checkedItems?.items?.length) {
        alert("Missing cipher or no items selected.");
        setIsLoading(false);
        return;
      }

      const docUrls = await Promise.all(
        checkedItems.items.map(async (item) => {
          const packageId = item.lineItems?.[0]?.packageId;
          const itemId = item.id;

          try {
            const res = await fetch(
              `https://grozziie.zjweiting.com:3091/tiktokshop-partner/api/dev/package/ship-doc?cipher=${encodeURIComponent(
                cipher[0].cipher
              )}&packageId=${encodeURIComponent(packageId)}`
            );
            const data = await res.json();
            const docUrl = data?.data?.docUrl;

            // ✅ Save printedId if docUrl exists
            if (docUrl && itemId) {
              const url = new URL(
                "https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/printedIds/add"
              );
              url.searchParams.append("tikTokPrintedId", itemId);

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
        alert("No valid shipping labels found.");
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
      alert("Something went wrong while generating the merged PDF.");
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
    if (!cipher?.[0]?.cipher || !checkedItems?.items?.length) return;
    fetchWarehouses();
    fetchShipmentProviders();
    handleMergeAndPrint();
  }, [cipher]);

  return (
    <div className="w-full h-screen pb-16 mb-10">
      <div className="mt-8 mx-12">
        <p className="text-[#004368] text-xl font-semibold mb-3">
          {selectedLanguage === "zh-CN" ? "仓库列表" : "Warehouse List"}
        </p>

        <div className="grid grid-cols-10 max-h-[549px]">
          {/* Left - Warehouses */}
          <div className="col-span-2 bg-[#004368] bg-opacity-[0.05] rounded-md">
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
                      <HiOutlinePrinter className=" text-xl mr-2" /> Print All
                      Pages
                    </div>
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
