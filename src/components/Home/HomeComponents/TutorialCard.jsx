import React from "react";

const TutorialCard = ({ icon: Icon, label }) => (
  <div className="flex items-center px-9 gap-6">
    <span className="bg-[#0043681A] w-[74px] h-[74px] flex justify-center items-center rounded-[17px]">
      <Icon className="w-8 h-8 text-[#004368]" />
    </span>
    <p className="text-black text-[17px] font-[500] capitalize opacity-[0.8]">
      {label}
    </p>
  </div>
);

export default TutorialCard;
