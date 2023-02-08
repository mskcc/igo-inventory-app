import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: "app",
    initialState: {
      password: '',
      activePage: 'home'
    },
    reducers: {
      setPassword: (state, action) => {
        state.password = action.payload;
      },
      setActivePage: (state, action) => {
        state.activePage = action.payload;
      }
    },
  });

  export const {
    setPassword,
    setActivePage
  } = appSlice.actions;

  export default appSlice.reducer;
