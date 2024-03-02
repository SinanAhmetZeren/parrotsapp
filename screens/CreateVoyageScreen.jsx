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
} from "react-native";
import {
  useGetUserByIdQuery,
  useUpdateProfileImageMutation,
  useUpdateBackgroundImageMutation,
  usePatchUserMutation,
} from "../slices/UserSlice";
import { useCreateVoyageMutation } from "../slices/VoyageSlice";
import { vh, vw } from "react-native-expo-viewport-units";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome, Entypo, Fontisto, Feather } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import CalendarPicker from "react-native-calendar-picker";
import Checkbox from "expo-checkbox";
import DropdownComponent from "../components/DropdownComponent";

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

  const [name, setName] = useState("1");
  const [brief, setBrief] = useState("1");
  const [description, setDescription] = useState("1");
  const [vacancy, setVacancy] = useState("1");
  const [startDate, setStartDate] = useState("1");
  const [endDate, setEndDate] = useState("1");
  const [lastBidDate, setLastBidDate] = useState("1");
  const [minPrice, setMinPrice] = useState("1");
  const [maxPrice, setMaxPrice] = useState("1");
  const [isAuction, setIsAuction] = useState(true);
  const [isFixedPrice, setIsFixedPrice] = useState(true);
  const [vehicleId, setVehicleId] = useState("1");
  const x =
    "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fparrots-11d9acbc-8e32-4b9c-b537-94d439bcffb0/ImagePicker/89042c38-6644-4c42-8ef6-1f40fc66434b.jpeg";

  const [image, setImage] = useState(x);

  useEffect(() => {
    console.log("---");
  }, [isSuccess]);

  useEffect(() => {
    console.log("---");
  }, [startDate, endDate, lastBidDate]);

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
    console.log("--- image ---", image);
    // profileImage
    // userId
    // vehicleId

    // /api/Voyage/AddVoyage?Name=1dd&Brief=1dd&Description=1dd
    //&Vacancy=155&StartDate=Fri+Mar+22+2024+12%3A00%3A00+GMT%2B0300&EndDate=Sat+Mar+23+2024+12%3A00%3A00+GMT%2B0300&LastBidDate=11%2F11%2F2022&MinPrice=1&MaxPrice=1&
    //Auction=true&FixedPrice=true&UserId=1bf7d55e-7be2-49fb-99aa-93d947711e32&VehicleId=1
    console.log("----------");
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

      await createVoyage({
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

    if (!result.canceled) {
      setImage(result.assets[0].uri);
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

  if (isSuccess) {
    const profileImageUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/UserImages/${userData.profileImageUrl}`;
    const backgroundImageUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/UserImages/${userData.backgroundImageUrl}`;

    const dropdownData = userData.usersVehicles.map((vehicle) => ({
      label: vehicle.name,
      value: vehicle.id,
    }));

    return (
      <ScrollView style={styles.scrollview}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <TouchableOpacity onPress={pickProfileImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.profileImage} />
            ) : (
              <Image
                source={{ uri: profileImageUrl }}
                style={styles.profileImage}
              />
            )}
            <View style={styles.recycleBox}>
              <Entypo
                name="image"
                size={24}
                color="black"
                style={styles.recycle}
              />
            </View>
          </TouchableOpacity>
          {/* Your other UI elements */}
        </View>

        <View style={styles.formContainer}>
          {/* Username */}
          <View style={styles.socialBox}>
            <Feather style={styles.icon} name="user" size={24} color="black" />
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
              onChangeText={(text) => setBrief(text)}
              style={styles.textInput}
            />
          </View>

          {/* Phone Number */}
          <View style={styles.socialBox}>
            <Feather style={styles.icon} name="phone" size={24} color="black" />
            <Text style={styles.inputDescription}>Description</Text>

            <TextInput
              style={styles.textInput}
              placeholder="Enter voyage description"
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

          <DropdownComponent data={dropdownData} label={"Select Vehicle"} />

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
          <View style={styles.saveButton}>
            <Button
              title="Create Voyage"
              onPress={() => handleCreateVoyage()}
            />
          </View>

          <View style={styles.refetch}>
            <Button
              title="print state"
              onPress={() => {
                printState();
              }}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
};

export default CreateVoyageScreen;

const styles = StyleSheet.create({
  mainCheckboxContainer: {
    padding: vh(1),
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderRadius: vh(3),
    backgroundColor: "white",
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  checkboxContainer: {
    flexDirection: "row",
    margin: vh(0.2),
  },
  calendarContainer: {
    backgroundColor: "white",
    borderRadius: vh(3),
    borderWidth: 1,
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  formContainer: {
    padding: 20,
    top: vh(-2),
  },
  scrollview: {
    height: vh(140),
    top: vh(5),
    marginBottom: vh(20),
    backgroundColor: "rgba(190, 119, 234,0.16)",
  },
  profileImage: {
    top: vh(3),
    left: vw(-25),
    width: vh(22),
    height: vh(22),
    borderRadius: vh(20),
    borderWidth: 5,
    borderColor: "rgba(190, 119, 234,0.6)",
  },
  recycle: {
    color: "purple",
  },
  recycleBackground: {
    color: "purple",
  },
  recycleBox: {
    top: vh(-2),
    left: vw(4),
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
    borderWidth: 2,
  },
  saveButton: {
    padding: 10,
    paddingHorizontal: vw(15),
  },
  refetch: {
    padding: 3,
    paddingHorizontal: vw(15),
    borderRadius: vw(9),
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
    borderRadius: 20,
    marginTop: 2,
    borderWidth: 1,
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  socialBoxBio: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 2,
    borderWidth: 1,
    borderColor: "rgba(190, 119, 234,0.4)",
    width: vw(90),
    // backgroundColor: "red",
  },
});
