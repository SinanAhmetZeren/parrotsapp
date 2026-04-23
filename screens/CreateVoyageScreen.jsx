/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
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
} from "react-native";
import { useGetUserByIdQuery } from "../slices/UserSlice";
import {
  useCreateVoyageMutation,
  useAddVoyageImageMutation,
  useDeleteVoyageImageMutation,
  useCheckAndDeleteVoyageMutation,
} from "../slices/VoyageSlice";
import { vh, vw } from "react-native-expo-viewport-units";
import * as ImagePicker from "expo-image-picker";
import {
  MaterialIcons,
  AntDesign,
  Fontisto,
  Feather,
} from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { useAcknowledgePublicProfileMutation, setAcknowledgedPublicProfile } from "../slices/UserSlice";
import CalendarPicker from "react-native-calendar-picker";
import Checkbox from "expo-checkbox";
import DropdownComponent from "../components/DropdownComponent";
import StepBar from "../components/StepBar";
import CreateVoyageMapComponent from "../components/CreateVoyageMapComponent";
import { API_URL } from "@env";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import { parrotBlue, parrotBlueMediumTransparent, parrotBlueSemiTransparent, parrotCream, parrotGreen, parrotGreenMediumTransparent, parrotGreenTransparent, parrotInputTextColor, parrotLightBlue, parrotPlaceholderGrey, parrotTransparentWhite } from "../assets/color";
import DropdownComponentCurrency from "../components/DropdownComponentCurrency";


