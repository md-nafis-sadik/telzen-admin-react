import { Select } from "antd";
import BackToPrev from "../../components/shared/back/BackToPrev";
import SuccessModal from "../../components/modals/SuccessModal";
import ReactCountryFlag from "react-country-flag";
import NotifyContainer from "../../utils/getNotify";
import { useUpdateCountry } from "../../hooks/features/useCountrys";
import SkeletonBox from "../../shared/custom/CustomSkeletonBox";

function UpdateCountryForm() {
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
    isRegionLoading,
    isCountryLoading,
    isSubmitting,
  } = useUpdateCountry();

  return (
    <section className="px-8 py-6 h-full overflow-auto">
      <div className="bg-white p-6 rounded-2xl">
        <BackToPrev
          path="/package-countries"
          title="Update Country"
        ></BackToPrev>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-y-4 gap-x-12">
            {/* Country (Disabled Select) */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Country</span>

              {isCountryLoading ? (
                <SkeletonBox className="w-full h-12" />
              ) : (
                <Select
                  className={`w-full border ${
                    errors.code ? "!border-red-500" : "border-natural-400"
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
                  loading={isCountryLoading}
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    option.children[1]
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  disabled={!!formData._id} // Disable if editing existing country
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
              {isRegionLoading ? (
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
                  loading={isRegionLoading}
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
                isRegionLoading ||
                isCountryLoading ||
                isSubmitting
              }
            >
              {isSubmitting ? "Processing..." : "Update"}
            </button>
          </div>
        </form>
      </div>

      <SuccessModal
        open={isModalVisible}
        onOk={handleModalOk}
        modalMessage="Country Updated Successfully!"
      />
      <NotifyContainer></NotifyContainer>
    </section>
  );
}

export default UpdateCountryForm;
