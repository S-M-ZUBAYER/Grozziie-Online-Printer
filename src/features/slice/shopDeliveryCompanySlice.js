import { createSlice } from "@reduxjs/toolkit";

const shopDeliveryCompanySlice = createSlice({
    name: "shopDeliveryCompanyList",
    initialState: {
        data: [],
    },
    reducers: {
        shopDeliveryCompanyList: (state, action) => {
            state.data = action.payload;
        },
    },
});

export const { shopDeliveryCompanyList } = shopDeliveryCompanySlice.actions;

export default shopDeliveryCompanySlice.reducer;