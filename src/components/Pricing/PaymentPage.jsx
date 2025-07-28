import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
// import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const locations = [
  {
    value: "United States",
    name: "United States",
    currencyCode: "USD",
    countryCode: "US",
    flag: "https://flagcdn.com/us.svg",
  },
  {
    value: "China",
    name: "China",
    currencyCode: "CNY",
    countryCode: "CN",
    flag: "https://flagcdn.com/cn.svg",
  },
  {
    value: "Philippines",
    name: "Philippines",
    currencyCode: "PHP",
    countryCode: "PH",
    flag: "https://flagcdn.com/ph.svg",
  },
  {
    value: "Vietnam",
    name: "Vietnam",
    currencyCode: "VND",
    countryCode: "VN",
    flag: "https://flagcdn.com/vn.svg",
  },
  {
    value: "Singapore",
    name: "Singapore",
    currencyCode: "SGD",
    countryCode: "SG",
    flag: "https://flagcdn.com/sg.svg",
  },
  {
    value: "Malaysia",
    name: "Malaysia",
    currencyCode: "MYR",
    countryCode: "MY",
    flag: "https://flagcdn.com/my.svg",
  },
  {
    value: "Indonesia",
    name: "Indonesia",
    currencyCode: "IDR",
    countryCode: "ID",
    flag: "https://flagcdn.com/id.svg",
  },
  {
    value: "Thailand",
    name: "Thailand",
    currencyCode: "THB",
    countryCode: "TH",
    flag: "https://flagcdn.com/th.svg",
  },
  {
    value: "Hong Kong",
    name: "Hong Kong",
    currencyCode: "HKD",
    countryCode: "HK",
    flag: "https://flagcdn.com/hk.svg",
  },
  {
    value: "Canada",
    name: "Canada",
    currencyCode: "CAD",
    countryCode: "CA",
    flag: "https://flagcdn.com/ca.svg",
  },
  {
    value: "United Arab Emirates",
    name: "United Arab Emirates",
    currencyCode: "AED",
    countryCode: "AE",
    flag: "https://flagcdn.com/ae.svg",
  },
  {
    value: "Australia",
    name: "Australia",
    currencyCode: "AUD",
    countryCode: "AU",
    flag: "https://flagcdn.com/au.svg",
  },
  {
    value: "Japan",
    name: "Japan",
    currencyCode: "JPY",
    countryCode: "JP",
    flag: "https://flagcdn.com/jp.svg",
  },
  {
    value: "Brazil",
    name: "Brazil",
    currencyCode: "BRL",
    countryCode: "BR",
    flag: "https://flagcdn.com/br.svg",
  },
  {
    value: "Mexico",
    name: "Mexico",
    currencyCode: "MXN",
    countryCode: "MX",
    flag: "https://flagcdn.com/mx.svg",
  },
  {
    value: "India",
    name: "India",
    currencyCode: "INR",
    countryCode: "IN",
    flag: "https://flagcdn.com/in.svg",
  },
  {
    value: "Sweden",
    name: "Sweden",
    currencyCode: "SEK",
    countryCode: "SE",
    flag: "https://flagcdn.com/se.svg",
  },
  {
    value: "Denmark",
    name: "Denmark",
    currencyCode: "DKK",
    countryCode: "DK",
    flag: "https://flagcdn.com/dk.svg",
  },
  {
    value: "Norway",
    name: "Norway",
    currencyCode: "NOK",
    countryCode: "NO",
    flag: "https://flagcdn.com/no.svg",
  },
  {
    value: "New Zealand",
    name: "New Zealand",
    currencyCode: "NZD",
    countryCode: "NZ",
    flag: "https://flagcdn.com/nz.svg",
  },
  {
    value: "Czech Republic",
    name: "Czech Republic",
    currencyCode: "CZK",
    countryCode: "CZ",
    flag: "https://flagcdn.com/cz.svg",
  },
  {
    value: "Poland",
    name: "Poland",
    currencyCode: "PLN",
    countryCode: "PL",
    flag: "https://flagcdn.com/pl.svg",
  },
  {
    value: "Hungary",
    name: "Hungary",
    currencyCode: "HUF",
    countryCode: "HU",
    flag: "https://flagcdn.com/hu.svg",
  },
  {
    value: "South Africa",
    name: "South Africa",
    currencyCode: "ZAR",
    countryCode: "ZA",
    flag: "https://flagcdn.com/za.svg",
  },
  {
    value: "Israel",
    name: "Israel",
    currencyCode: "ILS",
    countryCode: "IL",
    flag: "https://flagcdn.com/il.svg",
  },
  {
    value: "Switzerland",
    name: "Switzerland",
    currencyCode: "CHF",
    countryCode: "CH",
    flag: "https://flagcdn.com/ch.svg",
  },
];

