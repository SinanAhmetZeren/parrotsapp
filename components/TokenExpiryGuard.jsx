// components/TokenExpiryGuard.js
import React, { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { updateAsLoggedOut } from "../slices/UserSlice";

export const TokenExpiryGuard = () => {
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      const checkTokenExpiry = async () => {
        const expiry = await AsyncStorage.getItem(
          "storedRefreshTokenExpiryTime"
        );

        if (!expiry) {
          dispatch(updateAsLoggedOut());
          return;
        }

        const expiryTime = new Date(expiry).getTime();
        const now = Date.now();

        if (now > expiryTime) {
          console.log("Token expired. Logging out...");
          dispatch(updateAsLoggedOut());
        }
      };

      checkTokenExpiry();
    }, [dispatch])
  );

  return;
};
