/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { use } from "react";
import { useEffect, useRef, useState, memo } from "react";
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

import AsyncStorage from "@react-native-async-storage/async-storage";

import { MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";
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
import { updateAsLoggedOut } from "../slices/UserSlice";
import * as Location from "expo-location";
import VoyageListHorizontal from "../components/VoyageListHorizontal";
import VoyageCardProfileHorizontalModal from "../components/VoyageCardProfileHorizontalModal";
import parrotMarker1 from "../assets/parrotMarkers/parrotMarker1.png";
import parrotMarker2 from "../assets/parrotMarkers/parrotMarker2.png";
import parrotMarker3 from "../assets/parrotMarkers/parrotMarker3.png";
import parrotMarker4 from "../assets/parrotMarkers/parrotMarker4.png";
import parrotMarker5 from "../assets/parrotMarkers/parrotMarker5.png";
import parrotMarker6 from "../assets/parrotMarkers/parrotMarker6.png";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import {
  applyFilterAppliedBackgroundColor, applyFilterAppliedBorderColor, applyFilterAppliedColor,
  applyFilterChangedBackgroundColor, applyFilterChangedBorderColor, applyFilterChangedColor,
  applyFilterInitialBackgroundColor, applyFilterInitialBorderColor, applyFilterInitialColor,
  parrotBananaLeafGreen, parrotBlue, parrotBlueMediumTransparent, parrotCream, parrotDarkCream, parrotGreen, parrotInputTextColor, parrotPistachioGreen,
  parrotPlaceholderGrey
} from "../assets/color";

// Define static assets outside to keep references stable
const markerImages = [parrotMarker1, parrotMarker2, parrotMarker3, parrotMarker4, parrotMarker5, parrotMarker6];




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
  const [startDateM, setStartDateM] = useState("2004-03-14T09:00:00");
  const [endDateM, setEndDateM] = useState("2054-03-14T09:00:00");
  const [vehicleNameM, setVehicleNameM] = useState("");
  const [vehicleTypeM, setVehicleTypeM] = useState("");
  const [voyageIdM, setVoyageIdM] = useState("");
  const [latitudeM, setLatitudeM] = useState(0);
  const [longitudeM, setLongitudeM] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedVoyageModalVisible, setSelectedVoyageModalVisible] =
    useState(false);

  const initialFilters = JSON.stringify({ // initial state for filters
    count: 1,
    startDate: null,
    endDate: null,
    selectedVehicleType: null,
  })
  const [appliedFilters, setAppliedFilters] = useState(initialFilters); // last state of api call
  const [currentFilters, setCurrentFilters] = useState(initialFilters); // current state of filters
  const areEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  const [filterComparisonState, setFilterComparisonState] = useState(1); // default

  useEffect(() => {
    const current = JSON.stringify({
      count,
      startDate,
      endDate,
      selectedVehicleType,
    })
    setCurrentFilters(current);
    // console.log("Current filters updated:", current);
  }, [count, startDate, endDate, selectedVehicleType]);


  useEffect(() => {
    // console.log("--- Comparing filters ---");
    if (areEqual(appliedFilters, initialFilters) && areEqual(appliedFilters, currentFilters)) {
      // Case 1: all equal
      /*
      console.log("Case 1: all filters are equal");
      console.log("Initial filters:", initialFilters);
      console.log("Current filters:", currentFilters);
      console.log("Applied filters:", appliedFilters);
      */
      setFilterComparisonState(1);
    } else if (areEqual(appliedFilters, currentFilters) && !areEqual(currentFilters, initialFilters)) {
      // Case 2: applied == current but different from initial
      /*
      console.log("Case 2: applied == current but different from initial");
      console.log("Initial filters:", initialFilters);
      console.log("Current filters:", currentFilters);
      console.log("Applied filters:", appliedFilters);
      */
      setFilterComparisonState(2);
    } else if (
      !areEqual(appliedFilters, currentFilters)
      // &&
      // !areEqual(currentFilters, initialFilters) &&
      // !areEqual(appliedFilters, initialFilters)
    ) {
      // Case 3: current != applied and != initial
      /*
      console.log("Case 3: current != applied");
      console.log("Initial filters:", initialFilters);
      console.log("Current filters:", currentFilters);
      console.log("Applied filters:", appliedFilters);
      */

      setFilterComparisonState(3);
    }
  }, [appliedFilters, currentFilters, initialFilters]);


  const markerImages2 = [
    parrotMarker1,
    parrotMarker2,
    parrotMarker3,
    parrotMarker4,
    parrotMarker5,
    parrotMarker6,
  ];


  // Create a memoized sub-component to prevent unnecessary redraws
  const MapMarker = memo(({ item, index, onPress }) => {
    const [tracksView, setTracksView] = useState(true);
    const markerImage = markerImages[index % markerImages.length];

    return (
      <Marker
        key={`item-${item.id}`}
        pinColor={parrotGreen}
        coordinate={{
          latitude: item.waypoints[0]?.latitude,
          longitude: item.waypoints[0]?.longitude,
        }}
        tracksViewChanges={tracksView}
        onPress={() => {
          updateSelectedVoyageData(item);
        }} // image={markerImage}
      >
        <Image
          source={markerImage}
          style={{ width: 36, height: 36 }}
          resizeMode="contain"
          onLoad={() => setTracksView(false)} // Kill the flicker after load

        />
      </Marker>

    );
  });


  const vehicleIcons = [
    ["FontAwesome6", "sailboat", 20],     // index 0
    ["MaterialCommunityIcons", "car", 24], // index 1
    ["MaterialCommunityIcons", "caravan", 24], // index 2
    ["MaterialCommunityIcons", "bus", 24], // index 3
    ["MaterialCommunityIcons", "walk", 24], // index 4
    ["MaterialCommunityIcons", "run", 24], // index 5
    ["MaterialCommunityIcons", "motorbike", 24], // index 6
    ["MaterialCommunityIcons", "bicycle", 24], // index 7
    ["MaterialCommunityIcons", "home", 24], // index 8
    ["MaterialCommunityIcons", "airplane", 24], // index 9
    ["MaterialCommunityIcons", "train", 24], // index 10
  ];

  const iconLibraries = {
    MaterialCommunityIcons,
    FontAwesome6,
  };

  function VehicleIcon({ selectedVehicleType, color = parrotDarkCream, style }) {
    const [library, iconName, iconSize] =
      selectedVehicleType !== null
        ? vehicleIcons[selectedVehicleType]
        : ["MaterialCommunityIcons", "car-hatchback", 24];

    const IconComponent = iconLibraries[library] || MaterialCommunityIcons;

    return (<View style={selectedVehicleType === 0 && { padding: 0, borderRadius: 20 }}>
      <IconComponent name={iconName} size={iconSize} color={color} style={style} />
    </View>)
  }



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

  const logAllAsyncStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);

      // console.log("📦 AsyncStorage contents:");
      // result.forEach(([key, value]) => {
      //   console.log(`  ${key}: ${value}`);
      // });
    } catch (e) {
      console.error("Failed to load AsyncStorage data", e);
    }
  };

  /*    HARD LOGOUT  */
  useEffect(() => {
    logAllAsyncStorage();
    return;
  }, []);

  const isLoggedIn = useSelector((state) => state.users.isLoggedIn);


  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(updateAsLoggedOut()); // Reset state on mount
  }, [isLoggedIn]);
  /*    HARD LOGOUT  */

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
        // console.log(location, "location");
        const lat = location?.coords?.latitude;
        const lon = location?.coords?.longitude;

        //const lat = 52.2;  // cambridge
        //const lon = 0.13;  // cambridge
        setInitialLatitude(lat);
        setInitialLongitude(lon);
      } catch (error) {
        console.error("Error getting user location :", error);
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

  const onRefresh = async () => {
    setRefreshing(true);
    setHasError(false);
    try {
      const getVoyages = async () => {
        const lat1 = initialLatitude - 0.15;
        const lat2 = initialLatitude + 0.15;
        const lon1 = initialLongitude - 0.2;
        const lon2 = initialLongitude + 0.2;

        setIsLoading(true);

        const voyages = await getVoyagesByLocation({ lon1, lon2, lat1, lat2 });
        // console.log("voyages -->>", voyages);
        setInitialVoyages(voyages.data || []);
        setIsLoading(false);
      };

      await getVoyages();
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

    // console.log("Applying filters with parameters:", formattedStartDate, "---", formattedEndDate);
    const data = {
      latitude: latitude == 0 ? initialLatitude : latitude,
      longitude: longitude == 0 ? initialLongitude : longitude,
      latitudeDelta: latitude == 0 ? 0.25 : latitudeDelta,
      longitudeDelta: longitude == 0 ? 0.25 : longitudeDelta,
      count,
      selectedVehicleType,
      formattedStartDate,
      formattedEndDate,
    };
    const filteredVoyages = await getFilteredVoyages(data);
    setInitialVoyages(filteredVoyages.data || []);

    const filtersJson = JSON.stringify({
      count,
      startDate,
      endDate,
      selectedVehicleType,
    })
    setAppliedFilters(filtersJson);
    // console.log("Applied filters:", filtersJson);
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
    setLatitude(newRegion?.latitude);
    setLongitude(newRegion?.longitude);
    setLatitudeDelta(newRegion?.latitudeDelta);
    setLongitudeDelta(newRegion?.longitudeDelta);
  };

  const handleLogout = async () => {
    console.log("Logging out...");
    dispatch(updateAsLoggedOut());
  };

  const handlePrintDates = () => {
    console.log("printing dates...");
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ top: vh(30) }} />;
  }

  if (!isLoading) {
    const initialRegion = {
      latitude: initialLatitude,
      longitude: initialLongitude,
      latitudeDelta: 0.25,
      longitudeDelta: 0.25,
    };

    return (
      <View>
        <TokenExpiryGuard />
        <ScrollView
          style={styles.scrollview}
          refreshControl={
            hasError ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[parrotPistachioGreen, parrotBananaLeafGreen]}
                tintColor={parrotBananaLeafGreen}
              />
            ) : undefined
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
                source={require("../assets/parrotsreallife.png")}
                style={styles.miniLogo}
              />

              <View style={styles.welcomebox}>
                <Text style={styles.welcome}>Welcome to Parrots</Text>

                {username?.length < 13 ? (
                  <Text style={styles.usernameLarge}>{username}!</Text>
                ) : null}
                {username?.length > 12 && username.length < 18 ? ( // 13 to 16
                  <Text style={styles.usernameMedium}>{username}!</Text>
                ) : null}
                {username?.length > 17 && username.length < 21 ? ( // 17 to 24
                  <Text style={styles.usernameSmall}>{username}!</Text>
                ) : null}
                {username?.length > 20 ? (
                  <Text style={styles.usernameSmall}>
                    {username?.substring(0, 19)}...!
                  </Text>
                ) : null}
              </View>

              <View>
                <View style={styles.filterbox}>
                  <TouchableOpacity onPress={handleCountModal}>
                    <MaterialCommunityIcons
                      style={[
                        styles.icon,
                        count !== 1 ? styles.filtered : null,
                      ]}
                      name={count == 1 ? "human-handsdown" : "human-greeting"}//"human-handsup"}
                      size={24}
                      color={parrotDarkCream}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCalendarModal}>
                    <Ionicons
                      style={[
                        styles.icon,
                        startDate !== null && endDate !== null ? styles.filtered : null,
                      ]}
                      name="calendar-outline"
                      size={24}
                      color={parrotDarkCream}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleVehicleModal}>
                    <VehicleIcon
                      selectedVehicleType={selectedVehicleType}
                      style={[
                        styles.icon,
                        selectedVehicleType !== null ? styles.filtered : null
                      ]}
                    />
                  </TouchableOpacity>
                </View>

                <View>
                  <TouchableOpacity
                    disabled={false}
                    onPress={() => {
                      applyFilter();
                    }}
                  >
                    <View>
                      <Text
                        style={[
                          styles.applyFilter,
                          filterComparisonState == 1 && styles.applyFilterInitial,
                          filterComparisonState == 2 && styles.applyFilterApplied,
                          filterComparisonState == 3 && styles.applyFilterChanged,
                        ]}
                      >Apply Filter</Text>
                    </View>
                  </TouchableOpacity>

                </View>

                <View style={{ display: "none" }}>
                  <TouchableOpacity
                    onPress={() => {
                      handlePrintDates();
                    }}
                  >
                    <View>
                      <Text
                        style={styles.applyFilter}
                      >print dates </Text>
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
                  const waypoint = item.waypoints?.[0];
                  const latitude = waypoint?.latitude;
                  const longitude = waypoint?.longitude;
                  // Skip rendering if coordinates are invalid
                  // Ensure valid coordinates for marker rendering
                  if (latitude == null || longitude == null) {
                    return null;
                  }

                  const imageIndex = index % markerImages.length;
                  const markerImage = markerImages[imageIndex];

                  // console.log(" marker key: ", item.id, "time now: ", new Date());
                  return (
                    <MapMarker
                      key={item.id}
                      item={item}
                      index={index}
                      onPress={updateSelectedVoyageData}
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
                    source={require("../assets/parrotslogo.png")}
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
                    focusMap={() => { }}
                    setSelectedVoyageModalVisible={
                      setSelectedVoyageModalVisible
                    }
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
      </View>
    );
  }
}

