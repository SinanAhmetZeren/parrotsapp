import React from "react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Button, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { updateAsLoggedIn, updateUserFavorites } from "../slices/UserSlice";
import {
  useGoogleLoginInternalMutation,
  useLazyGetFavoriteVoyageIdsByUserIdQuery,
  useLazyGetFavoriteVehicleIdsByUserIdQuery,
} from "../slices/UserSlice";



WebBrowser.maybeCompleteAuthSession();

export default function GoogleLoginButton() {
  const dispatch = useDispatch();
  const [googleLoginInternal] = useGoogleLoginInternalMutation();
  const [getFavoriteVehicles] = useLazyGetFavoriteVehicleIdsByUserIdQuery();
  const [getFavoriteVoyages] = useLazyGetFavoriteVoyageIdsByUserIdQuery();

  const redirectUri = "https://auth.expo.io/@ahmetzeren/parrots";

  console.log("Redirect URI:", redirectUri);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "938579686654-kepneq1uk9lk4ac58t715qi282jf8c5f.apps.googleusercontent.com",
    webClientId: "938579686654-cbtphp6rl5eu4gdlh1002s8ttj1hqpat.apps.googleusercontent.com",
    redirectUri: redirectUri,
    useProxy: true,
  });


  useEffect(() => {
    const handleGoogleLogin = async () => {
      if (response?.type === "success") {
        const accessToken = response.authentication.accessToken;

        try {
          const res = await googleLoginInternal(accessToken).unwrap();

          const favoriteVehicles = await getFavoriteVehicles(
            res.userId
          ).unwrap();
          const favoriteVoyages = await getFavoriteVoyages(res.userId).unwrap();

          dispatch(
            updateUserFavorites({
              favoriteVehicles,
              favoriteVoyages,
            })
          );

          dispatch(
            updateAsLoggedIn({
              userId: res.userId,
              token: res.token,
              refreshToken: res.refreshToken,
              userName: res.userName,
              profileImageUrl: res.profileImageUrl,
            })
          );
        } catch (error) {
          Alert.alert("Login failed", error.message || "Internal error");
          console.error(error);
        }
      }
    };

    handleGoogleLogin();
  }, [response]);

  return (
    <Button
      title="Sign in with Google"
      onPress={() => promptAsync()}
      disabled={!request}
    />
  );
}
