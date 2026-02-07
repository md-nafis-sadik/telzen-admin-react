import { useState, useRef } from "react";
import { useGetSalesDataQuery, useGetUserGrowthDataQuery } from "../../features/stats";
import { DEFAULT_FILTER } from "../../utils/chartFilters";

export const useCharts = () => {
    const [salesFilter, setSalesFilter] = useState(DEFAULT_FILTER);
    const [userGrowthFilter, setUserGrowthFilter] = useState(DEFAULT_FILTER);

    const prevSalesFilter = useRef(salesFilter);
    const prevUserGrowthFilter = useRef(userGrowthFilter);

    const {
        data: salesData,
        isLoading: isSalesLoading,
        isFetching: isSalesFetching
    } = useGetSalesDataQuery({ filter: salesFilter });

    const {
        data: userGrowthData,
        isLoading: isUserGrowthLoading,
        isFetching: isUserGrowthFetching
    } = useGetUserGrowthDataQuery({ filter: userGrowthFilter });

    const showSalesSkeleton = isSalesLoading;

    const showUserSkeleton = isUserGrowthLoading;

    const handleSalesFilterChange = (filter) => {
        prevSalesFilter.current = salesFilter;
        setSalesFilter(filter);
    };

    const handleUserGrowthFilterChange = (filter) => {
        prevUserGrowthFilter.current = userGrowthFilter;
        setUserGrowthFilter(filter);
    };

    const salesChartData = salesData?.data?.chart_data?.map(item => ({
        name: item.name,
        sales: item.value,
        year: item.year,
        currency: item.currency
    })) || [];

    const userChartData = userGrowthData?.data?.chart_data?.map(item => ({
        name: item.name,
        users: item.value || item.count,
        year: item.year
    })) || [];

    return {
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
    };
};
