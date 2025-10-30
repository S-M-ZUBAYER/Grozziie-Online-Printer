import React from "react";

const OrderDetailItem = ({ label, value, className = "", t }) => (
    <div>
        <strong>{label}:</strong>{" "}
        <span className={className}>{value || t("NoData")}</span>
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
            <div className="modal-box w-[800px] max-w-full bg-white shadow-xl rounded-2xl p-8 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-center items-center mb-6">
                    <h2 className="text-3xl font-semibold text-[#004368]">
                        {t("TikTokOrderDetails")}
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <OrderDetailItem label={t("OrderSource")} value={selectedCustomer?.commercePlatform} t={t} />
                    <OrderDetailItem label={t("BuyerNickname")} value={selectedCustomer?.recipientAddress?.name} t={t} />
                    <OrderDetailItem label={t("BuyerEmail")} value={selectedCustomer?.buyerEmail} t={t} />
                    <OrderDetailItem label={t("OrderID")} value={selectedCustomer?.id} t={t} />
                    <OrderDetailItem label={t("Status")} value={selectedCustomer?.status} className="text-blue-700 font-semibold" t={t} />
                    <OrderDetailItem label={t("PackageID")} value={selectedCustomer?.lineItems?.[0]?.packageId} t={t} />
                    <OrderDetailItem label={t("TrackingNumber")} value={selectedCustomer?.trackingNumber} t={t} />
                    <OrderDetailItem label={t("ShippingProvider")} value={selectedCustomer?.shippingProvider} t={t} />
                    <OrderDetailItem label={t("DeliveryType")} value={selectedCustomer?.deliveryType} t={t} />
                    <OrderDetailItem label={t("SKU")} value={selectedCustomer?.lineItems?.[0]?.skuName} t={t} />
                    <OrderDetailItem label={t("SKUPrice")} value={`${selectedCustomer?.lineItems?.[0]?.salePrice} ${selectedCustomer?.payment?.currency}`} t={t} />
                    <OrderDetailItem label={t("ShippingFee")} value={selectedCustomer?.payment?.shippingFee} t={t} />
                    <OrderDetailItem label={t("TotalAmount")} value={`${selectedCustomer?.payment?.totalAmount} ${selectedCustomer?.payment?.currency}`} t={t} />
                    <OrderDetailItem label={t("PaymentMethod")} value={selectedCustomer?.paymentMethodName} t={t} />
                    <OrderDetailItem label={t("PaidTime")} value={selectedCustomer?.paidTime ? new Date(selectedCustomer.paidTime * 1000).toLocaleString() : t("NoData")} t={t} />
                </div>

                <div className="mt-6 flex items-start gap-4">
                    <img
                        src={selectedCustomer?.lineItems?.[0]?.skuImage}
                        alt="SKU"
                        className="w-28 h-28 object-cover rounded-lg border"
                    />
                    <div>
                        <OrderDetailItem label={t("Product")} value={selectedCustomer?.lineItems?.[0]?.productName} t={t} />
                        <OrderDetailItem label={t("SellerSKU")} value={selectedCustomer?.lineItems?.[0]?.sellerSku} t={t} />
                    </div>
                </div>

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