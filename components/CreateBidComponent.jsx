import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/prop-types */
import React from "react";
import { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import {
  useSendBidMutation,
  useChangeBidMutation,
  useAddVoyageToFavoritesMutation,
} from "../slices/VoyageSlice";
import { useDispatch } from "react-redux";
import { addVoyageToUserFavorites } from "../slices/UserSlice";
import {
  parrotTextDarkBlue,
  parrotBlueSemiTransparent,
  parrotBlueMediumTransparent,
  parrotGreen,
  parrotBlue,
  parrotCream,
} from "../assets/color.jsx";
import { Feather } from "@expo/vector-icons";

export const CreateBidComponent = ({
  userProfileImage,
  userName,
  userId,
  voyageId,
  hasBidWithUserId,
  userBidId,
  userBidPersons,
  userBidPrice,
  userBidMessage,
  refetch,
  currency,
  isOwnerDeleted,
  endDate,
}) => {
  const isBiddingClosed = endDate && new Date(new Date(endDate).setHours(23, 59, 59, 999)) < Date.now();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isChangeModalVisible, setIsChangeModalVisible] = useState(false);
  const [price, setPrice] = useState("0");
  const [existingBidPrice, setExistingBidPrice] = useState(String(userBidPrice ?? 0));
  const [message, setMessage] = useState("");
  const [existingMessage, setExistingMessage] = useState(userBidMessage);
  const [persons, setPersons] = useState("0");
  const [existingPersons, setExistingPersons] = useState(String(userBidPersons ?? 0));
  const createBidTextInputRef = useRef(null);
  const changeBidTextInputRef = useRef(null);
  const dispatch = useDispatch();
  const [sendBid] = useSendBidMutation();
  const [changeBid] = useChangeBidMutation();
  const [addVoyageToFavorites] = useAddVoyageToFavoritesMutation();

  useEffect(() => {
    setExistingBidPrice(String(userBidPrice ?? 0));
    setExistingMessage(userBidMessage);
    setExistingPersons(String(userBidPersons ?? 0));
  }, [userBidPersons, userBidPrice, userBidMessage]);

  const handleIncrementPrice = () => setPrice(String((parseInt(price) || 0) + 1));
  const handleDecrementPrice = () => setPrice(String(Math.max(0, (parseInt(price) || 0) - 1)));
  const handleIncrementPersons = () => setPersons(String((parseInt(persons) || 0) + 1));
  const handleDecrementPersons = () => setPersons(String(Math.max(0, (parseInt(persons) || 0) - 1)));

  const handleSendBid = async (userProfileImage, userName) => {
    let bidData = {
      personCount: parseInt(persons) || 0,
      message: message,
      offerPrice: parseInt(price) || 0,
      voyageId,
      userId,
      userProfileImage,
      userName,
    };
    await sendBid(bidData);
    addVoyageToFavorites({ userId, voyageId });
    dispatch(addVoyageToUserFavorites({ favoriteVoyage: voyageId }));
    setIsCreateModalVisible(false);
    refetch();
  };

  const handleIncrementExistingPrice = () => setExistingBidPrice(String((parseInt(existingBidPrice) || 0) + 1));
  const handleDecrementExistingPrice = () => setExistingBidPrice(String(Math.max(0, (parseInt(existingBidPrice) || 0) - 1)));
  const handleIncrementExistingPersons = () => setExistingPersons(String((parseInt(existingPersons) || 0) + 1));
  const handleDecrementExistingPersons = () => setExistingPersons(String(Math.max(0, (parseInt(existingPersons) || 0) - 1)));

  const handleChangeBid = async () => {
    let bidData = {
      personCount: parseInt(existingPersons) || 0,
      message: existingMessage,
      offerPrice: parseInt(existingBidPrice) || 0,
      voyageId,
      userId,
      bidId: userBidId,
    };
    await changeBid(bidData);
    setIsChangeModalVisible(false);
    refetch();
  };

  const handleOpenChangeModal = () => setIsChangeModalVisible(true);
  const handleOpenCreateModal = () => setIsCreateModalVisible(true);

  const handleCloseChangeModal = () => {
    setIsChangeModalVisible(false);
    setPersons("0");
    setPrice("0");
    setMessage("");
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalVisible(false);
    setPersons("0");
    setPrice("0");
    setMessage("");
  };

  const disabled = !!isOwnerDeleted || isBiddingClosed;

  return (
    <View>
      {/* Inline CTA */}
      {hasBidWithUserId ? (
        <View style={cs.bidSummaryRow}>
          <View style={{ flex: 1 }}>
            <ParrotsStdText style={cs.yourBidLabel}>YOUR BID</ParrotsStdText>
            <ParrotsStdText style={cs.yourBidValue}>
              {currency}{userBidPrice} · {userBidPersons} {userBidPersons === 1 ? "guest" : "guests"}
            </ParrotsStdText>
            {!!userBidMessage && (
              <ParrotsStdText style={cs.yourBidMessage} numberOfLines={2}>{userBidMessage}</ParrotsStdText>
            )}
          </View>
          <TouchableOpacity
            disabled={disabled}
            style={[cs.changeBtn, disabled && { opacity: 0.4 }]}
            onPress={handleOpenChangeModal}
          >
            <Feather name="edit-2" size={12} color="#0A5FBF" />
            <ParrotsStdText style={cs.changeBtnText}>Change</ParrotsStdText>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          disabled={disabled}
          style={[cs.placeBidBtn, disabled && { opacity: 0.4 }]}
          onPress={handleOpenCreateModal}
        >
          <Feather name="send" size={13} color="#fff" />
          <ParrotsStdText style={cs.placeBidText}>
            {isBiddingClosed ? "Bidding closed" : "Place a bid"}
          </ParrotsStdText>
        </TouchableOpacity>
      )}

      {/* CREATE BID MODAL */}
      <Modal visible={isCreateModalVisible} transparent animationType="fade" onRequestClose={handleCloseCreateModal}>
        <View style={cs.modalOverlay}>
          <View style={cs.modalCard}>
            <ParrotsStdText style={cs.modalTitle}>Place a Bid</ParrotsStdText>
            <ParrotsStdText style={cs.modalSubtitle}>Set your offer and number of guests</ParrotsStdText>

            <View style={cs.counterRow}>
              <View style={cs.counterBlock}>
                <ParrotsStdText style={cs.counterLabel}>GUESTS</ParrotsStdText>
                <View style={cs.counterInner}>
                  <TouchableOpacity onPress={handleDecrementPersons} style={cs.counterBtn}><ParrotsStdText style={cs.counterBtnText}>−</ParrotsStdText></TouchableOpacity>
                  <TextInput
                    style={cs.counterValue}
                    keyboardType="numeric"
                    selectionColor="#0A5FBF"
                    value={persons.toString()}
                    onFocus={() => { if (persons === "0") setPersons(""); }}
                    onBlur={() => { if (persons === "") setPersons("0"); }}
                    onChangeText={(text) => { const n = text.replace(/[^0-9]/g, ""); setPersons(n === "" ? "" : String(parseInt(n, 10))); }}
                  />
                  <TouchableOpacity onPress={handleIncrementPersons} style={cs.counterBtn}><ParrotsStdText style={cs.counterBtnText}>+</ParrotsStdText></TouchableOpacity>
                </View>
              </View>
              <View style={cs.counterDivider} />
              <View style={cs.counterBlock}>
                <ParrotsStdText style={cs.counterLabel}>PRICE ({currency})</ParrotsStdText>
                <View style={cs.counterInner}>
                  <TouchableOpacity onPress={handleDecrementPrice} style={cs.counterBtn}><ParrotsStdText style={cs.counterBtnText}>−</ParrotsStdText></TouchableOpacity>
                  <TextInput
                    ref={createBidTextInputRef}
                    style={cs.counterValue}
                    keyboardType="numeric"
                    selectionColor="#0A5FBF"
                    value={price.toString()}
                    onFocus={() => { if (price === "0") setPrice(""); }}
                    onBlur={() => { if (price === "") setPrice("0"); }}
                    onChangeText={(text) => { const n = text.replace(/[^0-9]/g, ""); setPrice(n === "" ? "" : String(parseInt(n, 10))); }}
                  />
                  <TouchableOpacity onPress={handleIncrementPersons} style={cs.counterBtn}><ParrotsStdText style={cs.counterBtnText}>+</ParrotsStdText></TouchableOpacity>
                </View>
              </View>
            </View>

            <TextInput
              style={cs.messageInput}
              placeholder="Add a message (optional, max 100)"
              placeholderTextColor="#9AA7B3"
              multiline
              maxLength={100}
              value={message}
              onChangeText={(text) => setMessage(text)}
            />

            <View style={cs.modalBtns}>
              <TouchableOpacity onPress={handleCloseCreateModal} style={cs.cancelBtn}><ParrotsStdText style={cs.cancelText}>Cancel</ParrotsStdText></TouchableOpacity>
              <TouchableOpacity onPress={() => handleSendBid(userProfileImage, userName)} style={cs.sendBtn}><ParrotsStdText style={cs.sendText}>Send Bid</ParrotsStdText></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* CHANGE BID MODAL */}
      <Modal visible={isChangeModalVisible} transparent animationType="fade" onRequestClose={handleCloseChangeModal}>
        <View style={cs.modalOverlay}>
          <View style={cs.modalCard}>
            <ParrotsStdText style={cs.modalTitle}>Change Your Bid</ParrotsStdText>
            <ParrotsStdText style={cs.modalSubtitle}>Update your offer and number of guests</ParrotsStdText>

            <View style={cs.counterRow}>
              <View style={cs.counterBlock}>
                <ParrotsStdText style={cs.counterLabel}>GUESTS</ParrotsStdText>
                <View style={cs.counterInner}>
                  <TouchableOpacity onPress={handleDecrementExistingPersons} style={cs.counterBtn}><ParrotsStdText style={cs.counterBtnText}>−</ParrotsStdText></TouchableOpacity>
                  <TextInput
                    style={cs.counterValue}
                    keyboardType="numeric"
                    selectionColor="#0A5FBF"
                    value={existingPersons.toString()}
                    onFocus={() => { if (existingPersons === "0") setExistingPersons(""); }}
                    onBlur={() => { if (existingPersons === "") setExistingPersons("0"); }}
                    onChangeText={(text) => { const n = text.replace(/[^0-9]/g, ""); setExistingPersons(n === "" ? "" : String(parseInt(n, 10))); }}
                  />
                  <TouchableOpacity onPress={handleIncrementExistingPersons} style={cs.counterBtn}><ParrotsStdText style={cs.counterBtnText}>+</ParrotsStdText></TouchableOpacity>
                </View>
              </View>
              <View style={cs.counterDivider} />
              <View style={cs.counterBlock}>
                <ParrotsStdText style={cs.counterLabel}>PRICE ({currency})</ParrotsStdText>
                <View style={cs.counterInner}>
                  <TouchableOpacity onPress={handleDecrementExistingPrice} style={cs.counterBtn}><ParrotsStdText style={cs.counterBtnText}>−</ParrotsStdText></TouchableOpacity>
                  <TextInput
                    ref={changeBidTextInputRef}
                    style={cs.counterValue}
                    keyboardType="numeric"
                    selectionColor="#0A5FBF"
                    value={existingBidPrice.toString()}
                    onFocus={() => { if (existingBidPrice === "0") setExistingBidPrice(""); }}
                    onBlur={() => { if (existingBidPrice === "") setExistingBidPrice("0"); }}
                    onChangeText={(text) => { const n = text.replace(/[^0-9]/g, ""); setExistingBidPrice(n === "" ? "" : String(parseInt(n, 10))); }}
                  />
                  <TouchableOpacity onPress={handleIncrementExistingPersons} style={cs.counterBtn}><ParrotsStdText style={cs.counterBtnText}>+</ParrotsStdText></TouchableOpacity>
                </View>
              </View>
            </View>

            <TextInput
              style={cs.messageInput}
              placeholder="Add a message (optional, max 100)"
              placeholderTextColor="#9AA7B3"
              multiline
              maxLength={100}
              value={existingMessage}
              onChangeText={(text) => setExistingMessage(text)}
            />

            <View style={cs.modalBtns}>
              <TouchableOpacity onPress={handleCloseChangeModal} style={cs.cancelBtn}><ParrotsStdText style={cs.cancelText}>Cancel</ParrotsStdText></TouchableOpacity>
              <TouchableOpacity onPress={() => handleChangeBid()} style={cs.sendBtn}><ParrotsStdText style={cs.sendText}>Update Bid</ParrotsStdText></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const cs = StyleSheet.create({
  // Inline CTA
  placeBidBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    height: 40,
    borderRadius: 11,
    backgroundColor: "#0A5FBF",
  },
  placeBidText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
    color: "#fff",
  },
  bidSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F7FB",
    borderWidth: 1,
    borderColor: "#D8E0E8",
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 10,
  },
  yourBidLabel: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 9,
    letterSpacing: 1.2,
    color: "#5A6874",
  },
  yourBidValue: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 13,
    color: "#0A5FBF",
    marginTop: 1,
  },
  yourBidMessage: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 11.5,
    color: "#5A6874",
    marginTop: 3,
    lineHeight: 16,
  },
  changeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#E8F1FB",
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  changeBtnText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    color: "#0A5FBF",
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#D8E0E8",
    padding: 20,
    width: vw(88),
  },
  modalTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
    color: "#1F2933",
    marginBottom: 3,
  },
  modalSubtitle: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    color: "#9AA7B3",
    marginBottom: 16,
  },
  counterRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  counterBlock: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F4F7FB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D8E0E8",
  },
  counterDivider: {
    display: "none",
  },
  counterLabel: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 9,
    letterSpacing: 1.1,
    color: "#5A6874",
  },
  counterInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#D8E0E8",
    alignItems: "center",
    justifyContent: "center",
  },
  counterBtnText: {
    fontSize: 20,
    fontFamily: "Nunito_700Bold",
    color: "#0A5FBF",
    lineHeight: 24,
  },
  counterValue: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 22,
    color: "#0A5FBF",
    textAlign: "center",
    minWidth: 44,
  },
  messageInput: {
    fontSize: 12,
    color: "#3C4A57",
    backgroundColor: "#F4F7FB",
    fontFamily: "Nunito_600SemiBold",
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D8E0E8",
    minHeight: vh(7),
    textAlignVertical: "top",
  },
  modalBtns: {
    flexDirection: "row",
    gap: 10,
  },
  sendBtn: {
    flex: 1,
    backgroundColor: "#0A5FBF",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  sendText: {
    fontSize: 14,
    color: "white",
    fontFamily: "Nunito_800ExtraBold",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#5A6874",
    textAlign: "center",
  },
});
