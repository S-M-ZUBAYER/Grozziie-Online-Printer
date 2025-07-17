// Modal.js
import React from "react";

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black opacity-75 z-50">
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white bg-opacity-100 rounded-md w-[1368px] h-[907px] px-12 py-16">
          <div className="grid grid-cols-5"></div>
          <button className="mt-4 p-2 bg-blue-500 text-white" onClick={onClose}>
            Close Modal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
