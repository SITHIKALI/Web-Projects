// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    projectId: "verdant-path-t2guf",
    appId: "1:205595866065:web:65c579670b583a717366f0",
    storageBucket: "verdant-path-t2guf.firebasestorage.app",
    apiKey: "AIzaSyDc0UkD9snCeTUoDXKUlc2tbFzkONDsIYM",
    authDomain: "verdant-path-t2guf.firebaseapp.com",
    measurementId: "",
    messagingSenderId: "205595866065"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const messaging = (typeof window !== 'undefined') ? getMessaging(app) : null;


export { app, auth, db, messaging };
