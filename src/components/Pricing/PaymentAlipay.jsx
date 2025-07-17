// import React, { useState } from 'react';
// import axios from 'axios';
// import QRCode from 'qrcode.react';

// const PaymentAlipay = () => {
//     const [qrCodeImage, setQrCodeImage] = useState('');
//     const [paymentStatus, setPaymentStatus] = useState('');

//     const handlePayment = async () => {
//         console.log("Clicked");
//         try {
//             const response = await axios.post('http://localhost:5000/api/pay', {
//                 out_trade_no: '20150320010101001',
//                 total_amount: '00.10',
//                 subject: 'Test Order',
//             });

//             if (response.data.qrCodeImage) {
//                 setQrCodeImage(response.data.qrCodeImage);
//             }
//         } catch (error) {
//             console.error('Payment request error:', error);
//         }
//     };

//     return (
//         <div>
//             <button onClick={handlePayment}>Initiate Payment</button>
//             {qrCodeImage && (
//                 <div>
//                     <QRCode value={qrCodeImage} />
//                     <p>Scan QR code to make payment</p>
//                 </div>
//             )}
//             {paymentStatus && <p>Payment Status: {paymentStatus}</p>}
//         </div>
//     );
// };

// export default PaymentAlipay;

// Payment.js
import React, { useState } from "react";
import axios from "axios";

const PaymentAlipay = () => {
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/create-payment",
        {
          orderId,
          amount,
          subject,
          body,
        }
      );

      // Redirect to Alipay payment page
      window.location.href = response.data;
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <div>
      <h2>Alipay Payment</h2>
      <input
        type="text"
        placeholder="Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <input
        type="text"
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button onClick={handlePayment}>Pay Now</button>

      <div>
        <iframe
          src={`https://excashier.alipay.com/standard/auth.htm?payOrderId=d5124b54196f42bebb25a3931fca575d.30`}
          title="Payment"
        />
      </div>
    </div>
  );
};

export default PaymentAlipay;
