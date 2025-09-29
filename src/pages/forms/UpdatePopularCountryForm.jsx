import { Select, Tag } from "antd";
import BackToPrev from "../../components/shared/back/BackToPrev";
import SuccessModal from "../../components/modals/SuccessModal";
import { useUpdatePopularCountry } from "../../hooks/features/usePopularCountries";
import NotifyContainer from "../../utils/getNotify";
import ReactCountryFlag from "react-country-flag";
import SkeletonBox from "../../shared/custom/CustomSkeletonBox";

function UpdatePopularCountryForm() {
  const {
    isModalVisible,
    handleChange,
    handleSubmit,
    handleModalOk,
    isFormValid,
    errors,
    formData,
    navigate,
    countries,
    isCountryLoading,
    isSubmitting,
    tagRender,
    dropdownRender,
    sortedCountries,
  } = useUpdatePopularCountry();

  return (
    <section className="px-8 py-6 h-full overflow-auto">
      <div className="bg-white p-6 rounded-2xl">
        <BackToPrev
          path="/popular-country"
          title="Update Popular Country"
        ></BackToPrev>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-y-4 gap-x-12">
            {/* Main Country */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">User Country</span>
              {isCountryLoading ? (
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
                  value={formData.country_id}
                  onChange={(value) => handleChange("country_id", value)}
                  status={errors.country ? "error" : ""}
                  loading={isCountryLoading}
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {countries.map((country) => (
                    <Select.Option
                      key={country._id}
                      value={country._id}
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
              {errors.country_id && (
                <span className="text-red-500 text-sm">
                  {errors.country_id}
                </span>
              )}
            </div>

            {/* Feature Countries */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Popular Countries</span>
              {isCountryLoading ? (
                <SkeletonBox className="w-full h-12" />
              ) : (
                <Select
                  mode="multiple"
                  className={`w-full border ${
                    errors.feature_countries
                      ? "!border-red-500"
                      : "border-natural-400"
                  } rounded-lg [&_.ant-select-selector]:!h-12 [&_.ant-select-selection-placeholder]:!px-2 [&_.ant-select-selector]:!px-3 [&_.ant-select-selector]:!flex [&_.ant-select-selector]:!items-center [&_.ant-select-selector]:!leading-[3.5rem]`}
                  placeholder="Select feature countries"
                  value={formData.feature_countries}
                  onChange={(value) => handleChange("feature_countries", value)}
                  status={errors.feature_countries ? "error" : ""}
                  tagRender={tagRender}
                  maxTagCount={2}
                  showSearch
                  optionFilterProp="label"
                  dropdownRender={dropdownRender}
                >
                  {sortedCountries.map((country) => (
                    <Select.Option
                      key={country._id}
                      value={country._id}
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
              {errors.feature_countries && (
                <span className="text-red-500 text-sm">
                  {errors.feature_countries}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/popular-country")}
              className="btn w-auto h-12 px-6 py-2 bg-white text-black uppercase border border-neutral-500 hover:bg-neutral-100 hover:text-primaryColor hover:border-neutral-700"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn w-auto h-12 px-6 bg-black hover:bg-black-900 uppercase text-white hover:text-white disabled:text-white"
              disabled={!isFormValid || isCountryLoading}
            >
              {isSubmitting ? "Processing..." : "Update"}
            </button>
          </div>
        </form>
      </div>

      <SuccessModal
        open={isModalVisible}
        onOk={handleModalOk}
        modalMessage="Popular Countries Updated Successfully!"
      />
      <NotifyContainer />
    </section>
  );
}

export default UpdatePopularCountryForm;
