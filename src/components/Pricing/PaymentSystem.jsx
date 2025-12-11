import React, { useEffect, useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useSelector } from "react-redux";

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_KEY);

const convertToCents = (amount) => Math.round(amount * 100);
import calculatePaymentExpireTime from "../../lib/calculatePaymentExpireTime";
import { useLocation } from "react-router-dom";

const PaymentForm = ({ email, setEmail, duration, amount, currency }) => {
  const stripe = useStripe();
  const elements = useElements();
  const currentUser = useSelector((state) => state.user.accountUser);

  const storedShopPlatform = localStorage.getItem("SelectedPlatform");
  const [cipher, setCipher] = useState(() => {
    const stored = localStorage.getItem("tiktokShopInfo");
    return stored ? JSON.parse(stored) : [];
  });
  const [lazadaShopId, setlazadaShopId] = useState(() => {
    const stored = localStorage.getItem("lazadaShopInfo");
    return stored ? JSON.parse(stored) : [];
  });
  const [shopeeShopId, setShopeeShopId] = useState(() => {
    const stored = localStorage.getItem("shopeeShopInfo");
    return stored ? JSON.parse(stored) : [];
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchClientSecret = async () => {
    try {
      const { data } = await axios.post(
        "https://grozziieget.zjweiting.com:8033/tht/payment-intent",
        // "http://localhost:2000/tht/payment-intent",
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
              email: currentUser,
            },
          },
          return_url: `${window.location.origin}/onlineprint/success?email=${currentUser}&duration=${duration}`,
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
      shopPlatform: storedShopPlatform,
      shopName:
        storedShopPlatform === "shopee"
          ? shopeeShopId[0]?.id
          : storedShopPlatform === "lazada"
          ? lazadaShopId[0]?.id
          : cipher[0].id,
      paymentTime: new Date().toISOString().split(".")[0] + "Z",
      paymentExpireTime: calculatePaymentExpireTime(duration),
      amount,
      currency,
    };
    try {
      const { data } = await axios.post(
        "https://grozziieget.zjweiting.com:8033/tht/printerUserPaymentInfo/add",
        paymentInfo
      );
      localStorage.setItem("paymentInfo", JSON.stringify(data));
    } catch (err) {
      console.error("Failed to store payment info:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!currentUser || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentUser)) {
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

            <PaymentElement />

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
        {error && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white w-96 rounded-2xl shadow-lg p-6 relative animate-fadeIn">
              {/* Close Button */}
              <button
                onClick={() => setError(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>

              {/* Error Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="red"
                    className="w-10 h-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3m0 4h.01m-.01-14a9 9 0 110 18 9 9 0 010-18z"
                    />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-semibold text-center mt-4 text-red-600">
                Something went wrong
              </h2>

              {/* Error Text */}
              <p className="text-center text-gray-600 mt-2">{error}</p>

              {/* OK Button */}
              <button
                onClick={() => setError(null)}
                className="mt-5 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
              >
                OK
              </button>
            </div>
          </div>
        )}
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

  const initialPrice = location.state?.plan?.amount;
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
