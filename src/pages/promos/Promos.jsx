import FormInput from "../../shared/forms/FormInput";
import { DeleteIcon, EditIcon, SearchSvg } from "../../utils/svgs";
import SecondaryButton from "../../shared/buttons/SecondaryButton";
import { useGetPromos } from "../../hooks/features/usePromos";
import NotifyContainer from "../../utils/notify";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { CustomTable } from "../../shared/custom";
import SkeletonBox from "../../shared/custom/CustomSkeletonBox";
import dayjs from "dayjs";
import { Select } from "antd";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const Promo = () => {
  const {
    isLoading,
    isError,
    status,
    meta,
    dataList,
    searchKeyword,
    setSearchKeyword,
    updatePageMeta,
    handleDelete,
    setPromoId,
    handleNavigate,
    handleOpenAddPromoModal,
    handleStatusChange,
    updatingPromos,
  } = useGetPromos();

  const { Option } = Select;

  return (
    <>
      <section className="h-full w-full max-h-[95%] px-4 md:px-6 py-6">
        <div className="bg-white shadow-sm w-full rounded-2xl flex flex-col p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="title-cmn text-[18px] font-semibold">Promo</h2>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-[200px] relative">
                <FormInput
                  placeholder="Search Promo"
                  inputCss="pl-12 !py-3 !rounded-lg"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />

                <SearchSvg cls="absolute top-[15px] left-4" />
              </div>

              <SecondaryButton
                text="Add Promo"
                width="w-max"
                onClick={() => handleOpenAddPromoModal()}
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
              "Title",
              "Code",
              "Discount",
              "Coverage",
              "End Date",
              "End Time",
              "Usage",
              "Usage Limit",
              "Privacy Type",
              "Status",
              "Action",
            ]}
            dataLength={dataList?.length || 0}
          >
            {dataList?.map((promo, index) => (
              <tr
                className={`bg-white text-blackSemi relative ${
                  index !== dataList.length - 1
                    ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-natural"
                    : ""
                }`}
                key={promo?._id}
              >
                <td>{promo?.title}</td>
                <td>{promo?.code}</td>
                <td>{promo.discount?.amount}%</td>
                <td>
                  {promo?.coverage_countries?.length ? (
                    promo.coverage_countries.length <= 2 ? (
                      promo.coverage_countries.map((c) => c.name).join(", ")
                    ) : (
                      <>
                        {promo.coverage_countries
                          .slice(0, 2)
                          .map((c) => c.name)
                          .join(", ")}
                        <span
                          className="text-neutral-500 ml-1"
                          title={promo.coverage_countries
                            .slice(2)
                            .map((c) => c.name)
                            .join(", ")}
                        >
                          +{promo.coverage_countries.length - 2} more
                        </span>
                      </>
                    )
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {promo?.validity_end_at
                    ? `${dayjs
                        .unix(promo.validity_end_at)
                        .utc()
                        .format("YYYY-MM-DD")}`
                    : "-"}
                </td>
                <td>
                  {promo?.validity_end_at
                    ? `${dayjs
                        .unix(promo.validity_end_at)
                        .utc()
                        .format("HH:mm")}`
                    : "-"}
                </td>
                <td>{promo?.usages_count}</td>
                <td>{promo?.max_usages_limit}</td>
                <td>{promo?.is_private ? "Private" : "Public"}</td>
                <td className="py-3">
                  {updatingPromos[promo._id] ? (
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
                      value={promo?.is_active ? "Active" : "Inactive"}
                      onChange={(value) => handleStatusChange(promo._id, value)}
                    >
                      <Option value="Active">Active</Option>
                      <Option value="Inactive">Inactive</Option>
                    </Select>
                  )}
                </td>

                <th className="py-3 w-[120px]">
                  <span className="flex items-center justify-center gap-2">
                    <button type="button" onClick={() => handleNavigate(promo)}>
                      <EditIcon />
                    </button>
                    <label
                      htmlFor="confirmationPopup"
                      className="cursor-pointer"
                      onClick={() => setPromoId(promo._id)}
                    >
                      <DeleteIcon />
                    </label>
                  </span>
                </th>
              </tr>
            ))}
          </CustomTable>
        </div>
      </section>
      <ConfirmationModal handleStatus={handleDelete} title="promo" />
      <NotifyContainer />
    </>
  );
};

export default Promo;
