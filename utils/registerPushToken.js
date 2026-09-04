import Notifications, { isExpoGo } from "./notificationsModule";
import * as Device from "expo-device";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function registerPushTokenAsync(token) {
  try {
    if (!Device.isDevice) return;
    if (isExpoGo) return;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log("[PUSH] Existing permission status:", existingStatus);
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log("[PUSH] Permission status after request:", finalStatus);
    }
    if (finalStatus !== "granted") {
      console.log("[PUSH] Permission not granted, aborting");
      return;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId: "5f4ee090-1e51-4228-b36b-23715333bcc4" });
    const pushToken = tokenData.data;
    console.log("[PUSH] Token obtained:", pushToken);

    const response = await fetch(`${API_URL}/api/account/push-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pushToken),
    });
    if (response.ok) {
      console.log("[PUSH] Token saved to server successfully");
      await AsyncStorage.setItem("storedExpoPushToken", pushToken);
    } else {
      console.log("[PUSH] Token save failed, status:", response.status);
    }
  } catch (err) {
    console.log("[PUSH] Registration error:", err);
  }
}
