<script setup>
import { ref } from 'vue'
import { db } from '@/firebase'
import { ref as fbref, onValue, update } from 'firebase/database'
import { auth } from '@/firebase';

const allUsers = ref()
const focusedUser = ref(false)
const focusedUserKey = ref()
const focusedUserName = ref()
const focusedUserEmail = ref()
const focusedUserRole = ref()
const roleBackgroundColorMap = {
    "Reader": "bg-green-200",
    "Painter": "bg-red-200",
    "Admin": "bg-blue-200"
}


onValue(fbref(db, '/users'), (snapshot) => {
    allUsers.value = snapshot.val();
})

const selectFocusedUser = (userKey, userObj) => {
    focusedUser.value = true
    focusedUserKey.value = userKey
    focusedUserName.value = userObj.name
    focusedUserEmail.value = userObj.email
    focusedUserRole.value = userObj.role
}

const updateUserSettings = (userKey, email, displayName, role) => {
    auth.updateUser

    update(fbref(db, 'users/' + userKey), {
        email:email,
        name:displayName,
        role:role
    }).then(() => {
        console.log ("Successfully updated the data of the user on the table")
        focusedUser.value = false
    }).catch((err) => {
        console.log("Error on updating the user:", err)
    })
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
            <div class="flex justify-between p-4 border-black border-l-4 hover:cursor-pointer" :class="roleBackgroundColorMap[user.role]" @click="selectFocusedUser(key, user)">
                <span>{{ user.name }}</span>
                <span>{{ user.email }}</span>
                <span>{{ user.role }}</span>
            </div>
        </div>
        <div v-if="focusedUser" class="flex flex-col w-full h-40 mt-4 p-4 bg-gray-400 rounded-md">
            <div class="flex p-2">
                <div class="">
                    <div>Name</div>
                    <input v-model="focusedUserName" class="pl-1 border border-black rounded-md w-32 outline-none" />
                </div>
                <div class="ml-auto">
                    <div>Role</div>
                    <select v-model="focusedUserRole" class="pl-1 border border-black rounded-md w-32 outline-none">
                        <option>Reader</option>
                        <option>Painter</option>
                        <option>Admin</option>
                    </select>
                </div>
            </div>
            <div class="px-2">
                <div>Email</div>
                <input v-model="focusedUserEmail" class="pl-1 border border-black rounded-md w-64 outline-none" disabled="true"/>
            </div>
            <div class="flex font-semibold">
                <div class="p-2 hover:cursor-pointer hover:text-gray-800" @click="updateUserSettings(focusedUserKey, focusedUserEmail, focusedUserName, focusedUserRole)">Save</div>
                <div class="p-2 hover:cursor-pointer hover:text-gray-800" @click="focusedUser = false">Cancel</div>
                <div class="p-2 ml-auto hover:cursor-pointer hover:text-gray-800">Delete</div>
            </div>
        </div>
    </div>
</template> 