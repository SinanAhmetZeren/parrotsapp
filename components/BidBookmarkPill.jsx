/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { ParrotsStdText } from "./ParrotsStdText";
import { vh, vw } from "react-native-expo-viewport-units";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";
import { parrotBlue, parrotGreen, parrotLightBlue } from "../assets/color";
import { Feather, FontAwesome6 } from "@expo/vector-icons";

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
        <TouchableOpacity
          key={item.bidId}
          style={styles.pillWrapper}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("VoyageDetail", { voyageId: item.voyageId })}
        >
          <View style={styles.pill}>
            <Image
              source={{ uri: item.profileImageThumbnail || `${API_URL}/placeholder` }}
              style={styles.thumbnail}
            />
            <View style={styles.info}>
              <ParrotsStdText style={styles.voyageName} numberOfLines={1}>
                {item.voyageName}
              </ParrotsStdText>
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <View style={[styles.bidBadge, { backgroundColor: item.accepted ? parrotGreen : parrotBlue }]}>
                    <FontAwesome6 name={item.accepted ? "circle-check" : "clock"} size={11} color="white" />
                  </View>
                </View>
                <ParrotsStdText style={styles.dates} numberOfLines={1}>
                  {formatDate(item.startDate)} – {formatDate(item.endDate)}
                </ParrotsStdText>
                <ParrotsStdText style={styles.price} numberOfLines={1}>${item.offerPrice}</ParrotsStdText>
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
              <Feather name="map-pin" size={18} color={parrotBlue} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
  bidBadge: {
    borderRadius: vw(3),
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  detailIcon: {
    width: vw(7),
    alignItems: "flex-start",
  },
  dates: {
    width: vw(30),
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    color: "rgba(0,0,0,0.45)",
  },
  price: {
    width: vw(18),
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
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
