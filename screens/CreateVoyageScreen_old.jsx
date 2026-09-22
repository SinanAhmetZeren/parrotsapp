import { ParrotsStdText } from "../components/ParrotsStdText";
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Button,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useGetUserByIdQuery } from "../slices/UserSlice";
import {
  useCreateVoyageMutation,
  useAddVoyageImageMutation,
  useDeleteVoyageImageMutation,
  useCheckAndDeleteVoyageMutation,
  usePatchVoyageOwnerMutation,
} from "../slices/VoyageSlice";
import { vh, vw } from "react-native-expo-viewport-units";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MaterialIcons,
  AntDesign,
  Fontisto,
  Feather,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { useAcknowledgePublicProfileMutation, setAcknowledgedPublicProfile, useLazyGetParrotCrackerBalanceQuery } from "../slices/UserSlice";
import CalendarPicker from "react-native-calendar-picker";
import Checkbox from "expo-checkbox";
import DropdownComponent from "../components/DropdownComponent";
import StepBar from "../components/StepBar";
import CreateVoyageMapComponent from "../components/CreateVoyageMapComponent";
import { API_URL } from "@env";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import { parrotBlue, parrotBlueMediumTransparent, parrotBlueSemiTransparent, parrotCaravanOrangeRed, parrotCream, parrotGreen, parrotGreenMediumTransparent, parrotGreenTransparent, parrotInputTextColor, parrotLightBlue, parrotPlaceholderGrey, parrotTransparentWhite } from "../assets/color";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DropdownComponentCurrency from "../components/DropdownComponentCurrency";


