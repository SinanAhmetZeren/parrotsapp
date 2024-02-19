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
        const newState = usersAdapter.setAll({}, data);
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
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/api/account/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    loginUser: builder.mutation({
      query: (userData) => ({
        url: "/api/account/login",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    getUserById: builder.query({
      query: (userId) => `/api/User/getUserById/${userId}`,
      transformResponse: (responseData) => responseData.data,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllUsersQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUserByIdQuery,
} = extendedApiSlice;

export const selectUsersResult =
  extendedApiSlice.endpoints.getAllUsers.select();

export const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data
);

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
);
