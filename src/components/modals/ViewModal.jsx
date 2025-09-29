import React from "react";

const ViewModal = ({ data }) => {
  return (
    <section>
      <input type="checkbox" id="viewPopup" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-[550px] gap-6 p-0 bg-transparent shadow-none">
          <div className="text-end mb-4">
            <label
              htmlFor="viewPopup"
              className="inline-flex items-center justify-center w-8 h-8 bg-errorColor rounded-full cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M16.2431 7.75738L7.75781 16.2427M16.2431 16.2426L7.75781 7.75732"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
          </div>
          <div className="bg-whiteLow roundex rounded-xl p-4">
            <h4 className="text-center py-2 pb-4 text-2xl font-bold">
              Payout Details
            </h4>
            <div className="flex flex-col gap-2 bg-white rounded-xl p-4">
              <p>
                <span className="font-bold">Name: </span>
                {data?.fullName}
              </p>
              <p>
                <span className="font-bold">Contact: </span>
                {data?.contact}
              </p>
              <p>
                <span className="font-bold">Address: </span>
                {data?.address}
              </p>
              <p>
                <span className="font-bold">Payout Amount: </span>
                {data?.payoutAmount}
              </p>
              <p>
                <span className="font-bold">Bank Name: </span>
                {data?.bankName}
              </p>
              <p>
                <span className="font-bold">Account Number: </span>
                {data?.bankAccountNumber}
              </p>
              <p>
                <span className="font-bold">Payout Date: </span>
                {new Date(data?.createdAt * 1000).toLocaleDateString("en-US")}
              </p>
              <p>
                <span className="font-bold">Notes: </span> {data?.notes}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewModal;
