// import React, { useEffect, useState } from "react";
// import logo from "../../assets/GrozziieLogo.png";
// import {
//   IoIosCheckmarkCircleOutline,
//   IoIosCloseCircleOutline,
// } from "react-icons/io";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const plans = [
//   {
//     name: "Basic",
//     amount: 10,
//     duration: "01 Month",
//     facilities: [
//       "Facility given here",
//       "Facility given here",
//       "Facility given here",
//       "Facility given here",
//       "Facility given here",
//     ],
//   },
//   {
//     name: "Standard",
//     amount: 20,
//     duration: "03 Months",
//     facilities: [
//       "Facility given here",
//       "Facility given here",
//       "Facility given here",
//       "Facility given here",
//       "Facility given here",
//     ],
//   },
//   {
//     name: "Pro",
//     amount: 30,
//     duration: "06 Months",
//     facilities: [
//       "Facility given here",
//       "Facility given here",
//       "Facility given here",
//       "Facility given here",
//       "Facility given here",
//     ],
//   },
//   {
//     name: "Ultimate",
//     amount: 40,
//     duration: "12 Months",
//     facilities: [
//       "Facility given here",
//       "Facility given here",
//       "Facility given here",
//       "Facility given here",
//       "Facility given here",
//     ],
//   },
// ];

// const planChinese = [
//   {
//     name: "Basic",
//     amount: 0.1,
//     duration: "01 个月",
//     facilities: [
//       "此处提供的设施",
//       "此处提供的设施",
//       "此处提供的设施",
//       "此处提供的设施",
//       "此处提供的设施",
//     ],
//   },
//   {
//     name: "Standard",
//     amount: 0.2,
//     duration: "03 个月",
//     facilities: [
//       "此处提供的设施",
//       "此处提供的设施",
//       "此处提供的设施",
//       "此处提供的设施",
//       "此处提供的设施",
//     ],
//   },
//   {
//     name: "Pro",
//     amount: 0.3,
//     duration: "06 个月",
//     facilities: [
//       "此处提供的设施",
//       "此处提供的设施",
//       "此处提供的设施",
//       "此处提供的设施",
//       "此处提供的设施",
//     ],
//   },
//   {
//     name: "Ultimate",
//     amount: 0.4,
//     duration: "12 个月",
//     facilities: [
//       "此处提供的设施",
//       "此处提供的设施",
//       "此处提供的设施",
//       "此处提供的设施",
//       "此处提供的设施",
//     ],
//   },
// ];

// const Pricing = () => {
//   const selectedLanguage = useSelector(
//     (state) => state.user.selectedLanguageRedux
//   );
//   const [activePlan, setActivePlan] = useState(plans[1]);
//   const [token, setToken] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const navigate = useNavigate();

//   const getPlans = () => {
//     return selectedLanguage === "zh-CN" ? planChinese : plans;
//   };

//   const handleMouseEnter = (plan) => {
//     setActivePlan(plan);
//   };

//   const handleMouseLeave = () => {
//     setActivePlan(getPlans()[1]);
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("GrozziieToken");
//     setToken(token);
//     setActivePlan(getPlans()[1]);
//   }, [selectedLanguage]);

//   const handleChoosePlan = (plan) => {
//     setSelectedPlan(plan);
//     setIsModalOpen(false);
//     navigate("/payment", { state: { plan } });
//   };

