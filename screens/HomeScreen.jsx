/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Image,
} from "react-native";
import { useState, useCallback } from "react";
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { vw, vh } from "react-native-expo-viewport-units";

import FilterCountModal from "../components/FilterCountModal";
import FilterCalendarModal from "../components/FilterCalendarModal";
import FilterVehicleModal from "../components/FilterVehicleModal";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetVoyagesByLocationMutation,
  useGetFilteredVoyagesMutation,
} from "../slices/VoyageSlice";
import * as Location from "expo-location";
import VoyageListHorizontal from "../components/VoyageListHorizontal";
import VoyageCardProfileHorizontalModal from "../components/VoyageCardProfileHorizontalModal";

export default function HomeScreen({ navigation }) {
  const [countModalVisibility, setCountModalVisibility] = useState(false);
  const [calendarModalVisibility, setCalendarModalVisibility] = useState(false);
  const [vehicleModalVisibility, setVehicleModalVisibility] = useState(false);
  const [isCountFiltered, setIsCountFiltered] = useState(false);
  const [isDatesFiltered, setIsDatesFiltered] = useState(false);
  const [isVehicleFiltered, setIsVehicleFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [getVoyagesByLocation] = useGetVoyagesByLocationMutation();
  const [getFilteredVoyages] = useGetFilteredVoyagesMutation();
  const [initialLatitude, setInitialLatitude] = useState(0);
  const [initialLongitude, setInitialLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [latitudeDelta, setLatitudeDelta] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [longitudeDelta, setLongitudeDelta] = useState(0);
  const [initialVoyages, setInitialVoyages] = useState([]);
  const [count, setCount] = useState(1);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [cardHeaderM, setCardHeaderM] = useState("");
  const [cardDescriptionM, setCardDescriptionM] = useState("");
  const [cardImageM, setCardImageM] = useState("");
  const [vacancyM, setVacancyM] = useState(0);
  const [startDateM, setStartDateM] = useState("2024-03-14T09:00:00");
  const [endDateM, setEndDateM] = useState("2024-03-14T09:00:00");
  const [vehicleNameM, setVehicleNameM] = useState("");
  const [vehicleTypeM, setVehicleTypeM] = useState("");
  const [voyageIdM, setVoyageIdM] = useState("");
  const [latitudeM, setLatitudeM] = useState(0);
  const [longitudeM, setLongitudeM] = useState(0);
  const [selectedVoyageModalVisible, setSelectedVoyageModalVisible] =
    useState(false);

  const username = useSelector((state) => state.users.userName);

  const dispatch = useDispatch();

  useEffect(() => {
    async function getLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Permission to access location was denied");
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        const lat = location.coords.latitude;
        const lon = location.coords.longitude;
        setInitialLatitude(lat);
        setInitialLongitude(lon);
      } catch (error) {
        console.error("Error getting user location:", error);
      }
    }

    const fetchLocation = async () => {
      setIsLoading(true);
      await getLocation();
      setIsLoading(false);
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [latitude, longitude, latitudeDelta, longitudeDelta]);

  useEffect(() => {
    const getVoyages = async () => {
      const lat1 = initialLatitude - 10;
      const lat2 = initialLatitude + 10;
      const lon1 = initialLongitude - 10;
      const lon2 = initialLongitude + 10;
      setIsLoading(true);

      const voyages = await getVoyagesByLocation({ lon1, lon2, lat1, lat2 });
      // setInitialVoyages(voyages.data);
      setInitialVoyages(voyages.data || []);
      setIsLoading(false);
    };

    if (initialLatitude !== 0 && initialLongitude !== 0) {
      getVoyages();
    }
  }, [initialLatitude, initialLongitude]);

  const updateSelectedVoyageData = (item) => {
    setVoyageIdM(item.id);
    setCardHeaderM(item.name);
    setCardDescriptionM(item.brief);
    setCardImageM(item.profileImage);
    setVacancyM(item.vacancy);
    setStartDateM(item.startDate);
    setEndDateM(item.endDate);
    setVehicleNameM(item.vehicle.name);
    setVehicleTypeM(item.vehicle.type);
    setLatitudeM(item.waypoints[0]?.latitude);
    setLongitudeM(item.waypoints[0]?.longitude);
    setSelectedVoyageModalVisible(true);
  };

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
        { duration: 1000 }
      );
    }
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
      latitudeDelta,
      longitudeDelta,
      count,
      selectedVehicleType,
      formattedStartDate,
      formattedEndDate,
    };
    const filteredVoyages = await getFilteredVoyages(data);
    setInitialVoyages(filteredVoyages.data || []);
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

  const handleRegionChangeComplete = (newRegion) => {
    setLatitude(newRegion.latitude);
    setLongitude(newRegion.longitude);
    setLatitudeDelta(newRegion.latitudeDelta);
    setLongitudeDelta(newRegion.longitudeDelta);
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ top: vh(30) }} />;
  }

  // if (isError) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={{ fontSize: 50 }}>error...</Text>
  //     </View>
  //   );
  // }

  if (!isLoading) {
    const initialRegion = {
      latitude: initialLatitude,
      longitude: initialLongitude,
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
        <View style={{ height: vh(100) }}>
          <View style={styles.welcomeandFilters}>
            <View style={styles.welcomebox}>
              <Text style={styles.welcome}>Welcome to Parrots</Text>
              {username.length > 10 ? (
                username.length > 12 ? (
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.username}>
                      {username.substring(0, 7)}
                    </Text>
                    <Text style={styles.usernameSmall}>{"..."}</Text>
                    <Text style={styles.username}>!</Text>
                  </View>
                ) : (
                  <Text style={styles.username}>{username}!</Text>
                )
              ) : (
                <Text style={styles.username}>{username}!</Text>
              )}
            </View>

            <View style={styles.filterContainer}>
              <View style={styles.filterbox}>
                <TouchableOpacity onPress={handleCountModal}>
                  <MaterialCommunityIcons
                    style={[
                      styles.icon,
                      isCountFiltered ? styles.filtered : null,
                    ]}
                    name="human-handsup"
                    size={24}
                    color="#c3c3c3"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCalendarModal}>
                  <Ionicons
                    style={[
                      styles.icon,
                      isDatesFiltered ? styles.filtered : null,
                    ]}
                    name="calendar-outline"
                    size={24}
                    color="#c3c3c3"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleVehicleModal}>
                  <MaterialCommunityIcons
                    style={[
                      styles.icon,
                      isVehicleFiltered ? styles.filtered : null,
                    ]}
                    name="car-side"
                    size={24}
                    color="#c3c3c3"
                  />
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity
                  onPress={() => {
                    applyFilter();
                  }}
                >
                  <View>
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
              onRegionChangeComplete={handleRegionChangeComplete}
            >
              {initialVoyages.map((item, index) => {
                return (
                  <Marker
                    key={item.id}
                    pinColor={"#2ac898"}
                    coordinate={{
                      latitude: item.waypoints[0].latitude,
                      longitude: item.waypoints[0].longitude,
                    }}
                    onPress={() => {
                      updateSelectedVoyageData(item);
                    }}
                  />
                );
              })}
            </MapView>
          </View>

          {initialVoyages.length === 0 ? (
            <Text></Text>
          ) : (
            <View style={styles.mainBidsContainer}>
              <View style={styles.currentBidsAndSeeAll}>
                <Text style={styles.currentBidsTitle}>Voyages</Text>
              </View>
            </View>
          )}

          <VoyageListHorizontal focusMap={focusMap} data={initialVoyages} />
        </View>
        <View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={selectedVoyageModalVisible}
            onRequestClose={() => setSelectedVoyageModalVisible(false)}
          >
            <TouchableOpacity
              onPress={() => setSelectedVoyageModalVisible(false)}
              style={{
                flex: 1,
                backgroundColor: "rgba(1,1,1,0.14)",
              }}
            >
              <View style={styles.imageContainerInModal}>
                <VoyageCardProfileHorizontalModal
                  key={voyageIdM}
                  voyageId={voyageIdM}
                  cardHeader={cardHeaderM}
                  cardDescription={cardDescriptionM}
                  cardImage={cardImageM}
                  vacancy={vacancyM}
                  startdate={startDateM}
                  enddate={endDateM}
                  vehiclename={vehicleNameM}
                  vehicletype={vehicleTypeM}
                  latitude={latitudeM}
                  longitude={longitudeM}
                  focusMap={() => {}}
                  setSelectedVoyageModalVisible={setSelectedVoyageModalVisible}
                />
                {/* <TouchableOpacity
                  style={styles.closeButtonAndText}
                  onPress={() => setSelectedVoyageModalVisible(false)}
                >
                  <View style={styles.closeText1}>
                    <AntDesign name="closecircleo" size={22} color="#3aa4ff" />
                  </View>
                  <Text style={styles.closeText1}>Close</Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                  style={styles.closeButtonAndText2}
                  onPress={() => setSelectedVoyageModalVisible(false)}
                >
                  <View style={styles.closeButtonInModal2}>
                    <Image
                      style={styles.logo}
                      source={require("../assets/close-icon.png")}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  logo: {
    height: vh(5),
    width: vh(5),
    borderRadius: vh(10),
  },
  closeButtonInModal2: {
    alignSelf: "center",
    backgroundColor: "rgba(217, 241, 241,.75)",
    borderRadius: vh(10),
    padding: vh(1.5),
    borderColor: "#93c9ed",
    marginTop: vh(1),
  },
  innerProfileContainer: {
    alignSelf: "flex-end",
    flexDirection: "row",
    borderRadius: vh(2),
    paddingHorizontal: vw(2),
  },
  logoutBox: {
    marginTop: vh(0.5),
    backgroundColor: "white",
    width: vw(30),
    flexDirection: "row",
    borderRadius: vh(2),
    padding: vw(1),
    zIndex: 100,
  },
  imageContainerInModal: {
    top: vh(35),
    width: vw(90),
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    height: vh(20),
    borderRadius: vh(2),
    borderColor: "rgba(10, 119, 234,0.2)",
  },
  closeButtonAndText: {
    flexDirection: "row",
    height: vh(3.5),
    width: vh(11.45),
    backgroundColor: "white",
    borderRadius: vh(2.5),
    borderColor: "#3aa4ff",
    borderWidth: 1,
    verticalAlign: "middle",
    alignSelf: "center",
    position: "absolute",
    bottom: vh(-5),
  },

  closeButtonAndText2: {
    flexDirection: "row",
    position: "absolute",
    height: vh(3.5),
    width: vh(11.45),
    borderRadius: vh(2.5),
    bottom: vh(-6),
    alignSelf: "center",
  },

  closeText1: {
    marginLeft: vw(1),
    fontSize: 18,
    height: vh(3),
    alignSelf: "center",
    color: "#3aa4ff",
  },
  closeTextInModal: {
    color: "#3c9dde",
    fontWeight: "700",
    fontSize: 16,
  },
  closeButtonInModal: {
    alignSelf: "center",
    marginRight: vw(10),
    backgroundColor: "#f2fafa",
    borderRadius: vw(5),
    borderColor: "#93c9ed",
    padding: vw(1),
    paddingHorizontal: vw(3),
    marginTop: vh(1),
    marginBottom: vh(15),
  },
  filterButtonContaineronMap: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: vh(0.4),
    zIndex: 100,
    borderRadius: vh(4),
    backgroundColor: "white",
  },
  filterContainer: {
    //backgroundColor: "grey",
  },

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
  seeOnMapRefresh: {
    fontSize: 14,
    fontWeight: "700",
    // color: "#2ac898",
    color: "white",
    alignSelf: "flex-end",
    // backgroundColor: "rgba(42, 200, 152, 0.1)",
    backgroundColor: "rgba(0, 119, 234,0.7)",
    borderRadius: vh(3),
    paddingHorizontal: vh(3),
    paddingVertical: vh(0.5),
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
    // marginTop: vh(4),
    paddingTop: vh(2),
    marginBottom: vh(5),
    backgroundColor: "white",
  },
  welcomeandFilters: {
    flexDirection: "row",
    paddingHorizontal: vh(2),
    marginTop: 0,
    paddingBottom: vh(2),
  },
  mapContainer: {
    height: vh(47),
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
    color: "rgba(10, 119, 234,0.55)",
    fontWeight: "900",
  },
  username: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2ac898",
  },
  usernameLong: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2ac898",
  },
  usernameSmall: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2ac898",
    alignSelf: "flex-end",
  },
  welcomebox: {
    paddingTop: vh(1),
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
