import { useSearchParams, Link } from "react-router-dom";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_intent");
  const email = searchParams.get("email");
  const duration = searchParams.get("duration");
  console.log(email);
  console.log(duration);
  console.log(paymentId);
  const status = searchParams.get("redirect_status");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-transparent border-[0.02vw] rounded-lg p-8 max-w-md text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
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
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-600 mt-2">Thank you for your purchase.</p>

        <div className="mt-4 p-4 bg-transparent rounded-lg text-left">
          <p className="text-sm text-gray-500">Payment Intent ID:</p>
          <p className="font-semibold text-gray-800">{paymentId}</p>

          <p className="text-sm text-gray-500 mt-2">Status:</p>
          <p className="font-semibold text-green-600">{status}</p>
        </div>

        <Link
          to="/"
          className="mt-6 inline-block bg-[#004368] text-white px-6 py-2 rounded-lg  transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
