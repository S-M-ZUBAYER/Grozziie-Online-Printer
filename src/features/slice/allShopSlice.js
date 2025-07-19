import { createSlice } from "@reduxjs/toolkit";

const allShopSlice = createSlice({
    name: "allShopList",
    initialState: {
        data: [],
    },
    reducers: {
        // ✅ Use a proper action name
        setAllShopList: (state, action) => {
            state.data = action.payload;
        },
    },
});

// ✅ Export the renamed action
export const { setAllShopList } = allShopSlice.actions;

// ✅ Default export is the reducer
export default allShopSlice.reducer;
