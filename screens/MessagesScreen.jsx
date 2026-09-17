import { ParrotsStdText } from "../components/ParrotsStdText";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  Platform,
} from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import ConversationList from "../components/ConversationList";
import { BidBookmarkPill } from "../components/BidBookmarkPill";
import { ConnectSelectionComponent } from "../components/ConnectSelectionComponent";
import { SearchUsersComponent } from "../components/SearchUsersComponent";
import LoadingLogo from "../components/LoadingLogo";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";

import { useGetMessagesByUserIdQuery } from "../slices/MessageSlice";
import { useGetUsersByUsernameQuery } from "../slices/UserSlice";
import { useGetMyBidsQuery } from "../slices/VoyageSlice";
import { useCreateGroupMutation } from "../slices/GroupSlice";
import { markMessagesRead } from "../slices/UserSlice";

import {
  register_ReceiveMessage,
  unregister_ReceiveMessage,
  register_ReceiveGroupMessage,
  unregister_ReceiveGroupMessage,
  register_OnReconnecting,
  unregister_OnReconnecting,
  register_OnReconnected,
  unregister_OnReconnected,
} from "../signalr/signalRHub.js";

import {
  parrotBananaLeafGreen,
  parrotBlue,
  parrotBlueSemiTransparent,
  parrotPistachioGreen,
  parrotPlaceholderGrey,
  parrotCream,
} from "../assets/color";

