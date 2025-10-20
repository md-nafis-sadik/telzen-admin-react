import { DownloadSvgIcon } from "../../utils/svgs";
import { useGetUserDetails } from "../../hooks/features/useUserDetails";
import NotifyContainer from "../../utils/notify";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { CustomTable } from "../../shared/custom";
import { getSymbol } from "../../utils/currency";

const UserDetails = ({ isHome }) => {
  const {
    isLoading,
    isError,
    status,
    meta,
    dataList,
    updatePageMeta,
    handleDelete,
    userDetailsId,
    downloadInvoice,
    selectedData,
    selectedUserdata,
    handleDownloadInvoice,
  } = useGetUserDetails();

  return (
    <>
      <section
        className={`h-full w-full min-h-[95%] ${
          !isHome ? "px-4 md:px-6 py-6" : ""
        }`}
      >
        <div className="bg-white shadow-sm w-full min-h-[720px] rounded-2xl flex flex-col p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="title-cmn text-[18px] font-semibold">
              {selectedUserdata?.full_name}
            </h2>
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
              "ID",
              "Bundle",
              "Data Limit",
              "Date",
              "Price",
              "Bundle Purchased",
              "Line Status",
            ]}
            dataLength={dataList?.length || 0}
          >
            {dataList?.map((userDetails, index) => (
              <tr
                className={`bg-white text-blackSemi relative ${
                  index !== dataList.length - 1
                    ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-natural"
                    : ""
                }`}
                key={index}
              >
                <td className="py-4">{userDetails?.esim?.iccid}</td>
                <td className="py-4">{userDetails?.static_package?.name}</td>
                <td className="py-4">
                  {userDetails?.static_package?.data_plan_in_mb}
                </td>
                <td className="py-4">
                  {userDetails?.static_package?.validity.amount}{" "}
                  {userDetails?.static_package?.validity.amount > 1
                    ? "days"
                    : "day"}
                </td>
                <td className="py-4">
                  {getSymbol(userDetails?.order?.payment_currency)}
                  {userDetails?.order?.payment_amount.USD}
                </td>
                <td className="py-4 flex items-center gap-4">
                  {new Date(
                    userDetails?.order?.created_at * 1000
                  ).toLocaleDateString("en-US")}
                </td>
                <th className="py-3 w-[150px]">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      className="flex items-center gap-2"
                      onClick={() =>
                        handleDownloadInvoice({
                          user: selectedUserdata,
                          userDetails,
                        })
                      }
                    >
                      {userDetails?.keep_go_data_bundle_status ===
                      "Non-active" ? (
                        <span className={`text-black-900 font-normal`}>
                          Inactive
                        </span>
                      ) : (
                        <span className={`text-[#56AD7E] font-normal`}>
                          Activated
                        </span>
                      )}
                      <DownloadSvgIcon />
                    </button>
                  </div>
                </th>
              </tr>
            ))}
          </CustomTable>
        </div>
      </section>
      <ConfirmationModal handleStatus={handleDelete} title="userDetails" />
      <NotifyContainer />
    </>
  );
};

export default UserDetails;
