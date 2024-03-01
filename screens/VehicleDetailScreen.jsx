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
} from "react-native";
import MapView, { Marker, Callout, Polyline } from "react-native-maps";
import VehicleImagesWithCarousel from "../components/VehicleImagesWithCarousel";
import { useDispatch, useSelector } from "react-redux";
import VehicleVoyages from "../components/VehicleVoyages";

const VehicleDetailScreen = () => {
  const route = useRoute();
  const { vehicleId } = route.params;
  console.log("hello from vehicle detail ", vehicleId);
  // const {
  //   data: VoyageData,
  //   isSuccess: isSuccessVoyages,
  //   isLoading: isLoadingVoyages,
  // } = useGetVoyageByIdQuery(voyageId);

  const {
    data: VehicleData,
    isSuccess: isSuccessVehicles,
    isLoading: isLoadingVehicles,
    isError: isErrorVehicles,
  } = useGetVehicleByIdQuery(vehicleId);

  const dispatch = useDispatch();

  const [sendBid] = useSendBidMutation();
  const [showFullText, setShowFullText] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // const route = useRoute();

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
    console.log("--------------");
    console.log("navigate to user profile with id: ", userId);
    console.log("--------------");

    navigation.navigate("ProfileScreenPublic", {
      userId: userId,
    });
  };

  const navigation = useNavigation();

  if (isLoadingVehicles) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 50 }}>loading...</Text>
      </View>
    );
  }

  if (isErrorVehicles) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 50 }}>error...</Text>
      </View>
    );
  }

  if (isSuccessVehicles) {
    console.log("issuccess??", isSuccessVehicles);
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
              {/* // VoyageName and Username */}
              <View style={styles.VoyageNameAndUsername}>
                <Text style={styles.voyageName}>{VehicleData.name}</Text>
                <View style={styles.voyageDetailsContainer}>
                  <View style={styles.OwnerAndBoat}>
                    <TouchableOpacity
                      style={styles.voyageOwner}
                      onPress={() => {
                        console.log("zzz: ", VehicleData.user.id);
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
                  </View>
                  {/*/////////////////////////////////////////*/}
                  <View style={styles.VoyagePropsBox}>
                    <View style={styles.VoyageProps}>
                      <Text style={styles.propTextDescription}>Capacity: </Text>
                      <Text style={styles.propText}>
                        {VehicleData.capacity}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* // Vehicle Description */}
              <View style={styles.DescriptionContainer}>
                <Text style={styles.descriptionInnerContainer}>
                  {displayText}
                </Text>
                {VehicleData.description.length > descriptionShortenedChars &&
                  !showFullText && (
                    <TouchableOpacity onPress={() => setShowFullText(true)}>
                      <Text style={styles.ReadMoreLess}>
                        Read more...
                        <MaterialIcons
                          name="expand-more"
                          size={24}
                          color="blue"
                        />
                      </Text>
                    </TouchableOpacity>
                  )}
                {showFullText && (
                  <TouchableOpacity onPress={() => setShowFullText(false)}>
                    <Text style={styles.ReadMoreLess}>
                      Read less...
                      <MaterialIcons
                        name="expand-less"
                        size={24}
                        color="blue"
                      />
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* // Vehicle Images */}
              <View style={styles.ImagesMainContainer}>
                <View style={styles.ImagesSubContainer}>
                  <VehicleImagesWithCarousel
                    vehicleImages={VehicleData.vehicleImages}
                  />
                </View>
              </View>

              {/* // Vehicle VOYAGES */}
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

// Santa Voyage on Santa Maria from Feb 02, 23 to Mar 01, 23
//  (item.name)
//  (item.startDate)
//  (item.endDate)
//  (item.vacancy)
//  (item.profileImage)

export default VehicleDetailScreen;

const styles2 = StyleSheet.create({
  inputMainContainer: {
    backgroundColor: "#f4fdfa",
    padding: vh(1),
    marginBottom: vh(1),
    borderRadius: vh(2),
    borderColor: "#d8f7ee",
    borderWidth: 2,
  },
  InputName: {
    fontSize: 18,
    color: "#186ff1",
    fontWeight: "700",
    marginBottom: vh(2),
  },
  messageInput: {
    fontSize: 18,
    color: "#186ff1",

    fontWeight: "700",
    marginBottom: vh(2),
    borderColor: "#186ff1",
    padding: vh(1),
    borderWidth: 1,
    borderRadius: vh(2),
  },
  bidInput: {
    color: "#2ac898",
    fontSize: 22,
    fontWeight: "800",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    left: 0,
    right: 0,
    paddingTop: vh(17),
    paddingBottom: vh(70),
  },
  innerContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  counterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  buttonsContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-around",
  },

  buttonSaveContainer: {
    alignItems: "center",
  },
  buttonClearContainer: {
    alignItems: "center",
  },
  buttonSave: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    backgroundColor: "#186ff1",
    padding: 5,
    width: vw(30),
    borderRadius: 10,
    marginTop: 5,
  },
  buttonClear: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    backgroundColor: "#2ac898",
    padding: 5,
    width: vw(30),
    borderRadius: 10,
    marginTop: 5,
  },
  buttonCount: {
    fontSize: 24,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#3498db",
    borderRadius: 10,
    backgroundColor: "#fff",
    width: vh(6),
    textAlign: "center",
    color: "#2ac898",
    fontWeight: "800",
  },
  count: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

const styles = StyleSheet.create({
  ImagesMainContainer: {
    // marginBottom: vh(13),
  },
  rectangularBox: {
    height: vh(27),
    backgroundColor: "white",
  },
  imageContainer: {
    top: vh(5),
    height: vh(29),
  },
  voyageDetailsContainer: {
    marginTop: vh(2),
    backgroundColor: "rgba(0, 119, 234,0.071)",
    borderWidth: 1,
    borderColor: "rgba(10, 119, 234,0.2)",
    padding: 4,
    borderRadius: vh(2),
  },
  OwnerAndBoat: {
    flexDirection: "row",
    justifyContent: "flex-start",
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
    borderWidth: 1,
    borderColor: "rgba(10, 119, 234,0.3)",
  },
  voyageBoat: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: vh(5),
    marginTop: vh(1),
    marginHorizontal: vw(2),
    backgroundColor: "rgba(0, 119, 234,0.1)",
    borderWidth: 1,
    borderColor: "rgba(10, 119, 234,0.3)",
    paddingVertical: vh(0.3),
    paddingHorizontal: vw(2),
  },
  VoyagePropsBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
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
    borderWidth: 1,
    borderColor: "rgba(10, 119, 234,0.3)",
  },
  propTextDescription: {
    fontSize: 14,
    fontWeight: "600",
    color: "blue",
  },
  propText: {
    fontSize: 14,
    fontWeight: "600",
  },

  ScrollView: {
    backgroundColor: "white",
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
    backgroundColor: "rgba(20,24,220,0.15)",
  },
  DescriptionContainer: {
    paddingHorizontal: vh(1),
    margin: vh(0.5),
    marginTop: vh(0.5),
    backgroundColor: "rgba(20,244,22,0.15)",
  },
  VoyagesContainer: {
    paddingHorizontal: vh(1),
    margin: vh(0.5),
    marginTop: vh(0.5),
    backgroundColor: "rgba(20,244,22,0.15)",
    marginBottom: vh(13),
  },

  descriptionInnerContainer: {
    marginVertical: vh(0.2),
  },
  ReadMoreLess: {
    color: "blue",
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
    fontWeight: "700",
    alignSelf: "center",
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: vh(0.2),
    color: "blue",
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
    // backgroundColor: "#f2fafa",
    borderRadius: vh(5),
    marginHorizontal: vw(2),
    marginBottom: vh(2),
    // borderColor: "#93c9ed",
    // borderWidth: 2,
  },
  closeButtonInModal: {
    alignSelf: "flex-end",
    marginRight: vw(10),
    backgroundColor: "#f2fafa",
    borderRadius: vw(5),
    borderColor: "#93c9ed",
    borderWidth: 2,
    padding: vw(1),
    paddingHorizontal: vw(3),
    marginTop: vh(1),
  },

  closeTextInModal: {
    color: "#3c9dde",
    fontWeight: "700",
    fontSize: 16,
  },
});
