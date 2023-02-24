import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDFa_PH26QaP1-ASo6welBSUCkOWp1PGZ4",

  authDomain: "react-native-chat-app-5e561.firebaseapp.com",

  projectId: "react-native-chat-app-5e561",

  storageBucket: "react-native-chat-app-5e561.appspot.com",

  messagingSenderId: "286907031967",

  appId: "1:286907031967:web:972385c96b9760273cddaa",

  measurementId: "G-MLZR40DXMK",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;
