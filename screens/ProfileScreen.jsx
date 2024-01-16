/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import VehicleList from "../components/VehicleList";

export default function ProfileScreen({ navigation }) {
  //   const { message } = route.params;

  const showAlert = (message) => {
    Alert.alert(
      message,
      `Your selection was ${message.toUpperCase()}`,
      [
        {
          text: "OK",
          onPress: () => console.log(navigation),
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <>
      <View style={styles.rectangularBox}>
        <Image
          style={styles.imageContainer}
          resizeMode="cover"
          source={require("../assets/amazon.jpeg")}
        />
      </View>
      <Image
        style={styles.profileImage}
        resizeMode="cover"
        source={require("../assets/parrot-looks.jpg")}
      />
      <View>
        <ScrollView style={styles.scrollView}>
          {/* ------- PROFILE AND SOCIAL ------ */}
          <View style={styles.profileAndSocial}>
            <TouchableOpacity onPress={() => console.log("icon email")}>
              <Fontisto
                style={styles.icon}
                name="email"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log("icon instagram")}>
              <Ionicons
                style={styles.icon}
                name="logo-instagram"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log("icon facebook")}>
              <Feather
                style={styles.icon}
                name="facebook"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log("icon phone")}>
              <Feather
                style={styles.icon}
                name="phone"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          {/* ------- PROFILE AND SOCIAL ------ */}

          {/* ------- BIO ------ */}
          <View style={styles.bioBox}>
            <Text style={styles.name}> Fiesta Flutterbeak</Text>
            <Text style={styles.title}> Feathered Global Voyager</Text>
            <Text style={styles.bio}>
              🌍 Adventurous Parrot Explorer 🦜✈️ | Unleashing my wings to
              explore the world`s wonders! 🗺️ | Your daily dose of feathers,
              fun, and fantastic destinations 🌴 | Soaring through life, one
              destination at a time 🌈 | Join me on this feathered odyssey! 🌟
              #ParrotExplorer #WanderlustWings
            </Text>
          </View>
          {/* ------- BIO ------ */}

          {/* ------- CHOICE ------ */}
          <View style={styles.viewChoice}>
            <View style={styles.choiceItem}>
              <TouchableOpacity
                onPress={() => showAlert("vehicles")}
                style={styles.selectedChoice}
              >
                <Text style={styles.selectedText}>Vehicles</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.choiceItem}>
              <TouchableOpacity onPress={() => showAlert("voyages")}>
                <Text style={styles.choiceItemText}>Voyages</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* ------- CHOICE ------ */}
          <VehicleList style={styles.vehicleList} data={{}} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  rectangularBox: {
    height: vh(35),
    backgroundColor: "orange",
  },
  imageContainer: {
    top: vh(5),
    height: vh(30),
    width: vw(100),
  },
  scrollView: {
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: vh(20),
    top: vh(-20),
    height: vh(65),
    zIndex: 1, // Add zIndex property
  },
  profileAndSocial: {
    flexDirection: "row",
    // backgroundColor: "rgba(222, 119, 24,0.16)",
    height: vh(10),
    justifyContent: "flex-end",
    paddingRight: 20,
    paddingTop: 10,
  },
  profileImage: {
    height: vh(18),
    width: vh(18),
    borderRadius: vh(18),
    top: vh(-12),
    left: vw(5),
    zIndex: 100,
    borderWidth: 3,
    borderColor: "rgba(0, 119, 234,0.6)",
  },
  icon: {
    padding: 7,
    margin: 2,
    // backgroundColor: "rgba(0, 119, 234,0.06)",
    borderRadius: 20,
    color: "#909090",
  },
  bioBox: {
    paddingHorizontal: 20,
    // backgroundColor: "rgba(155, 44, 77,0.3)",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0077ea",
  },
  bio: {
    fontSize: 14,
    paddingHorizontal: 3,
    paddingTop: 5,
  },
  choiceItem: {
    marginHorizontal: 15,
  },
  choiceItemText: {
    fontSize: 18,
    fontWeight: "700",
    color: "grey",
  },
  viewChoice: {
    // backgroundColor: "pink",
    padding: 10,
    marginTop: 2,
    flexDirection: "row",
  },
  selectedChoice: {
    backgroundColor: "rgba(0, 0, 255, 0.05)",
    paddingHorizontal: 14,
    paddingVertical: 0,
    borderRadius: 10,
  },
  selectedText: {
    color: "#0077ea",
    fontSize: 18,
    fontWeight: "700",
  },
  vehicleList: {
    paddingLeft: 20,
    marginBottom: vh(30),
  },
});
