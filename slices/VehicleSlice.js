/* eslint-disable no-unused-vars */
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const vehiclesAdapter = createEntityAdapter({});

const initialState = vehiclesAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVehiclesByUserById: builder.query({
      query: (userId) => `/api/Vehicle/GetVehiclesByUserId/${userId}`,
      transformResponse: (responseData) => {
        return responseData.data;
      },
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }),
    providesTags: (result, error, arg) => [
      ...result.ids.map((id) => ({ type: "Vehicle", id })),
    ],
  }),

  overrideExisting: true,
});

export const { useGetVehiclesByUserByIdQuery } = extendedApiSlice;

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
