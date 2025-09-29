import FormInput from "../../shared/forms/FormInput";
import { DeleteIcon, EditIcon, SearchSvg } from "../../utils/svgs";
import SecondaryButton from "../../shared/buttons/SecondaryButton";
import { useGetKeepgoPackages } from "../../hooks/features/useKeepgoPackages";
import NotifyContainer from "../../utils/notify";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { CustomTable } from "../../shared/custom";
import { formatStatusStr } from "../../utils/helper";
import SkeletonBox from "../../shared/custom/CustomSkeletonBox";
import { getSymbol } from "../../utils/currency";

const KeepgoPackageKeepGo = () => {
  const {
    isLoading,
    isError,
    status,
    meta,
    dataList,
    searchKeyword,
    setSearchKeyword,
    updatePageMeta,
    filterKey,
    setFilterKey,
    handleDelete,
    setKeepgoPackageId,
    handleNavigate,
    handleOpenAddKeepgoPackageModal,
    handleStatusChange,
    updatingKeepgoPackages,
    Option,
    Select,
    regionFilter,
    setRegionFilter,
    regions,
    isRegionLoading,
  } = useGetKeepgoPackages();

  return (
    <>
      <section className="h-full w-full max-h-[95%] px-4 md:px-6 py-6">
        <div className="bg-white shadow-sm w-full rounded-2xl flex flex-col p-4">
          <div className="flex flex-col lg:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="title-cmn text-[18px] font-semibold">
              Keepgo Packages
            </h2>

            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div key="All" className="flex items-center gap-2">
                  Status:
                  <Select
                    value={filterKey === undefined ? "" : filterKey}
                    onChange={(value) =>
                      setFilterKey(value === "" ? undefined : value)
                    }
                    placeholder="Status"
                    popupMatchSelectWidth={false}
                    className={`
                      w-[87px] text-sm border-l first-of-type:border-none
                      rounded-md
                      [&_.ant-select-selector]:!text-sm
                      [&_.ant-select-selector]:!h-7
                      [&_.ant-select-selector]:!px-2
                      [&_.ant-select-selector]:!flex
                      [&_.ant-select-selector]:!items-center
                      [&_.ant-select-selection-item]:!font-semibold
                    `}
                  >
                    <Select.Option key="All" value="">
                      All
                    </Select.Option>
                    <Select.Option key="Active" value="active">
                      Active
                    </Select.Option>
                    <Select.Option key="Inactive" value="inactive">
                      Inactive
                    </Select.Option>
                  </Select>
                </div>
                {/* Add Region Filter */}
                <div key="Region" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    Region:
                    {isRegionLoading ? (
                      <SkeletonBox className="h-6 w-[87px]" />
                    ) : (
                      <Select
                        value={regionFilter === undefined ? "" : regionFilter}
                        onChange={(value) =>
                          setRegionFilter(value === "" ? undefined : value)
                        }
                        placeholder="Region"
                        popupMatchSelectWidth={false}
                        className={`
                      w-auto text-sm border-l first-of-type:border-none
                      rounded-md
                      [&_.ant-select-selector]:!text-sm
                      [&_.ant-select-selector]:!min-w-[87px]
                      [&_.ant-select-selector]:!h-7
                      [&_.ant-select-selector]:!px-2
                      [&_.ant-select-selector]:!flex
                      [&_.ant-select-selector]:!items-center
                      [&_.ant-select-selection-item]:!font-semibold
                    `}
                      >
                        <Select.Option key="AllRegions" value="">
                          All
                        </Select.Option>
                        {regions.map((region) => (
                          <Select.Option key={region._id} value={region._id}>
                            {region.name}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full md:w-[200px] relative">
                <FormInput
                  placeholder="Search Package"
                  inputCss="pl-12 !py-3 !rounded-lg"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />

                <SearchSvg cls="absolute top-[15px] left-4" />
              </div>

              <SecondaryButton
                text="Add Package"
                width="w-max"
                onClick={() => handleOpenAddKeepgoPackageModal()}
              />
            </div>
          </div>

          <CustomTable
            isLoading={isLoading}
            isError={isError}
            status={status}
            current_page={meta?.current_page || 1}
            page_size={meta?.page_size || 1}
            total_pages={meta?.total_pages || 1}
            total_items={meta?.total_items || 0}
            updatePageMeta={updatePageMeta}
            columns={[
              "Package ID",
              "Name",
              "Plan",
              "Validity",
              "Coverage",
              "Final Price ($)",
              "Discount",
              "Status",
              "Action",
            ]}
            dataLength={dataList?.length || 0}
          >
            {dataList?.map((singleKeepgoPackage, index) => (
              <tr
                className={`bg-white text-blackSemi relative ${
                  index !== dataList.length - 1
                    ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-natural"
                    : ""
                }`}
                key={index}
              >
                <td>{singleKeepgoPackage?.package_id}</td>
                <td className="py-3">{singleKeepgoPackage?.name || "-"}</td>
                <td className="py-3">
                  {singleKeepgoPackage?.data_plan_in_mb || "-"} MB
                </td>
                <td className="py-3">
                  {singleKeepgoPackage?.validity?.amount !== 0
                    ? singleKeepgoPackage?.validity
                      ? `${singleKeepgoPackage.validity.amount} ${
                          singleKeepgoPackage.validity.type
                        }${singleKeepgoPackage.validity.amount > 1 ? "s" : ""}`
                      : "-"
                    : "Unlimited"}
                </td>
                <td className="py-3">
                  {singleKeepgoPackage?.coverage_countries?.length ? (
                    singleKeepgoPackage.coverage_countries.length <= 2 ? (
                      singleKeepgoPackage.coverage_countries
                        .map((c) => c.name)
                        .join(", ")
                    ) : (
                      <>
                        {singleKeepgoPackage.coverage_countries
                          .slice(0, 2)
                          .map((c) => c.name)
                          .join(", ")}
                        <span
                          className="text-neutral-500 ml-1"
                          title={singleKeepgoPackage.coverage_countries
                            .slice(2)
                            .map((c) => c.name)
                            .join(", ")}
                        >
                          +{singleKeepgoPackage.coverage_countries.length - 2}{" "}
                          more
                        </span>
                      </>
                    )
                  ) : singleKeepgoPackage.coverage_regions.length <= 2 ? (
                    singleKeepgoPackage.coverage_regions
                      .map((c) => c.name)
                      .join(", ")
                  ) : (
                    <>
                      {singleKeepgoPackage.coverage_regions
                        .slice(0, 2)
                        .map((c) => c.name)
                        .join(", ")}
                      <span
                        className="text-neutral-500 ml-1"
                        title={singleKeepgoPackage.coverage_regions
                          .slice(2)
                          .map((c) => c.name)
                          .join(", ")}
                      >
                        +{singleKeepgoPackage.coverage_regions.length - 2} more
                      </span>
                    </>
                  )}
                </td>
                {/* <td className="py-3 text-center">
                  {getSymbol("USD")}
                  {singleKeepgoPackage?.price.USD}
                </td> */}
                <td className="py-3 text-center">
                  {getSymbol("USD")}
                  {singleKeepgoPackage?.grand_total_selling_price?.USD}
                </td>
                <td className="py-3 text-center">
                  {singleKeepgoPackage?.discount_on_selling_price != null ||
                  (singleKeepgoPackage?.discount_on_selling_price != 0 &&
                    singleKeepgoPackage?.discount_on_selling_price)
                    ? `${singleKeepgoPackage?.discount_on_selling_price?.amount}%`
                    : "-"}
                </td>
                <td className="py-3">
                  {updatingKeepgoPackages[singleKeepgoPackage._id] ? (
                    <SkeletonBox className="w-24 h-7" />
                  ) : (
                    <Select
                      popupMatchSelectWidth={false}
                      className={`
                          text-sm border rounded-md inline-block w-auto
                          [&_.ant-select-selector]:!h-7
                          [&_.ant-select-selector]:!w-24
                          [&_.ant-select-selector]:!px-2
                          [&_.ant-select-selector]:!flex
                          [&_.ant-select-selector]:!items-center
                        `}
                      value={
                        singleKeepgoPackage.status === "active"
                          ? "Active"
                          : "Inactive"
                      }
                      onChange={(value) =>
                        handleStatusChange(singleKeepgoPackage._id, value)
                      }
                    >
                      <Option value="Active">Active</Option>
                      <Option value="Inactive">Inactive</Option>
                    </Select>
                  )}
                </td>

                <th className="py-3 w-[120px]">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleNavigate(singleKeepgoPackage)}
                    >
                      <EditIcon />
                    </button>
                    <label
                      htmlFor="confirmationPopup"
                      className="cursor-pointer"
                      onClick={() =>
                        setKeepgoPackageId(singleKeepgoPackage?._id)
                      }
                    >
                      <DeleteIcon />
                    </label>
                  </div>
                </th>
              </tr>
            ))}
          </CustomTable>
        </div>
      </section>
      <ConfirmationModal handleStatus={handleDelete} title="package" />
      <NotifyContainer />
    </>
  );
};

export default KeepgoPackageKeepGo;
