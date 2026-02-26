import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import { baseApi } from "./api/baseApi";
import orderListSlice from "./slice/orderListSlice";
import logisticCompaniesSlice from "./slice/logisticCompaniesSlice";
import allDeliveryCompanySlice from "./slice/allDeliveryCompanySlice";
import shopDeliveryCompanySlice from "./slice/shopDeliveryCompanySlice";
import allShopSlice from "./slice/allShopSlice";
// import allTikTokShopList from "./slice/allShopSlice";
// import allShopeeShopList from "./slice/allShopSlice";
// import allLazadaShopList from "./slice/allShopSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    user: userSlice,
    orderList: orderListSlice,
    logisticCompanies: logisticCompaniesSlice,
    deliveryCompanies: allDeliveryCompanySlice,
    shopDeliveryCompanyList: shopDeliveryCompanySlice,
    ...allShopSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
