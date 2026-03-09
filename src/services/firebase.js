import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBszuyDMDOcvnU8YsFC458xjJmIIStdZgY",
    authDomain: "chatapp-e8a42.firebaseapp.com",
    projectId: "chatapp-e8a42",
    storageBucket: "chatapp-e8a42.firebasestorage.app",
    messagingSenderId: "430100224701",
    appId: "1:430100224701:web:7db3a0496d1029bc38f5d4",
    measurementId: "G-NYW2CLLN42"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);