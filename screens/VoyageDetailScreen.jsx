/* eslint-disable no-unused-vars */
// VehicleDetailScreen.js
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useGetVoyageByIdQuery } from "../slices/VoyageSlice";
import { vh } from "react-native-expo-viewport-units";

const VoyageDetailScreen = () => {
  const route = useRoute();
  const { voyageId } = route.params;
  console.log("hello from: ", voyageId);

  const {
    data: VoyageData,
    isSuccess: isSuccessVoyages,
    isLoading: isLoadingVoyages,
  } = useGetVoyageByIdQuery(voyageId);

  const renderBids = (bids) => {
    return bids.map((bid, index) => <Text key={index}>{bid.userId}</Text>);
  };

  const renderWaypoints = (waypoints) => {
    return waypoints.map((w, index) => {
      // console.log(w.latitude);
      return <Text key={index}>{w.latitude}</Text>;
    });
  };

  if (isSuccessVoyages) {
    const bids = VoyageData.bids || [];
    const waypoints = VoyageData.waypoints || [];
    // console.log(waypoints);

    return (
      <ScrollView style={{ backgroundColor: "lavenderblush" }}>
        <View style={{ top: vh(10), padding: vh(4), height: vh(130) }}>
          <Text>
            {VoyageData.name} {"\n"}
          </Text>
          <Text>
            {VoyageData.description} {"\n"}
          </Text>
          <Text>
            {VoyageData.vacancy} {"\n"}
          </Text>
          <Text>
            {VoyageData.startDate} {"\n"}
          </Text>
          <Text>
            {VoyageData.endDate} {"\n"}
          </Text>

          <View style={{ backgroundColor: "lightblue" }}>
            <Text>User{"\n"}</Text>
            <Text>
              {VoyageData.user.userName} {"\n"}
            </Text>

            <Text>
              {VoyageData.user.profileImageUrl} {"\n"}
            </Text>

            <Text>
              {VoyageData.user.id} {"\n"}
            </Text>
          </View>
          <View style={{ backgroundColor: "cornsilk" }}>
            <Text>Bids{"\n"}</Text>
            <View>{renderBids(bids)}</View>
          </View>
          <View style={{ backgroundColor: "honeydew" }}>
            <Text>Waypoints{"\n"}</Text>
            <View>{renderWaypoints(waypoints)}</View>
          </View>
        </View>
      </ScrollView>
    );
  }
};

export default VoyageDetailScreen;
