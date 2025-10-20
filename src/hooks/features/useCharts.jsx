import { useState, useRef } from "react";
import { useGetSalesDataQuery, useGetUserGrowthDataQuery } from "../../features/stats";

export const useCharts = () => {
    const currentYear = new Date().getFullYear();
    const [salesYear, setSalesYear] = useState(currentYear);
    const [currencyCode, setCurrencyCode] = useState("USD");
    const [userGrowthYear, setUserGrowthYear] = useState(currentYear);

    const prevSalesYear = useRef(salesYear);
    const prevCurrencyCode = useRef(currencyCode);
    const prevUserGrowthYear = useRef(userGrowthYear);

    const {
        data: salesData,
        isLoading: isSalesLoading,
        isFetching: isSalesFetching
    } = useGetSalesDataQuery({ year: salesYear, currency_code: currencyCode });

    const {
        data: userGrowthData,
        isLoading: isUserGrowthLoading,
        isFetching: isUserGrowthFetching
    } = useGetUserGrowthDataQuery(userGrowthYear);

    const showSalesSkeleton = isSalesLoading ||
        (isSalesFetching && salesYear !== prevSalesYear.current);

    const showUserSkeleton = isUserGrowthLoading ||
        (isUserGrowthFetching && userGrowthYear !== prevUserGrowthYear.current);

    const handleSalesYearChange = (year) => {
        prevSalesYear.current = salesYear;
        setSalesYear(year);
    };

    const handleCurrencyChange = (year) => {
        prevCurrencyCode.current = currencyCode;
        setCurrencyCode(year);
    };

    const handleUserGrowthYearChange = (year) => {
        prevUserGrowthYear.current = userGrowthYear;
        setUserGrowthYear(year);
    };

    const salesChartData = salesData?.data?.chart_data?.map(item => ({
        name: item.name,
        sales: item.amount
    })) || [];

    const userChartData = userGrowthData?.data?.chart_data?.map(item => ({
        name: item.name,
        users: item.count
    })) || [];
    return {
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
    };
};
