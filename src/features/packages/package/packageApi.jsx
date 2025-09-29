import { setPackageData, setPackageMetaData } from ".";
import { apiSlice } from "../api/../../api/apiSlice";

export const packagesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // GET ALL PACKAGES
        getAllPackages: builder.query({
            query: (params = { page: 1, limit: 10, search: "", status: "", region: "" }) => {
                const queryString = new URLSearchParams(params).toString();
                return {
                    url: `package?${queryString}&vendor_type=telnyx`,
                    method: "GET"
                };
            },
            async onQueryStarted(_args, { queryFulfilled, dispatch }) {
                try {
                    const { data: apiData } = await queryFulfilled;
                    dispatch(setPackageData(apiData));
                    dispatch(setPackageMetaData(apiData?.meta));
                } catch (err) {
                    console.error(err);
                }
            },
        }),

        // GET ALL PACKAGES
        getAllActivePackages: builder.query({
            query: (params = { page: 1, limit: "", search: "", status: "active", region: "" }) => {
                const queryString = new URLSearchParams(params).toString();
                return {
                    url: `package?${queryString}&vendor_type=telnyx`,
                    method: "GET"
                };
            },
        }),
        // ADD A NEW PACKAGE
        addPackage: builder.mutation({
            query: ({ data }) => {

                const formData = new FormData();
                formData.append("data", JSON.stringify(data));

                return {
                    url: "/package/create", method: "POST", body: formData
                };
            },
        }),

        // UPDATE A PACKAGE
        updatePackage: builder.mutation({
            query: ({ data, id }) => {

                const formData = new FormData();
                formData.append("data", JSON.stringify(data));

                return {
                    url: `package/update?package_id=${id}`, method: "PATCH", body: formData
                };
            },
        }),

        // DELETE A NEW PACKAGE
        deletePackage: builder.mutation({
            query: ({ id }) => {
                return {
                    url: `package/delete?package_id=${id}`, method: "DELETE",
                };
            },
        }),

    }),
});

export const {
    useGetAllPackagesQuery,
    useAddPackageMutation,
    useDeletePackageMutation,
    useUpdatePackageMutation,
    useGetAllActivePackagesQuery,
} = packagesApi;