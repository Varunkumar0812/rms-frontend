<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import router from "../router";

const username = ref("");
const email = ref("");
const password = ref("");
const con_password = ref("");

const dupError = ref(false);
const passError = ref(false);

const allClear = () => {
    username.value = "";
    email.value = "";
    password.value = "";
    con_password.value = "";
}

const handleRegister = async () => {
    if (password.value !== con_password.value) {
        return passError.value = password.value !== con_password.value ? true : false;
        console.log(passError.value);
    }


    if (password.value && email.value && username.value) {
        try {
            const userData = (await axios.post("http://127.0.0.1:3333/register", { email: email.value, username: username.value, password: password.value })).data;
            console.log(userData);

            dupError.value = false;
            passError.value = false;

            localStorage.setItem("token", userData.token);
            localStorage.setItem("username", username.value);
            localStorage.setItem("user_id", userData.user_id);
            router.push("/reviews")
        }
        catch (err) {
            console.log(err);
            if (err.response.data.errno === 1062) {
                dupError.value = true;

            }
            allClear();
        }
    }
}


</script>

<template>

    <div class="min-h-screen flex justify-center items-center bg-gradient-to-r from-sky-600 to-cyan-400 px-10">
        <form @submit.prevent="handleRegister()"
            class="bg-white flex justify-center flex-wrap w-full lg:w-1/3 rounded-md shadow-xl p-10">
            <div class="w-full text-3xl font-bold mb-10 text-center">Sign Up</div>
            <div class="w-full">
                <v-text-field v-model="username" label="Username" required></v-text-field>
            </div>
            <div class="w-full">
                <v-text-field v-model="email" label="Email Address" required></v-text-field>
            </div>
            <div class="w-full">
                <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
            </div>
            <div class="w-full">
                <v-text-field v-model="con_password" label="Confirm Password" type="password" required></v-text-field>
            </div>
            <div class="my-3 w-full text-center">Already have an account ? <a href="/signin"
                    class="underline text-lime-600">Sign
                    In</a>
            </div>
            <div class="text-sm text-red-500 my-3 text-center">
                <div v-show="dupError">Username / Email already exists</div>
                <div v-show="passError">Passwords don't match</div>
            </div>
            <div class="w-full my-3 flex justify-center">
                <v-btn color="green w-full" size="large" type="submit">Register</v-btn>
            </div>
        </form>
    </div>
</template>

<style scoped></style>