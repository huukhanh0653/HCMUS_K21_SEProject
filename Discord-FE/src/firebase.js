// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBKlHIrMJDTZbNPK3xl8x1MoSNZTFYSAFQ",
    authDomain: "discord-4ed5d.firebaseapp.com",
    projectId: "discord-4ed5d",
    storageBucket: "discord-4ed5d.firebasestorage.app",
    messagingSenderId: "865225418567",
    appId: "1:865225418567:web:3e3a2831a0fc01d106ce62",
    measurementId: "G-0MZ8JV6C14"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log(result.user);
    return result.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    console.log(result.user);
    return result.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { auth, signInWithGoogle, signInWithFacebook };
