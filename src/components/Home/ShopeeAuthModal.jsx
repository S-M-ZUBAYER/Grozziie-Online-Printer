// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom"; // Assuming you use this elsewhere, but not directly in the modal logic

// function ShopeeAuthModal({ show, onClose }) {
//   const initialUrl =
//     "https://grozziie.zjweiting.com:3091/shopee-open-shop/auth/url-generate";

//   const [iframeUrl, setIframeUrl] = useState(initialUrl);
//   const [currentUrl, setCurrentUrl] = useState(initialUrl);
//   const [loading, setLoading] = useState(true);

//   // Listen for postMessage from the iframe
//   useEffect(() => {
//     const handleMessage = (event) => {
//       // ⚠️ IMPORTANT: Verify the origin for security
//       if (event.origin !== "https://grozziie.zjweiting.com:3091") {
//         console.error(
//           "⛔️ Received message from an unknown origin:",
//           event.origin
//         );
//         return;
//       }

//       console.log("✅ Received postMessage from trusted origin:", event.data);

//       const message = event.data;

//       // Handle URL change messages
//       if (message.type === "urlChange" && message.url) {
//         console.log("➡️ Iframe URL updated via postMessage:", message.url);
//         setCurrentUrl(message.url); // Update the URL in your input field
//         setIframeUrl(message.url);
//       }

//       // Handle authentication completion messages
//       if (message.type === "authDone" && message.url) {
//         console.log("🔐 Auth completed. Final URL:", message.url);
//         const code = new URL(message.url).searchParams.get("code");

//         if (code) {
//           console.log("🔍 Found auth code:", code);
//           fetch(
//             `https://grozziie.zjweiting.com:3091/shopee-open-shop/auth?code=${code}`
//           )
//             .then((res) => res.json())
//             .then((data) => {
//               console.log("🎉 New access token received:", data);
//               onClose();
//               window.location.reload();
//             })
//             .catch((err) => console.error("❌ Auth exchange failed:", err));
//         } else {
//           console.error("❌ Auth complete, but 'code' not found in URL.");
//         }
//       }
//     };

//     window.addEventListener("message", handleMessage);
//     return () => window.removeEventListener("message", handleMessage);
//   }, [onClose]);

//   // Handle manual URL submission from the input field
//   const handleUrlSubmit = (e) => {
//     e.preventDefault();
//     console.log("🔗 Manually navigating iframe to:", currentUrl);
//     setIframeUrl(currentUrl);
//     setLoading(true);
//   };

//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="w-[90vw] h-[85vh] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden relative">
//         <div className="flex items-center bg-gray-200 px-3 py-2 space-x-2">
//           {/* ... (Your existing UI code for the top bar) ... */}
//           <form
//             onSubmit={handleUrlSubmit}
//             className="flex-1 mx-3 flex items-center"
//           >
//             <input
//               type="text"
//               value={currentUrl}
//               onChange={(e) => setCurrentUrl(e.target.value)}
//               className="w-full border rounded px-2 py-1 text-sm bg-white"
//             />
//           </form>
//           <button
//             onClick={() => {
//               console.log("🔄 Reloading iframe with URL:", currentUrl);
//               setIframeUrl(currentUrl);
//               setLoading(true);
//             }}
//             className="px-2 text-sm bg-gray-300 rounded"
//           >
//             ⟳
//           </button>
//           <button
//             className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
//             onClick={onClose}
//           >
//             ✕
//           </button>
//         </div>

//         <div className="flex-1 relative">
//           {loading && (
//             <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
//               <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
//               <span className="ml-2 text-gray-700 font-medium">Loading...</span>
//             </div>
//           )}
//           <iframe
//             key={iframeUrl} // Added key to force re-render on URL change
//             src={iframeUrl}
//             title="Shopee Auth"
//             className="w-full h-full"
//             onLoad={() => {
//               console.log("📄 Iframe loaded with URL:", iframeUrl);
//               setLoading(false);
//             }}
//           ></iframe>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ShopeeAuthModal;

import React, { useState, useEffect } from "react";

function ShopeeAuthModal({ show, onClose }) {
  const [iframeUrl, setIframeUrl] = useState(
    "https://grozziie.zjweiting.com:3091/shopee-open-shop/auth/url-generate"
  );
  const [loading, setLoading] = useState(true);
  // Show confirmation modal after 30s
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [firstTime, setFirstTime] = useState(true);

  useEffect(() => {
    if (show) {
      const delay = firstTime ? 60000 : 30000; // 1 min first, then 30s after
      const timer = setTimeout(() => {
        setShowConfirmModal(true);
        setFirstTime(false); // mark first time done
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [show, firstTime]);

  // PostMessage listener (only logs URL)
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "https://grozziie.zjweiting.com:3091") {
        return;
      }

      const message = event.data;

      if (message.type === "urlChange" && message.url) {
        console.log("➡️ Iframe URL updated:", message.url);
        setIframeUrl(message.url);
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
              onClick={() => {
                setLoading(true);
              }}
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
      {/* Confirmation Modal after 30s */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-xl text-center">
            <h2 className="text-lg font-semibold mb-4">
              Have you completed authorization?
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              If completed and redirect URL is now showing, please press Ok.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  onClose();
                  window.location.reload();
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                OK
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ShopeeAuthModal;
