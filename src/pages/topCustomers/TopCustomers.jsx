import { CustomTable } from "../../shared/custom";
import { useTopCustomers } from "../../hooks/features/useTopCustomers";
import ReactCountryFlag from "react-country-flag";
import dayjs from "dayjs";

const TopCustomers = () => {
  const { dataList, isLoading, isError } = useTopCustomers();

  return (
    <div className="bg-white shadow-sm w-full rounded-2xl overflow-hidden flex flex-col p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="title-cmn text-[18px] font-semibold">Top Customers</h2>
          <div className="font-light text-black-900">
            Top customers by package purchases
          </div>
        </div>
      </div>

      <CustomTable
        isLoading={isLoading}
        isError={isError}
        status={isError ? "failed" : "succeeded"}
        columns={[
          "Customer ID",
          "Country",
          "Name",
          "Email",
          "Join Date",
          "IP",
          "Purchased",
          "Device",
          "Platform",
          "Status",
        ]}
        dataLength={dataList?.length || 0}
        isPagination={false}
      >
        {dataList?.map((customer, index) => (
          <tr
            className={`bg-white text-blackSemi relative ${
              index !== dataList.length - 1
                ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-natural"
                : ""
            }`}
            key={customer?._id}
          >
            <td className="print:text-xs">{customer?.customer_id}</td>
            <td className="print:text-xs">
              <div className="flex gap-2 items-center">
                <ReactCountryFlag
                  countryCode={customer?.country?.code || "US"}
                  svg
                  style={{
                    display: "block",
                    width: "1.1em",
                    height: "1.1em",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  title={customer?.country?.name}
                  className="shadow-md"
                />
                {customer?.country?.name}
              </div>
            </td>
            <td className="print:text-xs">
              <div className="flex items-center gap-2">
                {/* <img
                  src={customer?.image}
                  alt={customer?.name}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "http://46.250.238.64:9000/public/default/default.jpg";
                  }}
                /> */}
                {customer?.name}
              </div>
            </td>
            <td className="print:text-xs">{customer?.email}</td>

            <td className="print:text-xs">
              {customer?.created_at
                ? dayjs.unix(customer.created_at).format("DD-MM-YYYY (HH:mm A)")
                : "-"}
            </td>
            <td className="print:text-xs">
              {customer?.is_registered_via_web
                ? customer?.device?.web_ip_address || "N/A"
                : customer?.device?.app_ip_address || "N/A"}
            </td>
            <td className="py-4 flex items-center justify-center">
              {customer?.total_purchased_data_packages || 0}
            </td>

            <td className="py-4 capitalize">
              {customer?.device?.app_brand_name || "N/A"}
            </td>
            <td className="py-4 capitalize">
              {customer?.device?.app_os_platform || "N/A"}
            </td>

            <td className="py-4 flex items-center gap-4">
              {customer?.is_blocked ? (
                <span className="text-[#9E9E9E]">Blocked</span>
              ) : (
                <span className="text-[#00AE5B]">Active</span>
              )}
            </td>
          </tr>
        ))}
      </CustomTable>
    </div>
  );
};

export default TopCustomers;
