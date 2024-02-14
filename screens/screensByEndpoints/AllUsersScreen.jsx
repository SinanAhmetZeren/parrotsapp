/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, Text, Image, StyleSheet, Button } from "react-native";
import { useGetAllUsersQuery } from "../slices/UserSlice";
import { useSelector } from "react-redux";
import {
  selectUserIds,
  selectAllUsers,
  selectUsersById,
} from "../slices/UserSlice";

export default function AllUsersScreen({ navigation }) {
  //   const { message } = route.params;
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetAllUsersQuery();

  const allUsers = useSelector(selectAllUsers);
  console.log(allUsers[4]);

  const handlePrint = () => {
    let str1 = "c809e7c0-6e57-40eb-99e7-9e7ab2e9a17e";
    console.log(users.entities[str1]);
  };

  const handleRefetch = () => {
    console.log("refetching");
    refetch();
  };

  let content;

  if (isLoading) {
    content = <Text>Loading...</Text>;
  }

  if (isError) {
    content = (
      <View>
        <Text>Error fetching data</Text>
        <Text>{error.message}</Text>
        <Button title="Retry" onPress={refetch} />
      </View>
    );
  }

  if (users && users.ids && users.ids.length > 0) {
    content = users.ids.map((id) => (
      <View key={id}>
        <Text>User ID: {users.entities[id]?.id}</Text>
        <Text>User Name: {users.entities[id]?.userName}</Text>
      </View>
    ));
  }

  if (isSuccess) {
    content = users.ids.map((id) => (
      <View key={id}>
        {/* <Text>User ID: {users.entities[id]?.id}</Text> */}
        <Text>{users.entities[id]?.userName}</Text>
      </View>
    ));
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.spacer}>Favorites Screen</Text>
      <Image
        style={styles.logo}
        source={require("../assets/parrot-favorite.jpg")}
      />
      {content}
      <Button
        title="Handle Refetch"
        onPress={() => {
          handleRefetch();
        }}
      />
      <Button
        title="Handle Print"
        onPress={() => {
          handlePrint();
        }}
      />
      {/* <Button title="Print user" onPress={handleReload} /> */}
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
