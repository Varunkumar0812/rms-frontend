<script setup lang="ts">
import { useReviewStore } from "../stores/reviewStore.ts";
import { watchEffect, computed, ref } from "vue";
import ReviewComponent from "@/components/reviewComponent.vue";
import CreationForm from "./CreationPage.vue";
import router from "../router";

const store = useReviewStore();
const reviews = computed(() => store.reviews);

const username = ref("");
const showDialog = ref(false);

watchEffect(async () => {
    await store.fetchUserReviews();
    username.value = localStorage.getItem("username");
});


const handleCreate = async ({ title, type, rating, pros, cons, suggestions, user_id }) => {
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
        user_id: user_id
    }

    try {
        await store.createReview(data);
        alert("Review Submitted Sucessfully !!");
        showDialog.value = false;
        window.location.reload();
    }
    catch (err) {

    }
}


const handleLogout = () => {
    localStorage.clear();
    router.push("/")
}


</script>

<template>
    <div class="p-10 bg-yellow-300 min-h-screen">
        <div class="text-2xl w-full text-center font-semibold py-5 flex justify-between px-5">
            Welcome back, {{ username }}
            <div>
                <v-btn color="purple" class="text-capitalize" @click="router.push('/reviews')">View All Reviews</v-btn>
                <v-dialog v-model="showDialog" transition="dialog-top-transition" class="w-1/2">
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn color="green" v-bind="activatorProps" class="text-capitalize mx-2">Submit a
                            Review</v-btn>
                    </template>
                    <template v-slot:default="{ isActive }">
                        <CreationForm @send-data="handleCreate" />
                    </template>
                </v-dialog>
                <v-btn @click="handleLogout()" color="red" class="text-capitalize mx-2">Log Out</v-btn>
            </div>
        </div>
        <div class="italic text-zinc-400 text-center mt-10" v-if="reviews.length == 0">No reviews available !</div>
        <div v-for="x in reviews" class="p-1">
            <ReviewComponent :data="x" />
        </div>
    </div>
</template>

<style scoped></style>