export default function MessagesScreen({ navigation }) {
  const userId = useSelector((state) => state.users.userId);
  const [selectedFunction, setSelectedFunction] = useState(1);

  // Chats
  const [refreshing, setRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { data: messagesData, isLoading: isLoadingMessages, isError: isErrorMessages, refetch } =
    useGetMessagesByUserIdQuery(userId);

  // Group create
  const [groupName, setGroupName] = useState("");
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [createGroup] = useCreateGroupMutation();

  // Find
  const [searchText, setSearchText] = useState("");
  const [username, setUsername] = useState("");
  const { data: usersData, isFetching: isFetchingUsers } = useGetUsersByUsernameQuery(username, {
    skip: username.length < 3,
    refetchOnMountOrArgChange: true,
  });

  // Bids
  const { data: myBidsRaw, isLoading: isLoadingBids } = useGetMyBidsQuery(undefined, {
    skip: selectedFunction !== 3,
  });

  const dispatch = useDispatch();

  // Toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  useEffect(() => { setHasError(isErrorMessages); }, [isErrorMessages]);

  useEffect(() => {
    if (!messagesData) return;
    const hasUnread = messagesData.some((m) => (m.unreadCount ?? 0) > 0);
    if (!hasUnread) dispatch(markMessagesRead());
  }, [messagesData, dispatch]);

  // SignalR
  useFocusEffect(useCallback(() => {
    if (!userId) return;
    console.log("enter messages screen --> ");
    const handleMsg = async () => { try { await refetch(); } catch { } };
    register_ReceiveMessage(handleMsg);
    register_ReceiveGroupMessage(handleMsg);
    return () => {
      console.log("left messages screen --> ");
      unregister_ReceiveMessage(handleMsg);
      unregister_ReceiveGroupMessage(handleMsg);
    };
  }, [userId, refetch]));

  useFocusEffect(useCallback(() => {
    const handleReconnected = () => setToastVisible(false);
    register_OnReconnecting(() => { });
    register_OnReconnected(handleReconnected);
    return () => {
      setToastVisible(false);
      unregister_OnReconnecting(() => { });
      unregister_OnReconnected(handleReconnected);
    };
  }, []));

  useEffect(() => {
    const unsub = navigation.getParent()?.addListener("tabPress", () => setSelectedFunction(1));
    return unsub;
  }, [navigation]);

  useFocusEffect(useCallback(() => {
    if (selectedFunction === 1) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      setSelectedFunction(1);
      return true;
    });
    return () => sub.remove();
  }, [selectedFunction]));

  useFocusEffect(useCallback(() => {
    const fetch = async () => { try { await refetch(); } catch { } };
    fetch();
  }, [refetch]));

  const onRefresh = async () => {
    setRefreshing(true);
    try { await refetch(); setHasError(false); } catch { setHasError(true); } finally { setRefreshing(false); }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || isCreatingGroup) return;
    setIsCreatingGroup(true);
    try {
      const result = await createGroup({ name: groupName.trim(), creatorId: userId }).unwrap();
      const gId = result.id ?? result.Id ?? result.data?.id;
      const gName = result.name ?? result.Name ?? groupName.trim();
      setGroupName("");
      await refetch();
      navigation.navigate("GroupConversationDetailScreen", { groupId: gId, groupName: gName });
    } catch {
      showToast("Could not create group");
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleSearchUsers = () => setUsername(searchText);

  return (
    <View style={styles.screen}>
      <TokenExpiryGuard />

      <ConnectSelectionComponent
        selectedFunction={selectedFunction}
        setSelectedFunction={setSelectedFunction}
      />

      {/* ── TAB 1: Chats ── */}
      {selectedFunction === 1 && (
        <View style={styles.tabContent}>
          {/* Create group row */}
          <View style={styles.createRow}>
            <TextInput
              style={styles.createInput}
              placeholder="Group name…"
              placeholderTextColor="rgba(92,107,122,0.5)"
              value={groupName}
              onChangeText={setGroupName}
            />
            <TouchableOpacity
              style={[styles.createBtn, groupName.trim().length > 0 && styles.createBtnActive]}
              onPress={handleCreateGroup}
              disabled={groupName.trim().length === 0 || isCreatingGroup}
              activeOpacity={0.85}
            >
              {isCreatingGroup
                ? <ActivityIndicator size="small" color={groupName.trim() ? "#fff" : "#A9B4BF"} />
                : <ParrotsStdText style={[styles.createBtnText, groupName.trim().length > 0 && styles.createBtnTextActive]}>Create</ParrotsStdText>
              }
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {hasError ? (
            <ScrollView
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[parrotPistachioGreen, parrotBananaLeafGreen]} tintColor={parrotBananaLeafGreen} />}
            >
              <View style={styles.emptyState}>
                <Image source={require("../assets/parrotslogo.png")} style={styles.logoImage} />
                <ParrotsStdText style={styles.emptyTitle}>Something went wrong</ParrotsStdText>
                <ParrotsStdText style={[styles.emptyTitle, { paddingTop: vh(1) }]}>Swipe down to retry</ParrotsStdText>
              </View>
            </ScrollView>
          ) : isLoadingMessages || messagesData === undefined ? (
            <View style={styles.loader}>
              <LoadingLogo size={220} />
            </View>
          ) : messagesData?.length > 0 ? (
            <View style={styles.listWrap}>
              <ConversationList
                data={messagesData}
                userId={userId}
                onOpenGroup={(gId, gName) => navigation.navigate("GroupConversationDetailScreen", { groupId: gId, groupName: gName })}
              />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Image source={require("../assets/parrotslogo.png")} style={styles.logoImage} />
              <ParrotsStdText style={styles.emptyTitle}>No messages yet…</ParrotsStdText>
            </View>
          )}
        </View>
      )}

      {/* ── TAB 2: Find ── */}
      {selectedFunction === 2 && (
        <View style={styles.tabContent}>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by username…"
              placeholderTextColor="rgba(92,107,122,0.5)"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity
              style={[styles.createBtn, searchText.trim().length >= 3 && styles.createBtnActive]}
              onPress={handleSearchUsers}
              disabled={searchText.trim().length < 3 || isFetchingUsers}
              activeOpacity={0.85}
            >
              <ParrotsStdText style={[styles.createBtnText, searchText.trim().length >= 3 && styles.createBtnTextActive, isFetchingUsers && { opacity: 0 }]}>Search</ParrotsStdText>
              {isFetchingUsers && <ActivityIndicator size="small" color={searchText.trim().length >= 3 ? "#fff" : "#A9B4BF"} style={{ position: "absolute" }} />}
            </TouchableOpacity>
          </View>

          {username.length > 0 && (
            <SearchUsersComponent searchResults={isFetchingUsers ? null : (usersData ?? [])} />
          )}
        </View>
      )}

      {/* ── TAB 3: Bids ── */}
      {selectedFunction === 3 && (
        <View style={styles.tabContent}>
          {isLoadingBids ? (
            <View style={styles.loader}>
              <LoadingLogo size={220} />
            </View>
          ) : (
            <BidBookmarkPill
              bids={myBidsRaw?.data}
              height={Platform.OS === "ios" ? vh(70) : vh(80)}
            />
          )}
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
  screen: {
    flex: 1,
    backgroundColor: parrotCream,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: vw(4),
    paddingTop: vh(1.2),
  },
  // Create group row
  createRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: vh(1),
  },
  createInput: {
    flex: 1,
    fontFamily: "Nunito_700Bold",
    fontSize: 13.5,
    color: "#0A2540",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E3E9F0",
    borderRadius: 999,
    paddingHorizontal: 12,
    height: 38,
    paddingTop: 0,
    paddingBottom: 0,
  },
  createBtn: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#E3E9F0",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  createBtnActive: {
    backgroundColor: "#0A77EA",
    borderColor: "#0A77EA",
  },
  createBtnText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 13,
    color: "#A9B4BF",
  },
  createBtnTextActive: {
    color: "#fff",
  },
  divider: {
    height: 1,
    backgroundColor: "#E3E9F0",
    marginBottom: vh(1),
  },
  listWrap: {
    flex: 1,
    minHeight: 0,
  },
  // Search
  searchRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: vh(1),
  },
  searchInput: {
    flex: 1,
    fontFamily: "Nunito_700Bold",
    fontSize: 13.5,
    color: "#0A2540",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E3E9F0",
    borderRadius: 999,
    paddingHorizontal: 12,
    height: 38,
    paddingTop: 0,
    paddingBottom: 0,
  },
  // Empty states
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: vh(10),
    paddingHorizontal: vw(8),
  },
  emptyTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 18,
    color: parrotBlue,
    paddingTop: vh(3),
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: Platform.OS === "ios" ? vh(20) : 0,
  },
  logoImage: {
    height: vh(20),
    width: vh(20),
    borderRadius: vh(10),
  },
  toast: {
    position: "absolute",
    bottom: vh(10),
    alignSelf: "center",
    backgroundColor: "rgba(30,111,217,0.9)",
    paddingHorizontal: vw(4),
    paddingVertical: vh(1),
    borderRadius: 20,
  },
  toastText: {
    fontFamily: "Nunito_700Bold",
    color: "white",
    fontSize: 13,
  },
});
