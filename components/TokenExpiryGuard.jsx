// components/TokenExpiryGuard.js
import React, { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { updateAsLoggedOut } from "../slices/UserSlice";
import Toast from "react-native-toast-message";

export const TokenExpiryGuard = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.users.isLoggedIn);

  useFocusEffect(
    useCallback(() => {
      const checkTokenExpiry = async () => {
        const expiry = await AsyncStorage.getItem(
          "storedRefreshTokenExpiryTime"
        );

        if (!expiry) {
          if (isLoggedIn) {
            Toast.show({
              type: "error",
              text1: "Session expired",
              text2: "Please log in again.",
              autoHide: true,
              visibilityTime: 3000,
            });
            dispatch(updateAsLoggedOut());
          }
          return;
        }

        const expiryTime = new Date(expiry).getTime();
        const now = Date.now();

        if (now > expiryTime) {
          Toast.show({
            type: "error",
            text1: "Session expired",
            text2: "Please log in again.",
            autoHide: true,
            visibilityTime: 3000,
          });
          dispatch(updateAsLoggedOut());
        }
      };

      checkTokenExpiry();
    }, [dispatch, isLoggedIn])
  );

  return;
};
