<script setup>
import { ref } from 'vue'
import * as firebaseAuth from "firebase/auth";
import firebase from '@/firebase'
import { db } from '@/firebase'
import { ref as fbref, onValue } from 'firebase/database'

const allUsers = ref()

onValue(fbref(db, '/users'), (snapshot) => {
    allUsers.value = snapshot.val();
})

</script>

<template>
    <div class="w-96 h-96 p-4 border rounded-lg bg-white text-black font-semibold">
        <li v-for="(user, key) in allUsers" :key="user.id">
            {{ key }} {{ user }}
        </li>
    </div>
</template> 