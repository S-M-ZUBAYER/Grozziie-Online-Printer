import React, { useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useParams } from "react-router-dom";
import paymentLogo from "../../assets/paymentIllustration.svg";
import calculatePaymentExpireTime from "../../lib/calculatePaymentExpireTime";

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_KEY);
const convertToCents = (amount) => Math.round(amount * 100);

const PaymentForm = ({
  duration,
  amount,
  country,
  platform,
  decodedEmail,
  shopName,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------------- Fetch Payment Intent ----------------
  const fetchClientSecret = async () => {
    try {
      const { data } = await axios.post(
        "https://grozziieget.zjweiting.com:8033/tht/payment-intent",
        {
          amount: convertToCents(amount),
          currency: "usd",
        }
      );

      await storePaymentInfo();
      await confirmPayment(data.clientSecret);
    } catch (err) {
      console.error("Failed to create payment intent:", err);
      setError("Failed to create payment intent.");
    }
  };

  // ---------------- Confirm Payment ----------------
  const confirmPayment = async (clientSecret) => {
    if (!stripe || !elements) return;

    try {
      await elements.submit();

      const { error: stripeError, paymentIntent } = await stripe.confirmPayment(
        {
          elements,
          clientSecret,
          confirmParams: {
            payment_method_data: { billing_details: { email: decodedEmail } },
            return_url: `${window.location.origin}/onlineprint/success?email=${decodedEmail}&duration=${duration}`,
          },
        }
      );

      if (stripeError) setError(stripeError.message);
      else if (paymentIntent?.status === "succeeded") setSuccess(true);
    } catch (err) {
      console.error("Payment Confirmation Error:", err);
      setError("An error occurred during payment.");
    }
  };

  // ---------------- Store Payment Info ----------------
  const storePaymentInfo = async () => {
    const paymentInfo = {
      email: decodedEmail,
      shopPlatform: platform,
      shopName: shopName,
      paymentTime: new Date().toISOString(),
      paymentExpireTime: calculatePaymentExpireTime(duration),
      amount,
      currency: "usd",
      country,
    };

    try {
      await axios.post(
        "https://grozziieget.zjweiting.com:8033/tht/printerUserPaymentInfo/add",
        paymentInfo
      );
    } catch (err) {
      console.error("Failed to store payment info:", err);
    }
  };

  // ---------------- Submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!decodedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(decodedEmail)) {
      setError("Invalid email in URL.");
      return;
    }

    setLoading(true);
    setError(null);
    await fetchClientSecret();
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="flex flex-col lg:flex-row items-center gap-12 w-full max-w-7xl">
        {/* LEFT SIDE CARD */}
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20">
          <h2 className="text-3xl font-semibold text-center text-gray-800  drop-shadow-md mb-6">
            Stripe Payment
          </h2>

          {success ? (
            <p className="text-green-400 text-center font-medium text-lg">
              Payment Successful!
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={decodedEmail}
                  readOnly
                  className="w-full p-3 rounded-lg bg-white/20 text-gray-800 border border-gray-300 focus:border-blue-300 outline-none placeholder-white/50"
                />
              </div>

              {/* STRIPE PAYMENT ELEMENT */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <PaymentElement />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={!stripe || loading}
                className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-lg"
                }`}
              >
                {loading ? "Processing..." : `Pay $${amount}`}
              </button>
            </form>
          )}

          {/* ERROR MODAL */}
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

        {/* RIGHT SIDE ILLUSTRATION */}
        <div className="hidden lg:block">
          <img
            src={paymentLogo}
            alt="Payment Illustration"
            className="h-[70vh] drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

const PaymentFromApp = () => {
  const { duration, amount, packageId, email, country, platform, shopName } =
    useParams();
  const decodedEmail = decodeURIComponent(atob(email));

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: convertToCents(amount),
        currency: "usd",
        appearance: {
          theme: "flat",
          variables: {
            colorPrimary: "#004368",
            fontFamily: "Poppins",
            borderRadius: "8px",
          },
        },
      }}
    >
      <PaymentForm
        duration={duration}
        amount={Number(amount)}
        country={country}
        platform={platform}
        shopName={shopName} // now passed from URL
        decodedEmail={decodedEmail}
      />
    </Elements>
  );
};

export default PaymentFromApp;
