import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
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

function SignIn({ navigation }) {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused

      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
          navigation.navigate("Chat Screen");
          // ...
        } else {
          // User is signed out
          // ...
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
        title="Sign in"
        onPress={() => {
          if (email.trim() && password.trim()) {
            signInWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                // ...
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
              });
          } else {
            alert("Please enter email and password");
          }
        }}
      />
      <Text style={styles.text} onPress={() => navigation.navigate("Sign up")}>
        Don't have an account? Sign up
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

export default SignIn;
