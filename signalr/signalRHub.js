import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";

let hubConnection = null; // singleton hub connection
let chatReadyRef = { current: false }; // global ready state

// ⚡ Keep handlers declared at top
let messageHandlers = [];
let refetchHandlers = [];

export const initHubConnection = (currentUserId, apiUrl) => {
    if (!currentUserId) return { chatReadyRef };

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

        const startHub = async () => {
            try {
                if (hubConnection.state === HubConnectionState.Disconnected) {
                    chatReadyRef.current = false;
                    await hubConnection.start();

                    // Receive events
                    hubConnection.on("ReceiveMessage", (...args) => {
                        messageHandlers.forEach(h => h(...args));
                    });

                    hubConnection.on("ReceiveMessageRefetch", (...args) => {
                        refetchHandlers.forEach(h => h(...args));
                    });

                    console.log("✅ SignalR connected");
                }
            } catch (err) {
                console.error("❌ SignalR start failed:", err);
                chatReadyRef.current = false;
                setTimeout(startHub, 3000);
            }
        };

        startHub();
    }

    return { chatReadyRef };
};

export const stopHubConnection = async () => {
    if (hubConnection) {
        try {
            await hubConnection.stop();
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
    messageHandlers.push(handler);
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