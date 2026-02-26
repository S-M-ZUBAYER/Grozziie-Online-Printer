import React from "react";

const OrderDetailItem = ({ label, value, className = "", t }) => (
  <div>
    <strong>{label}:</strong>{" "}
    <span className={className}>{value || t("NoData")}</span>
  </div>
);

const LineItem = ({ item, t }) => (
  <div className="flex gap-4 items-center border p-4 rounded-lg shadow-sm">
    <img
      src={item.skuImage || "https://via.placeholder.com/80"}
      alt={item.productName || t("NoData")}
      className="w-20 h-20 object-cover rounded-md border"
      onError={(e) => {
        e.currentTarget.src = "https://via.placeholder.com/80";
      }}
    />

    <div className="flex-1 grid grid-cols-2 gap-2">
      <OrderDetailItem label={t("Product")} value={item.productName} t={t} />

      <OrderDetailItem label={t("SellerSKU")} value={item.sellerSku} t={t} />

      <OrderDetailItem label={t("SKUName")} value={item.skuName} t={t} />

      <OrderDetailItem label={t("Quantity")} value={item.quantity} t={t} />

      <OrderDetailItem
        label={t("SalePrice")}
        value={`${item.salePrice ?? 0} ${item.currency || ""}`}
        t={t}
      />

      <OrderDetailItem
        label={t("OriginalPrice")}
        value={`${item.originalPrice ?? 0} ${item.currency || ""}`}
        t={t}
      />

      <OrderDetailItem
        label={t("TrackingCode")}
        value={item.trackingNumber}
        t={t}
      />

      <OrderDetailItem
        label={t("ShippingProvider")}
        value={item.shippingProviderName}
        t={t}
      />

      <OrderDetailItem label={t("PackageID")} value={item.packageId} t={t} />

      <OrderDetailItem label={t("Status")} value={item.displayStatus} t={t} />
    </div>
  </div>
);

const LineItems = ({ selectedCustomer, t }) => (
  <div className="mt-6">
    <h3 className="text-xl font-semibold mb-4">{t("OrderItems")}</h3>

    {selectedCustomer?.lineItems?.length > 0 ? (
      <div className="space-y-4 max-h-[40vh] overflow-y-auto">
        {selectedCustomer.lineItems.map((item, index) => (
          <LineItem
            key={item.skuId || `${item.sellerSku}-${index}`}
            item={item}
            t={t}
          />
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
      id="my_modal_2"
      className="modal backdrop-blur-sm bg-black/10 fixed inset-0 z-50 flex items-center justify-center"
      open={isOpen}
    >
      <div className="modal-box w-[1100px] max-w-full bg-white shadow-xl rounded-2xl p-8 overflow-y-scroll max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold text-[#004368]">
            {t("TikTokOrderDetails")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <OrderDetailItem
            label={t("OrderSource")}
            value={selectedCustomer?.commercePlatform}
            t={t}
          />
          <OrderDetailItem
            label={t("BuyerNickname")}
            value={selectedCustomer?.recipientAddress?.name}
            t={t}
          />
          <OrderDetailItem
            label={t("BuyerEmail")}
            value={selectedCustomer?.buyerEmail}
            t={t}
          />
          <OrderDetailItem
            label={t("OrderID")}
            value={selectedCustomer?.id}
            t={t}
          />
          <OrderDetailItem
            label={t("Status")}
            value={selectedCustomer?.status}
            className="text-blue-700 font-semibold"
            t={t}
          />
          <OrderDetailItem
            label={t("PackageID")}
            value={selectedCustomer?.lineItems?.[0]?.packageId}
            t={t}
          />
          <OrderDetailItem
            label={t("TrackingNumber")}
            value={selectedCustomer?.trackingNumber}
            t={t}
          />
          <OrderDetailItem
            label={t("ShippingProvider")}
            value={selectedCustomer?.shippingProvider}
            t={t}
          />
          <OrderDetailItem
            label={t("DeliveryType")}
            value={selectedCustomer?.deliveryType}
            t={t}
          />
          <OrderDetailItem
            label={t("SKU")}
            value={selectedCustomer?.lineItems?.[0]?.skuName}
            t={t}
          />
          <OrderDetailItem
            label={t("SKUPrice")}
            value={`${selectedCustomer?.lineItems?.[0]?.salePrice} ${selectedCustomer?.payment?.currency}`}
            t={t}
          />
          <OrderDetailItem
            label={t("ShippingFee")}
            value={selectedCustomer?.payment?.shippingFee}
            t={t}
          />
          <OrderDetailItem
            label={t("TotalAmount")}
            value={`${selectedCustomer?.payment?.totalAmount} ${selectedCustomer?.payment?.currency}`}
            t={t}
          />
          <OrderDetailItem
            label={t("PaymentMethod")}
            value={selectedCustomer?.paymentMethodName}
            t={t}
          />
          <OrderDetailItem
            label={t("PaidTime")}
            value={
              selectedCustomer?.paidTime
                ? new Date(selectedCustomer.paidTime * 1000).toLocaleString()
                : t("NoData")
            }
            t={t}
          />
        </div>

        <LineItems selectedCustomer={selectedCustomer} t={t} />

        <div className="mt-6">
          <strong>{t("ShippingAddress")}:</strong>
          <p className="text-gray-600 mt-1">
            {selectedCustomer?.recipientAddress?.fullAddress}
          </p>
        </div>

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
