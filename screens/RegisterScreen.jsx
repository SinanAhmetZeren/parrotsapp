/* eslint-disable no-unused-vars */
// RegisterPage.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
import { useRegisterUserMutation } from "../slices/UserSlice";
import { TouchableOpacity } from "react-native";

const RegisterScreen = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [registerUser, { isLoading, isSuccess }] = useRegisterUserMutation();
  const imageUrl =
    "https://measured-wolf-grossly.ngrok-free.app/Uploads/assets/parrots-logo.jpg";

  const handleEmailChange = (text) => {
    setEmail(text);
  };
  const handleUserNameChange = (text) => {
    setUserName(text);
  };
  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleRegister = async () => {
    try {
      await registerUser({
        Email: email,
        UserName: userName,
        Password: password,
      }).unwrap();
      setUserName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Failed to register user", err);
    }
  };

  return (
    <View style={styles.container}>
      {isSuccess ? (
        <Text style={styles.successMessage}>Registration successful!</Text>
      ) : (
        <View style={styles.formContainer}>
          <View style={styles.imagecontainer}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={userName}
            onChangeText={(text) => handleUserNameChange(text)}
          />
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
});

export default RegisterScreen;
