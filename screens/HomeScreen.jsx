/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Image,
  RefreshControl,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import { MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { vw, vh } from "react-native-expo-viewport-units";

import FilterCountModal from "../components/FilterCountModal";
import FilterCalendarModal from "../components/FilterCalendarModal";
import FilterVehicleModal from "../components/FilterVehicleModal";
import { useSelector } from "react-redux";
import {
  useGetVoyagesByLocationMutation,
  useGetFilteredVoyagesMutation,
} from "../slices/VoyageSlice";
import * as Location from "expo-location";
import VoyageListHorizontal from "../components/VoyageListHorizontal";
import VoyageCardProfileHorizontalModal from "../components/VoyageCardProfileHorizontalModal";
import { CommonActions } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const [countModalVisibility, setCountModalVisibility] = useState(false);
  const [calendarModalVisibility, setCalendarModalVisibility] = useState(false);
  const [vehicleModalVisibility, setVehicleModalVisibility] = useState(false);
  const [isCountFiltered, setIsCountFiltered] = useState(false);
  const [isDatesFiltered, setIsDatesFiltered] = useState(false);
  const [isVehicleFiltered, setIsVehicleFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  const [refreshing, setRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [selectedVoyageModalVisible, setSelectedVoyageModalVisible] =
    useState(false);

  const [
    getVoyagesByLocation,
    {
      isError: isErrorVoyages,
      isLoading: isLoadingVoyages,
      isSuccess: isSuccessVoyages,
    },
  ] = useGetVoyagesByLocationMutation();
  const [
    getFilteredVoyages,
    {
      isError: isErrorVoyagesFiltered,
      isLoading: isLoadingVoyagesFiltered,
      isSuccess: isSuccessVoyagesFiltered,
    },
  ] = useGetFilteredVoyagesMutation();

  const username = useSelector((state) => state.users.userName);
  // 1. GET LOCATION //
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
        //const lat = 52.2;  // cambridge
        //const lon = 0.13;  // cambridge
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
      const lat1 = initialLatitude - 0.15;
      const lat2 = initialLatitude + 0.15;
      const lon1 = initialLongitude - 0.2;
      const lon2 = initialLongitude + 0.2;

      setIsLoading(true);

      const voyages = await getVoyagesByLocation({ lon1, lon2, lat1, lat2 });
      setInitialVoyages(voyages.data || []);
      setIsLoading(false);
    };

    if (initialLatitude !== 0 && initialLongitude !== 0) {
      getVoyages();
    }
  }, [initialLatitude, initialLongitude]);

  useEffect(() => {
    if (isErrorVoyages) {
      setHasError(true);
    }
  }, [isErrorVoyages]);

  const onRefresh = () => {
    setRefreshing(true);
    setHasError(false);
    console.log("refreshing ");
    try {
      const getVoyages = async () => {
        const lat1 = initialLatitude - 0.15;
        const lat2 = initialLatitude + 0.15;
        const lon1 = initialLongitude - 0.2;
        const lon2 = initialLongitude + 0.2;

        setIsLoading(true);

        const voyages = await getVoyagesByLocation({ lon1, lon2, lat1, lat2 });
        setInitialVoyages(voyages.data || []);
        setIsLoading(false);
      };

      getVoyages();

      // console.log(initialVoyages);
      console.log("latitude", latitude);
      console.log("longitude", longitude);
      console.log("refreshing 2 ");
    } catch (error) {
      console.log(error);
      setHasError(true);
    }
    setRefreshing(false);
  };

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
    console.log("latitude", latitude);

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

  /*
  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 50, padding: vh(10) }}>error...</Text>
      </View>
    );
  }
*/

  if (!isLoading) {
    const initialRegion = {
      latitude: initialLatitude,
      longitude: initialLongitude,
      latitudeDelta: 0.25,
      longitudeDelta: 0.25,
    };

    return (
      <ScrollView
        style={styles.scrollview}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#9Bd35A", "#689F38"]} // Android
            tintColor="#689F38" // iOS
          />
        }
      >
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
        <View style={{ height: vh(95) }}>
          <View style={styles.welcomeandFilters}>
            <Image
              source={require("../assets/parrots-logo-mini.png")}
              style={styles.miniLogo}
            />

            <View style={styles.welcomebox}>
              <Text style={styles.welcome}>Welcome to Parrots</Text>

              {username.length < 13 ? (
                <Text style={styles.usernameLarge}>{username}!</Text>
              ) : null}
              {username.length > 12 && username.length < 18 ? ( // 13 to 16
                <Text style={styles.usernameMedium}>{username}!</Text>
              ) : null}
              {username.length > 17 && username.length < 21 ? ( // 17 to 24
                <Text style={styles.usernameSmall}>{username}!</Text>
              ) : null}
              {username.length > 20 ? (
                <Text style={styles.usernameSmall}>
                  {username.substring(0, 19)}...!
                </Text>
              ) : null}
            </View>

            <View>
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
                    <Text style={styles.applyFilter}>Apply Filter</Text>
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
          {/* {isErrorVoyages ? ( */}
          {hasError ? (
            <View>
              <View>
                <Image
                  source={require("../assets/ParrotsWhiteBg.png")}
                  style={styles.logoImage}
                />
                <Text style={styles.currentBidsTitle2}>Connection Error</Text>
                <Text style={styles.currentBidsTitle3}>
                  Swipe Down to Retry
                </Text>
              </View>
            </View>
          ) : null}

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
                backgroundColor: "rgba(1,1,1,0.3)",
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

                <TouchableOpacity
                  style={styles.closeButtonAndText2}
                  onPress={() => setSelectedVoyageModalVisible(false)}
                >
                  <View>
                    <Text style={styles.buttonClose}>Close</Text>
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
  currentBidsTitle3: {
    top: vh(-3),
    fontSize: 17,
    fontWeight: "700",
    color: "#3c9dde",
    textAlign: "center",
  },
  currentBidsTitle2: {
    top: vh(-3),
    fontSize: 17,
    fontWeight: "700",
    color: "#3c9dde",
    textAlign: "center",
  },
  logoImage: {
    height: vh(23),
    width: vh(23),
    alignSelf: "center",
  },
  buttonClose: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    alignSelf: "center",
    backgroundColor: "#186ff1",
    width: vw(30),
    borderRadius: vh(4),
    padding: vw(1),
  },
  closeButtonAndText2: {
    flexDirection: "row",
    position: "absolute",
    width: vh(11.45),
    borderRadius: vh(2.5),
    bottom: vh(-5),
    alignSelf: "center",
  },

  miniLogo: {
    height: vh(6),
    width: vh(6),
    alignSelf: "center",
    marginLeft: vw(-1),
    marginRight: vw(2),
    zIndex: 1,
  },
  logo: {
    height: vh(5),
    width: vh(5),
    borderRadius: vh(10),
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
    borderColor: "rgba(10, 119, 234,0.9)",
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
  applyFilter: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2ac898",
    alignSelf: "flex-end",
    backgroundColor: "rgba(42, 200, 152, 0.1)",
    borderRadius: vh(3),
    paddingHorizontal: vh(2),
    paddingVertical: vh(0.7),
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
    marginBottom: vh(1),
    backgroundColor: "white",
  },
  welcomeandFilters: {
    flexDirection: "row",
    paddingHorizontal: vh(2),
    marginTop: 0,
    paddingBottom: vh(2),
  },
  mapContainer: {
    height: vh(50),
    marginBottom: 7,
    width: "94%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "white ",
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

  usernameLarge: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2ac898",
  },
  usernameMedium: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2ac898",
  },
  usernameSmall: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2ac898",
  },
  welcomebox: {
    width: vw(50),
    justifyContent: "center",
  },
  filterbox: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: vw(30),
  },
  icon: {
    padding: 7,
    margin: 2,
    borderRadius: 20,
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
