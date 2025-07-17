import { createSlice } from "@reduxjs/toolkit";

const deliveryCompaniesSlice = createSlice({
  name: "deliveryCompanies",
  initialState: {
    data: [],
  },
  reducers: {
    deliveryCompanies: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { deliveryCompanies } = deliveryCompaniesSlice.actions;

export default deliveryCompaniesSlice.reducer;