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

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [responseEmail, setResponseEmail] = useState("");
  const [responseUsername, setResponseUsername] = useState("");

  const [loginUser, { isLoading, isSuccess }] = useLoginUserMutation();
  const imageUrl =
    "https://measured-wolf-grossly.ngrok-free.app/Uploads/assets/parrots-logo.jpg";

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const state_token = useSelector((state) => state.users.token);
  const state_userId = useSelector((state) => state.users.userId);
  const state_isLoggedIn = useSelector((state) => state.users.isLoggedIn);

  const [printoutCounter, setPrintoutCounter] = useState(0);

  const handlePrintout = () => {
    setPrintoutCounter((prev) => prev + 1);
  };

  const handleLogout = async () => {
    dispatch(updateAsLoggedOut());
  };

  const handleLogin = async () => {
    try {
      const response = await loginUser({
        // Email: "sinanzen@gmail.com",
        // Password: 123456,
        Email: email,
        Password: password,
      }).unwrap();

      setEmail("");
      setPassword("");
      setToken(response.token);
      setResponseEmail(response.email);
      setResponseUsername(response.userName);
      setUserId(response.userId);

      if (response.token) {
        dispatch(
          updateAsLoggedIn({ userId: response.userId, token: response.token })
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

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.imagecontainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
        <View style={styles.welcomeBox}>
          <Text style={styles.welcomeText}>Welcome to Parrots</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => handleEmailChange(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => handlePasswordChange(text)}
        />
        {/* <Button title="Login" onPress={handleLogin} disabled={isLoading} /> */}

        <View style={styles.modalView2}>
          <TouchableOpacity
            style={styles.selection2}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.choiceText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  choiceText: {
    fontSize: 20,
    fontWeight: "500",
    color: "white",
  },
  selection2: {
    marginHorizontal: vh(0.5),
    marginVertical: vh(0.5),
    paddingHorizontal: vh(2),
    paddingVertical: vh(1),
    backgroundColor: "#2184c6",
    borderRadius: vh(2.5),
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
    backgroundColor: "#186ff1",
    justifyContent: "center",
    padding: 16,
  },
  formContainer: {
    height: vh(60),
    marginTop: vh(15),
  },
  input: {
    backgroundColor: "white",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
    width: "100%",
    borderRadius: vh(2),
  },
  imagecontainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 200,
    width: 200,
    height: 200,
    alignSelf: "center",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 200,
    padding: 40,
    backgroundColor: "red",
  },
  output: {
    flexDirection: "column",
  },
  welcomeBox: {
    marginBottom: 20,
  },
  welcomeText: {
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 30,
    fontWeight: "500",
    color: "white",
  },
});

export default LoginScreen;
