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

  const [name, setName] = useState("Island Breezes Expedition");
  const [brief, setBrief] = useState(
    "The Island Breezes Expedition beckons, a tranquil sailboat voyage designed for camaraderie and natural wonders. Join your friends on an odyssey embracing the open seas and secluded islands. This voyage invites you to witness nature's spectacle and find serenity in the rhythmic embrace of wind and waves."
  );
  const voyageDes = `Embark on the "Island Breeze", a meticulously planned sailboat expedition offering a seamless blend of adventure and repose. Departing from a quaint harbor, your journey unfolds along the coastline, where the wind becomes your guide, and the sunsets paint the horizon in hues of tranquility.

  Waypoints:
  1. Harbor Haven (Starting Point): Begin your journey from Harbor Haven, a haven for sailors, echoing with tales of the sea and the promise of exploration.
  2. Open Waters Gateway: Navigate through the Open Waters Gateway, a vast expanse offering panoramic views and the gentle embrace of the open sea.
  3. Sunset Archipelago: Anchor at Sunset Archipelago, where islands glow with the warm hues of twilight, providing the perfect setting for shared stories under the starlit sky.
  4. Whale Watch Cove: Sail to Whale Watch Cove, renowned for encounters with marine wonders. Marvel at playful dolphins and the majestic presence of whales.
  5. Hidden Lagoon Oasis: Set course for the Hidden Lagoon Oasis, a secluded paradise surrounded by lush landscapes and pristine waters, inviting moments of peaceful reflection.
  6. Island Village Exploration: Dock at an Island Village, immersing yourself in local culture and savoring authentic cuisine, forging connections with the welcoming islanders.
  7. Trade Winds Passage: Navigate the Trade Winds Passage, allowing the winds to carry you effortlessly towards the next captivating destination, embodying a sense of boundless freedom.
  8. Reef Guardian Sanctuary: Discover the Reef Guardian Sanctuary, an underwater haven boasting vibrant coral reefs and diverse marine life, inviting exploration beneath the surface.
  9. Final Destination - Tranquil Harbor: Conclude your expedition at Tranquil Harbor, a serene retreat where the memories of the voyage linger, offering a final opportunity for quiet reflection.
  `;

  const [description, setDescription] = useState(voyageDes);
  const [vacancy, setVacancy] = useState("15");
  const [startDate, setStartDate] = useState("2024-03-14T09:00:00.000Z");
  const [endDate, setEndDate] = useState("2024-03-15T09:00:00.000Z");
  const [lastBidDate, setLastBidDate] = useState("11/11/1111");
  const [minPrice, setMinPrice] = useState("100");
  const [maxPrice, setMaxPrice] = useState("120");
  const [isAuction, setIsAuction] = useState(true);
  const [isFixedPrice, setIsFixedPrice] = useState(true);
  const [vehicleId, setVehicleId] = useState("3");
  const [voyageId, setVoyageId] = useState("");
  const [image, setImage] = useState(
    "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fparrots-11d9acbc-8e32-4b9c-b537-94d439bcffb0/ImagePicker/aad9496c-c258-4ce9-b64b-78e20f5bf2fe.jpeg"
  );
  const [voyageImage, setVoyageImage] = useState(null);
  const [addedVoyageImages, setAddedVoyageImages] = useState([]);

  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    console.log("---");
  }, [isSuccess]);

  useEffect(() => {}, [startDate, endDate, lastBidDate, voyageImage]);

  const printState = () => {
    console.log("----------");
    console.log("name:", name);
    console.log("brief:", brief);
    console.log("description:", description);
    console.log("vacancy:", vacancy);
    console.log("startDate:", startDate);
    console.log("endDate:", endDate);
    console.log("lastBidDate:", lastBidDate);
    console.log("minPrice:", minPrice);
    console.log("maxPrice:", maxPrice);
    console.log("isAuction:", isAuction);
    console.log("isFixedPrice:", isFixedPrice);
    console.log("image", image);
    console.log("voyageId", voyageId);
    console.log("vehicleId", vehicleId);
    console.log("----------");
  };

  const printState2 = () => {
    console.log("----------");
    console.log("voyage image:", voyageImage);
    console.log("added images:", addedVoyageImages);
    console.log("voyage Id: ", voyageId);
    console.log("----------");
  };

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
      // setVoyageId("");
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
    console.log("image id to delete", imageId);
    deleteVoyageImage(imageId);
    setAddedVoyageImages((prevImages) =>
      prevImages.filter((item) => item.addedVoyageImageId !== imageId)
    );
  };

  const printState5 = () => {
    console.log("added voyage images: ");
    console.log(addedVoyageImages);
  };

  if (isSuccess) {
    const profileImageUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/UserImages/${userData.profileImageUrl}`;
    const dropdownData = userData.usersVehicles.map((vehicle) => ({
      label: vehicle.name,
      value: vehicle.id,
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
        <StepBar style={styles.StepBar} currentStep={currentStep} />
        {currentStep == 1 ? (
          <ScrollView style={styles.scrollview}>
            <View style={styles.overlay}>
              <View style={styles.profileContainer}>
                <TouchableOpacity onPress={pickProfileImage}>
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <Image
                      // source={{ uri: profileImageUrl }}
                      source={require("../assets/placeholder.png")}
                      style={styles.profileImage}
                    />
                  )}
                </TouchableOpacity>
                {/* Your other UI elements */}
              </View>

              <View style={styles.formContainer}>
                {/* Username */}

                <View style={styles.socialBox}>
                  <Feather
                    style={styles.icon}
                    name="user"
                    size={24}
                    color="black"
                  />
                  <Text style={styles.inputDescription}>Voyage name</Text>

                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter voyage name"
                    value={name}
                    onChangeText={(text) => setName(text)}
                  />
                </View>

                <View style={styles.socialBox}>
                  <Fontisto
                    style={styles.icon}
                    name="email"
                    size={24}
                    color="black"
                  />
                  <Text style={styles.inputDescription}>Brief</Text>
                  <TextInput
                    placeholder="Enter voyage brief"
                    value={brief}
                    multiline
                    numberOfLines={5}
                    onChangeText={(text) => setBrief(text)}
                    style={styles.textDescriptionInput}
                  />
                </View>

                {/* Phone Number */}
                <View style={styles.socialBox}>
                  <Feather
                    style={styles.icon}
                    name="phone"
                    size={24}
                    color="black"
                  />
                  <Text style={styles.inputDescription}>Description</Text>

                  <TextInput
                    style={styles.textDescriptionInput}
                    multiline
                    placeholder="Enter voyage description"
                    numberOfLines={8}
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                  />
                </View>

                {/* Facebook Profile */}
                <View style={styles.socialBox}>
                  <Feather
                    style={styles.icon}
                    name="facebook"
                    size={24}
                    color="black"
                  />
                  <Text style={styles.inputDescription}>Vacancy</Text>

                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter voyage vacancy"
                    value={vacancy}
                    onChangeText={(text) => setVacancy(text)}
                    keyboardType="numeric"
                  />
                </View>

                <DropdownComponent
                  data={dropdownData}
                  label={"Select Vehicle"}
                  setVehicleId={setVehicleId}
                />

                <View style={styles.calendarContainer}>
                  <View style={styles.voyageDatesContainer}>
                    <Feather
                      style={styles.icon}
                      name="calendar"
                      size={24}
                      color="blue"
                    />
                    <Text style={styles.voyageDates}>Select Voyage Dates</Text>
                  </View>

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

                <View style={styles.socialBox}>
                  <Feather
                    style={styles.icon}
                    name="calendar"
                    size={24}
                    color="blue"
                  />
                  <Text style={styles.inputDescription}>Last Bid Date</Text>

                  <TextInput
                    style={styles.textInput}
                    value={lastBidDate}
                    onChangeText={handleDateChange}
                    keyboardType="numeric"
                    placeholder="MM/DD/YYYY" // Placeholder without hyphens
                    maxLength={10} // Restrict length for proper date format
                  />
                </View>

                {/* min price */}
                <View style={styles.socialBox}>
                  <Feather
                    style={styles.icon}
                    name="facebook"
                    size={24}
                    color="black"
                  />
                  <Text style={styles.inputDescription}>Min Price</Text>

                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter Min Price"
                    value={minPrice}
                    onChangeText={(text) => setMinPrice(text)}
                    keyboardType="numeric"
                  />
                </View>

                {/* max price */}
                <View style={styles.socialBox}>
                  <Feather
                    style={styles.icon}
                    name="facebook"
                    size={24}
                    color="black"
                  />
                  <Text style={styles.inputDescription}>Max Price</Text>

                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter Min Price"
                    value={maxPrice}
                    onChangeText={(text) => setMaxPrice(text)}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.mainCheckboxContainer}>
                  <View style={styles.checkboxContainer}>
                    <Text>Auction </Text>
                    <View>
                      <Checkbox
                        value={isAuction}
                        onValueChange={setIsAuction}
                        color={isAuction ? "#4630EB" : undefined}
                      />
                    </View>
                  </View>

                  <View style={styles.checkboxContainer}>
                    <Text>FixedPrice </Text>
                    <View>
                      <Checkbox
                        value={isFixedPrice}
                        onValueChange={setIsFixedPrice}
                        color={isFixedPrice ? "#4630EB" : undefined}
                      />
                    </View>
                  </View>
                </View>

                {/* Save Button */}
                <View style={styles.createVoyageButton}>
                  <Button
                    title="Create Voyage"
                    onPress={() => handleCreateVoyage()}
                  />
                </View>

                <View style={styles.refetch}>
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
                  keyExtractor={(item) => item.addedVoyageImageId}
                  renderItem={({ item, index }) => {
                    console.log("index: ", index);
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

              {/* <View style={styles.refetch}> */}
              <View style={{ display: "none" }}>
                <Button
                  title="print state 2"
                  onPress={() => {
                    printState2();
                  }}
                />
              </View>
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

const styles3 = StyleSheet.create({
  WayPointsScreen: {
    top: vh(5),
    backgroundColor: "green",
  },
});
const styles2 = StyleSheet.create({
  modalWrappeer: {
    position: "absolute",
    top: 0,
    // backgroundColor: "red",
    height: vh(10),
    width: vw(80),
  },

  imageContainerInModal: {
    top: vh(30),
    height: vh(40),
    paddingLeft: vw(10),
    backgroundColor: "transparent",
  },
  voyageImageInModal: {
    height: vh(35),
    width: vw(80),
    marginRight: vh(1),
    borderRadius: vh(1.5),
    borderWidth: 2,
    borderColor: "white",
  },

  imageContainer1: {
    // backgroundColor: "white",
  },
  voyageImage1: {
    height: vh(13),
    width: vh(13),
    marginRight: vh(1),
    borderRadius: vh(1.5),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Adjust opacity as needed
  },
  carouselImage: {
    position: "absolute",
    top: vh(30),
    alignSelf: "center",
    height: vh(40),
    width: vw(90),
    borderRadius: vh(3),
    borderWidth: 1.5,
    borderColor: "white",
  },
  closeButtonAndText: {
    flexDirection: "row",
    position: "absolute",
    height: vh(3.5),
    width: vh(11.45),
    backgroundColor: "white",
    borderRadius: vh(2.5),
    bottom: vh(24),
    left: vw(35),
    borderColor: "rgb(148,1,1)",
    borderWidth: 1,
    verticalAlign: "middle",
  },
  closeText1: {
    marginLeft: vw(1),
    fontSize: 18,
    height: vh(3),
    alignSelf: "center",
    color: "rgb(148,1,1)",
  },
  closeText2: {
    fontSize: 18,
    height: vh(3),
    alignSelf: "center",
    color: "rgb(148,1,1)",
  },
  pagerView: {
    backgroundColor: "rgba(111,1,1,0.01)",
    height: vh(50),
    flex: 1,
  },
  pagerInside: {
    height: vh(50),
    width: vw(100),
  },
});

const styles = StyleSheet.create({
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
  noDisplay: {
    display: "none",
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
    borderWidth: 5,
  },
  backgroundImageMain: {
    backgroundColor: "rgba(10, 11, 211,0.36)",
  },
  mainCheckboxContainer: {
    padding: vh(1),
    flexDirection: "row",
    justifyContent: "space-around",
    // borderWidth: 1,
    borderRadius: vh(1),
    backgroundColor: "white",
    borderColor: "rgba(190, 119, 234,0.4)",
    marginTop: vh(0.3),
  },
  checkboxContainer: {
    flexDirection: "row",
    margin: vh(0.2),
  },
  calendarContainer: {
    backgroundColor: "white",
    borderRadius: vh(1),
    // borderWidth: 1,
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  formContainer: {
    padding: vh(2),
    top: vh(-2),
  },
  recycle: {
    color: "purple",
  },
  recycleBackground: {
    color: "purple",
  },
  recycleBox: {
    left: vw(4),
    textAlign: "center",
    width: vw(12),
    height: vw(12),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: vh(6),
    borderColor: "rgba(190, 119, 234,0.6)",
    // borderWidth: 2,
  },
  recycleBoxBG: {
    top: vh(-6),
    left: vw(85),
    textAlign: "center",
    width: vw(12),
    height: vw(12),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: vh(6),
    borderColor: "rgba(190, 119, 234,0.6)",
    // borderWidth: 2,
  },
  saveButton: {
    padding: 10,
    paddingHorizontal: vw(15),
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
  rectangularBox: {
    height: vh(35),
    backgroundColor: "white",
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
    color: "rgba(0, 119, 234,0.9)",
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
  textDescriptionInput: {
    width: vw(60),
    flexWrap: "wrap",
    lineHeight: 21,
    marginVertical: 1,
    fontSize: 14,
    padding: vw(1),
  },

  textInputBio: {
    lineHeight: 21,
    marginVertical: 5,
    fontSize: 14,
    flex: 1,
    padding: vw(1),
  },

  socialBox: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: vh(1.5),
    marginTop: 2,
    // borderWidth: 1,
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  socialBoxBio: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 2,
    // borderWidth: 1,
    borderColor: "rgba(190, 119, 234,0.4)",
    width: vw(90),
    // backgroundColor: "red",
  },
});
