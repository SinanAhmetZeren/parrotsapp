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
import VoyageImagesWithCarousel from "../components/VoyageImagesWithCarousel";
import { useLoginUserMutation } from "../slices/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { updateAsLoggedIn, updateAsLoggedOut } from "../slices/UserSlice";
import { format } from "date-fns";

const VoyageDetailScreen = () => {
  const route = useRoute();
  // const { voyageId } = route.params;
  const { voyageId } = route.params || { voyageId: 2 };

  const {
    data: VoyageData,
    isSuccess: isSuccessVoyages,
    isLoading: isLoadingVoyages,
  } = useGetVoyageByIdQuery(voyageId);
  const dispatch = useDispatch();

  const [sendBid] = useSendBidMutation();
  const [showFullText, setShowFullText] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // const route = useRoute();

  const handleSeeAll = () => {
    setModalVisible(true);
  };

  const renderBids = (bids) => {
    const UserImageBaseUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/UserImages/`;
    const visibleBids = bids.slice(0, 6);

    const closeModal = () => {
      setModalVisible(false);
    };

    return (
      <View>
        {visibleBids.map((bid, index) => (
          <TouchableOpacity key={index} style={styles.singleBidContainer}>
            <Image
              source={{
                uri: UserImageBaseUrl + bid.userProfileImage,
              }}
              style={styles.bidImage}
            />
            <View>
              <Text style={styles.bidUsername}>{bid.userName}</Text>
            </View>
            <View>
              <Text style={styles.offerPrice}>
                {bid.currency} {bid.offerPrice.toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={{ paddingTop: vh(5) }}>
            <FlatList
              style={styles.BidsFlatList}
              data={bids}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View key={index} style={styles.singleBidContainer2}>
                  <Image
                    source={{
                      uri: UserImageBaseUrl + item.userProfileImage,
                    }}
                    style={styles.bidImage2}
                  />
                  <View>
                    <Text style={styles.bidUsername2}>{item.userName}</Text>
                  </View>
                  <View>
                    <Text style={styles.offerPrice2}>
                      {item.currency} {item.offerPrice.toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}
            />
            <TouchableOpacity
              onPress={closeModal}
              style={styles.closeButtonInModal}
            >
              <Text style={styles.closeTextInModal}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  };

  const WaypointComponent = ({
    description,
    latitude,
    longitude,
    profileImage,
    title,
    pinColor,
  }) => {
    const coords = { latitude, longitude };

    return (
      <>
        <Marker coordinate={coords} pinColor={pinColor}>
          <Callout>
            <View>
              <Text>{title}</Text>
              <Text>{description}</Text>
              {profileImage && (
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: 100, height: 100 }}
                />
              )}
            </View>
          </Callout>
        </Marker>
      </>
    );
  };

  const WaypointList = ({ waypoints }) => {
    return (
      <>
        {waypoints.map((waypoint, index) => {
          // let pinColor = "#cfc200";
          let pinColor = "orange";
          if (index === 0) {
            pinColor = "#115500";
          } else if (index === waypoints.length - 1) {
            pinColor = "#610101";
          }

          return (
            <WaypointComponent
              key={waypoint.id}
              description={waypoint.description}
              latitude={waypoint.latitude}
              longitude={waypoint.longitude}
              profileImage={waypoint.profileImage}
              title={waypoint.title}
              pinColor={pinColor}
            />
          );
        })}
      </>
    );
  };

  const renderPolylines = (waypoints) => {
    const coordinates = waypoints.map((marker) => {
      return { latitude: marker.latitude, longitude: marker.longitude };
    });

    return (
      <Polyline
        coordinates={coordinates}
        strokeColor="#1468fb" // Change the color as needed
        strokeWidth={3}
        lineCap="butt"
        lineDashPattern={[20, 7]}
        geodesic={true}
        lineJoin="round" // Example line join
      />
    );
  };

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
      latitudeDelta,
      longitudeDelta,
    };
    return initialRegion;
  };

  const CreateBidComponent = () => {
    const [visible, setVisible] = useState(false);
    const [price, setPrice] = useState(0);
    const [message, setMessage] = useState("");
    const [persons, setPersons] = useState(0);
    const textInputRef = useRef(null);

    useEffect(() => {
      if (visible && textInputRef.current) {
        textInputRef.current.focus();
      }
    }, [visible]);

    const handleIncrementPrice = () => {
      setPrice(price + 1);
    };

    const handleDecrementPrice = () => {
      if (price > 0) {
        setPrice(price - 1);
      }
    };

    const handleIncrementPersons = () => {
      setPersons(persons + 1);
    };

    const handleDecrementPersons = () => {
      if (persons > 0) {
        setPersons(persons - 1);
      }
    };

    const handleSendBid = () => {
      //let userId = "1bf7d55e-7be2-49fb-99aa-93d947711e32";
      const userId = useSelector((state) => state.users.userId);
      console.log("userId from voyageDetailScreen: ", userId);
      bidData = {
        personCount: persons,
        message: message,
        offerPrice: price,
        currency: "€",
        voyageId: 2,
        userId,
        userProfileImage: "string",
        userName: "string",
      };

      sendBid(bidData);
      setVisible(false);
    };

    const handleOpenModal = () => {
      setVisible(true);
    };

    const handleCloseModal = () => {
      setVisible(false);
      setPersons(0);
      setPrice(0);
      setMessage("");
    };

    return (
      <View>
        <View style={styles.bidButtonContainer}>
          <TouchableOpacity onPress={handleOpenModal}>
            <Text style={styles.createBidButton}>Create Bid</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={visible}
          transparent
          animationType="fade"
          onRequestClose={handleCloseModal}
        >
          <View style={styles2.modalContainer}>
            <View style={styles2.innerContainer}>
              <Text style={styles2.title}>Enter Your Bid</Text>

              {/* Bid Amount */}
              <View style={styles2.inputMainContainer}>
                <Text style={styles2.InputName}>Offer Price: </Text>

                <View style={styles2.counterContainer}>
                  <TouchableOpacity onPress={handleDecrementPrice}>
                    <Text style={styles2.buttonCount}>-</Text>
                  </TouchableOpacity>

                  <TextInput
                    ref={textInputRef}
                    style={styles2.bidInput}
                    keyboardType="numeric"
                    value={price.toString()}
                    onChangeText={(text) => setPrice(parseInt(text) || 0)}
                  />

                  <TouchableOpacity onPress={handleIncrementPrice}>
                    <Text style={styles2.buttonCount}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Person count */}
              <View style={styles2.inputMainContainer}>
                <Text style={styles2.InputName}>Persons: </Text>

                <View style={styles2.counterContainer}>
                  <TouchableOpacity onPress={handleDecrementPersons}>
                    <Text style={styles2.buttonCount}>-</Text>
                  </TouchableOpacity>

                  <TextInput
                    style={styles2.bidInput}
                    keyboardType="numeric"
                    value={persons.toString()}
                    onChangeText={(text) => setPersons(parseInt(text) || 0)}
                  />

                  <TouchableOpacity onPress={handleIncrementPersons}>
                    <Text style={styles2.buttonCount}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Message */}
              <TextInput
                style={styles2.messageInput}
                placeholder="Enter your message"
                placeholderTextColor="#2ac898"
                multiline
                value={message}
                onChangeText={(text) => setMessage(text)}
              />

              {/* Buttons */}
              <View style={styles2.buttonsContainer}>
                <TouchableOpacity
                  onPress={handleCloseModal}
                  style={styles2.buttonCancelContainer}
                >
                  <Text style={styles2.buttonClear}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSendBid}
                  style={styles2.buttonSendBidContainer}
                >
                  <Text style={styles2.buttonSave}>Send Bid</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const getCurrentPageLink = () => {
    if (route) {
      // Replace 'YourScreen' with the name of the screen you want to share
      const currentScreenLink = `https://measured-wolf-grossly.ngrok-free.app/${route.name}`;
      return currentScreenLink;
    }
    return null;
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

  if (isSuccessVoyages) {
    const bids = VoyageData.bids || [];
    const waypoints = VoyageData.waypoints || [];
    const UserImageBaseUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/UserImages/`;
    const VehicleImageBaseUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/VehicleImages/`;

    const descriptionShortenedChars = 500;
    const displayText = showFullText
      ? VoyageData.description
      : VoyageData.description.slice(0, descriptionShortenedChars) + "...";

    let icon;
    switch (VoyageData.vehicle.type) {
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

    return (
      <>
        <ScrollView style={styles.ScrollView}>
          {/* // map */}
          <View style={styles.mapAndEmojisContainer}>
            <View style={styles.mapContainer}>
              <MapView style={styles.map} initialRegion={initialRegion}>
                <WaypointList waypoints={waypoints} />
                {renderPolylines(waypoints)}
              </MapView>
            </View>
            <View style={styles.heartContainer1}>
              <Ionicons
                name="heart"
                size={24}
                color="red"
                style={styles.heartContainer2}
              />
            </View>
            <View style={styles.shareContainer1}>
              <MaterialIcons
                name="ios-share"
                size={24}
                color="black"
                style={styles.shareContainer2}
              />
            </View>
          </View>

          <View style={styles.VoyageDataContainer}>
            {/* // VoyageName and Username */}
            <View style={styles.VoyageNameAndUsername}>
              <Text style={styles.voyageName}>{VoyageData.name}</Text>
              <View style={styles.voyageDetailsContainer}>
                <View style={styles.OwnerAndBoat}>
                  <TouchableOpacity
                    style={styles.voyageOwner}
                    onPress={() => {
                      console.log("zzz: ", VoyageData.user.id);
                      goToProfilePage(VoyageData.user.id);
                    }}
                  >
                    <Image
                      source={{
                        uri: UserImageBaseUrl + VoyageData.user.profileImageUrl,
                      }}
                      style={styles.profileImage}
                    />
                    <Text style={styles.userName}>
                      {VoyageData.user.userName}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.voyageBoat}>
                    <Image
                      source={{
                        uri:
                          VehicleImageBaseUrl +
                          VoyageData.vehicle.profileImageUrl,
                      }}
                      style={styles.profileImage}
                    />
                    <Text style={styles.userName}>
                      {VoyageData.vehicle.name}
                    </Text>
                  </View>
                </View>
                {/*/////////////////////////////////////////*/}
                <View style={styles.VoyagePropsBox}>
                  <View style={styles.VoyageProps}>
                    <Text style={styles.propTextDescription}>Vacancy: </Text>
                    <Text style={styles.propText}>{VoyageData.vacancy}</Text>
                  </View>
                  <View style={styles.VoyageProps}>
                    <Text style={styles.propTextDescription}>Bids close: </Text>
                    <Text style={styles.propText}>{formattedLastBidDate}</Text>
                  </View>
                </View>
                <View style={styles.VoyagePropsBox}>
                  <View style={styles.VoyageProps}>
                    <Text style={styles.propTextDescription}>Between: </Text>
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
                        <Feather name="thumbs-up" size={20} color="#123456" />
                      ) : (
                        <Feather name="thumbs-down" size={20} color="#123456" />
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* // Voyage Images */}
            <View style={styles.ImagesMainContainer}>
              <View style={styles.ImagesSubContainer}>
                <VoyageImagesWithCarousel voyageImages={allVoyageImages} />
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
                    <MaterialIcons name="expand-less" size={24} color="blue" />
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/* // Bids */}
          <View style={styles.mainBidsContainer}>
            <View style={styles.currentBidsAndSeeAll}>
              <Text style={styles.currentBidsTitle}>Current Bids</Text>
              <TouchableOpacity onPress={handleSeeAll}>
                <Text style={styles.seeAllButton}>See All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.allBidsContainer}>
              {renderBids(VoyageData.bids)}
            </View>
          </View>

          {/* <View>
            <TouchableOpacity onPress={shareLink}>
              <Text>Share</Text>
            </TouchableOpacity>
          </View> */}

          {/* // enter bid */}

          <View style={{ marginBottom: vh(25) }}>
            <CreateBidComponent />
          </View>
        </ScrollView>
      </>
    );
  }
};

