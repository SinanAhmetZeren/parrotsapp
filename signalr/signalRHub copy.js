import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { AppState } from "react-native";

let hubConnection = null; // singleton hub connection
let chatReadyRef = { current: false }; // global ready state

// ⚡ Keep handlers declared at top
let messageHandlers = [];
let refetchHandlers = [];

let connectionUserId = null;

AppState.addEventListener("change", async state => {

    if (state === "active") {

        if (
            hubConnection &&
            hubConnection.state !== HubConnectionState.Connected &&
            hubConnection.state !== HubConnectionState.Connecting
        ) {
            try {
                console.log("🔄 Reconnecting SignalR...");
                await hubConnection.start();
                chatReadyRef.current = true;
            } catch {
                console.log("Reconnect failed");
            }
        }
    }
});

export const initHubConnection = async (currentUserId, apiUrl) => {
    if (!currentUserId) return null;

    if (hubConnection && connectionUserId !== currentUserId) {
        await stopHubConnection();
    }
    connectionUserId = currentUserId;

    // If already connected, just return it
    if (hubConnection?.state === HubConnectionState.Connected) return hubConnection;

    // IMPORTANT: If it's already in the middle of connecting, don't start again
    if (hubConnection?.state === HubConnectionState.Connecting ||
        hubConnection?.state === HubConnectionState.Reconnecting) {
        return hubConnection;
    }

    if (!hubConnection) {
        hubConnection = new HubConnectionBuilder()
            .withUrl(`${apiUrl}/chathub/11?userId=${currentUserId}`)
            .withAutomaticReconnect()
            .build();

        chatReadyRef.current = false;

        hubConnection.on("ParrotsChatHubInitialized", () => {
            console.log("✅ ParrotsChatHubInitialized received");
            chatReadyRef.current = true;
        });

        hubConnection.onreconnecting(() => {
            console.log("⚠️ SignalR reconnecting...");
            chatReadyRef.current = false;
        });

        hubConnection.onreconnected(() => {
            console.log("🔄 SignalR reconnected");
            chatReadyRef.current = true;
        });


        // Inside if (!hubConnection) block:
        hubConnection.on("ReceiveMessage", (data) => {
            messageHandlers.forEach(h => h(data));
        });

        hubConnection.on("ReceiveMessageRefetch", (data) => {
            refetchHandlers.forEach(h => h(data));
        });

        // Return a promise that resolves once hub is connected
        return hubConnection.start()
            .then(() => {
                chatReadyRef.current = true;
                console.log("✅ SignalR connected (awaitable)");
                return hubConnection;
            })
            .catch(err => {
                console.error("❌ SignalR start failed:", err);
                chatReadyRef.current = false;

                setTimeout(() => {
                    initHubConnection(currentUserId, apiUrl);
                }, 3000);

                return null;
            });
    }

    // Already exists → resolve immediately
    return Promise.resolve(hubConnection);
};



export const stopHubConnection = async () => {
    if (hubConnection) {
        try {
            hubConnection.off("ReceiveMessage");
            hubConnection.off("ReceiveMessageRefetch");
            await hubConnection.stop();
            messageHandlers = [];
            refetchHandlers = [];
            console.log("🔴 SignalR stopped");
        } catch (err) {
            console.error("❌ Failed to stop SignalR:", err);
        } finally {
            hubConnection = null;
            chatReadyRef.current = false;
        }
    }
};

export const registerReceiveMessage = (handler) => {

    if (!messageHandlers.includes(handler)) {
        messageHandlers.push(handler);
    }

};

export const unregisterReceiveMessage = (handler) => {
    messageHandlers = messageHandlers.filter(h => h !== handler);
};

export const registerRefetchHandler = (handler) => {
    refetchHandlers.push(handler);
};

export const unregisterRefetchHandler = (handler) => {
    refetchHandlers = refetchHandlers.filter(h => h !== handler);
};

export const isHubReady = () => chatReadyRef.current;

export const invokeHub = async (method, ...args) => {
    if (hubConnection?.state === HubConnectionState.Connected && chatReadyRef.current) {
        try {
            return await hubConnection.invoke(method, ...args);
        } catch (err) {
            console.error(`❌ SignalR invoke ${method} failed:`, err);
        }
    } else {
        console.warn(`⚠️ SignalR not connected or ready: cannot invoke ${method}`);
    }
};


