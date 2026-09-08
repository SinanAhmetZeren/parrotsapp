/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import {
  View, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Animated, Modal, Clipboard, BackHandler, Linking
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { invokeHub, isHubReady } from "../signalr/signalRHub";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { useAskParrotsMutation } from "../slices/AiSlice";
import { useLazyGetParrotCrackerBalanceQuery } from "../slices/UserSlice";
import { FontAwesome } from "@expo/vector-icons";
import { ParrotsStdText } from "../components/ParrotsStdText";
import {
  parrotBlue, parrotCream, parrotGreen, parrotTextDarkBlue,
  parrotWalkTurquoise, parrotPlaceholderGrey, parrotInputTextColor,
  parrotBoatPurple, parrotCarRed, parrotCaravanOrangeRed, parrotBusYellowGreen,
  parrotRunLightOrange, parrotMotorcycleDarkRed, parrotBicycleTealGreen,
  parrotTinyHouseLightYellow, parrotAirplaneLightGreen, parrotTrainPink, parrotDarkBlue, parrotBlueSemiTransparent, parrotBlueTransparent,
} from "../assets/color";
import { vw, vh } from "react-native-expo-viewport-units";

const VEHICLE_COLORS = [
  parrotBoatPurple, parrotCarRed, parrotCaravanOrangeRed, parrotBusYellowGreen,
  parrotWalkTurquoise, parrotRunLightOrange, parrotMotorcycleDarkRed, parrotBicycleTealGreen,
  parrotTinyHouseLightYellow, parrotAirplaneLightGreen, parrotTrainPink,
];
import { Image } from "react-native";
import parrotLogo from "../assets/parrotsiconpaddedtransparent.png";
import parrotTabIcon from "../assets/parrotwhiteoutlinebg.png";
import parrotCracker from "../assets/parrotCracker.png";

const VEHICLES = ["Boat", "Car", "Caravan", "Bus", "Walk", "Run", "Motorcycle", "Bicycle", "TinyHouse", "Airplane", "Train"];
const DURATIONS = ["Half day", "1 day", "2-3 days", "1 week", "2 weeks"];
const VIBES = ["Culture", "Food", "Nature", "Chill", "Adventure", "Budget", "Scenic", "Any"];
const DURATION_COLORS = ["#2ac898", "#2ac898", "#2ac898", "#2ac898", "#2ac898"];
const VIBE_COLORS = ["#F5A623", "#F5A623", "#F5A623", "#F5A623", "#F5A623", "#F5A623", "#F5A623", "#F5A623"];

const SPOT_TYPES = ["Popular Spots", "Local Favorites", "Hidden Gems", "Mixed Picks"];
const SPOT_TYPE_COLORS = ["#8B5CF6", "#8B5CF6", "#8B5CF6", "#8B5CF6"];
const SPOT_TYPES_CONFIG = {
  "Popular Spots":   { label: "popular spots",   detail: "iconic landmarks and high-profile highlights" },
  "Local Favorites": { label: "local favorites", detail: "authentic neighborhood staples favored by locals" },
  "Hidden Gems":     { label: "hidden gems",     detail: "lesser-known, off-the-beaten-path secret spots" },
  "Mixed Picks":     { label: "mixed picks",  detail: "a curated mix of popular spots, local favorites, and hidden gems" },
};

export default function AskParrotsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [vehicle, setVehicle] = useState(null);
  const [duration, setDuration] = useState(null);
  const [vibe, setVibe] = useState(null);
  const [spotType, setSpotType] = useState(null);
  const [pin, setPin] = useState(null);
  const [response, setResponse] = useState(null);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const scrollViewHeight = useRef(0);
  const scrollContentHeight = useRef(0);
  const checkScrollable = () => setShowScrollArrow(scrollContentHeight.current > scrollViewHeight.current + 1);
  const currentUserId = useSelector((state) => state.users.userId);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [askParrots, { isLoading: loading }] = useAskParrotsMutation();
  const [crackerBalance, setCrackerBalance] = useState(null);
  const [getParrotCrackerBalance] = useLazyGetParrotCrackerBalanceQuery();
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      const coord = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      mapRef.current?.animateToRegion({ ...coord, latitudeDelta: 0.0922, longitudeDelta: 0.0922 }, 500);
    })();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      getParrotCrackerBalance(currentUserId).then((res) => {
        if (res?.data != null) setCrackerBalance(res.data.balance ?? 0);
      });
    }
  }, [currentUserId]);

  const canAsk = vehicle && duration && vibe && spotType && pin;

  const handleMapPress = (e) => {
    setPin(e.nativeEvent.coordinate);
  };

  const handleAsk = async () => {
    if (!canAsk) return;
    setResponse(null);
    try {
      const result = await askParrots({
        vehicleType: vehicle,
        duration,
        vibe,
        spotType,
        latitude: pin?.latitude ?? 0,
        longitude: pin?.longitude ?? 0,
      }).unwrap();
      setResponse(result.response);
      if (result.remainingBalance !== undefined) setCrackerBalance(result.remainingBalance);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    } catch (e) {
      if (e?.status === 402) {
        setCrackerBalance(0);
        setResponse("You're out of crackers! Earn or buy more crackers to generate your next voyage.");
      } else if (e?.status === "FETCH_ERROR") {
        setResponse("Unable to connect. Please check your network and try again.");
      } else {
        setResponse(e?.data?.message ?? "Unable to connect. Please check your network and try again.");
      }
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.logoContainer}>
              <Image source={parrotLogo} style={styles.logo} />
            </View>
            <View style={styles.headerText}>
              <ParrotsStdText style={styles.title}>Ask Parrots</ParrotsStdText>
              <ParrotsStdText style={styles.subtitle}>Pick your preferences, set the vibe, and explore recommendations.</ParrotsStdText>
              <ParrotsStdText style={styles.disclaimer}>These tips are for inspiration, so please verify before you go.</ParrotsStdText>

            </View>
          </View>
        </View>

        {crackerBalance === 0 && (
          <View style={styles.noBalanceCard}>
            <Image source={parrotCracker} style={styles.noBalanceCookie} />
            <View style={{ flex: 1 }}>
              <ParrotsStdText style={styles.noBalanceTitle}>You're out of ParrotCrackers.</ParrotsStdText>
              <ParrotsStdText style={styles.noBalanceSubtitle}>Visit <ParrotsStdText style={{ color: parrotCaravanOrangeRed }}>parrotsvoyages.com</ParrotsStdText> for some crackers.</ParrotsStdText>
              <TouchableOpacity style={styles.noBalanceButton} onPress={() => Linking.openURL("https://parrotsvoyages.com/parrotCrackerPage")}>
                <ParrotsStdText style={styles.noBalanceButtonText}>Get ParrotCrackers</ParrotsStdText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Vehicle */}
        <SectionCard label="I WANT TO TRAVEL BY...">
          <PillGroup options={VEHICLES} selected={vehicle} onSelect={setVehicle} colors={VEHICLE_COLORS} />
        </SectionCard>

        {/* Duration */}
        <SectionCard label="FOR...">
          <PillGroup options={DURATIONS} selected={duration} onSelect={setDuration} colors={DURATION_COLORS} />
        </SectionCard>

        {/* Vibe */}
        <SectionCard label="WITH A VIBE OF...">
          <PillGroup options={VIBES} selected={vibe} onSelect={setVibe} colors={VIBE_COLORS} pillPaddingHorizontal={12} />
        </SectionCard>

        {/* Spot type */}
        <SectionCard label="FOCUSING ON...">
          <PillGroup options={SPOT_TYPES} selected={spotType} onSelect={setSpotType} colors={SPOT_TYPE_COLORS} />
        </SectionCard>

        {/* Map */}
        <SectionCard label="AROUND..."
          style={{ padding: 0, paddingTop: 10, overflow: "hidden" }} labelStyle={{ paddingHorizontal: 16 }}>
          <View style={{ position: "relative", marginTop: -8 }}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{ latitude: 41.0, longitude: 28.9, latitudeDelta: 20, longitudeDelta: 20 }}
              onPress={handleMapPress}
              showsUserLocation={true}
              userInterfaceStyle="light"
            >
              {pin && <Marker coordinate={pin} pinColor={parrotBoatPurple} />}
            </MapView>
            <View style={styles.tapPill} pointerEvents="none">
              <View style={styles.tapPillInner}>
                <ParrotsStdText style={styles.tapPillText}>Tap for location. Zoom in if a label blocks your tap.</ParrotsStdText>
              </View>
            </View>
          </View>
        </SectionCard>

        {/* Prompt preview */}
        <SectionCard label="YOUR QUERY">
          {canAsk ? (
            <ParrotsStdText style={styles.promptText}>
              {buildPromptParts(vehicle, duration, vibe, spotType,
                VEHICLE_COLORS[VEHICLES.indexOf(vehicle)],
                DURATION_COLORS[DURATIONS.indexOf(duration)],
                VIBE_COLORS[VIBES.indexOf(vibe)],
                pin
              ).map((part, i) =>
                part.color
                  ? <ParrotsStdText key={i} style={[styles.promptText, { color: part.color, fontFamily: "Nunito_800ExtraBold" }]}>{part.text}</ParrotsStdText>
                  : part.text
              )}
            </ParrotsStdText>
          ) : (
            <ParrotsStdText style={[styles.promptText, { color: parrotPlaceholderGrey, fontStyle: "italic" }]}>
              Select your options above to preview your query.
            </ParrotsStdText>
          )}
        </SectionCard>

        {/* Ask button */}
        <TouchableOpacity
          style={[styles.askButton, (!canAsk || crackerBalance === 0) && { opacity: 0.4 }]}
          onPress={handleAsk}
          disabled={!canAsk || loading || crackerBalance === 0}
        >
          {loading
            ? <ActivityIndicator color="white" />
            : <ParrotsStdText style={styles.askButtonText}>Ask Parrots</ParrotsStdText>
          }
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Response modal */}
      <Modal visible={!!response} transparent animationType="slide" onRequestClose={() => setResponse(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalQueryRow}>
              <Image source={parrotTabIcon} style={styles.modalQueryLogo} />
              <ParrotsStdText style={styles.modalQueryText}>
                {canAsk && buildPromptParts(vehicle, duration, vibe, spotType,
                  VEHICLE_COLORS[VEHICLES.indexOf(vehicle)],
                  DURATION_COLORS[DURATIONS.indexOf(duration)],
                  VIBE_COLORS[VIBES.indexOf(vibe)],
                  pin
                ).map((part, i) =>
                  part.color
                    ? <ParrotsStdText key={i} style={[styles.modalQueryText, { color: part.color }]}>{part.text}</ParrotsStdText>
                    : part.text
                )}
              </ParrotsStdText>
            </View>
            <View style={{ maxHeight: vh(60) }}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                onLayout={(e) => { scrollViewHeight.current = e.nativeEvent.layout.height; checkScrollable(); }}
                onContentSizeChange={(_, h) => { scrollContentHeight.current = h; checkScrollable(); }}
                onScroll={({ nativeEvent }) => {
                  const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                  const atBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 16;
                  setShowScrollArrow(!atBottom);
                }}
                scrollEventThrottle={16}
              >
                {(() => {
                  const locMatch = response?.match(/^\[\[([^\]]+)\]\]/);
                  const locLabel = locMatch ? locMatch[1] : null;
                  const bodyText = response?.replace(/^\[\[[^\]]+\]\]\s*/, "") ?? "";
                  return (
                    <ParrotsStdText style={styles.responseText}>
                      {locLabel && (
                        <ParrotsStdText style={styles.locationLabel}>@ {locLabel} </ParrotsStdText>
                      )}
                      {bodyText.split(/(\*\*[^*]+\*\*|\{\{[^}]+\}\})/).map((part, i) => {
                        if (/^\*\*[^*]+\*\*$/.test(part))
                          return <ParrotsStdText key={i} style={[styles.responseText, { color: parrotBlue, fontFamily: "Nunito_800ExtraBold" }]}>{part.slice(2, -2)}</ParrotsStdText>;
                        if (/^\{\{[^}]+\}\}$/.test(part))
                          return <ParrotsStdText key={i} style={[styles.responseText, { color: "#8B5CF6", fontFamily: "Nunito_800ExtraBold", textTransform: "capitalize" }]}>{part.slice(2, -2)}</ParrotsStdText>;
                        return part;
                      })}
                    </ParrotsStdText>
                  );
                })()}
              </ScrollView>
              {showScrollArrow && (
                <View pointerEvents="none" style={[styles.scrollArrow, { opacity: 0.3, transform: [{ scaleX: 0.8 }] }]}>
                  <FontAwesome name="arrow-down" size={28} color={parrotWalkTurquoise} />
                </View>
              )}
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalActionBtn, { backgroundColor: parrotBlue }]} onPress={() => {
                const clean = response.replace(/^\[\[([^\]]+)\]\]\s*/, "($1) ").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\{\{([^}]+)\}\}/g, "$1");
                Clipboard.setString(clean);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}>
                <ParrotsStdText style={styles.modalActionText}>{copied ? "Copied!" : "Copy"}</ParrotsStdText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalActionBtn, { backgroundColor: "#089ADE" }]} onPress={async () => {
                if (!isHubReady()) return;
                const query = buildPromptPreview(vehicle, duration, vibe, spotType, pin);
                const responseText = response.replace(/^\[\[([^\]]+)\]\]\s*/, "($1) ").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\{\{([^}]+)\}\}/g, "$1");
                const text = `**🦜** ${query}\n\n➡️ ${responseText}`;
                await invokeHub("SendMessage", currentUserId, currentUserId, text, true);
                setSent(true);
                setTimeout(() => setSent(false), 2000);
              }}>
                <ParrotsStdText style={styles.modalActionText}>{sent ? "Sent!" : "Send Me"}</ParrotsStdText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalActionBtn, { backgroundColor: parrotWalkTurquoise }]} onPress={() => setResponse(null)}>
                <ParrotsStdText style={styles.modalActionText}>Close</ParrotsStdText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const VIBES_CONFIG = {
  Culture: { label: "culture-focused", detail: "cultural sights and history" },
  Food: { label: "food-focused", detail: "local food and dining" },
  Nature: { label: "nature-focused", detail: "outdoor scenery and nature" },
  Chill: { label: "relaxed", detail: "laid-back pace" },
  Adventure: { label: "adventurous", detail: "off the beaten path" },
  Budget: { label: "budget-friendly", detail: "low-cost spots" },
  Scenic: { label: "scenic", detail: "landscapes and views" },
  Any: { label: "any vibe", detail: "" },
};

