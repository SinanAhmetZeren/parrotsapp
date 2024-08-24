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
      currency: "",
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

      {/* NEW BID MODAL */}
      <Modal
        visible={isCreateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseCreateModal}
      >
        <View style={styles2.modalContainer}>
          <View style={styles2.innerContainer}>
            <Text style={styles2.title}>Enter Your Bid</Text>

            {/* Bid Amount */}
            <View style={styles2.inputMainContainer}>
              <Text style={styles2.InputName}>Offer Price: </Text>

              <View style={styles2.counterContainer}>
                <TouchableOpacity onPress={handleDecrementPrice}>
                  <Text style={styles2.buttonCount}>-</Text>
                </TouchableOpacity>

                <TextInput
                  ref={createBidTextInputRef}
                  style={styles2.bidInput}
                  keyboardType="numeric"
                  value={price.toString()}
                  onChangeText={(text) => setPrice(parseInt(text) || 0)}
                />

                <TouchableOpacity onPress={handleIncrementPrice}>
                  <Text style={styles2.buttonCount}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Person count */}
            <View style={styles2.inputMainContainer}>
              <Text style={styles2.InputName}>Persons: </Text>

              <View style={styles2.counterContainer}>
                <TouchableOpacity onPress={handleDecrementPersons}>
                  <Text style={styles2.buttonCount}>-</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles2.bidInput}
                  keyboardType="numeric"
                  value={persons.toString()}
                  onChangeText={(text) => setPersons(parseInt(text) || 0)}
                />

                <TouchableOpacity onPress={handleIncrementPersons}>
                  <Text style={styles2.buttonCount}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Message */}
            <TextInput
              style={styles2.messageInput}
              placeholder="Enter your message"
              placeholderTextColor="#2ac898"
              multiline
              value={message}
              onChangeText={(text) => setMessage(text)}
            />

            {/* Buttons */}
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
            <Text style={styles2.title}>Change Your Bid</Text>

            {/* Bid Amount */}
            <View style={styles2.inputMainContainer}>
              <Text style={styles2.InputName}>Offer Price: </Text>

              <View style={styles2.counterContainer}>
                <TouchableOpacity onPress={handleDecrementExistingPrice}>
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

                <TouchableOpacity onPress={handleIncrementExistingPrice}>
                  <Text style={styles2.buttonCount}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Person count */}
            <View style={styles2.inputMainContainer}>
              <Text style={styles2.InputName}>Persons: </Text>

              <View style={styles2.counterContainer}>
                <TouchableOpacity onPress={handleDecrementExistingPersons}>
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

                <TouchableOpacity onPress={handleIncrementExistingPersons}>
                  <Text style={styles2.buttonCount}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Message */}
            <TextInput
              style={styles2.messageInput}
              placeholder="Enter your message"
              placeholderTextColor="#2ac898"
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
  modalView2: {
    position: "absolute",
    alignSelf: "center",
  },
  inputMainContainer: {
    backgroundColor: "#f4fdfa",
    height: vh(13),
    padding: vh(1),
    marginBottom: vh(1),
    borderRadius: vh(2),
    borderColor: "#d8f7ee",
  },
  bidButtonContainer: {
    marginBottom: vh(11),
    width: vw(40),
    alignSelf: "center",
    marginTop: vh(1),
    height: vh(4),
    justifyContent: "center",
  },

  InputName: {
    fontSize: 18,
    color: "#186ff1",
    fontWeight: "700",
    marginBottom: vh(2),
  },
  messageInput: {
    fontSize: 18,
    color: "#186ff1",
    fontWeight: "700",
    marginBottom: vh(2),
    backgroundColor: "rgba(42,200,152,.1)",
    padding: vh(1),
    borderRadius: vh(2),
  },
  bidInput: {
    color: "#2ac898",
    fontSize: 22,
    fontWeight: "800",
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
    marginBottom: 10,
    textAlign: "center",
  },
  counterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  buttonsContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-around",
  },

  buttonSave: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    backgroundColor: "#186ff1",
    padding: 5,
    width: vw(30),
    borderRadius: vh(4),
    marginTop: 5,
  },
  buttonClear: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    backgroundColor: "#2ac898",
    padding: 5,
    width: vw(30),
    borderRadius: vh(4),
    marginTop: 5,
  },
  buttonCount: {
    fontSize: 24,
    paddingHorizontal: 10,
    paddingVertical: 5,
    // borderWidth: 1,
    borderColor: "#3498db",
    borderRadius: 10,
    backgroundColor: "#fff",
    width: vh(6),
    textAlign: "center",
    color: "#2ac898",
    fontWeight: "800",
  },
  count: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
