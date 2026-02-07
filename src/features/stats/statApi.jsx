import { setDashboardStats, setSalesData, setUserGrowthData } from ".";
import { apiSlice } from "../api/apiSlice";

export const statsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET DASHBOARD STATS
    getDashboardStats: builder.query({
      query: (filter = "6_months") => ({
        url: `dashboard/stats?filter=${filter}`,
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
  query: ({ filter = '6_months' }) => ({
    url: `dashboard/sales?filter=${filter}`,
    method: "GET",
  }),
  async onQueryStarted(_args, { queryFulfilled, dispatch }) {
    try {
      const { data } = await queryFulfilled;
      dispatch(setSalesData(data));
    } catch (err) {
      console.error(err);
    }
  },
}),


    // GET USER GROWTH DATA
    getUserGrowthData: builder.query({
      query: ({ filter = '6_months' }) => ({
        url: `dashboard/user-growth?filter=${filter}`,
        method: "GET",
      }),
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUserGrowthData(data));
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