/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useMemo } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Modal,
  StyleSheet,
} from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { useAcceptBidMutation } from "../slices/VoyageSlice";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
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
  const visibleBids = bids.slice(0, 5);
  const [acceptBid] = useAcceptBidMutation();

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

            {ownVoyage && bid.message ? (
              <View>
                <Text style={styles.seeMessage}>
                  {bid.message &&
                    (bid.message.length > 50
                      ? `${bid.message.substring(0, 47)}...`
                      : bid.message.substring(0, 50))}
                </Text>
              </View>
            ) : null}
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
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.flatlistContainer}>
          <View>
            <FlatList
              style={styles.BidsFlatList}
              data={bids}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                return (
                  <View key={index} style={styles.singleBidContainer2}>
                    <View>
                      <Image
                        source={{
                          uri: UserImageBaseUrl + item.userProfileImage,
                        }}
                        style={styles.bidImage2}
                      />
                    </View>
                    <View>
                      <View style={styles.nameAndMessage}>
                        <Text style={styles.bidUsername2}>{item.userName}</Text>
                        {ownVoyage && item.message ? (
                          <View>
                            <Text style={styles.seeMessage}>
                              {item.message ?? null}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.offerPrice2}>
                        {item.currency} {item.offerPrice.toFixed(2)}
                      </Text>

                      <View style={styles.acceptedButton}>
                        {item.accepted ? (
                          <Text>
                            <Ionicons
                              name="checkmark-circle"
                              size={29}
                              color="#2ac898"
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
                            style={styles.thumbsUpCircle}
                          >
                            <Text
                              style={{
                                padding: vw(0.9),
                              }}
                            >
                              <FontAwesome
                                name="thumbs-up"
                                size={16}
                                color="#2ac898"
                              />
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <Text>
                            <Ionicons
                              name="checkmark-circle-outline"
                              size={28}
                              color="#2ac898"
                            />
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </View>

          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonClose}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonClose: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    alignSelf: "center",
    marginTop: vh(1),
    backgroundColor: "#186ff1",
    padding: 5,
    width: vw(30),
    borderRadius: vh(4),
  },
  thumbsUpCircle: {
    borderWidth: 2,
    borderRadius: vh(3),
    borderColor: "#2ac898",
    backgroundColor: "white",
  },
  logo: {
    height: vh(5),
    width: vh(5),
    borderRadius: vh(10),
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: vh(10),
    padding: vh(0.5),
    borderColor: "#93c9ed",
    position: "absolute",
    top: vh(15.5),
    right: vw(2),
    zIndex: 100,
  },
  acceptedButton: {
    marginTop: vh(0.5),
    marginLeft: vw(2),
    alignItems: "center",
    // backgroundColor: "pink",
  },
  nameAndMessage: {
    width: vw(52),
  },
  seeMessage: {
    borderRadius: vh(2),
    paddingLeft: vw(4),
    paddingBottom: vh(0.2),
    width: vw(50),
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
    flex: 1,
  },
  BidsFlatList: {
    width: vw(95),
    maxHeight: vh(50),
    marginTop: vh(20),
    alignSelf: "center",
    backgroundColor: "#f2fafa",
    borderColor: "#bfdff4",
    borderRadius: vh(2),
    paddingLeft: vh(0.5),
  },
  singleBidContainer2: {
    flexDirection: "row",
    paddingVertical: vh(0.2),
    marginVertical: vh(0.3),
    alignItems: "center",
    backgroundColor: "rgba(220,238,249,0.4)",
    borderRadius: vh(2),
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
    // backgroundColor: "yellow",
  },
  offerPrice2: {
    fontSize: 16,
    fontWeight: "800",
    width: vw(19),
    textAlign: "right",
    color: "#3c9dde",
    // backgroundColor: "red",
    alignSelf: "center",
  },
});
