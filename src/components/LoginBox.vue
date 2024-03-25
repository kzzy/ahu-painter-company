<script setup>
import { ref } from 'vue'
import * as firebaseAuth from "firebase/auth";
import { auth } from '@/firebase'

const email = ref('')
const password = ref('')
const responseMessage = ref('')
const loginErrorMap = ({ 
    "WrongCredentials": "❗ Incorrect Email or Password",
    "EmptyEmail": "❗ Please fill in your email",
    "EmptyPassword": "❗ Please fill in your password",
    "EmptyEmailAndPassword": "❗ Please fill in your credentials"
})

// Clientside Firebase User Authentication
async function login() {

    // Preliminary input length checks
    if(email.value.length == 0 && password.value.length == 0) {
        responseMessage.value = loginErrorMap["EmptyEmailAndPassword"]
        return
    } else if(email.value.length == 0) {
        responseMessage.value = loginErrorMap["EmptyEmail"]
        return
    } else if(password.value.length == 0) {
        responseMessage.value = loginErrorMap["EmptyPassword"]
        return
    }

    await firebaseAuth.signInWithEmailAndPassword(auth, email.value, password.value).catch((err) => {
        console.error(err)
        responseMessage.value = loginErrorMap["WrongCredentials"]
    })
}
</script>

<template>
    <div class="absolute right-2 px-4 pt-4 mt-2 w-60 h-60 rounded-lg bg-blue-300 text-xl text-black drop-shadow-xl">
        <div class="mb-3">
            <h3 class="mb-1 text-2xl font-semibold">Email</h3>
            <input v-model="email" placeholder="Employee Email" class="pl-1 w-full outline-none rounded-md text-lg font-normal"/>
        </div>
        <div class="mb-3">
            <h3 class="mb-1 text-2xl font-semibold">Password</h3>
            <input v-model="password" placeholder="Password" class="pl-1 w-full outline-none rounded-md text-lg font-normal"/>
        </div>
        <div class="mb-3 h-6 w-full font-bold text-sm text-red-600"> 
            {{ responseMessage }}
        </div>
        <div class="w-fit h-fit px-1.5 relative rounded-lg font-medium hover:cursor-pointer hover:bg-blue-400" @click="login()">
            Login
        </div>
    </div>
</template>