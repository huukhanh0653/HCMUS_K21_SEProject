import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup, 
  EmailAuthProvider, 
  linkWithCredential 
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Authentication providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

/**
 * Sign up with email and password
 */
const signUpWithEmail = async (email, password) => {
  try {
    console.log("Attempting to create user with email:", email);

    // Create new user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created successfully:", userCredential);

    if (!userCredential || !userCredential.user) {
      throw new Error("Firebase did not return a valid user.");
    }

    return userCredential.user;
  } catch (error) {
    console.error("Error in signUpWithEmail:", error);

    // Handle case where email is already in use
    if (error.code === 'auth/email-already-in-use') {
      console.log("Email already in use, checking for linking possibility...");

      const user = auth.currentUser;
      if (user) {
        const providers = user.providerData;
        const hasGoogleProvider = providers.some(p => p.providerId === 'google.com');

        if (hasGoogleProvider) {
          console.log("Linking Google account with email/password...");
          const credential = EmailAuthProvider.credential(email, password);
          const linkedUser = await linkWithCredential(user, credential);
          return linkedUser.user;
        }
      }
    }

    throw error;
  }
};

/**
 * Sign in with email and password
 */
const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in");
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

/**
 * Sign in with Google
 */
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google sign-in successful:", result.user);
    return result.user;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

/**
 * Sign in with Facebook
 */
const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    console.log("Facebook sign-in successful:", result.user);
    return result.user;
  } catch (error) {
    console.error("Facebook sign-in error:", error);
    throw error;
  }
};

// Export authentication functions
export { auth, signInWithGoogle, signInWithFacebook, signInWithEmail, signUpWithEmail };