//   const handleConfirmPlan = async () => {
//     if (!selectedPlan || !token) {
//       console.error("Selected plan or token is missing.");
//       return;
//     }
//     try {
//       const response = await fetch(
//         "https://grozziieget.zjweiting.com:3091/Grozziie-Payment/api/dev/payment/tradePay",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             token: token,
//             totalAmount: selectedPlan.amount,
//             subject: selectedPlan.name,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         console.log("Trade No:", data.tradeNo);
//         window.open(data.redirectUrl, "_blank");
//       } else {
//         console.error("Failed to make payment:", data);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setIsModalOpen(false);
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="bg-[#004368] bg-opacity-5 min-h-screen">
//       <div className="pt-[70px] pb-[70px] flex flex-col items-center">
//         <div className="flex flex-col items-center mb-14">
//           <img
//             src={logo}
//             alt="Logo"
//             className="w-60 h-[60px] object-fit mb-10"
//           />
//           <h4 className="text-black text-4xl font-semibold capitalize mb-4">
//             {selectedLanguage === "zh-CN"
//               ? "购买订阅"
//               : "Purchase a subscription"}
//           </h4>
//           <h6 className="text-black text-opacity-60 text-xl">
//             {selectedLanguage === "zh-CN"
//               ? "选择适合您的计划。"
//               : "Choose the plan that works for you."}
//           </h6>
//         </div>
//         <div className="bg-white rounded-2xl grid grid-cols-4 gap-x-5 w-[1268px] h-[523px]">
//           {(selectedLanguage === "zh-CN" ? planChinese : plans).map(
//             (plan, index) => (
//               <div
//                 key={index}
//                 className={`flex flex-col items-center py-7 ${
//                   activePlan === plan
//                     ? "bg-[#004368] shadow-2xl transform translate-y-[-25px] rounded-2xl ring-8 ring-slate-[#004368] ring-opacity-20"
//                     : ""
//                 }`}
//                 onMouseEnter={() => handleMouseEnter(plan)}
//                 onMouseLeave={handleMouseLeave}
//               >
//                 <span
//                   className={`badge px-5 py-[14px] bg-[#004368] bg-opacity-10 text-lg font-medium text-[#004368] ${
//                     activePlan === plan ? "text-white" : ""
//                   }`}
//                 >
//                   {plan.name}
//                 </span>
//                 <div className="flex items-center my-12">
//                   <h1
//                     className={`text-[#004368] font-bold text-6xl mr-2 ${
//                       activePlan === plan ? "text-white" : ""
//                     }`}
//                   >
//                     ${plan.amount}
//                     <sub
//                       className={`text-black text-sm ${
//                         activePlan === plan ? "text-white" : ""
//                       }`}
//                     >
//                       /{plan.duration}
//                     </sub>
//                   </h1>
//                 </div>
//                 <div className="mb-10">
//                   {plan.facilities.map((facility, index) => (
//                     <p key={index} className="flex items-center gap-x-2 mb-5">
//                       <IoIosCheckmarkCircleOutline
//                         className={`text-[#004368] text-opacity-80 ${
//                           activePlan === plan ? "text-white" : ""
//                         }`}
//                       />
//                       <span
//                         className={`text-black font-light text-sm ${
//                           activePlan === plan ? "text-white" : ""
//                         }`}
//                       >
//                         {facility}
//                       </span>
//                     </p>
//                   ))}
//                 </div>
//                 <div>
//                   <button
//                     className={`bg-slate-300 text-[#004368] w-[180px] h-10 px-2 py-2 rounded-md cursor-pointer text-center font-medium ${
//                       activePlan === plan ? "bg-white font-bold" : ""
//                     }`}
//                     onClick={() => handleChoosePlan(plan)}
//                   >
//                     {selectedLanguage === "zh-CN" ? "选择计划" : "Choose Plan"}
//                   </button>
//                 </div>
//               </div>
//             )
//           )}
//         </div>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] h-72">
//             {/* <div className="flex justify-end">
//               <IoIosCloseCircleOutline
//                 className="text-2xl cursor-pointer"
//                 onClick={handleCloseModal}
//               />
//             </div> */}
//             <div className="text-center mt-12">
//               <h2 className="text-xl font-medium mb-4">
//                 {selectedLanguage === "zh-CN"
//                   ? `您是否要选择此 ${selectedPlan?.name} 计划，您需要支付 ¥${selectedPlan?.amount} 吗？`
//                   : `Do you want to choose this ${selectedPlan?.name} plan where you need to pay ¥${selectedPlan?.amount} ?`}
//               </h2>
//               <div className="flex justify-center space-x-4 mt-10">
//                 <button
//                   className="bg-[#004368] bg-opacity-30 text-black hover:bg-opacity-100 hover:text-white px-4 py-1 rounded h-8"
//                   onClick={handleCloseModal}
//                 >
//                   {selectedLanguage === "zh-CN" ? "取消" : "Cancel"}
//                 </button>
//                 <button
//                   className="bg-[#004368] text-white px-4 py-1 rounded hover:bg-opacity-30 hover:text-black h-8"
//                   onClick={handleConfirmPlan}
//                 >
//                   {selectedLanguage === "zh-CN" ? "确认" : "Confirm"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Pricing;

import React, { useEffect, useState } from "react";
import logo from "../../assets/GrozziieLogo.png";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";
import FadeLoader from "react-spinners/FadeLoader";

