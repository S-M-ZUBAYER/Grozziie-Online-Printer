import React, { useEffect, useRef, useState } from "react";
import { DateRange } from "react-date-range";
import { MdDateRange } from "react-icons/md";
import { addDays, format } from "date-fns";

const orderTypes = ["Homer", "Marge", "Bart", "Lisa", "Maggie"];

const customersData = [
  {
    id: "659280ed9196c82fbb848983",
    orderSource: "ordersource1",
    buyerNickname: "Petra Mooney",
    orderNumber: "Ac0011",
    printTemplate: "C Mark-D2THHT789",
    trackingNumber: "D company-1254",
    quantity: 10,
    province: "BD",
    shippingTime: "03-01-2024, 10.00am",
  },
  {
    id: "659280ed9196c82fbb848984",
    orderSource: "ordersource2",
    buyerNickname: "Petra Mooney 01",
    orderNumber: "Ac0012",
    printTemplate: "C Mark",
    trackingNumber: "D company",
    quantity: 10,
    province: "BD",
    shippingTime: "03-01-2024, 10.00am",
  },
  {
    id: "659280ed9196c82fbb848985",
    orderSource: "ordersource3",
    buyerNickname: "Petra Mooney 02",
    orderNumber: "Ac0013",
    printTemplate: "D Mark",
    trackingNumber: "E company",
    quantity: 11,
    province: "CD",
    shippingTime: "03-02-2024, 11.00am",
  },
];

