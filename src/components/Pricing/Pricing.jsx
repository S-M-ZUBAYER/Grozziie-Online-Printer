import React, { useEffect, useState, useCallback } from "react";
import logo from "../../assets/GrozziieLogo.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import FadeLoader from "react-spinners/FadeLoader";
import calculatePaymentExpireTime from "../../lib/calculatePaymentExpireTime";
import axios from "axios";
import ConfirmationModal from "../../Share/ConfirmationModal";
import { TiInfoOutline } from "react-icons/ti";
import { CountrySelector, FreePlanModal, PlanCard } from "./FreePlanModal";

// --- Helper: Get Shop ID based on platform ---
const getCurrentShopId = (platform) => {
  const tiktokShopId = JSON.parse(
    localStorage.getItem("tiktokShopInfo") || "[]"
  );
  const lazadaShopId = JSON.parse(
    localStorage.getItem("lazadaShopInfo") || "[]"
  );
  const shopeeShopId = JSON.parse(
    localStorage.getItem("shopeeShopInfo") || "[]"
  );

  switch (platform) {
    case "shopee":
      return shopeeShopId[0]?.id;
    case "lazada":
      return lazadaShopId[0]?.id;
    default:
      return tiktokShopId[0]?.id;
  }
};

const Pricing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.accountUser);
  const storedShopPlatform = localStorage.getItem("SelectedPlatform");

  // --- State ---
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [country, setCountry] = useState("MY");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFreeModal, setShowFreeModal] = useState(false);

  // Card fields (for free plan)
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  // Confirmation modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);

  const currentShopId = getCurrentShopId(storedShopPlatform);

  // --- Fetch plans ---
  const fetchPlans = useCallback(
    async (countryCode) => {
      if (!currentUser) return; // 🔒 prevent bad calls
      if (!currentShopId) {
        setShowShopModal(true); // Show modal
        return; // Stop further execution
      }
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `https://grozziieget.zjweiting.com:8033/tht/grozziiePrinter/pricing/country/${countryCode}/platform/${storedShopPlatform}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch plans");

        // Sort plans by amount
        let storedShopPlans =
          data?.data?.sort((a, b) => a.amount - b.amount) || [];

        // Ensure facilities is array
        storedShopPlans = storedShopPlans.map((plan) => ({
          ...plan,
          facilities:
            typeof plan.facilities === "string"
              ? (() => {
                  try {
                    return JSON.parse(plan.facilities);
                  } catch {
                    return [plan.facilities];
                  }
                })()
              : plan.facilities,
        }));

        // Fetch user’s existing payments
        const paymentRes = await fetch(
          `https://grozziieget.zjweiting.com:8033/tht/printerUserPaymentInfo/${currentUser}`
        );
        const paymentData = await paymentRes.json();

        const paidShopNames =
          paymentData?.result?.[storedShopPlatform]?.map((p) => p.shopName) ||
          [];

        // If shop already has a plan, filter out free trial
        if (paidShopNames.includes(currentShopId.toString())) {
          const newStoredShopPlans = storedShopPlans.filter(
            (p) => p.amount !== 0
          );
          setPlans(newStoredShopPlans);
          setActivePlan(storedShopPlans[0] || null);
        } else {
          setPlans(storedShopPlans);
          setActivePlan(storedShopPlans[0] || null);
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching plans. Please try again later.");
        setPlans([]);
      } finally {
        setLoading(false);
      }
    },
    [currentUser, storedShopPlatform, currentShopId]
  );
  useEffect(() => {
    if (currentUser) {
      fetchPlans(country);
    }
  }, [country, fetchPlans, currentUser]);

  // --- Handle Free Plan Submit ---
  const handleFreePlanSubmit = async () => {
    if (!selectedPlan) return;

    const paymentInfo = {
      email: currentUser,
      shopPlatform: storedShopPlatform,
      shopName: currentShopId,
      paymentTime: new Date().toISOString().split(".")[0] + "Z",
      paymentExpireTime: calculatePaymentExpireTime(selectedPlan.duration),
      amount: selectedPlan.amount,
      currency: "USD",
    };

    try {
      const { data } = await axios.post(
        "https://grozziieget.zjweiting.com:8033/tht/printerUserPaymentInfo/add",
        paymentInfo
      );
      localStorage.setItem("paymentInfo", JSON.stringify(data));

      // Success modal
      setModalTitle(
        <div className="bg-green-200 w-16 h-16 rounded-full flex items-center justify-center">
          <TiInfoOutline className="w-10 h-10 text-gray-600" />
        </div>
      );
      setModalMessage(<p>{t("free_plan_activated_success")}</p>);
      setConfirmAction(() => () => navigate("/onlineprint/home"));
    } catch (err) {
      console.error("Failed to store payment info:", err);

      // Error modal
      setModalTitle(
        <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
          <TiInfoOutline className="w-10 h-10 text-red-600" />
        </div>
      );
      setModalMessage(<p>{t("failed_to_store_payment_info")}</p>);
      setConfirmAction(() => () => setIsConfirmModalOpen(false));
    } finally {
      setShowConfirmButton(true);
      setIsConfirmModalOpen(true);
      setShowFreeModal(false);
    }
  };

  // --- Handle plan selection ---
  const handleChoosePlan = (plan) => {
    setSelectedPlan(plan);
    if (plan.amount === 0) {
      setShowFreeModal(true);
    } else {
      navigate("/onlineprint/payment", { state: { plan } });
    }
  };

  return (
    <div className="bg-[#004368] bg-opacity-5 min-h-screen">
      <div className="pt-[70px] pb-[70px] flex flex-col items-center">
        {/* Header */}
        <div className="flex flex-col items-center mb-14">
          <img
            src={logo}
            alt="Logo"
            className="w-60 h-[60px] object-fit mb-10"
          />
          <h4 className="text-black text-4xl font-semibold capitalize mb-4">
            {t("purchase_subscription")}
          </h4>
          {/* <h6 className="text-black text-opacity-60 text-xl mb-4">
            {t("Selected Shop Platform Country")}
          </h6>
          <CountrySelector country={country} setCountry={setCountry} t={t} /> */}
        </div>

        {/* Content */}
        {loading && (
          <FadeLoader color="#004368" size={25} className="mx-auto mt-10" />
        )}
        {!loading && error && (
          <p className="text-red-500 font-medium">{error}</p>
        )}
        {!loading && !error && plans.length === 0 && (
          <p className="text-[#004368] font-bold text-3xl">
            {t("no_plans_available_for_this_particular_country")}
          </p>
        )}
        {!loading && !error && plans.length > 0 && (
          <div className="bg-white rounded-2xl w-[1268px] h-[523px]  ">
            <div className="grid grid-flow-col auto-cols-[300px] gap-x-5 relative z-0">
              {plans.map((plan, index) => (
                <div key={index} className="relative overflow-visible">
                  <PlanCard
                    plan={plan}
                    activePlan={activePlan}
                    setActivePlan={setActivePlan}
                    handleChoosePlan={handleChoosePlan}
                    t={t}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showShopModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] text-center">
            <h2 className="text-lg font-bold mb-4">Notice</h2>
            <p className="mb-6">
              First, please add your shop before selecting a plan.
            </p>
            <button
              className="bg-[#004368] text-white px-4 py-2 rounded hover:bg-opacity-80"
              onClick={() => {
                setShowShopModal(false);
                window.location.href = "/online"; // Redirect to /online
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Free Plan Modal */}
      <FreePlanModal
        show={showFreeModal}
        selectedPlan={selectedPlan}
        currentUser={currentUser}
        cardNumber={cardNumber}
        expiry={expiry}
        cvc={cvc}
        setCardNumber={setCardNumber}
        setExpiry={setExpiry}
        setCvc={setCvc}
        onClose={() => setShowFreeModal(false)}
        onSubmit={handleFreePlanSubmit}
        t={t}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmAction}
        showConfirmButton={showConfirmButton}
      />
    </div>
  );
};

export default Pricing;
