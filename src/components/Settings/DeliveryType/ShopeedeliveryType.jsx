import React, { useEffect, useState } from "react";

const ShopeedeliveryType = () => {
  const [selectedType, setSelectedType] = useState("default");

  // Load from localStorage when component mounts
  useEffect(() => {
    const savedType = localStorage.getItem("shopeeDeliveryType");
    if (savedType) {
      setSelectedType(savedType);
    } else {
      setSelectedType("default"); // default if no saved value
    }
  }, []);

  // Handle selection change
  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);

    if (value === "default") {
      localStorage.removeItem("shopeeDeliveryType");
    } else {
      localStorage.setItem("shopeeDeliveryType", value);
    }
  };

  return (
    <div className="p-6">
      {/* Heading */}
      <h2 className="text-xl font-semibold text-[#004368] mb-6">
        Shopee Delivery Type
      </h2>

      {/* Options */}
      <div className="space-y-4">
        {/* Default Option */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="shopeeDelivery"
            value="default"
            checked={selectedType === "default"}
            onChange={handleChange}
            className="w-4 h-4 text-[#004368] focus:ring-[#004368]"
          />
          <span className="text-gray-700 text-sm font-medium">Default</span>
        </label>

        {/* Pick Up Option */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="shopeeDelivery"
            value="pickup"
            checked={selectedType === "pickup"}
            onChange={handleChange}
            className="w-4 h-4 text-[#004368] focus:ring-[#004368]"
          />
          <span className="text-gray-700 text-sm font-medium">Pick Up</span>
        </label>

        {/* Drop Off Option */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="shopeeDelivery"
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

export default ShopeedeliveryType;
