import React, { useEffect, useState } from "react";
import { useGetStoreDeliveryCompaniesListQuery } from "../../../features/allApis/storeDeliveryCompanyListApi";
import { checkedDefaultExpressChange } from "../../../features/slice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationModal from "../../../Share/ConfirmationModal";
import FadeLoader from "react-spinners/FadeLoader";
import { useTranslation } from "react-i18next";

const AutomaticShippingSettings = () => {
  const [selectedOption, setSelectedOption] = useState();
  const [selectedCompany, setSelectedCompany] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  //   language change
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );

  //   console.log(selectedCompany, "selected companay");
  const dispatch = useDispatch();

  const {
    data: allDeliveryCompanyList,
    isLoading,
    isError,
  } = useGetStoreDeliveryCompaniesListQuery();

  // const initialDefaultDeliveryExpress = useSelector(
  //   (state) => state.user.checkedDefaultExpressChange
  // );

  // const storedData = JSON.parse(localStorage.getItem("DefaultExpressCompany"));

  // useEffect(() => {

  //     if (allDeliveryCompanyList) {
  //         if (storedData) {
  //             console.log("check")
  //             allDeliveryCompanyList.filter((company, index) => {
  //                 if (company?.wp_code === storedData?.wp_code) {
  //                     setSelectedOption(index);
  //                 }
  //             })

  //         }

  //     }
  // }, [storedData]);
  useEffect(() => {
    let storedData = JSON.parse(localStorage.getItem("DefaultExpressCompany"));
    // console.log(storedData, "console storage data");
    if (allDeliveryCompanyList && storedData) {
      allDeliveryCompanyList.forEach((company, index) => {
        if (company?.wp_code === storedData?.wp_code) {
          setSelectedOption(index);
        }
      });
    }
  }, [allDeliveryCompanyList]);

  const handleOptionChange = async (company, index) => {
    setSelectedOption(index);
    setSelectedCompany(company);
  };

  const handleToStoreInLocalStorage = () => {
    setIsModalOpen(true);
    // localStorage.setItem(
    //   "DefaultExpressCompany",
    //   JSON.stringify({ wp_code: selectedCompany.wp_code })
    // );
    // dispatch(checkedDefaultExpressChange({ wp_code: selectedCompany.wp_code }));
  };

  const confirmSetAsDefault = () => {
    localStorage.setItem(
      "DefaultExpressCompany",
      JSON.stringify({ wp_code: selectedCompany.wp_code })
    );
    dispatch(checkedDefaultExpressChange({ wp_code: selectedCompany.wp_code }));
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white relative rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] px-9 pt-6 col-span-8 max-h-[782px] pb-6">
      <div>
        <p className="text-[#004368] text-xl leading-normal font-semibold capitalize mr-2">
          {selectedLanguage === "zh-CN"
            ? "选择默认快递服务"
            : "Select default Delivery Express"}
        </p>
      </div>
      <div className="mt-4 max-h-[700px] overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28">
            <FadeLoader color="#004368" size={25} />
            <p className="text-2xl font-medium pt-10 text-[#004368]">
              {t("DataLoading")}
            </p>
          </div>
        ) : isError ? (
          <p className="text-center text-3xl text-red-500 font-medium py-20">
            {t("DataNotFound")}
          </p>
        ) : (
          allDeliveryCompanyList?.map((company, index) => (
            <div
              key={index}
              className="form-control flex justify-items-center mb-2"
            >
              <label className="cursor-pointer pt-1 flex items-center">
                <input
                  type="radio"
                  name="radio-1"
                  className="radio w-5 h-5 mr-3"
                  checked={selectedOption === index}
                  onChange={() => handleOptionChange(company, index)}
                />
                <span
                  className={`text-[15px] font-medium ${
                    selectedOption === index
                      ? "text-[#004368] font-semibold"
                      : "text-black opacity-70"
                  } capitalize`}
                >
                  {company?.wp_code}
                </span>
              </label>
            </div>
          ))
        )}
      </div>
      <div className="mt-44">
        <button
          onClick={handleToStoreInLocalStorage}
          className="bg-[#004368] absolute bottom-0 right-0 hover:bg-opacity-30 text-white hover:text-black w-[200px] h-12 px-8 py-3 rounded-md cursor-pointer text-[15px] font-medium leading-normal capitalize"
        >
          {t("SetAsDefault")}
        </button>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        title={
          selectedLanguage === "zh-CN" ? (
            <p className="text-[#004368]">确认设置</p>
          ) : (
            <p className="text-[#004368]">Confirm Setting</p>
          )
        }
        message={
          selectedLanguage === "zh-CN" ? (
            <div>
              <p className="text-[#004368]">
                您确定要将{" "}
                <span className="text-xl font-semibold">
                  {selectedCompany?.wp_code}
                </span>{" "}
                公司设为默认快递服务吗？
              </p>
            </div>
          ) : (
            <div>
              <p className="text-center">
                Are you sure you want to set{" "}
                <span className="text-xl font-semibold">
                  {selectedCompany?.wp_code}
                </span>{" "}
                company as the default delivery express?
              </p>
            </div>
          )
        }
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmSetAsDefault}
        showConfirmButton={true}
        selectedLanguage={selectedLanguage}
      />
    </div>
  );
};

export default AutomaticShippingSettings;
