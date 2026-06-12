import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { View,  TouchableOpacity, Image, StyleSheet, ScrollView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { vh, vw } from "react-native-expo-viewport-units";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";
import { parrotBlue, parrotCream, parrotLightBlue } from "../assets/color";
import { Shadow } from "react-native-shadow-2";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

export const SearchUsersComponent = ({ searchResults, height = Platform.OS === "ios" ? vh(60) : vh(70) }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={{ height }}>
      {searchResults
        && searchResults.map((item, index) => {
          return (
            <View key={item.publicId} style={{ width: vw(90), marginLeft: vw(5), borderRadius: vh(6), marginTop: vh(2) }}>
              <View>
                <View style={styles.searchUserContainer}>
                  <View style={styles.profileSection}>
                    <Image
                      source={{
                        uri: `${item.profileImageThumbnailUrl || item.profileImageUrl}`,
                      }}
                      style={styles.userImage}
                    />
                    <View style={styles.userNameContainer}>
                      <ParrotsStdText style={styles.userName}>{item.userName}</ParrotsStdText>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Messages", {
                        screen: "ProfileScreenPublic",
                        params: { publicId: item.publicId, userName: item.userName, userId: item.id },
                      });
                    }}
                    style={styles.actionButton}
                  >
                    <Feather name="user" size={18} color={parrotBlue} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Messages", {
                        screen: "ConversationDetailScreen",
                        params: {
                          conversationUserId: item.id,
                          profileImg: item.profileImageUrl,
                          name: item.userName,
                          publicId: item.publicId,
                        },
                      });
                    }}
                    style={[styles.actionButton, { marginRight: vh(0.5) }]}
                  >
                    <Feather name="mail" size={18} color={parrotBlue} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  userNameContainer: {
    justifyContent: "center",
    marginLeft: vh(2),
  },
  userName: {
    fontFamily: "Nunito_800ExtraBold",
    color: parrotLightBlue,
    fontSize: 16,
  },
  searchUserContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 119, 234, 0.02)",
    padding: vh(.5),
    paddingHorizontal: vh(1),
    borderRadius: vh(6),
    width: vw(90),
    alignItems: "center",
  },
  profileSection: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  userImage: {
    height: vh(6),
    width: vh(6),
    borderRadius: vh(6),
  },
  actionButton: {
    padding: vh(1),
    borderRadius: vh(4),
    backgroundColor: "rgba(30, 111, 217, 0.08)",
    marginLeft: vh(1),
  },
});
