import { createContext, createElement, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const formatUser = (firebaseUser) => {
  if (!firebaseUser) {
    return null;
  }

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    displayName: firebaseUser.displayName || "",
  };
};

export const authcontext = createContext({
  user: null,
  loading: true,
  loginUser: async () => {},
  registerUser: async () => {},
  logoutUser: async () => {},
});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(formatUser(currentUser));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const registerUser = async (name, email, password) => {
    const response = await createUserWithEmailAndPassword(auth, email, password);

    if (name.trim()) {
      await updateProfile(response.user, {
        displayName: name.trim(),
      });
    }

    setUser(formatUser(auth.currentUser || response.user));
  };

  const loginUser = async (email, password) => {
    const response = await signInWithEmailAndPassword(auth, email, password);
    setUser(formatUser(response.user));
  };

  const logoutUser = async () => {
    await signOut(auth);
    setUser(null);
  };

  return createElement(
    authcontext.Provider,
    {
      value: {
        user,
        loading,
        loginUser,
        registerUser,
        logoutUser,
      },
    },
    children,
  );
}
