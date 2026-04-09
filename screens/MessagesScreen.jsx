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
  ActivityIndicator,
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
import { FontAwesome, Feather } from "@expo/vector-icons";
import { Shadow } from "react-native-shadow-2";
import { API_URL } from "@env";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import { parrotBananaLeafGreen, parrotBlue, parrotBlueSemiTransparent, parrotBlueSemiTransparent2, parrotBlueSemiTransparent3, parrotBlueTransparent, parrotCream, parrotPistachioGreen, parrotPlaceholderGrey } from "../assets/color";
import {
  register_ReceiveMessage,
  unregister_ReceiveMessage,
  register_ReceiveMessageRefetch,
  unregister_ReceiveMessageRefetch,
  register_OnReconnecting,
  unregister_OnReconnecting,
  register_OnReconnected,
  unregister_OnReconnected,
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
  } = useGetUsersByUsernameQuery(username, { skip: username.length < 3, refetchOnMountOrArgChange: true });

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

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
      console.log("enter messages screen --> ");

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


  useFocusEffect(
    useCallback(() => {
      const handleReconnecting = () => {
        showToast("Connection lost - Reconnecting...");
      };
      const handleReconnected = () => {
        setToastVisible(false);
        showToast("Reconnected");
      };
      register_OnReconnecting(handleReconnecting);
      register_OnReconnected(handleReconnected);
      return () => {
        setToastVisible(false);
        unregister_OnReconnecting(handleReconnecting);
        unregister_OnReconnected(handleReconnected);
      };
    }, [])
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
  const handleSearchUsers = () => {
    setUsername(searchText);
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

  if (isLoadingMessages) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
        <ActivityIndicator size="large" color={parrotBlue} />
      </View>
    );
  }

  if (isSuccessMessages) {
    return (
      <View style={{ flex: 1 }}>
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
                  <View style={{ marginHorizontal: vw(5), marginTop: vh(2) }}>
                  <Shadow
                    distance={8}
                    offset={[0, 0]}
                    startColor="rgba(0,0,0,0.08)"
                    finalColor="rgba(0,0,0,0.13)"
                    style={{ borderRadius: vh(6) }}
                  >
                    <View style={styles.searchBar}>
                      <TextInput
                        onChangeText={(text) => {
                          setSearchText(text);
                        }}
                        style={styles.textinputStyle}
                        numberOfLines={1}
                        placeholder="Search by username..."
                        placeholderTextColor={parrotPlaceholderGrey}
                      >
                        {searchText}
                      </TextInput>
                      <TouchableOpacity
                        onPress={handleSearchUsers}
                        style={styles.magnifier}
                      >
                        <Feather
                          name="search"
                          size={20}
                          color={searchText.length > 2 ? parrotBlue : parrotBlueSemiTransparent}
                        />
                      </TouchableOpacity>
                    </View>
                  </Shadow>
                  </View>
                  <SearchUsersComponent searchResults={usersData} />
                </View>
              </>
            }
          </View>
        )}
        {toastVisible && (
          <View style={styles.toast}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  magnifier: {
    alignSelf: "center",
    width: vw(10),
    height: vw(10),
    backgroundColor: "rgba(30, 111, 217, 0.08)",
    borderRadius: vw(5),
    marginRight: vw(1),
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: vw(3),
    backgroundColor: "white",
    borderRadius: vh(6),
    width: vw(90),
    borderWidth: 1.5,
    borderColor: "rgba(30, 111, 217, 0.15)",
  },
  textinputStyle: {
    flex: 1,
    paddingVertical: vh(1.8),
    paddingHorizontal: vw(2),
    fontSize: 15,
    color: "black",
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
  toast: {
    position: "absolute",
    bottom: vh(10),
    alignSelf: "center",
    backgroundColor: "rgba(30, 111, 217, 0.9)",
    paddingHorizontal: vw(4),
    paddingVertical: vh(1),
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  toastText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
});
