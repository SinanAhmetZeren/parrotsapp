import { ParrotsStdText } from "./ParrotsStdText";
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { vw, vh } from "react-native-expo-viewport-units";
import {
  useAcceptBidMutation,
  useDeleteBidMutation,
} from "../slices/VoyageSlice";
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
  currency
}) => {
  const visibleBids = bids?.slice(0, 5);
  const [acceptBid] = useAcceptBidMutation();
  const [deleteBid] = useDeleteBidMutation();
  const [loadingBidId, setLoadingBidId] = useState(null);


  const chatReadyRef = useRef(false);
  // 🟢 Create hub connection ref
  const hubConnection = useRef(null);



  const handleAcceptBid = async ({ bidId, bidUserId }) => {
    const text = `Hi there! 👋 Welcome on board to "${voyageName}" 🎉`;
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
              backgroundColor: "transparent",
            }}
          >
            <View
              style={{
                width: vw(75),
                flexDirection: "row",
                padding: vh(0.1),
              }}
            >
              <ParrotsStdText style={styles.bidUsername}>{bid.userName}</ParrotsStdText>
              <ParrotsStdText style={styles.personCount}>
                <Feather name="users" size={14} color={parrotTextDarkBlue} />{" "}
                {bid.personCount}
              </ParrotsStdText>
              <ParrotsStdText style={styles.offerPrice}>
                {currency} {bid.offerPrice}
              </ParrotsStdText>
            </View>

            {ownVoyage && bid.message ? (
              <View>
                <ParrotsStdText style={styles.seeMessage}>
                  {bid.message &&
                    (bid.message.length > 50
                      ? `${bid.message.substring(0, 47)}...`
                      : bid.message.substring(0, 50))}
                </ParrotsStdText>
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

                if (ownVoyage) {
                  return (
                    <View key={index} style={styles.singleBidContainerPopup}>
                      <View style={{ alignSelf: "flex-start" }}>
                        <Image
                          source={{
                            uri: item.userProfileImage,
                          }}
                          style={styles.bidImage2}
                        />
                      </View>

                      <View style={styles.modalDataContainer}>
                        <View style={styles.nameAndPriceContainer}>
                          <ParrotsStdText style={styles.modalUserNameText}>
                            {item.userName}
                          </ParrotsStdText>
                          <ParrotsStdText style={styles.modalPersonCount}>
                            <Feather
                              name="users"
                              size={14}
                              color={parrotTextDarkBlue}
                            />{" "}
                            {item.personCount}
                          </ParrotsStdText>
                          <ParrotsStdText style={styles.modalPriceText}>
                            {currency} {item.offerPrice.toFixed(2)}
                          </ParrotsStdText>
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
                          <ParrotsStdText
                            style={{
                              color: parrotTextDarkBlue,
                              fontFamily: "Nunito_700Bold",
                            }}
                          >
                            {/* {ownVoyage && item.message} */}
                            {item.message}
                          </ParrotsStdText>
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
                              disabled={loadingBidId !== null}
                            >
                              <View style={styles.acceptTextContainer}>
                                {loadingBidId === item.id
                                  ? <ActivityIndicator size="small" color={parrotBlue} />
                                  : <ParrotsStdText style={styles.acceptText}>Accept</ParrotsStdText>
                                }
                              </View>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={{ flex: 1, alignItems: "center" }}
                              onPress={() => { }}
                            >
                              <View style={styles.acceptTextContainer}>
                                <ParrotsStdText style={styles.acceptedText}>
                                  Accepted
                                </ParrotsStdText>
                              </View>
                            </TouchableOpacity>
                          )}

                          <TouchableOpacity
                            style={{ flex: 1, alignItems: "center" }}
                            onPress={() => {
                              handleDeleteBid({
                                bidId: item.id,
                                bidUserId: item.userId,
                              });
                            }}
                            disabled={loadingBidId !== null}
                          >
                            <View style={styles.acceptTextContainer}>
                              {loadingBidId === item.id
                                ? <ActivityIndicator size="small" color={parrotRed} />
                                : <ParrotsStdText style={styles.deleteText}>Delete</ParrotsStdText>
                              }
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
                          <ParrotsStdText style={styles.modalUserNameTextNotOwn}>
                            {item.userName}
                          </ParrotsStdText>
                          <ParrotsStdText style={styles.modalPersonCountNotOwn}>
                            <Feather
                              name="users"
                              size={14}
                              color={parrotTextDarkBlue}
                            />{" "}
                            {item.personCount}
                          </ParrotsStdText>
                          <ParrotsStdText style={styles.modalPriceTextNotOwn}>
                            {currency} {item.offerPrice}
                          </ParrotsStdText>
                          {item.accepted ? (
                            <View style={styles.acceptTextContainer}>
                              <ParrotsStdText style={styles.acceptedText}>Accepted</ParrotsStdText>
                            </View>
                          ) : (
                            <View style={styles.acceptTextContainer}>
                              <ParrotsStdText style={styles.acceptText}>Pending</ParrotsStdText>
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
            <ParrotsStdText style={styles.buttonClose}>Close</ParrotsStdText>
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
    fontFamily: "Nunito_700Bold",
    color: parrotBlue,
  },
  modalPersonCount: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    width: vw(12),
    textAlign: "right",
    color: parrotTextDarkBlue,
  },
  modalPriceText: {
    width: vw(20),
    color: parrotTextDarkBlue,
    fontFamily: "Nunito_700Bold",
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
    fontFamily: "Nunito_700Bold",
    color: parrotBlue,
  },
  modalPriceTextNotOwn: {
    width: vw(10),
    color: parrotTextDarkBlue,
    fontFamily: "Nunito_700Bold",
    textAlign: "right",
    marginRight: vw(2),
  },
  modalPersonCountNotOwn: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
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
    fontFamily: "Nunito_800ExtraBold",
    backgroundColor: parrotGreenMediumTransparent,
    borderRadius: vh(2),
  },
  acceptText: {
    paddingVertical: vw(0.5),
    paddingHorizontal: vw(3),
    color: parrotBlue,
    fontFamily: "Nunito_800ExtraBold",
    backgroundColor: parrotBlueMediumTransparent,
    borderRadius: vh(2),
    width: vw(20),
    textAlign: "center",
  },
  deleteText: {
    paddingVertical: vw(0.5),
    paddingHorizontal: vw(3),
    color: parrotRed,
    fontFamily: "Nunito_800ExtraBold",
    backgroundColor: parrotRedTransparent,
    borderRadius: vh(2),
    width: vw(20),
    textAlign: "center",
  },
  acceptButtonText: {
    paddingVertical: vw(0.5),
    paddingHorizontal: vw(3),
    color: parrotBlue,
    fontFamily: "Nunito_800ExtraBold",
    backgroundColor: parrotBlueMediumTransparent,
    borderRadius: vh(2),
  },
  buttonClose: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "white",
    textAlign: "center",
    alignSelf: "center",
    marginTop: vh(1),
    backgroundColor: parrotBlue,
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
    fontFamily: "Nunito_700Bold",
  },
  userName: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
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
    fontFamily: "Nunito_700Bold",
    width: vw(45),
    color: parrotBlue,
  },
  personCount: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    width: vw(12),
    textAlign: "right",
    color: parrotTextDarkBlue,
  },
  offerPrice: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
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
    backgroundColor: "rgba(0, 119, 234, 0.04)",
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
    backgroundColor: "white",
    borderRadius: vh(2),
    paddingLeft: vh(0.5),
  },
  singleBidContainerPopup: {
    flexDirection: "row",
    paddingVertical: vh(0.2),
    marginVertical: vh(0.6),
    alignItems: "center",
    borderRadius: vh(2),
    backgroundColor: "rgba(0, 119, 234, 0.04)",
    width: "98%",
    margin: "auto",
    // borderWidth: 1,
    // borderColor: parrotBlueMediumTransparent,
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
