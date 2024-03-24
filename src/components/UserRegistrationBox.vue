<script setup>
import { ref } from 'vue'
import * as firebaseAuth from "firebase/auth";
import { auth, db } from '@/firebase'
import { ref as fbref, set } from 'firebase/database'

const email = ref('')
const password = ref('')
const newDisplayName = ref('')
const role = ref('')
const responseMessage = ref('')

const userCreationResponseMap = ({ 
    "EmptyEmail": "❗ Please enter an email",
    "EmptyPassword": "❗ Please enter a password",
    "EmptyDisplayName": "❗ Please enter a display name",
    "EmptyRole": "❗ Please select a role to set user permissions",
    "ErrorCreating": "❗ Failed to create the user",
    "Success": "✔️ Successfully created the new user"
})

async function createUser(email, password, displayName, role) {
    // Preliminary input checks
    if(email.length == 0) {
        responseMessage.value = userCreationResponseMap['EmptyEmail']
        return
    }

    if(password.length == 0) {
        responseMessage.value = userCreationResponseMap['EmptyPassword']
        return
    }

    if(displayName.length == 0) {
        responseMessage.value = userCreationResponseMap['EmptyDisplayName']
        return
    }
    
    if(role.length == 0) {
        responseMessage.value = userCreationResponseMap['EmptyRole']
        return
    }


    await firebaseAuth.createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        console.log("Created new account with userid:", userCredential.user.uid)

        set(fbref(db, 'users/' + userCredential.user.uid), {
            email:email,
            name:displayName,
            role:role
        });

    }).catch((err) => {
        responseMessage.value = userCreationResponseMap['ErrorCreating']
        console.log("Signup error:", err)
    })
}

</script>

<template>
    <div class="w-80 h-fit p-4 border rounded-lg bg-white text-black font-semibold">
        <h1 class="text-2xl mb-4">New User Creation</h1>
        <div class="flex flex-col gap-2">
            <div>Email</div>
            <input v-model="email" placeholder="" class="pl-1 border border-black rounded-md"/>
            <div>Password</div>
            <input v-model="password" placeholder="" class="pl-1 border border-black rounded-md"/>
            <div>Display Name</div>
            <input v-model="newDisplayName" placeholder="" class="pl-1 border border-black rounded-md"/>
            <div>Role</div>
            <select v-model="role" class="pl-1 border border-black rounded-md">
                <option disabled value="">Please select a role</option>
                <option>Reader</option>
                <option>Painter</option>
                <option>Admin</option>
            </select>
            <div class="px-1 py-2 text-red-600"> {{ responseMessage }}</div>
            <div class="self-center text-lg hover:cursor-pointer hover:text-gray-500" @click="createUser(email, password, newDisplayName, role)">Submit</div>
        </div>
    </div>
</template>