import UserGrowthChart from "./ChartTypes/UserGrowthChart";
import SalesLineChart from "./ChartTypes/SalesLineChart";
import { useCharts } from "../../hooks/features/useCharts";

const Charts = () => {
  const {
    salesYear,
    userGrowthYear,
    showSalesSkeleton,
    showUserSkeleton,
    handleSalesYearChange,
    handleUserGrowthYearChange,
    handleCurrencyChange,
    salesChartData,
    userChartData,
    currencyCode
  } = useCharts();

  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 items-stretch justify-around gap-6">
      <div className="bg-white rounded-xl">
        {showUserSkeleton ? (
          <div className="h-[390px] bg-neutral-100 rounded-xl animate-pulse"></div>
        ) : (
          <UserGrowthChart
            data={userChartData}
            year={userGrowthYear}
            setYear={handleUserGrowthYearChange}
            isLoading={showUserSkeleton}
          />
        )}
      </div>
      <div className="bg-white rounded-xl">
        {showSalesSkeleton ? (
          <div className="h-[390px] bg-neutral-100 rounded-xl animate-pulse"></div>
        ) : (
          <SalesLineChart
            data={salesChartData}
            year={salesYear}
            currencyCode={currencyCode}
            setYear={handleSalesYearChange}
            setCurrency={handleCurrencyChange}
            isLoading={showSalesSkeleton}
          />
        )}
      </div>
    </section>
  );
};

export default Charts;