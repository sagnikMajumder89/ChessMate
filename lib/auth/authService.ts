// lib/authService.js
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/firebaseConfig";

// Sign Up with Email
export const signUp = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
};

// Login with Email
export const login = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

// Google Login
export const signInWithGoogle = async () => {
    return await signInWithPopup(auth, googleProvider);
};

// Logout
export const logout = async () => {
    return await signOut(auth);
};
