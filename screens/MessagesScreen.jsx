/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  ScrollView,
} from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import ConversationList from "../components/ConversationList";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useGetMessagesByUserIdQuery } from "../slices/MessageSlice";
import { useGetUsersByUsernameQuery } from "../slices/UserSlice";

import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { ConnectSelectionComponent } from "../components/ConnectSelectionComponent";
import { SearchUsersComponent } from "../components/SearchUsersComponent";
import { FontAwesome } from "@expo/vector-icons";
import { API_URL } from "@env";

export default function MessagesScreen({ navigation }) {
  const userId = useSelector((state) => state.users.userId);
  const [searchText, setSearchText] = useState("");
  const [username, setUsername] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    isError: isErrorMessages,
    error: errorMessages,
    isSuccess: isSuccessMessages,
    refetch,
  } = useGetMessagesByUserIdQuery(userId);

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUser,
    isSuccess: isSuccessUsers,
    refetch: refetchUsers,
  } = useGetUsersByUsernameQuery(username);

  const [receivedMessageData, setReceivedMessageData] = useState("");
  const [selectedFunction, setSelectedFunction] = useState(1);

  const recipientId = userId;
  const hubConnection = useMemo(() => {
    return new HubConnectionBuilder()
      .withUrl(`${API_URL}/chathub/11?userId=${userId}`)
      .build();
  }, [userId]);

  useEffect(() => {
    if (isErrorMessages) {
      setHasError(true);
    }
    if (!isErrorMessages) {
      setHasError(false);
    }
  }, [isErrorMessages]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await Promise.all([refetch()]);
        } catch (error) {
          console.error("Error refetching messages data:", error);
        }
        await refetch();
      };
      fetchData();
      return () => {
        // Cleanup function if needed
      };
    }, [refetch, navigation])
  );

  const onRefresh = () => {
    setRefreshing(true);
    console.log("refreshing ");
    try {
      refetch();
      setHasError(false);
      console.log("refreshing 2 ");
    } catch (error) {
      console.log(error);
      setHasError(true);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    const startHubConnection = async () => {
      try {
        await hubConnection.start();
        console.log("SignalR connection started successfully.");
      } catch (error) {
        console.error("Failed to start SignalR connection:", error);
      }
    };
    startHubConnection();
    hubConnection.on(
      "ReceiveMessage",
      async (senderId, content, newTime, senderProfileUrl, senderUsername) => {
        setReceivedMessageData([
          senderId,
          content,
          newTime,
          senderProfileUrl,
          senderUsername,
        ]);
      }
    );

    hubConnection.on("ReceiveMessageRefetch", async () => {
      refetch();
    });

    return () => {
      // hubConnection.stop();
    };
  }, []);

  const handleSearchUsers = async () => {
    setUsername(searchText);
    try {
      await refetchUsers();
      console.log("refetching: ", usersData);
    } catch (error) {
      console.error("Error refetching users data:", error);
    }
  };

  if (hasError) {
    return (
      <ScrollView
        style={styles.mainBidsContainer2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#9Bd35A", "#689F38"]} // Android
            tintColor="#689F38" // iOS
          />
        }
      >
        <View style={styles.currentBidsAndSeeAll2}>
          <Image
            source={require("../assets/ParrotsWhiteBg.png")}
            style={styles.logoImage}
          />
          <Text style={styles.currentBidsTitle2}>Connection Error</Text>
          <Text style={styles.currentBidsTitle2}>Swipe down to retry</Text>
        </View>
      </ScrollView>
    );
  }

  if (isSuccessMessages) {
    return (
      <>
        {selectedFunction === 1 ? (
          <View style={styles.container}>
            {messagesData ? (
              <>
                <ConnectSelectionComponent
                  selectedFunction={selectedFunction}
                  setSelectedFunction={setSelectedFunction}
                />
                <View style={styles.flatlist}>
                  <ConversationList data={messagesData} userId={userId} />
                </View>
              </>
            ) : (
              <>
                <ConnectSelectionComponent
                  selectedFunction={selectedFunction}
                  setSelectedFunction={setSelectedFunction}
                />

                <View style={styles.mainBidsContainer2}>
                  <View style={styles.currentBidsAndSeeAll2}>
                    <Image
                      source={require("../assets/ParrotsWhiteBg.png")}
                      style={styles.logoImage}
                    />

                    <Text style={styles.currentBidsTitle2}>
                      No messages yet...
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        ) : (
          <View style={styles.container}>
            {
              <>
                <ConnectSelectionComponent
                  selectedFunction={selectedFunction}
                  setSelectedFunction={setSelectedFunction}
                />

                <View style={styles.messageTextContainer}>
                  <View style={styles.searchBar}>
                    <TextInput
                      onChangeText={(text) => {
                        setSearchText(text);
                      }}
                      style={styles.textinputStyle}
                      numberOfLines={1}
                      placeholder="Type username "
                      placeholderTextColor="#a3b4c5"
                    >
                      {searchText}
                    </TextInput>
                    <TouchableOpacity
                      onPress={handleSearchUsers}
                      style={styles.magnifier}
                    >
                      <Text>
                        {searchText.length > 2 ? (
                          <FontAwesome
                            name="search"
                            size={24}
                            color="#3c9dde"
                          />
                        ) : (
                          <FontAwesome
                            name="search"
                            size={24}
                            color="rgba(118, 186, 232,0.35)"
                          />
                        )}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <SearchUsersComponent searchResults={usersData} />
                </View>
              </>
            }
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  magnifier: {
    alignSelf: "center",
    padding: vw(3),
    backgroundColor: "rgba(118, 186, 232,0.15)",
    borderRadius: vw(10),
  },

  searchBar: {
    flexDirection: "row",
    paddingLeft: vh(2),
    backgroundColor: "#fefdfd",
    marginHorizontal: vw(2),
    borderRadius: vh(3),
  },
  textinputStyle: {
    padding: vh(1),
    margin: vh(1),
    alignSelf: "center",
    backgroundColor: "#f9f5f1",
    width: vw(75),
    height: vh(5),
    borderRadius: vh(2),
  },

  currentBidsTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#3c9dde",
    paddingLeft: vw(5),
  },
  selectedTitle: {
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
  mainBidsContainer: {
    borderRadius: vw(5),
    borderColor: "#93c9ed",
  },
  currentBidsTitle2: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3c9dde",
    paddingTop: vh(3),
  },
  logoImage: {
    height: vh(20),
    width: vh(20),
    borderRadius: vh(10),
  },
  currentBidsAndSeeAll2: {
    marginTop: vh(2),
    alignItems: "center",
    alignSelf: "center",
  },
  mainBidsContainer2: {
    marginTop: vh(7.5),
    borderRadius: vw(5),
  },
  container: {
    backgroundColor: "white",
    width: vw(100),
    alignSelf: "center",
    height: vh(100),
  },
  flatlist: {
    backgroundColor: "yellow",
    marginTop: vh(2),
    width: vw(94),
    justifyContent: "center",
    alignSelf: "center",
  },
});
