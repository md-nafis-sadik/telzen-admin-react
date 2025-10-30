import {
  setCouponData,
  setCouponMetaData,
  setSelectedCouponData,
  setEditFormData,
} from ".";
import { apiSlice } from "../api/apiSlice";

export const couponApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL ADMINS
    getAllCoupons: builder.query({
      query: (params = { page: 1, limit: 10, search: "", status: "" }) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `coupon?${queryString}`,
          method: "GET",
        };
      },
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const { data: apiData } = await queryFulfilled;
          dispatch(setCouponData(apiData));
          dispatch(setCouponMetaData(apiData?.meta));
        } catch (err) {
          console.error(err);
        }
      },
    }),

    // GET ALL ADMINS
    getAllActiveCoupons: builder.query({
      query: (
        params = { page: 1, limit: "", search: "", status: "active" }
      ) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `coupon?${queryString}`,
          method: "GET",
        };
      },
    }),

    getSingleCoupon: builder.query({
      query: (params = { coupon_id: "" }) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `coupon/single?${queryString}`,
          method: "GET",
        };
      },
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const { data: apiData } = await queryFulfilled;
          const couponData = apiData.data;

          dispatch(setSelectedCouponData(couponData));

          const formData = {
            id: couponData._id || couponData.id,
            title: couponData.title,
            code: couponData.code,
            discount: { amount: couponData.discount?.amount },
            is_private: couponData.is_private || false,
            validity_end_at: couponData.validity_end_at || null,
            coverage_countries:
              couponData.coverage_countries?.map((c) =>
                typeof c === "object" ? c._id : c
              ) || [],
            max_usages_limit: couponData.max_usages_limit,
            minimum_order_amount: couponData.minimum_order_amount,
            maximum_order_amount: couponData.maximum_order_amount,
          };

          dispatch(setEditFormData(formData));
        } catch (err) {
          console.error(err);
        }
      },
    }),

    // ADD A NEW ADMIN
    addCoupon: builder.mutation({
      query: ({ data }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        return {
          url: "/coupon/create",
          method: "POST",
          body: formData,
        };
      },
    }),

    // UPDATE A ADMIN
    updateCoupon: builder.mutation({
      query: ({ data, id }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        return {
          url: `coupon/update?coupon_id=${id}`,
          method: "PATCH",
          body: formData,
        };
      },
    }),

    // DELETE A NEW ADMIN
    deleteCoupon: builder.mutation({
      query: ({ id }) => {
        return {
          url: `coupon/delete?coupon_id=${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetAllCouponsQuery,
  useAddCouponMutation,
  useDeleteCouponMutation,
  useUpdateCouponMutation,
  useGetAllActiveCouponsQuery,
  useGetSingleCouponQuery,
  useLazyGetSingleCouponQuery,
} = couponApi;
