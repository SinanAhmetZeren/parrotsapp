/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRoute } from "@react-navigation/native";

import { useGetVehicleByIdQuery } from "../slices/VehicleSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { vw, vh } from "react-native-expo-viewport-units";
import {
  Feather,
  FontAwesome6,
  AntDesign,
  FontAwesome5,
  FontAwesome,
  Ionicons,
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
import VehicleImagesWithCarousel from "../components/VehicleImagesWithCarousel";
import { useDispatch, useSelector } from "react-redux";
import VehicleVoyages from "../components/VehicleVoyages";
import {
  useAddVehicleToFavoritesMutation,
  useDeleteVehicleFromFavoritesMutation,
} from "../slices/VehicleSlice";
import {
  addVehicleToUserFavorites,
  removeVehicleFromUserFavorites,
} from "../slices/UserSlice";
import { useFocusEffect } from "@react-navigation/native";
import { API_URL } from "@env";

const VehicleDetailScreen = () => {
  const route = useRoute();
  const { vehicleId } = route.params;

  const {
    data: VehicleData,
    isSuccess: isSuccessVehicles,
    isLoading: isLoadingVehicles,
    isError: isErrorVehicles,
    refetch,
  } = useGetVehicleByIdQuery(vehicleId);
  const userFavoriteVehicles = useSelector(
    (state) => state.users.userFavoriteVehicles
  );
  const userId = useSelector((state) => state.users.userId);
  const [showFullText, setShowFullText] = useState(false);

  const [isFavorited, setIsFavorited] = useState(false);
  const [addVehicleToFavorites] = useAddVehicleToFavoritesMutation();
  const [deleteVehicleFromFavorites] = useDeleteVehicleFromFavoritesMutation();
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

      return () => {
        // Cleanup function if needed
      };
    }, [refetch, navigation])
  );

  const shareLink = async () => {
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

  useEffect(() => {
    if (isSuccessVehicles && userFavoriteVehicles) {
      if (userFavoriteVehicles.includes(VehicleData.id)) {
        setIsFavorited(true);
      }
    }
  }, [isSuccessVehicles, userFavoriteVehicles]);

  const navigation = useNavigation();

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

  const handleAddVehicleToFavorites = () => {
    addVehicleToFavorites({ userId, vehicleId });
    setIsFavorited(true);
    dispatch(
      addVehicleToUserFavorites({
        favoriteVehicle: vehicleId,
      })
    );
  };

  const handleDeleteVehicleFromFavorites = () => {
    deleteVehicleFromFavorites({ userId, vehicleId });
    setIsFavorited(false);
    dispatch(
      removeVehicleFromUserFavorites({
        favoriteVehicle: vehicleId,
      })
    );
  };

  if (isLoadingVehicles) {
    return <ActivityIndicator size="large" style={{ top: vh(30) }} />;
  }

  if (isErrorVehicles) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 50 }}>error...</Text>
      </View>
    );
  }

  if (isSuccessVehicles) {
    const UserImageBaseUrl = `${API_URL}/Uploads/UserImages/`;
    const VehicleImageBaseUrl = `${API_URL}/Uploads/VehicleImages/`;

    const descriptionShortenedChars = 500;

    const displayText = showFullText
      ? VehicleData.description
      : VehicleData.description.slice(0, descriptionShortenedChars) +
        (VehicleData.description.length > descriptionShortenedChars
          ? "..."
          : "");

    let icon;
    switch (VehicleData.type) {
      case 0:
        icon = <FontAwesome6 name="sailboat" size={12} color="blue" />;
        break;
      case 1:
        icon = <AntDesign name="car" size={12} color="blue" />;
        break;
      case 2:
        icon = <FontAwesome5 name="caravan" size={12} color="blue" />;
        break;
      case 3:
        icon = <Ionicons name="bus-outline" size={12} color="blue" />;
        break;
      case 4:
        icon = <FontAwesome5 name="walking" size={12} color="blue" />;
        break;
      case 5:
        icon = <FontAwesome5 name="running" size={12} color="blue" />;
        break;
      case 6:
        icon = <FontAwesome name="motorcycle" size={12} color="blue" />;
        break;
      case 7:
        icon = <FontAwesome name="bicycle" size={12} color="blue" />;
        break;
      case 8:
        icon = <FontAwesome6 name="house" size={12} color="blue" />;
        break;
      case 9:
        icon = <Ionicons name="airplane-outline" size={12} color="blue" />;
        break;
      default:
        icon = "help-circle";
        break;
    }

    const imageUrl = VehicleImageBaseUrl + VehicleData.profileImageUrl;

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

          {userId === VehicleData.userId ? (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.editProfileBox}
                onPress={() => {
                  navigation.navigate("EditVehicleScreen", {
                    currentVehicleId: vehicleId,
                  });
                }}
                activeOpacity={0.8}
              >
                <View>
                  <View style={styles.innerProfileContainer}>
                    <MaterialCommunityIcons
                      name="account-edit-outline"
                      size={18}
                      color="rgba(0, 119, 234,0.9)"
                    />
                    <Text
                      style={{
                        lineHeight: 22,
                        marginLeft: vw(2),
                        fontSize: 11,
                      }}
                    >
                      Edit Vehicle
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.voyageDataWrapper}>
            <View style={styles.VoyageDataContainer}>
              <View style={styles.VoyageNameAndUsername}>
                <Text style={styles.vehicleName}>{VehicleData.name}</Text>
              </View>
              {/* // Vehicle Images */}
              <View style={styles.mainBidsContainer}>
                <View style={styles.currentBidsAndSeeAll}>
                  <Text style={styles.currentBidsTitle}>Vehicle Images</Text>
                </View>
              </View>
              <View style={styles.ImagesMainContainer}>
                <View style={styles.ImagesSubContainer}>
                  <VehicleImagesWithCarousel
                    vehicleImages={VehicleData.vehicleImages}
                  />

                  {isFavorited ? (
                    <TouchableOpacity
                      style={styles.extendedAreaContainer}
                      onPress={() => handleDeleteVehicleFromFavorites()}
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
                      style={styles.extendedAreaContainer}
                      onPress={() => handleAddVehicleToFavorites()}
                    >
                      <Ionicons
                        name="heart"
                        size={24}
                        color="orange"
                        style={styles.heartContainer2}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* // Vehicle Description */}
              <View style={styles.mainBidsContainer}>
                <View style={styles.currentBidsAndSeeAll}>
                  <Text style={styles.currentBidsTitle}>
                    Vehicle Description
                  </Text>
                </View>
              </View>

              {/* // VoyageName and Username */}
              <View style={styles.VoyageNameAndUsername}>
                <View style={styles.voyageDetailsContainer}>
                  <View style={styles.OwnerAndBoat}>
                    <TouchableOpacity
                      style={styles.voyageOwner}
                      onPress={() => {
                        goToProfilePage(VehicleData.user.id);
                      }}
                    >
                      <Image
                        source={{
                          uri:
                            UserImageBaseUrl + VehicleData.user.profileImageUrl,
                        }}
                        style={styles.profileImage}
                      />
                      <Text style={styles.userName}>
                        {/* {VehicleData.user.userName} */}

                        {VehicleData.user.userName.length > 20 ? (
                          <View style={{ flexDirection: "row" }}>
                            <Text style={styles.username}>
                              {VehicleData.user.userName.substring(0, 17)}
                            </Text>
                            <Text style={styles.usernameSmall}>{"..."}</Text>
                          </View>
                        ) : (
                          <Text style={styles.username}>
                            {VehicleData.user.userName}
                          </Text>
                        )}

                        {/* //// XXXXXXX //// */}
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.voyageOwner}>
                      <Text style={styles.propTextDescription}>Capacity: </Text>
                      <Text style={styles.propText}>
                        {VehicleData.capacity}{" "}
                        <Feather name="users" size={14} color="black" />
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.DescriptionContainer}>
                <Text style={styles.descriptionInnerContainer}>
                  {displayText}
                </Text>
                {VehicleData.description.length > descriptionShortenedChars &&
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

              {/* // Vehicle VOYAGES */}

              <View style={styles.mainBidsContainer}>
                <View style={styles.currentBidsAndSeeAll}>
                  <Text style={styles.currentBidsTitle}>
                    {VehicleData.voyages.length == 0
                      ? null
                      : "Vehicle's Voyages"}
                  </Text>
                </View>
              </View>

              <View style={styles.VoyagesContainer}>
                <VehicleVoyages voyages={VehicleData.voyages} />
              </View>
            </View>
          </View>
        </ScrollView>
      </>
    );
  }
};

