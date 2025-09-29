import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboardStats: {
    total_packages: 0,
    total_customers: 0,
    total_sales: 0,
    total_revenue: 0,
  },
  salesData: {
    year: new Date().getFullYear(),
    chart_data: [],
  },
  userGrowthData: {
    year: new Date().getFullYear(),
    chart_data: [],
  },
};

const statSlice = createSlice({
  name: "stat",
  initialState,
  reducers: {
    setDashboardStats: (state, action) => {
      state.dashboardStats = action.payload;
    },
    setSalesData: (state, action) => {
      state.salesData = action.payload;
    },
    setUserGrowthData: (state, action) => {
      state.userGrowthData = action.payload;
    },
  },
});

export const { setDashboardStats, setSalesData, setUserGrowthData } = statSlice.actions;
export default statSlice.reducer;