import { ParrotsStdText } from "../components/ParrotsStdText";
/* eslint-disable no-constant-condition */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  useGetVehicleByIdQuery,
  useAddVehicleImageMutation,
  useDeleteVehicleImageMutation,
  usePatchVehicleMutation,
  useGetVehicleImagesByVehicleIdQuery,
  useDeleteVehicleMutation,
  useUpdateVehicleProfileImageMutation,
} from "../slices/VehicleSlice";
import { vh, vw } from "react-native-expo-viewport-units";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import DropdownComponentType from "../components/DropdownComponentType";
import StepBarVehicle from "../components/StepBarVehicle";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import { parrotBlue, parrotCream, parrotRed } from "../assets/color";
import { htmlToText } from "html-to-text";

const SCREEN_W = Dimensions.get("window").width;
const TILE_GAP = 8;
const TILE_SIZE = Math.floor((SCREEN_W - vw(8) - 20 - TILE_GAP * 2) / 3);

const EditVehicleScreen = () => {
  const userId = useSelector((state) => state.users.userId);
  const route = useRoute();
  const { currentVehicleId } = route.params;

  const { data: vehicleData, isSuccess: isSuccessVehicleData } = useGetVehicleByIdQuery(currentVehicleId);
  const { data: vehicleImagesData, isSuccess: isSuccessVehicleImagesData } = useGetVehicleImagesByVehicleIdQuery(currentVehicleId);

  const [updateVehicleProfileImage] = useUpdateVehicleProfileImageMutation();
  const [deleteVehicle] = useDeleteVehicleMutation();
  const [patchVehicle] = usePatchVehicleMutation();
  const [deleteVehicleImage] = useDeleteVehicleImageMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [image, setImage] = useState("");
  const [addedVehicleImages, setAddedVehicleImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const navigation = useNavigation();

  const VehicleTypes = {
    Boat: "Boat", Car: "Car", Caravan: "Caravan", Bus: "Bus",
    Walk: "Walk", Run: "Run", Motorcycle: "Motorcycle", Bicycle: "Bicycle",
    TinyHouse: "TinyHouse", Airplane: "Airplane", Train: "Train",
  };

  const toPlainText = (html) => htmlToText(html ?? "", { wordwrap: false });

  useEffect(() => {
    if (vehicleData) {
      const vehicleTypeArray = Object.keys(VehicleTypes);
      setVehicleType(vehicleTypeArray[vehicleData.type]);
      setName(vehicleData.name);
      setDescription(toPlainText(vehicleData.description));
      setCapacity(vehicleData.capacity.toString());
      setImage(vehicleData.profileImageUrl);
    }
  }, [isSuccessVehicleData]);

  useEffect(() => {
    if (vehicleImagesData) {
      // normalize to same shape as CreateVehicleScreen: { addedVoyageImageId, voyageImage }
      setAddedVehicleImages(
        vehicleImagesData.map((img) => ({
          addedVoyageImageId: img.id,
          voyageImage: img.vehicleImagePath,
        }))
      );
    }
  }, [isSuccessVehicleImagesData]);

  const goToProfilePage = () => navigation.navigate("Home", { screen: "HomeScreen" });

  const handlePatchVehicle = async () => {
    const patchDoc = [
      { op: "replace", path: "/name", value: name },
      { op: "replace", path: "/description", value: description },
      { op: "replace", path: "/capacity", value: capacity },
    ];
    try {
      await patchVehicle({ patchDoc, currentVehicleId });
    } catch (e) {
      console.error("Error", e);
      setHasError(true);
    }
  };

  const handleUpdateVehicleProfileImage = async () => {
    if (!image || image === vehicleData?.profileImageUrl) return;
    const formData = new FormData();
    formData.append("imageFile", { uri: image, type: "image/jpeg", name: "profileImage.jpg" });
    try {
      await updateVehicleProfileImage({ formData, vehicleId: currentVehicleId });
    } catch (e) {
      console.error("Error uploading profile image", e);
      setHasError(true);
    }
  };

  const pickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.7,
    });
    if (!result.canceled) {
      const manipulated = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 1080, height: 1080 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImage(manipulated.uri);
    }
  };

  const pickVoyageImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.7,
    });
    if (!result.canceled) {
      const manipulated = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 1080, height: 1080 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      const uri = manipulated.uri;
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
        const responseData = JSON.parse(uploadResult.body);
        const addedVoyageImageId = responseData?.imagePath;
        if (!addedVoyageImageId) throw new Error("Image path not returned from API");
        setAddedVehicleImages((prev) => [...prev, { addedVoyageImageId, voyageImage: uri }]);
      } catch (e) {
        console.error("Error uploading image", e);
        setHasError(true);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleDeleteImage = async (imageId) => {
    const previous = [...addedVehicleImages];
    setAddedVehicleImages(previous.filter((item) => item.addedVoyageImageId !== imageId));
    try {
      await deleteVehicleImage(imageId);
    } catch (e) {
      console.error("Error deleting image", e);
      setAddedVehicleImages(previous);
      setHasError(true);
    }
  };

  const HandleDeleteVehicle = () => {
    deleteVehicle(currentVehicleId);
    navigation.navigate("Home");
  };

  const dropdownData = Object.keys(VehicleTypes).map((key) => ({ label: key, value: key }));

  // ── Grid (identical to CreateVehicleScreen) ──
  const buildGridData = () => {
    const tiles = [];
    tiles.push({ type: "picker" });
    addedVehicleImages.forEach((item) => tiles.push({ type: "image", item }));
    if (isUploadingImage) tiles.push({ type: "uploading" });
    while (tiles.length < 9) tiles.push({ type: "empty", id: String(tiles.length) });
    return tiles;
  };

  const renderGridTile = (item) => {
    const base = [s.tile, { width: TILE_SIZE, height: TILE_SIZE }];
    if (item.type === "image") {
      return (
        <View style={base}>
          <Image source={{ uri: item.item.voyageImage }} style={s.tileImg} />
          <TouchableOpacity style={s.tileX} onPress={() => handleDeleteImage(item.item.addedVoyageImageId)}>
            <Feather name="x" size={12} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    }
    if (item.type === "uploading") {
      return <View style={[...base, s.tileUploading]}><ActivityIndicator size="small" color={parrotBlue} /></View>;
    }
    if (item.type === "picker") {
      return (
        <TouchableOpacity style={[...base, s.tilePicker]} onPress={pickVoyageImage} activeOpacity={0.75}>
          <Image
            source={require("../assets/ParrotsLogoPlus.png")}
            style={{ width: TILE_SIZE * 0.55, height: TILE_SIZE * 0.55, opacity: 0.22 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      );
    }
    return <View style={[...base, s.tileEmpty]} />;
  };

  return (
    <>
      <TokenExpiryGuard />
      <StepBarVehicle currentStep={currentStep} onFirstStepPress={() => setCurrentStep(1)} onSecondStepPress={() => setCurrentStep(2)} />

      {/* ── STEP 1 ── */}
      {currentStep === 1 && (
        <ScrollView style={s.root} contentContainerStyle={{ paddingBottom: vh(12) }}>

          <TouchableOpacity onPress={pickProfileImage} activeOpacity={0.85}>
            <View style={s.heroWrap}>
              <Image
                source={image ? { uri: image } : require("../assets/placeholder.png")}
                style={s.heroImg}
                resizeMode="cover"
              />
              <View style={s.heroEditBadge}>
                <Feather name="camera" size={16} color="#0A2540" />
              </View>
            </View>
          </TouchableOpacity>

          <View style={s.cardWrap}>
            <View style={s.card}>
              <View style={s.field}>
                <ParrotsStdText style={s.fieldLabel}>NAME</ParrotsStdText>
                <TextInput
                  style={s.input}
                  placeholder="Vehicle name (max 20)"
                  placeholderTextColor="rgba(92,107,122,0.45)"
                  value={name}
                  maxLength={20}
                  onChangeText={setName}
                />
              </View>
              <View style={s.divider} />
              <View style={s.field}>
                <ParrotsStdText style={s.fieldLabel}>TYPE</ParrotsStdText>
                <View style={{ flex: 1 }}>
                  <DropdownComponentType data={dropdownData} setVehicleType={setVehicleType} selected={vehicleType} />
                </View>
              </View>
              <View style={s.divider} />
              <View style={s.field}>
                <ParrotsStdText style={s.fieldLabel}>CAPACITY</ParrotsStdText>
                <TextInput
                  style={s.input}
                  placeholder="e.g. 4"
                  placeholderTextColor="rgba(92,107,122,0.45)"
                  value={capacity}
                  onChangeText={setCapacity}
                  keyboardType="numeric"
                />
              </View>
              <View style={s.divider} />
              <View style={[s.field, { alignItems: "flex-start" }]}>
                <ParrotsStdText style={[s.fieldLabel, { paddingTop: 4 }]}>ABOUT</ParrotsStdText>
                <TextInput
                  style={[s.input, s.inputMulti]}
                  placeholder="Describe your vehicle"
                  placeholderTextColor="rgba(92,107,122,0.45)"
                  multiline
                  numberOfLines={5}
                  value={description}
                  onChangeText={setDescription}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity style={[s.deleteBtn, { flex: 1 }]} onPress={() => setDeleteModalVisible(true)} activeOpacity={0.85}>
                <ParrotsStdText style={s.deleteBtnText}>Delete</ParrotsStdText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.saveBtn, { flex: 2 }]}
                onPress={() => { handlePatchVehicle(); handleUpdateVehicleProfileImage(); setCurrentStep(2); }}
                activeOpacity={0.85}
              >
                <ParrotsStdText style={s.saveBtnText}>Save &amp; Continue</ParrotsStdText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

      {/* ── STEP 2 (identical to CreateVehicleScreen) ── */}
      {currentStep === 2 && (
        <ScrollView style={s.root} contentContainerStyle={{ paddingHorizontal: vw(4), paddingBottom: vh(12) }}>

          <View style={s.photosCard}>
            <View style={s.photosHeadRow}>
              <ParrotsStdText style={s.photosHeading}>Photos</ParrotsStdText>
              <ParrotsStdText style={s.photosCount}>{addedVehicleImages.length} / 8</ParrotsStdText>
            </View>

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
          </View>

          <TouchableOpacity style={[s.saveBtn, { alignSelf: "center", paddingHorizontal: vw(10) }]} onPress={goToProfilePage} activeOpacity={0.85}>
            <ParrotsStdText style={s.saveBtnText}>Complete</ParrotsStdText>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Delete confirm modal */}
      <Modal animationType="fade" transparent visible={deleteModalVisible} onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" }}>
          <View style={s.modalCard}>
            <ParrotsStdText style={s.modalTitle}>Delete this vehicle?</ParrotsStdText>
            <ParrotsStdText style={s.modalDesc}>This will also remove all its voyages. This cannot be undone.</ParrotsStdText>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 18 }}>
              <TouchableOpacity style={s.modalCancel} onPress={() => setDeleteModalVisible(false)}>
                <ParrotsStdText style={s.modalCancelText}>Cancel</ParrotsStdText>
              </TouchableOpacity>
              <TouchableOpacity style={s.modalDelete} onPress={HandleDeleteVehicle}>
                <ParrotsStdText style={s.modalDeleteText}>Delete</ParrotsStdText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default EditVehicleScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: parrotCream },

  heroWrap: { width: SCREEN_W, height: SCREEN_W * 0.85, position: "relative" },
  heroImg: { width: "100%", height: "100%" },
  heroEditBadge: {
    position: "absolute", bottom: 12, right: 12,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.93)",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 4, elevation: 3,
  },

  cardWrap: { paddingHorizontal: 12, paddingTop: 12, gap: 10, marginTop: -16 },

  card: {
    borderWidth: 1.5, borderColor: "#E8E3DC",
    borderRadius: 14, backgroundColor: "#fff",
    padding: 14, gap: 4,
  },

  field: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 40 },
  fieldLabel: { fontFamily: "Nunito_800ExtraBold", fontSize: 9, letterSpacing: 1.2, color: "#5A6874", width: 68 },
  input: { flex: 1, fontFamily: "Nunito_700Bold", fontSize: 14, color: "#1F2933", paddingVertical: 6 },
  inputMulti: { minHeight: 90, textAlignVertical: "top", paddingTop: 4 },
  divider: { height: 1, backgroundColor: "#F0F4F8", marginVertical: 2 },

  saveBtn: { backgroundColor: "#0A5FBF", borderRadius: 999, paddingVertical: 13, alignItems: "center", justifyContent: "center" },
  saveBtnText: { fontFamily: "Nunito_800ExtraBold", fontSize: 15, color: "#fff" },
  deleteBtn: { backgroundColor: "#fff", borderRadius: 999, borderWidth: 1.5, borderColor: "#FDECEA", paddingVertical: 13, alignItems: "center" },
  deleteBtnText: { fontFamily: "Nunito_800ExtraBold", fontSize: 15, color: "#C0392B" },

  // Step 2 — photos card (matches CreateVehicleScreen)
  photosCard: {
    borderWidth: 1.5, borderColor: "#D8E0E8",
    borderRadius: 14, backgroundColor: "#fff",
    padding: 10, marginTop: vh(1), marginBottom: vh(1.5),
  },
  photosHeadRow: { flexDirection: "row", alignItems: "baseline", marginBottom: vh(1.2) },
  photosHeading: { fontFamily: "Nunito_800ExtraBold", fontSize: 20, color: parrotBlue, flex: 1 },
  photosCount: { fontFamily: "Nunito_700Bold", fontSize: 14, color: "rgba(92,107,122,0.75)" },

  tile: { borderRadius: 14, overflow: "hidden", position: "relative" },
  tileImg: { width: "100%", height: "100%", resizeMode: "cover" },
  tileX: {
    position: "absolute", right: 4, top: 4,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: "rgba(12,30,48,0.55)",
    alignItems: "center", justifyContent: "center",
  },
  tileUploading: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#E8E3DC", alignItems: "center", justifyContent: "center" },
  tilePicker: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#E8E3DC", alignItems: "center", justifyContent: "center" },
  tileEmpty: { backgroundColor: parrotCream, borderWidth: 1, borderColor: "#E8E3DC", opacity: 0.65 },

  // modal
  modalCard: { backgroundColor: "#fff", borderRadius: 18, padding: 22, width: "82%", borderWidth: 1.5, borderColor: "#E8E3DC" },
  modalTitle: { fontFamily: "Nunito_800ExtraBold", fontSize: 16, color: "#1F2933", marginBottom: 6 },
  modalDesc: { fontFamily: "Nunito_700Bold", fontSize: 13, color: "#5A6874", lineHeight: 19 },
  modalCancel: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#F0F2F5", alignItems: "center" },
  modalCancelText: { fontFamily: "Nunito_700Bold", fontSize: 14, color: "#3D3D3D" },
  modalDelete: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: parrotRed, alignItems: "center" },
  modalDeleteText: { fontFamily: "Nunito_700Bold", fontSize: 14, color: "#fff" },
});
