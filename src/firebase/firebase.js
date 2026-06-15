import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDdc9U4kRDN3B_YxEuX8FFYESIiv1QW2M8",
  authDomain: "to-do-app-c2bc4.firebaseapp.com",
  projectId: "to-do-app-c2bc4",
  storageBucket: "to-do-app-c2bc4.firebasestorage.app",
  messagingSenderId: "374401620474",
  appId: "1:374401620474:web:58924d834bc576a837ec43",
  measurementId: "G-4LX2GHPE21",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
