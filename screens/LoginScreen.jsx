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
  TouchableOpacity,
  StatusBar,
  Button,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateAsLoggedIn } from "../slices/UserSlice";
import { vh, vw } from "react-native-expo-viewport-units";
import { Feather } from "@expo/vector-icons";
import {
  useRegisterUserMutation,
  useConfirmUserMutation,
  useLoginUserMutation,
  useRequestCodeMutation,
  useResetPasswordMutation,
  useLazyGetFavoriteVoyageIdsByUserIdQuery,
  useLazyGetFavoriteVehicleIdsByUserIdQuery,
  updateUserFavorites,
} from "../slices/UserSlice";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import GoogleLoginButton from "../components/GoogleAuthButton";
import { parrotBlue, parrotBlueMediumTransparent, parrotBlueSemiTransparent, parrotBlueSemiTransparent2, parrotBlueSemiTransparent3, parrotDarkCream, parrotInputTextColor, parrotLightBlue, parrotPlaceholderGrey, parrotTextDarkBlue } from "../assets/color";

// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";
// import * as AuthSession from "expo-auth-session";

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [email, setEmail] = useState("sinanzen@gmail.com");
  const [password, setPassword] = useState("123456");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [isFocusedCode, setIsFocusedCode] = useState(false);
  const [isFocusedCode2, setIsFocusedCode2] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isPasswordHidden2, setIsPasswordHidden2] = useState(true);
  const [loginOrRegister, setLoginOrRegister] = useState("Login");
  const [loginUser, { isLoading, isSuccess }] = useLoginUserMutation();
  const [requestCode] = useRequestCodeMutation();
  const [resetPassword] = useResetPasswordMutation();
  const [userNameR, setUserNameR] = useState("");
  const [emailR, setEmailR] = useState("");
  const [passwordR, setPasswordR] = useState("");
  const [passwordR2, setPasswordR2] = useState("");
  const [registerCode, setRegisterCode] = useState("");
  const [registerCode2, setRegisterCode2] = useState("");
  const [isFocusedEmailR, setIsFocusedEmailR] = useState(false);
  const [isFocusedPasswordR, setIsFocusedPasswordR] = useState(false);
  const [isFocusedPasswordR2, setIsFocusedPasswordR2] = useState(false);
  const [isFocusedUserNameR, setIsFocusedUserNameR] = useState(false);
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

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordHidden((prevState) => !prevState);
  };

  const togglePasswordVisibility2 = () => {
    setIsPasswordHidden2((prevState) => !prevState);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleRegisterCodeChange = (text) => {
    setRegisterCode(text);
  };

  const handleRegisterCode2Change = (text) => {
    setRegisterCode2(text);
  };

  const handleFocusAll = () => {
    setIsFocusedEmail(false);
    setIsFocusedEmailR(false);
    setIsFocusedCode(false);
    setIsFocusedCode2(false);
    setIsFocusedPassword(false);
    setIsFocusedPasswordR(false);
    setIsFocusedPasswordR2(false);
    setIsFocusedUserNameR(false);
  };

  const handleSendResetCode = async () => {
    requestCode(emailR);
    setLoginOrRegister("UpdatePassword");
    handleFocusAll();
  };

  const handleResetPassword = async () => {
    try {
      const resetPasswordResponse = await resetPassword({
        email: emailR,
        password: passwordR,
        confirmationCode: registerCode2,
      }).unwrap();
      console.log("resetpasswordresponse: --->>", resetPasswordResponse);

      setPasswordR("");
      setPasswordR2("");
      setRegisterCode2("");
      if (resetPasswordResponse.token) {
        await dispatch(
          updateAsLoggedIn({
            userId: resetPasswordResponse.userId,
            userName: resetPasswordResponse.userName,
            profileImageUrl: resetPasswordResponse.profileImageUrl,
            token: resetPasswordResponse.token,
            refreshToken: resetPasswordResponse.refreshToken,
            refreshTokenExpiryTime:
              resetPasswordResponse.refreshTokenExpiryTime,
          })
        );
      }
    } catch (err) {
      Toast.show({
        type: "success",
        text1: "Could not log in",
        text2: "Please check your credentials ",
        visibilityTime: 1200,
        topOffset: 100,
      });
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
      console.log("----->", loginResponse);

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
        console.log("--->>>>", loginResponse.userId);
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

      // Dispatch login state only if token is present
      // if (false)
      dispatch(
        updateAsLoggedIn({
          userId: loginResponse.userId,
          userName: loginResponse.userName || "",
          profileImageUrl: loginResponse.profileImageUrl || "",
          token: loginResponse.token,
          refreshToken: loginResponse.refreshToken,
          refreshTokenExpiryTime: loginResponse.refreshTokenExpiryTime,
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
        Toast.show({
          type: "error",
          text1: "Could not log in",
          text2: "Incorrect email or password.",
          visibilityTime: 1500,
          topOffset: 100,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Login failed",
          text2: err?.message || "Something went wrong. Please try again.",
          visibilityTime: 1500,
          topOffset: 100,
        });
      }
    } finally {
      setIsLoggingIn(false); // Always reset loading state
    }
  };

  const handleRegister = async () => {
    try {
      const registerResponse = await registerUser({
        Email: emailR,
        UserName: userNameR,
        Password: passwordR,
      }).unwrap();

      setUserNameR("");
      setPasswordR("");
      setPasswordR2("");

      // if registration response is 200
      // go to Registration-2

      // if ConfirmCode returns token etc
      // then updateasLoggedIn

      if (registerResponse.token) {
        setLoginOrRegister("Register2");
        handleFocusAll();
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
      Toast.show({
        type: "success",
        text1: "Could not register",
        text2: "Please try again",
        visibilityTime: 1200,
        topOffset: 100,
      });
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
        setLoginOrRegister("Login");
        handleFocusAll();

        await dispatch(
          updateAsLoggedIn({
            userId: confirmResponse.userId,
            userName: confirmResponse.userName,
            profileImageUrl: confirmResponse.profileImageUrl,
            token: confirmResponse.token,
            refreshToken: confirmResponse.refreshToken,
            refreshTokenExpiryTime: confirmResponse.refreshTokenExpiryTime,
          })
        );
      }
    } catch (err) {
      console.log(err);
      Toast.show({
        type: "success",
        text1: "Could not confirm",
        text2: "Please try again",
        visibilityTime: 1200,
        topOffset: 100,
      });
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
    setPasswordR2(text);
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

  return (
    <>
      <TokenExpiryGuard />
      {loginOrRegister === "Login" ? (
        <>
          <View style={{ backgroundColor: "white" }}>
            <View style={styles.imagecontainer}>
              <LoginPageLogoComponent />
              <Image
                style={styles.image}
                source={require("../assets/welcome.png")}
              />
            </View>
          </View>

          <View style={styles.container}>
            <View style={styles.formContainer}>
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
                    style={[
                      styles.input,
                      isFocusedPassword && styles.inputFocused,
                    ]}
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
                  // onPressOut={() => setIsPasswordHidden(true)}
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
                  setLoginOrRegister("ForgotPassword");
                  handleFocusAll();
                }}
              >
                <Text style={{ fontWeight: "500", color: parrotPlaceholderGrey }}>
                  Forgot password?
                </Text>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <TouchableOpacity
                  style={styles.selection2}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <Text style={styles.choiceText}>Login</Text>
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
                  setLoginOrRegister("Register1");
                  handleFocusAll();
                }}
              >
                <Text style={{ fontWeight: "500", color: parrotPlaceholderGrey }}>
                  Don't have an account?{" "}
                </Text>
                <Text style={{ fontWeight: "700", color: parrotPlaceholderGrey }}>
                  Sign up
                </Text>
              </TouchableOpacity>


              <View style={{
                flexDirection: "row", justifyContent: "center", alignItems: "center",
                marginTop: vh(6), marginBottom: vh(6),
              }}>
                <View style={{
                  backgroundColor: parrotLightBlue, height: 1, width: vw(25), marginRight: vh(1.5)
                }}>
                </View>
                <View style={{
                  alignItems: "center", backgroundColor: "", justifyContent: "center", padding: vh(0), borderRadius: vh(3)
                }}>
                  <Text style={{ fontWeight: "500", color: parrotTextDarkBlue }} > or </Text>
                </View>
                <View style={{ backgroundColor: parrotLightBlue, height: 1, width: vw(25), marginLeft: vh(1.5) }}>
                </View>
              </View>



              <View>



                <View style={styles.googleLoginContainer}>
                  <GoogleLoginButton />
                </View>


              </View>
            </View>
          </View>
        </>
      ) : loginOrRegister === "Register1" ? (
        // register screen - 1
        <>
          <View style={{ backgroundColor: "white" }}>
            <View style={styles.imagecontainer}>
              <LoginPageLogoComponent />

              <Image
                style={styles.imageLetsStart}
                source={require("../assets/letsStart.png")}

              />
            </View>
          </View>
          <View style={styles2.container}>
            {/* {isSuccessRegisterUser ? (
            <Text style={styles2.successMessage}>Registration successful!</Text>
          ) : ( */}
            <View style={styles2.formContainer}>
              <TextInput
                style={[
                  styles.input,
                  isFocusedUserNameR && styles.inputFocused,
                ]}
                onFocus={() => setIsFocusedUserNameR(true)}
                onBlur={() => setIsFocusedUserNameR(false)}
                placeholderTextColor={parrotPlaceholderGrey}
                placeholder="Username (max 25 characters)"
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
                    isFocusedPasswordR2 && styles.inputFocused,
                  ]}
                  onFocus={() => setIsFocusedPasswordR2(true)}
                  onBlur={() => setIsFocusedPasswordR2(false)}
                  placeholderTextColor={parrotPlaceholderGrey}
                  placeholder="Re-enter Password"
                  secureTextEntry={isPasswordHidden2}
                  value={passwordR2}
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

              <View style={styles.loginContainer}>
                <TouchableOpacity
                  style={[
                    styles.selection2,
                    isLoadingRegisterUser ||
                      passwordR === "" ||
                      passwordR2 === ""
                      ? styles.disabled
                      : null,
                  ]}
                  // onPress={handleRegister}
                  onPress={() => {
                    if (passwordR !== passwordR2) {
                      Toast.show({
                        type: "success",
                        text1: "Passwords do not match",
                        text2: "Please try again.",
                        visibilityTime: 1200,
                        topOffset: 100,
                      });
                    }
                    if (passwordR === passwordR2) {
                      handleRegister();
                    }
                  }}
                  disabled={
                    isLoadingRegisterUser ||
                    passwordR === "" ||
                    passwordR2 === ""
                  }
                >
                  <Text style={styles.choiceText}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.noAccount}
                  onPress={() => {
                    setLoginOrRegister("Login");
                    handleFocusAll();
                  }}
                >
                  <Text style={{ fontWeight: "500", color: parrotPlaceholderGrey }}>
                    Back to{" "}
                  </Text>
                  <Text style={{ fontWeight: "700", color: parrotPlaceholderGrey }}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      ) : loginOrRegister === "Register2" ? (
        <>
          <View style={{ backgroundColor: "white" }}>
            <View style={styles.imagecontainer}>
              <LoginPageLogoComponent />

              <Image
                style={styles.imageAlmostThere}
                source={require("../assets/almostthere.png")}
              />
            </View>
          </View>

          <View style={styles2.container}>
            <View style={styles2.formContainer}>
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
                    if (passwordR !== passwordR2) {
                      Toast.show({
                        type: "success",
                        text1: "Passwords do not match",
                        text2: "Please try again.",
                        visibilityTime: 1200,
                        topOffset: 100,
                      });
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
                    setLoginOrRegister("Login");
                    handleFocusAll();
                  }}
                >
                  <Text style={{ fontWeight: "500", color: parrotPlaceholderGrey }}>
                    Back to{" "}
                  </Text>
                  <Text style={{ fontWeight: "700", color: parrotPlaceholderGrey }}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      ) : loginOrRegister === "ForgotPassword" ? (
        <>
          <View style={{ backgroundColor: "white" }}>
            <View style={styles.imagecontainer}>
              <LoginPageLogoComponent />

              <Image
                style={styles.image}
                source={require("../assets/resetpassword.png")}
              />
            </View>
          </View>

          <View style={styles2.container}>
            <View style={styles2.formContainer}>
              <TextInput
                style={[styles.input, isFocusedEmailR && styles.inputFocused]}
                onFocus={() => setIsFocusedEmailR(true)}
                onBlur={() => setIsFocusedEmailR(false)}
                placeholderTextColor={parrotPlaceholderGrey}
                placeholder="Email"
                value={emailR}
                onChangeText={(text) => handleEmailRChange(text)}
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
                    setLoginOrRegister("Login");
                    handleFocusAll();
                  }}
                >
                  <Text style={{ fontWeight: "500", color: parrotPlaceholderGrey }}>
                    Back to{" "}
                  </Text>
                  <Text style={{ fontWeight: "700", color: parrotPlaceholderGrey }}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      ) : loginOrRegister === "UpdatePassword" ? (
        <>
          <View style={{ backgroundColor: "white" }}>
            <View style={styles.imagecontainer}>
              <LoginPageLogoComponent />
              <Image
                style={styles.imageAlmostThere}
                source={require("../assets/checkYourEmail.png")}
              />
            </View>
          </View>

          <View style={styles2.container}>
            <View style={styles2.formContainer}>
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
                    isFocusedPasswordR2 && styles.inputFocused,
                  ]}
                  onFocus={() => setIsFocusedPasswordR2(true)}
                  onBlur={() => setIsFocusedPasswordR2(false)}
                  placeholderTextColor={parrotPlaceholderGrey}
                  placeholder="Re-enter New Password"
                  secureTextEntry={isPasswordHidden2}
                  value={passwordR2}
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
                style={[styles.input, isFocusedCode2 && styles.inputFocused]}
                onFocus={() => setIsFocusedCode2(true)}
                onBlur={() => setIsFocusedCode2(false)}
                placeholderTextColor={parrotPlaceholderGrey}
                placeholder="Enter 6 Digit Code"
                value={registerCode2}
                onChangeText={(text) => handleRegisterCode2Change(text)}
              />

              <View style={styles.loginContainer}>
                <TouchableOpacity
                  style={[
                    styles.selection2,
                    isLoadingRegisterUser ||
                      passwordR === "" ||
                      passwordR2 === "" ||
                      registerCode2 === ""
                      ? styles.disabled
                      : null,
                  ]}
                  onPress={() => {
                    if (passwordR !== passwordR2) {
                      Toast.show({
                        type: "success",
                        text1: "Passwords do not match",
                        text2: "Please try again.",
                        visibilityTime: 1200,
                        topOffset: 100,
                      });
                    }
                    if (passwordR === passwordR2) {
                      handleResetPassword();
                    }
                  }}
                  disabled={
                    passwordR === "" ||
                    passwordR2 === "" ||
                    registerCode2 === ""
                  }
                >
                  <Text style={styles.choiceText}>Update Password</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.noAccount}
                  onPress={() => {
                    setLoginOrRegister("Login");
                    handleFocusAll();
                  }}
                >
                  <Text style={{ fontWeight: "500", color: parrotPlaceholderGrey }}>
                    Back to{" "}
                  </Text>
                  <Text style={{ fontWeight: "700", color: parrotPlaceholderGrey }}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      ) : null}
    </>
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
  forgotPassword: {
    paddingBottom: vh(1),
    alignSelf: "flex-end",
    paddingRight: vh(1.5),
  },
  noAccount: {
    paddingVertical: vh(1),
    alignSelf: "flex-end",
    flexDirection: "row",
    paddingRight: vh(1.5),
  },
  eyeIcon: {
    position: "absolute",
    right: vw(0),
    paddingVertical: vh(0.8),
    paddingHorizontal: vh(2),
  },
  inputsContainer: {
    width: vw(75),
  },
  choiceText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    textAlign: "center",
  },
  selection2: {
    marginHorizontal: vh(0.25),
    marginVertical: vh(0.25),
    paddingVertical: vh(1),
    backgroundColor: parrotBlue,
    borderRadius: vh(1.5),
    width: vw(75),
  },
  container: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    padding: 16,
  },
  formContainer: {
    height: vh(60),
    marginTop: vh(2),
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
    width: "100%",
    borderRadius: vh(1.5),
    color: parrotInputTextColor,
  },
  inputFocused: {
    borderColor: parrotBlueSemiTransparent3,
    borderWidth: 3,
  },
  imagecontainer: {
    marginTop: vh(10),
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
});

const styles2 = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "white",
  },
  formContainer: {
    marginTop: 50,
    width: "80%",
    backgroundColor: "white",
  },
});

export default LoginScreen;

const LoginPageLogoComponent = () => {
  return (
    <Image
      style={{ width: vh(12), height: vh(12) }}
      source={require("../assets/ParrotsLogo.png")}
    />
  );
};
