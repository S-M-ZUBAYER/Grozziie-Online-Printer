import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

const EmailVerificationComponent = ({ currentUser }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [altEmail, setAltEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const printUser = JSON.parse(localStorage.getItem("printerUser"));

  const handleSubmit = async () => {
    if (!currentUser || !password) {
      alert("Password is required.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      let response;

      if (altEmail) {
        // ✅ Add alternate email API
        response = await axios.post(
          `https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/v1/user/alternate-email/add`,
          {},
          {
            params: {
              email: currentUser,
              password,
              alternateEmail: altEmail,
            },
          },
        );
      } else {
        // ✅ Resend verification email API
        response = await axios.post(
          `https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/v1/user/resend-verification`,
          {},
          {
            params: {
              email: currentUser,
              password,
            },
          },
        );
      }

      if (response.data.status === "success") {
        setMessage(response.data.message);

        // ✅ Update localStorage emailVerified flag
        if (printUser) {
          printUser.emailVerified = true;
          localStorage.setItem("printerUser", JSON.stringify(printUser));
        }

        // ⏳ Wait 2 seconds then navigate
        setTimeout(() => {
          setOpen(false);
          navigate("/onlineprint/verifyemail");
        }, 2000);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Something went wrong. Try again.";
      setMessage(msg);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* STATUS BADGE */}
      {printUser?.emailVerified ? (
        <div className="inline-block px-3 py-1 text-sm font-medium text-green-600 border border-green-600 rounded-md">
          {t("Verified")}
        </div>
      ) : (
        <div
          onClick={() => setOpen(true)}
          className="inline-block px-3 py-1 text-sm font-medium text-red-600 border border-red-600 rounded-md cursor-pointer hover:bg-red-50"
        >
          {t("Unverified")}
        </div>
      )}

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">
              {t("VerifyYourEmail")}
            </h2>

            {/* Email (readonly) */}
            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium">
                {t("Email")}
              </label>
              <input
                type="email"
                value={currentUser || ""}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">
                {t("password")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("EnterYourPassword")}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Alternative Email */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">
                {t("AlternativeEmailOptional")}
              </label>
              <input
                type="email"
                value={altEmail}
                onChange={(e) => setAltEmail(e.target.value)}
                placeholder={t("EnterAlternativeEmail")}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Message */}
            {message && (
              <div className="mb-3 text-sm text-blue-600">{message}</div>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
              >
                {t("Cancel")}
              </button>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`px-4 py-2 text-sm text-white rounded-md ${
                  isLoading ? "bg-gray-400" : "bg-[#004368] hover:bg-[#021d2b]"
                }`}
              >
                {isLoading ? t("Processing") : t("Submit")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailVerificationComponent;
