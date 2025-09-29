import { apiSlice } from "../api/apiSlice";

const landingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //all
    getLanding: builder.query({
      query: () => ({
        url: "/landings/get/",
      }),
    }),

    //hero
    addOrUpdateLandingHero: builder.mutation({
      query: (data) => ({
        url: "/landings/hero/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            landingApi.util.updateQueryData(
              "getAllLanding",
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

    //explore
    addOrUpdateLandingExplore: builder.mutation({
      query: (data) => ({
        url: "/landings/explore/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            landingApi.util.updateQueryData(
              "getAllLanding",
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

    //faq
    addOrUpdateLandingFaq: builder.mutation({
      query: (data) => ({
        url: "/landings/faq/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            landingApi.util.updateQueryData(
              "getAllLanding",
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

    //team
    addOrUpdateLandingTeam: builder.mutation({
      query: (data) => ({
        url: "/landings/team/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            landingApi.util.updateQueryData(
              "getAllLanding",
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

    // Add one team member
    addOneTeamMember: builder.mutation({
      query: (data) => ({
        url: "/landings/team/add/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            landingApi.util.updateQueryData(
              "getLanding",
              undefined,
              (draft) => {
                draft.teamMembers.push(result?.data);
              }
            )
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),

    // Remove one team member
    removeOneTeamMember: builder.mutation({
      query: (data) => ({
        url: "/landings/team/remove/",
        method: "DELETE",
        body: data, // Make sure the backend receives the correct structure
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled; // Assuming the response has data with _id
          dispatch(
            landingApi.util.updateQueryData(
              "getLanding",
              undefined,
              (draft) => {
                // Check if the response contains the right structure and remove by
                draft.teamMembers = draft.teamMembers.filter(
                  (item) => item.id !== data.id // Remove based on the member
                );
              }
            )
          );
        } catch (error) {
          console.error(error);
        }
      },
    }),

    //join
    addOrUpdateLandingJoin: builder.mutation({
      query: (data) => ({
        url: "/landings/join/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            landingApi.util.updateQueryData(
              "getAllLanding",
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

    //header
    addOrUpdateLandingHeader: builder.mutation({
      query: (data) => ({
        url: "/landings/header/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            landingApi.util.updateQueryData(
              "getAllLanding",
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

    //footer
    addOrUpdateLandingFooter: builder.mutation({
      query: (data) => ({
        url: "/landings/footer/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            landingApi.util.updateQueryData(
              "getAllLanding",
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

    //social
    addOrUpdateLandingSocial: builder.mutation({
      query: (data) => ({
        url: "/landings/social/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            landingApi.util.updateQueryData(
              "getAllLanding",
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

    //common
    addOrUpdateLandingCommon: builder.mutation({
      query: (data) => ({
        url: "/landings/common/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            landingApi.util.updateQueryData(
              "getAllLanding",
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

    //delete
    deleteLanding: builder.mutation({
      query: () => ({
        url: `/landings/delete/`,
        method: "DELETE",
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data) {
            dispatch(
              landingApi.util.updateQueryData(
                "getAllLanding",
                undefined,
                (draft) => {
                  const filteredArray = draft.filter(
                    (item) => item?.id !== id
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
  useGetLandingQuery,
  useAddOrUpdateLandingHeroMutation,
  useAddOrUpdateLandingExploreMutation,
  useAddOrUpdateLandingFaqMutation,
  useAddOrUpdateLandingJoinMutation,
  useAddOrUpdateLandingTeamMutation,
  useAddOneTeamMemberMutation,
  useRemoveOneTeamMemberMutation,
  useAddOrUpdateLandingHeaderMutation,
  useAddOrUpdateLandingFooterMutation,
  useAddOrUpdateLandingSocialMutation,
  useAddOrUpdateLandingCommonMutation,
  useDeleteLandingMutation,
} = landingApi;
