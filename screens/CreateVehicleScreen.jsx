/* eslint-disable no-constant-condition */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  useCreateVehicleMutation,
  useAddVehicleImageMutation,
  useDeleteVehicleImageMutation,
  useCheckAndDeleteVehicleMutation,
} from "../slices/VehicleSlice";
import { vh, vw } from "react-native-expo-viewport-units";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, AntDesign, Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import DropdownComponentType from "../components/DropdownComponentType";
import StepBarVehicle from "../components/StepBarVehicle";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";

const CreateVehicleScreen = () => {
  const userId = useSelector((state) => state.users.userId);

  const [createVehicle] = useCreateVehicleMutation();
  const [addVehicleImage] = useAddVehicleImageMutation();
  const [deleteVehicleImage] = useDeleteVehicleImageMutation();
  const [checkAndDeleteVehicle] = useCheckAndDeleteVehicleMutation();
  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const formattedHours = hours < 10 ? `0${hours}` : hours.toString();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
  const formattedseconds = seconds < 10 ? `0${seconds}` : seconds.toString();
  const timeString = `${formattedHours}:${formattedMinutes}:${formattedseconds}`;
  const [vehicleType, setVehicleType] = useState(1);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState(null);
  const [vehicleId, setVehicleId] = useState("");
  const [image, setImage] = useState("");
  const [voyageImage, setVoyageImage] = useState(null);
  const [addedVehicleImages, setAddedVehicleImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isCreatingVehicle, setIsCreatingVehicle] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        navigation.navigate("Home");

        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [navigation])
  );

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        checkAndDeleteVehicle(vehicleId);
        setCurrentStep(1);
        setName("");
      };
    }, [vehicleId])
  );

  const goToProfilePage = () => {
    setName("");
    setDescription("");
    setCapacity(0);
    setVehicleType("");
    setVehicleId("");
    setImage("");
    setVoyageImage("");
    setAddedVehicleImages([]);
    setCurrentStep(1);

    navigation.navigate("Home");
  };

  const handleCreateVehicle = async () => {
    if (!image) {
      return; // Optionally display an alert to the user
    }

    const formData = new FormData();
    formData.append("imageFile", {
      uri: image,
      type: "image/jpeg",
      name: "profileImage.jpg",
    });

    setIsCreatingVehicle(true);
    try {
      const response = await createVehicle({
        formData,
        name,
        description,
        userId,
        vehicleType,
        capacity,
      });
      console.log("-->>", response);
      const createdVehicleId = response.data.data.id;

      setVehicleId(createdVehicleId);
      setDescription("");
      setCapacity("");
      setVehicleType("");
      setImage("");
      setVoyageImage("");
      setAddedVehicleImages([]);
      setCurrentStep(2);
    } catch (error) {
      alert(
        "Failed to create vehicle. Please check your connection and try again."
      );
      console.error("Error creating vehicle:", error);
    } finally {
      setIsCreatingVehicle(false);
    }
  };

  const handleCreateVehicle2 = async () => {
    if (!image) {
      return;
    }

    const formData = new FormData();
    formData.append("imageFile", {
      uri: image,
      type: "image/jpeg",
      name: "profileImage.jpg",
    });

    setIsCreatingVehicle(true);
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
      setAddedVehicleImages("");
      setCurrentStep(2);
    } catch (error) {
      console.error("Error uploading image", error);
    }

    setIsCreatingVehicle(false);
  };

  const handleUploadImage2 = async () => {
    if (!voyageImage) {
      return;
    }

    const formData = new FormData();
    formData.append("imageFile", {
      uri: voyageImage,
      type: "image/jpeg",
      name: "profileImage.jpg",
    });

    setIsUploadingImage(true);
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
      setAddedVehicleImages((prevImages) => [...prevImages, newItem]);
      setVoyageImage(null);
    } catch (error) {
      console.error("Error uploading image", error);
    }
    setIsUploadingImage(false);
  };

  const handleUploadImage = useCallback(async () => {
    if (!voyageImage) {
      return;
    }

    const formData = new FormData();
    formData.append("imageFile", {
      uri: voyageImage,
      type: "image/jpeg",
      name: "profileImage.jpg",
    });

    setIsUploadingImage(true);
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
      setAddedVehicleImages((prevImages) => [...prevImages, newItem]);
      setVoyageImage(null);
    } catch (error) {
      console.error("Error uploading image", error);
      alert(
        "Failed to upload image. Please check your connection and try again."
      );
    }
    setIsUploadingImage(false);
  }, [voyageImage, vehicleId, addVehicleImage]);

  const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
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
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setVoyageImage(result.assets[0].uri);
    }
  };

  const handleDeleteImage2 = (imageId) => {
    deleteVehicleImage(imageId);
    setAddedVehicleImages((prevImages) =>
      prevImages.filter((item) => item.addedVoyageImageId !== imageId)
    );
  };

  const handleDeleteImage = async (imageId) => {
    const previousImages = [...addedVehicleImages];
    setAddedVehicleImages(
      previousImages.filter((item) => item.addedVoyageImageId !== imageId)
    );

    try {
      await deleteVehicleImage(imageId);
    } catch (error) {
      console.error("Error deleting image", error);
      setAddedVehicleImages(previousImages);
      alert(
        "Failed to delete image. Please check your connection and try again."
      );
    }
  };

  const VehicleTypes = [
    "Boat",
    "Car",
    "Caravan",
    "Bus",
    "Walk",
    "Run",
    "Motorcycle",
    "Bicycle",
    "TinyHouse",
    "Airplane",
  ];

  const dropdownData = VehicleTypes.map((type) => ({
    label: type,
    value: type,
  }));

  const maxItems = 10;
  const placeholders = Array.from({ length: maxItems }, (_, index) => ({
    key: `placeholder_${index + 1}`,
  }));

  const data =
    addedVehicleImages.length < maxItems
      ? [
          ...addedVehicleImages,
          ...placeholders.slice(addedVehicleImages.length),
        ]
      : addedVehicleImages.map((item) => ({
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
              {isCreatingVehicle ? (
                <View style={styles.backgroundImage}>
                  <ActivityIndicator size="large" style={{ top: vh(14) }} />
                </View>
              ) : (
                <TouchableOpacity onPress={pickProfileImage}>
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={styles.backgroundImage}
                    />
                  ) : (
                    <Image
                      // source={require("../assets/placeholder.png")}
                      source={require("../assets/ParrotsWhiteBgPlus.png")}
                      style={styles.backgroundImagePlaceholder}
                    />
                  )}
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.profileImageAndSocial}>
              <View style={styles.formContainer}>
                {/* /// name /// */}
                <View style={styles.latLngNameRow}>
                  <View style={styles.latLngLabel}>
                    <Text style={styles.latorLngtxt}>Name:</Text>
                  </View>
                  <View style={styles.latorLng}>
                    <TextInput
                      style={styles.textInput5}
                      placeholder="Enter Vehicle Name"
                      placeholderTextColor="#c3c3c3"
                      value={name}
                      maxLength={50}
                      onChangeText={(text) => setName(text)}
                    />
                  </View>
                </View>
                {/* /// name  /// */}
                {/* /// type /// */}
                <View style={styles.latLngNameRow}>
                  <View style={styles.latLngLabel}>
                    <Text style={styles.latorLngtxt}>Type:</Text>
                  </View>
                  <View style={styles.latorLng}>
                    <DropdownComponentType
                      data={dropdownData}
                      setVehicleType={setVehicleType}
                      selected={vehicleType}
                    />
                  </View>
                </View>
                {/* /// type /// */}
                {/* /// DESC /// */}
                <View style={styles.latLngNameRow}>
                  <View style={styles.latLngLabel}>
                    <Text style={styles.latorLngtxt}>Description:</Text>
                  </View>
                  <View style={styles.latorLng}>
                    <TextInput
                      style={styles.textInput5}
                      multiline
                      placeholder="Describe Your Vehicle"
                      placeholderTextColor="#c3c3c3"
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
                    <Text style={styles.latorLngtxt}>Capacity:</Text>
                  </View>
                  <View style={styles.latorLng}>
                    <TextInput
                      style={styles.textInput5}
                      placeholder="Enter Vehicle Capacity"
                      placeholderTextColor="#c3c3c3"
                      value={capacity}
                      onChangeText={(text) => setCapacity(text)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                {/* /// VACANCY /// */}
                {/* Save Button */}
                <View style={styles2.modalViewLogin}>
                  <View style={styles.loginContainer}>
                    <TouchableOpacity
                      onPress={() => handleCreateVehicle()}
                      style={
                        name === "" ||
                        description === "" ||
                        capacity === "" ||
                        vehicleType === "" ||
                        image === ""
                          ? styles.selection2Disabled
                          : styles.selection2
                      }
                      disabled={
                        name === "" ||
                        description === "" ||
                        capacity === "" ||
                        vehicleType === "" ||
                        image === ""
                      }
                    >
                      <Text style={styles.loginText}>Create Vehicle</Text>
                    </TouchableOpacity>
                  </View>
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
              {isUploadingImage ? (
                <View style={styles.profileImage}>
                  <ActivityIndicator size="large" style={{ top: vh(8) }} />
                </View>
              ) : (
                <TouchableOpacity onPress={pickVoyageImage}>
                  {voyageImage ? (
                    <Image
                      source={{ uri: voyageImage }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <Image
                      source={require("../assets/ParrotsWhiteBgPlus.png")}
                      style={styles.profileImage2}
                    />
                  )}
                </TouchableOpacity>
              )}

              {/* Your other UI elements */}
            </View>

            <View
              style={
                addedVehicleImages.length <= 1
                  ? styles.length1
                  : addedVehicleImages.length === 2
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
                    <View key={index}>
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
            {/* <TouchableOpacity
                style={styles.FinishButtonContainer}
                onPress={() => {
                  goToProfilePage();
                }}
              >
                <Text style={styles.addWaypointText}> Complete </Text>
              </TouchableOpacity> */}

            <View style={styles.completeContainer}>
              <TouchableOpacity
                onPress={() => {
                  goToProfilePage();
                }}
                style={
                  data[0].key === "placeholder_1"
                    ? styles.selection2Disabled
                    : styles.selection2
                }
                disabled={data[0].key === "placeholder_1"}
              >
                <Text style={styles.loginText}>Complete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : null}
    </>
  );
};

export default CreateVehicleScreen;

const styles2 = StyleSheet.create({
  modalView: {
    backgroundColor: "#2184c6",
    borderRadius: vh(3),
    borderWidth: 2,
    borderColor: "#76bae8",
    alignSelf: "center",
    marginTop: vh(0.8),
  },
  modalViewLogin: {
    borderColor: "#76bae8",
    alignSelf: "center",
    marginTop: vh(0.8),
  },
  selection: {
    marginHorizontal: vh(0.5),
    marginVertical: vh(0.5),
    paddingHorizontal: vh(2),
    paddingVertical: vh(1),
    backgroundColor: "#15537d",
    borderRadius: vh(2.5),
  },
  choiceText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },

  voyageImage1: {
    height: vh(13),
    width: vh(13),
    marginRight: vh(1),
    borderRadius: vh(1.5),
  },
});

const styles = StyleSheet.create({
  completeContainer: {
    alignSelf: "center",
    marginTop: vh(2),
  },
  loginText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    textAlign: "center",
  },
  choiceText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    textAlign: "center",
  },
  selection2: {
    marginHorizontal: vh(0.25),
    marginVertical: vh(0.25),
    paddingVertical: vh(1),
    backgroundColor: "rgb(24,111,241)",
    borderRadius: vh(4),
    width: vw(50),
  },
  selection2Disabled: {
    marginHorizontal: vh(0.25),
    marginVertical: vh(0.25),
    paddingVertical: vh(1),
    backgroundColor: "rgba(24,111,241,.3)",
    borderRadius: vh(4),
    width: vw(50),
  },
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
    borderTopRightRadius: vh(3),
    borderBottomRightRadius: vh(3),
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
  selectedText: {
    color: "rgba(24,111,241,0.5)",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  length1: {
    height: vh(13),
    width: vw(90),
    alignSelf: "center",
  },
  length2: {
    width: vw(90),
    alignSelf: "center",
  },
  length3: {
    width: vw(90),
    alignSelf: "center",
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
  scrollview: {
    height: vh(140),
    marginBottom: vh(5),
    backgroundColor: "white",
  },
  overlay: {
    marginTop: vh(0),
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: vh(1),
    marginBottom: vh(1),
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
    height: vh(35),
  },
  backgroundImagePlaceholder: {
    marginBottom: vh(3),
    width: vw(70),
    height: vh(35),
  },
  profileImage2: {
    marginLeft: vw(3),
    marginVertical: vh(1),
    marginBottom: vh(3),
    width: vh(20),
    height: vh(20),
    borderRadius: vh(3),
    borderColor: "rgba(0, 119, 234,0.1)",
    // borderWidth: 5,
  },
  formContainer: {
    padding: vh(2),
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
  },
});