const Pricing = () => {
  const { t, i18n } = useTranslation();
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );

  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [token, setToken] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [country, setCountry] = useState("MY"); // default Malaysia
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const storedShopPlatform = localStorage.getItem("SelectedPlatform");

  const navigate = useNavigate();

  // Fetch plans for the selected country
  const fetchPlans = async (countryCode) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:2000/tht/pricing/country/${countryCode}/platform/${storedShopPlatform}`
      );
      const data = await res.json();
      if (res.ok) {
        const storedShopPlans = data?.data?.sort((a, b) => a.amount - b.amount);
        storedShopPlans.forEach((p) => {
          if (typeof p.facilities === "string") {
            try {
              p.facilities = JSON.parse(p.facilities);
            } catch {
              p.facilities = [p.facilities];
            }
          }
        });
        setPlans(storedShopPlans);
        setActivePlan(storedShopPlans.length > 0 ? storedShopPlans[0] : null);
      } else {
        setError(data.message || "Failed to fetch plans");
        setPlans([]);
      }
    } catch (err) {
      setError("Error fetching plans. Please try again later.");
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("GrozziieToken");
    setToken(token);
    fetchPlans(country);
  }, [country, storedShopPlatform]);

  useEffect(() => {
    if (selectedLanguage) {
      i18n.changeLanguage(selectedLanguage);
    }
  }, [selectedLanguage, i18n]);

  const handleMouseEnter = (plan) => setActivePlan(plan);
  const handleMouseLeave = () =>
    setActivePlan(plans.length > 0 ? plans[0] : null);

  const handleChoosePlan = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(false);
    navigate("/payment", { state: { plan } });
  };

  const handleConfirmPlan = async () => {
    if (!selectedPlan || !token) return;
    try {
      const response = await fetch(
        "https://grozziieget.zjweiting.com:3091/Grozziie-Payment/api/dev/payment/tradePay",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
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
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

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
            {t("purchase_subscription")}
          </h4>
          <h6 className="text-black text-opacity-60 text-xl mb-4">
            {t("Selected Shop Platform Country")}
          </h6>

          {/* Country Selection */}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="border border-gray-400 rounded px-3 py-2 mb-4"
          >
            <option value="MY">{t("malaysia")}</option>
            <option value="CN">{t("china")}</option>
            <option value="TH">{t("thailand")}</option>
            <option value="VN">{t("vietnam")}</option>
            <option value="ID">{t("indonesia")}</option>
            <option value="PH">{t("philippines")}</option>
            <option value="GLOBAL">{t("others")}</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <FadeLoader color="#004368" size={25} className="mx-auto mt-10" />
        )}

        {/* Error State */}
        {!loading && error && (
          <p className="text-red-500 font-medium">{error}</p>
        )}

        {/* Empty State */}
        {!loading && !error && plans.length === 0 && (
          <p className="text-[#004368] font-bold text-3xl items-center">
            {t("no_plans_available_for_this_particular_country")}
          </p>
        )}

        {/* Pricing Cards */}
        {!loading && !error && plans.length > 0 && (
          <div className="bg-white rounded-2xl grid grid-cols-4 gap-x-5 w-[1268px] h-[523px]">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`flex flex-col items-center py-7 ${
                  activePlan === plan
                    ? "bg-[#004368] shadow-2xl transform translate-y-[-25px] rounded-2xl ring-8 ring-[#004368] ring-opacity-20"
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
                  {t(`${plan.packageName}`)}
                </span>
                <div className="flex items-center my-12">
                  <h1
                    className={`text-[#004368] font-bold text-3xl mr-2 ${
                      activePlan === plan ? "text-white" : ""
                    }`}
                  >
                    ${plan.amount}
                    <sub
                      className={`text-black text-sm ${
                        activePlan === plan ? "text-white" : ""
                      }`}
                    >
                      /{plan.duration?.split(" ")[0]}{" "}
                      {t(plan.duration?.split(" ")[1])}
                    </sub>
                  </h1>
                </div>
                <div className="mb-10">
                  {plan.facilities.map((facility, i) => (
                    <p key={i} className="flex items-center gap-x-2 mb-5">
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
                    {t("choose_plan")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] h-72">
            <div className="text-center mt-12">
              <h2 className="text-xl font-medium mb-4">
                {t("confirm_plan", {
                  plan: selectedPlan?.packageName,
                  amount: selectedPlan?.amount,
                })}
              </h2>
              <div className="flex justify-center space-x-4 mt-10">
                <button
                  className="bg-[#004368] bg-opacity-30 text-black hover:bg-opacity-100 hover:text-white px-4 py-1 rounded h-8"
                  onClick={handleCloseModal}
                >
                  {t("cancel")}
                </button>
                <button
                  className="bg-[#004368] text-white px-4 py-1 rounded hover:bg-opacity-30 hover:text-black h-8"
                  onClick={handleConfirmPlan}
                >
                  {t("confirm")}
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
