import { setDashboardStats, setSalesData, setUserGrowthData } from ".";
import { apiSlice } from "../api/apiSlice";

export const statsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET DASHBOARD STATS
    getDashboardStats: builder.query({
      query: (timeRange = "this-year") => ({
        url: `dashboard/stats?search=${timeRange}`,
        method: "GET",
      }),
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setDashboardStats(data.data));
        } catch (err) {
          console.error(err);
        }
      },
    }),

    // GET SALES DATA
getSalesData: builder.query({
  query: ({ year = new Date().getFullYear(), currency_code = 'EUR' }) => ({
    url: `dashboard/sales?year=${year}&currency_code=${currency_code}`,
    method: "GET",
  }),
  async onQueryStarted(_args, { queryFulfilled, dispatch }) {
    try {
      const { data } = await queryFulfilled;
      dispatch(setSalesData(data.data));
    } catch (err) {
      console.error(err);
    }
  },
}),


    // GET USER GROWTH DATA
    getUserGrowthData: builder.query({
      query: (year = new Date().getFullYear()) => ({
        url: `dashboard/user-growth?year=${year}`,
        method: "GET",
      }),
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUserGrowthData(data.data));
        } catch (err) {
          console.error(err);
        }
      },
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetSalesDataQuery,
  useGetUserGrowthDataQuery,
} = statsApi;