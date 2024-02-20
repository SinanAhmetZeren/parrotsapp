/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Button,
} from "react-native";

const EditProfileScreen = () => {
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

  const handleSave = () => {
    // Handle the logic to save the edited profile information
    console.log("Saving profile:", {
      profileImage,
      instagramProfile,
      youtubeProfile,
      email,
      phoneNumber,
      facebookProfile,
      username,
      title,
      bio,
    });
    // Add your save logic here (e.g., API call to update the profile)
  };

  const handleImageUpload = () => {
    // Implement the logic to handle image upload
    // For simplicity, this example just sets a placeholder image
    setProfileImage("https://example.com/placeholder.jpg");
    setModalVisible(false);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Edit Profile</Text>

      {/* Profile Image */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          source={{
            uri: profileImage || "https://example.com/placeholder.jpg",
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 10,
          }}
        />
      </TouchableOpacity>

      {/* Image Upload Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {/* Add your image upload components and logic here */}
          <Text>Modal for Image Upload</Text>
          <Button title="Upload Image" onPress={handleImageUpload} />
        </View>
      </Modal>

      {/* Email */}
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>

      {/* Phone Number */}
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>Phone Number</Text>
        <TextInput
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        />
      </View>

      {/* Facebook Profile */}
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>Facebook Profile</Text>
        <TextInput
          placeholder="Enter your Facebook profile"
          value={facebookProfile}
          onChangeText={(text) => setFacebookProfile(text)}
        />
      </View>

      {/* Username */}
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>Username</Text>
        <TextInput
          placeholder="Enter your username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
      </View>

      {/* Title */}
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>Title</Text>
        <TextInput
          placeholder="Enter your title"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
      </View>

      {/* Bio */}
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>Bio</Text>
        <TextInput
          placeholder="Enter your bio"
          value={bio}
          onChangeText={(text) => setBio(text)}
          multiline
        />
      </View>

      {/* Save Button */}
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default EditProfileScreen;
