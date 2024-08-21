/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";

export const SearchUsersComponent = ({ searchResults }) => {
  const navigation = useNavigation();

  return (
    <>
      {searchResults
        ? searchResults.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Messages", {
                    screen: "ProfileScreenPublic",
                    params: { userId: item.id },
                  });
                }}
                key={index}
                style={styles.searchUserContainer}
              >
                <Image
                  source={{
                    uri: `${API_URL}/Uploads/UserImages/${item.profileImageUrl}`,
                  }}
                  style={styles.userImage}
                />
                <View style={styles.userNameContainer}>
                  <Text style={styles.userName}>{item.userName}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        : null}
    </>
  );
};

const styles = StyleSheet.create({
  userNameContainer: {
    justifyContent: "center",
    marginLeft: vh(2),
  },
  userName: {
    color: "#3c9dde",
    fontSize: 16,
    fontWeight: "800",
  },
  searchUserContainer: {
    flexDirection: "row",
    backgroundColor: "#f6f6f6",
    margin: vh(1),
    padding: vh(1),
    borderRadius: vh(6),
  },
  userImage: {
    height: vh(8),
    width: vh(8),
    borderRadius: vh(6),
  },
});
