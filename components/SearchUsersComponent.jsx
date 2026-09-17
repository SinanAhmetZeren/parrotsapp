import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, ScrollView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { vh, vw } from "react-native-expo-viewport-units";
import { useNavigation } from "@react-navigation/native";
import { Feather, Ionicons } from "@expo/vector-icons";

export const SearchUsersComponent = ({ searchResults, height = Platform.OS === "ios" ? vh(60) : vh(70) }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ height }}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    >
      {searchResults?.map((item) => (
        <View key={item.publicId} style={styles.card}>
          <Image
            source={{ uri: item.profileImageThumbnailUrl || item.profileImageUrl }}
            style={styles.avatar}
          />
          <View style={styles.right}>
            {/* Row 1: name/title + buttons */}
            <View style={styles.row1}>
              <View style={styles.nameBlock}>
                <ParrotsStdText style={styles.name} numberOfLines={1}>{item.userName}</ParrotsStdText>
                {item.title ? (
                  <ParrotsStdText style={styles.title} numberOfLines={1}>{item.title}</ParrotsStdText>
                ) : null}
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() =>
                    navigation.navigate("Messages", {
                      screen: "ProfileScreenPublic",
                      params: { publicId: item.publicId, userName: item.userName, userId: item.id },
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Ionicons name="person-circle-outline" size={18} color="#0A5FBF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() =>
                    navigation.navigate("Messages", {
                      screen: "ConversationDetailScreen",
                      params: {
                        conversationUserId: item.id,
                        profileImg: item.profileImageUrl,
                        name: item.userName,
                        publicId: item.publicId,
                      },
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Feather name="mail" size={15} color="#0A5FBF" />
                </TouchableOpacity>
              </View>
            </View>
            {/* Row 2: bio full width */}
            {item.bio ? (
              <ParrotsStdText style={styles.bio} numberOfLines={3}>{item.bio}</ParrotsStdText>
            ) : null}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: 7,
    paddingBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E8E3DC",
    borderRadius: 16,
    paddingHorizontal: 11,
    paddingVertical: 8,
    height: 114,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    flexShrink: 0,
  },
  right: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  row1: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  nameBlock: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  name: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14.5,
    color: "#0A5FBF",
    letterSpacing: -0.1,
  },
  title: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 11.5,
    color: "#E07B0A",
    letterSpacing: -0.005,
  },
  bio: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 11.5,
    color: "#4A5A6A",
  },
  actions: {
    flexDirection: "row",
    gap: 14,
    flexShrink: 0,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E8E3DC",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
