<script setup lang="ts">
import { useReviewStore } from "../stores/reviewStore.ts";
import { watchEffect, computed, ref, watch } from "vue";
import ReviewComponent from "@/components/reviewComponent.vue";
import router from "../router";

const typeSelect = ref("");
const ratingSelect = ref("");
const searchQuery = ref("");

const store = useReviewStore();
let reviews = computed(() => store.reviews);

const username = ref("");

watchEffect(async () => {
    await store.fetchReviews();
    username.value = localStorage.getItem("username");
})

watch([typeSelect, ratingSelect], () => {
    reviews = computed(() => store.reviews);

    const new_reviews = reviews.value.filter((ele) => {
        console.log(typeof ele.rating, typeof ratingSelect.value);
        let res = true;

        if (typeSelect.value != "") {
            res = res && ele.type === typeSelect.value;
        }
        if (ratingSelect.value != "") {
            res = res && Number(ele.rating) === ratingSelect.value;
        }
        return res;
    });

    console.log(new_reviews);

    reviews = computed(() => new_reviews)
})

watch(searchQuery, () => {
    reviews = computed(() => store.reviews);

    const new_reviews = reviews.value.filter((ele) => {
        if (JSON.stringify(ele).toLowerCase().includes(searchQuery.value)) return true;
    });

    console.log(new_reviews);

    reviews = computed(() => new_reviews);
});

</script>

<template>
    <div class="p-10 bg-lime-300 min-h-screen">
        <form @submit.prevent="handleSearch()">
            <v-text-field :loading="loading" density="compact" label="Search templates" variant="solo" hide-details
                single-line @click:append-inner="onClick" v-model="searchQuery"></v-text-field>
        </form>
        <div class="bg-white m-5 p-5 rounded-sm shadow-lg flex justify-center items-center">
            <div class="text-xl mx-5">Type</div>
            <div class="w-1/2">
                <v-select v-model="typeSelect" label="Select a type" variant="solo"
                    :items="['University Review', 'Food Review', 'Hotel Review', 'Product Review', 'Travel Review']"></v-select>
            </div>
            <div class="mx-5 text-xl">Ratings</div>
            <div class="w-1/3">
                <v-select v-model="ratingSelect" label="Select a type" variant="solo"
                    :items="[1, 2, 3, 4, 5]"></v-select>
            </div>
        </div>
        <div class="text-2xl w-full text-center font-semibold py-5 flex justify-between px-5">
            Here's a collection of all reviews
            <div>
                <v-btn @click="router.push('/dashboard')" color="blue" class="text-capitalize">My Dashboard</v-btn>
            </div>
        </div>
        <div class="italic text-zinc-400 text-center" v-if="reviews.length == 0">No reviews available !</div>
        <div v-for="x in reviews" class="p-1">
            <ReviewComponent :data="x" />
        </div>
    </div>
</template>

<style scoped></style>