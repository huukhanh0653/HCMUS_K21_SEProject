import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
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

const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

const signUpWithEmail = async (email, password) => {
  try {
    const auth = getAuth();
    // Kiểm tra xem email đã được sử dụng chưa
    const user = auth.currentUser;
    if (user) {
      // Nếu người dùng đã đăng nhập bằng Google
      const providers = user.providerData;
      const hasGoogleProvider = providers.some(p => p.providerId === 'google.com');
      
      if (hasGoogleProvider) {
        // Ghi đè tài khoản email vào tài khoản Google
        const credential = EmailAuthProvider.credential(email, password);
        await linkWithCredential(user, credential);
        return user;
      }
    }
    
    // Nếu chưa có tài khoản nào, tạo mới
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      // Xử lý trường hợp email đã được sử dụng
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const providers = user.providerData;
        const hasGoogleProvider = providers.some(p => p.providerId === 'google.com');
        
        if (hasGoogleProvider) {
          // Ghi đè tài khoản email vào tài khoản Google
          const credential = EmailAuthProvider.credential(email, password);
          await linkWithCredential(user, credential);
          return user;
        }
      }
    }
    throw error;
  }
};

export { auth, signInWithGoogle, signInWithFacebook, signInWithEmail, signUpWithEmail };
