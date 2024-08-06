<script setup lang="ts">
import router from "../router";
</script>

<template>
    <div class="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-green-700 to-lime-600">
        <div class="w-1/3 flex justify-center flex-wrap">
            <div class="w-full text-center text-5xl font-bold text-white">
                Review Management System
            </div>
            <div class="text-center text-white my-10">
                Our Review Management System is designed to streamline the process of collecting, managing, and
                analyzing reviews across different categories. Whether you want to gather feedback on general matters,
                travel experiences, food establishments, or products, our platform provides a unified solution for all
                your review needs.
            </div>
            <div class="w-full flex justify-center p-10">
                <v-btn color="red" size="x-large" rounded="xl" class="text-capitalize"
                    @click="router.push('/signin')">Sign In</v-btn>
                <v-btn color="blue" size="x-large" rounded="xl" class="text-capitalize ml-5"
                    @click="router.push('/signup')">Sign Up</v-btn>
            </div>
        </div>
    </div>
</template>

<style scoped></style>