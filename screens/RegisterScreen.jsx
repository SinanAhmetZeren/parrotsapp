/* eslint-disable no-unused-vars */
// RegisterPage.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
import { useRegisterUserMutation } from "../slices/UserSlice";
import { TouchableOpacity } from "react-native";

const RegisterScreen = () => {
  const [userNameR, setUserNameR] = useState("");
  const [emailR, setEmailR] = useState("");
  const [passwordR, setPasswordR] = useState("");

  const [registerUser, { isLoading, isSuccess }] = useRegisterUserMutation();
  const imageUrl =
    "https://measured-wolf-grossly.ngrok-free.app/Uploads/assets/parrots-logo-new11.jpeg";

  const handleEmailRChange = (text) => {
    setEmailR(text);
  };
  const handleUserNameRChange = (text) => {
    setUserNameR(text);
  };
  const handlePasswordRChange = (text) => {
    setPasswordR(text);
  };

  const handleRegister = async () => {
    try {
      await registerUser({
        Email: emailR,
        UserName: userNameR,
        Password: passwordR,
      }).unwrap();
      setUserNameR("");
      setEmailR("");
      setPasswordR("");
    } catch (err) {
      console.error("Failed to register user", err);
    }
  };

  return (
    <View style={styles2.container}>
      {isSuccess ? (
        <Text style={styles2.successMessage}>Registration successful!</Text>
      ) : (
        <View style={styles2.formContainer}>
          <View style={styles2.imagecontainer}>
            <Image source={{ uri: imageUrl }} style={styles2.image} />
          </View>
          <TextInput
            style={styles2.input}
            placeholder="Username"
            value={userNameR}
            onChangeText={(text) => handleUserNameRChange(text)}
          />
          <TextInput
            style={styles2.input}
            placeholder="Email"
            value={emailR}
            onChangeText={(text) => handleEmailRChange(text)}
          />
          <TextInput
            style={styles2.input}
            placeholder="Password"
            secureTextEntry
            value={passwordR}
            onChangeText={(text) => handlePasswordRChange(text)}
          />
          <Button
            title="Register"
            onPress={handleRegister}
            disabled={isLoading}
          />
        </View>
      )}
    </View>
  );
};

const styles2 = StyleSheet.create({
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
});

export default RegisterScreen;
