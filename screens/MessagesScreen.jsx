import { ParrotsStdText } from "../components/ParrotsStdText";
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
  BackHandler,
  AppState,
  Platform,
} from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import ConversationList from "../components/ConversationList";
import { useGetMessagesByUserIdQuery } from "../slices/MessageSlice";
import { useGetUsersByUsernameQuery, useGetBookmarksQuery } from "../slices/UserSlice";
import { setUnreadMessages, markMessagesRead } from "../slices/UserSlice";
import CreateNewGroupTab from "../components/CreateNewGroupTab";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { ConnectSelectionComponent } from "../components/ConnectSelectionComponent";
import { SearchUsersComponent } from "../components/SearchUsersComponent";
import { Feather } from "@expo/vector-icons";
import { API_URL } from "@env";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import LoadingLogo from "../components/LoadingLogo";
import { parrotBananaLeafGreen, parrotBlue, parrotBlueSemiTransparent, parrotPistachioGreen, parrotPlaceholderGrey } from "../assets/color";
import {
  register_ReceiveMessage,
  unregister_ReceiveMessage,
  register_ReceiveGroupMessage,
  unregister_ReceiveGroupMessage,
  register_OnReconnecting,
  unregister_OnReconnecting,
  register_OnReconnected,
  unregister_OnReconnected,
  invokeHub,
  isHubReady,
} from "../signalr/signalRHub.js";


