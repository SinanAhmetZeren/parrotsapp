/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api", // optional
  baseQuery: fetchBaseQuery({
    baseUrl: "https://measured-wolf-grossly.ngrok-free.app",
  }),
  tagTypes: ["User", "Voyage"],
  endpoints: (builder) => ({}),
});

// ngrok http --domain=measured-wolf-grossly.ngrok-free.app https://localhost:7151
