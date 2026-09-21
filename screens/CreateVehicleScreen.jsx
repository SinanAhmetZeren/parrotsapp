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
  Dimensions,
} from "react-native";
import {
  useCreateVehicleMutation,
  useAddVehicleImageMutation,
  useDeleteVehicleImageMutation,
  useCheckAndDeleteVehicleMutation,
  useConfirmVehicleMutation,
  usePatchVehicleMutation,
} from "../slices/VehicleSlice";
import { vh, vw } from "react-native-expo-viewport-units";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { MaterialIcons, AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import DropdownComponentType from "../components/DropdownComponentType";
import StepBarVehicle from "../components/StepBarVehicle";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import { parrotBlue, parrotBlueMediumTransparent, parrotBlueSemiTransparent, parrotCream, parrotInputTextColor, parrotLightBlue, parrotPlaceholderGrey, parrotTransparentWhite } from "../assets/color";

const SCREEN_W = Dimensions.get("window").width;
const TILE_GAP = 8;
const TILE_SIZE = Math.floor((SCREEN_W - vw(8) - TILE_GAP * 2) / 3); // 3 tiles, 2 gaps, padH = vw(4)*2

const CreateVehicleScreen = () => {
  const userId = useSelector((state) => state.users.userId);

  const [createVehicle] = useCreateVehicleMutation();
  const [addVehicleImage] = useAddVehicleImageMutation();
  const [deleteVehicleImage] = useDeleteVehicleImageMutation();
  const [checkAndDeleteVehicle] = useCheckAndDeleteVehicleMutation();
  const [confirmVehicle] = useConfirmVehicleMutation();
  const [patchVehicle] = usePatchVehicleMutation();

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
  const vehicleIdRef = React.useRef("");
  const [image, setImage] = useState("");
  const [addedVehicleImages, setAddedVehicleImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isCreatingVehicle, setIsCreatingVehicle] = useState(false);
  const [isCompletingVehicle, setIsCompletingVehicle] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  const [isUpdatingVehicle, setIsUpdatingVehicle] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  React.useEffect(() => { vehicleIdRef.current = vehicleId; }, [vehicleId]);

  const hasChanges = savedSnapshot
    ? name !== savedSnapshot.name ||
    description !== savedSnapshot.description ||
    String(capacity) !== String(savedSnapshot.capacity)
    : false;

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        navigation.navigate("Home", { screen: "HomeScreen" });
        return true;
      };
      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => backHandler.remove();
    }, [navigation])
  );

  useFocusEffect(
    React.useCallback(() => {
      if (!vehicleId) {
        setVehicleType(1);
        setName("");
        setDescription("");
        setCapacity(null);
        setImage("");
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
    setAddedVehicleImages([]);
    setCurrentStep(1);
    setIsUploadingImage(false);
    setIsCreatingVehicle(false);
    setIsUpdatingVehicle(false);
    setHasError(false);
    setSavedSnapshot(null);
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
    if (!image) return;
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
      if (!createdVehicleId) throw new Error("Vehicle ID not returned from API");
      setVehicleId(createdVehicleId);
      setSavedSnapshot({ name, description, capacity });
      setCurrentStep(2);
    } catch (error) {
      console.error("Error in or after createVehicle:", error);
      console.log("Error details:", error?.data || error?.error || error?.message);
      showToast("Failed to create vehicle - Check your connection and try again.");
      setHasError(true);
    } finally {
      setIsCreatingVehicle(false);
    }
  };

  const handleUpdateVehicle = async () => {
    setIsUpdatingVehicle(true);
    setHasError(false);
    try {
      const patch = [
        { op: "replace", path: "/name", value: name },
        { op: "replace", path: "/description", value: description },
        { op: "replace", path: "/capacity", value: Number(capacity) },
      ];
      await patchVehicle({ currentVehicleId: vehicleId, patchDoc: patch }).unwrap();
      setSavedSnapshot({ name, description, capacity });
    } catch (error) {
      console.error("Error updating vehicle:", error);
      showToast("Failed to update vehicle - Check your connection and try again.");
      setHasError(true);
    } finally {
      setIsUpdatingVehicle(false);
    }
  };

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
      const uri = manipulated.uri;
      const currentVehicleId = vehicleIdRef.current;

      setIsUploadingImage(true);
      setHasError(false);
      try {
        const token = await AsyncStorage.getItem("storedToken");
        const uploadResult = await FileSystem.uploadAsync(
          `${API_URL}/api/Vehicle/${currentVehicleId}/AddVehicleImage`,
          uri,
          {
            httpMethod: "POST",
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: "imageFile",
            mimeType: "image/jpeg",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("AddVehicleImage response:", uploadResult.status, uploadResult.body);
        const responseData = JSON.parse(uploadResult.body);
        const addedVoyageImageId = responseData?.imagePath;
        if (!addedVoyageImageId) throw new Error("Image path not returned from API");
        setAddedVehicleImages((prev) => [...prev, { addedVoyageImageId, voyageImage: uri }]);
      } catch (error) {
        console.error("Error uploading image", error);
        showToast("Image upload failed - Check your connection and try again.");
        setHasError(true);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleDeleteImage = async (imageId) => {
    const previousImages = [...addedVehicleImages];
    setAddedVehicleImages(previousImages.filter((item) => item.addedVoyageImageId !== imageId));
    setHasError(false);
    try {
      await deleteVehicleImage(imageId);
    } catch (error) {
      console.error("Error deleting image", error);
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

  const dropdownData = VehicleTypes.map((type) => ({ label: type, value: type }));

  const isStep1Disabled =
    name === "" || description === "" || !capacity || vehicleType === "" || image === "";

  const buildGridData = () => {
    const tiles = [];
    // Picker always top-left
    tiles.push({ type: "picker" });
    // Uploaded images fill next slots
    addedVehicleImages.forEach((item) => {
      tiles.push({ type: "image", item });
    });
    // Uploading spinner goes after last uploaded
    if (isUploadingImage) tiles.push({ type: "uploading" });
    // Empty slots to fill to 9 (1 picker + 8 images)
    while (tiles.length < 9) tiles.push({ type: "empty", id: String(tiles.length) });
    return tiles;
  };

  const renderGridTile = (item) => {
    const base = [styles.tile, { width: TILE_SIZE, height: TILE_SIZE }];
    if (item.type === "image") {
      return (
        <View style={base}>
          <Image source={{ uri: item.item.voyageImage }} style={styles.tileImg} />
          <TouchableOpacity
            style={styles.tileX}
            onPress={() => handleDeleteImage(item.item.addedVoyageImageId)}
          >
            <Feather name="x" size={12} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    }
    if (item.type === "uploading") {
      return (
        <View style={[...base, styles.tileUploading]}>
          <ActivityIndicator size="small" color={parrotBlue} />
        </View>
      );
    }
    if (item.type === "picker") {
      return (
        <TouchableOpacity
          style={[...base, styles.tilePicker]}
          onPress={pickVoyageImage}
          activeOpacity={0.75}
        >
          <Image
            source={require("../assets/ParrotsLogoPlus.png")}
            style={{ width: TILE_SIZE * 0.55, height: TILE_SIZE * 0.55, opacity: 0.22 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      );
    }
    return <View style={[...base, styles.tileEmpty]} />;
  };

  return (
    <>
      <TokenExpiryGuard />

      <View style={{ backgroundColor: "white" }}>
        <StepBarVehicle
          currentStep={currentStep}
          onFirstStepPress={() => setCurrentStep(1)}
          onSecondStepPress={vehicleId ? () => setCurrentStep(2) : null}
        />
      </View>

      {hasError && (
        <ScrollView
          contentContainerStyle={{ backgroundColor: parrotCream, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={false} onRefresh={() => setHasError(false)} />}
        >
          <View style={{ marginTop: vh(15), alignItems: "center" }}>
            <Image source={require("../assets/parrotslogo.png")} style={styles.logoImage} />
            <ParrotsStdText style={styles.errorText}>Something went wrong</ParrotsStdText>
            <ParrotsStdText style={styles.errorText}>Swipe down to retry</ParrotsStdText>
          </View>
        </ScrollView>
      )}

      {/* ── STEP 1 ── */}
      {currentStep === 1 && !hasError && (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView
            style={styles.scrollview}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Cover photo */}
            <TouchableOpacity style={styles.coverCard} onPress={pickProfileImage} activeOpacity={0.8}>
              {isCreatingVehicle ? (
                <ActivityIndicator size="large" color={parrotBlue} />
              ) : image ? (
                <Image source={{ uri: image }} style={styles.coverImage} />
              ) : (
                <Image
                  source={require("../assets/ParrotsLogoPlus.png")}
                  style={{ width: vw(47), height: vh(21), opacity: 0.18 }}
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>

            {/* Name */}
            <ParrotsStdText style={styles.fieldLabel}>Name</ParrotsStdText>
            <TextInput
              style={styles.input}
              placeholder="Vehicle name (max 20)"
              placeholderTextColor="rgba(92,107,122,0.5)"
              value={name}
              maxLength={20}
              onChangeText={setName}
            />

            {/* Type + Capacity row */}
            <View style={styles.typeCapRow}>
              <View style={{ flex: 1.5 }}>
                <ParrotsStdText style={styles.fieldLabel}>Type</ParrotsStdText>
                <View style={styles.dropdownCard}>
                  <DropdownComponentType
                    data={dropdownData}
                    setVehicleType={setVehicleType}
                    selected={vehicleType}
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <ParrotsStdText style={styles.fieldLabel}>Capacity</ParrotsStdText>
                <TextInput
                  style={styles.input}
                  placeholder="Passengers"
                  placeholderTextColor="rgba(92,107,122,0.5)"
                  value={capacity ? String(capacity) : ""}
                  onChangeText={setCapacity}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Description */}
            <ParrotsStdText style={styles.fieldLabel}>Description</ParrotsStdText>
            <TextInput
              style={[styles.input, { minHeight: vh(11), textAlignVertical: "top", paddingTop: 10 }]}
              multiline
              placeholder="Describe your vehicle"
              placeholderTextColor="rgba(92,107,122,0.5)"
              value={description}
              onChangeText={setDescription}
            />

            {/* Register / Update button */}
            {!vehicleId ? (
              <TouchableOpacity
                style={[styles.createBtn, isStep1Disabled && styles.createBtnDisabled, { alignSelf: "center", paddingHorizontal: vw(10) }]}
                onPress={() => setShowConfirmModal(true)}
                disabled={isStep1Disabled}
                activeOpacity={0.85}
              >
                <ParrotsStdText style={[styles.createBtnText, isCreatingVehicle && { opacity: 0 }]}>Register Vehicle</ParrotsStdText>
                {isCreatingVehicle && <ActivityIndicator size="small" color="#fff" style={{ position: "absolute" }} />}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.createBtn, !hasChanges && styles.createBtnDisabled, { alignSelf: "center", paddingHorizontal: vw(10) }]}
                onPress={handleUpdateVehicle}
                disabled={!hasChanges || isUpdatingVehicle}
                activeOpacity={0.85}
              >
                <ParrotsStdText style={[styles.createBtnText, isUpdatingVehicle && { opacity: 0 }]}>Update Details</ParrotsStdText>
                {isUpdatingVehicle && <ActivityIndicator size="small" color="#fff" style={{ position: "absolute" }} />}
              </TouchableOpacity>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {/* ── STEP 2 ── */}
      {currentStep === 2 && !hasError && (
        <ScrollView style={styles.scrollview} contentContainerStyle={styles.scrollContent}>
          {console.log("Step 2 screen rendered")}

          {/* Vehicle created badge */}
          <View style={styles.createdBadge}>
            <Feather name="check" size={13} color="#0B6B4E" />
            <ParrotsStdText style={styles.createdBadgeText}>Vehicle created</ParrotsStdText>
          </View>

          {/* Photos heading */}
          <View style={styles.photosHeadRow}>
            <ParrotsStdText style={styles.photosHeading}>Photos</ParrotsStdText>
            <ParrotsStdText style={styles.photosCount}>{addedVehicleImages.length} / 8</ParrotsStdText>
          </View>

          {/* Image grid — explicit 3-column rows, no FlatList */}
          {(() => {
            const tiles = buildGridData();
            return [0, 1, 2].map(row => (
              <View key={row} style={{ flexDirection: "row", marginBottom: TILE_GAP }}>
                {tiles.slice(row * 3, row * 3 + 3).map((item, col) => {
                  const tileKey =
                    item.type === "image" ? `img-${item.item.addedVoyageImageId}` :
                      item.type === "picker" ? "picker" :
                        item.type === "uploading" ? "uploading" :
                          `empty-${item.id}`;
                  return (
                    <View key={tileKey} style={{ marginRight: col < 2 ? TILE_GAP : 0 }}>
                      {renderGridTile(item)}
                    </View>
                  );
                })}
              </View>
            ));
          })()}

          {/* Bottom button */}
          <View style={styles.step2Foot}>
            <TouchableOpacity
              style={[styles.createBtn, { alignSelf: "center", paddingHorizontal: vw(10) }]}
              onPress={() => setShowCompleteModal(true)}
              activeOpacity={0.85}
              disabled={isCompletingVehicle}
            >
              <ParrotsStdText style={[styles.createBtnText, isCompletingVehicle && { opacity: 0 }]}>
                Complete
              </ParrotsStdText>
              {isCompletingVehicle && <ActivityIndicator size="small" color="#fff" style={{ position: "absolute" }} />}
            </TouchableOpacity>
          </View>

        </ScrollView>
      )}

      <Modal visible={showCompleteModal} transparent animationType="fade">
        <View style={vehicleModalStyles.overlay}>
          <View style={vehicleModalStyles.box}>
            <ParrotsStdText style={vehicleModalStyles.title}>All done?</ParrotsStdText>
            <ParrotsStdText style={vehicleModalStyles.desc}>Your vehicle is registered. You can add more photos any time from your profile.</ParrotsStdText>
            <View style={vehicleModalStyles.buttonRow}>
              <TouchableOpacity onPress={() => setShowCompleteModal(false)}>
                <ParrotsStdText style={vehicleModalStyles.cancelText}>Cancel</ParrotsStdText>
              </TouchableOpacity>
              <TouchableOpacity
                style={vehicleModalStyles.confirmButton}
                onPress={() => { setShowCompleteModal(false); completeVehicle(); }}
              >
                <ParrotsStdText style={vehicleModalStyles.confirmText}>Complete</ParrotsStdText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={vehicleModalStyles.overlay}>
          <View style={vehicleModalStyles.box}>
            <ParrotsStdText style={vehicleModalStyles.title}>Register this vehicle?</ParrotsStdText>
            <ParrotsStdText style={vehicleModalStyles.headline}>It goes on your public profile.</ParrotsStdText>
            <ParrotsStdText style={vehicleModalStyles.desc}>Anyone viewing your profile can see it.</ParrotsStdText>
            <View style={vehicleModalStyles.pill}>
              <ParrotsStdText style={vehicleModalStyles.pillText}>Nothing locks, you can edit or remove it any time.</ParrotsStdText>
            </View>
            <View style={[vehicleModalStyles.pill, vehicleModalStyles.pillGreen]}>
              <ParrotsStdText style={[vehicleModalStyles.pillText, vehicleModalStyles.pillTextGreen]}>Free to register, no ParrotCrackers used</ParrotsStdText>
            </View>
            <View style={vehicleModalStyles.buttonRow}>
              <TouchableOpacity onPress={() => setShowConfirmModal(false)}>
                <ParrotsStdText style={vehicleModalStyles.cancelText}>Cancel</ParrotsStdText>
              </TouchableOpacity>
              <TouchableOpacity
                style={vehicleModalStyles.confirmButton}
                onPress={() => { setShowConfirmModal(false); handleCreateVehicle(); }}
              >
                <ParrotsStdText style={vehicleModalStyles.confirmText}>Register vehicle</ParrotsStdText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {toastVisible && (
        <View style={styles.toast}>
          <ParrotsStdText style={styles.toastText}>{toastMessage}</ParrotsStdText>
        </View>
      )}
    </>
  );
};

export default CreateVehicleScreen;

const styles = StyleSheet.create({
  scrollview: {
    flex: 1,
    backgroundColor: parrotCream,
  },
  scrollContent: {
    paddingHorizontal: vw(4),
    paddingBottom: vh(12),
  },
  logoImage: {
    height: vh(23),
    width: vh(23),
    alignSelf: "center",
  },
  errorText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 17,
    color: parrotBlue,
    textAlign: "center",
    marginTop: 4,
  },

  // Cover
  coverCard: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E8E3DC",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: vh(2),
    marginTop: vh(1),
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },

  // Field label
  fieldLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: "rgba(92,107,122,0.75)",
    marginBottom: 5,
    marginLeft: 2,
  },

  // Input (MessagesScreen createInput style)
  input: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13.5,
    color: "#0A2540",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E8E3DC",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 44,
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: vh(1.5),
  },

  // Type + Capacity side by side
  typeCapRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 0,
  },

  // Dropdown wrapper matches input card
  dropdownCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E8E3DC",
    borderRadius: 16,
    height: 44,
    justifyContent: "center",
    marginBottom: vh(1.5),
    overflow: "hidden",
  },

  // Buttons
  createBtn: {
    backgroundColor: parrotBlue,
    borderRadius: vh(3),
    paddingVertical: vh(1.2),
    alignItems: "center",
    justifyContent: "center",
    marginTop: vh(2),
  },
  createBtnDisabled: {
    backgroundColor: parrotBlueSemiTransparent,
  },
  createBtnText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#fff",
  },

  // Step 2
  createdBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#E3F5EC",
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: vh(1),
    marginBottom: vh(1.5),
  },
  createdBadgeText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    color: "#0B6B4E",
  },
  photosHeadRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: vh(1.2),
  },
  photosHeading: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
    color: parrotBlue,
    flex: 1,
  },
  photosCount: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: "rgba(92,107,122,0.75)",
  },

  // Image grid
  tile: {
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
  },
  tileImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  tileCoverBadge: {
    position: "absolute",
    left: 5,
    bottom: 5,
    backgroundColor: "rgba(12,30,48,0.65)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tileCoverText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 9,
    color: "#fff",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  tileX: {
    position: "absolute",
    right: 4,
    top: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(12,30,48,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  tileUploading: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E8E3DC",
    alignItems: "center",
    justifyContent: "center",
  },
  tilePicker: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E8E3DC",
    alignItems: "center",
    justifyContent: "center",
  },
  tileEmpty: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E8E3DC",
    opacity: 0.45,
  },

  // Step 2 bottom
  step2Foot: {
    marginTop: vh(2),
    alignItems: "center",
  },

  // Toast
  toast: {
    position: "absolute",
    bottom: vh(10),
    alignSelf: "center",
    backgroundColor: "rgba(30,111,217,0.9)",
    paddingHorizontal: vw(4),
    paddingVertical: vh(1),
    borderRadius: 20,
  },
  toastText: {
    fontFamily: "Nunito_700Bold",
    color: "white",
    fontSize: 13,
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
    marginBottom: 8,
    color: parrotBlue,
  },
  headline: {
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: "#0A2540",
    marginBottom: 4,
  },
  desc: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: parrotInputTextColor,
    marginBottom: 12,
  },
  pill: {
    backgroundColor: parrotCream,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  pillGreen: {
    backgroundColor: "rgba(0,150,100,0.1)",
    marginBottom: 20,
  },
  pillText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: parrotInputTextColor,
  },
  pillTextGreen: {
    color: "#16a34a",
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