const ON_FOOT = ["Walk", "Run"];
const TRANSIT = ["Bus", "Train", "Airplane"];

function getIndefiniteArticle(word) { return /^[aeiou]/i.test(word) ? "an" : "a"; }
function formatDuration(d) { return d === "Half day" ? "half a day" : d; }
function formatVehicleName(v) { return v === "TinyHouse" ? "tiny house" : v.toLowerCase(); }

function buildPromptParts(vehicle, duration, vibe, spotType, vehicleColor, durationColor, vibeColor, pin = null) {
  const isOnFoot = ON_FOOT.includes(vehicle);
  const isTransit = TRANSIT.includes(vehicle);
  const displayDuration = formatDuration(duration);
  const displayVehicle = formatVehicleName(vehicle);
  const vibeConf = VIBES_CONFIG[vibe];
  const vibeLabel = vibeConf.label;
  const vibeDetail = vibeConf.detail;
  const vibeArticle = vibe === "Any" ? "a" : getIndefiniteArticle(vibeLabel);
  const spotConf = spotType ? SPOT_TYPES_CONFIG[spotType] : null;

  const vehiclePrefix = isOnFoot
    ? { text: "I want to go for a " }
    : isTransit
      ? { text: "I'm traveling by " }
      : { text: `I have ${getIndefiniteArticle(displayVehicle)} ` };
  const vehicleConnector = (isOnFoot || isTransit) ? { text: " for " } : { text: " and " };
  const vehicleSuffix = (isOnFoot || isTransit) ? { text: ". " } : { text: " available. " };

  return [
    vehiclePrefix,
    { text: displayVehicle, color: vehicleColor },
    vehicleConnector,
    { text: displayDuration, color: durationColor },
    vehicleSuffix,
    vibe === "Any" ? { text: "I'm looking for a voyage of " } : { text: `I'm looking for ${vibeArticle} ` },
    { text: vibe === "Any" ? "any vibe" : vibeLabel, color: vibeColor },
    vibe === "Any" ? { text: "" } : { text: " experience" },
    vibe !== "Any" && vibeDetail ? { text: ` (${vibeDetail})` } : { text: "" },
    spotConf ? { text: ", focusing on " } : { text: "" },
    spotConf ? { text: spotConf.label, color: "#8B5CF6" } : { text: "" },
    spotConf ? { text: ` (${spotConf.detail})` } : { text: "" },
    { text: ", starting from this location." },
  ];
}

