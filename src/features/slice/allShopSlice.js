// import { createSlice } from "@reduxjs/toolkit";

// const allTikTokShopSlice = createSlice({
//     name: "allTikTokShopList",
//     initialState: {
//         data: [],
//     },
//     reducers: {
//         // ✅ Use a proper action name
//         setAllTikTokShopList: (state, action) => {
//             state.data = action.payload;
//         },
//     },
// });

// // ✅ Export the renamed action
// export const { setAllTikTokShopList } = allTikTokShopSlice.actions;

// // ✅ Default export is the reducer
// export default allTikTokShopSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

// ✅ TikTok Slice
const allTikTokShopSlice = createSlice({
    name: "allTikTokShopList",
    initialState: {
        data: [],
    },
    reducers: {
        setAllTikTokShopList: (state, action) => {
            state.data = action.payload;
        },
    },
});

// ✅ Shopee Slice
const allShopeeShopSlice = createSlice({
    name: "allShopeeShopList",
    initialState: {
        data: [],
    },
    reducers: {
        setAllShopeeShopList: (state, action) => {
            state.data = action.payload;
        },
    },
});

// ✅ Lazada Slice
const allLazadaShopSlice = createSlice({
    name: "allLazadaShopList",
    initialState: {
        data: [],
    },
    reducers: {
        setAllLazadaShopList: (state, action) => {
            state.data = action.payload;
        },
    },
});

// ✅ Export actions
export const { setAllTikTokShopList } = allTikTokShopSlice.actions;
export const { setAllShopeeShopList } = allShopeeShopSlice.actions;
export const { setAllLazadaShopList } = allLazadaShopSlice.actions;

// ✅ Default export: group reducers
export default {
    allTikTokShopList: allTikTokShopSlice.reducer,
    allShopeeShopList: allShopeeShopSlice.reducer,
    allLazadaShopList: allLazadaShopSlice.reducer,
};

