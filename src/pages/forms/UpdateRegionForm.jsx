import BackToPrev from "../../components/shared/back/BackToPrev";
import SuccessModal from "../../components/modals/SuccessModal";
import { useUpdateRegion } from "../../hooks/features/useRegions";
import NotifyContainer from "../../utils/getNotify";
import { NotificationDeleteIcon } from "../../utils/svgs";

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
    imagePreview,
    fileInputRef,
    typeError,
    handleFileDelete,
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

            {/* Image */}
            <div className="flex flex-col gap-1">
              <span className="text-blackHigh">Image</span>
              <div>
                <div className="w-full relative">
                  <input
                    type="file"
                    id="imageId"
                    className="absolute opacity-0"
                    ref={fileInputRef}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleChange("file", e.target.files[0]);
                    }}
                  />
                  <label
                    htmlFor="imageId"
                    className={`flex items-center gap-2 py-1.5 px-1.5 border ${
                      errors.file ? "border-red-500" : "border-slateLow"
                    } rounded-lg cursor-pointer`}
                  >
                    {!imagePreview && (
                      <span className="inline-block px-4 py-2 bg-fadeColor text-white text-sm rounded-lg">
                        Choose File
                      </span>
                    )}
                    {!imagePreview ? (
                      <span className="text-xs text-blackSemi">
                        Upload Image
                      </span>
                    ) : (
                      <span className="flex justify-between w-full items-center">
                        <span className="flex items-center gap-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-9 h-9 rounded-sm bg-center object-cover"
                          />
                          <p className="text-blackSemi text-base whitespace-nowrap overflow-hidden text-ellipsis">
                            {formData.file?.name?.substring(0, 25)}
                          </p>
                        </span>
                        <button
                          type="button"
                          className="flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFileDelete();
                          }}
                        >
                          <NotificationDeleteIcon />
                        </button>
                      </span>
                    )}
                  </label>
                </div>
                {typeError && (
                  <p className="text-xs text-errorColor mt-1 font-medium">
                    Only JPG, JPEG or PNG file are supported
                  </p>
                )}
                {errors.file && (
                  <span className="text-red-500 text-sm">{errors.file}</span>
                )}
              </div>
            </div>
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
