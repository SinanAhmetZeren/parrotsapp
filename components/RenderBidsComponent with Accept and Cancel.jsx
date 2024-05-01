/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
} from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { useAcceptBidMutation } from "../slices/VoyageSlice";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

export const RenderBidsComponent = ({
  bids,
  modalVisible,
  setModalVisible,
  ownVoyage,
  voyageName,
  currentUserId,
  refetch,
}) => {
  const UserImageBaseUrl = `https://measured-wolf-grossly.ngrok-free.app/Uploads/UserImages/`;
  const visibleBids = bids.slice(0, 6);
  const [acceptBid] = useAcceptBidMutation();
  const closeModal = () => {
    setModalVisible(false);
  };
  const [acceptBidModalVisible, setAcceptBidModalVisible] = useState(false);

  const toggleAcceptBidModal = () => {
    setAcceptBidModalVisible(true);
  };

  const handleAcceptBid = ({ bidId, bidUserId }) => {
    const text = `Welcome on board to ${voyageName}`;
    const senderId = currentUserId;
    const receiverId = bidUserId;

    acceptBid(bidId);
    Toast.show({
      type: "success",
      text1: "Bid Accepted",
      text2: "Message sent to participant",
      visibilityTime: 1000,
      topOffset: 150,
    });
    refetch();

    // SEND MESSAGE
    // CHANGE BID TO ACCEPTED
  };

  return (
    <View>
      {visibleBids.map((bid, index) => (
        <View key={index} style={styles.singleBidContainer}>
          <Image
            source={{
              uri: UserImageBaseUrl + bid.userProfileImage,
            }}
            style={styles.bidImage}
          />
          <View>
            <Text style={styles.bidUsername}>{bid.userName}</Text>
            <View>
              <Text style={styles.seeMessage}>
                {ownVoyage && (bid.message ?? null)}
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.offerPrice}>
              {bid.currency} {bid.offerPrice}
            </Text>
          </View>
        </View>
      ))}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.flatlistContainer}>
          <FlatList
            style={styles.BidsFlatList}
            data={bids}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <>
                  <View key={index} style={styles.singleBidContainer2}>
                    <Image
                      source={{
                        uri: UserImageBaseUrl + item.userProfileImage,
                      }}
                      style={styles.bidImage2}
                    />
                    <View>
                      <View style={styles.nameAndMessage}>
                        <Text style={styles.bidUsername2}>{item.userName}</Text>
                        <Text style={styles.seeMessage}>
                          {ownVoyage && (item.message ?? null)}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.offerPrice2}>
                        {item.currency} {item.offerPrice.toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.acceptedButton}>
                      {item.accepted ? (
                        <Text>
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color="#3c9dde"
                          />
                        </Text>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            toggleAcceptBidModal();
                          }}
                        >
                          <Text>
                            <Ionicons
                              name="checkmark-circle-outline"
                              size={24}
                              color="#93c9ed"
                            />
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  <Modal
                    animationType="fade"
                    transparent={true}
                    visible={acceptBidModalVisible}
                    onRequestClose={closeModal}
                  >
                    <View style={styles.acceptBidModal}>
                      <TouchableOpacity
                        onPress={() =>
                          handleAcceptBid({
                            bidId: item.id,
                            bidUserId: item.userId,
                          })
                        }
                      >
                        <Text style={styles.bidOptionAccept}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setAcceptBidModalVisible(false)}
                      >
                        <Text style={styles.bidOptionCancel}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </Modal>
                </>
              );
            }}
          />
          <TouchableOpacity
            onPress={closeModal}
            style={styles.closeButtonInModal}
          >
            <Text style={styles.closeTextInModal}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  bidOptionAccept: {
    padding: vw(3),
    backgroundColor: "green",
    width: vw(25),
    alignSelf: "center",
    margin: vw(2),
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  bidOptionCancel: {
    padding: vw(3),
    backgroundColor: "red",
    width: vw(25),
    alignSelf: "center",
    margin: vw(2),
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  acceptBidModal: {
    top: vh(50),
    flexDirection: "row",
    backgroundColor: "white",
    alignSelf: "center",
    padding: vh(1.5),
    borderRadius: vh(3),
  },
  acceptedButton: {
    paddingLeft: vw(3),
  },
  nameAndMessage: {
    width: vw(45),
  },
  seeMessage: {
    // backgroundColor: "rgba(10, 119, 234,.05)",
    // backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: vh(2),
    paddingLeft: vw(4),
    paddingBottom: vh(0.2),
    width: vw(55),
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: vw(10),
  },

  subContainer: {
    backgroundColor: "blue",
    padding: vh(1),
    margin: vh(0.5),
    marginTop: vh(0.5),
  },

  userName: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: vh(0.2),
    color: "blue",
  },

  bidImage: {
    width: vh(5),
    height: vh(5),
    borderRadius: vh(2.5),
    marginRight: 8,
    backgroundColor: "grey",
  },
  profileImage: {
    width: vh(3),
    height: vh(3),
    borderRadius: vh(2.5),
    marginRight: 8,
    backgroundColor: "grey",
  },
  bidUsername: {
    fontSize: 14,
    width: vw(50),
  },
  offerPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2ac898",
    width: vw(20),
    textAlign: "right",
  },
  currentBidsTitle: {
    paddingLeft: vw(2),
    fontSize: 25,
    fontWeight: "700",
    color: "#1c71a9",
  },
  allBidsContainer: {
    margin: vh(1),
    padding: vh(0),
  },
  singleBidContainer: {
    flexDirection: "row",
    padding: vh(0.5),
    margin: vh(0.3),
    alignItems: "center",
    borderRadius: vh(3),
    backgroundColor: "rgba(0, 119, 234,0.05)",
    borderColor: "rgba(10, 119, 234,0.3)",
  },
  flatlistContainer: {
    backgroundColor: "rgba(1,1,1,0.4)",
    height: vh(100),
  },
  BidsFlatList: {
    width: vw(95),
    height: vh(50),
    marginTop: vh(30),
    alignSelf: "center",
    backgroundColor: "#f2fafa",
    borderColor: "#bfdff4",
    borderRadius: vh(2),
    padding: vh(1),
  },
  singleBidContainer2: {
    flexDirection: "row",
    padding: vh(0.2),
    margin: vh(0.3),
    alignItems: "center",
    backgroundColor: "rgba(220,238,249,0.4)",
    borderRadius: vh(5),
  },
  bidImage2: {
    width: vh(5),
    height: vh(5),
    borderRadius: vh(2.5),
    marginRight: 8,
    backgroundColor: "grey",
  },
  bidUsername2: {
    fontSize: 14,
    fontWeight: "500",
    width: vw(40),
  },
  offerPrice2: {
    fontSize: 18,
    fontWeight: "800",
    width: vw(20),
    textAlign: "right",
    color: "#2ac898",
  },
  closeButtonInModal: {
    alignSelf: "center",
    marginRight: vw(10),
    backgroundColor: "#f2fafa",
    borderRadius: vw(5),
    borderColor: "#93c9ed",
    padding: vw(1),
    paddingHorizontal: vw(3),
    marginTop: vh(1),
    marginBottom: vh(15),
  },
  closeTextInModal: {
    color: "#3c9dde",
    fontWeight: "700",
    fontSize: 16,
  },
});
