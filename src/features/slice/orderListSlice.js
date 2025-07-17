import { createSlice } from "@reduxjs/toolkit";

const orderListSlice = createSlice({
  name: "orderList",
  initialState: {
    data: [],
  },
  reducers: {
    orderListData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { orderListData } = orderListSlice.actions;

export default orderListSlice.reducer;
