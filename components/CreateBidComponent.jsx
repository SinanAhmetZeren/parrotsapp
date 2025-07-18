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
} from "../slices/VoyageSlice";
import {
  parrotTextDarkBlue,
  parrotBlueSemiTransparent,
  parrotBlueMediumTransparent,
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
}) => {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isChangeModalVisible, setIsChangeModalVisible] = useState(false);
  const [price, setPrice] = useState(0);
  const [existingBidPrice, setExistingBidPrice] = useState(userBidPrice);
  const [message, setMessage] = useState("");
  const [existingMessage, setExistingMessage] = useState(userBidMessage);
  const [persons, setPersons] = useState(0);
  const [existingPersons, setExistingPersons] = useState(userBidPersons);
  const createBidTextInputRef = useRef(null);
  const changeBidTextInputRef = useRef(null);
  const [sendBid] = useSendBidMutation();
  const [changeBid] = useChangeBidMutation();

  useEffect(() => {
    setExistingBidPrice(userBidPrice);
    setExistingMessage(userBidMessage);
    setExistingPersons(userBidPersons);
  }, [userBidPersons, userBidPrice, userBidMessage]);

  useEffect(() => {
    if (isCreateModalVisible && createBidTextInputRef.current) {
      createBidTextInputRef.current.focus();
    }
  }, [isCreateModalVisible]);

  useEffect(() => {
    if (isChangeModalVisible && changeBidTextInputRef.current) {
      changeBidTextInputRef.current.focus();
    }
  }, [isChangeModalVisible]);

  const handleIncrementPrice = () => {
    setPrice(price + 1);
  };

  const handleDecrementPrice = () => {
    if (price > 0) {
      setPrice(price - 1);
    }
  };

  const handleIncrementPersons = () => {
    setPersons(persons + 1);
  };

  const handleDecrementPersons = () => {
    if (persons > 0) {
      setPersons(persons - 1);
    }
  };

  const handleSendBid = (userProfileImage, userName) => {
    let bidData = {
      personCount: persons,
      message: message,
      offerPrice: price,
      currency: "€",
      voyageId,
      userId,
      userProfileImage,
      userName,
    };

    sendBid(bidData);
    setIsCreateModalVisible(false);
    refetch();
  };

  const handleIncrementExistingPrice = () => {
    setExistingBidPrice(existingBidPrice + 1);
  };

  const handleDecrementExistingPrice = () => {
    if (existingBidPrice > 0) {
      setExistingBidPrice(existingBidPrice - 1);
    }
  };

  const handleIncrementExistingPersons = () => {
    setExistingPersons(existingPersons + 1);
  };

  const handleDecrementExistingPersons = () => {
    if (existingPersons > 0) {
      setExistingPersons(existingPersons - 1);
    }
  };

  const handleChangeBid = () => {
    let bidData = {
      personCount: existingPersons,
      message: existingMessage,
      offerPrice: existingBidPrice,
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
    setPersons(0);
    setPrice(0);
    setMessage("");
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalVisible(false);
    setPersons(0);
    setPrice(0);
    setMessage("");
  };

  return (
    <View>
      <View style={styles2.bidButtonContainer}>
        {hasBidWithUserId ? (
          <View style={styles2.modalView2}>
            <TouchableOpacity
              style={styles2.buttonSendBidContainer}
              onPress={handleOpenChangeModal}
            >
              <Text style={styles2.buttonSave}>Change Bid</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles2.modalView2}>
            <TouchableOpacity
              style={styles2.buttonSendBidContainer}
              onPress={handleOpenCreateModal}
            >
              <Text style={styles2.buttonSave}>Create Bid</Text>
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
        <View style={styles2.modalContainer}>
          <View style={styles2.innerContainer}>
            <Text style={[styles2.title, { color: parrotTextDarkBlue }]}>
              Enter Your Bid
            </Text>

            <View style={styles2.inputMainContainer}>
              <Text style={styles2.InputName}>Offer Price: </Text>

              <View style={styles2.counterContainer}>
                <TouchableOpacity
                  onPress={handleDecrementPrice}
                  style={styles2.decrementButtonContainer}
                >
                  <Text style={styles2.buttonCount}>-</Text>
                </TouchableOpacity>

                <TextInput
                  ref={createBidTextInputRef}
                  style={styles2.bidInput}
                  keyboardType="numeric"
                  value={price.toString()}
                  onChangeText={(text) => setPrice(parseInt(text) || 0)}
                />

                <TouchableOpacity
                  onPress={handleIncrementPrice}
                  style={styles2.incrementButtonContainer}
                >
                  <Text style={styles2.buttonCount}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles2.inputMainContainer}>
              <Text style={styles2.InputName}>Persons: </Text>

              <View style={styles2.counterContainer}>
                <TouchableOpacity
                  onPress={handleDecrementPersons}
                  style={styles2.decrementButtonContainer}
                >
                  <Text style={styles2.buttonCount}>-</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles2.bidInput}
                  keyboardType="numeric"
                  value={persons.toString()}
                  onChangeText={(text) => setPersons(parseInt(text) || 0)}
                />

                <TouchableOpacity
                  onPress={handleIncrementPersons}
                  style={styles2.incrementButtonContainer}
                >
                  <Text style={styles2.buttonCount}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TextInput
              style={styles2.messageInput}
              placeholder="Enter your message"
              placeholderTextColor={parrotTextDarkBlue}
              multiline
              value={message}
              onChangeText={(text) => setMessage(text)}
            />

            <View style={styles2.buttonsContainer}>
              <TouchableOpacity
                onPress={handleCloseCreateModal}
                style={styles2.buttonCancelContainer}
              >
                <Text style={styles2.buttonClear}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSendBid(userProfileImage, userName)}
                style={styles2.buttonSendBidContainer}
              >
                <Text style={styles2.buttonSave}>Send Bid</Text>
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
        <View style={styles2.modalContainer}>
          <View style={styles2.innerContainer}>
            <Text style={[styles2.title, { color: parrotTextDarkBlue }]}>
              Change Your Bid
            </Text>

            <View style={styles2.inputMainContainer1}>
              <Text style={styles2.InputName}>Offer Price: </Text>

              <View style={styles2.counterContainer}>
                <TouchableOpacity
                  onPress={handleDecrementExistingPrice}
                  style={styles2.decrementButtonContainer}
                >
                  <Text style={styles2.buttonCount}>-</Text>
                </TouchableOpacity>

                <TextInput
                  ref={changeBidTextInputRef}
                  style={styles2.bidInput}
                  keyboardType="numeric"
                  value={existingBidPrice.toString()}
                  onChangeText={(text) =>
                    setExistingBidPrice(parseInt(text) || 0)
                  }
                />

                <TouchableOpacity
                  onPress={handleIncrementExistingPrice}
                  style={styles2.incrementButtonContainer}
                >
                  <Text style={styles2.buttonCount}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Person count */}
            <View style={styles2.inputMainContainer}>
              <Text style={styles2.InputName}>Persons: </Text>

              <View style={styles2.counterContainer}>
                <TouchableOpacity
                  onPress={handleDecrementExistingPersons}
                  style={styles2.decrementButtonContainer}
                >
                  <Text style={styles2.buttonCount}>-</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles2.bidInput}
                  keyboardType="numeric"
                  value={existingPersons.toString()}
                  onChangeText={(text) =>
                    setExistingPersons(parseInt(text) || 0)
                  }
                />

                <TouchableOpacity
                  onPress={handleIncrementExistingPersons}
                  style={styles2.incrementButtonContainer}
                >
                  <Text style={styles2.buttonCount}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Message */}
            <TextInput
              style={styles2.messageInput}
              placeholder="Enter your message"
              placeholderTextColor={parrotTextDarkBlue}
              multiline
              value={existingMessage}
              onChangeText={(text) => setExistingMessage(text)}
            />

            {/* Buttons */}
            <View style={styles2.buttonsContainer}>
              <TouchableOpacity
                onPress={handleCloseChangeModal}
                style={styles2.buttonCancelContainer}
              >
                <Text style={styles2.buttonClear}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleChangeBid()}
                style={styles2.buttonSendBidContainer}
              >
                <Text style={styles2.buttonSave}>Change Bid</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles2 = StyleSheet.create({
  decrementButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: parrotTextDarkBlue,
    borderRadius: vh(2),
    height: vh(5),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  incrementButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: parrotTextDarkBlue,
    borderRadius: vh(2),
    height: vh(5),
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  modalView2: {
    position: "absolute",
    alignSelf: "center",
  },
  inputMainContainer: {
    padding: vh(1),
    marginBottom: vh(1),
    borderRadius: vh(2),
    borderColor: "#d8f7ee",
    flexDirection: "row",
  },
  inputMainContainer1: {
    padding: vh(1),
    marginBottom: vh(1),
    borderRadius: vh(2),
    borderColor: "#d8f7ee",
    flexDirection: "row",
  },
  bidButtonContainer: {
    width: vw(40),
    alignSelf: "center",
    marginTop: vh(1),
    height: vh(4),
    justifyContent: "center",
  },

  InputName: {
    fontSize: 16,
    color: parrotTextDarkBlue,
    fontWeight: "bold",
    alignSelf: "center",
    width: vw(25),
  },
  messageInput: {
    fontSize: 14,
    // color: "#186ff1",
    color: parrotTextDarkBlue,
    backgroundColor: parrotBlueMediumTransparent,
    fontWeight: "bold",
    marginBottom: vh(2),
    padding: vh(1),
    borderRadius: vh(2),
    borderWidth: 1,
    borderColor: parrotTextDarkBlue,
  },
  bidInput: {
    color: parrotTextDarkBlue,
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "white",
    width: vw(25),
    textAlign: "center",
    borderWidth: 1,
    borderColor: parrotTextDarkBlue,
    height: vh(5) - 1.5,
    backgroundColor: parrotBlueMediumTransparent,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    left: 0,
    right: 0,
    paddingTop: vh(17),
    paddingBottom: vh(70),
  },
  innerContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: vw(90),
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: vh(2),
    textAlign: "center",
  },
  counterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: vw(53),
    paddingHorizontal: vw(2),
    // paddingVertical: vh(0.5),
    borderRadius: vh(2),
  },

  buttonsContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-around",
  },

  buttonSave: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    backgroundColor: "#186ff1",
    padding: 5,
    width: vw(30),
    borderRadius: vh(4),
    marginTop: 5,
    fontWeight: "bold",
  },
  buttonClear: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    backgroundColor: "#2ac898",
    padding: 5,
    width: vw(30),
    borderRadius: vh(4),
    marginTop: 5,
  },
  buttonCount: {
    fontSize: 22,
    borderColor: "#3498db",
    borderRadius: 10,
    width: vh(6),
    textAlign: "center",
    fontWeight: "800",
    color: "white",
  },
  count: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
