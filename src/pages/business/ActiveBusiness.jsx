import { BlockIcon, EyeSvgIcon, LoadingSpinner } from "../../utils/svgs";
import { useGetActiveBusinesses } from "../../hooks/features/useBusiness";
import NotifyContainer from "../../utils/notify";
import { CustomTable } from "../../shared/custom";
import ReactCountryFlag from "react-country-flag";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const ActiveBusiness = () => {
  const {
    isLoading,
    isError,
    status,
    meta,
    dataList,
    updatePageMeta,
    handleViewDetails,
  } = useGetActiveBusinesses();

  return (
    <>
      <section className="h-full w-full min-h-[95%] px-4 md:px-6 py-6">
        <div className="bg-white shadow-sm w-full min-h-[720px] rounded-2xl flex flex-col p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="title-cmn text-[18px] font-semibold">Business</h2>
          </div>

          <CustomTable
            isLoading={isLoading}
            isError={isError}
            status={status}
            current_page={meta?.current_page || 1}
            page_size={meta?.page_size || 10}
            total_pages={meta?.total_pages || 1}
            total_items={meta?.total_items || 0}
            updatePageMeta={updatePageMeta}
            columns={[
              "ID",
              "Country",
              "Name",
              "Email",
              "Contact Person",
              "Join Time",
              "Status",
              "Action",
            ]}
            dataLength={dataList?.length || 0}
          >
            {dataList?.map((business, index) => (
              <tr
                className={`bg-white text-blackSemi relative ${
                  index !== dataList.length - 1
                    ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-natural"
                    : ""
                }`}
                key={business._id}
              >
                <td className="py-4">{business.businessId}</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <ReactCountryFlag
                      countryCode={business.country}
                      svg
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <span>{business.countryName}</span>
                  </div>
                </td>
                <td className="py-4">{business.name}</td>
                <td className="py-4">{business.email}</td>
                <td className="py-4">{business.contactPerson}</td>
                <td className="py-4">
                  {dayjs.unix(business.timestamp).format("DD/MM/YYYY HH:mm")}
                </td>
                <td className="py-4 text-[#56AD7E]">
                  Active
                </td>
                <td className="py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      className=""
                      onClick={() => handleViewDetails(business)}
                      title="View Details"
                    >
                      <EyeSvgIcon />
                    </button>
                    <button
                      type="button"
                      className=""
                      title="Delete"
                    >
                      <BlockIcon/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </CustomTable>
        </div>
      </section>
      <NotifyContainer />
    </>
  );
};

export default ActiveBusiness;
