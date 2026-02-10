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
  useConfirmVehicleMutation
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
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import { parrotBlue, parrotBlueMediumTransparent, parrotBlueSemiTransparent, parrotCream, parrotInputTextColor, parrotPlaceholderGrey, parrotTransparentWhite } from "../assets/color";

const CreateVehicleScreen = () => {
  const userId = useSelector((state) => state.users.userId);

  const [createVehicle] = useCreateVehicleMutation();
  const [addVehicleImage] = useAddVehicleImageMutation();
  const [deleteVehicleImage] = useDeleteVehicleImageMutation();
  const [checkAndDeleteVehicle] = useCheckAndDeleteVehicleMutation();
  const [confirmVehicle] = useConfirmVehicleMutation();

  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const formattedHours = hours < 10 ? `0${hours}` : hours.toString();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
  const formattedseconds = seconds < 10 ? `0${seconds}` : seconds.toString();
  const timeString = `${formattedHours}:${formattedMinutes}:${formattedseconds}`;
  const [vehicleType, setVehicleType] = useState(1);
  // const [name, setName] = useState("aaa");
  // const [description, setDescription] = useState("bbb");
  // const [capacity, setCapacity] = useState(22) //useState(null);
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
  const [isCompletingVehicle, setIsCompletingVehicle] = useState(false);
  const [hasError, setHasError] = useState(false)

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        // navigation.navigate("Home");
        navigation.navigate("Home", { screen: "HomeScreen" });

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
      setVehicleType(1);
      setName("");
      setDescription("");
      setCapacity(22);
      setVehicleId("");
      setImage("");
      setVoyageImage(null);
      setAddedVehicleImages([]);
      // setCurrentStep(1);  //// RESET
      setIsUploadingImage(false);
      setIsCreatingVehicle(false);
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (addedVehicleImages.length == 0 && vehicleId !== "") {
          checkAndDeleteVehicle(vehicleId);
        }
      };
    }, [vehicleId, addedVehicleImages])
  );

  const completeVehicle = async () => {
    // reset form state
    setName("");
    setDescription("");
    setCapacity(0);
    setVehicleType("");
    setVehicleId("");
    setImage("");
    setVoyageImage("");
    setAddedVehicleImages([]);

    // guard: no images → do nothing
    if (addedVehicleImages.length === 0) {
      console.log("images length: -->", addedVehicleImages.length);
      return;
    }

    setIsCompletingVehicle(true);
    setHasError(false);

    try {
      console.log("confirming vehicle: ", vehicleId);
      const confirmResult = await confirmVehicle(vehicleId);
      console.log("confirmResult: ", confirmResult);

      // navigation.navigate("Home");
      navigation.navigate("Home", { screen: "HomeScreen" });

    } catch (error) {
      console.error("Error completing vehicle:", error);
      setHasError(true);
    } finally {
      setIsCompletingVehicle(false);
    }
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

    setIsCreatingVehicle(true);
    setHasError(false);

    try {
      const response = await createVehicle({
        formData,
        name,
        description,
        userId,
        vehicleType,
        capacity,
      });

      const createdVehicleId = response?.data?.data?.id;
      if (!createdVehicleId) {
        throw new Error("Vehicle ID not returned from API");
      }

      setVehicleId(createdVehicleId);
      setDescription("");
      setCapacity("");
      setVehicleType("");
      setImage("");
      setVoyageImage("");
      setAddedVehicleImages([]);

      console.log("1. Vehicle created successfully, moving to step 2");
      setCurrentStep(2);
      console.log("2. Vehicle created successfully, moving to step 2");
    } catch (error) {
      console.error("Error in or after createVehicle:", error);
      console.log(
        "Error details:",
        error?.data || error?.error || error?.message
      );
      setHasError(true);
    } finally {
      setIsCreatingVehicle(false);
    }
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
    setHasError(false);

    try {
      const addedVehicleImageResponse = await addVehicleImage({
        formData,
        vehicleId,
      });

      const addedVoyageImageId =
        addedVehicleImageResponse?.data?.imagePath;

      if (!addedVoyageImageId) {
        throw new Error("Image path not returned from API");
      }

      const newItem = {
        addedVoyageImageId,
        voyageImage,
      };

      setAddedVehicleImages((prevImages) => [...prevImages, newItem]);
      setVoyageImage(null);
    } catch (error) {
      console.error("Error uploading image", error);
      setHasError(true);
    } finally {
      setIsUploadingImage(false);
    }
  }, [voyageImage, vehicleId, addVehicleImage]);


  const pickProfileImage = async () => {
    console.log("Picking profile image... PICKING");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    console.log("Picking profile image... PICKED");

    if (!result.canceled) {
      console.log("Picking profile image... CANCELLED");

      setImage(result.assets[0].uri);
    }

  };

  const pickVoyageImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setVoyageImage(result.assets[0].uri);
    }
  };



  const handleDeleteImage = async (imageId) => {
    const previousImages = [...addedVehicleImages];

    // optimistic UI update
    setAddedVehicleImages(
      previousImages.filter(
        (item) => item.addedVoyageImageId !== imageId
      )
    );

    setHasError(false);

    try {
      await deleteVehicleImage(imageId);
    } catch (error) {
      console.error("Error deleting image", error);

      // rollback on failure
      setAddedVehicleImages(previousImages);
      setHasError(true);
    }
  };



  const VehicleTypes = [
    "Boat",
    "Car",
    "Caravan",
    "Bus",
    // "Walk",
    // "Run",
    "Motorcycle",
    "Bicycle",
    "TinyHouse",
    "Airplane",
    // "Train",
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
      <TokenExpiryGuard />

      <StepBarVehicle currentStep={currentStep} />



      {hasError && (
        <View style={{ backgroundColor: "white", height: vh(100) }}>
          <View style={{ marginTop: vh(15) }}>
            <Image
              source={require("../assets/ParrotsLogo.png")}
              style={styles.logoImage}
            />
            <Text style={styles.currentBidsTitle2}>Connection Error</Text>
            {/* <Text style={styles.currentBidsTitle3}>
              Swipe Down to Retry
            </Text> */}
          </View>
        </View>
      )}

      {currentStep == 1 && !hasError && (
        <ScrollView style={styles.scrollview}>
          <View style={styles.overlay}>
            <View style={styles.profileContainer}>
              {isCreatingVehicle ? (
                <View style={styles.backgroundImage}>
                  <ActivityIndicator size="large" style={{ top: vh(14) }} />
                </View>
              ) : (
                <TouchableOpacity onPress={() => pickProfileImage()}>
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={styles.backgroundImage}
                    />
                  ) : (
                    <Image
                      // source={require("../assets/placeholder.png")}
                      source={require("../assets/ParrotsLogo.png")}
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
                      placeholderTextColor={parrotPlaceholderGrey}
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
                      placeholderTextColor={parrotPlaceholderGrey}
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
                      placeholderTextColor={parrotPlaceholderGrey}
                      value={capacity}
                      onChangeText={(text) => setCapacity(text)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                {/* /// VACANCY /// */}
                {/* Save Button */}
                <View style={styles.modalViewLogin}>
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
                      {isCreatingVehicle ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.loginText}>Create Vehicle</Text>

                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {currentStep === 2 && !hasError && (

        <ScrollView style={styles.scrollview}>
          {console.log("Step 2 screen rendered")}

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
                      source={require("../assets/ParrotsLogo.png")}
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
                // keyExtractor={(item, index) => index.toString()}
                keyExtractor={(item, index) => `voyage-image-${index}`}
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
                          style={styles.voyageImage1}
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
                  <AntDesign name="cloud-upload" size={24} color="white" />
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
                  completeVehicle();
                }}
                style={
                  data[0].key === "placeholder_1"
                    ? styles.selection2Disabled
                    : styles.selection2
                }
                disabled={data[0].key === "placeholder_1"}
              >
                {/* <Text style={styles.loginText}>Complete</Text> */}

                {isCompletingVehicle ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.loginText}>Complete</Text>
                )}

              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default CreateVehicleScreen;

const styles = StyleSheet.create({

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
  voyageImage1: {
    height: vh(13),
    width: vh(13),
    marginRight: vh(1),
    borderRadius: vh(1.5),
  },
  modalViewLogin: {
    alignSelf: "center",
    marginTop: vh(0.8),
  },
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
    backgroundColor: parrotBlue,
    borderRadius: vh(4),
    width: vw(50),
  },
  selection2Disabled: {
    marginHorizontal: vh(0.25),
    marginVertical: vh(0.25),
    paddingVertical: vh(1),
    backgroundColor: parrotBlueSemiTransparent,
    borderRadius: vh(4),
    width: vw(50),
  },
  addWaypointText: {
    alignSelf: "center",
    padding: vh(1),
    borderRadius: vh(2),
    backgroundColor: parrotBlue,
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
    backgroundColor: parrotCream,
    borderRadius: vh(3),
    marginBottom: vh(0.5),
  },
  latLngLabel: {
    justifyContent: "center",
    backgroundColor: parrotCream,
    marginVertical: vh(0.3),
    padding: vh(0.4),
    borderRadius: vh(3),
    borderColor: parrotPlaceholderGrey,

  },
  latorLngtxt: {
    color: parrotInputTextColor,
    fontWeight: "500",
    width: vw(25),
    textAlign: "center",
  },
  latorLng: {
    flexDirection: "row",
    backgroundColor: parrotTransparentWhite,
    marginVertical: vh(0.3),
    padding: vh(0.4),
    borderTopRightRadius: vh(3),
    borderBottomRightRadius: vh(3),
    borderColor: parrotPlaceholderGrey,
    width: vw(64),
  },
  textInput5: {
    fontSize: 13,
    paddingLeft: vw(1),
    width: "90%",
    color: parrotInputTextColor,
  },
  selectedChoice: {
    marginTop: vh(1),
    alignItems: "center",
  },
  selectedText: {
    color: parrotBlue,
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
    backgroundColor: parrotBlue,
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
    // borderColor: "rgba(190, 119, 234,0.6)",
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
  },
  formContainer: {
    padding: vh(2),
  },
  textInput: {
    lineHeight: 21,
    marginVertical: 1,
    fontSize: 14,
    padding: vw(1),
  },
});

