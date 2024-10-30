import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
 apiKey: "AIzaSyBP9pFZfaCqhBfHq3u70SKvIWDAg2MmzTg",
  authDomain: "ai-apps-99296.firebaseapp.com",
  databaseURL: "https://ai-apps-99296-default-rtdb.firebaseio.com",
  projectId: "ai-apps-99296",
  storageBucket: "ai-apps-99296.appspot.com",
  messagingSenderId: "967477882978",
  appId: "1:967477882978:web:1f7288b9d085e1a168a13b"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };