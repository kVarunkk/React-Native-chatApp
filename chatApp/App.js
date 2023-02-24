import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "./Components/ChatScreen";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import WelcomeScreen from "./Components/WelcomeScreen";
import auth from "./database/firebase";
import { signOut } from "firebase/auth";

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

export default function App({ navigation }) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome Screen" component={WelcomeScreen} />
        <Stack.Screen name="Sign in" component={SignIn} />
        <Stack.Screen name="Sign up" component={SignUp} />
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
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
