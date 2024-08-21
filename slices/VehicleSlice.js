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
        const { formData, name, description, userId, capacity, vehicleType } =
          data;
        const queryParams = new URLSearchParams({
          Name: name,
          Description: description,
          UserId: userId,
          Capacity: capacity,
          Type: vehicleType,
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
    checkAndDeleteVehicle: builder.mutation({
      query: (vehicleId) => ({
        url: `/api/Vehicle/checkAndDeleteVehicle/${vehicleId}`,
        method: "DELETE",
      }),
    }),
    updateVehicleProfileImage: builder.mutation({
      query: (data) => {
        const { formData, vehicleId } = data;
        const url = `/api/Vehicle/${vehicleId}/updateProfileImage`;
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
    addVehicleToFavorites: builder.mutation({
      query: (data) => {
        const { userId, vehicleId } = data;

        const body = {
          userId: userId,
          type: "vehicle",
          itemId: vehicleId,
        };
        const url = `/api/Favorite/addFavorite`;
        return {
          url,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        };
      },
    }),
    deleteVehicleFromFavorites: builder.mutation({
      query: (data) => {
        const { userId, vehicleId } = data;
        return {
          url: `/api/Favorite/deleteFavoriteVehicle/${userId}/${vehicleId}`,
          method: "DELETE",
        };
      },
    }),
    patchVehicle: builder.mutation({
      query: ({ currentVehicleId, patchDoc }) => {
        return {
          url: `/api/Vehicle/PatchVehicle/${currentVehicleId}`,
          method: "PATCH",
          body: patchDoc,
        };
      },
    }),
    getVehicleImagesByVehicleId: builder.query({
      query: (vehicleId) =>
        `/api/Vehicle/GetVehiclesImagesByVehicleId/${vehicleId}`,
      transformResponse: (responseData) => {
        return responseData.data;
      },
    }),
    deleteVehicle: builder.mutation({
      query: (vehicleId) => ({
        url: `/api/Vehicle/deleteVehicle/${vehicleId}`,
        method: "DELETE",
      }),
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetVehiclesByUserByIdQuery,
  useGetVehicleByIdQuery,
  useCreateVehicleMutation,
  useAddVehicleImageMutation,
  useUpdateVehicleProfileImageMutation,
  useDeleteVehicleImageMutation,
  useCheckAndDeleteVehicleMutation,
  useGetFavoriteVehiclesByUserByIdQuery,
  useAddVehicleToFavoritesMutation,
  useDeleteVehicleFromFavoritesMutation,
  usePatchVehicleMutation,
  useGetVehicleImagesByVehicleIdQuery,
  useDeleteVehicleMutation,
} = extendedApiSlice;
