/* eslint-disable no-unused-vars */
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => "/api/user/getAllUsers",
      transformResponse: (responseData) => {
        const { data } = responseData;
        //return usersAdapter.setAll({}, data);
        const newState = usersAdapter.setAll({}, data);
        /*
        Object.keys(newState.entities).forEach((id) => {
          console.log(
            `ID: ${id}` + "ENTITY: " + newState.entities[id].userName
          );
        });
        let str1 = "c809e7c0-6e57-40eb-99e7-9e7ab2e9a17e";
        console.log(newState.entities[str1].userName);*/
        return newState;
      },
      providesTags: (result, error, arg) => {
        const userTags = result.data?.ids ?? [];
        return [
          { type: "User", id: "LIST" },
          ...userTags.map((id) => ({ type: "User", id })),
        ];
      },
    }),
  }),
  overrideExisting: true,
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
