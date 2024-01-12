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
} from "react-native";
import MapView from "react-native-maps";
import VehicleCard from "../components/VehicleCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

export default function MainScreen({ navigation }) {
  //   const { message } = route.params;
  const username = "Öznur";

  return (
    <SafeAreaView>
      <View style={{ backgroundColor: "cornsilk" }}>
        {/* <ScrollView style={styles.scrollView}> */}
        <View style={{ height: 20 }}></View>

        {/* ------ WELCOME AND FILTER CONTAINER ------ */}
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
        {/* ------ WELCOME AND FILTER CONTAINER ------ */}

        {/* ------ VOYAGE AND VEHICLE CONTAINER ------ */}
        <View style={styles.viewChoice}>
          <View style={styles.choiceItem}>
            <TouchableOpacity>
              <Text style={styles.choiceItemText}>Vehicles</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.choiceItem}>
            <TouchableOpacity>
              <Text style={styles.choiceItemText}>Voyages</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ------ VOYAGE AND VEHICLE CONTAINER ------ */}

        {/* ------ MAP CONTAINER ------ */}
        <View style={styles.mapContainer}>
          <View style={styles.mapWrapper}>
            <MapView style={styles.map} initialRegion={initialRegion} />
          </View>
        </View>
        {/* ------ MAP CONTAINER ------ */}

        <View style={styles.flatListToBe}>
          <VehicleCard />
        </View>
        <View style={styles.flatListToBe}>
          <VehicleCard />
        </View>
        {/* </ScrollView> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    height: 200,
    backgroundColor: "red",
  },

  mapContainer: {
    backgroundColor: "white",
    width: "100%",
    height: 400,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  mapWrapper: {
    width: "92%",
    height: "98%",
    backgroundColor: "cornsilk",
    borderRadius: 15,
    overflow: "hidden",
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
  welcomeandFilters: {
    flexDirection: "row",
    padding: 15,
    marginTop: 15,
    backgroundColor: "white",
  },
  welcomebox: {
    backgroundColor: "white",
  },
  filterbox: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    padding: 7,
    margin: 2,
    backgroundColor: "white",
    borderRadius: 20,
  },
  viewChoice: {
    backgroundColor: "white",
    margin: 10,
    flexDirection: "row",
  },
  choiceItem: {
    marginHorizontal: 15,
  },
  choiceItemText: {
    fontSize: 18,
    fontWeight: "700",
    color: "grey",
  },
  flatListToBe: {
    backgroundColor: "red",
    height: "33%",
  },
});

const initialRegion = {
  latitude: 52.362847,
  longitude: 4.922197,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};
