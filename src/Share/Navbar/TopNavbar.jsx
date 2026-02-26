import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineLanguage } from "react-icons/hi2";
import { MdLogout } from "react-icons/md";
import { FaCrown } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useTranslation } from "react-i18next";
import {
  accountUserChange,
  mainRouteStateChange,
  mainRouteStateFalseChange,
} from "../../features/slice/userSlice";
import grozziieLogo from "../../assets/GrozziieLogo.png";
import Avatar from "../../assets/avatar.jpg";
import customerSupport from "../../assets/Vector.png";
import EmailVerificationComponent from "./EmailVerificationComponent";

const TopNavbar = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((state) => state.user.accountUser);
  const routeState = useSelector((state) => state.user.mainRoute);
  const selectedLanguage = i18n.language;
  const storedUser = localStorage.getItem("printerUser");
  const userDetails = storedUser ? JSON.parse(storedUser) : null;
  const [activeLi, setActiveLi] = useState(null);

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const storedShopPlatform = localStorage.getItem("SelectedPlatform");
  const storedShopStore = localStorage.getItem("SelectedStore");
  const [selectedPlatform, setSelectedPlatform] = useState(storedShopPlatform);
  const [selectedStore, setSelectedStore] = useState(storedShopStore);

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path === "/onlineprint/" || path === "/onlineprint/home") {
      dispatch(mainRouteStateFalseChange());
      setActiveLi(0);
    } else {
      dispatch(mainRouteStateChange());
      if (path.includes("settings")) {
        setActiveLi(4);
      } else if (path.includes("tiktok")) {
        localStorage.setItem("SelectedPlatform", "tiktok");
        setActiveLi(1);
      } else if (path.includes("lazada")) {
        localStorage.setItem("SelectedPlatform", "lazada");
        setActiveLi(2);
      } else if (path.includes("shopee")) {
        localStorage.setItem("SelectedPlatform", "shopee");
        setActiveLi(3);
      } else if (path.includes("contact")) {
        setActiveLi(5);
      } else setActiveLi(null); // If no match
    }
  }, [location.pathname, dispatch]);

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("printerUser");
    // localStorage.removeItem("SelectedPlatform");
    // localStorage.removeItem("SelectedStore");
    // localStorage.removeItem("SelectedTikTokStore");
    // localStorage.removeItem("lazadaAccessToken");
    // localStorage.removeItem("lazadaAccountId");
    // localStorage.removeItem("lazadaAppKey");
    // localStorage.removeItem("lazadaAppKeyShopInfo");
    // localStorage.removeItem("lazadaAuthCountry");
    // localStorage.removeItem("lazadaShopInfo");
    // localStorage.removeItem("shopeeAppKey");
    // localStorage.removeItem("shopeeAppKeyShopInfo");
    // localStorage.removeItem("shopeeAuthCountry");
    // localStorage.removeItem("shopeeAuthShopId");
    // localStorage.removeItem("shopeeAuthShopIdShopInfo");
    // localStorage.removeItem("shopeeDeliveryType");
    // localStorage.removeItem("shopeeShopInfo");
    // localStorage.removeItem("tikTokDeliveryType");
    // localStorage.removeItem("tiktokAppKey");
    // localStorage.removeItem("tiktokAuthCipher");
    // localStorage.removeItem("tiktokAuthCountry");
    // localStorage.removeItem("tiktokOpenId");
    // localStorage.removeItem("tiktokShopInfo");
    dispatch(accountUserChange(""));
    navigate("/onlineprint/login");
  };

  const navItems = [
    { key: "home", path: "/onlineprint/home" },
    { key: "tiktok", path: "/onlineprint/TikTokOrderManagemnt" },
    { key: "lazada", path: "/onlineprint/LazadaOrderManagement" },
    { key: "shopee", path: "/onlineprint/ShopeeOrderManagement" },
    // { key: "singlePrint", path: "/singleprint" },
    // { key: "settings", path: "/settings/recipient information" },
    {
      key: "settings",
      path: "/onlineprint/settings/deliveryType/tiktok",
    },
    // { key: "utility", path: "/utility/delivery record" },
    // { key: "manualOrder", path: "/manualOrder" },
    { key: "contact", path: "/onlineprint/contact" },
  ];

  const handleNavLiClick = (index, item) => {
    setActiveLi(index);
  };

  const handleUpgradeClick = () => {
    // You can set platform and store from your state/context/props
    const currentShopPlatform = localStorage.getItem("SelectedPlatform");
    const selectedStoreCipher = localStorage.getItem("SelectedStore");

    let currentShopStore = selectedStoreCipher;

    if (currentShopPlatform === "shopee") {
      const currentShopeeShopList = JSON.parse(
        localStorage.getItem("shopeeShopInfo") || "[]",
      );

      const matchedStore = currentShopeeShopList.find(
        (store) => store?.cipher === selectedStoreCipher,
      );

      if (matchedStore) {
        currentShopStore = matchedStore.name;
      }
    } else if (currentShopPlatform === "lazada") {
      currentShopStore = localStorage.getItem("lazadaAppKeyShopInfo");
    }

    setSelectedPlatform(currentShopPlatform); // Example - replace with actual platform
    setSelectedStore(currentShopStore); // Example - replace with actual store name
    setIsUpgradeModalOpen(true);
  };

  const handleUpgradeConfirm = () => {
    setIsUpgradeModalOpen(false);
    navigate("/onlineprint/pricing");
  };

  const handleUpgradeCancel = () => {
    setIsUpgradeModalOpen(false);
  };

  return (
    <div className="navbar bg-slate-200 grid grid-cols-6 h-24">
      <div className="flex justify-start items-center col-span-1 ml-[30px]">
        <Link to="/onlineprint/" className="text-xl">
          <img src={grozziieLogo} alt="Logo" className="w-32 h-7" />
        </Link>
      </div>

      {/* Navigation Menu */}
      <div className="hidden md:block col-span-3 items-center justify-center mx-auto">
        <ul className="flex items-center gap-6 text-base">
          {/* This code without disable lazada and shope */}
          {/* {navItems.map((item, index) => (
            <li key={item.key} onClick={() => handleNavLiClick(index, item)}>
              <Link
                to={item.path}
                className={`text-black ${
                  routeState ? "block" : "hidden"
                } text-[15px] font-medium capitalize transition hover:text-[#004368] whitespace-nowrap ${
                  activeLi === index ? "font-semibold text-[#004368]" : ""
                }`}
              >
                {t(item.key)}
              </Link>
              {routeState && activeLi === index && (
                <div className="w-full flex justify-center">
                  <p className="w-[15px] h-[2px] rounded-[14px] bg-[#004368]"></p>
                </div>
              )}
            </li>
          ))} */}

          {/* This code with disable lazada and shopee */}
          {navItems.map((item, index) => {
            // const isDisabled = item.key === "lazada" || item.key === "shopee";
            const isDisabled = item.key === "None";

            return (
              <li
                key={item.key}
                onClick={() => {
                  if (!isDisabled) handleNavLiClick(index, item);
                }}
                className={`${
                  isDisabled ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                <Link
                  to={isDisabled ? "#" : item.path}
                  className={`text-black ${
                    routeState ? "block" : "hidden"
                  } text-[15px] font-medium capitalize transition whitespace-nowrap ${
                    isDisabled
                      ? "pointer-events-none text-gray-400"
                      : "hover:text-[#004368]"
                  } ${
                    activeLi === index ? "font-semibold text-[#004368]" : ""
                  }`}
                >
                  {t(item.key)}
                </Link>

                {routeState && activeLi === index && !isDisabled && (
                  <div className="w-full flex justify-center">
                    <p className="w-[15px] h-[2px] rounded-[14px] bg-[#004368]"></p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Language & User Section */}
      <div className="flex items-center mx-auto col-span-2 mr-[10px]">
        {/* <div className="flex items-center  mr-3  bg-[#004368]  rounded-md px-2 py-[8px]">
          <img src={customerSupport} alt="mic" className="w-5" />
        </div> */}
        <div className="flex items-center bg-transparent mr-3 border border-[#004368] border-opacity-60 rounded-md px-2 py-[2px]">
          <HiOutlineLanguage className="w-5 h-5" />
          <select
            className="text-black px-1 bg-transparent border-none focus:outline-none select-info"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            <option value="en">English</option>
            <option value="cn">中文</option>
            <option value="fil">Filipino</option>
            <option value="id">Indonesian</option>
            <option value="th">Thai</option>
            <option value="vi">Vietnamese</option>
            <option value="ms">Malay</option>
          </select>
        </div>
        <EmailVerificationComponent
          currentUser={currentUser}
        ></EmailVerificationComponent>
        {/* User Dropdown */}
        <div className="dropdown dropdown-end flex items-center justify-center">
          {currentUser ? (
            <>
              <p className="w-[91px] h-[18px] text-black text-[12px] font-semibold capitalize ml-9">
                {currentUser.length > 10
                  ? currentUser.slice(0, 10) + "..."
                  : currentUser}
              </p>

              <div className="dropdown dropdown-end ml-2">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn-circle avatar flex items-center"
                >
                  <div className="w-8 h-8 rounded-[32px] flex items-center justify-center">
                    <img
                      alt="Profile"
                      src={
                        userDetails?.image &&
                        userDetails.image.startsWith("data:image/")
                          ? userDetails.image
                          : Avatar
                      }
                    />
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white rounded-box w-52 text-[#004368] text-opacity-60"
                >
                  {/* <li>
                    <Link
                      to="/onlineprint/resetpassword"
                      className="hover:font-semibold hover:text-[#004368]"
                    >
                      {t("resetPassword")}
                    </Link>
                  </li> */}
                  <li>
                    <button
                      onClick={handleUpgradeClick}
                      className="flex items-center gap-2 mb-3 hover:font-semibold hover:text-[#004368] text-amber-600 transition-all"
                    >
                      <FaCrown className="text-lg" />
                      <span>{t("UpgradePlan")}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 hover:font-semibold hover:text-[#004368] transition-all"
                    >
                      <MdLogout className="text-lg text-red-500" />
                      <span className="text-red-500">{t("logout")}</span>
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <Link to="/onlineprint/login">{t("login")}</Link>
          )}
        </div>
      </div>
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl w-[500px] max-w-[90%] relative">
            {/* Close Button */}
            <button
              onClick={handleUpgradeCancel}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MdClose className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="bg-[#004368] text-white px-8 py-6 rounded-t-lg">
              <div className="flex items-center gap-3">
                <FaCrown className="text-3xl" />
                <h2 className="text-2xl font-bold">{t("UpgradeYourPlan")}</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                {t("UpgradeConfirm_1")}{" "}
                <span className="font-semibold text-[#004368]">
                  {selectedPlatform}
                </span>{" "}
                {t("UpgradeConfirm_Platform")}{" "}
                <span className="font-semibold text-[#004368]">
                  {selectedStore}
                </span>
                {t("UpgradeConfirm_Q")}
              </p>

              {/* Benefits List (Optional) */}
              <div className="mt-6 bg-amber-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 font-medium mb-2">
                  {t("UpgradeBenefits")}:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-500">✓</span>
                    {t("UnlimitedOrders")}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-500">✓</span>
                    {t("IncreaseAccessDuration")}
                  </li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 bg-gray-50 rounded-b-lg flex justify-end gap-4">
              <button
                onClick={handleUpgradeCancel}
                className="px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                {t("Cancel")}
              </button>
              <button
                onClick={handleUpgradeConfirm}
                className="px-6 py-2.5 rounded-lg bg-[#004368] text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
              >
                {t("YesUpgrade")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNavbar;
