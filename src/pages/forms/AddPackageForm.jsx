import { Select, Switch, Tag } from "antd";
import BackToPrev from "../../components/shared/back/BackToPrev";
import SuccessModal from "../../components/modals/SuccessModal";
import { useAddPackage } from "../../hooks/features/usePackages";
import NotifyContainer from "../../utils/notify";
import ReactCountryFlag from "react-country-flag";
import SkeletonBox from "../../shared/custom/CustomSkeletonBox";
import { getSymbol } from "../../utils/currency";

function AddPackageForm() {
  const {
    isModalVisible,
    isCountryLoading,
    handleChange,
    handleSubmit,
    handleModalOk,
    errors,
    formData,
    navigate,
    isSubmitting,
    sortedCountries,
    packageType,
    setPackageType,
    selectedPackage,
    setSelectedPackage,
    isLoading,
    packageCountries,
    availablePackageOptions,
    selectedPackageData,
    setSelectedPackageData,
    availablePackages,
    isRegionLoading,
    sortedRegions,
    finalPrice,
    coverageError,
    handleDiscountTypeToggle,
    tagRender,
    dropdownRender,
    isFormValid
  } = useAddPackage();
  return (
    <section className="px-8 py-6 h-full overflow-auto">
      <div className="bg-white p-6 rounded-2xl">
        <BackToPrev path="/packages" title="Add Package"></BackToPrev>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
            {/* Package Type */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Package Type</span>
              <Select
                className="w-full border rounded-lg
                  [&_.ant-select-selector]:!h-12
                  [&_.ant-select-selector]:!px-4
                  [&_.ant-select-selector]:!flex
                  [&_.ant-select-selector]:!items-center
                  [&_.ant-select-selector]:!leading-[3.5rem]"
                placeholder="Select package type"
                value={packageType}
                onChange={(value) => {
                  setPackageType(value);
                  setSelectedPackage(null);
                  setSelectedPackageData(null);
                }}
                options={[
                  { value: "country", label: "Country Travel Plan" },
                  { value: "regional", label: "Regional Travel Plan" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-black-700">Select Package</span>
              {isLoading ? (
                <SkeletonBox className="w-full h-[49px] !rounded-lg" />
              ) : (
                <Select
                  className="w-full border rounded-lg
                    [&_.ant-select-selector]:!h-12
                    [&_.ant-select-selector]:!px-4
                    [&_.ant-select-selector]:!flex
                    [&_.ant-select-selector]:!items-center
                    [&_.ant-select-selector]:!leading-[3.5rem]"
                  placeholder={isLoading ? "Loading..." : "Select package"}
                  showSearch
                  disabled={isLoading}
                  options={availablePackageOptions}
                  value={selectedPackageData?.package_code}
                  onChange={(value) => {
                    const selected = availablePackages.find(
                      (pkg) => pkg.package_code === value
                    );
                    setSelectedPackageData(selected || null);
                    setSelectedPackage(value);
                  }}
                  loading={isLoading}
                />
              )}
            </div>

            {/* Package Name */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Package Name</span>
              <input
                type="text"
                placeholder="Enter package name"
                className={`w-full border placeholder:text-disabled ${
                  errors.name ? "border-red-500" : "border-natural-400"
                } text-blackLow rounded-lg outline-none py-3 px-4`}
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={true}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>

            {/* Data Limit */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Data Limit (MB)</span>
              <input
                type="number"
                placeholder="Enter data limit"
                min="0"
                className={`w-full border placeholder:text-disabled ${
                  errors.data_plan_in_mb
                    ? "border-red-500"
                    : "border-natural-400"
                } text-blackLow rounded-lg outline-none py-3 px-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                value={formData.data_plan_in_mb}
                disabled={true}
                onChange={(e) => {
                  const value = Math.max(0, Number(e.target.value));
                  handleChange("data_plan_in_mb", value);
                }}
                onWheel={(e) => e.target.blur()}
              />
              {errors.data_plan_in_mb && (
                <span className="text-red-500 text-sm">
                  {errors.data_plan_in_mb}
                </span>
              )}
            </div>

            {/* Validity Amount */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Validity Amount in Days</span>
              <input
                type="number"
                placeholder="Enter validity amount"
                className={`w-full border placeholder:text-disabled ${
                  errors["validity.amount"]
                    ? "border-red-500"
                    : "border-natural-400"
                } text-blackLow rounded-lg outline-none py-3 px-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                value={formData.validity.amount}
                onChange={(e) =>
                  handleChange("validity.amount", e.target.value)
                }
                onWheel={(e) => e.target.blur()}
                disabled={true}
              />
              {errors["validity.amount"] && (
                <span className="text-red-500 text-sm">
                  {errors["validity.amount"]}
                </span>
              )}
            </div>

            {/* Retail Price */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Retail Price (USD)</span>
              <input
                type="number"
                placeholder="Enter retail price"
                className={`w-full border placeholder:text-disabled ${
                  errors["retail_price.USD"]
                    ? "border-red-500"
                    : "border-natural-400"
                } text-blackLow rounded-lg outline-none py-3 px-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                value={formData.retail_price?.USD}
                onChange={(e) =>
                  handleChange("retail_price.USD", e.target.value)
                }
                onWheel={(e) => e.target.blur()}
                disabled={true}
              />
              {errors["retail_price.USD"] && (
                <span className="text-red-500 text-sm">
                  {errors["retail_price.USD"]}
                </span>
              )}
            </div>

            {/* Coverage Regions */}
            {packageType === "regional" && (
              <div className="flex flex-col gap-1 col-span-1">
                <span className="text-black-700">Coverage Regions</span>
                {isRegionLoading ? (
                  <SkeletonBox className="w-full h-[49px] !rounded-lg" />
                ) : (
                  // Single Select Version
                  <Select
                    className={`w-full border ${
                      errors.coverage_regions || coverageError
                        ? "!border-red-500"
                        : "border-natural-400"
                    } rounded-lg
                    [&_.ant-select-selector]:!h-12
                    [&_.ant-select-selector]:!px-4
                    [&_.ant-select-selector]:!flex
                    [&_.ant-select-selector]:!items-center
                    [&_.ant-select-selector]:!leading-[3.5rem]`}
                    placeholder="Select Region"
                    value={formData.coverage_regions?.[0] || undefined}
                    onChange={(value) =>
                      handleChange("coverage_regions", value ? [value] : [])
                    }
                    status={errors.coverage_regions ? "error" : ""}
                    showSearch
                    optionFilterProp="label"
                    disabled={!selectedPackage}
                  >
                    {sortedRegions.map((region) => (
                      <Select.Option
                        key={region._id}
                        value={region._id}
                        label={region.name}
                      >
                        <div className="flex items-center gap-3">
                          <span>{region.name}</span>
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                )}

                {(errors.coverage_regions || coverageError) && (
                  <span className="text-red-500 text-sm">
                    {errors.coverage_regions || coverageError}
                  </span>
                )}
              </div>
            )}

            {/* Coverage Countries */}
            {packageType === "country" && (
              <div className="flex flex-col gap-1 col-span-1">
                <span className="text-black-700">Coverage Countries</span>
                {isCountryLoading ? (
                  <SkeletonBox className="w-full h-[49px] !rounded-lg" />
                ) : (
                  // Single Select Version
                  <Select
                    className={`w-full border ${
                      errors.coverage_countries || coverageError
                        ? "!border-red-500"
                        : "border-natural-400"
                    } rounded-lg
                    [&_.ant-select-selector]:!h-12
                    [&_.ant-select-selector]:!px-4
                    [&_.ant-select-selector]:!flex
                    [&_.ant-select-selector]:!items-center
                    [&_.ant-select-selector]:!leading-[3.5rem]`}
                    placeholder="Select Country"
                    value={formData.coverage_countries?.[0] || undefined}
                    onChange={(value) =>
                      handleChange("coverage_countries", value ? [value] : [])
                    }
                    status={errors.coverage_countries ? "error" : ""}
                    showSearch
                    optionFilterProp="label"
                    disabled={!selectedPackage}
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

                {(errors.coverage_countries || coverageError) && (
                  <span className="text-red-500 text-sm">
                    {errors.coverage_countries || coverageError}
                  </span>
                )}
              </div>
            )}

            {/* Display package coverage countries */}
            {selectedPackage && packageCountries.length > 0 && (
              <div className="flex-col gap-1 col-span-1 md:col-span-2 mt-2 md:hidden flex">
                <div className="text-xs p-2 border border-neutral-300 rounded-lg bg-neutral-50">
                  Available Coverage: {packageCountries.join(", ")}
                </div>
              </div>
            )}

            {/* Selling Price */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Selling Price (USD)</span>
              <input
                type="number"
                placeholder="Enter selling price"
                className={`w-full border placeholder:text-disabled ${
                  errors["selling_price.USD"]
                    ? "border-red-500"
                    : "border-natural-400"
                } text-blackLow rounded-lg outline-none py-3 px-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                value={formData.selling_price.USD}
                onChange={(e) =>
                  handleChange("selling_price.USD", e.target.value)
                }
                onWheel={(e) => e.target.blur()}
                disabled={!selectedPackage}
              />
              {errors["selling_price.USD"] && (
                <span className="text-red-500 text-sm">
                  {errors["selling_price.USD"]}
                </span>
              )}
            </div>

            {/* Display package coverage countries */}
            {selectedPackage && packageCountries.length > 0 && (
              <div className="flex-col gap-1 col-span-1 md:col-span-2 mt-2 hidden md:flex">
                <div className="text-xs p-2 border border-neutral-300 rounded-lg bg-neutral-50">
                  Available Coverage: {packageCountries.join(", ")}
                </div>
              </div>
            )}

            {/* Discount on Selling Price */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Discount Amount (Optional)</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={
                    formData.discount_on_selling_price.is_type_percentage
                      ? "Enter discount in %"
                      : "Enter discount amount"
                  }
                  className={`w-full border placeholder:text-disabled ${
                    errors["discount_on_selling_price.amount"]
                      ? "border-red-500"
                      : "border-natural-400"
                  } text-blackLow rounded-lg outline-none py-3 px-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                  value={formData.discount_on_selling_price.amount}
                  min="0"
                  max={
                    formData.discount_on_selling_price.is_type_percentage
                      ? "100"
                      : `${formData.selling_price.USD}`
                  }
                  onChange={(e) => {
                    let value = e.target.value;
                    if (value !== "") {
                      if (
                        formData.discount_on_selling_price.is_type_percentage
                      ) {
                        value = Math.min(100, Math.max(0, Number(value)));
                      } else if (formData.selling_price.USD) {
                        value = Math.min(
                          formData.selling_price.USD,
                          Number(value)
                        );
                      }
                    }
                    handleChange("discount_on_selling_price.amount", value);
                  }}
                  disabled={!selectedPackage}
                />
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span className="text-sm w-3">
                    {formData.discount_on_selling_price.is_type_percentage
                      ? "%"
                      : "$"}
                  </span>
                  <Switch
                    checked={
                      !formData.discount_on_selling_price.is_type_percentage
                    }
                    onChange={handleDiscountTypeToggle}
                    size="small"
                    className="bg-neutral-400"
                  />
                </div>
              </div>
              {errors["discount_on_selling_price.amount"] && (
                <span className="text-red-500 text-sm">
                  {errors["discount_on_selling_price.amount"]}
                </span>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Status</span>
              <Select
                className={`w-full border ${
                  errors.status ? "!border-red-500" : "border-natural-400"
                } rounded-lg
                  [&_.ant-select-selector]:!h-12
                  [&_.ant-select-selector]:!px-4
                  [&_.ant-select-selector]:!flex
                  [&_.ant-select-selector]:!items-center
                  [&_.ant-select-selector]:!leading-[3.5rem]`}
                placeholder="Select status"
                value={formData.status || null}
                onChange={(value) => handleChange("status", value)}
                status={errors.status ? "error" : ""}
                disabled={!selectedPackage}
              >
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
              </Select>
            </div>

          </div>

          {/* Final Price Display */}
          <div className="flex items-center gap-3 mt-4">
            {formData.selling_price.USD && (
              <div className="font-medium text-neutral-600 pr-3 border-r border-neutral-400">
                Final Price (USD):{" "}
                <span className="text-blue-900">
                  {getSymbol("USD")}
                  {finalPrice.finalUSD}
                </span>
              </div>
            )}
            {formData.discount_on_selling_price.amount && (
              <div className="font-medium text-neutral-600">
                Price After Discount:{" "}
                <span className="text-green-600">
                  {getSymbol("USD")}
                  {finalPrice.priceAfterDiscountUSD}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/packages")}
              className="btn w-auto h-12 px-6 py-2 bg-white text-black uppercase border border-black-700 hover:bg-neutral-100 hover:text-primaryColor hover:border-black"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn w-auto h-12 px-6 py-2 bg-black hover:bg-black-900 uppercase text-white hover:text-white disabled:text-white"
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
        modalMessage="Package Added Successfully!"
      />
      <NotifyContainer />
    </section>
  );
}

export default AddPackageForm;
