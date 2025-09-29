import { setUserDetailsData, setUserDetailsMetaData } from ".";
import { apiSlice } from "../api/apiSlice";

export const userDetailsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL USERS
    getAllUserDetails: builder.query({
      query: (params = { page: 1, limit: 10, search: "", status: "" }) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `customer/purchased-data-packages?${queryString}`,
          method: "GET",
        };
      },
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const { data: apiData } = await queryFulfilled;
          dispatch(setUserDetailsData(apiData));
          dispatch(setUserDetailsMetaData(apiData?.meta));
        } catch (err) {
          console.error(err);
        }
      },
    }),

    // GET ALL USERS
    getAllActiveUserDetails: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `customer?${queryString}`,
          method: "GET",
        };
      },
    }),
    // ADD A NEW USER
    addUserDetails: builder.mutation({
      query: ({ data }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        return {
          url: "/userDetails/create",
          method: "POST",
          body: formData,
        };
      },
    }),

    // UPDATE A USER
    updateUserDetails: builder.mutation({
      query: ({ data, id }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        return {
          url: `userDetails/update?userDetails_id=${id}`,
          method: "PATCH",
          body: formData,
        };
      },
    }),

    // DELETE A NEW USER
    deleteUserDetails: builder.mutation({
      query: ({ id }) => {
        return {
          url: `userDetails/delete?userDetails_id=${id}`,
          method: "DELETE",
        };
      },
    }),
    // Add to your userDetailsApi endpoints
    downloadInvoice: builder.mutation({
      query: ({ userDetailsId }) => ({
        url: `invoice/generate?userDetails_id=${userDetailsId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllUserDetailsQuery,
  useAddUserDetailsMutation,
  useDeleteUserDetailsMutation,
  useUpdateUserDetailsMutation,
  useGetAllActiveUserDetailsQuery,
  useDownloadInvoiceMutation,
} = userDetailsApi;
