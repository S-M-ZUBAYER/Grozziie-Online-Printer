// import { useSearchParams, Link } from "react-router-dom";

// const SuccessPage = () => {
//   const [searchParams] = useSearchParams();
//   const paymentId = searchParams.get("payment_intent");
//   const email = searchParams.get("email");
//   const duration = searchParams.get("duration");
//   const status = searchParams.get("redirect_status");

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100">
//       <div className="bg-transparent border-[0.02vw] rounded-lg p-8 max-w-md text-center">
//         <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
//           <svg
//             className="w-10 h-10 text-green-600"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M5 13l4 4L19 7"
//             ></path>
//           </svg>
//         </div>
//         <h1 className="text-2xl font-semibold text-gray-800">
//           Payment Successful 🎉
//         </h1>
//         <p className="text-gray-600 mt-2">Thank you for your purchase.</p>

//         <div className="mt-4 p-4 bg-transparent rounded-lg text-left">
//           <p className="text-sm text-gray-500">Payment Intent ID:</p>
//           <p className="font-semibold text-gray-800">{paymentId}</p>

//           <p className="text-sm text-gray-500 mt-2">Status:</p>
//           <p className="font-semibold text-green-600">{status}</p>
//         </div>

//         <Link
//           to="/onlineprint/"
//           className="mt-6 inline-block bg-[#004368] text-white px-6 py-2 rounded-lg  transition"
//         >
//           Go Back Home
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default SuccessPage;

// import { useSearchParams, Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import calculatePaymentExpireTime from "../../lib/calculatePaymentExpireTime";

// const SuccessPage = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const paymentId = searchParams.get("payment_intent");
//   const email = searchParams.get("email");
//   const duration = searchParams.get("duration");
//   const amount = searchParams.get("amount");
//   const currency = searchParams.get("currency");
//   const status = searchParams.get("redirect_status");

//   const [isStoring, setIsStoring] = useState(true);
//   const [storeError, setStoreError] = useState(null);

//   useEffect(() => {
//     const storePaymentInfo = async () => {
//       try {
//         // Get payment data from localStorage
//         const pendingPaymentDataString =
//           localStorage.getItem("pendingPaymentData");

//         if (!pendingPaymentDataString) {
//           console.error("No pending payment data found");
//           setStoreError("Payment data not found");
//           setIsStoring(false);
//           return;
//         }

//         const paymentData = JSON.parse(pendingPaymentDataString);

//         const paymentInfo = {
//           email: paymentData.email,
//           shopPlatform: paymentData.shopPlatform,
//           shopName: paymentData.shopName,
//           paymentTime: new Date().toISOString().split(".")[0] + "Z",
//           paymentExpireTime: calculatePaymentExpireTime(paymentData.duration),
//           amount: paymentData.amount,
//           currency: paymentData.currency,
//         };

//         const { data } = await axios.post(
//           "https://grozziie.zjweiting.com:8033/tht/printerUserPaymentInfo/add",
//           // "http://localhost:2000/tht/printerUserPaymentInfo/add",
//           paymentInfo
//         );

//         localStorage.setItem("paymentInfo", JSON.stringify(data));
//         // Clean up pending payment data
//         localStorage.removeItem("pendingPaymentData");

//         setIsStoring(false);

//         // Redirect to home page after 1 second
//         setTimeout(() => {
//           navigate("/onlineprint/");
//         }, 2000);
//       } catch (err) {
//         console.error("Failed to store payment info:", err);
//         setStoreError("Failed to save payment information");
//         setIsStoring(false);
//       }
//     };

//     // Only store if payment was successful
//     if (status === "succeeded") {
//       storePaymentInfo();
//     } else {
//       setIsStoring(false);
//     }
//   }, [status, duration, navigate]);

//   if (isStoring) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gray-100">
//         <div className="bg-transparent border-[0.02vw] rounded-lg p-8 max-w-md text-center">
//           <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
//             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//           </div>
//           <h1 className="text-2xl font-semibold text-gray-800">
//             Processing Payment...
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Please wait while we confirm your payment.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100">
//       <div className="bg-transparent border-[0.02vw] rounded-lg p-8 max-w-md text-center">
//         <div
//           className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 ${
//             storeError ? "bg-red-100" : "bg-green-100"
//           }`}
//         >
//           {storeError ? (
//             <svg
//               className="w-10 h-10 text-red-600"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M6 18L18 6M6 6l12 12"
//               ></path>
//             </svg>
//           ) : (
//             <svg
//               className="w-10 h-10 text-green-600"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M5 13l4 4L19 7"
//               ></path>
//             </svg>
//           )}
//         </div>

