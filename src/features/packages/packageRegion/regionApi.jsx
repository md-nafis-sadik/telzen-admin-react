import { setRegionData, setRegionMetaData, setSelectedRegionData, setEditFormData } from ".";
import { apiSlice } from "../api/../../api/apiSlice";

export const regionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL ADMINS
    getAllRegions: builder.query({
      query: (params = { page: 1, limit: 10, search: "", status: "" }) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `region?${queryString}`,
          method: "GET",
        };
      },
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const { data: apiData } = await queryFulfilled;
          console.log(apiData);
          dispatch(setRegionData(apiData));
          dispatch(setRegionMetaData(apiData?.meta));
        } catch (err) {
          console.error(err);
        }
      },
    }),

    // GET ALL ADMINS
    getAllActiveRegions: builder.query({
      query: (
        params = { page: 1, limit: "", search: "", status: "active" }
      ) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `region?${queryString}`,
          method: "GET",
        };
      },
    }),

    getSingleRegion: builder.query({
      query: (params = { region_id: "" }) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `region/single?${queryString}`,
          method: "GET",
        };
      },
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const { data: apiData } = await queryFulfilled;
          const regionData = apiData.data;

          dispatch(setSelectedRegionData(regionData));

          const formData = {
            id: regionData._id || regionData.id || "",
            name: regionData.name || "",
            status: regionData.status || "active",
            image: regionData.image || "",
          };

          dispatch(setEditFormData(formData));
        } catch (err) {
          console.error(err);
        }
      },
    }),

    // ADD A NEW ADMIN
    addRegion: builder.mutation({
      query: (formData) => {
        return {
          url: "/region/create",
          method: "POST",
          body: formData,
        };
      },
    }),

    // UPDATE A ADMIN
    updateRegion: builder.mutation({
      query: ({ id, formData }) => {
        return {
          url: `region/update?region_id=${id}`,
          method: "PATCH",
          body: formData,
        };
      },
    }),

    // DELETE A NEW ADMIN
    deleteRegion: builder.mutation({
      query: ({ id }) => {
        return {
          url: `region/delete?region_id=${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetAllRegionsQuery,
  useAddRegionMutation,
  useDeleteRegionMutation,
  useUpdateRegionMutation,
  useGetAllActiveRegionsQuery,
  useGetSingleRegionQuery,
  useLazyGetSingleRegionQuery,
} = regionApi;
