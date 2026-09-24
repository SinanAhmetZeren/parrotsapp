import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import {
  parrotBlue,
  parrotGreen,
  parrotGreenMediumTransparent,
  parrotBlueMediumTransparent,
  parrotTextDarkBlue,
  parrotRed,
  parrotRedTransparent,
  parrotCream,
  parrotBlueSemiTransparent,
  parrotPlaceholderGrey,
  parrotInputTextColor,
} from "../assets/color.jsx";
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { vw, vh } from "react-native-expo-viewport-units";
import { useAcceptBidMutation, useDeleteBidMutation } from "../slices/VoyageSlice";
import { Feather } from "@expo/vector-icons";
import { invokeHub } from "../signalr/signalRHub.js";

export const RenderBidsComponent = ({
  bids,
  modalVisible,
  setModalVisible,
  ownVoyage,
  voyageName,
  currentUserId,
  refetch,
  username,
  currency,
}) => {
  const visibleBids = bids?.slice(0, 5);
  const [acceptBid] = useAcceptBidMutation();
  const [deleteBid] = useDeleteBidMutation();
  const [loadingBidId, setLoadingBidId] = useState(null);

  const handleAcceptBid = async ({ bidId, bidUserId }) => {
    const text = `[parrots-bid] Welcome aboard "${voyageName}"! Your bid has been accepted.`;
    setLoadingBidId(bidId);
    try {
      await invokeHub("SendMessage", currentUserId, bidUserId, text);
      await acceptBid(bidId).unwrap();
      await refetch();
    } catch (error) {
      console.error("❌ Failed to accept bid or send message:", error);
      Toast.show({ type: "error", text1: "Action failed", text2: "Please try again.", visibilityTime: 1500, topOffset: 100 });
    } finally {
      setLoadingBidId(null);
    }
  };

  const handleDeleteBid = async ({ bidId, bidUserId }) => {
    const text = `Hi there! 👋 Your bid was deleted by ${username}`;
    setLoadingBidId(bidId);
    try {
      await invokeHub("SendMessage", currentUserId, bidUserId, text);
      await deleteBid(bidId).unwrap();
      await refetch();
    } catch (error) {
      console.error("❌ Failed to delete bid or send message:", error);
      Toast.show({ type: "error", text1: "Action failed", text2: "Please try again.", visibilityTime: 1500, topOffset: 100 });
    } finally {
      setLoadingBidId(null);
    }
  };

  return (
    <View style={{ gap: 6 }}>
      {visibleBids.map((bid, index) => (
        <BidRow
          key={index}
          bid={bid}
          ownVoyage={ownVoyage}
          currency={currency}
          loadingBidId={loadingBidId}
          onAccept={handleAcceptBid}
          onDelete={handleDeleteBid}
        />
      ))}

      {/* See all modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "#fff", borderRadius: 18, borderWidth: 1.5, borderColor: "#D8E0E8", paddingHorizontal: 8, paddingTop: 18, paddingBottom: 20, width: "94%", maxHeight: "75%" }}>
            <ParrotsStdText style={bs.sheetTitle}>All Bids</ParrotsStdText>
            <FlatList
              data={bids}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ gap: 7, paddingBottom: 8 }}
              renderItem={({ item }) => (
                <BidRow
                  bid={item}
                  ownVoyage={ownVoyage}
                  currency={currency}
                  loadingBidId={loadingBidId}
                  onAccept={handleAcceptBid}
                  onDelete={handleDeleteBid}
                  currentUserId={currentUserId}
                />
              )}
            />
            <TouchableOpacity style={bs.closeBtn} onPress={() => setModalVisible(false)}>
              <ParrotsStdText style={bs.closeBtnText}>Close</ParrotsStdText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const BidRow = ({ bid, ownVoyage, currency, loadingBidId, onAccept, onDelete }) => {
  const isLoading = loadingBidId === bid.id;

  return (
    <View style={bid.accepted ? bs.rowAccepted : bs.row}>
      {/* Top line: avatar + name + actions */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Image source={{ uri: bid.userProfileImage }} style={bs.avatar} />
        <ParrotsStdText style={[bs.userName, { flex: 1 }]} numberOfLines={1}>{bid.userName}</ParrotsStdText>
        {ownVoyage && (
          <View style={{ flexDirection: "row", gap: 6, }}>
            {bid.accepted ? (
              <View style={[bs.actionBtn, bs.acceptedBtnInactive]}>
                <ParrotsStdText style={bs.acceptedBtnText}>Accepted</ParrotsStdText>
              </View>
            ) : (
              <TouchableOpacity
                style={[bs.actionBtn, bs.acceptBtn]}
                onPress={() => onAccept({ bidId: bid.id, bidUserId: bid.userId })}
                disabled={loadingBidId !== null || bid.accepted}
              >
                {isLoading
                  ? <ActivityIndicator size="small" color="#0A5FBF" />
                  : <ParrotsStdText style={bs.acceptBtnText}>Accept</ParrotsStdText>
                }
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[bs.actionBtn, bs.deleteBtn, bid.accepted && { opacity: 0.4 }]}
              onPress={() => onDelete({ bidId: bid.id, bidUserId: bid.userId })}
              disabled={loadingBidId !== null || bid.accepted}
            >
              {isLoading
                ? <ActivityIndicator size="small" color="#C0392B" />
                : <ParrotsStdText style={bs.deleteBtnText}>Remove</ParrotsStdText>
              }
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Message + meta pills on same row */}
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4, gap: 6 }}>
        {ownVoyage && bid.message ? (
          <ParrotsStdText style={[bs.message, { flex: 1, marginTop: 0, marginLeft: 0 }]} numberOfLines={2}>{bid.message}</ParrotsStdText>
        ) : <View style={{ flex: 1 }} />}
        <View style={bs.metaPill}>
          <Feather name="users" size={10} color="#5A6874" />
          <ParrotsStdText style={bs.metaText}>{bid.personCount}</ParrotsStdText>
        </View>
        <View style={bs.metaPill}>
          <ParrotsStdText style={bs.metaText}>{currency}{bid.offerPrice}</ParrotsStdText>
        </View>
      </View>
    </View>
  );
};

const bs = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderColor: "#E8EFF6",
    borderRadius: 11,
    backgroundColor: "#F7FAFD",
    padding: 9,
    gap: 0,
  },
  rowAccepted: {
    borderWidth: 1,
    borderColor: "#B7E4CF",
    borderRadius: 11,
    backgroundColor: "#F0FAF5",
    padding: 9,
    gap: 0,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#D8E0E8",
  },
  userName: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: "#0A5FBF",
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF3F9",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  metaText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 11,
    color: "#3C4A57",
  },
  acceptedPill: {
    backgroundColor: "#E4F5E9",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  acceptedText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 11,
    color: "#0B6B4E",
  },
  message: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 11.5,
    color: "#5A6874",
    marginTop: 5,
    marginLeft: 36,
    lineHeight: 16,
  },
  actionBtn: {
    height: 26,
    width: 68,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptBtn: {
    backgroundColor: "#E8F1FB",
  },
  acceptBtnText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    color: "#0A5FBF",
  },
  acceptedBtnInactive: {
    backgroundColor: "#E4F5E9",
  },
  acceptedBtnText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    color: "#0B6B4E",
  },
  deleteBtn: {
    backgroundColor: "#FDECEA",
  },
  deleteBtnText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    color: "#C0392B",
  },
  // Modal sheet
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 36,
    maxHeight: vh(75),
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 14,
  },
  sheetTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 15,
    color: "#1F2933",
    marginBottom: 12,
  },
  closeBtn: {
    marginTop: 12,
    alignSelf: "center",
    backgroundColor: "#0A5FBF",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  closeBtnText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: "#fff",
  },
});
