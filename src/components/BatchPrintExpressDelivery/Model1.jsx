import React, { useState } from "react";
import Barcode from "react-barcode"; // You may need to install this library
import shopeeLogo from "../../assets/Shopee.jpg";
import GrozziieLogo from "../../assets/GrozziieLogo.png";

const Model1 = ({ items }) => {
  const barcodeNumber1 = "123456789"; // Replace with your barcode number
  const barcodeNumber2 = "987654321"; // Replace with your barcode number
  const [item1, setItem1] = useState(items[0]);

  return (
    <div className="model1-container border border-spacing-4 border-slate-950 p-2">
      {/* First Row */}
      <div className="model1-row">
        <div className="logo-container flex justify-between items-center">
          {/* Replace the following with your company logos */}
          <img
            src={shopeeLogo}
            alt="Company Logo 1"
            className="company-logo w-16 h-8"
          />
          <img
            src={GrozziieLogo}
            alt="Company Logo 1"
            className="company-logo w-16 h-8"
          />
        </div>
        <div className="barcode-container">
          {/* Barcode with barcode number */}
          <Barcode value={barcodeNumber1} />
        </div>
      </div>

      {/* Second Row */}
      <div className="model1-row">
        <div className="image-container">
          {/* Replace the following with your image */}
          <img
            src={item1?.productDetails?.TP874}
            alt="Product"
            className="product-image"
          />
        </div>
        <div className="details-container">
          {/* Replace the following with your model details */}
          <p>Model Number: {item1?.productName}</p>
          <p>Delivery Company: {item1?.deliveryCompany}</p>
          <p>Delivery Code: {item1?.deliveryCode}</p>
          {/* QR Code with relevant details */}
          <img src="qr_code.png" alt="QR Code" className="qr-code" />
        </div>
      </div>

      {/* Third Row */}
      <div className="model1-row">
        <div className="barcode-container">
          {/* Another barcode with barcode number */}
          <Barcode value={barcodeNumber2} />
        </div>
        <div className="customer-details-container">
          {/* Replace the following with customer details */}
          <p>Account Name: {item1?.accountName}</p>
          <p>Customer Name: {item1?.customerName}</p>
          <p>Address: {item1?.address?.length > 10 ? item1?.address.slice(0, 10) + '...' : item1?.address}</p>

          <p>Customer Mark: {item1?.customerMark}</p>
        </div>
      </div>
    </div>
  );
};

export default Model1;
