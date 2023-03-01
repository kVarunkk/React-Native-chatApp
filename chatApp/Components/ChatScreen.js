import React from "react";
import socketIOClient from "socket.io-client";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import auth from "../database/firebase";
import moment from "moment";

import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  StatusBar,
} from "react-native";
import Message from "./Message";

export default function ChatScreen({ route, navigation }) {
  const { socket, room } = route.params;
  const [text, settext] = useState("");
  const [messages, setMessages] = useState([]);
  // const socket = socketIOClient(ENDPOINT);
  const [username, setusername] = useState("");

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prevMessages) => {
        return [...prevMessages, msg];
      });
    });

    socket.on("setMessages", (messages) => {
      setMessages(messages);
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused

      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
          setusername(user.email);
          socket.emit("getMessages", room);
          // ...
        } else {
          // User is signed out
          // ...
          navigation.navigate("Sign in");
        }
      });

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{room}</Text>
      <Text style={{ fontSize: 12, textAlign: "center", marginBottom: 10 }}>
        Your chats are end-to-end encrypted
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={{
            height: 40,
            padding: 10,
            borderColor: "gray",
            backgroundColor: "#fff",
            borderRadius: 5,
            borderWidth: 0,
            marginBottom: 10,
            marginTop: 20,
          }}
          placeholder={"Type something..."}
          value={text}
          onChangeText={(text) => settext(text)}
        />
        <Button
          title="Send"
          onPress={() => {
            socket.emit("message", {
              content: {
                decryptedMessage: text,
              },
              postedBy: {
                username: username,
              },
              time: moment().format("MMMM Do YYYY, h:mm:ss a"),
              room: room,
            });
            settext("");
          }}
        />
      </View>

      <View style={{ maxHeight: "70%" }}>
        <ScrollView style={styles.messageContainer}>
          {messages.map((message) => {
            return (
              <Message
                text={message.content.decryptedMessage}
                username={message.postedBy.username}
                time={message.time}
              ></Message>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    textAlign: "center",
    width: "100%",
    padding: 30,
    fontSize: 25,
  },
  heading: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  inputContainer: {
    marginBottom: 30,
  },

  messageContainer: {
    flexGrow: 0,
  },
});
