import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { TbInfoSquareRounded, TbNotes } from "react-icons/tb";
import { MdOutlinePersonalInjury, MdOutlineSupportAgent } from "react-icons/md";
import { CgShoppingBag } from "react-icons/cg";
import { BsClipboardData, BsShop } from "react-icons/bs";
import { PiLightbulbLight } from "react-icons/pi";
import { CiDeliveryTruck, CiSearch } from "react-icons/ci";
import { RiMoneyCnyCircleLine } from "react-icons/ri";
import { SiAmazonsimpleemailservice } from "react-icons/si";
import { BiShapeSquare } from "react-icons/bi";

import logo from "../../../assets/GrozziieLogo.png";

const marketingInfo = [
  {
    id: 1,
    name: "marketing",
    image: <HiOutlineSpeakerphone />,
  },
  {
    id: 2,
    name: "transactions",
    image: <TbNotes />,
  },
  {
    id: 3,
    name: "private domain",
    image: <MdOutlinePersonalInjury />,
  },
  {
    id: 4,
    name: "merchandise",
    image: <CgShoppingBag />,
  },
  {
    id: 5,
    name: "shop",
    image: <BsShop />,
  },
  {
    id: 6,
    name: "promotion",
    image: <PiLightbulbLight />,
  },
  {
    id: 7,
    name: "delivery company",
    image: <CiDeliveryTruck />,
  },
  {
    id: 8,
    name: "customer service",
    image: <MdOutlineSupportAgent />,
  },
  {
    id: 9,
    name: "content",
    image: <TbInfoSquareRounded />,
  },
  {
    id: 10,
    name: "finance",
    image: <RiMoneyCnyCircleLine />,
  },
  {
    id: 11,
    name: "data",
    image: <BsClipboardData />,
  },
  {
    id: 12,
    name: "service",
    image: <SiAmazonsimpleemailservice />,
  },
  {
    id: 13,
    name: "product application",
    image: <BiShapeSquare />,
  },
];

const MarketingLayout = () => {
  const [active, setActive] = useState(marketingInfo[0]);

  // active button set function
  const handleToSelectSideNav = (setting) => {
    setActive(setting);
  };

  return (
    <div>
      {/* Navbar and search option */}
      <div className="bg-white h-20 my-auto flex items-center">
        <div className="flex items-center pl-12 gap-x-10">
          <div>
            <img src={logo} alt="Grozziie" className="w-64 h-10" />
          </div>
          <div className="">
            <div className="flex items-center justify-center">
              <div className="col-span-2 w-[500px] h-10 outline-none rounded-md text-[#00000099] font-normal text-[15px] text-center flex justify-between items-center cursor-pointer mr-3">
                <div className="w-full h-full bg-[#0043681A] flex items-center rounded-md">
                  <CiSearch className="w-[22px] h-[22px] ml-3" />
                  <input
                    // onChange={handleSearchAllChange}
                    type="text"
                    placeholder="Search"
                    className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-transparent outline-none"
                  />
                </div>
              </div>

              <button className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[115px] h-10 px-8 py-1 rounded-md cursor-pointer">
                <p className="text-[15px] font-medium leading-normal capitalize">
                  Search
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* full body */}
      <div className="bg-[#004368] bg-opacity-5 w-full h-screen pb-11">
        <div className="px-6 py-4 grid grid-cols-10 gap-4">
          {/* left side */}
          <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] col-span-2 h-[855px] cursor-pointer">
            <div className="mt-10">
              <ul className="ml-8 mt-3 max-h-screen overflow-y-auto">
                {marketingInfo?.map((setting, index) => (
                  <Link to={`${setting.name}`} key={setting.id}>
                    <li
                      className="flex items-center mb-10 capitalize"
                      onClick={() => handleToSelectSideNav(setting)}
                    >
                      <p
                        className={`pl-4 text-black text-sm font-normal leading-normal capitalize cursor-pointer flex items-center justify-center gap-2`}
                      >
                        <span
                          className={`w-[18px] h-[18px] ${
                            active?.id === setting?.id
                              ? "text-[#004368] font-bold text-[15px]"
                              : ""
                          }`}
                        >
                          {setting.image}
                        </span>
                        <span
                          className={` ${
                            active?.id === setting?.id
                              ? "text-[#004368] font-semibold text-[15px]"
                              : ""
                          }`}
                        >
                          {setting.name}
                        </span>
                      </p>
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>

          {/* right side */}
          <div className="rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] col-span-8">
            {/* top */}
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingLayout;
