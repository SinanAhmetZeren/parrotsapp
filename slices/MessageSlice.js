/* eslint-disable no-unused-vars */
import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const messagesAdapter = createEntityAdapter({});

const initialState = messagesAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessagesByUserId: builder.query({
      query: (userId) => `/api/Message/getMessageByuserId/${userId}`,
      transformResponse: (responseData) => {
        return responseData.data;
      },
    }),
  }),

  overrideExisting: true,
});

export const { useGetMessagesByUserIdQuery } = extendedApiSlice;
