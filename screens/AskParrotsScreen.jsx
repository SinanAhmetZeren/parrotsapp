/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import {
  View, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Animated, Modal, Clipboard
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { useAskParrotsMutation } from "../slices/AiSlice";
import { ParrotsStdText } from "../components/ParrotsStdText";
import {
  parrotBlue, parrotCream, parrotGreen, parrotTextDarkBlue,
  parrotWalkTurquoise, parrotPlaceholderGrey, parrotInputTextColor,
  parrotBoatPurple, parrotCarRed, parrotCaravanOrangeRed, parrotBusYellowGreen,
  parrotRunLightOrange, parrotMotorcycleDarkRed, parrotBicycleTealGreen,
  parrotTinyHouseLightYellow, parrotAirplaneLightGreen, parrotTrainPink,
} from "../assets/color";

const VEHICLE_COLORS = [
  parrotBoatPurple, parrotCarRed, parrotCaravanOrangeRed, parrotBusYellowGreen,
  parrotWalkTurquoise, parrotRunLightOrange, parrotMotorcycleDarkRed, parrotBicycleTealGreen,
  parrotTinyHouseLightYellow, parrotAirplaneLightGreen, parrotTrainPink,
];
import { Image } from "react-native";
import parrotLogo from "../assets/parrotsiconpaddedtransparent.png";

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

        {/* Vehicle */}
        <SectionCard label="VEHICLE TYPE">
          <PillGroup options={VEHICLES} selected={vehicle} onSelect={setVehicle} colors={VEHICLE_COLORS} />
        </SectionCard>

        {/* Duration */}
        <SectionCard label="DURATION">
          <PillGroup options={DURATIONS} selected={duration} onSelect={setDuration} colors={DURATION_COLORS} />
        </SectionCard>

        {/* Vibe */}
        <SectionCard label="VIBE">
          <PillGroup options={VIBES} selected={vibe} onSelect={setVibe} colors={VIBE_COLORS} />
        </SectionCard>

        {/* Radius */}
        <SectionCard label="RADIUS">
          <PillGroup options={RADII} selected={radius} onSelect={setRadius} colors={RADIUS_COLORS} />
        </SectionCard>

        {/* Map */}
        <SectionCard label="START LOCATION — TAP THE MAP">
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{ latitude: 41.0, longitude: 28.9, latitudeDelta: 20, longitudeDelta: 20 }}
            onPress={handleMapPress}
          >
            {pin && <Marker coordinate={pin} pinColor={parrotWalkTurquoise} />}
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
                RADIUS_COLORS[RADII.indexOf(radius)]
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
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setResponse(null)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <ParrotsStdText style={styles.responseText}>
                {response?.split(/\*\*([^*]+)\*\*/).map((part, i) =>
                  i % 2 === 1
                    ? <ParrotsStdText key={i} style={[styles.responseText, { color: parrotBlue }]}>{part}</ParrotsStdText>
                    : part
                )}
              </ParrotsStdText>
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCopy} onPress={() => {
                Clipboard.setString(response.replace(/\*\*([^*]+)\*\*/g, "$1"));
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}>
                <ParrotsStdText style={styles.modalCopyText}>{copied ? "Copied!" : "Copy"}</ParrotsStdText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalClose} onPress={() => setResponse(null)}>
                <ParrotsStdText style={styles.modalCloseText}>Close</ParrotsStdText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
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

function buildPromptParts(vehicle, duration, vibe, radius, vehicleColor, durationColor, vibeColor, radiusColor) {
  const vibePart = vibe === "Any" ? "any vibe" : VIBE_DESCRIPTIONS[vibe] ?? vibe;
  return [
    { text: "I have a " },
    { text: vehicle, color: vehicleColor },
    { text: " and " },
    { text: duration, color: durationColor },
    { text: " available. " },
    vibe === "Any"
      ? { text: "I'm looking for a voyage of " }
      : { text: "I'm looking for a " },
    { text: vibePart, color: vibeColor },
    vibe === "Any"
      ? { text: ", starting within " }
      : { text: " experience, starting within " },

    { text: radius, color: radiusColor },
    { text: " of this location." },
  ];
}

function buildPromptPreview(vehicle, duration, vibe, radius, pin) {
  const vibePart = vibe === "Any"
    ? "I'm open to any vibe"
    : `I'm looking for a ${VIBE_DESCRIPTIONS[vibe] ?? vibe} experience`;
  const locationPart = pin
    ? `starting within ${radius} of this location`
    : "";
  return `I have a ${vehicle} and ${duration} available. ${vibePart}, ${locationPart}.`;
}

function SectionCard({ label, children }) {
  return (
    <View style={styles.card}>
      <ParrotsStdText style={styles.cardLabel}>{label}</ParrotsStdText>
      {children}
    </View>
  );
}

function PillGroup({ options, selected, onSelect, colors }) {
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
  subtitle: { fontSize: 14, color: parrotInputTextColor, textAlign: "center", marginBottom: 12 },
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
  map: { width: "100%", height: 260, borderRadius: 12, marginTop: 8 },
  promptText: { fontSize: 14, color: parrotInputTextColor, fontFamily: "Nunito_600SemiBold", lineHeight: 22, textAlign: "center" },
  askButton: {
    backgroundColor: parrotWalkTurquoise, borderRadius: 24, paddingVertical: 12,
    paddingHorizontal: 32, alignSelf: "center", marginTop: 8, marginBottom: 16, minWidth: 160,
  },
  askButtonText: { color: "white", fontSize: 16, fontFamily: "Nunito_800ExtraBold" },
  responseCard: {
    backgroundColor: "white", borderRadius: 16, padding: 16,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  responseText: { fontSize: 15, color: parrotTextDarkBlue, lineHeight: 26, fontFamily: "Nunito_600SemiBold" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)", paddingHorizontal: 24 },
  modalSheet: {
    backgroundColor: "white", borderRadius: 24,
    padding: 24, paddingBottom: 28, width: "100%", maxHeight: "70%",
    shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 10,
  },
  modalHandle: { display: "none" },
  modalButtons: { flexDirection: "row", gap: 10, marginTop: 20 },
  modalCopy: {
    flex: 1, borderWidth: 1.5, borderColor: parrotWalkTurquoise, borderRadius: 14,
    paddingVertical: 12, alignItems: "center",
  },
  modalCopyText: { color: parrotWalkTurquoise, fontSize: 16, fontFamily: "Nunito_800ExtraBold" },
  modalClose: {
    flex: 1, backgroundColor: parrotWalkTurquoise, borderRadius: 14,
    paddingVertical: 12, alignItems: "center",
  },
  modalCloseText: { color: "white", fontSize: 16, fontFamily: "Nunito_800ExtraBold" },
});
