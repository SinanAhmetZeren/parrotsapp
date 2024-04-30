/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// RegisterPage.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useLoginUserMutation } from "../slices/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateAsLoggedIn, updateAsLoggedOut } from "../slices/UserSlice";
import { useEffect } from "react";
import { vh, vw } from "react-native-expo-viewport-units";
import { Feather } from "@expo/vector-icons";
import { useRegisterUserMutation } from "../slices/UserSlice";

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [responseEmail, setResponseEmail] = useState("");
  const [responseUsername, setResponseUsername] = useState("");
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(false);
  const [isPasswordHidden2, setIsPasswordHidden2] = useState(false);
  const [loginOrRegister, setLoginOrRegister] = useState("Login");
  const [loginUser, { isLoading, isSuccess }] = useLoginUserMutation();
  const logoImageUrl =
    "https://measured-wolf-grossly.ngrok-free.app/Uploads/assets/parrots-logo.jpg";

  const [userNameR, setUserNameR] = useState("");
  const [emailR, setEmailR] = useState("");
  const [passwordR, setPasswordR] = useState("");
  const [passwordR2, setPasswordR2] = useState("");
  const [isFocusedEmailR, setIsFocusedEmailR] = useState(false);
  const [isFocusedPasswordR, setIsFocusedPasswordR] = useState(false);
  const [isFocusedPasswordR2, setIsFocusedPasswordR2] = useState(false);
  const [isFocusedUserNameR, setIsFocusedUserNameR] = useState(false);
  const [
    registerUser,
    { isLoading: isLoadingRegisterUser, isSuccess: isSuccessRegisterUser },
  ] = useRegisterUserMutation();
  const imageUrl =
    "https://measured-wolf-grossly.ngrok-free.app/Uploads/assets/parrots-logo.jpg";

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
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
        console.log("login response userName: ", loginResponse.userName);
        dispatch(
          updateAsLoggedIn({
            userId: loginResponse.userId,
            token: loginResponse.token,
            userName: loginResponse.userName,
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
      setEmailR("");
      setPasswordR("");
      setPasswordR2("");
      console.log("register  response: ", registerResponse);
      if (registerResponse.token) {
        dispatch(
          updateAsLoggedIn({
            userId: registerResponse.userId,
            token: registerResponse.token,
            userName: registerResponse.userName,
          })
        );
      }
    } catch (err) {
      Toast.show({
        type: "success",
        text1: "Could not register",
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

  return (
    <>
      <View style={{ backgroundColor: "white" }}>
        <View style={styles.imagecontainer}>
          <Image source={{ uri: logoImageUrl }} style={styles.image} />
        </View>
        <View style={styles.parrotsTextContainer}>
          <Text style={styles.parrotsText}>Welcome to Parrots</Text>
        </View>
      </View>
      {loginOrRegister === "Login" ? (
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
                  onPressIn={() => setIsPasswordHidden(false)}
                  onPressOut={() => setIsPasswordHidden(true)}
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
                setLoginOrRegister("Register");
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
      ) : (
        <View style={styles2.container}>
          {/* {isSuccessRegisterUser ? (
            <Text style={styles2.successMessage}>Registration successful!</Text>
          ) : ( */}
          <View style={styles2.formContainer}>
            <TextInput
              style={[styles.input, isFocusedUserNameR && styles.inputFocused]}
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
                placeholder="Password"
                secureTextEntry={isPasswordHidden}
                value={passwordR}
                onChangeText={(text) => handlePasswordRChange(text)}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPressIn={() => setIsPasswordHidden(false)}
                onPressOut={() => setIsPasswordHidden(true)}
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
                placeholder="Password"
                secureTextEntry={isPasswordHidden2}
                value={passwordR2}
                onChangeText={(text) => handlePasswordR2Change(text)}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPressIn={() => setIsPasswordHidden2(false)}
                onPressOut={() => setIsPasswordHidden2(true)}
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
                  isLoadingRegisterUser || passwordR === "" || passwordR2 === ""
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
                  isLoadingRegisterUser || passwordR === "" || passwordR2 === ""
                }
              >
                <Text style={styles.choiceText}>Register</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.noAccount}
                onPress={() => {
                  setLoginOrRegister("Login");
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
      )}
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
    color: "#2184c6",
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
    marginTop: vh(8),
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
    marginTop: vh(5),
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "rgba(74, 165, 225,0.5)",
    padding: vh(0.6),
    borderRadius: vh(10),
  },
  image: {
    width: vh(15),
    height: vh(15),
    borderRadius: vh(20),
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
