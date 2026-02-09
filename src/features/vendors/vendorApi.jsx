import { apiSlice } from "../api/apiSlice";
import {
  setActiveVendorData,
  setPendingVendorData,
} from "./vendorSlice";

const vendorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get Active Vendors
    getActiveVendors: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/business?page=${page}&limit=${limit}&type=vendor`,
        method: "GET",
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data) {
            dispatch(
              setActiveVendorData({
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

    // Get Pending Vendors
    getPendingVendors: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/business?page=${page}&limit=${limit}&status=pending&type=vendor`,
        method: "GET",
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data) {
            dispatch(
              setPendingVendorData({
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

    // Get Single Vendor Details
    getSingleVendor: builder.query({
      query: (vendorId) => ({
        url: `/business/single?business_id=${vendorId}`,
        method: "GET",
      }),
    }),

    // Block/Unblock Vendor
    blockVendor: builder.mutation({
      query: ({ vendorId, isBlocked }) => ({
        url: `/business/block?business_id=${vendorId}`,
        method: "PATCH",
        body: { is_blocked: isBlocked },
      }),
    }),

    // Approve Vendor
    approveVendor: builder.mutation({
      query: (vendorId) => ({
        url: `/business/approve?business_id=${vendorId}`,
        method: "PATCH",
      }),
    }),

    // Reject Vendor
    rejectVendor: builder.mutation({
      query: (vendorId) => ({
        url: `/business/reject?business_id=${vendorId}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useGetActiveVendorsQuery,
  useGetPendingVendorsQuery,
  useGetSingleVendorQuery,
  useBlockVendorMutation,
  useApproveVendorMutation,
  useRejectVendorMutation,
} = vendorApi;

export default vendorApi;
