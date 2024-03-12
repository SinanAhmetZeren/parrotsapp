/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  textInput,
} from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";

export const RenderWaypointFlatList = ({ addedWayPoints }) => {
  return (
    <FlatList
      horizontal
      data={addedWayPoints}
      keyExtractor={(item) => item.order}
      renderItem={({ item, index }) => {
        return (
          <View key={index}>
            <WaypointItem
              title={item.title}
              description={item.description}
              imageUri={item.imageUri}
            />
          </View>
        );
      }}
    />
  );
};

export const WaypointItem = ({ title, description, imageUri }) => {
  const [modalVisible, setModalVisible] = useState(false);
  console.log("title: ", title);

  const truncatedDescription =
    description.length > 70 ? `${description.slice(0, 70)}...` : description;

  return (
    <View style={styles.waypointCard}>
      <View>
        <Image source={{ uri: imageUri }} style={styles.profileImage} />
      </View>

      <View style={styles.titleAndDescription}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{truncatedDescription}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: "600",
    paddingBottom: vh(1),
  },
  description: {
    width: vw(35),
  },
  titleAndDescription: {
    paddingVertical: vh(1),
  },
  waypointCard: {
    width: vw(70),
    flexDirection: "row",
    backgroundColor: "#eff3f6",
    borderRadius: vh(3),
    margin: vh(0.2),
  },
  profileImage: {
    margin: vh(1),
    width: vh(13),
    height: vh(13),
    borderRadius: vh(3),
    borderColor: "rgba(0, 119, 234,0.3)",
    backgroundColor: "white",
  },
});
