import BackToPrev from "../../components/shared/back/BackToPrev";
import SuccessModal from "../../components/modals/SuccessModal";
import { useUpdateCoupon } from "../../hooks/features/useCoupons";
import NotifyContainer from "../../utils/notify";
import ReactCountryFlag from "react-country-flag";
import SkeletonBox from "../../shared/custom/CustomSkeletonBox";
import { DatePicker, Select, Tag } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

function UpdateCouponForm() {
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
    isCountryLoading,
    sortedCountries,
    countries,
  } = useUpdateCoupon();

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
      {formData.coverage_countries.length > 0 && (
        <div className="p-2 border-b border-neutral-200">
          <div className="text-xs font-medium text-neutral-500 mb-1">
            Selected Countries
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.coverage_countries.map((countryId) => {
              const country = countries.find((c) => c._id === countryId);
              if (!country) return null;
              return (
                <Tag
                  key={country._id}
                  closable
                  onClose={(e) => {
                    e.stopPropagation();
                    handleChange(
                      "coverage_countries",
                      formData.coverage_countries.filter(
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
      {menu}
    </>
  );

  return (
    <section className="px-8 py-6 h-full overflow-auto">
      <div className="bg-white p-6 rounded-2xl">
        <BackToPrev path="/coupon" title="Update Coupon"></BackToPrev>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-y-4 gap-x-12">
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Privacy Type</span>
              <Select
                className={`w-full border ${
                  errors.is_private ? "!border-red-500" : "border-natural-400"
                } rounded-lg
                                      [&_.ant-select-selector]:!h-12
                                      [&_.ant-select-selector]:!px-4
                                      [&_.ant-select-selector]:!flex
                                      [&_.ant-select-selector]:!items-center
                                      [&_.ant-select-selector]:!leading-[3.5rem]`}
                placeholder="Select Privacy type"
                value={formData.is_private}
                onChange={(value) => handleChange("is_private", value)}
                status={errors.role ? "error" : ""}
                disabled={true}
              >
                <Select.Option value={false}>Public</Select.Option>
                <Select.Option value={true}>Private</Select.Option>
              </Select>
              {errors.is_private && (
                <span className="text-red-500 text-sm">
                  {errors.is_private}
                </span>
              )}
            </div>
            {/* Title */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Title</span>
              <input
                type="text"
                name="title"
                placeholder="Enter title"
                className={`w-full border placeholder:text-disabled ${
                  errors.title ? "border-red-500" : "border-natural-400"
                } text-blackLow rounded-lg outline-none py-3 px-4`}
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              {errors.title && (
                <span className="text-red-500 text-sm">{errors.title}</span>
              )}
            </div>

            {/* Code (disabled for update) */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Code</span>
              <input
                type="text"
                name="code"
                placeholder="Enter code"
                className={`w-full border placeholder:text-disabled cursor-not-allowed ${
                  errors.code ? "border-red-500" : "border-natural-400"
                } text-blackLow rounded-lg outline-none py-3 px-4`}
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
                disabled
              />
              {errors.code && (
                <span className="text-red-500 text-sm">{errors.code}</span>
              )}
            </div>

            {/* Discount */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Discount Amount</span>
              <input
                type="number"
                name="discount.amount"
                placeholder="Enter in % value"
                className={`w-full border placeholder:text-disabled ${
                  errors.discount ? "border-red-500" : "border-natural-400"
                } text-blackLow rounded-lg outline-none py-3 px-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                value={formData.discount.amount}
                min="0"
                max="100"
                onChange={(e) => {
                  let value = e.target.value;
                  if (value !== "") {
                    value = Math.min(100, Math.max(0, Number(value)));
                  }
                  handleChange("discount.amount", value);
                }}
                onWheel={(e) => e.target.blur()}
              />
              {errors.discount && (
                <span className="text-red-500 text-sm">{errors.discount}</span>
              )}
            </div>

            {/* Coverage Countries */}
            {!formData.is_private && (
              <div className="flex flex-col gap-1">
                <span className="text-black-700">Coverage Countries</span>
                {isCountryLoading ? (
                  <SkeletonBox className="w-full h-12" />
                ) : (
                  <Select
                    mode="multiple"
                    className={`w-full border ${
                      errors.coverage_countries
                        ? "!border-red-500"
                        : "border-natural-400"
                    } rounded-lg [&_.ant-select-selector]:!h-12 [&_.ant-select-selection-placeholder]:!px-2 [&_.ant-select-selector]:!px-3 [&_.ant-select-selector]:!flex [&_.ant-select-selector]:!items-center [&_.ant-select-selector]:!leading-[3.5rem]`}
                    placeholder="Select Countries"
                    value={formData.coverage_countries}
                    onChange={(value) =>
                      handleChange("coverage_countries", value)
                    }
                    status={errors.coverage_countries ? "error" : ""}
                    tagRender={tagRender}
                    maxTagCount={2}
                    showSearch
                    optionFilterProp="label"
                    dropdownRender={dropdownRender}
                    loading={isCountryLoading}
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
                {errors.coverage_countries && (
                  <span className="text-red-500 text-sm">
                    {errors.coverage_countries}
                  </span>
                )}
              </div>
            )}

            {/* Validity End Date */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Validity End Date</span>
              <DatePicker
                className={`w-full border ${
                  errors.validity_end_at
                    ? "border-red-500"
                    : "border-natural-400"
                } rounded-lg h-12`}
                format="YYYY-MM-DD"
                allowClear={false}
                onChange={(date) => {
                  const timestamp = date
                    ? dayjs(date).utc().endOf("day").unix()
                    : null;
                  handleChange("validity_end_at", timestamp);
                }}
                value={
                  formData.validity_end_at
                    ? dayjs.unix(formData.validity_end_at).utc()
                    : null
                }
                disabledDate={(current) => {
                  // Disable dates before today
                  return current && current < dayjs().startOf("day");
                }}
              />
              {errors.validity_end_at && (
                <span className="text-red-500 text-sm">
                  {errors.validity_end_at}
                </span>
              )}
            </div>

            {/* Max Usages Limit */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Max Usages Limit</span>
              <input
                type="number"
                name="max_usages_limit"
                placeholder="Enter max usages"
                className={`w-full border placeholder:text-disabled ${
                  errors.max_usages_limit
                    ? "border-red-500"
                    : "border-natural-400"
                } text-blackLow rounded-lg outline-none py-3 px-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                value={formData.max_usages_limit || ""}
                min="1"
                onChange={(e) =>
                  handleChange("max_usages_limit", e.target.value)
                }
                onWheel={(e) => e.target.blur()}
              />
              {errors.max_usages_limit && (
                <span className="text-red-500 text-sm">
                  {errors.max_usages_limit}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/coupon")}
              className="btn w-auto h-12 px-6 py-2 bg-white text-black uppercase border border-black-700 hover:bg-neutral-100 hover:text-primaryColor hover:border-black"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn w-auto h-12 px-6 py-2 bg-black hover:bg-black-900 uppercase text-white hover:text-white disabled:text-white"
              disabled={!isFormValid || isLoading || isCountryLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>

      <SuccessModal
        open={isModalVisible}
        onOk={handleModalOk}
        modalMessage="Coupon Updated Successfully!"
      />
      <NotifyContainer />
    </section>
  );
}

export default UpdateCouponForm;
