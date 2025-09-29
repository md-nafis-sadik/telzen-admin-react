import { useGetNotifications } from "../../hooks/features/useNotifications";
import NotifyContainer from "../../utils/notify";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { CustomTable } from "../../shared/custom";
import NotificationForm from "../forms/NotificationForm";
import { formatStatusStr } from "../../utils/helper";
import SuccessModal from "../../components/modals/SuccessModal";

const Notification = () => {
  const {
    isLoading,
    isError,
    status,
    meta,
    dataList,
    updatePageMeta,
    handleDelete,
    setNotificationId,
    isModalVisible,
    handleModalOk,
  } = useGetNotifications();

  return (
    <>
      <section className="h-full w-full max-h-[95%] px-4 md:px-6 py-6">
        <div className="bg-white p-4 rounded-2xl mb-6">
          <div>
            <h4 className="text-xl font-bold text-blackHigh">
              Send Notification
            </h4>
          </div>
          <div className="mt-6">
            <NotificationForm></NotificationForm>
          </div>
        </div>
        <div className="bg-white shadow-sm w-full rounded-2xl flex flex-col p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="">
              <h2 className="title-cmn text-[18px] font-semibold">
                Notification History
              </h2>
              <div className="font-light text-neutral-700">
                All notification shows here
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4"></div>
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
              "Sl.",
              "Image",
              "Title",
              "Message",
              "Users",
              "Date Sent",
              "Actions",
            ]}
            dataLength={dataList?.length || 0}
          >
            {dataList?.map((notification, index) => (
              <tr
                className={`bg-white text-blackSemi relative ${
                  index !== dataList.length - 1
                    ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-natural"
                    : ""
                }`}
                key={notification?._id}
              >
                <td className="py-3">{index + 1}</td>

                <td className="py-3">
                  <img
                    src={notification?.icon}
                    alt=""
                    className="w-12 h-12"
                  />
                </td>
                <td className="py-3 max-w-[300px]">
                  {notification?.title}
                </td>
                <td className="py-3 max-w-[400px]">
                  {notification?.message}
                </td>
                <td className="py-3">
                  {notification?.recipient_type
                    ? formatStatusStr(notification?.recipient_type)
                    : "N/A"}
                </td>

                <td className="py-3">
                  {new Date(notification?.created_at * 1000).toLocaleDateString(
                    "en-US"
                  )}
                </td>
                <th className="py-3 w-[120px]">
                  <label
                    htmlFor="confirmationPopup"
                    onClick={() => setNotificationId(notification._id)}
                    className="cursor-pointer w-full flex justify-center"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21.49 7.80863V7.81V16.19C21.49 17.9106 20.9791 19.2238 20.0964 20.1064C19.2138 20.9891 17.9006 21.5 16.18 21.5H7.81C6.08945 21.5 4.77634 20.9891 3.89377 20.1054C3.01114 19.2217 2.5 17.9059 2.5 16.18V7.81C2.5 6.08944 3.01093 4.77618 3.89355 3.89355C4.77618 3.01093 6.08944 2.5 7.81 2.5H16.19C17.9107 2.5 19.2237 3.01097 20.105 3.89333C20.9861 4.77559 21.4947 6.08838 21.49 7.80863ZM15.7136 15.7136C16.1988 15.2283 16.1988 14.4317 15.7136 13.9464L13.7671 12L15.7136 10.0536C16.1988 9.56829 16.1988 8.77171 15.7136 8.28645C15.2283 7.80118 14.4317 7.80118 13.9464 8.28645L12 10.2329L10.0536 8.28645C9.56829 7.80118 8.77171 7.80118 8.28645 8.28645C7.80118 8.77171 7.80118 9.56829 8.28645 10.0536L10.2329 12L8.28645 13.9464C7.80118 14.4317 7.80118 15.2283 8.28645 15.7136C8.53516 15.9623 8.85455 16.08 9.17 16.08C9.48545 16.08 9.80484 15.9623 10.0536 15.7136L12 13.7671L13.9464 15.7136C14.1952 15.9623 14.5145 16.08 14.83 16.08C15.1455 16.08 15.4648 15.9623 15.7136 15.7136Z"
                        fill="#FF6B6B"
                        stroke="#FF6B6B"
                      />
                    </svg>
                  </label>
                </th>
              </tr>
            ))}
          </CustomTable>
        </div>
      </section>
      <ConfirmationModal handleStatus={handleDelete} title="notification" />
      <SuccessModal
        open={isModalVisible}
        onOk={handleModalOk}
        modalMessage="Staff Added Successfully!"
      />
      <NotifyContainer />
    </>
  );
};

export default Notification;
