/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
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
} from "../slices/UserSlice";

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      setPasswordR("");
      setPasswordR2("");
      setRegisterCode2("");
      if (resetPasswordResponse.token) {
        console.log(
          "login response userName : ",
          resetPasswordResponse.userName
        );
        await dispatch(
          updateAsLoggedIn({
            userId: resetPasswordResponse.userId,
            token: resetPasswordResponse.token,
            userName: resetPasswordResponse.userName,
            profileImageUrl: resetPasswordResponse.profileImageUrl,
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
    try {
      const loginResponse = await loginUser({
        Email: email,
        Password: password,
      }).unwrap();
      setEmail("");
      setPassword("");
      console.log("login response: ", loginResponse);
      if (loginResponse.token) {
        console.log("login response userName : ", loginResponse.userName);
        await dispatch(
          updateAsLoggedIn({
            userId: loginResponse.userId,
            token: loginResponse.token,
            userName: loginResponse.userName,
            profileImageUrl: loginResponse.profileImageUrl,
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
      console.log("hello aaaaa");
      console.log("register  response ax: ", registerResponse);

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
      console.log("email: ", emailR);
      const confirmResponse = await confirmUser({
        email: emailR,
        code: registerCode,
      }).unwrap();

      setRegisterCode("");
      setEmailR("");

      console.log("register  response ax: ", confirmResponse);

      if (confirmResponse.token) {
        setLoginOrRegister("Login");
        handleFocusAll();

        await dispatch(
          updateAsLoggedIn({
            userId: confirmResponse.userId,
            token: confirmResponse.token,
            userName: confirmResponse.userName,
            profileImageUrl: confirmResponse.profileImageUrl,
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

  const handlePrintLocal = async () => {
    const storedToken = await AsyncStorage.getItem("storedToken");
    const storedUserId = await AsyncStorage.getItem("storedUserId");
    console.log(".....");
    console.log("stored user id: ", storedUserId);
    console.log("storedToken: ", storedToken?.substring(0, 10) + "...");
    console.log("username: ", username);
  };

  return (
    <>
      {/* <TouchableOpacity
        style={[
          styles.logoutBox,
          { marginHorizontal: vh(3), backgroundColor: "lightblue" },
        ]}
        onPress={() => {
          handlePrint();
        }}
        activeOpacity={0.2}
      >
        <View>
          <View style={styles.innerProfileContainer}>
            <Text
              style={{
                lineHeight: 22,
                marginLeft: vw(2),
                fontSize: 15,
                padding: vh(2),
              }}
            >
              Print
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.logoutBox,
          {
            marginHorizontal: vh(3),
            marginTop: vh(1),
            backgroundColor: "lightgreen",
          },
        ]}
        onPress={() => {
          handlePrintLocal();
        }}
        activeOpacity={0.2}
      >
        <View>
          <View style={styles.innerProfileContainer}>
            <Text
              style={{
                lineHeight: 22,
                marginLeft: vw(2),
                fontSize: 15,
                padding: vh(2),
              }}
            >
              Print Local
            </Text>
          </View>
        </View>
      </TouchableOpacity> */}

      {loginOrRegister === "Login" ? (
        <>
          <View style={{ backgroundColor: "white" }}>
            <View style={styles.imagecontainer}>
              <Image
                style={styles.image}
                source={require("../assets/welcomeBack.png")}
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
                  placeholderTextColor="#c3c3c3"
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
                    placeholderTextColor="#c3c3c3"
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
                      <Feather name="eye" size={24} color="#c3c3c3" />
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => {
                  console.log("forgot password");
                  setLoginOrRegister("ForgotPassword");
                  handleFocusAll();
                }}
              >
                <Text style={{ fontWeight: "500", color: "#939393" }}>
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

              <TouchableOpacity
                style={styles.noAccount}
                onPress={() => {
                  console.log("no account");
                  setLoginOrRegister("Register1");
                  handleFocusAll();
                }}
              >
                <Text style={{ fontWeight: "500", color: "#939393" }}>
                  Don't have an account?{" "}
                </Text>
                <Text style={{ fontWeight: "700", color: "#777777" }}>
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : loginOrRegister === "Register1" ? (
        // register screen - 1
        <>
          <View style={{ backgroundColor: "white" }}>
            <View style={styles.imagecontainer}>
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
                placeholderTextColor="#c3c3c3"
                placeholder="Username"
                value={userNameR}
                onChangeText={(text) => handleUserNameRChange(text)}
              />
              <TextInput
                style={[styles.input, isFocusedEmailR && styles.inputFocused]}
                onFocus={() => setIsFocusedEmailR(true)}
                onBlur={() => setIsFocusedEmailR(false)}
                placeholderTextColor="#c3c3c3"
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
                  placeholderTextColor="#c3c3c3"
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
                    <Feather name="eye" size={24} color="#c3c3c3" />
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
                  placeholderTextColor="#c3c3c3"
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
                    <Feather name="eye" size={24} color="#c3c3c3" />
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
                    // console.log("passwordr:", passwordR);
                    // console.log("passwordr2: ", passwordR2);
                    // console.log("is equal: ", passwordR2 === passwordR);
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
                  <Text style={{ fontWeight: "500", color: "#939393" }}>
                    Back to{" "}
                  </Text>
                  <Text style={{ fontWeight: "700", color: "#777777" }}>
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
              <Image
                style={styles.imageLetsStart}
                source={require("../assets/letsStart.png")}
              />
            </View>
          </View>

          <View style={styles2.container}>
            <View style={styles2.formContainer}>
              <TextInput
                style={[styles.input, isFocusedCode && styles.inputFocused]}
                onFocus={() => setIsFocusedCode(true)}
                onBlur={() => setIsFocusedCode(false)}
                placeholderTextColor="#c3c3c3"
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
                  <Text style={{ fontWeight: "500", color: "#939393" }}>
                    Back to{" "}
                  </Text>
                  <Text style={{ fontWeight: "700", color: "#777777" }}>
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
              <Image
                style={styles.image}
                source={require("../assets/welcomeBack.png")}
              />
            </View>
          </View>

          <View style={styles2.container}>
            <View style={styles2.formContainer}>
              <TextInput
                style={[styles.input, isFocusedEmailR && styles.inputFocused]}
                onFocus={() => setIsFocusedEmailR(true)}
                onBlur={() => setIsFocusedEmailR(false)}
                placeholderTextColor="#c3c3c3"
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
                  <Text style={{ fontWeight: "500", color: "#939393" }}>
                    Back to{" "}
                  </Text>
                  <Text style={{ fontWeight: "700", color: "#777777" }}>
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
              <Image
                style={styles.image}
                source={require("../assets/welcomeBack.png")}
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
                  placeholderTextColor="#c3c3c3"
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
                    <Feather name="eye" size={24} color="#c3c3c3" />
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
                  placeholderTextColor="#c3c3c3"
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
                    <Feather name="eye" size={24} color="#c3c3c3" />
                  </Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={[styles.input, isFocusedCode2 && styles.inputFocused]}
                onFocus={() => setIsFocusedCode2(true)}
                onBlur={() => setIsFocusedCode2(false)}
                placeholderTextColor="#c3c3c3"
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
                  <Text style={{ fontWeight: "500", color: "#939393" }}>
                    Back to{" "}
                  </Text>
                  <Text style={{ fontWeight: "700", color: "#777777" }}>
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
    backgroundColor: "rgba(24,111,241,0.3)",
  },
  parrotsTextContainer: {
    marginBottom: vh(3),
    alignSelf: "center",
  },
  parrotsText: {
    fontSize: 30,
    fontWeight: "800",
    fontStyle: "italic",
    // color: "#2184c6",
    color: "rgba(74, 165, 225,0.75)",
  },
  loginContainer: {
    marginTop: vh(2),
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
    backgroundColor: "rgb(24,111,241)",
    borderRadius: vh(1.5),
    width: vw(75),
  },
  modalView2: {
    backgroundColor: "#76bae8",
    borderRadius: vh(3),
    borderWidth: 2,
    borderColor: "#15537d",
    width: vw(25),
    alignSelf: "center",
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
    borderColor: "#c3c3c3",
    borderWidth: 1,
    marginBottom: vh(1),
    padding: 8,
    width: "100%",
    borderRadius: vh(1.5),
  },
  inputFocused: {
    borderColor: "#76bae8",
    borderWidth: 3,
  },
  imagecontainer: {
    marginTop: vh(10),
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    // backgroundColor: "rgba(74, 165, 225,0.15)",
    // padding: vh(1),
    // borderRadius: vh(10),
  },
  image: {
    width: vw(70),
    height: vh(15),
  },
  imageLetsStart: {
    width: vw(72),
    height: vh(7),
  },
  welcomeText: {
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 30,
    fontWeight: "900",
    color: "#c3c3c3",
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
  input: {
    backgroundColor: "white",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
    width: "100%",
  },

  image: {
    width: 200,
    height: 200,
    borderRadius: 200,
  },
});

export default LoginScreen;
