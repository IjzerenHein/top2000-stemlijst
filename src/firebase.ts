import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBEIZiISeP-aZ06oMxvNbM2rAuwH6Kj7g",
  authDomain: "spotify-import-957dd.firebaseapp.com",
  projectId: "spotify-import-957dd",
  storageBucket: "spotify-import-957dd.appspot.com",
  messagingSenderId: "23615912795",
  appId: "1:23615912795:web:1f5a41fbbf4721b63ff87e",
  measurementId: "G-VQGP0J0FMC",
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

export { firebase, firestore };
