import React from "react";
import { RiEditBoxLine } from "react-icons/ri";
import TP874 from "../../../../assets/TP874.jpg";
import { BsExclamationCircle, BsPrinter } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { printerModel } from "../../../../Share/Data/ClientData";

const ShopBatchPrint = () => {
  return (
    <div className="mx-3">
      <div className="overflow-x-auto">
        <table className="table">
          <caption className="mt-1 font-semibold text-[#004368]">
            Warehouse
          </caption>
          {/* head */}
          {/* <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Name</th>
              <th>Job</th>
              <th>Favorite Color</th>
              <th></th>
            </tr>
          </thead> */}
          <tbody>
            {/* row 1 */}
            <tr>
              {/* checkbox field */}
              <td>
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded-[2px] text-black text-opacity-60 bg-[#004368] cursor-pointer"
                  name="product"
                />
              </td>
              <td>A***</td>
              <td>1</td>
              <td>Name1</td>
              <td className="flex items-center justify-evenly">
                <div>
                  <div className="">Warehouse Name</div>
                  <div className="">Shanghai, China</div>
                </div>
                <RiEditBoxLine className="text-[#004368] text-opacity-40" />
              </td>
              <td>
                <div>
                  <div className="">24-04-2024</div>
                  <div className="">01:45:25</div>
                </div>
              </td>
              <td>
                <span>150.08</span>Y
              </td>
              <td>
                <div className="flex items-center justify-center gap-3">
                  <img src={TP874} alt="productImage" className="w-12 h-8" />

                  <div>
                    <div className="">TP874</div>
                    <div className="">*1</div>
                  </div>
                </div>
              </td>
              <td>
                <button className="btn btn-ghost btn-xs text-[#004368]">
                  Details
                </button>
              </td>
            </tr>
            {/* row 2 */}
            <tr>
              {/* checkbox field */}
              <td>
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded-[2px] text-black text-opacity-60 bg-[#004368] cursor-pointer"
                  name="product"
                />
              </td>
              <td>A***</td>
              <td>1</td>
              <td>Name1</td>
              <td className="flex items-center justify-evenly">
                <div>
                  <div className="">Warehouse Name</div>
                  <div className="">Shanghai, China</div>
                </div>
                <RiEditBoxLine className="text-[#004368] text-opacity-40" />
              </td>
              <td>
                <div>
                  <div className="">24-04-2024</div>
                  <div className="">01:45:25</div>
                </div>
              </td>
              <td>
                <span>150.08</span>Y
              </td>
              <td>
                <div className="flex items-center justify-center gap-3">
                  <img src={TP874} alt="productImage" className="w-12 h-8" />

                  <div>
                    <div className="">TP874</div>
                    <div className="">*1</div>
                  </div>
                </div>
              </td>
              <td>
                <button className="btn btn-ghost btn-xs text-[#004368]">
                  Details
                </button>
              </td>
            </tr>
            {/* row 3 */}
            <tr>
              {/* checkbox field */}
              <td>
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded-[2px] text-black text-opacity-60 bg-[#004368] cursor-pointer"
                  name="product"
                />
              </td>
              <td>A***</td>
              <td>1</td>
              <td>Name1</td>
              <td className="flex items-center justify-evenly">
                <div>
                  <div className="">Warehouse Name</div>
                  <div className="">Shanghai, China</div>
                </div>
                <RiEditBoxLine className="text-[#004368] text-opacity-40" />
              </td>
              <td>
                <div>
                  <div className="">24-04-2024</div>
                  <div className="">01:45:25</div>
                </div>
              </td>
              <td>
                <span>150.08</span>Y
              </td>
              <td>
                <div className="flex items-center justify-center gap-3">
                  <img src={TP874} alt="productImage" className="w-12 h-8" />

                  <div>
                    <div className="">TP874</div>
                    <div className="">*1</div>
                  </div>
                </div>
              </td>
              <td>
                <button className="btn btn-ghost btn-xs text-[#004368]">
                  Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center space-x-2 mt-10">
        {/* reminder Modal */}
        <div className="flex items-center justify-center">
          <div>
            <div
              className="bg-[#004368] bg-opacity-[0.10] rounded-md cursor-pointer text-[#004368] mr-5 hover:bg-[#004368] hover:text-white px-2 py-2 w-28 text-center font-semibold"
              onClick={() =>
                document.getElementById("my_modal_reminder").showModal()
              }
            >
              Print
            </div>
            <dialog id="my_modal_reminder" className="modal">
              <div className="bg-white w-[400px] h-[270px] rounded-md">
                <h3 className="font-medium text-lg bg-[#004368] bg-opacity-10 text-center py-2">
                  Reminder
                </h3>
                <div className="modal-action w-full text-center flex justify-center">
                  <div method="dialog">
                    <div className="flex flex-col items-center justify-center">
                      <BsExclamationCircle className="w-10 h-10 mb-4 text-red-300" />
                      <p className="text-sm font-normal space-y-2">
                        This Order is Already Printed.
                      </p>
                      <h4 className="text-lg font-semibold">
                        Do You Want To Print Again?
                      </h4>
                    </div>
                    <div className="flex items-center justify-center space-x-5">
                      <p
                        className="bg-[#004368] bg-opacity-30 hover:bg-[#004368] text-black hover:text-white w-[120px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mt-5"
                        onClick={() =>
                          document.getElementById("my_modal_reminder").close()
                        }
                      >
                        Cancel
                      </p>
                      <button
                        className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[120px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mr-3 mt-5"
                        type="submit"
                      >
                        Print
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </dialog>
          </div>
        </div>

        {/* Manual Create Order */}
        <div className="">
          <div>
            <div
              className="bg-[#004368] bg-opacity-[0.10] rounded-md cursor-pointer text-[#004368] mr-5 hover:bg-[#004368] hover:text-white px-2 py-2 w-56 text-center font-semibold"
              onClick={() =>
                document
                  .getElementById("my_modal_manualCreateOrder")
                  .showModal()
              }
            >
              Manually Create Order
            </div>
            <dialog id="my_modal_manualCreateOrder" className="modal">
              <div className="bg-white w-[1000px] h-[550px] rounded-2xl">
                <h3 className="font-semibold text-base bg-[#004368] text-[#004368] bg-opacity-10 py-2 pl-7">
                  Manually Create Order
                </h3>
                <div className="w-full">
                  <div method="dialog">
                    <div className="ml-16 mt-14">
                      <div className="mb-14">
                        <div className="flex">
                          <div className="mr-6">
                            <button className="bg-[#004368] bg-opacity-30 hover:bg-[#004368] text-black hover:text-white w-[220px] h-12 px-2 py-2 rounded-md cursor-pointer text-center font-semibold">
                              Universal Import
                            </button>
                          </div>
                          <div>
                            <button
                              className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[235px] h-12 px-2 py-2 rounded-md cursor-pointer text-center flex items-center justify-center"
                              type="submit"
                            >
                              <FaPlus className="mr-2" />
                              <span>Add Custom Template</span>
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 flex space-x-3">
                          <p className="text-xs font-light leading-none">
                            Simplified
                          </p>
                          <p className="text-xs font-light leading-none">
                            Traditional
                          </p>
                          <p className="text-xs font-light leading-none">
                            International
                          </p>
                        </div>
                      </div>
                      <div className="mb-14">
                        <h4 className="mb-3 text-[#004368] font-semibold">
                          Download The General Template :
                        </h4>
                        <div className="flex space-x-3 ml-2">
                          <button className="bg-[#004368] bg-opacity-30 hover:bg-[#004368] text-black hover:text-white w-[300px] h-10 px-2 py-2 rounded-md cursor-pointer text-center font-normal text-sm">
                            Ordinary Import Template(Simplified)
                          </button>
                          <button className="bg-[#004368] bg-opacity-30 hover:bg-[#004368] text-black hover:text-white w-[230px] h-10 px-2 py-2 rounded-md cursor-pointer text-center font-normal text-sm">
                            Ordinary Import Template
                          </button>
                          <button className="bg-[#004368] bg-opacity-30 hover:bg-[#004368] text-black hover:text-white w-[250px] h-10 px-2 py-2 rounded-md cursor-pointer text-center font-normal text-sm">
                            Import Template With Sender
                          </button>
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-3 text-[#004368] font-semibold">
                          Select File :
                        </h4>
                        <div className="ml-2">
                          <input
                            type="file"
                            placeholder="Select A Document"
                            className="bg-[#004368] bg-opacity-30 text-black w-[300px] h-12 px-2 py-2 rounded-md cursor-pointer text-center"
                          />
                        </div>
                      </div>
                    </div>
                    {/* button */}
                    <div className="flex items-end justify-end space-x-5 pr-10">
                      <button
                        className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[120px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mr-3 mt-5"
                        type="submit"
                      >
                        Import
                      </button>
                      <p
                        className="bg-[#004368] bg-opacity-30 hover:bg-[#004368] text-black hover:text-white w-[120px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mt-5"
                        onClick={() =>
                          document
                            .getElementById("my_modal_manualCreateOrder")
                            .close()
                        }
                      >
                        Cancel
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </dialog>
          </div>
        </div>

        {/* Printer Selection */}
        <div className="">
          <div>
            <div
              className="bg-[#004368] bg-opacity-[0.10] rounded-md cursor-pointer text-[#004368] mr-5 hover:bg-[#004368] hover:text-white px-2 py-2 w-56 text-center font-semibold"
              onClick={() =>
                document.getElementById("my_modal_printerSelection").showModal()
              }
            >
              Printer Selection
            </div>
            <dialog id="my_modal_printerSelection" className="modal">
              <div className="bg-white w-[1000px] h-[550px] rounded-2xl">
                <h3 className="font-semibold text-base bg-[#004368] text-[#004368] bg-opacity-10 py-2 pl-7">
                  Printer Selection
                </h3>
                <div className="w-full">
                  <div method="dialog">
                    <div className="ml-28 mt-14 mb-36">
                      <div className="mb-10">
                        <div className="mb-3 flex items-center">
                          <BsPrinter className="text-[#004368] mr-2 size-5" />
                          <h4 className="text-[#004368] font-semibold">
                            Select Printer
                          </h4>
                        </div>
                        <div className="">
                          <select
                            // onClick={handleRecipientAddressChange}
                            className="select w-[800px] h-10 rounded outline-none text-[#00000099] font-normal text-[15px] capitalize px-[15px] py-2 inline-flex items-center bg-[#0043681A]"
                          >
                            <option disabled selected>
                              Printer Model
                            </option>
                            {printerModel.map((printer, index) => (
                              <option
                                key={index}
                                value={printer}
                                className="text-base font-light"
                              >
                                {printer}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center mb-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-[2px] text-black text-opacity-60 bg-[#004368] cursor-pointer"
                            name="product"
                          />
                          <p className="ml-2 text-black text-opacity-60 text-sm">
                            Print 2 Copies (Print 2 Copies Of The Same Express
                            Delivery Number)
                          </p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-[2px] text-black text-opacity-60 bg-[#004368] cursor-pointer"
                            name="product"
                          />
                          <p className="ml-2 text-black text-opacity-60 text-sm">
                            Screening Order
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* button */}
                    <div className="flex items-end justify-end space-x-5 pr-10">
                      <button
                        className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[120px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mr-3 mt-5"
                        type="submit"
                      >
                        Print
                      </button>
                      <p
                        className="bg-[#004368] bg-opacity-30 hover:bg-[#004368] text-black hover:text-white w-[120px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mt-5"
                        onClick={() =>
                          document
                            .getElementById("my_modal_printerSelection")
                            .close()
                        }
                      >
                        Cancel
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopBatchPrint;
