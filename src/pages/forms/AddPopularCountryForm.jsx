import BackToPrev from "../../components/shared/back/BackToPrev";
import SuccessModal from "../../components/modals/SuccessModal";
import { useAddPopularCountry } from "../../hooks/features/usePopularCountries";
import NotifyContainer from "../../utils/getNotify";
import ReactCountryFlag from "react-country-flag";
import SkeletonBox from "../../shared/custom/CustomSkeletonBox";
import { Select, Tag } from "antd";

function AddPopularCountryForm() {
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
    sortedCountries,
  } = useAddPopularCountry();

  const { Option } = Select;

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;

    return (
      <Tag
        closable={closable}
        onClose={onClose}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          margin: 0,
          padding: "0 6px",
        }}
      >
        <ReactCountryFlag
          countryCode={label} // Use the label directly
          svg
          style={{ width: "16px", height: "12px" }}
        />
        <span>{label}</span>
      </Tag>
    );
  };

  const dropdownRender = (menu) => (
    <>
      {/* Selected countries section */}
      {formData.feature_countries.length > 0 && (
        <div className="p-2 border-b border-neutral-200">
          <div className="text-xs font-medium text-neutral-500 mb-1">
            Selected Countries
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.feature_countries.map((countryId) => {
              const country = countries.find((c) => c._id === countryId);
              if (!country) return null;
              return (
                <Tag
                  key={country._id}
                  closable
                  onClose={(e) => {
                    e.stopPropagation();
                    handleChange(
                      "feature_countries",
                      formData.feature_countries.filter(
                        (id) => id !== country._id
                      )
                    );
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    margin: 0,
                    padding: "0 6px",
                  }}
                >
                  <ReactCountryFlag
                    countryCode={country.code}
                    svg
                    style={{ width: "16px", height: "12px" }}
                  />
                  <span>{country.name}</span>
                </Tag>
              );
            })}
          </div>
        </div>
      )}
      {/* Regular dropdown menu */}
      {menu}
    </>
  );

  return (
    <section className="px-8 py-6 h-full overflow-auto">
      <div className="bg-white p-6 rounded-2xl">
        <BackToPrev
          path="/popular-country"
          title="Add Popular Country"
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
              {isSubmitting ? "Processing..." : "Done"}
            </button>
          </div>
        </form>
      </div>

      <SuccessModal
        open={isModalVisible}
        onOk={handleModalOk}
        modalMessage="Popular Countries Added Successfully!"
      />
      <NotifyContainer />
    </section>
  );
}

export default AddPopularCountryForm;