function buildPromptPreview(vehicle, duration, vibe, spotType, pin) {
  const isOnFoot = ON_FOOT.includes(vehicle);
  const isTransit = TRANSIT.includes(vehicle);
  const displayDuration = formatDuration(duration);
  const displayVehicle = formatVehicleName(vehicle);

  let vehiclePart;
  if (isOnFoot) {
    vehiclePart = `I want to go for a ${displayVehicle} for ${displayDuration}.`;
  } else if (isTransit) {
    vehiclePart = `I'm traveling by ${displayVehicle} for ${displayDuration}.`;
  } else {
    vehiclePart = `I have ${getIndefiniteArticle(displayVehicle)} ${displayVehicle} and ${displayDuration} available.`;
  }

  let vibePart;
  if (vibe === "Any") {
    vibePart = "I'm looking for a voyage of any vibe";
  } else {
    const { label, detail } = VIBES_CONFIG[vibe];
    const detailStr = detail ? ` (${detail})` : "";
    vibePart = `I'm looking for ${getIndefiniteArticle(label)} ${label} experience${detailStr}`;
  }

  const spotConfig = spotType ? SPOT_TYPES_CONFIG[spotType] : null;
  const spotPart = spotConfig ? `, focusing on ${spotConfig.label} (${spotConfig.detail})` : "";

  const locationPart = pin ? "starting from this location" : "";
  return `${vehiclePart} ${vibePart}${spotPart}, ${locationPart}.`;
}

