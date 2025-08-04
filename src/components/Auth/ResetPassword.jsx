import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

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
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

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
    setLoading(true);

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
    } finally {
      setLoading(false);
      setFormData({
        ...formData,
        oldPassword: "",
        newPassword: "",
      });
    }
  };

  return (
    <div className="bg-[#004368] bg-opacity-5 min-h-screen py-40">
      <div className="bg-white flex flex-col items-center w-[950px] mx-auto py-16 rounded-2xl shadow-md">
        <h1 className="text-[#004368] text-3xl font-semibold mb-7">
          {selectedLanguage === "zh-CN" ? "重置密码" : "Reset Password"}
        </h1>

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
                placeholder={t("enter_email")}
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
                {t("old_password")}
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="oldPassword"
                  required
                  value={formData.oldPassword}
                  onChange={handleChange}
                  placeholder={t("enter_old_password")}
                  className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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
                {t("new_password")}
              </span>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="newPassword"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder={t("enter_new_password")}
                  className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              {t("back")}
            </Link>

            <button
              className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[150px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mr-3 mt-6 flex items-center justify-center"
              type="submit"
              disabled={loading}
            >
              {loading ? <ClipLoader color="#c3c1c8" size={28} /> : t("Save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
