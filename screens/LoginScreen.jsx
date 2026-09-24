import { ParrotsStdText } from "../components/ParrotsStdText";
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
  Dimensions,
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
  updateUserFavorites,
  setBookmarkedUserIds,
} from "../slices/UserSlice";
import TermsOfUseComponent from "../components/TermsOfUseComponent";
import { registerPushTokenAsync } from "../utils/registerPushToken";
import { TERMS_VERSION } from "../constants/TermsVersion";
import GoogleLoginButton from "../components/GoogleAuthButton";
import { parrotBlue, parrotBlueMediumTransparent, parrotBlueSemiTransparent, parrotBlueSemiTransparent2, parrotBlueSemiTransparent3, parrotCream, parrotDarkBlue, parrotDarkCream, parrotGreenMediumTransparent, parrotGreenTransparent, parrotInputTextColor, parrotLightBlue, parrotLightCream, parrotPlaceholderGrey, parrotRed, parrotTextDarkBlue, parrotYellow } from "../assets/color";

const BLUE = "#0A5FBF";
const LINE = "#D8E0E8";
const INK = "#1F2933";
const FAINT = "#5A6874";
const HERO_H = Dimensions.get("window").width;

const HERO_TITLES = {
  Login: { title: "Welcome to Parrots", sub: "Sign in to find your next voyage." },
  Register1: { title: "Let's get started", sub: "Create your account in under a minute." },
  Register2: { title: "Almost there", sub: "Enter the 6-digit code we sent you." },
  ForgotPassword: { title: "Reset password", sub: "We'll send a code to your email." },
  ForgotPassword2: { title: "Check your email", sub: "Enter the code and your new password." },
};

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
            refreshTokenExpiryTime: resetPasswordResponse.refreshTokenExpiryTime,
            unreadMessages: resetPasswordResponse.unreadMessages,
            isAdmin: resetPasswordResponse.isAdmin,
            hasAcknowledgedPublicProfile: resetPasswordResponse.hasAcknowledgedPublicProfile ?? false,
          })
        );
        dispatch(updateUserFavorites({
          favoriteVehicles: resetPasswordResponse.favoriteVehicleIds || [],
          favoriteVoyages: resetPasswordResponse.favoriteVoyageIds || [],
        }));
        dispatch(setBookmarkedUserIds(resetPasswordResponse.bookmarkedUserIds || []));
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
      const loginResponse = await loginUser({
        Email: email,
        Password: password,
      }).unwrap();

      if (!loginResponse?.token || !loginResponse?.userId) {
        throw new Error("Invalid login response");
      }

      dispatch(updateUserFavorites({
        favoriteVehicles: loginResponse.favoriteVehicleIds || [],
        favoriteVoyages: loginResponse.favoriteVoyageIds || [],
      }));
      dispatch(setBookmarkedUserIds(loginResponse.bookmarkedUserIds || []));

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
          isAdmin: loginResponse.isAdmin,
          hasAcknowledgedPublicProfile: loginResponse.hasAcknowledgedPublicProfile ?? false,
        })
      );

      registerPushTokenAsync(loginResponse.token);

      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Login error:", err);
      setIsLoggingIn(false);

      if (err?.status === 401) {
        showToast("Could not log in - Incorrect email or password.");
      } else {
        showToast(`Login failed - ${err?.message || "Something went wrong. Please try again."}`);
      }
    } finally {
      setIsLoggingIn(false);
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
          isAdmin: pendingLoginData.isAdmin,
          hasAcknowledgedPublicProfile: pendingLoginData.hasAcknowledgedPublicProfile ?? false,
        })
      );
      dispatch(updateUserFavorites({
        favoriteVehicles: pendingLoginData.favoriteVehicleIds || [],
        favoriteVoyages: pendingLoginData.favoriteVoyageIds || [],
      }));
      dispatch(setBookmarkedUserIds(pendingLoginData.bookmarkedUserIds || []));
      registerPushTokenAsync(pendingLoginData.token);
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

      if (registerResponse.token) {
        resetAllForms();
        setLoginOrRegister("Register2");
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
            isAdmin: confirmResponse.isAdmin,
            hasAcknowledgedPublicProfile: confirmResponse.hasAcknowledgedPublicProfile ?? false,
          })
        );
        dispatch(updateUserFavorites({
          favoriteVehicles: confirmResponse.favoriteVehicleIds || [],
          favoriteVoyages: confirmResponse.favoriteVoyageIds || [],
        }));
        dispatch(setBookmarkedUserIds(confirmResponse.bookmarkedUserIds || []));
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

  useEffect(() => {
    logAllAsyncStorage();
    return;
  }, []);

  const { title, sub } = HERO_TITLES[loginOrRegister] || HERO_TITLES.Login;

  if (requiresTermsReAcceptance) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Modal visible={true} animationType="slide">
          <View style={{ flex: 1, padding: 20, paddingTop: 60 }}>
            <ParrotsStdText style={{ fontSize: 20, fontWeight: "700", color: "#003580", marginBottom: 12, textAlign: "center" }}>
              Our Terms of Use have been updated
            </ParrotsStdText>
            <ParrotsStdText style={{ fontSize: 14, color: "#555", marginBottom: 16, textAlign: "center" }}>
              Please read and accept the updated Terms of Use to continue using Parrots.
            </ParrotsStdText>
            <ScrollView style={{ flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 16 }}>
              <TermsOfUseComponent />
            </ScrollView>
            <TouchableOpacity
              onPress={handleAcceptUpdatedTerms}
              style={{ backgroundColor: "#007bff", borderRadius: 8, padding: 14, alignItems: "center", marginBottom: 10 }}
            >
              <ParrotsStdText style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>I Accept</ParrotsStdText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setRequiresTermsReAcceptance(false); setPendingLoginData(null); }}
              style={{ alignItems: "center", padding: 10 }}
            >
              <ParrotsStdText style={{ color: "#999", fontSize: 14 }}>Decline and go back</ParrotsStdText>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={s.screen}>
      {toastVisible && (
        <View style={s.toast}>
          <ParrotsStdText style={s.toastText}>{toastMessage}</ParrotsStdText>
        </View>
      )}

      {/* Hero */}
      <View style={s.hero}>
        <Image source={require("../assets/parrotsreallife.jpg")} style={s.heroImg} resizeMode="cover" />
        <View style={s.heroOverlay} />
        <View style={s.heroTxt}>
          <ParrotsStdText style={s.heroTitle} numberOfLines={1}>{title}</ParrotsStdText>
          <ParrotsStdText style={s.heroSub} numberOfLines={1}>{sub}</ParrotsStdText>
        </View>
      </View>

      {/* Sheet */}
      <ScrollView style={s.sheet} contentContainerStyle={s.sheetContent} keyboardShouldPersistTaps="handled">

        {loginOrRegister === "Login" && (
          <>
            <View style={s.field}>
              <ParrotsStdText style={s.fieldLabel}>EMAIL</ParrotsStdText>
              <TextInput
                onFocus={() => setIsFocusedEmail(true)}
                onBlur={() => setIsFocusedEmail(false)}
                style={[s.input, isFocusedEmail && s.inputFocused]}
                placeholder="you@example.com"
                placeholderTextColor={FAINT}
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={s.field}>
              <ParrotsStdText style={s.fieldLabel}>PASSWORD</ParrotsStdText>
              <View>
                <TextInput
                  style={[s.input, isFocusedPassword && s.inputFocused]}
                  onFocus={() => setIsFocusedPassword(true)}
                  onBlur={() => setIsFocusedPassword(false)}
                  placeholder="Your password"
                  placeholderTextColor={FAINT}
                  secureTextEntry={isPasswordHidden}
                  value={password}
                  onChangeText={handlePasswordChange}
                />
                <TouchableOpacity style={s.eyeIcon} onPressIn={togglePasswordVisibility}>
                  <Feather name="eye" size={20} color={FAINT} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={s.forgotPassword}
              onPress={() => { resetAllForms(); setLoginOrRegister("ForgotPassword"); }}
            >
              <ParrotsStdText style={s.linkText}>Forgot password?</ParrotsStdText>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.btnPri}
              onPress={handleLogin}
              disabled={isLoading || isLoggingIn}
            >
              {isLoading || isLoggingIn
                ? <ActivityIndicator color="white" />
                : <ParrotsStdText style={s.btnPriText}>Login</ParrotsStdText>
              }
            </TouchableOpacity>

            <View style={s.dividerRow}>
              <View style={s.dividerLine} />
              <ParrotsStdText style={s.dividerText}>or</ParrotsStdText>
              <View style={s.dividerLine} />
            </View>

            <View style={s.googleWrap}>
              <GoogleLoginButton />
            </View>

            <TouchableOpacity
              style={s.noAccount}
              onPress={() => { resetAllForms(); setLoginOrRegister("Register1"); }}
            >
              <ParrotsStdText style={s.mutedText}>Don't have an account? </ParrotsStdText>
              <ParrotsStdText style={s.linkText}>Sign up</ParrotsStdText>
            </TouchableOpacity>

            <View style={{ display: "none" }}>
              <TouchableOpacity style={s.btnPri} onPress={logAllAsyncStorage} disabled={isLoading}>
                <ParrotsStdText style={s.btnPriText}>print</ParrotsStdText>
              </TouchableOpacity>
            </View>
          </>
        )}

        {loginOrRegister === "Register1" && (
          <>
            {/* {isFocusedUserNameR && (
              <View style={s.validationToast}>
                {[
                  { label: "At least 3 characters", ok: userNameR.length >= 3 },
                  { label: "Max 25 characters", ok: userNameR.length <= 25 },
                  { label: "Letters, numbers, underscores only", ok: userNameR.length === 0 || /^[a-zA-Z0-9_]+$/.test(userNameR) },
                ].map(({ label, ok }) => (
                  <ParrotsStdText key={label} style={[s.validationItem, { color: ok ? "#a8e6cf" : "#ffb3b3" }]}>
                    {ok ? "✓" : "✗"} {label}
                  </ParrotsStdText>
                ))}
              </View>
            )}
            {(isFocusedPasswordR || isFocusedConfirmPasswordR) && (
              <View style={s.validationToast}>
                {[
                  { label: "At least 8 characters", ok: passwordR.length >= 8 },
                  { label: "One uppercase letter", ok: /[A-Z]/.test(passwordR) },
                  { label: "One lowercase letter", ok: /[a-z]/.test(passwordR) },
                  { label: "One number", ok: /[0-9]/.test(passwordR) },
                  { label: "Passwords match", ok: passwordR.length > 0 && passwordR === confirmPasswordR },
                ].map(({ label, ok }) => (
                  <ParrotsStdText key={label} style={[s.validationItem, { color: ok ? "#a8e6cf" : "#ffb3b3" }]}>
                    {ok ? "✓" : "✗"} {label}
                  </ParrotsStdText>
                ))}
              </View>
            )}
            {isFocusedEmailR && (
              <View style={s.validationToast}>
                {[
                  { label: "Valid email format", ok: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailR) },
                ].map(({ label, ok }) => (
                  <ParrotsStdText key={label} style={[s.validationItem, { color: ok ? "#a8e6cf" : "#ffb3b3" }]}>
                    {ok ? "✓" : "✗"} {label}
                  </ParrotsStdText>
                ))}
              </View>
            )} */}

            <View style={s.field}>
              <View style={s.fieldLabelRow}>
                <ParrotsStdText style={s.fieldLabel}>USERNAME</ParrotsStdText>
                {isFocusedUserNameR && (
                  <View style={s.pillsGroup}>
                    {[
                      { label: "3+ chars", ok: userNameR.length >= 3 },
                      { label: "Max 25", ok: userNameR.length <= 25 },
                      { label: "a-z 0-9 _", ok: userNameR.length === 0 || /^[a-zA-Z0-9_]+$/.test(userNameR) },
                    ].map(({ label, ok }) => (
                      <View key={label} style={[s.rulePill, ok && s.rulePillOk]}>
                        <ParrotsStdText style={[s.rulePillText, ok && s.rulePillTextOk]}>{label}</ParrotsStdText>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              <TextInput
                style={[s.input, isFocusedUserNameR && s.inputFocused]}
                onFocus={() => setIsFocusedUserNameR(true)}
                onBlur={() => setIsFocusedUserNameR(false)}
                placeholderTextColor={FAINT}
                placeholder="3-25 characters"
                value={userNameR}
                maxLength={25}
                onChangeText={handleUserNameRChange}
                autoCapitalize="none"
              />
            </View>
            <View style={s.field}>
              <View style={s.fieldLabelRow}>
                <ParrotsStdText style={s.fieldLabel}>EMAIL</ParrotsStdText>
                {isFocusedEmailR && (
                  <View style={s.pillsGroup}>
                    {[
                      { label: "Valid email", ok: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailR) },
                    ].map(({ label, ok }) => (
                      <View key={label} style={[s.rulePill, ok && s.rulePillOk]}>
                        <ParrotsStdText style={[s.rulePillText, ok && s.rulePillTextOk]}>{label}</ParrotsStdText>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              <TextInput
                style={[s.input, isFocusedEmailR && s.inputFocused]}
                onFocus={() => setIsFocusedEmailR(true)}
                onBlur={() => setIsFocusedEmailR(false)}
                placeholderTextColor={FAINT}
                placeholder="you@example.com"
                value={emailR}
                onChangeText={handleEmailRChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={s.field}>
              <View style={s.fieldLabelRow}>
                <ParrotsStdText style={s.fieldLabel}>PASSWORD</ParrotsStdText>
                {isFocusedPasswordR && (
                  <View style={s.pillsGroup}>
                    {[
                      { label: "8+ chars", ok: passwordR.length >= 8 },
                      { label: "Uppercase", ok: /[A-Z]/.test(passwordR) },
                      { label: "Lowercase", ok: /[a-z]/.test(passwordR) },
                      { label: "Number", ok: /[0-9]/.test(passwordR) },
                    ].map(({ label, ok }) => (
                      <View key={label} style={[s.rulePill, ok && s.rulePillOk]}>
                        <ParrotsStdText style={[s.rulePillText, ok && s.rulePillTextOk]}>
                          {label}
                        </ParrotsStdText>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              <View>
                <TextInput
                  style={[s.input, isFocusedPasswordR && s.inputFocused]}
                  onFocus={() => setIsFocusedPasswordR(true)}
                  onBlur={() => setIsFocusedPasswordR(false)}
                  placeholderTextColor={FAINT}
                  placeholder="Create a password"
                  secureTextEntry={isPasswordHidden}
                  value={passwordR}
                  onChangeText={handlePasswordRChange}
                />
                <TouchableOpacity style={s.eyeIcon} onPressIn={togglePasswordVisibility}>
                  <Feather name="eye" size={20} color={FAINT} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={s.field}>
              <View style={s.fieldLabelRow}>
                <ParrotsStdText style={s.fieldLabel}>CONFIRM PASSWORD</ParrotsStdText>
                {isFocusedConfirmPasswordR && (
                  <View style={s.pillsGroup}>
                    <View style={[s.rulePill, confirmPasswordR.length > 0 && passwordR === confirmPasswordR && s.rulePillOk]}>
                      <ParrotsStdText style={[s.rulePillText, confirmPasswordR.length > 0 && passwordR === confirmPasswordR && s.rulePillTextOk]}>
                        Passwords match
                      </ParrotsStdText>
                    </View>
                  </View>
                )}
              </View>
              <View>
                <TextInput
                  style={[s.input, isFocusedConfirmPasswordR && s.inputFocused]}
                  onFocus={() => setIsFocusedConfirmPasswordR(true)}
                  onBlur={() => setIsFocusedConfirmPasswordR(false)}
                  placeholderTextColor={FAINT}
                  placeholder="Type it again"
                  secureTextEntry={isConfirmPasswordHidden}
                  value={confirmPasswordR}
                  onChangeText={handlePasswordR2Change}
                />
                <TouchableOpacity style={s.eyeIcon} onPressIn={togglePasswordVisibility2}>
                  <Feather name="eye" size={20} color={FAINT} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={s.termsRow}
              onPress={() => setTermsAccepted(prev => !prev)}
              activeOpacity={0.7}
            >
              <View style={[s.checkbox, termsAccepted && s.checkboxChecked]}>
                {termsAccepted && <ParrotsStdText style={s.checkmark}>✓</ParrotsStdText>}
              </View>
              <ParrotsStdText style={s.mutedText}>I've read and agree to the </ParrotsStdText>
              <TouchableOpacity onPress={() => setTermsModalVisible(true)}>
                <ParrotsStdText style={s.linkText}>Terms of Use</ParrotsStdText>
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
                  style={s.termsCloseButton}
                  onPress={() => setTermsModalVisible(false)}
                >
                  <ParrotsStdText style={s.btnPriText}>Close</ParrotsStdText>
                </TouchableOpacity>
              </View>
            </Modal>

            <TouchableOpacity
              style={[
                s.btnPri,
                (isLoadingRegisterUser ||
                  userNameR.length < 3 ||
                  !emailR ||
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailR) ||
                  passwordR.length < 8 ||
                  !/[A-Z]/.test(passwordR) ||
                  !/[a-z]/.test(passwordR) ||
                  !/[0-9]/.test(passwordR) ||
                  passwordR !== confirmPasswordR ||
                  !termsAccepted) && s.btnDisabled,
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
              <ParrotsStdText style={s.btnPriText}>Register</ParrotsStdText>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.noAccount}
              onPress={() => { resetAllForms(); setLoginOrRegister("Login"); }}
            >
              <ParrotsStdText style={s.mutedText}>Back to </ParrotsStdText>
              <ParrotsStdText style={s.linkText}>Login</ParrotsStdText>
            </TouchableOpacity>
          </>
        )}

        {loginOrRegister === "Register2" && (
          <>
            <View style={s.field}>
              <ParrotsStdText style={s.fieldLabel}>CONFIRMATION CODE</ParrotsStdText>
              <TextInput
                style={[s.input, isFocusedCode && s.inputFocused]}
                onFocus={() => setIsFocusedCode(true)}
                onBlur={() => setIsFocusedCode(false)}
                placeholderTextColor={FAINT}
                placeholder="Enter 6 digit code"
                value={registerCode}
                onChangeText={handleRegisterCodeChange}
                keyboardType="number-pad"
              />
            </View>

            <TouchableOpacity
              style={[s.btnPri, (isLoadingConfirmUser || registerCode === "") && s.btnDisabled]}
              onPress={() => {
                if (passwordR !== confirmPasswordR) {
                  showToast("Passwords do not match - Please try again.");
                }
                handleConfirm();
              }}
              disabled={isLoadingConfirmUser || registerCode === ""}
            >
              <ParrotsStdText style={s.btnPriText}>Confirm</ParrotsStdText>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.noAccount}
              onPress={() => { resetAllForms(); setLoginOrRegister("Login"); }}
            >
              <ParrotsStdText style={s.mutedText}>Back to </ParrotsStdText>
              <ParrotsStdText style={s.linkText}>Login</ParrotsStdText>
            </TouchableOpacity>
          </>
        )}

        {loginOrRegister === "ForgotPassword" && (
          <>
            <View style={s.field}>
              <ParrotsStdText style={s.fieldLabel}>EMAIL</ParrotsStdText>
              <TextInput
                style={[s.input, isFocusedEmailR && s.inputFocused]}
                onFocus={() => setIsFocusedEmailR(true)}
                onBlur={() => setIsFocusedEmailR(false)}
                placeholderTextColor={FAINT}
                placeholder="you@example.com"
                value={emailForgotPassword}
                onChangeText={(text) => setEmailForgotPassword(text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity style={s.btnPri} onPress={handleSendResetCode}>
              <ParrotsStdText style={s.btnPriText}>Send Reset Code</ParrotsStdText>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.noAccount}
              onPress={() => { resetAllForms(); setLoginOrRegister("Login"); }}
            >
              <ParrotsStdText style={s.mutedText}>Back to </ParrotsStdText>
              <ParrotsStdText style={s.linkText}>Login</ParrotsStdText>
            </TouchableOpacity>
          </>
        )}

        {loginOrRegister === "ForgotPassword2" && (
          <>
            <View style={s.field}>
              <View style={s.fieldLabelRow}>
                <ParrotsStdText style={s.fieldLabel}>NEW PASSWORD</ParrotsStdText>
                {isFocusedPasswordR && (
                  <View style={s.pillsGroup}>
                    {[
                      { label: "8+ chars", ok: passwordR.length >= 8 },
                      { label: "Uppercase", ok: /[A-Z]/.test(passwordR) },
                      { label: "Lowercase", ok: /[a-z]/.test(passwordR) },
                      { label: "Number", ok: /[0-9]/.test(passwordR) },
                    ].map(({ label, ok }) => (
                      <View key={label} style={[s.rulePill, ok && s.rulePillOk]}>
                        <ParrotsStdText style={[s.rulePillText, ok && s.rulePillTextOk]}>{label}</ParrotsStdText>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              <View>
                <TextInput
                  style={[s.input, isFocusedPasswordR && s.inputFocused]}
                  onFocus={() => setIsFocusedPasswordR(true)}
                  onBlur={() => setIsFocusedPasswordR(false)}
                  placeholderTextColor={FAINT}
                  placeholder="Enter new password"
                  secureTextEntry={isPasswordHidden}
                  value={passwordR}
                  onChangeText={handlePasswordRChange}
                />
                <TouchableOpacity style={s.eyeIcon} onPressIn={togglePasswordVisibility}>
                  <Feather name="eye" size={20} color={FAINT} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={s.field}>
              <View style={s.fieldLabelRow}>
                <ParrotsStdText style={s.fieldLabel}>CONFIRM NEW PASSWORD</ParrotsStdText>
                {isFocusedConfirmPasswordR && (
                  <View style={s.pillsGroup}>
                    <View style={[s.rulePill, confirmPasswordR.length > 0 && passwordR === confirmPasswordR && s.rulePillOk]}>
                      <ParrotsStdText style={[s.rulePillText, confirmPasswordR.length > 0 && passwordR === confirmPasswordR && s.rulePillTextOk]}>
                        Passwords match
                      </ParrotsStdText>
                    </View>
                  </View>
                )}
              </View>
              <View>
                <TextInput
                  style={[s.input, isFocusedConfirmPasswordR && s.inputFocused]}
                  onFocus={() => setIsFocusedConfirmPasswordR(true)}
                  onBlur={() => setIsFocusedConfirmPasswordR(false)}
                  placeholderTextColor={FAINT}
                  placeholder="Type it again"
                  secureTextEntry={isConfirmPasswordHidden}
                  value={confirmPasswordR}
                  onChangeText={handlePasswordR2Change}
                />
                <TouchableOpacity style={s.eyeIcon} onPressIn={togglePasswordVisibility2}>
                  <Feather name="eye" size={20} color={FAINT} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={s.field}>
              <ParrotsStdText style={s.fieldLabel}>RESET CODE</ParrotsStdText>
              <TextInput
                style={[s.input, isFocusedResetCode && s.inputFocused]}
                onFocus={() => setIsFocusedResetCode(true)}
                onBlur={() => setIsFocusedResetCode(false)}
                placeholderTextColor={FAINT}
                placeholder="Enter 6 digit code"
                value={resetPasswordCode}
                onChangeText={handleRegisterCode2Change}
                keyboardType="number-pad"
              />
            </View>

            <TouchableOpacity
              style={[
                s.btnPri,
                (isLoadingRegisterUser || passwordR === "" || confirmPasswordR === "" || resetPasswordCode === "") && s.btnDisabled,
              ]}
              onPress={() => {
                if (passwordR !== confirmPasswordR) {
                  showToast("Passwords do not match - Please try again.");
                }
                if (passwordR === confirmPasswordR) {
                  handleResetPassword();
                }
              }}
              disabled={passwordR === "" || confirmPasswordR === "" || resetPasswordCode === ""}
            >
              <ParrotsStdText style={s.btnPriText}>Update Password</ParrotsStdText>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.noAccount}
              onPress={() => { resetAllForms(); setLoginOrRegister("Login"); }}
            >
              <ParrotsStdText style={s.mutedText}>Back to </ParrotsStdText>
              <ParrotsStdText style={s.linkText}>Login</ParrotsStdText>
            </TouchableOpacity>
          </>
        )}

      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: parrotCream,
  },
  // Hero
  hero: {
    height: HERO_H,
  },
  heroImg: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(8,30,54,0.68)",
  },
  heroTxt: {
    position: "absolute",
    bottom: 38,
    left: 24,
    right: 24,
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: "Nunito_800ExtraBold",
    color: "#fff",
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  heroSub: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "rgba(255,255,255,0.80)",
    marginTop: 6,
  },
  // Sheet
  sheet: {
    flex: 1,
    backgroundColor: parrotCream,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    marginTop: -22,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 48,
    gap: 12,
  },
  // Field wrapper + label
  field: {
    gap: 4,
  },
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 3,
    justifyContent: "space-between",
  },
  fieldLabel: {
    fontSize: 10,
    fontFamily: "Nunito_800ExtraBold",
    letterSpacing: 0.9,
    color: FAINT,
  },
  // Inputs
  input: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: LINE,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    color: INK,
  },
  inputFocused: {
    borderColor: BLUE,
  },
  eyeIcon: {
    position: "absolute",
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  // Buttons
  btnPri: {
    height: 50,
    borderRadius: 999,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  btnPriText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },
  btnDisabled: {
    backgroundColor: parrotBlueSemiTransparent,
  },
  // Google
  googleWrap: {
    height: 50,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: LINE,
    backgroundColor: "#fff",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: LINE,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: FAINT,
  },
  // Misc
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -4,
  },
  noAccount: {
    flexDirection: "row",
    alignSelf: "center",
    paddingVertical: 8,
  },
  mutedText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: FAINT,
  },
  linkText: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: BLUE,
  },
  // Terms
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: BLUE,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: BLUE,
  },
  checkmark: {
    color: "white",
    fontSize: 13,
    fontFamily: "Nunito_700Bold",
  },
  termsCloseButton: {
    backgroundColor: BLUE,
    margin: 16,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  // Password checklist
  passwordChecklist: {
    gap: 2,
  },
  passwordCheckItem: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
  },
  // Password rule pills
  rules: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginTop: -4,
  },
  pillsGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
    justifyContent: "flex-end",
    flex: 1,
  },
  rulePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "#F4F7FB",
  },
  rulePillOk: {
    backgroundColor: "#E4F5E9",
  },
  rulePillText: {
    fontSize: 10,
    fontFamily: "Nunito_800ExtraBold",
    color: FAINT,
  },
  rulePillTextOk: {
    color: "#0B6B4E",
  },
  hint: {
    fontSize: 11,
    fontFamily: "Nunito_700Bold",
    color: "#B3261E",
    marginTop: -6,
  },
  // Validation toasts (old — commented out in JSX)
  validationToast: {
    backgroundColor: "#1a56b0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  validationItem: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    lineHeight: 22,
  },
  // Toast
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

export default LoginScreen;
