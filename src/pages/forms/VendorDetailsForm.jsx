import BackToPrev from "../../components/shared/back/BackToPrev";
import DocumentShow from "../../shared/ui/DocumentShow";
import ReactCountryFlag from "react-country-flag";

function VendorDetailsForm({ vendor, isLoading, activeTab }) {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl mb-6">
        <div className="mb-6">
          <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse mb-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="h-5 w-32 bg-neutral-200 rounded animate-pulse mb-2"></div>
              <div className="h-12 w-full bg-neutral-100 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="h-5 w-32 bg-neutral-200 rounded animate-pulse mt-2"></div>
      </div>
    );
  }

  return (

      <div className="bg-white p-6 rounded-2xl mb-6">
        <BackToPrev path={`/vendors/${activeTab}`} title="Vendor Details"></BackToPrev>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Contact Person Name</span>
              <input
                type="text"
                placeholder="Contact Person name"
                className={`w-full border placeholder:text-disabled border-natural-400
                  text-blackLow rounded-lg outline-none py-3 px-4 bg-neutral-50`}
                value={vendor?.contact_person_name || ""}
                name="name"
                disabled
                readOnly
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-black-700">Vendor Name</span>
              <input
                type="text"
                placeholder="Vendor Name here"
                className={`w-full border placeholder:text-disabled border-natural-400
                  text-blackLow rounded-lg outline-none py-3 px-4 bg-neutral-50`}
                value={vendor?.business_name || ""}
                name="name"
                disabled
                readOnly
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-black-700">Email</span>
              <input
                type="text"
                placeholder="vendoremail@gmail.com"
                className={`w-full border placeholder:text-disabled border-natural-400
                  text-blackLow rounded-lg outline-none py-3 px-4 bg-neutral-50`}
                value={vendor?.email || ""}
                name="email"
                disabled
                readOnly
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-black-700">Country</span>
              <div className="w-full border border-natural-400 bg-neutral-50 rounded-lg py-3 px-4 flex items-center gap-2">
                {vendor?.country?.code && (
                  <ReactCountryFlag
                    countryCode={vendor.country.code}
                    svg
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                )}
                <span className="text-blackLow">
                  {vendor?.country?.name || ""}
                </span>
              </div>
            </div>

            {vendor?.document && (
              <div className="flex gap-4 items-center w-max">
                <DocumentShow
                  title={vendor.document.original_name}
                  fileUrl={vendor.document.path}
                />
              </div>
            )}
          </div>
      </div>);
}

export default VendorDetailsForm;