export default VoyageDetailScreen;

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

  priceInputContainer: {
    flexDirection: "row",
  },
  bidButtonContainer: {
    backgroundColor: "#186ff1",
    borderRadius: vh(2),
    borderColor: "#3c9ede",
    borderWidth: 3,
    marginBottom: vh(35),
    width: vw(60),
    alignSelf: "center",
    marginTop: vh(1),
    height: vh(5),
    justifyContent: "center",
  },
  createBidButton: {
    fontSize: 22,
    color: "white",
    alignSelf: "center",
    fontWeight: "700",
    letterSpacing: 1,
  },
  bidModalContainer: {
    backgroundColor: "#06d1d3",
    padding: vh(4),
    margin: vh(5),
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
    marginTop: vh(5),
  },
  mapContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 20,
    borderColor: "#93c9ed",
    borderWidth: 3,
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
    padding: vh(1),
    margin: vh(0.5),
    marginTop: vh(0.5),
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
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: vh(0.2),
    color: "blue",
  },

  voyageImage: {
    height: vh(13),
    width: vh(13),
    marginRight: vh(1),
    borderRadius: vh(1.5),
  },
  ImagesSubContainer: {
    paddingHorizontal: vh(1),
    marginTop: vh(0.5),
  },
  bidImage: {
    width: vh(5),
    height: vh(5),
    borderRadius: vh(2.5),
    marginRight: 8,
    backgroundColor: "grey",
  },
  profileImage: {
    width: vh(3),
    height: vh(3),
    borderRadius: vh(2.5),
    marginRight: 8,
    backgroundColor: "grey",
  },
  bidUsername: {
    fontSize: 17,
    fontWeight: "700",
    width: vw(50),
  },
  offerPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#4aa5e1",
    width: vw(23),
    textAlign: "right",
  },
  currentBidsTitle: {
    paddingLeft: vw(2),
    fontSize: 25,
    fontWeight: "700",
    color: "#1c71a9",
  },
  mainBidsContainer: {
    backgroundColor: "#f2fafa",
    borderRadius: vw(5),
    marginHorizontal: vw(2),
    borderColor: "#93c9ed",
    borderWidth: 2,
  },
  allBidsContainer: {
    // backgroundColor: "blue",
    margin: vh(1),
    padding: vh(0),
  },
  singleBidContainer: {
    flexDirection: "row",
    padding: vh(0.5),
    margin: vh(0.3),
    alignItems: "center",
    borderRadius: vh(3),
    backgroundColor: "rgba(0, 119, 234,0.1)",
    borderWidth: 1,
    borderColor: "rgba(10, 119, 234,0.3)",
  },

  // BID FLATLIST STYLES
  BidsFlatList: {
    width: vw(85),
    height: vh(90),
    alignSelf: "center",
    backgroundColor: "#f2fafa",
    borderColor: "#bfdff4",
    borderWidth: 2,
    borderRadius: vh(2),
    padding: vh(1),
  },
  singleBidContainer2: {
    flexDirection: "row",
    padding: vh(0.1),
    margin: vh(0.3),
    alignItems: "center",
  },
  bidImage2: {
    width: vh(5),
    height: vh(5),
    borderRadius: vh(2.5),
    marginRight: 8,
    backgroundColor: "grey",
  },
  bidUsername2: {
    fontSize: 17,
    fontWeight: "700",
    width: vw(45),
  },
  offerPrice2: {
    fontSize: 18,
    fontWeight: "800",
    color: "blue",
    width: vw(25),
    textAlign: "right",
  },
  currentBidsTitle2: {
    paddingLeft: vw(2),
    fontSize: 25,
    fontWeight: "700",
    color: "blue",
  },
  currentBidsContainer2: {
    width: vw(90),
  },
  allBidsContainer2: {
    margin: vh(1),
    padding: vh(0),
    backgroundColor: "red",
  },
  // BID FLATLIST STYLES - END
  currentBidsAndSeeAll: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: vw(10),
    alignItems: "center",
  },
  seeAllButton: {
    color: "#3c9dde",
    fontWeight: "700",
    fontSize: 16,
  },
  VoyageDataContainer: {
    backgroundColor: "#f2fafa",
    borderRadius: vw(5),
    marginHorizontal: vw(2),
    marginBottom: vh(2),
    borderColor: "#93c9ed",
    borderWidth: 2,
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