const styles = StyleSheet.create({

  mapContainer: {
    height: vh(50),
    marginBottom: 7,
    width: "94%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "white",
  },

  currentBidsTitle3: {
    top: vh(-3),
    fontSize: 17,
    fontWeight: "700",
    color: parrotBlue,
    textAlign: "center",
  },
  currentBidsTitle2: {
    top: vh(-3),
    fontSize: 17,
    fontWeight: "700",
    color: parrotBlue,
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
    backgroundColor: parrotBlue,
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
    borderRadius: vh(10),
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
  },
  applyFilter: {
    fontSize: 14,
    fontWeight: "700",
    alignSelf: "flex-end",
    borderRadius: vh(3),
    paddingHorizontal: vh(2),
    paddingVertical: vh(0.7),
  },
  applyFilterInitial: {
    backgroundColor: applyFilterInitialBackgroundColor,
    color: applyFilterInitialColor,
    borderWidth: 2,
    borderColor: applyFilterInitialBorderColor,
  },
  applyFilterApplied: {
    color: applyFilterAppliedColor,
    backgroundColor: applyFilterAppliedBackgroundColor,
    borderWidth: 2,
    borderColor: applyFilterAppliedBorderColor,
  },
  applyFilterChanged: {
    color: applyFilterChangedColor,
    backgroundColor: applyFilterChangedBackgroundColor,
    borderWidth: 2,
    borderColor: applyFilterChangedBorderColor,
  },
  currentBidsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: parrotBlue
  },
  mainBidsContainer: {
    borderRadius: vw(5),
    marginHorizontal: vw(4),
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
  map: {
    width: "100%",
    height: "100%",
  },
  welcome: {
    fontSize: 18,
    color: parrotBlue,
    fontWeight: "900",
  },
  usernameLarge: {
    fontSize: 26,
    fontWeight: "700",
    color: parrotGreen,
  },
  usernameMedium: {
    fontSize: 18,
    fontWeight: "700",
    color: parrotGreen,

  },
  usernameSmall: {
    fontSize: 16,
    fontWeight: "700",
    color: parrotGreen,

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
  filtered: {
    color: parrotBlue,
    backgroundColor: "rgba(0, 119, 234,0.06)",
    backgroundColor: parrotBlueMediumTransparent,
    borderRadius: vh(5),
  },
});
