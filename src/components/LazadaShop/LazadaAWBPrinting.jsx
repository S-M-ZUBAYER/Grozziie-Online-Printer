import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FadeLoader from "react-spinners/FadeLoader";
import { HiOutlinePrinter } from "react-icons/hi2";
import { checkedItemsChange } from "../../features/slice/userSlice";
import { useTranslation } from "react-i18next";

const LazadaAWBPrinting = () => {
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

  const handleMergeAndPrint = async () => {
    try {
      setIsLoading(true);

      if (!checkedItems?.items?.length) {
        alert("No orders selected.");
        setIsLoading(false);
        return;
      }

      const docUrls = [];
      const printedOrderIds = [];

      for (const order of checkedItems.items) {
        const { order_id, data } = order;

        const packages = data
          .map((item) => item?.package_id)
          .filter(Boolean)
          .map((id) => ({ package_id: id }));

        if (!packages.length) {
          // toast.error(`No valid package_id found for order ${order_id}`);
          console.error(`No valid package_id found for order ${order_id}`);
          continue;
        }

        try {
          // 🟠 Step 1: Print AWB
          const response = await fetch(
            "https://grozziie.zjweiting.com:3091/lazada-open-shop/fulfillment/print-awb",
            {
              method: "POST",
              headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                doc_type: "PDF",
                print_item_list: true,
                packages,
              }),
            }
          );

          const result = await response.json();
          const pdfUrl = result?.result?.data?.pdf_url;

          if (pdfUrl) {
            docUrls.push(pdfUrl);
            printedOrderIds.push(order_id);

            // 🟢 Step 2: Call "ready to ship" API for each package

            const skipStatuses = [
              "Packed_Printed",
              "ready_to_ship",
              "ready_to_ship_pending",
            ];

            if (!skipStatuses.includes(checkedItems?.from)) {
              console.log(checkedItems?.from, "from");

              for (const pkg of packages) {
                try {
                  const deliveryRes = await fetch(
                    "https://grozziie.zjweiting.com:3091/lazada-open-shop/fulfillment/order/package/sof/delivered",
                    {
                      method: "POST",
                      headers: {
                        Accept: "*/*",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ packages: [pkg] }),
                    }
                  );

                  const deliveryData = await deliveryRes.json();
                  console.log("✅ Delivery API Response", deliveryData);
                } catch (deliveryErr) {
                  console.error(
                    `❌ Failed to mark package ${pkg.package_id} as delivered`,
                    deliveryErr
                  );
                }
              }
            }
          } else {
            console.error(`No PDF URL returned for order ${order_id}`);
            // toast.error(`No PDF URL returned for order ${order_id}`);
          }
        } catch (error) {
          console.error(`❌ Error printing AWB for order ${order_id}`, error);
          // toast.error(`Failed to print AWB for order ${order_id}`);
          continue;
        }
      }

      if (!docUrls.length) {
        alert("No valid shipping labels found.");
        setIsLoading(false);
        return;
      }

      // Merge all collected PDFs
      const mergeRes = await fetch(
        "https://grozziieget.zjweiting.com:8033/tht/merge-pdfs",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: docUrls }),
        }
      );

      if (!mergeRes.ok) throw new Error("Failed to merge PDFs");

      const blob = await mergeRes.blob();
      const pdfUrl = URL.createObjectURL(blob);
      setLazadaPdf(pdfUrl);

      // ✅ Call store API for each printed order_id
      if (checkedItems?.from !== "Packed_Printed") {
        for (const lazadaId of printedOrderIds) {
          try {
            await fetch(
              `https://grozziie.zjweiting.com:3091/tiktokshop-print/api/dev/lazada/printedIds/add?LazadaPrintedId=${lazadaId}&email=${encodeURIComponent(
                currentUser
              )}`,
              {
                method: "POST",
              }
            );
            console.log(`✅ Stored LazadaPrintedId ${lazadaId}`);
          } catch (err) {
            console.error(
              `❌ Failed to store LazadaPrintedId ${lazadaId}`,
              err
            );
          }
        }
      }
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
            {/* <div className="bg-[#004368] bg-opacity-[0.05] rounded-md px-6 pt-6">
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
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LazadaAWBPrinting;
