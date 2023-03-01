import React from "react";
import socketIOClient from "socket.io-client";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import auth from "../database/firebase";

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
import axios from "axios";

const ENDPOINT = "https://8c63-203-110-242-42.in.ngrok.io";

export default function ChooseRoomScreen({ route, navigation }) {
  const [text, setText] = useState("");
  const { socket } = route.params;

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>
          Create Chatroom and invite your friends!
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
          placeholder={"Type room name..."}
          value={text}
          onChangeText={(text) => setText(text)}
        />
        <Button
          title="Join Room"
          onPress={() => {
            socket.emit("roomName", text);
            navigation.navigate("Chat Screen", { room: text });
          }}
        />
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
