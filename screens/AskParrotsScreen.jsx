/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import {
  View, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Animated, Modal, Clipboard, BackHandler
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { invokeHub, isHubReady } from "../signalr/signalRHub";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { useAskParrotsMutation } from "../slices/AiSlice";
import { FontAwesome } from "@expo/vector-icons";
import { ParrotsStdText } from "../components/ParrotsStdText";
import {
  parrotBlue, parrotCream, parrotGreen, parrotTextDarkBlue,
  parrotWalkTurquoise, parrotPlaceholderGrey, parrotInputTextColor,
  parrotBoatPurple, parrotCarRed, parrotCaravanOrangeRed, parrotBusYellowGreen,
  parrotRunLightOrange, parrotMotorcycleDarkRed, parrotBicycleTealGreen,
  parrotTinyHouseLightYellow, parrotAirplaneLightGreen, parrotTrainPink,
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

const VEHICLES = ["Boat", "Car", "Caravan", "Bus", "Walk", "Run", "Motorcycle", "Bicycle", "TinyHouse", "Airplane", "Train"];
const DURATIONS = ["Half day", "1 day", "2-3 days", "1 week", "2 weeks"];
const VIBES = ["Culture", "Food", "Nature", "Chill", "Adventure", "Budget", "Scenic", "Any"];
const RADII = ["1km", "5km", "10km", "50km"];

const DURATION_COLORS = ["#2ac898", "#2ac898", "#2ac898", "#2ac898", "#2ac898"];
const VIBE_COLORS = ["#F5A623", "#F5A623", "#F5A623", "#F5A623", "#F5A623", "#F5A623", "#F5A623", "#F5A623"];
const RADIUS_COLORS = ["#06B6D4", "#06B6D4", "#06B6D4", "#06B6D4"];

export default function AskParrotsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [vehicle, setVehicle] = useState(null);
  const [duration, setDuration] = useState(null);
  const [vibe, setVibe] = useState(null);
  const [radius, setRadius] = useState(null);
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
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      const coord = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      setPin(coord);
      mapRef.current?.animateToRegion({ ...coord, latitudeDelta: 0.0922, longitudeDelta: 0.0922 }, 500);
    })();
  }, []);

  const canAsk = vehicle && duration && vibe && radius && pin;

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
        latitude: pin?.latitude ?? 0,
        longitude: pin?.longitude ?? 0,
        radiusKm: radius.replace("km", ""),
      }).unwrap();
      setResponse(result.response);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    } catch (e) {
      setResponse(e?.data?.message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Image source={parrotLogo} style={styles.logo} />
        <ParrotsStdText style={styles.title}>Ask Parrots</ParrotsStdText>
        <ParrotsStdText style={styles.subtitle}>Tell me what kind of voyage you're after.</ParrotsStdText>
        <ParrotsStdText style={styles.disclaimer}>AI-generated suggestions — always verify before you go.</ParrotsStdText>

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

        {/* Radius */}
        <SectionCard label="STARTING WITHIN...">
          <PillGroup options={RADII} selected={radius} onSelect={setRadius} colors={RADIUS_COLORS} />
        </SectionCard>

        {/* Map */}
        <SectionCard label="AROUND... (TAP TO SET LOCATION)" style={{ padding: 0, paddingTop: 10, overflow: "hidden" }} labelStyle={{ paddingHorizontal: 16 }}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{ latitude: 41.0, longitude: 28.9, latitudeDelta: 20, longitudeDelta: 20 }}
            onPress={handleMapPress}
          >
            {pin && <Marker coordinate={pin} pinColor={parrotBoatPurple} />}
          </MapView>
        </SectionCard>

        {/* Prompt preview */}
        {canAsk && (
          <SectionCard label="YOUR QUERY">
            <ParrotsStdText style={styles.promptText}>
              {buildPromptParts(vehicle, duration, vibe, radius,
                VEHICLE_COLORS[VEHICLES.indexOf(vehicle)],
                DURATION_COLORS[DURATIONS.indexOf(duration)],
                VIBE_COLORS[VIBES.indexOf(vibe)],
                RADIUS_COLORS[RADII.indexOf(radius)],
                pin
              ).map((part, i) =>
                part.color
                  ? <ParrotsStdText key={i} style={[styles.promptText, { color: part.color }]}>{part.text}</ParrotsStdText>
                  : part.text
              )}
            </ParrotsStdText>
          </SectionCard>
        )}

        {/* Ask button */}
        <TouchableOpacity
          style={[styles.askButton, !canAsk && { opacity: 0.4 }]}
          onPress={handleAsk}
          disabled={!canAsk || loading}
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
                {canAsk && buildPromptParts(vehicle, duration, vibe, radius,
                  VEHICLE_COLORS[VEHICLES.indexOf(vehicle)],
                  DURATION_COLORS[DURATIONS.indexOf(duration)],
                  VIBE_COLORS[VIBES.indexOf(vibe)],
                  RADIUS_COLORS[RADII.indexOf(radius)],
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
                          return <ParrotsStdText key={i} style={[styles.responseText, { color: "#8B5CF6", fontFamily: "Nunito_800ExtraBold" }]}>{part.slice(2, -2)}</ParrotsStdText>;
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
                const query = buildPromptPreview(vehicle, duration, vibe, radius, pin);
                const responseText = response.replace(/^\[\[([^\]]+)\]\]\s*/, "($1) ").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\{\{([^}]+)\}\}/g, "$1");
                const text = `🦜 ${query}\n\n➡️ ${responseText}`;
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

