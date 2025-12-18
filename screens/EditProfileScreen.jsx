/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, use } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
  StyleSheet,
  ScrollView,
  Keyboard
} from "react-native";
import Checkbox from "expo-checkbox";

import {
  useGetUserByIdQuery,
  useUpdateProfileImageMutation,
  useUpdateBackgroundImageMutation,
  usePatchUserMutation,
  updateUserName,
  updateUserData,
} from "../slices/UserSlice";
import { vh, vw } from "react-native-expo-viewport-units";
import * as ImagePicker from "expo-image-picker";
import { Entypo, Fontisto, Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { API_URL } from "@env";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { parrotBlue, parrotCream } from "../assets/color";

const EditProfileScreen = ({ navigation }) => {
  const userId = useSelector((state) => state.users.userId);

  const dispatch = useDispatch();
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
  const [twitterProfile, setTwitterProfile] = useState("");
  const [tiktokProfile, setTiktokProfile] = useState("");
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [youtubeProfile, setYoutubeProfile] = useState("");
  const [displayEmail, setDisplayEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [facebookProfile, setFacebookProfile] = useState("");
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [image2, setImage2] = useState(null);
  const [emailHidden, setEmailHidden] = useState(true);
  const [textInputBottomMargin, setTextInputBottomMargin] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await refetch();
        } catch (error) {
          console.error("Error refetching messages data:", error);
        }
      };

      fetchData();

      return () => {
        // Cleanup function if needed
      };
    }, [refetch])
  );

  const handleUploadProfile = async () => {
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
      const response = await updateProfileImage({ formData, userId });
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const handleUploadBackground = async () => {
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
      const response = await updateBackgroundImage({ formData, userId });
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const handlePatchUser = async () => {
    const patchDoc = [
      { op: "replace", path: "/userName", value: username },
      // { op: "replace", path: "/email", value: email },
      { op: "replace", path: "/displayEmail", value: displayEmail },
      { op: "replace", path: "/phonenumber", value: phoneNumber },
      { op: "replace", path: "/facebook", value: facebookProfile },
      { op: "replace", path: "/instagram", value: instagramProfile },
      { op: "replace", path: "/twitter", value: twitterProfile },
      { op: "replace", path: "/tiktok", value: tiktokProfile },
      { op: "replace", path: "/linkedin", value: linkedinProfile },
      { op: "replace", path: "/youtube", value: youtubeProfile },
      { op: "replace", path: "/title", value: title },
      { op: "replace", path: "/bio", value: bio },
      { op: "replace", path: "/emailVisible", value: !emailHidden },
    ];
    try {
      const response = await patchUser({ patchDoc, userId });
      dispatch(
        updateUserName({
          username,
        })
      );
      dispatch(
        updateUserData({
          image: profileImage,
        })
      );
      // console.log("updating user");
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickBackgroundImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage2(result.assets[0].uri);
    }
  };

  useEffect(() => {
    if (isSuccess && userData) {
      setProfileImage(userData.profileImageUrl);
      setBackgroundImage(userData.backgroundImageUrl);
      setInstagramProfile(userData.instagram);
      setTwitterProfile(userData.twitter);
      setTiktokProfile(userData.tiktok);
      setLinkedinProfile(userData.linkedin);
      setYoutubeProfile(userData.youtube);
      setDisplayEmail(userData.displayEmail);
      setPhoneNumber(userData.phoneNumber);
      setFacebookProfile(userData.facebook);
      setUsername(userData.userName);
      setTitle(userData.title);
      setBio(userData.bio);
      setEmailHidden(!userData.emailVisible);
    }
  }, [isSuccess, userData]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setTextInputBottomMargin(event.endCoordinates.height);
        console.log("height: ", event.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      (event) => {
        setTextInputBottomMargin(0);
        console.log("height: ", event.endCoordinates.height);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    console.log("TextInput bottom margin updated:", textInputBottomMargin);
  }, [textInputBottomMargin]);

  if (isSuccess) {
    const profileImageUrl = `${userData.profileImageUrl}`;
    const backgroundImageUrl = `${userData.backgroundImageUrl}`;

    return (
      <>
        <TokenExpiryGuard />
        <ScrollView style={{ ...styles.scrollview, top: -textInputBottomMargin }}>
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
          <View style={styles.profileBackGround}>
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

          <View style={styles.profileImageContainer}>
            {/* Username */}
            <View style={styles.socialBox}>
              <Feather
                style={styles.icon}
                name="user"
                size={24}
                color="black"
              />
              <Text style={styles.inputDescription}>Username</Text>

              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                placeholder="Enter your username"
                value={username}
                onChangeText={(text) => setUsername(text)}
                maxLength={25}
              />
            </View>

            <View>
              <View style={styles.socialBox}>
                <Fontisto
                  style={styles.icon}
                  name="email"
                  size={24}
                  color="black"
                />
                <View style={styles.emailInfoWrapper}  >
                  <Text style={styles.inputDescription}>Email</Text>
                  <TouchableOpacity
                    style={styles.infoIcon}
                    onPress={() => {
                      Toast.show({
                        type: "infoLarge",
                        visibilityTime: 8000,
                        topOffset: 90,
                        text1: "Display Email",
                        text2: "This email address will be publicly visible on your profile. It may differ from your login email and is optional to provide.",
                      });
                    }}
                  >

                    {/* info icon */}
                    <MaterialCommunityIcons name="information-slab-circle-outline" size={20} color="rgba(0, 119, 234,0.5)" />
                  </TouchableOpacity>


                </View>
                <TextInput
                  placeholder="Enter your email"
                  value={displayEmail}
                  onChangeText={(text) => setDisplayEmail(text)}
                  style={[styles.textInput, { flex: 1 }]}
                  editable={true}
                />
              </View>


            </View>

            {/* <View style={styles.socialBoxCheckbox}>
              <Fontisto
                style={styles.icon}
                name="email"
                size={24}
                color="black"
              />
              <Text style={styles.inputDescription}>Hide Email</Text>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={emailHidden}
                  onValueChange={setEmailHidden}
                  color={emailHidden ? "rgba(0, 119, 234,0.9)" : undefined}
                />
              </View>
            </View> */}

            {/* Phone Number */}
            <View style={styles.socialBox}>
              <Feather
                style={styles.icon}
                name="phone"
                size={24}
                color="black"
              />
              <Text style={styles.inputDescription}>Phone</Text>

              <TextInput
                style={[styles.textInput, { flex: 1 }]}
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
                style={[styles.textInput, { flex: 1 }]}
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
                style={[styles.textInput, { flex: 1 }]}
                placeholder="Enter your Instagram profile"
                value={instagramProfile}
                onChangeText={(text) => setInstagramProfile(text)}
              />
            </View>

            {/* Youtube Profile */}
            <View style={styles.socialBox}>
              <Feather
                style={styles.icon}
                name="youtube"
                size={24}
                color="black"
              />
              <Text style={styles.inputDescription}>Youtube</Text>

              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                placeholder="Enter your Youtube profile"
                value={youtubeProfile}
                onChangeText={(text) => setYoutubeProfile(text)}
              />
            </View>

            {/* Twitter Profile */}
            <View style={styles.socialBox}>
              <Feather
                style={styles.icon}
                name="twitter"
                size={24}
                color="black"
              />
              <Text style={styles.inputDescription}>Twitter</Text>

              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                placeholder="Enter your Twitter profile"
                value={twitterProfile}
                onChangeText={(text) => setTwitterProfile(text)}
              />
            </View>

            {/* Tiktok Profile */}
            <View style={styles.socialBox}>
              <FontAwesome5
                style={styles.icon}
                name="tiktok"
                size={24}
                color="black"
              />
              <Text style={styles.inputDescription}>Tiktok</Text>

              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                placeholder="Enter your Tiktok profile"
                value={tiktokProfile}
                onChangeText={(text) => setTiktokProfile(text)}
              />
            </View>

            {/* Linkedin Profile */}
            <View style={styles.socialBox}>
              <Feather
                style={styles.icon}
                name="linkedin"
                size={24}
                color="black"
              />
              <Text style={styles.inputDescription}>Linkedin</Text>

              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                placeholder="Enter your Linkedin profile"
                value={linkedinProfile}
                onChangeText={(text) => setLinkedinProfile(text)}
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
                style={[styles.textInput, { flex: 1 }]}
                placeholder="Enter your title"
                value={title}
                maxLength={40}
                multiline
                onChangeText={(text) => {
                  setTitle(text);
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
                maxLength={500}
              />
            </View>

            <View style={styles.saveChangesButtonContainer}>
              <TouchableOpacity
                style={{
                  ...styles.selection,
                  display: textInputBottomMargin > 0 ? "none" : "flex",
                }}
                onPress={() => {
                  {
                    image ? handleUploadProfile() : null;
                  }
                  {
                    image2 ? handleUploadBackground() : null;
                  }
                  handlePatchUser();
                  navigation.navigate("ProfileScreen");
                }}
              >
                <Text style={styles.choiceText}>Save Changes</Text>
              </TouchableOpacity>
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
      </>
    );
  }
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  infoIcon: {
    position: "absolute",
    right: vw(2)
  },

  emailInfoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative"
  },
  checkboxContainer: {
    justifyContent: "center",
    paddingLeft: vw(2),
  },
  profileBackGround: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#fff6f0",
    backgroundColor: parrotCream,
    top: vh(-6),
    borderRadius: vh(3),
  },
  profileImageContainer: {
    padding: vh(2),
    top: vh(-20),
  },
  selection: {
    paddingHorizontal: vh(2),
    paddingVertical: vh(.75),
    backgroundColor: parrotBlue,
    borderRadius: vh(2.5),
  },
  saveChangesButtonContainer: {
    bottom: vh(-2.5),
    alignSelf: "center",
    left: vw(4),
  },
  choiceText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  scrollview: {
    backgroundColor: parrotCream,
  },
  profileImage: {
    top: vh(-8),
    left: vw(-25),
    width: vh(22),
    height: vh(22),
    borderRadius: vh(20),
  },
  recycle: {
    color: parrotBlue,
  },
  recycleBackground: {
    color: parrotBlue,
  },
  recycleBox: {
    top: vh(-14),
    left: vw(10),
    textAlign: "center",
    width: vw(12),
    height: vw(12),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: vh(6),
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
  },

  refetch: {
    padding: 3,
    paddingHorizontal: vw(15),
    borderRadius: vw(9),
    display: "none",
  },
  rectangularBox: {
    height: vh(35),
    backgroundColor: "white",
  },
  imageContainer: {
    top: vh(0),
    height: vh(38),
    width: vw(100),
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
  inputDescription: {
    color: parrotBlue,
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
  },
  socialBoxCheckbox: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 2,
    paddingVertical: vh(0.4),
  },
  socialBoxBio: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 2,
    width: vw(90),
  },
});
