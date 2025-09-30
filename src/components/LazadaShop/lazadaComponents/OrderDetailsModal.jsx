import React from "react";

const OrderDetailItem = ({ label, value, className = "", t }) => (
  <div>
    <strong>{label}:</strong>{" "}
    <span className={className}>{value || t("NoData")}</span>
  </div>
);

const OrderItems = ({ selectedCustomer, t }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">{t("OrderItems")}</h3>
    {selectedCustomer?.orderItemInfo?.length > 0 ? (
      <div className="space-y-4 max-h-[40vh] overflow-y-auto">
        {selectedCustomer.orderItemInfo.map((item, idx) => (
          <div
            key={item.order_item_id || idx}
            className="flex gap-4 items-center border p-4 rounded-lg shadow-sm"
          >
            <img
              src={item.product_main_image || "https://via.placeholder.com/80"}
              alt={item.name || t("NoData")}
              className="w-20 h-20 object-cover rounded-md border"
            />
            <div className="flex-1">
              <OrderDetailItem label={t("Product")} value={item.name} t={t} />
              <OrderDetailItem label={t("SKU")} value={item.sku} t={t} />
              <OrderDetailItem
                label={t("Variation")}
                value={item.variation}
                t={t}
              />
              <OrderDetailItem
                label={t("ItemPrice")}
                value={item.item_price ?? 0}
                t={t}
              />
              <OrderDetailItem
                label={t("PaidPrice")}
                value={item.paid_price ?? 0}
                t={t}
              />
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p>{t("NoOrderItems")}</p>
    )}
  </div>
);

const OrderDetailsModal = ({ isOpen, selectedCustomer, onClose, t }) => {
  if (!isOpen || !selectedCustomer) return null;

  return (
    <dialog
      id="lazada_modal"
      className="modal backdrop-blur-sm bg-black/10 fixed inset-0 z-50 flex items-center justify-center"
      open={isOpen}
    >
      <div className="modal-box w-[900px] max-w-full bg-white shadow-xl rounded-2xl p-8 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-3xl font-semibold text-[#004368]">
            {t("LazadaOrderDetails")}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <OrderDetailItem
            label={t("OrderID")}
            value={selectedCustomer?.order_number}
            t={t}
          />
          <OrderDetailItem
            label={t("Status")}
            value={selectedCustomer?.statuses[0]}
            className="text-blue-700 font-semibold"
            t={t}
          />
          <OrderDetailItem
            label={t("Warehouse")}
            value={selectedCustomer?.warehouse_code}
            t={t}
          />
          <OrderDetailItem
            label={t("PaymentMethod")}
            value={selectedCustomer?.payment_method}
            t={t}
          />
          <OrderDetailItem
            label={t("Price")}
            value={selectedCustomer?.price ?? 0}
            t={t}
          />
          <OrderDetailItem
            label={t("ShippingFee")}
            value={selectedCustomer?.shipping_fee ?? 0}
            t={t}
          />
        </div>

        <hr className="my-6" />

        <h3 className="text-xl font-semibold mb-4">{t("CustomerInfo")}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
          <OrderDetailItem
            label={t("CustomerName")}
            value={selectedCustomer?.customer_first_name}
            t={t}
          />
          <OrderDetailItem
            label={t("Phone")}
            value={selectedCustomer?.address_shipping?.phone}
            t={t}
          />
        </div>

        <hr className="my-6" />
        <OrderItems selectedCustomer={selectedCustomer} t={t} />

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="bg-[#004368] hover:bg-[#00324d] text-white font-semibold px-8 py-2 rounded-lg transition"
          >
            {t("Close")}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default OrderDetailsModal;
