import BackToPrev from "../../components/shared/back/BackToPrev";

function BusinessDetailsForm() {

  return (

      <div className="bg-white p-6 rounded-2xl mb-6">
        <BackToPrev path="/" title="Business Details"></BackToPrev>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Contact Person name</span>
              <input
                type="text"
                placeholder="Contact Person name"
                className={`w-full border placeholder:text-disabled border-natural-400
                  text-blackLow rounded-lg outline-none py-3 px-4`}
                value=""
                name="name"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-black-700">Business Name here</span>
              <input
                type="text"
                placeholder="Business Name here"
                className={`w-full border placeholder:text-disabled border-natural-400
                  text-blackLow rounded-lg outline-none py-3 px-4`}
                value=""
                name="name"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-black-700">Email</span>
              <input
                type="text"
                placeholder="businessemail@gmail.com"
                className={`w-full border placeholder:text-disabled border-natural-400
                  text-blackLow rounded-lg outline-none py-3 px-4`}
                value=""
                name="name"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-black-700">Country</span>
              <input
                type="text"
                placeholder="Country"
                className={`w-full border placeholder:text-disabled border-natural-400
                  text-blackLow rounded-lg outline-none py-3 px-4`}
                value=""
                name="name"
              />
            </div>

            <div className="flex gap-4 items-center w-max cursor-pointer">
              <span className="text-[#0A0A0A] text-lg font-medium">Uploaded document.pdf</span>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM14 13V17H10V13H7L11.65 8.35C11.85 8.15 12.16 8.15 12.36 8.35L17 13H14Z" fill="#2D8EFF"/>
                </svg>
              </span>
            </div>
           
          </div>

      </div>

  );
}

export default BusinessDetailsForm;
