import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDDWEP7aDCJn5nP_sO1267nbAACR7cMZmE",
  authDomain: "chatapp-90d7f.firebaseapp.com",
  projectId: "chatapp-90d7f",
  storageBucket: "chatapp-90d7f.firebasestorage.app",
  messagingSenderId: "475220721300",
  appId: "1:475220721300:web:3d523bbc0421c1f0edfe81",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//firbase Authentication
export const auth = getAuth();
// firebase Database
export const db = getFirestore(app);
//firebase Storage
export const storage = getStorage();