const currencyList = [
  { code: "USD", name: "United States Dollar", countryCode: "US" },
  { code: "CNY", name: "Chinese Yuan", countryCode: "CN" },
  { code: "VND", name: "Vietnamese Dong", countryCode: "VN" },
  { code: "PHP", name: "Philippine Peso", countryCode: "PH" },
  { code: "SGD", name: "Singapore Dollar", countryCode: "SG" },
  { code: "MYR", name: "Malaysian Ringgit", countryCode: "MY" },
  { code: "IDR", name: "Indonesian Rupiah", countryCode: "ID" },
  { code: "THB", name: "Thai Baht", countryCode: "TH" },
  { code: "HKD", name: "Hong Kong Dollar", countryCode: "HK" },
  { code: "EUR", name: "Euro", countryCode: "EU" },
  { code: "GBP", name: "British Pound", countryCode: "GB" },
  { code: "JPY", name: "Japanese Yen", countryCode: "JP" },
  { code: "AUD", name: "Australian Dollar", countryCode: "AU" },
  { code: "CAD", name: "Canadian Dollar", countryCode: "CA" },
  { code: "INR", name: "Indian Rupee", countryCode: "IN" },
  { code: "BRL", name: "Brazilian Real", countryCode: "BR" },
  { code: "MXN", name: "Mexican Peso", countryCode: "MX" },
  { code: "AED", name: "United Arab Emirates Dirham", countryCode: "AE" },
  { code: "SEK", name: "Swedish Krona", countryCode: "SE" },
  { code: "DKK", name: "Danish Krone", countryCode: "DK" },
  { code: "NOK", name: "Norwegian Krone", countryCode: "NO" },
  { code: "NZD", name: "New Zealand Dollar", countryCode: "NZ" },
  { code: "CZK", name: "Czech Koruna", countryCode: "CZ" },
  { code: "PLN", name: "Polish Złoty", countryCode: "PL" },
  { code: "HUF", name: "Hungarian Forint", countryCode: "HU" },
  { code: "ZAR", name: "South African Rand", countryCode: "ZA" },
  { code: "ILS", name: "Israeli New Shekel", countryCode: "IL" },
  { code: "CHF", name: "Swiss Franc", countryCode: "CH" },
];

