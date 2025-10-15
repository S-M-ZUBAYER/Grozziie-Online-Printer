import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// --- Confirmation Modal ---
const AuthConfirmModal = ({ show, onCancel, onConfirm, t }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[400px] shadow-xl text-center">
        <h2 className="text-lg font-semibold mb-4">
          {t("Have you completed authorization?")}
        </h2>
        <p className="mb-6 text-sm text-gray-600">
          {t(
            "If completed and redirect URL is now showing, please press Confirm."
          )}
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg"
          >
            {t("Cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#004368] hover:bg-opacity-60 text-white px-4 py-2 rounded-lg"
          >
            {t("Confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Shopee Auth Modal ---
function ShopeeAuthModal({ show, onClose }) {
  const shopeeAuthCountry = localStorage.getItem("shopeeAuthCountry");
  const { t } = useTranslation();
  const [iframeUrl, setIframeUrl] = useState(
    `https://grozziie.zjweiting.com:3091/shopee-open-shop-country/auth/url-generate/dynamic?countryCode=${shopeeAuthCountry}`
  );
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [firstTime, setFirstTime] = useState(true);

  // --- Delayed confirmation modal ---
  useEffect(() => {
    if (!show) return;
    const delay = firstTime ? 60000 : 30000;
    const timer = setTimeout(() => {
      setShowConfirmModal(true);
      setFirstTime(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [show, firstTime]);

  // --- Listen for iframe postMessage ---
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "https://grozziie.zjweiting.com:3091") return;
      const { type, url } = event.data;
      if (type === "urlChange" && url) {
        console.log("➡️ Iframe URL updated:", url);
        setIframeUrl(url);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!show) return null;

  return (
    <>
      {/* Main Auth Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="w-[90vw] h-[85vh] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden relative">
          {/* Browser-style top bar */}
          <div className="flex items-center bg-gray-200 px-3 py-2 space-x-2">
            <div className="flex space-x-1">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>

            <form className="flex-1 mx-3 flex items-center">
              <input
                type="text"
                className="w-full border rounded px-2 py-1 text-sm bg-white"
              />
            </form>

            <button
              onClick={() => setLoading(true)}
              className="px-2 text-sm bg-gray-300 rounded"
            >
              ⟳
            </button>

            <button
              className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {/* Iframe */}
          <div className="flex-1 relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-700 font-medium">
                  Loading...
                </span>
              </div>
            )}
            <iframe
              src={iframeUrl}
              title="Shopee Auth"
              className="w-full h-full"
              onLoad={() => setLoading(false)}
            ></iframe>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AuthConfirmModal
        show={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        shopeeAuthCountry={shopeeAuthCountry}
        onConfirm={() => {
          setShowConfirmModal(false);
          onClose();
          window.location.reload();
        }}
        t={t}
      />
    </>
  );
}

export default ShopeeAuthModal;
