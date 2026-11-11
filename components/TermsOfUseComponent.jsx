import React, { useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useGetCurrentTermsQuery } from "../slices/UserSlice";

export default function TermsOfUseComponent({ onAccept } = {}) {
    const { data, isLoading, isError } = useGetCurrentTermsQuery();


    const html = useMemo(() => {
        if (!data) return null;
        let content = data.content || "";
        content = content.replace("{VERSION}", data.version || "");
        if (onAccept) {
            content = content.replace("</body>", `
<div style="padding:16px;">
  <button onclick="window.ReactNativeWebView.postMessage('accept')" style="width:100%;background:#007bff;color:#fff;border:none;border-radius:8px;padding:14px;font-size:16px;font-weight:700;cursor:pointer;">I Accept</button>
</div>
</body>`);
        }
        return content;
    }, [data, onAccept]);

    if (isLoading) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><ActivityIndicator /></View>;
    if (isError || !html) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><ActivityIndicator /></View>;

    return (
        <WebView
            source={{ html }}
            style={{ flex: 1, backgroundColor: "#fff" }}
            javaScriptEnabled={true}
            onMessage={(e) => {
                if (e.nativeEvent.data === "accept" && onAccept) onAccept();
            }}
        />
    );
}
