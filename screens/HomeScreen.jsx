/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
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
import { VoyagesFlatlistMainpage } from "../components/VoyagesFlatlistMainpage";
import { useSelector } from "react-redux";
import { useGetUserByIdQuery } from "../slices/UserSlice";
import { useGetVoyagesByLocationMutation } from "../slices/VoyageSlice";
import * as Location from "expo-location";

export default function HomeScreen({ navigation }) {
  const [countModalVisibility, setCountModalVisibility] = useState(false);
  const [calendarModalVisibility, setCalendarModalVisibility] = useState(false);
  const [vehicleModalVisibility, setVehicleModalVisibility] = useState(false);
  const [isCountFiltered, setIsCountFiltered] = useState(false);
  const [isDatesFiltered, setIsDatesFiltered] = useState(false);
  const [isVehicleFiltered, setIsVehicleFiltered] = useState(false);
  //   const { message } = route.params;

  const userId = useSelector((state) => state.users.userId);
  const {
    data: userData,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useGetUserByIdQuery(userId);
  const [getVoyagesByLocation] = useGetVoyagesByLocationMutation();
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [initialVoyages, setInitialVoyages] = useState([]);

  useEffect(() => {
    async function getLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Permission to access location was denied");
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        console.log("User Location:", latitude, longitude);
      } catch (error) {
        console.error("Error getting user location:", error);
      }
    }

    getLocation();
  }, []);

  useEffect(() => {
    const getVoyages = async () => {
      const lat1 = latitude - 50;
      const lat2 = latitude + 50;
      const lon1 = longitude - 50;
      const lon2 = longitude + 50;

      const voyages = await getVoyagesByLocation({ lon1, lon2, lat1, lat2 });
      setInitialVoyages(voyages.data);
    };
    getVoyages();
  }, [latitude, longitude]);

  function handleCountModal() {
    setCountModalVisibility(!countModalVisibility);
  }

  function handleCalendarModal() {
    setCalendarModalVisibility(!calendarModalVisibility);
  }

  function handleVehicleModal() {
    setVehicleModalVisibility(!vehicleModalVisibility);
  }

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ top: vh(30) }} />;
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 50 }}>error...</Text>
      </View>
    );
  }

  if (isSuccess) {
    let username = userData.userName;

    initialVoyages.forEach((obj) => {
      console.log("ID:", obj.id);
    });

    const initialRegion = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.25,
      longitudeDelta: 0.25,
    };

    const markerCoordinate = {
      latitude: latitude,
      longitude: longitude,
    };

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
                  style={[
                    styles.icon,
                    isCountFiltered ? styles.filtered : null,
                  ]}
                  name="human"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCalendarModal}>
                <AntDesign
                  style={[
                    styles.icon,
                    isDatesFiltered ? styles.filtered : null,
                  ]}
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
          <View style={styles.mapContainer}>
            <MapView style={styles.map} initialRegion={initialRegion}>
              <Marker coordinate={markerCoordinate} />
            </MapView>
          </View>
          <View style={styles.popularBox}>
            <Text style={styles.popular}>Popular</Text>
            <Text style={styles.seeall}>see all</Text>
          </View>
          {/* <VehicleFlatList /> */}
          <VoyagesFlatlistMainpage voyages={initialVoyages} />
        </View>
      </ScrollView>
    );
  }
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
  filtered: {
    color: "#0077ea",
    backgroundColor: "rgba(0, 119, 234,0.06)",
    borderRadius: 15,
  },
});
