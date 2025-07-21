import React, { useRef, useState } from "react";

const PrintAllLabels = ({ checkedItems, cipher }) => {
  const containerRef = useRef();
  const [isLoading, setIsLoading] = useState(false); // 🔁 loading state

  const handleMergeAndPrint = async () => {
    try {
      setIsLoading(true); // ✅ Start loading

      if (!cipher?.[0]?.cipher || checkedItems.length === 0) {
        alert("Missing cipher or no items selected.");
        setIsLoading(false);
        return;
      }

      // Step 1: Fetch docUrls for each package
      const docUrls = await Promise.all(
        checkedItems.map(async (item) => {
          const packageId = item.lineItems?.[0]?.packageId;
          const res = await fetch(
            `https://grozziie.zjweiting.com:3091/tiktokshop-partner/api/dev/package/ship-doc?cipher=${encodeURIComponent(
              cipher[0].cipher
            )}&packageId=${encodeURIComponent(packageId)}`
          );
          const data = await res.json();
          return data?.data?.docUrl;
        })
      );

      const validUrls = docUrls.filter((url) => !!url);
      if (validUrls.length === 0) {
        alert("No valid shipping labels found.");
        setIsLoading(false);
        return;
      }

      // Step 2: Send to backend
      const mergeRes = await fetch("http://localhost:2000/tht/merge-pdfs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: validUrls }),
      });

      if (!mergeRes.ok) throw new Error("Failed to merge PDFs");

      const blob = await mergeRes.blob();
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, "_blank");
    } catch (err) {
      console.error("❌ Merge print failed:", err);
      alert("Something went wrong while generating the merged PDF.");
    } finally {
      setIsLoading(false); // ✅ Stop loading
    }
  };

  return (
    <>
      <button
        onClick={handleMergeAndPrint}
        disabled={isLoading}
        className={`px-4 py-2 rounded shadow text-white ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? "🔄 Processing..." : "🖨️ Print All Labels"}
      </button>

      {/* Hidden container (if needed in future) */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "800px",
        }}
      />
    </>
  );
};

export default PrintAllLabels;
