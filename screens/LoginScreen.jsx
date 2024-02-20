/* eslint-disable no-unused-vars */
// RegisterPage.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
import { useLoginUserMutation } from "../slices/UserSlice";
import { TouchableOpacity } from "react-native";
import JWT from "expo-jwt";
import { coreModule } from "@reduxjs/toolkit/query";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [decodedToken, setDecodedToken] = useState("");

  const [loginUser, { isLoading, isSuccess }] = useLoginUserMutation();
  const imageUrl =
    "https://measured-wolf-grossly.ngrok-free.app/Uploads/assets/parrots-logo.jpg";

  const handleEmailChange = (text) => {
    console.log("Current Email:", text);
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    console.log("Current password:", text);
    setPassword(text);
  };

  const handleLogin = async () => {
    try {
      const response = await loginUser({
        Email: email,
        Password: password,
      }).unwrap();
      setEmail("");
      setPassword("");
      setToken(response.token);
      const secretKey =
        "f09mdn*0rıe9895uofs0fı905548582uja09s7f09a7a097fda90u90275irjh30720fh097";
      const decodedToken = JWT.decode(response.token, secretKey);
      setDecodedToken(decodedToken);
    } catch (err) {
      console.error("Failed logging in", err);
    }
  };

  return (
    <View style={styles.container}>
      {isSuccess ? (
        <View style={styles.output}>
          <Text style={styles.successMessage}>Login successful!{"\n"}</Text>
          <Text style={styles.successMessage}>
            Email from token:{"\n"}
            {decodedToken.email}
            {"\n"}
          </Text>
          <Text style={styles.successMessage}>
            User id from token:{"\n"}
            {decodedToken.nameid}
            {"\n"}
          </Text>
        </View>
      ) : (
        <View style={styles.formContainer}>
          <View style={styles.imagecontainer}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
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
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "pink",
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
    // backgroundColor: "red",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 200,
  },
  output: {
    flexDirection: "column",
  },
});

export default LoginScreen;