const DeliveryRecord = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);

  //Calculate all buyer
  const countUniqueBuyerNicknames = (customersData) => {
    // Initialize an empty object to store unique buyerNicknames
    const uniqueBuyerNicknames = {};

    // Iterate through the array
    customersData.forEach((item) => {
      // Check if the buyerNickname already exists in the object
      if (uniqueBuyerNicknames[item.buyerNickname]) {
        // If it exists, increment the count
        uniqueBuyerNicknames[item.buyerNickname]++;
      } else {
        // If it doesn't exist, initialize the count to 1
        uniqueBuyerNicknames[item.buyerNickname] = 1;
      }
    });

    // Return the object containing unique buyerNicknames and their counts
    return uniqueBuyerNicknames;
  };

  const sumAllBuyer = (obj) => {
    // Initialize sum
    let sum = 0;

    // Iterate through the object keys
    for (const key in obj) {
      // Add each value to the sum
      sum += 1;
    }

    // Return the sum
    return sum;
  };

  // Call the function to count unique buyerNicknames
  const uniqueBuyerNicknameCounts = countUniqueBuyerNicknames(customersData);

  // Call the function to sum up the counts
  const totalUniqueBuyerNicknames = sumAllBuyer(uniqueBuyerNicknameCounts);

  const [allBuyer, setAllBuyer] = useState(totalUniqueBuyerNicknames);

  const totalQuantity = customersData.reduce((total, customer) => {
    // Add the quantity of the current customer to the total
    return total + customer.quantity;
  }, 0);
  const [quantity, setQuantity] = useState(totalQuantity);
  const [allRecords, setAllRecords] = useState(customersData?.length);

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

  const handleSelect = (date) => {
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
  };


  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };
  // date range functionality end

  // Function to handle the master checkbox change
  const handleMasterCheckboxChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setCheckedItems(customersData);
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
      if (updatedItems.length === customersData.length) {
        setSelectAll(true);
      }
    }
  };
  // details modal functionality
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDetailsClick = (customerData) => {
    setSelectedCustomer(customerData);
    setIsModalOpen(true);
    // document.getElementById("my_modal_2").showModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Close modal if clicked outside the modal
  useEffect(() => {
    const handleClickOutsideModal = (e) => {
      if (e.target.tagName === "DIALOG" && isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener("click", handleClickOutsideModal);

    return () => {
      window.removeEventListener("click", handleClickOutsideModal);
    };
  }, [isModalOpen]);

  return (
    <div className="">
      {/* top section */}
      <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] p-5 h-[204px] w-full">
        <div className="flex items-center">
          <p className="text-black text-opacity-80 text-center text-[10px] font-medium leading-normal capitalize">
            shipping date & time
          </p>
          {/* Date Range */}
          <div className="w-[179px] h-12 ml-1 mr-3">
            <button
              className="inputBox w-full h-full bg-[#0043681A] rounded-md px-1 flex items-center"
              onClick={() => setOpen((open) => !open)}
            >
              <MdDateRange className="w-6 h-6 mr-[2px] text-[#004368]" />
              <input
                value={`${format(startDate, "MM/dd/yyyy")} to ${format(
                  endDate,
                  "MM/dd/yyyy"
                )}`}
                className="h-full w-full border-none outline-none text-black text-opacity-60 font-normal text-xs text-center bg-transparent"
              />
            </button>
            <div ref={refOne} className="">
              {open && (
                // <DateRangePicker
                //   className="flex justify-center calendarElement"
                //   onChange={handleSelect}
                //   editableDateInputs={true}
                //   ranges={[selectionRange]}
                //   months={1}
                //   direction="horizontal"
                //   moveRangeOnFirstSelection={false}
                //   staticRanges={[]}
                //   inputRanges={[]}
                // />

                <DateRange
                  editableDateInputs={true}
                  onChange={handleSelect}
                  moveRangeOnFirstSelection={false}
                  ranges={[selectionRange]}
                  className="bg-white bg-opacity-80 z-50 absolute mt-1 rounded-md"
                />
              )}
            </div>
          </div>
          <div className="mr-[10px]">
            <select
              // onChange={handleOrderTypeChange}
              className="select w-[132px] h-10 rounded-md focus:outline-none text-black text-opacity-60 font-normal text-xs capitalize px-1 py-2 text-center inline-flex items-center bg-[#0043681A]"
            >
              <option disabled selected>
                Order Source
              </option>
              {orderTypes.map((type, index) => (
                <option
                  key={index}
                  value={type}
                  className="text-base font-light"
                >
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="mr-[10px]">
            <select
              // onChange={handleOrderTypeChange}
              className="select w-[128px] h-10 rounded-md focus:outline-none text-black text-opacity-60 font-normal text-xs capitalize px-1 py-2 text-center inline-flex items-center bg-[#0043681A]"
            >
              <option disabled selected>
                all provinces
              </option>
              {orderTypes.map((type, index) => (
                <option
                  key={index}
                  value={type}
                  className="text-base font-light"
                >
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="mr-[10px]">
            <select
              // onChange={handleOrderTypeChange}
              className="select w-[156px] h-10 rounded-md focus:outline-none text-black text-opacity-60 font-normal text-xs capitalize px-2 py-2 text-center inline-flex items-center bg-[#0043681A]"
            >
              <option disabled selected>
                leave a message
              </option>
              {orderTypes.map((type, index) => (
                <option
                  key={index}
                  value={type}
                  className="text-base font-light"
                >
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="mr-[10px]">
            <select
              // onChange={handleOrderTypeChange}
              className="select w-[158px] h-10 rounded-md focus:outline-none text-black text-opacity-60 font-normal text-xs capitalize px-2 py-2 text-center inline-flex items-center bg-[#0043681A]"
            >
              <option disabled selected>
                Recipient address
              </option>
              {orderTypes.map((type, index) => (
                <option
                  key={index}
                  value={type}
                  className="text-base font-light"
                >
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="">
            <select
              // onChange={handleOrderTypeChange}
              className="select w-[137px] h-10 rounded-md focus:outline-none text-black text-opacity-60 font-normal text-xs capitalize px-2 py-2 text-center inline-flex items-center bg-[#0043681A]"
            >
              <option disabled selected>
                print template
              </option>
              {orderTypes.map((type, index) => (
                <option
                  key={index}
                  value={type}
                  className="text-base font-light"
                >
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center mt-[10px]">
          <div className="mr-[10px]">
            <select
              // onChange={handleOrderTypeChange}
              className="select w-[170px] h-10 rounded-md focus:outline-none text-black text-opacity-60 font-normal text-xs capitalize px-1 py-2 text-center inline-flex items-center bg-[#0043681A]"
            >
              <option disabled selected>
                sub-order number
              </option>
              {orderTypes.map((type, index) => (
                <option
                  key={index}
                  value={type}
                  className="text-base font-light"
                >
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mr-[10px]">
            <select
              // onChange={handleOrderTypeChange}
              className="select w-[140px] h-10 rounded-md focus:outline-none text-black text-opacity-60 font-normal text-xs capitalize px-2 py-2 text-center inline-flex items-center bg-[#0043681A]"
            >
              <option disabled selected>
                order number
              </option>
              {orderTypes.map((type, index) => (
                <option
                  key={index}
                  value={type}
                  className="text-base font-light"
                >
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="w-[154px] h-12 outline-none rounded-md cursor-pointer bg-[#0043681A] mr-[10px]">
            <input
              type="text"
              placeholder="Buyer Nickname"
              // onChange={handleSearchAllChange}
              className="h-full w-full text-black text-opacity-60 text-xs font-normal leading-normal pl-3 bg-transparent outline-none"
            />
          </div>

          <div className="w-[155px] h-12 outline-none rounded-md cursor-pointer bg-[#0043681A] mr-[10px]">
            <input
              type="text"
              placeholder="Tracking Number"
              // onChange={handleSearchAllChange}
              className="h-full w-full text-black text-opacity-60 text-xs font-normal leading-normal pl-3 bg-transparent outline-none"
            />
          </div>

          <div className="w-[158px] h-12 outline-none rounded-md cursor-pointer bg-[#0043681A] mr-[10px]">
            <input
              type="text"
              placeholder="Contact Number"
              // onChange={handleSearchAllChange}
              className="h-full w-full text-black text-opacity-60 text-xs font-normal leading-normal pl-3 bg-transparent outline-none"
            />
          </div>

          <div className="w-[108px] h-12 outline-none rounded-md cursor-pointer bg-[#0043681A] mr-[10px]">
            <input
              type="text"
              placeholder="Sender"
              // onChange={handleSearchAllChange}
              className="h-full w-full text-black text-opacity-60 text-xs font-normal leading-normal pl-3 bg-transparent outline-none"
            />
          </div>

          <div className="w-[112px] h-12 outline-none rounded-md cursor-pointer bg-[#0043681A]">
            <input
              type="text"
              placeholder="Recipient"
              // onChange={handleSearchAllChange}
              className="h-full w-full text-black text-opacity-60 text-xs font-normal leading-normal pl-3 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* button */}
        <div className="flex items-center justify-end mt-6">
          <div className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[115px] h-10 px-8 py-2 rounded-md cursor-pointer text-[15px] font-medium capitalize mr-3">
            Export
          </div>
          <button className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[156px] h-10 px-3 py-2 rounded-md cursor-pointer text-[15px] font-medium capitalize">
            Export Settings
          </button>
        </div>
      </div>

      {/* bottom section */}
      <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] mt-6 h-[615px] w-full">
        <div className="text-black text-[10px] font-normal leading-normal capitalize pt-4 pl-4 pb-2">
          total <span>{allBuyer}</span> buyers/<span>{quantity}</span> orders/
          <span>{allRecords}</span> records (last 60 days){" "}
          <span>{checkedItems?.length}</span> items selected
        </div>
        <div className="w-full overflow-y-auto max-h-[550px]">
          <table className="table">
            <thead className="bg-[#0043681A] bg-opacity-80 h-11 rounded-[6px]">
              <tr className=" text-black text-opacity-80 capitalize text-center text-xs font-normal leading-normal">
                <th className="sticky top-0 bg-gray-200">
                  <span className="mr-[10px]">order source</span>
                  <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                </th>
                <th className="sticky top-0 bg-gray-200">
                  <span className="mr-[10px]">buyer nickname</span>
                  <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                </th>
                <th className="sticky top-0 bg-gray-200">
                  <span className="mr-[10px]">order number</span>
                  <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                </th>
                <th className="sticky top-0 bg-gray-200">
                  <span className="mr-[10px]">print template </span>
                  <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                </th>
                <th className="sticky top-0 bg-gray-200">
                  <span className="mr-[10px]">tracking number</span>
                  <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                </th>
                <th className="sticky top-0 bg-gray-200">
                  <span className="mr-[10px]">quantity</span>
                  <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                </th>
                <th className="sticky top-0 bg-gray-200">
                  <span className="mr-[10px]">province</span>
                  <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                </th>
                <th className="sticky top-0 bg-gray-200">
                  <span className="mr-[10px]">shipping time</span>
                  <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                </th>
                <th className="sticky top-0 bg-gray-200">Details</th>
              </tr>
            </thead>
            <tbody className="">
              {customersData?.map((customerData) => (
                <tr
                  className={`capitalize hover:bg-[#0043681A]`}
                  key={customerData.id}
                >
                  <td className="flex items-center justify-center cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded-[2px] text-black text-opacity-60 bg-[#004368] cursor-pointer"
                      name="product"
                      value={customerData.id}
                      // checked={checkedItems.includes(customerData.id)}

                      checked={checkedItems.some(
                        (item) => item?.id === customerData?.id
                      )}
                      onChange={() => handleCheckboxChange(customerData)}

                    // checked={selectedItems.includes(product.id)}
                    // onChange={() => handleCheckboxChange(product.id)}
                    // onClick={() => handleProductCheck(product)}
                    />
                    <p className="ml-[7px] text-black text-opacity-80 text-xs font-normal leading-normal capitalize">
                      {customerData.orderSource}
                    </p>
                  </td>
                  <td className="text-black text-opacity-80 text-xs font-normal leading-normal capitalize">
                    {customerData.buyerNickname}
                  </td>
                  <td className="text-black text-opacity-80 text-xs font-normal leading-normal capitalize">
                    {customerData.orderNumber}
                  </td>
                  <td className="text-black text-opacity-80 text-xs font-normal leading-normal capitalize">
                    {customerData.printTemplate}
                  </td>
                  <td className="text-black text-opacity-80 text-xs font-normal leading-normal capitalize">
                    {customerData.trackingNumber}
                  </td>
                  <td className="text-black text-opacity-80 text-xs font-normal leading-normal capitalize">
                    {customerData.quantity}
                  </td>
                  <td className="text-black text-opacity-80 text-xs font-normal leading-normal capitalize">
                    {customerData.province}
                  </td>
                  <td className="text-black text-opacity-80 text-xs font-normal leading-normal capitalize">
                    {customerData.shippingTime}
                  </td>
                  <td className="flex items-center cursor-pointer">
                    <p
                      className="text-[#004368] text-xs font-normal leading-normal capitalize"
                      onClick={() => handleDetailsClick(customerData)}
                    >
                      Details
                    </p>
                    {selectedCustomer && isModalOpen && (
                      <dialog
                        id="my_modal_2"
                        className="modal"
                        open={isModalOpen}
                      >
                        <div className="">
                          <div className="modal-action w-full text-center flex justify-end pr-10">
                            <div className="card w-[550px] bg-white shadow-md rounded-2xl">
                              <div className="card-body items-center text-start">
                                <h2 className="card-title">
                                  Order Source:
                                  <span className="font-extrabold text-[#004368] text-3xl">
                                    {selectedCustomer.orderSource}
                                  </span>
                                </h2>
                                <p className="text-sm font-light">
                                  Buyer Nickname:
                                  <span className="ml-1 text-base font-medium text-[#004368]">
                                    {selectedCustomer.buyerNickname}
                                  </span>
                                </p>
                                <p className="text-sm font-light">
                                  Order Number:
                                  <span className="ml-1 text-base font-medium text-[#004368]">
                                    {selectedCustomer.orderNumber}
                                  </span>
                                </p>
                                <p className="text-sm font-light">
                                  Print Template:
                                  <span className="ml-1 text-base font-medium text-[#004368]">
                                    {selectedCustomer.printTemplate}
                                  </span>
                                </p>
                                <p className="text-sm font-light">
                                  Tracking Number:
                                  <span className="ml-1 text-base font-medium text-[#004368]">
                                    {selectedCustomer.trackingNumber}
                                  </span>
                                </p>
                                <p className="text-sm font-light">
                                  Quantity:
                                  <span className="ml-1 text-base font-medium text-[#004368]">
                                    {selectedCustomer.quantity} pieces
                                  </span>
                                </p>
                                <p className="text-sm font-light">
                                  Province:
                                  <span className="ml-1 text-base font-medium text-[#004368]">
                                    {selectedCustomer.province}
                                  </span>
                                </p>
                                <p className="text-sm font-light">
                                  Shipping Time:
                                  <span className="ml-1 text-base font-medium text-[#004368]">
                                    {selectedCustomer.shippingTime}
                                  </span>
                                </p>

                                <p
                                  className="bg-[#004368] bg-opacity-30 hover:bg-[#004368] text-black hover:text-white w-[100px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mt-5"
                                  onClick={closeModal}
                                >
                                  Close
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </dialog>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryRecord;
