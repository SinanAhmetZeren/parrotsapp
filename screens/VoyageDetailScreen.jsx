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
  TouchableOpacity,
  Share,
  ActivityIndicator,
} from "react-native";
import MapView from "react-native-maps";
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

const VoyageDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { voyageId } = route.params;

  const [addVoyageToFavorites] = useAddVoyageToFavoritesMutation();
  const [deleteVoyageFromFavorites] = useDeleteVoyageFromFavoritesMutation();
  const userId = useSelector((state) => state.users.userId);
  const userProfileImage = useSelector((state) => state.users.userProfileImage);
  const userName = useSelector((state) => state.users.userName);
  const userFavoriteVoyages = useSelector(
    (state) => state.users.userFavoriteVoyages
  );
  const [bids, setBids] = useState([]);
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
    refetch,
  } = useGetVoyageByIdQuery(voyageId);
  const [showFullText, setShowFullText] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [waypointInfoVisible, setWayPointInfoVisible] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await refetch();
        } catch (error) {
          console.error("Error refetching messages data:", error);
        }
      };
      fetchData();
    }, [refetch, navigation])
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

  const getCurrentPageLink = () => {
    if (route) {
      const currentScreenLink = `${API_URL}/${route.name}/${voyageId}`;
      return currentScreenLink;
    }
    return null;
  };

  const handleShare = async () => {
    const currentScreenLink = getCurrentPageLink();

    if (currentScreenLink) {
      try {
        const result = await Share.share({
          message: `Check out this link: ${currentScreenLink}`,
          url: currentScreenLink,
          title: "Share Link",
        });
      } catch (error) {
        console.error("Error sharing:", error.message);
      }
    } else {
      console.warn("Unable to determine the current screen link.");
    }
  };

  // const goToProfilePage = (userId) => {
  //   navigation.navigate("Home", {
  //     screen: "ProfileScreenPublic",
  //     params: { userId: userId },
  //   });
  // };

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
      params: { userId: userId },
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

  const toggleWaypointsInfo = () => {
    setWayPointInfoVisible(!waypointInfoVisible);
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

  const handleAddVoyageToFavorites = () => {
    addVoyageToFavorites({ userId, voyageId });
    setIsFavorited(true);
    dispatch(
      addVoyageToUserFavorites({
        favoriteVoyage: voyageId,
      })
    );
  };

  const handleDeleteVoyageFromFavorites = () => {
    deleteVoyageFromFavorites({ userId, voyageId });
    setIsFavorited(false);
    dispatch(
      removeVoyageFromUserFavorites({
        favoriteVoyage: voyageId,
      })
    );
  };

  // const navigation = useNavigation();

  if (isLoadingVoyages) {
    return <ActivityIndicator size="large" style={{ top: vh(30) }} />;
  }

  if (isSuccessVoyages) {
    const ownVoyage = userId == VoyageData.user.id;
    const waypoints = VoyageData.waypoints || [];
    const UserImageBaseUrl = `${API_URL}/Uploads/UserImages/`;
    const VehicleImageBaseUrl = `${API_URL}/Uploads/VehicleImages/`;
    const descriptionShortenedChars = 500;
    const displayText = showFullText
      ? VoyageData.description
      : VoyageData.description.slice(0, descriptionShortenedChars) + "...";

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

    const baseUrl = `${API_URL}/Uploads/VoyageImages/`;
    const imageUrl = baseUrl + VoyageData.profileImage;

    return (
      <>
        <ScrollView style={styles.ScrollView}>
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
              <View style={styles.VoyageNameAndUsername}>
                <Text style={styles.voyageName}>{VoyageData.name}</Text>
                <View style={styles.voyageDetailsContainer}>
                  <View style={styles.OwnerAndBoat}>
                    <TouchableOpacity
                      style={styles.voyageOwner}
                      onPress={() => goToProfilePage(VoyageData.user.id)}
                    >
                      <Image
                        source={{
                          uri:
                            UserImageBaseUrl + VoyageData.user.profileImageUrl,
                        }}
                        style={styles.profileImage}
                      />
                      <Text style={styles.userName}>
                        {VoyageData.user.userName}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.voyageBoat}
                      onPress={() => {
                        if (
                          VoyageData.vehicleType !== 4 &&
                          VoyageData.vehicleType !== 5
                        ) {
                          goToVehiclePage(VoyageData.vehicle.id);
                        }
                      }}
                    >
                      {VoyageData.vehicleType === 4 ? (
                        <FontAwesome5
                          name="walking"
                          size={16}
                          color="rgba(10, 119, 234,1)"
                          style={[styles.icon, { paddingHorizontal: vh(1) }]}
                        />
                      ) : VoyageData.vehicleType === 5 ? (
                        <FontAwesome5
                          name="running"
                          size={16}
                          color="rgba(10, 119, 234,1)"
                          style={[styles.icon, { paddingHorizontal: vh(1) }]}
                        />
                      ) : (
                        <Image
                          source={{
                            uri:
                              VehicleImageBaseUrl +
                              VoyageData.vehicle.profileImageUrl,
                          }}
                          style={styles.profileImage}
                        />
                      )}

                      <Text style={styles.userName}>
                        {VoyageData.vehicle.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/*/////////////////////////////////////////*/}
                  <View style={styles.VoyagePropsBox}>
                    <View style={styles.VoyageProps}>
                      <Text style={styles.propTextDescription}>Vacancy: </Text>
                      <Text style={styles.propText}>{VoyageData.vacancy}</Text>
                    </View>
                    <View style={styles.VoyageProps}>
                      <Text style={styles.propTextDescription}>
                        Bids close:{" "}
                      </Text>
                      <Text style={styles.propText}>
                        {formattedLastBidDate}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.VoyagePropsBox}>
                    <View style={styles.VoyageProps}>
                      <Text style={styles.propTextDescription}>Dates: </Text>
                      <Text style={styles.propText}>{formattedStartDate}</Text>
                      <Text style={styles.propText}> - </Text>
                      <Text style={styles.propText}>{formattedEndDate}</Text>
                    </View>
                  </View>
                  <View style={styles.VoyagePropsBox}>
                    {VoyageData.minPrice ? (
                      <View style={styles.VoyageProps}>
                        <Text style={styles.propTextDescription}>
                          Min Price:{" "}
                        </Text>
                        <Text style={styles.propText}>
                          €{VoyageData.minPrice}
                        </Text>
                      </View>
                    ) : null}
                    {VoyageData.maxPrice ? (
                      <View style={styles.VoyageProps}>
                        <Text style={styles.propTextDescription}>
                          Max Price:{" "}
                        </Text>
                        <Text style={styles.propText}>
                          €{VoyageData.maxPrice}
                        </Text>
                      </View>
                    ) : null}

                    <View style={styles.VoyageProps}>
                      <Text style={styles.propTextDescription}>Auction: </Text>
                      <Text style={styles.propText}>
                        {VoyageData.auction ? (
                          <Feather name="check" size={20} color="#123456" />
                        ) : (
                          <Entypo name="cross" size={20} color="#123456" />
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.TitleContainerVoyageImages}>
                <View style={styles.currentBidsAndSeeAll}>
                  <Text style={styles.currentBidsTitle}>Voyage Images</Text>
                </View>
              </View>

              {/* // Voyage Images */}
              <View style={styles.ImagesMainContainer}>
                <View style={styles.ImagesSubContainer}>
                  <VoyageImagesWithCarousel voyageImages={allVoyageImages} />
                </View>
              </View>

              <View style={styles.TitleContainerVoyageDescription}>
                <View style={styles.currentBidsAndSeeAll}>
                  <Text style={styles.currentBidsTitle}>
                    Voyage Description
                  </Text>
                </View>
              </View>
              {/* // Voyage Description */}
              <View style={styles.DescriptionContainer}>
                <Text style={styles.descriptionInnerContainer}>
                  {displayText}
                </Text>
                {VoyageData.description.length > descriptionShortenedChars &&
                  !showFullText && (
                    <TouchableOpacity onPress={() => setShowFullText(true)}>
                      <Text style={styles.ReadMoreLess}>
                        Read more
                        <Feather
                          name="chevron-down"
                          size={24}
                          color={"#2ac898"}
                        />
                      </Text>
                    </TouchableOpacity>
                  )}
                {showFullText && (
                  <TouchableOpacity onPress={() => setShowFullText(false)}>
                    <Text style={styles.ReadMoreLess}>
                      Read less
                      <Feather name="chevron-up" size={24} color={"#2ac898"} />
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          {/* // map */}

          <View style={styles.TitleContainerVoyageRoute}>
            <View style={styles.currentBidsAndSeeAll}>
              <Text style={styles.currentBidsTitle}>Voyage Route</Text>
            </View>
          </View>

          <View style={styles.mapAndEmojisContainer}>
            <View style={styles.mapContainer}>
              <MapView ref={mapRef} style={styles.map} region={initialRegion}>
                <WaypointListComponent waypoints={waypoints} />
                <RenderPolylinesComponent waypoints={waypoints} />
              </MapView>
            </View>

            {isFavorited ? (
              <TouchableOpacity
                onPress={() => handleDeleteVoyageFromFavorites()}
                style={styles.heartContainer1}
              >
                <Ionicons
                  name="heart"
                  size={24}
                  color="red"
                  style={styles.heartContainer2}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => handleAddVoyageToFavorites()}
                style={styles.heartContainer1}
              >
                <Ionicons
                  name="heart"
                  size={24}
                  color="orange"
                  style={styles.heartContainer2}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => handleShare()}
              style={styles.shareContainer1}
            >
              <MaterialIcons
                name="ios-share"
                size={24}
                color="black"
                style={styles.shareContainer2}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.waypointsContainer}>
            <View style={styles.WaypointsAndInfo}>
              <Text style={styles.currentBidsTitle}>Waypoints </Text>
              <TouchableOpacity onPress={() => toggleWaypointsInfo()}>
                <MaterialIcons name="info-outline" size={24} color="#3c9dde" />
              </TouchableOpacity>
              {waypointInfoVisible ? (
                <TouchableOpacity onPress={() => toggleWaypointsInfo()}>
                  <Text style={styles.waypointInfoMessage}>
                    Tap on card to focus map
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <View style={styles.waypointFlatlistContainer}>
            <WaypointFlatListVoyageDetailsScreen
              focusMap={focusMap}
              addedWayPoints={waypoints}
            />
          </View>

          {/* // Bids */}

          {bids.length !== 0 ? (
            <View style={styles.mainBidsContainer2}>
              <View style={styles.currentBidsAndSeeAll}>
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
                  refetch={refetch}
                />
              </View>
            </View>
          ) : null}

          {/* // enter bid */}

          <View>
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
              refetch={refetch}
            />
          </View>
        </ScrollView>
      </>
    );
  }
};

export default VoyageDetailScreen;

const styles = StyleSheet.create({
  waypointFlatlistContainer: {
    marginRight: vw(3),
  },
  waypointInfoMessage: {
    color: "#3c9dde",
    paddingHorizontal: vh(2),
    borderWidth: 1,
    borderColor: "#3c9dde",
    marginLeft: vh(2),
    borderRadius: vh(2),
  },
  rectangularBox: {
    height: vh(37),
    backgroundColor: "white",
  },
  imageContainer: {
    top: vh(5),
    height: vh(34),
  },
  voyageDetailsContainer: {
    padding: 4,
    borderRadius: vh(2),
  },
  OwnerAndBoat: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    margin: 1,
  },
  voyageOwner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: vh(5),
    marginTop: vh(1),
    marginHorizontal: vw(2),
    paddingVertical: vh(0.3),
    paddingHorizontal: vw(2),
    backgroundColor: "rgba(0, 119, 234,0.1)",
    borderColor: "rgba(10, 119, 234,0.3)",
  },
  voyageBoat: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: vh(5),
    marginTop: vh(1),
    marginHorizontal: vw(2),
    backgroundColor: "rgba(0, 119, 234,0.1)",
    borderColor: "rgba(10, 119, 234,0.3)",
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
    backgroundColor: "rgba(0, 119, 234,0.1)",
    borderColor: "rgba(10, 119, 234,0.3)",
  },
  propTextDescription: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3c9dde",
  },
  propText: {
    fontSize: 14,
    color: "#666",
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
    marginBottom: vh(2),
    marginTop: vh(1),
  },
  mapContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 20,
    borderColor: "#93c9ed",
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: vw(10),
  },
  heartContainer1: {
    position: "absolute",
    bottom: vh(-1),
    right: vw(15),
  },
  heartContainer2: {
    padding: vw(1),
    width: vw(8),
    backgroundColor: "white",
    borderRadius: vh(5),
  },
  shareContainer1: {
    position: "absolute",
    bottom: vh(-1),
    right: vw(5),
  },
  shareContainer2: {
    padding: vw(1),
    width: vw(8),
    backgroundColor: "white",
    borderRadius: vh(5),
  },
  VoyageNameAndUsername: {
    padding: vh(1),
    margin: vh(0.5),
    marginTop: vh(0.5),
  },
  DescriptionContainer: {
    paddingHorizontal: vh(1),
    margin: vh(0.5),
  },
  descriptionInnerContainer: {
    marginVertical: vh(0.2),
    fontWeight: "500",
    color: "#959595",
    paddingBottom: vh(1),
  },
  ReadMoreLess: {
    color: "#2ac898",
    paddingHorizontal: vw(2),
    paddingBottom: vh(1),
    width: vw(28),
    backgroundColor: "rgba(42, 200, 152, 0.1)",
    borderRadius: vh(2),
    fontWeight: "700",
  },
  subContainer: {
    backgroundColor: "blue",
    padding: vh(1),
    margin: vh(0.5),
    marginTop: vh(0.5),
  },
  innerContainer: {
    marginVertical: vh(0.2),
    backgroundColor: "honeydew",
  },
  voyageName: {
    fontSize: 24,
    alignSelf: "center",
    color: "#2ac898",
    fontWeight: "800",
    // backgroundColor: "rgba(42, 200, 152, 0.1)",
    paddingHorizontal: vh(2),
    paddingVertical: vh(0.5),
    borderRadius: vh(1),
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: vh(0.2),
    color: "#3c9dde",
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
    color: "#4aa5e1",
    width: vw(23),
    textAlign: "right",
  },
  currentBidsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3c9dde",
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
    marginTop: vh(2),
  },
  TitleContainerVoyageRoute: {
    marginTop: vh(2),
    marginHorizontal: vw(4),
  },
  waypointsContainer: {
    borderRadius: vw(5),
    marginHorizontal: vw(4),
  },
  mainBidsContainer2: {
    borderRadius: vw(5),
    marginHorizontal: vw(4),
    marginTop: vh(2),
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
    marginTop: vh(2),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: vw(10),
  },
  WaypointsAndInfo: {
    marginTop: vh(2),
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingRight: vw(10),
  },

  seeAllButton: {
    color: "#3c9dde",
    fontWeight: "700",
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
});
