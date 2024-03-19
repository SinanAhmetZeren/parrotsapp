/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { useEffect, useRef } from "react";
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
  Image,
  Button,
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
import { useSelector } from "react-redux";
import { useGetUserByIdQuery } from "../slices/UserSlice";
import {
  useGetVoyagesByLocationMutation,
  useGetFilteredVoyagesMutation,
} from "../slices/VoyageSlice";
import * as Location from "expo-location";
import VoyageListHorizontal from "../components/VoyageListHorizontal";

export default function HomeScreen({ navigation }) {
  const [countModalVisibility, setCountModalVisibility] = useState(false);
  const [calendarModalVisibility, setCalendarModalVisibility] = useState(false);
  const [vehicleModalVisibility, setVehicleModalVisibility] = useState(false);
  const [isCountFiltered, setIsCountFiltered] = useState(false);
  const [isDatesFiltered, setIsDatesFiltered] = useState(false);
  const [isVehicleFiltered, setIsVehicleFiltered] = useState(false);

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
  const [getFilteredVoyages] = useGetFilteredVoyagesMutation();
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [initialVoyages, setInitialVoyages] = useState([]);

  const [count, setCount] = useState(1);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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

    if (latitude !== 0 && longitude !== 0) {
      getVoyages();
    }
  }, [latitude, longitude]);

  const mapRef = useRef(null);

  const focusMap = (latitude, longitude) => {
    if (mapRef.current) {
      mapRef.current.animateCamera(
        {
          center: {
            latitude,
            longitude,
          },
          heading: 0,
          pitch: 10,
        },
        { duration: 1000 } // Adjust the duration as needed for your desired animation speed
      );
    }
  };

  const printState = () => {
    console.log("count: ", count);
    console.log("vehicle type: ", selectedVehicleType);
    console.log("start date: ", startDate);
    console.log("end date: ", endDate);
  };

  const printVoyages = () => {
    initialVoyages.forEach((v, i) => {
      console.log(i, v.name);
    });
  };

  function convertDateFormat(inputDate, dateType) {
    if (inputDate === null && dateType === "endDate") {
      return "2060-01-01 00:00:00.000";
    }

    if (inputDate === null && dateType === "startDate") {
      return "1970-01-01 00:00:00.000";
    }

    const date = new Date(inputDate);
    const year = date.getUTCFullYear();
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);
    const day = `0${date.getUTCDate()}`.slice(-2);
    const hours = `0${date.getUTCHours()}`.slice(-2);
    const minutes = `0${date.getUTCMinutes()}`.slice(-2);
    const seconds = `0${date.getUTCSeconds()}`.slice(-2);
    const milliseconds = `00${date.getUTCMilliseconds()}`.slice(-3);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  const applyFilter = async () => {
    const formattedStartDate = convertDateFormat(startDate, "startDate");
    const formattedEndDate = convertDateFormat(endDate, "endDate");

    const data = {
      latitude,
      longitude,
      count,
      selectedVehicleType,
      formattedStartDate,
      formattedEndDate,
    };
    const filteredVoyages = await getFilteredVoyages(data);
    setInitialVoyages(filteredVoyages.data);
  };

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
            count={count}
            setCount={setCount}
          />
        </View>
        <View style={styles.calendarModal}>
          <FilterCalendarModal
            isDatesFiltered={isDatesFiltered}
            setIsDatesFiltered={setIsDatesFiltered}
            onClose={handleCalendarModal}
            isVisible={calendarModalVisibility}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </View>
        <View style={styles.vehicleModal}>
          <FilterVehicleModal
            isVehicleFiltered={isVehicleFiltered}
            setIsVehicleFiltered={setIsVehicleFiltered}
            onClose={handleVehicleModal}
            isVisible={vehicleModalVisibility}
            selectedVehicleType={selectedVehicleType}
            setSelectedVehicleType={setSelectedVehicleType}
          />
        </View>
        <View style={{ height: vh(110) }}>
          <View
            style={{
              marginTop: vh(2),
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              title="print state 3"
              onPress={() => {
                printState();
              }}
            />

            <Button
              title="print voyages"
              onPress={() => {
                printVoyages();
              }}
            />

            <Button
              title="filter"
              onPress={() => {
                applyFilter();
              }}
            />
          </View>
          <View style={styles.welcomeandFilters}>
            <View style={styles.welcomebox}>
              <Text style={styles.welcome}>Welcome to Parrots</Text>
              <Text style={styles.username}>{username}!</Text>
            </View>

            <View style={styles.filterContainer}>
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

              <View style={styles.filterButtonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    applyFilter();
                  }}
                  style={styles.extendedAreaContainer}
                >
                  <View style={styles.extendedArea}>
                    <Text style={styles.seeOnMap}>Apply Filter</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={initialRegion}
              ref={mapRef}
            >
              {/* <Marker coordinate={markerCoordinate} /> */}
              {initialVoyages.map((item, index) => {
                return (
                  <Marker
                    key={index}
                    pinColor={"#2ac898"}
                    coordinate={{
                      latitude: item.waypoints[0].latitude,
                      longitude: item.waypoints[0].longitude,
                    }}
                  />
                );
              })}
            </MapView>
          </View>

          <View style={styles.mainBidsContainer}>
            <View style={styles.currentBidsAndSeeAll}>
              <Text style={styles.currentBidsTitle}>Voyages</Text>
            </View>
          </View>

          {/* <VehicleFlatList /> */}
          <VoyageListHorizontal focusMap={focusMap} data={initialVoyages} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  filterButtonContainer: {
    // backgroundColor: "yellow",
  },
  filterContainer: {
    // backgroundColor: "grey",
  },
  extendedAreaContainer: {
    borderRadius: vh(1),
  },
  extendedArea: {},
  seeOnMap: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2ac898",
    alignSelf: "flex-end",
    backgroundColor: "rgba(42, 200, 152, 0.1)",
    borderRadius: vh(3),
    paddingHorizontal: vh(5),
    paddingVertical: vh(1),
  },
  currentBidsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3c9dde",
  },
  mainBidsContainer: {
    borderRadius: vw(5),
    marginHorizontal: vw(4),
    borderColor: "#93c9ed",
  },
  currentBidsAndSeeAll: {
    marginTop: vh(2),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: vw(10),
  },
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
    paddingBottom: vh(2),
  },

  mapContainer: {
    height: vh(43),
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
    color: "#2ac898",
  },
  welcomebox: {
    paddingTop: vh(2),
    width: vw(50),
  },
  filterbox: {
    flexDirection: "row",
    justifyContent: "space-around",

    width: vw(43),
  },
  icon: {
    padding: 7,
    margin: 2,
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
