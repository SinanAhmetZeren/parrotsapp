/* eslint-disable no-unused-vars */
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => "api/user/getAllUsers",
      transformResponse: (responseData) => {
        console.log("hello");
        console.log(responseData["data"]);
        const normalizedData = usersAdapter.getInitialState({
          entities: responseData["data"].reduce((entities, user) => {
            entities[user.id] = user;
            return entities;
          }, {}),
          ids: responseData.map((user) => user.id),
        });
        return usersAdapter.setAll(initialState, normalizedData);
      },
      providesTags: (result, error, arg) => [
        { type: "User", id: "LIST" },
        ...result.ids.map((id) => ({ type: "User", id })),
      ],
    }),
  }),
});

export const { useGetAllUsersQuery } = extendedApiSlice;

export const selectUsersResult =
  extendedApiSlice.endpoints.getAllUsers.select();

export const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data
);

export const {
  selectAll: selectAllUsers,
  selectById: selectUsersById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
);
