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
const ENDPOINT = "https://7a01-203-110-242-42.in.ngrok.io";

export default function ChatScreen({ navigation }) {
  const [text, settext] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = socketIOClient(ENDPOINT);
  const [username, setusername] = useState("");

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prevMessages) => {
        return [...prevMessages, msg];
      });
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
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>
          Hello {username}, start chatting with your friends now!
        </Text>

        <TextInput
          style={{
            height: 40,
            padding: 10,
            width: "70%",
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
              username: username,
              time: moment().format("MMMM Do YYYY, h:mm:ss a"),
            });
            settext("");
            console.log(moment().format("MMMM Do YYYY, h:mm:ss a"));
          }}
        />

        <View
          style={{
            marginTop: 50,
            fontSize: 20,
          }}
        >
          {messages.map((message) => {
            return (
              <Message
                text={message.content}
                username={message.username}
                time={message.time}
              ></Message>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    paddingTop: StatusBar.currentHeight,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 25,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
