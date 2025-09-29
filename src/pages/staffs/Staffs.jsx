import SecondaryButton from "../../shared/buttons/SecondaryButton";
import { useGetStaffs } from "../../hooks/features/useStaffs";
import NotifyContainer from "../../utils/notify";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { CustomTable } from "../../shared/custom";
import { formatStatusStr } from "../../utils/helper";
import {
  BlockIcon,
  DeleteIcon,
  EditIcon,
  LoadingSpinner,
  UnblockIcon,
} from "../../utils/svgs";

const Staff = () => {
  const {
    isLoading,
    isError,
    status,
    meta,
    dataList,
    updatePageMeta,
    handleDelete,
    setStaffId,
    handleNavigate,
    handleOpenAddStaffModal,
    handleBlockToggle,
    updatingStaffs,
    ADMIN_EMAIL,
  } = useGetStaffs();

  return (
    <>
      <section className="h-full w-full max-h-[95%] px-4 md:px-6 py-6">
        <div className="bg-white shadow-sm w-full rounded-2xl flex flex-col p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="">
              <h2 className="title-cmn text-[18px] font-semibold">Staff</h2>
              <div className="font-light text-black-900">
                List of management staffs
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <SecondaryButton
                text="Add New"
                width="w-max"
                onClick={() => handleOpenAddStaffModal()}
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
              "ID",
              "Staff Name",
              "Role",
              "Email",
              "Phone",
              "Status",
              "Action",
            ]}
            dataLength={dataList?.length || 0}
          >
            {dataList?.map((staff, index) => (
              <tr
                className={`bg-white text-blackSemi relative ${
                  index !== dataList.length - 1
                    ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-natural"
                    : ""
                }`}
                key={index}
              >
                <td>{staff?.admin_id}</td>
                <td className="py-3">{staff?.name}</td>
                <td className="py-3">{formatStatusStr(staff?.role)}</td>
                <td className="py-3">{staff?.email}</td>
                <td className="py-3">{staff?.phone}</td>
                <td className="py-3">
                  {staff?.is_blocked ? (
                    <span className="text-red-500">Blocked</span>
                  ) : (
                    <span className="text-green-600">Active</span>
                  )}
                </td>
                <th className="py-3 w-[120px]">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleNavigate(staff)}
                      disabled={staff?.email === ADMIN_EMAIL}
                      className={`p-1 rounded transition-colors ${
                        staff?.email === ADMIN_EMAIL
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <EditIcon />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleBlockToggle(staff._id, staff.is_blocked)
                      }
                      disabled={
                        updatingStaffs[staff._id] ||
                        staff?.email === ADMIN_EMAIL
                      }
                      className={`p-1 rounded transition-colors ${
                        staff?.email === ADMIN_EMAIL
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {updatingStaffs[staff._id] ? (
                        // Loading spinner
                        <LoadingSpinner />
                      ) : staff.is_blocked ? (
                        <UnblockIcon />
                      ) : (
                        <BlockIcon />
                      )}
                    </button>
                    <label
                      htmlFor="confirmationPopup"
                      onClick={() => setStaffId(staff?._id)}
                      disabled={staff?.email === ADMIN_EMAIL}
                      className={`p-1 rounded  transition-colors ${
                        staff?.email === ADMIN_EMAIL
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
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
      <ConfirmationModal handleStatus={handleDelete} title="staff" />
      <NotifyContainer />
    </>
  );
};

export default Staff;
