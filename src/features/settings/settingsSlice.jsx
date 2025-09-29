import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  settings: undefined,
};

const settingsSlice = createSlice({
  name: "settingsSlice",
  initialState,
  reducers: {
    setSettings: (state, action) => {
      state.settings = action.payload.settings;
    },
    updateSettings: (state, action) => {
      state.settings = { ...action.payload };
    },
  },
});

export const { setSettings, updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
