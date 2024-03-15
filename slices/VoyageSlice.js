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
    createVoyage: builder.mutation({
      query: (data) => {
        const {
          formData,
          name,
          brief,
          description,
          vacancy,
          formattedStartDate,
          formattedEndDate,
          formattedLastBidDate,
          minPrice,
          maxPrice,
          isAuction,
          isFixedPrice,
          userId,
          vehicleId,
        } = data;

        const queryParams = new URLSearchParams({
          Name: name,
          Brief: brief,
          Description: description,
          Vacancy: vacancy,
          StartDate: formattedStartDate,
          EndDate: formattedEndDate,
          LastBidDate: formattedEndDate,
          MinPrice: minPrice,
          MaxPrice: maxPrice,
          Auction: isAuction.toString(), // Assuming isAuction is a boolean
          FixedPrice: isFixedPrice.toString(), // Assuming isFixedPrice is a boolean
          UserId: userId,
          VehicleId: vehicleId,
        });

        const url = `/api/Voyage/AddVoyage?${queryParams}`;

        return {
          url,
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        };
      },
      // ... other configuration options
    }),
    addVoyageImage: builder.mutation({
      query: (data) => {
        const { formData, voyageId } = data;
        const url = `/api/Voyage/${voyageId}/AddVoyageImage`;
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
    deleteVoyageImage: builder.mutation({
      query: (imageId) => ({
        url: `/api/Voyage/${imageId}/deleteVoyageImage`,
        method: "DELETE",
      }),
    }),
    sendBid: builder.mutation({
      query: (bidData) => {
        return {
          url: "/api/Bid/createBid",
          method: "POST",
          body: {
            ...bidData,
            dateTime: new Date().toISOString(),
          },
        };
      },
    }),
    changeBid: builder.mutation({
      query: (bidData) => {
        const { bidId, message, offerPrice, personCount } = bidData;
        const formattedBidData = {
          id: bidId,
          personCount,
          message,
          offerPrice,
        };

        return {
          url: "/api/Bid/changeBid",
          method: "POST",
          body: {
            ...formattedBidData,
            dateTime: new Date().toISOString(),
          },
        };
      },
    }),
    addWaypoint: builder.mutation({
      query: (data) => {
        const {
          formData,
          latitude,
          longitude,
          title,
          description,
          voyageId,
          order,
        } = data;

        const queryParams = new URLSearchParams({
          Latitude: latitude,
          Longitude: longitude,
          Title: title,
          Description: description,
          VoyageId: voyageId,
          Order: order,
        });

        const url = `/api/Waypoint/AddWaypoint?${queryParams}`;

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
  }),

  overrideExisting: true,
});

export const {
  useCreateVoyageMutation,
  useAddVoyageImageMutation,
  useAddWaypointMutation,
  useDeleteVoyageImageMutation,
  useGetVoyagesByUserByIdQuery,
  useGetVoyageByIdQuery,
  useSendBidMutation,
  useChangeBidMutation,
} = extendedApiSlice;
