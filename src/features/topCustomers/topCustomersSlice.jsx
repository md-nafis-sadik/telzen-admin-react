import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataList: [],
};

const topCustomersSlice = createSlice({
  name: "topCustomers",
  initialState,
  reducers: {
    setTopCustomersData: (state, action) => {
      state.dataList = action.payload?.data || [];
    },
  },
});

export const { setTopCustomersData } = topCustomersSlice.actions;
export default topCustomersSlice.reducer;
