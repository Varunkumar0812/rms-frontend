<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import router from "../router";

const email = ref("");
const password = ref("");
const invalidUser = ref(false);

const allClear = () => {
    email.value = "";
    password.value = "";
}

const handleLogin = async () => {
    try {
        const userData = (await axios.post("http://127.0.0.1:3333/login", { email: email.value, password: password.value })).data;
        console.log(userData);

        if (userData) {
            invalidUser.value = false;
            localStorage.setItem("token", userData.token);
            localStorage.setItem("username", userData.username);
            localStorage.setItem("user_id", userData.user_id);
            router.push("/reviews");
        }
    }
    catch (err) {
        invalidUser.value = true;
        allClear();
    }

}

</script>

<template>
    <div class="min-h-screen flex justify-center items-center bg-gradient-to-r from-sky-600 to-cyan-400 px-10">
        <form @submit.prevent="handleLogin()"
            class="bg-white flex justify-center flex-wrap w-full lg:w-1/3 rounded-md shadow-xl p-10">
            <div class="w-full text-3xl font-bold mb-10 text-center">Sign In</div>
            <div class="w-full">
                <v-text-field v-model="email" label="Email Address" type="email" required></v-text-field>
            </div>
            <div class="w-full">
                <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
            </div>
            <div class="my-3 w-full text-center">Doesn't have an account ? <a href="/signup"
                    class="underline text-lime-600">Sign Up</a>
            </div>
            <div class="text-sm text-red-500 my-3 text-center">
                <div v-show="invalidUser">Invalid Email Address or Password</div>
            </div>
            <div class="w-full my-3 flex justify-center">
                <v-btn color="green w-full" size="large" type="submit">Login</v-btn>
            </div>
        </form>
    </div>
</template>

<style scoped></style>