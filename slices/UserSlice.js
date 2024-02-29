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
    token: "",
  },
  reducers: {
    updateAsLoggedIn: (state, action) => {
      console.log("----------");
      console.log("action.payload.userId:", action.payload.userId);
      console.log("action.payload.token:", action.payload.token);
      state.isLoggedIn = true;
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      AsyncStorage.setItem("storedToken", action.payload.token).catch(
        (error) => {
          console.error("Error setting storedToken ", error);
        }
      );
      AsyncStorage.setItem("storedUserId", action.payload.userId).catch(
        (error) => {
          console.error("Error setting storedUserId:", error);
        }
      );
    },
    updateAsLoggedOut: (state) => {
      console.log("----------");
      console.log("from reducer: UpdateAsLoggedOut");
      state.isLoggedIn = false;
      state.userId = "";
      state.token = "";
      AsyncStorage.removeItem("storedToken").catch((error) => {
        console.error("Error clearing AsyncStorage storedToken:", error);
      });
      AsyncStorage.removeItem("storedUserId").catch((error) => {
        console.error("Error clearing AsyncStorage storedUserId:", error);
      });
    },
    updateStateFromLocalStorage: (state, action) => {
      const { token, userId } = action.payload;
      console.log("userId -->", userId);
      state.userId = userId;
      state.token = token;
      state.isLoggedIn = true;
    },
  },
});

export const {
  updateAsLoggedIn,
  updateAsLoggedOut,
  updateStateFromLocalStorage,
} = usersSlice.actions;

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
