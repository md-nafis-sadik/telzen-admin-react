import { setRevenueData, setRevenueMetaData } from ".";
import { apiSlice } from "../api/apiSlice";
import { setRevenueCardData } from "./revenueSlice";

export const revenueApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL ADMINS
    getAllRevenues: builder.query({
      query: (params = { page: 1, limit: 10, search: "", status: "" }) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `revenue?${queryString}`,
          method: "GET",
        };
      },
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const { data: apiData } = await queryFulfilled;
          dispatch(setRevenueData(apiData));
          dispatch(setRevenueMetaData(apiData?.meta));
        } catch (err) {
          console.error(err);
        }
      },
    }),

    // GET ALL ADMINS
    getAllActiveRevenues: builder.query({
      query: (
        params = { page: 1, limit: "", search: "", status: "active" }
      ) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `revenue?${queryString}`,
          method: "GET",
        };
      },
    }),
    // ADD A NEW ADMIN
    addRevenue: builder.mutation({
      query: ({ data }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        return {
          url: "/revenue/create",
          method: "POST",
          body: formData,
        };
      },
    }),
    getRevenueCardData: builder.query({
      query: () => "revenue/stats",
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setRevenueCardData(data.data));
        } catch (error) {
          console.error(error);
        }
      },
    }),

    // UPDATE A ADMIN
    updateRevenue: builder.mutation({
      query: ({ data, id }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        return {
          url: `revenue/update?revenue_id=${id}`,
          method: "PATCH",
          body: formData,
        };
      },
    }),

    // DELETE A NEW ADMIN
    deleteRevenue: builder.mutation({
      query: ({ id }) => {
        return {
          url: `revenue/delete?revenue_id=${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetAllRevenuesQuery,
  useGetRevenueCardDataQuery,
  useAddRevenueMutation,
  useDeleteRevenueMutation,
  useUpdateRevenueMutation,
  useGetAllActiveRevenuesQuery,
} = revenueApi;