function SectionCard({ label, children, style, labelStyle }) {
  return (
    <View style={[styles.card, style]}>
      <ParrotsStdText style={[styles.cardLabel, labelStyle]}>{label}</ParrotsStdText>
      {children}
    </View>
  );
}

function PillGroup({ options, selected, onSelect, colors, pillPaddingHorizontal }) {
  return (
    <View style={styles.pillGroup}>
      {options.map((opt, i) => {
        const isSelected = selected === opt;
        const color = colors ? colors[i] : parrotBlue;
        return (
          <TouchableOpacity
            key={opt}
            style={[
              styles.pill,
              pillPaddingHorizontal != null && { paddingHorizontal: pillPaddingHorizontal },
              colors
                ? { backgroundColor: isSelected ? color : color + "0D", borderColor: isSelected ? "transparent" : "rgba(150,150,150,0.5)" }
                : isSelected && { backgroundColor: parrotBlue, borderColor: parrotBlue }
            ]}
            onPress={() => onSelect(opt)}
          >
            <ParrotsStdText style={[styles.pillText, { color: isSelected ? "white" : "#555" }]}>
              {opt === "TinyHouse" ? "Tiny House" : opt}
            </ParrotsStdText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: parrotCream },
  scroll: { paddingHorizontal: 16, paddingTop: 0, paddingBottom: 24 },
  headerCard: { backgroundColor: "#0d2d52", borderRadius: 16, padding: 12, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 4 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  logoContainer: { width: 56, height: 56, borderRadius: 28, overflow: "hidden", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  logo: { width: 88, height: 88 },
  headerText: { flex: 1, marginLeft: 12 },
  title: { fontSize: 22, fontFamily: "Nunito_800ExtraBold", color: parrotCaravanOrangeRed },
  subtitle: { fontSize: 14, fontFamily: "Nunito_600SemiBold", color: "rgba(255,255,255,0.85)", marginTop: 2 },
  disclaimer: {
    fontSize: 12, fontFamily: "Nunito_600SemiBold", color: "rgba(255,255,255,0.45)",
  },
  card: {
    backgroundColor: "white", borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  cardLabel: { fontSize: 11, fontFamily: "Nunito_800ExtraBold", color: parrotPlaceholderGrey, letterSpacing: 1, marginBottom: 10 },
  pillGroup: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: {
    borderWidth: 1.5, borderColor: parrotPlaceholderGrey, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  pillSelected: { backgroundColor: parrotBlue, borderColor: parrotBlue },
  pillText: { fontSize: 14, color: parrotTextDarkBlue, fontFamily: "Nunito_600SemiBold" },
  pillTextSelected: { color: "white" },
  map: { width: "100%", height: 338, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, marginTop: 8 },
  tapPill: {
    position: "absolute", bottom: 2, right: 2,
    backgroundColor: "transparent",
  },
  tapPillInner: {
    backgroundColor: "#ffffff", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4,
  },
  tapPillText: { fontSize: 10.5, fontFamily: "Nunito_700Bold", color: parrotWalkTurquoise },
  promptText: { fontSize: 14, color: parrotInputTextColor, fontFamily: "Nunito_600SemiBold", lineHeight: 22, textAlign: "center" },
  askButton: {
    backgroundColor: parrotWalkTurquoise, borderRadius: 24, paddingVertical: 8,
    paddingHorizontal: 22, alignSelf: "center", marginTop: 8, marginBottom: 16, minWidth: 130,
  },
  askButtonText: { color: "white", fontSize: 16, fontFamily: "Nunito_800ExtraBold" },
  responseCard: {
    backgroundColor: "white", borderRadius: 16, padding: 16,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  locationLabel: { fontSize: 15, color: "#10B981", fontFamily: "Nunito_800ExtraBold", marginBottom: 6 },
  scrollArrow: { position: "absolute", bottom: 0, right: -10, pointerEvents: "none" },
  responseText: { fontSize: 15, color: parrotTextDarkBlue, lineHeight: 26, fontFamily: "Nunito_600SemiBold" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)", paddingHorizontal: 12 },
  modalSheet: {
    backgroundColor: "white", borderRadius: 24,
    padding: 24, paddingRight: 16, paddingBottom: 28, width: "100%", maxHeight: "85%",
    flexDirection: "column",
    shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 10,
  },
  modalHandle: { display: "none" },
  modalQueryRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12, marginLeft: -12, marginRight: 4 },
  modalQueryLogo: { width: 36, height: 36, marginRight: 8, marginLeft: -4, marginTop: -4 },
  modalQueryText: { flex: 1, fontSize: 13, color: parrotInputTextColor, fontFamily: "Nunito_600SemiBold", lineHeight: 20, opacity: 0.6, fontStyle: "italic" },
  modalButtons: { flexDirection: "row", gap: 8, marginTop: 20 },
  modalActionBtn: {
    flex: 1, borderRadius: 20, paddingVertical: 10, alignItems: "center",
  },
  modalActionText: { color: "white", fontSize: 14, fontFamily: "Nunito_800ExtraBold" },
  noBalanceCard: {
    backgroundColor: "white", borderRadius: 16, padding: 16, marginBottom: 12,
    flexDirection: "row", alignItems: "center", gap: 12,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  noBalanceCookie: { width: 48, height: 48 },
  noBalanceTitle: { fontSize: 14, fontFamily: "Nunito_800ExtraBold", color: parrotTextDarkBlue, marginBottom: 2 },
  noBalanceSubtitle: { fontSize: 13, fontFamily: "Nunito_600SemiBold", color: parrotPlaceholderGrey, marginBottom: 10 },
  noBalanceButton: {
    backgroundColor: parrotCaravanOrangeRed, borderRadius: 20,
    paddingVertical: 7, paddingHorizontal: 16, alignSelf: "flex-start",
  },
  noBalanceButtonText: { color: "white", fontSize: 13, fontFamily: "Nunito_800ExtraBold" },
});
