import React from "react";
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

function Message(props) {
  return (
    <View style={styles.messageBox}>
      <Text>From: {props.username}</Text>
      <Text>On: {props.time}</Text>
      <Text style={styles.content}>{props.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  messageBox: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#D3D3D3",
    borderRadius: 10,
    fontSize: 35,
    marginBottom: 10,
    padding: 15,
    // maxWidth: "80%",
    color: "white",
  },
  content: {
    fontSize: 17,
    fontWeight: "bold",
  },
});

export default Message;
