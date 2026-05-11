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
  TouchableWithoutFeedback,
  Modal,
  Image,
  TextInput,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  BackHandler,
} from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import ConversationList from "../components/ConversationList";
import { useGetMessagesByUserIdQuery } from "../slices/MessageSlice";
import { useGetUsersByUsernameQuery, useGetBookmarksQuery } from "../slices/UserSlice";
import { setUnreadMessages } from "../slices/UserSlice";
import { useCreateGroupMutation, useAddGroupMemberMutation } from "../slices/GroupSlice";
import {
  register_ReceiveGroupMessageRefetch,
  unregister_ReceiveGroupMessageRefetch,
} from "../signalr/signalRHub.js";

import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { ConnectSelectionComponent } from "../components/ConnectSelectionComponent";
import { SearchUsersComponent } from "../components/SearchUsersComponent";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { Shadow } from "react-native-shadow-2";
import { API_URL } from "@env";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import { parrotBananaLeafGreen, parrotBlue, parrotBlueSemiTransparent, parrotBlueSemiTransparent2, parrotBlueSemiTransparent3, parrotBlueTransparent, parrotCream, parrotPistachioGreen, parrotPlaceholderGrey, parrotLightBlue, parrotRed } from "../assets/color";
import {
  register_ReceiveMessage,
  unregister_ReceiveMessage,
  register_ReceiveMessageRefetch,
  unregister_ReceiveMessageRefetch,
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
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUser,
    isSuccess: isSuccessUsers,
  } = useGetUsersByUsernameQuery(username, { skip: username.length < 3, refetchOnMountOrArgChange: true });

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [groupKeyboardOffset, setGroupKeyboardOffset] = useState(vh(8));
  const [groupDropdownVisible, setGroupDropdownVisible] = useState(false);
  // Groups tab state
  const [newGroupName, setNewGroupName] = useState("");
  const [groupMemberSearch, setGroupMemberSearch] = useState("");
  const [groupMemberQuery, setGroupMemberQuery] = useState("");
  const [addedMembers, setAddedMembers] = useState([]);
  const [firstGroupMessage, setFirstGroupMessage] = useState("");
  const [createGroup] = useCreateGroupMutation();
  const [addGroupMember] = useAddGroupMemberMutation();

  const { data: groupMemberResults, isFetching: isFetchingGroupMembers } = useGetUsersByUsernameQuery(groupMemberQuery, {
    skip: groupMemberQuery.length < 3,
  });

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const [receivedMessageData, setReceivedMessageData] = useState("");
  const [selectedFunction, setSelectedFunction] = useState(1);

  const { data: bookmarksRaw, isLoading: isLoadingBookmarks } = useGetBookmarksQuery(undefined, { skip: selectedFunction !== 3 });
  const bookmarksData = React.useMemo(() => bookmarksRaw?.map(b => ({
    id: b.bookmarkedUserId,
    publicId: b.publicId,
    userName: b.userName,
    profileImageUrl: b.profileImageUrl,
    profileImageThumbnailUrl: b.profileImageThumbnailUrl,
  })) ?? [], [bookmarksRaw]);

  const recipientId = userId;



  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => setGroupKeyboardOffset(e.endCoordinates.height));
    const hide = Keyboard.addListener("keyboardDidHide", () => setGroupKeyboardOffset(vh(8)));
    return () => { show.remove(); hide.remove(); };
  }, []);

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

      const handleGroupRefetch = async () => {
        try { await refetch(); } catch { }
      };

      register_ReceiveMessage(handleReceiveMessage);
      register_ReceiveMessageRefetch(handleRefetch);
      register_ReceiveGroupMessageRefetch(handleGroupRefetch);

      return () => {
        invokeHub("LeaveMessagesScreen", userId);
        console.log("left messages screen --> ");
        unregister_ReceiveMessage(handleReceiveMessage);
        unregister_ReceiveMessageRefetch(handleRefetch);
        unregister_ReceiveGroupMessageRefetch(handleGroupRefetch);
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






  // Sync messages from API updates
  useEffect(() => {
    if (messagesData) setReceivedMessageData(messagesData);
  }, [messagesData]);

  const handleSearchUsers = () => {
    setUsername(searchText);
  };

  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const handleCreateGroupAndSend = async () => {
    if (!newGroupName.trim() || !firstGroupMessage.trim() || addedMembers.length === 0) return;
    setIsCreatingGroup(true);
    try {
      const groupResult = await createGroup({ name: newGroupName.trim(), creatorId: userId }).unwrap();
      const groupId = groupResult.id ?? groupResult.Id ?? groupResult.data?.id;
      if (!groupId) return;
      await Promise.all(addedMembers.map((m) => addGroupMember({ groupId, userId: m.Id ?? m.id, requesterId: userId })));
      await invokeHub("SendGroupMessage", userId, groupId, firstGroupMessage.trim());
      await refetch();
      setSelectedFunction(1);
      setNewGroupName("");
      setFirstGroupMessage("");
      setAddedMembers([]);
      setGroupMemberSearch("");
      setGroupMemberQuery("");
    } catch (e) {
      showToast("Could not create group - Please try again.");
    } finally {
      setIsCreatingGroup(false);
    }
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
                <Text style={styles.currentBidsTitle2}>Something went wrong</Text>
                <Text style={styles.currentBidsTitle2}>Swipe down to retry</Text>
              </View>
            </ScrollView>
          ) : (isLoadingMessages || messagesData === undefined) ? (
            <ActivityIndicator size="large" color={parrotBlue} style={{ marginTop: vh(5) }} />
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
                <Text style={styles.currentBidsTitle2}>No messages yet...</Text>
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
                <SearchUsersComponent searchResults={isLoadingUsers ? null : usersData} />
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
          <ScrollView style={styles.messageTextContainer}>
            {isLoadingBookmarks ? (
              <ActivityIndicator size="large" color={parrotBlue} style={{ marginTop: vh(5) }} />
            ) : bookmarksData.length === 0 ? (
              <View style={styles.currentBidsAndSeeAll2}>
                <Image source={require("../assets/parrotslogo.png")} style={styles.logoImage} />
                <Text style={styles.currentBidsTitle2}>No bookmarks yet</Text>
              </View>
            ) : (
              <SearchUsersComponent searchResults={bookmarksData} />
            )}
          </ScrollView>
        </View>
      ) : (
        /* Groups tab — create new group */
        <View style={styles.container}>
          <ConnectSelectionComponent
            selectedFunction={selectedFunction}
            setSelectedFunction={setSelectedFunction}
          />
          <View style={styles.groupsTabContainer}>

            <Text style={styles.groupsTabTitle}>Create New Group</Text>

            <View style={{ backgroundColor: parrotCream, borderRadius: vh(2), paddingTop: vh(1.5), paddingBottom: vh(0.5), paddingHorizontal: vw(2), marginBottom: vh(1) }}>
              {/* 1. Group name */}
              <View style={styles.groupInputRow}>
                <Shadow distance={8} offset={[0, 0]} startColor="rgba(0,0,0,0.08)" finalColor="rgba(0,0,0,0.13)" style={{ borderRadius: vh(6) }}>
                  <View style={[styles.searchBar, { width: vw(85), backgroundColor: "white" }]}>
                    <TextInput
                      style={styles.textinputStyle}
                      placeholder="Group name..."
                      placeholderTextColor={parrotPlaceholderGrey}
                      value={newGroupName}
                      onChangeText={setNewGroupName}
                      numberOfLines={1}
                    />
                  </View>
                </Shadow>
              </View>

              {/* 2. Search bar + floating results */}
              <View style={styles.groupSearchWrapper}>
                <Shadow distance={8} offset={[0, 0]} startColor="rgba(0,0,0,0.08)" finalColor="rgba(0,0,0,0.13)" style={{ borderRadius: vh(6) }}>
                  <View style={[styles.searchBar, { width: vw(85), backgroundColor: "white" }]}>
                    <TextInput
                      style={styles.textinputStyle}
                      placeholder="Search users to add..."
                      placeholderTextColor={parrotPlaceholderGrey}
                      value={groupMemberSearch}
                      onChangeText={setGroupMemberSearch}
                      numberOfLines={1}
                      onSubmitEditing={() => { if (groupMemberSearch.length >= 3) { setGroupMemberQuery(groupMemberSearch); setGroupDropdownVisible(true); } }}
                    />
                    <TouchableOpacity
                      style={styles.magnifier}
                      onPress={() => { if (groupMemberSearch.length >= 3) { setGroupMemberQuery(groupMemberSearch); setGroupDropdownVisible(true); } }}
                      disabled={groupMemberSearch.length < 3}
                    >
                      <Feather name="search" size={20} color={groupMemberSearch.length > 2 ? parrotBlue : parrotBlueSemiTransparent} />
                    </TouchableOpacity>
                  </View>
                </Shadow>

                {/* Floating dropdown */}
                <Modal visible={groupDropdownVisible} transparent animationType="none" onRequestClose={() => setGroupDropdownVisible(false)}>
                  <TouchableWithoutFeedback onPress={() => setGroupDropdownVisible(false)}>
                    <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}>
                      <View style={styles.groupSearchDropdown} onStartShouldSetResponder={() => true}>
                        <ScrollView keyboardShouldPersistTaps="handled">
                          {/* [...Array.from({ length: 20 }, (_, i) => ({ id: `dummy-${i}`, Id: `dummy-${i}`, userName: `user_${i + 1}`, profileImageUrl: `https://i.pravatar.cc/150?img=${i + 1}`, profileImageThumbnailUrl: `https://i.pravatar.cc/150?img=${i + 1}` }))] */}
                          {(isFetchingGroupMembers ? [] : (groupMemberResults ?? []))
                            .filter((u) => !addedMembers.find((m) => (m.Id ?? m.id) === (u.Id ?? u.id)) && (u.Id ?? u.id) !== userId)
                            .map((u) => (
                              <View key={u.Id ?? u.id} style={{ borderRadius: vh(6), marginBottom: vh(1), alignItems: "center" }}>
                                <Shadow distance={7} offset={[0, 0]} startColor="rgba(0,0,0,0.08)" finalColor="rgba(0,0,0,0.23)">
                                  <View style={styles.pillContainer}>
                                    <View style={styles.pillProfile}>
                                      <Image source={{ uri: u.profileImageThumbnailUrl || u.profileImageUrl }} style={styles.pillAvatar} />
                                      <Text style={styles.pillName}>{u.userName}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.addMemberBtn} onPress={() => { setAddedMembers((prev) => [...prev, u]); setGroupDropdownVisible(false); setGroupMemberSearch(""); setGroupMemberQuery(""); }}>
                                      <Text style={styles.addMemberBtnText}>Add</Text>
                                    </TouchableOpacity>
                                  </View>
                                </Shadow>
                              </View>
                            ))}
                        </ScrollView>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
              </View>
            </View>

            {/* 3. Added users */}
            <Text style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 16, color: parrotLightBlue, marginTop: vh(2), marginLeft: vw(5) }}>Members</Text>
            <View style={{ height: vh(45), marginTop: vh(1), opacity: groupDropdownVisible ? 0.1 : 1 }}>
              <ScrollView style={{ flex: 1, backgroundColor: parrotCream, borderRadius: vh(2) }} contentContainerStyle={{ alignItems: "center", paddingTop: vh(2), paddingBottom: vh(1) }} nestedScrollEnabled>
                <View style={{ borderRadius: vh(6), marginBottom: vh(1) }}>
                  <Shadow distance={7} offset={[0, 0]} startColor="rgba(0,0,0,0.08)" finalColor="rgba(0,0,0,0.23)">
                    <View style={styles.pillContainer}>
                      <View style={styles.pillProfile}>
                        <Image source={{ uri: currentUserImage }} style={styles.pillAvatar} />
                        <Text style={styles.pillName}>{currentUserName} (you)</Text>
                      </View>
                    </View>
                  </Shadow>
                </View>
                {addedMembers.map((m) => (
                  <View key={m.Id ?? m.id} style={{ borderRadius: vh(6), marginBottom: vh(1) }}>
                    <Shadow distance={7} offset={[0, 0]} startColor="rgba(0,0,0,0.08)" finalColor="rgba(0,0,0,0.23)">
                      <View style={styles.pillContainer}>
                        <View style={styles.pillProfile}>
                          <Image source={{ uri: m.profileImageThumbnailUrl || m.profileImageUrl }} style={styles.pillAvatar} />
                          <Text style={styles.pillName}>{m.userName}</Text>
                        </View>
                        <TouchableOpacity style={styles.pillAction} onPress={() => setAddedMembers((prev) => prev.filter((x) => (x.Id ?? x.id) !== (m.Id ?? m.id)))}>
                          <Feather name="x" size={18} color={parrotRed} />
                        </TouchableOpacity>
                      </View>
                    </Shadow>
                  </View>
                ))}
              </ScrollView>
            </View>

          </View>

          {/* 4. Send message — pinned above tab bar */}
          <View style={{ position: "absolute", bottom: groupKeyboardOffset, left: 0, right: 0, backgroundColor: parrotCream, paddingHorizontal: vw(5) }}>
            <View style={styles.groupSendRow}>
              <TextInput
                style={styles.groupMessageInput}
                placeholder="Write first message..."
                placeholderTextColor={parrotPlaceholderGrey}
                value={firstGroupMessage}
                onChangeText={setFirstGroupMessage}
              />
              <TouchableOpacity
                style={[
                  styles.groupSendBtn,
                  (!newGroupName.trim() || !firstGroupMessage.trim() || addedMembers.length === 0) && styles.groupSendBtnDisabled,
                ]}
                onPress={handleCreateGroupAndSend}
                disabled={!newGroupName.trim() || !firstGroupMessage.trim() || addedMembers.length === 0 || isCreatingGroup}
              >
                {isCreatingGroup ? <ActivityIndicator size="small" color="white" /> : <Feather name="send" size={20} color="white" />}
              </TouchableOpacity>
            </View>
          </View>
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
    borderWidth: 0,
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
  groupsTabContainer: {
    flex: 1,
    paddingHorizontal: vw(5),
    paddingTop: vh(2),
    paddingBottom: vh(9),
  },
  groupInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vh(1.5),
    gap: vw(2),
  },
  groupSearchWrapper: {
    marginBottom: vh(1.5),
    zIndex: 10,
  },
  groupSearchDropdown: {
    position: "absolute",
    top: vh(25),
    left: vw(5),
    right: vw(5),
    maxHeight: vh(50),
    backgroundColor: parrotCream,
    borderRadius: vh(2),
    padding: vh(1),
  },
  groupNameInput: {
    flex: 1,
    backgroundColor: parrotCream,
    borderRadius: vh(3),
    paddingHorizontal: vw(4),
    paddingVertical: vh(1),
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: "black",
  },
  groupSearchBtn: {
    backgroundColor: parrotBlue,
    borderRadius: vh(3),
    padding: vh(1),
    alignItems: "center",
    justifyContent: "center",
    width: vw(10),
    height: vw(10),
  },
  groupSearchBtnDisabled: { opacity: 0.35 },
  memberPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: vh(0.8),
    gap: vw(3),
    paddingHorizontal: vw(1),
  },
  memberPreviewAvatar: {
    width: vw(10),
    height: vw(10),
    borderRadius: vw(5),
  },
  memberPreviewName: {
    flex: 1,
    fontFamily: "Nunito_700Bold",
    color: parrotLightBlue,
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#e8f0f8",
    marginVertical: vh(1),
  },
  addMemberBtn: {
    backgroundColor: parrotBlue,
    borderRadius: vh(2),
    paddingHorizontal: vw(3),
    paddingVertical: vh(0.5),
  },
  addMemberBtnText: {
    color: "white",
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
  },
  groupSendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: vh(1),
    borderTopWidth: 1,
    borderTopColor: "#e8f0f8",
    gap: vw(2),
  },
  groupMessageInput: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: vh(3),
    paddingHorizontal: vw(4),
    paddingVertical: vh(1),
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: "black",
  },
  groupSendBtn: {
    backgroundColor: parrotLightBlue,
    borderRadius: vh(3),
    padding: vh(1),
    alignItems: "center",
    justifyContent: "center",
    width: vw(10),
    height: vw(10),
  },
  groupSendBtnDisabled: { opacity: 0.35 },
  groupsTabTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 18,
    color: parrotLightBlue,
    marginBottom: vh(2),
    textAlign: "center",
  },
  pillContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: vh(0.5),
    paddingHorizontal: vh(1),
    borderRadius: vh(6),
    width: vw(80),
    alignItems: "center",
  },
  pillProfile: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  pillAvatar: {
    height: vh(6),
    width: vh(6),
    borderRadius: vh(6),
  },
  pillName: {
    fontFamily: "Nunito_800ExtraBold",
    color: parrotLightBlue,
    fontSize: 16,
    marginLeft: vh(2),
  },
  pillAction: {
    padding: vh(1),
    borderRadius: vh(4),
    backgroundColor: "rgba(30, 111, 217, 0.08)",
    marginLeft: vh(1),
  },
});
