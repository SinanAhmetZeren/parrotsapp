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

// Base query with token refresh logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle expired access token
  if (result.error?.status === 401) {
    const refreshToken = await AsyncStorage.getItem("storedRefreshToken");
    if (!refreshToken) return result;

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
      // Save new tokens
      await AsyncStorage.setItem("storedToken", refreshResult.data.token);
      await AsyncStorage.setItem("storedRefreshToken", refreshResult.data.refreshToken);

      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Failed refresh → remove stored tokens
      await AsyncStorage.removeItem("storedToken");
      await AsyncStorage.removeItem("storedRefreshToken");
    }
  }

  return result;
};

// Create the API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Voyage"],
  endpoints: (builder) => ({}),
});







/* eslint-disable no-unused-vars rom "@reduxjs/toolkit/query/react";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const generateDeviceId = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  // Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};
const deviceId = generateDeviceId(); // temporary device ID - for rate limiting purposes
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: async (headers) => {
    headers.set("ngrok-skip-browser-warning", "1");
    headers.set("X-Device-Id", deviceId);
    const token = await AsyncStorage.getItem("storedToken");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshToken = await AsyncStorage.getItem("storedRefreshToken");
    if (!refreshToken) {
      return result;
    }
    const refreshResult = await baseQuery(
      {
        url: "/api/account/refresh-token",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions
    );
    console.log("Refresh result:", refreshResult);
    if (refreshResult.data) {
      AsyncStorage.setItem("storedToken", refreshResult.data.token);
      AsyncStorage.setItem(
        "storedRefreshToken",
        refreshResult.data.refreshToken
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      AsyncStorage.removeItem("storedToken");
      AsyncStorage.removeItem("storedRefreshToken");
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Voyage"],
  endpoints: (builder) => ({}),
});

/* eslint-disable no-unused-vars */

/* Simple baseQuery without any auth
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    headers.set("ngrok-skip-browser-warning", "1");
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["User", "Voyage"],
  endpoints: (builder) => ({}),
});
*/
