/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api", // optional
  baseQuery: fetchBaseQuery({
    baseUrl: "https://26af-176-234-134-191.ngrok-free.app",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({}),
});
