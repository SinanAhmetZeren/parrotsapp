import { ParrotsStdText } from "../components/ParrotsStdText";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRoute } from "@react-navigation/native";
import { useGetVoyageByPublicIdQuery } from "../slices/VoyageSlice";
import { vw, vh } from "react-native-expo-viewport-units";
import {
  Feather,
  AntDesign,
  FontAwesome5,
  FontAwesome,
  Ionicons,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  useWindowDimensions,
  Modal,
  Dimensions,
  FlatList,
} from "react-native";
import Toast from "react-native-toast-message";
import { invokeHub } from "../signalr/signalRHub.js";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import VoyageImagesWithCarousel from "../components/VoyageImagesWithCarousel";
import { RenderBidsComponent } from "../components/RenderBidsComponent";
import { WaypointListComponent } from "../components/WaypointListComponent";
import { CreateBidComponent } from "../components/CreateBidComponent";
import { RenderPolylinesComponent } from "../components/RenderPolylinesComponent";
import { useSelector, useDispatch } from "react-redux";
import { WaypointFlatListVoyageDetailsScreen } from "../components/WaypointFlatlist";
import {
  useAddVoyageToFavoritesMutation,
  useDeleteVoyageFromFavoritesMutation,
  useAddVoyageUpdateMutation,
} from "../slices/VoyageSlice";
import { useFocusEffect } from "@react-navigation/native";
import {
  addVoyageToUserFavorites,
  removeVoyageFromUserFavorites,
} from "../slices/UserSlice";
import { useReportVoyageMutation } from "../slices/UserSlice";
import * as Clipboard from "expo-clipboard";
import { API_URL } from "@env";
import { parrotBananaLeafGreen, parrotBlue, parrotBlueMediumTransparent, parrotBlueSemiTransparent, parrotBlueSemiTransparent2, parrotCream, parrotDarkBlue, parrotGreen, parrotGreenMediumTransparent, parrotGreenTransparent, parrotLightBlue, parrotPistachioGreen, parrotRed, parrotTextDarkBlue, parrotBoatPurple, parrotCarRed, parrotCaravanOrangeRed, parrotBusYellowGreen, parrotWalkTurquoise, parrotRunLightOrange, parrotMotorcycleDarkRed, parrotBicycleTealGreen, parrotTinyHouseLightYellow, parrotAirplaneLightGreen, parrotTrainPink } from "../assets/color";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RenderHtml from "react-native-render-html";
import LoadingLogo from "../components/LoadingLogo";
import parrotEmojiIcon from "../assets/emojipickerparrot.jpg";
import parrotEmojiIconBlue from "../assets/emojipickerblueparrot.jpg";

const SCREEN_W = Dimensions.get("window").width;

const VEHICLE_COLORS = {
  0: parrotBoatPurple,
  1: parrotCarRed,
  2: parrotCaravanOrangeRed,
  3: parrotBusYellowGreen,
  4: parrotWalkTurquoise,
  5: parrotRunLightOrange,
  6: parrotMotorcycleDarkRed,
  7: parrotBicycleTealGreen,
  8: parrotTinyHouseLightYellow,
  9: parrotAirplaneLightGreen,
  10: parrotTrainPink,
};

