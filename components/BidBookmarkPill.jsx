/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Platform } from "react-native";
import { ParrotsStdText } from "./ParrotsStdText";
import { vh } from "react-native-expo-viewport-units";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";
import { Feather, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const formatDateRange = (start, end) => {
  if (!start) return "";
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  const fmt = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  if (!e || fmt(s) === fmt(e)) return fmt(s);
  return `${fmt(s)} – ${fmt(e)}`;
};

export const BidBookmarkPill = ({ bids, height }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  if (!bids || bids.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ParrotsStdText style={styles.emptyText}>No bids yet</ParrotsStdText>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ height }}
      contentContainerStyle={[
        styles.list,
        Platform.OS === "ios" && { paddingBottom: insets.bottom + (vh(100) - insets.top - insets.bottom) * 0.08 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {bids.map((item) => (
        <TouchableOpacity
          key={item.bidId}
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("VoyageDetail", { voyagePublicId: item.voyagePublicId })}
        >
          <Image
            source={{ uri: item.profileImageThumbnail || `${API_URL}/placeholder` }}
            style={styles.thumbnail}
          />
          <View style={styles.info}>
            <ParrotsStdText style={styles.name} numberOfLines={1}>{item.voyageName}</ParrotsStdText>
            <View style={styles.metaRow}>
              {item.accepted
                ? <View style={styles.pillOk}>
                    <ParrotsStdText style={styles.pillOkText}>Accepted</ParrotsStdText>
                  </View>
                : <View style={styles.pillWait}>
                    <ParrotsStdText style={styles.pillWaitText}>Pending</ParrotsStdText>
                  </View>
              }
              <View style={styles.datePill}>
                <MaterialCommunityIcons name="calendar-outline" size={11} color="#4A5A6A" />
                <ParrotsStdText style={styles.datePillText} numberOfLines={1}>
                  {formatDateRange(item.startDate, item.endDate)}
                </ParrotsStdText>
              </View>
              <View style={styles.pricePill}>
                <ParrotsStdText style={styles.price}>
                  {item.offerPrice > 0 ? `$ ${item.offerPrice}` : "FREE"}
                </ParrotsStdText>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.pinBtn}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate("Favorites", {
                screen: "VoyageDetail",
                params: { voyagePublicId: item.voyagePublicId },
              })
            }
          >
            <Feather name="map-pin" size={16} color="#0A5FBF" />
          </TouchableOpacity>
        </TouchableOpacity>
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
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E3E9F0",
    borderRadius: 16,
    padding: 9,
    paddingRight: 10,
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: 26,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 5,
  },
  name: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
    color: "#0A5FBF",
    letterSpacing: -0.1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexWrap: "nowrap",
    minWidth: 0,
  },
  pillWait: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#EAF2FD",
    borderRadius: 999,
    paddingVertical: 3,
    width: 60,
    flexShrink: 0,
  },
  pillWaitText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 10.5,
    color: "#0A5FBF",
  },
  pillOk: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#E4F5E9",
    borderRadius: 999,
    paddingVertical: 3,
    width: 60,
    flexShrink: 0,
  },
  pillOkText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 10.5,
    color: "#0B6B4E",
  },
  datePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F4F7FB",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexShrink: 1,
    minWidth: 0,
  },
  datePillText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 10.5,
    color: "#4A5A6A",
    flexShrink: 1,
  },
  pricePill: {
    backgroundColor: "#F4F7FB",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexShrink: 0,
  },
  price: {
    fontFamily: "Nunito_700Bold",
    fontSize: 10.5,
    color: "#0A5FBF",
    letterSpacing: -0.1,
  },
  pinBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E3E9F0",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
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
