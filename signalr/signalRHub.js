import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { AppState } from "react-native";
import { API_URL } from "@env";

let hubConnection = null;
let chatReadyRef = { current: false };
let messageHandlers = [];
let refetchHandlers = [];
let connectionUserId = null;
let currentApiUrl = null;

// Helper to check if we can actually attempt a start
const canStart = (state) => state === HubConnectionState.Disconnected;

// 📱 Handle App State (Foreground/Background)
AppState.addEventListener("change", async (nextAppState) => {
    if (nextAppState === "active" && hubConnection) {
        if (canStart(hubConnection.state)) {
            try {
                console.log("🔄 App foregrounded: Reconnecting SignalR...");
                await hubConnection.start();
                chatReadyRef.current = true;
            } catch (err) {
                console.log("Reconnect failed on foreground", err);
            }
        }
    }
});

export const initHubConnection = async (userId, apiUrl) => {
    if (!userId || !apiUrl) return null;

    // 1. If user changed, wipe the old connection entirely
    if (hubConnection && connectionUserId !== userId) {
        await stopHubConnection();
    }

    connectionUserId = userId;
    currentApiUrl = apiUrl;

    // 2. Return existing if already active
    if (hubConnection?.state === HubConnectionState.Connected) return hubConnection;

    // 3. Block redundant attempts if already transitioning
    if (hubConnection?.state === HubConnectionState.Connecting ||
        hubConnection?.state === HubConnectionState.Reconnecting) {
        return hubConnection;
    }

    // 4. Create new connection if none exists
    if (!hubConnection) {
        hubConnection = new HubConnectionBuilder()
            .withUrl(`${apiUrl}/chathub/11?userId=${userId}`)
            .withAutomaticReconnect()
            .build();

        setupInternalListeners();
    }

    // 5. Start Connection
    if (canStart(hubConnection.state)) {
        try {
            await hubConnection.start();
            chatReadyRef.current = true;
            console.log("✅ SignalR connected");
            return hubConnection;
        } catch (err) {
            console.error("❌ SignalR start failed:", err);
            chatReadyRef.current = false;

            // Retry logic: Only retry if it's still the same user
            setTimeout(() => {
                if (connectionUserId === userId) initHubConnection(userId, apiUrl);
            }, 5000);

            return null;
        }
    }
};

function setupInternalListeners() {
    if (!hubConnection) return;

    hubConnection.on("ParrotsChatHubInitialized", () => {
        chatReadyRef.current = true;
    });

    hubConnection.onreconnecting(() => {
        chatReadyRef.current = false;
    });

    hubConnection.onreconnected(() => {
        chatReadyRef.current = true;
    });

    hubConnection.on("ReceiveMessage", (data) => {
        messageHandlers.forEach(h => h(data));
    });

    hubConnection.on("ReceiveMessageRefetch", (data) => {
        refetchHandlers.forEach(h => h(data));
    });

    hubConnection.onclose(() => {
        chatReadyRef.current = false;
    });
}

export const stopHubConnection = async () => {
    if (!hubConnection) return;
    try {
        // Remove SignalR internal subscriptions
        hubConnection.off("ReceiveMessage");
        hubConnection.off("ReceiveMessageRefetch");
        hubConnection.off("ParrotsChatHubInitialized");

        await hubConnection.stop();
        console.log("🔴 SignalR stopped");
    } catch (err) {
        console.error("❌ Error during stop:", err);
    } finally {
        hubConnection = null;
        messageHandlers = [];
        refetchHandlers = [];
        chatReadyRef.current = false;
        connectionUserId = null;
    }
};

// --- Handler Registration (Standard Observer Pattern) ---

export const register_ReceiveMessage = (handler) => {
    if (!messageHandlers.includes(handler)) messageHandlers.push(handler);
};

export const unregister_ReceiveMessage = (handler) => {
    messageHandlers = messageHandlers.filter(h => h !== handler);
};

export const register_ReceiveMessageRefetch = (handler) => {
    if (!refetchHandlers.includes(handler)) refetchHandlers.push(handler);
};

export const unregister_ReceiveMessageRefetch = (handler) => {
    refetchHandlers = refetchHandlers.filter(h => h !== handler);
};

export const register_ReceiveUnreadNotification = (handler) => {
    if (!hubConnection) return;

    hubConnection.on("ReceiveUnreadNotification", handler);
};

export const unregister_ReceiveUnreadNotification = (handler) => {
    if (!hubConnection) return;

    hubConnection.off("ReceiveUnreadNotification", handler);
};

export const isHubReady = () => chatReadyRef.current && hubConnection?.state === HubConnectionState.Connected;

export const invokeHub = async (method, ...args) => {
    if (isHubReady()) {
        try {
            return await hubConnection.invoke(method, ...args);
        } catch (err) {
            console.error(`❌ Invoke ${method} failed:`, err);
            throw err;
        }
    }
    console.warn(`⚠️ Cannot invoke ${method}: Hub not ready`);
};