import { ParrotsStdText } from "../components/ParrotsStdText";
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  Keyboard,
  AppState,
  BackHandler,
  Platform,
} from "react-native";
import { useGetMessagesBetweenUsersQuery } from "../slices/MessageSlice";
import { vh, vw } from "react-native-expo-viewport-units";
import { useSelector, useDispatch } from "react-redux";
import { markMessagesRead, setUnreadMessages } from "../slices/UserSlice";
import { useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import parrotEmojiIcon from "../assets/emojipickerparrot.jpg";
import parrotEmojiIconBlue from "../assets/emojipickerblueparrot.jpg";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { parrotBlue, parrotBlueSemiTransparent, parrotBlueSemiTransparent2, parrotBlueTransparent, parrotLightBlue, parrotLightCream, parrotPlaceholderGrey } from "../assets/color";
import {
  invokeHub, isHubReady,
  register_ReceiveMessage, unregister_ReceiveMessage,
  register_ReceiveMessageRefetch, unregister_ReceiveMessageRefetch,
  register_OnReconnecting, unregister_OnReconnecting,
  register_OnReconnected, unregister_OnReconnected,
} from "../signalr/signalRHub";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { FlatList } from "react-native";
const DeviceInfo = Constants.appOwnership === "expo" ? null : require('react-native-device-info').default;

const EMOJI_CATEGORIES = [
  { icon: "😀", label: "Smileys" },
  { icon: "👋", label: "People" },
  { icon: "🐶", label: "Animals" },
  { icon: "🍕", label: "Food" },
  { icon: "✈️", label: "Travel" },
  { icon: "⚽", label: "Activity" },
  { icon: "💡", label: "Objects" },
  { icon: "🔥", label: "Symbols" },
];

const EMOJIS_BY_CATEGORY = {
  Smileys: [
    "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩",
    "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐",
    "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒",
    "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "🥸", "😎", "🤓", "🧐", "😕",
    "😟", "🙁", "☹️", "😮", "😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱",
    "😖", "😣", "😞", "😓", "😩", "😫", "🥱", "😤", "😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "💩",
    "🤡", "👹", "👺", "👻", "👽", "👾", "🤖", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾",
  ],
  People: [
    "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆",
    "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️",
    "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🫀", "🫁", "🧠", "🦷", "🦴", "👀",
    "👁️", "👅", "👄", "💋", "👶", "🧒", "👦", "👧", "🧑", "👱", "👨", "🧔", "👩", "🧓", "👴", "👵",
    "🙍", "🙎", "🙅", "🙆", "💁", "🙋", "🧏", "🙇", "🤦", "🤷", "💆", "💇", "🚶", "🧍", "🧎", "🏃",
    "💃", "🕺", "🧖", "🧗", "🏇", "🏂", "🏋️", "🤼", "🤸", "⛹️", "🤺", "🏊", "🚴", "🧘", "👫", "👬",
  ],
  Animals: [
    "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐽", "🐸", "🐵",
    "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄",
    "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🦟", "🦗", "🕷️", "🦂", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙",
    "🦑", "🦐", "🦞", "🦀", "🐡", "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍",
    "🦧", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🦘", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🦙",
    "🐐", "🦌", "🐕", "🐩", "🦮", "🐈", "🐓", "🦃", "🦚", "🦜", "🦢", "🦩", "🕊️", "🐇", "🦝", "🦨",
    "🌵", "🎄", "🌲", "🌳", "🌴", "🌱", "🌿", "☘️", "🍀", "🎍", "🎋", "🍃", "🍂", "🍁", "🍄", "🌾",
    "💐", "🌷", "🌹", "🥀", "🌺", "🌸", "🌼", "🌻", "🌞", "🌝", "🌛", "🌜", "🌚", "🌕", "🌙", "⭐",
    "🌟", "💫", "✨", "⚡", "🌈", "☀️", "🌤️", "⛅", "🌦️", "🌧️", "⛈️", "🌩️", "🌨️", "❄️", "💧", "🌊",
  ],
  Food: [
    "🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥",
    "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️", "🫑", "🌽", "🥕", "🧄", "🧅", "🥔", "🍠", "🥐",
    "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🦴", "🌭",
    "🍔", "🍟", "🍕", "🫓", "🥪", "🥙", "🧆", "🌮", "🌯", "🫔", "🥗", "🥘", "🫕", "🍝", "🍜", "🍲",
    "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚", "🍘", "🍥", "🥮", "🍢", "🧁", "🍰", "🎂", "🍮",
    "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🥜", "🍯", "🧃", "🥤", "🧋", "☕", "🍵", "🍶", "🍺",
    "🍻", "🥂", "🍷", "🥃", "🍸", "🍹", "🧉", "🍾", "🧊", "🥄", "🍴", "🍽️", "🥢", "🧂",
  ],
  Travel: [
    "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🛵", "🏍️",
    "🚲", "🛴", "🛺", "🚁", "🛸", "✈️", "🛩️", "🛫", "🛬", "🪂", "💺", "🚀", "🛶", "⛵", "🚤", "🛥️",
    "🚢", "⚓", "🗺️", "🗼", "🗽", "🗿", "🏔️", "⛰️", "🌋", "🏕️", "🏖️", "🏜️", "🏝️", "🏞️", "🏟️", "🏛️",
    "🏗️", "🧱", "🏘️", "🏚️", "🏠", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", "🏪", "🏫", "🏬",
    "🏭", "🏯", "🏰", "💒", "⛪", "🌁", "🌃", "🌄", "🌅", "🌆", "🌇", "🌉", "🌌", "🌠", "🎇",
  ],
  Activity: [
    "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🏓", "🏸", "🥊", "🥋", "🎯", "🪃",
    "🏹", "🎣", "🤿", "🎽", "🎿", "🛷", "🥌", "🎮", "🕹️", "🎲", "🎭", "🎨", "🎬", "🎤", "🎧", "🎼",
    "🎵", "🎶", "🎸", "🎹", "🥁", "🪘", "🎷", "🎺", "🪗", "🎻", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️",
  ],
  Objects: [
    "💡", "🔦", "🕯️", "💰", "💵", "💴", "💶", "💷", "💸", "💳", "🪙", "💎", "🔑", "🗝️", "🔒", "🔓",
    "🔨", "🪓", "⛏️", "🔧", "🪛", "🔩", "⚙️", "🧲", "🔫", "💣", "🔪", "⚔️", "🛡️", "📱", "💻", "🖥️",
    "📷", "📸", "📹", "🎥", "📡", "📺", "📻", "🎙️", "📞", "☎️", "🔋", "🔌", "📦", "📫", "📬", "📭",
    "📰", "📃", "📜", "📄", "📊", "📈", "📉", "📋", "📅", "📆", "📌", "📍", "✂️", "📎", "🖊️", "✏️",
    "🔍", "🔎", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓",
    "💗", "💖", "💘", "💝",
  ],
  Symbols: [
    "🔥", "💥", "✨", "🎉", "🎊", "🎈", "🎁", "🎀", "🏮", "🧧", "✉️", "📩", "📨", "🚩", "🏁", "🏳️",
    "🚫", "⛔", "🚷", "📵", "🔞", "💯", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚫", "⚪", "🟤", "🔶",
    "🔷", "🔸", "🔹", "🔺", "🔻", "💠", "🔘", "🔲", "🔳", "▪️", "▫️", "◾", "☮️", "✝️", "☪️", "🕉️",
    "✡️", "🔯", "🪯", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "⛎",
  ],
};


const formatDate = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return [`${hours}:${minutes}`, `${day}/${month}/${year}`];
};

