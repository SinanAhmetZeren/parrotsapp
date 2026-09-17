import { ParrotsStdText } from "../components/ParrotsStdText";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Platform,
  BackHandler,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LoadingLogo from "../components/LoadingLogo";
import { vw, vh } from "react-native-expo-viewport-units";
import FavoriteVoyageListVertical from "../components/FavoriteVoyageListVertical";
import FavoriteVehicleList from "../components/FavoriteVehicleList";
import { BookmarkedUsersComponent } from "../components/BookmarkedUsersComponent";
import { ConnectSelectionComponent } from "../components/ConnectSelectionComponent";
import { useGetFavoriteVoyagesByUserIdQuery } from "../slices/VoyageSlice";
import { useGetFavoriteVehiclesByUserByIdQuery } from "../slices/VehicleSlice";
import { useGetBookmarksQuery } from "../slices/UserSlice";
import { useSelector } from "react-redux";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import { parrotBananaLeafGreen, parrotBlue, parrotCream, parrotPistachioGreen } from "../assets/color";

const TABS = [
  { id: 1, label: "Voyages" },
  { id: 2, label: "Vehicles" },
  { id: 3, label: "People" },
];

export default function FavoritesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const userId = useSelector((state) => state.users.userId);
  const [selectedTab, setSelectedTab] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: voyagesData,
    isError: isErrorVoyages,
    isLoading: isLoadingVoyages,
    refetch: refetchVoyages,
  } = useGetFavoriteVoyagesByUserIdQuery(userId);

  const {
    data: vehiclesData,
    isError: isErrorVehicles,
    isLoading: isLoadingVehicles,
    refetch: refetchVehicles,
  } = useGetFavoriteVehiclesByUserByIdQuery(userId);

  const {
    data: bookmarksRaw,
    isError: isErrorBookmarks,
    isLoading: isLoadingBookmarks,
    refetch: refetchBookmarks,
  } = useGetBookmarksQuery(undefined, { skip: selectedTab !== 3 });

  const bookmarks = bookmarksRaw?.data ?? bookmarksRaw ?? [];

  useFocusEffect(useCallback(() => {
    console.log("entered favorites screen --> ");
    refetchVoyages().catch(() => {});
    refetchVehicles().catch(() => {});
  }, [refetchVoyages, refetchVehicles]));

  useFocusEffect(useCallback(() => {
    if (selectedTab === 1) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      setSelectedTab(1);
      return true;
    });
    return () => sub.remove();
  }, [selectedTab]));

  useCallback(() => {
    const unsub = navigation.getParent()?.addListener("tabPress", () => setSelectedTab(1));
    return unsub;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchVoyages();
      await refetchVehicles();
      if (selectedTab === 3) await refetchBookmarks();
    } catch {}
    setRefreshing(false);
  };

  const hasError = isErrorVoyages || isErrorVehicles || (selectedTab === 3 && isErrorBookmarks);
  const isLoading =
    (selectedTab === 1 && isLoadingVoyages) ||
    (selectedTab === 2 && isLoadingVehicles) ||
    (selectedTab === 3 && isLoadingBookmarks);

  const listHeight = Platform.OS === "ios"
    ? vh(100) - insets.top - insets.bottom - vh(16)
    : vh(80);

  return (
    <View style={styles.screen}>
      <TokenExpiryGuard />

      {/* Tab selector — reuse same pill component with custom tabs override */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.segBtn, selectedTab === tab.id && styles.segBtnOn]}
            onPress={() => setSelectedTab(tab.id)}
            activeOpacity={0.8}
          >
            <ParrotsStdText style={[styles.segLabel, selectedTab === tab.id && styles.segLabelOn]}>
              {tab.label}
            </ParrotsStdText>
          </TouchableOpacity>
        ))}
      </View>

      {hasError ? (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[parrotPistachioGreen, parrotBananaLeafGreen]}
              tintColor={parrotBananaLeafGreen}
            />
          }
        >
          <View style={styles.emptyState}>
            <Image source={require("../assets/parrotslogo.png")} style={styles.logoImage} />
            <ParrotsStdText style={styles.emptyTitle}>Something went wrong</ParrotsStdText>
            <ParrotsStdText style={[styles.emptyTitle, { paddingTop: vh(1) }]}>Swipe down to retry</ParrotsStdText>
          </View>
        </ScrollView>
      ) : isLoading ? (
        <View style={styles.loader}>
          <LoadingLogo size={220} />
        </View>
      ) : (
        <View style={styles.tabContent}>
          {/* Tab 1: Voyages */}
          {selectedTab === 1 && (
            voyagesData?.length > 0 ? (
              <ScrollView
                style={{ height: listHeight }}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[parrotPistachioGreen, parrotBananaLeafGreen]} tintColor={parrotBananaLeafGreen} />
                }
              >
                <FavoriteVoyageListVertical data={voyagesData} />
              </ScrollView>
            ) : (
              <View style={styles.emptyState}>
                <Image source={require("../assets/parrotslogo.png")} style={styles.logoImageSmall} />
                <ParrotsStdText style={styles.emptyTitle}>No favorite voyages yet</ParrotsStdText>
              </View>
            )
          )}

          {/* Tab 2: Vehicles */}
          {selectedTab === 2 && (
            vehiclesData?.length > 0 ? (
              <ScrollView
                style={{ height: listHeight }}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[parrotPistachioGreen, parrotBananaLeafGreen]} tintColor={parrotBananaLeafGreen} />
                }
              >
                <FavoriteVehicleList data={vehiclesData} />
              </ScrollView>
            ) : (
              <View style={styles.emptyState}>
                <Image source={require("../assets/parrotslogo.png")} style={styles.logoImageSmall} />
                <ParrotsStdText style={styles.emptyTitle}>No favorite vehicles yet</ParrotsStdText>
              </View>
            )
          )}

          {/* Tab 3: People */}
          {selectedTab === 3 && (
            <BookmarkedUsersComponent bookmarks={bookmarks} height={listHeight} />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: parrotCream,
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#F4F7FB",
    borderRadius: 999,
    padding: 3,
    gap: 2,
    marginTop: vh(1.5),
    marginHorizontal: vw(4),
  },
  segBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: "center",
  },
  segBtnOn: {
    backgroundColor: "#0A77EA",
    shadowColor: "#0A77EA",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  segLabel: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 13,
    color: "#4A5A6A",
  },
  segLabelOn: {
    color: "#fff",
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: vw(4),
    paddingTop: vh(1.2),
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: vh(10),
  },
  emptyTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 18,
    color: parrotBlue,
    paddingTop: vh(3),
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: Platform.OS === "ios" ? vh(20) : 0,
  },
  logoImage: {
    height: vh(20),
    width: vh(20),
    borderRadius: vh(10),
  },
  logoImageSmall: {
    height: vh(15),
    width: vh(15),
    borderRadius: vh(10),
    opacity: 0.5,
  },
});
