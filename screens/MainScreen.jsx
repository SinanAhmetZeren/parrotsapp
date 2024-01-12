/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { View, StyleSheet, Button, SafeAreaView, Text } from "react-native";
import MapView from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

export default function MainScreen({ navigation }) {
  //   const { message } = route.params;
  const username = "Öznur";

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View>
        <View style={{ height: 40 }}></View>

        <View style={styles.welcomeandFilters}>
          <View>
            <Text style={styles.welcome}>Welcome to Parrots</Text>
            <Text style={styles.username}>{username}!</Text>
          </View>
          <View style={styles.filterbox}>
            <MaterialCommunityIcons
              name="human-handsdown"
              size={24}
              color="black"
            />
            <AntDesign name="calendar" size={24} color="black" />
            <Ionicons name="car-outline" size={24} color="black" />
          </View>
        </View>

        {/* ------ MAP CONTAINER ------ */}
        <View style={styles.mapContainer}>
          <View style={styles.mapWrapper}>
            <MapView style={styles.map} initialRegion={initialRegion} />
          </View>
        </View>
        {/* ------ MAP CONTAINER ------ */}

        <Button
          title="Go to Profile"
          onPress={() =>
            navigation.navigate("Profile", {
              title: "Came from Main",
            })
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "#F5F1D9",
  },
  mapContainer: {
    backgroundColor: "white",
    width: "100%",
    height: "75%",
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  mapWrapper: {
    width: "94%",
    height: "100%",
    backgroundColor: "orange",
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
  welcomeandFilters: { flexDirection: "row" },
  filterbox: {
    flexDirection: "row",
    width: "30%",
    backgroundColor: "white",
    alignSelf: "flex-start",
  },
});

const initialRegion = {
  latitude: 52.362847,
  longitude: 4.922197,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};
