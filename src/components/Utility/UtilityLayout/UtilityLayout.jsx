import React, { useState } from "react";
import TopNavbar from "../../../Share/Navbar/TopNavbar";
import { Link, Outlet } from "react-router-dom";
import { TbBoxMultiple, TbDevicesSearch } from "react-icons/tb";
import { RiFileSearchLine, RiShareForwardBoxLine } from "react-icons/ri";
import { FaRegFilePowerpoint } from "react-icons/fa";
import { LuFileCheck2, LuFileWarning, LuFileInput } from "react-icons/lu";
import { BiScan } from "react-icons/bi";
import { PiPrinterLight } from "react-icons/pi";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { LiaFileInvoiceSolid, LiaShippingFastSolid } from "react-icons/lia";
import { BsGraphUp } from "react-icons/bs";
import { SiPrivateinternetaccess } from "react-icons/si";
import { AiOutlineContacts } from "react-icons/ai";
import { clients } from "../../../Share/Data/ClientData";

const settingsInfo = [
  {
    id: 1,
    name: "related stores",
    image: <TbBoxMultiple />,
  },
  {
    id: 2,
    name: "order inquiry",
    image: <RiFileSearchLine />,
  },
  {
    id: 3,
    name: "print record",
    image: <FaRegFilePowerpoint />,
  },
  {
    id: 4,
    name: "delivery record",
    image: <LuFileCheck2 />,
  },
  {
    id: 5,
    name: "scan and ship",
    image: <BiScan />,
  },
  {
    id: 6,
    name: "automatic printing",
    image: <PiPrinterLight />,
  },
  {
    id: 7,
    name: "unusual order",
    image: <LuFileWarning />,
  },
  {
    id: 8,
    name: "import order and ship",
    image: <LuFileInput />,
  },
  {
    id: 9,
    name: "express reconciliation",
    image: <HiOutlineClipboardDocumentCheck />,
  },
  {
    id: 10,
    name: "single number sharing",
    image: <RiShareForwardBoxLine />,
  },
  {
    id: 11,
    name: "mission center",
    image: <LiaFileInvoiceSolid />,
  },
  {
    id: 12,
    name: "product report summary",
    image: <BsGraphUp />,
  },
  {
    id: 13,
    name: "rookie privacy form",
    image: <SiPrivateinternetaccess />,
  },
  {
    id: 14,
    name: "logistic manager",
    image: <LiaShippingFastSolid />,
  },
  {
    id: 15,
    name: "order operation log",
    image: <TbDevicesSearch />,
  },
  {
    id: 16,
    name: "login log",
    image: <AiOutlineContacts />,
  },
];



const UtilityLayout = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [active, setActive] = useState(settingsInfo[0]);
  // console.log(settingsInfo[0]);

  // Function to handle the master checkbox change
  const handleMasterCheckboxChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setCheckedItems(clients);
    } else {
      setCheckedItems([]);
    }
  };

  // Function to handle individual checkbox change
  const handleCheckboxChange = (customer) => {
    if (checkedItems.some((item) => item?.id === customer?.id)) {
      // If the customer id is already in the checkedItems, remove it
      const updatedItems = checkedItems.filter(
        (item) => item?.id !== customer?.id
      );
      setCheckedItems(updatedItems);
      setSelectAll(false);
    } else {
      // If the customer id is not in the checkedItems, add it
      const updatedItems = [...checkedItems, customer];
      setCheckedItems(updatedItems);
      if (updatedItems.length === clients.length) {
        setSelectAll(true);
      }
    }
  };

  // active button set function
  const handleToSelectSideNav = (setting) => {
    setActive(setting);
  };
  return (
    <div>
      <TopNavbar></TopNavbar>
      <div className="bg-[#004368] bg-opacity-5 w-full h-screen pb-32">
        <div className="px-6 py-6 flex">
          {/* left side */}
          <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] w-[266px] h-[843px] mr-[30px] cursor-pointer">
            <div className="mt-6">
              {/* <ul className="ml-8 mt-3 max-h-[590px] overflow-y-auto"> */}
              <ul className="ml-5 mt-3">
                {settingsInfo?.map((setting, index) => (
                  <Link to={`${setting.name}`} key={setting.id}>
                    <li
                      className="flex items-center mb-7 capitalize"
                      onClick={() => handleToSelectSideNav(setting)}>
                      <p
                        className={`pl-4 text-black text-[15px] font-normal leading-normal capitalize cursor-pointer flex items-center justify-center gap-4`}>
                        <span
                          className={`w-[18px] h-[18px] ${active?.id === setting?.id
                            ? "text-[#004368] font-bold text-[15px]"
                            : ""
                            }`}>
                          {setting.image}
                        </span>
                        <span
                          className={` ${active?.id === setting?.id
                            ? "text-[#004368] font-semibold text-[15px]"
                            : ""
                            }`}>
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
          {/* <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] px-6 pt-5 col-span-8 pb-6"> */}
          <div className="w-[1095px] h-[782px]">
            {/* top */}
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilityLayout;
