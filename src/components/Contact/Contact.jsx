import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import emailjs from "emailjs-com";
import world from "../../assets/world.png";

const Contact = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    country: "",
    message: "",
  });

  const { t } = useTranslation();
  const emailServiceId = import.meta.env.VITE_EMAIL_JS_SERVICE_ID;
  const emailTemplateId = import.meta.env.VITE_EMAIL_JS_TEMPLATE_ID;
  const emailPublicKey = import.meta.env.VITE_EMAIL_JS_PUBLIC_KEY;

  console.log(emailServiceId, emailTemplateId, emailPublicKey);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await emailjs.send(
        emailServiceId, // ✅ Your service ID
        emailTemplateId, // ✅ Your template ID
        formData, // ✅ Must match variable names in EmailJS template
        emailPublicKey // ✅ Your public key
      );

      toast.success("✅ Thank you! Your message has been sent.");
      setFormData({ userName: "", email: "", country: "", message: "" });
    } catch (error) {
      console.error("❌ Email failed:", error);
      toast.error("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="mx-auto mt-10 min-h-screen">
      <div className="grid grid-cols-5 gap-x-1">
        {/* Right side */}
        <div className="col-span-3 flex flex-col">
          <div className="flex flex-col px-20 mb-3">
            <h1 className="text-[#004368] text-5xl font-bold leading-tight">
              {t("LetsTalk")}
            </h1>
            <p className="mt-3 mb-6 text-xl">
              {t("HaveIdea")}
              {t("ReachOut")}
            </p>
            <h3 className="text-xl mb-2 font-bold">{t("SupportEmail")}</h3>
            <p className="text-[#004368]">info@printernoble.com</p>
          </div>
          <div className="mt-6">
            <img src={world} alt="World" />
          </div>
        </div>

        {/* Left side (form) */}
        <div className="col-span-2 mt-8">
          <form className="w-full" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-10">
              <label className="form-control w-full">
                <span className="text-[#004368] text-sm font-medium mb-3">
                  {t("Name")}
                </span>
                <input
                  type="text"
                  name="userName"
                  required
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder={t("EnterUserName")}
                  className="w-full text-black text-opacity-55 text-[15px] pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded"
                />
              </label>
            </div>

            {/* Email */}
            <div className="mb-10">
              <label className="form-control w-full">
                <span className="text-[#004368] text-sm font-medium mb-3">
                  {t("Email")}
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("EnterEmail")}
                  className="w-full text-black text-opacity-55 text-[15px] pl-3 bg-[#004368] bg-opacity-5 outline-none border py-2 rounded"
                />
              </label>
            </div>

            {/* Country */}
            <div className="mb-10">
              <label className="form-control w-full">
                <span className="text-[#004368] text-sm font-medium mb-3">
                  {t("Country")}
                </span>
                <select
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="select select-bordered text-black text-opacity-55 text-[15px] font-normal pl-3 bg-[#004368] bg-opacity-5 outline-none border py-1 rounded"
                >
                  <option disabled value="">
                    {t("SelectCountry")}
                  </option>
                  <option value="MY">MY</option>
                </select>
              </label>
            </div>

            {/* Message */}
            <div className="mb-8">
              <label className="form-control w-full">
                <span className="text-[#004368] text-sm font-medium mb-3">
                  {t("Message")}
                </span>
                <textarea
                  name="message"
                  value={formData.message}
                  required
                  onChange={handleChange}
                  className="bg-white textarea textarea-bordered focus:outline-none h-32"
                  placeholder={t("YourMessage")}
                ></textarea>
              </label>
            </div>

            <div className="flex items-center justify-center">
              <button
                className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-full h-10 px-2 py-2 rounded-md cursor-pointer text-center"
                type="submit"
              >
                {t("Submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
