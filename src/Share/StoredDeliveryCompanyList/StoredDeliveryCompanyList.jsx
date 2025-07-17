import React, { useEffect, useState } from "react";
import { useGetStoreDeliveryCompaniesListQuery } from "../../features/allApis/storeDeliveryCompanyListApi";
import { useDispatch, useSelector } from "react-redux";
import {
  allAvailableExpressCompanyChange,
  checkedExpressChange,
} from "../../features/slice/userSlice";
import PropagateLoader from "react-spinners/PropagateLoader";

const StoredDeliveryCompanyList = () => {
  //   const [allDeliveryCompanyList, setAllDeliveryCompanyList] = useState([]);
  const [selectedOption, setSelectedOption] = useState(0);
  const dispatch = useDispatch();

  //   useEffect(() => {
  //     const url =
  //       "https://grozziieget.zjweiting.com:3091/GrozziiePrint-WebAPI/stdtemplates-store";

  //     fetch(url)
  //       .then((response) => {
  //         if (!response.ok) {
  //           throw new Error(`HTTP error! Status: ${response.status}`);
  //         }
  //         return response.json();
  //       })
  //       .then((data) => {
  //         console.log("Success:", data);
  //         setAllDeliveryCompanyList(data);
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //       });
  //   }, []);
  // console.log(allDeliveryCompanyList, "show the allDeliveryCompanyList");

  // useEffect(() => {
  //   const storedData = JSON.parse(
  //     localStorage.getItem("DefaultExpressCompany")
  //   );
  //   if (allDeliveryCompanyList) {
  //     if (storedData) {
  //       allDeliveryCompanyList.filter((company, index) => {
  //         if (company?.wp_code === storedData?.wp_code) {
  //           setSelectedOption(index);
  //           dispatch(checkedExpressChange(allDeliveryCompanyList[index]));
  //         }
  //       });
  //     } else {
  //       console.log(allDeliveryCompanyList);
  //       dispatch(checkedExpressChange(allDeliveryCompanyList[0]));
  //     }
  //   }
  // }, []);
  const { data: allDeliveryCompanyList, isLoading } =
    useGetStoreDeliveryCompaniesListQuery();
  const reduxAllAvailableExpressCompany = useSelector(
    (state) => state.user.allAvailableExpressCompany
  );

  useEffect(() => {
    const storedData = JSON.parse(
      localStorage.getItem("DefaultExpressCompany")
    );

    if (
      reduxAllAvailableExpressCompany &&
      reduxAllAvailableExpressCompany.length > 0
    ) {
      console.log(
        reduxAllAvailableExpressCompany,
        storedData,
        "all from redux"
      );
      if (storedData) {
        const companyIndex = reduxAllAvailableExpressCompany.findIndex(
          (company) => company?.wp_code === storedData?.wp_code
        );
        if (companyIndex !== -1) {
          setSelectedOption(companyIndex);
          dispatch(
            checkedExpressChange(reduxAllAvailableExpressCompany[companyIndex])
          );
        }
      } else {
        console.log(reduxAllAvailableExpressCompany);
        dispatch(checkedExpressChange(reduxAllAvailableExpressCompany[0]));
      }
    } else if (allDeliveryCompanyList && allDeliveryCompanyList.length > 0) {
      console.log(allDeliveryCompanyList, storedData, "all from server");
      if (storedData) {
        const companyIndex = allDeliveryCompanyList.findIndex(
          (company) => company?.wp_code === storedData?.wp_code
        );
        if (companyIndex !== -1) {
          setSelectedOption(companyIndex);
          dispatch(checkedExpressChange(allDeliveryCompanyList[companyIndex]));
          dispatch(allAvailableExpressCompanyChange(allDeliveryCompanyList));
        }
      } else {
        console.log(allDeliveryCompanyList);
        dispatch(checkedExpressChange(allDeliveryCompanyList[0]));
      }
    }
  }, [reduxAllAvailableExpressCompany, allDeliveryCompanyList, dispatch]);

  const handleOptionChange = async (company, index) => {
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
        allDeliveryCompanyList?.map((company, index) => (
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
                className={`text-[15px] font-medium ${selectedOption === index
                    ? "text-[#004368]"
                    : "text-black text-opacity-40"
                  } capitalize`}
              >
                {company?.wp_code}
              </span>
            </label>
          </div>
        ))
      )}
    </div>
  );
};

export default StoredDeliveryCompanyList;
