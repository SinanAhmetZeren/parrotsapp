/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { useGetUserByIdQuery } from "../slices/UserSlice";
import {
  useCreateVehicleMutation,
  useAddVehicleImageMutation,
  useDeleteVehicleImageMutation,
} from "../slices/VehicleSlice";
import { vh, vw } from "react-native-expo-viewport-units";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, AntDesign, Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import DropdownComponentType from "../components/DropdownComponentType";
import StepBarVehicle from "../components/StepBarVehicle";
import { useNavigation } from "@react-navigation/native";

const CreateVehicleScreen = () => {
  const userId = useSelector((state) => state.users.userId);
  const {
    data: userData,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useGetUserByIdQuery(userId);
  const [createVehicle] = useCreateVehicleMutation();
  const [addVehicleImage] = useAddVehicleImageMutation();
  const [deleteVehicleImage] = useDeleteVehicleImageMutation();
  const voyageDes = `Embark on the "Island Breeze", a meticulously planned sailboat expedition offering a seamless blend of adventure and repose. Departing from a quaint harbor, your journey unfolds along the coastline, where the wind becomes your guide, and the sunsets paint the horizon in hues of tranquility.
  Waypoints:
  1. Harbor Haven (Starting Point): Begin your journey from Harbor Haven, a haven for sailors, echoing with tales of the sea and the promise of exploration.
  9. Final Destination - Tranquil Harbor: Conclude your expedition at Tranquil Harbor, a serene retreat where the memories of the voyage linger, offering a final opportunity for quiet reflection.
  `;

  const [name, setName] = useState("Island Breezes Expedition");
  const [description, setDescription] = useState(voyageDes);
  const [capacity, setCapacity] = useState("15");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [image, setImage] = useState(
    "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fparrots-11d9acbc-8e32-4b9c-b537-94d439bcffb0/ImagePicker/aad9496c-c258-4ce9-b64b-78e20f5bf2fe.jpeg"
  );
  const [voyageImage, setVoyageImage] = useState(null);
  const [addedVoyageImages, setAddedVoyageImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const navigation = useNavigation();

  const changeCurrentState = (index) => {
    setCurrentStep(index);
  };

  const goToProfilePage = () => {
    setName("");
    setDescription("");
    setCapacity(0);
    setVehicleType("");
    setVehicleId("");
    setImage("");
    setVoyageImage("");
    setAddedVoyageImages([]);
    setCurrentStep(1);

    navigation.navigate("ProfileScreen");
  };

  const handleCreateVehicle = async () => {
    if (!image) {
      return;
    }

    const formData = new FormData();
    formData.append("imageFile", {
      uri: image,
      type: "image/jpeg",
      name: "profileImage.jpg",
    });

    try {
      const response = await createVehicle({
        formData,
        name,
        description,
        userId,
        vehicleType,
        capacity,
      });
      const createdVehicleId = response.data.data.id;

      setVehicleId(createdVehicleId);
      setDescription("");
      setCapacity("");
      setVehicleType("");
      setImage("");
      setVoyageImage("");
      setAddedVoyageImages("");
      setCurrentStep(2);
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const handleUploadImage = async () => {
    if (!voyageImage) {
      return;
    }

    const formData = new FormData();
    formData.append("imageFile", {
      uri: voyageImage,
      type: "image/jpeg",
      name: "profileImage.jpg",
    });

    try {
      const addedVehicleImageResponse = await addVehicleImage({
        formData,
        vehicleId,
      });

      const addedVoyageImageId = addedVehicleImageResponse.data.imagePath;
      const newItem = {
        addedVoyageImageId,
        voyageImage,
      };
      setAddedVoyageImages((prevImages) => [...prevImages, newItem]);
      setVoyageImage(null);
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickVoyageImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setVoyageImage(result.assets[0].uri);
    }
  };

  const handleDeleteImage = (imageId) => {
    deleteVehicleImage(imageId);
    setAddedVoyageImages((prevImages) =>
      prevImages.filter((item) => item.addedVoyageImageId !== imageId)
    );
  };

  if (isSuccess) {
    const profileImageUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/UserImages/${userData.profileImageUrl}`;

    const VehicleTypes = {
      Boat: "Boat",
      Car: "Car",
      Caravan: "Caravan",
      Bus: "Bus",
      Walk: "Walk",
      Run: "Run",
      Motorcycle: "Motorcycle",
      Bicycle: "Bicycle",
      TinyHouse: "TinyHouse",
      Airplane: "Airplane",
    };

    const dropdownData = Object.keys(VehicleTypes).map((key, index) => ({
      label: key,
      value: key,
    }));

    const maxItems = 10;
    const placeholders = Array.from({ length: maxItems }, (_, index) => ({
      key: `placeholder_${index + 1}`,
    }));

    const data =
      addedVoyageImages.length < maxItems
        ? [
            ...addedVoyageImages,
            ...placeholders.slice(addedVoyageImages.length),
          ]
        : addedVoyageImages.map((item) => ({
            ...item,
            key: item.addedVoyageImageId,
          }));

    return (
      <>
        <StepBarVehicle currentStep={currentStep} />
        {currentStep == 1 ? (
          <ScrollView style={styles.scrollview}>
            <View style={styles.overlay}>
              <View style={styles.profileContainer}>
                <TouchableOpacity onPress={pickProfileImage}>
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={styles.backgroundImage}
                    />
                  ) : (
                    <Image
                      source={require("../assets/placeholder.png")}
                      style={styles.backgroundImage}
                    />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.profileImageAndSocial}>
                <View style={styles.formContainer}>
                  {/* /// name /// */}
                  <View style={styles.latLngNameRow}>
                    <View style={styles.latLngLabel}>
                      <Text style={styles.latorLngtxt}>
                        <Feather
                          style={styles.icon}
                          name="feather"
                          size={24}
                          color="black"
                        />{" "}
                        Name:
                      </Text>
                    </View>
                    <View style={styles.latorLng}>
                      <TextInput
                        style={styles.textInput5}
                        placeholder="Enter voyage name"
                        value={name}
                        onChangeText={(text) => setName(text)}
                      />
                    </View>
                  </View>
                  {/* /// name  /// */}

                  {/* /// type /// */}
                  <View style={styles.latLngNameRow}>
                    <View style={styles.latLngLabel}>
                      <Text style={styles.latorLngtxt}>
                        <Feather
                          style={styles.icon}
                          name="feather"
                          size={24}
                          color="black"
                        />{" "}
                        Type:
                      </Text>
                    </View>
                    <View style={styles.latorLng}>
                      <DropdownComponentType
                        data={dropdownData}
                        setVehicleType={setVehicleType}
                      />
                    </View>
                  </View>
                  {/* /// type /// */}

                  {/* /// DESC /// */}
                  <View style={styles.latLngNameRow}>
                    <View style={styles.latLngLabel}>
                      <Text style={styles.latorLngtxt}>
                        <Feather
                          style={styles.icon}
                          name="feather"
                          size={24}
                          color="black"
                        />{" "}
                        Description:
                      </Text>
                    </View>
                    <View style={styles.latorLng}>
                      <TextInput
                        style={styles.textInput5}
                        multiline
                        placeholder="Enter voyage description"
                        numberOfLines={10}
                        value={description}
                        onChangeText={(text) => setDescription(text)}
                      />
                    </View>
                  </View>
                  {/* /// DESC  /// */}

                  {/* /// VACANCY /// */}
                  <View style={styles.latLngNameRow}>
                    <View style={styles.latLngLabel}>
                      <Text style={styles.latorLngtxt}>
                        <Feather
                          style={styles.icon}
                          name="feather"
                          size={24}
                          color="black"
                        />{" "}
                        Capacity:
                      </Text>
                    </View>
                    <View style={styles.latorLng}>
                      <TextInput
                        style={styles.textInput5}
                        placeholder="Enter vehicle capacity"
                        value={capacity}
                        onChangeText={(text) => setCapacity(text)}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  {/* /// VACANCY /// */}

                  {/* Save Button */}
                  <View style={styles.createVoyageButton}>
                    <Button
                      title="Create Vehicle"
                      onPress={() => handleCreateVehicle()}
                    />
                  </View>

                  <View style={{ display: "none" }}>
                    <Button
                      title="print state1"
                      onPress={() => {
                        printState();
                      }}
                    />
                  </View>

                  <View style={styles.step123}>
                    <Button
                      title="step 1"
                      onPress={() => {
                        changeCurrentState(1);
                      }}
                    />
                    <Button
                      title="step 2"
                      onPress={() => {
                        changeCurrentState(2);
                      }}
                    />
                    <Button
                      title="step 3"
                      onPress={() => {
                        changeCurrentState(3);
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        ) : null}

        {currentStep === 2 ? (
          <ScrollView style={styles.scrollview}>
            <View style={styles.overlay}>
              <View style={styles.selectedChoice}>
                <Text style={styles.selectedText}>Add Vehicle Images</Text>
              </View>

              <View style={styles.profileContainer}>
                <TouchableOpacity onPress={pickVoyageImage}>
                  {voyageImage ? (
                    <Image
                      source={{ uri: voyageImage }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <Image
                      // source={{ uri: profileImageUrl }}
                      source={require("../assets/plus-watercolor.png")}
                      style={styles.profileImage2}
                    />
                  )}
                </TouchableOpacity>
                {/* Your other UI elements */}
              </View>
              <View
                style={
                  addedVoyageImages.length <= 1
                    ? styles.length1
                    : addedVoyageImages.length === 2
                    ? styles.length2
                    : styles.length3
                }
              >
                <FlatList
                  horizontal
                  data={data}
                  // keyExtractor={(item) => item.addedVoyageImageId}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => {
                    return (
                      <View key={index} style={styles2.imageContainer1}>
                        <TouchableOpacity
                          onPress={() => {
                            if (item.addedVoyageImageId) {
                              handleDeleteImage(item.addedVoyageImageId);
                            }
                          }}
                        >
                          <Image
                            source={
                              item.addedVoyageImageId
                                ? { uri: item.voyageImage }
                                : require("../assets/placeholder.png")
                            }
                            style={styles2.voyageImage1}
                          />

                          {item.addedVoyageImageId && (
                            <Text style={styles.deleteAddedImage}>
                              <MaterialIcons
                                name="cancel"
                                size={24}
                                color="darkred"
                              />
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              </View>

              {voyageImage ? (
                <View style={styles.addVoyageImageButton}>
                  <TouchableOpacity onPress={() => handleUploadImage()}>
                    <AntDesign name="clouduploado" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              ) : null}
              <TouchableOpacity
                style={styles.FinishButtonContainer}
                onPress={() => {
                  goToProfilePage();
                }}
              >
                <Text style={styles.addWaypointText}> Complete </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : null}
      </>
    );
  }
};

export default CreateVehicleScreen;

const styles2 = StyleSheet.create({
  imageContainer1: {
    // backgroundColor: "white",
  },
  voyageImage1: {
    height: vh(13),
    width: vh(13),
    marginRight: vh(1),
    borderRadius: vh(1.5),
  },
});

const styles = StyleSheet.create({
  addWaypointText: {
    alignSelf: "center",
    padding: vh(1),
    borderRadius: vh(2),
    backgroundColor: "rgba(0, 119, 234,1)",
    color: "white",
    fontWeight: "600",
    marginBottom: vh(2),
  },
  FinishButtonContainer: {
    marginTop: vh(1),
    borderRadius: vh(2),
    width: vw(95),
    alignSelf: "center",
    marginBottom: vh(5),
  },
  profileImageAndSocial: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: vh(5),
    borderBottomLeftRadius: vh(0),
    borderBottomRightRadius: vh(0),
    width: "100%",
    alignSelf: "center",
    paddingBottom: vh(0.95),
    backgroundColor: "white",
    top: vh(-5),
  },
  calendarStyle: {
    backgroundColor: "white",
    width: vw(86),
    alignSelf: "center",
    marginBottom: vh(1),
    borderRadius: vh(3),
  },
  checkboxText: {
    color: "#6b7f9d",
    fontWeight: "500",
    paddingRight: vw(2),
  },
  auctionFixedPrice: {
    backgroundColor: "#f1f2f3",
    borderRadius: vh(3),
  },
  latLngNameRow: {
    flexDirection: "row",
    backgroundColor: "#f1f2f3",
    borderRadius: vh(3),
    marginBottom: vh(0.5),
  },
  latLngLabel: {
    justifyContent: "center",
    backgroundColor: "#f4f5f6",
    marginVertical: vh(0.3),
    padding: vh(0.4),
    borderRadius: vh(3),
    borderColor: "#babbbc",
  },
  latorLngtxt: {
    color: "#6b7f9d",
    fontWeight: "500",
    width: vw(25),
    textAlign: "center",
  },
  latorLng: {
    flexDirection: "row",
    backgroundColor: "#fafbfc",
    marginVertical: vh(0.3),
    padding: vh(0.4),
    // borderRadius: vh(3),
    borderTopRightRadius: vh(3),
    borderBottomRightRadius: vh(3),
    // borderWidth: 1,
    borderColor: "#babbbc",
    width: vw(64),
  },
  textInput5: {
    fontSize: 13,
    paddingLeft: vw(1),
    width: "90%",
  },
  selectedChoice: {
    marginTop: vh(1),
    alignItems: "center",
  },

  addWaypoints: {
    marginTop: vh(4),
    alignItems: "center",
  },
  selectedText: {
    color: "rgba(91,91,255,1)",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  length1: {
    height: vh(13),
    width: vw(90),
    alignSelf: "center",
    // backgroundColor: "green",
  },
  length2: {
    width: vw(90),
    alignSelf: "center",
    // backgroundColor: "red",
  },
  length3: {
    width: vw(90),
    alignSelf: "center",
    // backgroundColor: "blue",
  },

  deleteAddedImage: {
    top: vh(0),
    right: vw(2),
    backgroundColor: "white",
    borderRadius: vh(3),
    position: "absolute",
  },
  addVoyageImageButton: {
    backgroundColor: "rgb(0, 119, 234)",
    position: "absolute",
    right: vw(22),
    top: vh(22),
    padding: vh(1),
    alignSelf: "center",
    borderRadius: vh(3),
    overflow: "hidden",
    marginTop: vh(1),
    borderWidth: 1,
    borderColor: "white",
  },

  startEndText: {
    color: "white",
  },
  calendarSelected: {
    backgroundColor: "rgba(42,200,152,0.15)",
  },
  calendarEndStart: {
    backgroundColor: "rgba(12,200,152,0.9)",
    color: "white",
  },

  scrollview: {
    height: vh(140),
    top: vh(5),
    marginBottom: vh(15),
    backgroundColor: "white",
  },
  overlay: {
    // backgroundColor: "red",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: vh(1),
    borderRadius: vh(1.5),
  },

  profileImage: {
    marginLeft: vw(3),
    marginVertical: vh(1),
    marginBottom: vh(3),
    width: vh(20),
    height: vh(20),
    borderRadius: vh(3),
    borderColor: "rgba(190, 119, 234,0.6)",
  },
  backgroundImage: {
    width: vw(100),
    height: vh(30),
  },
  profileImage2: {
    marginLeft: vw(3),
    marginVertical: vh(1),
    marginBottom: vh(3),
    width: vh(20),
    height: vh(20),
    borderRadius: vh(3),
    borderColor: "rgba(0, 119, 234,0.1)",
    borderWidth: 5,
  },
  mainCheckboxContainer: {
    paddingHorizontal: vh(1),
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: vh(0.3),
    backgroundColor: "#f1f2f3",
    borderRadius: vh(3),
  },
  checkboxContainer: {
    flexDirection: "row",
    margin: vh(0.2),
    paddingHorizontal: vw(4),
    paddingVertical: vh(0.5),
    borderRadius: vh(2),
  },
  calendarContainer: {
    borderRadius: vh(3),
    backgroundColor: "#f1f2f3",
    marginBottom: vh(1),
  },
  formContainer: {
    padding: vh(2),
  },
  recycle: {
    color: "purple",
  },

  createVoyageButton: {
    width: vw(40),
    alignSelf: "center",
    borderRadius: vh(2),
    overflow: "hidden",
    marginTop: vh(1),
  },
  refetch: {
    padding: 3,
    paddingHorizontal: vw(15),
    borderRadius: vw(9),
    // display: "none",
  },
  step123: {
    display: "none",
  },

  imageContainer: {
    top: vh(0),
    height: vh(35),
    width: vw(100),
  },
  icon: {
    padding: 3,
    margin: 2,
    marginLeft: 8,
    borderRadius: 20,
    color: "rgba(0, 119, 234,0.9)",
    fontSize: 18,
    alignSelf: "center",
  },
  voyageImage: {
    color: "rgba(0, 119, 234,0.9)",
    fontSize: 13,
    backgroundColor: "white",
    padding: vh(1),
    borderRadius: vh(1),
  },
  inputDescription: {
    color: "rgba(0, 119, 234,0.9)",
    fontSize: 13,
    alignSelf: "center",
    width: vw(23),
  },
  voyageDatesContainer: {
    flexDirection: "row",
  },
  voyageDates: {
    color: "#6b7f9d",
    fontWeight: "500",
    fontSize: 13,
    marginVertical: vh(1),
    alignSelf: "flex-start",
  },

  textInput: {
    lineHeight: 21,
    marginVertical: 1,
    fontSize: 14,
    padding: vw(1),
    // backgroundColor: "green",
  },
  textDescriptionInput: {
    width: vw(60),
    flexWrap: "wrap",
    lineHeight: 21,
    marginVertical: 1,
    fontSize: 14,
    padding: vw(1),
    backgroundColor: "green",
  },
  socialBox: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: vh(1.5),
    marginTop: 2,
    // borderWidth: 1,
    borderColor: "rgba(190, 119, 234,0.4)",
  },
});
