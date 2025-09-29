import { Select } from "antd";
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

            {/* Package Type */}
            {/* <div className="flex flex-col gap-1">
              <span className="text-black-700">Package Type</span>
              <Select
                className={`w-full border ${
                  errors.type ? "!border-red-500" : "border-natural-400"
                } rounded-lg
                  [&_.ant-select-selector]:!h-12
                  [&_.ant-select-selector]:!px-4
                  [&_.ant-select-selector]:!flex
                  [&_.ant-select-selector]:!items-center
                  [&_.ant-select-selector]:!leading-[3.5rem]`}
                placeholder="Select package type"
                value={formData.type || null}
                onChange={(value) => handleChange("type", value)}
                status={errors.type ? "error" : ""}
              >
                <Select.Option value="data">Data Only</Select.Option>
              </Select>
              {errors.type && (
                <span className="text-red-500 text-sm">{errors.type}</span>
              )}
            </div> */}

            {/* Coverage */}
            {selectedData?.keep_go_bundle_type === "country" && (
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

            {selectedData?.keep_go_bundle_type === "regional" && (
              <div className="flex flex-col gap-1">
                <span className="text-black-700">Coverage Regions</span>
                {isRegionLoading ? (
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

                {/* {selectedPackage && (
                              <div className="col-span-2 text-xs p-2 border border-neutral-300 rounded-lg mt-1">
                                {packageCountries &&
                                  packageCountries.map((country, index) => (
                                    <span className="text-xs" key={country.code || index}>
                                      {country}
                                      {index < packageCountries.length - 1 ? ", " : ""}
                                    </span>
                                  ))}
                              </div>
                            )} */}

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
              {errors.data_plan_in_mb && (
                <span className="text-red-500 text-sm">
                  {errors.data_plan_in_mb}
                </span>
              )}
            </div>

            {/* Bonus Data */}
            {/* <div className="flex flex-col gap-1">
              <span className="text-black-700">
                Bonus Data in MB (Optional)
              </span>
              <input
                type="number"
                placeholder="Enter in % value"
                className="w-full border border-natural-400 placeholder:text-disabled text-blackLow rounded-lg outline-none px-4 py-3 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                value={formData.bonus_data_plan_in_mb}
                onChange={(e) =>
                  handleChange("bonus_data_plan_in_mb", e.target.value)
                }
                onWheel={(e) => e.target.blur()}
              />
            </div> */}

            {/* Validity Amount */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Validity Amount in Days</span>
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
              {errors.validity && (
                <span className="text-red-500 text-sm">{errors.validity}</span>
              )}
            </div>

            {/* Validity Type */}
            {/* <div className="flex flex-col gap-1">
              <span className="text-black-700">Validity Type</span>
              <Select
                className={`w-full border rounded-lg
                  [&_.ant-select-selector]:!h-12
                  [&_.ant-select-selector]:!px-4
                  [&_.ant-select-selector]:!flex
                  [&_.ant-select-selector]:!items-center
                  [&_.ant-select-selector]:!leading-[3.5rem]`}
                value={formData.validity.type}
                onChange={(value) => handleChange("validity.type", value)}
              >
                <Select.Option value="day">Day</Select.Option>
                <Select.Option value="month">Month</Select.Option>
              </Select>
            </div> */}

            {/* Original Price - USD */}
            {/* <div className="flex flex-col gap-1">
              <span className="text-black-700">Original Price (USD)</span>
              <input
                type="number"
                placeholder="Enter original price in USD"
                className={`w-full border placeholder:text-disabled ${
                  errors.original_price
                    ? "border-red-500"
                    : "border-natural-400"
                } text-blackLow rounded-lg outline-none py-3 px-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                value={formData.original_price.USD}
                onChange={(e) =>
                  handleChange("original_price.USD", e.target.value)
                }
                onWheel={(e) => e.target.blur()}
              />
              {errors.original_price && (
                <span className="text-red-500 text-sm">
                  {errors.original_price}
                </span>
              )}
            </div> */}

            {/* Original Price - EUR */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Original Price (USD)</span>
              <input
                type="number"
                placeholder="Enter original price in USD"
                className={`w-full border placeholder:text-disabled ${
                  errors.original_price
                    ? "border-red-500"
                    : "border-natural-400"
                } text-blackLow rounded-lg outline-none py-3 px-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                value={formData.original_price.USD}
                onChange={(e) =>
                  handleChange("original_price.USD", e.target.value)
                }
                onWheel={(e) => e.target.blur()}
                disabled={true}
              />
              {errors.original_price && (
                <span className="text-red-500 text-sm">
                  {errors.original_price}
                </span>
              )}
            </div>

            {/* Price - USD */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Selling Price (USD)</span>
              <input
                type="number"
                placeholder="Enter price in USD"
                className={`w-full border placeholder:text-disabled ${
                  errors.price ? "border-red-500" : "border-natural-400"
                } text-blackLow rounded-lg outline-none py-3 px-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                value={formData.price.USD}
                onChange={(e) => handleChange("price.USD", e.target.value)}
                onWheel={(e) => e.target.blur()}
              />
              {errors.price && (
                <span className="text-red-500 text-sm">{errors.price}</span>
              )}
            </div>

            {/* Price - EUR */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Selling Price (EUR)</span>
              <input
                type="number"
                placeholder="Enter price in EUR"
                className={`w-full border placeholder:text-disabled ${
                  errors.price ? "border-red-500" : "border-natural-400"
                } text-blackLow rounded-lg outline-none py-3 px-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                value={formData.price.EUR}
                onChange={(e) => handleChange("price.EUR", e.target.value)}
                onWheel={(e) => e.target.blur()}
              />
              {errors.price && (
                <span className="text-red-500 text-sm">{errors.price}</span>
              )}
            </div>

            {/* Discount */}
            <div className="flex flex-col gap-1">
              <span className="text-black-700">Discount Amount (Optional)</span>
              <input
                type="number"
                placeholder="Enter discount amount"
                className={`w-full border border-natural-400 placeholder:text-disabled text-blackLow rounded-lg outline-none py-3 px-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
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
            </div>

            {/* VAT */}
            {/* <div className="flex flex-col gap-1">
              <span className="text-black-700">VAT Amount (%)</span>
              <input
                type="number"
                placeholder="Enter VAT percentage"
                className={`w-full border border-natural-400 placeholder:text-disabled text-blackLow rounded-lg outline-none py-3 px-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                value={formData.vat.amount}
                min="0"
                max="100"
                onChange={(e) => {
                  const value = Math.min(100, Number(e.target.value));
                  handleChange("vat.amount", value);
                }}
                onWheel={(e) => e.target.blur()}
              />
            </div> */}

            {/* Auto Renew */}
            {/* <div className="flex flex-col gap-1">
              <span className="text-black-700">Auto Renews</span>
              <Select
                className={`w-full border rounded-lg
                  [&_.ant-select-selector]:!h-12
                  [&_.ant-select-selector]:!px-4
                  [&_.ant-select-selector]:!flex
                  [&_.ant-select-selector]:!items-center
                  [&_.ant-select-selector]:!leading-[3.5rem]`}
                value={formData.is_auto_renew_available}
                onChange={(value) =>
                  handleChange("is_auto_renew_available", value)
                }
              >
                <Select.Option value={true}>Yes</Select.Option>
                <Select.Option value={false}>No</Select.Option>
              </Select>
            </div> */}

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

          <div className="flex items-center gap-3">
            {formData.price.USD && (
              <div
                className={`font-medium mt-4 text-neutral-600 pr-3 ${
                  formData.price.EUR ? "border-r border-neutral-400" : ""
                }`}
              >
                Final Price (USD):{" "}
                <span className="text-blue-900">
                  {getSymbol("USD")}
                  {finalPrice.finalUSD}
                </span>
              </div>
            )}
            {formData.price.EUR && (
              <div className="font-medium mt-4 text-neutral-600">
                Final Price (EUR):{" "}
                <span className="text-blue-900">
                  {getSymbol("USD")}
                  {finalPrice.finalEUR}
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
              className=" btn w-auto h-12 px-6 py-2 bg-black hover:bg-black-900 uppercase text-white hover:text-white disabled:text-white"
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
        modalMessage="Package Updated Successfully!"
      />
      <NotifyContainer />
    </section>
  );
}

export default UpdatePackageForm;
