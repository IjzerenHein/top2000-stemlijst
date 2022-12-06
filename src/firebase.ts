import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvB_KTZppSJyLIY59NyVpp36cj14RviWo",
  authDomain: "top2000-stemlijst.firebaseapp.com",
  projectId: "top2000-stemlijst",
  storageBucket: "top2000-stemlijst.appspot.com",
  messagingSenderId: "132532063292",
  appId: "1:132532063292:web:6cbca0bc8514c3cf260739",
  measurementId: "G-DHMEDK5F2Y",
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { analytics, firestore, logEvent, collection, doc, addDoc, getDoc };
