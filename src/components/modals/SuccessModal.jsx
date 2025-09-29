// components/SuccessModal.js
import React from "react";
import { Modal } from "antd";

const SuccessModal = ({ open, onOk, modalMessage }) => {
  return (
    <Modal
      open={open}
      onOk={onOk}
      onCancel={onOk}
      footer={[
        <button
          key="ok"
          onClick={onOk}
          className="bg-black text-white rounded-lg px-6 py-3 mt-6 hover:bg-black-900 mx-auto w-full font-bold text-base"
        >
          Got it
        </button>,
      ]}
      centered
    >
      <div className="text-center space-y-6 pt-5">
        <div className="flex items-center justify-center">
          <svg
            width="74"
            height="74"
            viewBox="0 0 74 74"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_1537_3936)">
              <path
                d="M37 74C57.4345 74 74 57.4345 74 37C74 16.5655 57.4345 0 37 0C16.5655 0 0 16.5655 0 37C0 57.4345 16.5655 74 37 74Z"
                fill="#729897"
              />
              <path
                d="M27.5469 53.691L46.5721 72.7162C62.3292 68.5143 74.0011 54.1578 74.0011 37.0001C74.0011 36.6499 74.0011 36.2998 74.0011 35.9496L59.0611 22.1768L27.5469 53.691Z"
                fill="#618483"
              />
              <path
                d="M37.9328 45.2867C39.5669 46.9208 39.5669 49.722 37.9328 51.3561L34.548 54.741C32.9139 56.375 30.1127 56.375 28.4786 54.741L13.6552 39.8009C12.0212 38.1668 12.0212 35.3656 13.6552 33.7315L17.0401 30.3466C18.6742 28.7126 21.4754 28.7126 23.1095 30.3466L37.9328 45.2867Z"
                fill="white"
              />
              <path
                d="M50.8879 19.4922C52.522 17.8581 55.3232 17.8581 56.9573 19.4922L60.3422 22.877C61.9762 24.5111 61.9762 27.3123 60.3422 28.9464L34.6639 54.5079C33.0299 56.142 30.2286 56.142 28.5945 54.5079L25.2097 51.1231C23.5756 49.489 23.5756 46.6877 25.2097 45.0537L50.8879 19.4922Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_1537_3936">
                <rect width="74" height="74" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="">
          <h2 className="text-2xl font-bold mb-1">Successfull</h2>

          <p className="text-black-600">{modalMessage}</p>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;
