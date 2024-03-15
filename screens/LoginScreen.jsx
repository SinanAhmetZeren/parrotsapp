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
} from "react-native";
import { useLoginUserMutation } from "../slices/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateAsLoggedIn, updateAsLoggedOut } from "../slices/UserSlice";
import { useEffect } from "react";

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

  let x = 1;

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
        Email: "sinanzen@gmail.com",
        Password: 123456,
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
        visibilityTime: 5000,
        topOffset: 350,
      });
    }
  };

  return (
    <View style={styles.container}>
      {x == 0 ? (
        <View style={styles.output}>
          <Text style={styles.successMessage}>Login successful!{"\n"}</Text>
          <Text style={styles.successMessage}>
            Email from token:{"\n"}
            {responseEmail}
            {"\n"}
          </Text>
          <Text style={styles.successMessage}>
            UserName from token:{"\n"}
            {responseUsername}
            {"\n"}
          </Text>
          <Text style={styles.successMessage}>
            userId from token:{"\n"}
            {userId}
            {"\n"}
          </Text>
          <Button
            title="Printout"
            onPress={handlePrintout}
            disabled={isLoading}
          />
          <Button title="Logout" onPress={handleLogout} disabled={isLoading} />
        </View>
      ) : (
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
          <Button title="Login" onPress={handleLogin} disabled={isLoading} />
          <Button
            title="Printout"
            onPress={handlePrintout}
            disabled={isLoading}
          />
          <Button title="Logout" onPress={handleLogout} disabled={isLoading} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#186ff1",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  formContainer: {
    marginTop: 50,
    width: "80%",
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
  imagecontainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 200,
    width: 200,
    height: 200,
    alignSelf: "center",
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 20,
      },
    }),
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
    fontWeight: "900",
    color: "white",
  },
});

export default LoginScreen;
