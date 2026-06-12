import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, Image, View } from 'react-native';
import { ParrotsStdText } from './ParrotsStdText';
import { vh, vw } from 'react-native-expo-viewport-units';
import Constants from 'expo-constants';
import { useDispatch } from 'react-redux';
import { registerPushTokenAsync } from '../utils/registerPushToken';
import { updateAsLoggedIn, updateUserFavorites, setBookmarkedUserIds } from '../slices/UserSlice';
import gooogleSignin from "../assets/googleg.png";

const isExpoGo = Constants.appOwnership === "expo";
const GoogleSignin = isExpoGo ? null : require('@react-native-google-signin/google-signin').GoogleSignin;
const useGoogleLoginInternalMutation = isExpoGo ? () => [null, { isLoading: false }] : require('../slices/UserSlice').useGoogleLoginInternalMutation;

function ButtonContent({ isLoading }) {
  return isLoading ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Image source={gooogleSignin} style={{ height: 30, width: 30 }} />
      <ParrotsStdText style={styles.text}>Sign in with Google</ParrotsStdText>
    </View>
  );
}

export default function GoogleLoginButton() {
  const [googleLoginInternal, { isLoading }] = useGoogleLoginInternalMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isExpoGo) {
      GoogleSignin.configure({
        webClientId: "938579686654-cbtphp6rl5eu4gdlh1002s8ttj1hqpat.apps.googleusercontent.com",
        iosClientId: "938579686654-ol0d3lf5omaubr3j91l7t0dgbhfbr6mo.apps.googleusercontent.com",
        offlineAccess: true,
      });
    }
  }, []);

  const handleSignIn = async () => {
    if (isExpoGo) return;
    try {
      await GoogleSignin.hasPlayServices();
      try { await GoogleSignin.signOut(); } catch (e) {}
      await GoogleSignin.signIn();
      const { accessToken } = await GoogleSignin.getTokens();
      if (accessToken) {
        const res = await googleLoginInternal(accessToken).unwrap();
        await dispatch(updateAsLoggedIn({
          userId: res.userId,
          userName: res.userName,
          profileImageUrl: res.profileImageUrl,
          profileImageThumbnailUrl: res.profileImageThumbnailUrl || "",
          token: res.token,
          refreshToken: res.refreshToken,
          refreshTokenExpiryTime: res.refreshTokenExpiryTime,
          unreadMessages: res.unreadMessages,
          isAdmin: res.isAdmin,
          hasAcknowledgedPublicProfile: res.hasAcknowledgedPublicProfile ?? false,
        }));
        dispatch(updateUserFavorites({
          favoriteVehicles: res.favoriteVehicleIds || [],
          favoriteVoyages: res.favoriteVoyageIds || [],
        }));
        dispatch(setBookmarkedUserIds(res.bookmarkedUserIds || []));
        registerPushTokenAsync(res.token);
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
      <ButtonContent isLoading={isLoading} />
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
    paddingVertical: vh(0.25),
    borderRadius: vh(1.5),
    width: vw(65),
    minHeight: vh(4.5),
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
