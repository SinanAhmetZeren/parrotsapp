import { apiSlice } from "../api/apiSlice";

export const extendedAiApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    askParrots: builder.mutation({
      query: (body) => ({
        url: "/api/Ai/ask",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useAskParrotsMutation } = extendedAiApiSlice;
