import { ParrotsStdText } from "../components/ParrotsStdText";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { use, useEffect, useRef, useState, memo } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Image,
  Animated,
  RefreshControl,
  Linking,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { MaterialCommunityIcons, FontAwesome6, FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { vw, vh } from "react-native-expo-viewport-units";

import { Shadow } from "react-native-shadow-2";
import FilterCountModal from "../components/FilterCountModal";
import LoadingLogo from "../components/LoadingLogo";
import FilterCalendarModal from "../components/FilterCalendarModal";
import FilterVehicleModal from "../components/FilterVehicleModal";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetVoyagesByLocationMutation,
  useGetFilteredVoyagesMutation,
} from "../slices/VoyageSlice";
import { updateAsLoggedOut } from "../slices/UserSlice";
import * as Location from "expo-location";
import { USE_CAMBRIDGE_DEFAULT_LOCATION, CAMBRIDGE_REGION } from "../constants/defaultLocationFlag";
import VoyageListHorizontal from "../components/VoyageListHorizontal";
import VoyageCardProfileHorizontalModal from "../components/VoyageCardProfileHorizontalModal";
import parrotMarker1 from "../assets/parrotMarkers/parrotMarker1.png";
import parrotMarker2 from "../assets/parrotMarkers/parrotMarker2.png";
import parrotMarker3 from "../assets/parrotMarkers/parrotMarker3.png";
import parrotMarker4 from "../assets/parrotMarkers/parrotMarker4.png";
import parrotMarker5 from "../assets/parrotMarkers/parrotMarker5.png";
import parrotMarker6 from "../assets/parrotMarkers/parrotMarker6.png";
import whiteegg from "../assets/whiteegg.png";
import crackedwhiteegg from "../assets/crackedwhiteegg.png";
import silveregg from "../assets/silveregg.png";
import crackedsilveregg from "../assets/crackedsilveregg.png";
import goldenegg from "../assets/goldenegg.png";
import crackedgoldenegg from "../assets/crackedgoldenegg.png";

const placeEggs = {
  1: { normal: whiteegg, cracked: crackedwhiteegg },
  2: { normal: silveregg, cracked: crackedsilveregg },
  3: { normal: goldenegg, cracked: crackedgoldenegg },
};
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import { ParrotMemoryGame } from "../components/ParrotMemoryGame";
import {
  applyFilterAppliedBackgroundColor, applyFilterAppliedBorderColor, applyFilterAppliedColor,
  applyFilterChangedBackgroundColor, applyFilterChangedBorderColor, applyFilterChangedColor,
  applyFilterInitialBackgroundColor, applyFilterInitialBorderColor, applyFilterInitialColor,
  parrotBananaLeafGreen, parrotBlue, parrotBlueMediumTransparent, parrotBlueSemiTransparent, parrotBlueSemiTransparent2, parrotBlueTransparent, parrotCream, parrotDarkBlue, parrotDarkCream, parrotGreen, parrotInputTextColor, parrotPistachioGreen,
  parrotPlaceholderGrey,
  parrotBoatPurple, parrotCarRed, parrotCaravanOrangeRed, parrotBusYellowGreen, parrotWalkTurquoise,
  parrotRunLightOrange, parrotMotorcycleDarkRed, parrotBicycleTealGreen, parrotTinyHouseLightYellow,
  parrotAirplaneLightGreen, parrotTrainPink,
} from "../assets/color";

const vehicleColors = {
  0: parrotBoatPurple,
  1: parrotCarRed,
  2: parrotCaravanOrangeRed,
  3: parrotBusYellowGreen,
  4: parrotWalkTurquoise,
  5: parrotRunLightOrange,
  6: parrotMotorcycleDarkRed,
  7: parrotBicycleTealGreen,
  8: parrotTinyHouseLightYellow,
  9: parrotAirplaneLightGreen,
  10: parrotTrainPink,
};

