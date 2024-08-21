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
    userName: "",
    userProfileImage: "",
    userFavoriteVoyages: [0],
    userFavoriteVehicles: [0],
  },
  reducers: {
    updateAsLoggedIn: (state, action) => {
      state.isLoggedIn = true;
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.userName = action.payload.userName;
      state.userProfileImage = action.payload.profileImageUrl;
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
      AsyncStorage.setItem("storedUserName", action.payload.userName).catch(
        (error) => {
          console.error("Error setting storedUserName:", error);
        }
      );
      AsyncStorage.setItem(
        "storedProfileImageUrl",
        action.payload.profileImageUrl
      ).catch((error) => {
        console.error("Error setting storedProfileImageUrl:", error);
      });
    },
    updateAsLoggedOut: (state) => {
      state.isLoggedIn = false;
      state.userId = "";
      state.token = "";
      state.userName = "";
      state.userProfileImage = "";
      AsyncStorage.removeItem("storedToken").catch((error) => {
        console.error("Error clearing AsyncStorage storedToken:", error);
      });
      AsyncStorage.removeItem("storedUserId").catch((error) => {
        console.error("Error clearing AsyncStorage storedUserId:", error);
      });
      AsyncStorage.removeItem("storedUserName").catch((error) => {
        console.error("Error clearing AsyncStorage storedUserName:", error);
      });
      AsyncStorage.removeItem("storedProfileImageUrl").catch((error) => {
        console.error(
          "Error clearing AsyncStorage storedProfileImageUrl:",
          error
        );
      });
    },
    updateStateFromLocalStorage: (state, action) => {
      const { token, userId, userName, profileImageUrl } = action.payload;

      state.userId = userId;
      state.token = token;
      state.userName = userName;
      state.userProfileImage = profileImageUrl;
      state.isLoggedIn = true;
    },
    updateUserData: (state, action) => {
      state.userProfileImage = action.payload.image;
    },
    updateUserName: (state, action) => {
      state.userName = action.payload.username;
    },
    updateUserFavorites: (state, action) => {
      state.userFavoriteVehicles = action.payload.favoriteVehicles;
      state.userFavoriteVoyages = action.payload.favoriteVoyages;
    },
    addVoyageToUserFavorites: (state, action) => {
      state.userFavoriteVoyages = [
        ...state.userFavoriteVoyages,
        action.payload.favoriteVoyage,
      ];
    },
    removeVoyageFromUserFavorites: (state, action) => {
      const voyageToRemove = action.payload.favoriteVoyage;
      state.userFavoriteVoyages = state.userFavoriteVoyages.filter(
        (voyage) => voyage !== voyageToRemove
      );
    },
    addVehicleToUserFavorites: (state, action) => {
      state.userFavoriteVehicles = [
        ...state.userFavoriteVehicles,
        action.payload.favoriteVehicle,
      ];
    },
    removeVehicleFromUserFavorites: (state, action) => {
      const vehicleToRemove = action.payload.favoriteVehicle;
      state.userFavoriteVehicles = state.userFavoriteVehicles.filter(
        (vehicle) => vehicle !== vehicleToRemove
      );
    },
  },
});

export const {
  updateAsLoggedIn,
  updateAsLoggedOut,
  updateStateFromLocalStorage,
  updateUserData,
  updateUserName,
  updateUserFavorites,
  addVoyageToUserFavorites,
  removeVoyageFromUserFavorites,
  addVehicleToUserFavorites,
  removeVehicleFromUserFavorites,
} = usersSlice.actions;

export default usersSlice.reducer;

// -------------- USER API
const usersAdapter = createEntityAdapter({});
const initialState = usersAdapter.getInitialState({});
export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsersByUsername: builder.query({
      query: (username) => {
        if (username) {
          return `/api/User/searchUsers/${username}`;
        } else {
          return "";
        }
      },
      transformResponse: (responseData) => responseData.data,
    }),
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/api/account/register",
        method: "POST",
        body: userData,
      }),
    }),
    confirmUser: builder.mutation({
      query: (confirmData) => ({
        url: "/api/account/confirmCode",
        method: "POST",
        body: confirmData,
      }),
    }),
    requestCode: builder.mutation({
      query: (email) => ({
        url: `/api/account/sendCode/${email}`,
        method: "POST",
      }),
    }),
    resetPassword: builder.mutation({
      query: (resetPasswordData) => ({
        url: `/api/account/resetPassword`,
        method: "POST",
        body: resetPasswordData,
      }),
    }),
    loginUser: builder.mutation({
      query: (userData) => ({
        url: "/api/account/login",
        method: "POST",
        body: userData,
      }),
    }),
    getUserById: builder.query({
      query: (userId) => {
        if (userId) {
          return `/api/User/getUserById/${userId}`;
        } else {
          return "";
        }
      },
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
    }),
    getFavoriteVoyageIdsByUserId: builder.query({
      query: (userId) => {
        if (userId) {
          return `/api/Favorite/getFavoriteVoyageIdsByUserId/${userId}`;
        } else {
          return "";
        }
      },
      transformResponse: (responseData) => responseData.data,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }),
    getFavoriteVehicleIdsByUserId: builder.query({
      query: (userId) => {
        if (userId) {
          return `/api/Favorite/getFavoriteVehicleIdsByUserId/${userId}`;
        } else {
          return "";
        }
      },
      transformResponse: (responseData) => responseData.data,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }),
  }),
  overrideExisting: true,
});
export const {
  useGetUsersByUsernameQuery,
  useGetFavoriteVoyageIdsByUserIdQuery,
  useGetFavoriteVehicleIdsByUserIdQuery,
  useRegisterUserMutation,
  useRequestCodeMutation,
  useConfirmUserMutation,
  useLoginUserMutation,
  useResetPasswordMutation,
  useGetUserByIdQuery,
  useUpdateProfileImageMutation,
  useUpdateBackgroundImageMutation,
  usePatchUserMutation,
} = extendedApiSlice;
