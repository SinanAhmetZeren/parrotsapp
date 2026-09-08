import { isRunningInExpoGo } from "expo";

export const isExpoGo = isRunningInExpoGo();
const Notifications = isExpoGo ? null : require("expo-notifications");
export default Notifications;
