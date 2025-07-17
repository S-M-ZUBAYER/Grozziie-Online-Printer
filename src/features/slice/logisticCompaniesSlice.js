import { createSlice } from "@reduxjs/toolkit";

const logisticCompaniesSlice = createSlice({
  name: "logisticCompanies",
  initialState: {
    data: [],
  },
  reducers: {
    logisticCompanies: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { logisticCompanies } = logisticCompaniesSlice.actions;

export default logisticCompaniesSlice.reducer;
