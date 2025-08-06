import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  allAvailableExpressCompanyChange,
  checkedExpressChange,
} from "../../features/slice/userSlice";
import { setDeliveryCompanies } from "../../features/slice/allDeliveryCompanySlice";
import PropagateLoader from "react-spinners/PropagateLoader";
import { useGetShippingProvidersQuery } from "../../features/allApis/logisticCompaniesApi";

const StoredDeliveryCompanyList = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const dispatch = useDispatch();

  const deliveryCompanies = useSelector(
    (state) => state.deliveryCompanies.data
  );

  const reduxAllAvailableExpressCompany = useSelector(
    (state) => state.user.allAvailableExpressCompany
  );

  const { data, isLoading } = useGetShippingProvidersQuery({
    deliveryOptionId: "7103480879472707330",
    cipher: "ROW_nDrNqQAAAACxFwB-F8R_MJ9cFKQ9ui3m",
  });

  useEffect(() => {
    if (data?.data?.shippingProviders) {
      dispatch(setDeliveryCompanies(data.data.shippingProviders));
    }
  }, [data, dispatch]);

  useEffect(() => {
    const storedData = JSON.parse(
      localStorage.getItem("DefaultExpressCompany")
    );

    if (
      reduxAllAvailableExpressCompany &&
      reduxAllAvailableExpressCompany.length > 0
    ) {
      const companyIndex = reduxAllAvailableExpressCompany.findIndex(
        (company) => company?.wp_code === storedData?.wp_code
      );
      if (companyIndex !== -1) {
        setSelectedOption(companyIndex);
        dispatch(
          checkedExpressChange(reduxAllAvailableExpressCompany[companyIndex])
        );
      } else {
        dispatch(checkedExpressChange(reduxAllAvailableExpressCompany[0]));
      }
    } else if (deliveryCompanies && deliveryCompanies.length > 0) {
      const companyIndex = deliveryCompanies.findIndex(
        (company) => company?.wp_code === storedData?.wp_code
      );
      if (companyIndex !== -1) {
        setSelectedOption(companyIndex);
        dispatch(checkedExpressChange(deliveryCompanies[companyIndex]));
        dispatch(allAvailableExpressCompanyChange(deliveryCompanies));
      } else {
        dispatch(checkedExpressChange(deliveryCompanies[0]));
      }
    }
  }, [reduxAllAvailableExpressCompany, deliveryCompanies, dispatch]);

  const handleOptionChange = (company, index) => {
    setSelectedOption(index);
    dispatch(checkedExpressChange(company));
  };

  return (
    <div className="flex items-center justify-evenly pl-4">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <PropagateLoader color="#004368" className="pt-3" />
        </div>
      ) : (
        deliveryCompanies?.map((company, index) => (
          <div key={index} className="form-control">
            <label className="label cursor-pointer">
              <input
                type="radio"
                name="radio-1"
                className="radio checked:bg-[#004368] w-5 h-5 mr-3"
                checked={selectedOption === index}
                onChange={() => handleOptionChange(company, index)}
              />
              <span
                className={`text-[15px] font-medium ${
                  selectedOption === index
                    ? "text-[#004368]"
                    : "text-black text-opacity-40"
                } capitalize`}
              >
                {company?.name}
              </span>
            </label>
          </div>
        ))
      )}
    </div>
  );
};

export default StoredDeliveryCompanyList;