export default VehicleDetailScreen;

const styles = StyleSheet.create({
  buttonsContainer: {
    position: "absolute",
    top: vh(40),
    right: vw(2),
    flexDirection: "column",
  },
  innerProfileContainer: {
    alignSelf: "flex-end",
    flexDirection: "row",
    borderRadius: vh(2),
    paddingHorizontal: vw(2),
  },
  editProfileBox: {
    marginTop: vh(0.5),
    backgroundColor: "white",
    width: vw(30),
    flexDirection: "row",
    borderRadius: vh(2),
    padding: vw(1),
  },
  extendedAreaContainer: {
    alignSelf: "flex-end",
    position: "absolute",
    right: vw(2),
    borderRadius: vh(1),
    paddingLeft: vw(5),
    paddingRight: vw(2),
    paddingVertical: vh(2),
    bottom: vh(-3),
  },
  heartContainer2: {
    padding: vw(1),
    width: vw(8),
    backgroundColor: "#fef6e3",
    borderRadius: vh(5),
    alignSelf: "center",
  },
  VoyageDataContainer: {
    borderRadius: vh(5),
    marginHorizontal: vw(2),
    marginBottom: vh(2),
  },
  voyageDataWrapper: {
    backgroundColor: "white",
    paddingTop: vh(1),
    borderRadius: vh(5),
  },
  vehicleName: {
    fontSize: 24,
    alignSelf: "center",
    color: "#2ac898",
    fontWeight: "800",
    borderRadius: vh(3),
  },
  mainBidsContainer: {
    borderRadius: vw(5),
    marginHorizontal: vw(2),
    borderColor: "#93c9ed",
  },
  currentBidsAndSeeAll: {
    marginTop: vh(2),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: vw(10),
  },
  currentBidsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3c9dde",
  },
  ImagesMainContainer: {
    marginTop: vh(1),
  },
  rectangularBox: {
    height: vh(45),
    backgroundColor: "white",
  },
  imageContainer: {
    top: vh(5),
    height: vh(47),
  },
  voyageDetailsContainer: {
    borderColor: "rgba(10, 119, 234,0.2)",
    borderRadius: vh(2),
  },
  OwnerAndBoat: {
    flexDirection: "row",
    margin: 1,
  },
  voyageOwner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: vh(5),
    marginHorizontal: vw(2),
    paddingVertical: vh(0.3),
    paddingHorizontal: vw(2),
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
    fontWeight: "600",
  },
  ScrollView: {
    backgroundColor: "white",
  },
  VoyageNameAndUsername: {
    marginTop: vh(1),
  },
  DescriptionContainer: {
    paddingHorizontal: vh(1),
    marginHorizontal: vh(0.5),
  },
  VoyagesContainer: {
    paddingHorizontal: vh(1),
    margin: vh(0.5),
    marginTop: vh(0.5),
    marginBottom: vh(13),
  },
  descriptionInnerContainer: {
    paddingVertical: vh(1),
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
  userName: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: vh(0.2),
    color: "#3c9dde",
  },
  ImagesSubContainer: {
    paddingHorizontal: vh(1),
    marginTop: vh(0.5),
  },
  profileImage: {
    width: vh(3),
    height: vh(3),
    borderRadius: vh(2.5),
    marginRight: 8,
    backgroundColor: "grey",
  },
});
