import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, Image, View } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useGoogleLoginInternalMutation } from "../slices/UserSlice";
import { useDispatch } from "react-redux";
import { updateAsLoggedIn } from "../slices/UserSlice";
import { vh, vw } from 'react-native-expo-viewport-units';
import gooogleSignin from "../assets/googleg.png";

export default function GoogleLoginButton() {
  const [googleLoginInternal, { isLoading }] = useGoogleLoginInternalMutation();

  useEffect(() => {
    GoogleSignin.configure({
      // androidClientId: "938579686654-kepneq1uk9lk4ac58t715qi282jf8c5f.apps.googleusercontent.com",
      webClientId: "938579686654-cbtphp6rl5eu4gdlh1002s8ttj1hqpat.apps.googleusercontent.com",
      iosClientId: "938579686654-ol0d3lf5omaubr3j91l7t0dgbhfbr6mo.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);

  const dispatch = useDispatch();

  const handleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // ignore if no one was signed in
      }

      await GoogleSignin.signIn();

      const { accessToken } = await GoogleSignin.getTokens();

      if (accessToken) {
        const res = await googleLoginInternal(accessToken).unwrap();

        await dispatch(
          updateAsLoggedIn({
            userId: res.userId,
            userName: res.userName,
            profileImageUrl: res.profileImageUrl,
            profileImageThumbnailUrl: res.profileImageThumbnailUrl || "",
            token: res.token,
            refreshToken: res.refreshToken,
            refreshTokenExpiryTime: res.refreshTokenExpiryTime,
            unreadMessages: res.unreadMessages,
          })
        );
      } else {
        console.error("No Access Token received from Google");
      }
    } catch (error) {
      console.error("Native Sign-In Error:", error);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSignIn}
      disabled={isLoading}
      style={[styles.button, isLoading && styles.disabled]}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={gooogleSignin} style={{ height: 30, width: 30 }} />
          <Text style={styles.text}>Sign in with Google</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#f2f2f2",
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: vh(0.25),
    marginVertical: vh(0.25),
    paddingVertical: vh(1),
    borderRadius: vh(1.5),
    width: vw(65),
  },
  disabled: {
    backgroundColor: '#a1c2fa',
  },
  text: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "black",
    textAlign: "center",
    marginLeft: 10,
  },
});
