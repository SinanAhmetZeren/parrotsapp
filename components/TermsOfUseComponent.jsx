import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { API_URL } from "@env";

export default function TermsOfUseComponent({ onAccept } = {}) {
    const [html, setHtml] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/api/account/current-terms`)
            .then(r => r.json())
            .then(data => {
                let content = data.content || "";
                content = content.replace("{VERSION}", data.version || "");
                if (onAccept) {
                    content = content.replace("</body>", `
<div style="padding:16px;">
  <button onclick="window.ReactNativeWebView.postMessage('accept')" style="width:100%;background:#007bff;color:#fff;border:none;border-radius:8px;padding:14px;font-size:16px;font-weight:700;cursor:pointer;">I Accept</button>
</div>
</body>`);
                }
                setHtml(content);
            })
            .catch(() => setHtml("<p style='padding:16px;color:#999;'>Failed to load terms.</p>"));
    }, []);

    if (!html) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><ActivityIndicator /></View>;

    return (
        <WebView
            source={{ html }}
            style={{ flex: 1, backgroundColor: "#fff" }}
            onMessage={(e) => {
                if (e.nativeEvent.data === "accept" && onAccept) onAccept();
            }}
        />
    );
}
