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
