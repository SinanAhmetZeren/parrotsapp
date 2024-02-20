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
import { useGetUserByIdQuery } from "../slices/UserSlice";
import { vh, vw } from "react-native-expo-viewport-units";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";

const EditProfileScreen = () => {
  let userId = "1bf7d55e-7be2-49fb-99aa-93d947711e32";

  const {
    data: userData,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useGetUserByIdQuery(userId);

  const [profileImage, setProfileImage] = useState(null);
  const [instagramProfile, setInstagramProfile] = useState("");
  const [youtubeProfile, setYoutubeProfile] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [facebookProfile, setFacebookProfile] = useState("");
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    console.log("user id: ", userData.id);
    setProfileImage(userData.profileImage);
    setInstagramProfile(userData.instagram);
    setYoutubeProfile(userData.youtube);
    setEmail(userData.email);
    setPhoneNumber(userData.phoneNumber);
    setFacebookProfile(userData.facebook);
    setUsername(userData.userName);
    setTitle(userData.title);
    setBio(userData.bio);
    setImage(userData.profileImage);
  }, [isSuccess]);

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("profileImage", {
        uri: selectedImage.uri,
        type: selectedImage.type,
        name: selectedImage.fileName,
      });

      const response = await axios.post(
        "{{baseUrl}}/api/User/1/updateProfileImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Handle success
      console.log("Image uploaded successfully:", response.data);
      // Close the modal or perform any other action after successful upload
      setModalVisible(false);
    } catch (error) {
      // Handle error
      console.error("Error uploading image:", error);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const profileImageUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/UserImages/${userData.profileImageUrl}`;

  return (
    <ScrollView style={styles.scrollview}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <TouchableOpacity onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <Image
              source={{ uri: profileImageUrl }}
              style={styles.profileImage}
            />
          )}
          <View style={styles.recycleBox}>
            <FontAwesome
              name="recycle"
              size={25}
              color="black"
              style={styles.recycle}
            />
          </View>
        </TouchableOpacity>
        {/* Your other UI elements */}
      </View>

      <View style={{ padding: 20 }}>
        {/* Email */}
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 16, marginBottom: 5 }}>Email</Text>
          <TextInput
            style={styles.textinput}
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        {/* Phone Number */}
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 16, marginBottom: 5 }}>Phone Number</Text>
          <TextInput
            style={styles.textinput}
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
          />
        </View>

        {/* Facebook Profile */}
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 16, marginBottom: 5 }}>
            Facebook Profile
          </Text>
          <TextInput
            style={styles.textinput}
            placeholder="Enter your Facebook profile"
            value={facebookProfile}
            onChangeText={(text) => setFacebookProfile(text)}
          />
        </View>

        {/* Username */}
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 16, marginBottom: 5 }}>Username</Text>
          <TextInput
            style={styles.textinput}
            placeholder="Enter your username"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
        </View>

        {/* Title */}
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 16, marginBottom: 5 }}>Title</Text>
          <TextInput
            style={styles.textinput}
            placeholder="Enter your title"
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
        </View>

        {/* Bio */}
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 16, marginBottom: 5 }}>Bio</Text>
          <TextInput
            style={styles.textinput}
            placeholder="Enter your bio"
            value={bio}
            onChangeText={(text) => setBio(text)}
            multiline
          />
        </View>

        {/* Save Button */}
        <Button
          title="Save"
          onPress={() => {
            return null;
          }}
        />
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  textinput: {
    backgroundColor: "white",
    lineHeight: 22,
  },
  scrollview: {
    height: vh(140),
    top: vh(10),
    backgroundColor: "#d6e7f7",
  },
  profileImage: {
    marginTop: vh(2),
    marginLeft: vw(2),
    width: vh(22),
    height: vh(22),
    borderRadius: vh(20),
    borderWidth: 5,
    borderColor: "rgba(190, 119, 234,0.6)",
  },
  recycle: {
    color: "red",
  },
  recycleBox: {
    top: vh(-3),
    left: vw(28),
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
});
