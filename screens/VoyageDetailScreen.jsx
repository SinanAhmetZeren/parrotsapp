/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRoute } from "@react-navigation/native";
import { useGetVoyageByIdQuery } from "../slices/VoyageSlice";
import { vw, vh } from "react-native-expo-viewport-units";
import {
  Feather,
  AntDesign,
  FontAwesome5,
  FontAwesome,
  Ionicons,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import Toast from "react-native-toast-message";
import { invokeHub } from "../signalr/signalRHub.js";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import VoyageImagesWithCarousel from "../components/VoyageImagesWithCarousel";
import { RenderBidsComponent } from "../components/RenderBidsComponent";
import { WaypointListComponent } from "../components/WaypointListComponent";
import { CreateBidComponent } from "../components/CreateBidComponent";
import { RenderPolylinesComponent } from "../components/RenderPolylinesComponent";
import { useSelector, useDispatch } from "react-redux";
import { WaypointFlatListVoyageDetailsScreen } from "../components/WaypointFlatlist";
import {
  useAddVoyageToFavoritesMutation,
  useDeleteVoyageFromFavoritesMutation,
} from "../slices/VoyageSlice";
import { useFocusEffect } from "@react-navigation/native";
import {
  addVoyageToUserFavorites,
  removeVoyageFromUserFavorites,
} from "../slices/UserSlice";
import { API_URL } from "@env";
import { parrotBananaLeafGreen, parrotBlue, parrotBlueMediumTransparent, parrotCream, parrotDarkBlue, parrotGreen, parrotGreenMediumTransparent, parrotGreenTransparent, parrotLightBlue, parrotPistachioGreen, parrotTextDarkBlue } from "../assets/color";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import RenderHtml from "react-native-render-html";
import LoadingLogo from "../components/LoadingLogo";

const VoyageDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { voyageId } = route.params;
  const { width } = useWindowDimensions();

  const [addVoyageToFavorites] = useAddVoyageToFavoritesMutation();
  const [deleteVoyageFromFavorites] = useDeleteVoyageFromFavoritesMutation();
  const userId = useSelector((state) => state.users.userId);
  const userProfileImage = useSelector((state) => state.users.userProfileImage);
  const userName = useSelector((state) => state.users.userName);
  const userFavoriteVoyages = useSelector(
    (state) => state.users.userFavoriteVoyages
  );
  const [bids, setBids] = useState([]);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const handleBroadcast = async () => {
    const acceptedUserIds = bids?.filter((b) => b.accepted).map((b) => b.userId);
    console.log("[Broadcast] acceptedUserIds:", acceptedUserIds);
    console.log("[Broadcast] message:", broadcastMessage.trim());
    console.log("[Broadcast] senderId (userId):", userId);
    if (!broadcastMessage.trim() || acceptedUserIds.length === 0) {
      console.log("[Broadcast] Guard hit - empty message or no accepted users");
      return;
    }
    setIsBroadcasting(true);
    try {
      console.log("[Broadcast] Invoking hub BroadcastMessage...");
      await invokeHub("BroadcastMessage", userId, acceptedUserIds, broadcastMessage.trim());
      console.log("[Broadcast] Success");
      setBroadcastMessage("");
      Toast.show({ type: "success", text1: "Message sent", text2: `Sent to ${acceptedUserIds.length} accepted user(s).`, visibilityTime: 2000, topOffset: 100 });
    } catch (error) {
      console.error("[Broadcast] Error:", error);
      Toast.show({ type: "error", text1: "Failed to send", text2: "Please try again.", visibilityTime: 1500, topOffset: 100 });
    } finally {
      setIsBroadcasting(false);
    }
  };
  const [hasBidWithUserId, setHasBidWithUserId] = useState(false);
  const [userBid, setUserBid] = useState("");
  const [userBidId, setUserBidId] = useState("");
  const [userBidPrice, setUserBidPrice] = useState("");
  const [userBidPersons, setUserBidPersons] = useState("");
  const [userBidMessage, setUserBidMessage] = useState("");
  const {
    data: VoyageData,
    isSuccess: isSuccessVoyages,
    isLoading: isLoadingVoyages,
    isError: isErrorVoyage,
    refetch: refetchVoyage,
  } = useGetVoyageByIdQuery(voyageId);

  // useEffect(() => {
  //   console.log("--> voyage data -->");
  //   console.log("hello");
  //   console.log(VoyageData?.publicOnMap);

  // }, [VoyageData])

  const [showFullText, setShowFullText] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const [hasError, setHasError] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };



  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await refetchVoyage();

        } catch (error) {
          console.error("Error refetching messages data:", error);
        }
      };
      fetchData();
    }, [refetchVoyage])
  );



  const handleSeeAll = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    if (isSuccessVoyages && userFavoriteVoyages) {
      if (userFavoriteVoyages.includes(VoyageData.id)) {
        setIsFavorited(true);
      }

      if (VoyageData.bids) {
        setBids(VoyageData.bids);
        let bids = VoyageData.bids;
        setHasBidWithUserId(bids.some((bid) => bid.userId === userId));
        setUserBid(bids.find((bid) => bid.userId === userId));

        if (bids.some((bid) => bid.userId === userId)) {
          let userBid = bids.find((bid) => bid.userId === userId);
          setUserBidPrice(userBid.offerPrice);
          setUserBidPersons(userBid.personCount);
          setUserBidMessage(userBid.message);
          setUserBidId(userBid.id);
        }
      }
    }
  }, [isSuccessVoyages, VoyageData, isFavorited]);

  const getInitialRegion = (waypoints) => {
    const maxLatitude = Math.max(
      ...waypoints.map((waypoint) => waypoint.latitude)
    );
    const minLatitude = Math.min(
      ...waypoints.map((waypoint) => waypoint.latitude)
    );
    const maxLongitude = Math.max(
      ...waypoints.map((waypoint) => waypoint.longitude)
    );
    const minLongitude = Math.min(
      ...waypoints.map((waypoint) => waypoint.longitude)
    );
    const centerLatitude = (maxLatitude + minLatitude) / 2;
    const centerLongitude = (maxLongitude + minLongitude) / 2;
    const latitudeDelta = (maxLatitude - minLatitude) * 1.4;
    const longitudeDelta = (maxLongitude - minLongitude) * 1.3;
    const initialRegion = {
      latitude: centerLatitude + (maxLatitude - minLatitude) * 0.1,
      longitude: centerLongitude,
      latitudeDelta: latitudeDelta == 0 ? 0.15 : latitudeDelta,
      longitudeDelta: longitudeDelta == 0 ? 0.15 : longitudeDelta,
    };

    return initialRegion;
  };



  const handleShareVoyage = async () => {
    try {
      const result = await Share.share({
        message: `Check out this link:\nhttps://parrotsvoyages.com/voyage-details/${voyageId}`,
        title: "Share Link",
      });
    } catch (error) {
      console.error("Error sharing:", error.message);
    }
  };


  const goToProfilePage = (userId) => {
    const parentScreen = navigation.getState().routes[0].name;

    let targetScreen;
    switch (parentScreen) {
      case "HomeScreen":
        targetScreen = "Home";
        break;
      case "ProfileScreen":
        targetScreen = "ProfileStack";
        break;
      case "FavoritesScreen":
        targetScreen = "Favorites";
        break;
      default:
        targetScreen = "Home";
    }

    navigation.navigate(targetScreen, {
      screen: "ProfileScreenPublic",
      params: { publicId: VoyageData?.user.publicId, username: VoyageData?.user.userName, userId: VoyageData?.user.id },
    });
  };
  const goToVehiclePage = (vehicleId) => {
    const parentScreen = navigation.getState().routes[0].name;

    let targetScreen;
    switch (parentScreen) {
      case "HomeScreen":
        targetScreen = "Home";
        break;
      case "ProfileScreen":
        targetScreen = "ProfileStack";
        break;
      case "FavoritesScreen":
        targetScreen = "Favorites";
        break;
      default:
        targetScreen = "Home";
    }

    navigation.navigate(targetScreen, {
      screen: "VehicleDetail",
      params: { vehicleId: vehicleId },
    });
  };


  const mapRef = useRef(null);
  const scrollRef = useRef(null);

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

  const handleAddVoyageToFavorites = () => {
    addVoyageToFavorites({ userId, voyageId });
    setIsFavorited(true);
    dispatch(addVoyageToUserFavorites({ favoriteVoyage: voyageId }));
    showToast("Voyage added to favorites");
  };

  const handleDeleteVoyageFromFavorites = () => {
    deleteVoyageFromFavorites({ userId, voyageId });
    setIsFavorited(false);
    dispatch(removeVoyageFromUserFavorites({ favoriteVoyage: voyageId }));
    showToast("Voyage removed from favorites");
  };

  const onRefresh = () => {
    setRefreshing(true);
    setHasError(false);
    try {
      const refreshData = async () => {
        setIsLoading(true);
        await refetchVoyage();
        setIsLoading(false);
      };
      refreshData();
    } catch (error) {
      console.log(error);
      setHasError(true);
    }
    setRefreshing(false);
  };

  // const navigation = useNavigation();

  if (isErrorVoyage) {
    return (

      <ScrollView
        style={styles.mainBidsContainer2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[parrotPistachioGreen, parrotBananaLeafGreen]}
            tintColor={parrotBananaLeafGreen}
          />
        }
      >
        <View style={styles.currentBidsAndSeeAll2}>
          <Image
            source={require("../assets/parrotslogo.png")}
            style={styles.logoImage}
          />
          <Text style={styles.currentBidsTitle2}>Something went wrong</Text>
          <Text style={styles.currentBidsTitle2}>Swipe down to retry</Text>
        </View>
      </ScrollView>


    );
  }


  if (isLoadingVoyages) {
    return <LoadingLogo size={200} style={{ position: "absolute", top: vh(30), left: vw(50) - 100 }} />;
  }

  if (isSuccessVoyages) {
    const ownVoyage = userId == VoyageData?.user?.id;
    const waypoints = VoyageData.waypoints || [];
    const descriptionShortenedChars = 450;
    const plainDescription = VoyageData?.description?.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
    const displayText = showFullText || plainDescription.length < descriptionShortenedChars
      ? plainDescription
      : plainDescription.slice(0, descriptionShortenedChars) + "...";

    let allVoyageImages = [
      {
        id: "0",
        voyageId: VoyageData.id,
        voyageImagePath: VoyageData.profileImage,
      },
    ].concat(VoyageData.voyageImages);
    const initialRegion = getInitialRegion(waypoints);
    const formattedStartDate = require("date-fns").format(
      VoyageData.startDate,
      "MMM d, yy"
    );
    const formattedEndDate = require("date-fns").format(
      VoyageData.endDate,
      "MMM d, yy"
    );
    const formattedLastBidDate = require("date-fns").format(
      VoyageData.lastBidDate,
      "MMM d, yy"
    );

    const imageUrl = VoyageData.profileImage;

    return (
      <>
        <TokenExpiryGuard />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView style={styles.ScrollView} ref={scrollRef}>
          <View style={styles.rectangularBox}>
            <Image
              style={styles.imageContainer}
              resizeMode="cover"
              source={{ uri: imageUrl }}
            />
          </View>

          <View style={styles.voyageDataWrapper}>
            <View style={styles.VoyageDataContainer}>
              {/* // VoyageName and Username */}

              <View style={styles.detailsCard}>

                {/* Voyage Name */}
                <Text style={styles.voyageName}>{VoyageData.name}</Text>
                <View style={styles.nameDivider} />

                {/* Host + Vehicle */}
                <View style={styles.row}>
                  <Ionicons name="person-outline" size={18} color={parrotBlue} style={styles.rowIcon} />
                  <TouchableOpacity style={styles.pill} onPress={() => goToProfilePage(VoyageData?.user?.id)}>
                    <Image source={{ uri: VoyageData?.user?.profileImageThumbnailUrl || VoyageData.user.profileImageUrl }} style={styles.profileImage} />
                    <Text style={styles.value}>{VoyageData?.user?.userName}</Text>
                  </TouchableOpacity>
                  <Ionicons name="rocket-outline" size={18} color={parrotBlue} style={[styles.rowIcon, { marginLeft: 6 }]} />
                  <TouchableOpacity
                    style={styles.pill}
                    onPress={() => {
                      if (VoyageData.vehicleType !== 4 && VoyageData.vehicleType !== 5 && VoyageData.vehicleType !== 10) {
                        goToVehiclePage(VoyageData.vehicle?.id);
                      }
                    }}
                  >
                    {VoyageData.vehicleType === 4 ? (
                      <Image source={require("../assets/walk1.jpeg")} style={styles.profileImage} />
                    ) : VoyageData.vehicleType === 5 ? (
                      <Image source={require("../assets/run1.jpeg")} style={styles.profileImage} />
                    ) : VoyageData.vehicleType === 10 ? (
                      <Image source={require("../assets/train.jpeg")} style={styles.profileImage} />
                    ) : (
                      <Image source={{ uri: VoyageData.vehicle?.profileImageUrl }} style={styles.profileImage} />
                    )}
                    <Text style={styles.userName}>{VoyageData.vehicle?.name}</Text>
                  </TouchableOpacity>
                </View>

                {/* Vacancy + Date */}
                <View style={styles.row}>
                  <Ionicons name="people-outline" size={18} color={parrotBlue} style={styles.rowIcon} />
                  <View style={styles.pill}>
                    <Text style={styles.value}>{VoyageData.vacancy} spots</Text>
                  </View>
                  <Ionicons name="calendar-outline" size={18} color={parrotBlue} style={[styles.rowIcon, { marginLeft: 12 }]} />
                  <View style={styles.pill}>
                    <Text style={styles.value}>{formattedStartDate}  →  {formattedEndDate}</Text>
                  </View>
                </View>

                {/* Price + Auction + Fixed Price */}
                <View style={styles.row}>
                  <Ionicons name="cash-outline" size={18} color={parrotBlue} style={styles.rowIcon} />
                  <View style={styles.pill}>
                    <Text style={styles.value}>
                      {VoyageData.minPrice === VoyageData.maxPrice
                        ? `${VoyageData.currency}${VoyageData.minPrice}`
                        : `${VoyageData.currency}${VoyageData.minPrice}  –  ${VoyageData.currency}${VoyageData.maxPrice}`}
                    </Text>
                  </View>
                  <MaterialIcons name="gavel" size={18} color={parrotBlue} style={[styles.rowIcon, { marginLeft: 12 }, !VoyageData.auction && { opacity: 0.35 }]} />
                  <TouchableOpacity
                    style={[styles.pill, !VoyageData.auction && { opacity: 0.35 }, { marginRight: 12, alignSelf: "center" }]}
                    onPress={() => showToast(VoyageData.auction ? "This is an auction where the host will select the most suitable bids" : "This is not an auction where the host will select the most suitable bids")}
                  >
                    <Text style={styles.value}>Auction</Text>
                  </TouchableOpacity>
                  <MaterialIcons name="sell" size={18} color={parrotBlue} style={[styles.rowIcon, !VoyageData.fixedPrice && { opacity: 0.35 }]} />
                  <TouchableOpacity
                    style={[styles.pill, !VoyageData.fixedPrice && { opacity: 0.35 }, { alignSelf: "center" }]}
                    onPress={() => showToast(VoyageData.fixedPrice ? "This voyage has a fixed price set by the host" : "This voyage does not have a fixed price set by the host")}
                  >
                    <Text style={styles.value}>Fixed Price</Text>
                  </TouchableOpacity>
                </View>

              </View>


              <View style={[styles.sectionCard, { position: "relative" }]}>
                <TouchableOpacity
                  onPress={() => showToast("Tap an image to view gallery")}
                  style={{ position: "absolute", top: 8, right: 10, zIndex: 10 }}
                >
                  <MaterialIcons name="search" size={20} color={parrotBlue} style={{ padding: 3, backgroundColor: parrotBlueMediumTransparent, borderRadius: vw(5) }} />
                </TouchableOpacity>

                {/* // Voyage Images */}
                <View style={styles.ImagesMainContainer}>
                  <View style={styles.ImagesSubContainer}>
                    <VoyageImagesWithCarousel voyageImages={allVoyageImages} />
                  </View>
                </View>

                {/* // Voyage Description */}
                <View style={styles.DescriptionContainer}>
                  <Text style={styles.descriptionText}>{displayText}</Text>

                  {plainDescription.length > descriptionShortenedChars &&
                    !showFullText && (
                      <TouchableOpacity onPress={() => setShowFullText(true)}>
                        <Text style={styles.ReadMoreLess}>
                          Read more
                          <Feather name="chevron-down" size={16} color={parrotBlue} />
                        </Text>
                      </TouchableOpacity>
                    )}
                  {showFullText && (
                    <TouchableOpacity onPress={() => setShowFullText(false)}>
                      <Text style={styles.ReadMoreLess}>
                        Read less
                        <Feather name="chevron-up" size={16} color={parrotBlue} />
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
          {/* // map + waypoints */}

          <View style={[styles.routeCard, { position: "relative" }]}>

            <View style={styles.mapAndEmojisContainer}>
              <View style={styles.mapContainer}>
                <MapView provider={PROVIDER_GOOGLE} ref={mapRef} style={styles.map} region={initialRegion}>
                  <WaypointListComponent waypoints={waypoints} />
                  <RenderPolylinesComponent waypoints={waypoints} />
                </MapView>
              </View>

              {/* 3 icons top-right of map, slightly overlapping */}
              <View style={styles.mapTopIcons}>
                {isFavorited ? (
                  <TouchableOpacity onPress={() => handleDeleteVoyageFromFavorites()}>
                    <Ionicons name="heart" size={24} color="red" style={styles.heartContainer2} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => handleAddVoyageToFavorites()}>
                    <Ionicons name="heart" size={24} color="orange" style={styles.heartContainer2} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => showToast(VoyageData.publicOnMap ? "This voyage is publicly visible on the map" : "This voyage is not visible on the map")}>
                  <Ionicons name="earth" size={24} color={VoyageData.publicOnMap ? "#1E6FD9" : "#a0b8d8"} style={styles.earthContainer2} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleShareVoyage()}>
                  <MaterialIcons name="ios-share" size={24} color={parrotBlue} style={styles.shareContainer2} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Info icon just below map, above waypoints */}
            <TouchableOpacity
              onPress={() => showToast("Tap on card to focus map")}
              style={{ alignSelf: "flex-end", marginRight: 10, marginTop: vh(0.5), zIndex: 10 }}
            >
              <MaterialIcons name="info-outline" size={20} color={parrotBlue} style={{ padding: 3, backgroundColor: parrotBlueMediumTransparent, borderRadius: vw(5) }} />
            </TouchableOpacity>

            <View style={styles.waypointFlatlistContainer}>
              <WaypointFlatListVoyageDetailsScreen
                focusMap={focusMap}
                addedWayPoints={waypoints}
                voyageProfileImage={VoyageData.profileImage}
              />
            </View>
          </View>

          {/* // Bids */}

          {bids.length !== 0 ? (
            <View style={styles.mainBidsContainer2}>
              <View style={styles.currentBidsAndSeeAllBids}>
                <Text style={styles.currentBidsTitle}>Current Bids</Text>
                <TouchableOpacity onPress={handleSeeAll}>
                  <Text style={styles.seeAllButton}>See All</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.allBidsContainer}>
                <RenderBidsComponent
                  bids={bids}
                  modalVisible={modalVisible}
                  setModalVisible={setModalVisible}
                  ownVoyage={ownVoyage}
                  voyageName={VoyageData.name}
                  currentUserId={userId}
                  refetch={refetchVoyage}
                  username={userName}
                  currency={VoyageData.currency}
                />
              </View>
            </View>
          ) : null}

          {ownVoyage && bids.some((b) => b.accepted) && (
            <View style={styles.broadcastCard}>
              <View style={styles.broadcastInputRow}>
                <TextInput
                  style={styles.broadcastInput}
                  placeholder="Message accepted users..."
                  placeholderTextColor="#aaa"
                  value={broadcastMessage}
                  onChangeText={setBroadcastMessage}
                  multiline
                  onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 400)}
                />
                <TouchableOpacity
                  style={[styles.broadcastSendBtn, (!broadcastMessage.trim() || isBroadcasting) && { opacity: 0.5 }]}
                  onPress={handleBroadcast}
                  disabled={!broadcastMessage.trim() || isBroadcasting}
                >
                  {isBroadcasting
                    ? <ActivityIndicator size="small" color="white" />
                    : <Feather name="send" size={18} color="white" />}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* // enter bid */}

          <View style={{ paddingBottom: ownVoyage ? vh(11) : vh(11) }}>
            {ownVoyage ? null : (
              <CreateBidComponent
                userName={userName}
                userProfileImage={userProfileImage}
                voyageId={voyageId}
                userId={userId}
                userBidId={userBidId}
                hasBidWithUserId={hasBidWithUserId}
                userBidPrice={userBidPrice}
                userBidPersons={userBidPersons}
                userBidMessage={userBidMessage}
                refetch={refetchVoyage}
                ownVoyage={ownVoyage}
                currency={VoyageData.currency}
              />
            )}
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
        {toastVisible && (
          <View style={styles.toast}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}
      </>
    );
  }
};

