import NotifyContainer from "../../utils/notify";
import { CustomTable } from "../../shared/custom";
import dayjs from "dayjs";
import { useGetRevenues } from "../../hooks/features/useRevenues";
import { ExportIcon, LoadingSpinner, PrintIcon } from "../../utils/svgs";
import { formatStatusStr } from "../../utils/helper";
import { getSymbol } from "../../utils/currency";
import ReactCountryFlag from "react-country-flag";

const Revenue = () => {
  const {
    isLoading,
    isError,
    status,
    meta,
    dataList,
    updatePageMeta,
    revenueSummary,
    handleExport,
    handlePrint,
  } = useGetRevenues();

  return (
    <>
      <section className="h-full w-full max-h-[95%] px-4 md:px-6 py-6">
        <div className="w-full bg-white p-4 rounded-2xl mb-6">
          <div className="bg-white">
            <h4 className="text-[20px] text-blackHigh font-bold">Revenue</h4>

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
                  revenueSummary?.map((item, i) => (
                    <div
                      key={i}
                      className={`${item.bgColor} p-5 rounded-lg flex flex-col justify-between h-full`}
                    >
                      <div className="mb-2 text-sm">{item?.title}</div>
                      <div className="text-lg font-semibold">
                        {item?.currency && <span>{item.currency}</span>}
                        {item?.number}
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm w-full rounded-2xl overflow-hidden flex flex-col p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="">
              <h2 className="title-cmn text-[18px] font-semibold">Sales</h2>
              <div className="font-light text-black-900">
                All activity shows here
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex gap-3">
                <div
                  className="inline-flex pl-5 pr-6 py-3 bg-white border border-natural-500 text-black rounded-lg gap-2 cursor-pointer hover:bg-neutral-100"
                  onClick={handleExport}
                >
                  <ExportIcon />
                  <span className="text-sm font-semibold">Export to Excel</span>
                </div>

                <div
                  className="inline-flex pl-5 pr-6 py-3 bg-black border border-black text-white rounded-lg gap-2 cursor-pointer hover:bg-black-900"
                  onClick={handlePrint}
                >
                  <PrintIcon />
                  <span className="text-sm font-semibold">Print</span>
                </div>
              </div>
            </div>
          </div>

          <div className="printable-content">
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
                "Order ID",
                "Date",
                "Package",
                "Customer",
                "Customer Email",
                "Amount",
                "Payment Status",
              ]}
              dataLength={dataList?.length || 0}
            >
              {dataList?.map((revenue, index) => (
                <tr
                  className={`bg-white text-blackSemi relative ${
                    index !== dataList.length - 1
                      ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-natural"
                      : ""
                  }`}
                  key={revenue?.order_id}
                >
                  <td className="print:text-xs">{revenue?.order_id}</td>
                  <td className="print:text-xs">
                    {dayjs.unix(revenue?.selling_date).format("YYYY-MM-DD")}
                  </td>

                  <td className="print:text-xs">{revenue?.package?.name}</td>
                  {/* <td className="print:text-xs">
                    {formatStatusStr(revenue?.vendor_name)}
                  </td> */}
                  <td className="print:text-xs">{revenue?.customer.name}</td>
                  <td className="print:text-xs">{revenue?.customer?.email}</td>
                  {/* <td className="print:text-xs">{revenue?.customer?.phone}</td> */}
                  {/* <td className="print:text-xs">
                    <div className="flex gap-2 items-center print:text-xs">
                      <ReactCountryFlag
                        countryCode={revenue?.associated_country?.code || "US"} // Fallback to US if not found
                        svg
                        style={{
                          display: "block",
                          width: "1.1em",
                          height: "1.1em",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                        title={revenue?.associated_country?.name}
                        className="shadow-md print:text-xs"
                      />{" "}
                      {revenue?.associated_country.name}
                    </div>
                  </td> */}
                  <td className="text-center print:text-xs">
                    {getSymbol(revenue?.payment_currency)}
                    {revenue?.payment_amount?.USD}
                  </td>
                  <td className=" text-center print:text-xs">
                    {revenue?.payment_status === "refunded" ? (
                      <span className="text-orange-400 print:text-xs">
                        {formatStatusStr(revenue?.payment_status)}
                      </span>
                    ) : (
                      <span className="text-[#2CC672] print:text-xs">
                        {formatStatusStr(revenue?.payment_status)}
                      </span>
                    )}
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
};

export default Revenue;
