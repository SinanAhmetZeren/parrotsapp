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
import { MaterialIcons, AntDesign, Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import DropdownComponent from "../components/DropdownComponent";

export const CreateVehicleScreen = () => {
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
  let x =
    "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fparrots-11d9acbc-8e32-4b9c-b537-94d439bcffb0/ImagePicker/aad9496c-c258-4ce9-b64b-78e20f5bf2fe.jpeg";
  const [profileImage, setProfileImage] = useState(null);
  const [voyageImage, setVoyageImage] = useState(null);
  const [addedVoyageImages, setAddedVoyageImages] = useState([]);

  useEffect(() => {
    console.log("---");
  }, [isSuccess]);

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

  const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("picked image", result.assets[0].uri);
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
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
    console.log("image id to delete", imageId);
    deleteVoyageImage(imageId);
    setAddedVoyageImages((prevImages) =>
      prevImages.filter((item) => item.addedVoyageImageId !== imageId)
    );
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
        <ScrollView style={styles.scrollview}>
          <View style={styles.overlay}>
            {/* PROFILE IMAGE */}
            <View style={styles.profileImageMain}>
              <View style={styles.selectedChoice}>
                <Text style={styles.selectedText}>Vehicle Profile Image</Text>
              </View>

              <View style={styles.profileContainer}>
                <TouchableOpacity onPress={pickProfileImage}>
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <Image
                      source={require("../assets/plus-watercolor.png")}
                      style={styles.profileImage2}
                    />
                  )}
                </TouchableOpacity>
              </View>

              {profileImage ? (
                <View style={styles.addProfileImageButton}>
                  <TouchableOpacity onPress={() => handleUploadImage()}>
                    <AntDesign name="clouduploado" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            {/* PROFILE IMAGE */}

            <View style={styles.formContainer}>
              {/* Username */}

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

              {/* /// brief /// */}
              <View style={styles.latLngNameRow}>
                <View style={styles.latLngLabel}>
                  <Text style={styles.latorLngtxt}>
                    <Feather
                      style={styles.icon}
                      name="feather"
                      size={24}
                      color="black"
                    />{" "}
                    Brief:
                  </Text>
                </View>
                <View style={styles.latorLng}>
                  <TextInput
                    style={styles.textInput5}
                    placeholder="Enter voyage brief"
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
                    Vacancy:
                  </Text>
                </View>
                <View style={styles.latorLng}>
                  <TextInput
                    style={styles.textInput5}
                    placeholder="Enter voyage vacancy"
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
                  <Text style={styles.latorLngtxt}>
                    <Feather
                      style={styles.icon}
                      name="feather"
                      size={24}
                      color="black"
                    />{" "}
                    Vehicle:
                  </Text>
                </View>
                <View style={styles.latorLng}>
                  <DropdownComponent
                    data={dropdownData}
                    setVehicleId={setVehicleId}
                  />
                </View>
              </View>
              {/* /// vehicle /// */}

              {/* /// MIN PRICE /// */}
              <View style={styles.latLngNameRow}>
                <View style={styles.latLngLabel}>
                  <Text style={styles.latorLngtxt}>
                    <Feather
                      style={styles.icon}
                      name="feather"
                      size={24}
                      color="black"
                    />{" "}
                    Min Price:
                  </Text>
                </View>
                <View style={styles.latorLng}>
                  <TextInput
                    style={styles.textInput5}
                    maxLength={20}
                    placeholder="Enter Min Price"
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
                  <Text style={styles.latorLngtxt}>
                    <Feather
                      style={styles.icon}
                      name="feather"
                      size={24}
                      color="black"
                    />{" "}
                    Max Price:
                  </Text>
                </View>
                <View style={styles.latorLng}>
                  <TextInput
                    style={styles.textInput5}
                    maxLength={20}
                    placeholder="Enter Max Price"
                    value={maxPrice}
                    onChangeText={(text) => setMaxPrice(text)}
                    keyboardType="numeric"
                  />
                </View>
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

          {/* Save Button */}
          <View style={styles.createVoyageButton}>
            <Button
              title="Create Vehicle"
              onPress={() => handleCreateVoyage()}
            />
          </View>

          {/* VEHICLE IMAGES FLATLIST */}
          <View style={styles.vehicleImagesMain}>
            <View style={styles.selectedChoice}>
              <Text style={styles.selectedText}>Vehicle Images</Text>
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
              <View style={styles.selectorContainer}>
                <TouchableOpacity onPress={pickVoyageImage}>
                  {voyageImage ? (
                    <Image
                      source={{ uri: voyageImage }}
                      style={styles.selectorImage}
                    />
                  ) : (
                    <Image
                      source={require("../assets/plus-watercolor.png")}
                      style={styles.selectorImage}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.FlatlistContainer}>
                <FlatList
                  horizontal
                  data={data}
                  keyExtractor={(item) => item.addedVoyageImageId}
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
            </View>
            {/* VEHICLE IMAGES FLATLIST */}

            {voyageImage ? (
              <View style={styles.selectorAddButton}>
                <TouchableOpacity onPress={() => handleUploadImage()}>
                  <AntDesign name="clouduploado" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          {/* VEHICLE IMAGES FLATLIST */}

          <View style={styles.addWaypoints}></View>
        </ScrollView>
      </>
    );
  }
};

const styles = StyleSheet.create({
  voyageImage1: {
    height: vh(13),
    width: vh(13),
    marginRight: vh(1),
    borderRadius: vh(1.5),
  },
  vehicleImagesMain: {
    backgroundColor: "green",
    paddingBottom: vh(2),
  },
  profileImageMain: {
    backgroundColor: "lightblue",
  },
  FlatlistContainer: {
    backgroundColor: "blue",
    marginLeft: vw(3),
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
    flexDirection: "row",
  },
  length2: {
    width: vw(90),
    flexDirection: "row",
    alignSelf: "center",
  },
  length3: {
    width: vw(90),
    flexDirection: "row",
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
  addProfileImageButton: {
    backgroundColor: "rgb(0, 119, 234)",
    position: "absolute",
    right: vw(22),
    top: vh(19),
    padding: vh(1),
    alignSelf: "center",
    borderRadius: vh(3),
    overflow: "hidden",
    marginTop: vh(1),
    borderWidth: 1,
    borderColor: "white",
  },
  selectorAddButton: {
    backgroundColor: "rgb(0, 119, 234)",
    position: "absolute",
    padding: vh(1),
    alignSelf: "center",
    borderRadius: vh(3),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "white",
    left: vw(25),
    top: vh(15),
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
    borderRadius: vh(1.5),
  },
  selectorContainer: {
    backgroundColor: "red",
    borderRadius: vh(1.5),
  },
  profileImage: {
    marginLeft: vw(3),
    marginVertical: vh(1),
    marginBottom: vh(1),
    width: vh(20),
    height: vh(20),
    borderRadius: vh(3),
    borderColor: "rgba(190, 119, 234,0.6)",
  },
  selectorImage: {
    width: vh(13),
    height: vh(13),
    borderRadius: vh(1.5),
  },
  profileImage2: {
    marginLeft: vw(3),
    marginVertical: vh(1),
    marginBottom: vh(1),
    width: vh(20),
    height: vh(20),
    borderRadius: vh(3),
    borderColor: "rgba(0, 119, 234,0.1)",
    borderWidth: 5,
  },

  formContainer: {
    padding: vh(2),
    top: vh(-2),
  },

  createVoyageButton: {
    width: vw(40),
    alignSelf: "center",
    borderRadius: vh(2),
    overflow: "hidden",
    marginTop: vh(1),
    top: vh(4),
    marginBottom: vh(4),
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
  textInput: {
    lineHeight: 21,
    marginVertical: 1,
    fontSize: 14,
    padding: vw(1),
    backgroundColor: "green",
  },
});
