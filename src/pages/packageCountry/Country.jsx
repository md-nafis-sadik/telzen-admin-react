import FormInput from "../../shared/forms/FormInput";
import { DeleteIcon, EditIcon, SearchSvg } from "../../utils/svgs";
import SecondaryButton from "../../shared/buttons/SecondaryButton";
import { useGetCountries } from "../../hooks/features/useCountrys";
import NotifyContainer from "../../utils/notify";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { CustomTable } from "../../shared/custom";
import SkeletonBox from "../../shared/custom/CustomSkeletonBox";
import { Select } from "antd";

const Country = () => {
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
    setCountryId,
    handleNavigate,
    handleOpenAddCountryModal,
    handleStatusChange,
    updatingCountrys,
    isPopularFilter,
    setIsPopularFilter,
  } = useGetCountries();
  const { Option } = Select;

  return (
    <>
      <section className="h-full w-full max-h-[95%] px-4 md:px-6 py-6">
        <div className="bg-white shadow-sm w-full rounded-2xl flex flex-col p-4">
          <div className="flex flex-col lg:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="title-cmn text-[18px] font-semibold">Country</h2>

            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="flex flex-col lg:flex-row items-center gap-2 ">
                <div key="All" className="flex items-center flex-wrap gap-3">
                  {/* Status Filter */}
                  <div className="flex items-center gap-2">
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
                      [&_.ant-select-selection-item]:!font-bold
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
                  {/* Popular Filter */}
                  <div className="flex items-center gap-2">
                    Popularity:
                    <Select
                      value={
                        isPopularFilter === undefined ? "" : isPopularFilter
                      }
                      onChange={(value) =>
                        setIsPopularFilter(value === "" ? undefined : value)
                      }
                      placeholder="Popularity"
                      popupMatchSelectWidth={false}
                      className={`
                      w-[130px] text-sm
                      rounded-md
                      [&_.ant-select-selector]:!text-sm
                      [&_.ant-select-selector]:!h-7
                      [&_.ant-select-selector]:!px-2
                      [&_.ant-select-selector]:!flex
                      [&_.ant-select-selector]:!items-center
                      [&_.ant-select-selection-item]:!font-bold
                    `}
                    >
                      <Option key="All" value="">
                        All
                      </Option>
                      <Option key="Popular" value="true">
                        Popular
                      </Option>
                      <Option key="Non-Popular" value="false">
                        Non-Popular
                      </Option>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-[200px] relative">
                <FormInput
                  placeholder="Search Country"
                  inputCss="pl-12 !py-3 !rounded-lg"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />

                <SearchSvg cls="absolute top-[15px] left-4" />
              </div>

              <SecondaryButton
                text="Add Country"
                width="w-max"
                onClick={() => handleOpenAddCountryModal()}
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
              "Sl ID",
              "Flag",
              "Country Name",
              "Region Name",
              "Popularity",
              "Status",
              "Action",
            ]}
            dataLength={dataList?.length || 0}
          >
            {dataList?.map((country, index) => (
              <tr
                className={`bg-white text-blackSemi relative ${
                  index !== dataList.length - 1
                    ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-natural"
                    : ""
                }`}
                key={country._id}
              >
                <td>{country?.country_id}</td>
                <td>
                  {country?.flag && (
                    <img
                      src={country.flag}
                      alt={country.name}
                      className="w-5 h-4 object-cover rounded-sm"
                    />
                  )}
                </td>
                <td>{country?.name}</td>
                <td>{country?.region?.name || "-"}</td>
                <td>{country?.is_popular ? "Popular" : "Non-Popular"}</td>
                <td className="py-3">
                  {updatingCountrys[country._id] ? (
                    <SkeletonBox className="h-7 w-24" />
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
                        country?.status === "active" ? "Active" : "Inactive"
                      }
                      onChange={(value) =>
                        handleStatusChange(country._id, value)
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
                      onClick={() => handleNavigate(country)}
                    >
                      <EditIcon />
                    </button>
                    <label
                      htmlFor="confirmationPopup"
                      className="cursor-pointer"
                      onClick={() => setCountryId(country._id)}
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
      <ConfirmationModal handleStatus={handleDelete} title="country" />
      <NotifyContainer />
    </>
  );
};

export default Country;