// Set lastBidDate to startDate for now, 
// since lastBidDate is hidden and not used in the form
const CreateVoyageScreen = ({ navigation }) => {
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
  const [createVoyage] = useCreateVoyageMutation();
  const [addVoyageImage] = useAddVoyageImageMutation();
  const [deleteVoyageImage] = useDeleteVoyageImageMutation();
  const [checkAndDeleteVoyage] = useCheckAndDeleteVoyageMutation();

  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const formattedHours = hours < 10 ? `0${hours}` : hours.toString();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
  const formattedseconds = seconds < 10 ? `0${seconds}` : seconds.toString();
  const timeString = `${formattedHours}:${formattedMinutes}:${formattedseconds}`;



  const getRandomString = (length = 6) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const getRandomNumberString = (min = 1, max = 999) => {
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
  };


  const [name, setName] = useState(getRandomString(6));
  const [brief, setBrief] = useState(getRandomString(8));
  const [description, setDescription] = useState(getRandomString(12));
  const [vacancy, setVacancy] = useState(getRandomNumberString(1, 100));
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [lastBidDate, setLastBidDate] = useState("11/11/2111");
  const [minPrice, setMinPrice] = useState(getRandomNumberString(10, 100));
  const [maxPrice, setMaxPrice] = useState(getRandomNumberString(101, 500));
  const [createdVoyageImage, setCreatedVoyageImage] = useState(null);
  const [isAuction, setIsAuction] = useState(true);
  const [isFixedPrice, setIsFixedPrice] = useState(true);
  const [isPublicOnMap, setIsPublicOnMap] = useState(true);
  const [vehicleId, setVehicleId] = useState("");
  const [currency, setCurrency] = useState("");
  const [voyageId, setVoyageId] = useState("");
  const [image, setImage] = useState("");
  const [voyageImage, setVoyageImage] = useState(null);
  const [addedVoyageImages, setAddedVoyageImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isCreatingVoyage, setIsCreatingVoyage] = useState(0);
  const [calendarRangeAllowed, setCalendarRangeAllowed] = useState(false);

  const [hasError, setHasError] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  useEffect(() => { }, [startDate, endDate, lastBidDate, voyageImage]);

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

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (voyageId) {
          checkAndDeleteVoyage(voyageId);
          setCurrentStep(1);
          setName("");
        }
      };
    }, [voyageId])
  );

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
      const formattedStartDate = convertDateFormat(startDate);
      const formattedEndDate = endDate
        ? convertDateFormat(endDate)
        : convertDateFormat(startDate);
      // const formattedLastBidDate = convertDateFormat_LastBidDate(lastBidDate);
      const formattedLastBidDate = formattedStartDate;


      setIsCreatingVoyage(true);
      const response = await createVoyage({
        formData,
        name,
        brief,
        description,
        vacancy,
        formattedStartDate,
        formattedEndDate,
        formattedLastBidDate,
        minPrice,
        maxPrice,
        isAuction,
        isFixedPrice,
        isPublicOnMap,
        userId,
        vehicleId,
        currency
      });
      if (response.error || !response.data?.data?.id) {
        setIsCreatingVoyage(false);
        setHasError(true);
        return;
      }
      const createdVoyageId = response.data.data.id;
      setCreatedVoyageImage(image);
      setVoyageId(createdVoyageId);
      setName("");
      setBrief("");
      setDescription("");
      setVacancy("");
      setStartDate("");
      setEndDate("");
      setLastBidDate("");
      setMinPrice("");
      setMaxPrice("");
      setIsAuction("");
      setIsFixedPrice("");
      setIsPublicOnMap("");
      setVehicleId("");
      setCurrency("");
      setImage("");
      setVoyageImage("");
      setAddedVoyageImages("");

      setCurrentStep(2);
    } catch (error) {
      console.error("Error uploading image", error);
      setHasError(true)
    }
    setIsCreatingVoyage(false);
  };

  const handleUploadImage = async () => {
    if (isUploadingImage) return;
    if (!voyageImage) {
      return;
    }

    const formData = new FormData();
    formData.append("imageFile", {
      uri: voyageImage,
      type: "image/jpeg",
      name: "profileImage.jpg",
    });

    console.log("voyage image: ", voyageImage);
    setIsUploadingImage(true);
    try {
      const addedVoyageResponse = await addVoyageImage({
        formData,
        voyageId,
      });

      if (addedVoyageResponse.error || !addedVoyageResponse.data?.imagePath) {
        showToast("Image upload failed - Check your connection and try again.");
        return;
      }
      const addedVoyageImageId = addedVoyageResponse.data.imagePath;
      const newItem = {
        addedVoyageImageId,
        voyageImage,
      };
      setAddedVoyageImages((prevImages) => [...prevImages, newItem]);
      setVoyageImage(null);
    } catch (error) {
      console.error("Error uploading image", error);
      Toast.show({ type: "error", text1: "Image upload failed", text2: "Check your connection and try again.", autoHide: true, visibilityTime: 3000 });
    }
    setIsUploadingImage(false);
  };

  const pickProfileImage = async () => {
    // console.log("pickProfileImage called");
    // console.log("voyageimage", voyageImage);
    // console.log("image", image);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });
    console.log("result-> ", result.assets[0].uri);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickVoyageImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      //aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setVoyageImage(result.assets[0].uri);
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
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      console.log("-->>", date);
      setEndDate(null);
      setCalendarRangeAllowed(false);
    } else {
      if (date >= startDate) {
        setCalendarRangeAllowed(true);
        setEndDate(date);
      } else {
        setStartDate(date);
        setEndDate(null);
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
        <Text style={styles.currentBidsTitle2}>Something went wrong</Text>
        <Text style={styles.currentBidsTitle2}>Swipe down to retry</Text>
        <TouchableOpacity onPress={refetch} style={{ marginTop: vh(2) }}>
          <Text style={{ fontFamily: "Nunito_700Bold", color: parrotBlue }}>Tap to retry</Text>
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
      userData.usersVehicles.map((vehicle) => ({
        label: vehicle.name,
        value: vehicle.id,
      }))
    );

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
        <StepBar style={styles.StepBar} currentStep={currentStep} />
        <Modal visible={showPublicProfileModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>ℹ️ Public Visibility</Text>
              <Text style={styles.modalText}>
                Your voyage and profile are publicly visible — anyone can view them even if you choose not to show them on the map.
              </Text>
              <TouchableOpacity style={styles.modalBtn} onPress={handleAcknowledge}>
                <Text style={styles.modalBtnText}>Got it</Text>
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
              <Text style={styles.currentBidsTitle2}>Something went wrong</Text>
              <Text style={styles.currentBidsTitle2}>Swipe down to retry</Text>
              <TouchableOpacity onPress={() => setHasError(false)} style={{ marginTop: vh(2), alignSelf: "center" }}>
                <Text style={{ fontFamily: "Nunito_700Bold", color: parrotBlue, fontSize: 16 }}>Tap to retry</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}


        {currentStep == 1 && !hasError && (
          <ScrollView style={styles.scrollview}>

            {/* Card 1: Cover Image */}
            <View style={styles.sectionCard}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle}>Profile Image</Text>
              </View>
              <View style={styles.profileContainer}>
                <TouchableOpacity onPress={pickProfileImage}>
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={styles.backgroundImage}
                    />
                  ) : (
                    <Image
                      source={require("../assets/ParrotsLogoPlus.png")}
                      style={styles.backgroundImagePlaceholder}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Card 2: Voyage Details */}
            <View style={styles.sectionCard}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle}>Voyage Details</Text>
              </View>
              <View style={styles.formContainer}>

                {/* /// name /// */}
                <View style={styles.latLngNameRow}>
                  <View style={styles.latLngLabel}>
                    <Text style={styles.latorLngtxt}>Name:</Text>
                  </View>
                  <View style={styles.latorLng}>
                    <TextInput
                      style={styles.textInput5}
                      placeholder="Enter voyage name"
                      placeholderTextColor={parrotPlaceholderGrey}
                      value={name}
                      maxLength={50}
                      onChangeText={(text) => setName(text)}
                    />
                  </View>
                </View>
                {/* /// name  /// */}

                {/* /// brief /// */}
                <View style={styles.latLngNameRow}>
                  <View style={styles.latLngLabel}>
                    <Text style={styles.latorLngtxt}>Brief:</Text>
                  </View>
                  <View style={styles.latorLng}>
                    <TextInput
                      style={styles.textInput5}
                      placeholder="Enter voyage brief"
                      placeholderTextColor={parrotPlaceholderGrey}
                      value={brief}
                      multiline
                      numberOfLines={5}
                      maxLength={135}
                      onChangeText={(text) => setBrief(text)}
                    />
                  </View>
                </View>
                {/* /// brief  /// */}

                {/* /// DESC /// */}
                <View style={styles.latLngNameRow}>
                  <View style={styles.latLngLabel}>
                    <Text style={styles.latorLngtxt}>Description:</Text>
                  </View>
                  <View style={styles.latorLng}>
                    <TextInput
                      style={[styles.textInput5, { minHeight: vh(12), textAlignVertical: "top" }]}
                      multiline
                      placeholder="Enter voyage description"
                      placeholderTextColor={parrotPlaceholderGrey}
                      value={description}
                      onChangeText={(text) => setDescription(text)}
                    />
                  </View>
                </View>
                {/* /// DESC  /// */}

                {/* /// VACANCY /// */}
                <View style={styles.latLngNameRow}>
                  <View style={styles.latLngLabel}>
                    <Text style={styles.latorLngtxt}>Vacancy:</Text>
                  </View>
                  <View style={styles.latorLng}>
                    <TextInput
                      style={styles.textInput5}
                      placeholder="Enter voyage vacancy"
                      placeholderTextColor={parrotPlaceholderGrey}
                      value={vacancy}
                      onChangeText={(text) => setVacancy(text)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                {/* /// VACANCY /// */}

                {/* /// vehicle /// */}
                <View style={styles.latLngNameRow}>
                  <View style={styles.latLngLabel}>
                    <Text style={styles.latorLngtxt}>Vehicle:</Text>
                  </View>
                  <View style={styles.latorLng}>
                    <DropdownComponent
                      data={dropdownData}
                      setVehicleId={setVehicleId}
                    />
                  </View>
                </View>
                {/* /// vehicle /// */}

              </View>
            </View>

            {/* Card 3: Voyage Dates */}
            <View style={styles.sectionCard}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle}>Voyage Dates</Text>
              </View>
              <View style={styles.formContainer}>
                <View style={styles.calendarContainer}>
                  <View style={styles.voyageDatesContainer}>
                    <Feather
                      style={styles.icon}
                      name="calendar"
                      size={24}
                      color="blue"
                    />
                    <Text style={styles.voyageDates}>
                      Select Voyage Date(s)
                    </Text>
                  </View>

                  <View style={styles.calendarStyle}>
                    <CalendarPicker
                      selectedRangeStartTextStyle={styles.startEndText}
                      selectedRangeEndTextStyle={styles.startEndText}
                      selectedRangeStyle={styles.calendarSelected}
                      selectedRangeStartStyle={styles.calendarEndStart}
                      selectedRangeEndStyle={styles.calendarEndStart}
                      selectedDayStyle={styles.calendarEndStart}
                      selectedColor={"blue"}
                      textStyle={{ fontFamily: "Nunito_700Bold" }}
                      startFromMonday={true}
                      allowRangeSelection={calendarRangeAllowed}
                      minDate={new Date()}
                      selectedStartDate={startDate}
                      selectedEndDate={endDate}
                      onDateChange={onDateChange}
                      width={300}
                    />
                  </View>
                </View>

                {/* /// LAST BID DATE /// */}
                <View style={{ ...styles.latLngNameRow, display: "none" }}>
                  <View style={styles.latLngLabel}>
                    <Text style={styles.latorLngtxt}>Last Bid:</Text>
                  </View>
                  <View style={styles.latorLng}>
                    <TextInput
                      style={styles.textInput5}
                      value={lastBidDate}
                      onChangeText={handleDateChange}
                      keyboardType="numeric"
                      placeholder="MM/DD/YYYY"
                      placeholderTextColor={parrotPlaceholderGrey}
                      maxLength={10}
                    />
                  </View>
                </View>
                {/* /// LAST BID DATE /// */}

              </View>
            </View>

            {/* Card 4: Pricing & Options */}
            <View style={styles.sectionCard}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle}>Pricing & Options</Text>
              </View>
              <View style={styles.formContainer}>
                {/* /// MIN PRICE /// */}
                <View style={styles.latLngNameRow}>
                  <View style={styles.latLngLabel}>
                    <Text style={styles.latorLngtxt}>Min Price:</Text>
                  </View>
                  <View style={styles.latorLng}>
                    <TextInput
                      style={styles.textInput5}
                      maxLength={20}
                      placeholder="Enter Min Price"
                      placeholderTextColor={parrotPlaceholderGrey}
                      value={minPrice}
                      onChangeText={(text) => setMinPrice(text)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                {/* /// MIN PRICE /// */}

                {/* /// MAX PRICE /// */}
                <View style={styles.latLngNameRow}>
                  <View style={styles.latLngLabel}>
                    <Text style={styles.latorLngtxt}>Max Price:</Text>
                  </View>
                  <View style={styles.latorLng}>
                    <TextInput
                      style={styles.textInput5}
                      maxLength={20}
                      placeholder="Enter Max Price"
                      placeholderTextColor={parrotPlaceholderGrey}
                      value={maxPrice}
                      onChangeText={(text) => setMaxPrice(text)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>



                {/* /// vehicle /// */}
                <View style={styles.latLngNameRow}>
                  <View style={styles.latLngLabel}>
                    <Text style={styles.latorLngtxt}>Currency:</Text>
                  </View>
                  <View style={styles.latorLng}>
                    <DropdownComponentCurrency setCurrency={setCurrency} />
                  </View>
                </View>
                {/* /// vehicle /// */}


                {/* /// auction fixedprice  /// */}
                <View style={styles.auctionFixedPrice}>
                  <View style={styles.mainCheckboxContainer}>
                    <View style={styles.checkboxContainer}>
                      <Text style={styles.checkboxText}>Auction </Text>
                      <View>
                        <Checkbox
                          value={isAuction}
                          onValueChange={setIsAuction}
                          color={
                            isAuction ? "rgba(0, 119, 234,0.9)" : undefined
                          }
                          style={{
                            borderColor: parrotBlue,
                            borderWidth: 2,
                          }}
                        />
                      </View>
                    </View>

                    <View style={styles.checkboxContainer}>
                      <Text style={styles.checkboxText}>FixedPrice </Text>
                      <View>
                        <Checkbox
                          value={isFixedPrice}
                          onValueChange={setIsFixedPrice}
                          color={
                            isFixedPrice ? "rgba(0, 119, 234,0.9)" : undefined
                          }
                          style={{
                            borderColor: parrotBlue,
                            borderWidth: 2,
                          }}
                        />
                      </View>
                    </View>

                    <View style={styles.checkboxContainer}>
                      <Text style={styles.checkboxText}>Public Voyage </Text>
                      <View>
                        <Checkbox
                          value={isPublicOnMap}
                          onValueChange={setIsPublicOnMap}
                          color={
                            isPublicOnMap ? "rgba(0, 119, 234,0.9)" : undefined
                          }
                          style={{
                            borderColor: parrotBlue,
                            borderWidth: 2,
                          }}

                        />
                      </View>
                    </View>

                  </View>
                </View>
                {/* /// auction fixedprice  /// */}

              </View>
            </View>

            <View style={styles.loginContainer}>
              {isCreatingVoyage ? (
                <View>
                  <ActivityIndicator
                    size="large"
                    style={{ top: vh(2) }}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => handleCreateVoyage()}
                  style={
                    image === "" ||
                      name === "" ||
                      brief === "" ||
                      description === "" ||
                      vacancy === "" ||
                      vehicleId === "" ||
                      startDate === "" ||
                      endDate === "" ||
                      lastBidDate === "" ||
                      minPrice === "" ||
                      maxPrice === "" ||
                      currency === ""
                      ? styles.selection2Disabled
                      : styles.selection2
                  }
                  disabled={false}
                >
                  <Text style={styles.loginText}>Create Voyage</Text>
                </TouchableOpacity>
              )}
            </View>

          </ScrollView>
        )}

        {currentStep === 2 && !hasError && (
          <ScrollView style={styles.scrollview}>
            <View style={styles.sectionCard}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle}>Add Voyage Images</Text>
              </View>

              <View style={voyageImagesStyles.voyageImagesContainer2}>
                <View style={styles.profileContainer2}>
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
                          source={require("../assets/ParrotsLogoPlus.png")}
                          style={styles.profileImage2}
                        />
                      )}
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
                                  : require("../assets/placeholder.png")
                              }
                              style={voyageImagesStyles.voyageImage1}
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
              </View>

              {voyageImage ? (
                <View style={styles.addVoyageImageButton}>
                  <TouchableOpacity onPress={() => handleUploadImage()}>
                    <AntDesign name="cloud-upload" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            <CreateVoyageMapComponent
              voyageId={voyageId}
              setCurrentStep={setCurrentStep}
              imagesAdded={addedVoyageImages.length}
              createdVoyageImage={createdVoyageImage}
            />

          </ScrollView>
        )}
        {toastVisible && (
          <View style={styles.toast}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}
      </View>
    );
  }
};

export default CreateVoyageScreen;

const voyageImagesStyles = StyleSheet.create({
  voyageImagesContainer2: {
    marginTop: vh(1),
    paddingBottom: vh(1),
    width: vw(94),
    alignSelf: "center",
    borderRadius: vh(2),
  },
  voyageImage1: {
    height: vh(13),
    width: vh(13),
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

  loginContainer: {
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
  },
  selection2Disabled: {
    marginHorizontal: vh(0.25),
    marginVertical: vh(0.25),
    paddingVertical: vh(1),
    backgroundColor: parrotBlueSemiTransparent,
    borderRadius: vh(4),
    width: vw(50),
  },
  loginText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  backgroundImagePlaceholder: {
    width: vw(80),
    height: vh(35),
    alignSelf: "center",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: vh(2),
    marginTop: vh(1),
    borderRadius: vh(1.5),
  },

  profileImage: {
    marginLeft: vw(3),
    marginRight: vh(1),
    marginBottom: vh(3),
    width: vh(20),
    height: vh(20),
    borderRadius: vh(3),

  },
  profileImage2: {
    marginBottom: vh(2),
    width: vh(20),
    height: vh(20),
    borderRadius: vh(3),
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
