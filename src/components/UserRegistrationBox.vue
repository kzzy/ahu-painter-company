<script setup>
import { ref } from 'vue'
import axios from 'axios'

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

// Creates a new user (Authentication and Database)
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

    const newUserid = ref(null)
    // Creates new auth user
    try {
        const endpoint = import.meta.env.VITE_API_BASE_URL + "authuser/create"
        const authUserObj = {
            email: email,
            password: password
        }

        const res = await axios.put(endpoint, authUserObj)
        newUserid.value = res.data.message;
        console.log("Created new user with user id:", newUserid.value)
    } catch (err) {
        console.log("Failed to create a new user in Firebase Auth:", err)
        responseMessage.value = userCreationResponseMap['ErrorCreating']
        return
    }

    // Creates corresponding user entry in the database
    if(newUserid.value != null) {
        try {
            const endpoint = import.meta.env.VITE_API_BASE_URL + "user/create"
            const dbUserObj = {
                userID: newUserid.value,
                name: displayName,
                email: email,
                role: role
            }

            await axios.put(endpoint, dbUserObj)
            console.log("Created database entry for corresponding user id:", newUserid.value)
        } catch (err) {
            responseMessage.value = userCreationResponseMap['ErrorCreating']
            console.log("Failed to create a new user in the database:", err)
            return
        }
    }

    responseMessage.value = userCreationResponseMap['Success']
    clearRefValues()
}

// Cleanup fields after successful operation to avoid multiple submittion
const clearRefValues = () => {
    email.value = ''
    password.value = ''
    newDisplayName.value = ''
    role.value = ''
}
</script>

<template>
    <div class="w-96 h-fit p-4 border rounded-lg bg-white text-black font-semibold">
        <h1 class="text-2xl mb-4">New User Creation</h1>
        <div class="flex flex-col gap-2">
            <div>Email</div>
            <input id="email" v-model="email" autocomplete="off" class="pl-1 border border-black rounded-md"/>
            <div>Password</div>
            <input id="password" v-model="password" autocomplete="off" class="pl-1 border border-black rounded-md"/>
            <div>Display Name</div>
            <input id="username" v-model="newDisplayName" autocomplete="off" class="pl-1 border border-black rounded-md"/>
            <div>Role</div>
            <select id="role" v-model="role" class="pl-1 border border-black rounded-md">
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