/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { StyleSheet } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { useGetUsersByUsernameQuery } from "../slices/UserSlice";
import { useCreateGroupMutation, useAddGroupMemberMutation } from "../slices/GroupSlice";
import { invokeHub } from "../signalr/signalRHub";
import {
  parrotBlue,
  parrotBlueSemiTransparent,
  parrotCream,
  parrotLightBlue,
  parrotPlaceholderGrey,
  parrotRed,
} from "../assets/color";

const SELECTOR_HEIGHT = vh(6.5);

export default function CreateNewGroupTab({ onGroupCreated, showToast }) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = Platform.OS === "ios"
    ? (vh(100) - insets.top - insets.bottom) * 0.08
    : vh(8);
  const containerHeight = Platform.OS === "ios"
    ? vh(99.5) - SELECTOR_HEIGHT - tabBarHeight - insets.top
    : vh(99.5) - SELECTOR_HEIGHT - tabBarHeight + insets.bottom;

  const userId = useSelector((state) => state.users.userId);
  const currentUserName = useSelector((state) => state.users.userName);
  const currentUserImage = useSelector((state) => state.users.userProfileImageThumbnail || state.users.userProfileImage);

  const [newGroupName, setNewGroupName] = useState("");
  const [groupMemberSearch, setGroupMemberSearch] = useState("");
  const [groupMemberQuery, setGroupMemberQuery] = useState("");
  const [addedMembers, setAddedMembers] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: `dummy-${i}`,
      Id: `dummy-${i}`,
      userName: `user_${i + 1}`,
      profileImageUrl: `https://i.pravatar.cc/150?img=${i + 1}`,
      profileImageThumbnailUrl: `https://i.pravatar.cc/150?img=${i + 1}`,
    }))
  );
  const [addingMemberId, setAddingMemberId] = useState(null);
  const [removingMemberId, setRemovingMemberId] = useState(null);
  const [firstGroupMessage, setFirstGroupMessage] = useState("");
  const [groupDropdownVisible, setGroupDropdownVisible] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const [createGroup] = useCreateGroupMutation();
  const [addGroupMember] = useAddGroupMemberMutation();

  const { data: groupMemberResults, isFetching: isFetchingGroupMembers } = useGetUsersByUsernameQuery(groupMemberQuery, {
    skip: groupMemberQuery.length < 3,
  });

  const handleCreateGroupAndSend = async () => {
    if (!newGroupName.trim() || !firstGroupMessage.trim() || addedMembers.length === 0) return;
    setIsCreatingGroup(true);
    try {
      const groupResult = await createGroup({ name: newGroupName.trim(), creatorId: userId }).unwrap();
      const groupId = groupResult.id ?? groupResult.Id ?? groupResult.data?.id;
      if (!groupId) return;
      await Promise.all(addedMembers.map((m) => addGroupMember({ groupId, userId: m.Id ?? m.id, requesterId: userId })));
      await invokeHub("SendGroupMessage", userId, groupId, firstGroupMessage.trim());
      setNewGroupName("");
      setFirstGroupMessage("");
      setAddedMembers([]);
      setGroupMemberSearch("");
      setGroupMemberQuery("");
      onGroupCreated();
    } catch {
      showToast("Could not create group - Please try again.");
    } finally {
      setIsCreatingGroup(false);
    }
  };

  return (
    <View style={{
      height: containerHeight,
      flexDirection: "column",
      backgroundColor: "white"
    }}>

      {/* 1. Title */}
      <Text style={[styles.membersLabel, { backgroundColor: "white", marginTop: vh(1.5) }]}>Create New Group</Text>

      {/* 2. Group name */}
      <View style={[styles.groupInputRow, { backgroundColor: "white" }]}>
        <View style={[styles.searchBar, { width: vw(85), backgroundColor: "rgba(0, 119, 234, 0.02)", borderWidth: 0 }]}>
          <TextInput
            style={styles.textinputStyle}
            placeholder="Group name..."
            placeholderTextColor={parrotPlaceholderGrey}
            value={newGroupName}
            onChangeText={setNewGroupName}
            numberOfLines={1}
          />
        </View>
      </View>

      {/* 3. Search users */}
      <View style={[styles.groupSearchWrapper, { backgroundColor: "white" }]}>
        <View style={[styles.searchBar, { width: vw(85), backgroundColor: "rgba(0, 119, 234, 0.02)", borderWidth: 0 }]}>
          <TextInput
            style={styles.textinputStyle}
            placeholder="Search users to add..."
            placeholderTextColor={parrotPlaceholderGrey}
            value={groupMemberSearch}
            onChangeText={setGroupMemberSearch}
            numberOfLines={1}
            onSubmitEditing={() => {
              if (groupMemberSearch.length >= 3) { setGroupMemberQuery(groupMemberSearch); setGroupDropdownVisible(true); }
            }}
          />
          <TouchableOpacity
            style={styles.magnifier}
            onPress={() => {
              if (groupMemberSearch.length >= 3) { setGroupMemberQuery(groupMemberSearch); setGroupDropdownVisible(true); }
            }}
            disabled={groupMemberSearch.length < 3}
          >
            <Feather name="search" size={20} color={groupMemberSearch.length > 2 ? parrotBlue : parrotBlueSemiTransparent} />
          </TouchableOpacity>
        </View>

        <Modal visible={groupDropdownVisible} transparent animationType="none" onRequestClose={() => setGroupDropdownVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setGroupDropdownVisible(false)}>
            <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}>
              <View style={styles.groupSearchDropdown} onStartShouldSetResponder={() => true}>
                <ScrollView keyboardShouldPersistTaps="handled">
                  {(isFetchingGroupMembers ? [] : (groupMemberResults ?? []))
                    .filter((u) => !addedMembers.find((m) => (m.Id ?? m.id) === (u.Id ?? u.id)) && (u.Id ?? u.id) !== userId)
                    .map((u) => (
                      <View key={u.Id ?? u.id} style={{ borderRadius: vh(6), marginBottom: vh(1), alignItems: "center" }}>
                        <View style={{ backgroundColor: "white", borderRadius: vh(6), padding: vh(0.5) }}>
                          <View style={styles.pillContainer}>
                            <View style={styles.pillProfile}>
                              <Image source={{ uri: u.profileImageThumbnailUrl || u.profileImageUrl }} style={styles.pillAvatar} />
                              <Text style={styles.pillName}>{u.userName}</Text>
                            </View>
                            <TouchableOpacity
                              style={addingMemberId === (u.Id ?? u.id) ? styles.addedMemberBtn : styles.addMemberBtn}
                              disabled={!!addingMemberId}
                              onPress={() => {
                                const uid = u.Id ?? u.id;
                                setAddingMemberId(uid);
                                setTimeout(() => {
                                  setAddedMembers((prev) => [...prev, u]);
                                  setGroupDropdownVisible(false);
                                  setGroupMemberSearch("");
                                  setGroupMemberQuery("");
                                  setAddingMemberId(null);
                                }, 600);
                              }}
                            >
                              {addingMemberId === (u.Id ?? u.id)
                                ? <Feather name="check" size={18} color="#4caf50" />
                                : <Feather name="plus" size={18} color={parrotBlue} />}
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))}
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>

      {/* 4. Members title */}
      <Text style={[styles.membersLabel, { backgroundColor: "white" }]}>Members</Text>

      {/* 5. Members scroll */}
      <ScrollView
        style={[styles.membersScroll, { backgroundColor: "white" }]}
        contentContainerStyle={{ alignItems: "center", paddingTop: vh(2), paddingBottom: vh(1) }}
        nestedScrollEnabled
      >
        <View style={{ borderRadius: vh(6), marginBottom: vh(1) }}>
          <View style={styles.pillContainer}>
            <View style={styles.pillProfile}>
              <Image source={{ uri: currentUserImage }} style={styles.pillAvatar} />
              <Text style={styles.pillName}>{currentUserName} (you)</Text>
            </View>
          </View>
        </View>
        {addedMembers.map((m) => (
          <View key={m.Id ?? m.id} style={{ borderRadius: vh(6), marginBottom: vh(1) }}>
            <View style={styles.pillContainer}>
              <View style={styles.pillProfile}>
                <Image source={{ uri: m.profileImageThumbnailUrl || m.profileImageUrl }} style={styles.pillAvatar} />
                <Text style={styles.pillName}>{m.userName}</Text>
              </View>
              <TouchableOpacity
                style={styles.pillAction}
                disabled={!!removingMemberId}
                onPress={() => {
                  const mid = m.Id ?? m.id;
                  setRemovingMemberId(mid);
                  setTimeout(() => {
                    setAddedMembers((prev) => prev.filter((x) => (x.Id ?? x.id) !== mid));
                    setRemovingMemberId(null);
                  }, 600);
                }}
              >
                {removingMemberId === (m.Id ?? m.id)
                  ? <ActivityIndicator size={18} color={parrotRed} />
                  : <Feather name="x" size={18} color={parrotRed} />}
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 6. Send row */}
      <View style={[styles.sendRow, {
        width: "100%", alignSelf: "center",
        backgroundColor: parrotBlueSemiTransparent,
        paddingBottom: insets.bottom,
      }]}>
        <TextInput
          style={styles.groupMessageInput}
          placeholder="Write first message..."
          placeholderTextColor={parrotPlaceholderGrey}
          value={firstGroupMessage}
          onChangeText={setFirstGroupMessage}
        />
        <TouchableOpacity
          style={[styles.groupSendBtn, (!newGroupName.trim() || !firstGroupMessage.trim() || addedMembers.length === 0) && styles.groupSendBtnDisabled]}
          onPress={handleCreateGroupAndSend}
          disabled={!newGroupName.trim() || !firstGroupMessage.trim() || addedMembers.length === 0 || isCreatingGroup}
        >
          {isCreatingGroup
            ? <ActivityIndicator size="small" color="white" />
            : <Feather name="send" size={20} color="white" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 18,
    color: parrotLightBlue,
    marginBottom: vh(.5),
    textAlign: "center",
    marginTop: vh(2),
  },
  inputsCard: {
    backgroundColor: "white",
    borderRadius: vh(2),
    paddingTop: vh(1.5),
    paddingBottom: vh(0.5),
    paddingHorizontal: vw(2),
    marginBottom: vh(1),
    marginHorizontal: vw(5),
  },
  groupInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vh(.5),
    gap: vw(2),
    width: vw(90),
    margin: "auto"
  },
  groupSearchWrapper: {
    marginBottom: vh(.5),
    zIndex: 10,
    width: vw(90),
    margin: "auto"
  },
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
  groupSearchDropdown: {
    position: "absolute",
    top: vh(25),
    left: vw(5),
    right: vw(5),
    maxHeight: vh(50),
    borderRadius: vh(2),
    padding: vh(1),
  },
  membersLabel: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
    color: parrotLightBlue,
    marginTop: vh(0.5),
    marginLeft: vw(5),
    marginBottom: vh(1),
  },
  membersScroll: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: vh(2),
    marginHorizontal: vw(5),
  },
  sendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: vh(1),
    paddingHorizontal: vw(5),
    borderTopWidth: 1,
    borderTopColor: "#e8f0f8",
    backgroundColor: parrotCream,
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
  pillContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 119, 234, 0.02)",
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
    width: vw(9),
    height: vw(9),
    borderRadius: vw(4.5),
    backgroundColor: "rgba(220,50,50,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: vh(1),
  },
  addMemberBtn: {
    width: vw(9),
    height: vw(9),
    borderRadius: vw(4.5),
    backgroundColor: "rgba(0,119,234,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  addedMemberBtn: {
    width: vw(9),
    height: vw(9),
    borderRadius: vw(4.5),
    backgroundColor: "rgba(76,175,80,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
});
