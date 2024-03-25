import { ref as fbref, get } from '@firebase/database'
import { db } from '@/firebase'

const getUsername = async(uid) => {
    try {
        const snapshot = await get(fbref(db, 'users/' + uid))
        return snapshot.val().name
    } catch (err) {
        console.log("Failed to retrieve username", err)
    }
}

const getRole = async(uid) => {
    try {
        const snapshot = await get(fbref(db, 'users/' + uid))
        return snapshot.val().role
    } catch (err) {
        console.log("Failed to retrieve role", err)
    }
}

export { getUsername, getRole }