import React, { useEffect, useState } from "react";
import logo from "../../assets/GrozziieLogo.png";
import {
  IoIosCheckmarkCircleOutline,
  IoIosCloseCircleOutline,
} from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const plans = [
  {
    name: "Basic",
    amount: 0.1,
    duration: "01 Month",
    facilities: [
      "Facility given here",
      "Facility given here",
      "Facility given here",
      "Facility given here",
      "Facility given here",
    ],
  },
  {
    name: "Standard",
    amount: 0.2,
    duration: "03 Months",
    facilities: [
      "Facility given here",
      "Facility given here",
      "Facility given here",
      "Facility given here",
      "Facility given here",
    ],
  },
  {
    name: "Pro",
    amount: 0.3,
    duration: "06 Months",
    facilities: [
      "Facility given here",
      "Facility given here",
      "Facility given here",
      "Facility given here",
      "Facility given here",
    ],
  },
  {
    name: "Ultimate",
    amount: 0.4,
    duration: "12 Months",
    facilities: [
      "Facility given here",
      "Facility given here",
      "Facility given here",
      "Facility given here",
      "Facility given here",
    ],
  },
];

const planChinese = [
  {
    name: "Basic",
    amount: 0.1,
    duration: "01 个月",
    facilities: [
      "此处提供的设施",
      "此处提供的设施",
      "此处提供的设施",
      "此处提供的设施",
      "此处提供的设施",
    ],
  },
  {
    name: "Standard",
    amount: 0.2,
    duration: "03 个月",
    facilities: [
      "此处提供的设施",
      "此处提供的设施",
      "此处提供的设施",
      "此处提供的设施",
      "此处提供的设施",
    ],
  },
  {
    name: "Pro",
    amount: 0.3,
    duration: "06 个月",
    facilities: [
      "此处提供的设施",
      "此处提供的设施",
      "此处提供的设施",
      "此处提供的设施",
      "此处提供的设施",
    ],
  },
  {
    name: "Ultimate",
    amount: 0.4,
    duration: "12 个月",
    facilities: [
      "此处提供的设施",
      "此处提供的设施",
      "此处提供的设施",
      "此处提供的设施",
      "此处提供的设施",
    ],
  },
];

const Pricing = () => {
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );
  const [activePlan, setActivePlan] = useState(plans[1]);
  const [token, setToken] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  const getPlans = () => {
    return selectedLanguage === "zh-CN" ? planChinese : plans;
  };

  const handleMouseEnter = (plan) => {
    setActivePlan(plan);
  };

  const handleMouseLeave = () => {
    setActivePlan(getPlans()[1]);
  };

  useEffect(() => {
    const token = localStorage.getItem("GrozziieToken");
    setToken(token);
    setActivePlan(getPlans()[1]);
  }, [selectedLanguage]);

  const handleChoosePlan = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleConfirmPlan = async () => {
    if (!selectedPlan || !token) {
      console.error("Selected plan or token is missing.");
      return;
    }
    try {
      const response = await fetch(
        "https://grozziieget.zjweiting.com:3091/Grozziie-Payment/api/dev/payment/tradePay",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            totalAmount: selectedPlan.amount,
            subject: selectedPlan.name,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Trade No:", data.tradeNo);
        window.open(data.redirectUrl, "_blank");
      } else {
        console.error("Failed to make payment:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-[#004368] bg-opacity-5 min-h-screen">
      <div className="pt-[70px] pb-[70px] flex flex-col items-center">
        <div className="flex flex-col items-center mb-14">
          <img
            src={logo}
            alt="Logo"
            className="w-60 h-[60px] object-fit mb-10"
          />
          <h4 className="text-black text-4xl font-semibold capitalize mb-4">
            {selectedLanguage === "zh-CN"
              ? "购买订阅"
              : "Purchase a subscription"}
          </h4>
          <h6 className="text-black text-opacity-60 text-xl">
            {selectedLanguage === "zh-CN"
              ? "选择适合您的计划。"
              : "Choose the plan that works for you."}
          </h6>
        </div>
        <div className="bg-white rounded-2xl grid grid-cols-4 gap-x-5 w-[1268px] h-[523px]">
          {(selectedLanguage === "zh-CN" ? planChinese : plans).map(
            (plan, index) => (
              <div
                key={index}
                className={`flex flex-col items-center py-7 ${
                  activePlan === plan
                    ? "bg-[#004368] shadow-2xl transform translate-y-[-25px] rounded-2xl ring-8 ring-slate-[#004368] ring-opacity-20"
                    : ""
                }`}
                onMouseEnter={() => handleMouseEnter(plan)}
                onMouseLeave={handleMouseLeave}
              >
                <span
                  className={`badge px-5 py-[14px] bg-[#004368] bg-opacity-10 text-lg font-medium text-[#004368] ${
                    activePlan === plan ? "text-white" : ""
                  }`}
                >
                  {plan.name}
                </span>
                <div className="flex items-center my-12">
                  <h1
                    className={`text-[#004368] font-bold text-6xl mr-2 ${
                      activePlan === plan ? "text-white" : ""
                    }`}
                  >
                    ¥{plan.amount}
                    <sub
                      className={`text-black text-sm ${
                        activePlan === plan ? "text-white" : ""
                      }`}
                    >
                      /{plan.duration}
                    </sub>
                  </h1>
                </div>
                <div className="mb-10">
                  {plan.facilities.map((facility, index) => (
                    <p key={index} className="flex items-center gap-x-2 mb-5">
                      <IoIosCheckmarkCircleOutline
                        className={`text-[#004368] text-opacity-80 ${
                          activePlan === plan ? "text-white" : ""
                        }`}
                      />
                      <span
                        className={`text-black font-light text-sm ${
                          activePlan === plan ? "text-white" : ""
                        }`}
                      >
                        {facility}
                      </span>
                    </p>
                  ))}
                </div>
                <div>
                  <button
                    className={`bg-slate-300 text-[#004368] w-[180px] h-10 px-2 py-2 rounded-md cursor-pointer text-center font-medium ${
                      activePlan === plan ? "bg-white font-bold" : ""
                    }`}
                    onClick={() => handleChoosePlan(plan)}
                  >
                    {selectedLanguage === "zh-CN" ? "选择计划" : "Choose Plan"}
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] h-72">
            {/* <div className="flex justify-end">
              <IoIosCloseCircleOutline
                className="text-2xl cursor-pointer"
                onClick={handleCloseModal}
              />
            </div> */}
            <div className="text-center mt-12">
              <h2 className="text-xl font-medium mb-4">
                {selectedLanguage === "zh-CN"
                  ? `您是否要选择此 ${selectedPlan?.name} 计划，您需要支付 ¥${selectedPlan?.amount} 吗？`
                  : `Do you want to choose this ${selectedPlan?.name} plan where you need to pay ¥${selectedPlan?.amount} ?`}
              </h2>
              <div className="flex justify-center space-x-4 mt-10">
                <button
                  className="bg-[#004368] bg-opacity-30 text-black hover:bg-opacity-100 hover:text-white px-4 py-1 rounded h-8"
                  onClick={handleCloseModal}
                >
                  {selectedLanguage === "zh-CN" ? "取消" : "Cancel"}
                </button>
                <button
                  className="bg-[#004368] text-white px-4 py-1 rounded hover:bg-opacity-30 hover:text-black h-8"
                  onClick={handleConfirmPlan}
                >
                  {selectedLanguage === "zh-CN" ? "确认" : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