// Set lastBidDate to startDate for now, 
// since lastBidDate is hidden and not used in the form
const CreateVoyageScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const userId = useSelector((state) => state.users.userId);
  const hasAcknowledgedPublicProfile = useSelector((state) => state.users.hasAcknowledgedPublicProfile);
  const dispatch = useDispatch();
  const [acknowledgePublicProfile] = useAcknowledgePublicProfileMutation();
  const [showPublicProfileModal, setShowPublicProfileModal] = useState(false);
  const {
    data: userData,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useGetUserByIdQuery(userId);
  const [fetchCrackerBalance, { data: crackerBalance }] = useLazyGetParrotCrackerBalanceQuery();
  const [createVoyage] = useCreateVoyageMutation();
  const [addVoyageImage] = useAddVoyageImageMutation();
  const [deleteVoyageImage] = useDeleteVoyageImageMutation();
  const [checkAndDeleteVoyage] = useCheckAndDeleteVoyageMutation();
  const [patchVoyageOwner] = usePatchVoyageOwnerMutation();

  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const formattedHours = hours < 10 ? `0${hours}` : hours.toString();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
  const formattedseconds = seconds < 10 ? `0${seconds}` : seconds.toString();
  const timeString = `${formattedHours}:${formattedMinutes}:${formattedseconds}`;



  // const getRandomString = (length = 6) => {
  //   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  //   return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  // };

  // const getRandomNumberString = (min = 1, max = 999) => {
  //   return String(Math.floor(Math.random() * (max - min + 1)) + min);
  // };


  const [name, setName] = useState("");
  const [brief, setBrief] = useState("");
  const [description, setDescription] = useState("");
  const [vacancy, setVacancy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [lastBidDate, setLastBidDate] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [createdVoyageImage, setCreatedVoyageImage] = useState(null);
  const [isAuction, setIsAuction] = useState(true);
  const [isFixedPrice, setIsFixedPrice] = useState(false);
  const [isPublicOnMap, setIsPublicOnMap] = useState(true);
  const [vehicleId, setVehicleId] = useState("");
  const [currency, setCurrency] = useState("€");
  const [voyageId, setVoyageId] = useState("");
  const [image, setImage] = useState("");
  const [voyageImage, setVoyageImage] = useState(null);
  const [addedVoyageImages, setAddedVoyageImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(2);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isCreatingVoyage, setIsCreatingVoyage] = useState(false);
  const [calendarRangeAllowed, setCalendarRangeAllowed] = useState(false);
  const sameDateTapCount = useRef(0);
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [hasError, setHasError] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  useEffect(() => { }, [startDate, endDate, lastBidDate, voyageImage]);

  useEffect(() => { fetchCrackerBalance(userId); }, [userId]);

  useEffect(() => {
    if (!hasAcknowledgedPublicProfile) {
      setShowPublicProfileModal(true);
    }
  }, [hasAcknowledgedPublicProfile]);

  const handleAcknowledge = async () => {
    setShowPublicProfileModal(false);
    try {
      await acknowledgePublicProfile().unwrap();
      dispatch(setAcknowledgedPublicProfile());
    } catch (e) {
      // silently ignore
    }
  };

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

  const resetAllFields = () => {
    setName("");
    setBrief("");
    setDescription("");
    setVacancy("");
    setStartDate("");
    setEndDate("");
    setLastBidDate("");
    setMinPrice("");
    setMaxPrice("");
    setIsAuction(true);
    setIsFixedPrice(false);
    setIsPublicOnMap(true);
    setVehicleId("");
    setCurrency("€");
    setVoyageId("");
    setImage("");
    setVoyageImage(null);
    setAddedVoyageImages([]);
    setCurrentStep(1);
    setCreatedVoyageImage(null);
    setSavedSnapshot(null);
    setUpdateSuccess(false);
    setHasError(false);
  };

  const changeCurrentState = (index) => {
    setCurrentStep(index);
  };

  function convertDateFormat2(inputDate) {
    const date = new Date(inputDate);
    const year = date.getUTCFullYear();
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);
    const day = `0${date.getUTCDate()}`.slice(-2);
    const hours = `0${date.getUTCHours()}`.slice(-2);
    const minutes = `0${date.getUTCMinutes()}`.slice(-2);
    const seconds = `0${date.getUTCSeconds()}`.slice(-2);
    const milliseconds = `00${date.getUTCMilliseconds()}`.slice(-3);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  function convertDateFormat(inputDate) {
    const date = new Date(inputDate);
    return date.toISOString(); // ✅ THIS FIXES EVERYTHING
  }

  function convertDateFormat_LastBidDate(inputDate) {
    const dateParts = inputDate.split("/");
    if (dateParts.length !== 3) {
      throw new Error("Invalid date format");
    }

    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[0], 10);
    const day = parseInt(dateParts[1], 10);

    const date = new Date(Date.UTC(year, month - 1, day));

    const formattedDate = `${date.getUTCFullYear()}-${(
      "0" +
      (date.getUTCMonth() + 1)
    ).slice(-2)}-${("0" + date.getUTCDate()).slice(-2)} 00:00:00.000`;

    return formattedDate;
  }

  const handleCreateVoyage = async () => {
    if (isCreatingVoyage) return;
    if (!image) return;

    try {
      const formattedStartDate = convertDateFormat(startDate);
      const formattedEndDate = endDate ? convertDateFormat(endDate) : convertDateFormat(startDate);
      const lastBidDateObj = endDate ? new Date(endDate) : new Date(startDate);
      lastBidDateObj.setHours(23, 59, 59, 999);
      const formattedLastBidDate = lastBidDateObj.toISOString();

      const queryParams = new URLSearchParams({
        Name: name, Brief: brief, Description: description, Vacancy: vacancy,
        StartDate: formattedStartDate, EndDate: formattedEndDate, LastBidDate: formattedLastBidDate,
        MinPrice: minPrice, MaxPrice: maxPrice, Currency: currency,
        Auction: isAuction.toString(), FixedPrice: isFixedPrice.toString(),
        PublicOnMap: isPublicOnMap.toString(), UserId: userId, VehicleId: vehicleId,
      });

      const token = await AsyncStorage.getItem("storedToken");
      setIsCreatingVoyage(true);
      const result = await FileSystem.uploadAsync(
        `${API_URL}/api/Voyage/AddVoyage?${queryParams}`,
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
      if (responseData?.success === false) {
        setIsCreatingVoyage(false);
        showToast(responseData.message || "Could not create voyage. Please try again.");
        return;
      }
      if (!responseData?.data?.id) {
        setIsCreatingVoyage(false);
        setHasError(true);
        return;
      }
      const createdVoyageId = responseData.data.id;
      setCreatedVoyageImage(image);
      setVoyageId(createdVoyageId);
      setSavedSnapshot({ name, brief, description, vacancy, vehicleId, minPrice, maxPrice, currency, isAuction, isFixedPrice, isPublicOnMap, startDate, endDate });
      setCurrentStep(2);
    } catch (error) {
      console.error("Error creating voyage", error);
      setHasError(true);
    }
    setIsCreatingVoyage(false);
  };

  const hasChanges = savedSnapshot && (
    name !== savedSnapshot.name ||
    brief !== savedSnapshot.brief ||
    description !== savedSnapshot.description ||
    String(vacancy) !== String(savedSnapshot.vacancy) ||
    String(vehicleId) !== String(savedSnapshot.vehicleId) ||
    String(minPrice) !== String(savedSnapshot.minPrice) ||
    String(maxPrice) !== String(savedSnapshot.maxPrice) ||
    currency !== savedSnapshot.currency ||
    isAuction !== savedSnapshot.isAuction ||
    isFixedPrice !== savedSnapshot.isFixedPrice ||
    isPublicOnMap !== savedSnapshot.isPublicOnMap ||
    String(startDate) !== String(savedSnapshot.startDate) ||
    String(endDate) !== String(savedSnapshot.endDate)
  );

  const handleUpdateDetails = async () => {
    setIsUpdatingDetails(true);
    try {
      const formattedStartDate = convertDateFormat(startDate);
      const formattedEndDate = endDate ? convertDateFormat(endDate) : convertDateFormat(startDate);
      const patchDoc = [
        { op: "replace", path: "/name", value: name },
        { op: "replace", path: "/brief", value: brief },
        { op: "replace", path: "/description", value: description },
        { op: "replace", path: "/vacancy", value: Number(vacancy) },
        { op: "replace", path: "/vehicleId", value: Number(vehicleId) },
        { op: "replace", path: "/minPrice", value: Number(minPrice) },
        { op: "replace", path: "/maxPrice", value: Number(maxPrice) },
        { op: "replace", path: "/currency", value: currency },
        { op: "replace", path: "/auction", value: isAuction },
        { op: "replace", path: "/fixedPrice", value: isFixedPrice },
        { op: "replace", path: "/publicOnMap", value: isPublicOnMap },
        { op: "replace", path: "/startDate", value: formattedStartDate },
        { op: "replace", path: "/endDate", value: formattedEndDate },
        { op: "replace", path: "/lastBidDate", value: formattedStartDate },
      ];
      await patchVoyageOwner({ voyageId, patchDoc }).unwrap();
      setSavedSnapshot({ name, brief, description, vacancy, vehicleId, minPrice, maxPrice, currency, isAuction, isFixedPrice, isPublicOnMap, startDate, endDate });
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 5000);
    } catch (err) {
      showToast("Failed to update voyage details.");
    }
    setIsUpdatingDetails(false);
  };

  const handleUploadImage = async () => {
    if (isUploadingImage) return;
    if (!voyageImage) return;

    setIsUploadingImage(true);
    try {
      const token = await AsyncStorage.getItem("storedToken");
      const result = await FileSystem.uploadAsync(
        `${API_URL}/api/Voyage/${voyageId}/AddVoyageImage`,
        voyageImage,
        {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "imageFile",
          mimeType: "image/jpeg",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const responseData = JSON.parse(result.body);
      if (!responseData?.imagePath) {
        showToast("Image upload failed - Check your connection and try again.");
        return;
      }
      setAddedVoyageImages((prevImages) => [...prevImages, { addedVoyageImageId: responseData.imagePath, voyageImage }]);
      setVoyageImage(null);
    } catch (error) {
      console.error("Error uploading image", error);
      showToast("Image upload failed - Check your connection and try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const pickProfileImage = async () => {
    // console.log("pickProfileImage called");
    // console.log("voyageimage", voyageImage);
    // console.log("image", image);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    console.log("result-> ", result.assets[0].uri);
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
      mediaTypes: ["images"],
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

  const handleDateChange = (text) => {
    // Remove non-numeric characters from the input
    const cleanedText = text.replace(/[^0-9]/g, "");

    // Format the date as MM/DD/YYYY
    let formattedDate = "";
    if (cleanedText.length > 0) {
      formattedDate += cleanedText.substring(0, 2);
    }
    if (cleanedText.length > 2) {
      formattedDate += `/${cleanedText.substring(2, 4)}`;
    }
    if (cleanedText.length > 4) {
      formattedDate += `/${cleanedText.substring(4, 8)}`;
    }
    setLastBidDate(formattedDate); // Update state with formatted string
  };

  const onDateChange = (date) => {
    if (startDate && endDate) {
      setStartDate("");
      setEndDate(null);
      setCalendarRangeAllowed(false);
      sameDateTapCount.current = 0;
      return;
    }
    if (!startDate) {
      setStartDate(date);
      console.log("-->>", date);
      setCalendarRangeAllowed(false);
      sameDateTapCount.current = 0;
    } else {
      if (date > startDate) {
        setCalendarRangeAllowed(true);
        setEndDate(date);
        sameDateTapCount.current = 0;
      } else if (date < startDate) {
        setStartDate(date);
        setEndDate(null);
        sameDateTapCount.current = 0;
      } else {
        // same date tapped again
        sameDateTapCount.current += 1;
        if (sameDateTapCount.current >= 2) {
          setStartDate("");
          setEndDate(null);
          setCalendarRangeAllowed(false);
          sameDateTapCount.current = 0;
        }
        // 1st repeat tap: keep (green, no change)
      }
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await deleteVoyageImage(imageId).unwrap();
      setAddedVoyageImages((prevImages) =>
        prevImages.filter((item) => item.addedVoyageImageId !== imageId)
      );
    }
    catch {
      setHasError(true)
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
        <ActivityIndicator size="large" color={parrotBlue} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
        <Image source={require("../assets/parrotslogo.png")} style={styles.logoImage} />
        <ParrotsStdText style={styles.currentBidsTitle2}>Something went wrong</ParrotsStdText>
        <ParrotsStdText style={styles.currentBidsTitle2}>Swipe down to retry</ParrotsStdText>
        <TouchableOpacity onPress={refetch} style={{ marginTop: vh(2) }}>
          <ParrotsStdText style={{ fontFamily: "Nunito_700Bold", color: parrotBlue }}>Tap to retry</ParrotsStdText>
        </TouchableOpacity>
      </View>
    );
  }

  if (isSuccess) {
    const dropdownData = [
      { label: "Walk", value: 1 },  // database id's, not type codes
      { label: "Train", value: 2 },
      { label: "Run", value: 3 },
    ].concat(
      userData?.usersVehicles?.map((vehicle) => ({
        label: vehicle.name,
        value: vehicle.id,
      }))
    );

    const formatCalDate = (date) => {
      if (!date) return "—";
      const d = date?.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    };

    const isFormComplete = image !== "" && name !== "" && brief !== "" && description !== "" && vacancy !== "" && vehicleId !== "" && startDate !== "" && endDate !== "" && minPrice !== "" && maxPrice !== "" && currency !== "";

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
      <View style={{ flex: 1 }}>
        <TokenExpiryGuard />
        <View style={{ alignItems: "center", backgroundColor: "white" }}>
          <StepBar style={styles.StepBar} currentStep={currentStep} onFirstStepPress={() => setCurrentStep(1)} onSecondStepPress={voyageId ? () => setCurrentStep(2) : null} />
        </View>
        <Modal visible={showPublicProfileModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <ParrotsStdText style={styles.modalTitle}>ℹ️ Public Visibility</ParrotsStdText>
              <ParrotsStdText style={styles.modalText}>
                Your voyage and profile are publicly visible — anyone can view them even if you choose not to show them on the map.
              </ParrotsStdText>
              <TouchableOpacity style={styles.modalBtn} onPress={handleAcknowledge}>
                <ParrotsStdText style={styles.modalBtnText}>Got it</ParrotsStdText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        {hasError && (
          <View style={{ backgroundColor: "white", height: vh(100) }}>
            <View style={{ marginTop: vh(15) }}>
              <Image
                source={require("../assets/parrotslogo.png")}
                style={styles.logoImage}
              />
              <ParrotsStdText style={styles.currentBidsTitle2}>Something went wrong</ParrotsStdText>
              <ParrotsStdText style={styles.currentBidsTitle2}>Swipe down to retry</ParrotsStdText>
              <TouchableOpacity onPress={() => setHasError(false)} style={{ marginTop: vh(2), alignSelf: "center" }}>
                <ParrotsStdText style={{ fontFamily: "Nunito_700Bold", color: parrotBlue, fontSize: 16 }}>Tap to retry</ParrotsStdText>
              </TouchableOpacity>
            </View>
          </View>
        )}


        {currentStep == 1 && !hasError && (
          <View style={{ flex: 1, backgroundColor: parrotCream }}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12, paddingBottom: 16, gap: 10 }}>

              {/* Cover image */}
              <TouchableOpacity onPress={pickProfileImage} activeOpacity={0.8}
                style={{ width: "100%", aspectRatio: 1, backgroundColor: "#fff", borderWidth: 1, borderColor: "#E8E3DC", borderRadius: 16, alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: vh(1), marginTop: vh(0.5) }}>
                {image ? (
                  <Image source={{ uri: image }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                ) : (
                  <Image source={require("../assets/ParrotsLogoPlus.png")} style={{ width: vw(47), height: vh(21), opacity: 0.18 }} resizeMode="contain" />
                )}
              </TouchableOpacity>

              {/* Basics card */}
              <View style={cvStyles.card}>
                <ParrotsStdText style={cvStyles.cardTitle}>Basics</ParrotsStdText>
                <View style={cvStyles.field}>
                  <ParrotsStdText style={cvStyles.label}>Voyage name *</ParrotsStdText>
                  <TextInput style={[cvStyles.input, { height: 42 }]} placeholder="Voyage name (max 30)" placeholderTextColor={parrotPlaceholderGrey} value={name} maxLength={30} onChangeText={setName} />
                  <ParrotsStdText style={cvStyles.charCount}>{name.length} / 30</ParrotsStdText>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <View style={[cvStyles.field, { flex: 1 }]}>
                    <ParrotsStdText style={cvStyles.label}>Vehicle *</ParrotsStdText>
                    <DropdownComponent data={dropdownData} setVehicleId={setVehicleId} vehicleId={vehicleId} />
                  </View>
                  <View style={[cvStyles.field, { width: 84 }]}>
                    <ParrotsStdText style={cvStyles.label}>Spots</ParrotsStdText>
                    <TextInput style={[cvStyles.input, { height: 42 }]} placeholder="0" placeholderTextColor={parrotPlaceholderGrey} value={vacancy} onChangeText={setVacancy} keyboardType="numeric" />
                  </View>
                </View>
              </View>

              {/* Pricing card */}
              <View style={cvStyles.card}>
                <ParrotsStdText style={cvStyles.cardTitle}>Pricing</ParrotsStdText>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity style={{ flex: 1, backgroundColor: isAuction ? "#0A5FBF" : "#F4F7FB", borderRadius: 8, paddingVertical: 10, alignItems: "center", borderWidth: 1.5, borderColor: isAuction ? "#0A5FBF" : "#D8E0E8" }} onPress={() => setIsAuction(!isAuction)}>
                    <ParrotsStdText style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 13, color: isAuction ? "white" : "#3C4A57" }}>Auction</ParrotsStdText>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1, backgroundColor: isFixedPrice ? "#0A5FBF" : "#F4F7FB", borderRadius: 8, paddingVertical: 10, alignItems: "center", borderWidth: 1.5, borderColor: isFixedPrice ? "#0A5FBF" : "#D8E0E8" }} onPress={() => setIsFixedPrice(!isFixedPrice)}>
                    <ParrotsStdText style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 13, color: isFixedPrice ? "white" : "#3C4A57" }}>Fixed price</ParrotsStdText>
                  </TouchableOpacity>
                </View>
                <ParrotsStdText style={[cvStyles.hint, { fontSize: 12 }]}>
                  {isAuction ?
                    "Auction, host selects the most suitable bids." :
                    "Not an auction, host does not select most suitable bids."}{"\n"}
                  {isFixedPrice ?
                    "Fixed price, set by the host." :
                    "Prices not fixed, bidders propose their own price."}
                </ParrotsStdText>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <View style={[cvStyles.field, { flex: 1 }]}>
                    <ParrotsStdText style={cvStyles.label}>Min</ParrotsStdText>
                    <TextInput style={[cvStyles.input, { height: 42 }]} placeholder="0" placeholderTextColor={parrotPlaceholderGrey} value={minPrice} onChangeText={setMinPrice} keyboardType="numeric" />
                  </View>
                  <View style={[cvStyles.field, { flex: 1 }]}>
                    <ParrotsStdText style={cvStyles.label}>Max</ParrotsStdText>
                    <TextInput style={[cvStyles.input, { height: 42 }]} placeholder="0" placeholderTextColor={parrotPlaceholderGrey} value={maxPrice} onChangeText={setMaxPrice} keyboardType="numeric" />
                  </View>
                  <View style={[cvStyles.field, { width: 80 }]}>
                    <ParrotsStdText style={cvStyles.label}>Currency</ParrotsStdText>
                    <DropdownComponentCurrency setCurrency={setCurrency} />
                  </View>
                </View>
              </View>

              {/* Brief card */}
              <View style={cvStyles.card}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ParrotsStdText style={cvStyles.cardTitle}>Brief</ParrotsStdText>
                  <ParrotsStdText style={[cvStyles.charCount, { marginLeft: "auto" }]}>{brief.length} / 300</ParrotsStdText>
                </View>
                <ParrotsStdText style={cvStyles.hint}>A brief that will be visible on voyage cards</ParrotsStdText>
                <TextInput style={[cvStyles.input, { height: 88, paddingTop: 9, textAlignVertical: "top" }]} placeholder="Brief (max 300 characters)" placeholderTextColor={parrotPlaceholderGrey} value={brief} maxLength={300} multiline onChangeText={setBrief} />
              </View>

              {/* Description card */}
              <View style={cvStyles.card}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ParrotsStdText style={cvStyles.cardTitle}>Description</ParrotsStdText>
                  <ParrotsStdText style={[cvStyles.charCount, { marginLeft: "auto" }]}>{description.length} / 10,000</ParrotsStdText>
                </View>
                <ParrotsStdText style={cvStyles.hint}>The route, what to expect, who it suits, etc.</ParrotsStdText>
                <TextInput style={[cvStyles.input, { height: 88, paddingTop: 9, textAlignVertical: "top" }]} placeholder="Description (max 10,000 characters)" placeholderTextColor={parrotPlaceholderGrey} value={description} multiline onChangeText={(text) => setDescription(text.slice(0, 10000))} />
              </View>

              {/* Dates card */}
              <View style={cvStyles.card}>
                <ParrotsStdText style={cvStyles.cardTitle}>Dates</ParrotsStdText>
                <View style={{ borderWidth: 1.5, borderColor: "#D8E0E8", borderRadius: 11, overflow: "hidden", backgroundColor: "white" }}>
                  <CalendarPicker
                    selectedRangeStartTextStyle={styles.startEndText}
                    selectedRangeEndTextStyle={styles.startEndText}
                    selectedRangeStyle={styles.calendarSelected}
                    selectedRangeStartStyle={styles.calendarEndStart}
                    selectedRangeEndStyle={styles.calendarEndStart}
                    selectedDayStyle={styles.calendarEndStart}
                    selectedDayTextStyle={{ color: "white", fontFamily: "Nunito_700Bold" }}
                    selectedDayTextColor="white"
                    selectedColor="blue"
                    textStyle={{ fontFamily: "Nunito_700Bold" }}
                    startFromMonday={true}
                    allowRangeSelection={calendarRangeAllowed}
                    minDate={new Date()}
                    selectedStartDate={startDate}
                    selectedEndDate={endDate}
                    onDateChange={onDateChange}
                    width={vw(86)}
                    customDatesStyles={startDate && !endDate ? [{ date: startDate?.toDate ? startDate.toDate() : startDate, textStyle: { color: "white" } }] : []}
                  />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginTop: 4 }}>
                  <View style={{ flex: 1, backgroundColor: "#E8F1FB", borderRadius: 8, paddingVertical: 7, alignItems: "center" }}>
                    <ParrotsStdText style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 12, color: startDate ? "#0A5FBF" : "rgba(10,95,191,0.3)" }}>{startDate ? formatCalDate(startDate) : "Start date"}</ParrotsStdText>
                  </View>
                  <ParrotsStdText style={{ fontFamily: "Nunito_700Bold", color: "#5A6874" }}>→</ParrotsStdText>
                  <View style={{ flex: 1, backgroundColor: "#E8F1FB", borderRadius: 8, paddingVertical: 7, alignItems: "center" }}>
                    <ParrotsStdText style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 12, color: (endDate || startDate) ? "#0A5FBF" : "rgba(10,95,191,0.3)" }}>{endDate ? formatCalDate(endDate) : startDate ? formatCalDate(startDate) : "End date"}</ParrotsStdText>
                  </View>
                </View>
                {(() => {
                  const rowStyle = { flexDirection: "row", alignItems: "center", gap: 6, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#D8E0E8", marginTop: 4, minHeight: 30 };
                  if (!startDate) return <View style={rowStyle} />;
                  if (!isPublicOnMap) return (
                    <View style={rowStyle}>
                      <Image source={require("../assets/parrotCracker.png")} style={{ width: 14, height: 14 }} />
                      <ParrotsStdText style={{ fontFamily: "Nunito_700Bold", fontSize: 12, color: "#5A6874", flex: 1 }}>No ParrotCrackers will be used if not public on map.</ParrotsStdText>
                    </View>
                  );
                  const today = new Date(); today.setHours(23, 59, 0, 0);
                  const rawEnd = endDate || startDate;
                  const end = new Date(rawEnd?.toDate ? rawEnd.toDate() : rawEnd); end.setHours(23, 59, 0, 0);
                  const cost = Math.max(0, Math.round((end - today) / (1000 * 60 * 60 * 24)) + 1);
                  const balance = crackerBalance?.balance;
                  const notEnough = balance != null && balance < cost;
                  return (
                    <View style={rowStyle}>
                      <Image source={require("../assets/parrotCracker.png")} style={{ width: 14, height: 14 }} />
                      {notEnough ? (
                        <ParrotsStdText style={{ fontFamily: "Nunito_700Bold", fontSize: 12, color: "#dc2626", flex: 1 }}>
                          <ParrotsStdText style={{ fontFamily: "Nunito_800ExtraBold" }}>{cost} ParrotCrackers</ParrotsStdText>{" needed, you have "}{balance ?? "?"}
                        </ParrotsStdText>
                      ) : (
                        <ParrotsStdText style={{ fontFamily: "Nunito_700Bold", fontSize: 12, color: "#1F2933", flex: 1 }}>
                          <ParrotsStdText style={{ fontFamily: "Nunito_800ExtraBold" }}>{cost} ParrotCrackers</ParrotsStdText>{" will be used (balance: "}{balance ?? "?"}{")"}
                        </ParrotsStdText>
                      )}
                    </View>
                  );
                })()}
              </View>

              {/* Visibility card */}
              <View style={cvStyles.card}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <ParrotsStdText style={cvStyles.cardTitle}>Public on the map</ParrotsStdText>
                    <ParrotsStdText style={[cvStyles.hint, { marginTop: 2 }]}>Anyone can find and bid on this voyage.</ParrotsStdText>
                  </View>
                  <TouchableOpacity onPress={() => setIsPublicOnMap(!isPublicOnMap)} style={{ marginLeft: 12 }}>
                    <View style={{ width: 38, height: 22, borderRadius: 999, backgroundColor: isPublicOnMap ? "#2AC898" : "#CFD7DE", justifyContent: "center", padding: 3 }}>
                      <View style={{ width: 16, height: 16, borderRadius: 999, backgroundColor: "white", alignSelf: isPublicOnMap ? "flex-end" : "flex-start", shadowColor: "#000", shadowOpacity: 0.22, shadowRadius: 1, elevation: 2 }} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

            </ScrollView>

            {/* Footer */}
            <View style={{ flexDirection: "row", gap: 8, padding: 12, paddingBottom: 36 + insets.bottom, borderTopWidth: 1, borderTopColor: "#D8E0E8", backgroundColor: parrotCream }}>
              <TouchableOpacity style={{ borderWidth: 1.5, borderColor: "#D8E0E8", backgroundColor: "white", borderRadius: 999, height: 44, paddingHorizontal: 20, alignItems: "center", justifyContent: "center" }} onPress={() => navigation.navigate("Home", { screen: "HomeScreen" })}>
                <ParrotsStdText style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 14, color: "#3C4A57" }}>Cancel</ParrotsStdText>
              </TouchableOpacity>
              {voyageId ? (
                <>
                  {hasChanges && (
                    <TouchableOpacity style={{ borderRadius: 999, height: 44, paddingHorizontal: 20, alignItems: "center", justifyContent: "center", backgroundColor: isUpdatingDetails ? "rgba(10,95,191,0.4)" : "#0A5FBF" }} onPress={handleUpdateDetails} disabled={isUpdatingDetails}>
                      {isUpdatingDetails ? <ActivityIndicator size="small" color="white" /> : <ParrotsStdText style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 14, color: "white" }}>{updateSuccess ? "Saved ✓" : "Save changes"}</ParrotsStdText>}
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={{ flex: 1, borderRadius: 999, height: 44, alignItems: "center", justifyContent: "center", backgroundColor: "#0A5FBF" }} onPress={() => setCurrentStep(2)}>
                    <ParrotsStdText style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 14, color: "white" }}>Next: Images →</ParrotsStdText>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={{ flex: 1, borderRadius: 999, height: 44, alignItems: "center", justifyContent: "center", backgroundColor: isFormComplete && !isCreatingVoyage ? "#0A5FBF" : "rgba(10,95,191,0.4)" }} onPress={isFormComplete && !isCreatingVoyage ? handleCreateVoyage : undefined} disabled={!isFormComplete || isCreatingVoyage}>
                  {isCreatingVoyage ? <ActivityIndicator size="small" color="white" /> : <ParrotsStdText style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 14, color: "white" }}>Create voyage</ParrotsStdText>}
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {!hasError && (
          <ScrollView style={[styles.scrollview, { display: currentStep === 2 ? "flex" : "none" }]}>
            <View style={styles.sectionCard}>
              <View style={styles.cardTitleRow}>
                <ParrotsStdText style={styles.cardTitle}>Voyage Images</ParrotsStdText>
              </View>

              <View style={voyageImagesStyles.voyageImagesContainer2}>
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
                    //keyExtractor={(item) => item.addedVoyageImageId}
                    //keyExtractor={(item) => item.addedVoyageImageId.toString()}
                    // keyExtractor={(item, index) =>
                    //   item.addedVoyageImageId
                    //     ? item.addedVoyageImageId.toString()
                    //     : index.toString()
                    // }

                    keyExtractor={(item, index) =>
                      item.addedVoyageImageId
                        ? item.addedVoyageImageId.toString()
                        : `placeholder-${index}`
                    }

                    renderItem={({ item, index }) => {
                      return (
                        <View /*key={index } */>
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
                              style={voyageImagesStyles.voyageImage1}
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

            </View>

            <CreateVoyageMapComponent
              voyageId={voyageId}
              setCurrentStep={setCurrentStep}
              imagesAdded={addedVoyageImages.length}
              createdVoyageImage={createdVoyageImage}
              voyageName={name}
              startDate={startDate}
              endDate={endDate}
              isPublicOnMap={isPublicOnMap}
              crackerBalance={crackerBalance}
              onVoyagePosted={resetAllFields}
            />

          </ScrollView>
        )}
        {toastVisible && (
          <View style={styles.toast}>
            <ParrotsStdText style={styles.toastText}>{toastMessage}</ParrotsStdText>
          </View>
        )}
      </View>
    );
  }
};

