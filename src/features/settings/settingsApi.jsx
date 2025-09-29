import { apiSlice } from "../api/apiSlice";
import { updateSettings } from "./settingsSlice";

const settingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => ({
        url: "/api-key/get/",
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log("result", result);
          dispatch(updateSettings(result?.data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    addOrUpdateSettings: builder.mutation({
      query: (data) => ({
        url: "/api-key/add/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(updateSettings(result?.data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    deleteSettings: builder.mutation({
      query: () => ({
        url: `/api-key/delete/`,
        method: "DELETE",
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data) {
            dispatch(
              settingsApi.util.updateQueryData(
                "getAllSettings",
                undefined,
                (draft) => {
                  const filteredArray = draft.filter(
                    (item) => item?._id !== id
                  );
                  return filteredArray;
                }
              )
            );
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useAddOrUpdateSettingsMutation,
  useDeleteSettingsMutation,
} = settingsApi;
