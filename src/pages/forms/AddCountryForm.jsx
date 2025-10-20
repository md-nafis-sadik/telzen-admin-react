import { Select } from "antd";
import BackToPrev from "../../components/shared/back/BackToPrev";
import SuccessModal from "../../components/modals/SuccessModal";
import ReactCountryFlag from "react-country-flag";
import NotifyContainer from "../../utils/getNotify";
import { useAddCountry } from "../../hooks/features/useCountrys";
import SkeletonBox from "../../shared/custom/CustomSkeletonBox";
import { NotificationDeleteIcon } from "../../utils/svgs";

function AddCountryForm() {
  const {
    isModalVisible,
    handleChange,
    handleSubmit,
    handleModalOk,
    isFormValid,
    errors,
    formData,
    navigate,
    regions,
    countries,
    isRegionsLoading,
    isCountriesLoading,
    isSubmitting,
    imagePreview,
    fileInputRef,
    typeError,
    handleFileDelete,
  } = useAddCountry();

  return (
    <section className="px-8 py-6 h-full overflow-auto">
      <div className="bg-white p-6 rounded-2xl">
        <BackToPrev path="/package-countries" title="Add Country"></BackToPrev>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
            {/* Country (Single Select) */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Country</span>
              {isCountriesLoading ? (
                <SkeletonBox className="w-full h-12" />
              ) : (
                <Select
                  className={`w-full border ${
                    errors.country ? "!border-red-500" : "border-natural-400"
                  } rounded-lg
                [&_.ant-select-selector]:!h-12
                [&_.ant-select-selector]:!px-4
                [&_.ant-select-selector]:!flex
                [&_.ant-select-selector]:!items-center
                [&_.ant-select-selector]:!leading-[3.5rem]`}
                  placeholder="Select a country"
                  value={formData.code}
                  onChange={(value) => handleChange("code", value)}
                  status={errors.code ? "error" : ""}
                  loading={isCountriesLoading}
                  showSearch
                  optionFilterProp="label"
                >
                  {countries.map((country) => (
                    <Select.Option
                      key={country.code}
                      value={country.code}
                      label={country.name}
                    >
                      <div className="flex items-center gap-3">
                        <ReactCountryFlag
                          countryCode={country.code}
                          svg
                          style={{ width: "20px", height: "15px" }}
                        />
                        <span>{country.name}</span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              )}
              {errors.code && (
                <span className="text-red-500 text-sm">{errors.code}</span>
              )}
            </div>

            {/* Region */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Region</span>
              {isRegionsLoading ? (
                <SkeletonBox className="w-full h-12" />
              ) : (
                <Select
                  className={`w-full border ${
                    errors.region ? "!border-red-500" : "border-natural-400"
                  } rounded-lg
                  [&_.ant-select-selector]:!h-12
                  [&_.ant-select-selector]:!px-4
                  [&_.ant-select-selector]:!flex
                  [&_.ant-select-selector]:!items-center
                  [&_.ant-select-selector]:!leading-[3.5rem]`}
                  placeholder="Select Region"
                  value={formData.region}
                  onChange={(value) => handleChange("region", value)}
                  status={errors.region ? "error" : ""}
                  loading={isRegionsLoading}
                >
                  {regions.map((region) => (
                    <Select.Option key={region._id} value={region._id}>
                      {region.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
              {errors.region && (
                <span className="text-red-500 text-sm">{errors.region}</span>
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
              onClick={() => navigate("/package-countries")}
              className="btn w-auto h-12 px-6 py-2 bg-white text-black uppercase border border-neutral-500 hover:bg-neutral-100 hover:text-primaryColor hover:border-neutral-700"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn w-auto h-12 px-6 bg-black hover:bg-black-900 uppercase text-white hover:text-white disabled:text-white"
              disabled={
                !isFormValid ||
                isRegionsLoading ||
                isCountriesLoading ||
                isSubmitting
              }
            >
              {isSubmitting ? "Processing..." : "Done"}
            </button>
          </div>
        </form>
      </div>

      <SuccessModal
        open={isModalVisible}
        onOk={handleModalOk}
        modalMessage="Country Added Successfully!"
      />
      <NotifyContainer />
    </section>
  );
}

export default AddCountryForm;