export default VoyageDetailScreen;

const styles = StyleSheet.create({
  broadcastCard: {
    borderRadius: 20,
    marginHorizontal: vw(2),
    backgroundColor: "#fdf9f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    padding: vh(2),
    marginTop: vh(2),
  },
  broadcastInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: vw(2),
  },
  broadcastInput: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: vh(2),
    paddingHorizontal: vw(3),
    paddingVertical: vh(1),
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    maxHeight: vh(12),
  },
  broadcastSendBtn: {
    backgroundColor: parrotBlue,
    borderRadius: vh(3),
    width: vw(11),
    height: vw(11),
    alignItems: "center",
    justifyContent: "center",
  },
  waypointFlatlistContainer: {
    marginRight: vw(3),
    marginBottom: vh(1),
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
    gap: 6,
    marginHorizontal: vw(8),
  },
  toastText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  waypointInfoMessage: {
    color: parrotBlue,
    paddingHorizontal: vh(1),
    borderWidth: 1,
    borderColor: parrotBlue,
    marginLeft: vh(1),
    borderRadius: vh(2),
  },
  voyageImageInfoMessage: {
    color: parrotBlue,
    paddingHorizontal: vh(1),
    borderWidth: 1,
    borderColor: parrotBlue,
    borderRadius: vh(2),
  },
  rectangularBox: {
    height: vh(37),
    backgroundColor: "white",
  },
  imageContainer: {
    // top: vh(5),
    height: vh(39),
  },
  voyageDetailsContainer: {
    borderRadius: vh(2),
  },
  OwnerAndBoat: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    margin: 1,
  },

  voyageBoat: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: vh(5),
    backgroundColor: parrotBlueMediumTransparent,
    paddingVertical: vh(0.3),
    paddingHorizontal: vw(2),
  },
  VoyagePropsBox: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    margin: 1,
  },
  VoyageProps: {
    flexDirection: "row",
    paddingHorizontal: vh(0.9),
    paddingVertical: vh(0.2),
    marginTop: vh(0.2),
    marginHorizontal: vw(1),
    borderRadius: vw(3),
    backgroundColor: parrotBlueMediumTransparent,

  },
  propTextDescription: {
    fontSize: 14,
    fontWeight: "600",
    color: parrotTextDarkBlue,
  },
  propText: {
    fontSize: 14,
    color: parrotTextDarkBlue,
  },
  ScrollView: {
    backgroundColor: "white",
  },
  mapAndEmojisContainer: {
    height: vh(40),
    padding: vh(0.5),
    width: "98%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: vh(0),
    marginTop: vh(0),
  },
  mapContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 20,
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: vw(10),
  },
  mapTopIcons: {
    position: "absolute",
    top: vh(-2),
    right: vw(2),
    flexDirection: "row",
    gap: 6,
    zIndex: 10,
  },
  heartContainer1: {
    position: "absolute",
    bottom: vh(-1),
    right: vw(5),
  },
  heartContainer2: {
    padding: vw(1),
    width: vw(8),
    backgroundColor: "white",
    borderRadius: vh(5),
  },
  earthContainer1: {
    position: "absolute",
    bottom: vh(-1),
    right: vw(25),
  },
  earthContainer2: {
    padding: vw(1),
    width: vw(8),
    backgroundColor: "white",
    borderRadius: vh(5),
  },
  shareContainer1: {
    position: "absolute",
    bottom: vh(-1),
    right: vw(15),
  },
  shareContainer2: {
    padding: vw(1),
    width: vw(8),
    backgroundColor: "white",
    borderRadius: vh(5),
  },
  VoyageNameAndUsername: {
    // padding: vh(1),
    // margin: vh(0.5),
    marginTop: vh(0.5),
  },
  DescriptionContainer: {
    paddingHorizontal: vh(1),
    margin: vh(0.5),
    marginTop: vh(2.5),
  },
  descriptionInnerContainer: {
    marginVertical: vh(0.2),
    paddingBottom: vh(1),
    color: parrotTextDarkBlue,
  },
  descriptionText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: "#3D3D3D",
    lineHeight: 23,
    letterSpacing: 0.2,
    paddingVertical: vh(1),
  },
  ReadMoreLess: {
    fontFamily: "Nunito_700Bold",
    color: parrotBlue,
    paddingTop: vh(0.5),
    paddingBottom: vh(0.5),
    fontSize: 15,
  },
  subContainer: {
    backgroundColor: "blue",
    padding: vh(1),
    margin: vh(0.5),
    marginTop: vh(0.5),
  },
  voyageName: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 24,
    alignSelf: "center",
    color: parrotGreen,
    paddingHorizontal: vh(2),
    paddingVertical: vh(0.5),
    borderRadius: vh(1),
  },
  userName: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    marginTop: vh(0.2),
    color: "#1E6FD9",
    flexShrink: 1,
  },
  voyageImage: {
    height: vh(13),
    width: vh(13),
    marginRight: vh(1),
    borderRadius: vh(1.5),
  },
  ImagesSubContainer: {
    paddingHorizontal: vh(1),
    marginTop: vh(1.5),
  },

  profileImage: {
    width: vh(3),
    height: vh(3),
    borderRadius: vh(2.5),
    marginRight: 8,
    backgroundColor: "grey",
  },

  offerPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: parrotLightBlue,
    width: vw(23),
    textAlign: "right",
  },
  currentBidsTitle: {
    fontSize: 20,
    fontFamily: "Nunito_800ExtraBold",
    color: parrotLightBlue,
  },
  mainBidsContainer: {
    borderRadius: vw(5),
    marginHorizontal: vw(2),
  },
  TitleContainerVoyageImages: {
    marginHorizontal: vw(2),
  },
  TitleContainerVoyageDescription: {
    marginHorizontal: vw(2),
    // marginTop: vh(2),
  },
  TitleContainerVoyageRoute: {
    // marginTop: vh(2),
    marginHorizontal: vw(4),
  },
  waypointsContainer: {
    marginHorizontal: vw(2),
  },
  mainBidsContainer2: {
    borderRadius: 20,
    marginHorizontal: vw(2),
    backgroundColor: "#fdf9f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    paddingTop: vh(1.5),
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  voyageRoute: {
    borderRadius: vw(5),
    marginHorizontal: vw(4),
  },
  allBidsContainer: {
    marginTop: vh(1),
    padding: vh(0),
  },
  currentBidsAndSeeAll: {
    marginTop: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingRight: vw(10),
  },
  currentBidsAndSeeAllBids: {
    marginTop: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: vw(3),
  },
  WaypointsAndInfo: {
    marginTop: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingRight: vw(10),
  },

  seeAllButton: {
    color: parrotLightBlue,
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
  },
  voyageDataWrapper: {
    backgroundColor: "white",
    paddingTop: vh(1),
    borderRadius: vh(5),
  },
  VoyageDataContainer: {
    borderRadius: vh(5),
    marginHorizontal: vw(2),
  },

  detailsCard: {
    borderRadius: 20,
    paddingTop: 4,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fdf9f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 0,
    marginBottom: vh(1),
  },

  waypointsCard: {
    borderRadius: 20,
    backgroundColor: "#fdf9f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: vw(2),
    marginBottom: vh(1),
    paddingTop: vh(1.5),
    paddingBottom: vh(1),
  },

  routeCard: {
    borderRadius: 20,
    backgroundColor: "#fdf9f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: vw(2),
    marginBottom: vh(1),
    paddingTop: vh(1.5),
    paddingBottom: vh(1),
    overflow: "hidden",
  },

  sectionCard: {
    borderRadius: 20,
    backgroundColor: "#fdf9f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 0,
    marginBottom: vh(1),
    paddingTop: vh(1.5),
    paddingBottom: vh(1),
  },



  label: {
    width: vw(22), // 🔑 fixed width for alignment
    fontWeight: "700",
    fontSize: 16,
    color: "#0A1E5E",
  },

  value: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#1E6FD9",
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 119, 234, 0.06)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  rowSplit: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: vh(1),
    // backgroundColor: "yellow"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vh(1),
  },
  rowIcon: {
    marginRight: 2,
    width: 22,
  },
  nameDivider: {
    height: 1,
    backgroundColor: "rgba(30, 111, 217, 0.1)",
    marginBottom: vh(1.2),
    marginTop: vh(0.4),
  },
  flagsDivider: {
    height: 1,
    backgroundColor: "rgba(30, 111, 217, 0.1)",
    marginBottom: vh(1.2),
  },

  rowHalfClean: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
  },

});
