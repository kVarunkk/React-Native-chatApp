import React from "react";
import socketIOClient from "socket.io-client";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import auth from "../database/firebase";
import moment from "moment";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
// const ENDPOINT = "https://7a15-203-110-242-42.in.ngrok.io";

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

      <View style={styles.inputContainer}>
        <TextInput
          style={{
            height: 40,
            padding: 10,
            // width: "70%",
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
              content: text,
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
          {/* <View > */}
          {messages.map((message) => {
            return (
              <Message
                text={message.content}
                username={message.postedBy.username}
                time={message.time}
              ></Message>
            );
          })}
          {/* </View> */}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // display: "flex",
    // flexDirection: "column",
    // paddingTop: StatusBar.currentHeight,
    // alignItems: "center",
    // justifyContent: "center",
    textAlign: "center",
    width: "100%",
    padding: 30,
    fontSize: 25,
  },
  heading: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
  },

  inputContainer: {
    marginBottom: 30,
  },

  messageContainer: {
    flexGrow: 0,
  },
});
