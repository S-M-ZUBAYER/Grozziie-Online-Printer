import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    code: "",
    newPassword: "",
    confirmPass: "",
  });
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [CodeError, setCodeError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (formData.newPassword !== formData.confirmPass) {
      setPasswordMatchError(true);
      return;
    }
    try {
      const response = await fetch(
        "https://grozziie.zjweiting.com:3091/tiktokshop-print/user/resetbycode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const res = await response.json();
      // console.log(response);
      // console.log(res);

      if (response.status === 200) {
        setLoading(false);
        navigate("/login");
      } else {
        res.message === "Error: Can not process your request!"
          ? setCodeError("Code error")
          : setPasswordError(res.message);
        setLoading(false);
      }
      // Reset formData after submission
      setFormData({
        code: "",
        newPassword: "",
        confirmPass: "",
      });
      // Reset password match error
      setPasswordMatchError(false);
    } catch (error) {
      console.error("Error occurred:", error);
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
    <div className="bg-[#004368] bg-opacity-5 min-h-screen py-40">
      <div className=" bg-white flex flex-col items-center w-[950px] mx-auto py-16 rounded-2xl shadow-md">
        <h1 className="text-[#004368] text-3xl font-semibold mb-7">
          {t("change_password")}
        </h1>
        <p className="text-center text-black text-sm font-normal leading-normal mb-5">
          {t("verify_email_instruction")}
        </p>
        <form className="w-full px-20" onSubmit={handleSubmit}>
          {/* code */}
          <div className="mb-[10px]">
            <label className="form-control w-full">
              <span className="text-[#004368] text-base font-semibold">
                {t("verification_code")}
              </span>
              <input
                type="text"
                name="code"
                required
                value={formData.code}
                onChange={handleChange}
                placeholder={t("enter_verification_code")}
                className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
              />
            </label>
            <p className="text-xs pt-1 text-red-500 font-bold">{CodeError}</p>
          </div>

          {/* Password */}
          <div className="my-[10px]">
            <label className="form-control w-full">
              <span className="text-[#004368] text-base font-semibold">
                {t("new_password")}
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder={t("enter_new_password")}
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
            <p className="text-xs pt-1 text-red-500 font-bold">
              {passwordError}
            </p>
          </div>

          {/* confirm Password */}
          <div className="my-[10px]">
            <label className="form-control w-full">
              <span className="text-[#004368] text-base font-semibold">
                {t("confirm_password")}
              </span>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPass"
                  required
                  value={formData.confirmPass}
                  onChange={handleChange}
                  placeholder={t("enter_password_again")}
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
            {passwordMatchError && (
              <p className="text-red-500 text-xs mt-1">
                {t("passwords_do_not_match")}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center mb-6">
            <button
              className="bg-[#004368] hover:bg-opacity-60 text-white hover:text-black w-[150px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mr-3 mt-6"
              type="submit"
            >
              {loading ? <ClipLoader color="#c3c1c8" size={28} /> : t("Save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
