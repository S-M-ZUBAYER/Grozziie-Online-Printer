import React from "react";
import { useTranslation } from "react-i18next";

const LazadaDeliveryType = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="bg-white shadow-lg rounded-2xl px-10 py-8 text-center">
        <h2 className="text-2xl font-semibold text-[#004368] mb-3">
          Lazada {t("DeliveryType")}
        </h2>
        <p className="text-lg text-gray-700 font-medium">
          {t("NowThisFunctionalitiesIsNotAvailable")}
        </p>
      </div>
    </div>
  );
};

export default LazadaDeliveryType;
