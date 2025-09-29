import { setPromoData, setPromoMetaData } from ".";
import { apiSlice } from "../api/apiSlice";

export const promoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL ADMINS
    getAllPromos: builder.query({
      query: (params = { page: 1, limit: 10, search: "", status: "" }) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `promo?${queryString}`,
          method: "GET",
        };
      },
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const { data: apiData } = await queryFulfilled;
          dispatch(setPromoData(apiData));
          dispatch(setPromoMetaData(apiData?.meta));
        } catch (err) {
          console.error(err);
        }
      },
    }),

    // GET ALL ADMINS
    getAllActivePromos: builder.query({
      query: (
        params = { page: 1, limit: "", search: "", status: "active" }
      ) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `promo?${queryString}`,
          method: "GET",
        };
      },
    }),
    // ADD A NEW ADMIN
    addPromo: builder.mutation({
      query: ({ data }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        return {
          url: "/promo/create",
          method: "POST",
          body: formData,
        };
      },
    }),

    // UPDATE A ADMIN
    updatePromo: builder.mutation({
      query: ({ data, id }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        return {
          url: `promo/update?promo_id=${id}`,
          method: "PATCH",
          body: formData,
        };
      },
    }),

    // DELETE A NEW ADMIN
    deletePromo: builder.mutation({
      query: ({ id }) => {
        return {
          url: `promo/delete?promo_id=${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetAllPromosQuery,
  useAddPromoMutation,
  useDeletePromoMutation,
  useUpdatePromoMutation,
  useGetAllActivePromosQuery,
} = promoApi;
