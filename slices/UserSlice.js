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
    updateProfileImage: builder.mutation({
      query: (data) => {
        const { formData, userId } = data;

        console.log("data: ", data);
        //formData.append("imageFile", imageFile);
        console.log("userid12: ", userId);
        //console.log("imagefile - name ", imageFile["_parts"][0][1].name);
        return {
          url: `/api/User/${userId}/updateProfileImage`,
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            // Add any other headers if needed
          },
          body: formData,
        };
      },

      invalidatesTags: [],
    }),
    updateBackgroundImage: builder.mutation({
      query: (data) => {
        const { formData, userId } = data;
        return {
          url: `/api/User/${userId}/updateBackgroundImage`,
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        };
      },

      invalidatesTags: [],
    }),
    patchUser: builder.mutation({
      query: ({ userId, patchDoc }) => {
        console.log("userid", userId);
        console.log("patchDoc", patchDoc);
        return {
          url: `/api/User/PatchUser/${userId}`,
          method: "PATCH",
          body: patchDoc,
        };
      },

      invalidatesTags: [],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllUsersQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUserByIdQuery,
  useUpdateProfileImageMutation,
  useUpdateBackgroundImageMutation,
  usePatchUserMutation,
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
