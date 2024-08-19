/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useMemo } from "react";
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
import { HubConnectionBuilder } from "@microsoft/signalr";
import { API_URL } from "@env";

export const RenderBidsComponent = ({
  bids,
  modalVisible,
  setModalVisible,
  ownVoyage,
  voyageName,
  currentUserId,
  refetch,
}) => {
  const UserImageBaseUrl = `${API_URL}/Uploads/UserImages/`;
  const visibleBids = bids.slice(0, 6);
  const [acceptBid] = useAcceptBidMutation();
  const closeModal = () => {
    setModalVisible(false);
  };

  const hubConnection = useMemo(() => {
    return new HubConnectionBuilder()
      .withUrl(`${API_URL}/chathub/11?userId=${currentUserId}`)
      .build();
  }, [currentUserId]);

  useEffect(() => {
    const startHubConnection = async () => {
      try {
        await hubConnection.start();
        console.log("SignalR connection  started successfully.");
      } catch (error) {
        console.error("Failed to start SignalR connection:", error);
      }
    };
    startHubConnection();
    return () => {};
  }, []);

  const handleAcceptBid = ({ bidId, bidUserId }) => {
    const text = `Hi there! 👋 Welcome on board to "${voyageName}" 🎉`;

    hubConnection.invoke("SendMessage", currentUserId, bidUserId, text);

    acceptBid(bidId);
    refetch();
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
                    ) : ownVoyage ? (
                      <TouchableOpacity
                        onPress={() =>
                          handleAcceptBid({
                            bidId: item.id,
                            bidUserId: item.userId,
                          })
                        }
                      >
                        <Text>
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={24}
                            color="#93c9ed"
                          />
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text>
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={24}
                          color="#93c9ed"
                        />
                      </Text>
                    )}
                  </View>
                </View>
              );
            }}
          />
          <TouchableOpacity
            onPress={closeModal}
            style={styles.closeButtonInModal2}
          >
            <Image
              style={styles.logo}
              source={require("../assets/close-icon.png")}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: vh(5),
    width: vh(5),
    borderRadius: vh(10),
  },
  closeButtonInModal2: {
    alignSelf: "center",
    backgroundColor: "rgba(217, 241, 241,.75)",
    borderRadius: vh(10),
    padding: vh(1.5),
    borderColor: "#93c9ed",
    marginTop: vh(1),
    marginBottom: vh(15),
  },
  acceptedButton: {
    paddingLeft: vw(3),
  },
  nameAndMessage: {
    width: vw(45),
  },
  seeMessage: {
    borderRadius: vh(2),
    paddingLeft: vw(4),
    paddingBottom: vh(0.2),
    width: vw(55),
    backgroundColor: "orange",
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
    fontWeight: "500",
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
    backgroundColor: "yellow",
  },
  offerPrice2: {
    fontSize: 18,
    fontWeight: "800",
    width: vw(20),
    textAlign: "right",
    color: "#2ac898",
    backgroundColor: "pink",
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
