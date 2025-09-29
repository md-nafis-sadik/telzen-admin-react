import React from "react";

const ApproveModal = ({ handleStatus, status, modalClose }) => {
  return (
    <section>
      <input type="checkbox" id="approvePopup" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-[550px] flex flex-col items-center justify-center gap-6 bg-white px-12 py-8">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="114"
              height="126"
              viewBox="0 0 114 126"
              fill="none"
            >
              <path
                opacity="0.4"
                d="M0.749988 100.5L0.749978 25.5C0.749976 11.6929 11.9429 0.500004 25.75 0.500002L69.5 0.499996L113.25 44.25L113.25 100.5C113.25 114.307 102.057 125.5 88.25 125.5L25.75 125.5C11.9429 125.5 0.74999 114.307 0.749988 100.5Z"
                fill="#2CC672"
              />
              <path
                d="M69.5 19.25L69.5 0.5L113.25 44.25L94.5 44.25C80.6929 44.25 69.5 33.0571 69.5 19.25Z"
                fill="#2CC672"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M78.8369 59.4724C80.7852 61.1771 80.9826 64.1385 79.2779 66.0868L61.341 86.5861C57.4866 90.9911 50.8476 91.5809 46.277 87.9245L35.3219 79.1604C33.3004 77.5432 32.9726 74.5933 34.5898 72.5718C36.2071 70.5503 39.1569 70.2225 41.1784 71.8397L52.1336 80.6038C52.7865 81.1262 53.7349 81.0419 54.2856 80.4127L72.2225 59.9133C73.9272 57.965 76.8886 57.7676 78.8369 59.4724Z"
                fill="#2CC672"
              />
            </svg>
          </div>
          <div className="text-center">
            <h4 className=" text-successHigh text-4xl font-bold ">Approve</h4>
            <p className="text-2xl text-blackLow mt-2">
              Are you sure to approve?
            </p>
          </div>
          <div className="modal-action flex items-center justify-center gap-6">
            <label
              htmlFor="approvePopup"
              className="btn bg-fadeColor hover:bg-fadeColor text-white text-base font-semibold w-full max-w-[200px]"
            >
              Cancel
            </label>
            <label
              htmlFor="approvePopup"
              onClick={handleStatus}
              className="btn bg-errorColor hover:bg-errorColor text-white text-base font-semibold w-full max-w-[200px]"
            >
              Approve
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApproveModal;
