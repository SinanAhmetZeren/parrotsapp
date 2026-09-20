import { ParrotsStdText } from "../components/ParrotsStdText";
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useState, useCallback, useEffect } from "react";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  useGetVehicleByIdQuery,
  useAddVehicleToFavoritesMutation,
  useDeleteVehicleFromFavoritesMutation,
} from "../slices/VehicleSlice";
import {
  Feather, FontAwesome6, AntDesign, FontAwesome5, FontAwesome,
  Ionicons, MaterialCommunityIcons, MaterialIcons,
} from "@expo/vector-icons";
import {
  View, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity,
  Share, ActivityIndicator, RefreshControl, Dimensions,
} from "react-native";

const SCREEN_W = Dimensions.get("window").width;
import { vw, vh } from "react-native-expo-viewport-units";
import { useDispatch, useSelector } from "react-redux";
import { addVehicleToUserFavorites, removeVehicleFromUserFavorites } from "../slices/UserSlice";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import LoadingLogo from "../components/LoadingLogo";
import {
  parrotBananaLeafGreen, parrotBlue, parrotPistachioGreen, parrotCream,
  parrotBoatPurple, parrotCarRed, parrotCaravanOrangeRed, parrotBusYellowGreen,
  parrotWalkTurquoise, parrotRunLightOrange, parrotMotorcycleDarkRed, parrotBicycleTealGreen,
  parrotTinyHouseLightYellow, parrotAirplaneLightGreen, parrotTrainPink,
} from "../assets/color";

const VEHICLE_CONFIG = {
  0:  { name: "Sailboat",   color: parrotBoatPurple },
  1:  { name: "Car",        color: parrotCarRed },
  2:  { name: "Caravan",    color: parrotCaravanOrangeRed },
  3:  { name: "Bus",        color: parrotBusYellowGreen },
  4:  { name: "Walk",       color: parrotWalkTurquoise },
  5:  { name: "Run",        color: parrotRunLightOrange },
  6:  { name: "Motorcycle", color: parrotMotorcycleDarkRed },
  7:  { name: "Bicycle",    color: parrotBicycleTealGreen },
  8:  { name: "TinyHouse",  color: parrotTinyHouseLightYellow },
  9:  { name: "Airplane",   color: parrotAirplaneLightGreen },
  10: { name: "Train",      color: parrotTrainPink },
};

const VehicleTypeIcon = ({ type, color, size = 12 }) => {
  switch (type) {
    case 0:  return <FontAwesome6 name="sailboat" size={size} color={color} />;
    case 1:  return <AntDesign name="car" size={size} color={color} />;
    case 2:  return <FontAwesome5 name="caravan" size={size} color={color} />;
    case 3:  return <Ionicons name="bus-outline" size={size} color={color} />;
    case 4:  return <FontAwesome5 name="walking" size={size} color={color} />;
    case 5:  return <FontAwesome5 name="running" size={size} color={color} />;
    case 6:  return <FontAwesome name="motorcycle" size={size} color={color} />;
    case 7:  return <FontAwesome name="bicycle" size={size} color={color} />;
    case 8:  return <FontAwesome6 name="house" size={size} color={color} />;
    case 9:  return <Ionicons name="airplane-outline" size={size} color={color} />;
    case 10: return <Ionicons name="train-outline" size={size} color={color} />;
    default: return null;
  }
};

