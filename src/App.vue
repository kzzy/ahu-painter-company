<script setup>
import AccountBar from '@/components/AccountBar.vue'
import { RouterView } from 'vue-router'

</script>

<template>
  <AccountBar />
  <h1 class="text-4xl font-light my-8">🖌️ A Paint Company</h1>
  <header>
    <RouterView/>
  </header>
</template>

<style scoped>
</style>
