import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["recipientInfo", "senderInfo", "manualOrder", "printedDataList"],
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5000/api/v1",
    // baseUrl: "https://jsonplaceholder.typicode.com",
    // baseUrl: "https://grozziieget.zjweiting.com:3091/GrozziiePrint-WebAPI",
    baseUrl: "https://grozziie.zjweiting.com:3091/tiktokshop-partner",
    // credentials: "include",
  }),
  endpoints: () => ({}),
});
