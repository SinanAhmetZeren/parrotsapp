import { HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { AppState } from "react-native";
import { API_URL } from "@env";

let hubConnection = null;
let chatReadyRef = { current: false };
let messageHandlers = [];
let refetchHandlers = [];
let groupMessageHandlers = [];
let groupMessageRefetchHandlers = [];
let reconnectingHandlers = [];
let reconnectedHandlers = [];
let connectionUserId = null;
let currentApiUrl = null;

// Helper to check if we can actually attempt a start
const canStart = (state) => state === HubConnectionState.Disconnected;


// 📱 Handle App State (Foreground/Background)
AppState.addEventListener("change", async (nextAppState) => {
    if (nextAppState === "active" && hubConnection) {
        if (canStart(hubConnection.state)) {
            try {
                await hubConnection.start();
                chatReadyRef.current = true;
            } catch (err) {
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
    if (hubConnection?.state === HubConnectionState.Connected) {
        return hubConnection;
    }
    // 3. Block redundant attempts if already transitioning
    if (hubConnection?.state === HubConnectionState.Connecting ||
        hubConnection?.state === HubConnectionState.Reconnecting) {

        return hubConnection;
    }

    // 4. Create new connection if none exists
    if (!hubConnection) {
        hubConnection = new HubConnectionBuilder()
            .withUrl(`${apiUrl}/chathub/81?userId=${userId}`)
            .withAutomaticReconnect()
            .configureLogging(LogLevel.None)
            .build();

        setupInternalListeners();
    }

    // 5. Start Connection
    if (canStart(hubConnection.state)) {
        try {
            await hubConnection.start();
            chatReadyRef.current = true;
            return hubConnection;
        } catch (err) {
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
        reconnectingHandlers.forEach(h => h());
    });

    hubConnection.onreconnected(() => {
        chatReadyRef.current = true;
        reconnectedHandlers.forEach(h => h());
    });

    hubConnection.on("ReceiveMessage", (...args) => {
        messageHandlers.forEach(h => h(...args));
    });

    hubConnection.on("ReceiveMessageRefetch", (data) => {
        refetchHandlers.forEach(h => h(data));
    });

    hubConnection.on("ReceiveGroupMessage", (data) => {
        groupMessageHandlers.forEach(h => h(data));
    });

    hubConnection.on("ReceiveGroupMessageRefetch", (groupId) => {
        groupMessageRefetchHandlers.forEach(h => h(groupId));
    });

    hubConnection.onclose(() => {
        chatReadyRef.current = false;
        reconnectingHandlers.forEach(h => h());
        scheduleReconnect();
    });
}

function scheduleReconnect() {
    setTimeout(async () => {
        if (hubConnection && canStart(hubConnection.state) && connectionUserId && currentApiUrl) {
            try {
                await hubConnection.start();
                chatReadyRef.current = true;
                reconnectedHandlers.forEach(h => h());
            } catch {
                scheduleReconnect();
            }
        } else if (hubConnection && (hubConnection.state === HubConnectionState.Connected)) {
            reconnectedHandlers.forEach(h => h());
        } else {
            scheduleReconnect();
        }
    }, 30000);
}

export const register_OnReconnecting = (handler) => {
    if (!reconnectingHandlers.includes(handler)) reconnectingHandlers.push(handler);
};
export const unregister_OnReconnecting = (handler) => {
    reconnectingHandlers = reconnectingHandlers.filter(h => h !== handler);
};
export const register_OnReconnected = (handler) => {
    if (!reconnectedHandlers.includes(handler)) reconnectedHandlers.push(handler);
};
export const unregister_OnReconnected = (handler) => {
    reconnectedHandlers = reconnectedHandlers.filter(h => h !== handler);
};

export const stopHubConnection = async () => {
    if (!hubConnection) return;
    try {
        // Remove SignalR internal subscriptions
        hubConnection.off("ReceiveMessage");
        hubConnection.off("ReceiveMessageRefetch");
        hubConnection.off("ReceiveGroupMessage");
        hubConnection.off("ReceiveGroupMessageRefetch");
        hubConnection.off("ParrotsChatHubInitialized");

        await hubConnection.stop();
    } catch (err) {
    } finally {
        hubConnection = null;
        messageHandlers = [];
        refetchHandlers = [];
        groupMessageHandlers = [];
        groupMessageRefetchHandlers = [];
        reconnectingHandlers = [];
        reconnectedHandlers = [];
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

export const register_ReceiveGroupMessage = (handler) => {
    if (!groupMessageHandlers.includes(handler)) groupMessageHandlers.push(handler);
};
export const unregister_ReceiveGroupMessage = (handler) => {
    groupMessageHandlers = groupMessageHandlers.filter(h => h !== handler);
};

export const register_ReceiveGroupMessageRefetch = (handler) => {
    if (!groupMessageRefetchHandlers.includes(handler)) groupMessageRefetchHandlers.push(handler);
};
export const unregister_ReceiveGroupMessageRefetch = (handler) => {
    groupMessageRefetchHandlers = groupMessageRefetchHandlers.filter(h => h !== handler);
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
    if (hubConnection?.state !== HubConnectionState.Connected) {
        throw new Error("Hub not ready");
    }
    return await hubConnection.invoke(method, ...args);
};