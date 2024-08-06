<script setup lang="ts">
import { useReviewStore } from "../stores/reviewStore.ts";
import { ref, defineEmits } from "vue";
import router from "../router";
import { inject } from "vue";

const emit = defineEmits(['send-data']);

const data = inject("filler_data", { title: "", type: "", rating: 0, pros: "", cons: "", suggestions: "", user_id: "" })

const title = ref(data.title);
const type = ref(data.type);
const rating = ref(data.rating);
const pros = ref(data.pros);
const cons = ref(data.cons);
const suggestions = ref(data.suggestions);
const user_id = localStorage.getItem("user_id");

const store = useReviewStore();

const sendData = () => {
    emit("send-data", {
        title,
        type,
        rating,
        pros,
        cons,
        suggestions,
        user_id
    })
}

</script>

<template>
    <form @submit.prevent="sendData()" class="bg-white w-full p-10 rounded-lg shadow-xl">
        <div class="p-2 overflow-y-scroll">
            <div class="text-2xl font-bold text-center w-full mb-10">
                Write a Review
            </div>
            <div>
                <v-text-field v-model="title" label="Review Title" type="text" required></v-text-field>
            </div>
            <div>
                <v-select v-model="type" label="Review type"
                    :items="['University Review', 'Food Review', 'Hotel Review', 'Product Review', 'Travel Review']"></v-select>
            </div>
            <div>
                <v-select v-model="rating" label="Rating" :items="[1, 2, 3, 4, 5]"></v-select>
            </div>
            <div>
                <v-text-field v-model="pros" label="Pros" type="text" required></v-text-field>
            </div>
            <div>
                <v-text-field v-model="cons" label="Cons" type="text" required></v-text-field>
            </div>
            <div>
                <v-text-field v-model="suggestions" label="Suggestions" type="text" required></v-text-field>
            </div>
            <div class="w-full">
                <v-btn type="submit" color="green" class="w-full my-10">Submit</v-btn>
            </div>
        </div>
    </form>


</template>

<style scoped></style>