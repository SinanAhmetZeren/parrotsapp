/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRoute } from "@react-navigation/native";

import { useGetVehicleByIdQuery } from "../slices/VehicleSlice";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import RenderHtml from "react-native-render-html";

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
  RefreshControl,
  useWindowDimensions
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
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import { parrotBananaLeafGreen, parrotBlue, parrotBlueMediumTransparent, parrotBlueSemiTransparent, parrotBlueSemiTransparent2, parrotBlueSemiTransparent3, parrotBlueTransparent, parrotCream, parrotDarkBlue, parrotDarkCream, parrotGreen, parrotGreenMediumTransparent, parrotLightBlue, parrotPistachioGreen, parrotTextDarkBlue } from "../assets/color";

const VehicleDetailScreen = () => {
  const route = useRoute();
  const { vehicleId } = route.params;
  const {
    data: VehicleData,
    isSuccess: isSuccessVehicle,
    isLoading: isLoadingVehicle,
    isError: isErrorVehicle,
    refetch: refetchVehicle,
  } = useGetVehicleByIdQuery(vehicleId);
  const userFavoriteVehicles = useSelector(
    (state) => state.users.userFavoriteVehicles
  );
  const userId = useSelector((state) => state.users.userId);
  const [showFullText, setShowFullText] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };
  const [addVehicleToFavorites] = useAddVehicleToFavoritesMutation();
  const [deleteVehicleFromFavorites] = useDeleteVehicleFromFavoritesMutation();
  const [hasError, setHasError] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [vehicleImagesInfoVisible, setVehicleImagesInfoVisible] = useState(false);
  const { width } = useWindowDimensions();

  const dispatch = useDispatch();


  const onRefresh = () => {
    setRefreshing(true);
    setHasError(false);
    try {
      const refreshData = async () => {
        await refetchVehicle();
      };
      refreshData();
    } catch (error) {
      console.log(error);
      setHasError(true);
    }
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await refetchVehicle();
        } catch (error) {
          console.error("Error refetching messages data:", error);
        }
      };

      fetchData();

      return () => {
        // Cleanup function if needed
      };
    }, [refetchVehicle, navigation])
  );

  const toggleVehicleImagesInfo = () => {
    setVehicleImagesInfoVisible(!vehicleImagesInfoVisible);
  }

  const handleShareVehicle = async () => {
    try {
      const result = await Share.share({
        message: `Check out this link:\nhttps://parrotsvoyages.com/vehicle-details/${vehicleId}`,
        title: "Share Link",
      });
    } catch (error) {
      console.error("Error sharing:", error.message);
    }
  };

  useEffect(() => {
    if (isSuccessVehicle && userFavoriteVehicles) {
      if (userFavoriteVehicles.includes(VehicleData.id)) {
        setIsFavorited(true);
      }
    }
  }, [isSuccessVehicle, userFavoriteVehicles]);

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
      params: { publicId: VehicleData?.user.publicId, username: VehicleData?.user.userName, userId: VehicleData?.user.id },
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

  if (isLoadingVehicle) {
    return <ActivityIndicator size="large" style={{ top: vh(30) }} />;
  }

  if (isErrorVehicle) {
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
          <Text style={styles.currentBidsTitle2}>Connection Error</Text>
          <Text style={styles.currentBidsTitle2}>Swipe down to retry</Text>
        </View>
      </ScrollView>


    );
  }

  if (isSuccessVehicle) {

    const descriptionShortenedChars = 200;

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
      case 10:
        icon = <Ionicons name="train-outline" size={12} color="blue" />;
        break;
      default:
        icon = "help-circle";
        break;
    }

    const imageUrl = VehicleData.profileImageUrl;

    return (
      <>
        <TokenExpiryGuard />
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
                  navigation.navigate("Create", {
                    screen: "EditVehicleScreen",
                    params: { currentVehicleId: vehicleId },
                  });
                }}
                activeOpacity={0.8}
              >
                <View style={styles.innerProfileContainer}>
                  <MaterialCommunityIcons name="account-edit-outline" size={18} color={parrotBlue} />
                  <Text style={{ lineHeight: 22, marginLeft: vw(2), fontSize: 11 }}>Edit Vehicle</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.voyageDataWrapper}>
            <View style={styles.VoyageDataContainer}>

              {/* Name + share/favorite */}
              <View style={styles.vehicleHeader}>
                <Text style={styles.vehicleName}>{VehicleData.name}</Text>
                <View style={styles.vehicleHeaderIcons}>
                  <TouchableOpacity onPress={() => handleShareVehicle()}>
                    <Ionicons name="share-outline" size={24} color={parrotBlue} style={styles.shareContainer} />
                  </TouchableOpacity>
                  {isFavorited ? (
                    <TouchableOpacity onPress={() => handleDeleteVehicleFromFavorites()}>
                      <View style={styles.heartIconContainer}>
                        <Ionicons name="heart" size={24} color="red" style={styles.heartIcon} />
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => handleAddVehicleToFavorites()}>
                      <View style={styles.heartIconContainer}>
                        <Ionicons name="heart-outline" size={24} color={parrotBlue} style={styles.heartIcon} />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Images Card */}
              <View style={styles.sectionCard}>
                <View style={styles.TitleContainer}>
                  <View style={styles.currentBidsAndSeeAll}>
                    <Text style={styles.currentBidsTitle}>Images</Text>
                    <TouchableOpacity onPress={() => toggleVehicleImagesInfo()} style={{ marginLeft: vw(1), top: vh(0.8) }}>
                      <MaterialIcons name="info-outline" size={16} color={parrotBlue} />
                    </TouchableOpacity>
                    {vehicleImagesInfoVisible && (
                      <TouchableOpacity onPress={() => toggleVehicleImagesInfo()} style={{ marginLeft: vw(0.5), top: vh(0.3) }}>
                        <Text style={styles.waypointInfoMessage}>Tap an image to open gallery</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <View style={styles.ImagesMainContainer}>
                  <View style={styles.ImagesSubContainer}>
                    <VehicleImagesWithCarousel vehicleImages={VehicleData.vehicleImages} />
                  </View>
                </View>
              </View>

              {/* Description Card */}
              <View style={styles.sectionCard}>
                <View style={styles.TitleContainer}>
                  <View style={styles.currentBidsAndSeeAll}>
                    <Text style={styles.currentBidsTitle}>Description</Text>
                  </View>
                </View>
                <View style={styles.OwnerAndBoat}>
                  <TouchableOpacity
                    style={styles.voyageOwner}
                    onPress={() => goToProfilePage(VehicleData.user.id)}
                  >
                    <Image source={{ uri: VehicleData.user.profileImageThumbnailUrl || VehicleData.user.profileImageUrl }} style={styles.profileImage} />
                    <Text style={styles.userName}>
                      {VehicleData.user.userName.length > 20 ? (
                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.username}>{VehicleData.user.userName.substring(0, 17)}</Text>
                          <Text style={styles.usernameSmall}>{"..."}</Text>
                        </View>
                      ) : (
                        <Text style={styles.username}>{VehicleData.user.userName}</Text>
                      )}
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
                <View style={styles.DescriptionContainer}>
                  <Text style={styles.descriptionInnerContainer}>
                    <RenderHtml
                      source={{ html: displayText }}
                      contentWidth={width}
                      tagsStyles={{
                        strong: { fontWeight: "bold" },
                        b: { fontWeight: "bold" },
                      }}
                    />
                  </Text>
                  {VehicleData.description.length > descriptionShortenedChars && !showFullText && (
                    <TouchableOpacity onPress={() => setShowFullText(true)}>
                      <Text style={styles.ReadMoreLess}>
                        Read more <Feather name="chevron-down" size={16} color={parrotBlue} />
                      </Text>
                    </TouchableOpacity>
                  )}
                  {showFullText && (
                    <TouchableOpacity onPress={() => setShowFullText(false)}>
                      <Text style={styles.ReadMoreLess}>
                        Read less <Feather name="chevron-up" size={16} color={parrotBlue} />
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {VehicleData.voyages.length === 0 && <View style={{ marginBottom: vh(10) }} />}

              {/* Voyages Card — only shown if voyages exist */}
              {VehicleData.voyages.length > 0 && (
                <>
                  <View style={styles.sectionCard}>
                    <View style={styles.TitleContainer}>
                      <View style={styles.currentBidsAndSeeAll}>
                        <Text style={styles.currentBidsTitle}>Voyages</Text>
                      </View>
                    </View>
                    <View style={styles.VoyagesContainer}>
                      <VehicleVoyages voyages={VehicleData.voyages} />
                    </View>
                  </View>
                  <View style={{ marginBottom: vh(10) }} />
                </>
              )}

            </View>
          </View>
        </ScrollView>
        {toastVisible && (
          <View style={styles.toast}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}
      </>
    );
  }
};

export default VehicleDetailScreen;

const styles = StyleSheet.create({
  waypointInfoMessage: {
    color: parrotBlue,
    paddingHorizontal: vh(1),
    borderWidth: 1,
    borderColor: parrotBlue,
    marginLeft: vh(1),
    borderRadius: vh(2),
  },
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
  vehicleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: vh(1),
    marginBottom: vh(1),
    marginHorizontal: vw(3),
  },
  vehicleHeaderIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: vw(3),
  },
  shareContainer: {
    padding: vw(1),
    width: vw(8),
    backgroundColor: parrotBlueMediumTransparent,
    borderRadius: vh(5),
    alignSelf: "center",
  },
  heartIconContainer: {
    padding: vw(1),
    borderRadius: vh(5),
    backgroundColor: parrotBlueMediumTransparent,
  },
  heartIcon: {
    top: vh(.2),
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
    color: parrotBlue,
    fontWeight: "800",
    flex: 1,
    flexShrink: 1,
  },
  sectionCard: {
    borderRadius: 20,
    backgroundColor: "#fdf9f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: vh(1),
    paddingTop: vh(1.5),
    paddingBottom: vh(2),
  },
  TitleContainer: {
    marginHorizontal: vw(2),
  },
  mainBidsContainer: {
    borderRadius: vw(5),
    marginHorizontal: vw(2),
  },
  currentBidsAndSeeAll: {
    marginTop: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingRight: vw(10),
  },
  currentBidsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: parrotLightBlue,
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
    backgroundColor: parrotBlueTransparent,
  },
  propTextDescription: {
    fontSize: 14,
    fontWeight: "600",
    color: parrotLightBlue,
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
    paddingBottom: vh(2),
  },
  VoyagesContainer: {
    paddingHorizontal: vh(1),
    paddingBottom: vh(2),
  },
  descriptionInnerContainer: {
    paddingVertical: vh(1),
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
  ReadMoreLess: {
    color: parrotBlue,
    paddingTop: vh(0.5),
    paddingBottom: vh(0.5),
    fontWeight: "600",
    fontSize: 13,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: vh(0.2),
    color: parrotLightBlue,
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
