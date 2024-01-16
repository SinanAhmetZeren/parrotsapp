/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";

import VehicleFlatList from "../components/VehicleFlatList";
import FilterCountModal from "../components/FilterCountModal";
import FilterCalendarModal from "../components/FilterCalendarModal";
import FilterVehicleModal from "../components/FilterVehicleModal";

export default function MainScreen({ navigation }) {
  const [countModalVisibility, setCountModalVisibility] = useState(false);
  const [calendarModalVisibility, setCalendarModalVisibility] = useState(false);
  const [vehicleModalVisibility, setVehicleModalVisibility] = useState(false);
  const [isCountFiltered, setIsCountFiltered] = useState(false);
  const [isDatesFiltered, setIsDatesFiltered] = useState(false);
  const [isVehicleFiltered, setIsVehicleFiltered] = useState(false);
  //   const { message } = route.params;
  const username = "Öznur";

  const showAlert = (message) => {
    Alert.alert(
      message,
      `Your selection was ${message.toUpperCase()}`,
      [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed"),
        },
      ],
      { cancelable: false }
    );
  };

  function handleCountModal() {
    setCountModalVisibility(!countModalVisibility);
  }

  function handleCalendarModal() {
    setCalendarModalVisibility(!calendarModalVisibility);
  }

  function handleVehicleModal() {
    setVehicleModalVisibility(!vehicleModalVisibility);
    // console.log("hello from calendar modal");
  }

  return (
    <ScrollView style={styles.scrollview}>
      <View style={styles.countModal}>
        <FilterCountModal
          isCountFiltered={isCountFiltered}
          setIsCountFiltered={setIsCountFiltered}
          onClose={handleCountModal}
          isVisible={countModalVisibility}
        />
      </View>
      <View style={styles.calendarModal}>
        <FilterCalendarModal
          isDatesFiltered={isDatesFiltered}
          setIsDatesFiltered={setIsDatesFiltered}
          onClose={handleCalendarModal}
          isVisible={calendarModalVisibility}
        />
      </View>
      <View style={styles.vehicleModal}>
        <FilterVehicleModal
          isVehicleFiltered={isVehicleFiltered}
          setIsVehicleFiltered={setIsVehicleFiltered}
          onClose={handleVehicleModal}
          isVisible={vehicleModalVisibility}
        />
      </View>
      <View style={{ height: vh(100) }}>
        <View style={styles.searchAndMenu}>
          <Feather
            name="menu"
            size={24}
            color="black"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput1}
            placeholder="Search..."
            // Add any other TextInput props you need
          />
          <Fontisto name="bell" size={24} color="black" />
        </View>
        <View style={styles.welcomeandFilters}>
          <View style={styles.welcomebox}>
            <Text style={styles.welcome}>Welcome to Parrots</Text>
            <Text style={styles.username}>{username}!</Text>
          </View>
          <View style={styles.filterbox}>
            <TouchableOpacity onPress={handleCountModal}>
              <MaterialCommunityIcons
                style={[styles.icon, isCountFiltered ? styles.filtered : null]}
                name="human"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCalendarModal}>
              <AntDesign
                style={[styles.icon, isDatesFiltered ? styles.filtered : null]}
                name="calendar"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleVehicleModal}>
              <Ionicons
                style={[
                  styles.icon,
                  isVehicleFiltered ? styles.filtered : null,
                ]}
                name="car-outline"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.viewChoice}>
          <View style={styles.choiceItem}>
            <TouchableOpacity
              onPress={() => showAlert("vehicles")}
              style={styles.selectedChoice}
            >
              <Text style={styles.selectedText}>Vehicles</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.choiceItem}>
            <TouchableOpacity onPress={() => showAlert("voyages")}>
              <Text style={styles.choiceItemText}>Voyages</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.mapContainer}>
          <MapView style={styles.map} initialRegion={initialRegion}>
            <Marker
              coordinate={markerCoordinate1}
              title="Bisikletle Amsterdam"
              description="Bisiklete binip sokaklarda gezicez"
            />
            <Marker
              coordinate={markerCoordinate2}
              title="Bisikletle Amsterdam"
              description="Bisiklete binip sokaklarda gezicez"
            />
          </MapView>
        </View>
        <View style={styles.popularBox}>
          <Text style={styles.popular}>Popular</Text>
          <Text style={styles.seeall}>see all</Text>
        </View>
        <VehicleFlatList />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollview: {
    marginTop: vh(4),
    paddingTop: vh(2),
    marginBottom: vh(5),
    backgroundColor: "white",
  },
  welcomeandFilters: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginTop: 15,
    backgroundColor: "white",
  },
  viewChoice: {
    backgroundColor: "white",
    padding: 10,
    marginTop: 2,
    flexDirection: "row",
  },
  mapContainer: {
    height: "46%",
    marginBottom: 7,
    width: "94%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "white ",
  },
  flatList: {
    // height: "40%",
    flexDirection: "row",
    backgroundColor: "white",
    marginLeft: 10,
    paddingBottom: 0,
    marginTop: 6,
    bottom: 0,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  welcome: {
    fontSize: 18,
  },
  username: {
    fontSize: 26,
    fontWeight: "700",
  },
  welcomebox: {
    // backgroundColor: "white",
  },
  filterbox: {
    flexDirection: "row",
    flex: 1,
    // backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    padding: 7,
    margin: 2,
    // backgroundColor: "white",
    borderRadius: 20,
  },
  choiceItem: {
    marginHorizontal: 15,
  },
  choiceItemText: {
    fontSize: 18,
    fontWeight: "700",
    color: "grey",
  },
  searchAndMenu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    backgroundColor: "white", // Set background color as needed
  },
  searchInput1: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  popularBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 5,
    backgroundColor: "white",
  },
  popular: {
    marginLeft: 6,
    fontWeight: "700",
    fontSize: 18,
    color: "grey",
  },
  seeall: {
    fontWeight: "600",
    color: "#0077ea",
    marginRight: 6,
  },
  selectedChoice: {
    backgroundColor: "rgba(0, 0, 255, 0.05)",
    paddingHorizontal: 14,
    paddingVertical: 0,
    borderRadius: 10,
  },
  selectedText: {
    color: "#0077ea",
    fontSize: 18,
    fontWeight: "700",
  },
  filtered: {
    color: "#0077ea",
    backgroundColor: "rgba(0, 119, 234,0.06)",
    borderRadius: 15,
  },
});

const initialRegion = {
  latitude: 52.362847,
  longitude: 4.922197,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

const markerCoordinate1 = {
  latitude: 52.362847,
  longitude: 4.922197,
};
const markerCoordinate2 = {
  latitude: 52.392847,
  longitude: 4.962197,
};
