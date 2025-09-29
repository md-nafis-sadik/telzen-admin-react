import BackToPrev from "../../components/shared/back/BackToPrev";
import SuccessModal from "../../components/modals/SuccessModal";
import { useUpdateRegion } from "../../hooks/features/useRegions";
import NotifyContainer from "../../utils/getNotify";

function UpdateRegionForm() {
  const {
    isModalVisible,
    isLoading,
    handleChange,
    handleSubmit,
    handleModalOk,
    isFormValid,
    errors,
    formData,
    navigate,
  } = useUpdateRegion();

  return (
    <section className="px-8 py-6 h-full overflow-auto">
      <div className="bg-white p-6 h-[756px] rounded-2xl">
        <BackToPrev path="/package-regions" title="Update Region" />
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-y-4 gap-x-12">
            {/* Region Name */}
            <div className="flex flex-col gap-1">
              <label className="text-black-700">Region Name</label>
              <input
                type="text"
                placeholder="Enter region name"
                className={`w-full border placeholder:text-disabled ${
                  errors.name ? "border-red-500" : "border-natural-400"
                } text-blackLow rounded-lg outline-none py-3 px-4`}
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>

            {/* Status Field */}
            {/* <div className="flex flex-col gap-1">
              <label className="text-black-700">Status</label>
              <select
                className={`w-full border ${
                  errors.status ? "border-red-500" : "border-natural-400"
                } text-blackLow rounded-lg outline-none py-3 px-4`}
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.status && (
                <span className="text-red-500 text-sm">{errors.status}</span>
              )}
            </div> */}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/package-regions")}
              className="btn w-auto h-12 px-6 py-2 bg-white text-black uppercase border border-neutral-500 hover:bg-neutral-100 hover:text-primaryColor hover:border-neutral-700"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn w-auto h-12 px-6 bg-black hover:bg-black-900 uppercase text-white hover:text-white disabled:opacity-50"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Processing..." : "Done"}
            </button>
          </div>
        </form>
      </div>

      <SuccessModal
        open={isModalVisible}
        onOk={handleModalOk}
        modalMessage="Region Updated Successfully!"
      />
      <NotifyContainer />
    </section>
  );
}

export default UpdateRegionForm;
