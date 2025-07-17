import React, { useRef, useState } from "react";
import SearchComponent from "../../../Share/SearchComponent/SearchComponent";
import { FaEdit, FaPlus } from "react-icons/fa";
import StoredDeliveryCompanyList from "../../../Share/StoredDeliveryCompanyList/StoredDeliveryCompanyList";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import { arrayToExcel } from "../../../Share/Function/FunctionalComponent";
import { RiContactsLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import NewSearchComponent from "../../../Share/SearchComponent/NewSearchComponent";

const logoOptions = ["Homer", "Marge", "Bart", "Lisa", "Maggie"];
const bannerOptions = ["Homer", "Marge", "Bart", "Lisa", "Maggie"];
const billOptions = ["Homer", "Marge", "Bart", "Lisa", "Maggie"];

const MarketingPage = () => {
  const orderListData = useSelector((state) => state.orderList.data);
  const [clients, setClients] = useState(orderListData);
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [active, setActive] = useState(clients[0]?.recipientName);

  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );
  // date range functionality start

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  // const [range, setRange] = useState([
  //   {
  //     startDate: new Date(),
  //     endDate: addDays(new Date(), 7),
  //     key: "selection",
  //   },
  // ]);
  const refOne = useRef([]);

  // useEffect(() => {
  //   console.log("infinity loop");
  //   document.addEventListener("keydown", hideOnEscape, true);
  //   document.addEventListener("click", hideOnClickOutside, true);
  // }, []);

  // for date wise search functions start here
  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  // date range functionality end
  const handleToSelectCustomer = (client) => {
    setSelectedClient(client);
    setActive(client?.recipientName);
  };

  const [modalInput, setModalInput] = useState("");

  // const filteredAllProduct = mallProduct.filter(
  //   (request) =>
  //     request?.productName
  //       .toLowerCase()
  //       .includes(searchAllQuery.toLowerCase()) ||
  //     request?.productCountryName
  //       .toLowerCase()
  //       .includes(searchAllQuery.toLowerCase()) ||
  //     request?.productPrice
  //       .toLowerCase()
  //       .includes(searchAllQuery.toLowerCase()) ||
  //     // request?.id.includes(searchAllQuery.toLowerCase()) ||
  //     request?.modelNumber.toLowerCase().includes(searchAllQuery.toLowerCase())
  //   // request?.printerColo.toLowerCase().includes(searchAllQuery.toLowerCase())
  // );

  //Excel functionalities
  const handleBatchPrinterExcelClick = () => {
    arrayToExcel([selectedClient], "singlePrinterCustomerList");
  };

  // modal submit function
  const handleModalSubmit = (e) => {
    e.preventDefault();
    setModalInput("");
    document.getElementById("my_modal_1").close();
  };

  //make function for import data

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Assuming the first sheet is the one you want to convert
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet to an array of objects
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setClients([...clients, ...jsonData]);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleImportOrderClick = () => {
    // Trigger the hidden file input
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
  };

  return (
    <>
      <div className="h-[860px]">
        {/* top section */}
        <NewSearchComponent />

        {/* middle section */}
        <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] p-4 mt-3 grid grid-cols-12">
          {/* add new template with modal*/}
          <div className=" col-span-3">
            <button
              className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[229px] h-10 px-8 py-2 rounded-md cursor-pointer text-center col-span-2"
              onClick={() => document.getElementById("my_modal_1").showModal()}
            >
              <button className="text-[15px] font-medium capitalize flex items-center justify-between">
                <FaPlus className="w-[14px] h-[14px]" />
                <span className="pl-4 text-sm font-medium capitalize">
                  Add New Template
                </span>
              </button>
            </button>
            <dialog id="my_modal_1" className="modal">
              <div className="bg-white rounded-2xl w-96 h-60 pt-10">
                <h3 className="text-[#004368] font-bold text-lg pl-5">
                  New Company Name
                </h3>
                <div className="modal-action w-full text-center flex justify-end pr-10">
                  <form method="dialog" onSubmit={handleModalSubmit}>
                    <div className="">
                      <input
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-[320px] bg-transparent"
                        onChange={(e) => setModalInput(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[100px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mr-3 mt-5"
                        type="submit"
                      >
                        Save
                      </button>
                      <p
                        className="bg-[#004368] bg-opacity-30 hover:bg-[#004368] text-black hover:text-white w-[100px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mt-5"
                        onClick={() =>
                          document.getElementById("my_modal_1").close()
                        }
                      >
                        Close
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </dialog>
          </div>

          <div className="col-span-9 custom-scrollbar">
            <StoredDeliveryCompanyList />
          </div>
        </div>

        {/* bottom section */}
        <div className="mt-3 mb-[7px] grid grid-cols-10">
          {/* left side */}
          <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] col-span-2 mr-[10px]">
            <div className="mt-6">
              <div className="ml-4 flex items-center">
                <RiContactsLine className="mr-[9px] w-6 h-4 text-[#004368]" />
                <p className="text-[#004368] text-base font-bold capitalize">
                  Customer list
                </p>
              </div>
              <ul className="ml-8 mt-3 max-h-[590px] overflow-y-auto">
                {clients?.map((client, index) => (
                  <li
                    key={index}
                    onClick={() => handleToSelectCustomer(client)}
                    className={`text-black opacity-80 text-sm font-light capitalize pb-2 cursor-pointer ${active === client?.recipientName &&
                      "text-[#004368] font-medium text-[15px]"
                      }`}
                  >
                    {client?.receiver_name ? client?.receiver_name : "No Name"}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* right side */}
          <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] px-6 pt-5 col-span-8 pb-[22px]">
            {/* top */}
            <div className="grid grid-cols-5 items-center justify-center px-3 pt-2">
              <div className="col-span-1">
                <p className="text-[#004368] text-xs font-normal capitalize text-center">
                  waiting for shipment
                </p>
              </div>
              {/* this data coming from server and data dynamic */}
              <div className="col-span-1 flex items-center justify-center">
                <p className="text-black text-opacity-40 text-xs font-normal capitalize">
                  500 buyers
                </p>
                <div className="w-[1px] h-5 bg-black bg-opacity-40 mx-1"></div>
                <p className="text-black text-opacity-40 text-xs font-normal capitalize">
                  700 orders
                </p>
              </div>
              {/* here need to add button onclik for cheage page and dynamic data add from excel */}
              <div className="col-span-1 flex items-center justify-center">
                <p className="text-[#004368] text-xs font-normal capitalize cursor-pointer">
                  split order
                </p>
                <div className="w-[1px] h-5 bg-[#004368] mx-1"></div>
                <input
                  type="file"
                  id="fileInput"
                  accept=".xls, .xlsx"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />

                <p
                  onClick={handleImportOrderClick}
                  className="text-[#004368] text-xs font-normal capitalize cursor-pointer"
                >
                  Import Order
                </p>
              </div>

              <div className="col-span-2 flex items-center justify-end">
                <div className="flex items-center justify-center px-7 cursor-pointer">
                  {/* <img src={Settings} alt="settings" className="w-4 h-4" /> */}
                  <IoSettingsOutline className="w-4 h-4" />

                  <p className="ml-2 text-[#004368] text-sm font-medium capitalize">
                    settings
                  </p>
                </div>
                <button
                  onClick={handleBatchPrinterExcelClick}
                  className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[115px] h-10 px-8 py-2 rounded-md cursor-pointer"
                >
                  <p className="text-[15px] font-medium capitalize cursor-pointer">Export</p>
                </button>
              </div>
            </div>

            {/* middle table */}
            <div className="mt-4">
              <table className="table">
                <thead className="bg-[#0043681A] bg-opacity-80 h-11 rounded-[6px]">
                  <tr className=" text-black text-opacity-80 capitalize text-center text-sm font-light">
                    <th className="sticky top-0 bg-gray-200 flex justify-between">
                      <span className="mr-[10px]">Name</span>
                      <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                    </th>
                    <th className="sticky top-0 bg-gray-200">
                      <span className="mr-[10px]">Quantity</span>
                      <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                    </th>
                    <th className="sticky top-0 bg-gray-200">
                      <span className="mr-[10px]">recipient name</span>
                      <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                    </th>
                    <th className="sticky top-0 bg-gray-200">
                      <span className="mr-[10px]">Address</span>
                      <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                    </th>
                    <th className="sticky top-0 bg-gray-200">
                      <span className="mr-[10px]">message</span>
                      <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                    </th>
                    <th className="sticky top-0 bg-gray-200">
                      <span className="mr-[10px]">delivery template</span>
                      <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                    </th>
                    <th className="sticky top-0 bg-gray-200">tracking</th>
                  </tr>
                </thead>
                <tbody className="max-h-[590px] overflow-y-auto">
                  {selectedClient && (
                    <tr
                      className={`hover:bg-[#0043681A] capitalize text-center cursor-pointer`}
                      key={selectedClient?.order_sn}
                    >
                      <td className="text-black text-sm font-light capitalize">
                        {selectedClient?.receiver_name_mask
                          ? selectedClient?.receiver_name_mask
                          : "No Data"}
                      </td>
                      <td className="text-black text-sm font-light capitalize">
                        {selectedClient?.item_list?.[0]?.goods_count
                          ? selectedClient?.item_list?.[0]?.goods_count
                          : "No Data"}
                      </td>
                      <td className="text-black text-sm font-light capitalize">
                        {selectedClient?.receiver_name
                          ? selectedClient?.receiver_name
                          : "No Data"}
                      </td>
                      <td className="text-black text-sm font-light capitalize">
                        {selectedClient?.receiver_address
                          ? selectedClient?.receiver_address
                          : "No Data"}
                      </td>
                      <td className="text-black text-sm font-light capitalize">
                        {selectedClient?.remark
                          ? selectedClient?.remark
                          : "No Data"}
                      </td>
                      <td className="text-black text-sm font-light capitalize">
                        {selectedClient?.delivery_one_day
                          ? "Express"
                          : "Regular"}
                      </td>
                      <td className="text-black text-sm font-light capitalize">
                        {selectedClient?.tracking_number
                          ? selectedClient?.tracking_number
                          : "No Data"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* client details */}
              <div className="mt-6 bg-[#004368] bg-opacity-5 pt-5 pb-9 px-6 rounded-[6px]">
                {/* body top */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center mb-[10px]">
                      <p className="text-black text-[15px] font-medium capitalize">
                        Recipient Name:
                      </p>
                      <p className="text-black text-[15px] font-light capitalize ml-3">
                        {selectedClient?.receiver_name
                          ? selectedClient?.receiver_name
                          : "No Data"}
                      </p>
                    </div>
                    <div className="flex items-center mb-[10px]">
                      <p className="text-black text-[15px] font-medium capitalize">
                        Contact Number:
                      </p>
                      <p className="text-black text-[15px] font-light capitalize ml-3">
                        {selectedClient?.receiver_phone
                          ? selectedClient?.receiver_phone
                          : "No Data"}
                      </p>
                    </div>
                    <div className="flex items-center mb-[10px]">
                      <p className="text-black text-[15px] font-medium capitalize">
                        Address:
                      </p>
                      <p className="text-black text-[15px] font-light capitalize ml-3">
                        {selectedClient?.receiver_address
                          ? selectedClient?.receiver_address
                          : "No Data"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-black text-[15px] font-medium capitalize">
                        Order Time:
                      </p>
                      <p className="text-black text-[15px] font-light capitalize ml-3">
                        {selectedClient?.confirm_time
                          ? selectedClient?.confirm_time
                          : "No Data"}
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <div className="flex items-center mb-[10px]">
                      <p className="text-black text-[15px] font-medium capitalize">
                        fixed telephone:
                      </p>
                      <p className="text-black text-[15px] font-light capitalize ml-3">
                        {selectedClient?.receiver_phone
                          ? selectedClient?.receiver_phone
                          : "No Data"}
                      </p>
                    </div>
                    <div className="flex items-center mb-[10px]">
                      <p className="text-black text-[15px] font-medium capitalize">
                        shipping time:
                      </p>
                      <p className="text-black text-[15px] font-light capitalize ml-3">
                        {selectedClient?.last_ship_time
                          ? selectedClient?.last_ship_time
                          : "No Data"}
                      </p>
                    </div>
                    <div className="flex items-center mb-[10px]">
                      <p className="text-black text-[15px] font-medium capitalize">
                        total Amount:
                      </p>
                      <p className="text-black text-[15px] font-light capitalize ml-3">
                        $
                        <span>
                          {selectedClient?.item_list?.[0]?.goods_price
                            ? selectedClient?.item_list?.[0]?.goods_price
                            : "No Data"}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-black text-[15px] font-medium capitalize">
                        received payment:
                      </p>
                      <p className="text-black text-[15px] font-light capitalize ml-3">
                        $
                        <span>
                          {selectedClient?.pay_amount
                            ? selectedClient?.pay_amount
                            : "No Data"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                {/* body middle */}
                <div className="my-5 flex items-center gap-2">
                  <textarea
                    placeholder="Message"
                    className="w-[330px] h-10 rounded-md p-2 bg-[#0043681A]"
                  ></textarea>
                  <textarea
                    placeholder="Remark"
                    className="w-[250px] h-10 rounded-md p-2 bg-[#0043681A]"
                  ></textarea>
                  <select className="h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[15px] py-2 text-center inline-flex items-center bg-[#0043681A] ">
                    <option disabled selected>
                      Logo
                    </option>
                    {logoOptions.map((status, index) => (
                      <option key={index} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <select className="w-[180px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[15px] py-2 text-center inline-flex items-center bg-[#0043681A] ">
                    <option disabled selected>
                      Banner
                    </option>
                    {bannerOptions.map((status, index) => (
                      <option key={index} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <select className="w-[180px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[15px] capitalize px-[15px] py-2 text-center inline-flex items-center bg-[#0043681A] ">
                    <option disabled selected>
                      Bill
                    </option>
                    {billOptions.map((status, index) => (
                      <option key={index} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                {/* body bottom */}
                <div className="flex items-center">
                  <div className="flex items-center justify-center">
                    <div className="">
                      <img
                        src={
                          selectedClient?.item_list?.[0]?.goods_img
                            ? selectedClient?.item_list?.[0]?.goods_img
                            : "No Data"
                        }
                        alt="productImage"
                        className="w-40 h-32 rounded-md"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-[#004368] text-[15px] font-bold leading-normal capitalize mb-4">
                        Product Details
                      </p>
                      <div className="flex items-center mb-[10px]">
                        <p className="text-black text-[15px] font-medium capitalize">
                          Price:
                        </p>
                        <p className="text-black text-[15px] font-light capitalize ml-3">
                          ${selectedClient?.item_list?.[0]?.goods_price}
                        </p>
                      </div>
                      <div className="flex items-center mb-[10px]">
                        <p className="text-black text-[15px] font-medium capitalize">
                          Item Number:
                        </p>
                        <p className="text-black text-[15px] font-light capitalize ml-3">
                          {selectedClient?.item_list?.[0]?.goods_spec}
                        </p>
                      </div>
                      <div className="flex items-center mb-[10px]">
                        <p className="text-black text-[15px] font-medium capitalize">
                          Sale Attributes:
                        </p>
                        <p className="text-black text-[15px] font-light capitalize ml-3">
                          One Year Warrenty
                        </p>
                        <div className="flex items-center ml-[135px]">
                          <p className="text-black text-[15px] font-medium capitalize">
                            Color:
                          </p>
                          <p className="text-black text-[15px] font-light capitalize ml-3">
                            Blue, White
                          </p>
                        </div>
                        <div className="flex items-center ml-[60px] mb-[10px]">
                          <p className="text-black text-[15px] font-medium capitalize">
                            Quantity:
                          </p>
                          <p className="text-black text-[15px] font-light capitalize ml-3">
                            {selectedClient?.item_list?.[0]?.goods_count}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end section button */}
        <div className="pt-1 pb-7">
          <div className="flex items-center justify-end">
            <button className="w-52 h-10 bg-white text-[#004368] rounded-md border flex items-center hover:bg-[#004368] hover:text-white p-2">
              <FaEdit className="w-4 h-4" />
              <span className="text-[15px] font-medium leading-normal capitalize pl-2">
                Create manual order
              </span>
            </button>
            <button className="w-52 h-10 bg-white text-[#004368]  hover:bg-[#004368] hover:text-white rounded-md border flex items-center p-2 ml-3">
              <MdOutlineLocalPrintshop className="w-[18px] h-[18px]" />
              <span className="text-[15px] font-medium leading-normal capitalize pl-1 hover:text-white">
                print express delivery
              </span>
            </button>
            <button className="w-52 h-10 bg-white text-[#004368]  hover:bg-[#004368] hover:text-white rounded-md border flex items-center p-2 ml-3">
              <MdOutlineLocalPrintshop className="w-[18px] h-[18px]" />
              <span className="text-[15px] font-medium leading-normal capitalize pl-1">
                print delivery note
              </span>
            </button>
            <button className="w-52 h-10 bg-white text-[#004368]  hover:bg-[#004368] hover:text-white rounded-md border flex items-center p-2 ml-3">
              <TbTruckDelivery className="w-[18px] h-[18px]" />
              <span className="text-[15px] font-medium leading-normal capitalize pl-2">
                shipping same date
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketingPage;