const formatDateRange = (start, end) => {
  if (!start) return "";
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  const fmtShort = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const yr = (d) => d.getFullYear().toString().slice(-2);
  if (!e || fmtShort(s) === fmtShort(e)) return `${fmtShort(s)} ${yr(s)}`;
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()}–${fmtShort(e)} ${yr(e)}`;
  }
  return `${fmtShort(s)} – ${fmtShort(e)} ${yr(e)}`;
};

const VoyageCard = ({ voyage, vehicleType, onPress }) => {
  const cfg = VEHICLE_CONFIG[vehicleType] ?? { name: "Vehicle", color: parrotBlue };
  const bgColor = cfg.color + "22";
  const now = new Date();
  return (
    <TouchableOpacity style={styles.voyageCard} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri: voyage.profileImageThumbnail || voyage.profileImage }}
        style={styles.voyageCardImg}
        resizeMode="cover"
      />
      <View style={styles.voyageCardBody}>
        <ParrotsStdText style={styles.voyageCardName} numberOfLines={2}>{voyage.name}</ParrotsStdText>
        <View style={styles.voyagePills}>
          <View style={[styles.pill, { backgroundColor: bgColor }]}>
            <VehicleTypeIcon type={vehicleType} color={cfg.color} size={11} />
            <ParrotsStdText style={[styles.pillTxt, { color: cfg.color }]} numberOfLines={1}>{cfg.name}</ParrotsStdText>
          </View>
          <View style={[styles.pill, styles.pillGray]}>
            <Ionicons name="people-outline" size={11} color="#4A5A6A" />
            <ParrotsStdText style={[styles.pillTxt, { color: "#4A5A6A" }]}>{voyage.vacancy}</ParrotsStdText>
          </View>
          <View style={[styles.pill, styles.pillGray]}>
            <Ionicons name="calendar-outline" size={11} color="#4A5A6A" />
            <ParrotsStdText style={[styles.pillTxt, { color: "#4A5A6A" }]} numberOfLines={1}>
              {formatDateRange(voyage.startDate, voyage.endDate)}
            </ParrotsStdText>
          </View>
        </View>
        {voyage.brief ? (
          <ParrotsStdText style={styles.voyageCardDesc} numberOfLines={2}>{voyage.brief}</ParrotsStdText>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const VehicleDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { vehicleId } = route.params;
  const userId = useSelector((state) => state.users.userId);
  const userFavoriteVehicles = useSelector((state) => state.users.userFavoriteVehicles);
  const dispatch = useDispatch();

  const [isFavorited, setIsFavorited] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [tab, setTab] = useState("all");
  const [imgIndex, setImgIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { data: VehicleData, isSuccess, isLoading, isError, refetch } = useGetVehicleByIdQuery(vehicleId);
  const [addVehicleToFavorites] = useAddVehicleToFavoritesMutation();
  const [deleteVehicleFromFavorites] = useDeleteVehicleFromFavoritesMutation();

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  useFocusEffect(useCallback(() => {
    const fetch = async () => { try { await refetch(); } catch (e) { console.error(e); } };
    fetch();
  }, [refetch]));

  useEffect(() => {
    if (isSuccess && userFavoriteVehicles?.includes(VehicleData.id)) setIsFavorited(true);
  }, [isSuccess, userFavoriteVehicles]);

  useEffect(() => { if (isError) setHasError(true); }, [isError]);

  const onRefresh = () => {
    setRefreshing(true);
    setHasError(false);
    refetch().finally(() => setRefreshing(false));
  };

  const goToProfile = () => {
    const parentScreen = navigation.getState().routes[0].name;
    const targetStack = parentScreen === "ProfileScreen" ? "ProfileStack"
      : parentScreen === "FavoritesScreen" ? "Favorites" : "Home";
    navigation.navigate(targetStack, {
      screen: "ProfileScreenPublic",
      params: { publicId: VehicleData?.user?.publicId, userName: VehicleData?.user?.userName, userId: VehicleData?.user?.id },
    });
  };

  const goToVoyage = (voyage) => {
    if (!voyage.publicId) return;
    const parentScreen = navigation.getState().routes[0].name;
    const targetStack = parentScreen === "ProfileScreen" ? "ProfileStack"
      : parentScreen === "FavoritesScreen" ? "Favorites" : "Home";
    navigation.navigate(targetStack, { screen: "VoyageDetail", params: { voyagePublicId: voyage.publicId } });
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `Check out this link:\nhttps://parrotsvoyages.com/vehicle-details/${vehicleId}` });
    } catch (e) {}
  };

  const handleFavToggle = () => {
    if (isFavorited) {
      deleteVehicleFromFavorites({ userId, vehicleId });
      setIsFavorited(false);
      dispatch(removeVehicleFromUserFavorites({ favoriteVehicle: vehicleId }));
    } else {
      addVehicleToFavorites({ userId, vehicleId });
      setIsFavorited(true);
      dispatch(addVehicleToUserFavorites({ favoriteVehicle: vehicleId }));
    }
  };

  if (isLoading) {
    return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><LoadingLogo size={200} /></View>;
  }

  if (hasError || isError) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[parrotPistachioGreen, parrotBananaLeafGreen]} tintColor={parrotBananaLeafGreen} />}>
        <View style={{ alignItems: "center", marginTop: vh(20) }}>
          <Image source={require("../assets/parrotslogo.png")} style={{ height: vh(25), width: vh(25), borderRadius: vh(15) }} />
          <ParrotsStdText style={{ fontFamily: "Nunito_700Bold", fontSize: 16, color: parrotBlue, marginTop: 12 }}>Something went wrong</ParrotsStdText>
          <ParrotsStdText style={{ fontFamily: "Nunito_700Bold", fontSize: 14, color: parrotBlue, opacity: 0.6 }}>Swipe down to retry</ParrotsStdText>
        </View>
      </ScrollView>
    );
  }

  if (!isSuccess || !VehicleData) return null;

  const cfg = VEHICLE_CONFIG[VehicleData.type] ?? { name: "Vehicle", color: parrotBlue };
  const typeColor = cfg.color;
  const heroImages = [
    VehicleData.profileImageUrl,
    ...(VehicleData.vehicleImages ?? []).map(i => i.vehicleImagePath).filter(Boolean),
  ].filter(Boolean);
  const typeBg = typeColor + "22";
  const isOwner = userId === VehicleData.userId;

  const plainDesc = VehicleData.description
    .replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
  const descLimit = 400;
  const displayDesc = showFullText ? plainDesc : plainDesc.slice(0, descLimit) + (plainDesc.length > descLimit ? "..." : "");

  const now = new Date();
  const allVoyages = VehicleData.voyages ?? [];
  const upcomingVoyages = allVoyages.filter(v => new Date(v.startDate) > now);
  const shownVoyages = tab === "upcoming" ? upcomingVoyages : allVoyages;

  return (
    <>
      <TokenExpiryGuard />
      <ScrollView style={styles.root} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[parrotPistachioGreen, parrotBananaLeafGreen]} tintColor={parrotBananaLeafGreen} />}>

        {/* ── HERO ── */}
        <View style={styles.hero}>
          <FlatList
            data={heroImages}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => setImgIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_W))}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.heroImg} resizeMode="cover" />
            )}
          />

          {/* top-right buttons */}
          <View style={styles.heroTopRight}>
            {isOwner && (
              <TouchableOpacity style={styles.heroPill}
                onPress={() => navigation.navigate("Create", { screen: "EditVehicleScreen", params: { currentVehicleId: vehicleId } })}
                activeOpacity={0.85}>
                <Feather name="edit-2" size={17} color="#0A2540" />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.heroPill, styles.heroPillDots]} activeOpacity={0.85}>
              <View style={styles.heroDot} /><View style={styles.heroDot} /><View style={styles.heroDot} />
            </TouchableOpacity>
          </View>

          {/* bottom-left: name + type pill */}
          <View style={styles.heroBottom}>
            <ParrotsStdText style={styles.heroName} numberOfLines={2}>{VehicleData.name}</ParrotsStdText>
            <View style={[styles.heroTypePill, { backgroundColor: "rgba(255,255,255,0.94)" }]}>
              <VehicleTypeIcon type={VehicleData.type} color={typeColor} size={12} />
              <ParrotsStdText style={[styles.heroTypeTxt, { color: typeColor }]}>{cfg.name}</ParrotsStdText>
            </View>
          </View>

          {/* dots + counter */}
          {heroImages.length > 1 && (
            <View style={styles.heroPagination}>
              <View style={styles.heroDots}>
                {heroImages.map((_, i) => (
                  <View key={i} style={[styles.heroDotIndicator, i === imgIndex && styles.heroDotIndicatorOn]} />
                ))}
              </View>
              <View style={styles.heroCounter}>
                <ParrotsStdText style={styles.heroCounterTxt}>{imgIndex + 1} / {heroImages.length}</ParrotsStdText>
              </View>
            </View>
          )}
        </View>

        {/* ── PANEL ── */}
        <View style={styles.panel}>

          {/* meta row */}
          <View style={styles.metaRow}>
            <TouchableOpacity style={styles.ownerPill} onPress={goToProfile} activeOpacity={0.8}>
              <Image source={{ uri: VehicleData.user?.profileImageThumbnailUrl || VehicleData.user?.profileImageUrl }} style={styles.ownerAvatar} />
              <ParrotsStdText style={styles.ownerName} numberOfLines={1}>{VehicleData.user?.userName}</ParrotsStdText>
            </TouchableOpacity>
            <View style={styles.spotsPill}>
              <Ionicons name="people-outline" size={15} color="#0A5FBF" />
              <ParrotsStdText style={styles.spotsTxt}>{VehicleData.capacity}</ParrotsStdText>
            </View>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.iconBtn} onPress={handleShare} activeOpacity={0.8}>
              <Feather name="send" size={17} color="#0A5FBF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={handleFavToggle} activeOpacity={0.8}>
              <Ionicons name={isFavorited ? "heart" : "heart-outline"} size={18} color={isFavorited ? "#E03040" : "#0A5FBF"} />
            </TouchableOpacity>
          </View>

          {/* description */}
          {plainDesc.length > 0 && (
            <View>
              <ParrotsStdText style={styles.descTxt}>{displayDesc}</ParrotsStdText>
              {plainDesc.length > descLimit && !showFullText && (
                <TouchableOpacity onPress={() => setShowFullText(true)}>
                  <ParrotsStdText style={styles.readMore}>Read more <Feather name="chevron-down" size={14} color={parrotBlue} /></ParrotsStdText>
                </TouchableOpacity>
              )}
              {showFullText && (
                <TouchableOpacity onPress={() => setShowFullText(false)}>
                  <ParrotsStdText style={styles.readMore}>Read less <Feather name="chevron-up" size={14} color={parrotBlue} /></ParrotsStdText>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* tabs */}
          {allVoyages.length > 0 && (
            <View style={styles.tabs}>
              <TouchableOpacity style={[styles.tabBtn, tab === "all" && styles.tabBtnOn]} onPress={() => setTab("all")} activeOpacity={0.8}>
                <ParrotsStdText style={[styles.tabTxt, tab === "all" && styles.tabTxtOn]}>
                  Voyages {allVoyages.length}
                </ParrotsStdText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabBtn, tab === "upcoming" && styles.tabBtnOn]} onPress={() => setTab("upcoming")} activeOpacity={0.8}>
                <ParrotsStdText style={[styles.tabTxt, tab === "upcoming" && styles.tabTxtOn]}>
                  Upcoming {upcomingVoyages.length}
                </ParrotsStdText>
              </TouchableOpacity>
            </View>
          )}

          {/* voyage list */}
          {shownVoyages.length > 0 ? (
            <View style={styles.list}>
              {shownVoyages.map((v) => (
                <VoyageCard key={v.id} voyage={v} vehicleType={VehicleData.type} onPress={() => goToVoyage(v)} />
              ))}
            </View>
          ) : allVoyages.length > 0 ? (
            <View style={{ paddingVertical: vh(3), alignItems: "center" }}>
              <ParrotsStdText style={{ fontFamily: "Nunito_700Bold", fontSize: 14, color: "#888" }}>No upcoming voyages</ParrotsStdText>
            </View>
          ) : null}

          <View style={{ height: vh(10) }} />
        </View>
      </ScrollView>

      {toastVisible && (
        <View style={styles.toast}>
          <ParrotsStdText style={styles.toastTxt}>{toastMessage}</ParrotsStdText>
        </View>
      )}
    </>
  );
};

