<script setup>
import { RouterLink } from 'vue-router'
import LoginBox from '@/components/LoginBox.vue'
import { ref, computed } from 'vue' 
import * as firebaseAuth from "firebase/auth";
import { auth, db } from '@/firebase'
import { ref as fbref, get } from '@firebase/database'

const authObservable = firebaseAuth.getAuth();
const user = ref()
const username = ref('')
const isSignedIn = computed(() => {
    return user.value != null ? true : false
})
const toggleLoginBox = ref(false)
const isAdmin = ref(false)

// Observable to watch onAuthState
firebaseAuth.onAuthStateChanged(authObservable, (userCredential) => {
    if(userCredential) {
        user.value = userCredential
        updateAccountBar(userCredential.uid)
    } else {
        user.value = null
        toggleLoginBox.value = false
    }
})

// Concludes authentication period for the user
async function logout() {
    await firebaseAuth.signOut(auth).then(() => {
        console.log("Successfully Logged out")
    }).catch((err) => {
        console.log("Logout error:", err)
    })
}

const updateAccountBar = (userID) => {
    get(fbref(db, 'users/' + userID)).then((snapshot) => {
        username.value = snapshot.val().name
        if(snapshot.val().role == 'Admin') {
            isAdmin.value = true
        }
    }).catch((err) => {
        console.log("Failed to retrieve user permissions:", err)
    })
}

</script>

<template>
    <div class="flex gap-4 select-none">
        <div class="ml-auto"></div>
        <div>
            <div v-if="!isSignedIn" class="hover:cursor-pointer hover:text-gray-500" @click="toggleLoginBox = !toggleLoginBox">
                Login
            </div>
            <div v-if="!isSignedIn && toggleLoginBox" class="relative">
                <LoginBox/>
            </div>
        </div>
        <div v-if="isSignedIn">
            Signed in as {{ username }}
        </div>
        <RouterLink to="/admin" v-if="isAdmin" class="hover:cursor-pointer hover:text-gray-500">Admin</RouterLink>
        <div v-if="isSignedIn" class="hover:cursor-pointer hover:text-gray-500" @click="logout()">
            Logout
        </div>
    </div>
</template>