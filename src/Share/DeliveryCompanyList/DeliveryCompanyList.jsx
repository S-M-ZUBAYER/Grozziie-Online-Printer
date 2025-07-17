import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkedExpressChange } from "../../features/slice/userSlice";
import {
  fetchAvailableWaybills,
  fetchLogisticCompanies,
} from "../../components/BatchPrint/BatchPrinterFunctions";
import axios from "axios";

const DeliveryCompanyList = ({
  setAllDeliveryModel,
  setModelListLoading,
  selectedDeliveryCompanyName,
  setSelectedDeliveryCompanyName,
  setShopDeliveryCompanyName,
  shopDeliveryCompanyName,
  setSelectedWp_code,
  setSelectedModel,
}) => {
  const [selectedOption, setSelectedOption] = useState(0);
  const [deliveryCompanyName, setDeliveryCompanyName] = useState();
  const dispatch = useDispatch();
  // dispatch(checkedExpressChange(shopDeliveryCompanyName[0]));
  const loadShopDeliveryCompanyList = useSelector(
    (state) => state.shopDeliveryCompanyList.data
  );

  useEffect(() => {
    setShopDeliveryCompanyName(loadShopDeliveryCompanyList);
  }, []);

  const [retryCount, setRetryCount] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (shopDeliveryCompanyName[0] && retryCount < 3) {
          await handleOptionChange(shopDeliveryCompanyName[0], 0);
          setRetryCount(0); // Reset the counter if successful
        } else if (retryCount < 3) {
          await handleOptionChange(shopDeliveryCompanyName[0], 0);
          setRetryCount((prevCount) => prevCount + 1); // Increment the counter
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [shopDeliveryCompanyName, retryCount]);

  const handleOptionChange = async (company, index) => {
    setSelectedOption(index);
    setSelectedDeliveryCompanyName(company);
    try {
      setModelListLoading(true);
      const response = await axios.get(
        `https://grozziieget.zjweiting.com:3091/GrozziiePrint-WebAPI/cloudprint/stdtemplates/${company?.wp_code}`
      );
      setAllDeliveryModel(
        response.data?.pdd_cloudprint_stdtemplates_get_response?.result
          ?.datas[0]?.standard_templates
      );
      setSelectedModel(
        response.data?.pdd_cloudprint_stdtemplates_get_response?.result
          ?.datas[0]?.standard_templates[0]
      );
      setSelectedWp_code(
        response.data?.pdd_cloudprint_stdtemplates_get_response?.result
          ?.datas[0]?.wp_code
      );

      setModelListLoading(false);
      // Handle the response data as needed
    } catch (error) {
      console.error("Error fetching data:", error);
      setModelListLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-evenly pl-11 pr-20 col-span-10">
      {shopDeliveryCompanyName?.map((company, index) => (
        <div key={index} className="form-control">
          <label className="label cursor-pointer">
            <input
              type="radio"
              name="radio-2"
              className="radio w-5 h-5 mr-3"
              checked={selectedOption === index}
              onChange={() => handleOptionChange(company, index)}
            />
            <span
              className={`text-[15px] font-medium ${selectedOption === index
                ? "text-[#004368]"
                : "text-black opacity-40"
                } capitalize`}
            >
              {/* {company?.branch_account_cols?.branch_name} */}
              {company?.wp_code}
            </span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default DeliveryCompanyList;
