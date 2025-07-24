import { createSlice } from "@reduxjs/toolkit";

const deliveryCompaniesSlice = createSlice({
  name: "deliveryCompanies",
  initialState: {
    data: [],
  },
  reducers: {
    setDeliveryCompanies: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setDeliveryCompanies } = deliveryCompaniesSlice.actions;

export default deliveryCompaniesSlice.reducer;
