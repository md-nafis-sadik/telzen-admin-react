import { useDispatch, useSelector } from "react-redux";
import { setRevenueMetaData } from "../../features/revenues/revenueSlice";
import {
  useGetAllRevenuesQuery,
  useGetRevenueCardDataQuery,
} from "../../features/revenues/revenueApi";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { getSymbol } from "../../utils/currency";
import { useEffect, useRef } from "react";
import { formatStatusStr } from "../../utils/helper";

export const useGetRevenues = () => {
  const dispatch = useDispatch();
  const { dataList, meta, selectedData } = useSelector(
    (state) => state.revenue
  );
  const { current_page, page_size } = meta || {};
  const isInitialRender = useRef(true);
  // Fetch revenue list data
  const {
    isLoading: isRevenueLoading,
    isFetching: isRevenueFetching,
    isError: isRevenueError,
    error: revenueError,
  } = useGetAllRevenuesQuery(
    {
      page: current_page,
      limit: page_size,
    },
    {
      skip: isInitialRender.current && dataList.length > 0,
    }
  );
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    // dispatch(setRevenueMetaData({ ...meta, current_page: 1 }));
  }, []);

  // Fetch card data
  const {
    data: apiResponse,
    isCardLoading,
    isCardError,
  } = useGetRevenueCardDataQuery();

  // Extract the actual data from the API response
  const cardData = apiResponse?.data || {};

  const revenueSummary = [
    {
      title: "Package Sold",
      number: cardData?.total_packages_sold || 0,
      bgColor: "bg-[#CDFFE9]",
    },
    {
      title: "Total Sales (USD)",
      number: cardData?.total_sales?.USD || 0,
      currency: getSymbol(),
      bgColor: "bg-[#FFE5CC]",
    },
    {
      title: "Total Revenue (USD)",
      number: cardData?.total_revenue?.USD || 0,
      currency: getSymbol(),
      bgColor: "bg-[#C9ECFF]",
    },
    {
      title: "Total Vendor Fee (USD)",
      number: cardData?.total_vendor_fee?.USD || 0,
      currency: getSymbol(),
      bgColor: "bg-[#FFE0DF]",
    },
  ];

  const updatePageMeta = (value) => dispatch(setRevenueMetaData(value));

  const handleExport = () => {
    if (!dataList || dataList.length === 0) {
      alert("No data to export!");
      return;
    }

    const exportData = dataList.map((item) => ({
      "Order ID": item.order_id,
      Date: dayjs.unix(item.selling_date).format("YYYY-MM-DD"),
      Package: item?.package?.name || "",
      "Customer Name": item.customer.name,
      "Customer Email": item.customer.email,
      Amount: `${getSymbol()}${item.payment_amount.USD}`, 
      "Payment Status": formatStatusStr(item.payment_status),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Revenues");
    XLSX.writeFile(workbook, "revenues_export.xlsx");
  };

  const handlePrint = () => {
    window.print();
  };

  return {
    dataList,
    meta,
    isLoading: isRevenueLoading || isRevenueFetching || isCardLoading,
    isError: isRevenueError || isCardError,
    status: revenueError?.status,
    updatePageMeta,
    selectedData,
    revenueSummary,
    handleExport,
    handlePrint,
  };
};
