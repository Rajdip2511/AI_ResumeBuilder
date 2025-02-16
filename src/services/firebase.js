import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAqLnDeWDpR3mkvtyMk4cVECKaJygDbNvw",
  authDomain: "ai-resume-builder-5dfcb.firebaseapp.com",
  projectId: "ai-resume-builder-5dfcb",
  storageBucket: "ai-resume-builder-5dfcb.firebasestorage.app",
  messagingSenderId: "776215066690",
  appId: "1:776215066690:web:3ca318ee8e9cfe7fef95db",
  measurementId: "G-Z2E8NWRMHJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Enable persistence for Firestore
try {
  const db = getFirestore();
  db.enablePersistence()
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.log('Persistence failed: Multiple tabs open');
      } else if (err.code === 'unimplemented') {
        // The current browser doesn't support persistence
        console.log('Persistence not supported');
      }
    });
} catch (err) {
  console.error('Error enabling persistence:', err);
}

export { auth, db, storage, analytics, googleProvider }; 