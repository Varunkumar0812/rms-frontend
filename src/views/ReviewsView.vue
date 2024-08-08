<script setup lang="ts">
import { useReviewStore } from "../stores/reviewStore";
import { computed, ref, watch, onMounted } from "vue";
import ReviewComponent from "@/components/reviewComponent.vue";
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

let reviews = computed(() => store.reviews);

// Fetching Initial Data on Page load
onMounted(async () => {
    await store.fetchReviews("");
})

// Sorting and Filtering
watch([typeSelect, ratingSelect, sortSelect, orderSelect], async () => {
    orderDisabled.value = !(sortSelect.value != null);
    await store.fetchReviews(createQuery());
})

// Searching 
watch(searchQuery, () => {
    allClear();
    reviews = computed(() => store.reviews);

    const new_reviews = reviews.value.filter((ele) => {
        if (JSON.stringify(ele).toLowerCase().includes(searchQuery.value.toLowerCase())) return true;
    });

    reviews = computed(() => new_reviews);
});

</script>

<template>
    <div class="p-10 bg-lime-300 min-h-screen">
        <form @submit.prevent="">
            <v-text-field density="compact" label="Search" variant="solo" single-line
                v-model="searchQuery"></v-text-field>
        </form>
        <div class="m-5 p-1 bg-white rounded-sm shadow-lg flex justify-between items-center">
            <div class="w-1/4 flex">
                <div class="text-xl mx-5 pt-2">Type</div>
                <v-select v-model="typeSelect" label="Select a type" variant="solo" :items="typeColumn"
                    density="compact" single-line></v-select>
            </div>
            <div class="w-1/4 flex">
                <div class="mx-5 text-xl pt-2">Ratings</div>
                <v-select v-model="ratingSelect" label="Select a type" variant="solo" :items="ratingColumn"
                    density="compact" single-line></v-select>
            </div>
            <div class="w-1/4 flex">
                <div class="mx-5 text-xl pt-2">Sort By</div>
                <v-select v-model="sortSelect" label="Select a type" variant="solo" :items="sortColumn"
                    density="compact" single-line></v-select>
            </div>
            <div class="w-1/5 flex justify-center">
                <v-radio-group :disabled="orderDisabled" v-model="orderSelect" single-line>
                    <v-radio label="A-Z" value="ASC"></v-radio>
                    <v-radio label="Z-A" value="DESC"></v-radio>
                </v-radio-group>
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