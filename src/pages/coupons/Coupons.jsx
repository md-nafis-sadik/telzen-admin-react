import FormInput from "../../shared/forms/FormInput";
import { DeleteIcon, EditIcon, SearchSvg } from "../../utils/svgs";
import SecondaryButton from "../../shared/buttons/SecondaryButton";
import { useGetCoupons } from "../../hooks/features/useCoupons";
import NotifyContainer from "../../utils/notify";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { CustomTable } from "../../shared/custom";
import SkeletonBox from "../../shared/custom/CustomSkeletonBox";
import dayjs from "dayjs";
import { Select } from "antd";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const Coupon = () => {
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
    setCouponId,
    handleNavigate,
    handleOpenAddCouponModal,
    handleStatusChange,
    updatingCoupons,
  } = useGetCoupons();

  const { Option } = Select;

  return (
    <>
      <section className="h-full w-full max-h-[95%] px-4 md:px-6 py-6">
        <div className="bg-white shadow-sm w-full rounded-2xl flex flex-col p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="title-cmn text-[18px] font-semibold">Coupon</h2>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-[200px] relative">
                <FormInput
                  placeholder="Search Coupon"
                  inputCss="pl-12 !py-3 !rounded-lg"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />

                <SearchSvg cls="absolute top-[15px] left-4" />
              </div>

              <SecondaryButton
                text="Add Coupon"
                width="w-max"
                onClick={() => handleOpenAddCouponModal()}
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
              "Minimum",
              "Maximum",
              "Privacy Type",
              "Status",
              "Action",
            ]}
            dataLength={dataList?.length || 0}
          >
            {dataList?.map((coupon, index) => (
              <tr
                className={`bg-white text-blackSemi relative ${
                  index !== dataList.length - 1
                    ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-natural"
                    : ""
                }`}
                key={coupon?._id}
              >
                <td>{coupon?.title}</td>
                <td>{coupon?.code}</td>
                <td>{coupon.discount?.amount}%</td>
                <td>
                  {coupon?.coverage_countries?.length ? (
                    coupon.coverage_countries.length <= 2 ? (
                      coupon.coverage_countries.map((c) => c.name).join(", ")
                    ) : (
                      <>
                        {coupon.coverage_countries
                          .slice(0, 2)
                          .map((c) => c.name)
                          .join(", ")}
                        <span
                          className="text-neutral-500 ml-1"
                          title={coupon.coverage_countries
                            .slice(2)
                            .map((c) => c.name)
                            .join(", ")}
                        >
                          +{coupon.coverage_countries.length - 2} more
                        </span>
                      </>
                    )
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {coupon?.validity_end_at
                    ? `${dayjs
                        .unix(coupon.validity_end_at)
                        .utc()
                        .format("DD-MM-YYYY")}`
                    : "-"}
                </td>
                <td>
                  {coupon?.validity_end_at
                    ? `${dayjs
                        .unix(coupon.validity_end_at)
                        .utc()
                        .format("HH:mm")}`
                    : "-"}
                </td>
                <td>{coupon?.usages_count}</td>
                <td>{coupon?.max_usages_limit}</td>
                <td>{coupon?.minimum_order_amount || "-"}</td>
                <td>{coupon?.maximum_order_amount || "-"}</td>
                <td>{coupon?.is_private ? "Private" : "Public"}</td>
                <td className="py-3">
                  {updatingCoupons[coupon._id] ? (
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
                      value={coupon?.is_active ? "Active" : "Inactive"}
                      onChange={(value) =>
                        handleStatusChange(coupon._id, value)
                      }
                    >
                      <Option value="Active">Active</Option>
                      <Option value="Inactive">Inactive</Option>
                    </Select>
                  )}
                </td>

                <th className="py-3 w-[120px]">
                  <span className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleNavigate(coupon)}
                    >
                      <EditIcon />
                    </button>
                    <label
                      htmlFor="confirmationPopup"
                      className="cursor-pointer"
                      onClick={() => setCouponId(coupon._id)}
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
      <ConfirmationModal handleStatus={handleDelete} title="coupon" />
      <NotifyContainer />
    </>
  );
};

export default Coupon;
