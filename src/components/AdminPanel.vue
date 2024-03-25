<script setup>
import UserRegistrationBox from '@/components/UserRegistrationBox.vue'
import allUsersBox from '@/components/allUsersBox.vue'
</script>

<template>
    <div class="text-3xl text-center">Admin Panel</div>
    <div class="flex flex-wrap gap-8 justify-center w-full h-full my-4 p-4 border-t-2">
        <UserRegistrationBox />
        <allUsersBox/>
    </div>
</template>@/components/AllUsersBox.vue