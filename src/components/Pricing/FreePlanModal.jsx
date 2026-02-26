import { IoIosCheckmarkCircleOutline } from "react-icons/io";

// --- Helpers ---
const isValidCard = (cardNumber, expiry, cvc, email) => {
  const cleanCard = cardNumber.replace(/\s+/g, "");
  const expiryRegex = /^\d{2}\/\d{2}$/;
  if (!/^\d{12,19}$/.test(cleanCard)) return false;
  if (!expiryRegex.test(expiry)) return false;
  if (!/^\d{3,4}$/.test(cvc)) return false;
  if (!/\S+@\S+\.\S+/.test(email)) return false;
  const [month, year] = expiry.split("/").map((val) => parseInt(val, 10));
  if (month < 1 || month > 12) return false;
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear() % 100;
  return !(
    year < currentYear ||
    (year === currentYear && month < currentMonth)
  );
};

// --- Child Components ---
export const CountrySelector = ({ country, setCountry, t }) => (
  <select
    value={country}
    onChange={(e) => setCountry(e.target.value)}
    className="border border-gray-400 rounded px-3 py-2 mb-4"
  >
    {" "}
    <option value="MY">{t("malaysia")}</option>{" "}
    <option value="CN">{t("china")}</option>{" "}
    <option value="TH">{t("thailand")}</option>{" "}
    <option value="VN">{t("vietnam")}</option>{" "}
    <option value="ID">{t("indonesia")}</option>{" "}
    <option value="PH">{t("philippines")}</option>{" "}
    <option value="GLOBAL">{t("others")}</option>{" "}
  </select>
);

export const PlanCard = ({
  plan,
  activePlan,
  setActivePlan,
  handleChoosePlan,
  t,
}) => (
  <div
    className={`flex flex-col items-center py-7 transition-all duration-300 relative
    ${
      activePlan === plan
        ? "bg-[#004368] shadow-2xl scale-105 rounded-2xl ring-8 ring-[#004368] ring-opacity-20 z-50"
        : "bg-white z-10"
    }`}
    onMouseEnter={() => setActivePlan(plan)}
    onMouseLeave={() => setActivePlan(plan)}
  >
    {" "}
    <span
      className={`badge px-5 py-[14px] bg-[#004368] bg-opacity-10 text-lg font-medium text-[#004368] ${
        activePlan === plan ? "text-white" : ""
      }`}
    >
      {" "}
      {t(plan.packageName)}{" "}
    </span>{" "}
    <div className="flex items-center my-12">
      {" "}
      <h1
        className={`text-[#004368] font-bold text-3xl mr-2 ${
          activePlan === plan ? "text-white" : ""
        }`}
      >
        {" "}
        ${plan.amount}{" "}
        <sub
          className={`text-black text-sm ${
            activePlan === plan ? "text-white" : ""
          }`}
        >
          {" "}
          /{plan.duration?.split(" ")[0]} {t(plan.duration?.split(" ")[1])}{" "}
        </sub>{" "}
      </h1>{" "}
    </div>{" "}
    <div className="mb-10">
      {" "}
      {plan.facilities.map((facility, i) => (
        <p key={i} className="flex items-center gap-x-2 mb-5">
          {" "}
          <IoIosCheckmarkCircleOutline
            className={`text-[#004368] text-opacity-80 ${
              activePlan === plan ? "text-white" : ""
            }`}
          />{" "}
          <span
            className={`text-black font-light text-sm ${
              activePlan === plan ? "text-white" : ""
            }`}
          >
            {" "}
            {facility}{" "}
          </span>{" "}
        </p>
      ))}{" "}
    </div>{" "}
    <button
      className={`bg-slate-300 text-[#004368] w-[180px] h-10 px-2 py-2 rounded-md cursor-pointer text-center font-medium ${
        activePlan === plan ? "bg-white font-bold" : ""
      }`}
      onClick={() => handleChoosePlan(plan)}
    >
      {" "}
      {t("choose_plan")}{" "}
    </button>{" "}
  </div>
);
export const FreePlanModal = ({
  show,
  selectedPlan,
  currentUser,
  cardNumber,
  expiry,
  cvc,
  setCardNumber,
  setExpiry,
  setCvc,
  onClose,
  onSubmit,
  t,
}) => {
  if (!show || !selectedPlan) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
      {" "}
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[500px] relative">
        {" "}
        <h2 className="text-2xl font-bold text-center text-[#004368] mb-4">
          {" "}
          {t("free_plan_activation")}{" "}
        </h2>{" "}
        <p className="text-center text-gray-600 mb-6">
          {" "}
          {t(selectedPlan.packageName)} — ${selectedPlan.amount} /{" "}
          {selectedPlan.duration?.split(" ")[0]}{" "}
          {t(selectedPlan.duration?.split(" ")[1])}{" "}
        </p>{" "}
        <div className="space-y-4">
          {" "}
          <input
            type="email"
            placeholder={t("enter_email")}
            value={currentUser}
            readOnly
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-[#004368]"
          />{" "}
          <input
            type="text"
            placeholder={t("card_number")}
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-[#004368]"
          />{" "}
          <div className="flex gap-2">
            {" "}
            <input
              type="text"
              placeholder={`${t("expiry")} (06/29)`}
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-1/2 border px-3 py-2 rounded focus:ring focus:ring-[#004368]"
            />{" "}
            <input
              type="text"
              placeholder={t("cvc")}
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="w-1/2 border px-3 py-2 rounded focus:ring focus:ring-[#004368]"
            />{" "}
          </div>{" "}
        </div>{" "}
        <div className="flex justify-end space-x-4 mt-6">
          {" "}
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            {" "}
            {t("Cancel")}{" "}
          </button>{" "}
          <button
            className={`px-4 py-2 rounded text-white ${
              isValidCard(cardNumber, expiry, cvc, currentUser)
                ? "bg-[#004368] hover:bg-opacity-80"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isValidCard(cardNumber, expiry, cvc, currentUser)}
            onClick={onSubmit}
          >
            {" "}
            {t("submit")}{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
