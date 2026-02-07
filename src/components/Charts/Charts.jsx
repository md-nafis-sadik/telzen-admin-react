import UserGrowthChart from "./ChartTypes/UserGrowthChart";
import SalesLineChart from "./ChartTypes/SalesLineChart";
import { useCharts } from "../../hooks/features/useCharts";

const Charts = () => {
  const {
    salesFilter,
    userGrowthFilter,
    showSalesSkeleton,
    showUserSkeleton,
    handleSalesFilterChange,
    handleUserGrowthFilterChange,
    salesChartData,
    userChartData,
    salesData,
    userGrowthData
  } = useCharts();

  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 items-stretch justify-around gap-6">
      <div className="bg-white rounded-xl">
        <UserGrowthChart
          data={userChartData}
          filter={userGrowthFilter}
          setFilter={handleUserGrowthFilterChange}
          isLoading={showUserSkeleton}
        />
      </div>
      <div className="bg-white rounded-xl">
        <SalesLineChart
          data={salesChartData}
          filter={salesFilter}
          currency={salesData?.data?.chart_data?.[0]?.currency || 'USD'}
          setFilter={handleSalesFilterChange}
          isLoading={showSalesSkeleton}
        />
      </div>
    </section>
  );
};

export default Charts;