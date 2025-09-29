import { useState, useRef } from "react";
import { getSymbol } from "../../utils/currency";
import {
  PackagesIcon,
  RevenueIcon,
  SalesIcon,
  UsersIcon,
} from "../../utils/svgs";
import { useGetDashboardStatsQuery } from "../../features/stats";
import { useSelector } from "react-redux";

export const useHome = () => {
  const { auth } = useSelector((state) => state.auth);
  const isHome = true;
  const [overviewTimeRange, setOverviewTimeRange] = useState("this-year");
  const prevOverviewTimeRange = useRef(overviewTimeRange);
  const {
    data: dashboardStats,
    isLoading: isStatsLoading,
    isFetching,
  } = useGetDashboardStatsQuery(overviewTimeRange);
  const currency = getSymbol();

  const handleRangeChange = (value) => {
    prevOverviewTimeRange.current = overviewTimeRange;
    setOverviewTimeRange(value);
  };

  // Only show skeleton when initially loading or when fetching new data for a different time range
  const showSkeleton =
    isStatsLoading ||
    (isFetching && overviewTimeRange !== prevOverviewTimeRange.current);

  const data = [
    {
      id: 1,
      title: "Total Sales",
      currency: getSymbol(),
      number: dashboardStats?.data?.total_sales?.USD || 0,
      link: "/revenue",
      background: "bg-pinkLight",
      svgBg: "bg-pinkColor",
      svg: <SalesIcon />,
    },
    {
      id: 2,
      title: "Total Revenue",
      currency: getSymbol(),
      number: dashboardStats?.data?.total_revenue?.USD || 0,
      link: "/revenue",
      background: "bg-violetLight",
      svgBg: "bg-violetColor",
      svg: <RevenueIcon />,
    },
    {
      id: 3,
      title: "Total Users",
      currency: null,
      number: dashboardStats?.data?.total_customers || 0,
      link: "/users",
      background: "bg-blueLight",
      svgBg: "bg-blueColor",
      svg: <UsersIcon />,
    },
    {
      id: 4,
      title: "Packages",
      currency: null,
      number: dashboardStats?.data?.total_packages || 0,
      link: "/packages",
      background: "bg-yellowLight",
      svgBg: "bg-yellowColor",
      svg: <PackagesIcon />,
    },
  ];

  return {
    isHome,
    overviewTimeRange,
    handleRangeChange,
    showSkeleton,
    data,
    auth,
  };
};
