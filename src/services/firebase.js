import { initializeApp } from "firebase/app";
import {
    initializeAuth,
    getReactNativePersistence
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";

import AsyncStorage from "@react-native-async-storage/async-storage";


// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBszuyDMDOcvnU8YsFC458xjJmIIStdZgY",
    authDomain: "chatapp-e8a42.firebaseapp.com",
    projectId: "chatapp-e8a42",
    storageBucket: "chatapp-e8a42.firebasestorage.app",
    messagingSenderId: "430100224701",
    appId: "1:430100224701:web:7db3a0496d1029bc38f5d4",
    measurementId: "G-NYW2CLLN42"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Auth with persistent login
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});


// Firestore
export const db = getFirestore(app);