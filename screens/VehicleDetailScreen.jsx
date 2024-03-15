/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { useEffect, useState, useRef } from "react";
import { useRoute } from "@react-navigation/native";
import {
  useGetVoyageByIdQuery,
  useSendBidMutation,
} from "../slices/VoyageSlice";
import { useGetVehicleByIdQuery } from "../slices/VehicleSlice";

import { vw, vh } from "react-native-expo-viewport-units";
import {
  Feather,
  FontAwesome6,
  AntDesign,
  FontAwesome5,
  FontAwesome,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BackHandler } from "react-native";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Share,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Callout, Polyline } from "react-native-maps";
import VehicleImagesWithCarousel from "../components/VehicleImagesWithCarousel";
import { useDispatch, useSelector } from "react-redux";
import VehicleVoyages from "../components/VehicleVoyages";
import { useFonts } from "expo-font";

const VehicleDetailScreen = () => {
  const route = useRoute();
  const { vehicleId } = route.params;
  const {
    data: VehicleData,
    isSuccess: isSuccessVehicles,
    isLoading: isLoadingVehicles,
    isError: isErrorVehicles,
  } = useGetVehicleByIdQuery(vehicleId);
  const [showFullText, setShowFullText] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    RobotoMedium: require("../assets/Roboto-Medium.ttf"),
    Madimi: require("../assets/MadimiOne-Regular.ttf"),
    Nunito: require("../assets/Nunito-Regular.ttf"),
    NunitoBold: require("../assets/Nunito-Bold.ttf"),
    RobotoslabM: require("../assets/RobotoSlab-Medium.ttf"),
    RobotoslabB: require("../assets/RobotoSlab-Bold.ttf"),
  });

  const handleSeeAll = () => {
    setModalVisible(true);
  };

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

  const goToProfilePage = (userId) => {
    navigation.navigate("ProfileScreenPublic", {
      userId: userId,
    });
  };

  const navigation = useNavigation();

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
    const UserImageBaseUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/UserImages/`;
    const VehicleImageBaseUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/VehicleImages/`;

    const descriptionShortenedChars = 500;
    const displayText = showFullText
      ? VehicleData.description
      : VehicleData.description.slice(0, descriptionShortenedChars) + "...";

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
                        {VehicleData.user.userName}
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
    fontFamily: "RobotoslabB",
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
  ImagesMainContainer: {},
  rectangularBox: {
    height: vh(27),
    backgroundColor: "white",
  },
  imageContainer: {
    top: vh(5),
    height: vh(29),
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
