import React from "react";
import PaginationControls from "./PaginationControls";
import { LoaderIcon } from "react-hot-toast";

const TableHeader = ({
  selectAll,
  onSelectAllChange,
  checkedItemsCount,
  selectedStatus,
  selectedStore,
  totalOrders,
  totalItems,
  totalOrderSkus,
  pagination,
  durationInfo,
  loading,
  onExport,
  t,
}) => (
  <div className="flex items-center justify-between pl-3 pt-2">
    <div className="flex items-center justify-center cursor-pointer">
      <input
        type="checkbox"
        id="selectAll"
        name="selectAll"
        checked={selectAll}
        onChange={onSelectAllChange}
        className="w-4 h-4 rounded-[2px] text-black text-opacity-60 bg-[#004368] cursor-pointer"
      />
      <label
        htmlFor="selectAll"
        className="text-black opacity-80 text-sm font-normal capitalize pl-2 pr-1"
      >
        {t("SelectAll")}
      </label>
      <span className="text-black opacity-80 text-xs font-light capitalize">
        ({checkedItemsCount} {t("ordersSelected")})
      </span>
    </div>

    <div>
      <p className="text-[#004368] text-sm font-medium capitalize text-center">
        <span className="inline-flex items-center gap-2 justify-center">
          <span>
            {t("Shop")}: {selectedStore}
          </span>
          {loading ? (
            <LoaderIcon className="inline-block" />
          ) : (
            <span
              className={`${durationInfo?.remainingDays < 7 ? "text-red-500" : "text-green-600"}`}
            >
              (
              {durationInfo?.remainingDays < 0
                ? 0
                : durationInfo?.remainingDays}{" "}
              {t("Days")})
            </span>
          )}
        </span>
      </p>
    </div>
    <div>
      <p className="text-[#004368] text-sm font-medium capitalize text-center">
        {t(selectedStatus)}
      </p>
    </div>

    <div className="flex items-center justify-center">
      <div className="flex items-center justify-center">
        <p className="text-black opacity-40 text-sm font-medium capitalize">
          {totalOrders} {t("Orders")}
        </p>
        <div className="w-[1px] h-8 bg-black opacity-40 mx-2"></div>
        <p className="text-black opacity-40 text-sm font-medium capitalize">
          {totalItems} {t("Items")}
        </p>
        <div className="w-[1px] h-8 bg-black opacity-40 mx-2"></div>
        <p className="text-black opacity-40 text-sm font-medium capitalize">
          {totalOrderSkus} {t("SKU")}
        </p>
      </div>
    </div>

    <div className="flex items-center justify-center">
      <PaginationControls pagination={pagination} />

      <button
        onClick={onExport}
        className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[115px] h-10 px-8 py-2 ml-5 rounded-md cursor-pointer"
      >
        <p className="text-[15px] font-medium capitalize cursor-pointer whitespace-nowrap">
          {t("Export")}
        </p>
      </button>
    </div>
  </div>
);

export default TableHeader;
