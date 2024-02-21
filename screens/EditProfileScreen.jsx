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
import { vh, vw } from "react-native-expo-viewport-units";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome, Entypo, Fontisto, Feather } from "@expo/vector-icons";

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

  const [updateProfileImage] = useUpdateProfileImageMutation();
  const [updateBackgroundImage] = useUpdateBackgroundImageMutation();
  const [patchUser] = usePatchUserMutation();

  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [instagramProfile, setInstagramProfile] = useState("");
  const [youtubeProfile, setYoutubeProfile] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [facebookProfile, setFacebookProfile] = useState("");
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [image2, setImage2] = useState(null);

  useEffect(() => {
    //console.log("user id: ", userData.id);
    console.log(" ************************ ");

    setProfileImage(userData.profileImage);
    setBackgroundImage(userData.backgroundImage);
    setInstagramProfile(userData.instagram);
    setYoutubeProfile(userData.youtube);
    setEmail(userData.email);
    setPhoneNumber(userData.phoneNumber);
    setFacebookProfile(userData.facebook);
    setUsername(userData.userName);
    setTitle(userData.title);
    setBio(userData.bio);
    setImage(userData.profileImage);
    setImage2(userData.backgroundImage);
  }, [isSuccess]);

  const handleUploadProfile = async () => {
    console.log("from handleUploadProfile", userId);

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
      //console.log("userId: ", userId);
      const response = await updateProfileImage({ formData, userId });
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const handleUploadBackground = async () => {
    console.log("from handleUploadBackGround", userId);

    if (!image2) {
      return;
    }
    const formData = new FormData();
    formData.append("imageFile", {
      uri: image2,
      type: "image/jpeg",
      name: "backgroundImage.jpg",
    });
    try {
      //console.log("userId: ", userId);
      const response = await updateBackgroundImage({ formData, userId });
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const handlePathcUser = async () => {
    console.log("hello");
    const patchDoc = [
      { op: "replace", path: "/userName", value: username },
      { op: "replace", path: "/email", value: email },
      { op: "replace", path: "/phonenumber", value: phoneNumber },
      { op: "replace", path: "/facebook", value: facebookProfile },
      { op: "replace", path: "/instagram", value: instagramProfile },
      { op: "replace", path: "/youtube", value: youtubeProfile },
      { op: "replace", path: "/title", value: title },
      { op: "replace", path: "/bio", value: bio },
    ];
    try {
      const response = await patchUser({ patchDoc, userId });
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const pickProfileImage = async () => {
    // No permissions request is necessary for launching the image library
    console.log(userData.id);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    //console.log(result.assets[0].uri);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickBackgroundImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage2(result.assets[0].uri);
    }
  };

  const profileImageUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/UserImages/${userData.profileImageUrl}`;
  const backgroundImageUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/UserImages/${userData.backgroundImageUrl}`;
  console.log(userData.backgroundImageUrl);

  return (
    <ScrollView style={styles.scrollview}>
      <TouchableOpacity onPress={pickBackgroundImage}>
        <View style={styles.rectangularBox}>
          {image2 ? (
            <Image
              style={styles.imageContainer}
              resizeMode="cover"
              source={{ uri: image2 }}
            />
          ) : (
            <Image
              style={styles.imageContainer}
              resizeMode="cover"
              source={{ uri: backgroundImageUrl }}
            />
          )}
        </View>
        <View style={styles.recycleBoxBG}>
          <Entypo
            name="image"
            size={24}
            color="black"
            style={styles.recycleBackground}
          />
        </View>
      </TouchableOpacity>
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

      <View style={{ padding: 20, top: vh(-15) }}>
        {/* Username */}
        <View style={styles.socialBox}>
          <Feather style={styles.icon} name="user" size={24} color="black" />
          <Text style={styles.inputDescription}>Username</Text>

          <TextInput
            style={styles.textInput}
            placeholder="Enter your username"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
        </View>

        <View style={styles.socialBox}>
          <Fontisto style={styles.icon} name="email" size={24} color="black" />
          <Text style={styles.inputDescription}>Email</Text>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.textInput}
          />
        </View>

        {/* Phone Number */}
        <View style={styles.socialBox}>
          <Feather style={styles.icon} name="phone" size={24} color="black" />
          <Text style={styles.inputDescription}>Phone</Text>

          <TextInput
            style={styles.textInput}
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
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
          <Text style={styles.inputDescription}>Facebook</Text>

          <TextInput
            style={styles.textInput}
            placeholder="Enter your Facebook profile"
            value={facebookProfile}
            onChangeText={(text) => setFacebookProfile(text)}
          />
        </View>

        {/* Instagram Profile */}
        <View style={styles.socialBox}>
          <Feather
            style={styles.icon}
            name="instagram"
            size={24}
            color="black"
          />
          <Text style={styles.inputDescription}>Instagram</Text>

          <TextInput
            style={styles.textInput}
            placeholder="Enter your Instagram profile"
            value={instagramProfile}
            onChangeText={(text) => setInstagramProfile(text)}
          />
        </View>

        {/* Youtube Profile */}
        <View style={styles.socialBox}>
          <Feather style={styles.icon} name="youtube" size={24} color="black" />
          <Text style={styles.inputDescription}>Youtube</Text>

          <TextInput
            style={styles.textInput}
            placeholder="Enter your Youtube profile"
            value={youtubeProfile}
            onChangeText={(text) => setYoutubeProfile(text)}
          />
        </View>

        {/* Title */}
        <View style={styles.socialBox}>
          <Feather
            style={styles.icon}
            name="pen-tool"
            size={24}
            color="black"
          />
          <Text style={styles.inputDescription}>Title</Text>

          <TextInput
            style={styles.textInput}
            placeholder="Enter your title"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              console.log(text);
            }}
          />
        </View>

        {/* Bio */}
        <View style={styles.socialBoxBio}>
          <Feather
            style={styles.icon}
            name="pen-tool"
            size={24}
            color="black"
          />
          <Text style={styles.inputDescription}>Bio</Text>
          <TextInput
            style={styles.textInputBio}
            placeholder="Enter your bio"
            value={bio}
            onChangeText={(text) => setBio(text)}
            multiline
          />
        </View>

        {/* Save Button */}
        <View style={styles.saveButton}>
          <Button
            title="Save Changes"
            onPress={() => {
              {
                image ? handleUploadProfile() : null;
              }
              {
                image2 ? handleUploadBackground() : null;
              }
              handlePathcUser();
            }}
          />
        </View>

        <View style={styles.refetch}>
          <Button
            title="refetch"
            onPress={() => {
              refetch();
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  scrollview: {
    height: vh(140),
    top: vh(10),
    // paddingBottom: vh(13),
    marginBottom: vh(20),
    backgroundColor: "rgba(190, 119, 234,0.16)",
    // backgroundColor: "green",
  },
  profileImage: {
    top: vh(-10),
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
    top: vh(-15),
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
    width: vw(17),
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
