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
  FlatList,
  TextInput,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import VehicleCard from "../components/VehicleCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
export default function MainScreen({ navigation }) {
  //   const { message } = route.params;
  const username = "Öznur";

  return (
    <ScrollView style={styles.scrollview}>
      {/* <View style={styles.dummyview2}></View> */}

      <View style={styles.container1}>
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
          <MaterialCommunityIcons
            style={styles.icon}
            name="human"
            size={24}
            color="black"
          />
          <AntDesign
            style={styles.icon}
            name="calendar"
            size={24}
            color="black"
          />
          <Ionicons
            style={styles.icon}
            name="car-outline"
            size={24}
            color="black"
          />
        </View>
      </View>

      <View style={styles.viewChoice}>
        <View style={styles.choiceItem}>
          <TouchableOpacity style={styles.selectedChoice}>
            <Text style={styles.selectedText}>Vehicles</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.choiceItem}>
          <TouchableOpacity>
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

      <View style={styles.flatListToBe}>
        <VehicleCard />
      </View>

      <View style={styles.dummyview1}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollview: {
    marginTop: 40,
    marginBottom: 80,
    backgroundColor: "white",
  },
  welcomeandFilters: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginTop: 15,
    // backgroundColor: "lightgreen",
  },
  viewChoice: {
    // backgroundColor: "lightblue",
    padding: 10,
    marginTop: 2,
    flexDirection: "row",
  },
  mapContainer: {
    height: "53%",
    marginBottom: 7,
    // backgroundColor: "white",
    width: "94%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    overflow: "hidden",
    borderRadius: 20,
  },
  flatListToBe: {
    // height: "40%",
    flexDirection: "row",
    // backgroundColor: "white",
    marginLeft: 10,
    paddingBottom: 0,
    marginTop: 6,
    bottom: 0,
  },
  dummyview1: {
    height: 470,
  },
  dummyview2: {
    height: 50,
    backgroundColor: "yellow",
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
  container1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff", // Set background color as needed
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
