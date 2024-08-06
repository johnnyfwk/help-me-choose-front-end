import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBcVyYhm09XYQvk69z_moCHWS59aoxonDk",
    authDomain: "helpmechoose-9d341.firebaseapp.com",
    projectId: "helpmechoose-9d341",
    storageBucket: "helpmechoose-9d341.appspot.com",
    messagingSenderId: "433790171229",
    appId: "1:433790171229:web:b723272cfab0f68d5f75b4",
    measurementId: "G-J8J3H4YNCF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };