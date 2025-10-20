import { setStaffData, setStaffMetaData, setEditFormData } from ".";
import { apiSlice } from "../api/apiSlice";

export const staffApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL ADMINS
    getAllStaffs: builder.query({
      query: (params = { page: 1, limit: 10 }) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `admin?${queryString}`,
          method: "GET",
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
          method: "GET",
        };
      },
    }),
    // ADD A NEW ADMIN
    addStaff: builder.mutation({
      query: ({ data }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        return {
          url: "admin/create",
          method: "POST",
          body: formData,
        };
      },
    }),

    // UPDATE A ADMIN
    updateStaff: builder.mutation({
      query: ({ data, id }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        return {
          url: `admin/update?admin_id=${id}`,
          method: "PATCH",
          body: formData,
        };
      },
    }),

    // DELETE A NEW ADMIN
    deleteStaff: builder.mutation({
      query: ({ id }) => {
        return {
          url: `admin/delete?admin_id=${id}`,
          method: "DELETE",
        };
      },
    }),

    // GET SINGLE STAFF
    getSingleStaff: builder.query({
      query: ({ staff_id }) => ({
        url: `admin/single?admin_id=${staff_id}`,
        method: "GET",
      }),
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const { data: apiData } = await queryFulfilled;
          if (apiData?.success && apiData?.data) {
            // Transform the data to match editFormData structure
            const transformedData = {
              id: apiData.data._id,
              name: apiData.data.name || "",
              email: apiData.data.email || "",
              role: apiData.data.role || "admin",
              phone: apiData.data.phone || "",
              is_active: apiData.data.is_active || true,
            };
            dispatch(setEditFormData(transformedData));
          }
        } catch (err) {
          console.error("Error fetching single staff:", err);
        }
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
  useLazyGetSingleStaffQuery,
} = staffApi;
