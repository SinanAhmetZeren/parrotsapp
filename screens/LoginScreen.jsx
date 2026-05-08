/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Button,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateAsLoggedIn } from "../slices/UserSlice";
import { vh, vw } from "react-native-expo-viewport-units";
import { Feather } from "@expo/vector-icons";
import {
  useRegisterUserMutation,
  useConfirmUserMutation,
  useLoginUserMutation,
  useAcceptTermsMutation,
  useRequestCodeMutation,
  useResetPasswordMutation,
  useLazyGetFavoriteVoyageIdsByUserIdQuery,
  useLazyGetFavoriteVehicleIdsByUserIdQuery,
  updateUserFavorites,
  useLazyGetBookmarkedUserIdsQuery,
  setBookmarkedUserIds,
} from "../slices/UserSlice";
import TermsOfUseComponent from "../components/TermsOfUseComponent";
import { TERMS_VERSION } from "../constants/TermsVersion";
// import GoogleLoginButton from "../components/GoogleAuthButton";
import GoogleLoginButton from "../components/GoogleAuthButtonDummy";
import { parrotBlue, parrotBlueMediumTransparent, parrotBlueSemiTransparent, parrotBlueSemiTransparent2, parrotBlueSemiTransparent3, parrotCream, parrotDarkBlue, parrotDarkCream, parrotGreenMediumTransparent, parrotGreenTransparent, parrotInputTextColor, parrotLightBlue, parrotLightCream, parrotPlaceholderGrey, parrotRed, parrotTextDarkBlue, parrotYellow } from "../assets/color";

// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";
// import * as AuthSession from "expo-auth-session";

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [isFocusedCode, setIsFocusedCode] = useState(false);
  const [isFocusedResetCode, setIsFocusedResetCode] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true);
  const [loginOrRegister, setLoginOrRegister] = useState("Login");
  const [loginUser, { isLoading, isSuccess }] = useLoginUserMutation();
  const [acceptTerms] = useAcceptTermsMutation();
  const [requiresTermsReAcceptance, setRequiresTermsReAcceptance] = useState(false);
  const [pendingLoginData, setPendingLoginData] = useState(null);
  const [requestCode] = useRequestCodeMutation();
  const [resetPassword] = useResetPasswordMutation();
  const [userNameR, setUserNameR] = useState("");
  const [emailR, setEmailR] = useState("");
  const [emailForgotPassword, setEmailForgotPassword] = useState("");
  const [passwordR, setPasswordR] = useState("");
  const [confirmPasswordR, setConfirmPasswordR] = useState("");
  const [registerCode, setRegisterCode] = useState("");
  const [resetPasswordCode, setResetPasswordCode] = useState("");
  const [isFocusedEmailR, setIsFocusedEmailR] = useState(false);
  const [isFocusedPasswordR, setIsFocusedPasswordR] = useState(false);
  const [isFocusedConfirmPasswordR, setIsFocusedConfirmPasswordR] = useState(false);
  const [isFocusedUserNameR, setIsFocusedUserNameR] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [
    registerUser,
    { isLoading: isLoadingRegisterUser, isSuccess: isSuccessRegisterUser },
  ] = useRegisterUserMutation();
  const [
    confirmUser,
    { isLoading: isLoadingConfirmUser, isSuccess: isSuccessConfirmUser },
  ] = useConfirmUserMutation();

  const [getFavoriteVehicleIdsByUserId] =
    useLazyGetFavoriteVehicleIdsByUserIdQuery();
  const [getFavoriteVoyageIdsByUserId] =
    useLazyGetFavoriteVoyageIdsByUserIdQuery();
  const [getBookmarkedUserIds] = useLazyGetBookmarkedUserIdsQuery();

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordHidden((prevState) => !prevState);
  };

  const togglePasswordVisibility2 = () => {
    setIsConfirmPasswordHidden((prevState) => !prevState);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleRegisterCodeChange = (text) => {
    setRegisterCode(text);
  };

  const handleRegisterCode2Change = (text) => {
    setResetPasswordCode(text);
  };

  const handleFocusAll = () => {
    setIsFocusedEmail(false);
    setIsFocusedEmailR(false);
    setIsFocusedCode(false);
    setIsFocusedResetCode(false);
    setIsFocusedPassword(false);
    setIsFocusedPasswordR(false);
    setIsFocusedConfirmPasswordR(false);
    setIsFocusedUserNameR(false);
  };

  const resetAllForms = () => {
    setUserNameR("");
    setEmailR("");
    setEmailForgotPassword("");
    setPasswordR("");
    setConfirmPasswordR("");
    setRegisterCode("");
    setResetPasswordCode("");
    setTermsAccepted(false);
    handleFocusAll();
  };

  const handleSendResetCode = async () => {
    requestCode(emailForgotPassword);
    setLoginOrRegister("ForgotPassword2");
  };

  const handleResetPassword = async () => {
    try {
      const resetPasswordResponse = await resetPassword({
        email: emailForgotPassword,
        password: passwordR,
        confirmationCode: resetPasswordCode,
      }).unwrap();
      console.log("resetpasswordresponse: --->>", resetPasswordResponse);

      setPasswordR("");
      setConfirmPasswordR("");
      setResetPasswordCode("");
      if (resetPasswordResponse.token) {
        await dispatch(
          updateAsLoggedIn({
            userId: resetPasswordResponse.userId,
            userName: resetPasswordResponse.userName,
            profileImageUrl: resetPasswordResponse.profileImageUrl,
            profileImageThumbnailUrl: resetPasswordResponse.profileImageThumbnailUrl || "",
            token: resetPasswordResponse.token,
            refreshToken: resetPasswordResponse.refreshToken,
            refreshTokenExpiryTime:
              resetPasswordResponse.refreshTokenExpiryTime,
            unreadMessages: resetPasswordResponse.unreadMessages,
            hasAcknowledgedPublicProfile: resetPasswordResponse.hasAcknowledgedPublicProfile ?? false,
          })
        );
      }
    } catch (err) {
      showToast("Could not log in - Please check your credentials.");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      setIsLoggingIn(true);
      // Use await inside try-catch with unwrap() for handling rejected promises
      const loginResponse = await loginUser({
        Email: email,
        Password: password,
      }).unwrap();

      // Ensure token and userId exist before proceeding
      if (!loginResponse?.token || !loginResponse?.userId) {
        throw new Error("Invalid login response");
      }

      // // Store tokens securely
      // await AsyncStorage.setItem("storedToken", loginResponse.token);
      // await AsyncStorage.setItem(
      //   "storedRefreshToken",
      //   loginResponse.refreshToken
      // );

      let favoriteVehicles = [];
      let favoriteVoyages = [];

      try {
        // Fetch favorites safely, fall back to empty arrays if request fails
        const vehiclesRes = await getFavoriteVehicleIdsByUserId(
          loginResponse.userId
        ).unwrap();
        favoriteVehicles = vehiclesRes?.data || [];
        console.log("Favorite Vehicles:", favoriteVehicles);
      } catch (vehicleErr) {
        console.warn("Failed to fetch favorite vehicles:", vehicleErr);
      }

      try {
        const voyagesRes = await getFavoriteVoyageIdsByUserId(
          loginResponse.userId
        ).unwrap();
        console.log("Favorite Voyages Response:", voyagesRes);
        favoriteVoyages = voyagesRes?.data || [];
      } catch (voyageErr) {
        console.warn("Failed to fetch favorite voyages:", voyageErr);
      }

      // Update Redux state
      dispatch(
        updateUserFavorites({
          favoriteVehicles,
          favoriteVoyages,
        })
      );

      try {
        const bookmarkedIds = await getBookmarkedUserIds().unwrap();
        dispatch(setBookmarkedUserIds(bookmarkedIds || []));
      } catch {
        // non-critical, silently ignore
      }

      // console.log("login response - unread: ", loginResponse.unreadMessages);
      // Dispatch login state only if token is present
      // if (false)
      if (loginResponse.requiresTermsAcceptance) {
        setPendingLoginData(loginResponse);
        setRequiresTermsReAcceptance(true);
        setIsLoggingIn(false);
        return;
      }

      dispatch(
        updateAsLoggedIn({
          userId: loginResponse.userId,
          userName: loginResponse.userName || "",
          profileImageUrl: loginResponse.profileImageUrl || "",
          profileImageThumbnailUrl: loginResponse.profileImageThumbnailUrl || "",
          token: loginResponse.token,
          refreshToken: loginResponse.refreshToken,
          refreshTokenExpiryTime: loginResponse.refreshTokenExpiryTime,
          unreadMessages: loginResponse.unreadMessages,
          hasAcknowledgedPublicProfile: loginResponse.hasAcknowledgedPublicProfile ?? false,
        })
      );

      // Reset inputs
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Login error:", err);
      setIsLoggingIn(false);

      // Handle common HTTP errors, else show generic error
      if (err?.status === 401) {
        showToast("Could not log in - Incorrect email or password.");
      } else {
        showToast(`Login failed - ${err?.message || "Something went wrong. Please try again."}`);
      }
    } finally {
      setIsLoggingIn(false); // Always reset loading state
    }
  };

  const handleAcceptUpdatedTerms = async () => {
    try {
      await acceptTerms().unwrap();
      dispatch(
        updateAsLoggedIn({
          userId: pendingLoginData.userId,
          userName: pendingLoginData.userName || "",
          profileImageUrl: pendingLoginData.profileImageUrl || "",
          profileImageThumbnailUrl: pendingLoginData.profileImageThumbnailUrl || "",
          token: pendingLoginData.token,
          refreshToken: pendingLoginData.refreshToken,
          refreshTokenExpiryTime: pendingLoginData.refreshTokenExpiryTime,
          unreadMessages: pendingLoginData.unreadMessages,
          hasAcknowledgedPublicProfile: pendingLoginData.hasAcknowledgedPublicProfile ?? false,
        })
      );
      setRequiresTermsReAcceptance(false);
      setPendingLoginData(null);
      setEmail("");
      setPassword("");
    } catch (err) {
      showToast("Failed to accept terms. Please try again.");
    }
  };

  const handleRegister = async () => {
    try {
      const registerResponse = await registerUser({
        Email: emailR,
        UserName: userNameR,
        Password: passwordR,
        TermsVersion: TERMS_VERSION,
      }).unwrap();

      setUserNameR("");
      setPasswordR("");
      setConfirmPasswordR("");

      // if registration response is 200
      // go to Registration-2

      // if ConfirmCode returns token etc
      // then updateasLoggedIn

      if (registerResponse.token) {
        resetAllForms();
        setLoginOrRegister("Register2");
        /*
        await dispatch(
          updateAsLoggedIn({
            userId: registerResponse.userId,
            token: registerResponse.token,
            userName: registerResponse.userName,
            profileImageUrl: registerResponse.profileImageUrl,
          })
        );
        */
      }
    } catch (err) {
      console.log(err);
      showToast("Could not register - Please try again.");
    }
  };

  const handleConfirm = async () => {
    try {
      const confirmResponse = await confirmUser({
        email: emailR,
        code: registerCode,
      }).unwrap();

      setRegisterCode("");
      setEmailR("");

      if (confirmResponse.token) {
        resetAllForms();
        setLoginOrRegister("Login");

        await dispatch(
          updateAsLoggedIn({
            userId: confirmResponse.userId,
            userName: confirmResponse.userName,
            profileImageUrl: confirmResponse.profileImageUrl,
            profileImageThumbnailUrl: confirmResponse.profileImageThumbnailUrl || "",
            token: confirmResponse.token,
            refreshToken: confirmResponse.refreshToken,
            refreshTokenExpiryTime: confirmResponse.refreshTokenExpiryTime,
            unreadMessages: confirmResponse.unreadMessages,
            hasAcknowledgedPublicProfile: confirmResponse.hasAcknowledgedPublicProfile ?? false,
          })
        );
      }
    } catch (err) {
      console.log(err);
      showToast("Could not confirm - Please try again.");
    }
  };

  const handleEmailRChange = (text) => {
    setEmailR(text);
  };
  const handleUserNameRChange = (text) => {
    setUserNameR(text);
  };
  const handlePasswordRChange = (text) => {
    setPasswordR(text);
  };
  const handlePasswordR2Change = (text) => {
    setConfirmPasswordR(text);
  };

  const username = useSelector((state) => state.users.userName);

  const logAllAsyncStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);

      console.log("📦 AsyncStorage contents:");
      result.forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
    } catch (e) {
      console.error("Failed to load AsyncStorage data", e);
    }
  };

  /*    HARD LOGOUT  */
  useEffect(() => {
    logAllAsyncStorage();
    return;
  }, []);

  if (requiresTermsReAcceptance) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Modal visible={true} animationType="slide">
          <View style={{ flex: 1, padding: 20, paddingTop: 60 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#003580", marginBottom: 12, textAlign: "center" }}>
              Our Terms of Use have been updated
            </Text>
            <Text style={{ fontSize: 14, color: "#555", marginBottom: 16, textAlign: "center" }}>
              Please read and accept the updated Terms of Use to continue using Parrots.
            </Text>
            <ScrollView style={{ flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 16 }}>
              <TermsOfUseComponent />
            </ScrollView>
            <TouchableOpacity
              onPress={handleAcceptUpdatedTerms}
              style={{ backgroundColor: "#007bff", borderRadius: 8, padding: 14, alignItems: "center", marginBottom: 10 }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>I Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setRequiresTermsReAcceptance(false); setPendingLoginData(null); }}
              style={{ alignItems: "center", padding: 10 }}
            >
              <Text style={{ color: "#999", fontSize: 14 }}>Decline and go back</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <ImageBackground source={require("../assets/seafromsky.jpg")} style={{ flex: 1, paddingTop: vh(4) }}
      resizeMode="cover" imageStyle={{ left: 0 }}>
      {toastVisible && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
      {loginOrRegister === "Login" ? (
        <>
          <View style={{
            marginHorizontal: vw(4), marginTop: vh(6), borderRadius: vh(2),
            backgroundColor: "rgba(255,255,255,0.3)", paddingTop: vh(2), paddingBottom: vh(4)
          }}>

            {/* Logo card */}
            <View style={styles.logoCard}>
              <View style={styles.imagecontainer}>
                <LoginPageLogoComponent />
                <Image
                  style={styles.image}
                  source={require("../assets/welcome.png")}
                />
              </View>
            </View>

            {/* Login card */}
            <View style={[styles.container, { flex: 0 }]}>
              <View style={styles.formContainer}>
                <View style={styles.loginCard}>
                  <View style={styles.inputsContainer}>
                    <TextInput
                      onFocus={() => setIsFocusedEmail(true)}
                      onBlur={() => setIsFocusedEmail(false)}
                      style={[styles.input, isFocusedEmail && styles.inputFocused]}
                      placeholder="Email"
                      placeholderTextColor={parrotPlaceholderGrey}
                      value={email}
                      onChangeText={(text) => handleEmailChange(text)}
                    />
                    <View>
                      <TextInput
                        style={[styles.input, isFocusedPassword && styles.inputFocused]}
                        onFocus={() => setIsFocusedPassword(true)}
                        onBlur={() => setIsFocusedPassword(false)}
                        placeholder="Password"
                        placeholderTextColor={parrotPlaceholderGrey}
                        secureTextEntry={isPasswordHidden}
                        value={password}
                        onChangeText={(text) => handlePasswordChange(text)}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPressIn={() => togglePasswordVisibility()}
                      >
                        <Text>
                          <Feather name="eye" size={24} color={parrotPlaceholderGrey} />
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.forgotPassword}
                    onPress={() => {
                      resetAllForms();
                      setLoginOrRegister("ForgotPassword");
                    }}
                  >
                    <Text style={{ fontFamily: "Nunito_600SemiBold", color: parrotPlaceholderGrey }}>
                      Forgot password?
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.loginContainer}>
                    <TouchableOpacity
                      style={styles.selection2}
                      onPress={handleLogin}
                      disabled={isLoading || isLoggingIn}
                    >
                      {isLoading || isLoggingIn
                        ? <ActivityIndicator color="white" />
                        : <Text style={styles.choiceText}>Login</Text>
                      }
                    </TouchableOpacity>
                  </View>

                  <View style={{ ...styles.loginContainer, display: "none" }}>
                    <TouchableOpacity
                      style={styles.selection2}
                      onPress={logAllAsyncStorage}
                      disabled={isLoading}
                    >
                      <Text style={styles.choiceText}>print</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.noAccount}
                    onPress={() => {
                      resetAllForms();
                      setLoginOrRegister("Register1");
                    }}
                  >
                    <Text style={{ fontFamily: "Nunito_600SemiBold", color: parrotPlaceholderGrey }}>
                      Don't have an account?{" "}
                    </Text>
                    <Text style={{ fontFamily: "Nunito_700Bold", color: parrotPlaceholderGrey }}>
                      Sign up
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Google card */}
                <View style={styles.googleCard}>
                  <GoogleLoginButton />
                </View>

              </View>
            </View>

          </View>
        </>
      ) : loginOrRegister === "Register1" ? (
        // register screen - 1
        <>
          <View style={{ marginHorizontal: vw(4), marginTop: vh(6), borderRadius: vh(2), backgroundColor: "rgba(255,255,255,0.3)", paddingTop: vh(2), paddingBottom: vh(4) }}>
            <View style={styles.logoCard}>
              <View style={styles.imagecontainer}>
                <View style={{ marginTop: vh(1) }}>
                  <LoginPageLogoComponent />
                </View>
                <Image
                  style={styles.imageLetsStart}
                  source={require("../assets/letsstart.png")}
                />
              </View>
            </View>
            <View style={[registrationSuccessStyles.container, { backgroundColor: "transparent" }]}>
              {/* {isSuccessRegisterUser ? (
            <Text style={registrationSuccessStyles.successMessage}>Registration successful!</Text>
          ) : ( */}
              <View style={registrationSuccessStyles.formContainer}>
                {isFocusedUserNameR && (
                  <View style={[registrationSuccessStyles.usernameToast, { top: -98 }]}>
                    {[
                      { label: "At least 3 characters", ok: userNameR.length >= 3 },
                      { label: "Max 25 characters", ok: userNameR.length <= 25 },
                      { label: "Letters, numbers, underscores only", ok: userNameR.length === 0 || /^[a-zA-Z0-9_]+$/.test(userNameR) },
                    ].map(({ label, ok }) => (
                      <Text key={label} style={[registrationSuccessStyles.usernameToastItem, { color: ok ? "#a8e6cf" : "#ffb3b3" }]}>
                        {ok ? "✓" : "✗"} {label}
                      </Text>
                    ))}
                  </View>
                )}
                {(isFocusedPasswordR || isFocusedConfirmPasswordR) && (
                  <View style={[registrationSuccessStyles.usernameToast, { top: -144 }]}>
                    {[
                      { label: "At least 8 characters", ok: passwordR.length >= 8 },
                      { label: "One uppercase letter", ok: /[A-Z]/.test(passwordR) },
                      { label: "One lowercase letter", ok: /[a-z]/.test(passwordR) },
                      { label: "One number", ok: /[0-9]/.test(passwordR) },
                      { label: "Passwords match", ok: passwordR.length > 0 && passwordR === confirmPasswordR },
                    ].map(({ label, ok }) => (
                      <Text key={label} style={[registrationSuccessStyles.usernameToastItem, { color: ok ? "#a8e6cf" : "#ffb3b3" }]}>
                        {ok ? "✓" : "✗"} {label}
                      </Text>
                    ))}
                  </View>
                )}
                {isFocusedEmailR && (
                  <View style={[registrationSuccessStyles.usernameToast, { top: -46 }]}>
                    {[
                      { label: "Valid email format", ok: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailR) },
                    ].map(({ label, ok }) => (
                      <Text key={label} style={[registrationSuccessStyles.usernameToastItem, { color: ok ? "#a8e6cf" : "#ffb3b3" }]}>
                        {ok ? "✓" : "✗"} {label}
                      </Text>
                    ))}
                  </View>
                )}
                <TextInput
                  style={[
                    styles.input,
                    isFocusedUserNameR && styles.inputFocused,
                  ]}
                  onFocus={() => setIsFocusedUserNameR(true)}
                  onBlur={() => setIsFocusedUserNameR(false)}
                  placeholderTextColor={parrotPlaceholderGrey}
                  placeholder="Username (3-25 characters)"
                  value={userNameR}
                  maxLength={25}
                  onChangeText={(text) => handleUserNameRChange(text)}
                />
                <TextInput
                  style={[styles.input, isFocusedEmailR && styles.inputFocused]}
                  onFocus={() => setIsFocusedEmailR(true)}
                  onBlur={() => setIsFocusedEmailR(false)}
                  placeholderTextColor={parrotPlaceholderGrey}
                  placeholder="Email"
                  value={emailR}
                  onChangeText={(text) => handleEmailRChange(text)}
                />

                <View>
                  <TextInput
                    style={[
                      styles.input,
                      isFocusedPasswordR && styles.inputFocused,
                    ]}
                    onFocus={() => setIsFocusedPasswordR(true)}
                    onBlur={() => setIsFocusedPasswordR(false)}
                    placeholderTextColor={parrotPlaceholderGrey}
                    placeholder="Enter Password"
                    secureTextEntry={isPasswordHidden}
                    value={passwordR}
                    onChangeText={(text) => handlePasswordRChange(text)}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPressIn={() => togglePasswordVisibility()}
                  >
                    <Text>
                      <Feather name="eye" size={24} color={parrotPlaceholderGrey} />
                    </Text>
                  </TouchableOpacity>
                </View>

                <View>
                  <TextInput
                    style={[
                      styles.input,
                      isFocusedConfirmPasswordR && styles.inputFocused,
                    ]}
                    onFocus={() => setIsFocusedConfirmPasswordR(true)}
                    onBlur={() => setIsFocusedConfirmPasswordR(false)}
                    placeholderTextColor={parrotPlaceholderGrey}
                    placeholder="Re-enter Password"
                    secureTextEntry={isConfirmPasswordHidden}
                    value={confirmPasswordR}
                    onChangeText={(text) => handlePasswordR2Change(text)}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPressIn={() => togglePasswordVisibility2()}
                  >
                    <Text>
                      <Feather name="eye" size={24} color={parrotPlaceholderGrey} />
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.termsRow}
                  onPress={() => setTermsAccepted(prev => !prev)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                    {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.termsText}>
                    I've read and agree to the{" "}
                  </Text>
                  <TouchableOpacity onPress={() => setTermsModalVisible(true)}>
                    <Text style={styles.termsLink}>Terms of Use</Text>
                  </TouchableOpacity>
                </TouchableOpacity>

                <Modal
                  visible={termsModalVisible}
                  animationType="slide"
                  onRequestClose={() => setTermsModalVisible(false)}
                >
                  <View style={{ flex: 1 }}>
                    <TermsOfUseComponent />
                    <TouchableOpacity
                      style={styles.termsCloseButton}
                      onPress={() => setTermsModalVisible(false)}
                    >
                      <Text style={styles.choiceText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>

                <View style={styles.loginContainer}>
                  <TouchableOpacity
                    style={[
                      styles.selection2,
                      isLoadingRegisterUser ||
                        userNameR.length < 3 ||
                        !emailR ||
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailR) ||
                        passwordR.length < 8 ||
                        !/[A-Z]/.test(passwordR) ||
                        !/[a-z]/.test(passwordR) ||
                        !/[0-9]/.test(passwordR) ||
                        passwordR !== confirmPasswordR ||
                        !termsAccepted
                        ? styles.disabled
                        : null,
                    ]}
                    onPress={() => {
                      if (passwordR !== confirmPasswordR) {
                        showToast("Passwords do not match - Please try again.");
                      }
                      if (passwordR === confirmPasswordR) {
                        handleRegister();
                      }
                    }}
                    disabled={
                      isLoadingRegisterUser ||
                      userNameR.length < 3 ||
                      !emailR ||
                      passwordR.length < 8 ||
                      !/[A-Z]/.test(passwordR) ||
                      !/[a-z]/.test(passwordR) ||
                      !/[0-9]/.test(passwordR) ||
                      passwordR !== confirmPasswordR ||
                      !termsAccepted
                    }
                  >
                    <Text style={styles.choiceText}>Register</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.noAccount}
                    onPress={() => {
                      resetAllForms();
                      setLoginOrRegister("Login");
                    }}
                  >
                    <Text style={{ fontFamily: "Nunito_600SemiBold", color: parrotPlaceholderGrey }}>
                      Back to{" "}
                    </Text>
                    <Text style={{ fontFamily: "Nunito_700Bold", color: parrotPlaceholderGrey }}>
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </>
      ) : loginOrRegister === "Register2" ? (
        <>
          <View style={{ marginHorizontal: vw(4), marginTop: vh(6), borderRadius: vh(2), backgroundColor: "rgba(255,255,255,0.3)", paddingTop: vh(2), paddingBottom: vh(4) }}>
            <View style={styles.logoCard}>
              <View style={styles.imagecontainer}>
                <LoginPageLogoComponent />
                <Image
                  style={styles.imageAlmostThere}
                  source={require("../assets/almostthere.png")}
                />
              </View>
            </View>

            <View style={[registrationSuccessStyles.container, { backgroundColor: "transparent" }]}>
              <View style={registrationSuccessStyles.formContainer}>
                <TextInput
                  style={[styles.input, isFocusedCode && styles.inputFocused]}
                  onFocus={() => setIsFocusedCode(true)}
                  onBlur={() => setIsFocusedCode(false)}
                  placeholderTextColor={parrotPlaceholderGrey}
                  placeholder="Enter 6 Digit Code"
                  value={registerCode}
                  onChangeText={(text) => handleRegisterCodeChange(text)}
                />

                <View style={styles.loginContainer}>
                  <TouchableOpacity
                    style={[
                      styles.selection2,
                      isLoadingConfirmUser || registerCode === ""
                        ? styles.disabled
                        : null,
                    ]}
                    onPress={() => {
                      if (passwordR !== confirmPasswordR) {
                        showToast("Passwords do not match - Please try again.");
                      }
                      handleConfirm();
                    }}
                    disabled={isLoadingConfirmUser || registerCode === ""}
                  >
                    <Text style={styles.choiceText}>Confirm</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.noAccount}
                    onPress={() => {
                      resetAllForms();
                      setLoginOrRegister("Login");
                    }}
                  >
                    <Text style={{ fontFamily: "Nunito_600SemiBold", color: parrotPlaceholderGrey }}>
                      Back to{" "}
                    </Text>
                    <Text style={{ fontFamily: "Nunito_700Bold", color: parrotPlaceholderGrey }}>
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </>
      ) : loginOrRegister === "ForgotPassword" ? (
        <>
          <View style={{ marginHorizontal: vw(4), marginTop: vh(6), borderRadius: vh(2), backgroundColor: "rgba(255,255,255,0.3)", paddingTop: vh(2), paddingBottom: vh(4) }}>
            <View style={styles.logoCard}>
              <View style={styles.imagecontainer}>
                <LoginPageLogoComponent />
                <Image
                  style={styles.image}
                  source={require("../assets/resetpassword.png")}
                />
              </View>
            </View>

            <View style={[registrationSuccessStyles.container, { backgroundColor: "transparent" }]}>
              <View style={registrationSuccessStyles.formContainer}>
                <TextInput
                  style={[styles.input, isFocusedEmailR && styles.inputFocused]}
                  onFocus={() => setIsFocusedEmailR(true)}
                  onBlur={() => setIsFocusedEmailR(false)}
                  placeholderTextColor={parrotPlaceholderGrey}
                  placeholder="Email"
                  value={emailForgotPassword}
                  onChangeText={(text) => setEmailForgotPassword(text)}
                />

                <View style={styles.loginContainer}>
                  <TouchableOpacity
                    style={styles.selection2}
                    onPress={() => {
                      handleSendResetCode();
                    }}
                  >
                    <Text style={styles.choiceText}>Send Reset Code</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.noAccount}
                    onPress={() => {
                      resetAllForms();
                      setLoginOrRegister("Login");
                    }}
                  >
                    <Text style={{ fontFamily: "Nunito_600SemiBold", color: parrotPlaceholderGrey }}>
                      Back to{" "}
                    </Text>
                    <Text style={{ fontFamily: "Nunito_700Bold", color: parrotPlaceholderGrey }}>
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </>
      ) : loginOrRegister === "ForgotPassword2" ? (
        <>
          <View style={{ marginHorizontal: vw(4), marginTop: vh(6), borderRadius: vh(2), backgroundColor: "rgba(255,255,255,0.3)", paddingTop: vh(2), paddingBottom: vh(4) }}>
            <View style={styles.logoCard}>
              <View style={styles.imagecontainer}>
                <LoginPageLogoComponent />
                <Image
                  style={styles.imageAlmostThere}
                  source={require("../assets/checkyouremail.png")}
                />
              </View>
            </View>

            <View style={[registrationSuccessStyles.container, { backgroundColor: "transparent" }]}>
              <View style={registrationSuccessStyles.formContainer}>
                <View>
                  <TextInput
                    style={[
                      styles.input,
                      isFocusedPasswordR && styles.inputFocused,
                    ]}
                    onFocus={() => setIsFocusedPasswordR(true)}
                    onBlur={() => setIsFocusedPasswordR(false)}
                    placeholderTextColor={parrotPlaceholderGrey}
                    placeholder="Enter New Password"
                    secureTextEntry={isPasswordHidden}
                    value={passwordR}
                    onChangeText={(text) => handlePasswordRChange(text)}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPressIn={() => togglePasswordVisibility()}
                  >
                    <Text>
                      <Feather name="eye" size={24} color={parrotPlaceholderGrey} />
                    </Text>
                  </TouchableOpacity>
                </View>

                <View>
                  <TextInput
                    style={[
                      styles.input,
                      isFocusedConfirmPasswordR && styles.inputFocused,
                    ]}
                    onFocus={() => setIsFocusedConfirmPasswordR(true)}
                    onBlur={() => setIsFocusedConfirmPasswordR(false)}
                    placeholderTextColor={parrotPlaceholderGrey}
                    placeholder="Re-enter New Password"
                    secureTextEntry={isConfirmPasswordHidden}
                    value={confirmPasswordR}
                    onChangeText={(text) => handlePasswordR2Change(text)}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPressIn={() => togglePasswordVisibility2()}
                  >
                    <Text>
                      <Feather name="eye" size={24} color={parrotPlaceholderGrey} />
                    </Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={[styles.input, isFocusedResetCode && styles.inputFocused]}
                  onFocus={() => setIsFocusedResetCode(true)}
                  onBlur={() => setIsFocusedResetCode(false)}
                  placeholderTextColor={parrotPlaceholderGrey}
                  placeholder="Enter 6 Digit Code"
                  value={resetPasswordCode}
                  onChangeText={(text) => handleRegisterCode2Change(text)}
                />

                <View style={styles.loginContainer}>
                  <TouchableOpacity
                    style={[
                      styles.selection2,
                      isLoadingRegisterUser ||
                        passwordR === "" ||
                        confirmPasswordR === "" ||
                        resetPasswordCode === ""
                        ? styles.disabled
                        : null,
                    ]}
                    onPress={() => {
                      if (passwordR !== confirmPasswordR) {
                        showToast("Passwords do not match - Please try again.");
                      }
                      if (passwordR === confirmPasswordR) {
                        handleResetPassword();
                      }
                    }}
                    disabled={
                      passwordR === "" ||
                      confirmPasswordR === "" ||
                      resetPasswordCode === ""
                    }
                  >
                    <Text style={styles.choiceText}>Update Password</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.noAccount}
                    onPress={() => {
                      resetAllForms();
                      setLoginOrRegister("Login");
                    }}
                  >
                    <Text style={{ fontFamily: "Nunito_600SemiBold", color: parrotPlaceholderGrey }}>
                      Back to{" "}
                    </Text>
                    <Text style={{ fontFamily: "Nunito_700Bold", color: parrotPlaceholderGrey }}>
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {(passwordR.length > 0 || confirmPasswordR.length > 0) && (
                <View style={styles.passwordChecklist}>
                  {[
                    { label: "At least 8 characters", ok: passwordR.length >= 8 },
                    { label: "One uppercase letter", ok: /[A-Z]/.test(passwordR) },
                    { label: "One lowercase letter", ok: /[a-z]/.test(passwordR) },
                    { label: "One number", ok: /[0-9]/.test(passwordR) },
                    { label: "Passwords match", ok: passwordR.length > 0 && passwordR === confirmPasswordR },
                  ].map(({ label, ok }) => (
                    <Text key={label} style={[styles.passwordCheckItem, { color: ok ? "#2e7d32" : "#c62828" }]}>
                      {ok ? "✓" : "✗"} {label}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        </>
      ) : null}
    </ImageBackground>
  );
};





const styles = StyleSheet.create({
  disabled: {
    backgroundColor: parrotBlueSemiTransparent,
  },
  loginContainer: {
    marginTop: vh(2),
  },
  googleLoginContainer: {
    marginTop: vh(4)
  },
  loginCard: {
    width: vw(80),
    backgroundColor: parrotLightCream,
    borderRadius: vh(2),
    padding: vh(2),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  googleCard: {
    width: vw(80),
    backgroundColor: parrotLightCream,
    borderRadius: vh(2),
    paddingVertical: vh(1.5),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    marginTop: vh(3),
  },
  logoCard: {
    width: vw(80),
    backgroundColor: "white",
    borderRadius: vh(2),
    paddingVertical: vh(1.5),
    alignItems: "center",
    alignSelf: "center",
    marginTop: vh(2),
    paddingTop: vh(1.5),
    marginBottom: vh(1),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  orDivider: {
    flexDirection: "row",
    alignItems: "center",
    width: vw(80),
    marginVertical: vh(2),
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: parrotLightBlue,
  },
  orText: {
    marginHorizontal: vh(1.5),
    fontFamily: "Nunito_600SemiBold",
    color: parrotTextDarkBlue,
  },
  forgotPassword: {
    paddingBottom: vh(1),
    alignSelf: "flex-end",
    paddingRight: vh(1.5),
  },
  noAccount: {
    paddingVertical: vh(1),
    alignSelf: "center",
    flexDirection: "row",
  },
  eyeIcon: {
    position: "absolute",
    right: vw(0),
    paddingVertical: vh(0.8),
    paddingHorizontal: vh(2),
  },
  inputsContainer: {
    width: vw(65),
    marginTop: vh(1),
  },
  choiceText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "white",
    textAlign: "center",
  },
  selection2: {
    marginHorizontal: vh(0.25),
    marginVertical: vh(0.25),
    paddingVertical: vh(1),
    backgroundColor: parrotBlue,
    borderRadius: vh(1.5),
    width: vw(65),
  },
  container: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  formContainer: {
    marginTop: 0,
    width: vw(80),
    alignItems: "center",
  },
  input: {
    backgroundColor: "white",
    height: 40,
    borderColor: parrotBlueMediumTransparent,
    borderWidth: 3,
    marginBottom: vh(1),
    padding: 8,
    width: vw(65),
    borderRadius: vh(1.5),
    color: parrotInputTextColor,
    fontFamily: "Nunito_400Regular",
  },
  inputFocused: {
    borderColor: parrotBlueSemiTransparent3,
    borderWidth: 3,
  },
  passwordChecklist: {
    width: vw(65),
    marginTop: vh(1.5),
    marginBottom: vh(1),
    gap: 2,
  },
  passwordCheckItem: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
    flexWrap: "wrap",
    marginLeft: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: parrotBlue,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: parrotBlue,
  },
  checkmark: {
    color: "white",
    fontSize: 13,
    fontFamily: "Nunito_700Bold",
  },
  termsText: {
    fontSize: 13,
    color: parrotPlaceholderGrey,
    fontFamily: "Nunito_400Regular",
  },
  termsLink: {
    fontSize: 13,
    color: parrotBlue,
    fontFamily: "Nunito_600SemiBold",
    textDecorationLine: "underline",
  },
  termsCloseButton: {
    backgroundColor: parrotBlue,
    margin: 16,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  imagecontainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
  },

  image: {
    marginTop: vh(1),
    marginLeft: vh(2),
    width: vw(70 * .6),
    height: vh(15 * .6),
  },
  imageLetsStart: {
    marginTop: vh(1),
    marginLeft: vh(2),
    width: vw(72 * .6),
    height: vh(17 * .6),
  },
  imageAlmostThere: {
    marginTop: vh(1),
    marginLeft: vh(2),
    width: vw(72 * .6),
    height: vh(15 * .6),
    resizeMode: "contain",
  },
  toast: {
    position: "absolute",
    bottom: vh(10),
    alignSelf: "center",
    backgroundColor: "rgba(30, 111, 217, 0.9)",
    paddingHorizontal: vw(4),
    paddingVertical: vh(1),
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 999,
  },
  toastText: {
    color: "white",
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
  },
});

const registrationSuccessStyles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  usernameToast: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 10,
    backgroundColor: "#1a56b0",
    borderRadius: 20,
    paddingHorizontal: vw(4),
    paddingVertical: vh(1),
  },
  usernameToastItem: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    lineHeight: 22,
  },
  formContainer: {
    marginTop: 0,
    width: vw(80),
    alignItems: "center",
    backgroundColor: parrotLightCream,
    borderRadius: vh(2),
    paddingTop: vh(3),
    paddingBottom: vh(2),
    paddingHorizontal: vh(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default LoginScreen;

const LoginPageLogoComponent = () => {
  return (
    <Image
      style={{ width: vh(12), height: vh(12), borderRadius: vh(6), overflow: "hidden" }}
      source={require("../assets/parrotslogologin.png")}
    />
  );
};
