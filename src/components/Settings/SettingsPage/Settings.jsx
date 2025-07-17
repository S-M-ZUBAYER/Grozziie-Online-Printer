import React, { useEffect, useState } from "react";
import Delete from "../../../assets/Delete.png";
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { arrayToExcel } from "../../../Share/Function/FunctionalComponent";
import {
  useDeleteRecipientInfoMutation,
  useGetRecipientInfoQuery,
  useSetRecipientInfoMutation,
} from "../../../features/allApis/recipientInfoApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useGetAllAddressQuery } from "../../../features/allApis/allAddressApi";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import ConfirmationModal from "../../../Share/ConfirmationModal";
import { AiOutlineCheckCircle, AiOutlineDelete } from "react-icons/ai";
import { TiInfoOutline } from "react-icons/ti";
import FadeLoader from "react-spinners/FadeLoader";

const Settings = () => {
  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");

  //   language change
  const selectedLanguage = useSelector(
    (state) => state.user.selectedLanguageRedux
  );
  // data get from server via redux
  const {
    data: clients,
    isLoading,
    isError,
  } = useGetRecipientInfoQuery(userEmail);
  // data post from server via redux
  const [setRecipientInfo] = useSetRecipientInfoMutation();
  // data delete from server via redux
  const [deleteRecipientInfo] = useDeleteRecipientInfoMutation();
  const [clientData, setClientData] = useState(clients?.slice(0, 5));
  const [filteredAllClient, setFilteredAllClient] = useState(clients);

  // Province, city, district data get
  const { data: getAllAddressData } = useGetAllAddressQuery();
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState("");
  const [formData, setFormData] = useState({
    receiver_name: "",
    receiver_name_mask: "",
    company_name: "",
    city: "",
    district: "",
    province: "",
    town: "",
    country: "中国",
    userName: userEmail,
    address: "",
    operate: "",
    receiver_phone: "",
  });
  useEffect(() => {
    if (
      getAllAddressData?.logistics_address_get_response?.logistics_address_list
    ) {
      // Extract provinces from data
      const provincesData =
        getAllAddressData.logistics_address_get_response.logistics_address_list.filter(
          (item) => item.region_type === 1
        );
      // Store the provinces data in state
      setProvinces(provincesData);
    }
  }, [getAllAddressData]);

  useEffect(() => {
    if (totalPart <= 1) {
      setLeftPaginationBtn(false);
      setRightPaginationBtn(false);
    } else {
      setLeftPaginationBtn(false);
      setRightPaginationBtn(true);
    }
    setClientData(clients?.slice(0, 5));
    setTotalPart(Math.ceil(clients?.length / 5));
  }, [clients]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("GrozziieToken");
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/GrozziiePrint-LoginRegistration/user/details",
        {
          params: { token: token },
        }
      );
      setUserEmail(response?.data?.email);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filterCityUnderProvince = (parentId) => {
    // console.log("Call");
    // console.log(parentId);
    const cityData =
      getAllAddressData?.logistics_address_get_response?.logistics_address_list?.filter(
        (item) => item.parent_id === parentId
      );
    setCities(cityData);
  };

  const filterDistrictUnderCity = (parentId) => {
    const districtData =
      getAllAddressData?.logistics_address_get_response?.logistics_address_list?.filter(
        (item) => item.parent_id === parentId
      );
    setDistricts(districtData);
  };

  // Function to handle the master checkbox change
  const handleMasterCheckboxChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setCheckedItems(filteredAllClient);
    } else {
      setCheckedItems([]);
    }
  };

  // Function to handle individual checkbox change
  const handleCheckboxChange = (customer) => {
    if (checkedItems.some((item) => item?.id === customer?.id)) {
      // If the customer id is already in the checkedItems, remove it
      const updatedItems = checkedItems.filter(
        (item) => item?.id !== customer?.id
      );
      setCheckedItems(updatedItems);
      setSelectAll(false);
    } else {
      // If the customer id is not in the checkedItems, add it
      const updatedItems = [...checkedItems, customer];
      setCheckedItems(updatedItems);
      if (updatedItems.length === clientData.length) {
        setSelectAll(true);
      }
    }
  };

  // Function to update form data based on input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // modal submit function
  const handleModalSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const recipientData = {
      ...formData,
      receiver_name_mask: formData.receiver_name,
      userName: userEmail,
      country: "中国",
      city: selectedCity,
      district: selectedDistricts,
      province: selectedProvince,
    };

    setRecipientInfo(recipientData)
      .unwrap()
      .then((data) => {
        setCheckedItems([]);
        setFormData({
          receiver_name: "",
          company_name: "",
          city: "",
          district: "",
          province: "",
          town: "",
          country: "",
          userName: "",
          address: "",
          operate: "",
          receiver_phone: "",
        });
        document.getElementById("my_modal_settings").close();
      })
      .catch((error) => {
        // console.error("Error:", error);
        setError("Something went wrong. Please try again later!");
        // document.getElementById("my_modal_settings").close();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Excel Functionalities
  const handleRecipientInfoExcelClick = () => {
    arrayToExcel(checkedItems, "RecipientCustomerList");
  };

  // searching functionalities
  const [searchAllQuery, setSearchAllQuery] = useState("");
  const handleSearchAllChange = (event) => {
    setSearchAllQuery(event.target.value);
  };

  useEffect(() => {
    const filterFromClientData = clients?.filter(
      (request) =>
        request?.receiver_name
          .toLowerCase()
          .includes(searchAllQuery.toLowerCase()) ||
        request?.company_name
          .toLowerCase()
          .includes(searchAllQuery.toLowerCase()) ||
        request?.address.toLowerCase().includes(searchAllQuery.toLowerCase()) ||
        request?.receiver_phone.includes(searchAllQuery.toLowerCase()) ||
        request?.city.toLowerCase().includes(searchAllQuery.toLowerCase()) ||
        request?.operate.toLowerCase().includes(searchAllQuery.toLowerCase())
    );
    setFilteredAllClient(filterFromClientData?.slice(0, 5));
  }, [clients, searchAllQuery]);

  //Delete functionalities
  // const handleToCustomerInfoDelete = () => {
  //   let deleteCount = 0;
  //   if (checkedItems.length === 0) {
  //     toast.error("Please select at least one item to delete.");
  //     return;
  //   }
  //   Promise.all(
  //     checkedItems?.map((item) => {
  //       return deleteRecipientInfo(item.id)
  //         .unwrap()
  //         .then(() => {
  //           deleteCount++;
  //         })
  //         .catch((error) => {
  //           toast.error("Failed to delete recipient data.");
  //           console.error("Error:", error);
  //         });
  //     })
  //   ).then(() => {
  //     if (deleteCount === checkedItems.length) {
  //       toast.success("Recipient Data Successfully Deleted.");
  //     }
  //     deleteCount = 0;
  //     setCheckedItems([]);
  //   });
  // };

  const handleToCustomerInfoDelete = () => {
    if (checkedItems.length === 0) {
      setMessage(
        `${
          selectedLanguage === "zh-CN"
            ? "请至少选择一项要删除的项目。"
            : "Please select at least one item to delete."
        }`
      );
      setIsErrorModal(true);
      setShowMessageModal(true);
      return;
    }
    setShowModal(true);
  };

  const confirmDelete = () => {
    let deleteCount = 0;
    Promise.all(
      checkedItems?.map((item) => {
        return deleteRecipientInfo(item.id)
          .unwrap()
          .then(() => {
            deleteCount++;
          })
          .catch((error) => {
            setMessage(
              `${
                selectedLanguage === "zh-CN"
                  ? "无法删除收件人数据。"
                  : "Failed to delete recipient data."
              }`
            );
            setIsErrorModal(true);
            setShowMessageModal(true);
            console.error("Error:", error);
          });
      })
    ).then(() => {
      if (deleteCount === checkedItems.length) {
        setMessage(
          `${
            selectedLanguage === "zh-CN"
              ? "收件人数据已成功删除。"
              : "Recipient Data Successfully Deleted."
          }`
        );
        setIsErrorModal(false);
        setShowMessageModal(true);
      }
      deleteCount = 0;
      setCheckedItems([]);
    });
    setShowModal(false);
  };

  const handleClose = () => setShowModal(false);

  const handleMessageModalClose = () => setShowMessageModal(false);

  // pagination part
  const [showPage, setShowPage] = useState(1);
  const [currentBar, setCurrentBar] = useState(1);
  const [totalPart, setTotalPart] = useState(
    Math.ceil(filteredAllClient?.length / 5)
  );
  const [leftPaginationBtn, setLeftPaginationBtn] = useState(false);
  const [rightPaginationBtn, setRightPaginationBtn] = useState(true);

  console.log(leftPaginationBtn, rightPaginationBtn);

  const handleToShowCurrentBarData = (count) => {
    if (count <= totalPart) {
      // const currentData = count * 5;
      // setClientData(clients.slice(currentData - 5, currentData));
      // setCurrentBar(count);
      const currentData = count * 5;
      setFilteredAllClient(clients.slice(currentData - 5, currentData));
      setCurrentBar(count);
    }
  };

  // const handleToNext = (count) => {
  //   console.log(count);
  //   if (count <= totalPart) {
  //     const currentData = count * 5;
  //     // console.log(clients, "next");
  //     // setClientData(clients.slice(currentData - 5, currentData));
  //     // setCurrentBar(count);
  //     setFilteredAllClient(clients.slice(currentData - 5, currentData));
  //     setCurrentBar(count);
  //   }
  // };

  // const handleToPrevious = (count) => {
  //   console.log(count);
  //   if (count > 0) {
  //     const currentData = count * 5;
  //     // console.log(clients, "previous");
  //     // setClientData(clients.slice(currentData - 5, currentData));
  //     // setCurrentBar(count);
  //     setFilteredAllClient(clients.slice(currentData - 5, currentData));
  //     setCurrentBar(count);
  //   }
  // };

  // pagination next option
  const handleToNext = (count) => {
    if (count <= totalPart) {
      if (count > 1) {
        setLeftPaginationBtn(true);
      } else {
        setLeftPaginationBtn(false);
      }

      if (count === totalPart) {
        setRightPaginationBtn(false);
      } else {
        setRightPaginationBtn(true);
      }

      const currentData = count * 5;
      // console.log(clients, "next");
      // setClientData(clients.slice(currentData - 5, currentData));
      // setCurrentBar(count);
      setFilteredAllClient(clients.slice(currentData - 5, currentData));
      setCurrentBar(count);
    } else {
      setRightPaginationBtn(false);
    }
  };

  // pagination prev option
  const handleToPrevious = (count) => {
    if (count > 0) {
      if (count === 1) {
        setLeftPaginationBtn(false);
      } else {
        setLeftPaginationBtn(true);
      }

      if (count < totalPart) {
        setRightPaginationBtn(true);
      } else {
        setRightPaginationBtn(false);
      }

      const currentData = count * 5;
      // console.log(clients, "previous");
      // setClientData(clients.slice(currentData - 5, currentData));
      // setCurrentBar(count);
      setFilteredAllClient(clients.slice(currentData - 5, currentData));
      setCurrentBar(count);
    } else {
      setLeftPaginationBtn(false);
    }
  };

  // const [status, setStatus] = useState("");
  // useEffect(() => {
  //   if (isLoading) {
  //     setStatus(
  //       <div className="flex flex-col items-center justify-center py-28">
  //         <PacmanLoader color="#004368" size={25} />
  //         <p className="text-2xl font-medium pt-10 text-[#004368]">
  //           {selectedLanguage === "zh-CN"
  //             ? "数据正在加载，请稍候..."
  //             : "Data is Loading. Please Wait..."}
  //         </p>
  //       </div>
  //     );
  //   } else {
  //     if (isError) {
  //       setStatus(
  //         <p className="text-center text-3xl text-red-500 font-medium py-20">
  //           {selectedLanguage === "zh-CN"
  //             ? "未找到数据。请稍后再试..."
  //             : "Data Not Found. Please try again later...."}
  //         </p>
  //       );
  //     } else {
  //       setStatus(
  //         <table className="table">
  //           <thead className="bg-[#0043681A] opacity-80 h-11 rounded-md">
  //             <tr>
  //               <th className="sticky top-0 bg-gray-200 flex items-center">
  //                 <input
  //                   type="checkbox"
  //                   id="selectAll"
  //                   name="selectAll"
  //                   value="selectAll"
  //                   checked={selectAll}
  //                   onChange={handleMasterCheckboxChange}
  //                   className="w-4 h-4 rounded-[2px] text-[#004368] text-opacity-60 bg-[#004368] cursor-pointer"
  //                 />
  //                 <span className=" text-black opacity-80 capitalize text-center text-[15px] font-light leading-normal ml-3">
  //                   {selectedLanguage === "zh-CN"
  //                     ? "收件人姓名"
  //                     : "recipient name"}
  //                 </span>
  //                 <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
  //               </th>
  //               <th className="sticky top-0 bg-gray-200 text-black opacity-80 capitalize text-center text-[15px] font-light leading-normal">
  //                 <span className="mr-2">
  //                   {selectedLanguage === "zh-CN" ? "公司名称" : "Company Name"}
  //                 </span>
  //                 <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
  //               </th>
  //               <th className="sticky top-0 bg-gray-200 text-black opacity-80 capitalize text-center text-[15px] font-light leading-normal">
  //                 <span className="mr-2">
  //                   {selectedLanguage === "zh-CN" ? "地址" : "Address"}
  //                 </span>
  //                 <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
  //               </th>
  //               <th className="sticky top-0 bg-gray-200 text-black opacity-80 capitalize text-center text-[15px] font-light leading-normal">
  //                 <span className="mr-2">
  //                   {selectedLanguage === "zh-CN" ? "座机电话" : "landline"}
  //                 </span>
  //                 <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
  //               </th>
  //               <th className="sticky top-0 bg-gray-200 text-black opacity-80 capitalize text-center text-[15px] font-light leading-normal">
  //                 <span className="mr-2">
  //                   {selectedLanguage === "zh-CN" ? "邮政编码" : "post code"}
  //                 </span>
  //                 <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
  //               </th>
  //               <th className="sticky top-0 bg-gray-200 text-black opacity-80 capitalize text-center text-[15px] font-light leading-normal">
  //                 {selectedLanguage === "zh-CN" ? " 操作" : "operate"}
  //               </th>
  //             </tr>
  //           </thead>
  //           <tbody className="max-h-[590px] overflow-y-auto">
  //             {filteredAllClient?.map((client) => (
  //               <tr
  //                 key={client.id}
  //                 className="hover:bg-[#0043681A] cursor-pointer"
  //               >
  //                 <td>
  //                   <input
  //                     type="checkbox"
  //                     id="selectAll"
  //                     name="client"
  //                     value={client.id}
  //                     checked={checkedItems.some(
  //                       (item) => item?.id === client?.id
  //                     )}
  //                     onChange={() => handleCheckboxChange(client)}
  //                     className="w-4 h-4 rounded-[2px] text-[#004368] text-opacity-60 bg-[#004368] cursor-pointer"
  //                   />
  //                   <span className="ml-3 text-black opacity-80 capitalize text-center text-[15px] font-light leading-normal">
  //                     {client.receiver_name}
  //                   </span>
  //                 </td>
  //                 <td className="text-center text-black opacity-80 capitalize text-[15px] font-light leading-normal">
  //                   {client.company_name}
  //                 </td>
  //                 <td className="text-center text-black opacity-80 capitalize text-[15px] font-light leading-normal">
  //                   {client.address}
  //                 </td>
  //                 <td className="text-center text-black opacity-80 capitalize text-[15px] font-light leading-normal">
  //                   {client.receiver_phone}
  //                 </td>
  //                 <td className="text-center text-black opacity-80 capitalize text-[15px] font-light leading-normal">
  //                   {client.city}
  //                 </td>
  //                 <td className="text-center text-black opacity-80 capitalize text-[15px] font-light leading-normal">
  //                   {client.operate}
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       );
  //     }
  //   }
  // }, [filteredAllClient]);

  return (
    <div>
      <div className="bg-white rounded-[17px] shadow-[6px 9px 16.4px 0px rgba(0, 0, 0, 0.04)] px-6 pt-5 col-span-8 max-h-[782px] pb-6">
        {/* top */}
        <div className="mt-4 flex items-center justify-center">
          <div className="col-span-2 w-[445px] h-12 outline-none rounded-md text-[#00000099] font-normal text-[15px] text-center flex justify-between items-center cursor-pointer mr-3">
            <div className="w-full h-full bg-[#0043681A] flex items-center rounded-md">
              <CiSearch className="w-[22px] h-[22px] ml-3" />
              <input
                onChange={handleSearchAllChange}
                type="text"
                placeholder="搜索"
                className="h-full w-full text-black text-opacity-55 text-[15px] font-normal leading-normal pl-3 bg-transparent outline-none"
              />
            </div>
          </div>

          <button className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[115px] h-12 px-8 py-3 rounded-md cursor-pointer">
            <p className="text-[15px] font-medium leading-normal capitalize">
              {selectedLanguage === "zh-CN" ? "搜索" : "Search"}
            </p>
          </button>
        </div>

        {/* second top */}
        <div className="flex items-center justify-between pt-2 mt-5">
          {/* left side */}
          <div className="flex items-center">
            <p className="capitalize text-center mr-7">
              <span className="text-[#004368] text-[15px] font-semibold leading-normal mr-1">
                {checkedItems?.length}
              </span>
              <span className="text-black text-[15px] font-light leading-normal capitalize">
                {selectedLanguage === "zh-CN" ? "已选择项目" : "item selected"}
              </span>
            </p>
            <button
              onClick={handleToCustomerInfoDelete}
              // onClick={handleDelete}
              className="flex items-center justify-center cursor-pointer"
            >
              <AiOutlineDelete className="w-4 h-4 fill-[#004368] mr-2" />
              <span className="text-[#004368] text-[15px] font-normal leading-normal">
                {selectedLanguage === "zh-CN" ? "删除" : "Delete"}
              </span>
            </button>

            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-[450px] h-64 mx-auto p-6 space-y-4 flex flex-col items-center justify-center">
                  <div className="bg-green-200 w-16 h-16 rounded-full flex items-center justify-center">
                    <AiOutlineCheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-center text-red-600">
                    {selectedLanguage === "zh-CN"
                      ? "确认删除"
                      : "Confirm Delete"}
                  </h2>
                  <p className="text-center">
                    {selectedLanguage === "zh-CN"
                      ? "您确实要删除所选的项目吗？"
                      : "Are you sure you want to delete the selected items?"}
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={handleClose}
                      className="bg-[#004368] bg-opacity-30 text-black hover:bg-opacity-100 hover:text-white px-4 py-1 rounded h-8"
                    >
                      {selectedLanguage === "zh-CN" ? "取消" : "Cancel"}
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="bg-[#004368] text-white px-4 py-1 rounded hover:bg-opacity-30 hover:text-black h-8"
                    >
                      {selectedLanguage === "zh-CN" ? "确认" : "Confirm"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showMessageModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-[450px] h-64 mx-auto p-6 space-y-4 flex flex-col items-center justify-center">
                  <div className="bg-red-200 w-16 h-16 rounded-full flex items-center justify-center">
                    <TiInfoOutline className="w-10 h-10 text-red-600" />
                  </div>
                  <p className="text-red-600">{message}</p>
                  <div className="flex justify-end">
                    <button
                      onClick={handleMessageModalClose}
                      className="bg-[#004368] bg-opacity-30 text-black hover:bg-opacity-100 hover:text-white px-4 py-1 rounded h-8"
                    >
                      {selectedLanguage === "zh-CN" ? "关闭" : "Close"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* right side */}
          <div className="flex items-center justify-end">
            <div>
              <div
                className="bg-[#004368] bg-opacity-10 rounded-md cursor-pointer text-[#004368] mr-5 hover:bg-[#004368] hover:text-white"
                onClick={() =>
                  document.getElementById("my_modal_settings").showModal()
                }
              >
                <button className="flex items-center w-[126px] h-10 py-2 ">
                  <FaPlus className="w-[14px] h-[14px]  ml-3 mr-2 " />
                  <span className=" text-[15px] font-medium capitalize leading-normal ">
                    {selectedLanguage === "zh-CN" ? "新增" : "Add New"}
                  </span>
                </button>
              </div>
              <dialog id="my_modal_settings" className="modal">
                <div className="bg-white w-[750px] h-[640px] rounded-md pt-10">
                  <h3 className="font-bold text-lg pl-5 text-center">
                    {selectedLanguage === "zh-CN"
                      ? "新增收件人"
                      : "Add New Recipient"}
                  </h3>
                  <p className="text-xs pt-1 text-red-500 font-bold text-center">
                    {error ? error : ""}
                  </p>
                  <div className="modal-action w-full pl-10">
                    <form
                      method="dialog"
                      onSubmit={handleModalSubmit}
                      className="w-full"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        {/* Recipient Name */}
                        <div>
                          <label className="form-control w-full">
                            <span className="text-[#004368] text-base font-semibold">
                              {selectedLanguage === "zh-CN"
                                ? "收件人姓名"
                                : "Recipient Name"}
                            </span>
                            <input
                              type="text"
                              name="receiver_name"
                              required
                              placeholder={
                                selectedLanguage === "zh-CN"
                                  ? "输入收件人姓名"
                                  : "Type Recipient Name"
                              }
                              className="input input-bordered w-[300px] bg-transparent"
                              value={formData.receiver_name}
                              onChange={handleInputChange}
                            />
                          </label>
                        </div>

                        {/* User Name */}
                        <div>
                          <label className="form-control w-full">
                            <span className="text-[#004368] text-base font-semibold">
                              {selectedLanguage === "zh-CN"
                                ? "用户电子邮件"
                                : "User Email"}
                            </span>
                            <input
                              type="text"
                              name="userName"
                              readOnly
                              placeholder={
                                selectedLanguage === "zh-CN"
                                  ? "输入用户名"
                                  : "Type User Name"
                              }
                              className="input input-bordered w-[300px] bg-transparent"
                              value={userEmail}
                              // onChange={handleInputChange}
                            />
                          </label>
                        </div>

                        {/* Company Name */}
                        <div>
                          <label className="form-control w-full">
                            <span className="text-[#004368] text-base font-semibold">
                              {selectedLanguage === "zh-CN"
                                ? "公司名称"
                                : "Company Name"}
                            </span>
                            <input
                              type="text"
                              name="company_name"
                              required
                              placeholder={
                                selectedLanguage === "zh-CN"
                                  ? "输入公司名称"
                                  : "Type Company Name"
                              }
                              className="input input-bordered w-[300px] bg-transparent"
                              value={formData.company_name}
                              onChange={handleInputChange}
                            />
                          </label>
                        </div>

                        {/* Country */}
                        <div>
                          <label className="form-control w-full">
                            <span className="text-[#004368] text-base font-semibold">
                              {selectedLanguage === "zh-CN"
                                ? "国家"
                                : "Country"}
                            </span>
                            <input
                              type="text"
                              name="country"
                              readOnly
                              value="中国"
                              className="input input-bordered w-[300px] bg-transparent"
                            />
                          </label>
                        </div>

                        {/* Province */}
                        <div>
                          <label className="form-control w-full">
                            <span className="text-[#004368] text-base font-semibold">
                              {selectedLanguage === "zh-CN" ? "省" : "Province"}
                            </span>
                            <select
                              className="border input-bordered rounded-md py-2 h-12 w-[300px]"
                              required
                              onChange={(e) => {
                                const selectedId = provinces?.find(
                                  (province) =>
                                    province.region_name === e.target.value
                                ).id;
                                filterCityUnderProvince(selectedId);
                              }}
                              onClick={(e) =>
                                setSelectedProvince(e.target.value)
                              }
                            >
                              <option value="">
                                {selectedLanguage === "zh-CN"
                                  ? "选择省份"
                                  : "Select Province"}
                              </option>
                              {provinces?.map((province) => (
                                <option
                                  key={province.id}
                                  value={province.region_name}
                                >
                                  {province.region_name}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>

                        {/* City */}
                        <div>
                          <label className="form-control w-full">
                            <span className="text-[#004368] text-base font-semibold">
                              {selectedLanguage === "zh-CN" ? "城市" : "City"}
                            </span>
                            <select
                              className="border input-bordered rounded-md py-2 h-12 w-[300px]"
                              required
                              onChange={(e) => {
                                const selectedId = cities?.find(
                                  (city) => city.region_name === e.target.value
                                ).id;
                                filterDistrictUnderCity(selectedId);
                              }}
                              onClick={(e) => setSelectedCity(e.target.value)}
                            >
                              <option value="">
                                {selectedLanguage === "zh-CN"
                                  ? "选择城市"
                                  : "Select City"}
                              </option>
                              {cities?.map((city) => (
                                <option key={city.id} value={city.region_name}>
                                  {city.region_name}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>

                        {/* District */}
                        <div>
                          <label className="form-control w-full">
                            <span className="text-[#004368] text-base font-semibold">
                              {selectedLanguage === "zh-CN" ? "区" : "District"}
                            </span>
                            <select
                              className="border input-bordered rounded-md py-2 h-12 w-[300px]"
                              required
                              onClick={(e) =>
                                setSelectedDistricts(e.target.value)
                              }
                            >
                              <option value="">
                                {selectedLanguage === "zh-CN"
                                  ? "选择地区"
                                  : "Select District"}
                              </option>
                              {districts?.map((district) => (
                                <option
                                  key={district.id}
                                  value={district.region_name}
                                >
                                  {district.region_name}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>

                        {/* Address */}
                        <div>
                          <label className="form-control w-full">
                            <span className="text-[#004368] text-base font-semibold">
                              {selectedLanguage === "zh-CN"
                                ? "地址"
                                : "Address"}
                            </span>
                            <input
                              type="text"
                              name="address"
                              required
                              placeholder={
                                selectedLanguage === "zh-CN"
                                  ? "输入地址"
                                  : "Type Address"
                              }
                              className="input input-bordered w-[300px] bg-transparent"
                              value={formData.address}
                              onChange={handleInputChange}
                            />
                          </label>
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="form-control w-full">
                            <span className="text-[#004368] text-base font-semibold">
                              {selectedLanguage === "zh-CN" ? "电话" : "Phone"}
                            </span>
                            <input
                              type="text"
                              name="receiver_phone"
                              required
                              placeholder={
                                selectedLanguage === "zh-CN"
                                  ? "输入座机电话"
                                  : "Type Landline"
                              }
                              className="input input-bordered w-[300px] bg-transparent"
                              value={formData.receiver_phone}
                              onChange={handleInputChange}
                            />
                          </label>
                        </div>

                        {/* operate */}
                        <div>
                          <label className="form-control w-full">
                            <span className="text-[#004368] text-base font-semibold">
                              {selectedLanguage === "zh-CN"
                                ? "操作"
                                : "Operate"}
                            </span>
                            <input
                              type="text"
                              name="operate"
                              required
                              placeholder={
                                selectedLanguage === "zh-CN"
                                  ? "输入操作"
                                  : "Type Operate"
                              }
                              className="input input-bordered w-[300px] bg-transparent"
                              value={formData.operate}
                              onChange={handleInputChange}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="flex justify-end pr-12 pt-2">
                        <p
                          className="bg-[#004368] bg-opacity-30 hover:bg-[#004368] text-black hover:text-white w-[100px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mt-5 mr-3"
                          onClick={() =>
                            document.getElementById("my_modal_settings").close()
                          }
                        >
                          {selectedLanguage === "zh-CN" ? "关闭" : "Close"}
                        </p>
                        <button
                          className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[100px] h-10 px-2 py-2 rounded-md cursor-pointer text-center mt-5"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? (
                            <span>
                              <ClipLoader color="#0f0722" size={30} />
                            </span>
                          ) : (
                            <span>
                              {selectedLanguage === "zh-CN" ? "保存" : "Save"}
                            </span>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>
            <button
              onClick={handleRecipientInfoExcelClick}
              className="bg-[#004368] hover:bg-opacity-30 text-white hover:text-black w-[115px] h-10 px-8 py-2 rounded-md cursor-pointer"
            >
              <p className="text-[15px] font-medium capitalize cursor-pointer">
                {selectedLanguage === "zh-CN" ? "导出" : "Export"}
              </p>
            </button>
          </div>
        </div>

        {/* middle table */}
        <div className="mt-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-28">
              <FadeLoader color="#004368" size={25} />
              <p className="text-2xl font-medium pt-10 text-[#004368]">
                {selectedLanguage === "zh-CN"
                  ? "数据正在加载，请稍候..."
                  : "Data is Loading. Please Wait..."}
              </p>
            </div>
          ) : isError || !clients ? (
            <p className="text-center text-3xl text-red-500 font-medium py-20">
              {selectedLanguage === "zh-CN"
                ? "未找到数据。请稍后再试..."
                : "Data Not Found. Please try again later...."}
            </p>
          ) : (
            <table className="table">
              <thead className="">
                <tr className="h-11 text-black text-opacity-80 capitalize text-center text-sm font-light">
                  <th className="sticky top-0 flex items-center bg-[#0043681A] bg-opacity-80 rounded-l-md">
                    <input
                      type="checkbox"
                      id="selectAll"
                      name="selectAll"
                      value="selectAll"
                      checked={selectAll}
                      onChange={handleMasterCheckboxChange}
                      className="w-4 h-4 rounded-[2px] text-[#004368] text-opacity-60 bg-[#004368] cursor-pointer"
                    />
                    <span className=" text-black opacity-80 capitalize text-center text-[15px] font-light leading-normal ml-3">
                      {selectedLanguage === "zh-CN"
                        ? "收件人姓名"
                        : "recipient name"}
                    </span>
                    <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                  </th>
                  <th className="sticky top-0 bg-[#0043681A] bg-opacity-80 text-black opacity-80 capitalize text-center text-[15px] font-light leading-normal">
                    <span className="mr-2">
                      {selectedLanguage === "zh-CN"
                        ? "公司名称"
                        : "Company Name"}
                    </span>
                    <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                  </th>
                  <th className="sticky top-0 bg-[#0043681A] bg-opacity-80 text-black opacity-80 capitalize text-center text-[15px] font-light leading-normal">
                    <span className="mr-2">
                      {selectedLanguage === "zh-CN" ? "地址" : "Address"}
                    </span>
                    <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                  </th>
                  <th className="sticky top-0 bg-[#0043681A] bg-opacity-80 text-black opacity-80 capitalize text-center text-[15px] font-light leading-normal">
                    <span className="mr-2">
                      {selectedLanguage === "zh-CN" ? "座机电话" : "landline"}
                    </span>
                    <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                  </th>
                  <th className="sticky top-0 bg-[#0043681A] bg-opacity-80 text-black opacity-80 capitalize text-center text-[15px] font-light leading-normal">
                    <span className="mr-2">
                      {selectedLanguage === "zh-CN" ? "邮政编码" : "post code"}
                    </span>
                    <div className="absolute h-8 my-auto top-0 bottom-0 right-0 w-[1px] bg-white mx-2"></div>
                  </th>
                  <th className="sticky top-0 bg-[#0043681A] bg-opacity-80 text-black opacity-80 capitalize text-center text-[15px] font-light leading-normal rounded-r-md">
                    {selectedLanguage === "zh-CN" ? " 操作" : "operate"}
                  </th>
                </tr>
              </thead>
              <tbody className="max-h-[590px] overflow-y-auto">
                {filteredAllClient?.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-[#0043681A] cursor-pointer"
                  >
                    <td>
                      <input
                        type="checkbox"
                        id="selectAll"
                        name="client"
                        value={client.id}
                        checked={checkedItems.some(
                          (item) => item?.id === client?.id
                        )}
                        onChange={() => handleCheckboxChange(client)}
                        className="w-4 h-4 rounded-[2px] text-[#004368] text-opacity-60 bg-[#004368] cursor-pointer"
                      />
                      <span className="ml-3 text-black opacity-80 capitalize text-center text-[15px] font-light leading-normal">
                        {client.receiver_name}
                      </span>
                    </td>
                    <td className="text-center text-black opacity-80 capitalize text-[15px] font-light leading-normal">
                      {client.company_name}
                    </td>
                    <td className="text-center text-black opacity-80 capitalize text-[15px] font-light leading-normal">
                      {client.address}
                    </td>
                    <td className="text-center text-black opacity-80 capitalize text-[15px] font-light leading-normal">
                      {client.receiver_phone}
                    </td>
                    <td className="text-center text-black opacity-80 capitalize text-[15px] font-light leading-normal">
                      {client.city}
                    </td>
                    <td className="text-center text-black opacity-80 capitalize text-[15px] font-light leading-normal">
                      {client.operate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className=" mr-5">
        <div className="flex justify-center space-x-1 dark:text-gray-100">
          <button
            onClick={() => handleToPrevious(currentBar - 1)}
            title="previous"
            type="button"
            className="inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow-md bg-white dark:border-gray-800"
          >
            <svg
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              fill="[#0043681A]"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            onClick={() => handleToShowCurrentBarData(currentBar)}
            type="button"
            title="Page 1"
            className={` inline-flex items-center justify-center w-8 h-8 text-sm font-semibold border rounded shadow-md bg-white  ${
              currentBar === showPage ? "text-[#004368]" : ""
            }`}
          >
            {currentBar}
          </button>
          <button
            onClick={() => handleToShowCurrentBarData(currentBar + 1)}
            type="button"
            className={`text-[#004368] text-opacity-20 inline-flex items-center justify-center w-8 h-8 text-sm border rounded shadow-md bg-white border-gray-800 ${
              currentBar === showPage ? "text-[#004368]" : ""
            } `}
            title="Page 2"
          >
            {currentBar + 1 > totalPart ? ".." : currentBar + 1}
          </button>
          <button
            onClick={() => handleToShowCurrentBarData(currentBar + 2)}
            type="button"
            className={`text-[#004368] text-opacity-20 inline-flex items-center justify-center w-8 h-8 text-sm border rounded shadow-md bg-white border-gray-800 ${
              currentBar === showPage ? "text-[#004368]" : ""
            }`}
            title="Page 3"
          >
            {currentBar + 2 > totalPart ? ".." : currentBar + 2}
          </button>
          <button
            onClick={() => handleToNext(currentBar + 1)}
            title="next"
            type="button"
            className={`inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow-md bg-white dark:border-gray-800 ${
              leftPaginationBtn ? "border-black" : ""
            } `}
          >
            <svg
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              fill="[#0043681A]"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
