/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { ParrotsStdText } from "./ParrotsStdText";
import { vh, vw } from "react-native-expo-viewport-units";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";
import { parrotBlue, parrotGreen, parrotLightBlue } from "../assets/color";
import { Feather } from "@expo/vector-icons";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

export const BidBookmarkPill = ({ bids, height }) => {
  const navigation = useNavigation();

  if (!bids || bids.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ParrotsStdText style={styles.emptyText}>No bids yet</ParrotsStdText>
      </View>
    );
  }

  return (
    <ScrollView style={{ height }}>
      {bids.map((item) => (
        <View key={item.bidId} style={styles.pillWrapper}>
          <View style={styles.pill}>
            <Image
              source={{ uri: item.profileImageThumbnail || `${API_URL}/placeholder` }}
              style={styles.thumbnail}
            />
            <View style={styles.info}>
              <ParrotsStdText style={styles.voyageName} numberOfLines={1}>
                {item.voyageName}
              </ParrotsStdText>
              <ParrotsStdText style={styles.dates}>
                {formatDate(item.startDate)} – {formatDate(item.endDate)}
              </ParrotsStdText>
              <View style={styles.priceRow}>
                <View style={[styles.statusDot, { backgroundColor: item.accepted ? parrotGreen : parrotBlue }]} />
                <ParrotsStdText style={styles.price}>${item.offerPrice}</ParrotsStdText>
              </View>
            </View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                navigation.navigate("Favorites", {
                  screen: "VoyageDetail",
                  params: { voyageId: item.voyageId },
                })
              }
            >
              <Feather name="arrow-right" size={18} color={parrotBlue} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pillWrapper: {
    width: vw(90),
    marginLeft: vw(5),
    marginTop: vh(2),
  },
  pill: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 119, 234, 0.02)",
    borderRadius: vh(6),
    paddingHorizontal: vh(1),
    paddingVertical: vh(0.8),
    alignItems: "center",
  },
  thumbnail: {
    height: vh(6.5),
    width: vh(6.5),
    borderRadius: vh(1.5),
  },
  info: {
    flex: 1,
    marginLeft: vh(1.5),
  },
  voyageName: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 15,
    color: parrotLightBlue,
  },
  dates: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    color: "rgba(0,0,0,0.45)",
    marginTop: 2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  price: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: "rgba(0,0,0,0.55)",
  },
  actionButton: {
    padding: vh(1),
    borderRadius: vh(4),
    backgroundColor: "rgba(30, 111, 217, 0.08)",
    marginLeft: vh(1),
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: vh(5),
  },
  emptyText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: parrotBlue,
    opacity: 0.5,
  },
});
