import { apiSlice } from "../api/apiSlice";
import { setAuth, updateAuth } from "./authSlice";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/signin",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(data, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          const responseData = result?.data;
          const tokenExpiration = 7 * 24 * 60 * 60 * 1000;
          const expireIn = Date.now() + tokenExpiration;
          localStorage.setItem(
            "telzenAuth",
            JSON.stringify({
              access_token: responseData?.token,
              auth: responseData?.data,
              expireIn,
            })
          );
          dispatch(
            setAuth({
              access_token: responseData?.token,
              auth: responseData?.data,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/admins/register/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(data, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data) {
            try {
              const result = await queryFulfilled;
              const responseData = result?.data;
              const tokenExpiration = 7 * 24 * 60 * 60 * 1000;
              const expireIn = Date.now() + tokenExpiration;
              localStorage.setItem(
                "telzenAuth",
                JSON.stringify({
                  access_token: responseData?.token,
                  auth: responseData?.admin,
                  expireIn,
                })
              );
              dispatch(
                setAuth({
                  access_token: responseData?.token,
                  auth: responseData?.admin,
                })
              );
            } catch (error) {
              console.log(error);
            }
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
    sendResetPasswordEmail: builder.mutation({
      query: (data) => ({
        url: "/admins/reset/",
        method: "POST",
        body: data,
      }),
    }),

    // admin password reset
    adminResetPassword: builder.mutation({
      query: (data) => ({
        url: `/admins/reset/`,
        method: "PATCH",
        body: data,
      }),
    }),

    // user password reset

    userResetPassword: builder.mutation({
      query: (data) => ({
        url: `/users/reset/`,
        method: "PATCH",
        body: data,
      }),
    }),

    // owner password reset

    ownerResetPassword: builder.mutation({
      query: (data) => ({
        url: `/owners/reset/`,
        method: "PATCH",
        body: data,
      }),
    }),

    updateAdmin: builder.mutation({
      query: ({ data, id }) => ({
        url: `/admins/update/${id}/`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted({ data }, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data) {
            const { data } = result || {};
            dispatch(updateAuth(data?.admin));
            const localAuth = localStorage?.getItem("telzenAuth");
            const adminData = JSON.parse(localAuth);
            const { access_token, auth, expireIn } = adminData || {};
            const newData = { ...auth?.admin, ...data?.admin };
            localStorage.setItem(
              "telzenAuth",
              JSON.stringify({
                access_token,
                auth: newData,
                expireIn,
              })
            );
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
    // Add these to authApi endpoints
    forgetPasswordSendCode: builder.mutation({
      query: (email) => ({
        url: `/forget-password/send-code?email=${email}`,
        method: "POST",
      }),
    }),
    forgetPasswordResendCode: builder.mutation({
      query: (token) => ({
        url: "/forget-password/resend-code",
        method: "POST",
        body: { token },
      }),
    }),
    forgetPasswordVerifyOtp: builder.mutation({
      query: ({ code, token }) => ({
        url: "/forget-password/verify-otp",
        method: "POST",
        body: { code, token },
      }),
    }),
    forgetPasswordReset: builder.mutation({
      query: ({ password, token }) => ({
        url: "/forget-password/reset",
        method: "PATCH",
        body: { password, token },
      }),
    }),
    updateOwnProfile: builder.mutation({
      query: (data) => ({
        url: "/admin/update-own-profile",
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted({ queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const localAuth = localStorage?.getItem("telzenAuth");
          if (localAuth) {
            const authData = JSON.parse(localAuth);
            authData.auth.admin = { ...authData.auth.admin, ...data.admin };
            localStorage.setItem("telzenAuth", JSON.stringify(authData));
          }
        } catch (error) {
          patchResult.undo(); // Revert optimistic update
          // Let the component handle the error
          throw error;
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useSendResetPasswordEmailMutation,
  useUpdateAdminMutation,
  useAdminResetPasswordMutation,
  useUserResetPasswordMutation,
  useOwnerResetPasswordMutation,
  useForgetPasswordSendCodeMutation,
  useForgetPasswordResendCodeMutation,
  useForgetPasswordVerifyOtpMutation,
  useForgetPasswordResetMutation,
  useUpdateOwnProfileMutation,
} = authApi;
