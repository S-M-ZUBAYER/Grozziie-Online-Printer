import React, { useMemo } from "react";
import { MdOutlineLocalPrintshop } from "react-icons/md";

const ActionButtons = ({
  shopeeOrderStatusCheck,
  packageLoading,
  onPackageUpdate,
  onShippingUpdate,
  t,
}) => {
  const buttons = useMemo(() => {
    const buttonConfigs = [];

    if (
      ["SHIPPED", "PROCESSED", "PROCESSED_PRINTED"].includes(
        shopeeOrderStatusCheck
      )
    ) {
      buttonConfigs.push({
        key: "shipping",
        onClick: onShippingUpdate,
        text:
          shopeeOrderStatusCheck === "PROCESSED"
            ? t("OrderShippingAndPrint")
            : t("PrintAWBAgain"),
      });
    }

    if (shopeeOrderStatusCheck?.toUpperCase() === "READY_TO_SHIP") {
      buttonConfigs.push({
        key: "package",
        onClick: onPackageUpdate,
        text: packageLoading ? "Loading" : t("OrderAcceptedAndPackages"),
      });
    }

    return buttonConfigs;
  }, [
    shopeeOrderStatusCheck,
    packageLoading,
    t,
    onPackageUpdate,
    onShippingUpdate,
  ]);

  if (buttons.length === 0) return null;

  return (
    <div className="flex items-center justify-end space-x-2">
      {buttons.map((button) => (
        <button
          key={button.key}
          onClick={button.onClick}
          className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-auto h-10 px-4 gap-2 py-2 rounded-md cursor-pointer flex items-center justify-center"
        >
          <MdOutlineLocalPrintshop className="w-[18px] h-[18px]" />
          <p className="text-[15px] font-medium leading-normal capitalize pl-1">
            {button.text}
          </p>
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
