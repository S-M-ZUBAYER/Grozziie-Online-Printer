import React from "react";

const OrderDetailItem = ({ label, value, className = "", t }) => (
  <div>
    <strong>{label}:</strong>{" "}
    <span className={className}>{value || t("NoData")}</span>
  </div>
);

const CustomerInfo = ({ selectedCustomer, t }) => (
  <div className="mb-6">
    <h3 className="text-xl font-semibold mb-3">{t("CustomerInfo")}</h3>
    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
      <OrderDetailItem
        label={t("CustomerName")}
        value={`${selectedCustomer?.customer_first_name || ""} ${
          selectedCustomer?.customer_last_name || ""
        }`.trim()}
        t={t}
      />
      <OrderDetailItem
        label={t("Phone")}
        value={selectedCustomer?.address_shipping?.phone}
        t={t}
      />
      <OrderDetailItem
        label={t("Email")}
        value={selectedCustomer?.address_shipping?.email}
        t={t}
      />
      <OrderDetailItem
        label={t("Country")}
        value={selectedCustomer?.address_shipping?.country}
        t={t}
      />
      <OrderDetailItem
        label={t("City")}
        value={selectedCustomer?.address_shipping?.city}
        t={t}
      />
      <OrderDetailItem
        label={t("PostCode")}
        value={selectedCustomer?.address_shipping?.post_code}
        t={t}
      />
      <div className="col-span-2">
        <OrderDetailItem
          label={t("FullAddress")}
          value={[
            selectedCustomer?.address_shipping?.address1,
            selectedCustomer?.address_shipping?.address2,
            selectedCustomer?.address_shipping?.address3,
            selectedCustomer?.address_shipping?.address4,
            selectedCustomer?.address_shipping?.address5,
          ]
            .filter(Boolean)
            .join(", ")}
          t={t}
        />
      </div>
    </div>
  </div>
);

const OrderSummary = ({ selectedCustomer, t }) => (
  <div className="mb-6">
    <h3 className="text-xl font-semibold mb-3">{t("Order Overview")}</h3>
    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
      <OrderDetailItem
        label={t("OrderID")}
        value={selectedCustomer?.order_number}
        t={t}
      />
      <OrderDetailItem
        label={t("Status")}
        value={selectedCustomer?.statuses?.[0]}
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
        label={t("VoucherAmount")}
        value={selectedCustomer?.voucher}
        t={t}
      />
      <OrderDetailItem
        label={t("voucherCode")}
        value={selectedCustomer?.voucher_code}
        t={t}
      />
      <OrderDetailItem
        label={t("OrderItems")}
        value={selectedCustomer?.items_count}
        t={t}
      />
      <OrderDetailItem
        label={t("giftOption")}
        value={selectedCustomer?.gift_option ? t("Yes") : t("No")}
        t={t}
      />
      <OrderDetailItem
        label={t("giftMessage")}
        value={selectedCustomer?.gift_message}
        t={t}
      />
      <OrderDetailItem
        label={t("Remark")}
        value={selectedCustomer?.remarks}
        t={t}
      />
      <OrderDetailItem
        label={t("branchNumber")}
        value={selectedCustomer?.branch_number}
        t={t}
      />
      <OrderDetailItem
        label={t("nationalRegistration")}
        value={selectedCustomer?.national_registration_number}
        t={t}
      />
    </div>
  </div>
);

const FinancialInfo = ({ selectedCustomer, t }) => (
  <div className="mb-6">
    <h3 className="text-xl font-semibold mb-3">{t("financialInformation")}</h3>
    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
      <OrderDetailItem
        label={t("Price")}
        value={`${selectedCustomer?.price ?? 0} ${
          selectedCustomer?.currency || ""
        }`}
        t={t}
      />
      <OrderDetailItem
        label={t("ShippingFee")}
        value={`${selectedCustomer?.shipping_fee ?? 0} ${
          selectedCustomer?.currency || ""
        }`}
        t={t}
      />
      <OrderDetailItem
        label={t("ShippingFeeOriginal")}
        value={`${selectedCustomer?.shipping_fee_original ?? 0} ${
          selectedCustomer?.currency || ""
        }`}
        t={t}
      />
      <OrderDetailItem
        label={t("ShippingFeeDiscountSeller")}
        value={`${selectedCustomer?.shipping_fee_discount_seller ?? 0} ${
          selectedCustomer?.currency || ""
        }`}
        t={t}
      />
      <OrderDetailItem
        label={t("ShippingFeeDiscountPlatform")}
        value={`${selectedCustomer?.shipping_fee_discount_platform ?? 0} ${
          selectedCustomer?.currency || ""
        }`}
        t={t}
      />
      <OrderDetailItem
        label={t("VoucherSeller")}
        value={selectedCustomer?.voucher_seller}
        t={t}
      />
      <OrderDetailItem
        label={t("VoucherPlatform")}
        value={selectedCustomer?.voucher_platform}
        t={t}
      />
      <OrderDetailItem
        label={t("taxCode")}
        value={selectedCustomer?.tax_code}
        t={t}
      />
    </div>
  </div>
);

