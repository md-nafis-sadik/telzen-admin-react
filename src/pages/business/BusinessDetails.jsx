import { useGetBusinessDetails } from "../../hooks/features/useBusiness";
import { useParams } from "react-router-dom";
import NotifyContainer from "../../utils/notify";
import { CustomTable } from "../../shared/custom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import BusinessDetailsForm from "../forms/BusinessDetailsForm";
import { getSymbol } from "../../utils/currency";
import { ErrorUi } from "../../shared/ui";
dayjs.extend(utc);

const BusinessDetails = () => {
  const { Id } = useParams();
  const {
    selectedBusiness,
    transactionData,
    handleBack,
    businessSummary,
    isLoading,
    stats,
    activeTab,
    meta,
  } = useGetBusinessDetails(Id);

  if (isLoading || selectedBusiness) {
    return (
      <>
        <section className="h-full w-full min-h-[95%] px-4 md:px-6 py-6">
          <BusinessDetailsForm
            business={selectedBusiness}
            isLoading={isLoading}
            activeTab={activeTab}
          />
          {/* Business Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {isLoading ? (
              // Skeleton for loading state
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 h-32 animate-pulse"
                >
                  <div className="h-5 w-32 bg-neutral-200 rounded mb-3"></div>
                  <div className="h-8 w-20 bg-neutral-300 rounded"></div>
                </div>
              ))
            ) : (
              <>
                <div className="bg-white rounded-2xl p-4 h-32">
                  <p className="text-base text-black-700 mb-1">
                    Total Customers
                  </p>
                  <p className="text-2xl font-semibold text-black-900">
                    {stats?.total_customers || 0}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-4 h-32">
                  <p className="text-base text-black-700 mb-1">Total Groups</p>
                  <p className="text-2xl font-semibold text-black-900">
                    {stats?.total_groups || 0}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-4 h-32">
                  <p className="text-base text-black-700 mb-1">Total Staffs</p>
                  <p className="text-2xl font-semibold text-black-900">
                    {stats?.total_staff || 0}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="w-full bg-white p-4 rounded-2xl mb-6">
            <div className="bg-white">
              <h4 className="text-[20px] text-blackHigh font-bold">Overview</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-stretch gap-4 mt-4">
                {isLoading
                  ? // Skeleton for loading state
                    Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-neutral-100 p-5 rounded-lg animate-pulse"
                      >
                        <div className="h-5 w-3/4 bg-neutral-300 rounded mb-[14px]"></div>
                        <div className="h-7 w-1/2 bg-neutral-400 rounded"></div>
                      </div>
                    ))
                  : // Actual content when loaded
                    businessSummary?.map((item, i) => (
                      <div
                        key={i}
                        className={`${item.bgColor} p-5 rounded-xl flex flex-col justify-between h-full`}
                      >
                        <div className="mb-2 text-sm">{item?.title}</div>
                        <div className="text-lg font-semibold">
                          {item?.currency && <span>{item.currency}</span>}
                          {item?.number === 0 ? 0 : item?.number.toFixed(2)}
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm w-full min-h-[720px] rounded-2xl flex flex-col p-4">
            {/* Sales Table */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[20px] font-semibold text-[#101828]">
                    Sales
                  </h3>
                  <p className="text-sm text-[#475467]">
                    All activity shows here
                  </p>
                </div>
                {/* <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
                  See All
                </button> */}
              </div>

              <CustomTable
                isLoading={isLoading}
                isError={false}
                status={200}
                current_page={meta?.current_page || 1}
                page_size={meta?.page_size || 10}
                total_pages={meta?.total_pages || 1}
                total_items={meta?.total_items || 0}
                updatePageMeta={() => {}}
                columns={[
                  "Order ID",
                  "Date",
                  "Package",
                  "Customer",
                  "Group Name",
                  "Customer Email",
                  "Amount",
                  "Revenue",
                ]}
                dataLength={transactionData.length}
                isPagination={false}
              >
                {transactionData.map((order, index) => (
                  <tr
                    className={`bg-white text-blackSemi relative ${
                      index !== transactionData.length - 1
                        ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-natural"
                        : ""
                    }`}
                    key={order._id}
                  >
                    <td className="py-4">{order.uid}</td>
                    <td className="py-4">
                      {dayjs.unix(order.created_at).format("DD/MM/YYYY")}
                    </td>
                    <td className="py-4">{order.package?.name}</td>
                    <td className="py-4">{order.customer?.name}</td>
                    <td className="py-4">{order.group?.name || "-"}</td>
                    <td className="py-4">{order.customer?.email || "-"}</td>
                    <td className="py-4">
                      {getSymbol(order.payment_currency)}
                      {order.payment_amount}
                    </td>
                    <td className="py-4">
                      {getSymbol(order.payment_currency)}
                      {order.revenue}
                    </td>
                  </tr>
                ))}
              </CustomTable>
            </div>
          </div>
        </section>
        <NotifyContainer />
      </>
    );
  }

  return (
    <section className="h-full w-full min-h-[95%] px-4 md:px-6 py-6">
      <ErrorUi title="Business Not Found" />
    </section>
  );
};

export default BusinessDetails;
