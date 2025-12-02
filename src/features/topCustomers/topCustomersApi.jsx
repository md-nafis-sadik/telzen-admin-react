import { apiSlice } from "../api/apiSlice";

export const topCustomersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTopCustomers: builder.query({
      query: () => ({
        url: "dashboard/top-customers",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetTopCustomersQuery } = topCustomersApi;
