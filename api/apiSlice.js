/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Generate a temporary device ID for rate limiting
const generateDeviceId = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  // Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};
const deviceId = generateDeviceId();

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: async (headers) => {
    headers.set("X-Device-Id", deviceId);
    headers.set("ngrok-skip-browser-warning", "1");
    const token = await AsyncStorage.getItem("storedToken");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// Shared refresh promise — prevents parallel token refresh races
let refreshPromise = null;

// Base query with token refresh logic and 8s timeout
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  api.signal?.addEventListener("abort", () => controller.abort());

  let result;
  try {
    result = await baseQuery(args, { ...api, signal: controller.signal }, extraOptions);
  } finally {
    clearTimeout(timeoutId);
  }

  // Handle expired access token
  if (result.error?.status === 401) {
    const refreshToken = await AsyncStorage.getItem("storedRefreshToken");
    if (!refreshToken) return result;

    // Coalesce parallel 401s into a single refresh call
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const refreshResult = await baseQuery(
            {
              url: "/api/account/refresh-token",
              method: "POST",
              body: { refreshToken },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            await AsyncStorage.setItem("storedToken", refreshResult.data.token);
            await AsyncStorage.setItem("storedRefreshToken", refreshResult.data.refreshToken);
            if (refreshResult.data.refreshTokenExpiryTime) {
              await AsyncStorage.setItem("storedRefreshTokenExpiryTime", refreshResult.data.refreshTokenExpiryTime);
            }
            return true;
          } else {
            await AsyncStorage.removeItem("storedToken");
            await AsyncStorage.removeItem("storedRefreshToken");
            await AsyncStorage.removeItem("storedRefreshTokenExpiryTime");
            api.dispatch({ type: "users/updateAsLoggedOut" });
            return false;
          }
        } finally {
          refreshPromise = null;
        }
      })();
    }

    const refreshed = await refreshPromise;
    if (refreshed) {
      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

// Create the API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Voyage", "Bookmarks"],
  endpoints: (builder) => ({}),
});


