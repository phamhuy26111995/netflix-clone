// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlhpbRLWOwrD_Qz9Xn58_48ErfOkmBh2A",
  authDomain: "netflix-clone-project-ef273.firebaseapp.com",
  projectId: "netflix-clone-project-ef273",
  storageBucket: "netflix-clone-project-ef273.appspot.com",
  messagingSenderId: "912825436216",
  appId: "1:912825436216:web:397859bdb523654a0afecd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore();
const auth = getAuth();

export default app;
export { auth , database }