//         <h1 className="text-2xl font-semibold text-gray-800">
//           {storeError ? "Payment Received" : "Payment Successful 🎉"}
//         </h1>
//         <p className="text-gray-600 mt-2">
//           {storeError
//             ? "Your payment was successful, but there was an issue saving the details. Please contact support."
//             : "Thank you for your purchase. Redirecting..."}
//         </p>

//         <div className="mt-4 p-4 bg-transparent rounded-lg text-left">
//           <p className="text-sm text-gray-500">Payment Intent ID:</p>
//           <p className="font-semibold text-gray-800">{paymentId}</p>

//           <p className="text-sm text-gray-500 mt-2">Status:</p>
//           <p
//             className={`font-semibold ${
//               storeError ? "text-yellow-600" : "text-green-600"
//             }`}
//           >
//             {status}
//           </p>

//           {storeError && (
//             <>
//               <p className="text-sm text-gray-500 mt-2">Error:</p>
//               <p className="font-semibold text-red-600">{storeError}</p>
//             </>
//           )}
//         </div>

//         <Link
//           to="/onlineprint/"
//           className="mt-6 inline-block bg-[#004368] text-white px-6 py-2 rounded-lg transition"
//         >
//           Go Back Home
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default SuccessPage;

import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import calculatePaymentExpireTime from "../../lib/calculatePaymentExpireTime";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentId = searchParams.get("payment_intent");
  const email = searchParams.get("email");
  const duration = searchParams.get("duration");
  const amount = searchParams.get("amount");
  const currency = searchParams.get("currency");
  const status = searchParams.get("redirect_status");

  const [isStoring, setIsStoring] = useState(true);
  const [storeError, setStoreError] = useState(null);

  useEffect(() => {
    const storePaymentInfo = async () => {
      try {
        // Get payment data from localStorage
        const pendingPaymentDataString =
          localStorage.getItem("pendingPaymentData");

        if (!pendingPaymentDataString) {
          console.error("No pending payment data found");
          setStoreError("Payment data not found");
          setIsStoring(false);
          return;
        }

        const paymentData = JSON.parse(pendingPaymentDataString);

        const paymentInfo = {
          email: paymentData.email,
          shopPlatform: paymentData.shopPlatform,
          shopName: paymentData.shopName,
          paymentTime: new Date().toISOString().split(".")[0] + "Z",
          paymentExpireTime: calculatePaymentExpireTime(paymentData.duration),
          amount: paymentData.amount,
          currency: paymentData.currency,
        };

        const { data } = await axios.post(
          "https://grozziieget.zjweiting.com:8033/tht/printerUserPaymentInfo/add",
          // "http://localhost:2000/tht/printerUserPaymentInfo/add",
          paymentInfo
        );

        localStorage.setItem("paymentInfo", JSON.stringify(data));
        // Clean up pending payment data
        localStorage.removeItem("pendingPaymentData");

        setIsStoring(false);

        // Redirect to home page after 1 second
        setTimeout(() => {
          navigate("/onlineprint/");
        }, 1000);
      } catch (err) {
        console.error("Failed to store payment info:", err);
        setStoreError("Failed to save payment information");
        setIsStoring(false);
      }
    };

    // Only store if payment was successful
    if (status === "succeeded") {
      storePaymentInfo();
    } else {
      setIsStoring(false);
    }
  }, [status, duration, navigate]);

  if (isStoring) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="bg-transparent border-[0.02vw] rounded-lg p-8 max-w-md text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Processing Payment...
          </h1>
          <p className="text-gray-600 mt-2">
            Please wait while we confirm your payment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-transparent border-[0.02vw] rounded-lg p-8 max-w-md text-center">
        <div
          className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 ${
            storeError ? "bg-red-100" : "bg-green-100"
          }`}
        >
          {storeError ? (
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          )}
        </div>

        <h1 className="text-2xl font-semibold text-gray-800">
          {storeError ? "Payment Received" : "Payment Successful 🎉"}
        </h1>
        <p className="text-gray-600 mt-2">
          {storeError
            ? "Your payment was successful, but there was an issue saving the details. Please contact support."
            : "Thank you for your purchase. Redirecting..."}
        </p>

        <div className="mt-4 p-4 bg-transparent rounded-lg text-left">
          <p className="text-sm text-gray-500">Payment Intent ID:</p>
          <p className="font-semibold text-gray-800">{paymentId}</p>

          <p className="text-sm text-gray-500 mt-2">Status:</p>
          <p
            className={`font-semibold ${
              storeError ? "text-yellow-600" : "text-green-600"
            }`}
          >
            {status}
          </p>

          {storeError && (
            <>
              <p className="text-sm text-gray-500 mt-2">Error:</p>
              <p className="font-semibold text-red-600">{storeError}</p>
            </>
          )}
        </div>

        <Link
          to="/onlineprint/"
          className="mt-6 inline-block bg-[#004368] text-white px-6 py-2 rounded-lg transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
