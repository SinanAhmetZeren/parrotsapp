/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { Image } from "react-native-elements";

const formatDate = (dateString) => {
  const date = new Date(dateString);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  const formattedDate1 = `${hours}:${minutes}`;
  const formattedDate2 = `${day}-${month}-${year}`;

  return [formattedDate1, formattedDate2];
};

export default function MessagesComponent({
  data,
  userName,
  userProfileImage,
  otherUserProfileImg,
  otherUserName,
  currentUserId,
}) {
  const renderMessages = () => {
    return data.map((item, index) => {
      return (
        <View key={index}>
          {item.senderId === currentUserId ? (
            <View style={styles.MessageMainContainerRight}>
              <View style={styles.MessageContainer}>
                <View style={styles.imageContainer1}>
                  <Image
                    source={{
                      uri: `https://measured-wolf-grossly.ngrok-free.app/Uploads/UserImages/${userProfileImage}`,
                    }}
                    style={styles.voyageImage1}
                  />
                </View>

                <View>
                  <Text style={styles.userName}>{userName}</Text>

                  <View style={styles.messageBox}>
                    <Text style={styles.messageText}>{item.text}</Text>
                  </View>

                  <View style={styles.dateBox}>
                    <Text style={styles.timeDisplay}>
                      {formatDate(item.dateTime)[0]}
                      {"  "}
                    </Text>
                    <Text style={styles.dateDisplay}>
                      {formatDate(item.dateTime)[1]}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.MessageMainContainer}>
              <View style={styles.MessageContainer}>
                <View style={styles.imageContainer1}>
                  <Image
                    source={{
                      uri: `https://measured-wolf-grossly.ngrok-free.app/Uploads/UserImages/${otherUserProfileImg}`,
                    }}
                    style={styles.voyageImage1}
                  />
                </View>

                <View>
                  <Text style={styles.userName}>{otherUserName}</Text>

                  <View style={styles.messageBox}>
                    <Text style={styles.messageText}>{item.text}</Text>
                  </View>

                  <View style={styles.dateBox}>
                    <Text style={styles.timeDisplay}>
                      {formatDate(item.dateTime)[0]}
                      {"  "}
                    </Text>
                    <Text style={styles.dateDisplay}>
                      {formatDate(item.dateTime)[1]}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      );
    });
  };

  return <View style={styles.container}>{renderMessages()}</View>;
}

const styles = StyleSheet.create({
  imageContainer1: {
    justifyContent: "center",
    marginRight: vw(2),
  },
  messageText: {
    fontWeight: "500",
    color: "#999",
  },
  messageBox: {
    width: vw(60),
  },
  MessageMainContainer: {
    marginTop: vh(1),
    padding: vh(1),
    backgroundColor: "#f7f7f7",
    borderRadius: vh(2),
    width: vw(80),
  },
  MessageMainContainerRight: {
    marginTop: vh(1),
    paddingHorizontal: vh(1),
    backgroundColor: "#f7f7f7",
    borderRadius: vh(2),
    width: vw(80),
    alignSelf: "flex-end",
  },
  timeDisplay: {
    color: "grey",
    fontWeight: "400",
    fontSize: 11,
  },
  dateDisplay: {
    fontWeight: "400",
    color: "#a2a2a2",
    color: "grey",

    fontSize: 11,
  },
  dateBox: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginTop: vh(0.3),
  },
  userName: {
    color: "orange",
  },
  MessageContainer: {
    flexDirection: "row",
  },
  container: {
    backgroundColor: "white",
    marginBottom: 50,
  },
  voyageImage1: {
    height: vh(4),
    width: vh(4),
    marginRight: vh(1),
    borderRadius: vh(3),
  },
});
