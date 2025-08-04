import React, { useEffect, useState } from "react";
import Register from "../../assets/registration.png";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useGetAllAddressQuery } from "../../features/allApis/allAddressApi";
import ClipLoader from "react-spinners/ClipLoader";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
    region: "",
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
        "https://grozziieget.zjweiting.com:3091/tiktokshop-print/user/signup",
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
        setEmailError(t("email_already_in_use"));
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
                {t("register_to_explore")}
              </p>
            </div>
            <div className="mt-10">
              <img src={Register} alt="Registration" width={327} height={450} />
            </div>
          </div>
        </div>
        <div className="col-span-4 bg-white flex flex-col items-center py-8 rounded-r-2xl">
          <h1 className="text-[#004368] text-3xl font-semibold mb-7">
            {t("register")}
          </h1>
          <form onSubmit={handleSubmit} className="w-full px-10">
            {/* full name */}
            <div className="mb-[10px]">
              <label className="form-control w-full">
                <span className="text-[#004368] text-base font-semibold">
                  {t("full_name")}
                </span>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={t("enter_full_name")}
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
                    {t("email_address")}
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
                <p className="text-xs pt-1 text-red-500 font-bold">
                  {emailError}
                </p>
              </div>

              {/* phone */}
              <div className="">
                <label className="form-control w-full">
                  <span className="text-[#004368] text-base font-semibold">
                    {t("phone_number")}
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
                    {t("password")}
                  </span>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={t("enter_password")}
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
                    {t("confirm_password")}
                  </span>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder={t("confirm_password")}
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
                    {t("passwords_do_not_match")}
                  </p>
                )}
              </div>
            </div>

            {/* shop name */}
            <div className="my-[10px]">
              <label className="form-control w-full">
                <span className="text-[#004368] text-base font-semibold">
                  {t("shop_name")}
                </span>
                <input
                  type="text"
                  name="shopName"
                  required
                  value={formData.shopName}
                  onChange={handleChange}
                  placeholder={t("enter_shop_name")}
                  className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
                />
              </label>
            </div>

            {/* address */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {/* Country */}
              <div>
                <label className="form-control w-full">
                  <span className="text-[#004368] text-base font-semibold">
                    {t("Country")}
                  </span>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    placeholder={t("Country")}
                    className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
                  />
                </label>
              </div>

              {/* Province */}
              <div>
                <label className="form-control w-full">
                  <span className="text-[#004368] text-base font-semibold">
                    {t("Province")}
                  </span>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    placeholder={t("province_name")}
                    className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
                  />
                </label>
              </div>

              {/* City */}
              <div>
                <label className="form-control w-full">
                  <span className="text-[#004368] text-base font-semibold">
                    {t("City")}
                  </span>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder={t("city_name")}
                    className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
                  />
                </label>
              </div>

              {/* District */}
              <div>
                <label className="form-control w-full">
                  <span className="text-[#004368] text-base font-semibold">
                    {t("District")}
                  </span>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder={t("district_name")}
                    className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded-lg"
                  />
                </label>
              </div>

              {/* Area */}
              <div>
                <label className="form-control w-full">
                  <span className="text-[#004368] text-base font-semibold">
                    {t("area")}
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
              <div>
                <label className="form-control w-full">
                  <span className="text-[#004368] text-base font-semibold">
                    {t("PostCode")}
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
                  {t("add_image")}
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
                className="bg-[#004368] hover:bg-opacity-60 text-white hover:text-black w-[150px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mr-3 mt-6"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader color="#c3c1c8" size={28} />
                ) : (
                  t("register")
                )}
              </button>
            </div>
          </form>
          <p className="text-black text-opacity-60">
            {t("already_have_account")}
            <Link to="/login" className="font-semibold text-[#004368]">
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
