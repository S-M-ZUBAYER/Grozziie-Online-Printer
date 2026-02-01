// import React, { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import logoEmail from "../../assets/email.png";
// import { useSelector } from "react-redux";
// import { useTranslation } from "react-i18next";

// const VerifyEmailPage = () => {
//   const { t } = useTranslation();
//   const selectedLanguage = useSelector(
//     (state) => state.user.selectedLanguageRedux,
//   );
//   const [numbers, setNumbers] = useState(["", "", "", "", "", ""]);
//   const [verifyCodeError, setVerifyCodeError] = useState("");
//   const inputRefs = useRef([]);
//   const navigate = useNavigate();

//   // const handleChange = (index, value) => {
//   //   if (value.length <= 1 && !isNaN(value)) {
//   //     const newNumbers = [...numbers];
//   //     newNumbers[index] = value;
//   //     setNumbers(newNumbers);

//   //     // Move focus to next input field if value is not empty and not the last input
//   //     if (value && index < inputRefs.current.length - 1) {
//   //       inputRefs.current[index + 1].focus();
//   //     }
//   //   }
//   // };

//   const handleChange = (index, value) => {
//     // Allow alphanumeric characters (letters and numbers)
//     if (value && !/^[a-zA-Z0-9]$/.test(value)) return;

//     const newNumbers = [...numbers];
//     newNumbers[index] = value.toUpperCase(); // Convert to uppercase for consistency
//     setNumbers(newNumbers);
//     setVerifyCodeError("");

//     // Auto-focus next input
//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const verifyCode = numbers.join("");
//     console.log(verifyCode);
//     try {
//       const response = await fetch(
//         // `https://grozziieget.zjweiting.com:3091/GrozziiePrint-LoginRegistration/user/verify?code=${verifyCode}`,
//         `https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/v1/user/verify?code=${verifyCode}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       if (response.status === 200) {
//         navigate("/onlineprint/login");
//       } else if (response.status === 404) {
//         setVerifyCodeError(t("wrong_verification_code"));
//       } else {
//         console.error("Something went wrong. Please try again!");
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//     }
//   };

//   return (
//     <div className="bg-[#004368] bg-opacity-5 min-h-[100vh] py-24">
//       <div className="w-[1139px] h-[658px] mx-auto bg-white rounded-2xl">
//         <div className="py-16 flex flex-col items-center justify-center space-y-6">
//           <div className="bg-[#0043681a] rounded-full p-3 w-[142px] h-[142px]">
//             <img src={logoEmail} alt="Email" className="size-[120px]" />
//           </div>
//           <h4 className="text-[#004368] text-4xl font-semibold leading-normal">
//             {t("verify_email")}
//           </h4>
//           <p className="text-center text-black text-sm font-normal leading-normal px-5">
//             {t("verify_email_instruction")}
//           </p>
//           <div>
//             <div className="flex space-x-4">
//               {numbers.map((number, index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   value={number}
//                   required
//                   onChange={(e) => handleChange(index, e.target.value)}
//                   ref={(el) => (inputRefs.current[index] = el)}
//                   className="border border-gray-300 rounded-lg p-4 text-center text-xl w-12"
//                   maxLength="1"
//                 />
//               ))}
//             </div>
//             {verifyCodeError && (
//               <p className="text-xs pt-3 text-red-500 font-bold">
//                 {verifyCodeError}
//               </p>
//             )}
//           </div>
//           <div className="flex items-center justify-center mb-6">
//             <button
//               className="bg-[#004368] hover:bg-opacity-50 text-white hover:text-black hover:font-semibold w-[180px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mr-3 mt-6"
//               type="submit"
//               onClick={handleSubmit}
//             >
//               {t("verify_continue")}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifyEmailPage;

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logoEmail from "../../assets/email.png";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const VerifyEmailPage = () => {
  const { t } = useTranslation();
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux,
  );

  const [numbers, setNumbers] = useState(["", "", "", "", "", ""]);
  const [verifyCodeError, setVerifyCodeError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    // Only allow alphanumeric
    if (value && !/^[a-zA-Z0-9]$/.test(value)) return;

    const newNumbers = [...numbers];
    newNumbers[index] = value.toUpperCase(); // Uppercase for consistency
    setNumbers(newNumbers);
    setVerifyCodeError("");

    // Auto-focus next input
    if (value && index < numbers.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const verifyCode = numbers.join("");
    if (verifyCode.length < 6) {
      setVerifyCodeError(t("enter_complete_code"));
      return;
    }

    setIsLoading(true);
    setVerifyCodeError("");

    try {
      const response = await fetch(
        `https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/v1/user/verify?code=${verifyCode}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.status === 200) {
        navigate("/onlineprint/login");
      } else if (response.status === 404) {
        setVerifyCodeError(t("wrong_verification_code"));
      } else {
        setVerifyCodeError(t("SomethingWentWrong"));
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      setVerifyCodeError(t("SomethingWentWrong"));
      console.error("Error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#004368] bg-opacity-5 min-h-[100vh] py-24">
      <div className="w-[1139px] h-[658px] mx-auto bg-white rounded-2xl">
        <div className="py-16 flex flex-col items-center justify-center space-y-6">
          <div className="bg-[#0043681a] rounded-full p-3 w-[142px] h-[142px] flex items-center justify-center">
            <img src={logoEmail} alt="Email" className="w-[120px]" />
          </div>

          <h4 className="text-[#004368] text-4xl font-semibold leading-normal">
            {t("verify_email")}
          </h4>

          <p className="text-center text-black text-sm font-normal leading-normal px-5">
            {t("verify_email_instruction")}
          </p>

          {/* Code Input */}
          <div>
            <div className="flex space-x-4">
              {numbers.map((number, index) => (
                <input
                  key={index}
                  type="text"
                  value={number}
                  onChange={(e) => handleChange(index, e.target.value)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="border border-gray-300 rounded-lg p-4 text-center text-xl w-12"
                  maxLength={1}
                  disabled={isLoading}
                />
              ))}
            </div>

            {verifyCodeError && (
              <p className="text-xs pt-3 text-red-500 font-bold">
                {verifyCodeError}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`bg-[#004368] hover:bg-opacity-50 text-white hover:text-black hover:font-semibold w-[180px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mt-6 flex items-center justify-center ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              )}
              {isLoading ? t("verifying") : t("verify_continue")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
