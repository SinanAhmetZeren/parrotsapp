/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, Text, Image, StyleSheet, Button } from "react-native";
import { useGetAllUsersQuery } from "../slices/UserSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  selectAllUsers,
  selectUsersById,
  selectUserIds,
} from "../slices/UserSlice";

export default function FavoritesScreen({ navigation }) {
  //   const { message } = route.params;
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
  } = useGetAllUsersQuery("getAllUsers");

  const usersState = useSelector(selectAllUsers);
  // console.log("Users State:", usersState);
  // console.log(users);

  let content;
  if (isLoading) {
    content = <Text>Loading...</Text>;
  } else if (isSuccess) {
    content = users.ids.map((id) => (
      <View key={id}>
        <Text>User ID: {users.entities[id].id}</Text>
        <Text>User Name: {users.entities[id].userName}</Text>
      </View>
    ));
  } else if (isError) {
    content = <Text>error</Text>;
  }
  // console.log(users);
  // console.log(content);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.spacer}>Favorites Screen</Text>
      <Image
        style={styles.logo}
        source={require("../assets/parrot-favorite.jpg")}
      />
      {content}
      <Button
        title="Fetch All Users"
        onPress={() => {
          console.log("hello from button");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    height: 150,
    width: 150,
  },
  spacer: {
    marginTop: 10,
    marginBottom: 10,
  },
});
