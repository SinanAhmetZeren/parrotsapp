/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";
import { parrotCream, parrotLightBlue } from "../assets/color";
import { Shadow } from "react-native-shadow-2";

export const SearchUsersComponent = ({ searchResults }) => {
  const navigation = useNavigation();

  return (
    <>
      {searchResults
        && searchResults.map((item, index) => {
          console.log("item: ", item.publicId, item.userName);
          return (
            <View key={item.publicId} style={{ width: vw(90), marginLeft: vw(5), borderRadius: vh(6), marginTop: vh(2) }}>
              <Shadow
                distance={7}
                offset={[0, 0]}
                startColor="rgba(0,0,0,0.08)"
                finalColor="rgba(0,0,0,0.23)"
                radius={12}
                key={item.id}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Messages", {
                      screen: "ProfileScreenPublic",
                      params: { publicId: item.publicId, userName: item.userName },
                    });
                  }}
                  key={index}
                  style={styles.searchUserContainer}
                >
                  <Image
                    source={{
                      uri: `${item.profileImageUrl}`,
                    }}
                    style={styles.userImage}
                  />
                  <View style={styles.userNameContainer}>
                    <Text style={styles.userName}>{item.userName}</Text>
                  </View>
                </TouchableOpacity>
              </Shadow>
            </View>


          );
        })
      }
    </>
  );
};

const styles = StyleSheet.create({
  userNameContainer: {
    justifyContent: "center",
    marginLeft: vh(2),
  },
  userName: {
    color: parrotLightBlue,
    fontSize: 16,
    fontWeight: "800",
  },
  searchUserContainer: {
    flexDirection: "row",
    backgroundColor: parrotCream,
    backgroundColor: "white",
    padding: vh(.5),
    paddingHorizontal: vh(1),
    borderRadius: vh(6),
    width: vw(90)
  },
  userImage: {
    height: vh(6),
    width: vh(6),
    borderRadius: vh(6),
  },
});
