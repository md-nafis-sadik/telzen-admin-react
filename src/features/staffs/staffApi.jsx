import { setStaffData, setStaffMetaData } from ".";
import { apiSlice } from "../api/apiSlice";

export const staffApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // GET ALL ADMINS
        getAllStaffs: builder.query({
            query: (params = { page: 1, limit: 10 }) => {
                const queryString = new URLSearchParams(params).toString();
                return {
                    url: `admin?${queryString}`,
                    method: "GET"
                };
            },
            async onQueryStarted(_args, { queryFulfilled, dispatch }) {
                try {
                    const { data: apiData } = await queryFulfilled;
                    dispatch(setStaffData(apiData));
                    dispatch(setStaffMetaData(apiData?.meta));
                } catch (err) {
                    console.error(err);
                }
            },
        }),

        // GET ALL ADMINS
        getAllActiveStaffs: builder.query({
            query: (params = { page: 1, limit: "" }) => {
                const queryString = new URLSearchParams(params).toString();
                return {
                    url: `admin?${queryString}`,
                    method: "GET"
                };
            },
        }),
        // ADD A NEW ADMIN
        addStaff: builder.mutation({
            query: ({ data }) => {

                const formData = new FormData();
                formData.append("data", JSON.stringify(data));

                return {
                    url: "admin/create", method: "POST", body: formData
                };
            },
        }),

        // UPDATE A ADMIN
        updateStaff: builder.mutation({
            query: ({ data, id }) => {

                const formData = new FormData();
                formData.append("data", JSON.stringify(data));

                return {
                    url: `admin/update?user_id=${id}`, method: "PATCH", body: formData
                };
            },
        }),

        // DELETE A NEW ADMIN
        deleteStaff: builder.mutation({
            query: ({ id }) => {
                return {
                    url: `admin/delete?user_id=${id}`, method: "DELETE",
                };
            },
        }),

    }),
});

export const {
    useGetAllStaffsQuery,
    useAddStaffMutation,
    useDeleteStaffMutation,
    useUpdateStaffMutation,
    useGetAllActiveStaffsQuery,
} = staffApi;