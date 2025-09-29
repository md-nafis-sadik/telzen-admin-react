import { setNotificationData, setNotificationMetaData } from ".";
import { apiSlice } from "../api/apiSlice";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL NOTIFICATIONS
    getAllNotifications: builder.query({
      query: (params = { page: 1, limit: 10, search: "", status: "" }) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `notification?${queryString}`,
          method: "GET",
        };
      },
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const { data: apiData } = await queryFulfilled;
          dispatch(setNotificationData(apiData));
          dispatch(setNotificationMetaData(apiData?.meta));
        } catch (err) {
          console.error(err);
        }
      },
    }),

    // GET ALL NOTIFICATIONS
    getAllActiveNotifications: builder.query({
      query: (
        params = { page: 1, limit: "", search: "", status: "active" }
      ) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `notification?${queryString}`,
          method: "GET",
        };
      },
    }),
    // ADD A NEW NOTIFICATION
    addNotification: builder.mutation({
      query: (formData) => {
        return {
          url: "/notification/create",
          method: "POST",
          body: formData,
        };
      },
    }),

    // UPDATE A NOTIFICATION
    updateNotification: builder.mutation({
      query: ({ data, id }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        return {
          url: `notification/update?notification_id=${id}`,
          method: "PATCH",
          body: formData,
        };
      },
    }),

    // DELETE A NEW NOTIFICATION
    deleteNotification: builder.mutation({
      query: ({ id }) => {
        return {
          url: `notification/delete?notification_id=${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useAddNotificationMutation,
  useDeleteNotificationMutation,
  useUpdateNotificationMutation,
  useGetAllActiveNotificationsQuery,
} = notificationApi;
