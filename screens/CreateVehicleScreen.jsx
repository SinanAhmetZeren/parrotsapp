import { ParrotsStdText } from "../components/ParrotsStdText";
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
  Modal,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
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
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { MaterialIcons, AntDesign, Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import DropdownComponentType from "../components/DropdownComponentType";
import StepBarVehicle from "../components/StepBarVehicle";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import { parrotBlue, parrotBlueMediumTransparent, parrotBlueSemiTransparent, parrotCream, parrotInputTextColor, parrotLightBlue, parrotPlaceholderGrey, parrotTransparentWhite } from "../assets/color";

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

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
      if (!vehicleId) {
        setVehicleType(1);
        setName("");
        setDescription("");
        setCapacity(22);
        setImage("");
        setVoyageImage(null);
        setAddedVehicleImages([]);
        setCurrentStep(1);
        setIsUploadingImage(false);
        setIsCreatingVehicle(false);
      }
    }, [vehicleId])
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

  const resetAllFields = () => {
    setName("");
    setDescription("");
    setCapacity(null);
    setVehicleType(1);
    setVehicleId("");
    setImage("");
    setVoyageImage(null);
    setAddedVehicleImages([]);
    setCurrentStep(1);
    setIsUploadingImage(false);
    setIsCreatingVehicle(false);
    setHasError(false);
  };

  const completeVehicle = async () => {
    setIsCompletingVehicle(true);
    setHasError(false);

    try {
      console.log("confirming vehicle: ", vehicleId);
      const confirmResult = await confirmVehicle(vehicleId);
      console.log("confirmResult: ", confirmResult);

      resetAllFields();
      navigation.navigate("Home", { screen: "HomeScreen" });

    } catch (error) {
      console.error("Error completing vehicle:", error);
      showToast("Failed to complete vehicle - Check your connection and try again.");
      setHasError(true);
    } finally {
      setIsCompletingVehicle(false);
    }
  };

  const handleCreateVehicle = async () => {
    if (!image) {
      return;
    }

    setIsCreatingVehicle(true);
    setHasError(false);

    try {
      const queryParams = new URLSearchParams({
        Name: name,
        Description: description,
        UserId: userId,
        Capacity: capacity,
        Type: vehicleType,
      });
      const token = await AsyncStorage.getItem("storedToken");
      const result = await FileSystem.uploadAsync(
        `${API_URL}/api/Vehicle/AddVehicle?${queryParams}`,
        image,
        {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "imageFile",
          mimeType: "image/jpeg",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const responseData = JSON.parse(result.body);
      const createdVehicleId = responseData?.data?.id;
      if (!createdVehicleId) {
        throw new Error("Vehicle ID not returned from API");
      }

      setVehicleId(createdVehicleId);
      setCurrentStep(2);
    } catch (error) {
      console.error("Error in or after createVehicle:", error);
      console.log(
        "Error details:",
        error?.data || error?.error || error?.message
      );
      showToast("Failed to create vehicle - Check your connection and try again.");
      setHasError(true);
    } finally {
      setIsCreatingVehicle(false);
    }
  };


  const handleUploadImage = useCallback(async () => {
    if (!voyageImage) {
      return;
    }

    setIsUploadingImage(true);
    setHasError(false);

    try {
      const token = await AsyncStorage.getItem("storedToken");
      const result = await FileSystem.uploadAsync(
        `${API_URL}/api/Vehicle/${vehicleId}/AddVehicleImage`,
        voyageImage,
        {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "imageFile",
          mimeType: "image/jpeg",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("AddVehicleImage response:", result.status, result.body);
      const responseData = JSON.parse(result.body);
      const addedVoyageImageId = responseData?.imagePath;

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
      showToast("Image upload failed - Check your connection and try again.");
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
      aspect: [1, 1],
      quality: 0.7,
    });

    console.log("Picking profile image... PICKED");

    if (!result.canceled) {
      const asset = result.assets[0];
      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 1080, height: 1080 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImage(manipulated.uri);
    }

  };

  const pickVoyageImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 1080, height: 1080 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      setVoyageImage(manipulated.uri);
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

      <View style={{ alignItems: "center", backgroundColor: "white" }}>
        <StepBarVehicle currentStep={currentStep} onFirstStepPress={() => setCurrentStep(1)} onSecondStepPress={vehicleId ? () => setCurrentStep(2) : null} />
      </View>



      {hasError && (
        <ScrollView
          contentContainerStyle={{ backgroundColor: "white", height: vh(100) }}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={() => setHasError(false)} />
          }
        >
          <View style={{ marginTop: vh(15) }}>
            <Image
              source={require("../assets/parrotslogo.png")}
              style={styles.logoImage}
            />
            <ParrotsStdText style={styles.currentBidsTitle2}>Something went wrong</ParrotsStdText>
            <ParrotsStdText style={styles.currentBidsTitle2}>Swipe down to retry</ParrotsStdText>
          </View>
        </ScrollView>
      )}

      {currentStep == 1 && !hasError && (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView style={styles.scrollview} keyboardShouldPersistTaps="handled">

            {/* Card 1: Profile Image */}
            <View style={styles.sectionCard}>
              <View style={styles.cardTitleRow}>
                <ParrotsStdText style={styles.cardTitle}>Vehicle Profile Image</ParrotsStdText>
              </View>
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
                      <View style={styles.backgroundImagePlaceholder}>
                        <Image
                          source={require("../assets/ParrotsLogoPlus.png")}
                          style={{ width: vw(48), height: vh(21), opacity: 0.2 }}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Card 2: Vehicle Details */}
            <View style={styles.sectionCard}>
              <View style={styles.cardTitleRow}>
                <ParrotsStdText style={styles.cardTitle}>Vehicle Details</ParrotsStdText>
              </View>
              <View style={styles.formContainer}>
                {/* /// name /// */}
                <View style={styles.latLngNameRow}>
                  <View style={styles.latLngLabel}>
                    <ParrotsStdText style={styles.latorLngtxt}>Name:</ParrotsStdText>
                  </View>
                  <View style={styles.latorLng}>
                    <TextInput
                      style={styles.textInput5}
                      placeholder="Vehicle name (max 20)"
                      placeholderTextColor={parrotPlaceholderGrey}
                      value={name}
                      maxLength={20}
                      onChangeText={(text) => setName(text)}
                    />
                  </View>
                </View>
                {/* /// type /// */}
                <View style={styles.latLngNameRow}>
                  <View style={styles.latLngLabel}>
                    <ParrotsStdText style={styles.latorLngtxt}>Type:</ParrotsStdText>
                  </View>
                  <View style={styles.latorLng}>
                    <DropdownComponentType
                      data={dropdownData}
                      setVehicleType={setVehicleType}
                      selected={vehicleType}
                    />
                  </View>
                </View>
                {/* /// DESC /// */}
                <View style={styles.latLngNameRow}>
                  <View style={styles.latLngLabel}>
                    <ParrotsStdText style={styles.latorLngtxt}>Description:</ParrotsStdText>
                  </View>
                  <View style={styles.latorLng}>
                    <TextInput
                      style={[styles.textInput5, { minHeight: vh(12), textAlignVertical: "top" }]}
                      multiline
                      placeholder="Describe Your Vehicle"
                      placeholderTextColor={parrotPlaceholderGrey}
                      value={description}
                      onChangeText={(text) => setDescription(text)}
                    />
                  </View>
                </View>
                {/* /// VACANCY /// */}
                <View style={styles.latLngNameRow}>
                  <View style={styles.latLngLabel}>
                    <ParrotsStdText style={styles.latorLngtxt}>Capacity:</ParrotsStdText>
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
              </View>
            </View>

            {/* Create Vehicle Button */}
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
                    <ParrotsStdText style={styles.loginText}>Create Vehicle</ParrotsStdText>
                  )}
                </TouchableOpacity>
              </View>
            </View>

          </ScrollView>


        </KeyboardAvoidingView>
      )}

      {currentStep === 2 && !hasError && (

        <ScrollView style={styles.scrollview}>
          {console.log("Step 2 screen rendered")}

          <View style={styles.overlay}>

            <View style={vehicleImagesStyles.vehicleImagesContainer}>
              <View style={[styles.profileContainer2, { position: "relative" }]}>
                {isUploadingImage ? (
                  <View style={[styles.profileImage, { justifyContent: "center", alignItems: "center" }]}>
                    <ActivityIndicator size="large" />
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
                        source={require("../assets/ParrotsLogoPlus.png")}
                        style={[styles.profileImage2, { opacity: 0.2 }]}
                      />
                    )}
                  </TouchableOpacity>
                )}
                {voyageImage && !isUploadingImage && (
                  <TouchableOpacity
                    onPress={() => handleUploadImage()}
                    style={styles.uploadButton}
                  >
                    <ParrotsStdText style={styles.uploadButtonText}>Upload</ParrotsStdText>
                  </TouchableOpacity>
                )}
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
                  keyExtractor={(item, index) => `vehicle-image-${index}`}
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
                                : require("../assets/placeholder1.png")
                            }
                            style={vehicleImagesStyles.vehicleImage1}
                          />

                          {item.addedVoyageImageId && (
                            <ParrotsStdText style={styles.deleteAddedImage}>
                              <MaterialIcons
                                name="cancel"
                                size={24}
                                color="darkred"
                              />
                            </ParrotsStdText>
                          )}
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              </View>
            </View>
            {/* <TouchableOpacity
                style={styles.FinishButtonContainer}
                onPress={() => {
                  goToProfilePage();
                }}
              >
                <ParrotsStdText style={styles.addWaypointText}> Complete </ParrotsStdText>
              </TouchableOpacity> */}

            <View style={styles.completeContainer}>
              <TouchableOpacity
                onPress={() => setShowConfirmModal(true)}
                style={styles.selection2}
              >
                {isCompletingVehicle ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <ParrotsStdText style={styles.loginText}>
                    {addedVehicleImages.length === 0 ? "Skip" : "Complete"}
                  </ParrotsStdText>
                )}
              </TouchableOpacity>
            </View>

            <Modal visible={showConfirmModal} transparent animationType="fade">
              <View style={vehicleModalStyles.overlay}>
                <View style={vehicleModalStyles.box}>
                  <ParrotsStdText style={vehicleModalStyles.title}>Register this vehicle?</ParrotsStdText>
                  <View style={vehicleModalStyles.nameCard}>
                    <View style={vehicleModalStyles.nameRow}>
                      <ParrotsStdText style={vehicleModalStyles.nameLabel}>Name</ParrotsStdText>
                      <ParrotsStdText style={vehicleModalStyles.nameValue}>{name}</ParrotsStdText>
                    </View>
                    <View style={vehicleModalStyles.nameRow}>
                      <ParrotsStdText style={vehicleModalStyles.nameLabel}>Type</ParrotsStdText>
                      <ParrotsStdText style={vehicleModalStyles.nameValue}>{vehicleType}</ParrotsStdText>
                    </View>
                  </View>
                  <ParrotsStdText style={vehicleModalStyles.subtitle}>Goes on your public profile. Edit or remove it any time.</ParrotsStdText>
                  <View style={vehicleModalStyles.buttonRow}>
                    <TouchableOpacity onPress={() => setShowConfirmModal(false)}>
                      <ParrotsStdText style={vehicleModalStyles.cancelText}>Cancel</ParrotsStdText>
                    </TouchableOpacity>
                    <TouchableOpacity style={vehicleModalStyles.confirmButton} onPress={() => { setShowConfirmModal(false); completeVehicle(); }}>
                      <ParrotsStdText style={vehicleModalStyles.confirmText}>Register vehicle</ParrotsStdText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default CreateVehicleScreen;

