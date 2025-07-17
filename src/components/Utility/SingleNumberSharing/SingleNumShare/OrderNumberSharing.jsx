import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";

const singleNumberAccounts = ["Homer", "Marge", "Bart", "Lisa", "Maggie"];
const tableDatas = [
  // {
  //   id: 1,
  //   otherPartysorderAccount: "ABC101",
  //   courierCompany: "PinDodo",
  //   outletShippingAddress: "China",
  //   singleNumberAccount: "1254698",
  //   currentOrderNumberBalance: "1254",
  //   october: "125",
  //   november: "254",
  //   December: "897",
  //   remark: "Test",
  //   state: "XIAN",
  //   creationTime: "12.50 P.M.",
  //   operate: "Check",
  // },
  // {
  //   id: 2,
  //   otherPartysorderAccount: "ABC101",
  //   courierCompany: "PinDodo",
  //   outletShippingAddress: "China",
  //   singleNumberAccount: "1254698",
  //   currentOrderNumberBalance: "1254",
  //   october: "125",
  //   november: "254",
  //   December: "897",
  //   remark: "Test",
  //   state: "XIAN",
  //   creationTime: "12.50 P.M.",
  //   operate: "Check",
  // },
];

const OrderNumberSharing = () => {
  const [singleNumberAccount, setSingleNumberAccount] = useState("");
  const [modalInput, setModalInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSingleNumberAccounts = (event) => {
    setSingleNumberAccount(event.target.value);
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

  // modal submit function
  const handleModalSubmit = (e) => {
    e.preventDefault();
    setModalInput("");
    document.getElementById("my_modal_1").close();
  };

  return (
    <div className="">
      <div className="mt-11 ml-9">
        <p className="text-black text-xs font-normal leading-normal capitalize mb-4">
          Instructions for using single number sharing:
        </p>
        <ul className="ml-4 mr-5">
          <li className="text-black text-opacity-60 text-[10px] font-normal leading-[18px] capitalize inline-block">
            1. The sharer (express delivery/cloud warehouse/merchant, etc.) does
            not need to associate the store of the person being shared
            (merchant), and can assign the order number to the store of the
            person being shared for use.
          </li>
          <li className="text-black text-opacity-60 text-[10px] font-normal leading-[18px] capitalize inline-block">
            2. The sharer can add/deduct the order number of the person being
            shared, or share without limit on the order number, and both parties
            will reconcile the details of the actual order number used;
          </li>
          <li className="text-black text-opacity-60 text-[10px] font-normal leading-[18px] capitalize inline-block">
            3. Before adding a new share, please go to the [Payment Order
            Account] page to authorize the electronic receipt;
          </li>
        </ul>
      </div>
      <div className="mt-8 mx-5 flex items-center">
        <p className="text-black text-xs font-semibold leading-normal capitalize mr-1">
          Creation Time
        </p>
        <div className="w-[130px] h-12 bg-[#0043681A] bg-opacity-10 rounded-md mx-1">
          <input
            type="date"
            className="bg-transparent w-full h-full py-[8px] px-[2px] text-[13px] flex items-center text-[#00000099] outline-none"
            placeholder="Select Time"
          />
        </div>

        <div className="mx-1">
          <select
            onClick={handleSingleNumberAccounts}
            className="select w-[170px] h-6 rounded-md outline-none text-[#00000099] font-normal text-[11px] capitalize text-center inline-flex items-center bg-[#0043681A]"
          >
            <option disabled selected>
              all single number account
            </option>
            {singleNumberAccounts.map((address, index) => (
              <option
                key={index}
                value={address}
                className="text-xs font-light"
              >
                {address}
              </option>
            ))}
          </select>
        </div>

        <div className="mx-1">
          <select
            onClick={handleSingleNumberAccounts}
            className="select w-[92px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[11px] capitalize text-center inline-flex items-center bg-[#0043681A]"
          >
            <option disabled selected>
              all status
            </option>
            {singleNumberAccounts.map((address, index) => (
              <option
                key={index}
                value={address}
                className="text-xs font-light"
              >
                {address}
              </option>
            ))}
          </select>
        </div>

        <div className="mx-1">
          <select
            onClick={handleSingleNumberAccounts}
            className="select w-[144px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[11px] capitalize text-center inline-flex items-center bg-[#0043681A]"
          >
            <option disabled selected>
              all courier companies
            </option>
            {singleNumberAccounts.map((address, index) => (
              <option
                key={index}
                value={address}
                className="text-xs font-light"
              >
                {address}
              </option>
            ))}
          </select>
        </div>

        <div className="mx-1">
          <select
            onClick={handleSingleNumberAccounts}
            className="select w-[145px] h-10 rounded-md outline-none text-[#00000099] font-normal text-[11px] capitalize text-center inline-flex items-center bg-[#0043681A]"
          >
            <option disabled selected>
              Easy to order account
            </option>
            {singleNumberAccounts.map((address, index) => (
              <option
                key={index}
                value={address}
                className="text-xs font-light"
              >
                {address}
              </option>
            ))}
          </select>
        </div>

        <div className="w-[72px] h-12 outline-none rounded-md cursor-pointer bg-[#0043681A] mx-2">
          <input
            type="text"
            placeholder="Remark"
            // onChange={handleSearchAllChange}
            className="h-full w-full text-black text-opacity-60 text-[11px] font-normal leading-normal pl-3 bg-transparent outline-none"
          />
        </div>

        <div className="w-[154px] h-12 outline-none rounded-md text-[#00000099] font-normal text-[11px] text-center flex justify-between items-center cursor-pointer">
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
      </div>

      {/* add new sharing with modal*/}
      <div className="my-5 mr-5 flex items-center justify-end">
        <div
          className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[229px] h-10 px-8 py-2 rounded-md cursor-pointer text-center col-span-1"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
          <button className="text-[15px] font-medium capitalize flex items-center justify-evenly">
            <FaPlus className="w-[14px] h-[14px]" />
            <span className="pl-4 text-sm font-medium capitalize">
              add new sharing
            </span>
          </button>
        </div>
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

      {/* bottom section table */}
      <div className="w-full overflow-x-auto">
        <table className="table">
          <thead className="bg-[#0043681A] opacity-80 h-11 rounded-[6px]">
            <tr className=" text-black capitalize text-center text-[10px] font-normal leading-tight">
              <th className="sticky top-0 bg-gray-200">
                <span className="">
                  the other party's easy to <br /> order account
                </span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white"></div>
              </th>
              <th className="sticky top-0 bg-gray-200">
                <span className="">courier company</span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white"></div>
              </th>
              <th className="sticky top-0 bg-gray-200">
                <span className="">outlet shipping address</span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white"></div>
              </th>
              <th className="sticky top-0 bg-gray-200">
                <span className="">single number account</span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white"></div>
              </th>
              <th className="sticky top-0 bg-gray-200">
                <span className="">
                  current order number <br /> balance
                </span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white"></div>
              </th>
              <th className="sticky top-0 bg-gray-200">
                <span className="">october</span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white"></div>
              </th>
              <th className="sticky top-0 bg-gray-200">
                <span className="">november</span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white"></div>
              </th>
              <th className="sticky top-0 bg-gray-200">
                <span className="">December</span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white"></div>
              </th>
              <th className="sticky top-0 bg-gray-200">
                <span className="">remark</span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white"></div>
              </th>
              <th className="sticky top-0 bg-gray-200">
                <span className="">state</span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white"></div>
              </th>
              <th className="sticky top-0 bg-gray-200">
                <span className="">creation time</span>
                <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white"></div>
              </th>
              <th className="sticky top-0 bg-gray-200">operate</th>
            </tr>
          </thead>
          <tbody>
            {tableDatas && tableDatas.length > 0 ? (
              tableDatas?.map((data) => (
                <tr
                  className={`capitalize hover:bg-[#0043681A] cursor-pointer text-black text-xs text-center font-normal`}
                  key={data.id}
                >
                  <td>{data.otherPartysorderAccount}</td>
                  <td>{data.courierCompany}</td>
                  <td>{data.outletShippingAddress}</td>
                  <td>{data.singleNumberAccount}</td>
                  <td>{data.currentOrderNumberBalance}</td>
                  <td>{data.october}</td>
                  <td>{data.november}</td>
                  <td>{data.December}</td>
                  <td>{data.remark}</td>
                  <td>{data.state}</td>
                  <td>{data.creationTime}</td>
                  <td>{data.operate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="">
                  <div className="flex items-center justify-center mt-28 mb-20">
                    <div>
                      <svg
                        width="196"
                        height="152"
                        viewBox="0 0 166 132"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.2"
                          d="M164.719 115.859H51.1114C50.4035 115.859 49.8301 115.289 49.8301 114.585V42.2988C49.8301 41.6299 50.3522 41.0725 51.0249 41.0279L164.635 33.2746C165.375 33.2236 166.003 33.8066 166.003 34.5456V114.585C166 115.289 165.427 115.859 164.719 115.859Z"
                          fill="#004368"
                        />
                        <path
                          d="M161.656 113.633H54.1737C53.5042 113.633 52.9629 113.094 52.9629 112.429V44.0381C52.9629 43.4042 53.4562 42.8786 54.0936 42.834L161.576 35.498C162.278 35.4502 162.87 36.0013 162.87 36.7021V112.426C162.867 113.091 162.326 113.633 161.656 113.633Z"
                          fill="white"
                        />
                        <path
                          d="M51.1114 115.86L0 129.732H143.314C143.439 129.732 143.561 129.697 143.667 129.627L164.719 115.856H51.1114V115.86Z"
                          fill="#EBF9FF"
                        />
                        <path
                          d="M0 129.732L4.68959 131.806C4.97789 131.933 5.2854 131.997 5.59932 131.997H143.1C143.548 131.997 143.99 131.863 144.362 131.611L163.738 118.504C164.354 118.089 164.719 117.398 164.719 116.659V115.856L143.667 129.627C143.561 129.694 143.439 129.732 143.314 129.732H0Z"
                          fill="#C3D8E2"
                        />
                        <path
                          opacity="0.1"
                          d="M51.4414 117.376L38.4041 121.552C37.709 121.775 37.8691 122.794 38.5995 122.794H146.101C146.22 122.794 146.338 122.762 146.441 122.698L153.203 118.522C153.751 118.185 153.51 117.344 152.863 117.344H51.6368C51.5695 117.347 51.5055 117.356 51.4414 117.376Z"
                          fill="black"
                        />
                        <path
                          opacity="0.1"
                          d="M70.7282 123.6H87.6895C87.9682 123.6 88.1123 123.928 87.9265 124.132L83.8776 128.592C83.8167 128.659 83.7302 128.697 83.6406 128.697H65.2474C64.9463 128.697 64.8117 128.321 65.0456 128.133L70.5264 123.673C70.584 123.626 70.6545 123.6 70.7282 123.6Z"
                          fill="black"
                        />
                        <path
                          opacity="0.2"
                          d="M159.862 109.578H57.2744V96.0558L159.862 92.8735V109.578Z"
                          fill="#004368"
                        />
                        <path
                          opacity="0.2"
                          d="M57.2744 92.8735L97.7894 91.456V44.1719L57.2744 46.9559V92.8735Z"
                          fill="#004368"
                        />
                        <path
                          opacity="0.2"
                          d="M100.922 44.1717L157.87 39.9224V48.9848L100.922 52.3805V44.1717Z"
                          fill="#004368"
                        />
                        <path
                          opacity="0.2"
                          d="M100.922 54.6484L135.088 52.3804V59.4615L100.922 60.8758V54.6484Z"
                          fill="#004368"
                        />
                        <path
                          opacity="0.2"
                          d="M100.922 65.1223L157.87 61.9751V88.9077L100.922 91.456V65.1223Z"
                          fill="#004368"
                        />
                        <path
                          d="M132.526 111.276H82.3594V2.83183L132.526 0V111.276Z"
                          fill="#1C7186"
                        />
                        <path
                          opacity="0.2"
                          d="M132.526 0L133.285 2.83183V109.578L132.526 111.276V0Z"
                          fill="#004368"
                        />
                        <path
                          opacity="0.67"
                          d="M83.5542 5.09647L130.441 2.26465L131.2 109.482H83.5542V5.09647Z"
                          fill="white"
                        />
                        <path
                          opacity="0.67"
                          d="M85.7356 8.96689L128.637 5.85156V11.3273L85.7356 13.968V8.96689Z"
                          fill="white"
                        />
                        <path
                          opacity="0.67"
                          d="M85.7356 17.1787L109.654 15.5732V51.992L85.7356 53.6739V17.1787Z"
                          fill="white"
                        />
                        <path
                          opacity="0.67"
                          d="M112.169 15.5732L128.637 14.5825V50.7273L112.169 51.7116V15.5732Z"
                          fill="white"
                        />
                        <path
                          opacity="0.67"
                          d="M85.7356 55.8754L128.637 52.811V59.7297L85.7356 61.9754V55.8754Z"
                          fill="white"
                        />
                        <path
                          opacity="0.67"
                          d="M85.7356 64.5585L128.637 61.9751V65.6893L85.7356 68.5211V64.5585Z"
                          fill="white"
                        />
                        <path
                          opacity="0.67"
                          d="M85.7356 70.2192V108.352H97.7895L97.6934 69.2764L85.7356 70.2192Z"
                          fill="white"
                        />
                        <path
                          opacity="0.67"
                          d="M100.922 69.2759V108.351H112.169V68.521L100.922 69.2759Z"
                          fill="white"
                        />
                        <path
                          opacity="0.67"
                          d="M115.443 68.521L128.637 67.5781V108.351H115.443V68.521Z"
                          fill="white"
                        />
                      </svg>
                      <p className="mt-5 text-xl font-semibold">
                        No Data found
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderNumberSharing;
