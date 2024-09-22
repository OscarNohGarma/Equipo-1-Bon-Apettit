// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCUX5GSDse9HLslEVk-Qj9fZ9uJvepl53w",
  authDomain: "myweb-b3462.firebaseapp.com",
  databaseURL: "https://myweb-b3462-default-rtdb.firebaseio.com",
  projectId: "myweb-b3462",
  storageBucket: "myweb-b3462.appspot.com",
  messagingSenderId: "954683608340",
  appId: "1:954683608340:web:c0acb8a928bada75b20601",
  measurementId: "G-BRSBTD950Z"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//export const analytics = getAnalytics(app);
export const firebaseDataBase = getDatabase(app);