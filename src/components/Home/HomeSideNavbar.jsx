import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HomeSideNavbar = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white border-l-2 border-l-slate-100 h-full shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)]">
      <div className="hidden md:block mx-auto ml-[43px]">
        <nav aria-label="Site Nav">
          <ul className="gap-6 text-base pt-20">
            <div className="flex items-center">
              <div className="w-[5px] h-[23px] rounded-[14px] bg-[#004368]"></div>
              <li className="ml-2">
                <Link
                  className="text-[#004368] text-[15px] font-bold capitalize transition hover:font-bold hover:text-[#004368]"
                  to="/home"
                >
                  {t("home")}
                </Link>
              </li>
            </div>

            <li className="my-2 ml-4">
              <Link
                className="text-black text-[15px] font-medium capitalize transition hover:font-bold hover:text-[#004368]"
                to="/batchprint"
              >
                {t("batchPrint")}
              </Link>
            </li>
            {/* <li className="my-2 ml-4">
              <Link
                className="text-black text-[15px] font-medium capitalize transition hover:font-bold hover:text-[#004368]"
                to="/LazadaOrderManagement"
              >
                {t("Lazada")}
              </Link>
            </li> */}

            {/* <li className="my-2 ml-4">
              <Link
                className="text-black text-[15px] font-medium capitalize transition hover:font-bold hover:text-[#004368]"
                to="/singleprint"
              >
                {t("singlePrint")}
              </Link>
            </li>

            <li className="my-2 ml-4">
              <Link
                className="text-black text-[15px] font-medium capitalize transition hover:font-bold hover:text-[#004368]"
                to="/settings"
              >
                {t("settings")}
              </Link>
            </li>

            <li className="my-2 ml-4">
              <Link
                className="text-black text-[15px] font-medium capitalize transition hover:font-bold hover:text-[#004368]"
                to="/utility"
              >
                {t("utility")}
              </Link>
            </li>

            <li className="my-2 ml-4">
              <Link
                className="text-black text-[15px] font-medium capitalize transition hover:font-bold hover:text-[#004368]"
                to="/manualOrder"
              >
                {t("manualOrder")}
              </Link>
            </li> */}

            <li className="my-2 ml-4">
              <Link
                className="text-black text-[15px] font-medium capitalize transition hover:font-bold hover:text-[#004368]"
                to="/contact"
              >
                {t("contact")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default HomeSideNavbar;
