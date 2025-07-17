import React from "react";
import { Link, useRouteError } from "react-router-dom";
import TopNavbar from "../Navbar/TopNavbar";
import Error1 from "../../assets/404.svg";
import Error2 from "../../assets/404-1.svg";
import Error3 from "../../assets/404-2.svg";
import { useSelector } from "react-redux";

const ErrorPage = () => {
  //   language change
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );
  const error = useRouteError();
  return (
    <div>
      <TopNavbar />
      <div className="flex flex-col items-center justify-center mt-40">
        {/* Image */}
        <div className="flex items-center space-x-10">
          <img src={Error1} alt="ErrorImage" />
          <img src={Error2} alt="ErrorImage" />
          <img src={Error3} alt="ErrorImage" />
        </div>
        {/* text */}
        <div className="mt-20">
          <h3 className="text-[#004368] text-center text-3xl font-extrabold leading-normal">
            Whoops! Looks like this page wandered off
          </h3>
          <p className="text-center text-black text-xl font-light leading-normal mt-1">
            Let's guide you back home.
          </p>
        </div>
        {/* button */}
        <div className="mt-20">
          <Link
            to="/"
            className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[234px] h-12 px-8 py-2 rounded-md cursor-pointer"
          >
            {selectedLanguage === "zh-CN" ? "返回首页" : "Back To Home"}
          </Link>
        </div>
      </div>
      {/* <div>
        <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-600">
          <span className="sr-only">{error.status}</span>404
        </h2>
        <p className="text-3xl ">
          OPS!!! This page{" "}
          <span className=" text-red-600 font-bold">
            {error.statusText || error.message}
          </span>
        </p>
        <Link
          to="/"
          className="px-8 py-3 font-semibold rounded bg-red-300 text-black dark:text-gray-900"
        >
          Back to homepage
        </Link>
      </div> */}
    </div>
  );
};

export default ErrorPage;
