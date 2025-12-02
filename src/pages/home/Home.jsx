import { Select } from "antd";
import Charts from "../../components/Charts/Charts";
import Card from "../../components/shared/cards/Card";
import NotifyContainer from "../../utils/getNotify";
import TopCustomers from "../topCustomers/TopCustomers";
import { useHome } from "../../hooks/features/useHome";

const { Option } = Select;

export default function Home() {
  const {
    isHome,
    overviewTimeRange,
    handleRangeChange,
    showSkeleton,
    data,
    auth,
  } = useHome();

  return (
    <section className="h-full relative overflow-auto p-6">
      <div className="flex flex-col gap-8">
        {/* cards  */}
        {auth.role === "admin" && (
          <div className="w-full bg-white p-4 rounded-2xl">
            {/* title  */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg text-blackHigh font-bold">Overview</h4>
                <div>
                  <span className="text-black-600">Showing :</span>
                  <Select
                    popupMatchSelectWidth={false}
                    className={`
                    text-sm rounded-md inline-block w-auto ml-1
                    [&_.ant-select-selector]:!h-7
                    [&_.ant-select-selector]:!w-28
                    [&_.ant-select-selector]:!px-2
                    [&_.ant-select-selector]:!flex
                    [&_.ant-select-selector]:!items-center
                  `}
                    value={overviewTimeRange}
                    onChange={handleRangeChange}
                    disabled={showSkeleton}
                  >
                    <Option value="this-year">This Year</Option>
                    <Option value="this-month">This Month</Option>
                    <Option value="this-week">This Week</Option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 items-stretch gap-4 mt-6">
                {showSkeleton
                  ? // Skeleton state
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-neutral-100 p-6 rounded-xl animate-pulse"
                    >
                      <div className="h-5 w-3/4 bg-neutral-300 rounded mb-4"></div>
                      <div className="h-8 w-1/2 bg-neutral-400 rounded mb-6"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-1/3 bg-neutral-200 rounded"></div>
                      </div>
                    </div>
                  ))
                  : // Actual cards
                  data?.map((item, i) => <Card data={item} key={i} />)}
              </div>
            </div>
          </div>
        )}
        {auth.role === "admin" && (
          <div className="">
            <Charts />
          </div>
        )}

        <TopCustomers />
        <NotifyContainer></NotifyContainer>
      </div>
    </section>
  );
}
