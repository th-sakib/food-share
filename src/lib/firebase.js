// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxlwE9CUCB8-Uu-vs9hXlIhGtls_xAE20",
  authDomain: "food-share-ae7cf.firebaseapp.com",
  projectId: "food-share-ae7cf",
  storageBucket: "food-share-ae7cf.firebasestorage.app",
  messagingSenderId: "891869490339",
  appId: "1:891869490339:web:9079b14cda6edbabd12316",
  measurementId: "G-LSPYMGM1PZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;