export const ConversationDetailScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMsg] = useState("");
  const [message, setMessage] = useState("");
  const [messagesToDisplay, setMessagesToDisplay] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef();
  const sendTimestampsRef = useRef([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState("Smileys");

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (emojiOpen) { setEmojiOpen(false); return true; }
      return false;
    });
    return () => sub.remove();
  }, [emojiOpen]);
  const insets = useSafeAreaInsets();
  const tabBarHeight = Platform.OS === "ios"
    ? (vh(100) - insets.top - insets.bottom) * 0.08
    : vh(8);
  const isTablet = DeviceInfo ? DeviceInfo.isTablet() : false;
  const containerHeight = Platform.OS === "ios" || isTablet
    ? vh(103) - tabBarHeight - insets.top - insets.bottom
    : vh(105) - tabBarHeight;

  const showToast = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const route = useRoute();
  const currentUserId = useSelector((state) => state.users.userId);
  const { conversationUserId, profileImg, name, publicId } = route.params;

  const { data: messagesData, refetch } = useGetMessagesBetweenUsersQuery(
    { currentUserId, conversationUserId },
    { skip: !currentUserId || !conversationUserId, refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (messagesData) setMessagesToDisplay(messagesData.data);
  }, [messagesData]);

  useEffect(() => {
    if (scrollViewRef.current && messagesToDisplay?.length > 0) {
      requestAnimationFrame(() => scrollViewRef.current?.scrollToEnd({ animated: true }));
    }
  }, [messagesToDisplay]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => setKeyboardHeight(e.endCoordinates.height));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardHeight(0));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  useEffect(() => {
    if (keyboardHeight > 0) {
      requestAnimationFrame(() => scrollViewRef.current?.scrollToEnd({ animated: true }));
    }
  }, [keyboardHeight]);

  useFocusEffect(
    useCallback(() => {
      refetch().then(result => {
        if (result.data) setMessagesToDisplay(result.data.data);
      });
      if (isHubReady()) invokeHub("EnterConversationPage", currentUserId, conversationUserId);
      return () => {
        if (isHubReady()) invokeHub("LeaveConversationPage", currentUserId);
      };
    }, [refetch, currentUserId, conversationUserId])
  );

  useFocusEffect(
    useCallback(() => {
      const handleReceiveMessage = (last5) => {
        if (!Array.isArray(last5)) return;
        setMessagesToDisplay((prev) => {
          const existingIds = new Set(last5.map(m => m.id));
          const kept = (prev ?? []).filter(m => !m.id || !existingIds.has(m.id));
          return [...kept, ...last5];
        });
      };
      register_ReceiveMessage(handleReceiveMessage);
      return () => {
        unregister_ReceiveMessage(handleReceiveMessage);
      };
    }, [refetch])
  );

  useFocusEffect(
    useCallback(() => {
      const handleReconnecting = () => { };
      const handleReconnected = () => { setToastVisible(false); };
      register_OnReconnecting(handleReconnecting);
      register_OnReconnected(handleReconnected);
      return () => {
        setToastVisible(false);
        unregister_OnReconnecting(handleReconnecting);
        unregister_OnReconnected(handleReconnected);
      };
    }, [])
  );

  const handleSend = async () => {
    if (!message.trim() || isSending) return;
    const now = Date.now();
    sendTimestampsRef.current = sendTimestampsRef.current.filter((t) => now - t < 5000);
    if (sendTimestampsRef.current.length >= 5) return;
    sendTimestampsRef.current.push(now);

    scrollViewRef.current?.scrollToEnd({ animated: true });

    const optimistic = {
      senderId: currentUserId,
      receiverId: conversationUserId,
      text: message,
      dateTime: new Date().toISOString(),
    };
    setMessagesToDisplay((prev) => [...(prev ?? []), optimistic]);
    const saved = message;
    setMessage("");
    if (keyboardHeight > 0) Keyboard.dismiss();
    setIsSending(true);

    try {
      if (!isHubReady()) { setMessage(saved); setIsSending(false); return; }
      await invokeHub("SendMessage", currentUserId, conversationUserId, saved);
    } catch {
      setMessagesToDisplay((prev) => prev.filter((m) => m !== optimistic));
      setMessage(saved);
      showToast("Message not sent - Please check your connection.");
    } finally {
      setIsSending(false);
    }
  };

  const emojiPickerHeight = vh(35);

  const outerHeight = keyboardHeight > 0 ? containerHeight - keyboardHeight + tabBarHeight : containerHeight;

  return (
    <TouchableWithoutFeedback onPress={() => { if (emojiOpen) setEmojiOpen(false); }} accessible={false}>
      <View style={{ backgroundColor: "white", height: outerHeight }}>
        <View style={[styles.mainContainer, { flex: 1 }]}>
          {/* // HEADER // */}
          <TouchableOpacity
            style={styles.headerStyle}
            onPress={() => navigation.navigate("Messages", {
              screen: "ProfileScreenPublic",
              params: { publicId, userName: name, userId: conversationUserId },
            })}
          >
            <Image source={{ uri: profileImg }} style={styles.profileImage} />
            <ParrotsStdText style={styles.nameStyle} numberOfLines={1}>{name} {">"}</ParrotsStdText>
          </TouchableOpacity>
          {/* // HEADER // */}


          {/* // MESSAGES // */}
          <View style={styles.messagesWrapper}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesList}
              contentContainerStyle={{ paddingBottom: vh(2) }}
              keyboardShouldPersistTaps="handled"
            >
              {messagesToDisplay?.map((msg, index) => {
                const isMe = msg.senderId === currentUserId;
                const [time, date] = formatDate(msg.dateTime);
                const prevMsg = messagesToDisplay[index - 1];
                const prevDate = prevMsg ? formatDate(prevMsg.dateTime)[1] : null;
                const showDateSeparator = date !== prevDate;
                const isFirstInGroup = !prevMsg || prevMsg.senderId !== msg.senderId || showDateSeparator;
                return (
                  <View key={index}>
                    {showDateSeparator && (
                      <View style={styles.dateSeparator}>
                        <ParrotsStdText style={styles.dateSeparatorText}>{date}</ParrotsStdText>
                      </View>
                    )}
                    {isMe ? (
                      <View style={styles.msgRight}>
                        <ParrotsStdText style={styles.msgText}>{msg.text}</ParrotsStdText>
                        <ParrotsStdText style={styles.timeDisplay}>{time}</ParrotsStdText>
                      </View>
                    ) : (
                      <View style={styles.msgRowLeft}>
                        {isFirstInGroup ? (
                          <TouchableOpacity onPress={() => navigation.navigate("Messages", { screen: "ProfileScreenPublic", params: { publicId: msg.senderPublicId, userName: msg.senderUsername, userId: msg.senderId } })}>
                            <Image
                              source={{ uri: msg.senderProfileThumbnailUrl || msg.senderProfileImageUrl }}
                              style={styles.msgAvatar}
                            />
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.msgAvatarPlaceholder} />
                        )}
                        <View style={[styles.msgColumn, isFirstInGroup && { marginTop: vh(1) }]}>
                          {isFirstInGroup && <ParrotsStdText style={styles.msgSender}>{msg.senderUsername}</ParrotsStdText>}
                          <View style={styles.msgLeft}>
                            <ParrotsStdText selectable style={styles.msgText}>{msg.text}</ParrotsStdText>
                            <ParrotsStdText style={styles.timeDisplay}>{time}</ParrotsStdText>
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
          {/* // MESSAGES // */}

          <View style={[styles.sendRow, { paddingBottom: emojiOpen ? 0 : insets.bottom }]}>
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                setEmojiOpen((prev) => !prev);
              }}
              style={styles.emojiBtn}
            >
              <Image source={emojiOpen || inputFocused ? parrotEmojiIconBlue : parrotEmojiIcon}
                style={{
                  width: 41, height: 41, borderRadius: 30,
                  opacity: emojiOpen || inputFocused ? 1 : 0.4, borderWidth: 2,
                  borderColor: emojiOpen || inputFocused ? parrotBlueSemiTransparent2 : "rgba(128,128,128,0.2)"
                }} />
            </TouchableOpacity>
            <TextInput
              onChangeText={(text) => setMessage(text)}
              style={[styles.textinputStyle, { borderColor: emojiOpen || inputFocused ? parrotBlueSemiTransparent2 : "rgba(128,128,128,0.08)" }]}
              multiline
              placeholder={`Message ${name}...`}
              placeholderTextColor={parrotPlaceholderGrey}
              value={message}
              maxLength={500}
              onFocus={() => { setEmojiOpen(false); setInputFocused(true); }}
              onBlur={() => setInputFocused(false)}
            />
            <TouchableOpacity
              disabled={!message.trim() || isSending}
              onPress={handleSend}
              style={message.trim() && !isSending ? styles.sendBtn : styles.sendBtnDisabled}
            >
              <Feather name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {emojiOpen && (
          <View style={styles.emojiPanel}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow} keyboardShouldPersistTaps="always">
              {EMOJI_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.label}
                  onPress={() => setEmojiCategory(cat.label)}
                  style={[styles.categoryBtn, emojiCategory === cat.label && styles.categoryBtnActive]}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <FlatList
              data={EMOJIS_BY_CATEGORY[emojiCategory]}
              keyExtractor={(item) => item}
              numColumns={8}
              contentContainerStyle={{ paddingBottom: tabBarHeight }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.emojiItem}
                  onPress={() => setMessage((prev) => prev + item)}
                >
                  <Text style={styles.emojiText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="always"
            />
          </View>
        )}

        {toastVisible && (
          <View style={styles.toast}>
            <ParrotsStdText style={styles.toastText}>{toastMessage}</ParrotsStdText>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    height: vh(8),
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: vh(2),
    gap: vw(3),
    backgroundColor: "white",
  },
  profileImage: {
    width: vh(5),
    height: vh(5),
    borderRadius: vh(2.5),
  },
  mainContainer: {
    flexDirection: "column",
    backgroundColor: "white",
    // paddingHorizontal: vh(2),
  },
  messagesWrapper: {
    flex: 1,
    backgroundColor: "white",
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: vw(3),
    paddingTop: vh(1),
  },
  msgLeft: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 119, 234, 0.04)",
    borderRadius: vh(4),
    maxWidth: vw(70),
    paddingVertical: vh(0.5),
    paddingHorizontal: vw(3),
    gap: vw(2),
    marginTop: vh(0.4),
  },
  msgRight: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: vh(0.5),
    marginHorizontal: vw(2),
    backgroundColor: "rgba(0, 119, 234, 0.04)",
    borderRadius: vh(4),
    maxWidth: vw(80),
    alignSelf: "flex-end",
    paddingVertical: vh(0.5),
    paddingHorizontal: vw(3),
    gap: vw(2),
  },
  msgRowLeft: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginTop: vh(0.5),
    marginHorizontal: vw(2),
    gap: vw(2),
    maxWidth: vw(85),
  },
  msgAvatar: {
    width: vw(8),
    height: vw(8),
    borderRadius: vw(4),
    marginTop: vh(2),
    flexShrink: 0,
  },
  msgAvatarPlaceholder: {
    width: vw(8),
    flexShrink: 0,
  },
  msgColumn: {
    flexDirection: "column",
    flexShrink: 1,
  },
  msgSender: {
    fontFamily: "Nunito_700Bold",
    color: parrotLightBlue,
    fontSize: 12,
    marginBottom: -vh(0.1),
    marginLeft: vw(3),
  },
  msgText: { flexShrink: 1, fontFamily: "Nunito_700Bold", color: "#333", fontSize: 14, marginRight: vw(2) },
  timeDisplay: {
    fontFamily: "Nunito_700Bold",
    color: "rgba(0, 119, 234, 0.5)",
    fontSize: 11,
    flexShrink: 0,
  },
  dateSeparator: {
    alignSelf: "center",
    backgroundColor: "rgba(0, 119, 234, 0.04)",
    borderRadius: vh(2),
    paddingHorizontal: vw(3),
    paddingVertical: vh(0.4),
    marginVertical: vh(1),
  },
  dateSeparatorText: {
    fontFamily: "Nunito_700Bold",
    color: "rgba(0, 119, 234, 0.5)",
    fontSize: 12,
  },
  textinputStyle: {
    flex: 1,
    backgroundColor: "white",
    minHeight: vh(5),
    maxHeight: vh(14),
    paddingHorizontal: vw(4),
    paddingTop: Platform.OS === "ios" ? vh(1.5) : vh(1),
    paddingBottom: Platform.OS === "ios" ? vh(1.5) : vh(1),
    borderRadius: vh(4),
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: "black",
    textAlignVertical: "center",
    borderWidth: 2,
    borderColor: "rgba(128,128,128,0.08)",
  },
  emojiBtn: {
    paddingHorizontal: vw(1),
    justifyContent: "center",
    alignItems: "center",
  },
  emojiPanel: {
    height: vh(35),
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  categoryRow: {
    flexGrow: 0,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  categoryBtn: {
    height: vh(6),
    paddingHorizontal: vw(3),
    paddingVertical: vh(0.8),
  },
  categoryBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: parrotLightBlue,
  },
  categoryIcon: {
    fontSize: 20,
  },
  emojiItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: vh(0.8),
  },
  emojiText: {
    fontSize: 26,
  },
  sendRow: {
    zIndex: 200,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: vw(3),
    marginHorizontal: -vh(0),
    paddingVertical: vh(1),
    backgroundColor: parrotLightCream,
    gap: vw(2),
  },
  sendBtn: {
    backgroundColor: parrotLightBlue,
    width: vh(5),
    height: vh(5),
    borderRadius: vh(2.5),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  sendBtnDisabled: {
    backgroundColor: parrotBlueSemiTransparent,
    width: vh(5),
    height: vh(5),
    borderRadius: vh(2.5),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  nameStyle: {
    flex: 1,
    fontFamily: "Nunito_800ExtraBold",
    color: parrotLightBlue,
    fontSize: 18,
  },
  toast: {
    position: "absolute",
    bottom: vh(2),
    alignSelf: "center",
    backgroundColor: "rgba(30, 111, 217, 0.9)",
    paddingHorizontal: vw(4),
    paddingVertical: vh(1),
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  toastText: {
    fontFamily: "Nunito_700Bold",
    color: "white",
    fontSize: 13,
  },
});
