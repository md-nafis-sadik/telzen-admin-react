import { setCountryData, setCountryMetaData } from ".";
import { apiSlice } from "../../api/apiSlice";

export const countryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL ADMINS
    getAllCountrys: builder.query({
      query: (params = { page: 1, limit: 10, search: "", status: "" }) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `country?${queryString}`,
          method: "GET",
        };
      },
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const { data: apiData } = await queryFulfilled;
          dispatch(setCountryData(apiData));
          dispatch(setCountryMetaData(apiData?.meta));
        } catch (err) {
          console.error(err);
        }
      },
    }),

    getAllActiveCountrys: builder.query({
      query: (
        params = { page: 1, limit: "", search: "", status: "active" }
      ) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `country?${queryString}`,
          method: "GET",
        };
      },
    }),

    getAllApiCountrys: builder.query({
      query: () => {
        return {
          url: `country/from-rest-api`,
          method: "GET",
        };
      },
    }),
    // ADD A NEW ADMIN
    addCountry: builder.mutation({
      query: (formData) => {
        return {
          url: "/country/create",
          method: "POST",
          body: formData,
        };
      },
    }),

    // UPDATE A ADMIN
    updateCountry: builder.mutation({
      query: ({ id, formData }) => {
        return {
          url: `country/update?country_id=${id}`,
          method: "PATCH",
          body: formData,
        };
      },
    }),

    // DELETE A NEW ADMIN
    deleteCountry: builder.mutation({
      query: ({ id }) => {
        return {
          url: `country/delete?country_id=${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetAllCountrysQuery,
  useAddCountryMutation,
  useDeleteCountryMutation,
  useUpdateCountryMutation,
  useGetAllApiCountrysQuery,
  useGetAllActiveCountrysQuery,
} = countryApi;
