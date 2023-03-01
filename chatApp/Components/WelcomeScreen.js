import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View>
        <Image
          source={{
            uri: "https://reactnative.dev/docs/assets/p_cat2.png",
          }}
          style={{ width: 200, height: 200 }}
        />
      </View>
      <Text style={styles.heading}>Welcome to GroupChat 🚀</Text>
      <Text style={{ fontSize: 13 }}>
        Securely Chat, Connect, Collaborate: Together with GroupChat!
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Sign up"
          onPress={() => navigation.navigate("Sign up")}
        ></Button>
        <Button
          title="Sign in"
          onPress={() => navigation.navigate("Sign in")}
        ></Button>
      </View>
    </View>
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
    marginBottom: 10,
  },
  buttonContainer: {
    display: "flex",
    width: "50%",
    justifyContent: "space-around",
    flexDirection: "row",
    marginTop: 40,
  },
});

export default WelcomeScreen;
