import { initializeApp } from "firebase/app";
import * as firebaseAuth from "firebase/auth";

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
const auth = firebaseAuth.getAuth(firebaseApp)
const emailAuthProvider = firebaseAuth.EmailAuthProvider.PROVIDER_ID;

function createNewAccount(auth, email, pass, displayName) {
    firebaseAuth.createUserWithEmailAndPassword(auth, email, pass).then((userCredential) => {
        const user = userCredential.user;
        console.log("Created new account:", user)

        firebaseAuth.updateProfile(user, {
            displayName: displayName
        }).then(() => {
            console.log("Successfully updated the profile with displayname:", displayName)
        }).catch(() => {
            console.log("Failed to update the profile with displayname", displayName)
        })
    }).catch((err) => {
        console.log("Signup error:", err)
    })
}

export { createNewAccount }
export { auth, emailAuthProvider }
export default firebaseApp