const PaymentPage = () => {
  const { email } = useParams();
  const [amount, setAmount] = useState(null);
  const [newEmail, setNewEmail] = useState(null);
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [currency, setCurrency] = useState("");
  const [currencyData, setCurrencyData] = useState({});
  const [availableCurrencies, setAvailableCurrencies] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  // Decode email from params
  useEffect(() => {
    if (email) {
      try {
        const decodedEmail = decodeURIComponent(atob(email));
        setNewEmail(decodedEmail);
      } catch (error) {
        toast.error("Failed to decode email.");
      }
    }
  }, [email]);

  // Fetch payment amount
  useEffect(() => {
    const fetchAmount = async () => {
      try {
        const response = await axios.get(
          "https://grozziieget.zjweiting.com:8033/tht/pdfPayment/1"
        );
        setCurrencyData(response.data);
        setAmount(response.data.USD);
      } catch (error) {
        toast.error("Failed to fetch amount from the API");
      }
    };

    fetchAmount();
  }, []);

  // Fetch user details based on email
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/user/by/email?email=${newEmail}`
        );
        const { country } = response.data;
        setCountryCode(country);

        // Match country and set default currency
        const matchedCountry = locations.find(
          (loc) => loc.countryCode === country
        );
        if (matchedCountry) {
          setCountry(matchedCountry.value);
        }
        const matchedCurrency = currencyList.find(
          (cur) => cur.countryCode === country
        );
        if (matchedCurrency) {
          setCurrency(matchedCurrency.code);
          setAvailableCurrencies([matchedCurrency.currencyCode]);
        }
      } catch (error) {
        console.error("Failed to fetch details for the email.");
      }
    };

    if (newEmail) {
      fetchDetails();
    }
  }, [newEmail]);

  // Handle payment
  const handlePayment = async () => {
    if (!amount || !newEmail || !currency) {
      toast.error("All required fields must be filled.");
      return;
    }

    setIsLoading(true);

    try {
      const emailCheckResponse = await axios.get(
        `https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/user/by/email?email=${newEmail}`
      );

      if (!emailCheckResponse.data) {
        toast.error("Invalid email address.");
        setIsLoading(false);
        return;
      }

      // const response = await axios.post('http://localhost:2000/tht/create-pdfPayment-intent', {
      const response = await axios.post(
        "https://grozziieget.zjweiting.com:8033/tht/create-pdfPayment-intent",
        {
          email: newEmail,
          amount,
          currency,
          purpose: "pdf",
        }
      );

      const { clientSecret } = response.data;

      if (!stripe || !elements) {
        toast.error("Stripe is not initialized.");
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
      }
    } catch (error) {
      toast.error(
        `Payment error: ${
          error.response?.data?.error || error.message
        },Please use Grozziie creating account email`
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleToCurrencyChange = (e) => {
    const selectedCurrency = e.target.value; // Get the selected currency
    setCurrency(selectedCurrency); // Update the currency state
    // Dynamically set the amount based on the selected currency
    setAmount(currencyData?.[selectedCurrency]);

    if (!currencyData?.[selectedCurrency]) {
      setAmount(currencyData?.SGD);
      setCurrency("SGD");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-semibold mb-6 text-center text-cyan-700">
          Make PDF System Payment
        </h1>
        <p className="text-center mb-4 font-semibold text-base text-gray-600">
          Processing payment for: <strong>{newEmail}</strong>
        </p>

        <div className="text-center mb-4">
          <label className="block text-base font-semibold text-gray-700 mb-2">
            Select Country
          </label>
          {/* <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full p-3 border rounded-lg mb-4"
                    >
                        <option value="">Select a country</option>
                        {locations.map((loc) => (
                            <option key={loc.value} value={loc.value} style={{ backgroundImage: `url(${loc.flag})`, backgroundSize: '20px 15px', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', paddingLeft: '25px' }}>
                                {loc.name}
                            </option>
                        ))}
                    </select> */}

          <div className="relative">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            >
              <option value="">Select a country</option>
              {locations.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.name}
                </option>
              ))}
            </select>

            {/* For custom dropdown (optional) */}
            {/* <div className="absolute top-0 left-0 mt-12 w-full border rounded-lg bg-white shadow-lg">
                            {locations.map((loc) => (
                                <option
                                    key={loc.value}
                                    className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => setCountry(loc.value)}
                                >
                                    <img src={loc.flag} alt={loc.name} className="w-6 h-4 mr-2" />
                                    {loc.name}
                                </option>
                            ))}
                        </div> */}
          </div>

          <label className="block text-base font-semibold text-gray-700 mb-2">
            Select Currency
          </label>
          <select
            value={currency}
            onChange={(e) => handleToCurrencyChange(e)}
            className="w-full p-3 border rounded-lg mb-4"
          >
            <option value="">Select a Currency</option>
            {currencyList.map((cur) => (
              <option key={cur.code} value={cur.code}>
                {cur.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-lg mb-6 text-center">
          <strong>Amount:</strong> {currency ? currency : "USD"}{" "}
          {amount ? amount.toFixed(2) : "Loading..."}
        </div>

        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Card Information
          </label>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "18px",
                  color: "#424770",
                  "::placeholder": { color: "#aab7c4" },
                },
                invalid: { color: "#9e2146" },
              },
              hidePostalCode: true, // This hides the ZIP/Postal code field
            }}
          />
        </div>

        <button
          onClick={handlePayment}
          disabled={!stripe || isLoading || !amount}
          className={`w-full py-3 rounded text-white ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-cyan-700 hover:bg-cyan-800 focus:outline-none"
          }`}
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

const WrappedPaymentPage = () => (
  <Elements stripe={stripePromise}>
    <PaymentPage />
  </Elements>
);

export default WrappedPaymentPage;
