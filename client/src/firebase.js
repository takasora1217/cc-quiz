// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqnt7SNUFXKsarjfnleo0DUlbe5IBsecY",
  authDomain: "ri---gu-6c233.firebaseapp.com",
  projectId: "ri---gu-6c233",
  storageBucket: "ri---gu-6c233.firebasestorage.app",
  messagingSenderId: "871376503334",
  appId: "1:871376503334:web:25df5a6cbcce310ccb1ce7",
  measurementId: "G-NRX5QQ6SGH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);