const styles = StyleSheet.create({

  currentBidsTitle2: {
    fontFamily: "Nunito_800ExtraBold",
    top: vh(-3),
    fontSize: 17,
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
    marginBottom: vh(10),
  },
  completeContainer: {
    alignSelf: "center",
    marginTop: vh(2),
    marginBottom: vh(10),
  },
  loginText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  choiceText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  selection2: {
    marginHorizontal: vh(0.25),
    marginVertical: vh(0.25),
    marginBottom: vh(3),
    paddingVertical: vh(1),
    backgroundColor: parrotBlue,
    borderRadius: vh(4),
    width: vw(50),
  },
  selection2Disabled: {
    marginHorizontal: vh(0.25),
    marginVertical: vh(0.25),
    marginBottom: vh(3),
    paddingVertical: vh(1),
    backgroundColor: parrotBlueSemiTransparent,
    borderRadius: vh(4),
    width: vw(50),
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
    fontFamily: "Nunito_700Bold",
    color: parrotInputTextColor,
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
    fontFamily: "Nunito_700Bold",
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
    fontFamily: "Nunito_700Bold",
    color: parrotBlue,
    fontSize: 18,
    textAlign: "center",
  },
  length1: {
    flex: 1,
    height: vh(15),
  },
  length2: {
    flex: 1,
  },
  length3: {
    flex: 1,
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
  profileContainer2: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginRight: vh(1),
    borderRadius: vh(1.5),
  },
  uploadButton: {
    position: "absolute",
    bottom: vh(1),
    alignSelf: "center",
    backgroundColor: parrotBlue,
    borderRadius: vh(2),
    paddingVertical: vh(0.5),
    paddingHorizontal: vw(3),
    alignItems: "center",
  },
  uploadButtonText: {
    color: "white",
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
  },
  profileImage: {
    width: vh(15),
    height: vh(15),
    borderRadius: vh(1.5),
  },
  backgroundImage: {
    width: vw(80),
    height: vh(35),
    borderRadius: 20,
  },
  backgroundImagePlaceholder: {
    width: vw(80),
    height: vh(35),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionCard: {
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
  cardTitleRow: { marginHorizontal: vw(2), marginBottom: vh(1) },
  cardTitle: { fontFamily: "Nunito_800ExtraBold", fontSize: 20, color: parrotBlue },
  profileImage2: {
    width: vh(15),
    height: vh(15),
    borderRadius: vh(1.5),
  },
  formContainer: {
    padding: vh(2),
  },
});

const vehicleImagesStyles = StyleSheet.create({
  vehicleImagesContainer: {
    marginTop: vh(10),
    paddingBottom: vh(1),
    paddingHorizontal: vw(3),
    alignSelf: "center",
    width: vw(94),
    borderRadius: vh(2),
    flexDirection: "row",
    alignItems: "flex-start",
  },
  vehicleImage1: {
    height: vh(15),
    width: vh(15),
    marginRight: vh(1),
    borderRadius: vh(1.5),
  },
});

const vehicleModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: vw(85),
  },
  title: {
    fontSize: 20,
    fontFamily: "Nunito_700Bold",
    marginBottom: 16,
    color: parrotBlue,
  },
  nameCard: {
    backgroundColor: parrotCream,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
    marginBottom: 14,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  nameLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: parrotInputTextColor,
    width: vw(20),
  },
  nameValue: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: parrotInputTextColor,
  },
  subtitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: parrotInputTextColor,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cancelText: {
    fontFamily: "Nunito_700Bold",
    color: parrotInputTextColor,
    fontSize: 15,
    paddingHorizontal: 8,
  },
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    backgroundColor: parrotBlue,
    alignItems: "center",
  },
  confirmText: {
    fontFamily: "Nunito_700Bold",
    color: "white",
    fontSize: 14,
  },
});

