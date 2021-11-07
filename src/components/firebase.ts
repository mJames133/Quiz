import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/database";

const app = firebase.initializeApp({
  apiKey: "AIzaSyAIUyXqlnq0_p7Dtoej_vx1nQvWS-qUcU0",
  authDomain: "react-69990.firebaseapp.com",
  databaseURL:
    "https://react-69990-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "react-69990",
  storageBucket: "react-69990.appspot.com",
  messagingSenderId: "569670275960",
  appId: "1:569670275960:web:872cb0c1b85921ca502e8d",
});
export const auth = firebase.auth();
export const db = app.firestore();
export const realdatabase = app.database();

export default app;