const TimelineInfo = ({ selectedCustomer, t }) => (
  <div className="mb-6">
    <h3 className="text-xl font-semibold mb-3">{t("Timeline")}</h3>
    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
      <OrderDetailItem
        label={t("CreatedAt")}
        value={
          selectedCustomer?.created_at
            ? new Date(selectedCustomer.created_at).toLocaleString()
            : t("NoData")
        }
        t={t}
      />
      <OrderDetailItem
        label={t("UpdatedAt")}
        value={
          selectedCustomer?.updated_at
            ? new Date(selectedCustomer.updated_at).toLocaleString()
            : t("NoData")
        }
        t={t}
      />
    </div>
  </div>
);

const OrderItem = ({ item, t }) => (
  <div className="flex gap-4 items-center border p-4 rounded-lg shadow-sm">
    <img
      src={item.product_main_image || "https://via.placeholder.com/80"}
      alt={item.name || t("NoData")}
      className="w-20 h-20 object-cover rounded-md border"
    />
    <div className="flex-1 grid grid-cols-2 gap-2">
      <OrderDetailItem label={t("Product")} value={item.name} t={t} />
      <OrderDetailItem label={t("SKU")} value={item.sku} t={t} />
      <OrderDetailItem label={t("Variation")} value={item.variation} t={t} />
      <OrderDetailItem label={t("ModelName")} value={item.model} t={t} />
      <OrderDetailItem
        label={t("ItemPrice")}
        value={`${item.item_price ?? 0} ${item.currency || ""}`}
        t={t}
      />
      <OrderDetailItem
        label={t("PaidPrice")}
        value={`${item.paid_price ?? 0} ${item.currency || ""}`}
        t={t}
      />
      <OrderDetailItem
        label={t("OriginalPrice")}
        value={`${item.original_price ?? 0} ${item.currency || ""}`}
        t={t}
      />
      <OrderDetailItem label={t("Quantity")} value={item.quantity} t={t} />
      <OrderDetailItem label={t("Status")} value={item.status} t={t} />
      <OrderDetailItem
        label={t("TrackingCode")}
        value={item.tracking_code}
        t={t}
      />
      <OrderDetailItem
        label={t("shipmentProvider")}
        value={item.shipment_provider}
        t={t}
      />
      <OrderDetailItem
        label={t("ShippingType")}
        value={item.shipping_type}
        t={t}
      />
      <OrderDetailItem label={t("PackageID")} value={item.package_id} t={t} />
      <OrderDetailItem
        label={t("ItemNumber")}
        value={item.order_item_id}
        t={t}
      />
      {item.product_detail_url && (
        <div className="col-span-2">
          <strong>{t("ProductDetailURL")}:</strong>{" "}
          <a
            href={item.product_detail_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm"
          >
            {t("ViewProduct")}
          </a>
        </div>
      )}
    </div>
  </div>
);

const OrderItems = ({ selectedCustomer, t }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">{t("OrderItems")}</h3>
    {selectedCustomer?.orderItemInfo?.length > 0 ? (
      <div className="space-y-4 max-h-[40vh] overflow-y-auto">
        {selectedCustomer.orderItemInfo.map((item, idx) => (
          <OrderItem key={item.order_item_id || idx} item={item} t={t} />
        ))}
      </div>
    ) : (
      <p className="text-gray-500">{t("NoOrderItems")}</p>
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
      <div className="modal-box w-[1100px] max-w-full bg-white shadow-xl rounded-2xl p-8 overflow-y-auto max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold text-[#004368]">
            {t("LazadaOrderDetails")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Order Summary */}
        <OrderSummary selectedCustomer={selectedCustomer} t={t} />
        <hr className="my-6" />

        {/* Financial Information */}
        <FinancialInfo selectedCustomer={selectedCustomer} t={t} />
        <hr className="my-6" />

        {/* Customer Information */}
        <CustomerInfo selectedCustomer={selectedCustomer} t={t} />
        <hr className="my-6" />

        {/* Timeline */}
        <TimelineInfo selectedCustomer={selectedCustomer} t={t} />
        <hr className="my-6" />

        {/* Order Items */}
        <OrderItems selectedCustomer={selectedCustomer} t={t} />

        {/* Footer */}
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
