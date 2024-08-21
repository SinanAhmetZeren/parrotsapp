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
  TouchableOpacity,
} from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import FavoriteVoyageListVertical from "../components/FavoriteVoyageListVertical";
import FavoriteVehicleList from "../components/FavoriteVehicleList";
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
                        <FavoriteVehicleList
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
                        <FavoriteVoyageListVertical
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
                          source={require("../assets/ParrotsWhiteBg.png")}
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
  scrollView: {
    height: vh(90),
  },

  voyageListContainer: {
    width: vw(98),
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: vh(3),
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9f9fff",
  },
});
