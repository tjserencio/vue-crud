import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyAWeDkAL2L8z8au8Ltvof0p3k4A_qdwzVY",
  authDomain: "segwitz-83f6d.firebaseapp.com",
  databaseURL: "https://segwitz-83f6d.firebaseio.com",
  projectId: "segwitz-83f6d",
  storageBucket: "segwitz-83f6d.appspot.com",
  messagingSenderId: "700744079635",
  appId: "1:700744079635:web:0db7b2b060a0f0329362e6",
  measurementId: "G-7G3M5G9DH1"
};

// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);