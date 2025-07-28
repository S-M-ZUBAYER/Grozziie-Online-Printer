import React, { useEffect, useState } from "react";
import Register from "../../assets/registration.png";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useGetAllAddressQuery } from "../../features/allApis/allAddressApi";
import ClipLoader from "react-spinners/ClipLoader";

const Registration = () => {
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Province, city, district data get
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    shopName: "",
    city: "",
    region: "中国",
    province: "",
    district: "",
    area: "",
    postalCode: "",
    image: null,
    verificationCode: "",
    status: true,
  });
  const { data: getAllAddressData } = useGetAllAddressQuery();

  useEffect(() => {
    if (
      getAllAddressData?.logistics_address_get_response?.logistics_address_list
    ) {
      // Extract provinces from data
      const provincesData =
        getAllAddressData.logistics_address_get_response.logistics_address_list.filter(
          (item) => item.region_type === 1
        );
      // Store the provinces data in state
      setProvinces(provincesData);
    }
  }, [getAllAddressData]);

  const filterCityUnderProvince = (parentId) => {
    const cityData =
      getAllAddressData?.logistics_address_get_response?.logistics_address_list?.filter(
        (item) => item.parent_id === parentId
      );
    setCities(cityData);
  };

  const filterDistrictUnderCity = (parentId) => {
    const districtData =
      getAllAddressData?.logistics_address_get_response?.logistics_address_list?.filter(
        (item) => item.parent_id === parentId
      );
    setDistricts(districtData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        image: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatchError(true);
      setLoading(false);
      return;
    }

    // Prepare the registration data
    const registrationData = {
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      shopName: formData.shopName,
      region: formData.region,
      province: selectedProvince,
      city: selectedCity,
      district: selectedDistricts,
      area: formData.area,
      postalCode: formData.postalCode,
      image: formData.image,
    };

    try {
      // Make API call to register user
      const response = await fetch(
        // "https://grozziieget.zjweiting.com:3091/GrozziiePrint-LoginRegistration/user/signup",
        "http://192.168.1.13:8888/user/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationData),
        }
      );

      const res = await response.json();
      // console.log(res);

      // Check if registration was successful
      if (res.status === 400) {
        setError(res.message);
      } else if (res.status === 409) {
        // setEmailError(res.message);
        setEmailError("This email already in use Please try another or login");
      } else if (res.status === 201) {
        navigate("/verifyemail");
        // Reset form data
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          shopName: "",
          city: "",
          region: "",
          province: "",
          district: "",
          area: "",
          postalCode: "",
          image: null,
        });
      }
      // Reset password match error
      setPasswordMatchError(false);
    } catch (error) {
      // Handle registration error
      console.error("Registration Error:", error);
    } finally {
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
    <div className="bg-[#004368] bg-opacity-5 min-h-screen py-8">
      <div className="w-[1140px] mx-auto grid grid-cols-6 shadow-lg rounded-2xl">
        <div className="col-span-2 bg-[#004368] bg-opacity-5 py-20 rounded-l-2xl">
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-y-7">
              <h1 className="text-[#004368] text-6xl font-bold">Grozziie</h1>
              <p className="text-[#004368] text-xl font-normal">
                {selectedLanguage === "zh-CN"
                  ? "注册以探索我们的网站"
                  : "Register to explore our site"}
              </p>
            </div>
            <div className="mt-10">
              <img src={Register} alt="Registration" width={327} height={450} />
            </div>
          </div>
        </div>
        <div className="col-span-4 bg-white flex flex-col items-center py-8 rounded-r-2xl">
          <h1 className="text-[#004368] text-3xl font-semibold mb-7">
            {selectedLanguage === "zh-CN" ? "注册" : "Register"}
          </h1>
          <form onSubmit={handleSubmit} className="w-full px-10">
            {/* full name */}
            <div className="mb-[10px]">
              <label className="form-control w-full">
                <span className="text-[#004368] text-base font-semibold">
                  {selectedLanguage === "zh-CN" ? "全名" : "Full Name"}
                </span>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={
                    selectedLanguage === "zh-CN"
                      ? "输入您的全名"
                      : "Enter your full name"
                  }
                  className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
                />
              </label>
            </div>

            {/* middle section email, phone, password */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {/* email */}
              <div className="">
                <label className="form-control w-full">
                  <span className="text-[#004368] text-base font-semibold">
                    {selectedLanguage === "zh-CN"
                      ? "电子邮件地址"
                      : "E-Mail Address"}
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
                    className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
                  />
                </label>
                <p className="text-xs pt-1 text-red-500 font-bold">
                  {emailError}
                </p>
              </div>

              {/* phone */}
              <div className="">
                <label className="form-control w-full">
                  <span className="text-[#004368] text-base font-semibold">
                    {selectedLanguage === "zh-CN" ? "电话号码" : "Phone Number"}
                  </span>
                  <input
                    type="text"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+234 446 445"
                    className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
                  />
                </label>
              </div>

              {/* password */}
              <div className="">
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
                          : "enter your password"
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
                {/* <p className="text-xs pt-1 text-red-500">
                  {selectedLanguage === "zh-CN"
                    ? "密码必须为8-20个字符，并包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符。"
                    : "Password must be 8-20 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character."}
                </p> */}
                <p className="text-xs pt-1 text-red-500 font-bold">
                  {error.slice(6)}
                </p>
              </div>

              {/* confirm password */}
              <div className="">
                <label className="form-control w-full">
                  <span className="text-[#004368] text-base font-semibold">
                    {selectedLanguage === "zh-CN"
                      ? "确认密码"
                      : "Confirm Password"}
                  </span>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder={
                        selectedLanguage === "zh-CN"
                          ? "确认密码"
                          : "confirm your password"
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
                {passwordMatchError && (
                  <p className="text-red-500 text-xs mt-1 font-bold">
                    {selectedLanguage === "zh-CN"
                      ? "密码不匹配"
                      : "Passwords do not match"}
                  </p>
                )}
              </div>
            </div>

            {/* shop name */}
            <div className="my-[10px]">
              <label className="form-control w-full">
                <span className="text-[#004368] text-base font-semibold">
                  {selectedLanguage === "zh-CN" ? "店铺名称" : "Shop Name"}
                </span>
                <input
                  type="text"
                  name="shopName"
                  required
                  value={formData.shopName}
                  onChange={handleChange}
                  placeholder={
                    selectedLanguage === "zh-CN"
                      ? "输入您的店铺名称"
                      : "enter your shop name"
                  }
                  className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
                />
              </label>
            </div>

            {/* address */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {/* Region */}
              <div className="">
                <label className="form-control w-full">
                  <span className="text-[#004368] text-base font-semibold">
                    {selectedLanguage === "zh-CN" ? "国家" : "Country"}
                  </span>
                  <input
                    type="text"
                    name="region"
                    readOnly
                    value="中国"
                    className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
                  />
                </label>
              </div>
              {/* Province */}
              <div className="">
                <label className="form-control w-full">
                  <span className="text-[#004368] text-base font-semibold">
                    {selectedLanguage === "zh-CN" ? "省份" : "Province"}
                  </span>
                  <select
                    className="border input-bordered rounded-md py-2 h-10 bg-[#004368] bg-opacity-5"
                    onChange={(e) => {
                      const selectedId = provinces?.find(
                        (province) => province.region_name === e.target.value
                      ).id;
                      filterCityUnderProvince(selectedId);
                    }}
                    onClick={(e) => setSelectedProvince(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Province
                    </option>
                    {provinces?.map((province) => (
                      <option key={province.id} value={province.region_name}>
                        {province.region_name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {/* city */}
              <div className="">
                <label className="form-control w-full">
                  <span className="text-[#004368] text-base font-semibold">
                    {selectedLanguage === "zh-CN" ? "城市" : "City"}
                  </span>
                  <select
                    className="border input-bordered rounded-md py-2 h-10 bg-[#004368] bg-opacity-5"
                    onChange={(e) => {
                      const selectedId = cities?.find(
                        (city) => city.region_name === e.target.value
                      ).id;
                      filterDistrictUnderCity(selectedId);
                    }}
                    onClick={(e) => setSelectedCity(e.target.value)}
                  >
                    <option value="" disabled>
                      Select City
                    </option>
                    {cities?.map((city) => (
                      <option key={city.id} value={city.region_name}>
                        {city.region_name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {/* District */}
              <div className="">
                <label className="form-control w-full">
                  <span className="text-[#004368] text-base font-semibold">
                    {selectedLanguage === "zh-CN" ? "区" : "District"}
                  </span>
                  <select
                    className="border input-bordered rounded-md py-2 h-10 bg-[#004368] bg-opacity-5"
                    onClick={(e) => setSelectedDistricts(e.target.value)}
                  >
                    <option value="" disabled>
                      Select District
                    </option>
                    {districts?.map((district) => (
                      <option key={district.id} value={district.region_name}>
                        {district.region_name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {/* Area */}
              <div className="">
                <label className="form-control w-full">
                  <span className="text-[#004368] text-base font-semibold">
                    {selectedLanguage === "zh-CN" ? "地区" : "Area"}
                  </span>
                  <input
                    type="text"
                    name="area"
                    required
                    value={formData.area}
                    onChange={handleChange}
                    placeholder={
                      selectedLanguage === "zh-CN"
                        ? "黄金古北路987号"
                        : "987 Gu Bei Road, Golden"
                    }
                    className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
                  />
                </label>
              </div>
              {/* Postal Code */}
              <div className="">
                <label className="form-control w-full">
                  <span className="text-[#004368] text-base font-semibold">
                    {selectedLanguage === "zh-CN" ? "邮政编码" : "Postal Code"}
                  </span>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="789"
                    className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
                  />
                </label>
              </div>
            </div>

            {/* image */}
            <div className="mt-4">
              <label className="form-control w-full">
                <span className="text-[#004368] text-base font-semibold mb-[2px]">
                  {selectedLanguage === "zh-CN" ? "添加图片" : "Add Image"}
                </span>
                <input
                  type="file"
                  required
                  onChange={handleImageChange}
                  className="file-input file-input-bordered file-input-sm w-full"
                />
              </label>
            </div>

            {/* button */}
            <div className="flex items-center justify-center mb-5">
              <button
                className="bg-[#004368] bg-opacity-30 hover:bg-opacity-100 text-black hover:text-white w-[100px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mr-3 mt-5"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader color="#c3c1c8" size={28} />
                ) : selectedLanguage === "zh-CN" ? (
                  "注册"
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>
          <p className="text-black text-opacity-60">
            {selectedLanguage === "zh-CN"
              ? "已经有账号了吗？"
              : "Already have an account? "}
            <Link to="/login" className="font-semibold text-[#004368]">
              {selectedLanguage === "zh-CN" ? "登录" : "Log In"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
