import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_6IwA0cHjuU3n_dqCGTqkNpNQQ5eyeTw",
  authDomain: "final-5766c.firebaseapp.com",
  projectId: "final-5766c",
  storageBucket: "final-5766c.firebasestorage.app",
  messagingSenderId: "330416121797",
  appId: "1:330416121797:web:1072f88fcd104917b04dac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

