import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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

// const auth = getAuth();

function SignUp({ route, navigation }) {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const { socket } = route.params;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        keyboardType="email-address"
        placeholder={"Your email..."}
        value={email}
        onChangeText={(email) => setemail(email)}
      />
      <TextInput
        style={styles.input}
        keyboardType="default"
        placeholder={"Your password..."}
        value={password}
        onChangeText={(password) => setpassword(password)}
      />
      <Button
        title="Sign up"
        onPress={() => {
          createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              // Signed in
              const user = userCredential.user;
              socket.emit("signUp", {
                username: email,
                password: password,
              });
              navigation.navigate("Choose Room");
              // ...
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorMessage);
              // ..
            });
        }}
      />
      <Text style={styles.text} onPress={() => navigation.navigate("Sign in")}>
        Already have an account? Sign in
      </Text>
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
  input: {
    height: 40,
    padding: 10,
    width: "70%",
    borderColor: "gray",
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 0,
    marginBottom: 10,
    marginTop: 10,
  },
  text: {
    marginTop: 10,
    fontSize: 13,
  },
});

export default SignUp;
