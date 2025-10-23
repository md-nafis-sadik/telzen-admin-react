import {
  setPackageData,
  setPackageMetaData,
  setSelectedPackageData,
  setCachedPackages,
  setEditFormData,
  setAddFormSelectedPackage,
} from ".";
import { apiSlice } from "../../api/apiSlice";

export const packagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL PACKAGES
    getAllPackages: builder.query({
      query: (
        params = { page: 1, limit: 10, search: "", status: "", region: "" }
      ) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `package?${queryString}`,
          method: "GET",
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

    // GET ALL ACTIVE PACKAGES
    getAllActivePackages: builder.query({
      query: (
        params = {
          page: 1,
          limit: "",
          search: "",
          status: "active",
          region: "",
        }
      ) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `package?${queryString}`,
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
          search: "",
        }
      ) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `package/esim-access?${queryString}`,
          method: "GET",
        };
      },
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const { data: apiData } = await queryFulfilled;
          const packages = apiData.data || [];
          const coverageType = args.coverage_type;

          dispatch(setCachedPackages({ coverageType, packages }));
        } catch (err) {
          console.error(err);
        }
      },
    }),

    getSinglePackage: builder.query({
      query: (params = { package_id: "" }) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `package/single?${queryString}`,
          method: "GET",
        };
      },
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const { data: apiData } = await queryFulfilled;
          const packageData = apiData.data;

          dispatch(setSelectedPackageData(packageData));

          const coverageCountries =
            packageData.coverage_countries?.map((country) =>
              typeof country === "object" ? country._id : country
            ) || [];

          let regionsFromCountries = [];
          if (coverageCountries.length > 0) {
            try {
              const countriesResult = await dispatch(
                apiSlice.endpoints.getAllActiveCountrys.initiate({
                  status: "active",
                  limit: "",
                })
              );

              if (countriesResult.data?.success) {
                const countries = countriesResult.data.data || [];
                regionsFromCountries = coverageCountries
                  .map((countryId) => {
                    const country = countries.find((c) => c._id === countryId);
                    return country?.region?._id;
                  })
                  .filter((regionId) => regionId);

                regionsFromCountries = [...new Set(regionsFromCountries)];
              }
            } catch (error) {
              console.error(
                "Failed to fetch countries for region mapping:",
                error
              );
            }
          }

          const finalRegions =
            regionsFromCountries.length > 0
              ? regionsFromCountries
              : packageData.coverage_regions?.map((region) =>
                  typeof region === "object" ? region._id : region
                ) || [];

          const formData = {
            id: packageData._id || packageData.id || "",
            name: packageData.name || "",
            type: packageData.type || "data",
            data_plan_in_mb: packageData.data_plan_in_mb?.toString() || "",
            bonus_data_plan_in_mb:
              packageData.bonus_data_plan_in_mb?.toString() || "",
            validity: {
              amount: packageData.validity?.amount?.toString() || "",
              type: packageData.validity?.type || "day",
            },
            status: packageData.status || "active",
            coverage_countries: coverageCountries,
            coverage_regions: finalRegions,
            retail_price: {
              USD: packageData.retail_price?.USD?.toString() || "",
            },
            selling_price: {
              USD: packageData.selling_price?.USD?.toString() || "",
            },
            discount_on_selling_price: {
              amount:
                packageData.discount_on_selling_price?.amount?.toString() || "",
              is_type_percentage:
                packageData.discount_on_selling_price?.is_type_percentage ??
                true,
            },
            is_auto_renew_available:
              packageData.is_auto_renrew_available ?? true,
            on_purchase_reward_point:
              packageData.on_purchase_reward_point || "",
            note: packageData.note || "",
            slug: packageData.slug || "",
          };

          dispatch(setEditFormData(formData));
        } catch (err) {
          console.error(err);
        }
      },
    }),
    // ADD A NEW PACKAGE
    addPackage: builder.mutation({
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
    updatePackage: builder.mutation({
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
    deletePackage: builder.mutation({
      query: ({ id }) => {
        return {
          url: `package/delete?package_id=${id}`,
          method: "DELETE",
        };
      },
    }),

    // SELECT PACKAGE FOR ADD FORM (this is a client-side only mutation)
    selectPackageForAdd: builder.mutation({
      queryFn: ({ packageCode, availablePackages }) => {
        const packageData = availablePackages.find(
          (pkg) => pkg.package_code === packageCode
        );
        return { data: { packageCode, packageData } };
      },
      async onQueryStarted({ packageCode, availablePackages }, { dispatch }) {
        const packageData = availablePackages.find(
          (pkg) => pkg.package_code === packageCode
        );
        dispatch(setAddFormSelectedPackage({ packageCode, packageData }));
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
  useGetAllKeepgoOriginalPackagesQuery,
  useLazyGetAllKeepgoOriginalPackagesQuery,
  useGetSinglePackageQuery,
  useLazyGetSinglePackageQuery,
  useSelectPackageForAddMutation,
} = packagesApi;
