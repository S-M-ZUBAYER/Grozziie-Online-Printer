import React, { useEffect, useState } from "react";

const TiktokDeliveryType = () => {
  const [selectedType, setSelectedType] = useState("");

  // Load from localStorage when component mounts
  useEffect(() => {
    const savedType = localStorage.getItem("tikTokDeliveryType");
    if (savedType) {
      setSelectedType(savedType);
    }
  }, []);

  // Handle selection change
  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);

    if (value === "default") {
      localStorage.removeItem("tikTokDeliveryType");
    } else {
      localStorage.setItem("tikTokDeliveryType", value);
    }
  };

  return (
    <div className="p-6">
      {/* Heading */}
      <h2 className="text-xl font-semibold text-[#004368] mb-6">
        TikTok Delivery Type
      </h2>

      {/* Options */}
      <div className="space-y-4">
        {/* Default */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="tiktokDelivery"
            value="default"
            checked={selectedType === ""}
            onChange={handleChange}
            className="w-4 h-4 text-[#004368] focus:ring-[#004368]"
          />
          <span className="text-gray-700 text-sm font-medium">Default</span>
        </label>

        {/* Pickup */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="tiktokDelivery"
            value="pickup"
            checked={selectedType === "pickup"}
            onChange={handleChange}
            className="w-4 h-4 text-[#004368] focus:ring-[#004368]"
          />
          <span className="text-gray-700 text-sm font-medium">Pick Up</span>
        </label>

        {/* Dropoff */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="tiktokDelivery"
            value="dropoff"
            checked={selectedType === "dropoff"}
            onChange={handleChange}
            className="w-4 h-4 text-[#004368] focus:ring-[#004368]"
          />
          <span className="text-gray-700 text-sm font-medium">Drop Off</span>
        </label>
      </div>
    </div>
  );
};

export default TiktokDeliveryType;
