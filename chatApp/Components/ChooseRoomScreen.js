import React from "react";
import socketIOClient from "socket.io-client";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import auth from "../database/firebase";

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
import axios from "axios";

const ENDPOINT = "https://8c63-203-110-242-42.in.ngrok.io";

export default function ChooseRoomScreen({ route, navigation }) {
  const [text, setText] = useState("");
  const { socket } = route.params;

  // const socket = socketIOClient(ENDPOINT);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
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
          Create a room and invite your friends to chat!
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
          title="Create"
          onPress={() => {
            socket.emit("roomName", text);
            navigation.navigate("Chat Screen", { room: text });
          }}

          // onPress={async () => {
          //   await axios
          //     .post(ENDPOINT, {
          //       text: text,
          //     })
          //     .then(function (response) {
          //       console.log(response);
          //       navigation.navigate("Chat Screen");
          //     })
          //     .catch(function (error) {
          //       console.log(error);
          //     });
          // }}
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
