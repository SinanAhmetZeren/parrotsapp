/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@env";

export const apiSlice = createApi({
  reducerPath: "api", // optional
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  tagTypes: ["User", "Voyage"],
  endpoints: (builder) => ({}),
});

// ngrok http --domain=measured-wolf-grossly.ngrok-free.app https://localhost:7151