// Define static assets outside to keep references stable
const markerImages = [parrotMarker1, parrotMarker2, parrotMarker3, parrotMarker4, parrotMarker5, parrotMarker6];


const PlaceEggMarker = memo(({ item, onPress }) => {
  const [tracksView, setTracksView] = useState(true);
  const [pressed, setPressed] = useState(false);

  return (
    <Marker
      coordinate={{ latitude: item.waypoints[0]?.latitude, longitude: item.waypoints[0]?.longitude }}
      tracksViewChanges={tracksView}
      anchor={{ x: 0.5, y: 1 }}
      onPress={() => {
        setPressed(true);
        setTracksView(true);
        setTimeout(() => setTracksView(false), 400);
        onPress(item);
      }}
    >
      <View style={{ width: 44, height: 52, overflow: "visible" }}>
        <Image
          source={pressed ? (placeEggs[item.placeType]?.cracked || crackedgoldenegg) : (placeEggs[item.placeType]?.normal || goldenegg)}
          style={{ width: 33, height: 37 }}
          resizeMode="contain"
          onLoad={() => setTimeout(() => setTracksView(false), 200)}
        />
      </View>
    </Marker>
  );
});




export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const [countModalVisibility, setCountModalVisibility] = useState(false);
  const [calendarModalVisibility, setCalendarModalVisibility] = useState(false);
  const [vehicleModalVisibility, setVehicleModalVisibility] = useState(false);
  const [isCountFiltered, setIsCountFiltered] = useState(false);
  const [isDatesFiltered, setIsDatesFiltered] = useState(false);
  const [isVehicleFiltered, setIsVehicleFiltered] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isMarkersLoading, setIsMarkersLoading] = useState(true);
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
  const [selectedVoyageModalVisible, setSelectedVoyageModalVisible] = useState(false);
  const [selectedPlaceModalVisible, setSelectedPlaceModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const imageScale = useRef(new Animated.Value(0.1)).current;
  const imageTranslateX = useRef(new Animated.Value(-vw(38))).current;
  const imageTranslateY = useRef(new Animated.Value(-vh(42))).current;
  const refreshSpin = useRef(new Animated.Value(0)).current;
  const startRefreshSpin = () => {
    refreshSpin.setValue(0);
    Animated.loop(
      Animated.timing(refreshSpin, { toValue: 1, duration: 1250, useNativeDriver: true })
    ).start();
  };
  const openImageModal = () => {
    setImageModalVisible(true);
    imageScale.setValue(0.1);
    imageTranslateX.setValue(-vw(38));
    imageTranslateY.setValue(-vh(42));
    Animated.parallel([
      Animated.timing(imageScale, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(imageTranslateX, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(imageTranslateY, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

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
  const MapMarker = memo(({ item, onPress }) => {
    const vehicleType = item.vehicle?.type;
    const pinColor = vehicleColors[vehicleType] ?? parrotGreen;

    return (
      <Marker
        key={`item-${item.id}`}
        pinColor={pinColor}
        coordinate={{
          latitude: item.waypoints[0]?.latitude,
          longitude: item.waypoints[0]?.longitude,
        }}
        tracksViewChanges={false}
        onPress={() => { updateSelectedVoyageData(item); }}
      />
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
  const FALLBACK_LAT = 52.20551962389507;
  const FALLBACK_LNG = 0.11798991656591876;

  useEffect(() => {
    async function getLocation() {
      if (USE_CAMBRIDGE_DEFAULT_LOCATION) {
        setInitialLatitude(CAMBRIDGE_REGION.latitude);
        setInitialLongitude(CAMBRIDGE_REGION.longitude);
        return;
      }
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          showToast("Using default location, enable location access to see nearby results.");
          setInitialLatitude(FALLBACK_LAT);
          setInitialLongitude(FALLBACK_LNG);
          return;
        }
        let location;
        try {
          location = await Location.getCurrentPositionAsync({});
        } catch (error) {
          console.error("Error getting user location :", error);
          showToast("Using default location, enable location access to see nearby results.");
          setInitialLatitude(FALLBACK_LAT);
          setInitialLongitude(FALLBACK_LNG);
          return;
        }
        const lat = location?.coords?.latitude;
        const lon = location?.coords?.longitude;
        setInitialLatitude(lat);
        setInitialLongitude(lon);
      } catch (error) {
        console.error("Error getting user location :", error);
        showToast("Using default location, enable location access to see nearby results.");
        setInitialLatitude(FALLBACK_LAT);
        setInitialLongitude(FALLBACK_LNG);
      }
    }

    const fetchLocation = async () => {
      setIsMapLoading(true);
      await getLocation();
      setIsMapLoading(false);
    };

    fetchLocation();
  }, []);

  const [lastLoadedCoordinates, setLastLoadedCoordinates] = useState(null);
  const mapReadyRef = useRef(false);

  useEffect(() => {
    const getVoyages = async () => {
      const lat1 = initialLatitude - 0.15;
      const lat2 = initialLatitude + 0.15;
      const lon1 = initialLongitude - 0.2;
      const lon2 = initialLongitude + 0.2;

      setIsMarkersLoading(true);

      const voyages = await getVoyagesByLocation({ lon1, lon2, lat1, lat2 });
      setInitialVoyages(voyages.data || []);
      setLastLoadedCoordinates({ latitude: initialLatitude, longitude: initialLongitude });
      setLatitude(initialLatitude);
      setLongitude(initialLongitude);
      setIsMarkersLoading(false);
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

        setIsMarkersLoading(true);

        const voyages = await getVoyagesByLocation({ lon1, lon2, lat1, lat2 });
        setInitialVoyages(voyages.data || []);
        setIsMarkersLoading(false);
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
    setVehicleNameM(item.vehicle?.name);
    setVehicleTypeM(item.vehicle?.type);
    setLatitudeM(item.waypoints[0]?.latitude);
    setLongitudeM(item.waypoints[0]?.longitude);
    setSelectedVoyageModalVisible(true);
  };

  const updateSelectedPlaceData = (item) => {
    setSelectedPlace(item);
    setSelectedPlaceModalVisible(true);
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
    const lat = latitude == 0 ? initialLatitude : latitude;
    const lon = longitude == 0 ? initialLongitude : longitude;
    const latDelta = (latitude == 0 ? 0.25 : latitudeDelta) + 0.15;
    const lonDelta = (longitude == 0 ? 0.25 : longitudeDelta) + 0.2;
    const data = {
      latitude: lat,
      longitude: lon,
      latitudeDelta: latDelta,
      longitudeDelta: lonDelta,
      count,
      selectedVehicleType,
      formattedStartDate,
      formattedEndDate,
    };
    const filteredVoyages = await getFilteredVoyages(data);
    if (filteredVoyages.error) {
      showToast("Could not update voyages - Check your connection.");
      return;
    }
    setInitialVoyages(filteredVoyages.data || []);
    setLastLoadedCoordinates({ latitude: lat, longitude: lon });

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
    if (!mapReadyRef.current) { mapReadyRef.current = true; return; }
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
        <View style={{ height: vh(95) - (Platform.OS === "ios" ? insets.top + insets.bottom : 0) }}>
          <View style={styles.welcomeandFilters}>
            <TouchableOpacity onPress={openImageModal}>
              <Image
                source={require("../assets/parrotsreallife.jpg")}
                style={styles.miniLogo}
              />
            </TouchableOpacity>

            <View style={styles.welcomebox}>
              <ParrotsStdText style={styles.welcome}>Welcome to Parrots</ParrotsStdText>

              {username?.length < 13 ? (
                <ParrotsStdText style={styles.usernameLarge}>{username}!</ParrotsStdText>
              ) : null}
              {username?.length > 12 && username?.length < 18 ? ( // 13 to 16
                <ParrotsStdText style={styles.usernameMedium}>{username}!</ParrotsStdText>
              ) : null}
              {username?.length > 17 && username?.length < 21 ? ( // 17 to 24
                <ParrotsStdText style={styles.usernameSmall}>{username}!</ParrotsStdText>
              ) : null}
              {username?.length > 20 ? (
                <ParrotsStdText style={styles.usernameSmall}>
                  {username?.substring(0, 19)}...!
                </ParrotsStdText>
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
                  disabled={isLoadingVoyagesFiltered}
                  onPress={() => {
                    applyFilter();
                  }}
                >
                  <View
                    style={[
                      styles.applyFilter,
                      filterComparisonState == 1 && styles.applyFilterInitial,
                      filterComparisonState == 2 && styles.applyFilterApplied,
                      filterComparisonState == 3 && styles.applyFilterChanged,
                    ]}
                  >
                    <ParrotsStdText style={[
                      styles.applyFilterText,
                      filterComparisonState == 1 && { color: applyFilterInitialColor },
                      filterComparisonState == 2 && { color: applyFilterAppliedColor },
                      filterComparisonState == 3 && { color: applyFilterChangedColor },
                      isLoadingVoyagesFiltered && { opacity: 0 },
                    ]}>Apply Filter</ParrotsStdText>
                    {isLoadingVoyagesFiltered && (
                      <ActivityIndicator size="large" color="white" style={styles.filterSpinner} />
                    )}
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
                    <ParrotsStdText
                      style={styles.applyFilter}
                    >print dates </ParrotsStdText>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.mapWrapper}>
            <View style={[styles.mapContainer, { height: vh(50) - (Platform.OS === "ios" ? insets.top + insets.bottom - vh(2) : 0) }]}>
              {isMapLoading ? (
                <View style={styles.mapPlaceholder}>
                  <ActivityIndicator size="large" color={parrotDarkCream} style={{ transform: [{ scale: 1.3 }] }} />
                </View>
              ) : (
                <>
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={initialRegion}
                    ref={mapRef}
                    onRegionChangeComplete={handleRegionChangeComplete}
                  >
{!isMarkersLoading && initialVoyages.map((item, index) => {
                      const waypoint = item.waypoints?.[0];
                      const latitude = waypoint?.latitude;
                      const longitude = waypoint?.longitude;
                      if (latitude == null || longitude == null) return null;
                      if (item.placeType > 0) {
                        return <PlaceEggMarker key={`egg-${item.id}`} item={item} onPress={updateSelectedPlaceData} />;
                      }
                      return (
                        <MapMarker
                          key={item.id}
                          item={item}
                          onPress={updateSelectedVoyageData}
                        />
                      );
                    })}
                  </MapView>
                  {isMarkersLoading && (
                    <View style={{ position: "absolute", top: 10, alignSelf: "center" }}>
                      <ActivityIndicator size="small" color={parrotDarkCream} />
                    </View>
                  )}
                  {!isMarkersLoading && lastLoadedCoordinates && (
                    latitude !== lastLoadedCoordinates.latitude ||
                    longitude !== lastLoadedCoordinates.longitude
                  ) && (
                      <TouchableOpacity
                        style={styles.searchAreaButton}
                        onPress={() => { startRefreshSpin(); applyFilter(); }}
                      >
                        <Animated.View
                          style={{
                            backgroundColor: "white",
                            height: 20,
                            width: 20,
                            borderRadius: 16,
                            alignItems: "center",
                            justifyContent: "center",
                            transform: [{ rotate: refreshSpin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) }]
                          }}>
                          <FontAwesome name="refresh" size={20} color={parrotBlue} />
                        </Animated.View>
                      </TouchableOpacity>
                    )}
                </>
              )}
            </View>
          </View>


          {/* {isErrorVoyages ? ( */}
          {hasError && !isLoadingVoyages ? (
            <View>
              <View>
                <Image
                  source={require("../assets/parrotslogo.png")}
                  style={styles.logoImageSmall}
                />
                <ParrotsStdText style={{ ...styles.currentBidsTitle2, top: vh(-1) }}>Something went wrong</ParrotsStdText>
                <TouchableOpacity onPress={onRefresh}
                  style={{ alignSelf: "center", backgroundColor: parrotBlue, paddingHorizontal: 24, paddingVertical: 8, borderRadius: 20 }}>
                  <ParrotsStdText style={{ color: "white", fontFamily: "Nunito_700Bold", fontSize: 14 }}>Retry</ParrotsStdText>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {!hasError && isMarkersLoading ? (
            <View style={{ alignItems: "center", justifyContent: "center", marginTop: vh(4) }}>
              <LoadingLogo size={160} />
            </View>
          ) : !hasError ? (
            <>
              {initialVoyages.filter(v => !v.isPlace).length > 0 && (
                <View style={styles.mainBidsContainer}>
                  <View style={styles.currentBidsAndSeeAll}>
                    <ParrotsStdText style={styles.currentBidsTitle}>Voyages</ParrotsStdText>
                  </View>
                </View>
              )}
              <VoyageListHorizontal navigation={navigation} focusMap={focusMap} data={(() => {
                const voyages = initialVoyages.filter(v => v.placeType === 0).map((v, i) => ({ ...v, markerImage: markerImages[i % markerImages.length] }));
                const places = initialVoyages.filter(v => v.placeType > 0).sort((a, b) => b.placeType - a.placeType);
                const result = [];
                let vi = 0, pi = 0;
                while (vi < voyages.length || pi < places.length) {
                  for (let i = 0; i < 2 && vi < voyages.length; i++) result.push(voyages[vi++]);
                  if (pi < places.length) result.push(places[pi++]);
                }
                return result;
              })()} />
            </>
          ) : null}
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={imageModalVisible}
          onRequestClose={() => setImageModalVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center" }}>
            <ParrotMemoryGame onClose={() => setImageModalVisible(false)} />
          </View>
        </Modal>

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
                  navigation={navigation}
                  setSelectedVoyageModalVisible={
                    setSelectedVoyageModalVisible
                  }
                />

                <TouchableOpacity
                  style={styles.closeButtonAndText2}
                  onPress={() => setSelectedVoyageModalVisible(false)}
                >
                  <View>
                    <ParrotsStdText style={styles.buttonClose}>Close</ParrotsStdText>
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
        <View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={selectedPlaceModalVisible}
            onRequestClose={() => setSelectedPlaceModalVisible(false)}
          >
            <TouchableOpacity
              onPress={() => setSelectedPlaceModalVisible(false)}
              style={{ flex: 1, backgroundColor: "rgba(1,1,1,0.3)" }}
            >
              <View style={styles.imageContainerInModal}>
                {selectedPlace && (
                  <View style={styles.placeCardContainer}>
                    <Image
                      source={{ uri: selectedPlace.profileImageThumbnail || selectedPlace.profileImage }}
                      style={styles.placeCardImage}
                      resizeMode="cover"
                    />
                    <View style={styles.placeCardText}>
                      <ParrotsStdText style={styles.placeCardHeader} numberOfLines={2}>{selectedPlace.name}</ParrotsStdText>
                      {selectedPlace.description ? (
                        <ParrotsStdText style={styles.placeCardDescription} numberOfLines={6} ellipsizeMode="tail">{selectedPlace.description}</ParrotsStdText>
                      ) : null}
                      {selectedPlace.brief ? (
                        <TouchableOpacity onPress={() => {
                          const url = selectedPlace.brief.startsWith("http") ? selectedPlace.brief : `https://${selectedPlace.brief}`;
                          Linking.openURL(url);
                        }}>
                          <ParrotsStdText style={styles.placeCardLink}>Visit Website →</ParrotsStdText>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.closeButtonAndText2}
                  onPress={() => setSelectedPlaceModalVisible(false)}
                >
                  <View>
                    <ParrotsStdText style={styles.buttonClose}>Close</ParrotsStdText>
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </ScrollView>
      {toastVisible && (
        <View style={styles.toast}>
          <ParrotsStdText style={styles.toastText}>{toastMessage}</ParrotsStdText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  mapPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: parrotCream,
    justifyContent: "center",
    alignItems: "center",
  },
  voyagePlaceholderWrapper: {
    marginTop: vh(1),
    width: vw(88),
    alignSelf: "center",
  },
  voyagePlaceholder: {
    height: vh(20),
    width: vw(88),
    backgroundColor: parrotCream,
    borderRadius: vh(2),
    justifyContent: "center",
    alignItems: "center",
  },
  mapWrapper: {
    width: "94%",
    alignSelf: "center",
    borderRadius: 20,
    marginBottom: 7,
  },
  mapContainer: {
    height: vh(50), // overridden inline on iOS
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "white",
  },

  searchAreaButton: {
    position: "absolute",
    bottom: 6,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 20,
    gap: 5,
    borderWidth: 1,
    borderColor: "rgba(10, 119, 234, 0.15)",
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
  logoImageSmall: {
    height: vh(14),
    width: vh(14),
    alignSelf: "center",
  },
  buttonClose: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "white",
    textAlign: "center",
    backgroundColor: parrotBlue,
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  closeButtonAndText2: {
    position: "absolute",
    bottom: vh(-6),
    alignSelf: "center",
  },

  miniLogo: {
    height: vh(6),
    width: vh(6),
    alignSelf: "flex-start",
    marginTop: vh(1.75),
    marginLeft: vw(-1),
    marginRight: vw(2),
    zIndex: 1,
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
  placeCardContainer: {
    marginHorizontal: vw(2),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    flexDirection: "row",
    height: vh(20),
    backgroundColor: parrotCream,
    borderRadius: vh(2),
  },
  placeCardImage: {
    width: vw(38),
    height: vh(20),
    marginRight: vh(0.5),
    borderRadius: vh(2),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  placeCardText: {
    width: vw(50),
    height: vh(18),
    padding: vh(0.5),
    paddingTop: 0,
  },
  placeCardHeader: {
    fontFamily: "Nunito_700Bold",
    marginTop: 2,
    fontSize: 14,
    color: parrotBlue,
    paddingVertical: vh(0.2),
    alignSelf: "flex-start",
  },
  placeCardDescription: {
    fontFamily: "Nunito_700Bold",
    paddingTop: vh(0.6),
    fontSize: 11.5,
    lineHeight: 17,
  },
  placeCardLink: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: parrotBlue,
    paddingTop: vh(0.6),
  },
  applyFilter: {
    alignSelf: "flex-end",
    borderRadius: vh(3),
    paddingHorizontal: vh(2),
    paddingVertical: vh(0.7),
    minWidth: vh(12),
    alignItems: "center",
  },
  applyFilterText: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
  },
  filterSpinner: {
    position: "absolute",
    alignSelf: "center",
    top: 0,
    bottom: 0,
    justifyContent: "center",
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
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
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
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 18,
    color: parrotBlue,
  },
  usernameLarge: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 26,
    color: parrotGreen,
  },
  usernameMedium: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 18,
    color: parrotGreen,
  },
  usernameSmall: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
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
  filtered: {
    color: parrotBlue,
    backgroundColor: "rgba(0, 119, 234,0.06)",
    backgroundColor: parrotBlueMediumTransparent,
    borderRadius: vh(5),
  },
  toast: {
    position: "absolute",
    bottom: vh(10),
    alignSelf: "center",
    backgroundColor: "rgba(30, 111, 217, 0.9)",
    paddingHorizontal: vw(4),
    paddingVertical: vh(1),
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  toastText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
});