export default CreateVoyageScreen;

const cvStyles = StyleSheet.create({
  card: {
    borderWidth: 1.5, borderColor: "#D8E0E8", borderRadius: 14,
    backgroundColor: "white", padding: 10, gap: 8,
  },
  cardTitle: {
    fontFamily: "Nunito_800ExtraBold", fontSize: 13, color: "#0A5FBF",
  },
  label: {
    fontFamily: "Nunito_800ExtraBold", fontSize: 9, letterSpacing: 1.1,
    textTransform: "uppercase", color: "#5A6874",
  },
  input: {
    fontFamily: "Nunito_700Bold", fontSize: 13, color: "#1F2933",
    backgroundColor: "#F7F9FB", borderWidth: 1.5, borderColor: "#D8E0E8",
    borderRadius: 8, height: 36, paddingHorizontal: 9,
  },
  field: { gap: 3 },
  hint: { fontFamily: "Nunito_700Bold", fontSize: 10.5, color: "#5A6874", lineHeight: 15 },
  charCount: { fontFamily: "Nunito_700Bold", fontSize: 10, color: "#5A6874", alignSelf: "flex-end" },
});

const voyageImagesStyles = StyleSheet.create({
  voyageImagesContainer2: {
    marginTop: vh(1),
    paddingBottom: vh(1),
    width: vw(94),
    alignSelf: "center",
    borderRadius: vh(2),
    flexDirection: "row",
    alignItems: "flex-start",
  },
  voyageImage1: {
    height: vh(15),
    width: vh(15),
    marginRight: vh(1),
    borderRadius: vh(1.5),
  },
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 24,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 18,
    color: parrotBlue,
    marginBottom: 12,
    textAlign: "center",
  },
  modalText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  modalBtn: {
    backgroundColor: parrotBlue,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 36,
  },
  modalBtnText: {
    fontFamily: "Nunito_800ExtraBold",
    color: "white",
    fontSize: 15,
  },
  confirmSummaryCard: {
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    padding: 14,
    width: "100%",
    marginBottom: 14,
    gap: 6,
  },
  confirmSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  confirmSummaryLabel: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
    color: "#6b7280",
  },
  confirmSummaryValue: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
    color: "#1a2e4a",
    flexShrink: 1,
    textAlign: "right",
  },
  confirmPublicNote: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: "#374151",
    marginBottom: 12,
    textAlign: "left",
    width: "100%",
  },
  confirmLockBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    width: "100%",
    marginBottom: 10,
  },
  confirmLockText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: "#92400e",
    flex: 1,
  },
  confirmCrackerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },
  confirmCrackerText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: "#065f46",
  },
  confirmCancelBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmCancelText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: "#6b7280",
  },

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

  submitContainer: {
    alignSelf: "center",
    marginTop: vh(1),
    marginBottom: vh(10),
  },

  selection2: {
    marginHorizontal: vh(0.25),
    marginVertical: vh(0.25),
    paddingVertical: vh(1),
    backgroundColor: parrotBlue,
    borderRadius: vh(4),
    width: vw(50),
    alignItems: "center",
    justifyContent: "center",
  },
  selection2Disabled: {
    marginHorizontal: vh(0.25),
    marginVertical: vh(0.25),
    paddingVertical: vh(1),
    backgroundColor: parrotBlueSemiTransparent,
    borderRadius: vh(4),
    width: vw(50),
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  backgroundImagePlaceholder: {
    width: vw(80),
    height: vh(35),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  calendarStyle: {
    backgroundColor: "white",
    width: vw(86),
    alignSelf: "center",
    marginBottom: vh(1),
    borderRadius: vh(3),
  },
  checkboxText: {
    fontFamily: "Nunito_700Bold",
    color: parrotInputTextColor,
    paddingRight: vw(2),
  },
  auctionFixedPrice: {
    backgroundColor: parrotCream,
    borderRadius: vh(3),
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
    width: vw(64),
  },
  textInput5: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    paddingLeft: vw(1),
    width: "90%",
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
  cardTitleRow: {
    marginHorizontal: vw(2),
    marginBottom: vh(1),
  },
  cardTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
    color: parrotBlue,
  },
  length1: {
    flex: 1,
    height: vh(15),
  },
  length2: {
    flex: 1,
    height: vh(15),
  },
  length3: {
    flex: 1,
    height: vh(15),
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

  startEndText: {
    color: "white",
  },
  calendarSelected: {
    backgroundColor: parrotGreenMediumTransparent,
  },
  calendarEndStart: {
    backgroundColor: parrotGreen,
    color: "white",
  },
  scrollview: {
    height: vh(140),
    marginBottom: vh(5),
    backgroundColor: "white",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: vh(2),
    // marginTop: vh(1),
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
  profileImage2: {
    width: vh(15),
    height: vh(15),
    borderRadius: vh(1.5),
  },
  mainCheckboxContainer: {
    paddingHorizontal: vh(1),
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: vh(0.3),
    backgroundColor: parrotCream,
    borderRadius: vh(3),
  },
  checkboxContainer: {
    flexDirection: "row",
    margin: vh(0.2),
    paddingHorizontal: vw(1),
    paddingVertical: vh(0.5),
    borderRadius: vh(2),
  },
  calendarContainer: {
    borderRadius: vh(3),
    backgroundColor: parrotCream,
    marginBottom: vh(1),
  },
  crackerPill: {
    position: "absolute",
    bottom: -vh(.5),
    // left: vw(2),
    // right: vw(2),
    zIndex: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    borderRadius: 20,
    paddingHorizontal: vw(3),
    paddingVertical: vh(0.8),
    gap: 6,
    flexWrap: "wrap",
    alignSelf: "center",
  },
  crackerPillText: {
    color: parrotInputTextColor,
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
  },
  crackerPillBalance: {
    color: parrotInputTextColor,
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
  },
  formContainer: {
    padding: vh(2),
  },

  backgroundImage: {
    width: vw(80),
    height: vh(35),
    borderRadius: 20,
  },

  icon: {
    padding: 3,
    margin: 2,
    marginLeft: 8,
    borderRadius: 20,
    color: parrotBlue,
    fontSize: 18,
    alignSelf: "center",
  },
  voyageImage: {
    color: parrotBlue,
    fontSize: 13,
    backgroundColor: "white",
    padding: vh(1),
    borderRadius: vh(1),
  },

  voyageDatesContainer: {
    flexDirection: "row",
  },
  voyageDates: {
    fontFamily: "Nunito_700Bold",
    color: parrotInputTextColor,
    fontSize: 13,
    marginVertical: vh(1),
    alignSelf: "flex-start",
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
    fontFamily: "Nunito_700Bold",
    color: "white",
    fontSize: 13,
  },
});
