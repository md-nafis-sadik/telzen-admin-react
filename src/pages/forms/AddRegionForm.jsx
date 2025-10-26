import BackToPrev from "../../components/shared/back/BackToPrev";
import SuccessModal from "../../components/modals/SuccessModal";
import NotifyContainer from "../../utils/getNotify";
import { useAddRegion } from "../../hooks/features/useRegions";
import { NotificationDeleteIcon } from "../../utils/svgs";

const AddRegionForm = () => {
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
    coverImagePreview,
    imageInputRef,
    coverImageInputRef,
    typeError,
    handleFileDelete,
    isSubmitting,
  } = useAddRegion();

  return (
    <section className="px-8 py-6 h-full overflow-auto">
      <div className="bg-white p-6 rounded-2xl">
        <BackToPrev path="/package-regions" title="Add Region" />
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-black-700">
                Region Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter region name"
                className={`w-full border placeholder:text-disabled ${
                  errors.name ? "border-red-500" : "border-natural-400"
                } text-blackLow rounded-lg outline-none py-3 px-4`}
                value={formData.name}
                onChange={(e) => {
                  e.stopPropagation();
                  handleChange("name", e.target.value);
                }}
                maxLength={100}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>

            {/* Thumbnail */}
            <div className="flex flex-col gap-1">
              <span className="text-blackHigh">Thumbnail</span>
              <div>
                <div className="w-full relative">
                  <input
                    type="file"
                    id="imageId"
                    className="absolute opacity-0"
                    ref={imageInputRef}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleChange("image", e.target.files[0]);
                    }}
                  />

                  <label
                    htmlFor="imageId"
                    className={`flex items-center gap-2 py-1.5 px-1.5 border ${
                      errors.file ? "border-red-500" : "border-slateLow"
                    } rounded-lg cursor-pointer`}
                  >
                    {!imagePreview && (
                      <>
                        <span className="inline-block px-4 py-2 bg-fadeColor text-white text-sm rounded-lg">
                          Choose File
                        </span>
                        <span className="text-xs text-blackSemi">
                          Upload Thumbnail
                        </span>
                      </>
                    )}

                    {imagePreview && (
                      <span className="flex items-center gap-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-9 h-9 rounded-sm bg-center object-cover"
                        />
                        <p className="text-blackSemi text-base whitespace-nowrap overflow-hidden text-ellipsis">
                          {formData.image?.name?.substring(0, 25)}
                        </p>
                      </span>
                    )}
                  </label>

                  {/* Delete button moved outside the label */}
                  {imagePreview && (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFileDelete("image");
                      }}
                    >
                      <NotificationDeleteIcon />
                    </button>
                  )}
                </div>

                {typeError && (
                  <p className="text-xs text-errorColor mt-1 font-medium">
                    Only JPG, JPEG or PNG file are supported
                  </p>
                )}
                {errors.image && (
                  <span className="text-red-500 text-sm">{errors.image}</span>
                )}
              </div>
            </div>

            {/* Cover Image */}
            <div className="flex flex-col gap-1">
              <span className="text-blackHigh">Cover Image</span>
              <div>
                <div className="w-full relative">
                  <input
                    type="file"
                    id="coverImageId"
                    className="absolute opacity-0"
                    ref={coverImageInputRef}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleChange("cover_image", e.target.files[0]);
                    }}
                  />

                  <label
                    htmlFor="coverImageId"
                    className={`flex items-center gap-2 py-1.5 px-1.5 border ${
                      errors.cover_image ? "border-red-500" : "border-slateLow"
                    } rounded-lg cursor-pointer`}
                  >
                    {!coverImagePreview && (
                      <>
                        <span className="inline-block px-4 py-2 bg-fadeColor text-white text-sm rounded-lg">
                          Choose File
                        </span>
                        <span className="text-xs text-blackSemi">
                          Upload Thumbnail
                        </span>
                      </>
                    )}

                    {coverImagePreview && (
                      <span className="flex items-center gap-2">
                        <img
                          src={coverImagePreview}
                          alt="Preview"
                          className="w-9 h-9 rounded-sm bg-center object-cover"
                        />
                        <p className="text-blackSemi text-base whitespace-nowrap overflow-hidden text-ellipsis">
                          {formData.cover_image?.name?.substring(0, 25)}
                        </p>
                      </span>
                    )}
                  </label>

                  {coverImagePreview && (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFileDelete("cover_image");
                      }}
                    >
                      <NotificationDeleteIcon />
                    </button>
                  )}
                </div>
                {typeError && (
                  <p className="text-xs text-errorColor mt-1 font-medium">
                    Only JPG, JPEG or PNG file are supported
                  </p>
                )}
                {errors.cover_image && (
                  <span className="text-red-500 text-sm">
                    {errors.cover_image}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/package-regions")}
              className="btn w-auto h-12 px-6 py-2 bg-white text-black uppercase border border-neutral-500 hover:bg-neutral-100 hover:text-primaryColor hover:border-neutral-700 disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn w-auto h-12 px-6 bg-black hover:bg-black-900 uppercase text-white hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={!isFormValid || isLoading || isSubmitting}
            >
              {isLoading ? <>Processing...</> : "Done"}
            </button>
          </div>
        </form>
      </div>

      <SuccessModal
        open={isModalVisible}
        onOk={handleModalOk}
        modalMessage="Region Added Successfully!"
      />
      <NotifyContainer />
    </section>
  );
};

export default AddRegionForm;
