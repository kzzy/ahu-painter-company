import * as admin from 'firebase-admin'
import * as serviceAccount from "./admin.json"

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount), 
    databaseURL: ""
})

const db = admin.database();
export {admin, db}