import FormInput from "../../shared/forms/FormInput";
import {
  EyeSvgIcon,
  SearchSvg,
  BlockIcon,
  UnblockIcon,
  LoadingSpinner,
} from "../../utils/svgs";
import SecondaryButton from "../../shared/buttons/SecondaryButton";
import { useGetUsers } from "../../hooks/features/useUsers";
import NotifyContainer from "../../utils/notify";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { CustomTable } from "../../shared/custom";
import SkeletonBox from "../../shared/custom/CustomSkeletonBox";
import ReactCountryFlag from "react-country-flag";
import { dialCodeToCountryCode } from "../../utils/countryCodes";
import { setSelectedUserData } from "../../features/users";
import { Select } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const User = ({ isHome }) => {
  const {
    isLoading,
    isError,
    status,
    meta,
    dataList,
    updatePageMeta,
    handleDelete,
    navigate,
    dispatch,
    filterKey,
    setFilterKey,
    searchKeyword,
    setSearchKeyword,
    handleBlockToggle,
    updatingUsers,
  } = useGetUsers();

  return (
    <>
      <section
        className={`h-full w-full min-h-[95%] ${
          !isHome ? "px-4 md:px-6 py-6" : ""
        }`}
      >
        <div className="bg-white shadow-sm w-full min-h-[720px] rounded-2xl flex flex-col p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="title-cmn text-[18px] font-semibold">Users</h2>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                Join Date:
                <div key="All" className="flex items-center gap-2">
                  <Select
                    value={filterKey === undefined ? "" : filterKey}
                    defaultValue=""
                    onChange={(value) =>
                      setFilterKey(value === "" ? undefined : value)
                    }
                    placeholder="Filter"
                    popupMatchSelectWidth={false}
                    className={`
                                  w-[120px] text-sm border-l first-of-type:border-none
                                  rounded-md
                                  [&_.ant-select-selector]:!text-sm
                                  [&_.ant-select-selector]:!h-7
                                  [&_.ant-select-selector]:!px-2
                                  [&_.ant-select-selector]:!flex
                                  [&_.ant-select-selector]:!items-center
                                  [&_.ant-select-selection-item]:!font-bold
                                `}
                  >
                    <Select.Option key="All" value="">
                      All
                    </Select.Option>
                    <Select.Option key="today" value="today">
                      Today
                    </Select.Option>
                    <Select.Option key="this-week" value="this-week">
                      This Week
                    </Select.Option>
                    <Select.Option key="this-month" value="this-month">
                      This Month
                    </Select.Option>
                    <Select.Option key="this-year" value="this-year">
                      This Year
                    </Select.Option>
                  </Select>
                </div>
              </div>
              <div className="w-full md:w-[200px] relative">
                <FormInput
                  placeholder="Search User"
                  inputCss="pl-12 !py-3 !rounded-lg"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />

                <SearchSvg cls="absolute top-[15px] left-4" />
              </div>
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
              "Country",
              "Name",
              "Email",
              "Join Time",
              "IP",
              "Purchased",
              "Device",
              "Platform",
              "Status",
              "Actions",
            ]}
            dataLength={dataList?.length || 0}
          >
            {dataList?.map((user, index) => (
              <tr
                className={`bg-white text-blackSemi relative ${
                  index !== dataList.length - 1
                    ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-natural"
                    : ""
                }`}
                key={index}
              >
                <td className="py-4">{user?.customer_id}</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <ReactCountryFlag
                      countryCode={user?.country?.code || "US"} // Fallback to US if not found
                      svg
                      style={{
                        display: "block",
                        width: "1.1em",
                        height: "1.1em",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      title={user?.country?.name}
                      className="shadow-md"
                    />{" "}
                    <span className="truncate">{user?.country?.name}</span>
                  </div>
                </td>
                <td className="py-4">{user?.name || "N/A"}</td>
                {/* <td className="py-4">{user?.phone}</td> */}
                <td className="py-4">{user?.email}</td>

                <td className="py-4">
                  {user?.created_at
                    ? dayjs.unix(user.created_at).format("DD-MM-YYYY (HH:mm)")
                    : "-"}
                </td>

                <td className="py-4">
                  {user?.is_registered_via_web
                    ? user?.device?.web_ip_address || "N/A"
                    : user?.device?.app_ip_address || "N/A"}
                </td>
                <td className="py-4 flex items-center justify-center">
                  {user?.total_purchased_data_packages || 0}
                </td>
                <td className="py-4 capitalize">
                  {user?.is_registered_via_web
                    ? "Web"
                    : user?.device?.app_brand_name || "N/A"}
                </td>
                <td className="py-4 capitalize">
                  {user?.is_registered_via_web
                    ? "Web"
                    : user?.device?.app_os_platform || "N/A"}
                </td>
                <td className="py-4 flex items-center gap-4">
                  {user?.is_blocked ? (
                    <span className="text-[#9E9E9E]">Blocked</span>
                  ) : (
                    <span className="text-[#00AE5B]">Active</span>
                  )}
                </td>
                <th className="py-3 w-[100px] border-l border-natural-100">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(setSelectedUserData(user));
                        navigate(`/users/${user?._id}`);
                      }}
                    >
                      <EyeSvgIcon />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleBlockToggle(user?._id, user?.is_blocked)
                      }
                      disabled={updatingUsers[user?._id]}
                      className="p-1 rounded transition-colors"
                    >
                      {updatingUsers[user?._id] ? (
                        <LoadingSpinner />
                      ) : user?.is_blocked ? (
                        <UnblockIcon />
                      ) : (
                        <BlockIcon />
                      )}
                    </button>
                  </div>
                </th>
              </tr>
            ))}
          </CustomTable>
        </div>
      </section>
      <ConfirmationModal handleStatus={handleDelete} title="user" />
      <NotifyContainer />
    </>
  );
};

export default User;
