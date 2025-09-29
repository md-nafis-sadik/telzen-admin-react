import { createSlice } from "@reduxjs/toolkit";

// const initialState = {};

const navSlice = createSlice({
  name: "navSlice",
  initialState: null,
  reducers: {
    setActivePath: (state, action) => {
      //   state.activePath = action.payload;
      return action.payload;
    },
  },
});

export default navSlice.reducer;
export const { setActivePath } = navSlice.actions;
