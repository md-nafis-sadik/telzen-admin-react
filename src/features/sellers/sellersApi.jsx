import { apiSlice } from "../api/apiSlice";

const sellersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSellers:
      // builder.query({
      //   query: () => ({
      //     url: "/community-images/all/",
      //   }),
      // }),
      builder.query({
        queryFn: () => {
          // Mock data array
          const mockVendor1 = [
            {
              _id: "1",
              name: "Nicole D'Amore",
              role: "Manager",
              email: "cust@gmail.com",
              phone: "+88 0215521552",
              timestamp: Math.floor(Date.now() / 1000) - 86400,
              createdAt: Math.floor(Date.now() / 1000) - 86400,
            },
            {
              _id: "2",
              name: "Nicole D'Amore",
              role: "Manager",
              email: "cust@gmail.com",
              phone: "+88 0215521552",
              timestamp: Math.floor(Date.now() / 1000) - 86400,
              createdAt: Math.floor(Date.now() / 1000) - 86400,
            },
            {
              _id: "3",
              name: "Nicole D'Amore",
              role: "Manager",
              email: "cust@gmail.com",
              phone: "+88 0215521552",
              timestamp: Math.floor(Date.now() / 1000) - 86400,
              createdAt: Math.floor(Date.now() / 1000) - 86400,
            },
          ];

          return { data: mockVendor1 };
        },
      }),
    getAllActiveSellers: builder.query({
      query: () => ({
        url: "/community-images/active/",
      }),
    }),
    addSeller: builder.mutation({
      query: (data) => ({
        url: "/community-images/add/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            sellersApi.util.updateQueryData(
              "getAllSellers",
              undefined,
              (draft) => {
                draft.push(result?.data);
              }
            )
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    updateSeller: builder.mutation({
      query: ({ id, data }) => ({
        url: `/community-images/update/${id}/`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted({ id, data }, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data) {
            dispatch(
              sellersApi.util.updateQueryData(
                "getAllSellers",
                undefined,
                (draft) => {
                  const index = draft.findIndex((item) => item._id === id);
                  if (index !== -1) {
                    draft[index] = {
                      ...draft[index],
                      ...result?.data?.updatedCommunityImage,
                    };
                  }
                }
              )
            );
            dispatch(
              sellersApi.util.updateQueryData(
                "getAllActiveSellers",
                undefined,
                (draft) => {
                  const index = draft.findIndex((item) => item._id === id);
                  if (index !== -1) {
                    draft[index] = {
                      ...draft[index],
                      ...result?.data?.updatedCommunityImage,
                    };
                  }
                }
              )
            );
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
    deleteSeller: builder.mutation({
      query: (id) => ({
        url: `/community-images/delete/${id}/`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data) {
            dispatch(
              sellersApi.util.updateQueryData(
                "getAllSellers",
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
  useGetAllSellersQuery,
  useGetAllActiveSellersQuery,
  useAddSellerMutation,
  useUpdateSellerMutation,
  useDeleteSellerMutation,
} = sellersApi;
