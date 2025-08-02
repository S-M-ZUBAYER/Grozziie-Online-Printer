import React, { useState } from "react";
import login from "../../assets/login.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";
import {
  accountUserChange,
  paymentUserChange,
} from "../../features/slice/userSlice";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";

const Login = () => {
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [forgotEmail, setForgotEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [forbiddenError, setForbiddenError] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear errors when the input value changes
    if (name === "email" && emailError) {
      setEmailError("");
      setForbiddenError("");
    }
    if (name === "password" && passwordError) {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        "https://grozziieget.zjweiting.com:3091/tiktokshop-print/user/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const res = await response.json();
      // console.log("response", response);
      console.log("res>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", response, res);
      dispatch(accountUserChange("smzubayer9004@gmail.com"));

      if (response.status === 200) {
        localStorage.setItem("printerUser", JSON.stringify(res));
        dispatch(accountUserChange(formData.email));
        dispatch(paymentUserChange(res));
        navigate("/");
        // const response = await axios.get(
        //   "https://grozziieget.zjweiting.com:3091/GrozziiePrint-LoginRegistration/user/details",
        //   { params: { token: res.token } }
        // );

        // const userData = response.data;

        // // Dispatch user email change (assuming userEmail is in userData)
        // dispatch(paymentUserChange(userData));
        // navigate("/");
      } else if (response.status === 400) {
        res.message === "User Email Not Found" &&
          setEmailError("Incorrect email. Please try again");
        setFormData((prevData) => ({
          ...prevData,
          password: "",
        }));
      } else if (response.status === 401) {
        res.message === "Bad credentials" &&
          setPasswordError("Your password did not match. Please try again");
        setFormData((prevData) => ({
          ...prevData,
          password: "",
        }));
      } else if (response.status === 403) {
        setForbiddenError("Please verify your email!");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://grozziieget.zjweiting.com:3091/GrozziiePrint-LoginRegistration/user/forgot?email=${forgotEmail}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const res = await response.json();
      // console.log(res);

      if (response.status === 200) {
        navigate("/forgotpassword");
      } else {
        setForgotPasswordError("This email is not valid. Please try another");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
    // You can perform further actions here, such as sending the email for password reset
    setForgotEmail("");
    // Close the modal if needed
    // document.getElementById("my_modal_settings").close();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-[#004368] bg-opacity-5 min-h-screen py-32">
      <div className="w-[1140px] mx-auto grid grid-cols-7 shadow-lg rounded-2xl">
        <div className="col-span-3 bg-[#004368] bg-opacity-5 rounded-l-2xl">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex flex-col items-center gap-y-7">
              <h1 className="text-[#004368] text-6xl font-bold">Grozziie</h1>
              <p className="text-[#004368] text-xl font-normal">
                {selectedLanguage === "zh-CN"
                  ? "注册以探索我们的网站"
                  : "Register to explore our site"}
              </p>
            </div>
            <div>
              <img src={login} alt="Registration" width={327} height={450} />
            </div>
          </div>
        </div>
        <div className="col-span-4 bg-white flex flex-col items-center py-20 relative rounded-r-2xl">
          <h1 className="text-[#004368] text-3xl font-semibold mb-7">
            {selectedLanguage === "zh-CN" ? "登录" : "Log In"}
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
                  placeholder={
                    selectedLanguage === "zh-CN"
                      ? "输入您的电子邮件"
                      : "enter your email"
                  }
                  className={`h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg ${
                    emailError || forbiddenError ? "border-red-500" : ""
                  }`}
                />
              </label>
              <p className="text-xs pt-1 text-red-500 font-bold">
                {emailError}
              </p>
              <p className="text-xs pt-1 text-red-500 font-bold">
                {forbiddenError}
              </p>
            </div>

            {/* Password */}
            <div className="my-[10px]">
              <label className="form-control w-full">
                <span className="text-[#004368] text-base font-semibold">
                  {selectedLanguage === "zh-CN" ? "密码" : "Password"}
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={
                      selectedLanguage === "zh-CN"
                        ? "输入密码"
                        : "enter password"
                    }
                    className={`h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg ${
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
              <p className="text-xs pt-1 text-red-500 font-bold">
                {passwordError}
              </p>
            </div>

            <div className="flex items-center justify-center mb-6">
              <button
                className="bg-[#004368] hover:bg-opacity-60 text-white hover:text-black w-[150px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mr-3 mt-6"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader color="#c3c1c8" size={28} />
                ) : selectedLanguage === "zh-CN" ? (
                  "登录"
                ) : (
                  "Log In"
                )}
              </button>
            </div>
          </form>

          {/* forgot password */}
          <div className="absolute top-[290px] right-20 mt-6">
            <button
              className="text-[#004368] hover:text-blue-600"
              onClick={() =>
                document.getElementById("my_modal_settings").showModal()
              }
            >
              {selectedLanguage === "zh-CN" ? "忘记密码？" : "Forgot Password?"}
            </button>
            <dialog id="my_modal_settings" className="modal">
              <div className="bg-white w-[500px] h-[240px] rounded-md pt-10">
                <h1 className="text-center text-2xl font-bold text-[#004368]">
                  {selectedLanguage === "zh-CN"
                    ? "输入您的电子邮件"
                    : "Enter your Email"}
                </h1>
                <div className="modal-action w-full text-center flex items-center justify-center">
                  <form method="dialog" onSubmit={handleModalSubmit}>
                    <div className="">
                      <input
                        type="email"
                        name="forgotEmail"
                        placeholder={
                          selectedLanguage === "zh-CN"
                            ? "输入您的电子邮件"
                            : "enter your email"
                        }
                        required
                        className={`w-80 text-black text-opacity-55 text-[15px] font-normal leading-normal pl-2 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg ${
                          forgotPasswordError ? "border-red-500" : ""
                        }`}
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                      />
                      <p className="text-xs pt-1 text-red-500 font-bold">
                        {forgotPasswordError}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <p
                        className="bg-[#004368] bg-opacity-30 hover:bg-[#004368] text-black hover:text-white w-[100px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mt-5 mr-3"
                        onClick={() =>
                          document.getElementById("my_modal_settings").close()
                        }
                      >
                        {selectedLanguage === "zh-CN" ? "关闭" : "Close"}
                      </p>
                      <button
                        className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[100px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mt-5"
                        type="submit"
                      >
                        {selectedLanguage === "zh-CN" ? "提交" : "Submit"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
          <p className="mt-24 text-black text-opacity-60">
            {selectedLanguage === "zh-CN"
              ? "没有账号？"
              : "Don't have any account?"}{" "}
            <Link to="/register" className="font-semibold text-[#004368]">
              {selectedLanguage === "zh-CN" ? "创建账号" : "Create Account"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
