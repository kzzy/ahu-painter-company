import { initializeApp } from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import { getDatabase } from "firebase/database"

const firebaseConfig = {
    apiKey: "FIREBASE_API_KEY",
    authDomain: "FIREBASE_AUTH_DOMAIN",
    databaseURL: "FIREBASE_DATABASE_URL",
    projectId: "FIREBASE_PROJECT_ID",
    storageBucket: "FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID",
    appId: "FIREBASE_APP_ID"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = firebaseAuth.getAuth(firebaseApp);
const db = getDatabase(firebaseApp);

export { auth, db }
export default firebaseApp