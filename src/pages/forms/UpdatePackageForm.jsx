import { Select, Switch } from "antd";
import BackToPrev from "../../components/shared/back/BackToPrev";
import SuccessModal from "../../components/modals/SuccessModal";
import NotifyContainer from "../../utils/notify";
import ReactCountryFlag from "react-country-flag";
import SkeletonBox from "../../shared/custom/CustomSkeletonBox";
import { useUpdatePackage } from "../../hooks/features/usePackages";
import { currency, getSymbol } from "../../utils/currency";

function UpdatePackageForm() {
  const {
    isModalVisible,
    handleChange,
    handleSubmit,
    handleModalOk,
    isFormValid,
    errors,
    formData,
    navigate,
    isCountryLoading,
    isSubmitting,
    sortedCountries,
    tagRender,
    dropdownRender,
    selectedData,
    isRegionLoading,
    sortedRegions,
    finalPrice,
    handleDiscountTypeToggle,
    isSinglePackageLoading,
    isSinglePackageError,
  } = useUpdatePackage();

  return (
    <section className="px-8 py-6 h-full overflow-auto">
      <div className="bg-white p-6 rounded-2xl">
        <BackToPrev path="/packages" title="Update Package"></BackToPrev>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-y-4 gap-x-12">
            {/* Plan */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Package Name</span>
              {isSinglePackageLoading ? (
                <SkeletonBox className="w-full h-12" />
              ) : (
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
              )}
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>

            {/* Coverage */}
            {selectedData?.coverage_type === "country" && (
              <div className="flex flex-col gap-1">
                <span className="text-black-700">Coverage Countries</span>
                {isCountryLoading || isSinglePackageLoading ? (
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

            {selectedData?.coverage_type === "regional" && (
              <div className="flex flex-col gap-1">
                <span className="text-black-700">Coverage Regions</span>
                {isRegionLoading || isSinglePackageLoading ? (
                  <SkeletonBox className="w-full h-[49px] !rounded-lg" />
                ) : (
                  <Select
                    mode="multiple"
                    className={`w-full border ${
                      errors.coverage_regions
                        ? "!border-red-500"
                        : "border-natural-400"
                    } rounded-lg [&_.ant-select-selector]:!h-12 [&_.ant-select-selection-placeholder]:!px-2 [&_.ant-select-selector]:!px-3 [&_.ant-select-selector]:!flex [&_.ant-select-selector]:!items-center [&_.ant-select-selector]:!leading-[3.5rem]`}
                    placeholder="Select Regions"
                    value={formData.coverage_regions}
                    onChange={(value) =>
                      handleChange("coverage_regions", value)
                    }
                    status={errors.coverage_regions ? "error" : ""}
                    tagRender={tagRender}
                    maxTagCount={2}
                    showSearch
                    optionFilterProp="label"
                    dropdownRender={dropdownRender}
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
                {(errors.coverage_countries || errors.coverage_regions) && (
                  <span className="text-red-500 text-sm col-span-2">
                    {errors.coverage_countries || errors.coverage_regions}
                  </span>
                )}
              </div>
            )}

            {/* Data Plan */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Data Limit (MB)</span>
              {isSinglePackageLoading ? (
                <SkeletonBox className="w-full h-12" />
              ) : (
                <input
                  type="number"
                  placeholder="Enter data limit"
                  className={`w-full border placeholder:text-disabled ${
                    errors.data_plan_in_mb
                      ? "border-red-500"
                      : "border-natural-400"
                  } text-blackLow rounded-lg outline-none py-3 px-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                  value={formData.data_plan_in_mb}
                  onChange={(e) =>
                    handleChange("data_plan_in_mb", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                  disabled={true}
                />
              )}
              {errors.data_plan_in_mb && (
                <span className="text-red-500 text-sm">
                  {errors.data_plan_in_mb}
                </span>
              )}
            </div>

            {/* Validity Amount */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Validity Amount in Days</span>
              {isSinglePackageLoading ? (
                <SkeletonBox className="w-full h-12" />
              ) : (
                <input
                  type="number"
                  placeholder="Enter validity amount"
                  className={`w-full border placeholder:text-disabled ${
                    errors.validity ? "border-red-500" : "border-natural-400"
                  } text-blackLow rounded-lg outline-none py-3 px-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                  value={formData.validity.amount}
                  onChange={(e) =>
                    handleChange("validity.amount", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                  disabled={true}
                />
              )}
              {errors.validity && (
                <span className="text-red-500 text-sm">{errors.validity}</span>
              )}
            </div>

            {/* Retail Price - USD */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Retail Price (USD)</span>
              {isSinglePackageLoading ? (
                <SkeletonBox className="w-full h-12" />
              ) : (
                <input
                  type="number"
                  placeholder="Enter retail price in USD"
                  className={`w-full border placeholder:text-disabled ${
                    errors.retail_price
                      ? "border-red-500"
                      : "border-natural-400"
                  } text-blackLow rounded-lg outline-none py-3 px-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                  value={formData.retail_price.USD}
                  onChange={(e) =>
                    handleChange("retail_price.USD", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                  disabled={true}
                />
              )}
              {errors.retail_price && (
                <span className="text-red-500 text-sm">
                  {errors.retail_price}
                </span>
              )}
            </div>

            {/* Selling Price - USD */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Selling Price (USD)</span>
              {isSinglePackageLoading ? (
                <SkeletonBox className="w-full h-12" />
              ) : (
                <input
                  type="number"
                  placeholder="Enter selling price in USD"
                  className={`w-full border placeholder:text-disabled ${
                    errors.selling_price
                      ? "border-red-500"
                      : "border-natural-400"
                  } text-blackLow rounded-lg outline-none py-3 px-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                  value={formData.selling_price.USD}
                  onChange={(e) =>
                    handleChange("selling_price.USD", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                />
              )}
              {errors.selling_price && (
                <span className="text-red-500 text-sm">
                  {errors.selling_price}
                </span>
              )}
            </div>

            {/* Discount Amount */}
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
                    errors.discount_on_selling_price
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
                  onWheel={(e) => e.target.blur()}
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
              {errors.discount_on_selling_price && (
                <span className="text-red-500 text-sm">
                  {errors.discount_on_selling_price}
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
              >
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
              </Select>
            </div>

            {/* Note */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Note (Optional)</span>
              <input
                type="text"
                placeholder="Enter note"
                className="w-full border border-natural-400 placeholder:text-disabled text-blackLow rounded-lg outline-none px-4 py-3"
                value={formData.note}
                onChange={(e) => handleChange("note", e.target.value)}
              />
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
              className=" btn w-auto h-12 px-6 py-2 bg-white text-black uppercase border border-black-700 hover:bg-neutral-100 hover:text-primaryColor hover:border-black"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn w-auto h-12 px-6 bg-black hover:bg-black-900 uppercase text-white hover:text-white disabled:text-white"
              disabled={!isFormValid || isCountryLoading || isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Update"}
            </button>
          </div>
        </form>
      </div>

      <SuccessModal
        open={isModalVisible}
        onOk={handleModalOk}
        modalMessage="Package Updated Successfully!"
      />
      <NotifyContainer />
    </section>
  );
}

export default UpdatePackageForm;
