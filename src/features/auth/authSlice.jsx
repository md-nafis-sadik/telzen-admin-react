import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  access_token: undefined,
  auth: undefined,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.access_token = action.payload.access_token;
      state.auth = action.payload.auth;
    },
    updateAuth: (state, action) => {
      state.auth = { ...state.auth, ...action.payload };
    },
    logout: (state) => {
      state.access_token = undefined;
      state.auth = undefined;
      localStorage.removeItem("telzenAuth");
    },
  },
});

export const { setAuth, logout, updateAuth } = authSlice.actions;
export default authSlice.reducer;
