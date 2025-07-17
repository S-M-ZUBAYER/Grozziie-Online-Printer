import React, { useState } from 'react';
import Barcode from 'react-barcode';
import shopeeLogo from '../../assets/Shopee.jpg';
import GrozziieLogo from '../../assets/GrozziieLogo.png';

const Model4 = ({ items }) => {
  const barcodeNumber = '123456789'; // Replace with your barcode number
  const [item, setItem] = useState(items[0]);

  return (
    <div className="model2-container border border-spacing-4 border-slate-950 p-2">
      {/* Third Row */}
      <div className="model2-row">
        <div className="barcode-container">
          <Barcode value={barcodeNumber} />
        </div>
        <div className="customer-details-container">
          <p>Account Name: {item?.accountName}</p>
          <p>Customer Name: {item?.customerName}</p>
          <p>Address: {item?.address?.length > 10 ? item?.address.slice(0, 10) + '...' : item?.address}</p>
          <p>Customer Mark: {item?.customerMark}</p>
        </div>
      </div>
      {/* First Row */}
      <div className="model2-row">
        <div className="logo-container flex justify-between items-center">
          <img src={shopeeLogo} alt="Company Logo 1" className="company-logo w-16 h-8" />
          <img src={GrozziieLogo} alt="Company Logo 1" className="company-logo w-16 h-8" />
        </div>
        <div className="image-container">
          <img src={item?.productDetails?.TP874} alt="Product" className="product-image" />
        </div>

      </div>

      {/* Second Row */}
      <div className="model2-row">
        <div className="barcode-container">
          <Barcode value={barcodeNumber} />
        </div>
        <div className="details-container">
          <p>Model Number: {item?.productName}</p>
          <p>Delivery Company: {item?.deliveryCompany}</p>
          <p>Delivery Code: {item?.deliveryCode}</p>
          <img src="qr_code.png" alt="QR Code" className="qr-code" />
        </div>
      </div>


    </div>
  );
};

export default Model4;
