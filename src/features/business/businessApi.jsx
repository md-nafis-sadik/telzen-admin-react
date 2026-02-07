import { apiSlice } from "../api/apiSlice";
import {
  setActiveBusinessData,
  setPendingBusinessData,
} from "./businessSlice";

const businessApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get Active Businesses
    getActiveBusinesses: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/business?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data) {
            dispatch(
              setActiveBusinessData({
                data: result.data.data,
                meta: result.data.meta,
              })
            );
          }
        } catch (error) {
          console.error(error);
        }
      },
    }),

    // Get Pending Businesses
    getPendingBusinesses: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/business?page=${page}&limit=${limit}&status=pending`,
        method: "GET",
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data) {
            dispatch(
              setPendingBusinessData({
                data: result.data.data,
                meta: result.data.meta,
              })
            );
          }
        } catch (error) {
          console.error(error);
        }
      },
    }),

    // Get Single Business Details
    getSingleBusiness: builder.query({
      query: (businessId) => ({
        url: `/business/single?business_id=${businessId}`,
        method: "GET",
      }),
    }),

    // Block/Unblock Business
    blockBusiness: builder.mutation({
      query: ({ businessId, isBlocked }) => ({
        url: `/business/block?business_id=${businessId}`,
        method: "PATCH",
        body: { is_blocked: isBlocked },
      }),
    }),

    // Approve Business
    approveBusiness: builder.mutation({
      query: (businessId) => ({
        url: `/business/approve?business_id=${businessId}`,
        method: "PATCH",
      }),
    }),

    // Reject Business
    rejectBusiness: builder.mutation({
      query: (businessId) => ({
        url: `/business/reject?business_id=${businessId}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useGetActiveBusinessesQuery,
  useGetPendingBusinessesQuery,
  useGetSingleBusinessQuery,
  useBlockBusinessMutation,
  useApproveBusinessMutation,
  useRejectBusinessMutation,
} = businessApi;

export default businessApi;
