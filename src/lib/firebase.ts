import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBrYERzmNZ4Atu5RpNBekurrmp5CqcTYag",
    authDomain: "declaracionrenta-dabad.firebaseapp.com",
    projectId: "declaracionrenta-dabad",
    storageBucket: "declaracionrenta-dabad.firebasestorage.app",
    messagingSenderId: "273592515705",
    appId: "1:273592515705:web:be92b64f2d1322e4b568a8",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