export default VehicleDetailScreen;

const BLUE_PILL = "#E8F1FB";
const BLUE_DK = "#0A5FBF";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: parrotCream },

  // hero
  hero: { height: vh(34), position: "relative", overflow: "hidden" },
  heroImg: { width: SCREEN_W, height: vh(34) },
  heroTopRight: { position: "absolute", top: 13, right: 13, flexDirection: "row", gap: 8, zIndex: 10 },
  heroPill: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.93)",
    alignItems: "center", justifyContent: "center",
    shadowColor: "rgba(12,30,48,1)", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 4,
  },
  heroPillDots: { flexDirection: "row", gap: 3 },
  heroDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#0A2540" },
  heroBottom: { position: "absolute", bottom: 44, left: 0, right: 0, paddingHorizontal: 16, zIndex: 5 },
  heroName: { fontFamily: "Nunito_800ExtraBold", fontSize: 26, color: "#fff", letterSpacing: -0.4, lineHeight: 30, marginBottom: 8, textShadowColor: "rgba(8,22,38,0.6)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 8 },
  heroTypePill: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  heroTypeTxt: { fontFamily: "Nunito_800ExtraBold", fontSize: 11.5 },
  heroPagination: { position: "absolute", bottom: 10, left: 16, right: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", zIndex: 5 },
  heroDots: { flexDirection: "row", alignItems: "center", gap: 5 },
  heroDotIndicator: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.45)" },
  heroDotIndicatorOn: { width: 18, backgroundColor: "#fff" },
  heroCounter: { position: "absolute", right: 0, backgroundColor: "rgba(8,22,38,0.55)", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  heroCounterTxt: { fontFamily: "Nunito_800ExtraBold", fontSize: 11, color: "#fff" },

  // panel
  panel: { backgroundColor: parrotCream, paddingHorizontal: 16, paddingTop: 14, gap: 12 },

  metaRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  ownerPill: { flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: BLUE_PILL, borderRadius: 999, paddingLeft: 4, paddingRight: 12, paddingVertical: 4, flex: 1, minWidth: 0, maxWidth: "60%" },
  ownerAvatar: { width: 26, height: 26, borderRadius: 13, flexShrink: 0 },
  ownerName: { fontFamily: "Nunito_800ExtraBold", fontSize: 14, color: BLUE_DK, flexShrink: 1 },
  spotsPill: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: BLUE_PILL, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  spotsTxt: { fontFamily: "Nunito_800ExtraBold", fontSize: 14, color: BLUE_DK },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: BLUE_PILL, alignItems: "center", justifyContent: "center" },

  descTxt: { fontFamily: "Nunito_600SemiBold", fontSize: 15, color: "#3C4A57", lineHeight: 23 },
  readMore: { fontFamily: "Nunito_700Bold", fontSize: 14, color: parrotBlue, marginTop: 4 },

  // tabs
  tabs: { flexDirection: "row", gap: 4, backgroundColor: "#EFE8DE", borderRadius: 999, padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 8, borderRadius: 999, alignItems: "center" },
  tabBtnOn: { backgroundColor: "#fff", shadowColor: "rgba(12,30,48,1)", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.14, shadowRadius: 4, elevation: 2 },
  tabTxt: { fontFamily: "Nunito_800ExtraBold", fontSize: 13.5, color: "#3C4A57" },
  tabTxtOn: { color: BLUE_DK },

  // voyage list
  list: { gap: 11 },
  voyageCard: {
    flexDirection: "row", backgroundColor: "#fff",
    borderWidth: 1, borderColor: "#E8E3DC",
    borderRadius: 16, overflow: "hidden",
  },
  voyageCardImg: { width: vw(42), alignSelf: "stretch" },
  voyageCardBody: { flex: 1, padding: 11, gap: 7, minWidth: 0 },
  voyageCardName: { fontFamily: "Nunito_800ExtraBold", fontSize: 15, color: BLUE_DK, letterSpacing: -0.015, lineHeight: 20 },
  voyagePills: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  pill: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 },
  pillGray: { backgroundColor: "#F4F7FB" },
  pillTxt: { fontFamily: "Nunito_800ExtraBold", fontSize: 11 },
  voyageCardDesc: { fontFamily: "Nunito_600SemiBold", fontSize: 12, color: "#3C4A57", lineHeight: 17 },

  toast: {
    position: "absolute", bottom: vh(10), alignSelf: "center",
    backgroundColor: "rgba(30,111,217,0.9)", paddingHorizontal: vw(4), paddingVertical: vh(1),
    borderRadius: 20, flexDirection: "row", alignItems: "center",
  },
  toastTxt: { fontFamily: "Nunito_700Bold", color: "#fff", fontSize: 13 },
});
