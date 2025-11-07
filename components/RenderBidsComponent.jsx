/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useRef } from "react";
import {
  parrotBlue,
  parrotGreen,
  parrotGreenMediumTransparent,
  parrotBlueMediumTransparent,
  parrotTextDarkBlue,
  parrotRed,
  parrotRedTransparent,
} from "../assets/color.jsx";
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
import {
  useAcceptBidMutation,
  useDeleteBidMutation,
} from "../slices/VoyageSlice";
import { Feather } from "@expo/vector-icons";
import {
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";
import { API_URL } from "@env";

export const RenderBidsComponent = ({
  bids,
  modalVisible,
  setModalVisible,
  ownVoyage,
  voyageName,
  currentUserId,
  refetch,
  username,
}) => {
  const visibleBids = bids.slice(0, 5);
  const [acceptBid] = useAcceptBidMutation();
  const [deleteBid] = useDeleteBidMutation();


  // 🟢 Create hub connection ref
  const hubConnection = useRef(null);

  // 🟢 Initialize and start connection
  useEffect(() => {
    if (!currentUserId) return;

    // Build connection only once
    hubConnection.current = new HubConnectionBuilder()
      .withUrl(`${API_URL}/chathub/11?userId=${currentUserId}`)
      .withAutomaticReconnect()
      .build();

    const startHubConnection = async () => {
      try {
        if (hubConnection.current.state === HubConnectionState.Disconnected) {
          await hubConnection.current.start();
          console.log("✅ SignalR connected successfully.");
        }
      } catch (error) {
        console.error("❌ Failed to start SignalR connection:", error);
        setTimeout(startHubConnection, 3000); // Retry after 3 sec if fails
      }
    };

    startHubConnection();

    // 🟢 Cleanup connection on unmount
    return () => {
      if (hubConnection.current) {
        hubConnection.current.stop()
          .then(() => console.log("🔴 SignalR stopped"))
          .catch((err) => console.error("❌ Failed to stop SignalR:", err));
      }
    };
  }, [currentUserId]);

  // 🟢 Accept bid handler
  const handleAcceptBid = async ({ bidId, bidUserId }) => {
    const text = `Hi there! 👋 Welcome on board to "${voyageName}" 🎉`;
    try {
      if (hubConnection.current?.state === HubConnectionState.Connected) {
        await hubConnection.current.invoke(
          "SendMessage",
          currentUserId,
          bidUserId,
          text
        );
      } else {
        console.warn("⚠️ SignalR not connected. Message not sent.");
      }

      await acceptBid(bidId).unwrap();
      await refetch();
    } catch (error) {
      console.error("❌ Failed to accept bid or send message:", error);
    }
  };

  // 🟢 Delete bid handler
  const handleDeleteBid = async ({ bidId, bidUserId }) => {
    const text = `Hi there! 👋 Your bid was deleted by ${username}`;
    try {
      if (hubConnection.current?.state === HubConnectionState.Connected) {
        await hubConnection.current.invoke(
          "SendMessage",
          currentUserId,
          bidUserId,
          text
        );
      } else {
        console.warn("⚠️ SignalR not connected. Delete message not sent.");
      }

      await deleteBid(bidId).unwrap();
      await refetch();
    } catch (error) {
      console.error("❌ Failed to delete bid or send message:", error);
    }
  };


  return (
    <View>
      {visibleBids.map((bid, index) => (
        <View key={index} style={styles.singleBidContainer}>
          <Image
            source={{
              uri: bid.userProfileImage,
            }}
            style={styles.bidImage}
          />
          <View
            style={{
              width: vw(75),
              flexDirection: "column",
              padding: vh(0.1),
            }}
          >
            <View
              style={{
                width: vw(75),
                flexDirection: "row",
                padding: vh(0.1),
              }}
            >
              <Text style={styles.bidUsername}>{bid.userName}</Text>
              <Text style={styles.personCount}>
                <Feather name="users" size={14} color={parrotTextDarkBlue} />{" "}
                {bid.personCount}
              </Text>
              <Text style={styles.offerPrice}>
                {bid.currency} {bid.offerPrice}
              </Text>
            </View>

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
                // console.log("Rendering item:", item);

                if (ownVoyage) {
                  return (
                    <View key={index} style={styles.singleBidContainerPopup}>
                      <View>
                        <Image
                          source={{
                            uri: item.userProfileImage,
                          }}
                          style={styles.bidImage2}
                        />
                      </View>

                      <View style={styles.modalDataContainer}>
                        <View style={styles.nameAndPriceContainer}>
                          <Text style={styles.modalUserNameText}>
                            {item.userName}
                          </Text>
                          <Text style={styles.modalPersonCount}>
                            <Feather
                              name="users"
                              size={14}
                              color={parrotTextDarkBlue}
                            />{" "}
                            {item.personCount}
                          </Text>
                          <Text style={styles.modalPriceText}>
                            {item.currency} {item.offerPrice.toFixed(2)}
                          </Text>
                        </View>
                        <View
                          style={
                            (styles.modalMessageContainer,
                            {
                              display:
                                // item.message && ownVoyage ? "flex" : "none",
                                item.message ? "flex" : "none",
                            })
                          }
                        >
                          <Text
                            style={{
                              color: parrotTextDarkBlue,
                            }}
                          >
                            {/* {ownVoyage && item.message} */}
                            {item.message}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            marginTop: item.message ? vh(0.5) : vh(1),
                            marginBottom: vh(1),
                          }}
                        >
                          {!item.accepted ? (
                            <TouchableOpacity
                              style={{ flex: 1, alignItems: "center" }}
                              onPress={() =>
                                handleAcceptBid({
                                  bidId: item.id,
                                  bidUserId: item.userId,
                                })
                              }
                            >
                              <View style={styles.acceptTextContainer}>
                                <Text style={styles.acceptText}>Accept</Text>
                              </View>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={{ flex: 1, alignItems: "center" }}
                              onPress={console.log("bid accepted")}
                            >
                              <View style={styles.acceptTextContainer}>
                                <Text style={styles.acceptedText}>
                                  Accepted
                                </Text>
                              </View>
                            </TouchableOpacity>
                          )}

                          <TouchableOpacity
                            style={{ flex: 1, alignItems: "center" }}
                            onPress={() => {
                              console.log("Delete bid:", item.id);
                              handleDeleteBid({
                                bidId: item.id,
                                bidUserId: item.userId,
                              });
                            }}
                          >
                            <View style={styles.acceptTextContainer}>
                              <Text style={styles.deleteText}>Delete</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                } else {
                  return (
                    <View key={index} style={styles.singleBidContainerPopup}>
                      <View>
                        <Image
                          source={{
                            uri: item.userProfileImage,
                          }}
                          style={styles.bidImage2}
                        />
                      </View>

                      <View style={styles.modalDataContainerNotOwn}>
                        <View style={styles.nameAndPriceContainerNotOwn}>
                          <Text style={styles.modalUserNameTextNotOwn}>
                            {item.userName}
                          </Text>
                          <Text style={styles.modalPersonCountNotOwn}>
                            <Feather
                              name="users"
                              size={14}
                              color={parrotTextDarkBlue}
                            />{" "}
                            {item.personCount}
                          </Text>
                          <Text style={styles.modalPriceTextNotOwn}>
                            {item.currency} {item.offerPrice}
                          </Text>
                          {item.accepted ? (
                            <View style={styles.acceptTextContainer}>
                              <Text style={styles.acceptedText}>Accepted</Text>
                            </View>
                          ) : (
                            <View style={styles.acceptTextContainer}>
                              <Text style={styles.acceptText}>Pending</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                }
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
  acceptTextContainer: {
    backgroundColor: "white",
    borderRadius: vh(2),
  },
  modalMessageContainer: {
    width: vw(72),
    marginBottom: vh(0.5),
    marginLeft: vw(3),
    display: "flex",
    flexDirection: "row",
  },

  modalUserNameText: {
    width: vw(43),
    fontWeight: "bold",
    color: parrotTextDarkBlue,
  },
  modalPersonCount: {
    fontSize: 14,
    fontWeight: "bold",
    width: vw(12),
    textAlign: "right",
    color: parrotTextDarkBlue,
  },
  modalPriceText: {
    width: vw(20),
    color: parrotTextDarkBlue,
    fontWeight: "bold",
    textAlign: "right",
  },
  nameAndPriceContainer: {
    width: vw(75),
    display: "flex",
    flexDirection: "row",
  },
  nameAndPriceContainerNotOwn: {
    width: vw(33),
    display: "flex",
    flexDirection: "row",
  },
  modalDataContainer: {
    width: vw(75),
  },
  modalUserNameTextNotOwn: {
    width: vw(32),
    fontWeight: "bold",
    color: parrotTextDarkBlue,
  },
  modalPriceTextNotOwn: {
    width: vw(10),
    color: parrotTextDarkBlue,
    fontWeight: "bold",
    textAlign: "right",
    marginRight: vw(2),
  },
  modalPersonCountNotOwn: {
    fontSize: 14,
    fontWeight: "bold",
    width: vw(12),
    textAlign: "right",
    color: parrotTextDarkBlue,
  },
  modalDataContainerNotOwn: {
    width: vw(75),
  },
  acceptedText: {
    paddingVertical: vw(0.5),
    paddingHorizontal: vw(2),
    color: parrotGreen,
    fontWeight: "900",
    backgroundColor: parrotGreenMediumTransparent,
    borderRadius: vh(2),
  },
  acceptText: {
    paddingVertical: vw(0.5),
    paddingHorizontal: vw(3),
    color: parrotBlue,
    fontWeight: "900",
    backgroundColor: parrotBlueMediumTransparent,
    // backgroundColor: "yellow",
    borderRadius: vh(2),
    width: vw(20),
    textAlign: "center",
  },
  deleteText: {
    paddingVertical: vw(0.5),
    paddingHorizontal: vw(3),
    color: parrotRed,
    fontWeight: "900",
    backgroundColor: parrotRedTransparent,
    // backgroundColor: "white",
    // backgroundColor: "yellow",
    borderRadius: vh(2),
    width: vw(20),
    textAlign: "center",
  },
  acceptButtonText: {
    paddingVertical: vw(0.5),
    paddingHorizontal: vw(3),
    color: parrotBlue,
    fontWeight: "900",
    backgroundColor: parrotBlueMediumTransparent,
    borderRadius: vh(2),
  },
  buttonClose: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    alignSelf: "center",
    marginTop: vh(1),
    backgroundColor: "#186ff1",
    padding: 5,
    width: vw(30),
    borderRadius: vh(4),
  },

  nameAndPrice: {
    width: vw(75),
    display: "flex",
    flexDirection: "row",
  },
  seeMessage: {
    borderRadius: vh(2),
    paddingLeft: vw(4),
    paddingBottom: vh(0.2),
    width: vw(75),
    color: parrotTextDarkBlue,
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
    width: vw(45),
    color: parrotTextDarkBlue,
  },
  personCount: {
    fontSize: 14,
    fontWeight: "bold",
    width: vw(12),
    textAlign: "right",
    color: parrotTextDarkBlue,
  },
  offerPrice: {
    fontSize: 14,
    fontWeight: "bold",
    width: vw(15),
    textAlign: "right",
    color: parrotTextDarkBlue,
  },

  singleBidContainer: {
    flexDirection: "row",
    padding: vh(0.5),
    margin: vh(0.3),
    alignItems: "center",
    borderRadius: vh(2),
    backgroundColor: "rgba(0, 119, 234,0.05)",
    borderWidth: 1,
    borderColor: parrotBlueMediumTransparent,
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
    backgroundColor: "white",
    borderColor: "#bfdff4",
    borderRadius: vh(2),
    paddingLeft: vh(0.5),
  },
  singleBidContainerPopup: {
    flexDirection: "row",
    paddingVertical: vh(0.2),
    marginVertical: vh(0.6),
    alignItems: "center",
    borderRadius: vh(2),
    backgroundColor: "rgba(0, 119, 234,0.05)",
    width: "98%",
    margin: "auto",
    borderWidth: 1,
    borderColor: parrotBlueMediumTransparent,
  },
  bidImage2: {
    width: vh(5),
    height: vh(5),
    borderRadius: vh(2.5),
    marginRight: 8,
    marginLeft: vw(2),
    backgroundColor: "grey",
  },
});