export default function MessagesScreen({ navigation }) {
  const userId = useSelector((state) => state.users.userId);
  const currentUserName = useSelector((state) => state.users.userName);
  const currentUserImage = useSelector((state) => state.users.userProfileImageThumbnail || state.users.userProfileImage);
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
    isFetching: isFetchingUsers,
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

  const [selectedFunction, setSelectedFunction] = useState(1);

  const { data: bookmarksRaw, isLoading: isLoadingBookmarks } = useGetBookmarksQuery(undefined, { skip: selectedFunction !== 3 });
  const bookmarksData = React.useMemo(() => [
    ...(bookmarksRaw?.map(b => ({
      id: b.bookmarkedUserId,
      publicId: b.publicId,
      userName: b.userName,
      profileImageUrl: b.profileImageUrl,
      profileImageThumbnailUrl: b.profileImageThumbnailUrl,
    })) ?? []),
  ], [bookmarksRaw]);

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

      const handleReceiveMessage = async () => {
        try { await refetch(); } catch {}
      };

      const handleGroupMessage = async () => {
        try { await refetch(); } catch {}
      };

      register_ReceiveMessage(handleReceiveMessage);
      register_ReceiveGroupMessage(handleGroupMessage);

      return () => {
        invokeHub("LeaveMessagesScreen", userId);
        console.log("left messages screen --> ");
        unregister_ReceiveMessage(handleReceiveMessage);
        unregister_ReceiveGroupMessage(handleGroupMessage);
      };
    }, [userId, refetch])
  );


  useFocusEffect(
    useCallback(() => {
      const handleReconnecting = () => {};
      const handleReconnected = () => { setToastVisible(false); };
      register_OnReconnecting(handleReconnecting);
      register_OnReconnected(handleReconnected);
      return () => {
        setToastVisible(false);
        unregister_OnReconnecting(handleReconnecting);
        unregister_OnReconnected(handleReconnected);
      };
    }, [])
  );

  useEffect(() => {
    const unsubscribe = navigation.getParent()?.addListener("tabPress", () => {
      setSelectedFunction(1);
    });
    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      if (selectedFunction === 1) return;
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        setSelectedFunction(1);
        return true;
      });
      return () => sub.remove();
    }, [selectedFunction])
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






  useEffect(() => {
    if (!messagesData) return;
    const hasUnread = messagesData.some(m => (m.unreadCount ?? 0) > 0);
    if (!hasUnread) dispatch(markMessagesRead());
  }, [messagesData, dispatch]);

  const handleSearchUsers = () => {
    setUsername(searchText);
  };



  return (
    <View style={{ flex: 1 }}>
      <TokenExpiryGuard />

      {selectedFunction === 1 ? (
        <View style={styles.container}>
          <ConnectSelectionComponent
            selectedFunction={selectedFunction}
            setSelectedFunction={setSelectedFunction}
          />
          {hasError ? (
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
                <Image source={require("../assets/parrotslogo.png")} style={styles.logoImage} />
                <ParrotsStdText style={styles.currentBidsTitle2}>Something went wrong</ParrotsStdText>
                <ParrotsStdText style={[styles.currentBidsTitle2, { paddingTop: vh(1) }]}>Swipe down to retry</ParrotsStdText>
              </View>
            </ScrollView>
          ) : (isLoadingMessages || messagesData === undefined) ? (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: Platform.OS === "ios" ? vh(20) : 0 }}>
              <LoadingLogo size={220} />
            </View>
          ) : messagesData?.length > 0 ? (
            <View style={styles.flatlist}>
              <ConversationList
                data={messagesData}
                userId={userId}
                onOpenGroup={(gId, gName) => navigation.navigate("GroupConversationDetailScreen", { groupId: gId, groupName: gName })}
              />
            </View>
          ) : (
            <View style={styles.mainBidsContainer2}>
              <View style={styles.currentBidsAndSeeAll2}>
                <Image source={require("../assets/parrotslogo.png")} style={styles.logoImage} />
                <ParrotsStdText style={styles.currentBidsTitle2}>No messages yet...</ParrotsStdText>
              </View>
            </View>
          )}
        </View>
      ) : selectedFunction === 2 ? (
        <View style={styles.container}>
          {
            <>
              <ConnectSelectionComponent
                selectedFunction={selectedFunction}
                setSelectedFunction={setSelectedFunction}
              />

              <View style={styles.messageTextContainer}>
                <View style={{ marginHorizontal: vw(5), marginTop: vh(2) }}>
                  <View>
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
                        {isFetchingUsers
                          ? <ActivityIndicator size="small" color={parrotBlue} />
                          : <Feather name="search" size={20} color={searchText.length > 2 ? parrotBlue : parrotBlueSemiTransparent} />}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <SearchUsersComponent searchResults={isFetchingUsers ? null : (usersData ?? [])} />
              </View>
            </>
          }
        </View>
      ) : selectedFunction === 3 ? (
        <View style={styles.container}>
          <ConnectSelectionComponent
            selectedFunction={selectedFunction}
            setSelectedFunction={setSelectedFunction}
          />
          {isLoadingBookmarks ? (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: Platform.OS === "ios" ? vh(20) : 0 }}>
              <LoadingLogo size={220} />
            </View>
          ) : (
            <ScrollView style={styles.messageTextContainer}>
              {bookmarksData.length === 0 ? (
                <View style={styles.currentBidsAndSeeAll2}>
                  <Image source={require("../assets/parrotslogo.png")} style={styles.logoImage} />
                  <ParrotsStdText style={styles.currentBidsTitle2}>No bookmarks yet</ParrotsStdText>
                </View>
              ) : (
                <SearchUsersComponent searchResults={bookmarksData} height={Platform.OS === "ios" ? vh(70) : vh(80)} />
              )}
            </ScrollView>
          )}
        </View>
      ) : (
        /* Groups tab — create new group */
        <View style={styles.container}>
          <ConnectSelectionComponent
            selectedFunction={selectedFunction}
            setSelectedFunction={setSelectedFunction}
          />
          <CreateNewGroupTab
            onGroupCreated={async () => { await refetch(); setSelectedFunction(1); }}
            showToast={showToast}
          />
        </View>
      )}
      {toastVisible && (
        <View style={styles.toast}>
          <ParrotsStdText style={styles.toastText}>{toastMessage}</ParrotsStdText>
        </View>
      )}
    </View>
  );
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
    backgroundColor: "rgba(0, 119, 234, 0.02)",
    borderRadius: vh(6),
    width: vw(90),
  },
  textinputStyle: {
    fontFamily: "Nunito_700Bold",
    flex: 1,
    paddingVertical: vh(1.8),
    paddingHorizontal: vw(2),
    fontSize: 15,
    color: "black",
  },

  currentBidsTitle2: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 20,
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
    fontFamily: "Nunito_700Bold",
    color: "white",
    fontSize: 13,
  },
});
