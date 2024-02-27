/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// RegisterPage.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
import { useLoginUserMutation } from "../slices/UserSlice";
import { TouchableOpacity } from "react-native";

const LoginScreen = ({ navigation }) => {
  console.log("hello from login screen");
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
        Email: 123456,
        Password: 123456,
      }).unwrap();

      setEmail("");
      setPassword("");
      setToken(response.token);
      setResponseEmail(response.email);
      setResponseUsername(response.userName);
      setUserId(response.userId);

      navigation.navigate("ProfileStack", {
        screen: "ProfileScreen",
        params: { userId: response.userId },
      });

      // navigation.navigate("ProfileScreen", { userId: response.userId });
    } catch (err) {
      console.error("Failed logging  in", err);
    }
  };

  return (
    <View style={styles.container}>
      {isSuccess ? (
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
