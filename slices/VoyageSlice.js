/* eslint-disable no-unused-vars */
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const voyagesAdapter = createEntityAdapter({});

const initialState = voyagesAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVoyagesByUserById: builder.query({
      query: (userId) => `/api/Voyage/GetVoyageByUserId/${userId}`,
      transformResponse: (responseData) => {
        return responseData.data;
      },
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }),
    providesTags: (result, error, arg) => [
      ...result.ids.map((id) => ({ type: "Voyage", id })),
    ],
    getVoyageById: builder.query({
      query: (voyageId) => `/api/Voyage/GetVoyageById/${voyageId}`,
      transformResponse: (responseData) => {
        return responseData.data;
      },
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }),
  }),

  overrideExisting: true,
});

export const { useGetVoyagesByUserByIdQuery, useGetVoyageByIdQuery } =
  extendedApiSlice;

// export const selectVoyagesResult =
//   extendedApiSlice.endpoints.getAllVoyages.select();

// export const selectVoyagesData = createSelector(
//   selectVoyagesResult,
//   (voyageResult) => voyageResult.data
// );

// export const {
//   selectAll: selectAllVoyages,
//   selectById: selectVoyageById,
//   selectIds: selectVoyageIds,
// } = voyagesAdapter.getSelectors(
//   (state) => selectVoyagesData(state) ?? initialState
// );
