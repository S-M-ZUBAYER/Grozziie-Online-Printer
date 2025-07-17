import React from "react";

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
  showConfirmButton,
  showOkButton,
  selectedLanguage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[500px] h-72 flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="my-5">{message}</p>
        <div className="flex justify-end space-x-2 mt-5">
          <button
            onClick={onClose}
            className="bg-[#004368] bg-opacity-30 text-black hover:bg-opacity-100 hover:text-white px-4 py-1 rounded h-8"
          >
            {
              showOkButton ? selectedLanguage === "zh-CN" ? "确认" : "Ok" : selectedLanguage === "zh-CN" ? "取消" : "Cancel"
            }

          </button>
          {/* {showOkButton &&
            <button
              onClick={onClose}
              className="bg-[#004368] bg-opacity-30 text-black hover:bg-opacity-100 hover:text-white px-4 py-1 rounded h-8"
            >
              {selectedLanguage === "zh-CN" ? "确认" : "Ok"}

            </button>
          } */}


          {showConfirmButton && (
            <button
              onClick={onConfirm}
              className="bg-[#004368] text-white px-4 py-1 rounded hover:bg-opacity-30 hover:text-black h-8"
            >
              {selectedLanguage === "zh-CN" ? "确认" : "Confirm"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
