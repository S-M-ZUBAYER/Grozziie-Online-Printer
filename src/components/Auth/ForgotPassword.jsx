// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import { FiEye, FiEyeOff } from "react-icons/fi";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import ClipLoader from "react-spinners/ClipLoader";
// import { useTranslation } from "react-i18next";

// const ForgotPassword = () => {
//   const selectedLanguage = useSelector(
//     (state) => state.user.selectedLanguageRedux,
//   );
//   const { t } = useTranslation();
//   const [formData, setFormData] = useState({
//     code: "",
//     newPassword: "",
//     confirmPass: "",
//   });
//   const [passwordMatchError, setPasswordMatchError] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [CodeError, setCodeError] = useState(false);
//   const [passwordError, setPasswordError] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);
//   //   if (formData.newPassword !== formData.confirmPass) {
//   //     setPasswordMatchError(true);
//   //     return;
//   //   }
//   //   try {
//   //     const response = await fetch(
//   //       "https://grozziie.zjweiting.com:3091/tiktokshop-print/user/resetbycode",
//   //       {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify(formData),
//   //       }
//   //     );
//   //     const res = await response.json();
//   //     // console.log(response);
//   //     // console.log(res);

//   //     if (response.status === 200) {
//   //       setLoading(false);
//   //       navigate("/onlineprint/login");
//   //     } else {
//   //       res.message === "Error: Can not process your request!"
//   //         ? setCodeError("Code error")
//   //         : setPasswordError(res.message);
//   //       setLoading(false);
//   //     }
//   //     // Reset formData after submission
//   //     setFormData({
//   //       code: "",
//   //       newPassword: "",
//   //       confirmPass: "",
//   //     });
//   //     // Reset password match error
//   //     setPasswordMatchError(false);
//   //   } catch (error) {
//   //     console.error("Error occurred:", error);
//   //     setLoading(false);
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Reset errors
//     setPasswordMatchError(false);
//     setCodeError("");
//     setPasswordError("");

//     // Validate password match
//     if (formData.newPassword !== formData.confirmPass) {
//       setPasswordMatchError(true);
//       setLoading(false);
//       return;
//     }

//     try {
//       // Construct the URL with query parameters
//       const url = `https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/user/reset-password?code=${encodeURIComponent(formData.code)}&newPassword=${encodeURIComponent(formData.newPassword)}`;

//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           accept: "*/*",
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: "", // Empty body as per your curl example
//       });

//       const res = await response.json();

//       if (res.code === 200 && res.status === "success") {
//         setLoading(false);
//         // Show success message if you have a state for it
//         setSuccessMessage(
//           res.message || "Password has been reset successfully.",
//         );

//         // Optional: Reset form after successful submission
//         setFormData({
//           code: "",
//           newPassword: "",
//           confirmPass: "",
//         });

