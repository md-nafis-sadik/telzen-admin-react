import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";
import authSlice from "../features/auth/authSlice";
import navSlice from "../features/nav/navSlice";
import settingsSlice from "../features/settings/settingsSlice";
import regionSlice from "../features/packages/packageRegion/regionSlice";
import countrySlice from "../features/packages/packageCountry/countrySlice";
import packageSlice from "../features/packages/package/packageSlice";
import staffSlice from "../features/staffs/staffSlice";
import couponSlice from "../features/coupons/couponSlice";
import userSlice from "../features/users/userSlice";
import userDetailsSlice from "../features/userDetails/userDetailsSlice";
import revenueSlice from "../features/revenues/revenueSlice";
import statSlice from "../features/stats/statSlice";
import notificationSlice from "../features/notifications/notificationSlice";
import popularCountrySlice from "../features/packages/popularCountry/popularCountrySlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    nav: navSlice,
    auth: authSlice,
    settings: settingsSlice,
    region: regionSlice,
    country: countrySlice,
    package: packageSlice,
    staff: staffSlice,
    coupon: couponSlice,
    user: userSlice,
    userDetails: userDetailsSlice,
    revenue: revenueSlice,
    stat: statSlice,
    notification: notificationSlice,
    popularCountry: popularCountrySlice,
  },
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares().concat(apiSlice.middleware),
});
