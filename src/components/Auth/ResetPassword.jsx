// import React, { useState } from "react";
// import { FiEye, FiEyeOff } from "react-icons/fi";
// import { useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";

// const ResetPassword = () => {
//   const selectedLanguage = useSelector(
//     (state) => state.user.selectedLanguageRedux
//   );
//   const [formData, setFormData] = useState({
//     email: "",
//     oldPassword: "",
//     newPassword: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [emailError, setEmailError] = useState(false);
//   const [passwordError, setPasswordError] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(
//         "https://grozziie.zjweiting.com:3091/tiktokshop-print/user/password/reset",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         }
//       );

//       const res = await response.json();
//       // console.log("res", res);

//       if (!response.ok) {
//         console.error("Backend error:", res);
//         toast.error(res.message || "Something went wrong.");
//         return;
//       } else {
//         navigate("/login");
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//     }
//     // Reset formData after submission
//     setFormData({
//       ...formData,
//       oldPassword: "",
//       newPassword: "",
//     });
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
//           {selectedLanguage === "zh-CN" ? "重置密码" : "Reset password"}
//         </h1>
//         <p className="text-center text-black text-sm font-normal leading-normal mb-5">
//           {selectedLanguage === "zh-CN" ? (
//             <p>
//               输入我们发送到您的电子邮件地址的代码以验证您的账户。请检查您的收件箱或
//               <br />
//               垃圾邮件中的验证码。
//             </p>
//           ) : (
//             <p>
//               Enter the code we sent to your email address to verify your
//               account. Please check your inbox or <br /> spam message for the
//               verification code
//             </p>
//           )}
//         </p>
//         <form className="w-full px-20" onSubmit={handleSubmit}>
//           {/* email */}
//           <div className="mb-[10px]">
//             <label className="form-control w-full">
//               <span className="text-[#004368] text-base font-semibold">
//                 {selectedLanguage === "zh-CN" ? "电子邮件" : "Email"}
//               </span>
//               <input
//                 type="email"
//                 name="email"
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder={
//                   selectedLanguage === "zh-CN"
//                     ? "输入您的电子邮件"
//                     : "enter your email"
//                 }
//                 className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
//               />
//             </label>
//             <p className="text-xs pt-1 text-red-500 font-bold">{emailError}</p>
//           </div>

//           {/* Old Password */}
//           <div className="my-[10px]">
//             <label className="form-control w-full">
//               <span className="text-[#004368] text-base font-semibold">
//                 {selectedLanguage === "zh-CN" ? "旧密码" : "Old Password"}
//               </span>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="oldPassword"
//                   required
//                   value={formData.oldPassword}
//                   onChange={handleChange}
//                   placeholder={
//                     selectedLanguage === "zh-CN"
//                       ? "输入您的旧密码"
//                       : "enter your old password"
//                   }
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

//           {/* New Password */}
//           <div className="my-[10px]">
//             <label className="form-control w-full">
//               <span className="text-[#004368] text-base font-semibold">
//                 {selectedLanguage === "zh-CN" ? "新密码" : "New Password"}
//               </span>
//               <div className="relative">
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   name="newPassword"
//                   required
//                   value={formData.newPassword}
//                   onChange={handleChange}
//                   placeholder={
//                     selectedLanguage === "zh-CN"
//                       ? "输入您的新密码"
//                       : "enter your new password"
//                   }
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
//           </div>

//           <div className="flex items-center justify-center mb-6">
//             <Link
//               to="/"
//               className="bg-[#004368] bg-opacity-30 hover:bg-[#004368] text-black hover:text-white w-[150px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mr-3 mt-6"
//             >
//               {selectedLanguage === "zh-CN" ? "后退" : "Back"}
//             </Link>
//             <button
//               className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[150px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mr-3 mt-6"
//               type="submit"
//             >
//               {selectedLanguage === "zh-CN" ? "保存" : "Save"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;

import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );
  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setEmailError("");
    setPasswordError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://grozziie.zjweiting.com:3091/tiktokshop-print/user/password/reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const res = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          if (res.message?.toLowerCase().includes("bad credentials")) {
            setPasswordError(
              selectedLanguage === "zh-CN"
                ? "旧密码不匹配，请使用忘记密码选项"
                : "Your old password does not match. Please use the forgot password option."
            );
          } else {
            setEmailError(
              selectedLanguage === "zh-CN"
                ? "找不到您的电子邮件！"
                : "Your email is not found!"
            );
          }
        } else {
          setPasswordError(
            selectedLanguage === "zh-CN"
              ? "服务器错误，请稍后再试。"
              : "Server error, please try again later."
          );
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setPasswordError(
        selectedLanguage === "zh-CN"
          ? "网络错误，请检查您的连接。"
          : "Network error, please check your connection."
      );
    }

    setFormData({
      ...formData,
      oldPassword: "",
      newPassword: "",
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="bg-[#004368] bg-opacity-5 min-h-screen py-40">
      <div className="bg-white flex flex-col items-center w-[950px] mx-auto py-16 rounded-2xl shadow-md">
        <h1 className="text-[#004368] text-3xl font-semibold mb-7">
          {selectedLanguage === "zh-CN" ? "重置密码" : "Reset password"}
        </h1>
        <p className="text-center text-black text-sm font-normal leading-normal mb-5">
          {selectedLanguage === "zh-CN" ? (
            <>
              输入我们发送到您的电子邮件地址的代码以验证您的账户。请检查您的收件箱或
              <br />
              垃圾邮件中的验证码。
            </>
          ) : (
            <>
              Enter the code we sent to your email address to verify your
              account. Please check your inbox or <br /> spam message for the
              verification code.
            </>
          )}
        </p>

        <form className="w-full px-20" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-[10px]">
            <label className="form-control w-full">
              <span className="text-[#004368] text-base font-semibold">
                {selectedLanguage === "zh-CN" ? "电子邮件" : "Email"}
              </span>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={
                  selectedLanguage === "zh-CN"
                    ? "输入您的电子邮件"
                    : "Enter your email"
                }
                className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
              />
            </label>
            {emailError && (
              <p className="text-xs pt-1 text-red-500 font-bold">
                {emailError}
              </p>
            )}
          </div>

          {/* Old Password */}
          <div className="my-[10px]">
            <label className="form-control w-full">
              <span className="text-[#004368] text-base font-semibold">
                {selectedLanguage === "zh-CN" ? "旧密码" : "Old Password"}
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="oldPassword"
                  required
                  value={formData.oldPassword}
                  onChange={handleChange}
                  placeholder={
                    selectedLanguage === "zh-CN"
                      ? "输入您的旧密码"
                      : "Enter your old password"
                  }
                  className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
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
          </div>

          {/* New Password */}
          <div className="my-[10px]">
            <label className="form-control w-full">
              <span className="text-[#004368] text-base font-semibold">
                {selectedLanguage === "zh-CN" ? "新密码" : "New Password"}
              </span>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="newPassword"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder={
                    selectedLanguage === "zh-CN"
                      ? "输入您的新密码"
                      : "Enter your new password"
                  }
                  className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
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
            {passwordError && (
              <p className="text-xs pt-1 text-red-500 font-bold">
                {passwordError}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center mb-6">
            <Link
              to="/"
              className="bg-[#004368] bg-opacity-30 hover:bg-[#004368] text-black hover:text-white w-[150px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mr-3 mt-6"
            >
              {selectedLanguage === "zh-CN" ? "后退" : "Back"}
            </Link>
            <button
              className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[150px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mr-3 mt-6"
              type="submit"
            >
              {selectedLanguage === "zh-CN" ? "保存" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
