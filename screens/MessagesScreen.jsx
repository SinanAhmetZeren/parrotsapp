/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useRef } from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
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
import { useGetMessagesByUserIdQuery } from "../slices/MessageSlice";
import { useGetUsersByUsernameQuery } from "../slices/UserSlice";
import { setUnreadMessages } from "../slices/UserSlice";

import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { ConnectSelectionComponent } from "../components/ConnectSelectionComponent";
import { SearchUsersComponent } from "../components/SearchUsersComponent";
import { FontAwesome } from "@expo/vector-icons";
import { API_URL } from "@env";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import { parrotBananaLeafGreen, parrotBlue, parrotBlueSemiTransparent, parrotBlueSemiTransparent2, parrotBlueSemiTransparent3, parrotBlueTransparent, parrotCream, parrotPistachioGreen, parrotPlaceholderGrey } from "../assets/color";
import {
  register_ReceiveMessage,
  unregister_ReceiveMessage,
  register_ReceiveMessageRefetch,
  unregister_ReceiveMessageRefetch,
  invokeHub
} from "../signalr/signalRHub.js";


export default function MessagesScreen({ navigation }) {
  const userId = useSelector((state) => state.users.userId);
  const [searchText, setSearchText] = useState("");
  const [username, setUsername] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const dispatch = useDispatch();
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



  // Handle API error state
  useEffect(() => {
    setHasError(isErrorMessages);
  }, [isErrorMessages]);



  // 🟢 SignalR subscriptions
  useFocusEffect(
    useCallback(() => {

      if (!userId) return;

      // Tell hub user entered this screen
      invokeHub("EnterMessagesScreen", userId);
      console.log("entered messages screen <-- ");

      dispatch(setUnreadMessages(false));


      // Handle incoming message
      const handleReceiveMessage = (
        senderId,
        content,
        newTime,
        senderProfileUrl,
        senderUsername
      ) => {
        setReceivedMessageData([
          senderId,
          content,
          newTime,
          senderProfileUrl,
          senderUsername
        ]);
      };

      // Handle refetch request
      const handleRefetch = async () => {
        try {
          await refetch();
        } catch (err) {
          console.error("Failed to refetch messages:", err);
        }
      };

      // ✅ register handlers
      register_ReceiveMessage(handleReceiveMessage);
      register_ReceiveMessageRefetch(handleRefetch);

      // ✅ cleanup
      return () => {
        invokeHub("LeaveMessagesScreen", userId);
        console.log("left messages screen --> ");
        unregister_ReceiveMessage(handleReceiveMessage);
        unregister_ReceiveMessageRefetch(handleRefetch);
      };
    }, [userId, refetch])
  );


  // Refetch when screen gains focus
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await refetch();
        } catch (error) {
          console.error("Error refetching messages:", error);
        }
      };
      fetchData();
    }, [refetch])
  );

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      setHasError(false);
    } catch (error) {
      console.error(error);
      setHasError(true);
    } finally {
      setRefreshing(false);
    }
  };






  // Sync messages from API updates
  useEffect(() => {
    if (messagesData) setReceivedMessageData(messagesData);
  }, [messagesData]);

  // Search users handler
  const handleSearchUsers = async () => {
    setUsername(searchText);
    try {
      await refetchUsers();
    } catch (err) {
      console.error("Error refetching users:", err);
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
            colors={[parrotPistachioGreen, parrotBananaLeafGreen]}
            tintColor={parrotBananaLeafGreen}
          />
        }
      >
        <View style={styles.currentBidsAndSeeAll2}>
          <Image
            source={require("../assets/parrotslogo.png")}
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
        <TokenExpiryGuard />

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
                      source={require("../assets/parrotslogo.png")}
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
                      placeholder="Type username"
                      placeholderTextColor={parrotPlaceholderGrey}
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
                            color={parrotBlue}
                          />
                        ) : (
                          <FontAwesome
                            name="search"
                            size={24}
                            color={parrotBlueSemiTransparent}
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
    backgroundColor: parrotBlueTransparent,
    borderRadius: vw(10),
  },

  searchBar: {
    flexDirection: "row",
    paddingLeft: vh(2),
    backgroundColor: "white",
    marginHorizontal: vw(2),
    borderRadius: vh(3),
  },
  textinputStyle: {
    padding: vh(1),
    margin: vh(1),
    alignSelf: "center",
    backgroundColor: parrotCream,
    width: vw(75),
    height: vh(5),
    borderRadius: vh(2),
  },

  currentBidsTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: parrotBlue,
    paddingLeft: vw(5),
  },
  selectedTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: parrotBlue,
    paddingLeft: vw(5),
  },
  currentBidsAndSeeAll: {
    marginTop: vh(2),
    flexDirection: "row",
    paddingRight: vw(10),
  },

  currentBidsTitle2: {
    fontSize: 20,
    fontWeight: "700",
    color: parrotBlue,
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
    marginTop: vh(2),
    width: vw(94),
    justifyContent: "center",
    alignSelf: "center",
  },
});
