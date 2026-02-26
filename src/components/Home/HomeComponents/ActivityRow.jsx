import React from "react";

const ActivityRow = ({ icon: Icon, label, value }) => (
  <>
    <div className="flex items-center justify-between px-[66px] pb-[15px]">
      <div className="flex items-center">
        <span className="bg-[#0043681A] w-[44px] h-[44px] flex justify-center items-center rounded-[17px]">
          <Icon className="w-7 h-7 p-1 text-[#004368]" />
        </span>
        <p className="text-black text-[20px] font-[400] capitalize opacity-80 ml-[45px]">
          {label}
        </p>
      </div>
      <div className="text-black opacity-60 text-[25px] font-[600]">
        {value}
      </div>
    </div>
    <div className="mx-9 w-[524px] h-[1px] bg-black bg-opacity-20"></div>
  </>
);

export default ActivityRow;
