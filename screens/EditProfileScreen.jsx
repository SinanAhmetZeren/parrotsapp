import { ParrotsStdText } from "../components/ParrotsStdText";
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import {
  useGetUserByIdQuery,
  useUpdateProfileImageMutation,
  useUpdateBackgroundImageMutation,
  usePatchUserMutation,
  updateUserName,
  updateUserData,
  updateAsLoggedOut,
  useDeleteAccountMutation,
} from "../slices/UserSlice";
import { vh, vw } from "react-native-expo-viewport-units";
import * as ImagePicker from "expo-image-picker";
import {
  Feather, Fontisto, FontAwesome5, MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { TokenExpiryGuard } from "../components/TokenExpiryGuard";
import { parrotBlue, parrotCream, parrotRed, parrotTextDarkBlue } from "../assets/color";
import { htmlToText } from "html-to-text";
import LoadingLogo from "../components/LoadingLogo";

const BORDER = "#E8E3DC";
const BLUE = "#0A5FBF";
const BLUE_PILL = "#E8F1FB";

const SectionLabel = ({ children }) => (
  <ParrotsStdText style={styles.sectionLabel}>{children}</ParrotsStdText>
);

const FieldRow = ({ icon, label, children }) => (
  <View style={styles.fieldRow}>
    <View style={styles.fieldIcon}>{icon}</View>
    <ParrotsStdText style={styles.fieldLabel}>{label}</ParrotsStdText>
    <View style={styles.fieldInput}>{children}</View>
  </View>
);

const EditProfileScreen = ({ navigation }) => {
  const userId = useSelector((state) => state.users.userId);
  const dispatch = useDispatch();

  const { data: userData, isLoading, isSuccess, refetch } = useGetUserByIdQuery(userId);

  const [updateProfileImage] = useUpdateProfileImageMutation();
  const [updateBackgroundImage] = useUpdateBackgroundImageMutation();
  const [patchUser] = usePatchUserMutation();
  const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteAccountMutation();
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);

  const [profileImageUri, setProfileImageUri] = useState(null);
  const [backgroundImageUri, setBackgroundImageUri] = useState(null);
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [displayEmail, setDisplayEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [instagramProfile, setInstagramProfile] = useState("");
  const [twitterProfile, setTwitterProfile] = useState("");
  const [tiktokProfile, setTiktokProfile] = useState("");
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [youtubeProfile, setYoutubeProfile] = useState("");
  const [facebookProfile, setFacebookProfile] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const toPlainText = (html) => htmlToText(html ?? "", { wordwrap: false });

  useFocusEffect(useCallback(() => {
    const fetch = async () => { try { await refetch(); } catch { } };
    fetch();
  }, [refetch]));

  useEffect(() => {
    if (isSuccess && userData) {
      setUsername(userData.userName);
      setTitle(toPlainText(userData.title));
      setBio(toPlainText(userData.bio));
      setDisplayEmail(userData.displayEmail);
      setPhoneNumber(userData.phoneNumber);
      setInstagramProfile(userData.instagram);
      setTwitterProfile(userData.twitter);
      setTiktokProfile(userData.tiktok);
      setLinkedinProfile(userData.linkedin);
      setYoutubeProfile(userData.youtube);
      setFacebookProfile(userData.facebook);
    }
  }, [isSuccess, userData]);

  const pickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, quality: 1 });
    if (!result.canceled) setProfileImageUri(result.assets[0].uri);
  };

  const pickBackgroundImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, quality: 1 });
    if (!result.canceled) setBackgroundImageUri(result.assets[0].uri);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (profileImageUri) {
        const fd = new FormData();
        fd.append("imageFile", { uri: profileImageUri, type: "image/jpeg", name: "profileImage.jpg" });
        await updateProfileImage({ formData: fd, userId });
      }
      if (backgroundImageUri) {
        const fd = new FormData();
        fd.append("imageFile", { uri: backgroundImageUri, type: "image/jpeg", name: "backgroundImage.jpg" });
        await updateBackgroundImage({ formData: fd, userId });
      }
      const patchDoc = [
        { op: "replace", path: "/userName", value: username },
        { op: "replace", path: "/displayEmail", value: displayEmail },
        { op: "replace", path: "/phonenumber", value: phoneNumber },
        { op: "replace", path: "/facebook", value: facebookProfile },
        { op: "replace", path: "/instagram", value: instagramProfile },
        { op: "replace", path: "/twitter", value: twitterProfile },
        { op: "replace", path: "/tiktok", value: tiktokProfile },
        { op: "replace", path: "/linkedin", value: linkedinProfile },
        { op: "replace", path: "/youtube", value: youtubeProfile },
        { op: "replace", path: "/title", value: title },
        { op: "replace", path: "/bio", value: bio },
      ];
      await patchUser({ patchDoc, userId });
      dispatch(updateUserName({ username }));
      dispatch(updateUserData({ image: userData?.profileImageUrl }));
      navigation.navigate("ProfileScreen");
    } catch { } finally { setIsSaving(false); }
  };

  const handleDeleteAccount = async () => {
    try { await deleteAccount().unwrap(); } catch { }
    setDeleteAccountModalVisible(false);
    dispatch(updateAsLoggedOut());
  };

  if (isLoading) {
    return <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: parrotCream }}><LoadingLogo size={200} /></View>;
  }

  if (!isSuccess || !userData) return null;

  const profileImageUrl = userData.profileImageUrl;
  const backgroundImageUrl = userData.backgroundImageUrl;

  return (
    <>
      <TokenExpiryGuard />
      <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── BACKGROUND IMAGE ── */}
        <TouchableOpacity onPress={pickBackgroundImage} activeOpacity={0.85}>
          <View style={styles.bgWrap}>
            <Image
              source={{ uri: backgroundImageUri || backgroundImageUrl }}
              style={styles.bgImage}
              resizeMode="cover"
            />
            <View style={styles.bgCameraBtn}>
              <Feather name="camera" size={16} color={BLUE} />
            </View>
          </View>
        </TouchableOpacity>

        {/* ── PROFILE IMAGE ── */}
        <View style={styles.avatarRow}>
          <TouchableOpacity onPress={pickProfileImage} activeOpacity={0.85}>
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: profileImageUri || profileImageUrl }}
                style={styles.avatar}
                resizeMode="cover"
              />
              <View style={styles.avatarCameraBtn}>
                <Feather name="camera" size={14} color={BLUE} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── IDENTITY ── */}
        <View style={styles.section}>
          <SectionLabel>Profile</SectionLabel>

          <FieldRow icon={<Feather name="user" size={17} color={BLUE} />} label="Username">
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="rgba(92,107,122,0.5)"
              value={username}
              onChangeText={setUsername}
              maxLength={25}
            />
          </FieldRow>

          <FieldRow icon={<Feather name="pen-tool" size={17} color={BLUE} />} label="Title">
            <TextInput
              style={styles.input}
              placeholder="Your title (max 50 chars)"
              placeholderTextColor="rgba(92,107,122,0.5)"
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
          </FieldRow>

          <View style={[styles.fieldRow, { borderTopWidth: 1, borderTopColor: BORDER }]}>
            <View style={styles.fieldIcon}><Feather name="align-left" size={17} color={BLUE} /></View>
            <ParrotsStdText style={styles.fieldLabel}>Bio</ParrotsStdText>
          </View>
          <TextInput
            style={styles.bioInput}
            placeholder="Tell people about yourself (max 500 chars)"
            placeholderTextColor="rgba(92,107,122,0.5)"
            value={bio}
            onChangeText={setBio}
            multiline
            maxLength={500}
          />
        </View>

        {/* ── CONTACT ── */}
        <View style={styles.section}>
          <SectionLabel>Contact</SectionLabel>

          <FieldRow icon={<Fontisto name="email" size={16} color={BLUE} />} label="Email">
            <TextInput
              style={styles.input}
              placeholder="Display email"
              placeholderTextColor="rgba(92,107,122,0.5)"
              value={displayEmail}
              onChangeText={setDisplayEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </FieldRow>
          <View style={styles.emailNote}>
            <MaterialCommunityIcons name="information-slab-circle-outline" size={14} color={BLUE} style={{ marginTop: 1 }} />
            <ParrotsStdText style={styles.emailNoteText}>
              This email address will be publicly visible on your profile. It may differ from your login email and is optional to provide.
            </ParrotsStdText>
          </View>

          <FieldRow icon={<Feather name="phone" size={17} color={BLUE} />} label="Phone">
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              placeholderTextColor="rgba(92,107,122,0.5)"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </FieldRow>
        </View>

        {/* ── SOCIALS ── */}
        <View style={styles.section}>
          <SectionLabel>Socials</SectionLabel>

          <FieldRow icon={<Feather name="instagram" size={17} color={BLUE} />} label="Instagram">
            <TextInput style={styles.input} placeholder="Instagram handle" placeholderTextColor="rgba(92,107,122,0.5)" value={instagramProfile} onChangeText={setInstagramProfile} autoCapitalize="none" />
          </FieldRow>
          <FieldRow icon={<Feather name="twitter" size={17} color={BLUE} />} label="Twitter">
            <TextInput style={styles.input} placeholder="Twitter handle" placeholderTextColor="rgba(92,107,122,0.5)" value={twitterProfile} onChangeText={setTwitterProfile} autoCapitalize="none" />
          </FieldRow>
          <FieldRow icon={<FontAwesome5 name="tiktok" size={15} color={BLUE} />} label="TikTok">
            <TextInput style={styles.input} placeholder="TikTok handle" placeholderTextColor="rgba(92,107,122,0.5)" value={tiktokProfile} onChangeText={setTiktokProfile} autoCapitalize="none" />
          </FieldRow>
          <FieldRow icon={<Feather name="youtube" size={17} color={BLUE} />} label="YouTube">
            <TextInput style={styles.input} placeholder="YouTube channel" placeholderTextColor="rgba(92,107,122,0.5)" value={youtubeProfile} onChangeText={setYoutubeProfile} autoCapitalize="none" />
          </FieldRow>
          <FieldRow icon={<Feather name="facebook" size={17} color={BLUE} />} label="Facebook">
            <TextInput style={styles.input} placeholder="Facebook profile" placeholderTextColor="rgba(92,107,122,0.5)" value={facebookProfile} onChangeText={setFacebookProfile} autoCapitalize="none" />
          </FieldRow>
          <FieldRow icon={<Feather name="linkedin" size={17} color={BLUE} />} label="LinkedIn">
            <TextInput style={styles.input} placeholder="LinkedIn profile" placeholderTextColor="rgba(92,107,122,0.5)" value={linkedinProfile} onChangeText={setLinkedinProfile} autoCapitalize="none" />
          </FieldRow>
        </View>

        {/* ── SAVE + DELETE ── */}
        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving} activeOpacity={0.85}>
            <ParrotsStdText style={styles.saveBtnTxt}>{isSaving ? "Saving…" : "Save Changes"}</ParrotsStdText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => setDeleteAccountModalVisible(true)} activeOpacity={0.8}>
            <ParrotsStdText style={styles.deleteBtnTxt}>Delete Account</ParrotsStdText>
          </TouchableOpacity>
        </View>

        <View style={{ height: vh(6) }} />
      </ScrollView>

      {/* ── DELETE MODAL ── */}
      <Modal animationType="fade" transparent visible={deleteAccountModalVisible} onRequestClose={() => setDeleteAccountModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ParrotsStdText style={styles.modalTitle}>Delete Account</ParrotsStdText>
            <ParrotsStdText style={styles.modalBody}>
              Your account will be deactivated. If you are a host with active voyages, your trip details will remain visible to your counterparties. As mentioned in the Terms of Use, Parrots may contact you via your registered email in the event of urgent coordination, and prompt responsiveness to guests is required for active trips and ongoing commitments.
            </ParrotsStdText>
            <TouchableOpacity
              onPress={handleDeleteAccount}
              disabled={isDeletingAccount}
              style={[styles.modalDeleteBtn, { opacity: isDeletingAccount ? 0.6 : 1 }]}
              activeOpacity={0.8}
            >
              <ParrotsStdText style={styles.modalDeleteBtnTxt}>
                {isDeletingAccount ? "Deleting…" : "Yes, Delete My Account"}
              </ParrotsStdText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDeleteAccountModalVisible(false)} activeOpacity={0.8}>
              <ParrotsStdText style={styles.modalCancel}>Cancel</ParrotsStdText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: parrotCream },
  content: { paddingBottom: vh(4) },

  // background image
  bgWrap: { height: vh(32.5), position: "relative", backgroundColor: "#D0D8E4" },
  bgImage: { width: "100%", height: "100%" },
  bgCameraBtn: {
    position: "absolute", bottom: 10, right: 12,
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#0C1E30", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3,
  },

  // avatar
  avatarRow: { paddingHorizontal: 16, marginTop: -55 },
  avatarWrap: { position: "relative", width: 110, height: 110 },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: "#fff" },
  avatarCameraBtn: {
    position: "absolute", bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#0C1E30", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 2,
  },

  // sections
  section: {
    marginHorizontal: 16, marginTop: 16,
    backgroundColor: "#fff",
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 16,
    overflow: "hidden",
  },
  sectionLabel: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 11.5,
    color: "#7A8896",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    paddingHorizontal: 14,
    paddingTop: 11,
    paddingBottom: 4,
  },

  // field rows
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 4,
    minHeight: 44,
  },
  fieldIcon: { width: 24, alignItems: "center", marginRight: 8 },
  fieldLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: BLUE,
    width: vw(18),
    marginRight: 8,
  },
  fieldInput: { flex: 1 },
  input: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 13.5,
    color: "#0A2540",
    paddingVertical: 6,
  },
  inputMulti: { minHeight: 72, textAlignVertical: "top" },
  bioInput: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 13.5,
    color: "#0A2540",
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 4,
    minHeight: 90,
    textAlignVertical: "top",
  },

  // email note
  emailNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    paddingHorizontal: 14,
    paddingBottom: 10,
    paddingTop: 2,
  },
  emailNoteText: {
    flex: 1,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 11.5,
    color: "#5C6B7A",
    lineHeight: 16,
  },

  // save + delete row
  bottomRow: { flexDirection: "row", marginHorizontal: 16, marginTop: 20, gap: 10 },
  saveBtn: {
    flex: 1,
    backgroundColor: BLUE,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveBtnTxt: { fontFamily: "Nunito_800ExtraBold", fontSize: 15, color: "#fff" },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1, borderColor: parrotRed,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  deleteBtnTxt: { fontFamily: "Nunito_800ExtraBold", fontSize: 14, color: parrotRed },

  // modal
  modalBackdrop: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.55)" },
  modalCard: { backgroundColor: "#fff", borderRadius: 18, padding: 24, width: vw(84), alignItems: "center" },
  modalTitle: { fontFamily: "Nunito_800ExtraBold", fontSize: 16, color: parrotTextDarkBlue, marginBottom: 10 },
  modalBody: { fontFamily: "Nunito_400Regular", fontSize: 13, color: parrotTextDarkBlue, textAlign: "center", marginBottom: 24, lineHeight: 19 },
  modalDeleteBtn: { backgroundColor: parrotRed, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 28, marginBottom: 12 },
  modalDeleteBtnTxt: { fontFamily: "Nunito_700Bold", color: "#fff", fontSize: 14 },
  modalCancel: { fontFamily: "Nunito_700Bold", color: parrotBlue, fontSize: 13 },
});
