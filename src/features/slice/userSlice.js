import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
  mainRoute: false,
  isPaymentUser: {},
  accountUser: "",
  tikTokSelectStatus: "",
  checkedItemsFromRedux: [],
  printedDataFromRedux: [],
  checkedExpressFromRedux: [],
  checkedDefaultExpressChange: [],
  allAvailableExpressCompany: [],
  selectedLanguageRedux: "",
};

export const counterSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    mainRouteStateChange: (state, action) => {
      state.mainRoute = !action.payload;
    },
    accountUserChange: (state, action) => {
      state.accountUser = action.payload;
    },
    tikTokSelectStatusChange: (state, action) => {
      state.tikTokSelectStatus = action.payload;
    },
    paymentUserChange: (state, action) => {
      state.isPaymentUser = action.payload;
    },
    mainRouteStateFalseChange: (state, action) => {
      state.mainRoute = action.payload;
    },
    checkedItemsChange: (state, action) => {
      state.checkedItemsFromRedux = action.payload;
    },
    printedDataFromRedux: (state, action) => {
      state.checkedItemsFromRedux = action.payload;
    },
    checkedExpressChange: (state, action) => {
      state.checkedExpressFromRedux = action.payload;
    },
    checkedDefaultExpressChange: (state, action) => {
      state.checkedDefaultExpressChange = action.payload;
    },
    allAvailableExpressCompanyChange: (state, action) => {
      state.allAvailableExpressCompany = action.payload;
    },
    selectedLanguageChange: (state, action) => {
      state.selectedLanguageRedux = action.payload;
    },
  },
});

export const {
  mainRouteStateChange,
  paymentUserChange,
  accountUserChange,
  tikTokSelectStatusChange,
  mainRouteStateFalseChange,
  checkedItemsChange,
  printedDataFromRedux,
  checkedExpressChange,
  checkedDefaultExpressChange,
  allAvailableExpressCompanyChange,
  selectedLanguageChange,
} = counterSlice.actions;

export default counterSlice.reducer;
