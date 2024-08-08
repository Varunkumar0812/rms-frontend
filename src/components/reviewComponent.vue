<script setup lang="ts">
import { useReviewStore } from "../stores/reviewStore";
import { ref, provide } from "vue";
import CreationForm from "./CreationPage.vue";
import router from "../router";

const store = useReviewStore();
const showDialog = ref(false);

// Receiving props from the Parent component
const props = defineProps({
    data: {
        type: Object,
        required: true
    }
});

// Providing filler data to edit component
provide("filler_data", props.data);

const isDashboard = router.currentRoute.value.fullPath === '/dashboard';

const handleDelete = async (id: any) => {
    await store.deleteReview(id);
    window.location.reload();
}

const handleEdit = async ({ title, type, rating, pros, cons, suggestions, user_id }: any) => {
    if (rating.value <= 0 || rating.value >= 6) {
        return alert("Enter a proper rating value")
    }

    const reviewData = {
        title: title.value,
        type: type.value,
        rating: rating.value,
        pros: pros.value,
        cons: cons.value,
        suggestions: suggestions.value,
        user_id: user_id
    }

    try {
        await store.editReview(reviewData, props.data.id);
        alert("Review Updated Sucessfully !!");
        showDialog.value = false;
        window.location.reload();
        router.push("/dashboard");
    }
    catch (err) {

    }
}

</script>

<template>
    <div class="p-5 bg-white rounded-md shadow-xl">
        <div class="flex justify-between">
            <div class="text-xl font-semibold">{{ data.title }}
                <v-chip color="blue" variant="flat" size="x-small">{{ data.type
                    }}</v-chip>
            </div>
            <div>
                <i class="pi pi-star-fill p-1 text-yellow-500"
                    v-for="y of Array.from({ length: data.rating }).keys()"></i><i class="pi pi-star p-1 text-zinc-400"
                    v-for="y of Array.from({ length: 5 - data.rating }).keys()"></i>
            </div>
        </div>
        <div v-show="!isDashboard" class="text-zinc-500 italic">- {{ data.user.username }}</div>
        <div>
            <div class="text-green-500 font-semibold">Pros</div>
            {{ data.pros }}
        </div>
        <div>
            <div class="text-red-500 font-semibold">Cons</div>{{ data.cons }}
        </div>
        <div class="flex justify-between">
            <div class="text-zinc-500">Suggestions : {{ data.suggestions }}</div>
            <div>
                <v-dialog v-model="showDialog" transition="dialog-top-transition" class="w-1/2">
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn v-show="isDashboard" color="green" v-bind="activatorProps" size="small" class="mx-2"
                            @click=""><i class="pi pi-pencil"></i>
                        </v-btn>
                    </template>
                    <template v-slot:default="{ isActive }">
                        <CreationForm @send-data="handleEdit" />
                    </template>
                </v-dialog>
                <v-btn @click="handleDelete(data.id)" v-show="isDashboard" size="small" color="red"><i
                        class="pi pi-trash"></i></v-btn>
            </div>
        </div>
    </div>
</template>

<style scoped></style>