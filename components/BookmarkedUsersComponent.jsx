import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, ScrollView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { vh } from "react-native-expo-viewport-units";
import { useNavigation } from "@react-navigation/native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { API_URL } from "@env";

export const BookmarkedUsersComponent = ({ bookmarks, height }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ParrotsStdText style={styles.emptyText}>No bookmarked people yet</ParrotsStdText>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ height }}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    >
      {bookmarks.map((item) => (
        <View key={item.id ?? item.bookmarkedUserId} style={styles.card}>
          <Image
            source={{ uri: item.profileImageThumbnailUrl || item.profileImageUrl || `${API_URL}/placeholder` }}
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
                    navigation.navigate("ProfileScreenPublic", {
                      publicId: item.publicId,
                      userName: item.userName,
                      userId: item.bookmarkedUserId,
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Ionicons name="person-circle-outline" size={22} color="#0A5FBF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() =>
                    navigation.navigate("Messages", {
                      screen: "ConversationDetailScreen",
                      params: {
                        conversationUserId: item.bookmarkedUserId,
                        profileImg: item.profileImageUrl,
                        name: item.userName,
                        publicId: item.publicId,
                      },
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Feather name="mail" size={19} color="#0A5FBF" />
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E3DC",
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
    borderRadius: 99,
    backgroundColor: "rgba(10, 119, 234, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: vh(5),
  },
  emptyText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#0A77EA",
    opacity: 0.5,
  },
});
