import { useGetTopCustomersQuery } from "../../features/topCustomers/topCustomersApi";

export const useTopCustomers = () => {
  const { data: apiResponse, isLoading, isError } = useGetTopCustomersQuery();

  const dataList = apiResponse?.data || [];

  return {
    dataList,
    isLoading,
    isError,
  };
};
