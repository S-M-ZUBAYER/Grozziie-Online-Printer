const DashboardCard = ({ title, count, image }) => (
  <div className="w-[298px] h-[154px] rounded-[17px] bg-white mt-4 pt-6 relative shadow-md">
    <div className="bg-[#0043681A] min-w-[124px] max-w-[200px] w-fit h-[25px] ml-[28px] grid grid-rows-2 gap-4 ">
      <p className="text-[#004368] text-center text-[12px] font-[500] capitalize opacity-50 px-4 py-1 whitespace-nowrap">
        {title}
      </p>
      <span className="text-[#004368] text-center text-[63px] font-[600] capitalize">
        {count}
      </span>
    </div>
    <div className="absolute inset-0 flex justify-end items-center px-6">
      <img src={image} alt={title} className="w-[127px] h-[121px] opacity-40" />
    </div>
  </div>
);

export default DashboardCard;
