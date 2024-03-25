import * as admin from 'firebase-admin'
import * as serviceAccount from "./admin.json"

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount), 
    databaseURL: "https://paintcompany-f9438-default-rtdb.firebaseio.com/"
})

const db = admin.database();
export {admin, db}