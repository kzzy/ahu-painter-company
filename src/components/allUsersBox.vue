<script setup>
import { ref } from 'vue'
import { db } from '@/firebase'
import { ref as fbref, onValue } from 'firebase/database'
import axios from 'axios'

const allUsers = ref()
const focusedUser = ref(false)
const focusedUserKey = ref()
const focusedUserName = ref()
const focusedUserEmail = ref()
const focusedUserRole = ref()
const roleBackgroundColorMap = {
    "Reader": "bg-green-300",
    "Painter": "bg-red-300",
    "Admin": "bg-blue-300"
}

onValue(fbref(db, '/users'), (snapshot) => {
    allUsers.value = snapshot.val();
})

// Update values if admin selects a user
const selectFocusedUser = (userKey, userObj) => {
    focusedUser.value = true
    focusedUserKey.value = userKey
    focusedUserName.value = userObj.name
    focusedUserEmail.value = userObj.email
    focusedUserRole.value = userObj.role
}

// Update user settings (name/role) by calling the backend API
const updateUserSettings = async (userKey, email, displayName, role) => {
    try {
        const endpoint = import.meta.env.VITE_API_BASE_URL + "user/" + userKey
        const obj = {
            email: email,
            name: displayName,
            role: role
        }
        await axios.patch(endpoint, obj)
    } catch (err) {
        console.error("Failed to update user settings:", err)
    }
}

// Complete deletion of the user from Authentication and Database
const deleteUser = async (userKey) => {
    const obj = {
        userID: userKey
    }

    // Delete from Firebase Auth Users
    try {
        const endpoint = import.meta.env.VITE_API_BASE_URL + "authuser/delete"
        await axios.delete(endpoint, { data: obj})
        //console.log("Sucessfully deleted user from Firebase Auth users")
    } catch (err) {
        console.error("Failed to delete user from Firebase Auth users")
        return
    }

    // Delete from users database
    try {
        const endpoint = import.meta.env.VITE_API_BASE_URL + "user/delete"
        await axios.delete(endpoint, {data: obj})
        //console.log("Sucessfully deleted user from users database")
    } catch (err) {
        console.error("Failed to delete user from database")
    }
    focusedUser.value = false
}
</script>

<template>
    <div class="w-96 h-[500px] p-4 border rounded-lg bg-white text-black font-semibold overflow-auto">
        <div class="p-4 flex justify-between font-medium text-xl">
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
        </div>
        <div v-for="(user, key) in allUsers" :key="key" class="border-r border-y border-black">
            <div class="flex justify-between p-4 border-black border-l-4 hover:cursor-pointer hover:bg-opacity-50" :class="roleBackgroundColorMap[user.role]" @click="selectFocusedUser(key, user)">
                <span>{{ user.name }}</span>
                <span>{{ user.email }}</span>
                <span>{{ user.role }}</span>
            </div>
        </div>
        <div v-if="focusedUser" class="flex flex-col w-full h-40 mt-4 p-4 bg-gray-400 rounded-md">
            <div class="flex p-2">
                <div class="">
                    <div>Name</div>
                    <input name="usersListName" v-model="focusedUserName" class="pl-1 border border-black rounded-md w-32 outline-none" />
                </div>
                <div class="ml-auto">
                    <div>Role</div>
                    <select name="usersListRole" v-model="focusedUserRole" class="pl-1 border border-black rounded-md w-32 outline-none">
                        <option>Reader</option>
                        <option>Painter</option>
                        <option>Admin</option>
                    </select>
                </div>
            </div>
            <div class="px-2">
                <div>Email</div>
                <input name="usersListEmail" v-model="focusedUserEmail" class="pl-1 border border-black rounded-md w-64 outline-none" disabled="true"/>
            </div>
            <div class="flex font-semibold">
                <div class="p-2 hover:cursor-pointer hover:text-white" @click="updateUserSettings(focusedUserKey, focusedUserEmail, focusedUserName, focusedUserRole)">Save</div>
                <div class="p-2 hover:cursor-pointer hover:text-white" @click="focusedUser = false">Cancel</div>
                <div class="p-2 ml-auto hover:cursor-pointer hover:text-white" @click="deleteUser(focusedUserKey)">Delete</div>
            </div>
        </div>
    </div>
</template> 