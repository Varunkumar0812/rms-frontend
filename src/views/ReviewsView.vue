<script setup lang="ts">
import ReviewComponent from "@/components/ReviewComponent.vue";
import { useReviewStore } from "../stores/reviewStore";
import router from "../router";
import { ref, watch, onMounted } from "vue";

const store = useReviewStore();

// All ref variables for Filtering feature
const typeSelect = ref();
const ratingSelect = ref();
const sortSelect = ref();
const orderSelect = ref();
const selectedPage = ref(1);
const length = ref(0);

// To disable orderBy option unless sorting is selected
const orderDisabled = ref(true);

// Select tag value for filtering options
const typeColumn = ref(['University Review', 'Food Review', 'Hotel Review', 'Product Review', 'Travel Review']);
const ratingColumn = ref([1, 2, 3, 4, 5]);
const sortColumn = ref(['title', 'type', 'rating']);

// To render the list of filter input tags using v-for
const filterItems = ref([
    {
        title: "Type",
        items: typeColumn,
        modelVar: typeSelect
    }, {
        title: "Rating",
        items: ratingColumn,
        modelVar: ratingSelect
    }, {
        title: "Sort By",
        items: sortColumn,
        modelVar: sortSelect
    }]);

// The query params that needs to be passed 
const searchQuery = ref("");

// To clear the filter options when searching
const allClear = () => {
    typeSelect.value = null;
    ratingSelect.value = null;
    sortSelect.value = null;
    orderSelect.value = null;
    searchQuery.value = "";
    selectedPage.value = 1;
}

// Function to create the query string when performing filtering
const createQuery = () => {
    let query = "?page=" + selectedPage.value + "&";

    if (typeSelect.value) query += "type=" + typeSelect.value + "&"
    if (ratingSelect.value) query += "rating=" + ratingSelect.value + "&"
    if (sortSelect.value) query += "sortBy=" + sortSelect.value + "&"
    if (orderSelect.value) query += "sortOrder=" + orderSelect.value + "&"
    if (searchQuery.value) query += "searchFor=" + searchQuery.value + "&"

    return query.replace(" ", "%20");
}

let reviews = ref(store.reviews);

// Setting the number of pages based on the length of reviews
onMounted(async () => {
    length.value = Math.ceil(await store.fetchReviews("?page=1") / 2);
})

// Update the reviews whenever a new review added, deleted or updated
watch(() => store.reviews, () => {
    reviews.value = store.reviews;
})

// Filtering, Sorting and Searching
watch([typeSelect, ratingSelect, sortSelect, orderSelect, searchQuery, selectedPage], async (newValues, old) => {
    orderDisabled.value = !(sortSelect.value != null);
    if (JSON.stringify([typeSelect.value, ratingSelect.value, sortSelect.value, orderSelect.value, searchQuery.value]) !== JSON.stringify(old.slice(0, 5))) selectedPage.value = 1;
    length.value = Math.ceil(await store.fetchReviews(createQuery()) / 2);
});

</script>

<template>
    <div class="bg-lime-300 min-h-screen flex flex-col flex-wrap justify-between items-between">

        <div class="w-full">
            <!-- The Search Bar -->
            <form @submit.prevent="" class="w-full p-5 bg-zinc-300">
                <v-text-field density="compact" label="Search" variant="solo" hide-details single-line
                    v-model="searchQuery" append-inner-icon="mdi-magnify">
                </v-text-field>
            </form>

            <!-- The Filtering Bar - Type, Rating, Sorting, Sorting Order -->
            <div class="w-full p-5 bg-white shadow-lg flex flex-col sm:flex-row justify-between items-center">

                <!-- Filtering Options Selection Input -->
                <div v-for="x in filterItems" class="w-full sm:w-1/4 flex p-1 sm:p-0">
                    <div class="text-base sm:text-xl sm:mx-5 mx-2 pt-2">{{ x.title }}</div>
                    <v-select v-model="x.modelVar" label="Select a type" variant="solo" hide-details :items="x.items"
                        density="compact" single-line></v-select>
                </div>

                <!-- Sort Order Selection Input -->
                <div class="w-full sm:w-1/6 flex justify-center items-center">
                    <v-radio-group :disabled="orderDisabled" v-model="orderSelect" single-line inline hide-details>
                        <v-radio label="A-Z" value="asc"></v-radio>
                        <v-radio label="Z-A" value="desc"></v-radio>
                    </v-radio-group>
                </div>

                <!-- Option to clear all the selection -->
                <div class="w-full sm:w-1/12 flex justify-center items-center">
                    <v-btn @click="() => allClear()" variant="tonal" color="red"
                        class="text-capitalize flex items-center">
                        <div>Clear Filter</div><i class="pi pi-times-circle ml-2" />
                    </v-btn>
                </div>
            </div>

            <!-- The component that displays the list of reviews -->
            <div class="p-3 sm:p-10 w-full">

                <!-- Link to Your Dashboard -->
                <div class="text-2xl w-full text-center font-semibold p-5 flex flex-wrap justify-between items-center">
                    <div class="text-base sm:text-2xl py-2">Here's a collection of all reviews</div>
                    <div>
                        <v-btn @click="router.push('/dashboard')" color="blue" class="text-capitalize">
                            My Dashboard
                            <i class="pi pi-user ml-2" />
                        </v-btn>
                    </div>
                </div>

                <!-- Message if the reviews are empty -->
                <div class="italic text-zinc-400 text-center" v-if="reviews.length == 0">No reviews available !</div>

                <!-- Renders the list of reviews as cards -->
                <div v-for="x in reviews" class="p-1">
                    <ReviewComponent :data="x" class="hover:scale-[1.01] transition ease-in-out" />
                </div>
            </div>
        </div>

        <!-- The Footer - Pagination Box -->
        <div class="w-full bg-white p-2 ">
            <v-pagination :length="length" v-model="selectedPage"></v-pagination>
        </div>
    </div>
</template>

<style scoped></style>