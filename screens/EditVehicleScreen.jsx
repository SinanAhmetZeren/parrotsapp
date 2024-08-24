/* eslint-disable no-constant-condition */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
  StyleSheet,
  ScrollView,
  FlatList,
  Modal,
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
import { MaterialIcons, AntDesign, Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import DropdownComponentType from "../components/DropdownComponentType";
import StepBarVehicle from "../components/StepBarVehicle";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { API_URL } from "@env";

const EditVehicleScreen = () => {
  const userId = useSelector((state) => state.users.userId);
  const route = useRoute();
  const { currentVehicleId } = route.params;
  // const currentVehicleId = 1;
  const {
    data: vehicleData,
    isLoading,
    isError,
    error,
    isSuccess: isSuccessVehicleData,
    refetch,
  } = useGetVehicleByIdQuery(currentVehicleId);

  const {
    data: vehicleImagesData,
    isLoading: isLoadingVehicleImages,
    isError: isErrorVehicleImages,
    error: errorVehicleImages,
    isSuccess: isSuccessVehicleImagesData,
    refetch: refetchVehicleImages,
  } = useGetVehicleImagesByVehicleIdQuery(currentVehicleId);

  const [updateVehicleProfileImage] = useUpdateVehicleProfileImageMutation();
  const [deleteVehicle] = useDeleteVehicleMutation();
  const [patchVehicle] = usePatchVehicleMutation();
  const [addVehicleImage] = useAddVehicleImageMutation();
  const [deleteVehicleImage] = useDeleteVehicleImageMutation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [image, setImage] = useState("");
  const [voyageImage, setVoyageImage] = useState(null);
  const [addedVoyageImages, setAddedVoyageImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const navigation = useNavigation();

  const VehicleTypes = {
    Boat: "Boat",
    Car: "Car",
    Caravan: "Caravan",
    Bus: "Bus",
    Walk: "Walk",
    Run: "Run",
    Motorcycle: "Motorcycle",
    Bicycle: "Bicycle",
    TinyHouse: "TinyHouse",
    Airplane: "Airplane",
  };

  useEffect(() => {
    if (vehicleData) {
      const vehicleTypeArray = Object.keys(VehicleTypes);
      const vehicleTypeFromHook = vehicleTypeArray[vehicleData.type];

      setVehicleType(vehicleTypeFromHook);
      setName(vehicleData.name);
      setDescription(vehicleData.description);
      setCapacity(vehicleData.capacity.toString());
      setImage(
        `${API_URL}/Uploads/VehicleImages/` + vehicleData.profileImageUrl
      );
    }
  }, [isSuccessVehicleData]);

  useEffect(() => {
    if (vehicleImagesData) {
      setAddedVoyageImages(vehicleImagesData);
    }
  }, [isSuccessVehicleImagesData]);

  const goToProfilePage = () => {
    setName("");
    setDescription("");
    setCapacity("0");
    setVehicleType("");
    setVehicleId("");
    setImage("");
    setVoyageImage("");
    setAddedVoyageImages([]);
    setCurrentStep(1);

    navigation.navigate("Home", { screen: "HomeScreen" });
  };

  const handlePatchVehicle = async () => {
    const patchDoc = [
      { op: "replace", path: "/name", value: name },
      { op: "replace", path: "/description", value: description },
      { op: "replace", path: "/capacity", value: capacity },
    ];
    try {
      const response = await patchVehicle({ patchDoc, currentVehicleId });
    } catch (error) {
      console.error("Error", error);
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
      const vehicleId = currentVehicleId;
      const addedVehicleImageResponse = await addVehicleImage({
        formData,
        vehicleId,
      });
      const addedVoyageImageId = addedVehicleImageResponse.data.imagePath;
      const newItem = {
        id: addedVoyageImageId,
        vehicleImagePath: voyageImage,
      };
      setAddedVoyageImages((prevImages) => [...prevImages, newItem]);
      setVoyageImage(null);
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const handleUpdateVehicleProfileImage = async () => {
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
      const vehicleId = currentVehicleId;
      const addedVehicleImageResponse = await updateVehicleProfileImage({
        formData,
        vehicleId,
      });

      setImage(null);
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [4, 3],
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

  const handleDeleteImage = (imageId) => {
    deleteVehicleImage(imageId);
    setAddedVoyageImages((prevImages) =>
      prevImages.filter((item) => item.id !== imageId)
    );
  };

  const handleOpenDeleteVehicleModal = () => {
    setDeleteModalVisible(true);
  };
  const handleCloseDeleteVehicleModal = () => {
    setDeleteModalVisible(false);
  };

  const HandleDeleteVehicle = () => {
    deleteVehicle(currentVehicleId);
    navigation.navigate("Home");
  };

  if (true) {
    const dropdownData = Object.keys(VehicleTypes).map((key, index) => ({
      label: key,
      value: key,
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
        <StepBarVehicle currentStep={currentStep} />
        {currentStep == 1 ? (
          <ScrollView style={styles.scrollview}>
            <View style={styles.overlay}>
              <View style={styles.profileContainer}>
                <TouchableOpacity onPress={pickProfileImage}>
                  <View style={styles2.recycleBoxBG}>
                    <Entypo
                      name="image"
                      size={24}
                      color="black"
                      style={styles2.recycleBackground}
                    />
                  </View>

                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={styles.backgroundImage}
                    />
                  ) : (
                    <Image
                      source={require("../assets/placeholder.png")}
                      style={styles.backgroundImage}
                    />
                  )}
                </TouchableOpacity>
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
                        placeholder="Enter voyage name"
                        placeholderStyle={styles.placeholderStyle}
                        value={name}
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
                        placeholder="Enter voyage description"
                        placeholderStyle={styles.placeholderStyle}
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
                        placeholder="Enter vehicle capacity"
                        placeholderStyle={styles.placeholderStyle}
                        value={capacity}
                        onChangeText={(text) => setCapacity(text)}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  {/* /// VACANCY /// */}

                  {/* Save Button */}
                  <View style={styles2.buttonContainer}>
                    <View style={styles2.modalView}>
                      <TouchableOpacity
                        style={styles2.selection}
                        onPress={() => {
                          handlePatchVehicle();
                          handleUpdateVehicleProfileImage();
                          setCurrentStep(2);
                        }}
                      >
                        <Text style={styles2.choiceText}>Save Changes</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles2.modalViewRed}>
                      <TouchableOpacity
                        style={styles2.selectionRed}
                        onPress={() => {
                          handleOpenDeleteVehicleModal();
                        }}
                      >
                        <Text style={styles2.choiceText}>Delete Vehicle</Text>
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
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => {
                    return (
                      <View key={index} style={styles2.imageContainer1}>
                        <TouchableOpacity
                          onPress={() => {
                            if (item.id) {
                              handleDeleteImage(item.id);
                            }
                          }}
                        >
                          <Image
                            // source={
                            //   item.id
                            //     ? {
                            //         uri: `${API_URL}/Uploads/VehicleImages/${item.vehicleImagePath}`,
                            //       }
                            //     : require("../assets/placeholder.png")
                            // }

                            source={
                              item.vehicleImagePath &&
                              item.vehicleImagePath.startsWith("file://")
                                ? { uri: item.vehicleImagePath }
                                : item.id
                                ? {
                                    uri: `${API_URL}/Uploads/VehicleImages/${item.vehicleImagePath}`,
                                  }
                                : require("../assets/placeholder.png")
                            }
                            style={styles2.voyageImage1}
                          />

                          {item.id && (
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
              <TouchableOpacity
                style={styles.FinishButtonContainer}
                onPress={() => {
                  goToProfilePage();
                }}
              >
                <Text style={styles.addWaypointText}> Complete </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : null}

        <View>
          <TouchableOpacity
            activeOpacity={1}
            onPressOut={() => handlePressOut()} // Close modal when touched outside
          >
            <Modal
              animationType="none"
              transparent={true}
              visible={deleteModalVisible}
              onRequestClose={() => {
                setModalVisible(!deleteModalVisible);
              }}
            >
              <TouchableOpacity
                style={{ flex: 1, justifyContent: "center" }}
                onPressOut={() => setDeleteModalVisible(false)}
              >
                <View>
                  <View style={styles2.modalView2}>
                    <View style={styles2.modalViewRed2}>
                      <TouchableOpacity
                        style={styles2.selectionRed}
                        onPress={() => {
                          HandleDeleteVehicle();
                        }}
                      >
                        <Text style={styles2.choiceText}>
                          Yes, Delete Vehicle
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles2.modalViewRed3}>
                      <TouchableOpacity
                        style={styles2.selectionGreen}
                        onPress={() => {
                          handleCloseDeleteVehicleModal();
                        }}
                      >
                        <Text style={styles2.choiceText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
          </TouchableOpacity>
        </View>
      </>
    );
  }
};

export default EditVehicleScreen;

const styles2 = StyleSheet.create({
  placeholderStyle: {
    fontSize: 12,
    color: "#c3c3c3",
    fontWeight: "500",
    width: vw(25),
    left: vw(-1),
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
    zIndex: 100,
    position: "absolute",
    bottom: vh(5),
    right: vw(2),
    textAlign: "center",
    width: vw(12),
    height: vw(12),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: vh(6),
    borderColor: "rgba(190, 119, 234,0.6)",
    borderWidth: 2,
  },
  modalView2: {
    backgroundColor: "rgba(255, 255, 0,.31)",
    height: vh(20),
    marginHorizontal: vw(10),
    borderRadius: vh(5),
    alignItems: "center",
    justifyContent: "center",
  },
  modalViewRed2: {
    borderRadius: vh(3),
    borderWidth: 2,
    borderColor: "orange",
    width: vw(60),
  },

  modalViewRed3: {
    backgroundColor: "green",
    borderRadius: vh(3),
    borderWidth: 2,
    borderColor: "lightgreen",
    width: vw(60),
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: vh(2),
  },
  choiceText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  selection: {
    marginHorizontal: vh(0.5),
    marginVertical: vh(0.5),
    paddingHorizontal: vh(2),
    paddingVertical: vh(1),
    backgroundColor: "#15537d",
    borderRadius: vh(2.5),
  },
  selectionRed: {
    marginHorizontal: vh(0.5),
    marginVertical: vh(0.5),
    paddingHorizontal: vh(2),
    paddingVertical: vh(1),
    backgroundColor: "tomato",
    borderRadius: vh(2.5),
  },
  selectionGreen: {
    marginHorizontal: vh(0.5),
    marginVertical: vh(0.5),
    paddingHorizontal: vh(2),
    paddingVertical: vh(1),
    backgroundColor: "yellowgreen",
    borderRadius: vh(2.5),
  },
  modalView: {
    backgroundColor: "#2184c6",
    borderRadius: vh(3),
    borderWidth: 2,
    borderColor: "#76bae8",
    width: vw(45),
  },
  modalViewRed: {
    borderRadius: vh(3),
    borderWidth: 2,
    borderColor: "orange",
    width: vw(45),
  },

  voyageImage1: {
    height: vh(13),
    width: vh(13),
    marginRight: vh(1),
    borderRadius: vh(1.5),
  },
});

const styles = StyleSheet.create({
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
  scrollview: {
    height: vh(140),
    top: vh(5),
    marginBottom: vh(15),
    backgroundColor: "white",
  },
  overlay: {
    // backgroundColor: "red",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  backgroundImage: {
    width: vw(100),
    height: vh(30),
  },
  profileImage2: {
    marginLeft: vw(3),
    marginVertical: vh(1),
    marginBottom: vh(3),
    width: vh(20),
    height: vh(20),
    borderRadius: vh(3),
    borderColor: "rgba(0, 119, 234,0.1)",
  },
  formContainer: {
    padding: vh(2),
  },
  recycle: {
    color: "purple",
  },

  refetch: {
    padding: 3,
    paddingHorizontal: vw(15),
    borderRadius: vw(9),
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
  textInput: {
    lineHeight: 21,
    marginVertical: 1,
    fontSize: 14,
    padding: vw(1),
  },
});
