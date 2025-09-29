import { setKeepgoPackageData, setKeepgoPackageMetaData } from ".";
import { apiSlice } from "../../api/apiSlice";

export const keepgoPackagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL PACKAGES
    getAllKeepgoPackages: builder.query({
      query: (
        params = { page: 1, limit: 10, search: "", status: "", region: "" }
      ) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `package?${queryString}&vendor_type=keep-go`,
          method: "GET",
        };
      },
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const { data: apiData } = await queryFulfilled;
          dispatch(setKeepgoPackageData(apiData));
          dispatch(setKeepgoPackageMetaData(apiData?.meta));
        } catch (err) {
          console.error(err);
        }
      },
    }),

    // GET ALL PACKAGES
    getAllActiveKeepgoPackages: builder.query({
      query: (
        params = {
          page: 1,
          limit: "",
          search: "",
          status: "active",
          region: ""
        }
      ) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `package?${queryString}&vendor_type=keep-go`,
          method: "GET",
        };
      },
    }),
    // GET ALL kEEPgo PACKAGES
    getAllKeepgoOriginalPackages: builder.query({
      query: (
        params = {
          page: 1,
          limit: "",
          search: ""
        }
      ) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `package/keep-go?${queryString}`,
          method: "GET",
        };
      },
    }),
    // ADD A NEW PACKAGE
    addKeepgoPackage: builder.mutation({
      query: ({ data }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        return {
          url: "/package/create",
          method: "POST",
          body: formData,
        };
      },
    }),

    // UPDATE A PACKAGE
    updateKeepgoPackage: builder.mutation({
      query: ({ data, id }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        return {
          url: `package/update?package_id=${id}`,
          method: "PATCH",
          body: formData,
        };
      },
    }),

    // DELETE A NEW PACKAGE
    deleteKeepgoPackage: builder.mutation({
      query: ({ id }) => {
        return {
          url: `package/delete?package_id=${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetAllKeepgoPackagesQuery,
  useAddKeepgoPackageMutation,
  useDeleteKeepgoPackageMutation,
  useUpdateKeepgoPackageMutation,
  useGetAllActiveKeepgoPackagesQuery,
  useGetAllKeepgoOriginalPackagesQuery,
  useLazyGetAllKeepgoOriginalPackagesQuery
} = keepgoPackagesApi;
