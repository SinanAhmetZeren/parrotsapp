/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import { useRef, useEffect } from "react";
import { vh, vw } from "react-native-expo-viewport-units";
import { API_URL } from "@env";
import { parrotBlueDarkTransparent, parrotBlueDarkTransparent2, parrotBlueSemiTransparent, parrotBlueSemiTransparent2, parrotCream, parrotInputTextColor, parrotLightBlue } from "../assets/color";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate();
  // const month = date.toLocaleString("default", { month: "short" });
  const month = date.toLocaleString("en-US", { month: "short" });
  // const year = date.getFullYear();
  const year = date.getFullYear().toString().slice(-2);
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
  scrollViewRef,
}) {
  const renderMessages = () => {
    if (data && Array.isArray(data) && data.length > 0) {

      // console.log("Last message from inside component:   ", data[data.length - 1].text);
      // console.log("messages length:   ", data.length);
      return data.map((item, index) => {
        return (
          <View key={index}>
            {item.senderId === currentUserId ? (
              <View style={styles.MessageMainContainerRight}>
                <View style={styles.MessageContainer}>
                  <View style={styles.imageContainer1}>
                    <Image
                      source={{
                        uri: `${userProfileImage}`,
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
                        uri: `${otherUserProfileImg}`,
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
    }
    return null;
  };
  // const scrollViewRef = useRef();

  useEffect(() => {
    if (scrollViewRef.current && data && data.length > 0) {
      requestAnimationFrame(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      });
    }
  }, [
    scrollViewRef.current,
    data]);




  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>
      {renderMessages()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageContainer1: {
    justifyContent: "center",
    marginRight: vw(2),
  },
  messageText: {
    fontWeight: "500",
    color: parrotInputTextColor,
  },
  messageBox: {
    width: vw(60),
  },
  MessageMainContainer: {
    marginTop: vh(1),
    // padding: vh(1),
    backgroundColor: parrotCream,
    borderRadius: vh(2),
    width: vw(80),
  },
  MessageMainContainerRight: {
    marginTop: vh(1),
    paddingHorizontal: vh(1),
    backgroundColor: parrotCream,
    borderRadius: vh(2),
    width: vw(80),
    alignSelf: "flex-end",
  },
  timeDisplay: {
    color: "grey",
    color: parrotBlueDarkTransparent2,
    fontWeight: "400",
    fontSize: 11,
  },
  dateDisplay: {
    fontWeight: "400",
    color: "grey",
    color: parrotBlueDarkTransparent,

    fontSize: 11,
  },
  dateBox: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginTop: vh(0.3),
  },
  userName: {
    color: parrotLightBlue,
  },
  MessageContainer: {
    flexDirection: "row",
  },
  container: {
    backgroundColor: "white",
    marginBottom: vh(2),
  },
  voyageImage1: {
    height: vh(4),
    width: vh(4),
    marginRight: vh(1),
    borderRadius: vh(3),
  },
});
