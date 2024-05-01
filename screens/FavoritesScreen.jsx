/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  Image,
} from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import VoyageListVertical from "../components/VoyageListVertical";
import VehicleList from "../components/VehicleList";
import { useGetFavoriteVoyagesByUserIdQuery } from "../slices/VoyageSlice";
import { useGetFavoriteVehiclesByUserByIdQuery } from "../slices/VehicleSlice";
import { useSelector } from "react-redux";

export default function FavoritesScreen({ navigation }) {
  const userId = useSelector((state) => state.users.userId);

  const {
    data: VoyagesData,
    isError: isErrorVoyages,
    isSuccess: isSuccessVoyages,
    isLoading: isLoadingVoyages,
    refetch: refetchVoyages,
  } = useGetFavoriteVoyagesByUserIdQuery(userId);
  const {
    data: VehiclesData,
    isError: isErrorVehicles,
    isSuccess: isSuccessVehicles,
    isLoading: isLoadingVehicles,
    refetch: refetchVehicles,
  } = useGetFavoriteVehiclesByUserByIdQuery(userId);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await refetchVehicles();
          await refetchVoyages();
        } catch (error) {
          console.error("Error refetching messages data:", error);
        }
      };

      fetchData();

      return () => {
        // Cleanup function if needed
      };
    }, [refetchVehicles, refetchVoyages, navigation])
  );

  if (isLoadingVoyages || isLoadingVehicles) {
    return <ActivityIndicator size="large" style={{ top: vh(30) }} />;
  }

  if (isErrorVehicles || isErrorVoyages) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 50 }}>error...</Text>
      </View>
    );
  }

  if (isSuccessVehicles && isSuccessVoyages) {
    return (
      <View>
        <View style={styles.mainContainer}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.innerContainer}>
              {isLoadingVoyages || isLoadingVehicles ? (
                <ActivityIndicator size="large" />
              ) : isSuccessVoyages && isSuccessVehicles ? (
                <>
                  {VehiclesData ? (
                    <>
                      <View style={styles.mainBidsContainer}>
                        <View style={styles.currentBidsAndSeeAll}>
                          <Text style={styles.currentBidsTitle}>
                            Favorite Vehicles
                          </Text>
                        </View>
                      </View>

                      <View style={styles.voyageListContainer}>
                        <VehicleList
                          style={styles.voyageList}
                          data={VehiclesData}
                        />
                      </View>
                    </>
                  ) : null}

                  {VoyagesData ? (
                    <>
                      <View style={styles.mainBidsContainer}>
                        <View style={styles.currentBidsAndSeeAll}>
                          <Text style={styles.currentBidsTitle}>
                            Favorite Voyages
                          </Text>
                        </View>
                      </View>
                      <View style={styles.voyageListContainer}>
                        <VoyageListVertical
                          style={styles.voyageList}
                          data={VoyagesData}
                        />
                      </View>
                    </>
                  ) : null}

                  {!(VoyagesData || VehiclesData) ? (
                    <View style={styles.mainBidsContainer2}>
                      <View style={styles.currentBidsAndSeeAll2}>
                        <Image
                          source={require("../assets/parrots-logo.jpg")}
                          style={styles.logoImage}
                        />

                        <Text style={styles.currentBidsTitle2}>
                          No favorites yet...
                        </Text>
                      </View>
                    </View>
                  ) : null}
                </>
              ) : null}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  logoImage: {
    height: vh(20),
    width: vh(20),
    borderRadius: vh(10),
  },
  currentBidsTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#3c9dde",
    paddingLeft: vw(5),
  },

  currentBidsAndSeeAll: {
    marginTop: vh(2),
    flexDirection: "row",
    paddingRight: vw(10),
  },
  mainBidsContainer2: {
    backgroundColor: "white",

    borderRadius: vw(5),
    padding: vh(5),
  },
  currentBidsAndSeeAll2: {
    marginTop: vh(2),
    padding: vw(5),
    alignItems: "center",
  },
  currentBidsTitle2: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3c9dde",
    paddingTop: vh(3),
  },
  mainBidsContainer: {
    borderRadius: vw(5),
    borderColor: "#93c9ed",
  },

  pageTitle: {
    marginTop: vh(5),
    backgroundColor: "green",
  },
  rectangularBox: {
    height: vh(35),
  },
  imageContainer: {
    top: vh(5),
    height: vh(40),
    width: vw(100),
  },
  scrollView: {
    height: vh(90),
    borderRadius: vh(4),
    marginTop: vh(5),
    marginBottom: vh(20),
    backgroundColor: "white",
  },
  bioBox: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginTop: vh(0),
    paddingVertical: 10,
    width: "93%",
    borderRadius: 20,
    borderColor: "rgba(190, 119, 234,0.5)",
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
    marginTop: vh(1),
    marginVertical: vh(0.1),
    width: vw(100),
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  selectedChoice: {
    paddingHorizontal: vh(6),
    paddingVertical: vh(0.3),
    borderRadius: vh(1.5),
    borderColor: "rgba(10, 119, 234,0.4)",
  },
  nonSelectedChoice: {
    paddingHorizontal: vh(6),
    paddingVertical: vh(0.3),
    borderRadius: vh(1.5),
    borderColor: "rgba(10, 119, 234,0.08)",
  },
  selectedText: {
    color: "rgba(91,91,255,1)",
    fontSize: 18,
    fontWeight: "700",
  },
  nonSelectedText: {
    fontSize: 18,
    fontWeight: "700",
    color: "rgba(91,91,255,.5)",
  },
  voyageListContainer: {
    width: vw(98),
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: vh(3),
  },
  vehicleList: {},
  blueText: {
    fontWeight: "600",
    color: "#000077",
  },
  bioText: {
    fontWeight: "600",
    color: "#878787",
    fontSize: 12,
  },
  nameContainer: {
    marginLeft: 0,
    paddingLeft: 0,
  },
  name: {
    fontSize: 19,
    fontWeight: "600",
    flexWrap: "wrap",
    flexShrink: 1,
    color: "#5b5bff",
  },
  clickableText: {
    color: "blue",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9f9fff",
  },
  bio: {
    paddingTop: 5,
  },
  socialBox: {
    flexDirection: "row",
    backgroundColor: "rgba(190, 119, 234,0.1)",

    left: vw(-4),
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    // borderWidth: 1,
    borderColor: "rgba(190, 119, 234,0.4)",
  },
  socialBox1: {
    flexDirection: "row",
    backgroundColor: "rgba(190, 119, 234,0.1)",
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,

    left: vw(-10.5),
  },
  socialBox2: {
    flexDirection: "row",
    backgroundColor: "rgba(190, 119, 234,0.1)",
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,

    left: vw(-6),
  },
  icon: {
    padding: 3,
    margin: 2,
    marginLeft: 8,
    borderRadius: 20,
    color: "rgba(0, 119, 234,0.9)",
    fontSize: 18,
  },

  iconText: {
    lineHeight: 22,
    marginVertical: 1,
    fontSize: 11,
  },
  //container of image and social
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
    // top: vh(-9),
  },
  //container of social
  social: {
    flexDirection: "column",
    width: vw(50),
    zIndex: 100,
    paddingRight: 20,
    paddingTop: 0,
    top: vh(1),
  },
  //container of image and name
  profileImageAndName: {
    left: vw(4),
    top: vh(2),
  },
  profileImage: {
    position: "absolute",
    top: vh(0.1),
    left: vh(0.1),
    height: vh(18),
    width: vh(18),
    borderRadius: vh(9),
    zIndex: 100,
  },
  solidCircleProfile: {
    height: vh(18.2),
    width: vh(18.2),
    borderRadius: vh(10),
    backgroundColor: "rgba(190, 119, 234,0.7)",
  },
  editProfileBox: {
    backgroundColor: "white",
    top: vh(-0.5),
    width: vw(30),
    left: vw(-4),
    alignSelf: "flex-end",
    flexDirection: "row",
    borderRadius: vh(2),
    padding: vw(1),
  },
  logoutBox: {
    backgroundColor: "white",
    position: "absolute",
    top: vh(-5),
    width: vw(30),
    right: vw(4),
    alignSelf: "flex-end",
    flexDirection: "row",
    borderRadius: vh(2),
    padding: vw(1),
  },
  innerProfileContainer: {
    alignSelf: "flex-end",
    flexDirection: "row",
    borderRadius: vh(2),
    paddingHorizontal: vw(2),
  },
});