//         // Navigate after a short delay to show success message
//         setTimeout(() => {
//           navigate("/onlineprint/login");
//         }, 2000);
//       } else {
//         // Handle different error cases
//         if (res.message?.includes("code") || res.message?.includes("Code")) {
//           setCodeError(res.message || "Invalid code");
//         } else {
//           setPasswordError(res.message || "Failed to reset password");
//         }
//         setLoading(false);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setPasswordError("Network error. Please try again.");
//       setLoading(false);
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   return (
//     <div className="bg-[#004368] bg-opacity-5 min-h-screen py-40">
//       <div className=" bg-white flex flex-col items-center w-[950px] mx-auto py-16 rounded-2xl shadow-md">
//         <h1 className="text-[#004368] text-3xl font-semibold mb-7">
//           {t("change_password")}
//         </h1>
//         <p className="text-center text-black text-sm font-normal leading-normal mb-5 px-5">
//           {t("verify_email_instruction")}
//         </p>
//         <form className="w-full px-20" onSubmit={handleSubmit}>
//           {/* code */}
//           <div className="mb-[10px]">
//             <label className="form-control w-full">
//               <span className="text-[#004368] text-base font-semibold">
//                 {t("verification_code")}
//               </span>
//               <input
//                 type="text"
//                 name="code"
//                 required
//                 value={formData.code}
//                 onChange={handleChange}
//                 placeholder={t("enter_verification_code")}
//                 className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
//               />
//             </label>
//             <p className="text-xs pt-1 text-red-500 font-bold">{CodeError}</p>
//           </div>

//           {/* Password */}
//           <div className="my-[10px]">
//             <label className="form-control w-full">
//               <span className="text-[#004368] text-base font-semibold">
//                 {t("new_password")}
//               </span>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="newPassword"
//                   required
//                   value={formData.newPassword}
//                   onChange={handleChange}
//                   placeholder={t("enter_new_password")}
//                   className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 >
//                   {showPassword ? <FiEyeOff /> : <FiEye />}
//                 </button>
//               </div>
//             </label>
//             <p className="text-xs pt-1 text-red-500 font-bold">
//               {passwordError}
//             </p>
//           </div>

//           {/* confirm Password */}
//           <div className="my-[10px]">
//             <label className="form-control w-full">
//               <span className="text-[#004368] text-base font-semibold">
//                 {t("confirm_password")}
//               </span>
//               <div className="relative">
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   name="confirmPass"
//                   required
//                   value={formData.confirmPass}
//                   onChange={handleChange}
//                   placeholder={t("enter_password_again")}
//                   className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
//                 />
//                 <button
//                   type="button"
//                   onClick={toggleConfirmPasswordVisibility}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 >
//                   {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
//                 </button>
//               </div>
//             </label>
//             {passwordMatchError && (
//               <p className="text-red-500 text-xs mt-1">
//                 {t("passwords_do_not_match")}
//               </p>
//             )}
//           </div>

//           <div className="flex items-center justify-center mb-6">
//             <button
//               className="bg-[#004368] hover:bg-opacity-60 text-white hover:text-black w-[150px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mr-3 mt-6"
//               type="submit"
//             >
//               {loading ? <ClipLoader color="#c3c1c8" size={28} /> : t("Save")}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import ClipLoader from "react-spinners/ClipLoader";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    newPassword: "",
    confirmPass: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear errors when input changes
    if (name === "code" && codeError) {
      setCodeError("");
    }
    if ((name === "newPassword" || name === "confirmPass") && passwordError) {
      setPasswordError("");
    }
    if (
      (name === "newPassword" || name === "confirmPass") &&
      passwordMatchError
    ) {
      setPasswordMatchError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Reset errors
    setPasswordMatchError(false);
    setCodeError("");
    setPasswordError("");
    setSuccessMessage("");

    // Validate password match
    if (formData.newPassword !== formData.confirmPass) {
      setPasswordMatchError(true);
      setLoading(false);
      return;
    }

    try {
      // Construct the URL with query parameters
      const url = `https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/user/reset-password?code=${encodeURIComponent(formData.code)}&newPassword=${encodeURIComponent(formData.newPassword)}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "", // Empty body as per curl example
      });

      const res = await response.json();

      if (res.code === 200 && res.status === "success") {
        setLoading(false);
        // Show success message
        setSuccessMessage(
          res.message || "Password has been reset successfully.",
        );

        // Reset form after successful submission
        setFormData({
          code: "",
          newPassword: "",
          confirmPass: "",
        });

        // Navigate after a short delay to show success message
        setTimeout(() => {
          navigate("/onlineprint/login");
        }, 2000);
      } else {
        // Handle different error cases
        if (res.message?.includes("code") || res.message?.includes("Code")) {
          setCodeError(res.message || "Invalid code");
        } else {
          setPasswordError(res.message || "Failed to reset password");
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setPasswordError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="bg-[#004368] bg-opacity-5 min-h-screen flex items-center justify-center py-12">
      <div className="w-[600px] bg-white rounded-2xl shadow-lg p-10">
        <h1 className="text-[#004368] text-3xl font-semibold text-center mb-8">
          {t("Reset Password") || "Reset Password"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Verification Code */}
          <div>
            <label className="form-control w-full">
              <span className="text-[#004368] text-base font-semibold mb-2">
                {t("verification_code") || "Verification Code"}
              </span>
              <input
                type="text"
                name="code"
                required
                value={formData.code}
                onChange={handleChange}
                placeholder={
                  t("enter_verification_code") || "Enter 6-character code"
                }
                className={`h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-3 rounded-lg uppercase ${
                  codeError ? "border-red-500" : ""
                }`}
                maxLength="6"
              />
            </label>
            {codeError && (
              <p className="text-xs pt-1 text-red-500 font-bold">{codeError}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="form-control w-full">
              <span className="text-[#004368] text-base font-semibold mb-2">
                {t("new_password") || "New Password"}
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder={t("enter_new_password") || "Enter new password"}
                  className={`h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-3 rounded-lg ${
                    passwordError ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </label>
            {passwordError && (
              <p className="text-xs pt-1 text-red-500 font-bold">
                {passwordError}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="form-control w-full">
              <span className="text-[#004368] text-base font-semibold mb-2">
                {t("confirm_password") || "Confirm Password"}
              </span>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPass"
                  required
                  value={formData.confirmPass}
                  onChange={handleChange}
                  placeholder={t("confirm_password") || "Confirm new password"}
                  className={`h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-3 rounded-lg ${
                    passwordMatchError ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </label>
            {passwordMatchError && (
              <p className="text-red-500 text-xs mt-1 font-bold">
                {t("passwords_do_not_match") || "Passwords do not match"}
              </p>
            )}
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-500 text-green-700 px-4 py-3 rounded">
              <p className="text-sm font-semibold">{successMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-center pt-4">
            <button
              className="bg-[#004368] hover:bg-opacity-60 text-white hover:text-black w-[200px] h-12 px-4 py-2 rounded-md cursor-pointer text-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <ClipLoader color="#ffffff" size={28} />
              ) : (
                t("Reset Password") || "Reset Password"
              )}
            </button>
          </div>
        </form>

        {/* Back to Login Link */}
        <div className="text-center mt-6">
          <p className="text-black text-opacity-60">
            <button
              onClick={() => navigate("/onlineprint/login")}
              className="font-semibold text-[#004368] hover:text-blue-600"
            >
              {t("Back to Login") || "Back to Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
