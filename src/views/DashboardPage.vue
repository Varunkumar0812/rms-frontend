<script setup lang="ts">
import ReviewComponent from "@/components/ReviewComponent.vue";
import CreationForm from "../components/CreationPage.vue";
import { useReviewStore } from "../stores/reviewStore";
import router from "../router";
import axios from 'axios';
import { watch, computed, ref } from "vue";

const store = useReviewStore();

// Fetching the reviews of current user
const reviews = computed(() => store.reviews);

const username = ref();
const showDialog = ref(false);
const updateReviews = ref(false);
const showMessageAlert = ref({ mes: "", code: "red" });

// To re-fetch reviews every time a review is added, deleted and updated
watch([updateReviews, showMessageAlert], async () => {
    await store.fetchUserReviews();
    username.value = localStorage.getItem("username");
}, { immediate: true });

// To show alert message after every CRUD operation
const handleAlert = (mes: any, code: any) => {
    showMessageAlert.value = { mes, code };
    setTimeout(() => { showMessageAlert.value = { mes: "", code: "red" }; }, 2000)
}

// Function to handle new review creation
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
        handleAlert("Review Submitted Successfully !!", "green");
    }
    catch (err: any) {
        showDialog.value = false;
        handleAlert("There occured an error !!", "red");
    }
}

// Function to handle logout
const handleLogout = async () => {
    const res = await axios.post("http://127.0.0.1:3333/logout");
    localStorage.clear();
    router.push("/")
}

// Function to trigger alert after Edit and Delete operation performed
const triggerAlert = async (res: any) => {
    if (res.status) handleAlert(`Review ${res.mes} Sucessfully !!`, "green");
    else handleAlert("There occured an error !!", "red");
    updateReviews.value = true;
}

</script>

<template>
    <div class="bg-yellow-300 min-h-screen">

        <!-- Nav Bar -->
        <div
            class="z-10 bg-slate-200 shadow-xl text-lg sm:text-2xl w-full text-center font-semibold p-5 flex flex-wrap sm:flex-nowrap items-center justify-between">
            <div class="text-xl py-2">Welcome back, {{ username }} </div>

            <!-- Tool Bar -->
            <div class="flex flex-col sm:block justify-center items-center w-full sm:w-auto">
                <v-toolbar-items class="flex flex-wrap">

                    <!-- Redirection to the list of all reviews page -->
                    <v-btn variant="plain" color="purple" class="text-capitalize m-1" @click="router.push('/reviews')">
                        View All Reviews</v-btn>

                    <!-- Add a new review button along with the Modal Component -->
                    <v-dialog v-model="showDialog" transition="dialog-top-transition" class="w-full md:w-1/2">
                        <template v-slot:activator="{ props: activatorProps }">
                            <v-btn variant="plain" color="green" v-bind="activatorProps"
                                class="text-capitalize ml-2 m-1">Submit a Review<i class="pi pi-plus ml-2" /></v-btn>
                        </template>
                        <template v-slot:default="{ isActive }">
                            <CreationForm @send-data="handleCreate" />
                        </template>
                    </v-dialog>

                    <!-- Alert Message to show result of CRUD operation -->
                    <div v-show="showMessageAlert.mes" class="fixed z-10 top-8 right-0 left-0 flex justify-center">
                        <div class="`sticky w-1/4 text-white text-base font-normal p-5 rounded-lg shadow-lg
                            flex justify-between items-center`" :class="`bg-${showMessageAlert.code}-500`">
                            <div>{{ showMessageAlert.mes }}</div>
                            <i class="pi pi-check-circle"></i>
                        </div>
                    </div>

                    <!-- LogOut Button -->
                    <v-btn variant="plain" @click="handleLogout()" color="red" class="text-capitalize mx-2 m-1">
                        Log Out<i class="pi pi-sign-out ml-2" /></v-btn>
                </v-toolbar-items>
            </div>
        </div>

        <!-- Container for the list of reviews -->
        <div class="p-3 sm:p-10">

            <!-- Message if the reviews are empty -->
            <div class="italic text-zinc-400 text-center mt-10" v-if="reviews.length == 0">No reviews available !</div>

            <!-- Renders the list of reviews as cards -->
            <div v-for="x in reviews" class="p-1">
                <ReviewComponent @alert-mess="triggerAlert" :data="x"
                    class="hover:scale-[1.01] transition ease-in-out" />
            </div>
        </div>
    </div>
</template>

<style scoped></style>