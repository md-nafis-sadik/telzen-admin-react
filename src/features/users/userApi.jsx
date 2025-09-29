import { setUserData, setUserMetaData } from ".";
import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL USERS
    getAllUsers: builder.query({
      query: (params = { page: 1, limit: 10, search: "", status: "" }) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `customer?${queryString}`,
          method: "GET",
        };
      },
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const { data: apiData } = await queryFulfilled;
          dispatch(setUserData(apiData));
          dispatch(setUserMetaData(apiData?.meta));
        } catch (err) {
          console.error(err);
        }
      },
    }),

    // GET ALL USERS
    getAllActiveUsers: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `customer?${queryString}`,
          method: "GET",
        };
      },
    }),
    // ADD A NEW USER
    addUser: builder.mutation({
      query: ({ data }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        return {
          url: "/user/create",
          method: "POST",
          body: formData,
        };
      },
    }),

    // UPDATE A USER
    updateUser: builder.mutation({
      query: ({ data, id }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        return {
          url: `user/update?user_id=${id}`,
          method: "PATCH",
          body: formData,
        };
      },
    }),

    // DELETE A NEW USER
    deleteUser: builder.mutation({
      query: ({ id }) => {
        return {
          url: `user/delete?user_id=${id}`,
          method: "DELETE",
        };
      },
    }),
    // Add to your userApi endpoints
    downloadInvoice: builder.mutation({
      query: ({ userId }) => ({
        url: `invoice/generate?user_id=${userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetAllActiveUsersQuery,
  useDownloadInvoiceMutation,
} = userApi;
