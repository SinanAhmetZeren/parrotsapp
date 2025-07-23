/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ngrok http --domain=measured-wolf-grossly.ngrok-free.app https://localhost:7151

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: async (headers) => {
    headers.set("ngrok-skip-browser-warning", "1");
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
