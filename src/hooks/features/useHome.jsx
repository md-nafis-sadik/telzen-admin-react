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
import { DEFAULT_FILTER } from "../../utils/chartFilters";

export const useHome = () => {
  const { auth } = useSelector((state) => state.auth);
  const isHome = true;
  const [statsFilter, setStatsFilter] = useState(DEFAULT_FILTER);
  const prevStatsFilter = useRef(statsFilter);
  const {
    data: dashboardStats,
    isLoading: isStatsLoading,
    isFetching,
  } = useGetDashboardStatsQuery(statsFilter);
  const currency = getSymbol();

  const handleFilterChange = (value) => {
    prevStatsFilter.current = statsFilter;
    setStatsFilter(value);
  };

  // Only show skeleton when initially loading
  const showSkeleton = isStatsLoading;

  const data = [
    {
      id: 1,
      title: "Total Sales",
      currency: getSymbol(),
      number: dashboardStats?.data?.total_sales?.USD || 0,
      link: "/revenue",
      background: "bg-main-100",
      svgBg: "bg-main-500",
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
    statsFilter,
    handleFilterChange,
    showSkeleton,
    data,
    auth,
  };
};
