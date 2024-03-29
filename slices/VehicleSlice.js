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
    getVehicleById: builder.query({
      query: (vehicleId) => `/api/Vehicle/GetVehicleById/${vehicleId}`,
      transformResponse: (responseData) => {
        return responseData.data;
      },
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }),
    createVehicle: builder.mutation({
      query: (data) => {
        const { formData, name, description, userId, capacity } = data;
        const queryParams = new URLSearchParams({
          Name: name,
          Description: description,
          UserId: userId,
          Capacity: capacity,
        });
        const url = `/api/Vehicle/AddVehicle?${queryParams}`;

        return {
          url,
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        };
      },
    }),
    addVehicleImage: builder.mutation({
      query: (data) => {
        const { formData, vehicleId } = data;
        const url = `/api/Vehicle/${vehicleId}/AddVehicleImage`;
        return {
          url,
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        };
      },
    }),
    deleteVehicleImage: builder.mutation({
      query: (imageId) => ({
        url: `/api/Vehicle/deleteVehicleImage/${imageId}`,
        method: "DELETE",
      }),
    }),
    getFavoriteVehiclesByUserById: builder.query({
      query: (userId) => `/api/Favorite/getFavoriteVehiclesByUserId/${userId}`,
      transformResponse: (responseData) => {
        return responseData.data;
      },
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetVehiclesByUserByIdQuery,
  useGetVehicleByIdQuery,
  useCreateVehicleMutation,
  useAddVehicleImageMutation,
  useDeleteVehicleImageMutation,
  useGetFavoriteVehiclesByUserByIdQuery,
} = extendedApiSlice;
