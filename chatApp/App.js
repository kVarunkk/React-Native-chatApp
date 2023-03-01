import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "./Components/ChatScreen";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import WelcomeScreen from "./Components/WelcomeScreen";
import ChooseRoomScreen from "./Components/ChooseRoomScreen";
import auth from "./database/firebase";
import { signOut } from "firebase/auth";
import socketIO from "socket.io-client";
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

const Stack = createNativeStackNavigator();
const ENDPOINT = "https://6d9e-203-110-242-44.in.ngrok.io";
const socket = socketIO.connect(ENDPOINT);

export default function App({ navigation }) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome Screen" component={WelcomeScreen} />
        <Stack.Screen name="Sign in" component={SignIn} />
        <Stack.Screen
          name="Sign up"
          component={SignUp}
          initialParams={{ socket: socket }}
        />
        <Stack.Screen
          name="Choose Room"
          component={ChooseRoomScreen}
          options={{
            headerRight: () => (
              <Button
                onPress={() => {
                  signOut(auth)
                    .then(() => {
                      // Sign-out successful.
                    })
                    .catch((error) => {
                      // An error happened.
                      console.log(error);
                    });
                }}
                title="Log out"
                color="red"
              />
            ),
          }}
          initialParams={{ socket: socket }}
        />
        <Stack.Screen
          name="Chat Screen"
          component={ChatScreen}
          options={{
            headerRight: () => (
              <Button
                onPress={() => {
                  signOut(auth)
                    .then(() => {
                      // Sign-out successful.
                    })
                    .catch((error) => {
                      // An error happened.
                      console.log(error);
                    });
                }}
                title="Log out"
                color="red"
              />
            ),
          }}
          initialParams={{ socket: socket }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
