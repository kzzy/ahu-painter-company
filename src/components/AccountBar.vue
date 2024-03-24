<script setup>
import { RouterLink } from 'vue-router'
import LoginBox from '@/components/LoginBox.vue'
import { ref, computed } from 'vue' 
import * as firebaseAuth from "firebase/auth";
import { auth } from '@/firebase'

const authObservable = firebaseAuth.getAuth();
const user = ref()
const isSignedIn = computed(() => {
    return user.value != null ? true : false
})
const toggleLoginBox = ref(false)

// Observable to watch onAuthState
firebaseAuth.onAuthStateChanged(authObservable, (userCredential) => {
    if(userCredential) {
        user.value = userCredential
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
            Signed in as {{ user.displayName }}
        </div>
        <RouterLink to="/admin" class="hover:cursor-pointer hover:text-gray-500">Admin</RouterLink>
        <div v-if="isSignedIn" class="hover:cursor-pointer hover:text-gray-500" @click="logout()">
            Logout
        </div>
    </div>
</template>