/* eslint-disable no-unused-vars */
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    isLoggedIn: false,
    userId: "",
  },
  reducers: {
    updateAsLoggedIn: (state, action) => {
      state.isLoggedIn = true;
      state.userId = action.payload;
    },
    updateAsLoggedOut: (state) => {
      state.isLoggedIn = false;
    },
  },
});

export const { updateAsLoggedIn, updateAsLoggedOut } = usersSlice.actions;

export default usersSlice.reducer;

// -------------- USER API
const usersAdapter = createEntityAdapter({});
const initialState = usersAdapter.getInitialState({});
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
      onSuccess: async (result, variables, api, store) => {
        const userToken = result.data?.token;
        if (userToken) {
          await AsyncStorage.setItem("userToken", userToken);
          console.log("Token stored successfully!");
        }
      },
    }),
    loginUser: builder.mutation({
      query: (userData) => ({
        url: "/api/account/login",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
      onSuccess: async (result, variables, api, store) => {
        const userToken = result.data?.token;
        console.log("token from loginUser mutation ", userToken);
        if (userToken) {
          await AsyncStorage.setItem("userToken", userToken);
          console.log("Token stored successfully!");
        }
      },
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
