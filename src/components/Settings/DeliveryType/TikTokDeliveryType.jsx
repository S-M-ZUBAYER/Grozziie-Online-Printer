import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const TikTokdeliveryType = () => {
  const [selectedType, setSelectedType] = useState(""); // initial default
  const { t } = useTranslation();
  // Load from localStorage when component mounts
  useEffect(() => {
    const savedType = localStorage.getItem("tikTokDeliveryType");
    if (savedType) {
      setSelectedType(savedType);
    } else {
      // No value in localStorage → set pickup as default and store it
      localStorage.setItem("tikTokDeliveryType", "pickup");
      setSelectedType("pickup");
    }
  }, []);

  // Handle selection change
  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);
    localStorage.setItem("tikTokDeliveryType", value);
  };

  return (
    <div className="p-6">
      {/* Heading */}
      <h2 className="text-xl font-semibold text-[#004368] mb-6">
        {t("TikTokDeliveryType")}
      </h2>

      {/* Options */}
      <div className="space-y-4">
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
          <span className="text-gray-700 text-sm font-medium">
            {t("Pick Up")}
          </span>
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
          <span className="text-gray-700 text-sm font-medium">
            {t("Drop Off")}
          </span>
        </label>
      </div>
    </div>
  );
};

export default TikTokdeliveryType;
