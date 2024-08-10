<script setup lang="ts">
import CreationForm from "./CreationPage.vue";
import { useReviewStore } from "../stores/reviewStore";
import router from "../router";
import { ref, provide } from "vue";

const store = useReviewStore();
const showDialog = ref(false);
const deleteConfirm = ref(false);

// Emit an alert message after every edit and delete
const emit = defineEmits(["alert-mess"]);

// Receiving props from the Parent component
const props = defineProps({
    data: {
        type: Object,
        required: true
    }
});

// Providing filler data to edit component
provide("filler_data", props.data);

// To enable edit and delete option on each review component
const isDashboard = router.currentRoute.value.fullPath === '/dashboard';

// Function to handle deletion of every component
const handleDelete = async (id: any) => {
    try {
        const res = await store.deleteReview(id);
        deleteConfirm.value = false;
        emit('alert-mess', { mes: "Deleted", status: true });
    }
    catch (err) {
        deleteConfirm.value = false;
        emit("alert-mess", { mes: "Deleted", status: false });
    }
}

// Function to handle updation of every component
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
        const res = await store.editReview(reviewData, props.data.id);
        showDialog.value = false;
        emit("alert-mess", { mes: "Edited", status: true });
    }
    catch (err) {
        showDialog.value = false;
        emit("alert-mess", { mes: "Edited", status: false });
    }
}

</script>

<template>
    <div class="p-3 sm:p-5 bg-white rounded-md shadow-xl">

        <!-- 1st Line - Review Title, Type and Rating -->
        <div class="flex justify-between">

            <!-- On the left - Review Title and Type as a tag -->
            <div class="text-lg sm:text-xl font-semibold">{{ data.title }}
                <v-chip color="blue" variant="flat" size="x-small">{{ data.type }}</v-chip>
            </div>

            <!-- On the right - Review Rating rendered as stars -->
            <div class="text-sm md:text-xl">
                <i class="pi pi-star-fill p-1 text-yellow-500"
                    v-for="y of Array.from({ length: data.rating }).keys()"></i>
                <i class="pi pi-star p-1 text-zinc-400" v-for="y of Array.from({ length: 5 - data.rating }).keys()"></i>
            </div>
        </div>

        <!-- Optional Line - Show author of Review only in All Reviews page -->
        <div v-show="!isDashboard" class="text-zinc-500 italic">- {{ data.user.username }}</div>

        <!-- 2nd Line - Pros of Review -->
        <div>
            <div class="text-green-500 font-semibold">Pros</div>{{ data.pros }}
        </div>

        <!-- 3rd Line - Cons of Review -->
        <div>
            <div class="text-red-500 font-semibold">Cons</div>{{ data.cons }}
        </div>

        <!-- 4th Line - Review Suggestion and Edit, Delete Buttons -->
        <div class="flex flex-col sm:flex-row sm:justify-between">

            <!-- On the left - Review Suggestions -->
            <div class="text-zinc-500">Suggestions : {{ data.suggestions }}</div>

            <!-- On the right - Review Edit and Delete Button -->
            <div class="flex justify-end">

                <!-- Review Edit button along with Creation Modal -->
                <v-dialog v-model="showDialog" transition="dialog-top-transition" class="w-full md:w-1/2">
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn v-show="isDashboard" color="green" v-bind="activatorProps" size="small" class="mx-2"
                            @click=""><i class="pi pi-pencil"></i>
                        </v-btn>
                    </template>
                    <template v-slot:default="{ isActive }">
                        <CreationForm @send-data="handleEdit" />
                    </template>
                </v-dialog>

                <!-- Review Delete button along with Confirmation Modal -->
                <v-dialog v-model="deleteConfirm" transition="dialog-top-transition" class="w-full md:w-1/3">
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn @click="" v-bind="activatorProps" v-show="isDashboard" size="small" color="red"><i
                                class="pi pi-trash"></i></v-btn>
                    </template>
                    <template v-slot:default="{ isActive }">
                        <div
                            class="bg-white shadow-xl rounded-lg w-full p-10 flex flex-col items-center justify-center">
                            <div>Are you sure you want to delete ?</div>
                            <div class="mt-5 flex w-1/2 justify-between">
                                <v-btn color="green" class="mx-1 w-1/2" @click="handleDelete(data.id)">Yes</v-btn>
                                <v-btn color=red class="mx-1 w-1/2" @click="deleteConfirm = false">No</v-btn>
                            </div>
                        </div>
                    </template>
                </v-dialog>
            </div>
        </div>
    </div>
</template>

<style scoped></style>