<script setup lang="ts">
import { useReviewStore } from "../stores/reviewStore";
import { computed, ref, watch, onMounted, reactive } from "vue";
import ReviewComponent from "@/components/ReviewComponent.vue";
import router from "../router";

const store = useReviewStore();

// All ref variables for Filtering feature
const typeSelect = ref();
const ratingSelect = ref();
const sortSelect = ref();
const orderSelect = ref();

// To disable orderBy option unless sorting is selected
const orderDisabled = ref(true);

// Select tag value for filtering options
const typeColumn = ref(['University Review', 'Food Review', 'Hotel Review', 'Product Review', 'Travel Review']);
const ratingColumn = ref([1, 2, 3, 4, 5]);
const sortColumn = ref(['title', 'type', 'rating']);

// The query params that needs to be passed 
const searchQuery = ref("");

// To clear the filter options when searching
const allClear = () => {
    typeSelect.value = null;
    ratingSelect.value = null;
    sortSelect.value = null;
    orderSelect.value = null;
}

// Function to create the query string when performing filtering
const createQuery = () => {
    let query = "?";

    if (typeSelect.value) query += "type=" + typeSelect.value + "&"
    if (ratingSelect.value) query += "rating=" + ratingSelect.value + "&"
    if (sortSelect.value) query += "sortBy=" + sortSelect.value + "&"
    if (orderSelect.value) query += "sortOrder=" + orderSelect.value + "&"
    query = query.replace(" ", "%20");

    return query;
}

let reviews = ref(store.reviews);

// Fetching Initial Data on Page load
onMounted(async () => {
    await store.fetchReviews("");
})

watch(() => store.reviews, () => {
    reviews.value = store.reviews;
})

// Sorting and Filtering
watch([typeSelect, ratingSelect, sortSelect, orderSelect], async () => {
    orderDisabled.value = !(sortSelect.value != null);
    await store.fetchReviews(createQuery());
})

// Searching 
watch(searchQuery, () => {
    allClear();

    reviews.value = store.reviews;

    const new_reviews = reviews.value.filter((ele) => {
        if (JSON.stringify(Object.values
            (ele).join("")).toLowerCase().includes(searchQuery.value.toLowerCase())) {
            console.log(JSON.stringify(ele).toLowerCase());
            console.log(searchQuery.value.toLowerCase());

            return true
        };
    });

    reviews.value = new_reviews;
});

</script>

<template>
    <div class="bg-lime-300 min-h-screen">
        <form @submit.prevent="">
            <v-card-text class="bg-zinc-300">
                <v-text-field density="compact" label="Search" variant="solo" hide-details single-line
                    v-model="searchQuery" append-inner-icon="mdi-magnify">
                </v-text-field>
            </v-card-text>
        </form>
        <div class="p-5 bg-white rounded-sm shadow-lg flex flex-col sm:flex-row justify-between items-center">
            <div class="w-full sm:w-1/4 flex p-1 sm:p-0">
                <div class="text-base sm:text-xl sm:mx-5 mx-2 pt-2">Type</div>
                <v-select v-model="typeSelect" label="Select a type" variant="solo" hide-details :items="typeColumn"
                    density="compact" single-line></v-select>
            </div>
            <div class="w-full sm:w-1/4 flex p-1 sm:p-0">
                <div class="text-base sm:text-xl sm:mx-5 mx-2 pt-2">Ratings</div>
                <v-select v-model="ratingSelect" label="Select a type" variant="solo" hide-details :items="ratingColumn"
                    density="compact" single-line></v-select>
            </div>
            <div class="w-full sm:w-1/4 flex p-1 sm:p-0">
                <div class="text-base sm:text-xl sm:mx-5 mx-2 pt-2">Sort By</div>
                <v-select v-model="sortSelect" label="Select a type" variant="solo" hide-details :items="sortColumn"
                    density="compact" single-line></v-select>
            </div>
            <div class="w-full sm:w-1/5 flex justify-center items-center">
                <v-radio-group :disabled="orderDisabled" v-model="orderSelect" single-line inline hide-details>
                    <v-radio label="A-Z" value="desc"></v-radio>
                    <v-radio label="Z-A" value="asc"></v-radio>
                </v-radio-group>
            </div>
        </div>
        <div class="p-3 sm:p-10">
            <div
                class="text-2xl w-full text-center font-semibold py-5 flex justify-between px-5 flex items-center flex-wrap">
                <div class="text-base sm:text-2xl py-2">Here's a collection of all reviews</div>
                <div>
                    <v-btn @click="router.push('/dashboard')" color="blue" class="text-capitalize">My Dashboard <i
                            class="pi pi-user ml-2" /></v-btn>
                </div>
            </div>
            <div class="italic text-zinc-400 text-center" v-if="reviews.length == 0">No reviews available !</div>
            <div v-for="x in reviews" class="p-1">
                <ReviewComponent :data="x" class="hover:scale-[1.01] transition ease-in-out" />
            </div>
        </div>
    </div>
</template>

<style scoped></style>