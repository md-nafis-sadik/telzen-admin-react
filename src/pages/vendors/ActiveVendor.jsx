import { BlockIcon, EyeSvgIcon, LoadingSpinner, UnblockIcon } from "../../utils/svgs";
import { useGetActiveVendors } from "../../hooks/features/useVendor";
import NotifyContainer from "../../utils/notify";
import { CustomTable } from "../../shared/custom";
import ReactCountryFlag from "react-country-flag";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const ActiveVendor = () => {
  const {
    isLoading,
    isError,
    status,
    meta,
    dataList,
    updatePageMeta,
    handleViewDetails,
    handleBlockVendor,
    updatingVendors,
  } = useGetActiveVendors();

  return (
    <>
      <section className="h-full w-full min-h-[95%] px-4 md:px-6 py-6">
        <div className="bg-white shadow-sm w-full min-h-[720px] rounded-2xl flex flex-col p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="title-cmn text-[18px] font-semibold">Vendor</h2>
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
            {dataList?.map((vendor, index) => (
              <tr
                className={`bg-white text-blackSemi relative ${
                  index !== dataList.length - 1
                    ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-natural"
                    : ""
                }`}
                key={vendor._id}
              >
                <td className="py-4">{vendor.uid}</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <ReactCountryFlag
                      countryCode={vendor.country?.code}
                      svg
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <span>{vendor.country?.name}</span>
                  </div>
                </td>
                <td className="py-4">{vendor.business_name}</td>
                <td className="py-4">{vendor.email}</td>
                <td className="py-4">{vendor.contact_person_name}</td>
                <td className="py-4">
                  {dayjs.unix(vendor.created_at).format("DD/MM/YYYY HH:mm")}
                </td>
                <td className="py-4 text-[#56AD7E]">
                  {vendor.status === "blocked" ? (
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
                      onClick={() => handleViewDetails(vendor)}
                      title="View Details"
                    >
                      <EyeSvgIcon />
                    </button>
                    <button
                      type="button"
                      disabled={updatingVendors[vendor._id]}
                      className=""
                      onClick={() =>
                        handleBlockVendor(
                          vendor._id,
                          vendor.status !== "blocked",
                        )
                      }
                      title={
                        vendor.status === "blocked"
                          ? "Unblock Vendor"
                          : "Block Vendor"
                      }
                    >
                      {updatingVendors[vendor._id] ? (
                        <LoadingSpinner />
                      ) : vendor.status === "blocked" ? (
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

export default ActiveVendor;