const VIBE_DESCRIPTIONS = {
  Culture: "Culture (focused on cultural sights and history)",
  Food: "Food (focused on local food and dining)",
  Nature: "Nature (focused on nature and outdoor scenery)",
  Chill: "Chill (relaxed and laid-back)",
  Adventure: "Adventure (adventurous and off the beaten path)",
  Budget: "Budget (budget-friendly)",
  Scenic: "Scenic (focused on scenic landscapes and views)",
};

const ON_FOOT = ["Walk", "Run"];

function formatDuration(d) { return d === "Half day" ? "Half a Day" : d; }

function buildPromptParts(vehicle, duration, vibe, radius, vehicleColor, durationColor, vibeColor, radiusColor, pin = null) {
  const isOnFoot = ON_FOOT.includes(vehicle);
  const displayDuration = formatDuration(duration);
  const vibeDesc = vibe !== "Any" ? VIBE_DESCRIPTIONS[vibe] : null;
  const vibeKeyword = vibeDesc ? vibeDesc.split(" (")[0] : null;
  const vibeParenthesis = vibeDesc ? " (" + vibeDesc.split(" (")[1] : null;
  return [
    isOnFoot ? { text: "I want to go for a " } : { text: "I have a " },
    { text: vehicle, color: vehicleColor },
    isOnFoot ? { text: " for " } : { text: " and " },
    { text: displayDuration, color: durationColor },
    isOnFoot ? { text: ". " } : { text: " available. " },
    vibe === "Any"
      ? { text: "I'm looking for a voyage of " }
      : { text: "I'm looking for a " },
    vibe === "Any"
      ? { text: "any vibe", color: vibeColor }
      : { text: vibeKeyword, color: vibeColor },
    vibe !== "Any" && vibeParenthesis
      ? { text: vibeParenthesis }
      : { text: "" },
    vibe === "Any"
      ? { text: ", starting within " }
      : { text: " experience, starting within " },
    { text: radius, color: radiusColor },
    { text: " of this location " },
    pin ? { text: `(${pin.latitude.toFixed(4)}, ${pin.longitude.toFixed(4)}).`, color: parrotBoatPurple } : { text: "." },
  ];
}

function buildPromptPreview(vehicle, duration, vibe, radius, pin) {
  const isOnFoot = ON_FOOT.includes(vehicle);
  const displayDuration = formatDuration(duration);
  const vehiclePart = isOnFoot
    ? `I want to go for a ${vehicle} for ${displayDuration}.`
    : `I have a ${vehicle} and ${displayDuration} available.`;
  const vibePart = vibe === "Any"
    ? "I'm looking for a voyage of any vibe"
    : `I'm looking for a ${VIBE_DESCRIPTIONS[vibe] ?? vibe} experience`;
  const locationPart = pin
    ? `starting within ${radius} of this location (${pin.latitude.toFixed(4)}, ${pin.longitude.toFixed(4)})`
    : "";
  return `${vehiclePart} ${vibePart}, ${locationPart}.`;
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
              {opt}
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
  logo: { width: 180, height: 180, alignSelf: "center", marginTop: -30, marginBottom: -30 },
  title: { fontSize: 26, fontFamily: "Nunito_800ExtraBold", color: parrotTextDarkBlue, textAlign: "center", marginTop: 0 },
  subtitle: { fontSize: 14, color: parrotInputTextColor, textAlign: "center", marginBottom: 4 },
  disclaimer: { fontSize: 11, color: parrotPlaceholderGrey, textAlign: "center", marginBottom: 12, fontStyle: "italic" },
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
});
