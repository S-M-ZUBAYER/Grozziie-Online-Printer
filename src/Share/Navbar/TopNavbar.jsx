import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineLanguage } from "react-icons/hi2";
import { useTranslation } from "react-i18next";
import {
  accountUserChange,
  mainRouteStateChange,
  mainRouteStateFalseChange,
} from "../../features/slice/userSlice";
import grozziieLogo from "../../assets/GrozziieLogo.png";
import Avatar from "../../assets/avatar.jpg";
import customerSupport from "../../assets/Vector.png";

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
            const isDisabled = item.key === "lazada";

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
                      src={userDetails ? userDetails?.image : Avatar}
                    />
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white rounded-box w-52 text-[#004368] text-opacity-60"
                >
                  <li>
                    <Link
                      to="/onlineprint/resetpassword"
                      className="hover:font-semibold hover:text-[#004368]"
                    >
                      {t("resetPassword")}
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="hover:font-semibold hover:text-[#004368]"
                    >
                      {t("logout")}
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
    </div>
  );
};

export default TopNavbar;
