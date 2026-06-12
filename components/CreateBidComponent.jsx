import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/prop-types */
import React from "react";
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
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
  currency
}) => {
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

  const handleSendBid = (userProfileImage, userName) => {
    let bidData = {
      personCount: parseInt(persons) || 0,
      message: message,
      offerPrice: parseInt(price) || 0,
      voyageId,
      userId,
      userProfileImage,
      userName,
    };

    sendBid(bidData);
    addVoyageToFavorites({ userId, voyageId });
    dispatch(addVoyageToUserFavorites({ favoriteVoyage: voyageId }));
    setIsCreateModalVisible(false);
    refetch();
  };

  const handleIncrementExistingPrice = () => setExistingBidPrice(String((parseInt(existingBidPrice) || 0) + 1));
  const handleDecrementExistingPrice = () => setExistingBidPrice(String(Math.max(0, (parseInt(existingBidPrice) || 0) - 1)));
  const handleIncrementExistingPersons = () => setExistingPersons(String((parseInt(existingPersons) || 0) + 1));
  const handleDecrementExistingPersons = () => setExistingPersons(String(Math.max(0, (parseInt(existingPersons) || 0) - 1)));

  const handleChangeBid = () => {
    let bidData = {
      personCount: parseInt(existingPersons) || 0,
      message: existingMessage,
      offerPrice: parseInt(existingBidPrice) || 0,
      voyageId,
      userId,
      bidId: userBidId,
    };
    changeBid(bidData);
    setIsChangeModalVisible(false);
    refetch();
  };

  const handleOpenChangeModal = () => {
    setIsChangeModalVisible(true);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalVisible(true);
  };

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

  return (
    <View>
      <View style={bidInputStyles.bidButtonContainer}>
        {hasBidWithUserId ? (
          <View style={bidInputStyles.modalView2}>
            <TouchableOpacity style={bidInputStyles.buttonSendBidContainer} onPress={handleOpenChangeModal}>
              <ParrotsStdText style={bidInputStyles.buttonSave}>Change Bid</ParrotsStdText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={bidInputStyles.modalView2}>
            <TouchableOpacity style={bidInputStyles.buttonSendBidContainer} onPress={handleOpenCreateModal}>
              <ParrotsStdText style={bidInputStyles.buttonSave}>Create Bid</ParrotsStdText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal
        visible={isCreateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseCreateModal}
      >
        <View style={bidInputStyles.modalContainer}>
          <View style={bidInputStyles.innerContainer}>
            <ParrotsStdText style={bidInputStyles.title}>Enter Your Bid</ParrotsStdText>
            <ParrotsStdText style={bidInputStyles.subtitle}>Set your offer price and number of guests</ParrotsStdText>

            <View style={bidInputStyles.inputMainContainer}>
              <ParrotsStdText style={bidInputStyles.InputName}>Offer Price ({currency})</ParrotsStdText>
              <View style={bidInputStyles.counterContainer}>
                <TouchableOpacity onPress={handleDecrementPrice} style={bidInputStyles.decrementButtonContainer}>
                  <ParrotsStdText style={bidInputStyles.buttonCount}>-</ParrotsStdText>
                </TouchableOpacity>
                <TextInput
                  ref={createBidTextInputRef}
                  style={bidInputStyles.bidInput}
                  keyboardType="numeric"
                  selectionColor={parrotCream}
                  value={price.toString()}
                  onFocus={() => { if (price === "0") setPrice(""); }}
                  onBlur={() => { if (price === "") setPrice("0"); }}
                  onChangeText={(text) => { const n = text.replace(/[^0-9]/g, ""); setPrice(n === "" ? "" : String(parseInt(n, 10))); }}
                />
                <TouchableOpacity onPress={handleIncrementPrice} style={bidInputStyles.incrementButtonContainer}>
                  <ParrotsStdText style={bidInputStyles.buttonCount}>+</ParrotsStdText>
                </TouchableOpacity>
              </View>
            </View>

            <View style={bidInputStyles.inputMainContainer}>
              <ParrotsStdText style={bidInputStyles.InputName}>Guests</ParrotsStdText>
              <View style={bidInputStyles.counterContainer}>
                <TouchableOpacity onPress={handleDecrementPersons} style={bidInputStyles.decrementButtonContainer}>
                  <ParrotsStdText style={bidInputStyles.buttonCount}>-</ParrotsStdText>
                </TouchableOpacity>
                <TextInput
                  style={bidInputStyles.bidInput}
                  keyboardType="numeric"
                  selectionColor={parrotCream}
                  value={persons.toString()}
                  onFocus={() => { if (persons === "0") setPersons(""); }}
                  onBlur={() => { if (persons === "") setPersons("0"); }}
                  onChangeText={(text) => { const n = text.replace(/[^0-9]/g, ""); setPersons(n === "" ? "" : String(parseInt(n, 10))); }}
                />
                <TouchableOpacity onPress={handleIncrementPersons} style={bidInputStyles.incrementButtonContainer}>
                  <ParrotsStdText style={bidInputStyles.buttonCount}>+</ParrotsStdText>
                </TouchableOpacity>
              </View>
            </View>

            <TextInput
              style={bidInputStyles.messageInput}
              placeholder="Add a message (optional)"
              placeholderTextColor="#b0b8c4"
              multiline
              value={message}
              onChangeText={(text) => setMessage(text)}
            />

            <View style={bidInputStyles.buttonsContainer}>
              <TouchableOpacity onPress={handleCloseCreateModal} style={bidInputStyles.buttonCancelContainer}>
                <ParrotsStdText style={bidInputStyles.buttonClear}>Cancel</ParrotsStdText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSendBid(userProfileImage, userName)} style={bidInputStyles.buttonSendBidContainer}>
                <ParrotsStdText style={bidInputStyles.buttonSave}>Send Bid</ParrotsStdText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* CHANGE BID MODAL */}
      <Modal
        visible={isChangeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseChangeModal}
      >
        <View style={bidInputStyles.modalContainer}>
          <View style={bidInputStyles.innerContainer}>
            <ParrotsStdText style={bidInputStyles.title}>Change Your Bid</ParrotsStdText>
            <ParrotsStdText style={bidInputStyles.subtitle}>Update your offer price and number of guests</ParrotsStdText>

            <View style={bidInputStyles.inputMainContainer1}>
              <ParrotsStdText style={bidInputStyles.InputName}>Offer Price ({currency})</ParrotsStdText>
              <View style={bidInputStyles.counterContainer}>
                <TouchableOpacity onPress={handleDecrementExistingPrice} style={bidInputStyles.decrementButtonContainer}>
                  <ParrotsStdText style={bidInputStyles.buttonCount}>-</ParrotsStdText>
                </TouchableOpacity>
                <TextInput
                  ref={changeBidTextInputRef}
                  style={bidInputStyles.bidInput}
                  keyboardType="numeric"
                  selectionColor={parrotCream}
                  value={existingBidPrice.toString()}
                  onFocus={() => { if (existingBidPrice === "0") setExistingBidPrice(""); }}
                  onBlur={() => { if (existingBidPrice === "") setExistingBidPrice("0"); }}
                  onChangeText={(text) => { const n = text.replace(/[^0-9]/g, ""); setExistingBidPrice(n === "" ? "" : String(parseInt(n, 10))); }}
                />
                <TouchableOpacity onPress={handleIncrementExistingPrice} style={bidInputStyles.incrementButtonContainer}>
                  <ParrotsStdText style={bidInputStyles.buttonCount}>+</ParrotsStdText>
                </TouchableOpacity>
              </View>
            </View>

            <View style={bidInputStyles.inputMainContainer}>
              <ParrotsStdText style={bidInputStyles.InputName}>Guests</ParrotsStdText>
              <View style={bidInputStyles.counterContainer}>
                <TouchableOpacity onPress={handleDecrementExistingPersons} style={bidInputStyles.decrementButtonContainer}>
                  <ParrotsStdText style={bidInputStyles.buttonCount}>-</ParrotsStdText>
                </TouchableOpacity>
                <TextInput
                  style={bidInputStyles.bidInput}
                  keyboardType="numeric"
                  selectionColor={parrotCream}
                  value={existingPersons.toString()}
                  onFocus={() => { if (existingPersons === "0") setExistingPersons(""); }}
                  onBlur={() => { if (existingPersons === "") setExistingPersons("0"); }}
                  onChangeText={(text) => { const n = text.replace(/[^0-9]/g, ""); setExistingPersons(n === "" ? "" : String(parseInt(n, 10))); }}
                />
                <TouchableOpacity onPress={handleIncrementExistingPersons} style={bidInputStyles.incrementButtonContainer}>
                  <ParrotsStdText style={bidInputStyles.buttonCount}>+</ParrotsStdText>
                </TouchableOpacity>
              </View>
            </View>

            <TextInput
              style={bidInputStyles.messageInput}
              placeholder="Add a message (optional)"
              placeholderTextColor="#b0b8c4"
              multiline
              value={existingMessage}
              onChangeText={(text) => setExistingMessage(text)}
            />

            <View style={bidInputStyles.buttonsContainer}>
              <TouchableOpacity onPress={handleCloseChangeModal} style={bidInputStyles.buttonCancelContainer}>
                <ParrotsStdText style={bidInputStyles.buttonClear}>Cancel</ParrotsStdText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleChangeBid()} style={bidInputStyles.buttonSendBidContainer}>
                <ParrotsStdText style={bidInputStyles.buttonSave}>Change Bid</ParrotsStdText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const bidInputStyles = StyleSheet.create({
  modalView2: {
    position: "absolute",
    alignSelf: "center",
  },
  bidButtonContainer: {
    width: vw(40),
    alignSelf: "center",
    marginTop: vh(3),
    height: vh(4),
    justifyContent: "center",
    marginBottom: vh(3),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  innerContainer: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 24,
    width: vw(88),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: "Nunito_800ExtraBold",
    color: parrotTextDarkBlue,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#9aa0aa",
    marginBottom: 20,
  },
  inputMainContainer: {
    marginBottom: 16,
  },
  inputMainContainer1: {
    marginBottom: 16,
  },
  InputName: {
    fontSize: 13,
    color: "#9aa0aa",
    fontFamily: "Nunito_600SemiBold",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  counterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  decrementButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    width: vw(22),
    height: vh(5.5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  incrementButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    width: vw(22),
    height: vh(5.5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonCount: {
    fontSize: 26,
    fontFamily: "Nunito_700Bold",
    color: parrotGreen,
    textAlign: "center",
  },
  bidInput: {
    color: parrotGreen,
    fontSize: 28,
    fontFamily: "Nunito_800ExtraBold",
    width: vw(28),
    textAlign: "center",
  },
  messageInput: {
    fontSize: 14,
    color: parrotTextDarkBlue,
    backgroundColor: "#f2f4f7",
    fontFamily: "Nunito_600SemiBold",
    marginBottom: 20,
    padding: 14,
    borderRadius: 14,
    minHeight: vh(8),
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  buttonSendBidContainer: {
    flex: 1,
    backgroundColor: parrotBlue,
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    minWidth: vw(30),
  },
  buttonSave: {
    fontSize: 16,
    color: "white",
    fontFamily: "Nunito_700Bold",
    textAlign: "center",
  },
  buttonCancelContainer: {
    flex: 1,
    backgroundColor: "#f2f4f7",
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonClear: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#9aa0aa",
    textAlign: "center",
  },
  count: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
  },
});
