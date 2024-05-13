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
} from "react-native";
import { useGetUserByIdQuery } from "../slices/UserSlice";
import {
  useCreateVoyageMutation,
  useAddVoyageImageMutation,
  useDeleteVoyageImageMutation,
} from "../slices/VoyageSlice";
import { vh, vw } from "react-native-expo-viewport-units";
import * as ImagePicker from "expo-image-picker";
import {
  MaterialIcons,
  AntDesign,
  Fontisto,
  Feather,
} from "@expo/vector-icons";
import { useSelector } from "react-redux";
import CalendarPicker from "react-native-calendar-picker";
import Checkbox from "expo-checkbox";
import DropdownComponent from "../components/DropdownComponent";
import StepBar from "../components/StepBar";
import CreateVoyageMapComponent from "../components/CreateVoyageMapComponent";

const CreateVoyageScreen = () => {
  const userId = useSelector((state) => state.users.userId);
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

  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const formattedHours = hours < 10 ? `0${hours}` : hours.toString();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
  const formattedseconds = seconds < 10 ? `0${seconds}` : seconds.toString();
  const timeString = `${formattedHours}:${formattedMinutes}:${formattedseconds}`;

  const [name, setName] = useState("Aaa");
  const [brief, setBrief] = useState("Aaa");
  const [description, setDescription] = useState("Aaa");
  const [vacancy, setVacancy] = useState("10");
  const [startDate, setStartDate] = useState("2024-03-14T09:00:00.000Z");
  const [endDate, setEndDate] = useState("2024-03-15T09:00:00.000Z");
  const [lastBidDate, setLastBidDate] = useState("11/11/1111");
  const [minPrice, setMinPrice] = useState("11");
  const [maxPrice, setMaxPrice] = useState("11");
  const [isAuction, setIsAuction] = useState(true);
  const [isFixedPrice, setIsFixedPrice] = useState(true);
  const [vehicleId, setVehicleId] = useState("");
  const [voyageId, setVoyageId] = useState("");
  const [image, setImage] = useState("");
  const [voyageImage, setVoyageImage] = useState(null);
  const [addedVoyageImages, setAddedVoyageImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {}, [startDate, endDate, lastBidDate, voyageImage]);

  const changeCurrentState = (index) => {
    setCurrentStep(index);
  };

  function convertDateFormat(inputDate) {
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
      const formattedEndDate = convertDateFormat(endDate);
      const formattedLastBidDate = convertDateFormat_LastBidDate(lastBidDate);

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
        userId,
        vehicleId,
      });
      const createdVoyageId = response.data.data.id;
      setVoyageId(createdVoyageId);
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
      setVehicleId("");
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
      const addedVoyageResponse = await addVoyageImage({
        formData,
        voyageId,
      });

      const addedVoyageImageId = addedVoyageResponse.data.imagePath;
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

  const handleNextPage = () => {
    setCurrentStep(3);
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
      setEndDate(null);
    } else {
      if (date >= startDate) {
        setEndDate(date);
      } else {
        setStartDate(date);
        setEndDate(null);
      }
    }
  };

  const handleDeleteImage = (imageId) => {
    deleteVoyageImage(imageId);
    setAddedVoyageImages((prevImages) =>
      prevImages.filter((item) => item.addedVoyageImageId !== imageId)
    );
  };

  if (isSuccess) {
    const profileImageUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/UserImages/${userData.profileImageUrl}`;

    const dropdownData = [
      { label: "Walk", value: 63 },
      { label: "Run", value: 64 },
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
      <>
        <StepBar style={styles.StepBar} currentStep={currentStep} />
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
                      // source={{ uri: profileImageUrl }}
                      source={require("../assets/ParrotsWhiteBgPlus.png")}
                      style={styles.backgroundImagePlaceholder}
                    />
                  )}
                </TouchableOpacity>
                {/* Your other UI elements */}
              </View>

              <View style={styles.profileImageAndSocial}>
                <View style={styles.formContainer}>
                  {/* Username */}

                  {/* /// name /// */}
                  <View style={styles.latLngNameRow}>
                    <View style={styles.latLngLabel}>
                      <Text style={styles.latorLngtxt}>Name:</Text>
                    </View>
                    <View style={styles.latorLng}>
                      <TextInput
                        style={styles.textInput5}
                        placeholder="Enter voyage name"
                        placeholderTextColor="#c3c3c3"
                        value={name}
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
                        placeholderTextColor="#c3c3c3"
                        value={brief}
                        multiline
                        numberOfLines={5}
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
                        style={styles.textInput5}
                        multiline
                        placeholder="Enter voyage description"
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
                      <Text style={styles.latorLngtxt}>Vacancy:</Text>
                    </View>
                    <View style={styles.latorLng}>
                      <TextInput
                        style={styles.textInput5}
                        placeholder="Enter voyage vacancy"
                        placeholderTextColor="#c3c3c3"
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

                  <View style={styles.calendarContainer}>
                    <View style={styles.voyageDatesContainer}>
                      <Feather
                        style={styles.icon}
                        name="calendar"
                        size={24}
                        color="blue"
                      />
                      <Text style={styles.voyageDates}>
                        Select Voyage Dates
                      </Text>
                    </View>

                    <View style={styles.calendarStyle}>
                      <CalendarPicker
                        selectedRangeStartTextStyle={styles.startEndText}
                        selectedRangeEndTextStyle={styles.startEndText}
                        selectedRangeStyle={styles.calendarSelected}
                        selectedRangeStartStyle={styles.calendarEndStart}
                        selectedRangeEndStyle={styles.calendarEndStart}
                        selectedColor={"blue"}
                        startFromMonday={true}
                        allowRangeSelection={true}
                        minDate={new Date()}
                        selectedStartDate={startDate}
                        selectedEndDate={endDate}
                        onDateChange={onDateChange}
                        width={300}
                      />
                    </View>
                  </View>

                  {/* /// LAST BID DATE /// */}
                  <View style={styles.latLngNameRow}>
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
                        placeholderTextColor="#c3c3c3"
                        maxLength={10}
                      />
                    </View>
                  </View>
                  {/* /// LAST BID DATE /// */}

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
                        placeholderTextColor="#c3c3c3"
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
                        placeholderTextColor="#c3c3c3"
                        value={maxPrice}
                        onChangeText={(text) => setMaxPrice(text)}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

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
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                  {/* /// auction fixedprice  /// */}

                  <View style={styles.loginContainer}>
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
                        maxPrice === ""
                          ? styles.selection2Disabled
                          : styles.selection2
                      }
                      disabled={false}
                    >
                      <Text style={styles.loginText}>Create Voyage</Text>
                    </TouchableOpacity>
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
                <Text style={styles.selectedText}>Add Voyage Images</Text>
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
                      source={require("../assets/ParrotsWhiteBgPlus.png")}
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
                  keyExtractor={(item) => item.addedVoyageImageId}
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
            </View>

            <View style={styles.addWaypoints}>
              <Text style={styles.selectedText}>Add Waypoints</Text>
            </View>
            <CreateVoyageMapComponent
              voyageId={voyageId}
              setCurrentStep={setCurrentStep}
            />
          </ScrollView>
        ) : null}

        {currentStep == 3 ? (
          <View
            style={{
              top: vh(5),
              backgroundColor: "purple",
            }}
          >
            <ScrollView
              style={{
                backgroundColor: "white",
              }}
            >
              <CreateVoyageMapComponent
                voyageId={voyageId}
                setCurrentStep={setCurrentStep}
              />
            </ScrollView>
          </View>
        ) : null}
      </>
    );
  }
};

export default CreateVoyageScreen;

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
  loginContainer: {
    alignSelf: "center",
    marginTop: vh(1),
  },

  selection2: {
    marginHorizontal: vh(0.25),
    marginVertical: vh(0.25),
    paddingVertical: vh(1),
    backgroundColor: "rgb(24,111,241)",
    borderRadius: vh(1.5),
    width: vw(50),
  },
  selection2Disabled: {
    marginHorizontal: vh(0.25),
    marginVertical: vh(0.25),
    paddingVertical: vh(1),
    backgroundColor: "rgba(24,111,241,.3)",
    borderRadius: vh(1.5),
    width: vw(50),
  },
  loginText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    textAlign: "center",
  },
  backgroundImagePlaceholder: {
    width: vw(50),
    height: vh(30),
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
    color: "rgba(24,111,241,0.5)",
    fontSize: 18,
    fontWeight: "700",
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
    // backgroundColor: "rgba(10, 11, 211,0.16)",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: vh(2),
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
  backgroundImage: {
    width: vw(100),
    height: vh(30),
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
    backgroundColor: "green",
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
