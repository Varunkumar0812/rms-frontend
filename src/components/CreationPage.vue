<script setup lang="ts">
import { useReviewStore } from "../stores/reviewStore";
import { ref, defineEmits } from "vue";
import { inject } from "vue";

const emit = defineEmits(['send-data', 'cancel-option']);

// Filler data incase component used for Edit review option
const data = inject("filler_data", { title: "", type: "", rating: 1, pros: "", cons: "", suggestions: "", user_id: "" })

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
    <form @submit.prevent="sendData()" class="bg-white w-full p-3 sm:p-5 rounded-lg shadow-xl">
        <div class="p-2 overflow-y-scroll scroll-bar">
            <div class="text-2xl font-bold text-center w-full mb-5">
                Write a Review
            </div>
            <div>
                <v-text-field v-model="title" label="Review Title" type="text" required></v-text-field>
            </div>
            <div>
                <v-select v-model="type" label="Review type"
                    :items="['University Review', 'Food Review', 'Hotel Review', 'Product Review', 'Travel Review']"></v-select>
            </div>
            <div class="flex flex-wrap sm:flex-nowrap justify-center items-center mb-2 text-zinc-500">
                <div>Rating : </div>
                <v-rating v-model="rating" hover active-color="yellow" color="orange-lighten-1"></v-rating>
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
            <div class="w-full my-5 flex">
                <div class="w-1/2 p-2">
                    <v-btn color="red" @click="() => { emit('cancel-option', true) }" variant="tonal"
                        class="w-full">Cancel</v-btn>
                </div>
                <div class="w-1/2 p-2">
                    <v-btn type="submit" variant="outlined" color="green" class="w-full">Submit</v-btn>
                </div>
            </div>
        </div>
    </form>


</template>

<style scoped>
.scroll-bar::-webkit-scrollbar {
    width: 5px;
}

.scroll-bar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 100px;
}

.scroll-bar::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 100px;
}

.scroll-bar::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>