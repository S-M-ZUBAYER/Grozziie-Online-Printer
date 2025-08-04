import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logoEmail from "../../assets/email.png";
import { useSelector } from "react-redux";

const VerifyEmailPage = () => {
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );
  const [numbers, setNumbers] = useState(["", "", "", ""]);
  const [verifyCodeError, setVerifyCodeError] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (value.length <= 1 && !isNaN(value)) {
      const newNumbers = [...numbers];
      newNumbers[index] = value;
      setNumbers(newNumbers);

      // Move focus to next input field if value is not empty and not the last input
      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verifyCode = numbers.join("");
    console.log(verifyCode);
    try {
      const response = await fetch(
        // `https://grozziieget.zjweiting.com:3091/GrozziiePrint-LoginRegistration/user/verify?code=${verifyCode}`,
        `https://grozziie.zjweiting.com:3091/tiktokshop-print/user/verify?code=${verifyCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        navigate("/login");
      } else if (response.status === 404) {
        setVerifyCodeError("Your verify code is wrong");
      } else {
        console.error("Something went wrong. Please try again!");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <div className="bg-[#004368] bg-opacity-5 min-h-[100vh] py-24">
      <div className="w-[1139px] h-[658px] mx-auto bg-white rounded-2xl">
        <div className="py-16 flex flex-col items-center justify-center space-y-6">
          <div className="bg-[#0043681a] rounded-full p-3 w-[142px] h-[142px]">
            <img src={logoEmail} alt="Email" className="size-[120px]" />
          </div>
          <h4 className="text-[#004368] text-4xl font-semibold leading-normal">
            {selectedLanguage === "zh-CN"
              ? "请验证您的帐户"
              : "Please verify your account"}
          </h4>
          <p className="text-center text-black text-sm font-normal leading-normal">
            {selectedLanguage === "zh-CN" ? (
              <span>
                输入我们发送到您的电子邮件地址的代码以验证您的账户。请检查您的收件箱或
                <br />
                垃圾邮件中的验证码。
              </span>
            ) : (
              <span>
                Enter the code we sent to your email address to verify your
                account. Please check your inbox or <br /> spam message for the
                verification code
              </span>
            )}
          </p>
          <div>
            <div className="flex space-x-4">
              {numbers.map((number, index) => (
                <input
                  key={index}
                  type="text"
                  value={number}
                  required
                  onChange={(e) => handleChange(index, e.target.value)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="border border-gray-300 rounded-lg p-4 text-center text-xl w-12"
                  maxLength="1"
                />
              ))}
            </div>
            {verifyCodeError && (
              <p className="text-xs pt-3 text-red-500 font-bold">
                {selectedLanguage === "zh-CN"
                  ? "请提供我们发送至您电子邮件的有效代码"
                  : verifyCodeError}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center mb-6">
            <button
              className="bg-[#004368] hover:bg-opacity-50 text-white hover:text-black hover:font-semibold w-[180px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mr-3 mt-6"
              type="submit"
              onClick={handleSubmit}
            >
              {selectedLanguage === "zh-CN"
                ? "验证并继续"
                : "Verify & Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