const VehicleIcon = ({ type, color, size = 12 }) => {
  switch (type) {
    case 0: return <FontAwesome5 name="ship" size={size} color={color} />;
    case 1: return <AntDesign name="car" size={size} color={color} />;
    case 2: return <FontAwesome5 name="caravan" size={size} color={color} />;
    case 3: return <Ionicons name="bus-outline" size={size} color={color} />;
    case 4: return <FontAwesome5 name="walking" size={size} color={color} />;
    case 5: return <FontAwesome5 name="running" size={size} color={color} />;
    case 6: return <FontAwesome name="motorcycle" size={size} color={color} />;
    case 7: return <FontAwesome name="bicycle" size={size} color={color} />;
    case 8: return <Ionicons name="home-outline" size={size} color={color} />;
    case 9: return <Ionicons name="airplane-outline" size={size} color={color} />;
    case 10: return <Ionicons name="train-outline" size={size} color={color} />;
    default: return <Feather name="compass" size={size} color={color} />;
  }
};

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
  Smileys: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "🥸", "😎", "🤓", "🧐", "😕", "😟", "🙁", "☹️", "😮", "😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "🥱", "😤", "😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻", "👽", "👾", "🤖", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"],
  People: ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🫀", "🫁", "🧠", "🦷", "🦴", "👀", "👁️", "👅", "👄", "💋", "👶", "🧒", "👦", "👧", "🧑", "👱", "👨", "🧔", "👩", "🧓", "👴", "👵", "🙍", "🙎", "🙅", "🙆", "💁", "🙋", "🧏", "🙇", "🤦", "🤷", "💆", "💇", "🚶", "🧍", "🧎", "🏃", "💃", "🕺", "🧖", "🧗", "🏇", "🏂", "🏋️", "🤼", "🤸", "⛹️", "🤺", "🏊", "🚴", "🧘", "👫", "👬"],
  Animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🦟", "🦗", "🕷️", "🦂", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡", "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍", "🦧", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🦘", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🦙", "🐐", "🦌", "🐕", "🐩", "🦮", "🐈", "🐓", "🦃", "🦚", "🦜", "🦢", "🦩", "🕊️", "🐇", "🦝", "🦨"],
  Food: ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️", "🫑", "🌽", "🥕", "🧄", "🧅", "🥔", "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🦴", "🌭", "🍔", "🍟", "🍕", "🫓", "🥪", "🥙", "🧆", "🌮", "🌯", "🫔", "🥗", "🥘", "🫕", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚", "🍘", "🍥", "🥮", "🍢", "🧁", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🥜", "🍯", "🧃", "🥤", "🧋", "☕", "🍵", "🍶", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸", "🍹", "🧉", "🍾", "🧊", "🥄", "🍴", "🍽️", "🥢", "🧂"],
  Travel: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🛵", "🏍️", "🚲", "🛴", "🛺", "🚁", "🛸", "✈️", "🛩️", "🛫", "🛬", "🪂", "💺", "🚀", "🛶", "⛵", "🚤", "🛥️", "🚢", "⚓", "🗺️", "🗼", "🗽", "🗿", "🏔️", "⛰️", "🌋", "🏕️", "🏖️", "🏜️", "🏝️", "🏞️", "🏟️", "🏛️", "🏗️", "🧱", "🏘️", "🏚️", "🏠", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", "🏪", "🏫", "🏬", "🏭", "🏯", "🏰", "💒", "⛪", "🌁", "🌃", "🌄", "🌅", "🌆", "🌇", "🌉", "🌌", "🌠", "🎇"],
  Activity: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🏓", "🏸", "🥊", "🥋", "🎯", "🪃", "🏹", "🎣", "🤿", "🎽", "🎿", "🛷", "🥌", "🎮", "🕹️", "🎲", "🎭", "🎨", "🎬", "🎤", "🎧", "🎼", "🎵", "🎶", "🎸", "🎹", "🥁", "🪘", "🎷", "🎺", "🪗", "🎻", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️"],
  Objects: ["💡", "🔦", "🕯️", "💰", "💵", "💴", "💶", "💷", "💸", "💳", "🪙", "💎", "🔑", "🗝️", "🔒", "🔓", "🔨", "🪓", "⛏️", "🔧", "🪛", "🔩", "⚙️", "🧲", "🔫", "💣", "🔪", "⚔️", "🛡️", "📱", "💻", "🖥️", "📷", "📸", "📹", "🎥", "📡", "📺", "📻", "🎙️", "📞", "☎️", "🔋", "🔌", "📦", "📫", "📬", "📭", "📰", "📃", "📜", "📄", "📊", "📈", "📉", "📋", "📅", "📆", "📌", "📍", "✂️", "📎", "🖊️", "✏️", "🔍", "🔎", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝"],
  Symbols: ["🔥", "💥", "✨", "🎉", "🎊", "🎈", "🎁", "🎀", "🏮", "🧧", "✉️", "📩", "📨", "🚩", "🏁", "🏳️", "🚫", "⛔", "🚷", "📵", "🔞", "💯", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚫", "⚪", "🟤", "🔶", "🔷", "🔸", "🔹", "🔺", "🔻", "💠", "🔘", "🔲", "🔳", "▪️", "▫️", "◾", "☮️", "✝️", "☪️", "🕉️", "✡️", "🔯", "🪯", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "⛎"],
};

const VoyageDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { voyagePublicId } = route.params;
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [addVoyageToFavorites] = useAddVoyageToFavoritesMutation();
  const [deleteVoyageFromFavorites] = useDeleteVoyageFromFavoritesMutation();
  const userId = useSelector((state) => state.users.userId);
  const userProfileImage = useSelector((state) => state.users.userProfileImage);
  const userName = useSelector((state) => state.users.userName);
  const userFavoriteVoyages = useSelector((state) => state.users.userFavoriteVoyages);
  const [bids, setBids] = useState([]);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState("Smileys");
  const [inputFocused, setInputFocused] = useState(false);

  const handleBroadcast = async () => {
    const acceptedUserIds = bids?.filter((b) => b.accepted).map((b) => b.userId);
    console.log("[Broadcast] acceptedUserIds:", acceptedUserIds);
    console.log("[Broadcast] message:", broadcastMessage.trim());
    console.log("[Broadcast] senderId (userId):", userId);
    if (!broadcastMessage.trim() || acceptedUserIds.length === 0) {
      console.log("[Broadcast] Guard hit - empty message or no accepted users");
      return;
    }
    setIsBroadcasting(true);
    try {
      console.log("[Broadcast] Invoking hub BroadcastMessage...");
      await invokeHub("BroadcastMessage", userId, acceptedUserIds, broadcastMessage.trim());
      console.log("[Broadcast] Success");
      setBroadcastMessage("");
      Toast.show({ type: "success", text1: "Message sent", text2: `Sent to ${acceptedUserIds.length} accepted user(s).`, visibilityTime: 2000, topOffset: 100 });
    } catch (error) {
      console.error("[Broadcast] Error:", error);
      Toast.show({ type: "error", text1: "Failed to send", text2: "Please try again.", visibilityTime: 1500, topOffset: 100 });
    } finally {
      setIsBroadcasting(false);
    }
  };

  const [overflowMenuVisible, setOverflowMenuVisible] = useState(false);
  const [voyageReportModalVisible, setVoyageReportModalVisible] = useState(false);
  const [voyageSelectedReason, setVoyageSelectedReason] = useState(null);
  const [reportVoyage] = useReportVoyageMutation();

  const REPORT_REASONS = [
    { label: "Inappropriate Content", subtitle: "Offensive language, descriptions, or stolen/inappropriate imagery" },
    { label: "Safety / Navigation Hazard", subtitle: "Reckless route details, dangerous passage plans, or safety violations" },
    { label: "False or Misleading Information", subtitle: "Inaccurate coordinates, fake schedules, or deceptive trip details" },
    { label: "Spam, Scam, or Commercial Activity", subtitle: "Unsolicited advertising, fraudulent voyages, or unauthorized charters" },
  ];

  const handleCopyVoyageLink = async () => {
    try {
      await Clipboard.setStringAsync(`https://parrotsvoyages.com/voyage-details/${voyagePublicId}`);
      showToast("Voyage link copied");
    } catch {
      showToast("Failed to copy link");
    }
  };

  const handleReportVoyage = async () => {
    if (!voyageSelectedReason) return;
    try {
      await reportVoyage({ voyageId: VoyageData.id, reason: voyageSelectedReason }).unwrap();
      setVoyageReportModalVisible(false);
      setVoyageSelectedReason(null);
      Toast.show({ type: "success", text1: "Report submitted", text2: "Thank you for helping keep Parrots safe.", visibilityTime: 3000, topOffset: 100 });
    } catch {
      Toast.show({ type: "error", text1: "Action failed", text2: "Please try again.", visibilityTime: 2000, topOffset: 100 });
    }
  };

  const [hasBidWithUserId, setHasBidWithUserId] = useState(false);
  const [userBid, setUserBid] = useState("");
  const [userBidId, setUserBidId] = useState("");
  const [userBidPrice, setUserBidPrice] = useState("");
  const [userBidPersons, setUserBidPersons] = useState("");
  const [userBidMessage, setUserBidMessage] = useState("");
  const {
    data: VoyageData,
    isSuccess: isSuccessVoyages,
    isLoading: isLoadingVoyages,
    isError: isErrorVoyage,
    refetch: refetchVoyage,
  } = useGetVoyageByPublicIdQuery(voyagePublicId);

  const [showFullText, setShowFullText] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [pillTooltip, setPillTooltip] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);

  const showPillTooltip = (text, color) => {
    setPillTooltip({ text, color });
    setTimeout(() => setPillTooltip(null), 2000);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await refetchVoyage();
        } catch (error) {
          console.error("Error refetching messages data:", error);
        }
      };
      fetchData();
    }, [refetchVoyage])
  );

  const handleSeeAll = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    if (isSuccessVoyages && userFavoriteVoyages) {
      if (userFavoriteVoyages.includes(VoyageData.id)) {
        setIsFavorited(true);
      }
      if (VoyageData.bids) {
        setBids(VoyageData.bids);
        let bids = VoyageData.bids;
        setHasBidWithUserId(bids.some((bid) => bid.userId === userId));
        setUserBid(bids.find((bid) => bid.userId === userId));
        if (bids.some((bid) => bid.userId === userId)) {
          let userBid = bids.find((bid) => bid.userId === userId);
          setUserBidPrice(userBid.offerPrice);
          setUserBidPersons(userBid.personCount);
          setUserBidMessage(userBid.message);
          setUserBidId(userBid.id);
        }
      }
    }
  }, [isSuccessVoyages, VoyageData, isFavorited]);

  const getInitialRegion = (waypoints) => {
    const maxLatitude = Math.max(...waypoints.map((w) => w.latitude));
    const minLatitude = Math.min(...waypoints.map((w) => w.latitude));
    const maxLongitude = Math.max(...waypoints.map((w) => w.longitude));
    const minLongitude = Math.min(...waypoints.map((w) => w.longitude));
    const centerLatitude = (maxLatitude + minLatitude) / 2;
    const centerLongitude = (maxLongitude + minLongitude) / 2;
    const latitudeDelta = (maxLatitude - minLatitude) * 1.4;
    const longitudeDelta = (maxLongitude - minLongitude) * 1.3;
    return {
      latitude: centerLatitude + (maxLatitude - minLatitude) * 0.1,
      longitude: centerLongitude,
      latitudeDelta: latitudeDelta == 0 ? 0.15 : latitudeDelta,
      longitudeDelta: longitudeDelta == 0 ? 0.15 : longitudeDelta,
    };
  };

  const handleShareVoyage = async () => {
    try {
      await Share.share({
        message: `Check out this link:\nhttps://parrotsvoyages.com/voyage-details/${voyagePublicId}`,
        title: "Share Link",
      });
    } catch (error) {
      console.error("Error sharing:", error.message);
    }
  };

  const goToProfilePage = (userId) => {
    const parentScreen = navigation.getState().routes[0].name;
    let targetScreen;
    switch (parentScreen) {
      case "HomeScreen": targetScreen = "Home"; break;
      case "ProfileScreen": targetScreen = "ProfileStack"; break;
      case "FavoritesScreen": targetScreen = "Favorites"; break;
      default: targetScreen = "Home";
    }
    navigation.navigate(targetScreen, {
      screen: "ProfileScreenPublic",
      params: { publicId: VoyageData?.user.publicId, username: VoyageData?.user.userName, userId: VoyageData?.user.id },
    });
  };

  const goToVehiclePage = (vehicleId) => {
    const parentScreen = navigation.getState().routes[0].name;
    let targetScreen;
    switch (parentScreen) {
      case "HomeScreen": targetScreen = "Home"; break;
      case "ProfileScreen": targetScreen = "ProfileStack"; break;
      case "FavoritesScreen": targetScreen = "Favorites"; break;
      default: targetScreen = "Home";
    }
    navigation.navigate(targetScreen, {
      screen: "VehicleDetail",
      params: { vehicleId: vehicleId },
    });
  };

  const mapRef = useRef(null);
  const scrollRef = useRef(null);

  const focusMap = (latitude, longitude) => {
    if (mapRef.current) {
      mapRef.current.animateCamera({ center: { latitude, longitude }, heading: 0, pitch: 10 }, { duration: 1000 });
    }
  };

  const handleAddVoyageToFavorites = () => {
    addVoyageToFavorites({ userId, voyageId: VoyageData.id });
    setIsFavorited(true);
    dispatch(addVoyageToUserFavorites({ favoriteVoyage: VoyageData.id }));
    showToast("Voyage added to favorites");
  };

  const handleDeleteVoyageFromFavorites = () => {
    deleteVoyageFromFavorites({ userId, voyageId: VoyageData.id });
    setIsFavorited(false);
    dispatch(removeVoyageFromUserFavorites({ favoriteVoyage: VoyageData.id }));
    showToast("Voyage removed from favorites");
  };

  const onRefresh = () => {
    setRefreshing(true);
    setHasError(false);
    try {
      const refreshData = async () => {
        await refetchVoyage();
      };
      refreshData();
    } catch (error) {
      console.log(error);
      setHasError(true);
    }
    setRefreshing(false);
  };

  if (isErrorVoyage) {
    return (
      <ScrollView
        style={{ backgroundColor: parrotCream }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[parrotPistachioGreen, parrotBananaLeafGreen]} tintColor={parrotBananaLeafGreen} />}
      >
        <View style={{ alignItems: "center", paddingTop: vh(15) }}>
          <Image source={require("../assets/parrotslogo.png")} style={{ height: vh(13), width: vh(13), borderRadius: vh(10) }} />
          <ParrotsStdText style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 16, color: parrotBlue, marginTop: 12 }}>Something went wrong</ParrotsStdText>
          <ParrotsStdText style={{ fontFamily: "Nunito_700Bold", fontSize: 13, color: "#5A6874", marginTop: 4 }}>Swipe down to retry</ParrotsStdText>
        </View>
      </ScrollView>
    );
  }

  if (isLoadingVoyages) {
    return <LoadingLogo size={200} style={{ position: "absolute", top: vh(30), left: vw(50) - 100 }} />;
  }

  if (isSuccessVoyages) {
    const ownVoyage = userId == VoyageData?.user?.id;
    const waypoints = [...(VoyageData.waypoints || [])].sort((a, b) => a.order - b.order);
    const descriptionShortenedChars = 300;
    const plainDescription = VoyageData?.description?.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
    const displayText = showFullText || plainDescription.length < descriptionShortenedChars
      ? plainDescription
      : plainDescription.slice(0, descriptionShortenedChars) + "...";

    let allVoyageImages = [
      { id: "0", voyageId: VoyageData.id, voyageImagePath: VoyageData.profileImage },
    ].concat(VoyageData.voyageImages);

    const initialRegion = getInitialRegion(waypoints);
    const formattedStartDate = require("date-fns").format(VoyageData.startDate, "d MMM yy");
    const formattedEndDate = require("date-fns").format(VoyageData.endDate, "d MMM yy");
    const formattedLastBidDate = require("date-fns").format(VoyageData.lastBidDate, "d MMM yy");
    const imageUrl = VoyageData.profileImage;
    const acceptedBids = bids.filter((b) => b.accepted);
    const acceptedCount = acceptedBids.length;

    // Vehicle type label
    const vehicleTypeLabel = {
      4: "Walk", 5: "Run", 10: "Train",
    }[VoyageData.vehicleType] || VoyageData.vehicle?.name || "Vehicle";

    return (
      <>
        <TokenExpiryGuard />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, backgroundColor: parrotCream }}>
          <ScrollView
            style={{ flex: 1, backgroundColor: parrotCream }}
            ref={scrollRef}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={parrotBlue} />}
          >
            {/* Hero carousel */}
            <View style={{ position: "relative", height: SCREEN_W }}>
              <FlatList
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={allVoyageImages}
                keyExtractor={(_, i) => String(i)}
                onScroll={(e) => setHeroIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_W))}
                scrollEventThrottle={16}
                renderItem={({ item }) => (
                  <Image source={{ uri: item.voyageImagePath }} style={{ width: SCREEN_W, height: SCREEN_W }} resizeMode="cover" />
                )}
              />

              {VoyageData.isOwnerDeleted && (
                <View style={ds.ownerDeletedNotice}>
                  <ParrotsStdText style={ds.ownerDeletedNoticeText}>
                    Notice: This host has deleted their account and is no longer active on Parrots. The voyage remains visible for viewing purposes only.
                  </ParrotsStdText>
                </View>
              )}

              {/* Image strip */}
              {allVoyageImages.length > 1 && (
                <View style={{ position: "absolute", left: 0, right: 0, bottom: 24, flexDirection: "row", justifyContent: "center", gap: 2 }}>
                  {allVoyageImages.map((img, i) => (
                    <Image key={i} source={{ uri: img.voyageImagePath }} style={[ds.stripThumb, i !== heroIndex && { opacity: 0.6 }]} />
                  ))}
                </View>
              )}

              {/* Overlay buttons */}
              <View style={{ position: "absolute", top: 12, right: 12, flexDirection: "row", gap: 8 }}>
                <TouchableOpacity style={ds.heroBtn} onPress={isFavorited ? handleDeleteVoyageFromFavorites : handleAddVoyageToFavorites}>
                  <Ionicons name={isFavorited ? "heart" : "heart-outline"} size={17} color="#E8620E" />
                </TouchableOpacity>
                <TouchableOpacity style={ds.heroBtn} onPress={() => setOverflowMenuVisible(true)}>
                  <Feather name="more-vertical" size={17} color="#1F2933" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Cards */}
            <View style={{ paddingHorizontal: 12, paddingBottom: vh(12), gap: 11, marginTop: -20 }}>

              {/* Title card — overlaps hero */}
              <View style={ds.card}>
                {/* Title */}
                <ParrotsStdText style={ds.voyageName}>{VoyageData.name}</ParrotsStdText>

                {/* Host row */}
                <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                  <TouchableOpacity style={[ds.pill, { backgroundColor: "#EEF3F9" }]} onPress={() => goToProfilePage(VoyageData?.user?.id)}>
                    <Image source={{ uri: VoyageData?.user?.profileImageThumbnailUrl || VoyageData.user.profileImageUrl }} style={ds.pillImg} />
                    <ParrotsStdText style={ds.hostName}>{VoyageData?.user?.userName}</ParrotsStdText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[ds.pill, { backgroundColor: (VEHICLE_COLORS[VoyageData.vehicleType] ?? parrotBlue) + "18" }]}
                    onPress={() => { if (VoyageData.vehicleType !== 4 && VoyageData.vehicleType !== 5 && VoyageData.vehicleType !== 10) goToVehiclePage(VoyageData.vehicle?.id); }}
                  >
                    {VoyageData.vehicleType === 4 || VoyageData.vehicleType === 5 || VoyageData.vehicleType === 10
                      ? <VehicleIcon type={VoyageData.vehicleType} color={VEHICLE_COLORS[VoyageData.vehicleType] ?? parrotBlue} size={12} />
                      : <Image source={{ uri: VoyageData.vehicle?.profileImageUrl }} style={ds.pillImg} />
                    }
                    <ParrotsStdText style={[ds.pillText, { color: VEHICLE_COLORS[VoyageData.vehicleType] ?? parrotBlue }]}>{vehicleTypeLabel}</ParrotsStdText>
                  </TouchableOpacity>
                </View>

                {/* Row 1: spots, dates, price */}
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
                  <View style={ds.pill}>
                    <Feather name="users" size={11} color="#5A6874" />
                    <ParrotsStdText style={ds.pillText}>{VoyageData.vacancy} spots</ParrotsStdText>
                  </View>
                  <View style={ds.pill}>
                    <Feather name="calendar" size={11} color="#5A6874" />
                    <ParrotsStdText style={ds.pillText}>{formattedStartDate} – {formattedEndDate}</ParrotsStdText>
                  </View>
                  <View style={ds.pill}>
                    <ParrotsStdText style={ds.pillText}>
                      {`${VoyageData.currency}${VoyageData.minPrice} – ${VoyageData.currency}${VoyageData.maxPrice}`}
                    </ParrotsStdText>
                  </View>
                </View>

                {/* Row 2: auction, fixed price, globe */}
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5, alignItems: "center" }}>
                  {pillTooltip && (
                    <View pointerEvents="none" style={{ position: "absolute", bottom: "100%", left: 0, right: 0, alignItems: "center", marginBottom: 6 }}>
                      <View style={{ backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#E8E3DC", borderRadius: 11, paddingHorizontal: 14, paddingVertical: 8, maxWidth: SCREEN_W * 0.75, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 4 }}>
                        <ParrotsStdText style={{ fontFamily: "Nunito_700Bold", fontSize: 13, color: pillTooltip.color, textAlign: "center" }}>
                          {pillTooltip.text}
                        </ParrotsStdText>
                      </View>
                    </View>
                  )}
                  <TouchableOpacity
                    style={[ds.pill, VoyageData.auction ? { backgroundColor: "#FDF0D5" } : { backgroundColor: "#F0F2F5" }]}
                    onPress={() => showPillTooltip(
                      VoyageData.auction ? "Auction, host selects the most suitable bids." : "Not an auction, host does not select most suitable bids.",
                      VoyageData.auction ? "#C2740A" : "#5A6874"
                    )}
                  >
                    <Feather name="trending-up" size={11} color={VoyageData.auction ? "#C2740A" : "#9AA7B3"} />
                    <ParrotsStdText style={[ds.pillText, { color: VoyageData.auction ? "#C2740A" : "#9AA7B3" }]}>
                      {VoyageData.auction ? "Auction" : "No Auction"}
                    </ParrotsStdText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[ds.pill, VoyageData.fixedPrice ? { backgroundColor: "#E4F0FE" } : { backgroundColor: "#F0F2F5" }]}
                    onPress={() => showPillTooltip(
                      VoyageData.fixedPrice ? "Fixed price, set by the host." : "Prices not fixed, bidders propose their own price.",
                      VoyageData.fixedPrice ? "#0A5FBF" : "#5A6874"
                    )}
                  >
                    <Feather name="tag" size={11} color={VoyageData.fixedPrice ? "#0A5FBF" : "#9AA7B3"} />
                    <ParrotsStdText style={[ds.pillText, { color: VoyageData.fixedPrice ? "#0A5FBF" : "#9AA7B3" }]}>
                      {VoyageData.fixedPrice ? "Fixed Price" : "Not Fixed Price"}
                    </ParrotsStdText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[ds.livePill, !VoyageData.publicOnMap && { backgroundColor: "#F0F2F5" }]}
                    onPress={() => showPillTooltip(
                      VoyageData.publicOnMap ? "Voyage is displayed on the main map." : "Voyage is not displayed on the main map.",
                      VoyageData.publicOnMap ? "#0B6B4E" : "#5A6874"
                    )}
                  >
                    <Ionicons name="earth" size={14} color={VoyageData.publicOnMap ? "#0B6B4E" : "#9AA7B3"} />
                    <ParrotsStdText style={[ds.pillText, { color: VoyageData.publicOnMap ? "#0B6B4E" : "#9AA7B3" }]}>
                      {VoyageData.publicOnMap ? "Visible on map" : "Not on Map"}
                    </ParrotsStdText>
                  </TouchableOpacity>
                </View>
              </View>

              {/* About card */}
              <View style={ds.card}>
                <ParrotsStdText style={ds.cap}>ABOUT</ParrotsStdText>
                <ParrotsStdText selectable style={ds.bodyText}>{displayText}</ParrotsStdText>
                {plainDescription.length > descriptionShortenedChars && !showFullText && (
                  <TouchableOpacity onPress={() => setShowFullText(true)} style={{ flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start" }}>
                    <ParrotsStdText style={ds.linkText}>Read more</ParrotsStdText>
                    <Feather name="chevron-down" size={12} color="#0A5FBF" />
                  </TouchableOpacity>
                )}
                {showFullText && (
                  <TouchableOpacity onPress={() => setShowFullText(false)} style={{ flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start" }}>
                    <ParrotsStdText style={ds.linkText}>Read less</ParrotsStdText>
                    <Feather name="chevron-up" size={12} color="#0A5FBF" />
                  </TouchableOpacity>
                )}

                {/* Updates inside About */}
                <VoyageUpdatesSection updates={VoyageData.updates || []} voyageId={VoyageData.id} isOwner={ownVoyage} />
              </View>

              {/* Route card */}
              <View style={ds.card}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ParrotsStdText style={[ds.cap, { flex: 1 }]}>ROUTE</ParrotsStdText>
                  <ParrotsStdText style={ds.subCount}>{waypoints.length} waypoints</ParrotsStdText>
                </View>

                {/* Map */}
                <View
                  style={{ borderRadius: 11, overflow: "hidden", aspectRatio: 1, borderWidth: 1.5, borderColor: "#E8E3DC" }}
                  onStartShouldSetResponder={() => true}
                  onTouchStart={() => scrollRef.current?.setNativeProps({ scrollEnabled: false })}
                  onTouchEnd={() => scrollRef.current?.setNativeProps({ scrollEnabled: true })}
                  onTouchCancel={() => scrollRef.current?.setNativeProps({ scrollEnabled: true })}
                >
                  <MapView provider={PROVIDER_GOOGLE} ref={mapRef} style={{ width: "100%", height: "100%" }} region={initialRegion} userInterfaceStyle="light" scrollEnabled={true} zoomEnabled={true}>
                    <WaypointListComponent waypoints={waypoints} />
                    <RenderPolylinesComponent waypoints={waypoints} />
                  </MapView>
                </View>

                {/* Waypoint horizontal rail */}
                <View style={{ marginRight: -11 }}>
                  <WaypointFlatListVoyageDetailsScreen
                    focusMap={focusMap}
                    addedWayPoints={waypoints}
                    voyageProfileImage={VoyageData.profileImage}
                  />
                </View>
              </View>

              {/* Bids card */}
              {(bids.length > 0 || !ownVoyage) && (
                <View style={ds.card}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <ParrotsStdText style={[ds.cap, { flex: 1 }]}>BIDS</ParrotsStdText>
                    <ParrotsStdText style={ds.subCount}>{bids.length}{acceptedCount > 0 ? ` · ${acceptedCount} accepted` : ""}</ParrotsStdText>
                    {bids.length > 2 && (
                      <TouchableOpacity onPress={handleSeeAll} style={{ marginLeft: 10 }}>
                        <ParrotsStdText style={ds.linkText}>See all</ParrotsStdText>
                      </TouchableOpacity>
                    )}
                  </View>

                  {bids.length > 0 && (
                    <RenderBidsComponent
                      bids={bids}
                      modalVisible={modalVisible}
                      setModalVisible={setModalVisible}
                      ownVoyage={ownVoyage}
                      voyageName={VoyageData.name}
                      currentUserId={userId}
                      refetch={refetchVoyage}
                      username={userName}
                      currency={VoyageData.currency}
                    />
                  )}

                  {/* CTA */}
                  {!ownVoyage && !VoyageData.isBlockedByOrganizer && (
                    <CreateBidComponent
                      userName={userName}
                      userProfileImage={userProfileImage}
                      voyageId={VoyageData.id}
                      userId={userId}
                      userBidId={userBidId}
                      hasBidWithUserId={hasBidWithUserId}
                      userBidPrice={userBidPrice}
                      userBidPersons={userBidPersons}
                      userBidMessage={userBidMessage}
                      refetch={refetchVoyage}
                      ownVoyage={ownVoyage}
                      currency={VoyageData.currency}
                      isOwnerDeleted={VoyageData.isOwnerDeleted}
                      endDate={VoyageData.endDate}
                    />
                  )}

                  {ownVoyage && (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Feather name="lock" size={11} color="#5A6874" />
                      <ParrotsStdText style={{ fontFamily: "Nunito_700Bold", fontSize: 10, color: "#5A6874" }}>Only you can see bid messages.</ParrotsStdText>
                    </View>
                  )}
                </View>
              )}

              {/* Host: message accepted users card */}
              {ownVoyage && (
                <View style={ds.card}>
                  <ParrotsStdText style={[ds.cap, { color: acceptedCount > 0 ? "#0A5FBF" : "#9AA7B3" }]}>
                    {acceptedCount > 0 ? `MESSAGE ACCEPTED USERS · ${acceptedCount}` : "MESSAGE ACCEPTED USERS"}
                  </ParrotsStdText>

                  <Modal visible={emojiOpen} transparent animationType="fade" onRequestClose={() => setEmojiOpen(false)}>
                    <TouchableOpacity style={ds.emojiModalBackdrop} activeOpacity={1} onPress={() => setEmojiOpen(false)} />
                    <View style={[ds.emojiModalPanel, { bottom: insets.bottom + vh(13) }]}>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={ds.emojiCategoryRow} keyboardShouldPersistTaps="always">
                        {EMOJI_CATEGORIES.map((cat) => (
                          <TouchableOpacity key={cat.label} onPress={() => setEmojiCategory(cat.label)} style={[ds.emojiCategoryBtn, emojiCategory === cat.label && ds.emojiCategoryBtnActive]}>
                            <Text style={ds.emojiCategoryIcon}>{cat.icon}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                      <ScrollView keyboardShouldPersistTaps="always">
                        <View style={ds.emojiGrid}>
                          {EMOJIS_BY_CATEGORY[emojiCategory].map((item) => (
                            <TouchableOpacity key={item} style={ds.emojiItem} onPress={() => setBroadcastMessage((prev) => prev + item)}>
                              <Text style={ds.emojiText}>{item}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </ScrollView>
                    </View>
                  </Modal>

                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, opacity: acceptedCount > 0 ? 1 : 0.4 }}>
                    <TouchableOpacity disabled={acceptedCount === 0} onPress={() => { Keyboard.dismiss(); setEmojiOpen((prev) => !prev); }}>
                      <Image source={emojiOpen || inputFocused ? parrotEmojiIconBlue : parrotEmojiIcon} style={{ width: 41, height: 41, borderRadius: 30, opacity: emojiOpen || inputFocused ? 1 : 0.4, borderWidth: 2, borderColor: emojiOpen || inputFocused ? "rgba(10,95,191,0.4)" : "rgba(128,128,128,0.2)" }} />
                    </TouchableOpacity>
                    <TextInput
                      style={[ds.updateInput, { borderColor: emojiOpen || inputFocused ? "rgba(10,95,191,0.4)" : "rgba(128,128,128,0.08)" }]}
                      placeholder={acceptedCount > 0 ? `Message the ${acceptedCount} accepted…` : "No accepted users yet…"}
                      placeholderTextColor="#8B98A5"
                      editable={acceptedCount > 0}
                      onPressIn={() => acceptedCount > 0 && setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 500)}
                      value={broadcastMessage}
                      onChangeText={setBroadcastMessage}
                      onFocus={() => { setEmojiOpen(false); setInputFocused(true); setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 400); }}
                      onBlur={() => setInputFocused(false)}
                    />
                    <TouchableOpacity
                      style={broadcastMessage.trim() && !isBroadcasting && acceptedCount > 0 ? ds.updateSendBtn : ds.updateSendBtnDisabled}
                      onPress={handleBroadcast}
                      disabled={!broadcastMessage.trim() || isBroadcasting || acceptedCount === 0}
                    >
                      {isBroadcasting ? <ActivityIndicator size="small" color="#9AA7B3" /> : <Feather name="send" size={20} color={broadcastMessage.trim() && acceptedCount > 0 ? "white" : "#9AA7B3"} />}
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Feather name="lock" size={11} color="#5A6874" />
                    <ParrotsStdText style={{ fontFamily: "Nunito_700Bold", fontSize: 10, color: "#5A6874" }}>Private — only accepted users receive this</ParrotsStdText>
                  </View>
                </View>
              )}

            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {toastVisible && (
          <View style={ds.toast}>
            <ParrotsStdText style={ds.toastText}>{toastMessage}</ParrotsStdText>
          </View>
        )}


        {/* Overflow bottom sheet */}
        <Modal visible={overflowMenuVisible} transparent animationType="fade" onRequestClose={() => setOverflowMenuVisible(false)}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }} activeOpacity={1} onPress={() => setOverflowMenuVisible(false)}>
            <View style={ds.bottomSheet}>
              <View style={ds.bottomSheetHandle} />
              <TouchableOpacity style={ds.sheetItem} onPress={() => { setOverflowMenuVisible(false); handleCopyVoyageLink(); }}>
                <MaterialIcons name="link" size={24} color={parrotBlue} />
                <ParrotsStdText style={[ds.sheetItemText, { color: parrotBlue }]}>Copy voyage link</ParrotsStdText>
              </TouchableOpacity>
              {!ownVoyage && (
                <TouchableOpacity style={ds.sheetItem} onPress={() => { setOverflowMenuVisible(false); setTimeout(() => setVoyageReportModalVisible(true), 300); }}>
                  <MaterialIcons name="flag" size={24} color={parrotRed} />
                  <ParrotsStdText style={[ds.sheetItemText, { color: parrotRed }]}>Report voyage</ParrotsStdText>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Report voyage modal */}
        <Modal visible={voyageReportModalVisible} transparent animationType="fade" onRequestClose={() => setVoyageReportModalVisible(false)}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" }}>
            <View style={{ backgroundColor: "white", borderRadius: 20, padding: 20, width: vw(88) }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(200,30,30,0.1)", alignItems: "center", justifyContent: "center" }}>
                  <MaterialIcons name="flag" size={18} color={parrotRed} />
                </View>
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <ParrotsStdText style={{ fontSize: 16, fontFamily: "Nunito_800ExtraBold", color: parrotBlue }}>Report voyage</ParrotsStdText>
                  <ParrotsStdText style={{ fontSize: 12, fontFamily: "Nunito_700Bold", color: "#888", marginTop: 2 }}>Tell us what's wrong. Your report stays private.</ParrotsStdText>
                </View>
              </View>
              <View style={{ marginTop: 12 }}>
                {REPORT_REASONS.map((reason) => (
                  <TouchableOpacity
                    key={reason.label}
                    onPress={() => setVoyageSelectedReason(reason.label)}
                    style={[{ flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, backgroundColor: "#f5f5f5", marginBottom: 8, gap: 12 },
                    voyageSelectedReason === reason.label && { backgroundColor: "rgba(30,111,217,0.07)", borderWidth: 1.5, borderColor: parrotBlue }]}
                  >
                    <View style={[{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#ccc", alignItems: "center", justifyContent: "center" },
                    voyageSelectedReason === reason.label && { borderColor: parrotBlue }]}>
                      {voyageSelectedReason === reason.label && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: parrotBlue }} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <ParrotsStdText style={[{ fontSize: 15, fontFamily: "Nunito_700Bold", color: "#3D3D3D" }, voyageSelectedReason === reason.label && { color: parrotBlue, fontFamily: "Nunito_800ExtraBold" }]}>{reason.label}</ParrotsStdText>
                      <ParrotsStdText style={{ fontSize: 12, fontFamily: "Nunito_700Bold", color: "#aaa", marginTop: 2 }}>{reason.subtitle}</ParrotsStdText>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <ParrotsStdText style={{ fontSize: 12, fontFamily: "Nunito_700Bold", color: "#aaa", marginTop: 10 }}>Reports are reviewed privately. The voyage organizer will not be notified.</ParrotsStdText>
              <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
                <TouchableOpacity style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#f0f0f0", alignItems: "center" }} onPress={() => { setVoyageReportModalVisible(false); setVoyageSelectedReason(null); }}>
                  <ParrotsStdText style={{ fontSize: 15, fontFamily: "Nunito_700Bold", color: "#3D3D3D" }}>Cancel</ParrotsStdText>
                </TouchableOpacity>
                <TouchableOpacity style={[{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: parrotRed, alignItems: "center" }, !voyageSelectedReason && { opacity: 0.4 }]} onPress={handleReportVoyage} disabled={!voyageSelectedReason}>
                  <ParrotsStdText style={{ fontSize: 15, fontFamily: "Nunito_700Bold", color: "white" }}>Submit report</ParrotsStdText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }
};

const daysAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "1 day ago";
  return `${diff} days ago`;
};

const UpdateItem = ({ u }) => (
  <View style={{ paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: "#F0F4F8" }}>
    <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
      <ParrotsStdText style={{ flex: 1, fontFamily: "Nunito_600SemiBold", fontSize: 12.5, color: "#3C4A57", lineHeight: 19 }}>
        {u.text}
      </ParrotsStdText>
      <ParrotsStdText style={{ fontFamily: "Nunito_700Bold", fontSize: 11, color: "#5A6874", marginLeft: 8 }}>
        {daysAgo(u.createdAt)}
      </ParrotsStdText>
    </View>
  </View>
);

// Updates section — renders inside About card
const VoyageUpdatesSection = ({ updates, voyageId, isOwner }) => {
  const [text, setText] = useState("");
  const [localUpdates, setLocalUpdates] = useState([
    // { id: "d1", text: "We have confirmed the departure port — see you at Marina Bay at 08:00!", createdAt: "2025-06-01T08:00:00" },
    // { id: "d2", text: "Weather looks perfect for the first leg. Pack light layers for the evening.", createdAt: "2025-06-02T10:30:00" },
    // { id: "d3", text: "Provisioning is done — fresh food and drinks for all guests on board.", createdAt: "2025-06-03T14:00:00" },
    // { id: "d4", text: "We will make a short stop at Lighthouse Cove on day 2 for swimming.", createdAt: "2025-06-04T09:15:00" },
    // { id: "d5", text: "Reminder: bring your ID and any seasickness medication you may need.", createdAt: "2025-06-05T11:00:00" },
    // { id: "d6", text: "The sunset dinner on night 1 is confirmed — chef on board!", createdAt: "2025-06-06T16:45:00" },
    // { id: "d7", text: "We added an extra waypoint — passing through the Blue Lagoon on day 3.", createdAt: "2025-06-07T08:00:00" },
    // { id: "d8", text: "All safety briefings will happen at the dock before departure.", createdAt: "2025-06-08T07:30:00" },
    // { id: "d9", text: "Snorkelling gear is available on board — no need to bring your own.", createdAt: "2025-06-09T13:00:00" },
    // { id: "d10", text: "Final headcount confirmed. Looking forward to an amazing voyage!", createdAt: "2025-06-10T10:00:00" },
    ...(updates || []),
  ]);
  const [addVoyageUpdate, { isLoading }] = useAddVoyageUpdateMutation();
  const [allUpdatesVisible, setAllUpdatesVisible] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    try {
      const result = await addVoyageUpdate({ voyageId, text }).unwrap();
      setLocalUpdates([result, ...localUpdates]);
      setText("");
    } catch (e) {
      Toast.show({ type: "error", text1: "Failed to post update", visibilityTime: 2000, topOffset: 100 });
    }
  };

  if (localUpdates.length === 0 && !isOwner) return null;

  return (
    <View style={{ borderTopWidth: 1, borderTopColor: "#E6ECF2", paddingTop: 10, marginTop: 4, gap: 7 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <ParrotsStdText style={[ds.cap, { flex: 1 }]}>UPDATES FROM THE HOST</ParrotsStdText>
        {localUpdates.length > 2 ? (
          <TouchableOpacity onPress={() => setAllUpdatesVisible(true)}>
            <ParrotsStdText style={ds.linkText}>See all</ParrotsStdText>
          </TouchableOpacity>
        ) : (
          <ParrotsStdText style={ds.subCount}>{localUpdates.length}</ParrotsStdText>
        )}
      </View>

      {localUpdates.slice(0, 2).map((u) => (
        <UpdateItem key={u.id} u={u} />
      ))}

      {isOwner && (
        <>
          <View style={{ flexDirection: "row", gap: vw(2), marginTop: 2, alignItems: "center" }}>
            <TextInput
              style={ds.updateInput}
              placeholder="Post an update…"
              placeholderTextColor="#8B98A5"
              value={text}
              onChangeText={setText}
              maxLength={500}
            />
            <TouchableOpacity
              style={text.trim() && !isLoading ? ds.updateSendBtn : ds.updateSendBtnDisabled}
              onPress={handleSubmit}
              disabled={!text.trim() || isLoading}
            >
              {isLoading ? <ActivityIndicator size="small" color="#9AA7B3" /> : <Feather name="send" size={18} color={text.trim() ? "white" : "#9AA7B3"} />}
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Feather name="eye" size={11} color="#5A6874" />
            <ParrotsStdText style={{ fontFamily: "Nunito_700Bold", fontSize: 10, color: "#5A6874" }}>Visible to everyone viewing this voyage</ParrotsStdText>
          </View>
        </>
      )}

      <Modal animationType="fade" transparent visible={allUpdatesVisible} onRequestClose={() => setAllUpdatesVisible(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "#fff", borderRadius: 18, borderWidth: 1.5, borderColor: "#E8E3DC", paddingHorizontal: 16, paddingTop: 18, paddingBottom: 20, width: vw(88), maxHeight: vh(70) }}>
            <ParrotsStdText style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 15, color: "#1F2933", marginBottom: 12 }}>All Updates</ParrotsStdText>
            <ScrollView contentContainerStyle={{ gap: 10, paddingBottom: 4 }}>
              {localUpdates.map((item) => (
                <UpdateItem key={item.id} u={item} />
              ))}
            </ScrollView>
            <TouchableOpacity
              style={{ marginTop: 16, alignSelf: "center", backgroundColor: "#0A5FBF", borderRadius: 999, paddingVertical: 10, paddingHorizontal: 32 }}
              onPress={() => setAllUpdatesVisible(false)}
            >
              <ParrotsStdText style={{ fontFamily: "Nunito_700Bold", fontSize: 14, color: "#fff" }}>Close</ParrotsStdText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VoyageDetailScreen;

const ds = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderColor: "#E8E3DC",
    borderRadius: 14,
    backgroundColor: "#fff",
    padding: 11,
    gap: 9,
  },
  voyageName: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 22,
    color: "#0A5FBF",
    letterSpacing: -0.44,
    lineHeight: 26,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#D8E0E8",
  },
  hostName: {
    fontFamily: "Nunito_800ExtraBold",
    fontWeight: "800",
    fontSize: 11,
    color: "#0A5FBF",
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#E4F5E9",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F4F7FB",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  pillText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 11,
    color: "#3C4A57",
  },
  pillImg: {
    width: vh(3),
    height: vh(3),
    borderRadius: vh(2.5),
    backgroundColor: "#D8E0E8",
  },
  cap: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 9,
    letterSpacing: 1.4,
    color: "#5A6874",
  },
  subCount: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 10.5,
    color: "#5A6874",
  },
  bodyText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12.5,
    color: "#3C4A57",
    lineHeight: 19,
  },
  linkText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    color: "#0A5FBF",
  },
  heroBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.94)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  stripThumb: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.85)",
  },
  updateInput: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: "white",
    borderRadius: vh(4),
    paddingHorizontal: vw(4),
    paddingVertical: vh(1),
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: "black",
    borderWidth: 2,
    borderColor: "rgba(128,128,128,0.08)",
    minHeight: vh(5),
    maxHeight: vh(14),
    textAlignVertical: "center",
  },
  updateSendBtn: {
    backgroundColor: parrotLightBlue,
    width: vh(5),
    height: vh(5),
    borderRadius: vh(2.5),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  updateSendBtnDisabled: {
    backgroundColor: "white",
    width: vh(5),
    height: vh(5),
    borderRadius: vh(2.5),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "rgba(128,128,128,0.08)",
  },
  broadcastInput: {
    flex: 1,
    height: 32,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E8E3DC",
    paddingHorizontal: 12,
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: "#1F2933",
  },
  toast: {
    position: "absolute",
    bottom: vh(10),
    alignSelf: "center",
    backgroundColor: "rgba(30,111,217,0.9)",
    paddingHorizontal: vw(4),
    paddingVertical: vh(1),
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginHorizontal: vw(8),
  },
  toastText: {
    color: "white",
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
  },
  bottomSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
    gap: 14,
  },
  sheetItemText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#3D3D3D",
  },
  ownerDeletedNotice: {
    position: "absolute",
    top: vh(8),
    left: vw(4),
    right: vw(4),
    backgroundColor: "rgba(203,4,4,0.55)",
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#B3261E",
    padding: 12,
    zIndex: 10,
  },
  ownerDeletedNoticeText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 13,
    color: "white",
    lineHeight: 18,
  },
  emojiModalBackdrop: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
  },
  emojiModalPanel: {
    position: "absolute",
    left: vw(2),
    right: vw(2),
    height: vh(35),
    backgroundColor: "white",
    borderRadius: vh(2),
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  emojiCategoryRow: {
    flexGrow: 0,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  emojiCategoryBtn: {
    height: vh(6),
    paddingHorizontal: vw(3),
    paddingVertical: vh(0.8),
  },
  emojiCategoryBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#0A77EA",
  },
  emojiCategoryIcon: { fontSize: 20 },
  emojiGrid: { flexDirection: "row", flexWrap: "wrap" },
  emojiItem: { width: "12.5%", alignItems: "center", justifyContent: "center", paddingVertical: vh(0.8) },
  emojiText: { fontSize: 26 },
});
