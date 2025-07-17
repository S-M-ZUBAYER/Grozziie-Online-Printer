import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import { baseApi } from "./api/baseApi";
import orderListSlice from "./slice/orderListSlice";
import logisticCompaniesSlice from "./slice/logisticCompaniesSlice";
import allDeliveryCompanySlice from "./slice/allDeliveryCompanySlice";
import shopDeliveryCompanySlice from "./slice/shopDeliveryCompanySlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    user: userSlice,
    orderList: orderListSlice,
    logisticCompanies: logisticCompaniesSlice,
    deliveryCompanies: allDeliveryCompanySlice,
    shopDeliveryCompanyList: shopDeliveryCompanySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
