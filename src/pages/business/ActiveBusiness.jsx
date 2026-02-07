import { BlockIcon, EyeSvgIcon, LoadingSpinner, UnblockIcon } from "../../utils/svgs";
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
    handleBlockBusiness,
    updatingBusinesses,
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
                <td className="py-4">{business.uid}</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <ReactCountryFlag
                      countryCode={business.country?.code}
                      svg
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <span>{business.country?.name}</span>
                  </div>
                </td>
                <td className="py-4">{business.business_name}</td>
                <td className="py-4">{business.email}</td>
                <td className="py-4">{business.contact_person_name}</td>
                <td className="py-4">
                  {dayjs.unix(business.created_at).format("DD/MM/YYYY HH:mm")}
                </td>
                <td className="py-4 text-[#56AD7E]">
                  {business.status === "blocked" ? (
                    <span className="text-red-500">Blocked</span>
                  ) : (
                    <span className="text-[#56AD7E]">Active</span>
                  )}
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
                      className="p-1 rounded transition-colors"
                      onClick={() =>
                        handleBlockBusiness(
                          business._id,
                          business.status !== "blocked"
                        )
                      }
                      disabled={updatingBusinesses[business._id]}
                      title={business.status === "blocked" ? "Unblock" : "Block"}
                    >
                      {updatingBusinesses[business._id] ? (
                        <LoadingSpinner />
                      ) : business.status === "blocked" ? (
                        <UnblockIcon />
                      ) : (
                        <BlockIcon />
                      )}
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
