
// iosClientId: "938579686654-3l1dc47s6i61d0s2qif1cvajh3fnfkvq.apps.googleusercontent.com",
// androidClientId: "938579686654-kepneq1uk9lk4ac58t715qi282jf8c5f.apps.googleusercontent.com",
//webClientId: "938579686654-cbtphp6rl5eu4gdlh1002s8ttj1hqpat.apps.googleusercontent.com",


import { useEffect } from 'react'; // Added React import
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native'; // Added Text and ActivityIndicator
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useGoogleLoginInternalMutation } from "../slices/UserSlice";
import { useDispatch } from "react-redux";
import { updateAsLoggedIn } from "../slices/UserSlice";

export default function GoogleLoginButton() {
  const [googleLoginInternal, { isLoading }] = useGoogleLoginInternalMutation();

  useEffect(() => {
    GoogleSignin.configure({
      // Ensure this is your WEB Client ID from Google Console
      androidClientId: "938579686654-kepneq1uk9lk4ac58t715qi282jf8c5f.apps.googleusercontent.com",
      webClientId: "938579686654-cbtphp6rl5eu4gdlh1002s8ttj1hqpat.apps.googleusercontent.com",
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
        // Ignore error if no one was signed in
      }

      // 1. Initial Sign In to get the user context
      await GoogleSignin.signIn();

      // 2. Fetch the AccessToken explicitly (to match your backend tokeninfo check)
      const { accessToken } = await GoogleSignin.getTokens();

      console.log("Access Token for backend: ", accessToken);

      if (accessToken) {
        // 3. Send the accessToken to your google-login endpoint
        const res = await googleLoginInternal(accessToken).unwrap();
        console.log("Login Success");
        console.log("-->", res);


        await dispatch(
          updateAsLoggedIn({
            userId: res.userId,
            userName: res.userName,
            profileImageUrl: res.profileImageUrl,
            token: res.token,
            refreshToken: res.refreshToken,
            refreshTokenExpiryTime:
              res.refreshTokenExpiryTime,
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
        <Text style={styles.text}>Sign in with Google</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  disabled: {
    backgroundColor: '#a1c2fa',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});