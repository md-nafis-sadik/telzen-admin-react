import { apiSlice } from "../api/apiSlice";
import { subMonths, addDays, format, startOfDay } from "date-fns";

const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // getAllUser: builder.query({
    //   query: () => ({
    //     url: "/users/all/",
    //   }),
    // }),
    getAllUser: builder.query({
      queryFn: () => {
        // Mock data array
        const mockUsers = [
          {
            _id: "1",
            userId: "NR1225",
            countryCode: "US",
            countryName: "United States",
            fullName: "Md. Abdur Rahman",
            timestamp: Math.floor(Date.now() / 1000) - 86400,
            createdAt: Math.floor(Date.now() / 1000) - 86400,
            mobile: "+8801712345678",
            email: "xyzname@email.com",
            status: true,
          },
          {
            _id: "2",
            userId: "NR1226",
            countryCode: "GB",
            countryName: "United Kingdom",
            fullName: "Md. Abdur Rahman",
            timestamp: Math.floor(Date.now() / 1000) - 86400,
            createdAt: Math.floor(Date.now() / 1000) - 86400,
            mobile: "+8801712345679",
            email: "xyzname@email.com",
            status: true,
          },
          {
            _id: "3",
            userId: "NR1227",
            countryCode: "CA",
            countryName: "Canada",
            fullName: "Md. Abdur Rahman",
            timestamp: Math.floor(Date.now() / 1000) - 86400,
            createdAt: Math.floor(Date.now() / 1000) - 86400,
            mobile: "+8801712345680",
            email: "xyzname@email.com",
            status: true,
          },
          {
            _id: "4",
            userId: "NR1228",
            countryCode: "AU",
            countryName: "Australia",
            fullName: "Md. Abdur Rahman",
            timestamp: Math.floor(Date.now() / 1000) - 86400,
            createdAt: Math.floor(Date.now() / 1000) - 86400,
            mobile: "+8801712345681",
            email: "xyzname@email.com",
            status: true,
          },
          {
            _id: "5",
            userId: "NR1229",
            countryCode: "DE",
            countryName: "Germany",
            fullName: "Md. Abdur Rahman",
            timestamp: Math.floor(Date.now() / 1000) - 86400,
            createdAt: Math.floor(Date.now() / 1000) - 86400,
            mobile: "+8801712345682",
            email: "xyzname@email.com",
            status: true,
          },
          {
            _id: "6",
            userId: "NR1230",
            countryCode: "FR",
            countryName: "France",
            fullName: "Md. Abdur Rahman",
            timestamp: Math.floor(Date.now() / 1000) - 86400,
            createdAt: Math.floor(Date.now() / 1000) - 86400,
            mobile: "+8801712345683",
            email: "xyzname@email.com",
            status: true,
          },
          {
            _id: "7",
            userId: "NR1231",
            countryCode: "JP",
            countryName: "Japan",
            fullName: "Md. Abdur Rahman",
            timestamp: Math.floor(Date.now() / 1000) - 86400,
            createdAt: Math.floor(Date.now() / 1000) - 86400,
            mobile: "+8801712345684",
            email: "xyzname@email.com",
            status: true,
          },
          {
            _id: "8",
            userId: "NR1232",
            countryCode: "BR",
            countryName: "Brazil",
            fullName: "Md. Abdur Rahman",
            timestamp: Math.floor(Date.now() / 1000) - 86400,
            createdAt: Math.floor(Date.now() / 1000) - 86400,
            mobile: "+8801712345685",
            email: "xyzname@email.com",
            status: true,
          },
          {
            _id: "9",
            userId: "NR1233",
            countryCode: "IN",
            countryName: "India",
            fullName: "Md. Abdur Rahman",
            timestamp: Math.floor(Date.now() / 1000) - 86400,
            createdAt: Math.floor(Date.now() / 1000) - 86400,
            mobile: "+8801712345686",
            email: "xyzname@email.com",
            status: true,
          },
          {
            _id: "10",
            userId: "NR1234",
            countryCode: "ZA",
            countryName: "South Africa",
            fullName: "Md. Abdur Rahman",
            timestamp: Math.floor(Date.now() / 1000) - 86400,
            createdAt: Math.floor(Date.now() / 1000) - 86400,
            mobile: "+8801712345687",
            email: "xyzname@email.com",
            status: true,
          },
          {
            _id: "11",
            userId: "NR1234",
            countryCode: "ZA",
            countryName: "South Africa",
            fullName: "Md. Abdur Rahman",
            timestamp: Math.floor(Date.now() / 1000) - 86400,
            createdAt: Math.floor(Date.now() / 1000) - 86400,
            mobile: "+8801712345687",
            email: "xyzname@email.com",
            status: true,
          },
          {
            _id: "12",
            userId: "NR1234",
            countryCode: "ZA",
            countryName: "South Africa",
            fullName: "Md. Abdur Rahman",
            timestamp: Math.floor(Date.now() / 1000) - 86400,
            createdAt: Math.floor(Date.now() / 1000) - 86400,
            mobile: "+8801712345687",
            email: "xyzname@email.com",
            status: true,
          },
        ];

        return { data: mockUsers };
      },
    }),
    addUser: builder.mutation({
      query: (data) => ({
        url: "/users/add/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            usersApi.util.updateQueryData("getAllUser", undefined, (draft) => {
              draft.push(result?.data);
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/update/${id}/`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted({ id, data }, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data) {
            dispatch(
              usersApi.util.updateQueryData(
                "getAllUser",
                undefined,
                (draft) => {
                  const index = draft.findIndex((item) => item._id === id);
                  if (index !== -1) {
                    draft[index] = { ...draft[index], ...result?.data?.user };
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
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/delete/${id}/`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data) {
            dispatch(
              usersApi.util.updateQueryData(
                "getAllUser",
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
    // getChartsData: builder.query({
    //   async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
    //     const { data: usersData } = await fetchWithBQ(`/users/all/`);
    //     const { data: wallpapersData } = await fetchWithBQ(
    //       `/community-images/all/`
    //     );

    //     const currentDate = new Date();
    //     const currentMonth = currentDate?.getMonth() + 1;
    //     const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;

    //     const usersChartsData = [];
    //     const wallpapersChartsData = [];

    //     // get wallpaper by data
    //     const wallpapersCountByDate = wallpapersData?.reduce((acc, user) => {
    //       const date = new Date(user?.createdAt * 1000); // Convert timestamp to date
    //       const month = date?.getMonth() + 1; // Months are zero-indexed, so add 1
    //       const day = date?.getDate();

    //       const dateString = `${month.toString()?.padStart(2, "0")}-${day
    //         ?.toString()
    //         ?.padStart(2, "0")}`;

    //       if (!acc[dateString]) {
    //         acc[dateString] = 0;
    //       }

    //       acc[dateString] += 1;

    //       return acc;
    //     }, {});

    //     // assign wallpaper in array
    //     for (let day = 1; day <= 31; day++) {
    //       const dateString = `${currentMonth.toString()?.padStart(2, "0")}-${day
    //         ?.toString()
    //         ?.padStart(2, "0")}`;
    //       const prevDateString = `${prevMonth
    //         .toString()
    //         ?.padStart(2, "0")}-${day?.toString()?.padStart(2, "0")}`;

    //       const wallpaperCount = wallpapersCountByDate[dateString] || 0;
    //       const prevWallpaperCount = wallpapersCountByDate[prevDateString] || 0;

    //       wallpapersChartsData.push({
    //         date: day?.toString()?.padStart(2, "0"),
    //         current: wallpaperCount,
    //         previous: prevWallpaperCount,
    //       });
    //     }
    //     // get user by data
    //     const usersCountByDate = usersData?.reduce((acc, user) => {
    //       const date = new Date(user?.createdAt * 1000); // Convert timestamp to date
    //       const month = date?.getMonth() + 1; // Months are zero-indexed, so add 1
    //       const day = date?.getDate();

    //       const dateString = `${month.toString()?.padStart(2, "0")}-${day
    //         ?.toString()
    //         ?.padStart(2, "0")}`;

    //       if (!acc[dateString]) {
    //         acc[dateString] = 0;
    //       }

    //       acc[dateString] += 1;

    //       return acc;
    //     }, {});

    //     // assign user in array
    //     for (let day = 1; day <= 31; day++) {
    //       const dateString = `${currentMonth.toString()?.padStart(2, "0")}-${day
    //         ?.toString()
    //         ?.padStart(2, "0")}`;
    //       const prevDateString = `${prevMonth
    //         .toString()
    //         ?.padStart(2, "0")}-${day?.toString()?.padStart(2, "0")}`;

    //       const userCount = usersCountByDate[dateString] || 0;
    //       const prevUserCount = usersCountByDate[prevDateString] || 0;

    //       usersChartsData.push({
    //         date: day?.toString()?.padStart(2, "0"),
    //         current: userCount,
    //         previous: prevUserCount,
    //       });
    //     }
    //     const results = {
    //       usersChartsData,
    //       wallpapersChartsData,
    //     };
    //     return {
    //       data: results,
    //     };
    //   },
    // }),

    // In your usersApi slice (apiSlice.js)
    getChartsData: builder.query({
      queryFn: () => {
        // Generate mock chart data
        // const generateChartData = () => {
        //   const data = [];
        //   for (let day = 1; day <= 31; day++) {
        //     data.push({
        //       date: day.toString().padStart(2, "0"),
        //       current: Math.floor(Math.random() * 20), // Current month data (0-20)
        //       previous: Math.floor(Math.random() * 15), // Previous month data (0-15)
        //     });
        //   }
        //   return data;
        // };

        // const mockChartData = {
        //   usersChartsData: generateChartData(),
        //   wallpapersChartsData: generateChartData().map((item) => ({
        //     ...item,
        //     current: Math.floor(Math.random() * 30), // Higher values for wallpapers
        //     previous: Math.floor(Math.random() * 25),
        //   })),
        // };

        const generateChartData = (months = 6, interval = null) => {
          const endDate = startOfDay(new Date());
          const totalDays = months * 30; // Approximate month to 30 days
          const intervalDays = Math.floor(totalDays / 6);
          const data = [];

          for (let i = 0; i < 6; i++) {
            const date = addDays(subMonths(endDate, months), i * intervalDays);
            data.push({
              name: format(date, "MMM d"),
              sales: Math.floor(Math.random() * 30000 + 2000),
            });
          }

          return data;
        };

        const mockChartData = {
          usersChartsData: generateChartData().map((item) => ({
            ...item,
            users: Math.floor(Math.random() * 30),
            previous: Math.floor(Math.random() * 25),
          })),
          salesChartsData: generateChartData().map((item) => ({
            ...item,
            sales: Math.floor(Math.random() * 30), // Changed from 'current' to 'sales'
            previous: Math.floor(Math.random() * 25),
          })),
        };

        return { data: mockChartData };
      },
    }),
  }),
});

export const {
  useGetAllUserQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetChartsDataQuery,
} = usersApi;
