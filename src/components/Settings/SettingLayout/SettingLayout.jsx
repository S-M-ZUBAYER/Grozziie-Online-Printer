import React, { useState } from "react";
import Recipient from "../../../assets/recipient-information.png";
import Sender from "../../../assets/sender-information.png";
import Display from "../../../assets/display-order.png";
import Order from "../../../assets/order-print-filter.png";
import Automatic from "../../../assets/automatic-shipping-settings.png";
import Logistic from "../../../assets/logistic-machine-settings.png";
import Express from "../../../assets/express-unreachable-area.png";
import Search from "../../../assets/Search.png";
import Delete from "../../../assets/Delete.png";
import { FaPlus } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";
import TopNavbar from "../../../Share/Navbar/TopNavbar";
import { CgNotes } from "react-icons/cg";
import { AiOutlineIdcard, AiOutlineUnorderedList } from "react-icons/ai";
import { BsFilter } from "react-icons/bs";
import { MdOutlineImageAspectRatio } from "react-icons/md";
import { LiaShippingFastSolid } from "react-icons/lia";
import { CiLocationOn } from "react-icons/ci";
import { useTranslation } from "react-i18next";

const settingsInfo = [
  {
    id: 1,
    name: "RecipientInformation",
    image: <CgNotes />,
  },
  {
    id: 2,
    name: "SenderInformation",
    image: <AiOutlineIdcard />,
  },
  {
    id: 3,
    name: "DisplayOrder",
    image: <AiOutlineUnorderedList />,
  },
  {
    id: 4,
    name: "OrderPrintFilter",
    image: <BsFilter />,
  },
  {
    id: 5,
    name: "AutomaticShippingSettings",
    image: <MdOutlineImageAspectRatio />,
  },
  {
    id: 6,
    name: "LogisticMachineSettings",
    image: <LiaShippingFastSolid />,
  },
  {
    id: 7,
    name: "ExpressUnreachableArea",
    image: <CiLocationOn />,
  },
];

const clients = [
  {
    id: 1,
    recipient_name: "John Doe",
    company_name: "ABC Inc.",
    address: "123 Main Street",
    landline: "123-456-7890",
    post_code: "ABCDE",
    operate: "Operate 1",
  },
  {
    id: 2,
    recipient_name: "Jane Smith",
    company_name: "XYZ Corp.",
    address: "456 Park Avenue",
    landline: "987-654-3210",
    post_code: "FGHIJ",
    operate: "Operate 2",
  },
  // {
  //   id: 3,
  //   recipient_name: "Alice Johnson",
  //   company_name: "PQR Ltd.",
  //   address: "789 Oak Street",
  //   landline: "111-222-3333",
  //   post_code: "KLMNO",
  //   operate: "Operate 3",
  // },
  // {
  //   id: 4,
  //   recipient_name: "Alice Johnson",
  //   company_name: "PQR Ltd.",
  //   address: "789 Oak Street",
  //   landline: "111-222-3333",
  //   post_code: "KLMNO",
  //   operate: "Operate 3",
  // },
  // {
  //   id: 5,
  //   recipient_name: "Alice Johnson",
  //   company_name: "PQR Ltd.",
  //   address: "789 Oak Street",
  //   landline: "111-222-3333",
  //   post_code: "KLMNO",
  //   operate: "Operate 3",
  // },
  // {
  //   id: 6,
  //   recipient_name: "Alice Johnson",
  //   company_name: "PQR Ltd.",
  //   address: "789 Oak Street",
  //   landline: "111-222-3333",
  //   post_code: "KLMNO",
  //   operate: "Operate 3",
  // },
  // {
  //   id: 7,
  //   recipient_name: "Alice Johnson",
  //   company_name: "PQR Ltd.",
  //   address: "789 Oak Street",
  //   landline: "111-222-3333",
  //   post_code: "KLMNO",
  //   operate: "Operate 3",
  // },
];

const SettingLayout = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [active, setActive] = useState(settingsInfo[0]);

  const { t } = useTranslation();
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
      <div className="bg-[#004368] bg-opacity-5 w-full h-screen pb-11">
        <div className="px-[30px] py-6 grid grid-cols-11">
          {/* left side */}
          <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] col-span-3 max-h-[782px] mr-12 cursor-pointer">
            <div className="mt-12">
              <ul className="ml-8 mt-3 max-h-[590px] overflow-y-auto">
                {settingsInfo?.map((setting, index) => (
                  <Link to={`${setting.name}`} key={setting.id}>
                    <li
                      className="flex items-center mb-10 capitalize"
                      onClick={() => handleToSelectSideNav(setting)}
                    >
                      <p
                        className={`pl-4 text-black text-[15px] font-normal leading-normal capitalize cursor-pointer flex items-center justify-center gap-4`}
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
                          {t(`${setting.name}`)}
                        </span>
                      </p>
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>

          {/* right side */}
          <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] px-6 pt-5 col-span-8 max-h-[782px] pb-6">
            {/* top */}
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingLayout;
