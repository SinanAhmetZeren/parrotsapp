
// iosClientId: "938579686654-3l1dc47s6i61d0s2qif1cvajh3fnfkvq.apps.googleusercontent.com",
// androidClientId: "938579686654-kepneq1uk9lk4ac58t715qi282jf8c5f.apps.googleusercontent.com",
//webClientId: "938579686654-cbtphp6rl5eu4gdlh1002s8ttj1hqpat.apps.googleusercontent.com",


import { useEffect } from 'react'; // Added React import
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native'; // Added Text and ActivityIndicator
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useGoogleLoginInternalMutation } from "../slices/UserSlice";

export default function GoogleLoginButton() {
  const [googleLoginInternal, { isLoading }] = useGoogleLoginInternalMutation();

  useEffect(() => {
    GoogleSignin.configure({
      // Ensure this is your WEB Client ID from Google Console
      webClientId: "938579686654-cbtphp6rl5eu4gdlh1002s8ttj1hqpat.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);

  const handleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      // In latest versions, it's response.data
      const response = await GoogleSignin.signIn();

      // For your backend, you usually want the idToken or the accessToken
      // If your backend uses 'access_token' endpoint, use accessToken.
      const token = response.data?.idToken || response.data?.accessToken;

      if (token) {
        await googleLoginInternal(token).unwrap();
        console.log("Login Success");
      } else {
        console.error("No token received from Google");
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