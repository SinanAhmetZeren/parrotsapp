// App.js

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button } from "react-native";
import * as SignalR from "@microsoft/signalr";

const App = () => {
  const [connection, setConnection] = useState(null);
  const [user, setUser] = useState(""); // User sending the message
  const [receiver, setReceiver] = useState(""); // User receiving the message
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newConnection = new SignalR.HubConnectionBuilder()
      .withUrl("YOUR_API_URL/chathub")
      .build();

    setConnection(newConnection);

    newConnection
      .start()
      .then(() => console.log("Connection established"))
      .catch((err) => console.error(err));

    newConnection.on("ReceiveMessage", (receivedUser, receivedMessage) => {
      setMessages([
        ...messages,
        { user: receivedUser, message: receivedMessage },
      ]);
    });

    return () => {
      newConnection.stop();
    };
  }, [messages]);

  const sendMessage = async () => {
    if (connection) {
      await connection.invoke("SendMessage", user, receiver, message);
      setMessage("");
    }
  };

  return (
    <View>
      <Text>Chat App</Text>
      <TextInput
        placeholder="Your name"
        value={user}
        onChangeText={(text) => setUser(text)}
      />
      <TextInput
        placeholder="Receiver's name"
        value={receiver}
        onChangeText={(text) => setReceiver(text)}
      />
      <TextInput
        placeholder="Type your message"
        value={message}
        onChangeText={(text) => setMessage(text)}
      />
      <Button title="Send" onPress={sendMessage} />
      <View>
        {messages.map((msg, index) => (
          <Text key={index}>{`${msg.user}: ${msg.message}`}</Text>
        ))}
      </View>
    </View>
  );
};

export default App;
