import { apiSlice } from "../api/apiSlice";

export const versionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMinVersion: builder.query({
      query: () => "/api/version",
    }),
  }),
});

export const { useGetMinVersionQuery } = versionApiSlice;
