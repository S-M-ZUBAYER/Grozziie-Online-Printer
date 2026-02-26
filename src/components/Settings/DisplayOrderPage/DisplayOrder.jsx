import React, { useState } from "react";

const DisplayOrder = () => {
  const [selectedItems, setSelectedItems] = useState({});

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [name]: checked,
    }));
  };

  const isItemSelected = (item) => selectedItems[item];

  return (
    <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] px-9 pt-6 col-span-8 max-h-[782px] pb-6">
      <div>
        <p>
          <span className="text-[#004368] text-xl leading-normal font-semibold capitalize mr-2">
            display order
          </span>
          <span className="text-[#004368] text-[15px] leading-normal font-light capitalize mr-2">
            (please select the appropriate rules for show to the “batch print”
            interface)
          </span>
        </p>
      </div>
      <div className="mt-4">
        <ul>
          {["recipientName1", "recipientName2", "recipientName3"].map(
            (item, index) => (
              <li key={index} className="mb-8 flex items-center">
                <input
                  type="checkbox"
                  id={item}
                  name={item}
                  value={item}
                  checked={isItemSelected(item)}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 rounded-[2px] checkbox [--chkbg:theme(colors.blue.900)] cursor-pointer"
                />
                <span
                  className={`ml-3 text-center text-[15px] leading-normal ${
                    isItemSelected(item)
                      ? "text-[#004368] font-semibold"
                      : "text-black font-light"
                  }`}
                >
                  Recipient Name
                </span>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default DisplayOrder;
