import React, { useEffect, useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_KEY);

const convertToCents = (amount) => Math.round(amount * 100);
import calculatePaymentExpireTime from "../../lib/calculatePaymentExpireTime";

const PaymentForm = ({ email, setEmail, duration, amount, currency }) => {
  const stripe = useStripe();
  const elements = useElements();
  const currentUser = useSelector((state) => state.user.accountUser);
  console.log(currentUser);

  const [cipher, setCipher] = useState(() => {
    const stored = localStorage.getItem("tiktokShopInfo");
    return stored ? JSON.parse(stored) : [];
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchClientSecret = async () => {
    try {
      const { data } = await axios.post(
        "https://grozziieget.zjweiting.com:8033/tht/payment-intent",
        {
          amount: convertToCents(amount),
          currency,
        }
      );
      await storePaymentInfo();
      await confirmPayment(data.clientSecret);
    } catch (err) {
      console.error("Failed to create payment intent:", err);
    }
  };
  const confirmPayment = async (clientSecret) => {
    if (!stripe || !elements) return;

    try {
      await elements.submit();
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              email: email,
            },
          },
          return_url: `${window.location.origin}/success?email=${email}&duration=${duration}`,
        },
      });

      if (error) {
        setError(error.message);
      } else if (paymentIntent?.status === "succeeded") {
        setSuccess(true);
      }
    } catch (error) {
      console.error("Payment confirmation failed:", error);
      setError("An error occurred while processing your payment.");
    }
  };

  const storePaymentInfo = async () => {
    const paymentInfo = {
      email: currentUser,
      shopPlatform: "TikTok",
      shopName: cipher[0].name,
      paymentTime: new Date().toISOString().split(".")[0] + "Z",
      paymentExpireTime: calculatePaymentExpireTime(duration),
    };

    console.log("Payment Info to be sent:", paymentInfo);

    try {
      const { data } = await axios.post(
        "https://grozziieget.zjweiting.com:8033/tht/printerUserPaymentInfo/add",
        paymentInfo
      );
      localStorage.setItem("paymentInfo", JSON.stringify(data));
      console.log("Payment info stored successfully:", data);
    } catch (err) {
      console.error("Failed to store payment info:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);
    await fetchClientSecret();

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 gap-10">
      <div className="w-[60vw] max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Stripe Payment</h2>
        {success ? (
          <p className="text-green-600 text-center">Payment Successful!</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border rounded"
                placeholder="Enter your email"
                value={currentUser}
                onChange={(e) => setEmail(e.target.value)}
                required
                readOnly
              />
            </div>

            {/* Stripe Payment Element */}
            <PaymentElement />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!stripe || loading}
              className={`w-full p-3 rounded font-semibold ${
                loading
                  ? "bg-gray-400"
                  : "bg-blue-700 text-white hover:bg-blue-800"
              }`}
            >
              {loading ? "Processing..." : `Pay $${amount}`}
            </button>
          </form>
        )}
        {error && <p className="text-red-500 text-center mt-3">{error}</p>}
      </div>

      {/* Optional illustration */}
      <div>
        <img
          src="paymentIllustration.svg"
          alt="Illustration"
          className="h-[70vh]"
        />
      </div>
    </div>
  );
};

const Payment = () => {
  const location = useLocation();
  const packageName = location.state?.plan?.name || "basic";
  const duration = location.state?.plan?.duration || "1month";
  console.log(location.state.plan);

  const initialPrice = 10;
  const [currency] = useState("usd");

  const [email, setEmail] = useState("");

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: convertToCents(initialPrice),
        currency,
        appearance: {
          theme: "flat",
          variables: {
            colorPrimary: "#004368",
            colorBackground: "transparent",
            colorText: "#000",
            colorDanger: "#df1b41",
            fontFamily: "Poppins, sans-serif",
            borderRadius: "8px",
            spacingUnit: "6px",
          },
          rules: {
            ".Input": {
              backgroundColor: "transparent",
              boxShadow: "none",
              borderColor: "transparent",
            },
            ".Input:focus": {
              borderColor: "transparent",
            },
          },
        },
      }}
    >
      <PaymentForm
        email={email}
        setEmail={setEmail}
        duration={duration}
        amount={initialPrice}
        currency={currency}
      />
    </Elements>
  );
};

export default Payment;
