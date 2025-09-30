import React from "react";

const OrderDetailItem = ({ label, value, className = "", t }) => (
  <div>
    <strong>{label}:</strong>{" "}
    <span className={className}>{value || t("NoData")}</span>
  </div>
);

const RecipientInfo = ({ selectedCustomer, t }) => (
  <div className="mb-6">
    <h3 className="text-xl font-semibold mb-3">{t("RecipientInformation")}</h3>
    <OrderDetailItem
      label={t("Name")}
      value={selectedCustomer?.recipient_address?.name}
      t={t}
    />
    <OrderDetailItem
      label={t("Phone")}
      value={selectedCustomer?.recipient_address?.phone}
      t={t}
    />
    <OrderDetailItem
      label={t("FullAddress")}
      value={selectedCustomer?.recipient_address?.full_address}
      t={t}
    />
    <OrderDetailItem
      label={t("City")}
      value={selectedCustomer?.recipient_address?.city}
      t={t}
    />
    <OrderDetailItem
      label={t("State")}
      value={selectedCustomer?.recipient_address?.state}
      t={t}
    />
    <OrderDetailItem
      label={t("District")}
      value={selectedCustomer?.recipient_address?.district}
      t={t}
    />
    <OrderDetailItem
      label={t("Region")}
      value={selectedCustomer?.recipient_address?.region}
      t={t}
    />
  </div>
);

const OrderItem = ({ item, t }) => (
  <div className="flex gap-4 items-center border p-4 rounded-lg shadow-sm">
    <img
      src={item?.image_info?.image_url || "https://via.placeholder.com/80"}
      alt={item?.item_name || t("NoData")}
      className="w-20 h-20 object-cover rounded-md border"
    />
    <div className="flex-1">
      <OrderDetailItem label={t("Product")} value={item?.item_name} t={t} />
      <OrderDetailItem label={t("ModelName")} value={item?.model_name} t={t} />
      <OrderDetailItem label={t("SKU")} value={item?.model_sku} t={t} />
      <OrderDetailItem
        label={t("Quantity")}
        value={item?.model_quantity_purchased ?? 0}
        t={t}
      />
      <OrderDetailItem
        label={t("Price")}
        value={item?.model_discounted_price ?? 0}
        t={t}
      />
      <OrderDetailItem
        label={t("OriginalPrice")}
        value={item?.model_original_price ?? 0}
        t={t}
      />
      <OrderDetailItem
        label={t("PromotionType")}
        value={item?.promotion_type}
        t={t}
      />
    </div>
  </div>
);

const OrderItems = ({ selectedCustomer, t }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">{t("OrderItems")}</h3>
    {selectedCustomer?.item_list?.length > 0 ? (
      <div className="space-y-4 max-h-[40vh] overflow-y-auto">
        {selectedCustomer.item_list.map((item, idx) => (
          <OrderItem key={item.order_item_id || idx} item={item} t={t} />
        ))}
      </div>
    ) : (
      <p>{t("NoOrderItems")}</p>
    )}
  </div>
);

const OrderDetailsContent = ({ selectedCustomer, t }) => (
  <>
    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
      <OrderDetailItem
        label={t("OrderID")}
        value={selectedCustomer?.order_sn}
        t={t}
      />
      <OrderDetailItem
        label={t("Status")}
        value={selectedCustomer?.order_status}
        className="text-blue-700 font-semibold"
        t={t}
      />
      <OrderDetailItem
        label={t("PaymentMethod")}
        value={selectedCustomer?.payment_method}
        t={t}
      />
      <OrderDetailItem
        label={t("Currency")}
        value={selectedCustomer?.currency}
        t={t}
      />
      <OrderDetailItem
        label={t("TotalAmount")}
        value={selectedCustomer?.total_amount ?? 0}
        t={t}
      />
      <OrderDetailItem
        label={t("COD")}
        value={selectedCustomer?.cod ? t("Yes") : t("No")}
        t={t}
      />
      <OrderDetailItem
        label={t("CreatedAt")}
        value={
          selectedCustomer?.create_time
            ? new Date(selectedCustomer.create_time * 1000).toLocaleString()
            : t("NoData")
        }
        t={t}
      />
      <OrderDetailItem
        label={t("UpdatedAt")}
        value={
          selectedCustomer?.update_time
            ? new Date(selectedCustomer.update_time * 1000).toLocaleString()
            : t("NoData")
        }
        t={t}
      />
    </div>

    <hr className="my-6" />
    <RecipientInfo selectedCustomer={selectedCustomer} t={t} />
    <hr className="my-6" />
    <OrderItems selectedCustomer={selectedCustomer} t={t} />
  </>
);

const OrderDetailsModal = ({ isOpen, selectedCustomer, onClose, t }) => {
  if (!isOpen || !selectedCustomer) return null;

  return (
    <dialog
      id="shopee_modal"
      className="modal backdrop-blur-sm bg-black/10 fixed inset-0 z-50 flex items-center justify-center"
      open={isOpen}
    >
      <div className="modal-box w-[900px] max-w-full bg-white shadow-xl rounded-2xl p-8 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-3xl font-semibold text-[#004368]">
            {t("ShopeeOrderDetails")}
          </h2>
        </div>

        <OrderDetailsContent selectedCustomer={selectedCustomer} t={t} />

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
