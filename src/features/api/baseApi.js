import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["recipientInfo", "senderInfo", "manualOrder", "printedDataList"],
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://grozziie.zjweiting.com:3091/tiktokshop-partner/api/dev/",
    baseUrl: "https://grozziie.zjweiting.com:3091/",
    // credentials: "include",
  }),
  endpoints: () => ({}),
});
