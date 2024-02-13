/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api", // optional
  baseQuery: fetchBaseQuery({
    baseUrl: "https://eb6e-176-234-134-191.ngrok-free.app",
  }),
  tagTypes: ["Test"],
  endpoints: (builder) => ({}),
});
