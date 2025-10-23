import { setPopularCountryData, setPopularCountryMetaData } from ".";
import { apiSlice } from "../../api/apiSlice";

export const popularPopularCountryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL Popular Country
    getAllPopularCountrys: builder.query({
      query: (params = { page: 1, limit: 10, search: "", status: "" }) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `popular-country?${queryString}`,
          method: "GET",
        };
      },
      providesTags: (result, error, arg) => [
        { type: 'PopularCountry', id: 'LIST' },
        ...((result?.data || []).map(({ _id }) => ({ type: 'PopularCountry', id: _id }))),
      ],
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const { data: apiData } = await queryFulfilled;
          dispatch(setPopularCountryData(apiData));
          dispatch(setPopularCountryMetaData(apiData?.meta));
        } catch (err) {
          console.error(err);
        }
      },
    }),

    getAllActivePopularCountrys: builder.query({
      query: (
        params = { page: 1, limit: "", search: "", status: "active" }
      ) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `popular-country?${queryString}`,
          method: "GET",
        };
      },
    }),

    getAllApiPopularCountrys: builder.query({
      query: () => {
        return {
          url: `country`,
          method: "GET",
        };
      },
    }),
    // ADD A NEW ADMIN
    addPopularCountry: builder.mutation({
      query: ({ data }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        return {
          url: "/popular-country/create",
          method: "POST",
          body: formData,
        };
      },
    }),

    addPopularCountries: builder.mutation({
      query: ({ country_id, feature_countries }) => ({
        url: `popular-country/add?country_id=${country_id}`,
        method: "POST",
        body: { feature_countries },
      }),
      invalidatesTags: [],
    }),

    // UPDATE A ADMIN
    updatePopularCountry: builder.mutation({
      query: ({ data, id }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        return {
          url: `popular-country/update?popular_country_id=${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: [],
    }),

    // DELETE A NEW ADMIN
    deletePopularCountry: builder.mutation({
      query: ({ popular_country_id, country_id }) => {
        return {
          url: `popular-country/remove?popular_country_id=${popular_country_id}&country_id=${country_id}`,
          method: "PATCH",
        };
      },
      invalidatesTags: [],
    }),
    // Add to popularPopularCountryApi endpoints
    updatePopularCountryOrder: builder.mutation({
      query: ({ orderedIds }) => ({
        url: "popular-country/reorder",
        method: "PATCH",
        body: { orderedIds },
      }),
    }),
  }),
});

export const {
  useGetAllPopularCountrysQuery,
  useAddPopularCountryMutation,
  useDeletePopularCountryMutation,
  useUpdatePopularCountryMutation,
  useGetAllApiPopularCountrysQuery,
  useGetAllActivePopularCountrysQuery,
  useUpdatePopularCountryOrder,
  useAddPopularCountriesMutation,
} = popularPopularCountryApi;
