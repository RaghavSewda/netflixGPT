// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB74DY2slBf6exS2n0V0zk15NtKAU9uqfo",
  authDomain: "netflixgpt-d4904.firebaseapp.com",
  projectId: "netflixgpt-d4904",
  storageBucket: "netflixgpt-d4904.appspot.com",
  messagingSenderId: "119610856736",
  appId: "1:119610856736:web:3d75c74ab551e667f5b345",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
