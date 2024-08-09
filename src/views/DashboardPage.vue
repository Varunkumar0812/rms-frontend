<script setup lang="ts">
import { useReviewStore } from "../stores/reviewStore";
import { watch, computed, ref } from "vue";
import ReviewComponent from "@/components/ReviewComponent.vue";
import CreationForm from "../components/CreationPage.vue";
import router from "../router";
import axios from 'axios';

const store = useReviewStore();
const reviews = computed(() => store.reviews);

const username = ref();
const showDialog = ref(false);
const updateReviews = ref(false);
const overlay = ref(false);
const showMessageAlert = ref(false);

watch([updateReviews], async () => {
    await store.fetchUserReviews();
    username.value = localStorage.getItem("username");
}, { immediate: true });

const handleCreate = async ({ title, type, rating, pros, cons, suggestions, user_id }: any) => {
    if (rating.value <= 0 || rating.value >= 6) {
        return alert("Enter a proper rating value")
    }

    const data = {
        title: title.value,
        type: type.value,
        rating: rating.value,
        pros: pros.value,
        cons: cons.value,
        suggestions: suggestions.value,
        userId: user_id
    }

    try {
        await store.createReview(data);
        showDialog.value = false;
        updateReviews.value = true;
        showMessageAlert.value = true;
        setTimeout(() => {
            showMessageAlert.value = false;
        }, 2000)
    }
    catch (err: any) {
    }
}

const handleLogout = async () => {
    const res = await axios.post("http://127.0.0.1:3333/logout");
    localStorage.clear();
    router.push("/")
}

</script>

<template>
    <div class="bg-yellow-300 min-h-screen">
        <div
            class="z-10 bg-slate-200 shadow-xl text-lg sm:text-2xl w-full text-center font-semibold py-5 flex flex-wrap sm:flex-nowrap items-center justify-between px-5">
            <div class="text-xl py-2">Welcome back, {{ username }}
            </div>
            <div class="flex flex-col sm:block justify-center items-center w-full sm:w-auto">
                <v-toolbar-items class="flex flex-wrap">
                    <v-btn variant="plain" color="purple" class="text-capitalize m-1" @click="router.push('/reviews')">
                        View
                        All
                        Reviews</v-btn>
                    <v-dialog v-model="showDialog" transition="dialog-top-transition" class="w-full md:w-1/2">
                        <template v-slot:activator="{ props: activatorProps }">
                            <v-btn variant="plain" color="green" v-bind="activatorProps"
                                class="text-capitalize ml-2 m-1">Submit a
                                Review<i class="pi pi-plus ml-2" /></v-btn>
                        </template>
                        <template v-slot:default="{ isActive }">
                            <CreationForm @send-data="handleCreate" />
                        </template>
                    </v-dialog>
                    <div v-show="showMessageAlert" class="fixed z-10 top-8 right-0 left-0 flex justify-center">
                        <div
                            class="sticky w-1/5 bg-green-500 text-white text-base font-normal p-5 rounded-lg shadow-lg flex justify-between items-center">
                            Review
                            Created
                            Successfully !<i class="pi pi-check-circle font-bold"></i>
                        </div>
                    </div>
                    <v-btn variant="plain" @click="handleLogout()" color="red" class="text-capitalize mx-2 m-1">Log
                        Out<i class="pi pi-sign-out ml-2" /></v-btn>
                </v-toolbar-items>
            </div>
        </div>
        <div class="p-3 sm:p-10">
            <div class="italic text-zinc-400 text-center mt-10" v-if="reviews.length == 0">No reviews available !</div>
            <div v-for="x in reviews" class="p-1">
                <ReviewComponent :data="x" class="hover:scale-[1.01] transition ease-in-out" />
            </div>
        </div>
    </div>
</template>

<style scoped></style>