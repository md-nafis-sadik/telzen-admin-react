import { apiSlice } from "../api/apiSlice";

// Dummy data generator
const generateDummyBusinesses = (count, status) => {
  const countries = [
    { code: "US", name: "USA", flag: "🇺🇸" },
    { code: "GB", name: "UK", flag: "🇬🇧" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "JP", name: "Japan", flag: "🇯🇵" },
    { code: "MY", name: "Malaysia", flag: "🇲🇾" },
    { code: "IT", name: "Italy", flag: "🇮🇹" },
    { code: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "DK", name: "Denmark", flag: "🇩🇰" },
    { code: "CN", name: "China", flag: "🇨🇳" },
  ];

  return Array.from({ length: count }, (_, i) => {
    const country = countries[i % countries.length];
    const timestamp = Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000;
    
    return {
      _id: `BZ${1225 + i}`,
      businessId: `TZ${1225 + i}`,
      country: country.code,
      countryName: country.name,
      name: "Lorem ipsum dolor",
      email: "xyzname@gmail.com",
      contactPerson: "Samsung S25",
      timestamp: Math.floor(timestamp / 1000),
      createdAt: Math.floor(timestamp / 1000),
      hasDocument: true,
      status: status,
    };
  });
};

const businessApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActiveBusinesses: builder.query({
      queryFn: () => {
        const mockData = generateDummyBusinesses(10, "active");
        return {
          data: {
            data: mockData,
            meta: {
              total_items: mockData.length,
              total_pages: Math.ceil(mockData.length / 10),
              current_page: 1,
              page_size: 10,
              has_next_page: mockData.length > 10,
              has_previous_page: false,
            },
          },
        };
      },
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data) {
            dispatch(
              apiSlice.util.updateQueryData(
                "getActiveBusinesses",
                undefined,
                (draft) => {
                  return result.data;
                }
              )
            );
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),

    getPendingBusinesses: builder.query({
      queryFn: () => {
        const mockData = generateDummyBusinesses(10, "pending");
        return {
          data: {
            data: mockData,
            meta: {
              total_items: mockData.length,
              total_pages: Math.ceil(mockData.length / 10),
              current_page: 1,
              page_size: 10,
              has_next_page: mockData.length > 10,
              has_previous_page: false,
            },
          },
        };
      },
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data) {
            dispatch(
              apiSlice.util.updateQueryData(
                "getPendingBusinesses",
                undefined,
                (draft) => {
                  return result.data;
                }
              )
            );
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),

    approveBusiness: builder.mutation({
      queryFn: async ({ id }) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { success: true, id } };
      },
    }),

    deleteBusiness: builder.mutation({
      queryFn: async ({ id }) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { success: true, id } };
      },
    }),
  }),
});

export const {
  useGetActiveBusinessesQuery,
  useGetPendingBusinessesQuery,
  useApproveBusinessMutation,
  useDeleteBusinessMutation,
} = businessApi;

export default businessApi;
